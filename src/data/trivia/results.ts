import type { TriviaEpisode, TriviaRunResult } from './types';

function getFeedLabel(feed: TriviaEpisode['feed']): string {
  return feed === 'mix' ? 'Daily Mix' : 'Daily Sports';
}

function getShieldSummary(result: TriviaRunResult): string {
  if (result.cleanRun) return 'Clean run';
  return result.shieldUsed ? 'Shield used' : 'No shield';
}

export function formatTriviaShareText(
  result: TriviaRunResult,
  episode: TriviaEpisode,
  dateLabel: string
): string {
  const resultRow = result.answerMarks
    .map((mark) => {
      if (mark === 'correct') return '🟩';
      if (mark === 'shielded') return '🟦';
      if (mark === 'wrong') return '🟨';
      return '⬛';
    })
    .join('');

  return [
    `${getFeedLabel(episode.feed)} ${dateLabel}`,
    `${result.correctCount}/${result.totalQuestions} · ${result.score} pts · ${getShieldSummary(
      result
    )}`,
    resultRow,
    'https://mitchrobs.github.io/gameshow/',
  ].join('\n');
}
