import type {
  TriviaCitation,
  TriviaCurveballKind,
  TriviaDifficultyTarget,
  TriviaEditorialBucket,
  TriviaLegacyFamily,
  TriviaLookupRisk,
  TriviaObscurityFlag,
  TriviaPromptKind,
} from './types';

export interface CuratedTriviaSourceQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
  difficulty: TriviaDifficultyTarget;
  domain?: string;
  subdomain?: string;
  editorialBucket?: TriviaEditorialBucket;
  lookupRisk?: TriviaLookupRisk;
  promptKind: TriviaPromptKind;
  salienceScore: number;
  obscurityFlags?: TriviaObscurityFlag[];
  anchorSubdomain?: string;
  curveballKind?: TriviaCurveballKind;
  legacyFamily?: TriviaLegacyFamily;
  citations?: TriviaCitation[];
  rationaleShort?: string;
  rationaleLong?: string;
  isTrickQuestion?: boolean;
  curveballOnly?: boolean;
  themeTags?: string[];
}

type TeamCard = {
  team: string;
  city: string;
  venue: string;
  league: string;
  sportLabel: string;
  subdomain: string;
  venueSalience?: number;
};

type PlayerCard = {
  name: string;
  subdomain: string;
  sportLabel: string;
  team?: string;
  position?: string;
  nickname?: string;
  achievementPrompt?: string;
  achievementAnswer?: string;
  achievementOptions?: string[];
  salience?: number;
};

