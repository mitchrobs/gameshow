import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Variant, Rubric } from '../../shared/types.js';

/**
 * Parse the contact sheet that scripts/generate_moji.py writes after a
 * `--check` run. Coupled to `_build_contact_sheet` at scripts/generate_moji.py:305.
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
 *       <tr><td ...>appeal</td><td>...<b>3</b></td></tr>
 *       <tr><td ...>synergy</td><td>...<b>4</b></td></tr>
 *       <tr><td ...>guess</td><td>...<b>3</b></td></tr>
 *       <tr><td ...>aha</td><td>...<b>4</b></td></tr>
 *     </table>
 *     <div ...>composite: 19.5/25</div>
 *   </div>
 *
 * If a rubric cell is missing (Claude returned "?"), the <b> tag is absent
 * for that row and we leave that key undefined.
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

    // Optional rich description (Pass 1 sentence) — see _build_contact_sheet
    // in scripts/generate_moji.py. Marker is 💬 and content runs until the
    // next tag.
    const descMatch = region.match(/💬\s*([^<]+)</);
    const description = descMatch && descMatch[1]
      ? decodeBasicHtmlEntities(descMatch[1].trim())
      : undefined;

    const missingMatch = region.match(/missing:\s*([^<]+)</);
    const missing = missingMatch && missingMatch[1]
      ? missingMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const rubric: Rubric = {
      word_clarity: extractRubricValue(region, 'clarity'),
      visual_appeal: extractRubricValue(region, 'appeal'),
      concept_synergy: extractRubricValue(region, 'synergy'),
      guessability: extractRubricValue(region, 'guess'),
      aha_factor: extractRubricValue(region, 'aha'),
    };

    // `-s<seed>` for fresh generations, `-r<seed>` for img2img refinements.
    const seedMatch = file.match(/-[sr](\d+)\.png$/);
    const seed = seedMatch && seedMatch[1] ? parseInt(seedMatch[1], 10) : 0;

    variants.push({
      file,
      stagedPath: `${stagedDirRel}/${file}`,
      seed,
      composite,
      rubric,
      decoded,
      description,
      missing,
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

function decodeBasicHtmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
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
