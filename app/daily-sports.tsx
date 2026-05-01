import { sportsTriviaRuntime } from '../src/data/trivia/sportsRuntime';
import { TriviaGameScreen } from '../src/ui/trivia/TriviaGameScreen';

export default function DailySportsScreen() {
  return <TriviaGameScreen runtime={sportsTriviaRuntime} />;
}
