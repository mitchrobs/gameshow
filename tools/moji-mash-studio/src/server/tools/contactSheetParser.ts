import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Variant, Rubric } from '../../shared/types.js';

/**
 * Parse the contact sheet that scripts/generate_moji.py writes after a
 * `--check` run. Coupled to `_build_contact_sheet` in generate_moji.py.
 *
 * The HTML structure (one card per variant, sorted by composite descending):
 *
 *   <div ...card...>
 *     <img src="FILENAME.png" ...>
 *     <small ...>FILENAME.png[ ★]</small>
 *     <div ...>👁 word1, word2, word3</div>
 *     [<div ...>missing: word4</div>]
 *     <table ...>
 *       <tr><td ...>clarity</td><td>...<b>4</b></td></tr>
 *       <tr><td ...>style</td><td>...<b>3</b></td></tr>
 *       <tr><td ...>synergy</td><td>...<b>4</b></td></tr>
 *       <tr><td ...>aha</td><td>...<b>4</b></td></tr>
 *       <tr><td ...>playtest</td><td>...<b>3</b></td></tr>
 *     </table>
 *     <div ...>composite: 19.5/25</div>
 *     <div ...>🎮 playtest rank #N</div>
 *     <div ...>  1. word word ✓</div>
 *     <div ...>  2. word word</div>
 *     …
 *   </div>
 *
 * If a rubric cell is missing (Claude returned "?"), the <b> tag is absent
 * for that row and we leave that key undefined.
 *
 * Backward compatibility: pre-playtest contact sheets use the `guess` row
 * label (for the old `guessability` dimension) and omit the playtest guess
 * list. The parser reads those into `playtest_difficulty` so rankings
 * continue to sort correctly, with a null `playtest_rank`.
 */
export function parseContactSheet(stagedDirAbs: string, stagedDirRel: string): Variant[] {
  const htmlPath = join(stagedDirAbs, 'index.html');
  if (!existsSync(htmlPath)) return [];
  const html = readFileSync(htmlPath, 'utf8');

  // Each card region begins with `<img src="..."` and ends right before the
  // next image (or at end of body). Splitting on the image marker is more
  // robust than trying to balance nested <div>s.
  const parts = html.split('<img src="');
  const variants: Variant[] = [];

  for (let i = 1; i < parts.length; i++) {
    const region = parts[i];
    if (!region) continue;
    const fileMatch = region.match(/^([^"]+)"/);
    if (!fileMatch || !fileMatch[1]) continue;
    const file = fileMatch[1];
    if (!file.endsWith('.png')) continue;

    const recommended = region.includes(' ★');

    const compositeMatch = region.match(/composite:\s*(\d+(?:\.\d+)?)\s*\/\s*25/);
    const composite = compositeMatch && compositeMatch[1] ? parseFloat(compositeMatch[1]) : 0;

    const decodedMatch = region.match(/👁\s*([^<]+)</);
    const decoded = decodedMatch && decodedMatch[1]
      ? decodedMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const missingMatch = region.match(/missing:\s*([^<]+)</);
    const missing = missingMatch && missingMatch[1]
      ? missingMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    // Newer sheets emit `style` (style_fidelity); older sheets used `appeal`
    // (visual_appeal). Try the new label first, fall back to the old one so
    // we can still parse pre-Phase-B contact sheets without a rebuild.
    const styleFidelity =
      extractRubricValue(region, 'style') ?? extractRubricValue(region, 'appeal');

    // Newer sheets emit `playtest` (measured difficulty from Pass-3 playtest);
    // older sheets used `guess` (Claude's self-rated guessability, now dropped).
    // Fall back so we can still sort pre-playtest sheets by a comparable signal.
    const playtestDifficulty =
      extractRubricValue(region, 'playtest') ?? extractRubricValue(region, 'guess');

    const rubric: Rubric = {
      word_clarity: extractRubricValue(region, 'clarity'),
      style_fidelity: styleFidelity,
      concept_synergy: extractRubricValue(region, 'synergy'),
      aha_factor: extractRubricValue(region, 'aha'),
      playtest_difficulty: playtestDifficulty,
    };

    const { rank: playtestRank, guesses: playtestGuesses } = extractPlaytest(region);

    // Filename forms produced by scripts/generate_moji.py:
    //   <slug>-s<seed>.png         — fresh generation
    //   <slug>-s<seed>_<n>.png     — same seed, n-th variant
    //   <slug>-r<seed>.png         — refined / img2img output
    const seedMatch = file.match(/-[sr](\d+)(?:_\d+)?\.png$/);
    const seed = seedMatch && seedMatch[1] ? parseInt(seedMatch[1], 10) : 0;

    variants.push({
      file,
      stagedPath: `${stagedDirRel}/${file}`,
      seed,
      composite,
      rubric,
      decoded,
      missing,
      playtest_rank: playtestRank,
      playtest_guesses: playtestGuesses,
      recommended,
    });
  }

  // The HTML is already sorted by composite desc. Re-sort defensively in case
  // the user calls the parser on a sheet built without --check.
  variants.sort((a, b) => b.composite - a.composite);
  if (variants.length > 0 && !variants.some((v) => v.recommended)) {
    variants[0]!.recommended = true;
  }
  return variants;
}

function extractRubricValue(region: string, label: string): number | undefined {
  // Match the row for this label and pull the <b>N</b> from its second cell.
  // Pattern: <td ...>LABEL</td><td>(... possibly span ...) <b>N</b></td>
  const rowRe = new RegExp(
    `<td[^>]*>${label}</td>\\s*<td[^>]*>([^<]*(?:<span[^>]*>[^<]*</span>\\s*)?<b>(\\d)</b>)?[^<]*</td>`,
  );
  const m = region.match(rowRe);
  if (!m || !m[2]) return undefined;
  return parseInt(m[2], 10);
}

/**
 * Parse the playtest block that the script emits below the rubric table:
 *   <div>🎮 playtest rank #N</div>
 *   <div>  1. word word ✓</div>
 *   <div>  2. word word</div>
 *   …
 * Returns `rank: 0` when the answer wasn't in the top 5, or when the
 * contact sheet predates the playtest pass (in which case `guesses` is
 * also empty).
 */
function extractPlaytest(region: string): { rank: number; guesses: string[][] } {
  const rankMatch = region.match(/🎮[^<]*?rank\s*#(\d+)/);
  const rank = rankMatch && rankMatch[1] ? parseInt(rankMatch[1], 10) : 0;

  const guesses: string[][] = [];
  const guessRe = /<div[^>]*>\s*(\d+)\.\s+([^<✓]+?)(?:\s*✓)?\s*<\/div>/g;
  let m: RegExpExecArray | null;
  while ((m = guessRe.exec(region)) !== null) {
    const line = (m[2] ?? '').trim();
    if (!line) continue;
    const words = line
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .filter((w) => /^[a-z]+$/.test(w));
    if (words.length > 0) guesses.push(words);
    if (guesses.length >= 5) break;
  }
  return { rank, guesses };
}
