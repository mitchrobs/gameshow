import {
  VARIANTS,
  applyMove,
  buildVariantPack,
  createInitialState,
  formatPoint,
  getLegalMoves,
  getLightTouchCount,
  getVariantById,
  isSolved,
  replaySolution,
  runVariantPlaytest,
  solvePuzzle,
} from './variantLabCore.mjs';

const elements = {
  variantList: document.querySelector('[data-variant-list]'),
  board: document.querySelector('[data-board]'),
  title: document.querySelector('[data-title]'),
  thesis: document.querySelector('[data-thesis]'),
  rules: document.querySelector('[data-rules]'),
  status: document.querySelector('[data-status]'),
  metrics: document.querySelector('[data-metrics]'),
  eventLog: document.querySelector('[data-event-log]'),
  puzzleSelect: document.querySelector('[data-puzzle-select]'),
  autoButton: document.querySelector('[data-auto]'),
  resetButton: document.querySelector('[data-reset]'),
  nextButton: document.querySelector('[data-next]'),
  report: document.querySelector('[data-report]'),
};

let activeVariant = getVariantById(new URLSearchParams(window.location.search).get('variant') ?? 'shared-crossing');
let pack = buildVariantPack(activeVariant.id, 12);
let puzzleIndex = Number(new URLSearchParams(window.location.search).get('puzzle') ?? '0') || 0;
let puzzle = pack[puzzleIndex] ?? pack[0];
let state = createInitialState(puzzle);
let solvedCache = solvePuzzle(activeVariant, puzzle);
const playtestReport = runVariantPlaytest({ packSize: 12 });

function setVariant(variantId) {
  activeVariant = getVariantById(variantId);
  pack = buildVariantPack(activeVariant.id, 12);
  puzzleIndex = 0;
  puzzle = pack[puzzleIndex];
  state = createInitialState(puzzle);
  solvedCache = solvePuzzle(activeVariant, puzzle);
  render();
}

function setPuzzle(index) {
  puzzleIndex = index;
  puzzle = pack[puzzleIndex] ?? pack[0];
  state = createInitialState(puzzle);
  solvedCache = solvePuzzle(activeVariant, puzzle);
  render();
}

function reset() {
  state = createInitialState(puzzle);
  render();
}

function autoplay() {
  if (!solvedCache.solved) {
    elements.status.textContent = 'No solved sample found for this prototype puzzle.';
    return;
  }
  const replay = replaySolution(activeVariant, puzzle, solvedCache.solution);
  state = replay.state;
  render();
}

function renderVariantList() {
  elements.variantList.innerHTML = '';
  VARIANTS.forEach((variant) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `variant-button${variant.id === activeVariant.id ? ' active' : ''}`;
    button.innerHTML = `<strong>${variant.shortName}</strong><span>${variant.name}</span>`;
    button.addEventListener('click', () => setVariant(variant.id));
    elements.variantList.append(button);
  });
}

function renderPuzzleSelect() {
  elements.puzzleSelect.innerHTML = '';
  pack.forEach((candidate, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `Day ${index + 1}: ${candidate.title}`;
    option.selected = index === puzzleIndex;
    elements.puzzleSelect.append(option);
  });
}

function renderBoard() {
  elements.board.innerHTML = '';
  elements.board.style.setProperty('--size', String(puzzle.size));
  const legalKeys = new Set(getLegalMoves(state, activeVariant, puzzle).map((point) => `${point.row}:${point.col}`));
  for (let row = 0; row < state.board.length; row += 1) {
    for (let col = 0; col < state.board[row].length; col += 1) {
      const point = { row, col };
      const cell = state.board[row][col];
      const button = document.createElement('button');
      button.type = 'button';
      const touches = getLightTouchCount(state.board, point);
      const legal = legalKeys.has(`${row}:${col}`);
      button.className = `cell cell-${cell === '.' ? 'empty' : cell.toLowerCase()}${legal ? ' legal' : ''}${touches > 1 ? ' shared' : ''}`;
      button.setAttribute('aria-label', `${formatPoint(point)} ${cellLabel(cell)}${touches > 1 ? ', shared crossing' : ''}`);
      button.innerHTML = renderCell(cell, touches);
      button.addEventListener('click', () => {
        const result = applyMove(state, activeVariant, puzzle, point);
        if (!result.legal) {
          elements.status.textContent = `${formatPoint(point)} is not playable: ${result.reason}.`;
          return;
        }
        state = result.state;
        render();
      });
      elements.board.append(button);
    }
  }
}

