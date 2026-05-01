import { mixTriviaRuntime } from '../src/data/trivia/mixRuntime';
import { TriviaGameScreen } from '../src/ui/trivia/TriviaGameScreen';

export default function DailyMixScreen() {
  return <TriviaGameScreen runtime={mixTriviaRuntime} />;
}
