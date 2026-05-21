#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import {
  VARIANTS,
  buildVariantPack,
  runVariantPlaytest,
  solvePuzzle,
} from './src/variantLabCore.mjs';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith('--')) continue;
  const [key, value] = arg.slice(2).split('=');
  args.set(key, value ?? 'true');
}

const packSize = Number(args.get('pack-size') ?? 12);
const results = runVariantPlaytest({ packSize });
const failed = results.flatMap((variant) =>
  variant.audits
    .filter((audit) => !audit.solved)
    .map((audit) => `${variant.variantId}:${audit.puzzleId}`)
);

const payload = {
  generatedAt: new Date().toISOString(),
  packSize,
  variantCount: VARIANTS.length,
  failed,
  results,
};

if (args.has('json')) {
  writeFileSync(args.get('json'), JSON.stringify(payload, null, 2));
}

console.log(`Liberties variant lab playtest`);
console.log(`Variants: ${VARIANTS.length}`);
console.log(`Pack size per variant: ${packSize}`);
console.log(`Solved samples: ${results.reduce((sum, entry) => sum + entry.solvedCount, 0)}/${VARIANTS.length * packSize}`);
console.log('');

results.forEach((entry, index) => {
  console.log(
    `${String(index + 1).padStart(2)}. ${entry.name.padEnd(24)} ` +
      `score=${entry.averageScore.toFixed(1).padStart(5)} ` +
      `solved=${String(entry.solvedCount).padStart(2)}/${entry.packSize} ` +
      `moves=${entry.averageMoves.toFixed(1).padStart(4)} ` +
      `filler=${Math.round(entry.averageFillerRatio * 100).toString().padStart(2)}% ` +
      `shared=${entry.averageSharedMoves.toFixed(1).padStart(4)} ` +
      `responses=${entry.averageResponses.toFixed(1).padStart(4)} ` +
      `variance=${entry.dayToDayVariance.toFixed(1).padStart(4)}`
  );
});

console.log('');
console.log('Representative solved lines:');
for (const variant of VARIANTS) {
  const puzzle = buildVariantPack(variant.id, 1)[0];
  const solved = solvePuzzle(variant, puzzle);
  console.log(
    `${variant.shortName.padEnd(10)} ${puzzle.id}: ` +
      (solved.solved ? solved.solution.map((point) => `R${point.row + 1}C${point.col + 1}`).join(' ') : 'not solved')
  );
}

if (failed.length > 0) {
  console.error('');
  console.error(`Failed solved samples: ${failed.join(', ')}`);
  process.exitCode = 1;
}