function renderCell(cell, touches) {
  if (cell === 'X') return '<span class="blocker"></span>';
  if (cell === 'B') return '<span class="pebble dark"></span>';
  if (cell === 'W') return '<span class="pebble light"></span>';
  if (cell === 'G') return '<span class="pebble release"></span>';
  if (cell === 'T') return '<span class="territory-dot"></span>';
  if (cell === 'C') return '<span class="territory-dot claimed"></span>';
  if (touches > 1) return '<span class="shared-ring"></span>';
  return '';
}

function cellLabel(cell) {
  if (cell === 'X') return 'blocker';
  if (cell === 'B') return 'dark pebble';
  if (cell === 'W') return 'light pebble';
  if (cell === 'G') return 'green release pebble';
  if (cell === 'T') return 'unsettled pocket';
  if (cell === 'C') return 'settled pocket';
  return 'empty crossing';
}

function renderHeader() {
  elements.title.textContent = activeVariant.name;
  elements.thesis.textContent = activeVariant.thesis;
  elements.rules.innerHTML = activeVariant.rules.map((rule) => `<li>${rule}</li>`).join('');
}

function renderStatus() {
  const solved = isSolved(state, activeVariant, puzzle);
  const sample = solvedCache.solved
    ? `Solved sample: ${solvedCache.solution.map(formatPoint).join(' -> ')}`
    : 'Solved sample: not found in search limit';
  elements.status.textContent = solved
    ? `Settled in ${state.moves.length} moves. ${sample}`
    : `${state.moves.length} moves placed. ${sample}`;
}

function renderMetrics() {
  const rows = [
    ['Captures', state.captures],
    ['Shared moves', state.sharedMoves],
    ['Filler moves', state.fillerMoves],
    ['Responses', state.responseEvents],
    ['Risk moves', state.riskMoves],
    ['Special events', state.sacrificeEvents + state.releaseEvents + state.territoryEvents + state.koEvents],
  ];
  elements.metrics.innerHTML = rows.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function renderEventLog() {
  const events = state.events.slice(-8);
  elements.eventLog.innerHTML = events.length > 0
    ? events.map((event) => `<li>${event}</li>`).join('')
    : '<li>No events yet.</li>';
}

function renderReport() {
  elements.report.innerHTML = playtestReport.map((entry, index) => {
    const rank = index + 1;
    return `
      <article class="report-card${entry.variantId === activeVariant.id ? ' active' : ''}">
        <div class="rank">${rank}</div>
        <div>
          <h3>${entry.name}</h3>
          <p>${entry.thesis}</p>
          <dl>
            <div><dt>Solved</dt><dd>${entry.solvedCount}/${entry.packSize}</dd></div>
            <div><dt>Score</dt><dd>${entry.averageScore.toFixed(1)}</dd></div>
            <div><dt>Filler</dt><dd>${Math.round(entry.averageFillerRatio * 100)}%</dd></div>
            <div><dt>Variance</dt><dd>${entry.dayToDayVariance.toFixed(1)}</dd></div>
          </dl>
        </div>
      </article>
    `;
  }).join('');
}

function render() {
  renderVariantList();
  renderPuzzleSelect();
  renderHeader();
  renderBoard();
  renderStatus();
  renderMetrics();
  renderEventLog();
  renderReport();
}

elements.puzzleSelect.addEventListener('change', (event) => {
  setPuzzle(Number(event.target.value));
});
elements.autoButton.addEventListener('click', autoplay);
elements.resetButton.addEventListener('click', reset);
elements.nextButton.addEventListener('click', () => setPuzzle((puzzleIndex + 1) % pack.length));

render();
