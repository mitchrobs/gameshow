import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type VariantEntry = {
  filename: string;
  label: string;
};

type ContactSheetOptions = {
  outPath: string;
  assetDir: string;
  manifestPath: string;
  title: string;
  subtitle: string;
};

const DEFAULT_OUT_PATH = '/tmp/dawn-cabinet-dawn-art-assets.svg';
const DEFAULT_ASSET_DIR = 'assets/dawn-cabinet/dawn-tiles';
const DEFAULT_MANIFEST_PATH = 'assets/dawn-cabinet/dawn-tiles/dawn-tile-prompts.json';
const WIDTH = 1280;
const HEIGHT = 1500;
const COLUMN_COUNT = 4;

const fallbackVariants: VariantEntry[] = [
  ['dawn-00-plum-spray.png', 'Plum spray'],
  ['dawn-01-orchid-brush.png', 'Orchid brush'],
  ['dawn-02-chrysanthemum-crest.png', 'Chrysanthemum'],
  ['dawn-03-peony-bud.png', 'Peony bud'],
  ['dawn-04-camellia-branch.png', 'Camellia'],
  ['dawn-05-maple-leaf.png', 'Maple leaf'],
  ['dawn-06-willow-sprig.png', 'Willow sprig'],
  ['dawn-07-pine-bough.png', 'Pine bough'],
  ['dawn-08-snowflower.png', 'Snowflower'],
  ['dawn-09-spring-sprig.png', 'Spring sprig'],
  ['dawn-10-autumn-leaf.png', 'Autumn leaf'],
  ['dawn-11-winter-branch.png', 'Winter branch'],
  ['dawn-12-garden-gate.png', 'Garden gate'],
  ['dawn-13-mountain-pavilion.png', 'Pavilion'],
  ['dawn-14-folding-fan.png', 'Folding fan'],
  ['dawn-15-painted-scroll.png', 'Painted scroll'],
  ['dawn-16-bronze-mirror.png', 'Bronze mirror'],
  ['dawn-17-vermilion-tag.png', 'Vermilion tag'],
  ['dawn-18-paper-charm.png', 'Paper charm'],
  ['dawn-19-morning-aster.png', 'Morning aster'],
].map(([filename, label]) => ({ filename, label }));

function parseArgs(argv: string[]): ContactSheetOptions {
  const options: ContactSheetOptions = {
    outPath: DEFAULT_OUT_PATH,
    assetDir: DEFAULT_ASSET_DIR,
    manifestPath: DEFAULT_MANIFEST_PATH,
    title: 'Dawn Cabinet Premium Dawn Tile Assets',
    subtitle: 'Mahjong Bonus Panels shown at filter-chip, compact board, and Cabinet sizes.',
  };
  let positionalOutPath: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--asset-dir') {
      options.assetDir = argv[++index];
    } else if (arg === '--manifest') {
      options.manifestPath = argv[++index];
    } else if (arg === '--title') {
      options.title = argv[++index];
    } else if (arg === '--subtitle') {
      options.subtitle = argv[++index];
    } else if (arg === '--out') {
      options.outPath = argv[++index];
    } else if (!arg.startsWith('--') && positionalOutPath === undefined) {
      positionalOutPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (positionalOutPath) {
    options.outPath = positionalOutPath;
  }
  return options;
}

function variantsFromManifest(path: string): VariantEntry[] {
  if (!existsSync(path)) {
    return fallbackVariants;
  }
  const manifest = JSON.parse(readFileSync(path, 'utf-8'));
  if (!Array.isArray(manifest.variants)) {
    return fallbackVariants;
  }
  return manifest.variants.map((variant: { filename: string; label: string }) => ({
    filename: variant.filename,
    label: variant.label,
  }));
}

function esc(text: string) {
  return text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);
}

