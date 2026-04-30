import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

type GameLink = {
  title: string;
  href: string;
  emoji: string;
  isNew?: boolean;
};

type GameSection = {
  title: string;
  href: string;
  kicker: string;
  category: 'word' | 'logic' | 'trivia';
  preview: PreviewKind;
  summary: string;
};

type PreviewKind =
  | 'museum'
  | 'moji'
  | 'wordie'
  | 'threadline'
  | 'crossword'
  | 'sudoku'
  | 'cabinet'
  | 'bridges'
  | 'ballpark'
  | 'daily-mix'
  | 'daily-sports'
  | 'barter'
  | 'whodunit';

const quickLinks: GameLink[] = [
  { title: 'Moji Mash', href: './moji-mash', emoji: '🧩' },
  { title: 'Wordie', href: './wordie', emoji: '🔤' },
  { title: 'Threadline', href: './threadline', emoji: '🧵', isNew: true },
  { title: 'Mini Crossword', href: './mini-crossword', emoji: '✍️', isNew: true },
  { title: 'Mini Sudoku', href: './sudoku', emoji: '🧠' },
  { title: 'Dawn Cabinet', href: './dawn-cabinet', emoji: '🀄', isNew: true },
  { title: 'Bridges', href: './bridges', emoji: '🏝️' },
  { title: 'Museum', href: './museum', emoji: '🖼️', isNew: true },
  { title: 'Whodunit', href: './whodunit', emoji: '🔍' },
  { title: 'Ballpark', href: './ballpark', emoji: '🎯', isNew: true },
  { title: 'Daily Mix', href: './daily-mix', emoji: '⚡' },
  { title: 'Daily Sports', href: './daily-sports', emoji: '🏅' },
  { title: 'Barter', href: './barter', emoji: '↔️', isNew: true },
];

