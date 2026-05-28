# Museum Editor-Agent QA Audit

Date: 2026-05-25
Scope: Museum annual-pack data in `src/data/museum/curatedArtworks.json`, `src/data/museum/editorialBank.json`, `src/data/museum/schedule.json`, and editor-agent shards in `src/data/museum/editorialShards/`.

## Executive Status

The v1 editor-agent polish pass is merged into the generated runtime pack.

- Approved runtime artworks: 365
- Scheduled dates: 365
- Unique scheduled artwork IDs: 365
- Approval type: `editor-agent-v1` on all approved runtime records
- Fake seed approvals: 0
- Validation command: `npm run validate:museum`

## Source Mix

| Source | Approved |
|---|---:|
| Smithsonian | 124 |
| Art Institute of Chicago | 94 |
| The Met | 70 |
| National Gallery of Art | 44 |
| Rijksmuseum | 21 |
| Yale Center for British Art | 12 |

Gates met:

- No source exceeds 35% of the annual pack.
- Top two sources total 218/365, under the 60% cap.
- All six supported runtime sources are represented.

## Medium Mix

| Medium | Approved |
|---|---:|
| Photograph | 82 |
| Painting | 65 |
| Sculpture | 47 |
| Design | 38 |
| Textile | 29 |
| Drawing | 28 |
| Print | 26 |
| Ceramic | 19 |
| Metalwork | 16 |
| Glass | 13 |
| Furniture | 1 |
| Manuscript | 1 |

Gates met:

- Photograph target is met.
- Painting + Print + Drawing totals 119/365, under the 45% cap.
- No more than two consecutive works share the same medium category in the generated schedule.

## Copy And Quiz QA

Automated gates now enforce:

- 3 questions exactly per artwork.
- One question each for observation, context, and connection.
- 4 unique options per question.
- Valid answer index after deterministic option shuffling.
- No exact surprising fact repeated more than 3 times.
- At least 250 distinct surprising facts.
- No quiz prompt repeated more than 25 times.
- No reinforcement repeated more than 20 times.
- Context questions do not over-index on raw medium recall.
- Connection questions stay below the passport-label recall cap.

## Schedule QA

Gates met:

- Schedule starts `2026-04-23` and runs through `2027-04-22`.
- No date gaps.
- No repeated scheduled artwork IDs.
- No same-artist cooldown violations within 7 days.
- No more than 2 consecutive works from the same period, medium, source, or collection.
- Monthly Europe cap passes.
- Monthly major-region cap passes.

## Editor-Agent Shards

Repo-tracked shard files:

- `src/data/museum/editorialShards/art-mix-review.json` by Editor A
- `src/data/museum/editorialShards/copy-2026-q2.json` by Editor B1
- `src/data/museum/editorialShards/copy-2026-q3.json` by Editor B2
- `src/data/museum/editorialShards/copy-2026-q4.json` by Editor B3
- `src/data/museum/editorialShards/copy-2027-q1q2.json` by Editor B4

The generator requires the expected shard roster before approving runtime records, and writes merged approval metadata as `Editor Merge (...)`.

## Residual Risks

- This is editor-agent approval, not human curator approval.
- Facts are official-source anchored where possible, but several notes remain metadata-derived rather than source-essay-derived.
- Some labels remain broad, especially for unknown makers and wide date ranges.
- Furniture and manuscripts are still thin in the mix because open image candidates with complete metadata were limited in this pass.