function searchCitation(label: string, query: string): TriviaCitation[] {
  const encoded = encodeURIComponent(query);
  return [
    {
      title: label,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encoded}`,
      sourceType: 'editorial',
      accessedAt: '2026-04-26',
    },
  ];
}

function pickPeerValues(values: string[], current: string, index: number): [string, string] {
  const peers = values.filter((value) => value !== current);
  const first = peers[index % peers.length] ?? peers[0] ?? current;
  const second = peers[(index + 3) % peers.length] ?? peers[1] ?? first;
  return [first, second];
}

function dedupeLocal(values: string[]): string[] {
  return [...new Set(values)];
}

function buildOptions(correct: string, distractors: [string, string]): string[] {
  return [correct, distractors[0], distractors[1]];
}

function q(question: CuratedTriviaSourceQuestion): CuratedTriviaSourceQuestion {
  return question;
}

const SPORTS_TEAM_CARDS: TeamCard[] = [
  { team: 'Kansas City Chiefs', city: 'Kansas City', venue: 'Arrowhead Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 86 },
  { team: 'Buffalo Bills', city: 'Buffalo', venue: 'Highmark Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 72 },
  { team: 'Baltimore Ravens', city: 'Baltimore', venue: 'M&T Bank Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 70 },
  { team: 'Pittsburgh Steelers', city: 'Pittsburgh', venue: 'Acrisure Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 74 },
  { team: 'Dallas Cowboys', city: 'Arlington', venue: 'AT&T Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 88 },
  { team: 'Philadelphia Eagles', city: 'Philadelphia', venue: 'Lincoln Financial Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 74 },
  { team: 'Green Bay Packers', city: 'Green Bay', venue: 'Lambeau Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 92 },
  { team: 'Chicago Bears', city: 'Chicago', venue: 'Soldier Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 78 },
  { team: 'San Francisco 49ers', city: 'Santa Clara', venue: "Levi's Stadium", league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 73 },
  { team: 'Seattle Seahawks', city: 'Seattle', venue: 'Lumen Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 76 },
  { team: 'Miami Dolphins', city: 'Miami Gardens', venue: 'Hard Rock Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 79 },
  { team: 'Cincinnati Bengals', city: 'Cincinnati', venue: 'Paycor Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 68 },
  { team: 'New England Patriots', city: 'Foxborough', venue: 'Gillette Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 86 },
  { team: 'New York Giants', city: 'East Rutherford', venue: 'MetLife Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 80 },
  { team: 'Denver Broncos', city: 'Denver', venue: 'Empower Field at Mile High', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 79 },
  { team: 'Las Vegas Raiders', city: 'Las Vegas', venue: 'Allegiant Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 84 },
  { team: 'Los Angeles Lakers', city: 'Los Angeles', venue: 'Crypto.com Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 86 },
  { team: 'Boston Celtics', city: 'Boston', venue: 'TD Garden', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 82 },
  { team: 'Chicago Bulls', city: 'Chicago', venue: 'United Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 84 },
  { team: 'New York Knicks', city: 'New York City', venue: 'Madison Square Garden', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 92 },
  { team: 'Golden State Warriors', city: 'San Francisco', venue: 'Chase Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 78 },
  { team: 'Miami Heat', city: 'Miami', venue: 'Kaseya Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 69 },
  { team: 'San Antonio Spurs', city: 'San Antonio', venue: 'Frost Bank Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 66 },
  { team: 'Dallas Mavericks', city: 'Dallas', venue: 'American Airlines Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 75 },
  { team: 'Phoenix Suns', city: 'Phoenix', venue: 'Footprint Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 67 },
  { team: 'Detroit Pistons', city: 'Detroit', venue: 'Little Caesars Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 67 },
  { team: 'Milwaukee Bucks', city: 'Milwaukee', venue: 'Fiserv Forum', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 70 },
  { team: 'Denver Nuggets', city: 'Denver', venue: 'Ball Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 68 },
  { team: 'Cleveland Cavaliers', city: 'Cleveland', venue: 'Rocket Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 74 },
  { team: 'Philadelphia 76ers', city: 'Philadelphia', venue: 'Wells Fargo Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 78 },
  { team: 'Oklahoma City Thunder', city: 'Oklahoma City', venue: 'Paycom Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 72 },
  { team: 'Sacramento Kings', city: 'Sacramento', venue: 'Golden 1 Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 72 },
  { team: 'New York Yankees', city: 'New York City', venue: 'Yankee Stadium', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 92 },
  { team: 'Boston Red Sox', city: 'Boston', venue: 'Fenway Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 92 },
  { team: 'Los Angeles Dodgers', city: 'Los Angeles', venue: 'Dodger Stadium', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 88 },
  { team: 'Chicago Cubs', city: 'Chicago', venue: 'Wrigley Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 90 },
  { team: 'St. Louis Cardinals', city: 'St. Louis', venue: 'Busch Stadium', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 74 },
  { team: 'Atlanta Braves', city: 'Atlanta', venue: 'Truist Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 70 },
  { team: 'Houston Astros', city: 'Houston', venue: 'Daikin Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 71 },
  { team: 'New York Mets', city: 'New York City', venue: 'Citi Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 70 },
  { team: 'San Francisco Giants', city: 'San Francisco', venue: 'Oracle Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 78 },
  { team: 'Philadelphia Phillies', city: 'Philadelphia', venue: 'Citizens Bank Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 70 },
  { team: 'Toronto Blue Jays', city: 'Toronto', venue: 'Rogers Centre', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 71 },
  { team: 'Seattle Mariners', city: 'Seattle', venue: 'T-Mobile Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 80 },
  { team: 'Detroit Tigers', city: 'Detroit', venue: 'Comerica Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 78 },
  { team: 'Cleveland Guardians', city: 'Cleveland', venue: 'Progressive Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 74 },
  { team: 'San Diego Padres', city: 'San Diego', venue: 'Petco Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 82 },
  { team: 'Montreal Canadiens', city: 'Montreal', venue: 'Bell Centre', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 85 },
  { team: 'Toronto Maple Leafs', city: 'Toronto', venue: 'Scotiabank Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 76 },
  { team: 'Boston Bruins', city: 'Boston', venue: 'TD Garden', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 80 },
  { team: 'New York Rangers', city: 'New York City', venue: 'Madison Square Garden', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 88 },
  { team: 'Detroit Red Wings', city: 'Detroit', venue: 'Little Caesars Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 69 },
  { team: 'Chicago Blackhawks', city: 'Chicago', venue: 'United Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 80 },
  { team: 'Pittsburgh Penguins', city: 'Pittsburgh', venue: 'PPG Paints Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 70 },
  { team: 'Edmonton Oilers', city: 'Edmonton', venue: 'Rogers Place', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 72 },
  { team: 'Colorado Avalanche', city: 'Denver', venue: 'Ball Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 74 },
  { team: 'Washington Capitals', city: 'Washington', venue: 'Capital One Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 77 },
  { team: 'Tampa Bay Lightning', city: 'Tampa', venue: 'Amalie Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 78 },
  { team: 'Vegas Golden Knights', city: 'Las Vegas', venue: 'T-Mobile Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 82 },
  { team: 'Arsenal', city: 'London', venue: 'Emirates Stadium', league: 'Premier League', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 84 },
  { team: 'Liverpool', city: 'Liverpool', venue: 'Anfield', league: 'Premier League', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 90 },
  { team: 'Manchester United', city: 'Manchester', venue: 'Old Trafford', league: 'Premier League', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 92 },
  { team: 'Manchester City', city: 'Manchester', venue: 'Etihad Stadium', league: 'Premier League', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 86 },
  { team: 'Chelsea', city: 'London', venue: 'Stamford Bridge', league: 'Premier League', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 82 },
  { team: 'Barcelona', city: 'Barcelona', venue: 'Camp Nou', league: 'La Liga', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 92 },
  { team: 'Real Madrid', city: 'Madrid', venue: 'Santiago Bernabeu', league: 'La Liga', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 92 },
  { team: 'Bayern Munich', city: 'Munich', venue: 'Allianz Arena', league: 'Bundesliga', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 88 },
  { team: 'Juventus', city: 'Turin', venue: 'Allianz Stadium', league: 'Serie A', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 78 },
  { team: 'Paris Saint-Germain', city: 'Paris', venue: 'Parc des Princes', league: 'Ligue 1', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 80 },
];

const SPORTS_PLAYER_CARDS: PlayerCard[] = [
  { name: 'Tom Brady', subdomain: 'football', sportLabel: 'football', team: 'New England Patriots', position: 'quarterback', nickname: 'TB12', salience: 96 },
  { name: 'Patrick Mahomes', subdomain: 'football', sportLabel: 'football', team: 'Kansas City Chiefs', position: 'quarterback', nickname: 'Showtime', salience: 92 },
  { name: 'Jerry Rice', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'wide receiver', salience: 90 },
  { name: 'Barry Sanders', subdomain: 'football', sportLabel: 'football', team: 'Detroit Lions', position: 'running back', salience: 88 },
  { name: 'Lawrence Taylor', subdomain: 'football', sportLabel: 'football', team: 'New York Giants', position: 'linebacker', salience: 86 },
  { name: 'Deion Sanders', subdomain: 'football', sportLabel: 'football', team: 'Dallas Cowboys', position: 'cornerback', nickname: 'Prime Time', salience: 86 },
  { name: 'Joe Montana', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'quarterback', nickname: 'Joe Cool', achievementPrompt: 'Joe Montana won four Super Bowls primarily with which franchise?', achievementAnswer: 'San Francisco 49ers', achievementOptions: ['San Francisco 49ers', 'Dallas Cowboys', 'Denver Broncos'], salience: 93 },
  { name: 'Peyton Manning', subdomain: 'football', sportLabel: 'football', team: 'Indianapolis Colts', position: 'quarterback', nickname: 'The Sheriff', salience: 92 },
  { name: 'Walter Payton', subdomain: 'football', sportLabel: 'football', team: 'Chicago Bears', position: 'running back', nickname: 'Sweetness', salience: 90 },
  { name: 'Emmitt Smith', subdomain: 'football', sportLabel: 'football', team: 'Dallas Cowboys', position: 'running back', achievementPrompt: 'Emmitt Smith is best known for leading the NFL in which career category?', achievementAnswer: 'Rushing yards', achievementOptions: ['Rushing yards', 'Passing touchdowns', 'Interceptions'], salience: 88 },
  { name: 'Michael Jordan', subdomain: 'basketball', sportLabel: 'basketball', team: 'Chicago Bulls', position: 'shooting guard', nickname: 'His Airness', salience: 98 },
  { name: 'LeBron James', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'forward', nickname: 'King James', salience: 96 },
  { name: 'Stephen Curry', subdomain: 'basketball', sportLabel: 'basketball', team: 'Golden State Warriors', position: 'point guard', nickname: 'Chef Curry', salience: 94 },
  { name: 'Kobe Bryant', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'shooting guard', nickname: 'Black Mamba', salience: 93 },
  { name: 'Magic Johnson', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'point guard', nickname: 'Magic', salience: 91 },
  { name: 'Larry Bird', subdomain: 'basketball', sportLabel: 'basketball', team: 'Boston Celtics', position: 'forward', nickname: 'Larry Legend', salience: 90 },
  { name: "Shaquille O'Neal", subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'center', nickname: 'Shaq', achievementPrompt: "Shaquille O'Neal won most of his NBA championships with which team?", achievementAnswer: 'Los Angeles Lakers', achievementOptions: ['Los Angeles Lakers', 'Orlando Magic', 'Miami Heat'], salience: 94 },
  { name: 'Kareem Abdul-Jabbar', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'center', achievementPrompt: 'Which signature shot is most associated with Kareem Abdul-Jabbar?', achievementAnswer: 'The skyhook', achievementOptions: ['The skyhook', 'The euro step', 'The step-back three'], salience: 93 },
  { name: 'Tim Duncan', subdomain: 'basketball', sportLabel: 'basketball', team: 'San Antonio Spurs', position: 'forward', nickname: 'The Big Fundamental', salience: 90 },
  { name: 'Wilt Chamberlain', subdomain: 'basketball', sportLabel: 'basketball', team: 'Philadelphia 76ers', position: 'center', achievementPrompt: 'Wilt Chamberlain is famously tied to how many points in one NBA game?', achievementAnswer: '100', achievementOptions: ['100', '81', '73'], salience: 91 },
  { name: 'Babe Ruth', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'outfielder', nickname: 'The Sultan of Swat', salience: 96 },
  { name: 'Jackie Robinson', subdomain: 'baseball', sportLabel: 'baseball', team: 'Brooklyn Dodgers', position: 'second baseman', salience: 95 },
  { name: 'Hank Aaron', subdomain: 'baseball', sportLabel: 'baseball', team: 'Atlanta Braves', position: 'right fielder', nickname: 'Hammerin Hank', salience: 93 },
  { name: 'Derek Jeter', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'shortstop', nickname: 'The Captain', salience: 92 },
  { name: 'Ken Griffey Jr.', subdomain: 'baseball', sportLabel: 'baseball', team: 'Seattle Mariners', position: 'center fielder', nickname: 'The Kid', salience: 90 },
  { name: 'Mariano Rivera', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'closer', nickname: 'Mo', salience: 90 },
  { name: 'Shohei Ohtani', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Dodgers', position: 'designated hitter', achievementPrompt: 'Shohei Ohtani is famous for starring in which rare combination of roles?', achievementAnswer: 'Hitting and pitching', achievementOptions: ['Hitting and pitching', 'Pitching and catching', 'Managing and pitching'], salience: 96 },
  { name: 'Cal Ripken Jr.', subdomain: 'baseball', sportLabel: 'baseball', team: 'Baltimore Orioles', position: 'shortstop', nickname: 'Iron Man', salience: 90 },
  { name: 'Nolan Ryan', subdomain: 'baseball', sportLabel: 'baseball', team: 'Texas Rangers', position: 'pitcher', nickname: 'The Ryan Express', salience: 89 },
  { name: 'Albert Pujols', subdomain: 'baseball', sportLabel: 'baseball', team: 'St. Louis Cardinals', position: 'first baseman', nickname: 'The Machine', salience: 88 },
  { name: 'Ted Williams', subdomain: 'baseball', sportLabel: 'baseball', team: 'Boston Red Sox', position: 'left fielder', nickname: 'The Splendid Splinter', salience: 92 },
  { name: 'Pete Rose', subdomain: 'baseball', sportLabel: 'baseball', team: 'Cincinnati Reds', position: 'outfielder', nickname: 'Charlie Hustle', salience: 89 },
  { name: 'Joe DiMaggio', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'center fielder', nickname: "Joltin' Joe", salience: 91 },
  { name: 'Yogi Berra', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'catcher', nickname: 'Yogi', salience: 88 },
  { name: 'Mike Schmidt', subdomain: 'baseball', sportLabel: 'baseball', team: 'Philadelphia Phillies', position: 'third baseman', salience: 87 },
  { name: 'Wayne Gretzky', subdomain: 'hockey', sportLabel: 'hockey', team: 'Edmonton Oilers', position: 'center', nickname: 'The Great One', salience: 97 },
  { name: 'Sidney Crosby', subdomain: 'hockey', sportLabel: 'hockey', team: 'Pittsburgh Penguins', position: 'center', nickname: 'Sid the Kid', salience: 89 },
  { name: 'Alex Ovechkin', subdomain: 'hockey', sportLabel: 'hockey', team: 'Washington Capitals', position: 'left wing', nickname: 'The Great Eight', salience: 88 },
  { name: 'Patrick Roy', subdomain: 'hockey', sportLabel: 'hockey', team: 'Montreal Canadiens', position: 'goaltender', salience: 85 },
  { name: 'Mario Lemieux', subdomain: 'hockey', sportLabel: 'hockey', team: 'Pittsburgh Penguins', position: 'center', nickname: 'Super Mario', salience: 90 },
  { name: 'Martin Brodeur', subdomain: 'hockey', sportLabel: 'hockey', team: 'New Jersey Devils', position: 'goaltender', salience: 86 },
  { name: 'Connor McDavid', subdomain: 'hockey', sportLabel: 'hockey', team: 'Edmonton Oilers', position: 'center', salience: 90 },
  { name: 'Bobby Orr', subdomain: 'hockey', sportLabel: 'hockey', team: 'Boston Bruins', position: 'defenseman', salience: 92 },
  { name: 'Joe Sakic', subdomain: 'hockey', sportLabel: 'hockey', team: 'Colorado Avalanche', position: 'center', salience: 88 },
  { name: 'Mark Messier', subdomain: 'hockey', sportLabel: 'hockey', team: 'Edmonton Oilers', position: 'center', salience: 89 },
  { name: 'Maurice Richard', subdomain: 'hockey', sportLabel: 'hockey', team: 'Montreal Canadiens', position: 'right wing', nickname: 'The Rocket', salience: 89 },
  { name: 'Patrick Kane', subdomain: 'hockey', sportLabel: 'hockey', team: 'Chicago Blackhawks', position: 'right wing', salience: 84 },
  { name: 'Tiger Woods', subdomain: 'golf', sportLabel: 'golf', nickname: 'Tiger', achievementPrompt: 'Which major tournament is most closely associated with Tiger Woods and his first big professional breakthrough?', achievementAnswer: 'The Masters', achievementOptions: ['The Masters', 'The Open Championship', 'The Ryder Cup'], salience: 97 },
  { name: 'Jack Nicklaus', subdomain: 'golf', sportLabel: 'golf', nickname: 'The Golden Bear', achievementPrompt: 'Which golfer is nicknamed The Golden Bear?', achievementAnswer: 'Jack Nicklaus', achievementOptions: ['Jack Nicklaus', 'Arnold Palmer', 'Ben Hogan'], salience: 95 },
  { name: 'Arnold Palmer', subdomain: 'golf', sportLabel: 'golf', nickname: 'The King', salience: 89 },
  { name: 'Phil Mickelson', subdomain: 'golf', sportLabel: 'golf', nickname: 'Lefty', salience: 88 },
  { name: 'Serena Williams', subdomain: 'tennis', sportLabel: 'tennis', nickname: 'Serena', achievementPrompt: 'Serena Williams won most of her Grand Slam singles titles while representing which country?', achievementAnswer: 'The United States', achievementOptions: ['The United States', 'Canada', 'Australia'], salience: 96 },
  { name: 'Roger Federer', subdomain: 'tennis', sportLabel: 'tennis', nickname: 'Federer', achievementPrompt: 'Roger Federer is from which country?', achievementAnswer: 'Switzerland', achievementOptions: ['Switzerland', 'Austria', 'Germany'], salience: 93 },
  { name: 'Rafael Nadal', subdomain: 'tennis', sportLabel: 'tennis', nickname: 'Rafa', achievementPrompt: 'Rafael Nadal is most strongly associated with success on which surface?', achievementAnswer: 'Clay', achievementOptions: ['Clay', 'Grass', 'Carpet'], salience: 94 },
  { name: 'Novak Djokovic', subdomain: 'tennis', sportLabel: 'tennis', nickname: 'Djokovic', achievementPrompt: 'Novak Djokovic represents which country?', achievementAnswer: 'Serbia', achievementOptions: ['Serbia', 'Croatia', 'Slovenia'], salience: 91 },
  { name: 'Billie Jean King', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Billie Jean King won the famous Battle of the Sexes against which player?', achievementAnswer: 'Bobby Riggs', achievementOptions: ['Bobby Riggs', 'John McEnroe', 'Jimmy Connors'], salience: 89 },
  { name: 'Pete Sampras', subdomain: 'tennis', sportLabel: 'tennis', salience: 87 },
  { name: 'Andre Agassi', subdomain: 'tennis', sportLabel: 'tennis', salience: 88 },
  { name: 'Michael Phelps', subdomain: 'olympics', sportLabel: 'swimming', nickname: 'Phelps', achievementPrompt: 'Michael Phelps won the most Olympic medals in which sport?', achievementAnswer: 'Swimming', achievementOptions: ['Swimming', 'Gymnastics', 'Track and field'], salience: 97 },
  { name: 'Simone Biles', subdomain: 'olympics', sportLabel: 'gymnastics', nickname: 'Biles', achievementPrompt: 'Simone Biles is best known for starring in which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Swimming', 'Fencing'], salience: 95 },
  { name: 'Usain Bolt', subdomain: 'olympics', sportLabel: 'track and field', nickname: 'Lightning Bolt', achievementPrompt: 'Usain Bolt became famous in the Olympics for dominating which type of event?', achievementAnswer: 'Sprinting', achievementOptions: ['Sprinting', 'Shot put', 'Pole vault'], salience: 97 },
  { name: 'Katie Ledecky', subdomain: 'olympics', sportLabel: 'swimming', achievementPrompt: 'Katie Ledecky is best known for dominating which kind of Olympic races?', achievementAnswer: 'Distance freestyle races', achievementOptions: ['Distance freestyle races', 'Diving finals', 'Javelin throws'], salience: 92 },
  { name: 'Carl Lewis', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Carl Lewis won Olympic gold medals most famously in sprinting and which other event?', achievementAnswer: 'The long jump', achievementOptions: ['The long jump', 'The discus', 'The decathlon'], salience: 90 },
  { name: 'Ayrton Senna', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'McLaren', nickname: 'Senna', salience: 91 },
  { name: 'Lewis Hamilton', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Mercedes', salience: 90 },
  { name: 'Dale Earnhardt', subdomain: 'motorsport', sportLabel: 'motorsport', nickname: 'The Intimidator', salience: 92 },
  { name: 'Jeff Gordon', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Hendrick Motorsports', salience: 88 },
  { name: 'Richard Petty', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Petty Enterprises', nickname: 'The King', salience: 90 },
  { name: 'Max Verstappen', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Red Bull Racing', salience: 90 },
  { name: 'Jimmie Johnson', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Hendrick Motorsports', salience: 87 },
  { name: 'Muhammad Ali', subdomain: 'combat', sportLabel: 'boxing', nickname: 'The Greatest', salience: 98 },
  { name: 'Mike Tyson', subdomain: 'combat', sportLabel: 'boxing', nickname: 'Iron Mike', salience: 91 },
  { name: 'Floyd Mayweather Jr.', subdomain: 'combat', sportLabel: 'boxing', nickname: 'Money', salience: 90 },
  { name: 'Ronda Rousey', subdomain: 'combat', sportLabel: 'mma', nickname: 'Rowdy', salience: 84 },
  { name: 'Mia Hamm', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States women', position: 'forward', salience: 90 },
  { name: 'Lionel Messi', subdomain: 'soccer', sportLabel: 'soccer', team: 'Argentina', position: 'forward', nickname: 'La Pulga', salience: 98 },
  { name: 'Cristiano Ronaldo', subdomain: 'soccer', sportLabel: 'soccer', team: 'Portugal', position: 'forward', salience: 98 },
  { name: 'David Beckham', subdomain: 'soccer', sportLabel: 'soccer', team: 'England', position: 'midfielder', salience: 91 },
  { name: 'Pele', subdomain: 'soccer', sportLabel: 'soccer', team: 'Brazil', position: 'forward', salience: 98 },
  { name: 'Megan Rapinoe', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States women', position: 'winger', salience: 89 },
];

const SPORTS_TEAM_CARD_EXPANSION: TeamCard[] = [
  { team: 'New Orleans Saints', city: 'New Orleans', venue: 'Caesars Superdome', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 84 },
  { team: 'Los Angeles Rams', city: 'Inglewood', venue: 'SoFi Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 88 },
  { team: 'Indianapolis Colts', city: 'Indianapolis', venue: 'Lucas Oil Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 82 },
  { team: 'New York Jets', city: 'East Rutherford', venue: 'MetLife Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 78 },
  { team: 'Orlando Magic', city: 'Orlando', venue: 'Kia Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 70 },
  { team: 'Brooklyn Nets', city: 'Brooklyn', venue: 'Barclays Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 77 },
  { team: 'Minnesota Timberwolves', city: 'Minneapolis', venue: 'Target Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 71 },
  { team: 'Baltimore Orioles', city: 'Baltimore', venue: 'Oriole Park at Camden Yards', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 86 },
  { team: 'Texas Rangers', city: 'Arlington', venue: 'Globe Life Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 79 },
  { team: 'Milwaukee Brewers', city: 'Milwaukee', venue: 'American Family Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 74 },
  { team: 'Los Angeles Kings', city: 'Los Angeles', venue: 'Crypto.com Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 84 },
  { team: 'Philadelphia Flyers', city: 'Philadelphia', venue: 'Wells Fargo Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 76 },
  { team: 'New Jersey Devils', city: 'Newark', venue: 'Prudential Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 72 },
];

const SPORTS_PLAYER_CARD_EXPANSION: PlayerCard[] = [
  { name: 'Aaron Rodgers', subdomain: 'football', sportLabel: 'football', team: 'Green Bay Packers', position: 'quarterback', salience: 92 },
  { name: 'Dan Marino', subdomain: 'football', sportLabel: 'football', team: 'Miami Dolphins', position: 'quarterback', salience: 90 },
  { name: 'Brett Favre', subdomain: 'football', sportLabel: 'football', team: 'Green Bay Packers', position: 'quarterback', salience: 89 },
  { name: 'Troy Aikman', subdomain: 'football', sportLabel: 'football', team: 'Dallas Cowboys', position: 'quarterback', salience: 88 },
  { name: 'Travis Kelce', subdomain: 'football', sportLabel: 'football', team: 'Kansas City Chiefs', position: 'tight end', salience: 90 },
  { name: 'Kevin Durant', subdomain: 'basketball', sportLabel: 'basketball', team: 'Phoenix Suns', position: 'forward', nickname: 'KD', salience: 92 },
  { name: 'Giannis Antetokounmpo', subdomain: 'basketball', sportLabel: 'basketball', team: 'Milwaukee Bucks', position: 'forward', nickname: 'The Greek Freak', salience: 92 },
  { name: 'Allen Iverson', subdomain: 'basketball', sportLabel: 'basketball', team: 'Philadelphia 76ers', position: 'guard', nickname: 'The Answer', salience: 90 },
  { name: 'Dirk Nowitzki', subdomain: 'basketball', sportLabel: 'basketball', team: 'Dallas Mavericks', position: 'forward', salience: 89 },
  { name: 'Dwyane Wade', subdomain: 'basketball', sportLabel: 'basketball', team: 'Miami Heat', position: 'guard', salience: 88 },
  { name: 'Hakeem Olajuwon', subdomain: 'basketball', sportLabel: 'basketball', team: 'Houston Rockets', position: 'center', nickname: 'The Dream', salience: 90 },
  { name: 'Ichiro Suzuki', subdomain: 'baseball', sportLabel: 'baseball', team: 'Seattle Mariners', position: 'outfielder', salience: 91 },
  { name: 'David Ortiz', subdomain: 'baseball', sportLabel: 'baseball', team: 'Boston Red Sox', position: 'designated hitter', nickname: 'Big Papi', salience: 91 },
  { name: 'Clayton Kershaw', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Dodgers', position: 'pitcher', salience: 90 },
  { name: 'Pedro Martinez', subdomain: 'baseball', sportLabel: 'baseball', team: 'Boston Red Sox', position: 'pitcher', salience: 89 },
  { name: 'Gordie Howe', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'right wing', nickname: 'Mr. Hockey', salience: 93 },
  { name: 'Dominik Hasek', subdomain: 'hockey', sportLabel: 'hockey', team: 'Buffalo Sabres', position: 'goaltender', nickname: 'The Dominator', salience: 87 },
  { name: 'Jaromir Jagr', subdomain: 'hockey', sportLabel: 'hockey', team: 'Pittsburgh Penguins', position: 'right wing', salience: 88 },
  { name: 'Steve Yzerman', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'center', salience: 88 },
  { name: 'Rory McIlroy', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Rory McIlroy is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Cricket'], salience: 90 },
  { name: 'Scottie Scheffler', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Scottie Scheffler is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 88 },
  { name: 'Venus Williams', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Venus Williams is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Track and field', 'Golf'], salience: 91 },
  { name: 'Coco Gauff', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Coco Gauff is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Gymnastics', 'Soccer'], salience: 88 },
  { name: 'Allyson Felix', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Allyson Felix became famous in the Olympics for excelling in which kind of events?', achievementAnswer: 'Sprint events', achievementOptions: ['Sprint events', 'Diving finals', 'Cycling time trials'], salience: 90 },
  { name: 'Shaun White', subdomain: 'olympics', sportLabel: 'snowboarding', nickname: 'The Flying Tomato', achievementPrompt: 'Shaun White is most closely associated with which Olympic sport?', achievementAnswer: 'Snowboarding', achievementOptions: ['Snowboarding', 'Speed skating', 'Curling'], salience: 90 },
];

const SPORTS_TEAM_CARD_EXPANSION_TWO: TeamCard[] = [
  { team: 'Detroit Lions', city: 'Detroit', venue: 'Ford Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 82 },
  { team: 'Minnesota Vikings', city: 'Minneapolis', venue: 'U.S. Bank Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 84 },
  { team: 'Tampa Bay Buccaneers', city: 'Tampa', venue: 'Raymond James Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 81 },
  { team: 'Washington Commanders', city: 'Landover', venue: 'Northwest Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 72 },
  { team: 'Houston Rockets', city: 'Houston', venue: 'Toyota Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 76 },
  { team: 'Atlanta Hawks', city: 'Atlanta', venue: 'State Farm Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 74 },
  { team: 'Indiana Pacers', city: 'Indianapolis', venue: 'Gainbridge Fieldhouse', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 73 },
  { team: 'Portland Trail Blazers', city: 'Portland', venue: 'Moda Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 72 },
  { team: 'Cincinnati Reds', city: 'Cincinnati', venue: 'Great American Ball Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 78 },
  { team: 'Kansas City Royals', city: 'Kansas City', venue: 'Kauffman Stadium', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 82 },
  { team: 'Minnesota Twins', city: 'Minneapolis', venue: 'Target Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 75 },
  { team: 'Los Angeles Angels', city: 'Anaheim', venue: 'Angel Stadium', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 80 },
  { team: 'St. Louis Blues', city: 'St. Louis', venue: 'Enterprise Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 77 },
  { team: 'Buffalo Sabres', city: 'Buffalo', venue: 'KeyBank Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 73 },
  { team: 'Minnesota Wild', city: 'Saint Paul', venue: 'Xcel Energy Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 74 },
  { team: 'Anaheim Ducks', city: 'Anaheim', venue: 'Honda Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 74 },
];

const SPORTS_PLAYER_CARD_EXPANSION_TWO: PlayerCard[] = [
  { name: 'Josh Allen', subdomain: 'football', sportLabel: 'football', team: 'Buffalo Bills', position: 'quarterback', salience: 90 },
  { name: 'Lamar Jackson', subdomain: 'football', sportLabel: 'football', team: 'Baltimore Ravens', position: 'quarterback', salience: 90 },
  { name: 'Randy Moss', subdomain: 'football', sportLabel: 'football', team: 'Minnesota Vikings', position: 'wide receiver', salience: 91 },
  { name: 'Terry Bradshaw', subdomain: 'football', sportLabel: 'football', team: 'Pittsburgh Steelers', position: 'quarterback', salience: 88 },
  { name: 'Joe Burrow', subdomain: 'football', sportLabel: 'football', team: 'Cincinnati Bengals', position: 'quarterback', salience: 88 },
  { name: 'Calvin Johnson', subdomain: 'football', sportLabel: 'football', team: 'Detroit Lions', position: 'wide receiver', nickname: 'Megatron', salience: 89 },
  { name: 'Nikola Jokic', subdomain: 'basketball', sportLabel: 'basketball', team: 'Denver Nuggets', position: 'center', salience: 92 },
  { name: 'Jayson Tatum', subdomain: 'basketball', sportLabel: 'basketball', team: 'Boston Celtics', position: 'forward', salience: 90 },
  { name: 'Charles Barkley', subdomain: 'basketball', sportLabel: 'basketball', team: 'Phoenix Suns', position: 'forward', nickname: 'Sir Charles', salience: 90 },
  { name: 'Scottie Pippen', subdomain: 'basketball', sportLabel: 'basketball', team: 'Chicago Bulls', position: 'forward', salience: 89 },
  { name: 'Kevin Garnett', subdomain: 'basketball', sportLabel: 'basketball', team: 'Boston Celtics', position: 'forward', nickname: 'KG', salience: 88 },
  { name: 'Julius Erving', subdomain: 'basketball', sportLabel: 'basketball', team: 'Philadelphia 76ers', position: 'forward', nickname: 'Dr. J', salience: 90 },
  { name: 'Aaron Judge', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'outfielder', salience: 92 },
  { name: 'Rickey Henderson', subdomain: 'baseball', sportLabel: 'baseball', team: 'Oakland Athletics', position: 'left fielder', salience: 89 },
  { name: 'Mookie Betts', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Dodgers', position: 'outfielder', salience: 89 },
  { name: 'Sandy Koufax', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Dodgers', position: 'pitcher', salience: 90 },
  { name: 'Reggie Jackson', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'outfielder', nickname: 'Mr. October', salience: 89 },
  { name: 'Ozzie Smith', subdomain: 'baseball', sportLabel: 'baseball', team: 'St. Louis Cardinals', position: 'shortstop', nickname: 'The Wizard', salience: 87 },
  { name: 'Auston Matthews', subdomain: 'hockey', sportLabel: 'hockey', team: 'Toronto Maple Leafs', position: 'center', salience: 90 },
  { name: 'Henrik Lundqvist', subdomain: 'hockey', sportLabel: 'hockey', team: 'New York Rangers', position: 'goaltender', nickname: 'The King', salience: 88 },
  { name: 'Pavel Datsyuk', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'center', salience: 87 },
  { name: 'Chris Chelios', subdomain: 'hockey', sportLabel: 'hockey', team: 'Chicago Blackhawks', position: 'defenseman', salience: 86 },
  { name: 'Jordan Spieth', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Jordan Spieth is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 87 },
  { name: 'Brooks Koepka', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Brooks Koepka is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Soccer'], salience: 86 },
  { name: 'Andy Roddick', subdomain: 'tennis', sportLabel: 'tennis', salience: 87 },
  { name: 'Martina Navratilova', subdomain: 'tennis', sportLabel: 'tennis', salience: 90 },
  { name: 'Michael Johnson', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Michael Johnson became famous in the Olympics for starring in which kind of events?', achievementAnswer: 'Sprint events', achievementOptions: ['Sprint events', 'Diving finals', 'Rowing races'], salience: 90 },
  { name: 'Gabby Douglas', subdomain: 'olympics', sportLabel: 'gymnastics', achievementPrompt: 'Gabby Douglas is most closely associated with which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Swimming', 'Cycling'], salience: 88 },
];

const SPORTS_TEAM_CARD_EXPANSION_THREE: TeamCard[] = [
  { team: 'Houston Texans', city: 'Houston', venue: 'NRG Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 80 },
  { team: 'Cleveland Browns', city: 'Cleveland', venue: 'Huntington Bank Field', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 77 },
  { team: 'Jacksonville Jaguars', city: 'Jacksonville', venue: 'EverBank Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 75 },
  { team: 'Atlanta Falcons', city: 'Atlanta', venue: 'Mercedes-Benz Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 84 },
  { team: 'Carolina Panthers', city: 'Charlotte', venue: 'Bank of America Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 77 },
  { team: 'Tennessee Titans', city: 'Nashville', venue: 'Nissan Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 76 },
  { team: 'Arizona Cardinals', city: 'Glendale', venue: 'State Farm Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 79 },
  { team: 'Los Angeles Chargers', city: 'Inglewood', venue: 'SoFi Stadium', league: 'NFL', sportLabel: 'football', subdomain: 'football', venueSalience: 86 },
  { team: 'Los Angeles Clippers', city: 'Los Angeles', venue: 'Intuit Dome', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 81 },
  { team: 'Toronto Raptors', city: 'Toronto', venue: 'Scotiabank Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 80 },
  { team: 'Washington Wizards', city: 'Washington', venue: 'Capital One Arena', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 73 },
  { team: 'Charlotte Hornets', city: 'Charlotte', venue: 'Spectrum Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 70 },
  { team: 'Utah Jazz', city: 'Salt Lake City', venue: 'Delta Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 78 },
  { team: 'Memphis Grizzlies', city: 'Memphis', venue: 'FedExForum', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 72 },
  { team: 'New Orleans Pelicans', city: 'New Orleans', venue: 'Smoothie King Center', league: 'NBA', sportLabel: 'basketball', subdomain: 'basketball', venueSalience: 70 },
  { team: 'Chicago White Sox', city: 'Chicago', venue: 'Rate Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 77 },
  { team: 'Tampa Bay Rays', city: 'St. Petersburg', venue: 'George M. Steinbrenner Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 67 },
  { team: 'Arizona Diamondbacks', city: 'Phoenix', venue: 'Chase Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 79 },
  { team: 'Colorado Rockies', city: 'Denver', venue: 'Coors Field', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 83 },
  { team: 'Pittsburgh Pirates', city: 'Pittsburgh', venue: 'PNC Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 84 },
  { team: 'Miami Marlins', city: 'Miami', venue: 'loanDepot park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 69 },
  { team: 'Washington Nationals', city: 'Washington', venue: 'Nationals Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 74 },
  { team: 'Oakland Athletics', city: 'West Sacramento', venue: 'Sutter Health Park', league: 'MLB', sportLabel: 'baseball', subdomain: 'baseball', venueSalience: 66 },
  { team: 'Dallas Stars', city: 'Dallas', venue: 'American Airlines Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 79 },
  { team: 'Carolina Hurricanes', city: 'Raleigh', venue: 'Lenovo Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 75 },
  { team: 'Calgary Flames', city: 'Calgary', venue: 'Scotiabank Saddledome', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 80 },
  { team: 'Winnipeg Jets', city: 'Winnipeg', venue: 'Canada Life Centre', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 73 },
  { team: 'Ottawa Senators', city: 'Ottawa', venue: 'Canadian Tire Centre', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 72 },
  { team: 'Columbus Blue Jackets', city: 'Columbus', venue: 'Nationwide Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 73 },
  { team: 'Nashville Predators', city: 'Nashville', venue: 'Bridgestone Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 77 },
  { team: 'Vancouver Canucks', city: 'Vancouver', venue: 'Rogers Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 78 },
];

const SPORTS_PLAYER_CARD_EXPANSION_THREE: PlayerCard[] = [
  { name: 'Steve Young', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'quarterback', salience: 90 },
  { name: 'Drew Brees', subdomain: 'football', sportLabel: 'football', team: 'New Orleans Saints', position: 'quarterback', salience: 92 },
  { name: 'Jim Brown', subdomain: 'football', sportLabel: 'football', team: 'Cleveland Browns', position: 'running back', salience: 90 },
  { name: 'Joe Namath', subdomain: 'football', sportLabel: 'football', team: 'New York Jets', position: 'quarterback', nickname: 'Broadway Joe', salience: 89 },
  { name: 'Aaron Donald', subdomain: 'football', sportLabel: 'football', team: 'Los Angeles Rams', position: 'defensive tackle', salience: 88 },
  { name: 'Reggie White', subdomain: 'football', sportLabel: 'football', team: 'Green Bay Packers', position: 'defensive end', nickname: 'The Minister of Defense', salience: 89 },
  { name: 'Adrian Peterson', subdomain: 'football', sportLabel: 'football', team: 'Minnesota Vikings', position: 'running back', salience: 88 },
  { name: 'Rob Gronkowski', subdomain: 'football', sportLabel: 'football', team: 'New England Patriots', position: 'tight end', nickname: 'Gronk', salience: 90 },
  { name: 'Tony Gonzalez', subdomain: 'football', sportLabel: 'football', team: 'Kansas City Chiefs', position: 'tight end', salience: 88 },
  { name: 'Steve Nash', subdomain: 'basketball', sportLabel: 'basketball', team: 'Phoenix Suns', position: 'point guard', salience: 89 },
  { name: 'Chris Paul', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Clippers', position: 'point guard', nickname: 'CP3', salience: 89 },
  { name: 'Kawhi Leonard', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Clippers', position: 'forward', salience: 90 },
  { name: 'Luka Doncic', subdomain: 'basketball', sportLabel: 'basketball', team: 'Dallas Mavericks', position: 'guard', salience: 92 },
  { name: 'James Harden', subdomain: 'basketball', sportLabel: 'basketball', team: 'Houston Rockets', position: 'guard', nickname: 'The Beard', salience: 89 },
  { name: 'Patrick Ewing', subdomain: 'basketball', sportLabel: 'basketball', team: 'New York Knicks', position: 'center', salience: 88 },
  { name: 'Reggie Miller', subdomain: 'basketball', sportLabel: 'basketball', team: 'Indiana Pacers', position: 'guard', salience: 88 },
  { name: 'David Robinson', subdomain: 'basketball', sportLabel: 'basketball', team: 'San Antonio Spurs', position: 'center', nickname: 'The Admiral', salience: 88 },
  { name: 'Oscar Robertson', subdomain: 'basketball', sportLabel: 'basketball', team: 'Milwaukee Bucks', position: 'guard', nickname: 'The Big O', salience: 89 },
  { name: 'Mike Trout', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Angels', position: 'center fielder', salience: 93 },
  { name: 'Greg Maddux', subdomain: 'baseball', sportLabel: 'baseball', team: 'Atlanta Braves', position: 'pitcher', salience: 89 },
  { name: 'Randy Johnson', subdomain: 'baseball', sportLabel: 'baseball', team: 'Arizona Diamondbacks', position: 'pitcher', nickname: 'The Big Unit', salience: 89 },
  { name: 'Tony Gwynn', subdomain: 'baseball', sportLabel: 'baseball', team: 'San Diego Padres', position: 'right fielder', salience: 89 },
  { name: 'Chipper Jones', subdomain: 'baseball', sportLabel: 'baseball', team: 'Atlanta Braves', position: 'third baseman', salience: 87 },
  { name: 'Frank Thomas', subdomain: 'baseball', sportLabel: 'baseball', team: 'Chicago White Sox', position: 'first baseman', nickname: 'The Big Hurt', salience: 88 },
  { name: 'George Brett', subdomain: 'baseball', sportLabel: 'baseball', team: 'Kansas City Royals', position: 'third baseman', salience: 87 },
  { name: 'Jonathan Toews', subdomain: 'hockey', sportLabel: 'hockey', team: 'Chicago Blackhawks', position: 'center', salience: 86 },
  { name: 'Nicklas Lidstrom', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'defenseman', salience: 88 },
  { name: 'Joe Thornton', subdomain: 'hockey', sportLabel: 'hockey', team: 'San Jose Sharks', position: 'center', salience: 86 },
  { name: 'Carey Price', subdomain: 'hockey', sportLabel: 'hockey', team: 'Montreal Canadiens', position: 'goaltender', salience: 87 },
  { name: 'Jonathan Quick', subdomain: 'hockey', sportLabel: 'hockey', team: 'Los Angeles Kings', position: 'goaltender', salience: 84 },
  { name: 'Annika Sorenstam', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Annika Sorenstam became famous in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Skiing'], salience: 90 },
  { name: 'Nelly Korda', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Nelly Korda is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Gymnastics'], salience: 88 },
  { name: 'Tom Watson', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Tom Watson is associated with success in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 86 },
  { name: 'Ben Hogan', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Ben Hogan became famous in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Horse racing', 'Tennis'], salience: 88 },
  { name: 'John McEnroe', subdomain: 'tennis', sportLabel: 'tennis', salience: 89 },
  { name: 'Steffi Graf', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Steffi Graf is the player most associated with which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Golf', 'Figure skating'], salience: 92 },
  { name: 'Andy Murray', subdomain: 'tennis', sportLabel: 'tennis', salience: 88 },
  { name: 'Naomi Osaka', subdomain: 'tennis', sportLabel: 'tennis', salience: 88 },
  { name: 'Iga Swiatek', subdomain: 'tennis', sportLabel: 'tennis', salience: 87 },
  { name: 'Jesse Owens', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Jesse Owens became famous in the Olympics for excelling in which sport family?', achievementAnswer: 'Track and field', achievementOptions: ['Track and field', 'Swimming', 'Rowing'], salience: 92 },
  { name: 'Nadia Comaneci', subdomain: 'olympics', sportLabel: 'gymnastics', achievementPrompt: 'Nadia Comaneci is most closely associated with which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Diving', 'Cycling'], salience: 89 },
  { name: 'Apolo Ohno', subdomain: 'olympics', sportLabel: 'speed skating', achievementPrompt: 'Apolo Ohno became famous in which Olympic sport?', achievementAnswer: 'Speed skating', achievementOptions: ['Speed skating', 'Snowboarding', 'Biathlon'], salience: 87 },
  { name: 'Bode Miller', subdomain: 'olympics', sportLabel: 'skiing', achievementPrompt: 'Bode Miller is tied to Olympic success in which sport?', achievementAnswer: 'Skiing', achievementOptions: ['Skiing', 'Curling', 'Figure skating'], salience: 86 },
  { name: 'Florence Griffith Joyner', subdomain: 'olympics', sportLabel: 'track and field', nickname: 'Flo-Jo', achievementPrompt: 'Florence Griffith Joyner starred in the Olympics in which kind of events?', achievementAnswer: 'Sprint events', achievementOptions: ['Sprint events', 'Swimming relays', 'Long-distance cycling'], salience: 90 },
  { name: 'Dale Earnhardt Jr.', subdomain: 'motorsport', sportLabel: 'motorsport', team: 'Hendrick Motorsports', salience: 89 },
  { name: 'Mario Andretti', subdomain: 'motorsport', sportLabel: 'motorsport', salience: 90 },
  { name: 'A.J. Foyt', subdomain: 'motorsport', sportLabel: 'motorsport', salience: 87 },
  { name: 'Danica Patrick', subdomain: 'motorsport', sportLabel: 'motorsport', salience: 86 },
  { name: 'Sugar Ray Leonard', subdomain: 'combat', sportLabel: 'boxing', salience: 89 },
  { name: 'Manny Pacquiao', subdomain: 'combat', sportLabel: 'boxing', salience: 90 },
  { name: 'Conor McGregor', subdomain: 'combat', sportLabel: 'mma', salience: 87 },
  { name: 'Joe Louis', subdomain: 'combat', sportLabel: 'boxing', salience: 86 },
];

const SPORTS_TEAM_CARD_EXPANSION_FOUR: TeamCard[] = [
  { team: 'Seattle Kraken', city: 'Seattle', venue: 'Climate Pledge Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 79 },
  { team: 'New York Islanders', city: 'Elmont', venue: 'UBS Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 74 },
  { team: 'Florida Panthers', city: 'Sunrise', venue: 'Amerant Bank Arena', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 76 },
  { team: 'San Jose Sharks', city: 'San Jose', venue: 'SAP Center', league: 'NHL', sportLabel: 'hockey', subdomain: 'hockey', venueSalience: 75 },
];

const SPORTS_TEAM_CARD_EXPANSION_FIVE: TeamCard[] = [
  { team: 'Inter Miami CF', city: 'Fort Lauderdale', venue: 'Chase Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 82 },
  { team: 'LA Galaxy', city: 'Carson', venue: 'Dignity Health Sports Park', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 80 },
  { team: 'Los Angeles FC', city: 'Los Angeles', venue: 'BMO Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 80 },
  { team: 'Seattle Sounders FC', city: 'Seattle', venue: 'Lumen Field', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 83 },
  { team: 'Portland Timbers', city: 'Portland', venue: 'Providence Park', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 78 },
  { team: 'Atlanta United FC', city: 'Atlanta', venue: 'Mercedes-Benz Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 84 },
  { team: 'Austin FC', city: 'Austin', venue: 'Q2 Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 76 },
  { team: 'New York Red Bulls', city: 'Harrison', venue: 'Sports Illustrated Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 74 },
  { team: 'Sporting Kansas City', city: 'Kansas City', venue: "Children's Mercy Park", league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 75 },
  { team: 'St. Louis City SC', city: 'St. Louis', venue: 'Energizer Park', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 74 },
  { team: 'Orlando City SC', city: 'Orlando', venue: 'Inter&Co Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 74 },
  { team: 'FC Cincinnati', city: 'Cincinnati', venue: 'TQL Stadium', league: 'MLS', sportLabel: 'soccer', subdomain: 'soccer', venueSalience: 76 },
];

const SPORTS_PLAYER_CARD_EXPANSION_FOUR: PlayerCard[] = [
  { name: 'Joe Mauer', subdomain: 'baseball', sportLabel: 'baseball', team: 'Minnesota Twins', position: 'catcher', salience: 84 },
  { name: 'Curt Schilling', subdomain: 'baseball', sportLabel: 'baseball', team: 'Boston Red Sox', position: 'pitcher', salience: 84 },
  { name: 'Marshawn Lynch', subdomain: 'football', sportLabel: 'football', team: 'Seattle Seahawks', position: 'running back', nickname: 'Beast Mode', salience: 88 },
  { name: 'Fran Tarkenton', subdomain: 'football', sportLabel: 'football', team: 'Minnesota Vikings', position: 'quarterback', salience: 84 },
  { name: 'Isiah Thomas', subdomain: 'basketball', sportLabel: 'basketball', team: 'Detroit Pistons', position: 'guard', salience: 87 },
  { name: 'Clyde Drexler', subdomain: 'basketball', sportLabel: 'basketball', team: 'Portland Trail Blazers', position: 'guard', nickname: 'Clyde the Glide', salience: 87 },
  { name: 'Jarome Iginla', subdomain: 'hockey', sportLabel: 'hockey', team: 'Calgary Flames', position: 'right wing', salience: 86 },
  { name: 'Sergei Fedorov', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'center', salience: 86 },
  { name: 'Arthur Ashe', subdomain: 'tennis', sportLabel: 'tennis', salience: 88 },
  { name: 'Payne Stewart', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Payne Stewart rose to fame in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Auto racing'], salience: 84 },
  { name: 'Mary Lou Retton', subdomain: 'olympics', sportLabel: 'gymnastics', achievementPrompt: 'Mary Lou Retton is most closely associated with which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Swimming', 'Skiing'], salience: 86 },
  { name: 'Holly Holm', subdomain: 'combat', sportLabel: 'mma', salience: 82 },
];

const SPORTS_PLAYER_CARD_EXPANSION_FIVE: PlayerCard[] = [
  { name: 'Jerome Bettis', subdomain: 'football', sportLabel: 'football', team: 'Pittsburgh Steelers', position: 'running back', nickname: 'The Bus', salience: 89 },
  { name: 'Terrell Owens', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'wide receiver', nickname: 'T.O.', salience: 88 },
  { name: 'Marshall Faulk', subdomain: 'football', sportLabel: 'football', team: 'Los Angeles Rams', position: 'running back', salience: 88 },
  { name: 'Troy Polamalu', subdomain: 'football', sportLabel: 'football', team: 'Pittsburgh Steelers', position: 'safety', salience: 87 },
  { name: 'Matthew Stafford', subdomain: 'football', sportLabel: 'football', team: 'Los Angeles Rams', position: 'quarterback', salience: 87 },
  { name: 'Shannon Sharpe', subdomain: 'football', sportLabel: 'football', team: 'Denver Broncos', position: 'tight end', salience: 86 },
  { name: 'Thurman Thomas', subdomain: 'football', sportLabel: 'football', team: 'Buffalo Bills', position: 'running back', salience: 86 },
  { name: 'Damian Lillard', subdomain: 'basketball', sportLabel: 'basketball', team: 'Portland Trail Blazers', position: 'guard', nickname: 'Dame Time', salience: 91 },
  { name: 'Russell Westbrook', subdomain: 'basketball', sportLabel: 'basketball', team: 'Oklahoma City Thunder', position: 'guard', salience: 90 },
  { name: 'Paul Pierce', subdomain: 'basketball', sportLabel: 'basketball', team: 'Boston Celtics', position: 'forward', nickname: 'The Truth', salience: 88 },
  { name: 'Vince Carter', subdomain: 'basketball', sportLabel: 'basketball', team: 'Toronto Raptors', position: 'guard', salience: 88 },
  { name: 'Ray Allen', subdomain: 'basketball', sportLabel: 'basketball', team: 'Boston Celtics', position: 'guard', salience: 87 },
  { name: 'Jason Kidd', subdomain: 'basketball', sportLabel: 'basketball', team: 'Dallas Mavericks', position: 'guard', salience: 87 },
  { name: 'Alonzo Mourning', subdomain: 'basketball', sportLabel: 'basketball', team: 'Miami Heat', position: 'center', salience: 85 },
  { name: 'Adrian Beltre', subdomain: 'baseball', sportLabel: 'baseball', team: 'Texas Rangers', position: 'third baseman', salience: 88 },
  { name: 'Manny Ramirez', subdomain: 'baseball', sportLabel: 'baseball', team: 'Boston Red Sox', position: 'left fielder', salience: 88 },
  { name: 'Mark McGwire', subdomain: 'baseball', sportLabel: 'baseball', team: 'St. Louis Cardinals', position: 'first baseman', nickname: 'Big Mac', salience: 88 },
  { name: 'Buster Posey', subdomain: 'baseball', sportLabel: 'baseball', team: 'San Francisco Giants', position: 'catcher', salience: 88 },
  { name: 'CC Sabathia', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'pitcher', salience: 86 },
  { name: 'Trevor Hoffman', subdomain: 'baseball', sportLabel: 'baseball', team: 'San Diego Padres', position: 'closer', salience: 86 },
  { name: 'David Wright', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Mets', position: 'third baseman', salience: 86 },
  { name: 'Teemu Selanne', subdomain: 'hockey', sportLabel: 'hockey', team: 'Anaheim Ducks', position: 'right wing', salience: 88 },
  { name: 'Mike Modano', subdomain: 'hockey', sportLabel: 'hockey', team: 'Dallas Stars', position: 'center', salience: 88 },
  { name: 'Evgeni Malkin', subdomain: 'hockey', sportLabel: 'hockey', team: 'Pittsburgh Penguins', position: 'center', nickname: 'Geno', salience: 88 },
  { name: 'Marc-Andre Fleury', subdomain: 'hockey', sportLabel: 'hockey', team: 'Vegas Golden Knights', position: 'goaltender', salience: 87 },
  { name: 'Joe Pavelski', subdomain: 'hockey', sportLabel: 'hockey', team: 'San Jose Sharks', position: 'center', salience: 86 },
  { name: 'Henrik Zetterberg', subdomain: 'hockey', sportLabel: 'hockey', team: 'Detroit Red Wings', position: 'center', salience: 86 },
  { name: 'Luc Robitaille', subdomain: 'hockey', sportLabel: 'hockey', team: 'Los Angeles Kings', position: 'left wing', salience: 85 },
  { name: 'Sergei Bobrovsky', subdomain: 'hockey', sportLabel: 'hockey', team: 'Florida Panthers', position: 'goaltender', salience: 84 },
];

const SPORTS_PLAYER_CARD_EXPANSION_SIX: PlayerCard[] = [
  { name: 'Jalen Hurts', subdomain: 'football', sportLabel: 'football', team: 'Philadelphia Eagles', position: 'quarterback', salience: 90 },
  { name: 'Justin Jefferson', subdomain: 'football', sportLabel: 'football', team: 'Minnesota Vikings', position: 'wide receiver', nickname: 'Jets', salience: 91 },
  { name: 'Tyreek Hill', subdomain: 'football', sportLabel: 'football', team: 'Miami Dolphins', position: 'wide receiver', nickname: 'Cheetah', salience: 90 },
  { name: 'CeeDee Lamb', subdomain: 'football', sportLabel: 'football', team: 'Dallas Cowboys', position: 'wide receiver', salience: 88 },
  { name: 'Saquon Barkley', subdomain: 'football', sportLabel: 'football', team: 'Philadelphia Eagles', position: 'running back', salience: 89 },
  { name: 'Micah Parsons', subdomain: 'football', sportLabel: 'football', team: 'Dallas Cowboys', position: 'linebacker', salience: 88 },
  { name: 'Derrick Henry', subdomain: 'football', sportLabel: 'football', team: 'Baltimore Ravens', position: 'running back', nickname: 'King Henry', salience: 89 },
  { name: 'Justin Herbert', subdomain: 'football', sportLabel: 'football', team: 'Los Angeles Chargers', position: 'quarterback', salience: 89 },
  { name: 'C.J. Stroud', subdomain: 'football', sportLabel: 'football', team: 'Houston Texans', position: 'quarterback', salience: 87 },
  { name: 'Patrick Willis', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'linebacker', salience: 86 },
  { name: 'Brock Purdy', subdomain: 'football', sportLabel: 'football', team: 'San Francisco 49ers', position: 'quarterback', salience: 87 },
  { name: 'Amon-Ra St. Brown', subdomain: 'football', sportLabel: 'football', team: 'Detroit Lions', position: 'wide receiver', salience: 87 },
  { name: 'Joel Embiid', subdomain: 'basketball', sportLabel: 'basketball', team: 'Philadelphia 76ers', position: 'center', salience: 92 },
  { name: 'Shai Gilgeous-Alexander', subdomain: 'basketball', sportLabel: 'basketball', team: 'Oklahoma City Thunder', position: 'guard', salience: 91 },
  { name: 'Anthony Edwards', subdomain: 'basketball', sportLabel: 'basketball', team: 'Minnesota Timberwolves', position: 'guard', nickname: 'Ant-Man', salience: 90 },
  { name: 'Donovan Mitchell', subdomain: 'basketball', sportLabel: 'basketball', team: 'Cleveland Cavaliers', position: 'guard', salience: 89 },
  { name: 'Kyrie Irving', subdomain: 'basketball', sportLabel: 'basketball', team: 'Dallas Mavericks', position: 'guard', salience: 90 },
  { name: 'Anthony Davis', subdomain: 'basketball', sportLabel: 'basketball', team: 'Los Angeles Lakers', position: 'center', nickname: 'AD', salience: 90 },
  { name: 'Jalen Brunson', subdomain: 'basketball', sportLabel: 'basketball', team: 'New York Knicks', position: 'guard', salience: 89 },
  { name: 'Devin Booker', subdomain: 'basketball', sportLabel: 'basketball', team: 'Phoenix Suns', position: 'guard', salience: 89 },
  { name: 'Klay Thompson', subdomain: 'basketball', sportLabel: 'basketball', team: 'Golden State Warriors', position: 'guard', salience: 88 },
  { name: 'Draymond Green', subdomain: 'basketball', sportLabel: 'basketball', team: 'Golden State Warriors', position: 'forward', salience: 87 },
  { name: 'Freddie Freeman', subdomain: 'baseball', sportLabel: 'baseball', team: 'Los Angeles Dodgers', position: 'first baseman', salience: 90 },
  { name: 'Bryce Harper', subdomain: 'baseball', sportLabel: 'baseball', team: 'Philadelphia Phillies', position: 'first baseman', salience: 89 },
  { name: 'Francisco Lindor', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Mets', position: 'shortstop', salience: 89 },
  { name: 'Jose Altuve', subdomain: 'baseball', sportLabel: 'baseball', team: 'Houston Astros', position: 'second baseman', salience: 88 },
  { name: 'Gerrit Cole', subdomain: 'baseball', sportLabel: 'baseball', team: 'New York Yankees', position: 'pitcher', salience: 88 },
  { name: 'Jose Ramirez', subdomain: 'baseball', sportLabel: 'baseball', team: 'Cleveland Guardians', position: 'third baseman', salience: 87 },
  { name: 'Manny Machado', subdomain: 'baseball', sportLabel: 'baseball', team: 'San Diego Padres', position: 'third baseman', salience: 87 },
  { name: 'Trea Turner', subdomain: 'baseball', sportLabel: 'baseball', team: 'Philadelphia Phillies', position: 'shortstop', salience: 86 },
  { name: 'Corey Seager', subdomain: 'baseball', sportLabel: 'baseball', team: 'Texas Rangers', position: 'shortstop', salience: 86 },
  { name: 'Leon Draisaitl', subdomain: 'hockey', sportLabel: 'hockey', team: 'Edmonton Oilers', position: 'center', salience: 90 },
  { name: 'Nathan MacKinnon', subdomain: 'hockey', sportLabel: 'hockey', team: 'Colorado Avalanche', position: 'center', salience: 90 },
  { name: 'Cale Makar', subdomain: 'hockey', sportLabel: 'hockey', team: 'Colorado Avalanche', position: 'defenseman', salience: 88 },
  { name: 'Matthew Tkachuk', subdomain: 'hockey', sportLabel: 'hockey', team: 'Florida Panthers', position: 'left wing', salience: 88 },
  { name: 'Igor Shesterkin', subdomain: 'hockey', sportLabel: 'hockey', team: 'New York Rangers', position: 'goaltender', salience: 87 },
  { name: 'Connor Hellebuyck', subdomain: 'hockey', sportLabel: 'hockey', team: 'Winnipeg Jets', position: 'goaltender', salience: 86 },
];

const SPORTS_PLAYER_CARD_EXPANSION_SEVEN: PlayerCard[] = [
  { name: 'Kylian Mbappe', subdomain: 'soccer', sportLabel: 'soccer', team: 'Real Madrid', position: 'forward', salience: 95 },
  { name: 'Mohamed Salah', subdomain: 'soccer', sportLabel: 'soccer', team: 'Liverpool', position: 'forward', salience: 92 },
  { name: 'Erling Haaland', subdomain: 'soccer', sportLabel: 'soccer', team: 'Manchester City', position: 'forward', salience: 92 },
  { name: 'Kevin De Bruyne', subdomain: 'soccer', sportLabel: 'soccer', team: 'Manchester City', position: 'midfielder', salience: 90 },
  { name: 'Robert Lewandowski', subdomain: 'soccer', sportLabel: 'soccer', team: 'Barcelona', position: 'forward', salience: 91 },
  { name: 'Luka Modric', subdomain: 'soccer', sportLabel: 'soccer', team: 'Real Madrid', position: 'midfielder', salience: 89 },
  { name: 'Virgil van Dijk', subdomain: 'soccer', sportLabel: 'soccer', team: 'Liverpool', position: 'defender', salience: 88 },
  { name: 'Harry Kane', subdomain: 'soccer', sportLabel: 'soccer', team: 'Bayern Munich', position: 'forward', salience: 90 },
  { name: 'Thierry Henry', subdomain: 'soccer', sportLabel: 'soccer', team: 'Arsenal', position: 'forward', salience: 91 },
  { name: 'Gianluigi Buffon', subdomain: 'soccer', sportLabel: 'soccer', team: 'Juventus', position: 'goalkeeper', salience: 89 },
  { name: 'Carlos Alcaraz', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Carlos Alcaraz is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Golf', 'Soccer'], salience: 90 },
  { name: 'Iga Swiatek', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Iga Swiatek is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Figure skating', 'Golf'], salience: 89 },
  { name: 'Andy Murray', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Andy Murray is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Cycling', 'Soccer'], salience: 88 },
  { name: 'John McEnroe', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'John McEnroe is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Baseball', 'Boxing'], salience: 87 },
  { name: 'Nelly Korda', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Nelly Korda is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Gymnastics'], salience: 88 },
  { name: 'Annika Sorenstam', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Annika Sorenstam is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Skiing'], salience: 90 },
  { name: 'Ben Hogan', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Ben Hogan is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Auto racing'], salience: 89 },
  { name: 'Charles Leclerc', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Charles Leclerc is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Cycling', 'Tennis'], salience: 86 },
  { name: 'Tony Stewart', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Tony Stewart is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Baseball', 'Golf'], salience: 88 },
  { name: 'Oscar De La Hoya', subdomain: 'combat', sportLabel: 'boxing', achievementPrompt: 'Oscar De La Hoya is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'Tennis', 'Auto racing'], salience: 88 },
  { name: 'Amanda Nunes', subdomain: 'combat', sportLabel: 'mma', achievementPrompt: 'Amanda Nunes is best known for competing in which sport?', achievementAnswer: 'MMA', achievementOptions: ['MMA', 'Boxing', 'Judo'], salience: 86 },
  { name: 'Bode Miller', subdomain: 'olympics', sportLabel: 'skiing', achievementPrompt: 'Bode Miller is most closely associated with which Olympic sport?', achievementAnswer: 'Skiing', achievementOptions: ['Skiing', 'Speed skating', 'Biathlon'], salience: 86 },
];

const SPORTS_PLAYER_CARD_EXPANSION_EIGHT: PlayerCard[] = [
  { name: 'Naomi Osaka', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Naomi Osaka is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Golf', 'Track and field'], salience: 88 },
  { name: 'Martina Navratilova', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Martina Navratilova is the player most associated with which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Figure skating', 'Golf'], salience: 91 },
  { name: 'Maria Sharapova', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Maria Sharapova rose to fame in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Gymnastics', 'Skiing'], salience: 88 },
  { name: 'Lydia Ko', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Lydia Ko is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Speed skating'], salience: 87 },
  { name: 'Vijay Singh', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Vijay Singh became famous in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Cricket', 'Tennis'], salience: 86 },
  { name: 'Dustin Johnson', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Dustin Johnson is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 86 },
  { name: 'Lewis Hamilton', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Lewis Hamilton is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Cycling', 'Tennis'], salience: 92 },
  { name: 'Jeff Gordon', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Jeff Gordon rose to fame in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Baseball', 'Golf'], salience: 89 },
  { name: 'Mike Tyson', subdomain: 'combat', sportLabel: 'boxing', nickname: 'Iron Mike', achievementPrompt: 'Mike Tyson is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'MMA', 'Wrestling'], salience: 93 },
  { name: 'Ronda Rousey', subdomain: 'combat', sportLabel: 'mma', achievementPrompt: 'Ronda Rousey rose to fame in which combat sport?', achievementAnswer: 'MMA', achievementOptions: ['MMA', 'Boxing', 'Fencing'], salience: 88 },
  { name: 'Mikaela Shiffrin', subdomain: 'olympics', sportLabel: 'skiing', achievementPrompt: 'Mikaela Shiffrin is most closely associated with which Olympic sport?', achievementAnswer: 'Skiing', achievementOptions: ['Skiing', 'Snowboarding', 'Curling'], salience: 90 },
  { name: 'Caeleb Dressel', subdomain: 'olympics', sportLabel: 'swimming', achievementPrompt: 'Caeleb Dressel is most closely associated with which Olympic sport?', achievementAnswer: 'Swimming', achievementOptions: ['Swimming', 'Rowing', 'Diving'], salience: 88 },
];

const SPORTS_PLAYER_CARD_EXPANSION_NINE: PlayerCard[] = [
  { name: 'Aryna Sabalenka', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Aryna Sabalenka is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Golf', 'Biathlon'], salience: 87 },
  { name: 'Jannik Sinner', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Jannik Sinner is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Cycling', 'Soccer'], salience: 87 },
  { name: 'Seve Ballesteros', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Seve Ballesteros rose to fame in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Auto racing'], salience: 88 },
  { name: 'Jordan Spieth', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Jordan Spieth is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 87 },
  { name: 'Ayrton Senna', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Ayrton Senna is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Cycling', 'Tennis'], salience: 92 },
  { name: 'Mario Andretti', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Mario Andretti rose to fame in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Horse racing', 'Baseball'], salience: 89 },
  { name: 'Floyd Mayweather Jr.', subdomain: 'combat', sportLabel: 'boxing', nickname: 'Money', achievementPrompt: 'Floyd Mayweather Jr. is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'MMA', 'Wrestling'], salience: 90 },
  { name: 'Canelo Alvarez', subdomain: 'combat', sportLabel: 'boxing', achievementPrompt: 'Canelo Alvarez is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'MMA', 'Karate'], salience: 88 },
  { name: 'Aly Raisman', subdomain: 'olympics', sportLabel: 'gymnastics', achievementPrompt: 'Aly Raisman is most closely associated with which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Swimming', 'Track and field'], salience: 87 },
  { name: 'Kristi Yamaguchi', subdomain: 'olympics', sportLabel: 'figure skating', achievementPrompt: 'Kristi Yamaguchi became famous in which Olympic sport?', achievementAnswer: 'Figure skating', achievementOptions: ['Figure skating', 'Skiing', 'Swimming'], salience: 87 },
  { name: 'Megan Rapinoe', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States', position: 'forward', achievementPrompt: 'Megan Rapinoe is best known for competing in which sport?', achievementAnswer: 'Soccer', achievementOptions: ['Soccer', 'Tennis', 'Basketball'], salience: 89 },
  { name: 'Abby Wambach', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States', position: 'forward', achievementPrompt: 'Abby Wambach is best known for competing in which sport?', achievementAnswer: 'Soccer', achievementOptions: ['Soccer', 'Volleyball', 'Track and field'], salience: 88 },
];

const SPORTS_PLAYER_CARD_EXPANSION_TEN: PlayerCard[] = [
  { name: 'Landon Donovan', subdomain: 'soccer', sportLabel: 'soccer', team: 'LA Galaxy', position: 'forward', salience: 91 },
  { name: 'Clint Dempsey', subdomain: 'soccer', sportLabel: 'soccer', team: 'Seattle Sounders FC', position: 'forward', salience: 89 },
  { name: 'Christian Pulisic', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States', position: 'winger', salience: 90 },
  { name: 'Carli Lloyd', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States women', position: 'midfielder', salience: 90 },
  { name: 'Tim Howard', subdomain: 'soccer', sportLabel: 'soccer', team: 'United States', position: 'goalkeeper', salience: 88 },
  { name: 'Neymar', subdomain: 'soccer', sportLabel: 'soccer', team: 'Paris Saint-Germain', position: 'forward', salience: 94 },
  { name: 'Wayne Rooney', subdomain: 'soccer', sportLabel: 'soccer', team: 'Manchester United', position: 'forward', salience: 90 },
  { name: 'Didier Drogba', subdomain: 'soccer', sportLabel: 'soccer', team: 'Chelsea', position: 'forward', salience: 88 },
  { name: 'Andres Iniesta', subdomain: 'soccer', sportLabel: 'soccer', team: 'Barcelona', position: 'midfielder', salience: 89 },
  { name: 'Chris Evert', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Chris Evert is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Golf', 'Figure skating'], salience: 89 },
  { name: 'Monica Seles', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Monica Seles rose to fame in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Gymnastics', 'Golf'], salience: 87 },
  { name: 'Jim Courier', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Jim Courier is best known for competing in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Cycling', 'Soccer'], salience: 85 },
  { name: 'Jennifer Capriati', subdomain: 'tennis', sportLabel: 'tennis', achievementPrompt: 'Jennifer Capriati became famous in which sport?', achievementAnswer: 'Tennis', achievementOptions: ['Tennis', 'Swimming', 'Golf'], salience: 85 },
  { name: 'Justin Thomas', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Justin Thomas is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Tennis'], salience: 87 },
  { name: 'Bryson DeChambeau', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Bryson DeChambeau rose to fame in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Baseball'], salience: 86 },
  { name: 'Rickie Fowler', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Rickie Fowler is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Tennis', 'Motorsport'], salience: 85 },
  { name: 'Collin Morikawa', subdomain: 'golf', sportLabel: 'golf', achievementPrompt: 'Collin Morikawa is best known for competing in which sport?', achievementAnswer: 'Golf', achievementOptions: ['Golf', 'Baseball', 'Swimming'], salience: 85 },
];

const SPORTS_PLAYER_CARD_EXPANSION_ELEVEN: PlayerCard[] = [
  { name: 'Chloe Kim', subdomain: 'olympics', sportLabel: 'snowboarding', achievementPrompt: 'Chloe Kim is most closely associated with which Olympic sport?', achievementAnswer: 'Snowboarding', achievementOptions: ['Snowboarding', 'Speed skating', 'Curling'], salience: 88 },
  { name: 'Sunisa Lee', subdomain: 'olympics', sportLabel: 'gymnastics', achievementPrompt: 'Sunisa Lee is most closely associated with which Olympic sport?', achievementAnswer: 'Gymnastics', achievementOptions: ['Gymnastics', 'Swimming', 'Track and field'], salience: 87 },
  { name: 'Noah Lyles', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Noah Lyles is most closely associated with which Olympic sport family?', achievementAnswer: 'Track and field', achievementOptions: ['Track and field', 'Swimming', 'Cycling'], salience: 87 },
  { name: 'Sydney McLaughlin-Levrone', subdomain: 'olympics', sportLabel: 'track and field', achievementPrompt: 'Sydney McLaughlin-Levrone is most closely associated with which Olympic sport family?', achievementAnswer: 'Track and field', achievementOptions: ['Track and field', 'Gymnastics', 'Swimming'], salience: 86 },
  { name: 'Simone Manuel', subdomain: 'olympics', sportLabel: 'swimming', achievementPrompt: 'Simone Manuel is most closely associated with which Olympic sport?', achievementAnswer: 'Swimming', achievementOptions: ['Swimming', 'Rowing', 'Diving'], salience: 85 },
  { name: 'Joey Logano', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Joey Logano is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Cycling', 'Golf'], salience: 86 },
  { name: 'Kyle Larson', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Kyle Larson is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Baseball', 'Tennis'], salience: 87 },
  { name: 'Fernando Alonso', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Fernando Alonso rose to fame in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Cycling', 'Soccer'], salience: 89 },
  { name: 'Lando Norris', subdomain: 'motorsport', sportLabel: 'motorsport', achievementPrompt: 'Lando Norris is best known for competing in which sport?', achievementAnswer: 'Motorsport', achievementOptions: ['Motorsport', 'Tennis', 'Cricket'], salience: 85 },
  { name: 'Jon Jones', subdomain: 'combat', sportLabel: 'mma', achievementPrompt: 'Jon Jones is best known for competing in which combat sport?', achievementAnswer: 'MMA', achievementOptions: ['MMA', 'Boxing', 'Wrestling'], salience: 88 },
  { name: 'Georges St-Pierre', subdomain: 'combat', sportLabel: 'mma', achievementPrompt: 'Georges St-Pierre rose to fame in which combat sport?', achievementAnswer: 'MMA', achievementOptions: ['MMA', 'Boxing', 'Judo'], salience: 86 },
  { name: 'Claressa Shields', subdomain: 'combat', sportLabel: 'boxing', achievementPrompt: 'Claressa Shields is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'MMA', 'Fencing'], salience: 85 },
  { name: 'Tyson Fury', subdomain: 'combat', sportLabel: 'boxing', achievementPrompt: 'Tyson Fury is best known for competing in which sport?', achievementAnswer: 'Boxing', achievementOptions: ['Boxing', 'MMA', 'Wrestling'], salience: 87 },
];

const ALL_SPORTS_TEAM_CARDS = [
  ...SPORTS_TEAM_CARDS,
  ...SPORTS_TEAM_CARD_EXPANSION,
  ...SPORTS_TEAM_CARD_EXPANSION_TWO,
  ...SPORTS_TEAM_CARD_EXPANSION_THREE,
  ...SPORTS_TEAM_CARD_EXPANSION_FOUR,
  ...SPORTS_TEAM_CARD_EXPANSION_FIVE,
];
const ALL_SPORTS_PLAYER_CARDS = [
  ...SPORTS_PLAYER_CARDS,
  ...SPORTS_PLAYER_CARD_EXPANSION,
  ...SPORTS_PLAYER_CARD_EXPANSION_TWO,
  ...SPORTS_PLAYER_CARD_EXPANSION_THREE,
  ...SPORTS_PLAYER_CARD_EXPANSION_FOUR,
  ...SPORTS_PLAYER_CARD_EXPANSION_FIVE,
  ...SPORTS_PLAYER_CARD_EXPANSION_SIX,
  ...SPORTS_PLAYER_CARD_EXPANSION_SEVEN,
  ...SPORTS_PLAYER_CARD_EXPANSION_EIGHT,
  ...SPORTS_PLAYER_CARD_EXPANSION_NINE,
  ...SPORTS_PLAYER_CARD_EXPANSION_TEN,
  ...SPORTS_PLAYER_CARD_EXPANSION_ELEVEN,
];

function buildTeamCityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const [d1, d2] = pickPeerValues(
      allCards.filter((entry) => entry.league === card.league).map((entry) => entry.city),
      card.city,
      index
    );
    return q({
      prompt: `Which city is home to the ${card.team}?`,
      options: buildOptions(card.city, [d1, d2]),
      answerIndex: 0,
      difficulty: ['NFL', 'NBA', 'MLB', 'NHL'].includes(card.league) ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'team',
      salienceScore: 80,
      lookupRisk: 'low',
      rationaleShort: `${card.team} are based in ${card.city}.`,
      rationaleLong: `${card.team} play their home schedule in ${card.city}, making that city the correct franchise home.`,
      citations: searchCitation(`${card.team} city`, `${card.team} city`),
    });
  });
}

function buildTeamSportQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const sportOptions = ['football', 'basketball', 'baseball', 'hockey', 'soccer'];
  return cards.map((card, index) => {
    const distractors = pickPeerValues(sportOptions, card.sportLabel, index);
    return q({
      prompt: `The ${card.team} compete in which sport?`,
      options: buildOptions(card.sportLabel, distractors),
      answerIndex: 0,
      difficulty: 1,
      subdomain: card.subdomain,
      promptKind: 'sport-id',
      salienceScore: 78,
      lookupRisk: 'low',
      rationaleShort: `${card.team} are a ${card.sportLabel} team.`,
      rationaleLong: `${card.team} are known for playing ${card.sportLabel}, so that sport identification is the clean fit.`,
      citations: searchCitation(`${card.team} sport`, `${card.team} sport`),
    });
  });
}

function buildTeamLeagueQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const leagues = ['NFL', 'NBA', 'MLB', 'NHL', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];
  return cards.map((card, index) => {
    const distractors = pickPeerValues(leagues, card.league, index);
      return q({
      prompt: `Which league features the ${card.team}?`,
      options: buildOptions(card.league, distractors),
      answerIndex: 0,
      difficulty: ['NFL', 'NBA', 'MLB', 'NHL'].includes(card.league) ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'event',
      salienceScore: 74,
      lookupRisk: 'low',
      rationaleShort: `${card.team} play in the ${card.league}.`,
      rationaleLong: `${card.team} are part of the ${card.league}, so that league label is the correct competition home.`,
      citations: searchCitation(`${card.team} league`, `${card.team} league`),
    });
  });
}

function buildVenueQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const [d1, d2] = pickPeerValues(
      allCards.filter((entry) => entry.subdomain === card.subdomain).map((entry) => entry.venue),
      card.venue,
      index
    );
    return q({
      prompt: `Which venue is most closely associated with the ${card.team}?`,
      options: buildOptions(card.venue, [d1, d2]),
      answerIndex: 0,
      difficulty: (card.venueSalience ?? 72) >= 82 ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'venue',
      salienceScore: card.venueSalience ?? 72,
      lookupRisk: card.venueSalience && card.venueSalience >= 84 ? 'low' : 'medium',
      rationaleShort: `${card.team} play at ${card.venue}.`,
      rationaleLong: `${card.venue} is the home venue most associated with the ${card.team}.`,
      citations: searchCitation(`${card.team} venue`, `${card.team} ${card.venue}`),
    });
  });
}

function buildVenueCityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const cities = allCards
      .filter((entry) => entry.league === card.league)
      .map((entry) => entry.city);
    const [d1, d2] = pickPeerValues(cities, card.city, index);
    return q({
      prompt: `${card.venue} is home to a team from which city?`,
      options: buildOptions(card.city, [d1, d2]),
      answerIndex: 0,
      difficulty: (card.venueSalience ?? 72) >= 82 ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'venue',
      salienceScore: Math.max(72, (card.venueSalience ?? 72) - 6),
      lookupRisk: (card.venueSalience ?? 72) >= 84 ? 'low' : 'medium',
      rationaleShort: `${card.venue} is in ${card.city}.`,
      rationaleLong: `${card.venue} is the home venue tied to the franchise based in ${card.city}.`,
      citations: searchCitation(`${card.venue} city`, `${card.venue} ${card.city}`),
    });
  });
}

function buildVenueLeagueQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const leagues = ['NFL', 'NBA', 'MLB', 'NHL', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];
  return cards.map((card, index) => {
    const [d1, d2] = pickPeerValues(leagues, card.league, index);
    return q({
      prompt: `${card.venue} is home to a team in which league?`,
      options: buildOptions(card.league, [d1, d2]),
      answerIndex: 0,
      difficulty: 1,
      subdomain: card.subdomain,
      promptKind: 'event',
      salienceScore: Math.max(78, (card.venueSalience ?? 72) - 3),
      lookupRisk: 'low',
      rationaleShort: `${card.venue} is home to a team in the ${card.league}.`,
      rationaleLong: `${card.venue} is the home building or park for a franchise that competes in the ${card.league}.`,
      citations: searchCitation(`${card.venue} league`, `${card.venue} ${card.league}`),
    });
  });
}

function buildTeamFromCityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const cityLeagueCounts = new Map<string, number>();
  cards.forEach((card) => {
    const key = `${card.league}:${card.city}`;
    cityLeagueCounts.set(key, (cityLeagueCounts.get(key) ?? 0) + 1);
  });

  return cards
    .filter((card) => (cityLeagueCounts.get(`${card.league}:${card.city}`) ?? 0) === 1)
    .map((card, index, allCards) => {
      const peers = allCards
        .filter((entry) => entry.league === card.league)
        .map((entry) => entry.team);
      const [d1, d2] = pickPeerValues(peers, card.team, index);
      return q({
      prompt: `Which ${card.sportLabel} team is based in ${card.city}?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: ['NFL', 'NBA', 'MLB', 'NHL'].includes(card.league) ? 1 : 2,
        subdomain: card.subdomain,
        promptKind: 'team',
        salienceScore: 76,
        lookupRisk: 'low',
        rationaleShort: `${card.team} are based in ${card.city}.`,
        rationaleLong: `${card.city} is the home city most closely associated with the ${card.team}.`,
        citations: searchCitation(`${card.team} city reverse`, `${card.city} ${card.team}`),
      });
    });
}

function buildTeamFromVenueQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const peers = allCards
      .filter((entry) => entry.subdomain === card.subdomain)
      .map((entry) => entry.team);
    const [d1, d2] = pickPeerValues(peers, card.team, index);
    const venueSalience = card.venueSalience ?? 72;
    return q({
      prompt: `Which ${card.sportLabel} team plays its home games at ${card.venue}?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: venueSalience >= 82 ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'venue',
      salienceScore: Math.max(74, venueSalience - 1),
      lookupRisk: venueSalience >= 84 ? 'low' : 'medium',
      rationaleShort: `${card.team} play at ${card.venue}.`,
      rationaleLong: `${card.venue} is the home venue most associated with the ${card.team}.`,
      citations: searchCitation(`${card.team} venue reverse`, `${card.venue} ${card.team}`),
    });
  });
}

function buildLeagueVenueTeamQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const peers = allCards
      .filter((entry) => entry.league === card.league)
      .map((entry) => entry.team);
    const [d1, d2] = pickPeerValues(peers, card.team, index);
    return q({
      prompt: `Which ${card.league} team plays its home games at ${card.venue}?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: 2,
      subdomain: card.subdomain,
      promptKind: 'venue',
      salienceScore: Math.max(80, (card.venueSalience ?? 72)),
      lookupRisk: 'low',
      rationaleShort: `${card.team} are the ${card.league} team tied to ${card.venue}.`,
      rationaleLong: `${card.venue} is the home venue of the ${card.league} franchise known as the ${card.team}.`,
      citations: searchCitation(`${card.team} ${card.venue} ${card.league}`, `${card.team} ${card.venue} ${card.league}`),
    });
  });
}

function buildTeamByLeagueSelectionQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const leaguePeers = cards.map((entry) => entry.team);
  return cards.map((card, index, allCards) => {
    const distractors = dedupeLocal(
      allCards
        .filter((entry) => entry.league !== card.league)
        .map((entry) => entry.team)
    );
    const [d1, d2] = pickPeerValues(distractors.length >= 2 ? distractors : leaguePeers, card.team, index);
    return q({
      prompt: `Which of these teams plays in the ${card.league}?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: ['NFL', 'NBA', 'MLB', 'NHL'].includes(card.league) ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'team',
      salienceScore: 84,
      lookupRisk: 'low',
      rationaleShort: `${card.team} are a ${card.league} team.`,
      rationaleLong: `${card.team} compete in the ${card.league}, while the other options are from different leagues.`,
      citations: searchCitation(`${card.team} league selection`, `${card.team} ${card.league}`),
    });
  });
}

function buildTeamBySportSelectionQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const distractors = dedupeLocal(
      allCards
        .filter((entry) => entry.sportLabel !== card.sportLabel)
        .map((entry) => entry.team)
    );
    const [d1, d2] = pickPeerValues(distractors, card.team, index);
    return q({
      prompt: `Which of these is a ${card.sportLabel} team?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: 1,
      subdomain: card.subdomain,
      promptKind: 'sport-id',
      salienceScore: 84,
      lookupRisk: 'low',
      rationaleShort: `${card.team} are the ${card.sportLabel} team in this set.`,
      rationaleLong: `${card.team} compete in ${card.sportLabel}, while the distractors belong to other sports.`,
      citations: searchCitation(`${card.team} sport selection`, `${card.team} ${card.sportLabel}`),
    });
  });
}

function buildVenueSportQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const sportOptions = ['football', 'basketball', 'baseball', 'hockey', 'soccer'];
  return cards.map((card, index) => {
    const distractors = pickPeerValues(sportOptions, card.sportLabel, index);
      return q({
      prompt: `${card.venue} is most closely associated with which sport?`,
      options: buildOptions(card.sportLabel, distractors),
      answerIndex: 0,
        difficulty: 1,
        subdomain: card.subdomain,
        promptKind: 'venue',
        salienceScore: Math.max(78, (card.venueSalience ?? 72) - 2),
      lookupRisk: (card.venueSalience ?? 72) >= 84 ? 'low' : 'medium',
      rationaleShort: `${card.venue} is linked with ${card.sportLabel}.`,
      rationaleLong: `${card.venue} is home to a ${card.sportLabel} team, making that the right sport association.`,
      citations: searchCitation(`${card.venue} sport`, `${card.venue} ${card.sportLabel}`),
    });
  });
}

function buildVenueFromLeagueCityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const venues = allCards
      .filter((entry) => entry.league === card.league)
      .map((entry) => entry.venue);
    const [d1, d2] = pickPeerValues(venues, card.venue, index);
    return q({
      prompt: `Which venue is home to the ${card.league} team from ${card.city}?`,
      options: buildOptions(card.venue, [d1, d2]),
      answerIndex: 0,
      difficulty: ['NFL', 'NBA', 'MLB', 'NHL'].includes(card.league) ? 3 : 2,
      subdomain: card.subdomain,
      promptKind: 'venue',
      salienceScore: Math.max(78, card.venueSalience ?? 72),
      lookupRisk: 'low',
      rationaleShort: `${card.venue} is the home venue for the ${card.league} team from ${card.city}.`,
      rationaleLong: `${card.venue} is the building or park attached to the ${card.league} franchise based in ${card.city}.`,
      citations: searchCitation(`${card.city} ${card.league} venue`, `${card.city} ${card.team} ${card.venue}`),
    });
  });
}

function buildLeagueTeamFromCityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const peers = allCards
      .filter((entry) => entry.league === card.league)
      .map((entry) => entry.team);
    const [d1, d2] = pickPeerValues(peers, card.team, index);
    return q({
      prompt: `Which ${card.league} team plays in ${card.city}?`,
      options: buildOptions(card.team, [d1, d2]),
      answerIndex: 0,
      difficulty: 2,
      subdomain: card.subdomain,
      promptKind: 'team',
      salienceScore: 82,
      lookupRisk: 'low',
      rationaleShort: `${card.team} are the ${card.league} team from ${card.city}.`,
      rationaleLong: `${card.city} is the home market of the ${card.league} franchise named ${card.team}.`,
      citations: searchCitation(`${card.city} ${card.league} team`, `${card.city} ${card.team} ${card.league}`),
    });
  });
}

function buildLeagueFromVenueIdentityQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const leagues = ['NFL', 'NBA', 'MLB', 'NHL', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];
  return cards.map((card, index) => {
    const [d1, d2] = pickPeerValues(leagues, card.league, index);
    return q({
      prompt: `The team that plays at ${card.venue} competes in which league?`,
      options: buildOptions(card.league, [d1, d2]),
      answerIndex: 0,
      difficulty: 2,
      subdomain: card.subdomain,
      promptKind: 'event',
      salienceScore: Math.max(78, (card.venueSalience ?? 72) - 1),
      lookupRisk: 'low',
      rationaleShort: `${card.venue} hosts a team from the ${card.league}.`,
      rationaleLong: `${card.venue} is home to a franchise that competes in the ${card.league}, making that the right league match.`,
      citations: searchCitation(`${card.venue} league identity`, `${card.venue} ${card.league}`),
    });
  });
}

function buildCityFromVenueLeagueQuestions(cards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const cities = allCards
      .filter((entry) => entry.league === card.league)
      .map((entry) => entry.city);
    const [d1, d2] = pickPeerValues(cities, card.city, index);
    return q({
      prompt: `${card.venue} belongs to a ${card.league} team from which city?`,
      options: buildOptions(card.city, [d1, d2]),
      answerIndex: 0,
      difficulty: 2,
      subdomain: card.subdomain,
      promptKind: 'place',
      salienceScore: Math.max(78, (card.venueSalience ?? 72) - 2),
      lookupRisk: 'low',
      rationaleShort: `${card.venue} is tied to a ${card.league} team from ${card.city}.`,
      rationaleLong: `${card.venue} serves as the home venue for the ${card.league} franchise based in ${card.city}.`,
      citations: searchCitation(`${card.venue} ${card.league} city`, `${card.venue} ${card.city} ${card.league}`),
    });
  });
}

function buildPlayerTeamQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.team)
    .map((card, index, allCards) => {
      const team = card.team ?? '';
      const peers = allCards.filter((entry) => entry.subdomain === card.subdomain && entry.team).map((entry) => entry.team ?? '');
      const [d1, d2] = pickPeerValues(peers, team, index);
      return q({
        prompt: `${card.name} is most closely associated with which team or side?`,
        options: buildOptions(team, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 82) >= 86 ? 1 : 2,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: card.salience ?? 82,
        lookupRisk: 'low',
        rationaleShort: `${card.name} is strongly linked with ${team}.`,
        rationaleLong: `${card.name} is best known for playing with ${team}, making that the cleanest team match.`,
        citations: searchCitation(`${card.name} team`, `${card.name} ${team}`),
      });
    });
}

function buildPlayerTeamFromPositionQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.team && card.position)
    .map((card, index, allCards) => {
      const team = card.team ?? '';
      const peers = allCards
        .filter((entry) => entry.subdomain === card.subdomain && entry.team)
        .map((entry) => entry.team ?? '');
      const [d1, d2] = pickPeerValues(peers, team, index);
      const position = card.position ?? '';
      return q({
        prompt: `Which team was ${card.name} most closely associated with as a ${position}?`,
        options: buildOptions(team, [d1, d2]),
        answerIndex: 0,
        difficulty: 2,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(78, (card.salience ?? 84) - 1),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is most closely tied to the ${team} in that role.`,
        rationaleLong: `${card.name} is best known for playing that ${position} role with the ${team}, making that the clean team match here.`,
        citations: searchCitation(`${card.name} ${team} ${position} team`, `${card.name} ${team} ${position}`),
      });
    });
}

function buildPlayerPositionQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  const positionPools: Record<string, string[]> = {
    football: ['quarterback', 'running back', 'wide receiver', 'linebacker', 'cornerback'],
    basketball: ['point guard', 'shooting guard', 'forward', 'power forward', 'center'],
    baseball: ['pitcher', 'shortstop', 'second baseman', 'center fielder', 'right fielder', 'closer', 'outfielder'],
    hockey: ['center', 'left wing', 'right wing', 'defenseman', 'goaltender'],
    soccer: ['forward', 'midfielder', 'defender', 'goalkeeper'],
  };

  return cards
    .filter((card) => card.position && positionPools[card.subdomain])
    .map((card, index) => {
      const correct = card.position ?? '';
      const [d1, d2] = pickPeerValues(positionPools[card.subdomain], correct, index);
      return q({
        prompt: `What position did ${card.name} primarily play?`,
        options: buildOptions(correct, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 82) >= 88 ? 2 : 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(74, (card.salience ?? 82) - 4),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is remembered as a ${correct}.`,
        rationaleLong: `${card.name} is best known for playing ${correct}, which is the right position match here.`,
        citations: searchCitation(`${card.name} position`, `${card.name} ${correct}`),
      });
    });
}

function buildPlayerTeamPositionQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.team && card.position)
    .map((card, index) => {
      const correct = card.position ?? '';
      const peerPositions = cards
        .filter((entry) => entry.subdomain === card.subdomain && entry.position)
        .map((entry) => entry.position ?? '');
      const [d1, d2] = pickPeerValues(peerPositions, correct, index);
      const team = card.team ?? '';
      return q({
        prompt: `What position did ${card.name} primarily play for the ${team}?`,
        options: buildOptions(correct, [d1, d2]),
        answerIndex: 0,
        difficulty: 2,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(78, (card.salience ?? 84) - 2),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is most associated with the ${correct} role for the ${team}.`,
        rationaleLong: `${card.name} is best known for filling the ${correct} role with the ${team}, which makes that the clean position match here.`,
        citations: searchCitation(`${card.name} ${team} position`, `${card.name} ${team} ${correct}`),
      });
    });
}

function buildPlayerSportQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  const sportOptions = ['football', 'basketball', 'baseball', 'hockey', 'soccer', 'golf', 'tennis', 'motorsport', 'boxing', 'swimming', 'gymnastics', 'track and field'];
  return cards.map((card, index) => {
    const [d1, d2] = pickPeerValues(sportOptions, card.sportLabel, index);
    return q({
      prompt: `${card.name} is best known for competing in which sport?`,
      options: buildOptions(card.sportLabel, [d1, d2]),
      answerIndex: 0,
      difficulty: (card.salience ?? 84) >= 92 ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'sport-id',
      salienceScore: Math.max(72, (card.salience ?? 84) - 10),
      lookupRisk: 'low',
      rationaleShort: `${card.name} is associated with ${card.sportLabel}.`,
      rationaleLong: `${card.name} is most strongly associated with ${card.sportLabel}, which makes that sport the correct identification.`,
      citations: searchCitation(`${card.name} sport`, `${card.name} ${card.sportLabel}`),
    });
  });
}

function buildPlayerSportSelectionQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards.map((card, index, allCards) => {
    const peers = allCards
      .filter((entry) => entry.sportLabel !== card.sportLabel)
      .map((entry) => entry.name);
    const [d1, d2] = pickPeerValues(peers, card.name, index);
    return q({
      prompt: `Which athlete is best known for ${card.sportLabel}?`,
      options: buildOptions(card.name, [d1, d2]),
      answerIndex: 0,
      difficulty: (card.salience ?? 84) >= 92 ? 1 : 2,
      subdomain: card.subdomain,
      promptKind: 'sport-id',
      salienceScore: Math.max(72, (card.salience ?? 84) - 8),
      lookupRisk: 'low',
      rationaleShort: `${card.name} is the athlete associated with ${card.sportLabel}.`,
      rationaleLong: `${card.name} is the cleanest athlete-to-sport match in this set because that sport is the main stage of their career.`,
      citations: searchCitation(`${card.name} sport reverse`, `${card.name} ${card.sportLabel}`),
    });
  });
}

function buildPlayerLeagueQuestions(cards: PlayerCard[], teamCards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const leagueByTeam = new Map(teamCards.map((card) => [card.team, card.league]));
  return cards
    .filter((card) => card.team && leagueByTeam.has(card.team))
    .map((card, index, allCards) => {
      const league = leagueByTeam.get(card.team ?? '') ?? '';
      const peers = allCards
        .filter((entry) => entry.team && entry.team !== card.team)
        .map((entry) => leagueByTeam.get(entry.team ?? ''))
        .filter((value): value is string => Boolean(value));
      const [d1, d2] = pickPeerValues(dedupeLocal(peers), league, index);
      return q({
        prompt: `${card.name} is most closely associated with which league?`,
        options: buildOptions(league, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 84) >= 88 ? 1 : 2,
        subdomain: card.subdomain,
        promptKind: 'event',
        salienceScore: Math.max(76, (card.salience ?? 84) - 4),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is most closely associated with the ${league}.`,
        rationaleLong: `${card.name} became famous in the ${league}, making that the right league match here.`,
        citations: searchCitation(`${card.name} league`, `${card.name} ${league}`),
      });
    });
}

function buildPlayerTeamCityQuestions(cards: PlayerCard[], teamCards: TeamCard[]): CuratedTriviaSourceQuestion[] {
  const cityByTeam = new Map(teamCards.map((card) => [card.team, card.city]));
  return cards
    .filter((card) => card.team && cityByTeam.has(card.team))
    .map((card, index, allCards) => {
      const city = cityByTeam.get(card.team ?? '') ?? '';
      const peers = allCards
        .filter((entry) => entry.team && entry.team !== card.team)
        .map((entry) => cityByTeam.get(entry.team ?? ''))
        .filter((value): value is string => Boolean(value));
      const [d1, d2] = pickPeerValues(dedupeLocal(peers), city, index);
      return q({
        prompt: `${card.name} is most closely associated with a team from which city?`,
        options: buildOptions(city, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 84) >= 88 ? 1 : 2,
        subdomain: card.subdomain,
        promptKind: 'place',
        salienceScore: Math.max(76, (card.salience ?? 84) - 4),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is most closely associated with ${city}.`,
        rationaleLong: `${card.name} is best known for starring with a franchise from ${city}, which makes that city the right match.`,
        citations: searchCitation(`${card.name} city`, `${card.name} ${city}`),
      });
    });
}

function buildPlayerCityFromPositionQuestions(
  cards: PlayerCard[],
  teamCards: TeamCard[]
): CuratedTriviaSourceQuestion[] {
  const cityByTeam = new Map(teamCards.map((card) => [card.team, card.city]));
  return cards
    .filter((card) => card.team && card.position && cityByTeam.has(card.team))
    .map((card, index, allCards) => {
      const city = cityByTeam.get(card.team ?? '') ?? '';
      const peers = allCards
        .filter((entry) => entry.team && cityByTeam.has(entry.team))
        .map((entry) => cityByTeam.get(entry.team ?? ''))
        .filter((value): value is string => Boolean(value));
      const [d1, d2] = pickPeerValues(dedupeLocal(peers), city, index);
      const position = card.position ?? '';
      return q({
        prompt: `Which city's team was ${card.name} most closely associated with as a ${position}?`,
        options: buildOptions(city, [d1, d2]),
        answerIndex: 0,
        difficulty: 2,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(78, (card.salience ?? 84) - 2),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is most closely tied to the ${position} role for a team from ${city}.`,
        rationaleLong: `${card.name} is best known for playing that ${position} role with a franchise from ${city}, which makes that city the clean match.`,
        citations: searchCitation(`${card.name} ${city} ${position} city`, `${card.name} ${city} ${position}`),
      });
    });
}

function buildPlayerNicknameQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.nickname)
    .map((card, index, allCards) => {
      const correct = card.nickname ?? '';
      const [d1, d2] = pickPeerValues(allCards.map((entry) => entry.nickname ?? '').filter(Boolean), correct, index);
      return q({
        prompt: `Which nickname belongs to ${card.name}?`,
        options: buildOptions(correct, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 84) >= 95 ? 2 : 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(72, (card.salience ?? 84) - 2),
        lookupRisk: 'low',
        obscurityFlags: ['famous-nickname'],
        rationaleShort: `${correct} is the nickname tied to ${card.name}.`,
        rationaleLong: `${correct} is the nickname most associated with ${card.name}, making it a fair fan-recognition clue rather than a random deep cut.`,
        citations: searchCitation(`${card.name} nickname`, `${card.name} nickname ${correct}`),
      });
    });
}

function buildPlayerFromNicknameQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.nickname)
    .map((card, index, allCards) => {
      const peers = allCards.filter(
        (entry) => entry.subdomain === card.subdomain && entry.nickname && entry.name !== card.name
      );
      if (peers.length < 2) return null;
      const [d1, d2] = pickPeerValues(
        peers.map((entry) => entry.name),
        card.name,
        index
      );
      const nickname = card.nickname ?? '';
      return q({
        prompt: `Which athlete is nicknamed ${nickname}?`,
        options: buildOptions(card.name, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 84) >= 95 ? 2 : 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(74, (card.salience ?? 84) - 1),
        lookupRisk: 'low',
        obscurityFlags: ['famous-nickname'],
        rationaleShort: `${nickname} is the nickname tied to ${card.name}.`,
        rationaleLong: `${nickname} is the nickname most closely associated with ${card.name}.`,
        citations: searchCitation(`${card.name} nickname reverse`, `${nickname} ${card.name}`),
      });
    })
    .filter((question): question is CuratedTriviaSourceQuestion => question !== null);
}

function buildPlayerFromPositionReverseQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.position)
    .map((card, index, allCards) => {
      const correctPosition = card.position ?? '';
      const peers = allCards.filter(
        (entry) =>
          entry.subdomain === card.subdomain &&
          entry.position &&
          entry.position !== correctPosition &&
          entry.name !== card.name
      );
      if (peers.length < 2) return null;
      const [d1, d2] = pickPeerValues(
        peers.map((entry) => entry.name),
        card.name,
        index
      );
      return q({
        prompt: `Which of these ${card.sportLabel} players was primarily a ${correctPosition}?`,
        options: buildOptions(card.name, [d1, d2]),
        answerIndex: 0,
        difficulty: 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(72, (card.salience ?? 84) - 5),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is the player who fits that position.`,
        rationaleLong: `${card.name} is best known for playing ${correctPosition}, which makes that athlete the clean position match.`,
        citations: searchCitation(`${card.name} position reverse`, `${card.name} ${correctPosition}`),
      });
    })
    .filter((question): question is CuratedTriviaSourceQuestion => question !== null);
}

function buildPlayerFromTeamReverseQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  const teamCounts = new Map<string, number>();
  cards.forEach((card) => {
    if (!card.team) return;
    teamCounts.set(card.team, (teamCounts.get(card.team) ?? 0) + 1);
  });

  return cards
    .filter((card) => card.team && (teamCounts.get(card.team) ?? 0) === 1)
    .map((card, index, allCards) => {
      const peers = allCards.filter(
        (entry) => entry.subdomain === card.subdomain && entry.team && entry.name !== card.name
      );
      if (peers.length < 2) return null;
      const [d1, d2] = pickPeerValues(
        peers.map((entry) => entry.name),
        card.name,
        index
      );
      const team = card.team ?? '';
      return q({
        prompt: `Which athlete is most closely associated with the ${team}?`,
        options: buildOptions(card.name, [d1, d2]),
        answerIndex: 0,
        difficulty: (card.salience ?? 84) >= 94 ? 2 : 3,
        subdomain: card.subdomain,
        promptKind: 'team',
        salienceScore: Math.max(74, (card.salience ?? 84) - 3),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is the player most closely tied to the ${team}.`,
        rationaleLong: `${card.name} is the strongest player-team association in this set for the ${team}.`,
        citations: searchCitation(`${card.name} team reverse`, `${team} ${card.name}`),
      });
    })
    .filter((question): question is CuratedTriviaSourceQuestion => question !== null);
}

function buildPlayerFromTeamPositionReverseQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.team && card.position)
    .map((card, index, allCards) => {
      const team = card.team ?? '';
      const position = card.position ?? '';
      const peers = allCards.filter(
        (entry) =>
          entry.subdomain === card.subdomain &&
          entry.team &&
          entry.position &&
          entry.name !== card.name &&
          !(entry.team === team && entry.position === position)
      );
      if (peers.length < 2) return null;
      const [d1, d2] = pickPeerValues(
        peers.map((entry) => entry.name),
        card.name,
        index
      );
      return q({
        prompt: `Which ${card.sportLabel} star was primarily the ${position} for the ${team}?`,
        options: buildOptions(card.name, [d1, d2]),
        answerIndex: 0,
        difficulty: 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(80, (card.salience ?? 84) - 1),
        lookupRisk: 'low',
        rationaleShort: `${card.name} is the player who best fits that team-and-position clue.`,
        rationaleLong: `${card.name} is best known as the ${position} associated with the ${team}, which makes that athlete the clean match here.`,
        citations: searchCitation(`${card.name} ${team} ${position} reverse`, `${team} ${position} ${card.name}`),
      });
    })
    .filter((question): question is CuratedTriviaSourceQuestion => question !== null);
}

function buildPlayerFromCityPositionReverseQuestions(
  cards: PlayerCard[],
  teamCards: TeamCard[]
): CuratedTriviaSourceQuestion[] {
  const cityByTeam = new Map(teamCards.map((card) => [card.team, card.city]));
  return cards
    .filter((card) => card.team && card.position && cityByTeam.has(card.team))
    .map((card, index, allCards) => {
      const city = cityByTeam.get(card.team ?? '') ?? '';
      const position = card.position ?? '';
      const peers = allCards.filter(
        (entry) =>
          entry.subdomain === card.subdomain &&
          entry.team &&
          entry.position &&
          entry.name !== card.name &&
          !(cityByTeam.get(entry.team ?? '') === city && entry.position === position)
      );
      if (peers.length < 2) return null;
      const [d1, d2] = pickPeerValues(
        peers.map((entry) => entry.name),
        card.name,
        index
      );
      return q({
        prompt: `Which ${card.sportLabel} star was primarily the ${position} for the team from ${city}?`,
        options: buildOptions(card.name, [d1, d2]),
        answerIndex: 0,
        difficulty: 3,
        subdomain: card.subdomain,
        promptKind: 'player',
        salienceScore: Math.max(80, (card.salience ?? 84) - 1),
        lookupRisk: 'low',
        obscurityFlags: ['vague-stem'],
        rationaleShort: `${card.name} is the player who best fits that city-and-position clue.`,
        rationaleLong: `${card.name} is best known as the ${position} tied to the franchise from ${city}, making that athlete the clean match here.`,
        citations: searchCitation(`${card.name} ${city} ${position} reverse`, `${city} ${position} ${card.name}`),
      });
    })
    .filter((question): question is CuratedTriviaSourceQuestion => question !== null);
}

function buildPlayerAchievementQuestions(cards: PlayerCard[]): CuratedTriviaSourceQuestion[] {
  return cards
    .filter((card) => card.achievementPrompt && card.achievementAnswer && card.achievementOptions)
    .map((card) =>
      q({
        prompt: card.achievementPrompt ?? '',
        options: card.achievementOptions ?? [],
        answerIndex: (card.achievementOptions ?? []).findIndex((option) => option === card.achievementAnswer),
        difficulty: (card.salience ?? 84) >= 92 ? 2 : 3,
        subdomain: card.subdomain,
        promptKind: 'achievement',
        salienceScore: Math.max(76, (card.salience ?? 84) - 1),
        lookupRisk: 'low',
        rationaleShort: `${card.achievementAnswer} is the right fit here.`,
        rationaleLong: `${card.achievementAnswer} is the achievement or context most strongly associated with ${card.name}.`,
        citations: searchCitation(`${card.name} achievement`, `${card.name} ${card.achievementAnswer}`),
      })
    )
    .filter((question) => question.answerIndex >= 0);
}

const CURATED_SPORTS_CORE: CuratedTriviaSourceQuestion[] = [
  q({ prompt: 'In football, how many points is a safety worth?', options: ['2', '1', '3'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A safety is worth 2 points.', rationaleLong: 'When the offense is tackled in its own end zone, the defense scores a safety worth 2 points.', isTrickQuestion: true, obscurityFlags: ['edge-case'] }),
  q({ prompt: 'What is the name of the line a football offense must reach to earn a new set of downs?', options: ['The line to gain', 'The neutral zone', 'The hash line'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'It is called the line to gain.', rationaleLong: 'Broadcasts often describe the first-down target as the line to gain because crossing it resets the downs.', isTrickQuestion: true }),
  q({ prompt: 'In football, what does a fair catch allow the returner to do?', options: ['Catch the kick without being hit', 'Advance the ball after one bounce', 'Restart play from midfield'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A fair catch lets the returner catch the kick without contact.', rationaleLong: 'By signaling for a fair catch, the returner gives up the runback in exchange for the right to catch the kick without being hit.' }),
  q({ prompt: 'Which trophy is awarded to the Super Bowl champion?', options: ['Vince Lombardi Trophy', "Larry O'Brien Trophy", 'Commissioner’s Trophy'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'achievement', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The Super Bowl champion receives the Vince Lombardi Trophy.', rationaleLong: 'The NFL awards the Vince Lombardi Trophy to the team that wins the Super Bowl.' }),
  q({ prompt: 'Which football play begins with the quarterback taking a knee to run out the clock?', options: ['Victory formation', 'Wildcat', 'Hail Mary'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'That clock-draining look is the victory formation.', rationaleLong: 'Teams use the victory formation to end a game safely by taking a knee rather than risking a turnover.', isTrickQuestion: true }),
  q({ prompt: 'In basketball, what does a player record when they score 10 or more points and 10 or more rebounds in the same game?', options: ['A double-double', 'A triple-double', 'A heat check'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'That stat line is a double-double.', rationaleLong: 'A double-double means reaching double figures in two major counting categories, like points and rebounds.', isTrickQuestion: true }),
  q({ prompt: 'How many points is a shot worth from behind the three-point line in basketball?', options: ['3', '2', '4'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'rule', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'Shots from beyond the arc are worth 3 points.', rationaleLong: 'The three-point line marks the area where a made field goal counts for 3 points instead of 2.' }),
  q({ prompt: 'What is the name of the NBA championship trophy?', options: ["Larry O'Brien Trophy", 'Vince Lombardi Trophy', 'Conn Smythe Trophy'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'achievement', salienceScore: 85, lookupRisk: 'low', rationaleShort: "The NBA title trophy is the Larry O'Brien Trophy.", rationaleLong: "The Larry O'Brien Trophy is presented to the NBA champion each season." }),
  q({ prompt: 'What is the maximum number of points a player can score on one normal made free throw in basketball?', options: ['1', '2', '3'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'rule', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'A standard free throw is worth 1 point.', rationaleLong: 'A normal free throw awards a single point, even though it comes from an uncontested attempt.' }),
  q({ prompt: 'Which basketball term describes scoring on a shot plus the free throw that comes with a foul?', options: ['An and-one', 'A tip-in', 'A clear-path'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That play is called an and-one.', rationaleLong: 'An and-one happens when the shot goes in through contact and the scorer gets one bonus free throw.', isTrickQuestion: true }),
  q({ prompt: 'In baseball, what is a batter awarded after four balls?', options: ['A walk', 'A balk', 'A save'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'rule', salienceScore: 91, lookupRisk: 'low', rationaleShort: 'Four balls send the batter to first on a walk.', rationaleLong: 'When a pitcher throws four balls outside the strike zone, the batter takes first base on a walk.' }),
  q({ prompt: 'What is a pitcher trying to protect when announcers talk about a no-hitter?', options: ['A game with no hits allowed', 'A game with no runs scored', 'A game with no walks issued'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'A no-hitter means the pitcher has allowed no hits.', rationaleLong: 'A no-hitter is a game in which the pitcher or pitching staff keeps the other team from recording a hit.' }),
  q({ prompt: 'Which baseball award goes to the best pitchers in each league?', options: ['The Cy Young Award', 'The Hart Trophy', 'The Heisman Trophy'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'achievement', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The Cy Young Award honors top pitchers.', rationaleLong: 'Major League Baseball gives the Cy Young Award each year to the standout pitcher in each league.' }),
  q({ prompt: 'In baseball, what is a double play?', options: ['Two outs on the same defensive sequence', 'Two runners scoring on one hit', 'Two innings played before a rain delay'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'rule', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A double play records two outs in one sequence.', rationaleLong: 'Defenders turn a double play by retiring two runners or batters on one continuous play.' }),
  q({ prompt: 'Which baseball term describes a game-ending hit that scores the winning run in the last half-inning?', options: ['A walk-off', 'A squeeze bunt', 'A pickoff'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'That game-ending hit is a walk-off.', rationaleLong: 'A walk-off happens when the home team scores the winning run in the final inning and the game ends immediately.' }),
  q({ prompt: 'What is the name of the NHL championship trophy?', options: ['The Stanley Cup', 'The Green Jacket', 'The Davis Cup'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 91, lookupRisk: 'low', rationaleShort: 'The Stanley Cup is the NHL title trophy.', rationaleLong: 'The Stanley Cup is awarded to the team that wins the National Hockey League championship.' }),
  q({ prompt: 'In hockey, what does icing stop the game for?', options: ['Sending the puck from behind center line all the way down untouched', 'Knocking the net off its moorings', 'Making a line change during a power play'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Icing is called when the puck is fired the length of the ice untouched.', rationaleLong: 'Icing happens when a team shoots the puck from its side of center ice all the way down past the goal line without anyone touching it.', isTrickQuestion: true }),
  q({ prompt: 'What does a hockey player score when they record three goals in one game?', options: ['A hat trick', 'A power play', 'A faceoff win'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'Three goals in a game make a hat trick.', rationaleLong: 'A hat trick is the standard hockey term for scoring three goals in the same game.' }),
  q({ prompt: 'What advantage does a hockey team have on a power play?', options: ['More skaters because the other team has a penalty', 'The right to take a free shot from center ice', 'Two goaltenders on the ice at once'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'A power play means one team has more skaters because of a penalty.', rationaleLong: 'When the opponent takes a penalty, the power-play team gets a manpower advantage for a set amount of time.', isTrickQuestion: true }),
  q({ prompt: 'In golf, what is the name for scoring one stroke under par on a hole?', options: ['Birdie', 'Bogey', 'Albatross'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'One under par is a birdie.', rationaleLong: 'Golf calls a score of one stroke under par on a hole a birdie.' }),
  q({ prompt: 'Which tournament winner receives the green jacket?', options: ['The Masters champion', 'The U.S. Open champion', 'The Open champion'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'achievement', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The green jacket goes to the Masters champion.', rationaleLong: 'The Masters is famous for presenting its winner with the green jacket at Augusta National.' }),
  q({ prompt: 'What is par in golf?', options: ['The expected score for a skilled player on a hole', 'A score of exactly 100 for a round', 'A putt made from off the green'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Par is the target score for a skilled player on a hole.', rationaleLong: 'Each hole has a par, which represents the standard number of strokes a skilled golfer is expected to need.' }),
  q({ prompt: 'What is the Ryder Cup?', options: ['A team golf competition between the United States and Europe', 'The trophy for winning the PGA Championship', 'A playoff held after the Masters'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'event', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The Ryder Cup is the U.S.-versus-Europe team golf event.', rationaleLong: 'The Ryder Cup is the best-known team competition in men’s golf, matching the United States against Europe.' }),
  q({ prompt: 'In tennis, what score comes after deuce when one player wins the next point?', options: ['Advantage', 'Break point', 'Set point'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'rule', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The next point after deuce creates advantage.', rationaleLong: 'At deuce, a player who wins the next point takes advantage and needs one more point to win the game.', isTrickQuestion: true }),
  q({ prompt: 'Which Grand Slam tournament is played on clay?', options: ['The French Open', 'Wimbledon', 'The Australian Open'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'event', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'The French Open is the clay-court major.', rationaleLong: 'Roland-Garros, also known as the French Open, is the Grand Slam played on clay.' }),
  q({ prompt: 'What is a tie-break in tennis used to decide?', options: ['A set that reaches 6-6 in games', 'A match tied at one set all', 'Whether a serve was in or out'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'rule', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'A tie-break is used when a set reaches 6-6.', rationaleLong: 'Most sets go to a tie-break at 6-6 to settle the set without playing on indefinitely.' }),
  q({ prompt: 'What does it mean to break serve in tennis?', options: ['Win a game when your opponent is serving', 'Hit a serve that clips the net and lands in', 'Win four straight points'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'Breaking serve means winning a return game.', rationaleLong: 'A player breaks serve by taking a game while the opponent is serving, which is often a key swing in a match.' }),
  q({ prompt: 'What is the decathlon?', options: ['A ten-event track and field competition', 'A ten-team Olympic basketball bracket', 'A ten-round boxing format'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'event', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'The decathlon is a ten-event track and field competition.', rationaleLong: 'The decathlon combines ten separate track and field disciplines into one all-around contest.' }),
  q({ prompt: 'How many medals are awarded in an Olympic relay event final?', options: ['Three medal positions', 'Four medal positions', 'Five medal positions'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'rule', salienceScore: 74, lookupRisk: 'low', rationaleShort: 'Olympic finals still award the usual three medal positions.', rationaleLong: 'Even in relay events, the Olympics award gold, silver, and bronze as the three medal positions.' }),
  q({ prompt: 'Which symbol is most associated with the Olympic movement?', options: ['The five rings', 'The checkered flag', 'The silver fern'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'term', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'The five rings are the best-known Olympic symbol.', rationaleLong: 'The Olympic rings are the iconic symbol of the Olympic movement and appear on the Olympic flag.' }),
  q({ prompt: 'What does biathlon combine?', options: ['Cross-country skiing and rifle shooting', 'Cycling and rowing', 'Swimming and fencing'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'sport-id', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Biathlon combines skiing and shooting.', rationaleLong: 'Biathlon is the winter sport that mixes cross-country skiing with precision rifle shooting.', isTrickQuestion: true }),
  q({ prompt: 'What does a yellow flag usually signal in motorsport?', options: ['Caution and no passing in the affected area', 'The final lap of the race', 'A mandatory pit stop window'], answerIndex: 0, difficulty: 2, subdomain: 'motorsport', promptKind: 'rule', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A yellow flag signals caution and restricts passing.', rationaleLong: 'Motorsport uses the yellow flag to warn drivers about danger ahead and to slow the field in the affected section.' }),
  q({ prompt: 'What is pole position in racing?', options: ['The front-most starting spot', 'The final-place qualifying slot', 'A pit lane restart'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'Pole position is the front-most starting spot.', rationaleLong: 'The fastest qualifier starts first on the grid, which is known as pole position.', isTrickQuestion: true }),
  q({ prompt: 'Which race is known as the Great American Race?', options: ['The Daytona 500', 'The Monaco Grand Prix', 'The 24 Hours of Le Mans'], answerIndex: 0, difficulty: 2, subdomain: 'motorsport', promptKind: 'event', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'The Daytona 500 is nicknamed the Great American Race.', rationaleLong: 'NASCAR fans often call the Daytona 500 the Great American Race because of its prestige and tradition.' }),
  q({ prompt: 'What does a checkered flag mean at the end of a race?', options: ['The race is over', 'A mechanical issue is under review', 'The leader must pit immediately'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'rule', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The checkered flag means the race is finished.', rationaleLong: 'Once the leader takes the checkered flag, the race has officially ended.', isTrickQuestion: true }),
  q({ prompt: 'Which combat sport takes place inside the octagon in the UFC?', options: ['Mixed martial arts', 'Fencing', 'Greco-Roman wrestling only'], answerIndex: 0, difficulty: 1, subdomain: 'combat', promptKind: 'sport-id', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'The UFC’s octagon is home to mixed martial arts.', rationaleLong: 'UFC bouts are contested under mixed martial arts rules inside the octagon.' }),
  q({ prompt: 'What is a unanimous decision in boxing?', options: ['All judges score the fight for the same boxer', 'The referee stops the fight in one round', 'Both boxers agree to a draw'], answerIndex: 0, difficulty: 2, subdomain: 'combat', promptKind: 'rule', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'A unanimous decision means every judge scored it for the same boxer.', rationaleLong: 'If all three judges give the bout to one boxer, the official result is a unanimous decision.', isTrickQuestion: true }),
  q({ prompt: 'Which phrase best describes a hat trick outside hockey as well?', options: ['Three of the same achievement in one game or match', 'A score settled by replay review', 'A penalty served by the team captain'], answerIndex: 0, difficulty: 2, subdomain: 'general-sports', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A hat trick means three of the same major achievement in one contest.', rationaleLong: 'Across several sports, a hat trick refers to recording three key scoring achievements in the same game or match.' }),
  q({ prompt: 'In sports, what does home-field advantage usually refer to?', options: ['Playing in familiar surroundings with crowd support', 'Starting every game with a lead', 'Using a larger roster than the opponent'], answerIndex: 0, difficulty: 1, subdomain: 'general-sports', promptKind: 'term', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'Home-field advantage means the edge that comes from playing in familiar surroundings.', rationaleLong: 'The term home-field advantage describes the extra comfort and crowd energy that can help the home team.' }),
  q({ prompt: 'What is a photo finish?', options: ['A finish too close to call without reviewing the image', 'A ceremonial team picture after a race', 'A replay shown after every championship'], answerIndex: 0, difficulty: 2, subdomain: 'general-sports', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'A photo finish is a finish so close it needs the camera to settle it.', rationaleLong: 'When racers cross almost together, officials use the finish-line camera to determine the exact order.' }),
  q({ prompt: 'Which sport uses the term faceoff to restart play after a stoppage?', options: ['Hockey', 'Golf', 'Tennis'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'sport-id', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Faceoffs are a core restart mechanic in hockey.', rationaleLong: 'Hockey restarts many stoppages with a faceoff, where the referee drops the puck between opposing players.' }),
  q({ prompt: 'Which sport uses the term ace for an untouched winning serve?', options: ['Tennis', 'Baseball', 'Hockey'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'sport-id', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'An ace is an untouched winning serve in tennis.', rationaleLong: 'In tennis, a serve that lands in and is not touched by the opponent is called an ace.' }),
  q({ prompt: 'Which sport uses the term hole-in-one?', options: ['Golf', 'Baseball', 'Soccer'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'sport-id', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A hole-in-one is a golf term.', rationaleLong: 'In golf, a hole-in-one means the player holed out from the tee with a single stroke.' }),
  q({ prompt: 'Which sport uses the term grand slam for winning all four majors in the same year?', options: ['Tennis', 'Basketball', 'Hockey'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'record', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That full-season sweep is the tennis grand slam.', rationaleLong: 'In tennis, winning all four major singles titles in the same calendar year is a grand slam.' }),
  q({ prompt: 'Which baseball term describes a pitcher entering late specifically to protect a lead?', options: ['Closer', 'Leadoff hitter', 'Utility infielder'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'player', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That relief role is called a closer.', rationaleLong: 'A closer is the late-inning relief pitcher trusted to finish the game with a lead intact.' }),
  q({ prompt: 'Which football term describes a long desperation pass near the end of a half?', options: ['Hail Mary', 'QB sneak', 'Draw play'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'That end-of-half desperation throw is a Hail Mary.', rationaleLong: 'A Hail Mary is the long, low-percentage pass teams often try in a last-gasp situation.' }),
  q({ prompt: 'What does a shot clock violation do in basketball?', options: ['It gives the ball to the other team', 'It awards one free throw', 'It resets the quarter'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A shot clock violation causes a turnover.', rationaleLong: 'If a team fails to get a legal shot off before the shot clock expires, possession goes to the opponent.' }),
  q({ prompt: 'Which baseball term means a runner is thrown out trying to steal a base?', options: ['Caught stealing', 'Pick six', 'Forced icing'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'That baserunning out is called caught stealing.', rationaleLong: 'Baseball records a runner as caught stealing when he is put out while trying to advance on a steal attempt.' }),
  q({ prompt: 'What is the offside rule in soccer mainly trying to prevent?', options: ['Attackers camping behind the defense for easy passes', 'Goalkeepers leaving the penalty area', 'Defenders using their hands'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'rule', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'Offside prevents attackers from just waiting behind the defense.', rationaleLong: 'Soccer’s offside rule is meant to stop attackers from lingering beyond the defenders for simple through-balls.' }),
  q({ prompt: 'Which soccer tournament crowns the national team world champion?', options: ['The FIFA World Cup', 'The UEFA Champions League', 'The Club World Series'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'event', salienceScore: 94, lookupRisk: 'low', rationaleShort: 'The FIFA World Cup decides the men’s national team world champion.', rationaleLong: 'The FIFA World Cup is the global tournament used to crown the national team world champion.' }),
  q({ prompt: 'Which surface is Wimbledon played on?', options: ['Grass', 'Clay', 'Hard court'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'venue', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'Wimbledon is played on grass.', rationaleLong: 'Wimbledon is famous as the grass-court major on the tennis calendar.' }),
  q({ prompt: 'Which golf major is played at Augusta National?', options: ['The Masters', 'The U.S. Open', 'The PGA Championship'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'venue', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'Augusta National hosts the Masters.', rationaleLong: 'The Masters is the major tournament played each year at Augusta National Golf Club.' }),
  q({ prompt: 'Which racing event is run at Indianapolis Motor Speedway each year?', options: ['The Indianapolis 500', 'The Daytona 500', 'The Monaco Grand Prix'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'event', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'Indianapolis Motor Speedway hosts the Indianapolis 500.', rationaleLong: 'The Indianapolis 500 is the signature annual race staged at Indianapolis Motor Speedway.' }),
  q({ prompt: 'Which sporting event is associated with a yellow jersey for the overall leader?', options: ['The Tour de France', 'The Boston Marathon', 'The Ryder Cup'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'achievement', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'The yellow jersey belongs to the Tour de France leader.', rationaleLong: 'Cycling fans recognize the yellow jersey as the symbol of the overall race leader in the Tour de France.' }),
  q({ prompt: 'Which Olympic sport includes a vault, uneven bars, balance beam, and floor exercise on the women’s side?', options: ['Artistic gymnastics', 'Diving', 'Figure skating'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'sport-id', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Those apparatuses belong to artistic gymnastics.', rationaleLong: 'Vault, uneven bars, balance beam, and floor are the classic women’s artistic gymnastics events.' }),
  q({ prompt: 'What is a walk-off home run?', options: ['A home run that ends the game immediately for the home team', 'A home run hit on the first pitch of the game', 'A home run that lands outside the stadium'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'rule', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A walk-off homer ends the game on the spot for the home team.', rationaleLong: 'Because the home team takes the lead in the last inning, the game ends immediately when the walk-off home run is hit.' }),
  q({ prompt: 'Which hockey statistic is credited when a goaltender allows zero goals in a full game?', options: ['A shutout', 'A save percentage', 'A plus-minus'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'record', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A goalie who allows no goals records a shutout.', rationaleLong: 'A shutout is awarded when the opposing team fails to score on a goaltender over the course of the game.' }),
  q({ prompt: 'Which basketball term describes a shot taken just before the game clock expires?', options: ['A buzzer-beater', 'A box out', 'A heat map'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That last-second make is a buzzer-beater.', rationaleLong: 'A buzzer-beater is the shot that drops right as the horn sounds to end a period or game.' }),
  q({ prompt: 'In soccer, what does a clean sheet mean for a team or goalkeeper?', options: ['They allowed no goals', 'They completed every pass', 'They won without a yellow card'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A clean sheet means no goals allowed.', rationaleLong: 'Soccer uses clean sheet to describe a match in which a team or goalkeeper keeps the opponent off the scoreboard.' }),
  q({ prompt: 'Which baseball feat did Cal Ripken Jr. become famous for?', options: ['Playing in 2,632 consecutive games', 'Hitting 762 home runs', 'Throwing 300 complete games'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'record', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Cal Ripken Jr. is famous for his consecutive-games streak.', rationaleLong: 'Ripken’s signature record is his run of 2,632 straight games played, which became a symbol of baseball durability.' }),
  q({ prompt: 'Which basketball record is Wilt Chamberlain most famously tied to?', options: ['100 points in a game', '11 championship rings', 'The longest three-point streak'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'record', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Wilt Chamberlain is the player who scored 100 points in a game.', rationaleLong: 'Wilt’s 100-point game remains one of the most famous single-game scoring records in sports.' }),
  q({ prompt: 'What made Joe DiMaggio’s 56-game streak famous?', options: ['He got at least one hit in 56 straight games', 'He stole a base in 56 straight games', 'He hit 56 home runs in one month'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'record', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'DiMaggio’s streak was 56 straight games with a hit.', rationaleLong: 'Joe DiMaggio’s famous record is his 56-game hitting streak, one of baseball’s most iconic marks.' }),
  q({ prompt: 'Which football running back is the NFL’s all-time leading rusher?', options: ['Emmitt Smith', 'Barry Sanders', 'Walter Payton'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'record', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Emmitt Smith is the NFL’s all-time rushing leader.', rationaleLong: 'Smith holds the NFL career rushing-yardage record, placing him at the top of the all-time list.' }),
  q({ prompt: 'Which tennis player is most strongly associated with the nickname The King of Clay?', options: ['Rafael Nadal', 'Roger Federer', 'Novak Djokovic'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'player', salienceScore: 88, lookupRisk: 'low', obscurityFlags: ['famous-nickname'], rationaleShort: 'Rafael Nadal is the player most associated with clay-court dominance.', rationaleLong: 'Nadal’s long reign at Roland-Garros made him the player most closely linked with clay-court supremacy.' }),
  q({ prompt: 'Which golfer holds the nickname The King?', options: ['Arnold Palmer', 'Phil Mickelson', 'Jordan Spieth'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'player', salienceScore: 82, lookupRisk: 'low', obscurityFlags: ['famous-nickname'], rationaleShort: 'Arnold Palmer is the golfer known as The King.', rationaleLong: 'Arnold Palmer’s charisma and influence made The King one of golf’s most famous nicknames.' }),
  q({ prompt: 'Which boxer was nicknamed The Greatest?', options: ['Muhammad Ali', 'Mike Tyson', 'Joe Frazier'], answerIndex: 0, difficulty: 1, subdomain: 'combat', promptKind: 'player', salienceScore: 93, lookupRisk: 'low', obscurityFlags: ['famous-nickname'], rationaleShort: 'Muhammad Ali called himself The Greatest.', rationaleLong: 'Muhammad Ali turned The Greatest into one of the most iconic self-descriptions in sports history.' }),
  q({ prompt: 'In golf, what is an eagle?', options: ['Two strokes under par on a hole', 'A hole completed in one shot', 'One stroke over par'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'An eagle is two under par on a hole.', rationaleLong: 'Golf scores use eagle for finishing a hole two strokes under its par value.' }),
  q({ prompt: 'In baseball, what does RBI stand for?', options: ['Runs batted in', 'Reached base instantly', 'Relief batter index'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'RBI stands for runs batted in.', rationaleLong: 'Baseball credits a batter with an RBI when a plate appearance helps bring a run home.' }),
  q({ prompt: 'What does a technical foul penalize in basketball?', options: ['Unsportsmanlike or procedural violations', 'Only illegal screens', 'Shots taken after the whistle'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'rule', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'A technical foul covers unsportsmanlike or procedural violations.', rationaleLong: 'Basketball uses technical fouls for conduct and other non-contact rule problems rather than ordinary personal fouls.' }),
  q({ prompt: 'In soccer, what is a brace?', options: ['Two goals by the same player in one match', 'A match suspended for weather', 'A penalty saved and then scored on rebound'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'term', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'A brace means two goals by the same player in one match.', rationaleLong: 'Soccer fans use brace for a two-goal performance by one player in a single game.' }),
  q({ prompt: 'Which competition awards the Conn Smythe Trophy?', options: ['The NHL playoffs', 'The NBA Finals', 'The College World Series'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 76, lookupRisk: 'low', rationaleShort: 'The Conn Smythe Trophy is tied to the NHL playoffs.', rationaleLong: 'The Conn Smythe Trophy honors the most valuable player during the NHL postseason.' }),
  q({ prompt: 'Which baseball term refers to a hitter leading off an inning with a home run?', options: ['A leadoff homer', 'A squeeze play', 'A hold'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 78, lookupRisk: 'low', rationaleShort: 'That first-batter home run is called a leadoff homer.', rationaleLong: 'When the opening batter of an inning homers, baseball calls it a leadoff home run.' }),
  q({ prompt: 'What is an own goal in soccer?', options: ['A team accidentally scoring into its own net', 'A goal scored directly from a corner', 'A goal scored after advantage is played'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'An own goal happens when a team scores into its own net.', rationaleLong: 'Soccer records an own goal when the defending team accidentally sends the ball into its own goal.' }),
  q({ prompt: 'What does a pit stop let a racing team do?', options: ['Service the car during the race', 'Appeal the official result', 'Swap drivers in a sprint event only'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A pit stop is for servicing the car during the race.', rationaleLong: 'Teams use pit stops for tires, fuel, repairs, and setup changes while the race is still in progress.' }),
  q({ prompt: 'In Olympic track, what is the anchor leg?', options: ['The final leg of a relay', 'The warm-up lap before the race', 'The leg with the shortest distance'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'term', salienceScore: 79, lookupRisk: 'low', rationaleShort: 'The anchor leg is the final relay leg.', rationaleLong: 'Teams often put a strong finisher on the anchor leg because it is the final segment of the relay.' }),
  q({ prompt: 'In football, what does it mean when a quarterback spikes the ball?', options: ['He throws it directly into the ground to stop the clock', 'He celebrates after a touchdown', 'He hands it off from a kneel-down look'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Spiking the ball stops the clock with an incomplete pass.', rationaleLong: 'Quarterbacks spike the ball into the ground immediately after the snap to conserve time late in a game.' }),
  q({ prompt: 'Which tennis term describes a serve that clips the net and still lands in the correct box?', options: ['A let', 'An ace', 'A smash'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'That net-clipping serve is called a let.', rationaleLong: 'A serve that touches the net but still lands in the proper service box is replayed as a let.' }),
  q({ prompt: 'What does ERA measure for a baseball pitcher?', options: ['Average earned runs allowed per nine innings', 'How often the pitcher reaches base', 'How many strikeouts the pitcher records per inning'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'record', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'ERA measures earned runs allowed per nine innings.', rationaleLong: 'Earned run average gives pitchers a rate stat based on how many earned runs they allow over nine innings.' }),
  q({ prompt: 'Which football award is most associated with the best player in college football?', options: ['The Heisman Trophy', 'The Golden Boot', 'The Green Jacket'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'achievement', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The Heisman Trophy is college football’s famous player award.', rationaleLong: 'The Heisman Trophy is the most famous annual individual award in college football.' }),
  q({ prompt: 'Which basketball stat means a player reached double digits in three categories in one game?', options: ['A triple-double', 'A double-double', 'A three-level score'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'That all-around stat line is a triple-double.', rationaleLong: 'A triple-double happens when a player reaches at least 10 in three different counting categories.' }),
  q({ prompt: 'Which golf tournament is played at Pebble Beach only in U.S. Open years, not as the permanent home of a major?', options: ['The U.S. Open', 'The Masters', 'The Open Championship'], answerIndex: 0, difficulty: 3, subdomain: 'golf', promptKind: 'venue', salienceScore: 74, lookupRisk: 'medium', rationaleShort: 'Pebble Beach rotates in as a U.S. Open venue.', rationaleLong: 'Unlike Augusta for the Masters, Pebble Beach is one of several famous courses that occasionally host the U.S. Open.' }),
  q({ prompt: 'Which soccer competition is for top club teams in Europe rather than national teams?', options: ['UEFA Champions League', 'The FIFA World Cup', 'The Copa America'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'event', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'The UEFA Champions League is the big European club competition.', rationaleLong: 'Unlike the World Cup or Copa America, the UEFA Champions League is contested by elite European clubs.' }),
  q({ prompt: 'In hockey, what is the crease?', options: ['The marked area in front of the goal', 'A delayed penalty signal', 'A postseason tiebreaker'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'term', salienceScore: 79, lookupRisk: 'low', rationaleShort: 'The crease is the painted area around the goalmouth.', rationaleLong: 'Hockey uses the crease to mark the goaltender’s area directly in front of the net.' }),
  q({ prompt: 'Which motorsport event is most closely associated with Monaco?', options: ['The Monaco Grand Prix', 'The Daytona 500', 'The Baja 1000'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'event', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'Monaco is most famous for its Formula 1 Grand Prix.', rationaleLong: 'The narrow street circuit in Monaco is one of the signature races on the Formula 1 calendar.' }),
  q({ prompt: 'What does a no-look pass try to do in basketball?', options: ['Move the ball without telegraphing the target', 'Earn an automatic fast break', 'Stop the shot clock after a steal'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 78, lookupRisk: 'low', rationaleShort: 'A no-look pass hides the passer’s real target.', rationaleLong: 'Players use no-look passes to disguise where the ball is going and freeze the defense for a moment.' }),
  q({ prompt: 'What is the Davis Cup?', options: ['A men’s international team competition in tennis', 'A tennis award for best junior player', 'The trophy for winning Wimbledon'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'event', salienceScore: 77, lookupRisk: 'low', rationaleShort: 'The Davis Cup is men’s international team tennis.', rationaleLong: 'The Davis Cup is the long-running international team competition in men’s tennis.' }),
  q({ prompt: 'What does a goalkeeper save in soccer?', options: ['A shot headed into the goal', 'A throw-in from midfield', 'A free kick taken by their own team'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'player', salienceScore: 76, lookupRisk: 'low', rationaleShort: 'A goalkeeper save stops a shot from becoming a goal.', rationaleLong: 'Goalkeepers are credited with a save when they stop a goal-bound effort from crossing the line.' }),
  q({ prompt: 'What is a reliever in baseball?', options: ['A pitcher who enters after the starter', 'A catcher brought in only for bunts', 'A batter used only in extra innings'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'player', salienceScore: 79, lookupRisk: 'low', rationaleShort: 'A reliever is the pitcher who comes in after the starter.', rationaleLong: 'Relief pitchers are used after the starting pitcher leaves the game, often in specific inning or matchup roles.' }),
  q({ prompt: 'Which football term describes a runner staying in bounds to keep the clock moving?', options: ['Staying in bounds', 'Going onside', 'Declaring eligible'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 74, lookupRisk: 'low', rationaleShort: 'Remaining in bounds keeps the clock running.', rationaleLong: 'Late in games, ballcarriers sometimes stay in bounds on purpose so the clock continues to move.' }),
  q({ prompt: 'Which famous sports record belongs to Wayne Gretzky?', options: ['Most career points in NHL history', 'Most consecutive no-hitters', 'Most career grand slams in golf'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'record', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'Gretzky holds the NHL career points record.', rationaleLong: 'Wayne Gretzky’s place atop the NHL all-time points list is one of the sport’s defining records.' }),
  q({ prompt: 'Which Olympic event is built around four strokes: butterfly, backstroke, breaststroke, and freestyle?', options: ['The medley', 'The steeplechase', 'The pentathlon'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'event', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'The medley combines all four competitive strokes.', rationaleLong: 'The medley race is the swimming event that strings together butterfly, backstroke, breaststroke, and freestyle.' }),
  q({ prompt: 'Which golf term describes a score one stroke over par on a hole?', options: ['Bogey', 'Birdie', 'Eagle'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'One over par is a bogey.', rationaleLong: 'Golf uses bogey for a score of one stroke more than par on a hole.' }),
  q({ prompt: 'Which racing discipline is most closely associated with stock cars on oval tracks?', options: ['NASCAR', 'MotoGP', 'Formula Drift'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'sport-id', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'NASCAR is the stock-car discipline most associated with ovals.', rationaleLong: 'NASCAR is the best-known stock-car series and is strongly tied to oval-track racing.' }),
  q({ prompt: 'Which boxing term describes a fighter being knocked down and unable to beat the count?', options: ['Knockout', 'Split decision', 'Clinching'], answerIndex: 0, difficulty: 1, subdomain: 'combat', promptKind: 'term', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That fight-ending result is a knockout.', rationaleLong: 'A knockout happens when a fighter is knocked down and cannot rise before the referee’s count ends.' }),
  q({ prompt: 'Which soccer award goes to the world’s most celebrated individual player each year?', options: ["Ballon d'Or", 'Golden Globe', 'Cy Young Award'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'achievement', salienceScore: 84, lookupRisk: 'low', rationaleShort: "The Ballon d'Or is the headline individual award in global soccer.", rationaleLong: "The Ballon d'Or is the famous annual individual prize associated with the world’s top soccer player." }),
  q({ prompt: 'Which football term refers to the area inside the opponent’s 20-yard line?', options: ['The red zone', 'The neutral zone', 'The tackle box'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'That scoring-threat area is the red zone.', rationaleLong: 'Commentators call the area inside the opponent’s 20-yard line the red zone because scoring chances rise there.', isTrickQuestion: true }),
  q({ prompt: 'Which baseball term describes a pitcher throwing a complete game with no hits and no walks?', options: ['A perfect game', 'A quality start', 'A save opportunity'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'record', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That flawless start is a perfect game.', rationaleLong: 'A perfect game means no opposing batter reaches base for the entire outing.' }),
  q({ prompt: 'Which basketball term describes protecting the basket from a shot attempt by swatting it away?', options: ['Blocking the shot', 'Drawing a charge', 'Closing out'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'rule', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'Swatting away a legal shot attempt is a block.', rationaleLong: 'A blocked shot happens when a defender legally knocks away a shot before it reaches the basket.' }),
  q({ prompt: 'Which hockey award goes to the league’s most valuable player in the regular season?', options: ['The Hart Trophy', 'The Calder Trophy', 'The Vezina Trophy'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 74, lookupRisk: 'low', rationaleShort: 'The Hart Trophy is the NHL regular-season MVP award.', rationaleLong: 'The NHL honors its most valuable regular-season player with the Hart Memorial Trophy.' }),
  q({ prompt: 'Which Olympic winter discipline combines a downhill ski jump with cross-country skiing?', options: ['Nordic combined', 'Biathlon', 'Ski cross'], answerIndex: 0, difficulty: 3, subdomain: 'olympics', promptKind: 'sport-id', salienceScore: 72, lookupRisk: 'medium', rationaleShort: 'Nordic combined joins ski jumping and cross-country skiing.', rationaleLong: 'Nordic combined is the winter event that pairs a ski jump with a cross-country skiing race.' }),
  q({ prompt: 'Which motorsport term describes the lane drivers enter for tires, fuel, or repairs?', options: ['Pit lane', 'Victory lane', 'Parc ferme'], answerIndex: 0, difficulty: 2, subdomain: 'motorsport', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That service road is pit lane.', rationaleLong: 'Pit lane is where race cars enter for service during practice, qualifying, or the race itself.' }),
  q({ prompt: 'What does a goalie’s save percentage try to capture?', options: ['How many shots on goal they stop', 'How many minutes they play without a penalty', 'How many faceoffs their team wins'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'record', salienceScore: 75, lookupRisk: 'low', rationaleShort: 'Save percentage measures how many shots on goal a goalie stops.', rationaleLong: 'A goalie’s save percentage is the share of shots on goal they keep out of the net.' }),
  q({ prompt: 'What is a sacrifice fly in baseball?', options: ['A caught fly ball that still allows a runner to score', 'A popup that clears the infield on a bunt', 'A practice swing taken before the pitch'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'rule', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'A sacrifice fly is a caught fly ball that still brings in a run.', rationaleLong: 'If a runner tags and scores after a deep fly is caught, the batter gets credit for a sacrifice fly.' }),
  q({ prompt: 'Which soccer role is allowed to use hands inside the penalty area?', options: ['The goalkeeper', 'The center back', 'The captain'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'player', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Only the goalkeeper can handle the ball there.', rationaleLong: 'Inside the penalty area, the goalkeeper is the player allowed to use hands while the ball is in play.' }),
  q({ prompt: 'Which basketball shot is taken from beyond the arc?', options: ['A three-pointer', 'A free throw', 'A tip-in'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A shot from beyond the arc is a three-pointer.', rationaleLong: 'The arc marks the distance where a made field goal counts for 3 points instead of 2.' }),
  q({ prompt: 'Which football statistic measures catches by a receiver?', options: ['Receptions', 'Sacks', 'Punts'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'record', salienceScore: 78, lookupRisk: 'low', rationaleShort: 'Catches are tracked as receptions.', rationaleLong: 'Football records completed catches by receivers as receptions.' }),
  q({ prompt: 'Which golf format pits Europe against the United States in a biennial team match?', options: ['The Ryder Cup', 'The FedEx Cup', 'The Presidents Cup only'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'event', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Europe and the United States meet in the Ryder Cup.', rationaleLong: 'The Ryder Cup is the biennial team golf competition between the United States and Europe.' }),
  q({ prompt: 'Which tennis term describes the score 40-40?', options: ['Deuce', 'Love', 'Advantage'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'Forty-all is called deuce.', rationaleLong: 'Tennis uses deuce for a game tied at 40-40, where two straight points are then needed to win.', isTrickQuestion: true }),
  q({ prompt: 'Which Olympic race distance is one full lap around a standard outdoor track?', options: ['400 meters', '800 meters', '200 meters'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'event', salienceScore: 78, lookupRisk: 'low', rationaleShort: '400 meters is one lap on a standard outdoor track.', rationaleLong: 'On a standard outdoor track, the 400-meter race covers one full lap.' }),
  q({ prompt: 'What does a NASCAR overtime finish try to guarantee?', options: ['A finish under green-flag racing', 'A two-hour television window', 'A mandatory final pit stop'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'rule', salienceScore: 76, lookupRisk: 'low', rationaleShort: 'It is designed to create a green-flag finish.', rationaleLong: 'NASCAR overtime extends the race so the event can end under green rather than behind a caution flag.' }),
  q({ prompt: 'Which boxing term describes fighting at very close range while tying up the opponent’s arms?', options: ['Clinching', 'Countering', 'Southpawing'], answerIndex: 0, difficulty: 2, subdomain: 'combat', promptKind: 'term', salienceScore: 79, lookupRisk: 'low', rationaleShort: 'That tie-up maneuver is clinching.', rationaleLong: 'Boxers clinch when they get in close and temporarily tie up their opponent to halt exchanges.' }),
  q({ prompt: 'Which soccer term describes a pass that sets up a goal scorer?', options: ['An assist', 'A clearance', 'A dead ball'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That setup pass is credited as an assist.', rationaleLong: 'Soccer records the player who directly sets up the goal as earning an assist.' }),
];

const MIX_PATCHES: CuratedTriviaSourceQuestion[] = [
  q({
    prompt: 'In music, what is an arpeggio?',
    options: [
      'The notes of a chord played one after another',
      'A choir part sung below the melody',
      'A tempo marking that means gradually faster',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 88,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An arpeggio breaks a chord into separate notes.',
    rationaleLong: 'Instead of striking all the notes of a chord together, an arpeggio plays them one by one in sequence.',
  }),
  q({
    prompt: 'What does the science term viscosity describe?',
    options: [
      'How strongly a fluid resists flowing',
      'How quickly a liquid evaporates',
      'How cold a liquid must get to freeze',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Viscosity is a fluid’s resistance to flow.',
    rationaleLong: 'Honey has a higher viscosity than water because it resists flowing more strongly.',
  }),
  q({
    prompt: 'What word describes a word or phrase that reads the same backward and forward?',
    options: ['Palindrome', 'Acronym', 'Anagram'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 87,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'That kind of wordplay is a palindrome.',
    rationaleLong: 'A palindrome reads the same in both directions, which is why words like level and racecar fit the term.',
  }),
  q({
    prompt: 'In cartography, what do contour lines show on a map?',
    options: ['Changes in elevation', 'Political borders', 'Average rainfall'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Contour lines show elevation changes.',
    rationaleLong: 'Topographic maps use contour lines to connect points at the same elevation and show the shape of the land.',
  }),
  q({
    prompt: 'What does the word solstice mark on the calendar?',
    options: [
      'The longest or shortest daylight day of the year',
      'The midpoint between two full moons',
      'The date when all planets align in the sky',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'space',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A solstice marks the year’s longest or shortest daylight day.',
    rationaleLong: 'The summer and winter solstices happen when Earth’s tilt gives one hemisphere its maximum or minimum daylight.',
  }),
  q({
    prompt: 'What is a triptych in art?',
    options: [
      'An artwork made of three connected panels',
      'A painting done entirely in black and white',
      'A sculpture designed to move with the wind',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'pop-culture',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A triptych is built from three panels.',
    rationaleLong: 'Triptychs are artworks arranged in three related sections, often hinged or displayed side by side.',
  }),
  q({
    prompt: 'What does the phrase Pyrrhic victory describe?',
    options: [
      'A win that comes at such a high cost it barely feels like a win',
      'A victory earned without scoring in regulation time',
      'A surprise win by the underdog in a rematch',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A Pyrrhic victory is a win that costs too much.',
    rationaleLong: 'The phrase comes from King Pyrrhus, whose costly battlefield success became shorthand for a victory that is almost self-defeating.',
  }),
  q({
    prompt: 'Which term describes a jump back to earlier events inside a story?',
    options: ['Flashback', 'Foreshadowing', 'Epilogue'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'television',
    editorialBucket: 'experimental',
    promptKind: 'work',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'That backward jump is a flashback.',
    rationaleLong: 'A flashback interrupts the present narrative to show an earlier event that adds context or emotional weight.',
  }),
  q({
    prompt: 'What does the word equinox mark on the calendar?',
    options: [
      'A day when daylight and darkness are nearly equal in length',
      'The first full moon of a new season',
      'The date when all tides are at their highest',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'space',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An equinox is the point when day and night are nearly equal.',
    rationaleLong: 'The spring and fall equinoxes mark the moments when Earth’s tilt gives most places nearly equal daylight and darkness.',
  }),
  q({
    prompt: 'Which word describes a chain or cluster of islands?',
    options: ['Archipelago', 'Peninsula', 'Savanna'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A chain of islands is an archipelago.',
    rationaleLong: 'Geographers use archipelago for a group of islands linked by location or origin.',
  }),
  q({
    prompt: 'In storytelling, what is a cliffhanger?',
    options: [
      'An ending that leaves the outcome unresolved on purpose',
      'A narrator who speaks from outside the story',
      'A chapter told in reverse order',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'television',
    editorialBucket: 'experimental',
    promptKind: 'work',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A cliffhanger ends by leaving the outcome unresolved.',
    rationaleLong: 'Cliffhangers are built to create suspense by cutting away before the audience learns what happens next.',
  }),
  q({
    prompt: 'What does the biology word nocturnal describe?',
    options: ['Active mainly at night', 'Able to live without water', 'Changing color with the seasons'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'nature',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Nocturnal means active mainly at night.',
    rationaleLong: 'Animals described as nocturnal do most of their feeding, hunting, or movement after dark.',
  }),
  q({
    prompt: 'What is an oxymoron in writing?',
    options: [
      'A phrase that puts two seemingly contradictory terms together',
      'A word created by blending two longer words',
      'A sentence that asks a question without needing an answer',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An oxymoron pairs contradictory terms in one phrase.',
    rationaleLong: 'Expressions like bittersweet or deafening silence are oxymorons because they combine ideas that seem to clash.',
  }),
  q({
    prompt: 'What does the word deciduous mean for a tree?',
    options: ['It sheds its leaves seasonally', 'It grows only near salt water', 'It stays green all year'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'nature',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Deciduous trees shed their leaves seasonally.',
    rationaleLong: 'Deciduous describes plants that lose their leaves during part of the year instead of staying green year-round.',
  }),
  q({
    prompt: 'In geography, what is a peninsula?',
    options: [
      'A piece of land almost surrounded by water but still attached to the mainland',
      'A narrow waterway connecting two larger bodies of water',
      'A mountain ridge that marks a national border',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A peninsula is land mostly surrounded by water but still attached to the mainland.',
    rationaleLong: 'Peninsulas extend into water on multiple sides while remaining connected to the larger landmass.',
  }),
  q({
    prompt: 'What is an epilogue in a book or play?',
    options: [
      'A closing section that follows the main ending',
      'A list of sources used by the author',
      'A note explaining how the title was chosen',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'work',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An epilogue is the closing section after the main ending.',
    rationaleLong: 'Writers use an epilogue to show what happens after the core story has already reached its ending.',
  }),
  q({
    prompt: 'What does the music marking crescendo tell performers to do?',
    options: ['Gradually get louder', 'Slow down steadily', 'Repeat the previous measure'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Crescendo tells performers to gradually get louder.',
    rationaleLong: 'A crescendo marks a gradual increase in volume rather than a sudden jump in sound.',
  }),
  q({
    prompt: 'What does the word fossilize mean in everyday English?',
    options: [
      'To become fixed in an old pattern and stop changing',
      'To turn quickly into solid stone',
      'To hide something permanently underground',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Fossilize means becoming fixed in an old pattern.',
    rationaleLong: 'Outside science, fossilize often describes habits or systems that harden and stop adapting over time.',
  }),
  q({
    prompt: 'What is onomatopoeia?',
    options: [
      'A word that imitates a sound',
      'A line of poetry with five metrical feet',
      'A sentence with the words arranged alphabetically',
    ],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Onomatopoeia is a word that imitates a sound.',
    rationaleLong: 'Words like buzz and hiss are examples of onomatopoeia because they sound like the noises they describe.',
  }),
  q({ prompt: 'Which planet is famous for its rings?', options: ['Saturn', 'Mars', 'Venus'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'space', promptKind: 'concept', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Saturn is the ringed planet.', rationaleLong: 'Saturn is the planet best known for its dramatic ring system, making it the clear science answer.' }),
  q({ prompt: 'Which author wrote Pride and Prejudice?', options: ['Jane Austen', 'George Eliot', 'Charlotte Bronte'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'literature', promptKind: 'work', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Jane Austen wrote Pride and Prejudice.', rationaleLong: 'Pride and Prejudice is one of Jane Austen’s signature novels, making her the correct author match.' }),
  q({ prompt: 'Which city is home to the Eiffel Tower?', options: ['Paris', 'Rome', 'Brussels'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'The Eiffel Tower stands in Paris.', rationaleLong: 'Paris is the city most famously associated with the Eiffel Tower.' }),
  q({ prompt: 'What does DNA stand for?', options: ['Deoxyribonucleic acid', 'Dynamic neural array', 'Digital numeric archive'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'science-facts', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'DNA stands for deoxyribonucleic acid.', rationaleLong: 'Deoxyribonucleic acid is the full name of DNA, the molecule that carries genetic information.' }),
  q({ prompt: 'Which document begins with the words We the People?', options: ['The U.S. Constitution', 'The Magna Carta', 'The Gettysburg Address'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'history-facts', promptKind: 'work', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The U.S. Constitution opens with We the People.', rationaleLong: 'The Preamble to the U.S. Constitution famously begins with the phrase We the People.' }),
  q({ prompt: 'Which movie features the song My Heart Will Go On?', options: ['Titanic', 'The Bodyguard', 'Dirty Dancing'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'movies', promptKind: 'work', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'My Heart Will Go On is the signature song from Titanic.', rationaleLong: 'Celine Dion’s My Heart Will Go On became inseparable from the film Titanic.' }),
  q({ prompt: 'Which gas do plants take in during photosynthesis?', options: ['Carbon dioxide', 'Helium', 'Hydrogen'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'nature', promptKind: 'concept', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'Plants use carbon dioxide during photosynthesis.', rationaleLong: 'Photosynthesis uses carbon dioxide, water, and sunlight to make sugars and release oxygen.' }),
  q({ prompt: 'What is the capital of Japan?', options: ['Tokyo', 'Osaka', 'Kyoto'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 92, lookupRisk: 'low', rationaleShort: 'Tokyo is the capital of Japan.', rationaleLong: 'Tokyo is Japan’s capital and its best-known political and economic center.' }),
  q({ prompt: 'Which artist painted The Starry Night?', options: ['Vincent van Gogh', 'Claude Monet', 'Pablo Picasso'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'pop-culture', promptKind: 'work', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'The Starry Night was painted by Vincent van Gogh.', rationaleLong: 'Vincent van Gogh created The Starry Night, one of the best-known paintings in Western art.' }),
  q({ prompt: 'Which ocean is the largest on Earth?', options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The Pacific is the largest ocean on Earth.', rationaleLong: 'The Pacific Ocean covers more surface area than the Atlantic or Indian oceans.' }),
  q({ prompt: 'Which instrument has 88 keys?', options: ['Piano', 'Violin', 'Trumpet'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'music', promptKind: 'equipment', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A piano has 88 keys.', rationaleLong: 'The standard modern piano keyboard has 88 keys, split between white and black notes.' }),
  q({ prompt: 'What does the word renaissance literally mean?', options: ['Rebirth', 'Empire', 'Compass'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'history-facts', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Renaissance literally means rebirth.', rationaleLong: 'The term renaissance comes from the idea of rebirth, especially in art and learning.' }),
  q({ prompt: 'Which element has the chemical symbol Au?', options: ['Gold', 'Silver', 'Argon'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'science-facts', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Au is the symbol for gold.', rationaleLong: 'The symbol Au comes from the Latin name aurum, which is why it represents gold.' }),
  q({ prompt: 'Which country is both in Europe and Asia and is famous for the city of Istanbul?', options: ['Turkey', 'Portugal', 'Norway'], answerIndex: 0, difficulty: 2, domain: 'world', subdomain: 'culture', promptKind: 'place', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Turkey spans Europe and Asia and includes Istanbul.', rationaleLong: 'Turkey is a transcontinental country, and Istanbul is one of its most famous cities.' }),
  q({ prompt: 'Which TV series follows the Stark and Lannister families?', options: ['Game of Thrones', 'Succession', 'The Crown'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'television', promptKind: 'work', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The Stark and Lannister families anchor Game of Thrones.', rationaleLong: 'Game of Thrones centers many of its power struggles on the Stark and Lannister families.' }),
  q({ prompt: 'What is the hardest natural substance on Earth?', options: ['Diamond', 'Granite', 'Quartz'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'science-facts', promptKind: 'concept', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'Diamond is the hardest natural substance.', rationaleLong: 'Among naturally occurring materials, diamond is famous for its extreme hardness.' }),
  q({ prompt: 'Which U.S. holiday is associated with fireworks on July 4?', options: ['Independence Day', 'Memorial Day', 'Labor Day'], answerIndex: 0, difficulty: 1, domain: 'history', subdomain: 'history-facts', promptKind: 'event', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'July 4 is Independence Day in the United States.', rationaleLong: 'The United States celebrates Independence Day on July 4, often with fireworks and parades.' }),
  q({ prompt: 'Which language is most widely spoken in Brazil?', options: ['Portuguese', 'Spanish', 'French'], answerIndex: 0, difficulty: 2, domain: 'world', subdomain: 'culture', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'Portuguese is the main language of Brazil.', rationaleLong: 'Brazil is the largest Portuguese-speaking country in the world.' }),
  q({ prompt: 'Which artist is known as the King of Pop?', options: ['Michael Jackson', 'Prince', 'Elton John'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'music', promptKind: 'person', salienceScore: 92, lookupRisk: 'low', obscurityFlags: ['famous-nickname'], rationaleShort: 'Michael Jackson is the King of Pop.', rationaleLong: 'Michael Jackson’s global fame and influence made King of Pop his signature nickname.' }),
  q({ prompt: 'Which planet is known as the Red Planet?', options: ['Mars', 'Mercury', 'Jupiter'], answerIndex: 0, difficulty: 1, domain: 'science', subdomain: 'space', promptKind: 'person', salienceScore: 90, lookupRisk: 'low', obscurityFlags: ['famous-nickname'], rationaleShort: 'Mars is known as the Red Planet.', rationaleLong: 'Mars looks reddish because of iron oxide on its surface, which gave it the Red Planet nickname.' }),
  q({ prompt: 'What is the term for a word that means the opposite of another word?', options: ['Antonym', 'Homonym', 'Synonym'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'history-facts', promptKind: 'term', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'Antonym means the opposite of another word.', rationaleLong: 'In language, an antonym is a word with an opposite meaning, unlike a synonym.' }),
  q({ prompt: 'Which structure keeps blood moving through the human body?', options: ['The heart', 'The liver', 'The pancreas'], answerIndex: 0, difficulty: 1, domain: 'science', subdomain: 'science-facts', promptKind: 'concept', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'The heart pumps blood through the body.', rationaleLong: 'The heart is the organ that circulates blood, delivering oxygen and nutrients around the body.' }),
  q({ prompt: 'Which city is famous for the Colosseum?', options: ['Rome', 'Athens', 'Lisbon'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The Colosseum is in Rome.', rationaleLong: 'Rome is the city most closely associated with the ancient Colosseum.' }),
  q({ prompt: 'Which singer released the album 21?', options: ['Adele', 'Beyonce', 'Taylor Swift'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'music', promptKind: 'work', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Adele released the album 21.', rationaleLong: '21 was the breakout album that cemented Adele as a major pop star.' }),
  q({ prompt: 'Which explorer is associated with the voyage of the Beagle and the theory of evolution by natural selection?', options: ['Charles Darwin', 'James Cook', 'Roald Amundsen'], answerIndex: 0, difficulty: 3, domain: 'science', subdomain: 'nature', promptKind: 'person', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Charles Darwin is the explorer-scientist tied to the Beagle and natural selection.', rationaleLong: 'Darwin’s observations during the Beagle voyage helped shape his theory of evolution by natural selection.' }),
  q({ prompt: 'Which war was fought in the United States between the Union and the Confederacy?', options: ['The Civil War', 'The War of 1812', 'The Spanish-American War'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'history-facts', promptKind: 'event', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That conflict was the Civil War.', rationaleLong: 'The American Civil War was fought between the Union and the Confederacy in the 1860s.' }),
  q({ prompt: 'Which continent is the Sahara Desert primarily located on?', options: ['Africa', 'Asia', 'Australia'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The Sahara is in Africa.', rationaleLong: 'The Sahara stretches across North Africa, making Africa the correct continent.' }),
  q({ prompt: 'Which movie centers on a theme park filled with cloned dinosaurs?', options: ['Jurassic Park', 'Jaws', 'E.T.'], answerIndex: 0, difficulty: 1, domain: 'arts', subdomain: 'movies', promptKind: 'work', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'Jurassic Park is the cloned-dinosaur theme park movie.', rationaleLong: 'Jurassic Park famously imagines a theme park populated by cloned dinosaurs.' }),
  q({ prompt: 'What do bees primarily collect from flowers to make honey?', options: ['Nectar', 'Sand', 'Clay'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'nature', promptKind: 'concept', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'Bees collect nectar to make honey.', rationaleLong: 'Bees gather nectar from flowers, then process it into honey back at the hive.' }),
  q({ prompt: 'Which country gifted the Statue of Liberty to the United States?', options: ['France', 'Spain', 'Italy'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'people', promptKind: 'event', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'France gifted the Statue of Liberty to the United States.', rationaleLong: 'The Statue of Liberty was a gift from France, celebrating the relationship between the two nations.' }),
  q({ prompt: 'Which city is known for the opera house with shell-like sails?', options: ['Sydney', 'Auckland', 'Cape Town'], answerIndex: 0, difficulty: 2, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'That landmark opera house is in Sydney.', rationaleLong: 'The Sydney Opera House is famous for its sail-like design on Sydney Harbour.' }),
  q({ prompt: 'Which singer is closely associated with the song Like a Prayer?', options: ['Madonna', 'Cher', 'Cyndi Lauper'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'music', promptKind: 'person', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'Like a Prayer is one of Madonna’s best-known songs.', rationaleLong: 'Madonna’s Like a Prayer became one of her defining pop hits.' }),
  q({ prompt: 'Which branch of science studies earthquakes?', options: ['Seismology', 'Ecology', 'Botany'], answerIndex: 0, difficulty: 3, domain: 'science', subdomain: 'science-facts', promptKind: 'term', salienceScore: 78, lookupRisk: 'low', rationaleShort: 'Seismology is the study of earthquakes.', rationaleLong: 'Seismology focuses on earthquakes, seismic waves, and the movement of Earth’s crust.' }),
  q({ prompt: 'Which ancient civilization built Machu Picchu?', options: ['The Inca', 'The Maya', 'The Phoenicians'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'history-facts', promptKind: 'place', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Machu Picchu was built by the Inca.', rationaleLong: 'The Inca civilization is the civilization most closely associated with Machu Picchu.' }),
  q({ prompt: 'Which sea lies between northeast Africa and the Arabian Peninsula?', options: ['The Red Sea', 'The Black Sea', 'The Baltic Sea'], answerIndex: 0, difficulty: 2, domain: 'world', subdomain: 'geography', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That sea is the Red Sea.', rationaleLong: 'The Red Sea separates northeast Africa from the Arabian Peninsula.' }),
  q({ prompt: 'Which band recorded Bohemian Rhapsody?', options: ['Queen', 'ABBA', 'Journey'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'music', promptKind: 'work', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Bohemian Rhapsody was recorded by Queen.', rationaleLong: 'Queen’s Bohemian Rhapsody remains one of the most recognizable rock songs ever recorded.' }),
  q({ prompt: 'Which part of the cell contains most of its genetic material?', options: ['The nucleus', 'The ribosome', 'The membrane'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'science-facts', promptKind: 'concept', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The nucleus holds most of the cell’s genetic material.', rationaleLong: 'In most human cells, the nucleus stores the DNA that carries genetic instructions.' }),
  q({ prompt: 'Which empire was ruled by Julius Caesar and later Augustus?', options: ['The Roman Empire', 'The Ottoman Empire', 'The Mongol Empire'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'people', promptKind: 'event', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Julius Caesar and Augustus are associated with Rome.', rationaleLong: 'Julius Caesar and Augustus are central figures in the story of the Roman state and empire.' }),
  q({ prompt: 'Which country is associated with the maple leaf on its flag?', options: ['Canada', 'Ireland', 'New Zealand'], answerIndex: 0, difficulty: 1, domain: 'world', subdomain: 'culture', promptKind: 'place', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'The maple leaf is the symbol on Canada’s flag.', rationaleLong: 'Canada’s national flag is famous for its centered red maple leaf.' }),
  q({ prompt: 'Which actress played Hermione Granger in the Harry Potter films?', options: ['Emma Watson', 'Keira Knightley', 'Natalie Portman'], answerIndex: 0, difficulty: 2, domain: 'arts', subdomain: 'movies', promptKind: 'person', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'Emma Watson played Hermione Granger.', rationaleLong: 'Emma Watson became famous worldwide for portraying Hermione Granger in the Harry Potter films.' }),
  q({ prompt: 'Which measurement scale is used for the strength of earthquakes?', options: ['Magnitude', 'Octane', 'Longitude'], answerIndex: 0, difficulty: 2, domain: 'science', subdomain: 'science-facts', promptKind: 'term', salienceScore: 80, lookupRisk: 'low', rationaleShort: 'Earthquake strength is described by magnitude.', rationaleLong: 'Scientists describe the size of an earthquake using its magnitude rather than everyday energy terms.' }),
  q({ prompt: 'Which U.S. president issued the Emancipation Proclamation?', options: ['Abraham Lincoln', 'Theodore Roosevelt', 'Ulysses S. Grant'], answerIndex: 0, difficulty: 2, domain: 'history', subdomain: 'people', promptKind: 'person', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'Abraham Lincoln issued the Emancipation Proclamation.', rationaleLong: 'Lincoln used the Emancipation Proclamation as a pivotal wartime measure during the Civil War.' }),
];

const CURATED_SPORTS_CANONICAL_EXPANSION: CuratedTriviaSourceQuestion[] = [
  q({ prompt: 'Which NFL penalty is called when a quarterback throws the ball away with no eligible receiver nearby?', options: ['Intentional grounding', 'Illegal formation', 'Offside'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'rule', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That penalty is intentional grounding.', rationaleLong: 'Intentional grounding is called when a passer throws the ball away to avoid a sack without an eligible receiver in the area.', citations: searchCitation('Intentional grounding', 'intentional grounding football') }),
  q({ prompt: 'Which college football award is most associated with the best player of the season?', options: ['The Heisman Trophy', 'The Golden Boot', 'The Green Jacket'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'achievement', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'That award is the Heisman Trophy.', rationaleLong: 'The Heisman Trophy is the most famous annual individual award in college football.', citations: searchCitation('Heisman Trophy', 'Heisman Trophy college football') }),
  q({ prompt: 'The New Year’s Day college football game played in Pasadena is best known by what name?', options: ['The Rose Bowl', 'The Orange Bowl', 'The Sugar Bowl'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'event', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'That game is the Rose Bowl.', rationaleLong: 'Pasadena’s signature New Year’s Day college football showcase is the Rose Bowl.', citations: searchCitation('Rose Bowl Pasadena', 'Rose Bowl Pasadena college football') }),
  q({ prompt: 'In football, what is a strip sack?', options: ['A sack that forces a fumble', 'A sack made before the snap count ends', 'A sack that wipes out a touchdown'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A strip sack is a sack that jars the ball loose.', rationaleLong: 'A strip sack happens when a defender sacks the quarterback and forces a fumble on the same play.', citations: searchCitation('Strip sack', 'strip sack football') }),
  q({ prompt: 'Which football term refers to the area inside the opponent’s 20-yard line?', options: ['The red zone', 'The neutral zone', 'The tackle box'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That scoring-threat area is the red zone.', rationaleLong: 'Commentators call the area inside the opponent’s 20-yard line the red zone because scoring chances rise there.', citations: searchCitation('Red zone football', 'red zone football') }),
  q({ prompt: 'What is the name of the award given to the MVP of the NBA Finals?', options: ['Bill Russell NBA Finals MVP Award', 'Larry O’Brien Award', 'Red Auerbach Award'], answerIndex: 0, difficulty: 3, subdomain: 'basketball', promptKind: 'achievement', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That honor is the Bill Russell NBA Finals MVP Award.', rationaleLong: 'The NBA presents the Bill Russell NBA Finals MVP Award to the best performer in the championship series.', citations: searchCitation('NBA Finals MVP award', 'Bill Russell NBA Finals MVP Award') }),
  q({ prompt: 'In basketball, what is a backcourt violation?', options: ['Returning the ball to the backcourt after establishing frontcourt control', 'Shooting before both feet cross half court', 'Touching the rim while a free throw is in the air'], answerIndex: 0, difficulty: 3, subdomain: 'basketball', promptKind: 'rule', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A backcourt violation is illegally sending the ball back over midcourt.', rationaleLong: 'Once the offense establishes control in the frontcourt, it cannot be the first to bring the ball back across the midcourt line.', citations: searchCitation('Backcourt violation basketball', 'backcourt violation basketball') }),
  q({ prompt: 'What does it mean when a basketball player records a triple-double?', options: ['They reach double figures in three statistical categories', 'They hit three straight three-pointers in one quarter', 'They score at least 30 points in consecutive games'], answerIndex: 0, difficulty: 3, subdomain: 'basketball', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'A triple-double means double digits in three categories.', rationaleLong: 'Triple-doubles most often come from piling up double figures in categories like points, rebounds, and assists.', citations: searchCitation('Triple-double basketball', 'triple-double basketball') }),
  q({ prompt: 'Which basketball play describes a high pass finished directly at the rim by a teammate?', options: ['An alley-oop', 'A skip pass', 'A handoff'], answerIndex: 0, difficulty: 3, subdomain: 'basketball', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That play is an alley-oop.', rationaleLong: 'An alley-oop is the pass-and-finish sequence where a teammate catches the ball in the air and scores immediately.', citations: searchCitation('Alley-oop basketball', 'alley-oop basketball') }),
  q({ prompt: 'Which baseball rule stops infielders from intentionally dropping an easy pop-up to turn a cheap double play?', options: ['The infield fly rule', 'The dropped-third-strike rule', 'The balk rule'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'rule', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'That protection is the infield fly rule.', rationaleLong: 'The infield fly rule exists so defenders cannot exploit a routine pop-up by letting it drop and turning an unfair double play.', citations: searchCitation('Infield fly rule', 'infield fly rule baseball') }),
  q({ prompt: 'In baseball statistics, what does ERA stand for?', options: ['Earned run average', 'Extra runner allowance', 'Estimated return attempt'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'ERA stands for earned run average.', rationaleLong: 'ERA is the standard pitching stat that tracks how many earned runs a pitcher allows per nine innings.', citations: searchCitation('ERA baseball', 'earned run average baseball') }),
  q({ prompt: 'What is a walk-off in baseball?', options: ['A game-ending hit or play by the home team', 'A deliberate intentional walk with the bases loaded', 'A pitcher leaving the mound during a live at-bat'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A walk-off ends the game for the home team.', rationaleLong: 'A walk-off refers to the play that immediately ends the game in favor of the home team, usually on a hit or home run.', citations: searchCitation('Walk-off baseball', 'walk-off baseball') }),
  q({ prompt: 'Which baseball statistic counts runs a batter drives in, short of their own run scoring automatically?', options: ['RBI', 'WHIP', 'OBP'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'RBI stands for runs batted in.', rationaleLong: 'Runs batted in credits hitters for bringing runners home, except for some situations like double plays or errors.', citations: searchCitation('RBI baseball', 'RBI baseball') }),
  q({ prompt: 'Which trophy goes to the MVP of the Stanley Cup Playoffs?', options: ['Conn Smythe Trophy', 'Presidents’ Trophy', 'Hart Memorial Trophy'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That playoff MVP award is the Conn Smythe Trophy.', rationaleLong: 'The NHL presents the Conn Smythe Trophy to the most valuable player of the Stanley Cup Playoffs.', citations: searchCitation('Conn Smythe Trophy', 'Conn Smythe Trophy') }),
  q({ prompt: 'In hockey, what is the five-hole?', options: ['The gap between a goalie’s legs', 'The bench area where extra sticks are stored', 'The zone between the blue lines and the boards'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'The five-hole is the opening between the goalie’s legs.', rationaleLong: 'Players talk about shooting five-hole when they aim through the space between a goaltender’s pads.', citations: searchCitation('Five-hole hockey', 'five-hole hockey') }),
  q({ prompt: 'What is a power play in hockey?', options: ['A skater advantage created by an opponent’s penalty', 'A shootout attempt taken before overtime begins', 'A faceoff at center ice after a video review'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'A power play gives one team more skaters because of a penalty.', rationaleLong: 'When one side takes a penalty, the other team gets a temporary man advantage called a power play.', citations: searchCitation('Power play hockey', 'power play hockey') }),
  q({ prompt: 'Which NHL trophy goes to the team with the best regular-season record?', options: ['Presidents’ Trophy', 'Conn Smythe Trophy', 'Rocket Richard Trophy'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'That regular-season honor is the Presidents’ Trophy.', rationaleLong: 'The Presidents’ Trophy goes to the NHL team that finishes with the most points in the regular season standings.', citations: searchCitation('Presidents Trophy NHL', 'Presidents’ Trophy NHL') }),
  q({ prompt: 'Which golf event is the team competition between the United States and Europe?', options: ['The Ryder Cup', 'The Presidents Cup', 'The Solheim Cup'], answerIndex: 0, difficulty: 3, subdomain: 'golf', promptKind: 'event', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'That U.S.-versus-Europe event is the Ryder Cup.', rationaleLong: 'The Ryder Cup is golf’s best-known transatlantic team competition between the United States and Europe.', citations: searchCitation('Ryder Cup', 'Ryder Cup United States Europe') }),
  q({ prompt: 'In golf scoring, what do you call a score of one stroke under par on a hole?', options: ['Birdie', 'Bogey', 'Albatross'], answerIndex: 0, difficulty: 3, subdomain: 'golf', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'One under par is a birdie.', rationaleLong: 'Golf scoring uses birdie to mean one stroke below the listed par for a hole.', citations: searchCitation('Birdie golf', 'birdie golf') }),
  q({ prompt: 'Which major golf tournament is played at Augusta National?', options: ['The Masters', 'The Open Championship', 'The U.S. Open'], answerIndex: 0, difficulty: 3, subdomain: 'golf', promptKind: 'event', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'Augusta National hosts The Masters.', rationaleLong: 'The Masters is the major championship played annually at Augusta National Golf Club.', citations: searchCitation('Augusta National Masters', 'Augusta National The Masters') }),
  q({ prompt: 'What is the tennis scoring term for 40-40?', options: ['Deuce', 'Advantage', 'Love'], answerIndex: 0, difficulty: 3, subdomain: 'tennis', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'At 40-40, the score is deuce.', rationaleLong: 'Tennis calls a 40-40 tie deuce because one player must then win two straight points to take the game.', citations: searchCitation('Deuce tennis', 'deuce tennis') }),
  q({ prompt: 'In tennis, what is a break point?', options: ['A point where the receiver can win the game', 'A point replayed because of crowd noise', 'A point that starts a tiebreak at 6-6'], answerIndex: 0, difficulty: 3, subdomain: 'tennis', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A break point lets the receiver win the game on that point.', rationaleLong: 'Break point means the returning player is one point from breaking serve and taking the game.', citations: searchCitation('Break point tennis', 'break point tennis') }),
  q({ prompt: 'Which Grand Slam tournament is played on grass at the All England Club?', options: ['Wimbledon', 'The French Open', 'The Australian Open'], answerIndex: 0, difficulty: 3, subdomain: 'tennis', promptKind: 'event', salienceScore: 90, lookupRisk: 'low', rationaleShort: 'That grass-court major is Wimbledon.', rationaleLong: 'Wimbledon is the Grand Slam tournament staged on grass at the All England Club in London.', citations: searchCitation('Wimbledon grass', 'Wimbledon grass All England Club') }),
  q({ prompt: 'What is the name of the ten-event track-and-field competition in the Olympics?', options: ['Decathlon', 'Pentathlon', 'Heptathlon'], answerIndex: 0, difficulty: 3, subdomain: 'olympics', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'That ten-event competition is the decathlon.', rationaleLong: 'The decathlon combines ten track-and-field events into one all-around Olympic contest.', citations: searchCitation('Decathlon Olympics', 'decathlon Olympics') }),
  q({ prompt: 'Which Winter Olympic sport combines cross-country skiing with rifle shooting?', options: ['Biathlon', 'Nordic combined', 'Luge'], answerIndex: 0, difficulty: 3, subdomain: 'olympics', promptKind: 'sport-id', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'That sport is biathlon.', rationaleLong: 'Biathlon is the Winter Olympic event that pairs cross-country skiing with target shooting.', citations: searchCitation('Biathlon Olympics', 'biathlon Olympics') }),
  q({ prompt: 'What is the relay called that carries the Olympic flame toward the host city before the Games begin?', options: ['The torch relay', 'The medal march', 'The champions parade'], answerIndex: 0, difficulty: 3, subdomain: 'olympics', promptKind: 'event', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That tradition is the torch relay.', rationaleLong: 'The Olympic torch relay carries the flame from Greece toward the host city as a symbol of the coming Games.', citations: searchCitation('Olympic torch relay', 'Olympic torch relay') }),
  q({ prompt: 'In motorsport, what does pole position mean?', options: ['Starting first after posting the fastest qualifying time', 'Serving a stop-and-go penalty at pit exit', 'Leading the most laps before the halfway point'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'term', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'Pole position means the fastest qualifier starts first.', rationaleLong: 'Pole position belongs to the driver who posts the quickest qualifying time and earns the front starting spot.', citations: searchCitation('Pole position motorsport', 'pole position motorsport') }),
  q({ prompt: 'Which race is part of the Triple Crown of Motorsport alongside the Monaco Grand Prix and the 24 Hours of Le Mans?', options: ['The Indianapolis 500', 'The Daytona 500', 'The Bathurst 1000'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'event', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'The third leg is the Indianapolis 500.', rationaleLong: 'The unofficial Triple Crown of Motorsport is usually defined as Monaco, Le Mans, and the Indianapolis 500.', citations: searchCitation('Triple Crown of Motorsport', 'Triple Crown of Motorsport Indianapolis 500') }),
  q({ prompt: 'What is the name of the cockpit safety device that became mandatory in Formula 1 in 2018?', options: ['The halo', 'The splitter', 'The diffuser'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'That safety structure is the halo.', rationaleLong: 'Formula 1 added the halo to protect drivers from debris and major impacts around the cockpit opening.', citations: searchCitation('Formula 1 halo', 'Formula 1 halo 2018') }),
  q({ prompt: 'Which boxing term describes a fighter being knocked down and unable to beat the referee’s count?', options: ['Knockout', 'Split decision', 'Clinching'], answerIndex: 0, difficulty: 3, subdomain: 'combat', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'That fight-ending result is a knockout.', rationaleLong: 'A knockout happens when a fighter is knocked down and cannot rise before the referee’s count ends.', citations: searchCitation('Knockout boxing', 'knockout boxing') }),
  q({ prompt: 'In boxing, what is a split decision?', options: ['A win awarded when judges are not unanimous', 'A knockdown caused by a body shot', 'A fight stopped because of a cut'], answerIndex: 0, difficulty: 3, subdomain: 'combat', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'A split decision means the judges were divided.', rationaleLong: 'When the judges do not all score the bout for the same boxer, the result can be announced as a split decision.', citations: searchCitation('Split decision boxing', 'split decision boxing') }),
];

const CURATED_SPORTS_LATE_PATCHES: CuratedTriviaSourceQuestion[] = [
  q({
    prompt: 'Which football penalty is called when a quarterback throws the ball away with no eligible receiver nearby?',
    options: ['Intentional grounding', 'Illegal formation', 'Offside'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'rule',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'That penalty is intentional grounding.',
    rationaleLong: 'Intentional grounding is called when a passer throws away the ball to avoid a sack without an eligible receiver in the area.',
    citations: searchCitation('Intentional grounding', 'intentional grounding football'),
  }),
  q({
    prompt: 'Which trophy goes to the most outstanding player in major college football each season?',
    options: ['Heisman Trophy', 'Walter Camp Cup', 'Silver Football'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'achievement',
    salienceScore: 90,
    lookupRisk: 'low',
    rationaleShort: 'That award is the Heisman Trophy.',
    rationaleLong: 'The Heisman Trophy is college football’s most famous annual player award for the season’s standout performer.',
    citations: searchCitation('Heisman Trophy', 'Heisman Trophy college football'),
  }),
  q({
    prompt: 'The New Year’s Day college football game played in Pasadena is best known by what name?',
    options: ['The Rose Bowl', 'The Orange Bowl', 'The Sugar Bowl'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'event',
    salienceScore: 89,
    lookupRisk: 'low',
    rationaleShort: 'That game is the Rose Bowl.',
    rationaleLong: 'Pasadena’s signature New Year’s Day college football showcase is the Rose Bowl, one of the sport’s most famous postseason games.',
    citations: searchCitation('Rose Bowl Pasadena', 'Rose Bowl Pasadena college football'),
  }),
  q({
    prompt: 'In football, what is a strip sack?',
    options: ['A sack that forces a fumble', 'A sack made before the snap count ends', 'A sack that wipes out a touchdown'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A strip sack is a sack that jars the ball loose.',
    rationaleLong: 'A strip sack happens when a defender sacks the quarterback and forces a fumble on the same play.',
    citations: searchCitation('Strip sack', 'strip sack football'),
  }),
  q({
    prompt: 'What is the name of the award given to the MVP of the NBA Finals?',
    options: ['Bill Russell NBA Finals MVP Award', 'Larry O’Brien Award', 'Red Auerbach Award'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'achievement',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'That honor is the Bill Russell NBA Finals MVP Award.',
    rationaleLong: 'The NBA presents the Bill Russell NBA Finals MVP Award to the best performer in the championship series.',
    citations: searchCitation('NBA Finals MVP award', 'Bill Russell NBA Finals MVP Award'),
  }),
  q({
    prompt: 'In basketball, what is a backcourt violation?',
    options: [
      'Returning the ball to the backcourt after establishing frontcourt control',
      'Shooting before both feet cross half court',
      'Touching the rim while a free throw is in the air',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'rule',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'A backcourt violation is illegally sending the ball back over midcourt.',
    rationaleLong: 'Once the offense establishes control in the frontcourt, it cannot be the first to bring the ball back across the midcourt line.',
    citations: searchCitation('Backcourt violation basketball', 'backcourt violation basketball'),
  }),
  q({
    prompt: 'What does it mean when a basketball player records a triple-double?',
    options: [
      'They reach double figures in three statistical categories',
      'They hit three straight three-pointers in one quarter',
      'They score at least 30 points in consecutive games',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'term',
    salienceScore: 89,
    lookupRisk: 'low',
    rationaleShort: 'A triple-double means double digits in three categories.',
    rationaleLong: 'Triple-doubles most often come from piling up double figures in categories like points, rebounds, and assists.',
    citations: searchCitation('Triple-double basketball', 'triple-double basketball'),
  }),
  q({
    prompt: 'Which NBA All-Star Weekend event crowns the best long-range shooter?',
    options: ['Three-Point Contest', 'Skills Challenge', 'Rising Stars'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'event',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'That event is the Three-Point Contest.',
    rationaleLong: 'The NBA Three-Point Contest is the All-Star Weekend event built specifically around long-range shooting.',
    citations: searchCitation('NBA Three-Point Contest', 'NBA Three-Point Contest'),
  }),
  q({
    prompt: 'Which baseball rule is designed to stop infielders from intentionally dropping an easy pop-up to turn a cheap double play?',
    options: ['The infield fly rule', 'The dropped-third-strike rule', 'The balk rule'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'rule',
    salienceScore: 90,
    lookupRisk: 'low',
    rationaleShort: 'That protection is the infield fly rule.',
    rationaleLong: 'The infield fly rule exists so defenders cannot exploit a routine pop-up by letting it drop and turning an unfair double play.',
    citations: searchCitation('Infield fly rule', 'infield fly rule baseball'),
  }),
  q({
    prompt: 'In baseball statistics, what does ERA stand for?',
    options: ['Earned run average', 'Extra runner allowance', 'Estimated return attempt'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'term',
    salienceScore: 87,
    lookupRisk: 'low',
    rationaleShort: 'ERA stands for earned run average.',
    rationaleLong: 'ERA is the standard pitching stat that tracks how many earned runs a pitcher allows per nine innings.',
    citations: searchCitation('ERA baseball', 'earned run average baseball'),
  }),
  q({
    prompt: 'What is a walk-off in baseball?',
    options: [
      'A game-ending hit or play by the home team',
      'A deliberate intentional walk with the bases loaded',
      'A pitcher leaving the mound during a live at-bat',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'A walk-off ends the game for the home team.',
    rationaleLong: 'A walk-off refers to the play that immediately ends the game in favor of the home team, usually on a hit or home run.',
    citations: searchCitation('Walk-off baseball', 'walk-off baseball'),
  }),
  q({
    prompt: 'Which trophy is presented to the team that wins the World Series?',
    options: ['Commissioner’s Trophy', 'Cy Young Trophy', 'Lombardi Trophy'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'achievement',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'The World Series winner gets the Commissioner’s Trophy.',
    rationaleLong: 'Major League Baseball awards the Commissioner’s Trophy to the champion of the World Series.',
    citations: searchCitation('Commissioners Trophy baseball', 'Commissioner’s Trophy World Series'),
  }),
  q({
    prompt: 'Which trophy goes to the MVP of the Stanley Cup Playoffs?',
    options: ['Conn Smythe Trophy', 'Presidents’ Trophy', 'Hart Memorial Trophy'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'achievement',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'That playoff MVP award is the Conn Smythe Trophy.',
    rationaleLong: 'The NHL presents the Conn Smythe Trophy to the most valuable player of the Stanley Cup Playoffs.',
    citations: searchCitation('Conn Smythe Trophy', 'Conn Smythe Trophy'),
  }),
  q({
    prompt: 'In hockey, what is the five-hole?',
    options: [
      'The gap between a goalie’s legs',
      'The bench area where extra sticks are stored',
      'The zone between the blue lines and the boards',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'The five-hole is the opening between the goalie’s legs.',
    rationaleLong: 'Players talk about shooting five-hole when they aim through the space between a goaltender’s pads.',
    citations: searchCitation('Five-hole hockey', 'five-hole hockey'),
  }),
  q({
    prompt: 'What is a power play in hockey?',
    options: [
      'A skater advantage created by an opponent’s penalty',
      'A shootout attempt taken before overtime begins',
      'A faceoff at center ice after a video review',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'term',
    salienceScore: 87,
    lookupRisk: 'low',
    rationaleShort: 'A power play gives one team more skaters because of a penalty.',
    rationaleLong: 'When one side takes a penalty, the other team gets a temporary man advantage called a power play.',
    citations: searchCitation('Power play hockey', 'power play hockey'),
  }),
  q({
    prompt: 'Which NHL trophy goes to the team with the best regular-season record?',
    options: ['Presidents’ Trophy', 'Conn Smythe Trophy', 'Rocket Richard Trophy'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'achievement',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'That regular-season honor is the Presidents’ Trophy.',
    rationaleLong: 'The Presidents’ Trophy goes to the NHL team that finishes with the most points in the regular season standings.',
    citations: searchCitation('Presidents Trophy NHL', 'Presidents’ Trophy NHL'),
  }),
  q({
    prompt: 'Which golf event is the team competition between the United States and Europe?',
    options: ['The Ryder Cup', 'The Presidents Cup', 'The Solheim Cup'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'event',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'That U.S.-versus-Europe event is the Ryder Cup.',
    rationaleLong: 'The Ryder Cup is golf’s best-known transatlantic team competition between the United States and Europe.',
    citations: searchCitation('Ryder Cup', 'Ryder Cup United States Europe'),
  }),
  q({
    prompt: 'In golf scoring, what do you call a score of one stroke under par on a hole?',
    options: ['Birdie', 'Bogey', 'Albatross'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'One under par is a birdie.',
    rationaleLong: 'Golf scoring uses birdie to mean one stroke below the listed par for a hole.',
    citations: searchCitation('Birdie golf', 'birdie golf'),
  }),
  q({
    prompt: 'Which major golf tournament is played at Augusta National?',
    options: ['The Masters', 'The Open Championship', 'The U.S. Open'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'event',
    salienceScore: 90,
    lookupRisk: 'low',
    rationaleShort: 'Augusta National hosts The Masters.',
    rationaleLong: 'The Masters is the major championship played annually at Augusta National Golf Club.',
    citations: searchCitation('Augusta National Masters', 'Augusta National The Masters'),
  }),
  q({
    prompt: 'What is the tennis scoring term for 40-40?',
    options: ['Deuce', 'Advantage', 'Love'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'At 40-40, the score is deuce.',
    rationaleLong: 'Tennis calls a 40-40 tie deuce because one player must then win two straight points to take the game.',
    citations: searchCitation('Deuce tennis', 'deuce tennis'),
  }),
  q({
    prompt: 'In tennis, what is a break point?',
    options: [
      'A point where the receiver can win the game',
      'A point replayed because of crowd noise',
      'A point that starts a tiebreak at 6-6',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A break point lets the receiver win the game on that point.',
    rationaleLong: 'Break point means the returning player is one point from breaking serve and taking the game.',
    citations: searchCitation('Break point tennis', 'break point tennis'),
  }),
  q({
    prompt: 'Which Grand Slam tournament is played on grass at the All England Club?',
    options: ['Wimbledon', 'The French Open', 'The Australian Open'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'tennis',
    promptKind: 'event',
    salienceScore: 90,
    lookupRisk: 'low',
    rationaleShort: 'That grass-court major is Wimbledon.',
    rationaleLong: 'Wimbledon is the Grand Slam tournament staged on grass at the All England Club in London.',
    citations: searchCitation('Wimbledon grass', 'Wimbledon grass All England Club'),
  }),
  q({
    prompt: 'What is the name of the ten-event track-and-field competition in the Olympics?',
    options: ['Decathlon', 'Pentathlon', 'Heptathlon'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'That ten-event competition is the decathlon.',
    rationaleLong: 'The decathlon combines ten track-and-field events into one all-around Olympic contest.',
    citations: searchCitation('Decathlon Olympics', 'decathlon Olympics'),
  }),
  q({
    prompt: 'Which Winter Olympic sport combines cross-country skiing with rifle shooting?',
    options: ['Biathlon', 'Nordic combined', 'Luge'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'sport-id',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'That sport is biathlon.',
    rationaleLong: 'Biathlon is the Winter Olympic event that pairs cross-country skiing with target shooting.',
    citations: searchCitation('Biathlon Olympics', 'biathlon Olympics'),
  }),
  q({
    prompt: 'What is the relay called that carries the Olympic flame toward the host city before the Games begin?',
    options: ['The torch relay', 'The medal march', 'The champions parade'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'event',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'That tradition is the torch relay.',
    rationaleLong: 'The Olympic torch relay carries the flame from Greece toward the host city as a symbol of the coming Games.',
    citations: searchCitation('Olympic torch relay', 'Olympic torch relay'),
  }),
  q({
    prompt: 'Which Winter Olympic event combines ski jumping with cross-country skiing?',
    options: ['Nordic combined', 'Biathlon', 'Skeleton'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'That hybrid event is Nordic combined.',
    rationaleLong: 'Nordic combined tests athletes in both ski jumping and cross-country skiing.',
    citations: searchCitation('Nordic combined', 'Nordic combined Olympics'),
  }),
  q({
    prompt: 'In motorsport, what does pole position mean?',
    options: [
      'Starting first after posting the fastest qualifying time',
      'Serving a stop-and-go penalty at pit exit',
      'Leading the most laps before the halfway point',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 89,
    lookupRisk: 'low',
    rationaleShort: 'Pole position means the fastest qualifier starts first.',
    rationaleLong: 'Pole position belongs to the driver who posts the quickest qualifying time and earns the front starting spot.',
    citations: searchCitation('Pole position motorsport', 'pole position motorsport'),
  }),
  q({
    prompt: 'Which race is part of the Triple Crown of Motorsport alongside the Monaco Grand Prix and the 24 Hours of Le Mans?',
    options: ['The Indianapolis 500', 'The Daytona 500', 'The Bathurst 1000'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'event',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'The third leg is the Indianapolis 500.',
    rationaleLong: 'The unofficial Triple Crown of Motorsport is usually defined as Monaco, Le Mans, and the Indianapolis 500.',
    citations: searchCitation('Triple Crown of Motorsport', 'Triple Crown of Motorsport Indianapolis 500'),
  }),
  q({
    prompt: 'What is the name of the cockpit safety device that became mandatory in Formula 1 in 2018?',
    options: ['The halo', 'The splitter', 'The diffuser'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'That safety structure is the halo.',
    rationaleLong: 'Formula 1 added the halo to protect drivers from debris and major impacts around the cockpit opening.',
    citations: searchCitation('Formula 1 halo', 'Formula 1 halo 2018'),
  }),
  q({
    prompt: 'On a racetrack, what is a chicane?',
    options: [
      'A quick sequence of opposite-direction turns',
      'The painted lane entering pit road',
      'The final lap after a restart',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A chicane is a rapid left-right or right-left turn sequence.',
    rationaleLong: 'Tracks use chicanes to slow cars and challenge drivers with a tight series of alternating turns.',
    citations: searchCitation('Chicane motorsport', 'chicane motorsport'),
  }),
  q({
    prompt: 'In football, what is a pick-six?',
    options: [
      'An interception returned for a touchdown',
      'A six-yard run on third down',
      'A kickoff returned past midfield',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'A pick-six is an interception taken back for a touchdown.',
    rationaleLong: 'The term pick-six combines pick for interception and six for the touchdown points scored on the return.',
    citations: searchCitation('Pick six football', 'pick-six football'),
  }),
  q({
    prompt: 'Which football term describes a kick caught in the end zone and not returned?',
    options: ['Touchback', 'Safety', 'Fair catch kick'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'That result is a touchback.',
    rationaleLong: 'When a kick is downed in or caught in the end zone and not returned, play resumes with a touchback.',
    citations: searchCitation('Touchback football', 'touchback football'),
  }),
  q({
    prompt: 'Which football award is given each year to the NFL’s most valuable player?',
    options: ['AP NFL Most Valuable Player Award', 'Walter Payton Man of the Year', 'Art Rooney Award'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'football',
    promptKind: 'achievement',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'That honor is the AP NFL Most Valuable Player Award.',
    rationaleLong: 'The Associated Press NFL Most Valuable Player Award is the league’s headline regular-season MVP honor.',
    citations: searchCitation('NFL MVP award', 'AP NFL Most Valuable Player Award'),
  }),
  q({
    prompt: 'In basketball, what is goaltending?',
    options: [
      'Illegally blocking a shot on its downward path to the basket',
      'Touching the ball after a made free throw',
      'Crossing half court without dribbling',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'rule',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'Goaltending means illegally touching a shot on its way down.',
    rationaleLong: 'Basketball calls goaltending when a defender interferes with a shot that is descending toward the hoop or already has a chance to score.',
    citations: searchCitation('Goaltending basketball', 'goaltending basketball'),
  }),
  q({
    prompt: 'Which NBA award honors the league’s best sixth man coming off the bench?',
    options: ['Sixth Man of the Year Award', 'Most Improved Player Award', 'Clutch Player of the Year Award'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'achievement',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'That bench-player honor is the Sixth Man of the Year Award.',
    rationaleLong: 'The NBA’s Sixth Man of the Year Award recognizes the most impactful reserve player during the regular season.',
    citations: searchCitation('NBA Sixth Man of the Year', 'NBA Sixth Man of the Year Award'),
  }),
  q({
    prompt: 'In basketball, what is a charge?',
    options: [
      'An offensive foul for crashing into a set defender',
      'A pass thrown straight into the front row',
      'A technical foul for arguing after a timeout',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'basketball',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A charge is an offensive foul into a legal defender.',
    rationaleLong: 'Refs call a charge when an offensive player barrels into a defender who has established legal guarding position.',
    citations: searchCitation('Charge foul basketball', 'charge foul basketball'),
  }),
  q({
    prompt: 'In baseball, what does WHIP stand for?',
    options: ['Walks plus hits per inning pitched', 'Wins held in postseason', 'Weighted hitting in play'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'WHIP means walks plus hits per inning pitched.',
    rationaleLong: 'WHIP is a pitching statistic that tracks how many baserunners a pitcher allows through walks and hits per inning.',
    citations: searchCitation('WHIP baseball', 'WHIP baseball'),
  }),
  q({
    prompt: 'In baseball, what is a sacrifice fly?',
    options: [
      'A caught fly ball that still allows a runner to score',
      'A popup dropped on purpose by the shortstop',
      'A bunt that turns into a double play',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A sacrifice fly is a caught fly that still brings home a run.',
    rationaleLong: 'A batter is credited with a sacrifice fly when a fly ball is caught but is deep enough to let a runner tag up and score.',
    citations: searchCitation('Sacrifice fly baseball', 'sacrifice fly baseball'),
  }),
  q({
    prompt: 'What is a save in baseball?',
    options: [
      'A relief appearance that finishes a win under specific pressure conditions',
      'A defensive play that prevents an infield hit',
      'An official scorer change after video review',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'baseball',
    promptKind: 'achievement',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'A save is a relief stat for preserving a win in a qualifying situation.',
    rationaleLong: 'Closers earn saves by finishing victories while meeting the official criteria tied to lead size, innings, or tying-run pressure.',
    citations: searchCitation('Save baseball stat', 'save baseball stat'),
  }),
  q({
    prompt: 'In hockey, what is offside?',
    options: [
      'Entering the attacking zone before the puck does',
      'Changing lines during a power play',
      'Shooting the puck over the glass from center ice',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'rule',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'Offside means a player entered the zone before the puck.',
    rationaleLong: 'A team is offside if an attacking player crosses the blue line into the offensive zone ahead of the puck.',
    citations: searchCitation('Offside hockey', 'offside hockey'),
  }),
  q({
    prompt: 'What is a one-timer in hockey?',
    options: [
      'A shot hit immediately off a pass without settling the puck',
      'A goal scored within the first minute of a period',
      'A penalty served by only one skater',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A one-timer is a shot taken directly off a pass.',
    rationaleLong: 'Players call it a one-timer when a skater fires the puck in one motion as soon as the pass arrives.',
    citations: searchCitation('One-timer hockey', 'one-timer hockey'),
  }),
  q({
    prompt: 'Which NHL award goes to the league’s regular-season MVP?',
    options: ['Hart Memorial Trophy', 'Conn Smythe Trophy', 'Lady Byng Trophy'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'hockey',
    promptKind: 'achievement',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'That regular-season MVP honor is the Hart Memorial Trophy.',
    rationaleLong: 'The Hart Memorial Trophy recognizes the NHL player judged most valuable to his team in the regular season.',
    citations: searchCitation('Hart Memorial Trophy', 'Hart Memorial Trophy NHL'),
  }),
  q({
    prompt: 'In golf scoring, what is an albatross?',
    options: [
      'A score of three under par on a hole',
      'A hole won after chipping in from off the green',
      'A playoff that lasts more than three extra holes',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'An albatross is three under par on one hole.',
    rationaleLong: 'Golf uses albatross for the very rare feat of scoring three strokes below par on a single hole.',
    citations: searchCitation('Albatross golf', 'albatross golf'),
  }),
  q({
    prompt: 'Which major championship winner receives the Claret Jug?',
    options: ['The Open Championship winner', 'The Masters winner', 'The U.S. Open winner'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'achievement',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'The Claret Jug goes to the Open champion.',
    rationaleLong: 'The Claret Jug is the famous trophy awarded to the champion of The Open Championship.',
    citations: searchCitation('Claret Jug', 'Claret Jug Open Championship'),
  }),
  q({
    prompt: 'In tennis, what is a let on a serve?',
    options: [
      'A serve that clips the net and still lands in the correct box',
      'A serve returned before it crosses the service line',
      'A second serve hit from the doubles alley',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'A let is a serve that nicks the net and lands in.',
    rationaleLong: 'When a serve touches the net but still lands legally in the service box, it is called a let and replayed.',
    citations: searchCitation('Let serve tennis', 'let serve tennis'),
  }),
  q({
    prompt: 'Which international team competition is the men’s counterpart to the Billie Jean King Cup in tennis?',
    options: ['Davis Cup', 'Laver Cup', 'United Cup'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'tennis',
    promptKind: 'event',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'That men’s team event is the Davis Cup.',
    rationaleLong: 'The Davis Cup is the long-running men’s international team competition in tennis.',
    citations: searchCitation('Davis Cup', 'Davis Cup tennis'),
  }),
  q({
    prompt: 'In Olympic gymnastics, what does the all-around title reward?',
    options: [
      'The best combined performance across every apparatus',
      'The highest single-vault score in the final',
      'The team with the cleanest execution deductions',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'achievement',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'The all-around title goes to the best total across the apparatus.',
    rationaleLong: 'All-around champions win by posting the strongest cumulative scores across the full set of apparatus events.',
    citations: searchCitation('Gymnastics all-around', 'gymnastics all-around Olympics'),
  }),
  q({
    prompt: 'Which Olympic event combines seven disciplines for women?',
    options: ['Heptathlon', 'Decathlon', 'Pentathlon'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'The seven-event women’s competition is the heptathlon.',
    rationaleLong: 'Track and field calls the women’s seven-discipline combined event the heptathlon.',
    citations: searchCitation('Heptathlon Olympics', 'heptathlon Olympics'),
  }),
  q({
    prompt: 'In motorsport, what does a safety car do?',
    options: [
      'Neutralizes the race while the field slows behind it',
      'Tows damaged cars directly into the garage',
      'Signals that a qualifying session has begun',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A safety car slows and bunches the field during a hazard.',
    rationaleLong: 'Race control deploys the safety car to neutralize the event and reduce speed while marshals or officials manage danger on track.',
    citations: searchCitation('Safety car motorsport', 'safety car motorsport'),
  }),
  q({
    prompt: 'What is a DRS zone in Formula 1 used for?',
    options: [
      'Allowing eligible drivers to open the rear wing for more speed',
      'Determining where pit stops become mandatory',
      'Marking the part of the track reserved for blue flags',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A DRS zone is where eligible drivers can open the rear wing.',
    rationaleLong: 'Formula 1 uses DRS zones to let qualifying drivers reduce drag and increase overtaking chances by opening the rear wing flap.',
    citations: searchCitation('DRS Formula 1', 'DRS Formula 1 zone'),
  }),
  q({
    prompt: 'In boxing, what is a southpaw?',
    options: [
      'A fighter who leads with the right hand and right foot back',
      'A boxer who has already been knocked down once',
      'A referee warning for excessive clinching',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'combat',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A southpaw is a boxer with a left-handed-style stance.',
    rationaleLong: 'Southpaw describes the stance that typically puts the right hand and right foot forward and the left hand as the power hand.',
    citations: searchCitation('Southpaw boxing', 'southpaw boxing'),
  }),
  q({
    prompt: 'What is a unanimous decision in boxing or MMA?',
    options: [
      'All judges score the fight for the same competitor',
      'A stoppage caused by three knockdowns in one round',
      'A rematch ordered immediately by the commission',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'combat',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'A unanimous decision means every judge picked the same winner.',
    rationaleLong: 'Combat sports call it a unanimous decision when all judges submit scorecards for the same fighter.',
    citations: searchCitation('Unanimous decision boxing', 'unanimous decision boxing MMA'),
  }),
  q({
    prompt: 'In soccer, what is stoppage time?',
    options: [
      'Added time at the end of a half to make up for delays',
      'A five-minute extra period played after a draw',
      'The pause after a goal before substitutes may enter',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'soccer',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'Stoppage time is the added time for delays at the end of a half.',
    rationaleLong: 'Officials add stoppage time to compensate for injuries, substitutions, time-wasting, and other interruptions.',
    citations: searchCitation('Stoppage time soccer', 'stoppage time soccer'),
  }),
  q({
    prompt: 'What does it mean to be offside in soccer?',
    options: [
      'Being beyond the second-to-last defender when the ball is played to you',
      'Taking a throw-in with both feet inside the touchline',
      'Handling the ball inside your own penalty area as an outfield player',
    ],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'soccer',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'Offside is about a player’s position relative to defenders when the pass is made.',
    rationaleLong: 'A player is offside when positioned beyond the second-to-last defender at the moment the ball is played to them, unless an exception applies.',
    citations: searchCitation('Offside soccer rule', 'offside soccer rule'),
  }),
  q({
    prompt: 'In basketball, what violation is called when a team fails to attempt a shot before the shot clock expires?',
    options: ['Shot clock violation', 'Lane violation', 'Backcourt violation'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'basketball',
    promptKind: 'rule',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'That call is a shot clock violation.',
    rationaleLong: 'If the offense does not get a shot off before the shot clock runs out, possession ends with a shot clock violation.',
    citations: searchCitation('Shot clock violation', 'shot clock violation basketball'),
  }),
  q({
    prompt: 'Which trophy is awarded to the team that wins the NBA championship?',
    options: ['Larry O’Brien Trophy', 'Bill Russell NBA Finals MVP Award', 'Naismith Cup'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'basketball',
    promptKind: 'achievement',
    salienceScore: 87,
    lookupRisk: 'low',
    rationaleShort: 'The NBA champion gets the Larry O’Brien Trophy.',
    rationaleLong: 'The Larry O’Brien Trophy is the championship trophy awarded to the team that wins the NBA Finals.',
    citations: searchCitation('Larry OBrien Trophy', 'Larry O’Brien Trophy'),
  }),
  q({
    prompt: 'In baseball scoring, what do the initials RBI stand for?',
    options: ['Runs batted in', 'Reached base instantly', 'Relief bullpen index'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'baseball',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'RBI stands for runs batted in.',
    rationaleLong: 'Runs batted in measure how many runs score because of a batter’s plate appearance, except in a few special cases.',
    citations: searchCitation('RBI baseball', 'RBI baseball runs batted in'),
  }),
  q({
    prompt: 'In football, what is a Hail Mary?',
    options: [
      'A very long desperation pass near the end of a game',
      'A kickoff that bounces untouched into the end zone',
      'A quarterback sneak on fourth-and-inches',
    ],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'football',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'A Hail Mary is the classic desperation deep pass.',
    rationaleLong: 'Teams use the term Hail Mary for a low-percentage deep throw, usually at the end of a half or game.',
    citations: searchCitation('Hail Mary football', 'Hail Mary football'),
  }),
  q({
    prompt: 'What is the hockey term for a game in which a goalie allows no goals?',
    options: ['Shutout', 'Power play', 'Hat trick'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'hockey',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    rationaleShort: 'That zero-goal performance is a shutout.',
    rationaleLong: 'A shutout means the opposing team never scores, so the goalie and team finish the game with no goals allowed.',
    citations: searchCitation('Shutout hockey', 'shutout hockey'),
  }),
  q({
    prompt: 'Which NHL award goes to the league’s most valuable player in the regular season?',
    options: ['Hart Memorial Trophy', 'Conn Smythe Trophy', 'Presidents’ Trophy'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'hockey',
    promptKind: 'achievement',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'That MVP award is the Hart Memorial Trophy.',
    rationaleLong: 'The Hart Memorial Trophy is given to the NHL player judged most valuable to his team during the regular season.',
    citations: searchCitation('Hart Memorial Trophy', 'Hart Memorial Trophy NHL'),
  }),
  q({
    prompt: 'Which clothing item is famously awarded to the winner of the Masters?',
    options: ['A green jacket', 'A yellow cap', 'A silver blazer'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'achievement',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'Masters champions receive a green jacket.',
    rationaleLong: 'The green jacket is one of golf’s most recognizable prizes and is strongly associated with winning the Masters.',
    citations: searchCitation('Masters green jacket', 'Masters green jacket'),
  }),
  q({
    prompt: 'In golf scoring, what do you call a score of one stroke over par on a hole?',
    options: ['Bogey', 'Birdie', 'Eagle'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'One over par is a bogey.',
    rationaleLong: 'Golf uses bogey to describe finishing a hole in one stroke more than par.',
    citations: searchCitation('Bogey golf', 'bogey golf'),
  }),
  q({
    prompt: 'In motorsport, which flag immediately stops a session or race because conditions are unsafe?',
    options: ['Red flag', 'Green flag', 'White flag'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A red flag stops the session.',
    rationaleLong: 'Race control uses the red flag when track conditions or an incident are serious enough that the event must be halted.',
    citations: searchCitation('Red flag motorsport', 'red flag motorsport'),
  }),
  q({
    prompt: 'In racing, what does drafting mean?',
    options: [
      'Following closely behind another vehicle to reduce air resistance',
      'Starting from the pit lane after missing qualifying',
      'Changing tires while the caution flag is out',
    ],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'Drafting means tucking in behind another vehicle to cut drag.',
    rationaleLong: 'By following closely, a driver or rider can benefit from reduced air resistance and sometimes gain speed for a pass.',
    citations: searchCitation('Drafting motorsport', 'drafting motorsport'),
  }),
];

const CURATED_SPORTS_DAYBREAK_EXPANSION: CuratedTriviaSourceQuestion[] = [
  q({ prompt: 'In football, what is a pick-six?', options: ['An interception returned for a touchdown', 'A six-yard pass on third down', 'A kickoff that lands at the 6-yard line'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A pick-six is an interception returned all the way for a touchdown.', rationaleLong: 'Fans call it a pick-six because the defense picks off the pass and scores six points on the return.', citations: searchCitation('Pick six football', 'pick six football') }),
  q({ prompt: 'In football, what is a Hail Mary pass?', options: ['A long desperation throw toward the end zone', 'A short pass behind the line of scrimmage', 'A kickoff designed to bounce and roll'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'A Hail Mary is the long desperation heave toward the end zone.', rationaleLong: 'Teams use a Hail Mary near the end of a half or game when they need a miracle touchdown on one last long throw.', citations: searchCitation('Hail Mary pass football', 'Hail Mary pass football') }),
  q({ prompt: 'In football, what does play-action try to make the defense expect?', options: ['A running play', 'A field goal attempt', 'A quarterback kneel-down'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'Play-action fakes a run to sell the defense on a rushing play.', rationaleLong: 'On play-action, the quarterback and back mimic a handoff so defenders bite on the run and open up passing lanes.', citations: searchCitation('Play-action football', 'play-action football') }),
  q({ prompt: 'In football, what is a quarterback sneak?', options: ['A short run by the quarterback right after the snap', 'A trick punt run on fourth down', 'A fake spike followed by a deep throw'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A quarterback sneak is the immediate plunge right after the snap.', rationaleLong: 'Quarterbacks usually sneak the ball behind the center on short-yardage plays when the offense needs a few inches or a yard.', citations: searchCitation('Quarterback sneak', 'quarterback sneak football') }),
  q({ prompt: 'In football, what area of the field is called the red zone?', options: ['The area inside the opponent’s 20-yard line', 'The middle of the field between the hashes', 'The section between a team’s own goal line and 10-yard line'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'place', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'The red zone is the area inside the opponent’s 20.', rationaleLong: 'Teams and broadcasters call the final 20 yards before the end zone the red zone because scoring chances jump there.', citations: searchCitation('Red zone football', 'red zone football') }),
  q({ prompt: 'What label is given to an NFL playoff team that got in without winning its division?', options: ['Wild card team', 'Bye team', 'Franchise tag team'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'That playoff entrant is called a wild card team.', rationaleLong: 'Wild card teams qualify for the playoffs based on record even though they did not finish first in their division.', citations: searchCitation('Wild card team NFL', 'wild card team NFL') }),
  q({ prompt: 'After a touchdown, how many points is a successful 2-point conversion worth?', options: ['2', '1', '3'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'A successful conversion from scrimmage is worth 2 points.', rationaleLong: 'Instead of kicking for one point, offenses can run or pass the ball into the end zone for a 2-point conversion.', citations: searchCitation('Two-point conversion football', 'two-point conversion football') }),
  q({ prompt: 'Which annual NFL honor goes to the season’s top defensive player?', options: ['Defensive Player of the Year Award', 'Walter Payton Man of the Year Award', 'Comeback Player of the Year Award'], answerIndex: 0, difficulty: 3, subdomain: 'football', promptKind: 'achievement', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'That defensive honor is Defensive Player of the Year.', rationaleLong: 'The NFL’s Defensive Player of the Year award recognizes the season’s most dominant defender.', citations: searchCitation('NFL Defensive Player of the Year', 'NFL Defensive Player of the Year award') }),
  q({ prompt: 'In basketball, what is an and-one?', options: ['A made basket followed by a free throw chance because of a foul', 'A lineup with one guard and four centers', 'A single free throw awarded after a technical warning'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'An and-one is a made basket plus one free throw after the foul.', rationaleLong: 'Fans yell and-one when a player scores through contact and earns an extra free throw on top of the basket.', citations: searchCitation('And-one basketball', 'and-one basketball') }),
  q({ prompt: 'Which basketball action usually starts a pick-and-roll?', options: ['A teammate setting a screen for the ballhandler', 'A jump ball at center court', 'A full-court inbound pass'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'A pick-and-roll begins with a screen for the ballhandler.', rationaleLong: 'In the classic pick-and-roll, one offensive player sets a pick and then rolls toward space after the defender reacts.', citations: searchCitation('Pick and roll basketball', 'pick and roll basketball') }),
  q({ prompt: 'In basketball, what is a fast break?', options: ['A quick transition attack before the defense gets set', 'A timeout taken to rest the starters', 'A rule that limits the offense to one pass'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A fast break is the quick attack before defenders are organized.', rationaleLong: 'Teams push the ball on the fast break after a rebound or turnover to score before the defense can recover.', citations: searchCitation('Fast break basketball', 'fast break basketball') }),
  q({ prompt: 'What is a technical foul in basketball usually called for?', options: ['Unsportsmanlike behavior or illegal conduct not tied to normal contact', 'A defender touching the ball on its way down', 'A player taking too many steps after dribbling'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'rule', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Technical fouls usually punish unsportsmanlike or administrative violations.', rationaleLong: 'Officials call technicals for behavior or violations outside the normal flow of contact, such as arguing, delay tactics, or illegal substitutions.', citations: searchCitation('Technical foul basketball', 'technical foul basketball') }),
  q({ prompt: 'Which NBA award goes to the league’s best first-year player?', options: ['Rookie of the Year Award', 'Most Improved Player Award', 'Sixth Man of the Year Award'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'achievement', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'That first-year honor is Rookie of the Year.', rationaleLong: 'The NBA Rookie of the Year Award recognizes the top newcomer across the regular season.', citations: searchCitation('NBA Rookie of the Year', 'NBA Rookie of the Year award') }),
  q({ prompt: 'What is a double-double in basketball?', options: ['Double figures in two statistical categories', 'Two dunks on the same possession', 'A game that goes to double overtime'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'A double-double means double digits in two categories.', rationaleLong: 'Double-doubles usually come from combining categories like points, rebounds, assists, blocks, or steals in one game.', citations: searchCitation('Double-double basketball', 'double-double basketball') }),
  q({ prompt: 'In basketball, what is the restricted area?', options: ['The arc near the basket where defenders cannot draw a charge in normal guarding position', 'The section of the bench reserved for inactive players', 'The painted box where jump balls must be taken'], answerIndex: 0, difficulty: 3, subdomain: 'basketball', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'The restricted area is the arc that limits where charges can be drawn.', rationaleLong: 'Basketball uses the restricted area arc to prevent defenders from sliding under airborne offensive players right at the rim and drawing easy charges.', citations: searchCitation('Restricted area basketball', 'restricted area basketball') }),
  q({ prompt: 'What is a buzzer-beater in basketball?', options: ['A shot that goes in just before time expires', 'A made basket that silences a hostile road crowd', 'A shot taken from beyond the center-court logo'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'term', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'A buzzer-beater is the shot that falls before the horn sounds.', rationaleLong: 'The term buzzer-beater refers to a basket that counts because it leaves the shooter’s hand in time and goes in just before the clock hits zero.', citations: searchCitation('Buzzer beater basketball', 'buzzer beater basketball') }),
  q({ prompt: 'In baseball, what is a save?', options: ['A relief appearance that preserves the lead and finishes the win under set conditions', 'A catch made while crashing into the wall', 'A baserunning play that avoids a tag at home'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'achievement', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A save is the stat awarded for preserving a win in relief.', rationaleLong: 'Relievers earn a save when they finish a game for the winning team while protecting a narrow lead or entering under specific late-game conditions.', citations: searchCitation('Baseball save statistic', 'baseball save statistic') }),
  q({ prompt: 'What is a sacrifice fly in baseball?', options: ['A fly ball that scores a runner after the catch while the batter is put out', 'A bunt popped intentionally to the first baseman', 'A deep foul ball used to move runners up after replay review'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 85, lookupRisk: 'low', rationaleShort: 'A sacrifice fly scores a runner even though the batter is out on the fly.', rationaleLong: 'The batter is charged with an out on a caught fly ball, but the play still counts as a sacrifice if a runner tags and scores.', citations: searchCitation('Sacrifice fly baseball', 'sacrifice fly baseball') }),
  q({ prompt: 'In baseball, what is a no-hitter?', options: ['A game in which one team allows no hits', 'A game with no extra-base hits', 'A game where neither team scores'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'achievement', salienceScore: 88, lookupRisk: 'low', rationaleShort: 'A no-hitter means the opposing lineup never records a hit.', rationaleLong: 'Pitchers can still allow walks or reach on errors in a no-hitter, but the other team does not collect a single official hit.', citations: searchCitation('No-hitter baseball', 'no-hitter baseball') }),
  q({ prompt: 'In baseball, what is a perfect game?', options: ['A game in which no opposing batter reaches base at all', 'A game in which every starter gets at least one hit', 'A game in which a pitcher strikes out every batter faced'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'achievement', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'A perfect game means nobody reaches base against the pitcher or pitchers.', rationaleLong: 'Perfect games are rarer than no-hitters because they require retiring every batter without allowing a walk, hit, error, or hit-by-pitch.', citations: searchCitation('Perfect game baseball', 'perfect game baseball') }),
  q({ prompt: 'What is the bullpen in baseball?', options: ['The area where relief pitchers warm up', 'The chalked circle around home plate', 'The section of the dugout used by hitters between innings'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The bullpen is where relievers warm up.', rationaleLong: 'Baseball calls the warm-up area for relief pitchers the bullpen, and the term also often refers to the relief staff itself.', citations: searchCitation('Bullpen baseball', 'bullpen baseball') }),
  q({ prompt: 'What does it mean to hit for the cycle in baseball?', options: ['To record a single, double, triple, and home run in one game', 'To reach base in every inning of a game', 'To strike out and then homer in consecutive at-bats'], answerIndex: 0, difficulty: 3, subdomain: 'baseball', promptKind: 'achievement', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'Hitting for the cycle means collecting all four hit types in one game.', rationaleLong: 'A cycle requires a single, double, triple, and home run in the same game, regardless of the order they happen in.', citations: searchCitation('Hitting for the cycle', 'hitting for the cycle baseball') }),
  q({ prompt: 'What is the warning track in baseball?', options: ['The strip near the outfield wall that alerts fielders they are almost out of room', 'The lane a runner must stay inside between third and home', 'The dirt arc around the mound that marks legal pickoff distance'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The warning track is the strip that tells outfielders the wall is close.', rationaleLong: 'The texture change near the fence helps outfielders feel when they are running out of space while tracking a deep fly ball.', citations: searchCitation('Warning track baseball', 'warning track baseball') }),
  q({ prompt: 'What is a doubleheader in baseball?', options: ['Two games played by the same teams on the same day', 'A home run hit by both teams in the same inning', 'A pitcher throwing in both games of a series opener'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'event', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A doubleheader means the same teams play twice in one day.', rationaleLong: 'Teams often play a doubleheader when a rainout or scheduling quirk leads to two games between the same clubs on the same date.', citations: searchCitation('Doubleheader baseball', 'doubleheader baseball') }),
  q({ prompt: 'In hockey, what is a short-handed goal?', options: ['A goal scored while your team is killing a penalty', 'A goal scored from inside the crease after a rebound', 'A goal scored with fewer than five seconds left'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A short-handed goal is scored while a team is down a skater.', rationaleLong: 'Short-handed goals come when the penalized team scores despite skating with fewer players during the opponent’s power play.', citations: searchCitation('Short-handed goal hockey', 'short-handed goal hockey') }),
  q({ prompt: 'In hockey, what is a slap shot?', options: ['A hard shot taken with a full swinging motion', 'A shot that ricochets off the back boards', 'A legal check delivered with one hand on the stick'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A slap shot is the full-swing power shot.', rationaleLong: 'Players generate maximum power on a slap shot by winding up and driving the stick through the puck.', citations: searchCitation('Slap shot hockey', 'slap shot hockey') }),
  q({ prompt: 'What is the crease in hockey?', options: ['The marked area in front of the goal where the goalie works', 'The line used to trigger icing', 'The box where teams list their scratched players'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The crease is the marked space around the goalie’s net-front area.', rationaleLong: 'Hockey calls the painted space surrounding the goal mouth the crease, the area most tied to goalie positioning and net-front traffic.', citations: searchCitation('Crease hockey', 'crease hockey') }),
  q({ prompt: 'Which NHL award goes to the league’s top goaltender?', options: ['Vezina Trophy', 'Calder Trophy', 'Selke Trophy'], answerIndex: 0, difficulty: 3, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 87, lookupRisk: 'low', rationaleShort: 'That goalie honor is the Vezina Trophy.', rationaleLong: 'The NHL awards the Vezina Trophy each season to the goaltender judged best at the position.', citations: searchCitation('Vezina Trophy', 'Vezina Trophy') }),
  q({ prompt: 'What is a hat trick in hockey?', options: ['Three goals by one player in the same game', 'Three assists in the same period', 'A goal scored with a spin move and no rebound'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'achievement', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A hat trick is three goals by the same player in one game.', rationaleLong: 'Fans traditionally celebrate a hockey hat trick by tossing hats onto the ice after a player scores a third goal in the same game.', citations: searchCitation('Hat trick hockey', 'hat trick hockey') }),
  q({ prompt: 'What is the penalty box used for in hockey?', options: ['Holding penalized players during their time off the ice', 'Reviewing whether pucks crossed the goal line', 'Storing backup sticks and goalie masks'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'rule', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The penalty box is where penalized players serve their time.', rationaleLong: 'When players take penalties in hockey, they sit in the penalty box until their penalty expires or is ended by a goal when the rules allow.', citations: searchCitation('Penalty box hockey', 'penalty box hockey') }),
  q({ prompt: 'In hockey, what do the blue lines mainly separate?', options: ['The offensive, neutral, and defensive zones', 'The two halves of the rink for line changes', 'The legal area for slap shots from the circles'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The blue lines divide the rink into zones.', rationaleLong: 'The two blue lines separate the offensive, neutral, and defensive zones and are central to offside rules.', citations: searchCitation('Blue lines hockey', 'blue lines hockey') }),
  q({ prompt: 'What is a shootout in hockey?', options: ['A tiebreaker of alternating one-on-one attempts after overtime', 'A line brawl that stops the game immediately', 'A drill used during warmups to practice breakaways'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'event', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A shootout is the alternating breakaway tiebreaker used after overtime.', rationaleLong: 'When overtime does not decide the game, hockey can use a shootout in which players take alternating attempts against the goalie to settle it.', citations: searchCitation('Shootout hockey', 'shootout hockey') }),
  q({ prompt: 'In golf, what is stroke play?', options: ['A format decided by the lowest total number of strokes', 'A format decided hole by hole against one opponent', 'A tiebreak played only with wedges and putters'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'Stroke play is the format decided by total strokes.', rationaleLong: 'Most major golf tournaments use stroke play, where the winner is the player with the lowest cumulative score.', citations: searchCitation('Stroke play golf', 'stroke play golf') }),
  q({ prompt: 'In golf, what is the rough?', options: ['The longer grass beside the fairway', 'The sand around the lip of a bunker', 'The strip between the tee markers and the starter’s hut'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The rough is the longer grass off the fairway.', rationaleLong: 'Golfers describe the thicker grass bordering the fairway as the rough because it makes clean shots harder to control.', citations: searchCitation('Rough golf', 'rough golf') }),
  q({ prompt: 'In tennis, what is a volley?', options: ['A shot struck before the ball bounces', 'A serve that clips the top of the net and lands in', 'A rally of exactly four shots'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A volley is struck out of the air before the bounce.', rationaleLong: 'Tennis players volley when they hit the ball before it lands, usually while moving forward or playing near the net.', citations: searchCitation('Volley tennis', 'volley tennis') }),
  q({ prompt: 'In soccer, what is extra time?', options: ['Additional play after regulation in certain knockout matches', 'A bonus stoppage period added only after penalties', 'The clock used to review goals with VAR'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'event', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'Extra time is the added play after regulation in knockout matches.', rationaleLong: 'Knockout soccer matches that remain level can go to two added periods known as extra time before a possible shootout.', citations: searchCitation('Extra time soccer', 'extra time soccer') }),
  q({ prompt: 'Which soccer award often goes to a tournament’s best goalkeeper?', options: ['Golden Glove', 'Golden Boot', 'Golden Ball'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'achievement', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'That goalkeeping honor is the Golden Glove.', rationaleLong: 'Many major soccer tournaments use the Golden Glove to recognize the standout goalkeeper of the competition.', citations: searchCitation('Golden Glove soccer', 'Golden Glove soccer') }),
  q({ prompt: 'In motorsport, what does the checkered flag signal?', options: ['The race or session has ended', 'A slower car may not be passed', 'The pit lane is closed for weather'], answerIndex: 0, difficulty: 2, subdomain: 'motorsport', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'The checkered flag signals the finish.', rationaleLong: 'Across many forms of motorsport, the black-and-white checkered flag marks the end of the race or session.', citations: searchCitation('Checkered flag motorsport', 'checkered flag motorsport') }),
  q({ prompt: 'In motorsport, what is a chicane?', options: ['A quick sequence of turns designed to slow the cars', 'The painted box where pole position is marked', 'A timed stop in the pits for extra fuel only'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A chicane is the quick turn sequence used to reduce speed.', rationaleLong: 'Track designers add chicanes to force heavy braking and directional change, often for safety or overtaking balance.', citations: searchCitation('Chicane motorsport', 'chicane motorsport') }),
  q({ prompt: 'In gymnastics, what does winning the all-around title mean?', options: ['Posting the best combined score across the full set of events', 'Recording the single highest score on one apparatus', 'Qualifying every teammate into the final round'], answerIndex: 0, difficulty: 2, subdomain: 'olympics', promptKind: 'achievement', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'The all-around title goes to the best combined performance across events.', rationaleLong: 'Gymnastics crowns the all-around champion based on cumulative scoring across the full slate of apparatus rather than just one event.', citations: searchCitation('Gymnastics all-around', 'gymnastics all-around') }),
];

const CURATED_SPORTS_DAYBREAK_CURVEBALLS: CuratedTriviaSourceQuestion[] = [
  q({ prompt: 'In football, what is a neutral zone infraction?', options: ['A defensive penalty for entering the neutral zone and causing the offense to react before the snap', 'An offensive penalty for lining up with too many players in the backfield', 'A kicking violation for crossing midfield before the punt is away'], answerIndex: 0, difficulty: 2, subdomain: 'football', promptKind: 'rule', salienceScore: 85, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'rule-nuance', rationaleShort: 'Neutral zone infraction is the pre-snap defensive penalty that triggers the offense to react.', rationaleLong: 'Officials call neutral zone infraction when a defender enters the neutral zone and causes an immediate offensive response before the snap.', citations: searchCitation('Neutral zone infraction football', 'neutral zone infraction football') }),
  q({ prompt: 'In basketball, what makes a foul flagrant?', options: ['Excessive or dangerous contact beyond a normal personal foul', 'A defender touching the ball over the rim cylinder', 'A shooter stepping on the sideline before releasing a shot'], answerIndex: 0, difficulty: 2, subdomain: 'basketball', promptKind: 'rule', salienceScore: 85, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'rule-nuance', rationaleShort: 'Flagrant fouls involve excessive or dangerous contact.', rationaleLong: 'Basketball reserves the flagrant designation for contact judged unnecessary or excessive beyond an ordinary personal foul.', citations: searchCitation('Flagrant foul basketball', 'flagrant foul basketball') }),
  q({ prompt: 'In baseball, what is a force out?', options: ['An out made by touching the base a runner is forced to advance to while holding the ball', 'An out made only by tagging the runner with the glove', 'An out recorded when a batter bunts foul with two strikes'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'rule-nuance', rationaleShort: 'A force out comes from touching the forced base with the ball.', rationaleLong: 'When a runner must advance because the batter became a runner, the defense can get the out by touching the destination base before the runner arrives.', citations: searchCitation('Force out baseball', 'force out baseball') }),
  q({ prompt: 'In baseball, what is a fielder’s choice?', options: ['A play where the fielder gets or tries for a different runner instead of the batter', 'A manager’s option to swap in a new pitcher mid-at-bat', 'A ball ruled fair or foul based on the umpire crew vote'], answerIndex: 0, difficulty: 2, subdomain: 'baseball', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'terminology', rationaleShort: 'A fielder’s choice is scored when the defense goes after another runner instead of the batter.', rationaleLong: 'Scorekeepers use fielder’s choice when the batter reaches because the defense elects to try for a different runner rather than take the easy out at first.', citations: searchCitation('Fielders choice baseball', 'fielder’s choice baseball') }),
  q({ prompt: 'In hockey, what is a one-timer?', options: ['A shot taken immediately off a pass without settling the puck first', 'A goal that counts only after one video review', 'A line change made with exactly one skater leaving the ice'], answerIndex: 0, difficulty: 2, subdomain: 'hockey', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'terminology', rationaleShort: 'A one-timer is fired right away off the pass.', rationaleLong: 'Players use one-timers to attack quickly because they shoot in one motion instead of receiving the puck and setting it first.', citations: searchCitation('One-timer hockey', 'one-timer hockey') }),
  q({ prompt: 'In golf, what is a provisional ball?', options: ['A second ball played in case the original might be lost or out of bounds', 'A free replacement ball used after a hole-in-one', 'A practice shot allowed on the first tee in match play'], answerIndex: 0, difficulty: 2, subdomain: 'golf', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'rule-nuance', rationaleShort: 'A provisional ball is the backup ball played in case the original is lost or out of bounds.', rationaleLong: 'Golf allows a provisional so players do not have to walk all the way back if the original ball turns out to be lost or out of bounds.', citations: searchCitation('Provisional ball golf', 'provisional ball golf') }),
  q({ prompt: 'On a tennis serve, what does let mean?', options: ['The serve clipped the net and still landed in, so it is replayed', 'The server double-faulted but won the point on challenge', 'The returner stopped the point by calling a medical timeout'], answerIndex: 0, difficulty: 2, subdomain: 'tennis', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'terminology', rationaleShort: 'A let serve clips the net and lands in, so the point is replayed.', rationaleLong: 'Tennis calls it a let when the serve touches the net but still lands legally in the service box, which means the serve does not count and is replayed.', citations: searchCitation('Let serve tennis', 'let serve tennis') }),
  q({ prompt: 'In motorsport strategy, what is an undercut?', options: ['Pitting earlier to gain track position with fresher tires', 'Passing beneath another car by using the apron through the corner', 'Dropping behind the safety car before the restart zone'], answerIndex: 0, difficulty: 3, subdomain: 'motorsport', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'famous-edge-case', rationaleShort: 'An undercut is the strategy of pitting early to jump a rival later.', rationaleLong: 'Teams go for the undercut when fresh tires from an earlier stop can produce enough lap-time gain to leapfrog a rival after their own stop.', citations: searchCitation('Undercut Formula 1', 'undercut Formula 1') }),
  q({ prompt: 'In soccer, what does aggregate score mean in a two-leg tie?', options: ['The combined score from both matches', 'The score after away goals are doubled', 'The score at the end of only the second match'], answerIndex: 0, difficulty: 2, subdomain: 'soccer', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'rule-nuance', rationaleShort: 'Aggregate score is the combined total from both legs.', rationaleLong: 'Home-and-away ties are commonly decided by aggregate score, which totals the goals from both matches together.', citations: searchCitation('Aggregate score soccer', 'aggregate score soccer') }),
  q({ prompt: 'In combat sports, what does southpaw describe?', options: ['A left-handed stance with the right foot forward', 'A fighter who prefers body shots over head shots', 'A ruleset that allows only standing strikes'], answerIndex: 0, difficulty: 2, subdomain: 'combat', promptKind: 'term', salienceScore: 83, lookupRisk: 'low', isTrickQuestion: true, curveballOnly: true, curveballKind: 'terminology', rationaleShort: 'Southpaw is the left-handed stance with the right foot in front.', rationaleLong: 'Combat sports call the mirror-image lefty setup southpaw, which usually places the right foot and right hand forward.', citations: searchCitation('Southpaw boxing', 'southpaw boxing') }),
];

const CURATED_SPORTS_ROTATION_DEPTH: CuratedTriviaSourceQuestion[] = [
  q({
    prompt: 'Which tennis competition is the women’s team counterpart to the Davis Cup?',
    options: ['Billie Jean King Cup', 'Laver Cup', 'Hopman Cup'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'event',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'That women’s team event is the Billie Jean King Cup.',
    rationaleLong: 'The Billie Jean King Cup is the main international women’s team competition in tennis and serves as the counterpart to the Davis Cup.',
  }),
  q({
    prompt: 'In tennis, what is a double fault?',
    options: ['Missing both serve attempts and losing the point', 'Winning a point with two volleys in a row', 'Serving from the wrong side of the court'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'rule',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'A double fault means both serves miss and the point is lost.',
    rationaleLong: 'Because the server gets two chances to start the point, missing both attempts results in a double fault and the loss of the point.',
  }),
  q({
    prompt: 'Which Grand Slam tournament is played in Melbourne each January?',
    options: ['The Australian Open', 'The French Open', 'The U.S. Open'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'event',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'Melbourne hosts the Australian Open.',
    rationaleLong: 'The Australian Open is the Grand Slam event played each January in Melbourne.',
  }),
  q({
    prompt: 'In tennis, what is match point?',
    options: ['A point that would end the match if won', 'A point replayed because of crowd noise', 'A point worth double in a deciding set'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'Match point is the point that can end the match.',
    rationaleLong: 'When a player is one point away from winning the entire match, that next point is called match point.',
  }),
  q({
    prompt: 'In tennis, what is a second serve?',
    options: ['The backup serve hit after the first serve misses', 'A serve used only in tie-breaks', 'A serve that must bounce before it crosses the net'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A second serve comes after the first serve misses.',
    rationaleLong: 'Tennis gives the server a second attempt if the first serve lands out, so the follow-up attempt is the second serve.',
  }),
  q({
    prompt: 'Which golfer is nicknamed Lefty?',
    options: ['Phil Mickelson', 'Jordan Spieth', 'Tom Watson'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'player',
    salienceScore: 84,
    lookupRisk: 'low',
    obscurityFlags: ['famous-nickname'],
    rationaleShort: 'Phil Mickelson is the golfer nicknamed Lefty.',
    rationaleLong: 'Phil Mickelson is widely known by the nickname Lefty, one of the most familiar nicknames in modern golf.',
  }),
  q({
    prompt: 'In golf, what is the cut?',
    options: ['The score line players must survive to keep playing into the weekend', 'A sudden-death playoff between tied leaders', 'A shot intentionally played low under the wind'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'The cut is the line players must survive to keep playing.',
    rationaleLong: 'In most tournaments, players below the cut line are eliminated after the early rounds while the rest advance into the weekend.',
  }),
  q({
    prompt: 'Which team golf event pits the United States against an International side from outside Europe?',
    options: ['Presidents Cup', 'Ryder Cup', 'Solheim Cup'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'event',
    salienceScore: 80,
    lookupRisk: 'low',
    rationaleShort: 'That event is the Presidents Cup.',
    rationaleLong: 'The Presidents Cup matches the United States against an International team drawn from countries outside Europe.',
  }),
  q({
    prompt: 'In golf, what club is usually used for short rolling strokes on the green?',
    options: ['Putter', 'Driver', 'Sand wedge'],
    answerIndex: 0,
    difficulty: 1,
    subdomain: 'golf',
    promptKind: 'equipment',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'A putter is used on the green.',
    rationaleLong: 'Golfers use a putter for short, controlled strokes on the green when they are trying to roll the ball into the hole.',
  }),
  q({
    prompt: 'In golf, what is an albatross?',
    options: ['Three strokes under par on a hole', 'A hole-in-one on any par-3', 'A score of exactly even par for a round'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'golf',
    promptKind: 'term',
    salienceScore: 79,
    lookupRisk: 'low',
    rationaleShort: 'An albatross means three under par on a hole.',
    rationaleLong: 'Golf uses albatross for the rare feat of finishing a hole three strokes under par.',
  }),
  q({
    prompt: 'What is the heptathlon?',
    options: ['A seven-event track and field competition', 'A seven-race Olympic swimming relay', 'A seven-round medal playoff in fencing'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'olympics',
    promptKind: 'event',
    salienceScore: 83,
    lookupRisk: 'low',
    rationaleShort: 'The heptathlon is a seven-event track and field competition.',
    rationaleLong: 'The heptathlon combines seven separate disciplines into one all-around track and field contest.',
  }),
  q({
    prompt: 'Which Olympic event combines fencing, swimming, riding, shooting, and running?',
    options: ['Modern pentathlon', 'Triathlon', 'Heptathlon'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'olympics',
    promptKind: 'sport-id',
    salienceScore: 80,
    lookupRisk: 'low',
    rationaleShort: 'That multisport event is the modern pentathlon.',
    rationaleLong: 'Modern pentathlon bundles fencing, swimming, equestrian riding, shooting, and running into a single Olympic event.',
  }),
  q({
    prompt: 'In Olympic sprinting, what usually happens after a false start under modern rules?',
    options: ['The athlete who false-started is disqualified', 'Everyone restarts with no penalty', 'The lane assignment is reversed for the restart'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'olympics',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A false start usually leads to disqualification.',
    rationaleLong: 'Modern sprint rules are strict, so the athlete who breaks early is generally disqualified rather than being given a warning restart.',
  }),
  q({
    prompt: 'In swimming, what is the individual medley?',
    options: ['A race where one swimmer uses all four strokes', 'A relay where four swimmers each race freestyle only', 'A sprint final held only at world championships'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'olympics',
    promptKind: 'event',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'The individual medley has one swimmer use all four strokes.',
    rationaleLong: 'In the individual medley, a single swimmer completes the race while rotating through butterfly, backstroke, breaststroke, and freestyle.',
  }),
  q({
    prompt: 'Which Winter Olympic sport uses sweeping to guide a granite stone?',
    options: ['Curling', 'Luge', 'Bobsled'],
    answerIndex: 0,
    difficulty: 1,
    subdomain: 'olympics',
    promptKind: 'sport-id',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'That sweeping-and-stone sport is curling.',
    rationaleLong: 'Curling is the Winter Olympic sport where teammates sweep the ice to influence the path of a granite stone.',
  }),
  q({
    prompt: 'In motorsport, what does a blue flag usually signal?',
    options: ['A faster car is approaching and should be allowed through', 'The race leader has taken the final lap', 'The pit lane is closed because of debris'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A blue flag warns that a faster car is coming through.',
    rationaleLong: 'Race officials use the blue flag to tell a driver that a faster car, often the leader, is approaching and should not be held up.',
  }),
  q({
    prompt: 'In motorsport, what is a chicane?',
    options: ['A tight sequence of turns used to slow cars down', 'A pit-lane penalty that adds time after the race', 'A standing-start procedure on a wet track'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A chicane is a tight set of turns built to slow the field.',
    rationaleLong: 'Tracks use chicanes to force heavy braking and reduce speed through a rapid change of direction.',
  }),
  q({
    prompt: 'In motorsport, what does a safety car do?',
    options: ['Neutralizes the race and bunches the field behind it', 'Ends the race immediately after a major crash', 'Allows only the leaders to enter pit lane'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A safety car neutralizes the race and gathers the field.',
    rationaleLong: 'When conditions become dangerous, the safety car slows the field and keeps the cars grouped together until racing can safely resume.',
  }),
  q({
    prompt: 'In Formula 1, what is parc ferme?',
    options: ['The period when cars cannot be materially modified after qualifying', 'The section of track reserved for podium celebrations', 'The final fuel stop before the race begins'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 80,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'Parc ferme is the restricted period after qualifying.',
    rationaleLong: 'Under parc ferme rules, teams are heavily limited in what they can change on the car after qualifying has begun.',
  }),
  q({
    prompt: 'In boxing or MMA, what does TKO stand for?',
    options: ['Technical knockout', 'Timed key offense', 'Total kick outcome'],
    answerIndex: 0,
    difficulty: 1,
    subdomain: 'combat',
    promptKind: 'term',
    salienceScore: 88,
    lookupRisk: 'low',
    rationaleShort: 'TKO stands for technical knockout.',
    rationaleLong: 'A technical knockout is declared when the referee, doctor, or corner stops the fight even though the fighter is not counted out cold.',
  }),
  q({
    prompt: 'In boxing, what is a split decision?',
    options: ['A win where the judges do not all score the fight the same way', 'A knockout that happens between rounds', 'A draw after every judge scores the bout identically'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'combat',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A split decision means the judges were divided.',
    rationaleLong: 'A split decision happens when the judges disagree on the scoring, but one fighter still wins on the cards.',
  }),
  q({
    prompt: 'In MMA, what does it mean when a fighter taps out?',
    options: ['They submit to end the fight', 'They request a point deduction for the opponent', 'They ask for an instant replay review'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'combat',
    promptKind: 'rule',
    salienceScore: 86,
    lookupRisk: 'low',
    rationaleShort: 'Tapping out is a submission signal.',
    rationaleLong: 'When a fighter taps the opponent or the mat, it signals submission and the fight is stopped.',
  }),
  q({
    prompt: 'Which boxing stance is most associated with a left-handed fighter?',
    options: ['Southpaw', 'Orthodox', 'Peekaboo'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'combat',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'A left-handed boxer is usually described as a southpaw.',
    rationaleLong: 'Southpaw is the standard boxing term for the mirror-image stance most often used by left-handed fighters.',
  }),
  q({
    prompt: 'In soccer, what is stoppage time?',
    options: ['Extra minutes added to make up for delays', 'A replay period used after extra time ends level', 'The countdown before a penalty shootout begins'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'soccer',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'Stoppage time is added at the end of a half for delays.',
    rationaleLong: 'Referees add stoppage time to recover minutes lost to injuries, substitutions, reviews, and other interruptions.',
  }),
  q({
    prompt: 'In a two-leg soccer tie, what does aggregate score mean?',
    options: ['The combined score from both matches', 'The score after only away goals are counted', 'The score once extra time begins in the second leg'],
    answerIndex: 0,
    difficulty: 3,
    subdomain: 'soccer',
    promptKind: 'rule',
    salienceScore: 81,
    lookupRisk: 'low',
    rationaleShort: 'Aggregate score means the combined score over both legs.',
    rationaleLong: 'Home-and-away knockout ties are often settled by the aggregate score, which totals the goals from both matches.',
  }),
  q({
    prompt: 'Which award usually goes to a tournament’s top goal scorer in soccer?',
    options: ['Golden Boot', 'Ballon d’Or', 'Golden Glove'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'soccer',
    promptKind: 'achievement',
    salienceScore: 84,
    lookupRisk: 'low',
    rationaleShort: 'The top scorer usually wins the Golden Boot.',
    rationaleLong: 'Soccer tournaments commonly use Golden Boot for the award given to the player who scores the most goals.',
  }),
  q({
    prompt: 'In soccer, what is a derby?',
    options: ['A rivalry match between clubs from the same city or area', 'A replay played after a cup final ends level', 'A rule that limits how many foreign players can start'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'soccer',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    rationaleShort: 'A derby is a local rivalry match.',
    rationaleLong: 'Soccer uses derby for matches between nearby rivals, especially clubs from the same city or region.',
  }),
];

const CURATED_SPORTS_OPENING_DEPTH: CuratedTriviaSourceQuestion[] = [
  q({ prompt: 'In football, how many points is a touchdown worth before the extra point?', options: ['6', '3', '7'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'rule', salienceScore: 89, lookupRisk: 'low', rationaleShort: 'A touchdown is worth 6 points before any kick or conversion try.', rationaleLong: 'An NFL touchdown scores 6 points, and the team can then attempt an extra point or a 2-point conversion.' }),
  q({ prompt: 'In football, what does QB stand for?', options: ['Quarterback', 'Quick boot', 'Quad block'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'QB is shorthand for quarterback.', rationaleLong: 'Football uses QB as the standard abbreviation for quarterback, the player who leads the offense and handles most snaps.' }),
  q({ prompt: 'In football, what does OT stand for on a scoreboard?', options: ['Overtime', 'Offensive tackle', 'Official timeout'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'term', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'OT on the scoreboard means overtime.', rationaleLong: 'When a football game goes beyond regulation, broadcasts and scoreboards label the extra period as OT for overtime.' }),
  q({ prompt: 'In football, how many points is a field goal worth?', options: ['3', '2', '6'], answerIndex: 0, difficulty: 1, subdomain: 'football', promptKind: 'rule', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'A field goal is worth 3 points.', rationaleLong: 'A successful place-kick through the uprights during normal play scores 3 points in football.' }),
  q({ prompt: 'In basketball, what violation is called when a player stops dribbling and then starts again?', options: ['Double dribble', 'Goaltending', 'Backcourt'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'rule', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'That violation is a double dribble.', rationaleLong: 'Once a player ends a dribble, starting a new dribble without another player touching the ball results in a double-dribble violation.' }),
  q({ prompt: 'In basketball, what is a layup?', options: ['A close-range shot taken near the rim', 'A pass thrown the length of the court', 'A free throw taken after a timeout'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A layup is a close-range shot near the rim.', rationaleLong: 'A layup is one of basketball’s most basic scoring moves, usually finished right at the basket after a drive.' }),
  q({ prompt: 'In basketball, what is the key?', options: ['The painted lane area near the basket', 'The midcourt logo circle', 'The shot clock control box'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The key is the painted lane near the basket.', rationaleLong: 'Basketball players use key for the marked lane area in front of the basket, also commonly called the paint.' }),
  q({ prompt: 'In basketball, how many points is a made free throw worth?', options: ['1', '2', '3'], answerIndex: 0, difficulty: 1, subdomain: 'basketball', promptKind: 'rule', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'A standard free throw is worth 1 point.', rationaleLong: 'Free throws are uncontested shots taken from the foul line, and each made free throw counts for 1 point.' }),
  q({ prompt: 'In baseball, what is the infield?', options: ['The area around the bases inside the outfield', 'The space behind home plate for photographers', 'The warning track next to the wall'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The infield is the area around the bases.', rationaleLong: 'Baseball divides the field into the infield around the bases and the outfield beyond it.' }),
  q({ prompt: 'In baseball, what does DH stand for?', options: ['Designated hitter', 'Double header', 'Defensive hold'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'DH stands for designated hitter.', rationaleLong: 'A designated hitter bats in place of the pitcher under DH rules, so the abbreviation DH means designated hitter.' }),
  q({ prompt: 'In baseball, what is the bullpen?', options: ['The area where relief pitchers warm up', 'The dirt circle around home plate', 'The rope line that keeps fans off the field'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The bullpen is where relief pitchers warm up.', rationaleLong: 'Relievers wait and warm up in the bullpen so they can enter the game quickly when called on.' }),
  q({ prompt: 'In baseball, what is the outfield?', options: ['The area of the field beyond the infield', 'The chalk line around home plate', 'The dugout reserved for visiting players'], answerIndex: 0, difficulty: 1, subdomain: 'baseball', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The outfield is the area beyond the infield.', rationaleLong: 'The outfield is the large grass area past the infield where outfielders track fly balls and deep hits.' }),
  q({ prompt: 'In hockey, what is the neutral zone?', options: ['The area between the two blue lines', 'The painted crease in front of the net', 'The bench area used for line changes'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The neutral zone is the area between the blue lines.', rationaleLong: 'On a standard rink, the neutral zone is the middle section between the attacking and defending zones.' }),
  q({ prompt: 'In hockey, what is an assist?', options: ['A pass that directly helps set up a goal', 'A shot that hits both goalposts before going in', 'A legal body check along the boards'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'An assist is credited for helping set up a goal.', rationaleLong: 'Hockey awards assists to the players whose passes directly help create a goal-scoring play.' }),
  q({ prompt: 'In hockey, what is a faceoff?', options: ['A puck drop used to restart play', 'A delayed-penalty signal', 'A line change during a timeout'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'A faceoff is a puck drop used to restart play.', rationaleLong: 'When play stops in hockey, officials often restart it with a faceoff between opposing players.' }),
  q({ prompt: 'In hockey, what does the blue line help separate?', options: ['The neutral zone from an attacking or defending zone', 'The goal crease from the end boards', 'The bench area from the penalty box'], answerIndex: 0, difficulty: 1, subdomain: 'hockey', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The blue lines mark the edges of the neutral zone.', rationaleLong: 'Hockey uses the blue lines to divide the rink into zones, separating the neutral zone from the offensive and defensive ends.' }),
  q({ prompt: 'In tennis, what does love mean on the scoreboard?', options: ['Zero points', 'A tied score at 40-40', 'One point won on serve'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'term', salienceScore: 86, lookupRisk: 'low', rationaleShort: 'Love means zero points in tennis scoring.', rationaleLong: 'Tennis uses the term love to indicate that a player has not yet won a point in the game.' }),
  q({ prompt: 'In tennis, what is an ace?', options: ['A serve the opponent does not touch', 'A tiebreak won 7-0', 'A volley hit after the ball bounces twice'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'term', salienceScore: 84, lookupRisk: 'low', rationaleShort: 'An ace is a serve the opponent does not touch.', rationaleLong: 'Tennis calls a clean, untouched winning serve an ace because the server wins the point outright.' }),
  q({ prompt: 'In tennis, what is the baseline?', options: ['The line at the back of the court', 'The line that divides the service boxes', 'The sideline nearest the umpire chair'], answerIndex: 0, difficulty: 1, subdomain: 'tennis', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The baseline is the line at the back of the court.', rationaleLong: 'Each tennis court has a baseline at the back, and many rallies begin with players trading shots from behind it.' }),
  q({ prompt: 'In golf, what is the fairway?', options: ['The closely mown area between the tee and the green', 'The sandy bunker next to the green', 'The practice area behind the clubhouse'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'The fairway is the closely cut area leading toward the green.', rationaleLong: 'Golfers aim for the fairway because it is the main, neatly mown strip between the teeing area and the green.' }),
  q({ prompt: 'In golf, what is a bunker?', options: ['A sand hazard', 'A practice green', 'A score of one under par'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'place', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'A bunker is a sand hazard.', rationaleLong: 'Golf uses bunker for a sand-filled hazard that can make the next shot more difficult.' }),
  q({ prompt: 'In golf, what is the tee box?', options: ['The area where a hole begins', 'The path that links two greens', 'The scoreboard for the front nine'], answerIndex: 0, difficulty: 1, subdomain: 'golf', promptKind: 'place', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'The tee box is where a hole begins.', rationaleLong: 'Golfers start each hole from the teeing area, often casually called the tee box.' }),
  q({ prompt: 'What is the Olympic torch relay?', options: ['The ceremony that carries the flame toward the host city before the Games', 'The final sprint event on the track schedule', 'The medal presentation that closes the Games'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'event', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'The torch relay carries the Olympic flame toward the host city.', rationaleLong: 'Before the Games begin, the Olympic torch relay transports the ceremonial flame along a route that ends in the host city.' }),
  q({ prompt: 'Which Olympic medal is awarded for second place?', options: ['Silver', 'Gold', 'Bronze'], answerIndex: 0, difficulty: 1, subdomain: 'olympics', promptKind: 'achievement', salienceScore: 82, lookupRisk: 'low', rationaleShort: 'Second place receives the silver medal.', rationaleLong: 'Olympic podium finishes award gold for first, silver for second, and bronze for third.' }),
  q({ prompt: 'In motorsport, what is pit lane?', options: ['The lane where cars enter for service', 'The road used only by the safety car', 'The warm-up lane used before the national anthem'], answerIndex: 0, difficulty: 1, subdomain: 'motorsport', promptKind: 'place', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'Pit lane is where cars enter for service.', rationaleLong: 'Cars drive down pit lane when teams need to change tires, add fuel, or make repairs during an event.' }),
  q({ prompt: 'In combat sports, what is a weigh-in?', options: ['The pre-fight check where athletes make the agreed weight', 'The final round of a title fight', 'The judge review after a split decision'], answerIndex: 0, difficulty: 1, subdomain: 'combat', promptKind: 'event', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'A weigh-in is the pre-fight weight check.', rationaleLong: 'Combat sports hold weigh-ins before the event so officials can confirm that fighters made the contracted weight.' }),
  q({ prompt: 'In soccer, what is a cross?', options: ['A pass played into the middle from a wide area', 'A free kick taken from the center circle', 'A restart awarded after a dropped ball'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'term', salienceScore: 81, lookupRisk: 'low', rationaleShort: 'A cross is a pass sent in from a wide area.', rationaleLong: 'Teams use crosses to send the ball from the wing toward teammates in front of goal.' }),
  q({ prompt: 'In soccer, what does a yellow card usually signal?', options: ['A caution from the referee', 'A goal review in progress', 'An automatic substitution'], answerIndex: 0, difficulty: 1, subdomain: 'soccer', promptKind: 'rule', salienceScore: 83, lookupRisk: 'low', rationaleShort: 'A yellow card is a caution.', rationaleLong: 'Referees show a yellow card to warn a player for misconduct or repeated fouls.' }),
];

const CURATED_SPORTS_CURVEBALL_BENCH: CuratedTriviaSourceQuestion[] = [
  q({
    prompt: 'In golf, what does match play count to decide who is ahead?',
    options: ['Holes won rather than total strokes', 'Only birdies and better', 'The best single nine-hole stretch'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'Match play is scored by holes won, not aggregate strokes.',
    rationaleLong: 'In match play, each hole is its own contest, so the running score depends on how many holes each golfer has won rather than the full round total.',
  }),
  q({
    prompt: 'In golf etiquette, what does letting a group play through allow them to do?',
    options: ['Move ahead of a slower group', 'Replay the previous hole', 'Drop a ball without penalty'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'Playing through lets the faster group go ahead.',
    rationaleLong: 'When a faster group is waiting, the group in front can wave them through so pace of play stays reasonable for everyone on the course.',
  }),
  q({
    prompt: 'In tennis, what is an unforced error?',
    options: ['A mistake made without the opponent forcing it', 'A serve replayed because of a let', 'A point lost for a time violation'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'An unforced error is a self-inflicted mistake.',
    rationaleLong: 'Analysts use unforced error for a miss that comes from the player’s own mistake rather than an especially difficult shot created by the opponent.',
  }),
  q({
    prompt: 'In tennis, what does it mean to hold serve?',
    options: ['Win the game while serving', 'Stop play because of a hindrance', 'Switch to the opposite service box'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'Holding serve means winning your own service game.',
    rationaleLong: 'Because serving is an advantage in tennis, players and broadcasters talk about holding serve when the server successfully wins that game.',
  }),
  q({
    prompt: 'In Olympic gymnastics, what does it mean to stick the landing?',
    options: ['Finish without taking a step or hop', 'Add an extra twist before dismounting', 'Qualify for the apparatus final'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'olympics',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A stuck landing finishes cleanly without movement.',
    rationaleLong: 'Gymnasts talk about sticking the landing when they absorb the dismount in place instead of needing a stabilizing step or hop.',
  }),
  q({
    prompt: 'In Olympic track and field, what is the heptathlon?',
    options: ['A seven-event combined competition', 'A seven-lap middle-distance race', 'A relay with seven runners'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'olympics',
    promptKind: 'sport-id',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'sport-identification',
    rationaleShort: 'The heptathlon is the seven-event combined competition.',
    rationaleLong: 'Track and field uses heptathlon for the combined event built from seven separate disciplines and scored across the full set.',
  }),
  q({
    prompt: 'In motorsport, what does a black flag tell a driver to do?',
    options: ['Return to the pits or face disqualification', 'Speed up because the track is clear', 'Take one final qualifying lap'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A black flag sends the driver to the pits.',
    rationaleLong: 'Race control uses the black flag to order a specific driver into pit lane, typically because of a serious infraction or unsafe condition.',
  }),
  q({
    prompt: 'Before a standing start, what is the formation lap used for in motorsport?',
    options: ['Warming tires and lining up the field', 'Awarding bonus points for fastest pace', 'Testing whether pit road is open'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'The formation lap readies the cars for the start.',
    rationaleLong: 'Drivers use the formation lap to warm the tires and brakes, confirm systems, and take their proper grid spots before the race begins.',
  }),
  q({
    prompt: 'In soccer, what is a clean sheet?',
    options: ['A match with no goals allowed', 'A scoreless extra-time period', 'A game with no yellow cards shown'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'soccer',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A clean sheet means finishing without conceding a goal.',
    rationaleLong: 'Soccer credits a clean sheet when a team, and especially its goalkeeper, keeps the opponent from scoring for the entire match.',
  }),
  q({
    prompt: 'In soccer, what is an own goal?',
    options: ['A goal accidentally scored into your own net', 'A goal that comes directly from a goal kick', 'A goal scored in stoppage time by the home side'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'soccer',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'An own goal is scored accidentally into a team’s own net.',
    rationaleLong: 'Own goals happen when a defender or goalkeeper is the last to touch the ball before it crosses their own goal line.',
  }),
  q({
    prompt: 'In boxing, what is a standing eight count?',
    options: ['A referee pause to assess a hurt fighter after a knockdown', 'The mandatory count before every title round', 'A scoring bonus given for dominant aggression'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'combat',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A standing eight count lets the referee assess a fighter’s condition.',
    rationaleLong: 'In rule sets that allow it, the referee can pause the action for an eight count to decide whether a boxer is fit to continue after being hurt or dropped.',
  }),
  q({
    prompt: 'In baseball, what does tagging up allow a runner to do?',
    options: ['Advance after a caught fly ball', 'Take first base after ball four', 'Steal home once the pitcher begins the windup'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'baseball',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'Tagging up lets a runner advance after the catch.',
    rationaleLong: 'On a fly ball, baserunners must wait for the catch before leaving the base, and then they can try to advance by tagging up.',
  }),
  q({
    prompt: 'In hockey, what is a penalty shot?',
    options: ['A one-on-one scoring chance awarded after a denied breakaway', 'A faceoff taken at center ice after icing', 'A shot that counts double during overtime'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'hockey',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A penalty shot is the one-on-one chance awarded after a fouled breakaway.',
    rationaleLong: 'When a clear scoring chance is illegally taken away on a breakaway, officials can award a penalty shot rather than just a standard power play.',
  }),
  q({
    prompt: 'In football, what does an onside kick try to let the kicking team do?',
    options: ['Recover its own kickoff', 'Force the opponent to start at its own 1-yard line', 'Erase a touchdown from the scoreboard'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'football',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'An onside kick is designed to give the kicking team the ball back.',
    rationaleLong: 'Teams use onside kicks when they need another possession, because a short legal kickoff can be recovered by the kicking team after it travels the required distance.',
  }),
  q({
    prompt: 'In football, what is a touchback?',
    options: ['A dead ball in the end zone that brings the ball out to start a drive', 'A catch made with one foot in bounds', 'A down that ends with both teams penalized'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'football',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A touchback resets play after a dead ball in the end zone.',
    rationaleLong: 'When certain kicks or turnovers become dead in the end zone, the receiving team starts its drive from the touchback spot instead of running the ball out.',
  }),
  q({
    prompt: 'In baseball, what is a balk?',
    options: ['An illegal motion by the pitcher with runners on base', 'A foul ball that lands in the stands', 'A pitch that bounces before reaching the plate'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'baseball',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A balk is an illegal pitching motion with runners aboard.',
    rationaleLong: 'Balks exist to stop pitchers from deceiving baserunners with illegal starts, stops, or motions once they are committed to the pitch or throw.',
  }),
  q({
    prompt: 'In baseball, what is a squeeze play?',
    options: ['A bunt meant to bring a runner home from third', 'A pickoff throw used to trap a runner between bases', 'A pitchout called when a steal is certain'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'baseball',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A squeeze play uses a bunt to score the runner from third.',
    rationaleLong: 'On a squeeze, the runner breaks for home and the batter tries to deaden the ball with a bunt so the defense cannot make the play at the plate in time.',
  }),
  q({
    prompt: 'In hockey, what is a delayed penalty?',
    options: ['Play continues until the penalized team touches the puck', 'A penalty that is enforced after the next intermission', 'A minor penalty that does not create a power play'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'hockey',
    promptKind: 'rule',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'A delayed penalty lets play continue until the guilty team touches the puck.',
    rationaleLong: 'Officials raise an arm to signal the infraction, but they do not stop play immediately if the non-offending team controls the puck and keeps its scoring chance alive.',
  }),
  q({
    prompt: 'In hockey, what is an empty-net goal?',
    options: ['A goal scored with the other team’s goalie pulled', 'A goal that goes in without touching a stick', 'A shootout goal after the goalie loses a skate blade'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'hockey',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'An empty-net goal comes after the goalie has been pulled.',
    rationaleLong: 'Late in games, teams sometimes remove the goalie for an extra attacker, so a clinching goal into the vacated cage is called an empty-net goal.',
  }),
  q({
    prompt: 'In golf, what does making the cut mean after the early rounds?',
    options: ['Earning the right to keep playing into the weekend', 'Winning a playoff hole to stay alive', 'Taking fewer strokes than par on one hole'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'rule',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'rule-nuance',
    rationaleShort: 'Making the cut means surviving into the later rounds.',
    rationaleLong: 'Most pro tournaments trim the field after the opening rounds, so players who make the cut keep competing while the rest head home.',
  }),
  q({
    prompt: 'In golf scoring, what is an eagle?',
    options: ['Two strokes under par on a hole', 'One stroke over par on a hole', 'Three strokes under par on a hole'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'golf',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'An eagle is two under par on a hole.',
    rationaleLong: 'Golf scoring uses eagle for a hole completed in two strokes fewer than its listed par, making it rarer than a birdie and less rare than an albatross.',
  }),
  q({
    prompt: 'In tennis, what is a seed in the bracket?',
    options: ['A highly ranked player placed to avoid other top players early', 'A reserve player added after qualifying ends', 'A line judge assigned to the championship court'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A seed is a top player placed to keep the draw balanced.',
    rationaleLong: 'Seeding protects the strongest players from meeting too early, which helps tournaments spread the favorites across different parts of the draw.',
  }),
  q({
    prompt: 'In tennis, what is a drop shot?',
    options: ['A softly placed shot meant to die near the net', 'A serve hit straight at the body', 'A volley struck before the ball reaches shoulder height'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'tennis',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A drop shot is feathered short so the ball dies near the net.',
    rationaleLong: 'Players use drop shots to exploit an opponent positioned deep behind the baseline by taking pace off the ball and landing it short.',
  }),
  q({
    prompt: 'In motorsport, what is drafting?',
    options: ['Following closely to reduce air resistance', 'Changing tires under green-flag conditions', 'Serving a penalty without stopping the car'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'motorsport',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'Drafting means tucking in behind another car to cut drag.',
    rationaleLong: 'By sitting in the slipstream of the car ahead, a driver can reduce aerodynamic resistance and often gain extra straight-line speed for a pass.',
  }),
  q({
    prompt: 'In boxing or MMA, what is a split decision?',
    options: ['A verdict where the judges are divided on the winner', 'A stoppage caused by a cut over one eye', 'A fight restarted after both competitors fall through the ropes'],
    answerIndex: 0,
    difficulty: 2,
    subdomain: 'combat',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    curveballKind: 'terminology',
    rationaleShort: 'A split decision means the judges did not all pick the same fighter.',
    rationaleLong: 'Combat sports call it a split decision when one fighter wins on the cards but at least one judge scored the bout for the opponent.',
  }),
];

const SPORTS_CURVEBALL_OVERRIDES = new Map<string, TriviaCurveballKind>();

function applySportsCurveballOverrides(
  questions: CuratedTriviaSourceQuestion[]
): CuratedTriviaSourceQuestion[] {
  return questions.map((question) => {
    const curveballKind = SPORTS_CURVEBALL_OVERRIDES.get(question.prompt);
    if (!curveballKind) return question;
    return {
      ...question,
      isTrickQuestion: true,
      curveballKind,
    };
  });
}

export const CURATED_SPORTS_TEMPLATE_BOOSTERS: CuratedTriviaSourceQuestion[] = [
  ...applySportsCurveballOverrides([
    ...buildTeamCityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamSportQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamLeagueQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildVenueQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildVenueCityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildVenueLeagueQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamFromCityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamFromVenueQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildLeagueVenueTeamQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamByLeagueSelectionQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildTeamBySportSelectionQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildVenueSportQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildVenueFromLeagueCityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildLeagueTeamFromCityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildLeagueFromVenueIdentityQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildCityFromVenueLeagueQuestions(ALL_SPORTS_TEAM_CARDS),
    ...buildPlayerTeamQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerTeamFromPositionQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerPositionQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerTeamPositionQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerSportQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerSportSelectionQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerLeagueQuestions(ALL_SPORTS_PLAYER_CARDS, ALL_SPORTS_TEAM_CARDS),
    ...buildPlayerTeamCityQuestions(ALL_SPORTS_PLAYER_CARDS, ALL_SPORTS_TEAM_CARDS),
    ...buildPlayerCityFromPositionQuestions(ALL_SPORTS_PLAYER_CARDS, ALL_SPORTS_TEAM_CARDS),
    ...buildPlayerNicknameQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerFromNicknameQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerFromPositionReverseQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerFromTeamReverseQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerFromTeamPositionReverseQuestions(ALL_SPORTS_PLAYER_CARDS),
    ...buildPlayerFromCityPositionReverseQuestions(ALL_SPORTS_PLAYER_CARDS, ALL_SPORTS_TEAM_CARDS),
    ...buildPlayerAchievementQuestions(ALL_SPORTS_PLAYER_CARDS),
  ]),
];

export const CURATED_SPORTS_AUTHORED_BOOSTERS: CuratedTriviaSourceQuestion[] = [
  ...applySportsCurveballOverrides([
    ...CURATED_SPORTS_CORE,
    ...CURATED_SPORTS_CANONICAL_EXPANSION,
    ...CURATED_SPORTS_OPENING_DEPTH,
    ...CURATED_SPORTS_CURVEBALL_BENCH,
    ...CURATED_SPORTS_DAYBREAK_CURVEBALLS,
    ...CURATED_SPORTS_DAYBREAK_EXPANSION,
    ...CURATED_SPORTS_ROTATION_DEPTH,
    ...CURATED_SPORTS_LATE_PATCHES,
  ]),
];

export const CURATED_SPORTS_BOOSTERS: CuratedTriviaSourceQuestion[] = [
  ...CURATED_SPORTS_TEMPLATE_BOOSTERS,
  ...CURATED_SPORTS_AUTHORED_BOOSTERS,
];

export const CURATED_MIX_PATCHES: CuratedTriviaSourceQuestion[] = MIX_PATCHES;
