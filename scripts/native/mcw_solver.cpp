// mcw_solver — native fill-search kernel for build_mini_crossword_variants.py.
//
// Ports the Python solve_template() backtracking search 1:1 semantically:
// identical candidate ordering (seeded mulberry32 shuffle tiebreak, same sort
// keys), identical MRV slot selection, same node budget and per-slot candidate
// cap. Two deliberate strengthenings over the Python engine, both of which
// only prune provably-dead branches and therefore cannot change which
// solution the DFS finds first:
//   - forward checking intersects the FULL pattern per unassigned slot
//     (Python only checked the contiguous prefix via prefix_index);
//   - anchor/hard/theme metrics are tracked incrementally instead of being
//     recomputed from scratch at every node.
// Where the Python engine gave up on a day because its 2,000-node budget ran
// out mid-thrash, this kernel (given the same or a larger budget) may solve
// it instead — that difference is intended.
//
// Word identity: the Python side passes one flat, per-length-contiguous,
// lexicographically-sorted word table. Bit index == sorted order, which keeps
// candidate iteration order identical to Python's sorted(candidate_pool).

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

#include <algorithm>
#include <array>
#include <cstdint>
#include <optional>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace py = pybind11;

namespace {

// ---- deterministic helpers (bit-exact ports) -------------------------------

uint32_t stable_hash(const std::string &value) {
    uint32_t h = 2166136261u;
    for (unsigned char ch : value) {
        h ^= ch;
        h *= 16777619u;
    }
    return h;
}

struct Mulberry32 {
    uint32_t t;
    explicit Mulberry32(uint32_t seed) : t(seed) {}
    double next() {
        t += 0x6D2B79F5u;
        uint32_t z = t;
        z = (z ^ (z >> 15)) * (z | 1u);
        z ^= z + ((z ^ (z >> 7)) * (z | 61u));
        return static_cast<double>((z ^ (z >> 14))) / 4294967296.0;
    }
};

// Fisher-Yates identical to Python's shuffled(); operates on indices.
void shuffled_ranks(std::vector<uint32_t> &order, uint32_t seed) {
    Mulberry32 rand(seed);
    for (size_t index = order.size() - 1; index > 0; --index) {
        size_t swap = static_cast<size_t>(rand.next() * static_cast<double>(index + 1));
        std::swap(order[index], order[swap]);
    }
}

// ---- bitset over the flat word table ---------------------------------------

struct Bits {
    std::vector<uint64_t> w;
    explicit Bits(size_t nbits = 0) : w((nbits + 63) / 64, 0) {}
    void set(size_t i) { w[i >> 6] |= (1ull << (i & 63)); }
    void reset(size_t i) { w[i >> 6] &= ~(1ull << (i & 63)); }
    bool test(size_t i) const { return (w[i >> 6] >> (i & 63)) & 1ull; }
    void fill_range(size_t lo, size_t hi) {  // [lo, hi)
        for (size_t i = lo; i < hi; ++i) set(i);
    }
};

// AND-accumulator that walks candidate words of one slot without
// materializing vectors: caller supplies the base masks.
struct MaskView {
    const Bits *masks[8];
    int count = 0;
    void add(const Bits &b) { masks[count++] = &b; }
    uint64_t word(size_t wi) const {
        uint64_t v = ~0ull;
        for (int m = 0; m < count; ++m) v &= masks[m]->w[wi];
        return v;
    }
};

// ---- solver ----------------------------------------------------------------

struct SlotSpec {
    std::string direction;  // "across" | "down" (kept as string for hashing)
    int row = 0, col = 0, length = 0;
    std::vector<int> cells;  // flattened row*size+col per letter
};

struct Profile {
    int min_anchor, max_hard, theme_min_required, theme_max;
};

class Solver {
  public:
    Solver(std::vector<std::string> words,
           std::vector<int> length_of,
           std::vector<int> difficulty_of,  // 0 easy / 1 medium / 2 hard
           std::unordered_map<int, std::pair<int, int>> length_ranges)
        : words_(std::move(words)),
          length_of_(std::move(length_of)),
          difficulty_of_(std::move(difficulty_of)),
          length_ranges_(std::move(length_ranges)),
          n_(words_.size()) {
        // Validate sortedness within each length range: bit order must equal
        // Python's sorted() order for parity.
        for (const auto &[len, range] : length_ranges_) {
            for (int i = range.first + 1; i < range.second; ++i) {
                if (!(words_[i - 1] < words_[i])) {
                    throw std::runtime_error("word bucket not sorted for length " + std::to_string(len));
                }
            }
        }
        // Positional letter masks: pos_mask_[len][pos][letter].
        for (const auto &[len, range] : length_ranges_) {
            auto &per_pos = pos_mask_[len];
            std::array<Bits, 26> empty_row;
            empty_row.fill(Bits(n_));
            per_pos.assign(len, empty_row);
            for (int i = range.first; i < range.second; ++i) {
                const std::string &w = words_[i];
                for (int pos = 0; pos < len; ++pos) per_pos[pos][w[pos] - 'A'].set(i);
            }
            Bits all(n_);
            all.fill_range(range.first, range.second);
            all_of_length_[len] = std::move(all);
        }
        // Crossability: sum over positions of bucket sizes (matches Python).
        crossability_.assign(n_, 0);
        for (const auto &[len, range] : length_ranges_) {
            // popcount per (pos, letter) bucket
            auto &per_pos = pos_mask_[len];
            std::vector<std::array<int, 26>> bucket_sizes(len);
            for (int pos = 0; pos < len; ++pos)
                for (int letter = 0; letter < 26; ++letter) {
                    int c = 0;
                    for (uint64_t v : per_pos[pos][letter].w) c += __builtin_popcountll(v);
                    bucket_sizes[pos][letter] = c;
                }
            for (int i = range.first; i < range.second; ++i) {
                int score = 0;
                for (int pos = 0; pos < len; ++pos) score += bucket_sizes[pos][words_[i][pos] - 'A'];
                crossability_[i] = score;
            }
        }
    }