function assetData(assetDir: string, filename: string) {
  const path = join(assetDir, filename);
  if (!existsSync(path)) {
    throw new Error(`Missing Dawn tile asset: ${path}`);
  }
  const bytes = readFileSync(path);
  return `data:image/png;base64,${bytes.toString('base64')}`;
}

function tilePreview(data: string, x: number, y: number, scale: number, label = true) {
  const width = 64 * scale;
  const height = 80 * scale;
  const art = label ? 35 * scale : 47 * scale;
  const artX = x + (width - art) / 2;
  const artY = y + (label ? 20 * scale : 14 * scale);
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${8 * scale}" fill="#fff4d7" stroke="#7a4511" stroke-width="${1.8 * scale}"/>
      ${label ? `<text x="${x + width / 2}" y="${y + 13 * scale}" text-anchor="middle" fill="#7a4511" font-family="Avenir Next, Arial, sans-serif" font-size="${8 * scale}" font-weight="900">Dawn</text>` : ''}
      <image href="${data}" x="${artX}" y="${artY}" width="${art}" height="${art}" preserveAspectRatio="xMidYMid meet"/>
      <path d="M${x + 18 * scale} ${y + height - 10 * scale}H${x + width - 18 * scale}" stroke="#c8871f" stroke-width="${2 * scale}" stroke-linecap="round" opacity=".72"/>
    </g>
  `;
}

function chipPreview(data: string, x: number, y: number) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="36" height="36" rx="18" fill="#243245" stroke="#5b6979" stroke-width="2"/>
      <image href="${data}" x="${x + 7}" y="${y + 7}" width="22" height="22" preserveAspectRatio="xMidYMid meet"/>
    </g>
  `;
}

function card(assetDir: string, filename: string, label: string, index: number) {
  const col = index % COLUMN_COUNT;
  const row = Math.floor(index / COLUMN_COUNT);
  const x = 60 + col * 300;
  const y = 165 + row * 246;
  const data = assetData(assetDir, filename);
  return `
    <g transform="translate(${x},${y})">
      <rect width="224" height="190" rx="22" fill="#172331" stroke="#354557" stroke-width="2"/>
      <text x="112" y="30" text-anchor="middle" fill="#fff7e8" font-family="Avenir Next, Arial, sans-serif" font-size="18" font-weight="900">${esc(label)}</text>
      <text x="26" y="58" fill="#9faec0" font-family="Avenir Next, Arial, sans-serif" font-size="10" font-weight="900">CHIP</text>
      <text x="78" y="58" fill="#9faec0" font-family="Avenir Next, Arial, sans-serif" font-size="10" font-weight="900">BOARD</text>
      <text x="146" y="58" fill="#9faec0" font-family="Avenir Next, Arial, sans-serif" font-size="10" font-weight="900">CABINET</text>
      ${chipPreview(data, 28, 76)}
      ${tilePreview(data, 78, 69, 0.7)}
      ${tilePreview(data, 144, 55, 0.92)}
      <text x="112" y="171" text-anchor="middle" fill="#748498" font-family="Avenir Next, Arial, sans-serif" font-size="11">${esc(filename)}</text>
    </g>
  `;
}

const options = parseArgs(process.argv.slice(2));
const variants = variantsFromManifest(options.manifestPath);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0d1721"/>
  <text x="70" y="70" fill="#fff7e8" font-family="Avenir Next, Arial, sans-serif" font-size="42" font-weight="900">${esc(options.title)}</text>
  <text x="70" y="110" fill="#aeb9c7" font-family="Avenir Next, Arial, sans-serif" font-size="21" font-weight="700">${esc(options.subtitle)}</text>
  <path d="M70 132H1210" stroke="#c8871f" stroke-width="3" stroke-linecap="round" opacity=".72"/>
  ${variants.map(({ filename, label }, index) => card(options.assetDir, filename, label, index)).join('')}
</svg>`;

writeFileSync(options.outPath, svg);
console.log(options.outPath);
