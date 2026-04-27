import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

type Manifest = {
  acceptedAssetDir: string;
  reviewRoot: string;
  directions: { id: string; title: string; guidance: string }[];
  variants: {
    index: number;
    id: string;
    label: string;
    filename: string;
    motif?: string;
    artSets?: {
      directionId: string;
      prompt: string;
      generatedSourcePath: string;
      reviewStatus: string;
    }[];
  }[];
};

const DEFAULT_MANIFEST = 'assets/dawn-cabinet/dawn-tiles/dawn-tile-prompts.json';
const DEFAULT_OUT = 'tmp/dawn-cabinet/dawn-art-gallery/index.html';

function parseArgs(argv: string[]) {
  const options = {
    manifest: DEFAULT_MANIFEST,
    out: DEFAULT_OUT,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--manifest') {
      options.manifest = argv[++index];
    } else if (arg === '--out') {
      options.out = argv[++index];
    } else if (!arg.startsWith('--')) {
      options.out = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function esc(value: string | undefined) {
  return (value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);
}

function imageData(path: string) {
  if (!existsSync(path)) {
    return undefined;
  }
  const bytes = readFileSync(path);
  return `data:image/png;base64,${bytes.toString('base64')}`;
}

function tileFace(src: string | undefined, label: string, pending = false) {
  return `
    <div class="tile-face ${pending ? 'pending' : ''}">
      <div class="tile-title">Dawn</div>
      ${
        src
          ? `<img src="${src}" alt="${esc(label)}" />`
          : `<div class="empty-mark">?</div>`
      }
      <div class="tile-rule"></div>
    </div>
  `;
}

function miniPreviews(src: string | undefined, label: string, pending = false) {
  return `
    <div class="sizes">
      <div class="chip">${src ? `<img src="${src}" alt="${esc(label)} chip" />` : '?'}</div>
      ${tileFace(src, label, pending)}
      <div class="tile-large">${tileFace(src, label, pending)}</div>
    </div>
  `;
}

function variantCard({
  src,
  variant,
  pending,
  prompt,
}: {
  src: string | undefined;
  variant: Manifest['variants'][number];
  pending?: boolean;
  prompt?: string;
}) {
  return `
    <article class="variant-card">
      <header>
        <span class="index">${String(variant.index + 1).padStart(2, '0')}</span>
        <h3>${esc(variant.label)}</h3>
      </header>
      ${miniPreviews(src, variant.label, pending)}
      <p class="motif">${esc(variant.motif || variant.id)}</p>
      ${pending ? `<p class="pending-note">Pending generated image</p>` : ''}
      ${prompt ? `<details><summary>Prompt</summary><p>${esc(prompt)}</p></details>` : ''}
    </article>
  `;
}

function sectionNav(manifest: Manifest) {
  const directionLinks = manifest.directions
    .map((direction) => `<a href="#${esc(direction.id)}">${esc(direction.title)}</a>`)
    .join('');
  return `
    <nav>
      <a href="#accepted">Accepted local set</a>
      ${directionLinks}
    </nav>
  `;
}

function acceptedSection(manifest: Manifest) {
  const cards = manifest.variants
    .map((variant) =>
      variantCard({
        src: imageData(join(manifest.acceptedAssetDir, variant.filename)),
        variant,
      })
    )
    .join('');
  return `
    <section id="accepted">
      <div class="section-heading">
        <p class="eyebrow">Current shipped fallback</p>
        <h2>Accepted local set</h2>
        <p>These are the PNG assets currently wired into Dawn Cabinet. The GPT Image 2 directions below will replace these only after review and acceptance.</p>
      </div>
      <div class="grid">${cards}</div>
    </section>
  `;
}

function directionSection(manifest: Manifest, direction: Manifest['directions'][number]) {
  let generatedCount = 0;
  const cards = manifest.variants
    .map((variant) => {
      const artSet = variant.artSets?.find((set) => set.directionId === direction.id);
      const generatedPath = artSet?.generatedSourcePath ?? join(manifest.reviewRoot, direction.id, variant.filename);
      const src = imageData(generatedPath);
      if (src) {
        generatedCount += 1;
      }
      return variantCard({
        src,
        variant,
        pending: !src,
        prompt: artSet?.prompt,
      });
    })
    .join('');
  return `
    <section id="${esc(direction.id)}">
      <div class="section-heading">
        <p class="eyebrow">GPT Image 2 direction · ${generatedCount}/20 generated</p>
        <h2>${esc(direction.title)}</h2>
        <p>${esc(direction.guidance)}</p>
        ${
          generatedCount === 0
            ? `<p class="callout">No generated PNGs for this direction yet. Run <code>npm run generate:dawn-art -- --directions ${esc(direction.id)} --force</code>, then refresh this page.</p>`
            : ''
        }
      </div>
      <div class="grid">${cards}</div>
    </section>
  `;
}

function render(manifest: Manifest) {
  const generatedTotals = manifest.directions.map((direction) => {
    const count = manifest.variants.filter((variant) => {
      const artSet = variant.artSets?.find((set) => set.directionId === direction.id);
      const path = artSet?.generatedSourcePath ?? join(manifest.reviewRoot, direction.id, variant.filename);
      return existsSync(path);
    }).length;
    return `${direction.title}: ${count}/20`;
  });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dawn Cabinet Dawn Tile Art Options</title>
  <style>
    :root {
      --bg: #0d1721;
      --panel: #172331;
      --panel-2: #203044;
      --line: #354557;
      --text: #fff7e8;
      --muted: #aab6c5;
      --soft: #fff2d2;
      --umber: #7a4511;
      --gold: #c8871f;
      --cinnabar: #c95d35;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at 24px 24px, rgba(200, 135, 31, .08), transparent 26px), var(--bg);
      color: var(--text);
      font-family: Avenir Next, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .page { width: min(1440px, calc(100% - 32px)); margin: 0 auto; padding: 42px 0 72px; }
    .hero { display: grid; gap: 14px; margin-bottom: 28px; }
    h1 { margin: 0; font-size: clamp(36px, 5vw, 68px); line-height: .95; letter-spacing: 0; }
    h2 { margin: 0; font-size: clamp(28px, 3vw, 44px); letter-spacing: 0; }
    h3 { margin: 0; font-size: 18px; letter-spacing: 0; }
    p { color: var(--muted); font-weight: 700; line-height: 1.45; margin: 0; }
    code { color: var(--text); background: rgba(255,255,255,.08); border: 1px solid var(--line); border-radius: 8px; padding: 2px 6px; }
    nav {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 12px 0 14px;
      margin: 0 0 34px;
      background: linear-gradient(180deg, var(--bg) 0%, rgba(13,23,33,.88) 100%);
      border-bottom: 1px solid rgba(200, 135, 31, .4);
    }
    nav a {
      flex: 0 0 auto;
      color: var(--text);
      text-decoration: none;
      border: 1px solid var(--line);
      background: var(--panel-2);
      border-radius: 999px;
      padding: 10px 14px;
      font-weight: 900;
    }
    section { margin: 0 0 58px; }
    .section-heading { display: grid; gap: 8px; margin: 0 0 18px; max-width: 960px; }
    .eyebrow { color: var(--gold); text-transform: uppercase; letter-spacing: .12em; font-size: 13px; }
    .callout {
      background: rgba(200, 135, 31, .12);
      border: 1px solid rgba(200, 135, 31, .45);
      border-radius: 12px;
      padding: 10px 12px;
      color: #f5d399;
    }
    .status-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 2px;
    }
    .status-strip span {
      border: 1px solid var(--line);
      background: rgba(255,255,255,.04);
      border-radius: 999px;
      padding: 7px 10px;
      color: var(--muted);
      font-weight: 900;
      font-size: 13px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
      gap: 14px;
    }
    .variant-card {
      min-width: 0;
      border: 1px solid var(--line);
      background: color-mix(in srgb, var(--panel) 94%, black);
      border-radius: 18px;
      padding: 14px;
      display: grid;
      gap: 12px;
    }
    .variant-card header { display: flex; align-items: baseline; gap: 9px; min-height: 42px; }
    .index { color: var(--gold); font-weight: 900; font-size: 13px; }
    .sizes { display: grid; grid-template-columns: 44px 58px 78px; gap: 12px; align-items: center; min-height: 100px; }
    .chip {
      width: 36px; height: 36px; border-radius: 18px;
      display: grid; place-items: center;
      background: #243245; border: 2px solid #5b6979; color: var(--muted); font-weight: 900;
    }
    .chip img { width: 22px; height: 22px; object-fit: contain; }
    .tile-face {
      width: 45px; height: 56px;
      border-radius: 7px;
      background: var(--soft);
      border: 2px solid var(--umber);
      display: grid;
      grid-template-rows: 12px 1fr 8px;
      align-items: center;
      justify-items: center;
      overflow: hidden;
      box-shadow: 0 2px 0 rgba(0,0,0,.16);
    }
    .tile-large .tile-face { width: 64px; height: 80px; border-radius: 9px; grid-template-rows: 16px 1fr 12px; }
    .tile-title { color: var(--umber); font-size: 7px; font-weight: 900; }
    .tile-large .tile-title { font-size: 9px; }
    .tile-face img { width: 31px; height: 31px; object-fit: contain; }
    .tile-large .tile-face img { width: 47px; height: 47px; }
    .tile-rule { width: 23px; height: 2px; border-radius: 2px; background: var(--gold); opacity: .72; }
    .empty-mark { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; border: 1px dashed rgba(122,69,17,.55); color: var(--umber); font-weight: 900; }
    .tile-face.pending { opacity: .58; filter: grayscale(.35); }
    .motif { font-size: 13px; min-height: 38px; }
    .pending-note { color: #f0bd75; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    details {
      border-top: 1px solid rgba(255,255,255,.08);
      padding-top: 10px;
      color: var(--muted);
    }
    summary { cursor: pointer; font-weight: 900; color: var(--text); }
    details p { margin-top: 8px; font-size: 12px; max-height: 180px; overflow: auto; }
    @media (max-width: 640px) {
      .page { width: min(100% - 20px, 1440px); padding-top: 24px; }
      .grid { grid-template-columns: 1fr; }
      .variant-card { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="hero">
      <h1>Dawn Tile Art Options</h1>
      <p>Review every Dawn tile at chip, compact board, and Cabinet sizes. Generated GPT Image 2 folders will appear here automatically once the live batch has been run.</p>
      <div class="status-strip">${generatedTotals.map((item) => `<span>${esc(item)}</span>`).join('')}</div>
    </div>
    ${sectionNav(manifest)}
    ${acceptedSection(manifest)}
    ${manifest.directions.map((direction) => directionSection(manifest, direction)).join('')}
  </main>
</body>
</html>`;
}

const options = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(readFileSync(options.manifest, 'utf-8')) as Manifest;
mkdirSync(dirname(options.out), { recursive: true });
writeFileSync(options.out, render(manifest));
console.log(options.out);