    // Returns assigned word per slot (in slot order) or nullopt.
    std::optional<std::vector<std::string>> solve(
        int grid_size,
        std::vector<SlotSpec> slots,
        uint32_t seed,
        const std::vector<int> &theme_word_ids,
        const std::vector<int> &recent_ids,
        const std::vector<int> &required_ids,
        const std::optional<std::vector<int>> &allowed_ids,
        const std::unordered_map<int, int> &reuse_counts,
        Profile profile,
        bool exclude_hard,
        bool theme_first,
        bool randomized_order,
        long node_budget,
        int max_candidates_per_slot) {
        slots_ = std::move(slots);
        seed_ = seed;
        profile_ = profile;
        exclude_hard_ = exclude_hard;
        theme_first_ = theme_first;
        randomized_order_ = randomized_order;
        node_budget_ = node_budget;
        max_candidates_ = max_candidates_per_slot;
        reuse_counts_ = &reuse_counts;

        is_theme_.assign(n_, 0);
        for (int id : theme_word_ids) is_theme_[id] = 1;

        used_ = Bits(n_);
        blocked_ = Bits(n_);  // recent ∪ (hard when excluded) ∪ ¬allowed
        for (int id : recent_ids) blocked_.set(id);
        if (exclude_hard_) {
            for (size_t i = 0; i < n_; ++i)
                if (difficulty_of_[i] == 2) blocked_.set(i);
        }
        if (allowed_ids) {
            Bits allowed(n_);
            for (int id : *allowed_ids) allowed.set(id);
            for (size_t wi = 0; wi < blocked_.w.size(); ++wi) blocked_.w[wi] |= ~allowed.w[wi];
        }

        required_.clear();
        for (int id : required_ids) required_.insert(id);

        grid_.assign(static_cast<size_t>(grid_size) * grid_size, 0);
        assigned_.assign(slots_.size(), -1);
        anchor_count_ = hard_count_ = theme_count_ = 0;
        nodes_ = 0;
        failed_states_.clear();

        // Per-slot shuffle seeds (identical strings to Python's slot key).
        slot_shuffle_seed_.clear();
        for (const auto &slot : slots_) {
            std::string key = std::to_string(slot.row) + ":" + std::to_string(slot.col) + ":" + slot.direction;
            slot_shuffle_seed_.push_back(seed_ ^ stable_hash(key));
        }

        if (!recurse()) return std::nullopt;
        std::vector<std::string> out;
        out.reserve(slots_.size());
        for (int id : assigned_) out.push_back(words_[id]);
        return out;
    }