const gameSections: GameSection[] = [
  {
    title: 'Museum',
    href: './museum',
    kicker: 'Learn',
    category: 'trivia',
    preview: 'museum',
    summary: 'Discover one artwork, read its story, then answer three quick noticing questions.',
  },
  {
    title: 'Moji Mash',
    href: './moji-mash',
    kicker: 'Word Puzzle',
    category: 'word',
    preview: 'moji',
    summary: "Genmojis are AI-styled emoji blends - guess the words behind today's image.",
  },
  {
    title: 'Wordie',
    href: './wordie',
    kicker: 'Word Guess',
    category: 'word',
    preview: 'wordie',
    summary: 'Solve the daily word in a compact grid.',
  },
  {
    title: 'Threadline',
    href: './threadline',
    kicker: 'Daily Word Puzzle',
    category: 'word',
    preview: 'threadline',
    summary: 'Fill the blanks by drawing each missing word in the grid.',
  },
  {
    title: 'Mini Crossword',
    href: './mini-crossword',
    kicker: 'Word Grid',
    category: 'word',
    preview: 'crossword',
    summary: 'A quick 5x5 crossword with fresh clues every day.',
  },
  {
    title: 'Mini Sudoku',
    href: './sudoku',
    kicker: 'Logic Grid',
    category: 'logic',
    preview: 'sudoku',
    summary: 'A daily Sudoku that ramps from breezy 6x6 boards to full 9x9 hard days.',
  },
  {
    title: 'Dawn Cabinet',
    href: './dawn-cabinet',
    kicker: 'Tile Logic',
    category: 'logic',
    preview: 'cabinet',
    summary: 'A Mahjong-inspired logic cabinet with hidden rails, exact tile banks, and reserve goals.',
  },
  {
    title: 'Bridges',
    href: './bridges',
    kicker: 'Logic Puzzle',
    category: 'logic',
    preview: 'bridges',
    summary: "Match each island's number with bridges. Connect all islands with no crossings.",
  },
  {
    title: 'Ballpark',
    href: './ballpark',
    kicker: 'Estimation Trivia',
    category: 'trivia',
    preview: 'ballpark',
    summary: 'Three themed number questions every day, with a tougher Extra Inning on Fridays.',
  },
  {
    title: 'Daily Mix',
    href: './daily-mix',
    kicker: 'Quickfire',
    category: 'trivia',
    preview: 'daily-mix',
    summary: 'Broad daily trivia with Easy and Hard variants, one shield, and a clean share at the end.',
  },
  {
    title: 'Daily Sports',
    href: './daily-sports',
    kicker: 'Quickfire',
    category: 'trivia',
    preview: 'daily-sports',
    summary: 'Sports-only daily trivia with Easy and Hard variants, a sharper curve, and the same quick share at the end.',
  },
  {
    title: 'Barter',
    href: './barter',
    kicker: 'Resource Exchange',
    category: 'logic',
    preview: 'barter',
    summary: 'A daily trade-chain puzzle inspired by historic markets. Reach the goal in as few swaps as possible.',
  },
  {
    title: 'Whodunit',
    href: './whodunit',
    kicker: 'Logic Deduction',
    category: 'logic',
    preview: 'whodunit',
    summary: 'A daily murder mystery. Read clues, eliminate suspects, deduce the killer.',
  },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderQuickLink(link: GameLink): string {
  return `            <a class="quick-link-card" href="${escapeHtml(link.href)}" aria-label="Open ${escapeHtml(link.title)}">
              <span class="quick-link-emoji" aria-hidden="true">${link.emoji}</span>
              <span class="quick-link-label">${escapeHtml(link.title)}</span>
              ${link.isNew ? '<span class="quick-link-badge">New</span>' : ''}
            </a>`;
}

function renderPreview(kind: PreviewKind): string {
  switch (kind) {
    case 'museum':
      return `              <div class="museum-preview preview-panel" aria-hidden="true">
                <div class="museum-preview-art">
                  <div class="museum-preview-sky"></div>
                  <div class="museum-preview-sun"></div>
                  <div class="museum-preview-floor"></div>
                  <div class="museum-preview-figure"></div>
                </div>
                <div class="museum-preview-text">
                  <span class="museum-preview-title">Gallery visit</span>
                  <span class="museum-preview-meta">Artist - date - collection</span>
                  <span class="museum-preview-tag">Museum</span>
                </div>
              </div>`;
    case 'moji':
      return `              <div class="moji-preview preview-panel" aria-hidden="true">
                <div class="moji-preview-image">
                  <span class="moji-preview-orb moji-preview-orb-a">🧩</span>
                  <span class="moji-preview-orb moji-preview-orb-b">✨</span>
                  <span class="moji-preview-orb moji-preview-orb-c">🔤</span>
                </div>
              </div>`;
    case 'wordie':
      return `              <div class="wordie-preview preview-panel" aria-hidden="true">
                <div class="wordie-row">
                  <span class="wordie-tile wordie-tile-filled">D</span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                </div>
                <div class="wordie-row">
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                  <span class="wordie-tile"></span>
                </div>
              </div>`;
    case 'threadline':
      return `              <div class="threadline-preview preview-panel" aria-hidden="true">
                <span class="threadline-preview-title">Hidden paths</span>
                <span class="threadline-preview-copy">6 hidden words - 2 hidden themes.</span>
                <div class="threadline-grid">
                  <div class="threadline-row"><span class="threadline-cell threadline-cell-active">S</span><span class="threadline-cell">T</span><span class="threadline-cell">O</span><span class="threadline-cell">N</span></div>
                  <div class="threadline-row"><span class="threadline-cell">L</span><span class="threadline-cell threadline-cell-active">I</span><span class="threadline-cell">N</span><span class="threadline-cell">E</span></div>
                  <div class="threadline-row"><span class="threadline-cell">A</span><span class="threadline-cell">R</span><span class="threadline-cell threadline-cell-active">C</span><span class="threadline-cell">H</span></div>
                  <div class="threadline-row"><span class="threadline-cell">D</span><span class="threadline-cell">A</span><span class="threadline-cell">W</span><span class="threadline-cell threadline-cell-active">N</span></div>
                </div>
              </div>`;
    case 'crossword':
      return `              <div class="crossword-preview preview-panel" aria-hidden="true">
                <div class="crossword-row"><span class="crossword-cell"><small>1</small></span><span class="crossword-cell"><small>2</small></span><span class="crossword-cell crossword-block"></span><span class="crossword-cell"><small>3</small></span><span class="crossword-cell"></span></div>
                <div class="crossword-row"><span class="crossword-cell"></span><span class="crossword-cell"></span><span class="crossword-cell"><small>4</small></span><span class="crossword-cell"></span><span class="crossword-cell"></span></div>
                <div class="crossword-row"><span class="crossword-cell crossword-block"></span><span class="crossword-cell"><small>5</small></span><span class="crossword-cell"></span><span class="crossword-cell"></span><span class="crossword-cell crossword-block"></span></div>
                <div class="crossword-row"><span class="crossword-cell"><small>6</small></span><span class="crossword-cell"></span><span class="crossword-cell"></span><span class="crossword-cell"></span><span class="crossword-cell"><small>7</small></span></div>
                <div class="crossword-row"><span class="crossword-cell"></span><span class="crossword-cell"></span><span class="crossword-cell crossword-block"></span><span class="crossword-cell"></span><span class="crossword-cell"></span></div>
                <span class="preview-caption">Across + down</span>
              </div>`;
    case 'sudoku':
      return `              <div class="sudoku-preview preview-panel" aria-hidden="true">
                <span class="sudoku-preview-date">Daily UTC</span>
                <span class="sudoku-preview-meta">Medium - 6x6</span>
                <div class="sudoku-grid">
                  <div class="sudoku-row"><span class="sudoku-cell sudoku-filled">4</span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">2</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">6</span></div>
                  <div class="sudoku-row"><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">6</span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">1</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span></div>
                  <div class="sudoku-row"><span class="sudoku-cell sudoku-filled">1</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">5</span><span class="sudoku-cell"></span></div>
                  <div class="sudoku-row"><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">3</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">2</span></div>
                  <div class="sudoku-row"><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">5</span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">1</span><span class="sudoku-cell"></span></div>
                  <div class="sudoku-row"><span class="sudoku-cell sudoku-filled">6</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span><span class="sudoku-cell sudoku-filled">4</span><span class="sudoku-cell"></span><span class="sudoku-cell"></span></div>
                </div>
              </div>`;
    case 'cabinet':
      return `              <div class="cabinet-preview preview-panel" aria-hidden="true">
                <span class="cabinet-preview-meta">Standard, Hard, or Expert - rails</span>
                <div class="cabinet-row"><span class="cabinet-tile cabinet-tile-filled">2</span><span class="cabinet-tile"></span><span class="cabinet-tile cabinet-tile-filled">7</span><span class="cabinet-tile"></span><span class="cabinet-tile cabinet-tile-filled">D</span></div>
                <div class="cabinet-row"><span class="cabinet-tile"></span><span class="cabinet-tile cabinet-tile-filled">4</span><span class="cabinet-tile"></span><span class="cabinet-tile cabinet-tile-filled">9</span><span class="cabinet-tile"></span></div>
                <div class="cabinet-row"><span class="cabinet-tile cabinet-tile-filled">1</span><span class="cabinet-tile"></span><span class="cabinet-tile"></span><span class="cabinet-tile cabinet-tile-filled">6</span><span class="cabinet-tile"></span></div>
              </div>`;
    case 'bridges':
      return `              <div class="bridges-preview preview-panel" aria-hidden="true">
                <span class="bridges-preview-emoji">🏝️</span>
                <div class="bridges-row">
                  <span class="bridge-island">2</span><span class="bridge-connector"></span><span class="bridge-island">3</span><span class="bridge-connector"></span><span class="bridge-island">1</span>
                </div>
                <span class="preview-caption">Tap islands to add bridges.</span>
              </div>`;
    case 'ballpark':
      return `              <div class="ballpark-preview preview-panel" aria-hidden="true">
                <span class="panel-label">Today's format</span>
                <div class="stat-row">
                  <span class="stat-card"><strong>3</strong><small>Questions</small></span>
                  <span class="stat-card"><strong>4</strong><small>Guesses</small></span>
                  <span class="stat-card"><strong>Fri</strong><small>Bonus</small></span>
                </div>
                <span class="preview-caption">Good guesses beat good memory.</span>
              </div>`;
    case 'daily-mix':
      return `              <div class="trivia-preview preview-panel" aria-hidden="true">
                <span class="panel-label">Today's game</span>
                <div class="trivia-feed-grid">
                  <span class="trivia-feed-card"><strong>Daily Mix</strong><small>12 questions - 15s timer</small></span>
                  <span class="trivia-feed-card"><strong>Easy / Hard</strong><small>Choose before the run starts</small></span>
                </div>
                <span class="preview-caption">Three choices each, one shield.</span>
              </div>`;
    case 'daily-sports':
      return `              <div class="trivia-preview preview-panel" aria-hidden="true">
                <span class="panel-label">Today's game</span>
                <div class="trivia-feed-grid">
                  <span class="trivia-feed-card"><strong>Daily Sports</strong><small>12 questions - 15s timer</small></span>
                  <span class="trivia-feed-card"><strong>Easy / Hard</strong><small>Sharper sports curve</small></span>
                </div>
                <span class="preview-caption">Hard stays the tougher daily.</span>
              </div>`;
    case 'barter':
      return `              <div class="barter-preview preview-panel" aria-hidden="true">
                <span class="panel-label">Today's goal</span>
                <span class="barter-goal"><span class="barter-emoji">🌾</span><strong>12 Grain</strong></span>
                <span class="barter-meta">Par 5 trades - 8 goods</span>
              </div>`;
    case 'whodunit':
      return `              <div class="whodunit-preview preview-panel" aria-hidden="true">
                <span class="whodunit-preview-emoji">🔍</span>
                <span class="panel-label">Case #042 - The Missing Key</span>
                <div class="suspect-row">
                  <span class="suspect-chip">🎩 Vale</span>
                  <span class="suspect-chip">🧤 Noor</span>
                  <span class="suspect-chip">📚 Finch</span>
                </div>
              </div>`;
  }
}

function renderGameSection(game: GameSection): string {
  return `          <section class="game-section ${game.category}" aria-labelledby="${escapeHtml(game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
            <div class="game-label">
              <p class="kicker">${escapeHtml(game.kicker)}</p>
              <h2 id="${escapeHtml(game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${escapeHtml(game.title)}</h2>
            </div>
            <p class="blurb">${escapeHtml(game.summary)}</p>
            <div class="daily-card">
${renderPreview(game.preview)}
              <a class="play-button" href="${escapeHtml(game.href)}">Play</a>
            </div>
          </section>`;
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>Daybreak</title>
    <meta
      name="description"
      content="Daybreak daily games: word puzzles, logic games, trivia, deduction, and art."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Sora:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="/gameshow/favicon.ico" />
    <style>
      :root {
        color-scheme: light;
        --background-soft: #f3f6fb;
        --surface: #ffffff;
        --surface-light: #eef2f8;
        --surface-glass: rgba(255, 255, 255, 0.78);
        --primary: #0b0b0b;
        --primary-light: #22252d;
        --accent: #ff3b30;
        --text: #0b0b0b;
        --text-secondary: #4d5360;
        --text-muted: #6a7180;
        --border: rgba(11, 11, 11, 0.14);
        --line: rgba(11, 11, 11, 0.12);
        --white: #ffffff;
        --shadow: rgba(11, 11, 11, 0.08);
        --home-accent: #ff3b30;
        --word-accent: #ff3b30;
        --logic-accent: #087f8c;
        --trivia-accent: #9f6a45;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          color-scheme: dark;
          --background-soft: #0f141d;
          --surface: #151c26;
          --surface-light: #232f3e;
          --surface-glass: rgba(21, 28, 38, 0.75);
          --primary: #273241;
          --primary-light: #314054;
          --accent: #ff5a51;
          --text: #f7f7f7;
          --text-secondary: #d3d8e0;
          --text-muted: #9ca7b8;
          --border: rgba(255, 255, 255, 0.18);
          --line: rgba(255, 255, 255, 0.2);
          --shadow: rgba(0, 0, 0, 0.24);
          --home-accent: #ff5a51;
          --word-accent: #ff5a51;
          --logic-accent: #00a48a;
          --trivia-accent: #f1c38a;
        }
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        min-height: 100%;
        margin: 0;
        background: var(--background-soft);
      }

      body {
        color: var(--text);
        font-family: Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        overflow-x: hidden;
      }

      .shell {
        min-height: 100vh;
        background: var(--background-soft);
      }

      .scroll-content {
        width: 100%;
        max-width: 520px;
        margin: 0 auto;
        padding: 16px 24px 48px;
      }

      .topbar-sticky {
        padding-top: 16px;
        padding-bottom: 8px;
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--background-soft);
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--surface-glass);
        padding: 14px 18px;
        box-shadow: 0 8px 12px var(--shadow);
      }

      .topbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .logo-mark {
        position: relative;
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--surface-light);
        overflow: hidden;
      }

      .logo-sun {
        position: absolute;
        left: 8px;
        top: 7px;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: var(--home-accent);
      }

      .logo-horizon {
        position: absolute;
        left: 5px;
        right: 5px;
        bottom: 9px;
        height: 6px;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--line);
      }

      .wordmark {
        margin: 0;
        color: var(--text);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 3.2px;
        text-transform: uppercase;
      }

      .page {
        width: 100%;
      }

      .header {
        padding-top: 32px;
        padding-bottom: 24px;
      }

      .greeting {
        margin: 0;
        color: var(--text);
        font-size: 24px;
        font-weight: 700;
      }

      .date-subtitle {
        margin: 4px 0 0;
        color: var(--text-muted);
        font-size: 16px;
      }

      .quick-links-section {
        margin-bottom: 32px;
      }

      .quick-links-title {
        margin: 0 0 8px;
        color: var(--text);
        font-size: 16px;
        font-weight: 700;
      }

      .quick-links-header {
        margin-bottom: 8px;
      }

      .quick-links-subtitle {
        margin: 2px 0 0;
        color: var(--text-muted);
        font-size: 14px;
      }

      .quick-links-row {
        display: flex;
        gap: 8px;
        margin: 0 -24px;
        padding: 0 24px 4px;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .quick-links-row::-webkit-scrollbar {
        display: none;
      }

      .quick-link-card {
        display: flex;
        min-width: 120px;
        flex: 0 0 auto;
        flex-direction: column;
        align-items: center;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--surface-glass);
        color: var(--text);
        padding: 16px 24px;
        text-align: center;
        text-decoration: none;
        box-shadow: 0 8px 12px var(--shadow);
      }

      .quick-link-emoji {
        font-size: 22px;
        line-height: 1;
      }

      .quick-link-label {
        margin-top: 4px;
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 700;
      }

      .quick-link-badge {
        margin-top: 4px;
        border: 1px solid #f2bc79;
        border-radius: 999px;
        background: #fff1df;
        color: #8a4300;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.6px;
        text-transform: uppercase;
      }

      @media (prefers-color-scheme: dark) {
        .quick-link-badge {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 90, 81, 0.16);
          color: var(--text-secondary);
        }
      }

      .game-section {
        margin-bottom: 32px;
      }

      .game-label {
        margin-bottom: 4px;
      }

      .kicker {
        margin: 0 0 4px;
        color: var(--word-accent);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }

      .logic .kicker {
        color: var(--logic-accent);
      }

      .trivia .kicker {
        color: var(--trivia-accent);
      }

      .game-label h2 {
        margin: 0;
        color: var(--text);
        font-size: 36px;
        font-weight: 800;
        letter-spacing: 0;
      }

      .blurb {
        max-width: 420px;
        margin: 8px 0 0;
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.45;
      }

      .daily-card {
        display: grid;
        gap: 16px;
        border: 1px solid var(--border);
        border-radius: 16px;
        background: var(--surface);
        margin-top: 16px;
        padding: 32px;
        box-shadow: 0 10px 16px var(--shadow);
      }

      .preview-panel {
        display: grid;
        place-items: center;
        gap: 8px;
        width: 100%;
        margin: 0 auto;
        border-radius: 16px;
        background: var(--surface-light);
        padding: 16px;
        overflow: hidden;
      }

      .preview-caption,
      .panel-label {
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      .panel-label {
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .museum-preview {
        place-items: stretch;
        gap: 0;
        border: 1px solid var(--border);
        padding: 0;
      }

      .museum-preview-art {
        position: relative;
        height: 176px;
        background: linear-gradient(135deg, #d7c4a8 0%, #8da1a5 48%, #2c3b42 100%);
        overflow: hidden;
      }

      .museum-preview-sky {
        position: absolute;
        inset: 14px 18px 54px;
        border-radius: 50% 50% 18px 18px;
        background: linear-gradient(160deg, rgba(255, 245, 218, 0.88), rgba(108, 131, 136, 0.58));
      }

      .museum-preview-sun {
        position: absolute;
        right: 72px;
        top: 34px;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: #f08a24;
        box-shadow: 0 0 0 12px rgba(240, 138, 36, 0.12);
      }

      .museum-preview-floor {
        position: absolute;
        inset: auto 0 0;
        height: 64px;
        background: linear-gradient(90deg, rgba(45, 38, 28, 0.62), rgba(236, 202, 146, 0.46));
      }

      .museum-preview-figure {
        position: absolute;
        left: 70px;
        bottom: 34px;
        width: 54px;
        height: 82px;
        border-radius: 28px 28px 10px 10px;
        background: rgba(36, 28, 20, 0.72);
      }

      .museum-preview-text {
        display: grid;
        gap: 4px;
        padding: 16px;
      }

      .museum-preview-title,
      .trivia-feed-card strong,
      .stat-card strong,
      .barter-goal strong {
        color: var(--text);
        font-size: 16px;
        font-weight: 800;
      }

      .museum-preview-meta,
      .barter-meta,
      .trivia-feed-card small,
      .stat-card small {
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 600;
      }

      .museum-preview-tag {
        justify-self: start;
        margin-top: 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--trivia-accent) 14%, var(--surface));
        color: var(--trivia-accent);
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .moji-preview-image {
        position: relative;
        width: min(100%, 220px);
        height: 164px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background:
          radial-gradient(circle at 24% 26%, rgba(255, 90, 81, 0.18), transparent 34%),
          radial-gradient(circle at 74% 38%, rgba(8, 127, 140, 0.18), transparent 34%),
          linear-gradient(145deg, var(--surface), var(--surface-light));
      }

      .moji-preview-orb {
        position: absolute;
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: var(--surface);
        box-shadow: 0 8px 12px var(--shadow);
        font-size: 30px;
      }

      .moji-preview-orb-a {
        left: 28px;
        top: 30px;
        rotate: -8deg;
      }

      .moji-preview-orb-b {
        left: 80px;
        top: 64px;
        z-index: 1;
      }

      .moji-preview-orb-c {
        right: 28px;
        top: 28px;
        rotate: 9deg;
      }

      .wordie-preview,
      .threadline-preview,
      .crossword-preview,
      .sudoku-preview,
      .cabinet-preview,
      .bridges-preview,
      .ballpark-preview,
      .trivia-preview,
      .barter-preview,
      .whodunit-preview {
        padding-top: 18px;
        padding-bottom: 18px;
      }

      .wordie-row,
      .threadline-row,
      .crossword-row,
      .sudoku-row,
      .cabinet-row,
      .bridges-row,
      .stat-row,
      .suspect-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .wordie-tile {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--surface);
        color: var(--text);
        font-size: 18px;
        font-weight: 800;
      }

      .wordie-tile-filled {
        background: color-mix(in srgb, var(--word-accent) 10%, var(--surface));
        border-color: color-mix(in srgb, var(--word-accent) 34%, var(--border));
      }

      .threadline-preview-title {
        color: var(--text);
        font-size: 16px;
        font-weight: 800;
      }

      .threadline-preview-copy,
      .sudoku-preview-date,
      .sudoku-preview-meta,
      .cabinet-preview-meta {
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      .threadline-grid,
      .sudoku-grid {
        display: grid;
        gap: 4px;
        margin-top: 4px;
      }

      .threadline-cell,
      .crossword-cell,
      .sudoku-cell {
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 800;
      }

      .threadline-cell {
        border-radius: 7px;
      }

      .threadline-cell-active {
        background: color-mix(in srgb, var(--word-accent) 12%, var(--surface));
        border-color: color-mix(in srgb, var(--word-accent) 42%, var(--border));
      }

      .crossword-preview {
        gap: 4px;
      }

      .crossword-cell {
        align-items: start;
        justify-items: start;
        border-radius: 4px;
        padding: 2px;
      }

      .crossword-cell small {
        color: var(--text-muted);
        font-size: 9px;
        font-weight: 800;
      }

      .crossword-block {
        background: var(--primary);
        border-color: var(--primary-light);
      }

      .sudoku-cell {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        font-size: 11px;
      }

      .sudoku-filled {
        background: var(--surface-light);
      }

      .cabinet-tile {
        display: grid;
        place-items: center;
        width: 30px;
        height: 38px;
        border: 1px solid color-mix(in srgb, var(--logic-accent) 34%, var(--border));
        border-radius: 7px;
        background: var(--surface);
        color: var(--text);
        font-size: 14px;
        font-weight: 900;
      }

      .cabinet-tile-filled {
        background: #fff7e7;
        border-color: var(--logic-accent);
        color: #221a12;
      }

      .bridges-preview-emoji,
      .whodunit-preview-emoji {
        font-size: 32px;
        line-height: 1;
      }

      .bridge-island {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface);
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 800;
      }

      .bridge-connector {
        width: 28px;
        height: 3px;
        border-radius: 999px;
        background: var(--text-muted);
      }

      .stat-row {
        flex-wrap: wrap;
      }

      .stat-card,
      .trivia-feed-card {
        display: grid;
        gap: 2px;
        min-width: 74px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--surface);
        padding: 10px 12px;
        text-align: center;
      }

      .stat-card strong {
        font-size: 19px;
      }

      .stat-card small {
        font-size: 11px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .trivia-feed-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        width: 100%;
      }

      .trivia-feed-card {
        min-width: 132px;
        max-width: 170px;
        text-align: left;
      }

      .barter-goal {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text);
      }

      .barter-emoji {
        font-size: 26px;
      }

      .suspect-row {
        flex-wrap: wrap;
        margin-top: 6px;
      }

      .suspect-chip {
        border-radius: 999px;
        background: var(--surface);
        color: var(--text-secondary);
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 700;
      }

      @media (prefers-color-scheme: dark) {
        .cabinet-tile-filled {
          background: #fff8e9;
        }
      }

      .play-button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--primary);
        color: var(--white);
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.7px;
        text-decoration: none;
      }

      .play-button:hover,
      .play-button:focus-visible {
        background: var(--primary-light);
        outline: none;
      }

      @media (max-width: 560px) {
        .scroll-content {
          padding-right: 16px;
          padding-left: 16px;
        }

        .topbar {
          padding-right: 14px;
          padding-left: 14px;
        }

        .wordmark {
          font-size: 14px;
          letter-spacing: 2.4px;
        }

        .quick-links-row {
          margin-right: -16px;
          margin-left: -16px;
          padding-right: 16px;
          padding-left: 16px;
        }

        .game-label h2 {
          font-size: 32px;
        }

        .daily-card {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <main class="scroll-content">
        <div class="topbar-sticky">
          <header class="topbar">
            <div class="topbar-left">
              <div class="logo-mark" aria-hidden="true">
                <div class="logo-sun"></div>
                <div class="logo-horizon"></div>
              </div>
              <p class="wordmark">Daybreak</p>
            </div>
          </header>
        </div>

        <div class="page">
          <section class="header">
            <h1 class="greeting">Daily games</h1>
            <p class="date-subtitle">Choose a game to play.</p>
          </section>

          <section class="quick-links-section" aria-label="Quick links">
            <div class="quick-links-header">
              <p class="quick-links-title">Quick links</p>
              <p class="quick-links-subtitle">Jump into a game.</p>
            </div>
            <div class="quick-links-row">
${quickLinks.map(renderQuickLink).join('\n')}
            </div>
          </section>

          <div id="all-games">
${gameSections.map(renderGameSection).join('\n\n')}
          </div>

        </div>
      </main>
    </div>
  </body>
</html>
`;

const outPath = join(process.cwd(), 'dist', 'index.html');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html.replace(/[ \t]+\n/g, '\n'));
console.log(`Wrote static homepage to ${outPath}`);
