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
  summary: string;
};

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
    summary: 'Discover one artwork, read its story, then answer three quick noticing questions.',
  },
  {
    title: 'Moji Mash',
    href: './moji-mash',
    kicker: 'Word Puzzle',
    category: 'word',
    summary: "Genmojis are AI-styled emoji blends - guess the words behind today's image.",
  },
  {
    title: 'Wordie',
    href: './wordie',
    kicker: 'Word Guess',
    category: 'word',
    summary: 'Solve the daily word in a compact grid.',
  },
  {
    title: 'Threadline',
    href: './threadline',
    kicker: 'Daily Word Puzzle',
    category: 'word',
    summary: 'Fill the blanks by drawing each missing word in the grid.',
  },
  {
    title: 'Mini Crossword',
    href: './mini-crossword',
    kicker: 'Word Grid',
    category: 'word',
    summary: 'A quick 5x5 crossword with fresh clues every day.',
  },
  {
    title: 'Mini Sudoku',
    href: './sudoku',
    kicker: 'Logic Grid',
    category: 'logic',
    summary: 'A daily Sudoku that ramps from breezy 6x6 boards to full 9x9 hard days.',
  },
  {
    title: 'Dawn Cabinet',
    href: './dawn-cabinet',
    kicker: 'Tile Logic',
    category: 'logic',
    summary: 'A Mahjong-inspired logic cabinet with hidden rails, exact tile banks, and reserve goals.',
  },
  {
    title: 'Bridges',
    href: './bridges',
    kicker: 'Logic Puzzle',
    category: 'logic',
    summary: "Match each island's number with bridges. Connect all islands with no crossings.",
  },
  {
    title: 'Ballpark',
    href: './ballpark',
    kicker: 'Estimation Trivia',
    category: 'trivia',
    summary: 'Three themed number questions every day, with a tougher Extra Inning on Fridays.',
  },
  {
    title: 'Daily Mix',
    href: './daily-mix',
    kicker: 'Quickfire',
    category: 'trivia',
    summary: 'Broad daily trivia with Easy and Hard variants, one shield, and a clean share at the end.',
  },
  {
    title: 'Daily Sports',
    href: './daily-sports',
    kicker: 'Quickfire',
    category: 'trivia',
    summary: 'Sports-only daily trivia with Easy and Hard variants, a sharper curve, and the same quick share at the end.',
  },
  {
    title: 'Barter',
    href: './barter',
    kicker: 'Resource Exchange',
    category: 'logic',
    summary: 'A daily trade-chain puzzle inspired by historic markets. Reach the goal in as few swaps as possible.',
  },
  {
    title: 'Whodunit',
    href: './whodunit',
    kicker: 'Logic Deduction',
    category: 'logic',
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

function renderGameSection(game: GameSection): string {
  return `          <section class="game-section ${game.category}" aria-labelledby="${escapeHtml(game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">
            <div class="game-label">
              <p class="kicker">${escapeHtml(game.kicker)}</p>
              <h2 id="${escapeHtml(game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${escapeHtml(game.title)}</h2>
            </div>
            <p class="blurb">${escapeHtml(game.summary)}</p>
            <div class="daily-card">
              <div class="static-preview">
                <span class="static-preview-title">${escapeHtml(game.title)}</span>
                <span class="static-preview-meta">${game.category === 'word' ? 'Word' : game.category === 'logic' ? 'Logic' : 'Trivia'} daily</span>
              </div>
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

      .static-preview {
        display: grid;
        gap: 6px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--surface-light);
        padding: 16px;
      }

      .static-preview-title {
        color: var(--text);
        font-size: 16px;
        font-weight: 800;
      }

      .static-preview-meta {
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 600;
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