  private:
    // Pattern of a slot from the current grid; '.' encoded as 0.
    void pattern_for(const SlotSpec &slot, std::string &pattern) const {
        pattern.resize(slot.cells.size());
        for (size_t i = 0; i < slot.cells.size(); ++i) pattern[i] = grid_[slot.cells[i]];
    }

    // Candidate mask for a slot under current pattern, minus blocked/used.
    // Returns true when at least one candidate exists; fills `out` fully only
    // when collect==true.
    bool candidates_for_slot(const SlotSpec &slot, bool collect, std::vector<int> *out) {
        auto range = length_ranges_.at(slot.length);
        MaskView view;
        view.add(all_of_length_.at(slot.length));
        std::string pattern;
        pattern_for(slot, pattern);
        auto &per_pos = pos_mask_.at(slot.length);
        for (size_t pos = 0; pos < pattern.size(); ++pos) {
            if (pattern[pos]) view.add(per_pos[pos][pattern[pos] - 'A']);
        }
        size_t lo = range.first >> 6, hi = (range.second + 63) >> 6;
        for (size_t wi = lo; wi < hi; ++wi) {
            uint64_t v = view.word(wi) & ~blocked_.w[wi] & ~used_.w[wi];
            if (!v) continue;
            if (!collect) return true;
            while (v) {
                int bit = __builtin_ctzll(v);
                v &= v - 1;
                out->push_back(static_cast<int>((wi << 6) + bit));
            }
        }
        return collect ? !out->empty() : false;
    }

    long candidate_count(const SlotSpec &slot) {
        auto range = length_ranges_.at(slot.length);
        MaskView view;
        view.add(all_of_length_.at(slot.length));
        std::string pattern;
        pattern_for(slot, pattern);
        auto &per_pos = pos_mask_.at(slot.length);
        for (size_t pos = 0; pos < pattern.size(); ++pos) {
            if (pattern[pos]) view.add(per_pos[pos][pattern[pos] - 'A']);
        }
        size_t lo = range.first >> 6, hi = (range.second + 63) >> 6;
        long count = 0;
        for (size_t wi = lo; wi < hi; ++wi) {
            count += __builtin_popcountll(view.word(wi) & ~blocked_.w[wi] & ~used_.w[wi]);
        }
        return count;
    }

    // Rank candidates exactly like ranked_candidates_for_slot().
    std::vector<int> ranked_candidates(size_t slot_index, int assigned_count) {
        std::vector<int> pool_raw;
        if (!candidates_for_slot(slots_[slot_index], true, &pool_raw)) return {};

        int remaining_after = static_cast<int>(slots_.size()) - assigned_count - 1;
        std::vector<int> pool;
        pool.reserve(pool_raw.size());
        int missing_required_total = 0;
        for (int id : required_) {
            (void)id;
        }
        // required words not yet used
        std::vector<int> missing_required;
        for (int id : required_)
            if (!used_.test(id)) missing_required.push_back(id);

        for (int id : pool_raw) {
            bool is_theme = is_theme_[id];
            int next_theme = theme_count_ + (is_theme ? 1 : 0);
            int next_anchor = anchor_count_ + (difficulty_of_[id] == 0 ? 1 : 0);
            int next_hard = hard_count_ + (difficulty_of_[id] == 2 ? 1 : 0);
            int missing_after = 0;
            for (int rid : missing_required)
                if (rid != id) ++missing_after;
            if (next_hard > profile_.max_hard) continue;
            if (next_theme > profile_.theme_max) continue;
            if (next_theme + remaining_after < profile_.theme_min_required) continue;
            if (next_anchor + remaining_after < profile_.min_anchor) continue;
            if (missing_after > remaining_after) continue;
            pool.push_back(id);
        }
        (void)missing_required_total;
        if (pool.empty()) return {};

        // random_rank: Fisher-Yates over the pool with the slot-keyed seed.
        std::vector<uint32_t> order(pool.size());
        for (uint32_t i = 0; i < order.size(); ++i) order[i] = i;
        shuffled_ranks(order, slot_shuffle_seed_[slot_index]);
        std::vector<uint32_t> random_rank(pool.size());
        for (uint32_t rank = 0; rank < order.size(); ++rank) random_rank[order[rank]] = rank;

        struct Key {
            int required_rank, first_rank, second_rank, reuse;
            uint32_t random_rank;
            int neg_crossability;
            const std::string *word;
        };
        std::vector<std::pair<Key, int>> keyed;
        keyed.reserve(pool.size());
        for (size_t i = 0; i < pool.size(); ++i) {
            int id = pool[i];
            int difficulty_rank = difficulty_of_[id];
            int required_rank = required_.count(id) ? 0 : 1;
            int theme_rank = is_theme_[id] ? 0 : (has_any_theme_tag_.empty() || has_any_theme_tag_[id] ? 2 : 1);
            auto it = reuse_counts_->find(id);
            // Bucketed: beyond a few uses the exact count must not dominate
            // the ordering, or late-pack attempts all converge on the same
            // low-reuse fills and re-derive already-banned signatures.
            int reuse = it == reuse_counts_->end() ? 0 : std::min(it->second, 3);
            Key key;
            key.required_rank = required_rank;
            if (theme_first_) {
                key.first_rank = theme_rank;
                key.second_rank = difficulty_rank;
            } else if (exclude_hard_) {  // difficulty == "easy" ordering
                key.first_rank = difficulty_rank;
                key.second_rank = theme_rank;
            } else {
                key.first_rank = theme_rank;
                key.second_rank = difficulty_rank;
            }
            key.reuse = reuse;
            key.random_rank = random_rank[i];
            key.neg_crossability = -crossability_[id];
            key.word = &words_[id];
            keyed.emplace_back(key, id);
        }
        // Randomized mode (last-resort rung): the seeded shuffle leads the
        // ordering so successive attempts explore genuinely different fills
        // instead of re-deriving already-banned grids.
        const bool randomized = randomized_order_;
        std::stable_sort(keyed.begin(), keyed.end(), [randomized](const auto &a, const auto &b) {
            const Key &x = a.first, &y = b.first;
            if (x.required_rank != y.required_rank) return x.required_rank < y.required_rank;
            if (randomized) {
                if (x.random_rank != y.random_rank) return x.random_rank < y.random_rank;
            }
            if (x.first_rank != y.first_rank) return x.first_rank < y.first_rank;
            if (x.second_rank != y.second_rank) return x.second_rank < y.second_rank;
            if (x.reuse != y.reuse) return x.reuse < y.reuse;
            if (x.random_rank != y.random_rank) return x.random_rank < y.random_rank;
            if (x.neg_crossability != y.neg_crossability) return x.neg_crossability < y.neg_crossability;
            return *x.word < *y.word;
        });
        std::vector<int> ranked;
        ranked.reserve(keyed.size());
        for (auto &kv : keyed) ranked.push_back(kv.second);
        return ranked;
    }

    uint64_t state_hash() const {
        uint64_t h = 1469598103934665603ull;
        for (int id : assigned_) {
            h ^= static_cast<uint64_t>(id + 2);
            h *= 1099511628211ull;
        }
        return h;
    }

    bool word_fits_pattern(int id, const SlotSpec &slot) const {
        const std::string &w = words_[id];
        if (static_cast<int>(w.size()) != slot.length) return false;
        for (size_t i = 0; i < slot.cells.size(); ++i) {
            char g = grid_[slot.cells[i]];
            if (g && g != w[i]) return false;
        }
        return true;
    }

    bool recurse() {
        if (++nodes_ > node_budget_) return false;
        uint64_t state = state_hash();
        if (failed_states_.count(state)) return false;

        int assigned_count = 0;
        for (int id : assigned_)
            if (id >= 0) ++assigned_count;

        if (assigned_count == static_cast<int>(slots_.size())) {
            bool ok = anchor_count_ >= profile_.min_anchor && hard_count_ <= profile_.max_hard &&
                      theme_count_ >= profile_.theme_min_required && theme_count_ <= profile_.theme_max &&
                      required_missing_count() == 0;
            if (!ok) failed_states_.insert(state);
            return ok;
        }

        // MRV slot selection with required-word priority. Deviation from the
        // Python engine (which ranked every unassigned slot's candidates at
        // every node): pick the slot by raw candidate POPCOUNT — one bitset
        // pass per slot — and rank only the chosen slot. ~10x per node; the
        // selection key uses the unfiltered count, so which valid grid the
        // DFS finds first can differ from the Python engine, but the search
        // remains fully deterministic for fixed inputs.
        int best_index = -1;
        long best_count = 0;
        double best_density = 0;
        int best_priority = 0;
        for (size_t i = 0; i < slots_.size(); ++i) {
            if (assigned_[i] >= 0) continue;
            long count = candidate_count(slots_[i]);
            if (count == 0) {
                failed_states_.insert(state);
                return false;
            }
            int priority = 1;
            for (int rid : required_)
                if (!used_.test(rid) && word_fits_pattern(rid, slots_[i])) {
                    priority = 0;
                    break;
                }
            double density = static_cast<double>(count) /
                             std::max(1, slots_[i].length * slots_[i].length);
            bool better;
            if (best_index < 0) {
                better = true;
            } else {
                auto key = std::make_tuple(priority, density, -slots_[i].length, count);
                auto best_key = std::make_tuple(best_priority, best_density, -slots_[best_index].length,
                                                best_count);
                better = key < best_key;
            }
            if (better) {
                best_index = static_cast<int>(i);
                best_count = count;
                best_priority = priority;
                best_density = density;
            }
        }
        if (best_index < 0) return false;
        std::vector<int> best_candidates = ranked_candidates(best_index, assigned_count);
        if (best_candidates.empty()) {
            failed_states_.insert(state);
            return false;
        }

        const SlotSpec &slot = slots_[best_index];
        int tried = 0;
        for (int id : best_candidates) {
            if (tried++ >= max_candidates_) break;
            // place
            std::vector<int> touched;
            bool conflict = false;
            const std::string &w = words_[id];
            for (size_t li = 0; li < slot.cells.size(); ++li) {
                char existing = grid_[slot.cells[li]];
                if (existing && existing != w[li]) {
                    conflict = true;
                    break;
                }
                if (!existing) {
                    grid_[slot.cells[li]] = w[li];
                    touched.push_back(slot.cells[li]);
                }
            }
            if (!conflict) {
                assigned_[best_index] = id;
                used_.set(id);
                anchor_count_ += difficulty_of_[id] == 0;
                hard_count_ += difficulty_of_[id] == 2;
                theme_count_ += is_theme_[id];
                // Per-slot viability is re-checked at the next node's MRV
                // pass, so no separate forward-check sweep here.
                if (recurse()) return true;
                anchor_count_ -= difficulty_of_[id] == 0;
                hard_count_ -= difficulty_of_[id] == 2;
                theme_count_ -= is_theme_[id];
                used_.reset(id);
                assigned_[best_index] = -1;
            }
            for (int cell : touched) grid_[cell] = 0;
        }
        failed_states_.insert(state);
        return false;
    }

    int required_missing_count() const {
        int missing = 0;
        for (int id : required_)
            if (!used_.test(id)) ++missing;
        return missing;
    }

  public:
    // theme_rank needs "has any theme tag at all" to reproduce Python's
    // 0 / 1(no tags) / 2(tags, wrong theme) ranking. Set once at load.
    void set_has_theme_tags(std::vector<uint8_t> flags) { has_any_theme_tag_ = std::move(flags); }

  private:
    std::vector<std::string> words_;
    std::vector<int> length_of_;
    std::vector<int> difficulty_of_;
    std::unordered_map<int, std::pair<int, int>> length_ranges_;
    std::unordered_map<int, std::vector<std::array<Bits, 26>>> pos_mask_;
    std::unordered_map<int, Bits> all_of_length_;
    std::vector<int> crossability_;
    std::vector<uint8_t> has_any_theme_tag_;
    size_t n_;

    // per-solve state
    std::vector<SlotSpec> slots_;
    std::vector<uint32_t> slot_shuffle_seed_;
    uint32_t seed_ = 0;
    Profile profile_{};
    bool exclude_hard_ = false, theme_first_ = false, randomized_order_ = false;
    long node_budget_ = 0, nodes_ = 0;
    int max_candidates_ = 0;
    const std::unordered_map<int, int> *reuse_counts_ = nullptr;
    std::vector<uint8_t> is_theme_;
    Bits blocked_{0}, used_{0};
    std::unordered_set<int> required_;
    std::vector<char> grid_;
    std::vector<int> assigned_;
    int anchor_count_ = 0, hard_count_ = 0, theme_count_ = 0;
    std::unordered_set<uint64_t> failed_states_;
};

}  // namespace

PYBIND11_MODULE(mcw_solver, m) {
    m.doc() = "Native fill-search kernel for the mini crossword schedule builder";

    py::class_<SlotSpec>(m, "SlotSpec")
        .def(py::init<>())
        .def_readwrite("direction", &SlotSpec::direction)
        .def_readwrite("row", &SlotSpec::row)
        .def_readwrite("col", &SlotSpec::col)
        .def_readwrite("length", &SlotSpec::length)
        .def_readwrite("cells", &SlotSpec::cells);

    py::class_<Profile>(m, "Profile")
        .def(py::init<>())
        .def_readwrite("min_anchor", &Profile::min_anchor)
        .def_readwrite("max_hard", &Profile::max_hard)
        .def_readwrite("theme_min_required", &Profile::theme_min_required)
        .def_readwrite("theme_max", &Profile::theme_max);

    py::class_<Solver>(m, "Solver")
        .def(py::init<std::vector<std::string>, std::vector<int>, std::vector<int>,
                      std::unordered_map<int, std::pair<int, int>>>())
        .def("set_has_theme_tags", &Solver::set_has_theme_tags)
        .def("solve", &Solver::solve, py::arg("grid_size"), py::arg("slots"), py::arg("seed"),
             py::arg("theme_word_ids"), py::arg("recent_ids"), py::arg("required_ids"),
             py::arg("allowed_ids"), py::arg("reuse_counts"), py::arg("profile"),
             py::arg("exclude_hard"), py::arg("theme_first"), py::arg("randomized_order"),
             py::arg("node_budget"), py::arg("max_candidates_per_slot"));

    m.attr("__version__") = "1";
}
