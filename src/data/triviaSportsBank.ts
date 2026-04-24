// Curated sports trivia bank assembled from OpenTriviaQA (CC BY-SA 4.0) sports
// plus vetted sports-related questions from sibling categories.
import type { TriviaCategory, TriviaQuestion } from './triviaPuzzles';

export const SPORTS_CATEGORY_ID = 'sports';
export const SPORTS_CATEGORY_NAME = 'Sports';
export const SPORTS_CATEGORY_DESCRIPTION = 'Teams, titles, athletes, and iconic moments.';

export const SPORTS_DAILY_PACKS: TriviaQuestion[][] = [
  [
    {
      "prompt": "He was the first player in Major League Baseball to lead in double plays at three different positions - at third base, at second base and shortstop.",
      "options": [
        "Gil McDougald",
        "Ernie Banks",
        "Dale Shofner",
        "Alex Rodriguiz"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The first move by white 1 N-KB3 could result in all of the following openings except which one?",
      "options": [
        "English Opening",
        "Kings Gambit",
        "Spanish Opening",
        "Kings Indian Attack"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The Stanley Cup went to this team following the 2001-2002 season.",
      "options": [
        "Edmonton Oilers",
        "New Jersey Devils",
        "Detroit Red Wings",
        "Carolina Hurricanes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This football player was a running back for the New England Patriots in the 1980s.",
      "options": [
        "Greg Brock",
        "Jerome James",
        "Thomas James",
        "Craig James"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NHL player to score 50 goals in a season?",
      "options": [
        "Howe",
        "Esposito",
        "Richard",
        "Gretsky"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where did NASCAR start?",
      "options": [
        "Indiana Beach",
        "Daytona Beach",
        "Bristol Beach",
        "Talladega Beach"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This Florida State University center became a star NBA player after his pro coach sent him to play in NYCs Rucker Tournament. His unconventional behavior included sleeping on park benches. Who is this former cab driver?",
      "options": [
        "Swede Holbrook",
        "George Mikan",
        "Nate Thurmond",
        "Dave Cowens"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first player to play in three perfect games?",
      "options": [
        "Paul ONeil",
        "Don Zimmer",
        "Don Baylor",
        "Pedro Martinez"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Lawrence Taylor played his entire career for which team?",
      "options": [
        "Chargers",
        "Giants",
        "Raiders",
        "Packers"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In 2005, ESPN aired its last NFL Sunday Night Football game. What network took over broadcasting the Sunday night game for the 2006 NFL season ?",
      "options": [
        "NBC",
        "FOX",
        "ABC",
        "CBS"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "It is generally accepted that polo was first played in this part of the world.",
      "options": [
        "Central Peru",
        "Berkshire, England",
        "Mongolia",
        "Northeastern India"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "It was at an abandoned part of the athletic fields of this U.S. college, that the first nuclear reactor was developed by Enrico Fermi.",
      "options": [
        "New Mexico",
        "Purdue University",
        "University of Arizona",
        "University of Chicago"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Charlotte Bobcats lost their very first regular season game to what team?",
      "options": [
        "Miami Heat",
        "Atlanta Hawks",
        "Washington Wizards",
        "Detroit Pistons"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The first number retired by the Montreal Canadiens on November 2, 1932 belonged to Howie Morenz. What number did he wear?",
      "options": [
        "9",
        "4",
        "10",
        "7"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Parkour, a relatively new sport of physical strength and agility, is usually practised in what kind of surroundings?",
      "options": [
        "Fields",
        "Deserts",
        "Urban areas",
        "Mountain regions"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who got to take the Stanley Cup home to their families following the 2002-2003 season?",
      "options": [
        "Detroit Red Wings",
        "Carolina Hurricanes",
        "Colorado Avalanche",
        "New Jersey Devils"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What federation, based in Lausanne, Switzerland, governs competitive swimming?",
      "options": [
        "FINA",
        "FIFA",
        "FIBA",
        "FITA"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In the 1996 World Series, this Braves player hit a home run in his first two at-bats.",
      "options": [
        "Fred McGriff",
        "Andruw Jones",
        "David Justice",
        "Chipper Jones"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1970, the American city of Denver was selected to host the 1976 winter Olympics, but the Games were moved to Innsbruck instead. Why?",
      "options": [
        "The International Olympic Committee rescinded their decision when proof of bribery came to light.",
        "Coloradans voted not to pay the expenses associated with hosting the Olympics.",
        "Several countries threatened to boycott the games because of the U.S. involvement in Vietnam.",
        "A massive strike by construction workers made it impossible to finish all the facilities in time."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On what day was baseball commissioner Bud Selig born?",
      "options": [
        "May 22, 1935",
        "December 16, 1932",
        "June 2, 1933",
        "July 30, 1934"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Montreal Canadiens Head Coach Guy Carbonneau was once a Habs player. What year was he traded and to which team?",
      "options": [
        "1993 to the Detroit Red Wings",
        "1994 to the Chicago Black Hawks",
        "1995 to the Dallas Stars",
        "1994 to the St-Louis Blues"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This Lithuanian American baseball player, son of immigrant parents, was born and raised in upstate New York. Who is he?",
      "options": [
        "Eddie Waitkus",
        "Johnny Podres",
        "Dainius Zubrus",
        "Darius Kasparaitis"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which player, born in Venezuela, played for the New York Mets in 1962?",
      "options": [
        "Rafael Santana",
        "Kevin Elster",
        "Luis Aparicio",
        "Elio Chacon"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first college coach of a five-man basketball team?",
      "options": [
        "Adolph Rupp",
        "Joe Fulks",
        "Duke Maas",
        "Amos Alonzo Stagg"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these womens names was not engraved on the Stanley Cup in the period from 2001-2006?",
      "options": [
        "Sonia Scurfield",
        "Karen Hughes",
        "Kelly Kirwin",
        "Charlotte Grahame"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The first official ball used in volleyball was created in the beginning of the 20th century by this company.",
      "options": [
        "Spalding",
        "Wilson",
        "Molten",
        "Gala"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Guess the nickname of Henry Aaron, who played with the Braves and Brewers.",
      "options": [
        "Hit em Where They Aint Hank",
        "Bustem Hank",
        "Hammerin Hank",
        "Sluggen Hank"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When Yogi Berra was the Yankee manager, there was a famous incident on a bus that made headlines. What was involved?",
      "options": [
        "a harmonica",
        "a pea shooter",
        "a Playboy Magazine",
        "a straw hat"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Terry Bradshaw was a quarterback for which of the following teams?",
      "options": [
        "Steelers",
        "Giants",
        "Falcons",
        "Eagles"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The Mall of America, one of the largest entertainment and retail complexes in the U.S., opened in 1992 on the site of the old Met Stadium. Which suburb of Minneapolis is it located in?",
      "options": [
        "St. Louis Park",
        "Burnsville",
        "Bloomington",
        "Maple Grove"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many teams participated in the first ICC World Cup tournament?",
      "options": [
        "12",
        "6",
        "8",
        "10"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "When did Phil Rizzuto play for the Yankees?",
      "options": [
        "1937-1950",
        "1947-1962",
        "1929-1945",
        "1941-1953"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What player quarterbacked the Missouri Tigers in the 1997 Holiday Bowl?",
      "options": [
        "Chase Daniel",
        "Corby Jones",
        "Brad Perry",
        "Brad Smith"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of the tennis players was born in Novi Sad, Yugoslavia (now Vojvodina, Serbia and Montenegro)?",
      "options": [
        "Martina Navratilova",
        "Ilie Nastase",
        "Ivan Lendl",
        "Monica Seles"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many consecutive NBA championships did Kobe Bryant win with the Lakers in the early 2000s?",
      "options": [
        "4",
        "1",
        "2",
        "3"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "On May 17, 1998 the Yankees won a perfect game 4-0 over the Twins. Who was the wining pitcher?",
      "options": [
        "Al Leiter",
        "Jimmy Keys",
        "David Cone",
        "David Wells"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "There are four major types of golf clubs. Which of the following pairs (club type - common shot) is wrong?",
      "options": [
        "Woods - Long shots",
        "Irons - Precise shots",
        "Putters - Shots on the green",
        "Lob Wedges - Low shots"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Cleveland Tigers, the Muncie Flyers, the Hammond Pros, and the Dayton Triangles were some of the original teams in which league?",
      "options": [
        "NFL",
        "Major League Baseball",
        "NBA",
        "NHL"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What Major League Baseball slugger had the lowest average at-bats per home run ratio in his career for 2007? In other words, this mans at-bats have resulted in home runs more often than any other player in MLB history.",
      "options": [
        "Ken Griffey Jr.",
        "Mark McGwire",
        "Alex Rodriguiz",
        "Barry Bonds"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In this year sprinter Jesse Owens was born, the Philadelphia Athletics won the World Series, and Dr. Jekyll and Mr. Hyde came out as a silent film.",
      "options": [
        "1912",
        "1919",
        "1913",
        "1915"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1927 this Ivy League team won the NCAA Division I-A national football championship.",
      "options": [
        "Princeton",
        "Yale",
        "Harvard",
        "Army"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the NHL Stanley Cup winner for 1996-1997?",
      "options": [
        "New Jersey Devils",
        "Philadelphia Flyers",
        "Tampa Bay Lightning",
        "Detroit Red Wings"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "As is common practice in todays NHL, most of the Original Six teams have moved into a new building over the years. As of 2007, which of the Original Six teams has been playing in the same building the longest without moving?",
      "options": [
        "Montreal Canadiens - Bell Centre",
        "New York Rangers - Madison Square Gardens",
        "Toronto Maple Leafs - ACC",
        "Detroit Red Wings - Joe Louis Arena"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Ross Rebagliati, Karine Ruby, Gian Simmen, Nicola Thost, Anton Pogue, Stacia Hookman, Steve Persons, and Sabrina Sadeghi are prominent names in this sport.",
      "options": [
        "Snowboarding",
        "Figure skating",
        "Skiing",
        "Team handball"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Mens field lacrosse is played with how many players on each team?",
      "options": [
        "11",
        "8",
        "10",
        "9"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which of the following events are men and women allowed to compete together?",
      "options": [
        "Breakaway Roping",
        "Team Roping",
        "Calf Roping",
        "Steer Roping"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The first 20 games of the Tiger/ Jayhawk rivalry were played off campus in Kansas City or in St Joesph. The Tigers hosted the first game on campus in 1911. What is significant about this game?",
      "options": [
        "The game was played at Rollins field.",
        "There was a riot after the game.",
        "It was the first Homecoming game in the country.",
        "a 3 to 3 tie"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This advertising slogan of Nike triggered harsh criticism during the 1996 Olympic Games in Atlanta, because it was in contradiction with the Olympic principles.",
      "options": [
        "\u2018You don\u2019t win silver \u2013 you lose gold\u2019.",
        "\u2018Nobody is perfect. My name is nobody\u2019.",
        "\u2018Common sense. Uncommon results\u2019",
        "\u2018Exceed. Why compromise?\u2019."
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What position is former professional baseball player, Mike Schmidt famous for playing?",
      "options": [
        "Pitcher",
        "Third Base",
        "Second Base",
        "Catcher"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of these running backs did not rush for 100+ yards in a Super Bowl game?",
      "options": [
        "John Riggins",
        "Duane Thomas",
        "Larry Csonka",
        "Ottis Anderson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The football team of Long Beach State is a member of which conference?",
      "options": [
        "West Coast Conference",
        "MWC",
        "none of these",
        "WAC"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first major leaguer to play at least 500 games at 5 different positions?",
      "options": [
        "Pete Rose",
        "Bert Campaneris",
        "Nomar Garciaparra",
        "Gil McDougal"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following Australian players was NOT playing the last test of his career in the 5th-and the final-test of the 2006-07 Ashes series as Australia concluded the series 5-0?",
      "options": [
        "Justin Langer",
        "Glenn McGrath",
        "Shane Warne",
        "Mathew Hayden"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What university are you visiting when, at the end of the game, the fans begin to sing Take Me Home, Country Roads",
      "options": [
        "University of North Carolina",
        "West Virginia University",
        "Virginia Tech",
        "University of Virginia"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When he was made the Commissioner of the NHL in 1993, he was asked to bring it back to popularity in the USA. Who is this person?",
      "options": [
        "Gordie Howe",
        "Tim Leiweke",
        "Tony Donovan",
        "Gary Bettman"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is The Undertakers streak at WrestleMania (prior to WrestleMania 24)?",
      "options": [
        "16-1",
        "15-1",
        "15-0",
        "16-0"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This NBA player was the 5th player chosen in the 2003 NBA Draft.",
      "options": [
        "Lebron James",
        "Randolph Scott",
        "Carmelo Anthony",
        "Dwayne Wade"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Professional wrestler Cheif Jay Strongbow had a partner whose neck was broken by Ken Patera. What was his name?",
      "options": [
        "Jules Strongbow",
        "Jay Youngblood",
        "Wahoo Mcdaneil",
        "Billy White Wolf"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 2009, this Cleveland Browns player was involved in a car accident that left a pedestrian dead.",
      "options": [
        "Braylon Edwards",
        "Brady Quinn",
        "Donte Stallworth",
        "Joe Thomas"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1989, the Figure Skating World Championships had a new nation as a contender for possible glory. Who was the first Japanese female skater to win the World Championships?",
      "options": [
        "Shizuka Arakawa",
        "None of these",
        "Midori Ito",
        "Yuka Sato"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In what city and year did Muhammad Ali win the Olympic gold medal for the United States of America in the boxing light heavyweight division?",
      "options": [
        "Rome 1960",
        "Melbourne 1956",
        "Mexico City 1968",
        "Tokyo 1964"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When Phil Rizzuto got death threats from a Boston Red Sox fan, what did manager Casey Stengel do?",
      "options": [
        "He had him change uniform numbers with another player.",
        "He had Rizzuto play second base instead of shortstop.",
        "He sat Rizzuto so he would be safe.",
        "Nothing"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What historic jump combination was first done by Evgeni Plushenko?",
      "options": [
        "Triple Axel-half loop-triple flip",
        "All of these",
        "Quadruple toe-triple toe-triple loop",
        "Quadruple toe-triple toe-double loop"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What does the sign CGA on paintball gas tanks stand for?",
      "options": [
        "Compact Gas Assertion",
        "Compact Gas Association",
        "Compressed Gasoline Alignment",
        "Compressed Gas Association"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which team won the Brazilian Championship in 1978, beating Sao Paulo?",
      "options": [
        "Coritiba/PR",
        "Bahia/BA",
        "Guarani/SP",
        "Atletico/PR"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What institution was founded on October 30, 1998 in the city of Rosario, Santa Fe, Argentina in honor of football legend Diego Maradona?",
      "options": [
        "All of these",
        "Bureau of Maradona",
        "Church of Maradona",
        "University of Maradona"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "George Muresan and Manute Bol are the tallest players in NBA history. How tall are they?",
      "options": [
        "72 (2.18m)",
        "77 (2.31m)",
        "78 (2.33m)",
        "74 (2.23m)"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which team wins the English Premiership in the 1994-95 season?",
      "options": [
        "Arsenal",
        "Newcastle",
        "Blackburn",
        "Manchester United"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who won the first gold medal of the 2008 Olympics in Beijing?",
      "options": [
        "Samuel Sanchez (Spain, cycling)",
        "Xexia Chen (China, weightlifting)",
        "Katerina Emmons (Czech Republic, shooting)",
        "Michael Phelps (USA, swimming)"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Kadima is a paddle sport in which the object is to cooperate with another person and see how many times you can hit a ball to each other without it hitting the ground. Where was this sport developed?",
      "options": [
        "Russia",
        "Peru",
        "China",
        "Israel"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Olympian to run the 100 meters in under 10 seconds?",
      "options": [
        "Michael Johnson",
        "John Carlos",
        "Jim Hines",
        "Bob Hayes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Bob Gibson was the second pitcher to strikeout 3,000 batters. Who was the first?",
      "options": [
        "Cy Young",
        "Walter Johnson",
        "Christy Mathewson",
        "Red Ruffing"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In the 2004 Brazilian championship season, this player broke the record for most goals in a single season.",
      "options": [
        "Roberto Dinamite",
        "Edmundo",
        "Washington",
        "Pele"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these Cowboys won the Super Bowl XII MVP trophy?",
      "options": [
        "Duane Thomas",
        "Harvey Martin",
        "Michael Irvin",
        "Tony Dorsett"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This 1978 movie was about a group of American soldiers who went to fight in Vietnam. They could get out of combat if they threw a soccer match, but they refused to do so.",
      "options": [
        "The Boys in Company C",
        "Full Metal Jacket",
        "Hamburger Hill",
        "Pork Chop Hill"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which driver swept both races at Phoenix in 2006?",
      "options": [
        "Jeff Burton",
        "Kevin Harvick",
        "Jeff Gordon",
        "Matt Kenseth"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What year did Major League Baseball start giving out the Rookie of the Year Award?",
      "options": [
        "1945",
        "1951",
        "1949",
        "1947"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This is the first team to win more than one perfect game.",
      "options": [
        "Dodgers",
        "Rangers",
        "Braves",
        "Yankees"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This former Harford Whaler and Carolina Hurricane had his number retired on January 28, 2006. Who is he?",
      "options": [
        "Mario Lemieux",
        "Chris Pronger",
        "Steve Yzerman",
        "Ron Francis"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many games are in a Major League Baseball season per team?",
      "options": [
        "155",
        "170",
        "162",
        "160"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What are the colors of the Southern California Trojans football team?",
      "options": [
        "Gold and white",
        "Cardinal and white",
        "Cardinal and gold",
        "Red and blue"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NBA player to score 60 points in a game?",
      "options": [
        "Joe Marasovich",
        "Joe Fulks",
        "Frank Selvy",
        "Wilt Chamberlain"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What NCAA Mens Basketball team has won the most National Titles from 1939-2009?",
      "options": [
        "Kentucky",
        "UCLA",
        "Kansas",
        "North Carolina"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This wrestler played minor youth hockey with and against an NHL tough guy.",
      "options": [
        "Chris Jericho",
        "Edge",
        "Christian",
        "John Cena"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which colleges have been among Southern California Trojans\u2019 bitter rivals?",
      "options": [
        "UCLA and Notre Dame",
        "Alabama and Air Force",
        "Southern Methodist and Penn State",
        "BYU and Army"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the first college football team to win over 50 games at Yankee Stadium?",
      "options": [
        "Fordham University",
        "New York University",
        "Notre Dame",
        "Army"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1985, this tennis player, only 17-years-old at the time, became the first unseeded contestant to win the Mens singles title at Wimbledon.",
      "options": [
        "Boris Becker",
        "Stefan Edberg",
        "Goran Ivani\u0161evi\u0107",
        "Michael Stich"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What sport is the subject of the 1986 movie Hoosiers, ranked the 4th best sports movie by the American Film Institute?",
      "options": [
        "Basketball",
        "Football",
        "Rugby",
        "Baseball"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 2002, the Detroit Red Wings won their tenth Stanley Cup, led by which coach?",
      "options": [
        "Dawe Lewis",
        "Scotty Bowman",
        "Wayne Maxner",
        "Mike Babcock"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This player started practicing tennis at the age of 12, choosing the sport over football. He has been given the Prince of Asturias Award for Sports.",
      "options": [
        "Carlos Moya",
        "Rafael Nadal",
        "Tommy Robredo",
        "Juan Carlos Ferrero"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who won the MVP of the 1969 World Series?",
      "options": [
        "Jerry Koosman",
        "Cleon Jones",
        "Al Weis",
        "Don Clendenon"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What Hall of Fame coach was with the Tigers from 1958-1970?",
      "options": [
        "Andy Reid",
        "Dan Devine",
        "Don Faurot",
        "Don Shula"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Nicknamed The Chief, he was a great basketball center, who played for many years.",
      "options": [
        "Dennis Johnson",
        "Walt Bellamy",
        "JoJo White",
        "Robert Parrish"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This center went in the ABA directly out of high school. He later played 21 seasons in the NBA. He played on a team with high scorer Rick Barry and later with Barrys son, Jon. Who is this player?",
      "options": [
        "Darryl Dawkins",
        "Robert Parish",
        "Nate Thurmond",
        "Moses Malone"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In the 1967 NFL Championship Game Green Bay beat Dallas 21-17. Which nickname is attached to this game?",
      "options": [
        "The First Super Bowl",
        "The Ice Bowl",
        "The Long Fourth-Quarter Game",
        "The One -Quarter Game"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many wins did Patrick Roy have at the end of his 19-season career?",
      "options": [
        "550",
        "549",
        "548",
        "551"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This pro wrestler was a member of The Cherokee County School District but was disqualified from entering the primary for the 2006 term due to the fact that he did not use his legal name.",
      "options": [
        "Rick Steiner",
        "Diamond Dallas Page",
        "Bubba Ray Dudley",
        "Charlie Haas"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Manchester, UK is a hub of great soccer. Which city is the twin city to Manchester?",
      "options": [
        "West Bromwhich",
        "Leeds",
        "Salford",
        "Birmingham"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When were the Olympics held south of the equator?",
      "options": [
        "1952 and 2004",
        "1996 and 2000",
        "1956 and 2000",
        "Never"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "The winner of the Ladies singles title at Wimbledon is awarded a silver plate with beautiful motifs. What is its nickname?",
      "options": [
        "Wimbledon Dish",
        "Satellite Dish",
        "Rosewater Dish",
        "Silverstone Dish"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Detroit Red Wings were the last Original Six team to win the Stanley Cup. Prior to 2006-2007 season what season was the Red Wings last Stanley Cup winning season?",
      "options": [
        "1994-1995",
        "2000-2001",
        "2001-2002",
        "1996-1997"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Where is the Hockey Hall of Fame located?",
      "options": [
        "Goshen, New York",
        "Toronto, Canada",
        "Colorado Springs, Colorado",
        "Oklahoma City, Oklahoma"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What is the most popular sport in Bulgaria, with world-known representatives such as Dimitar Berbatov and Hristo Stoichkov?",
      "options": [
        "Volleyball",
        "Chess",
        "Football",
        "Wrestling"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This baseball player won the National League Most Valuable Player Award in 1975 and 1976 while playing with the Reds.",
      "options": [
        "Tony Perez",
        "Pete Rose",
        "Joe Morgan",
        "BIlly Williams"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What NFL football team has a lightening bolt logo?",
      "options": [
        "Atlanta Falcons",
        "San Diego Chargers",
        "New York Giants",
        "St. Louis Rams"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "During his first participation in Wimbledon, McEnroe was defeated in the semi finals by this player.",
      "options": [
        "Bjorn Borg",
        "Vitas Gerulatis",
        "Arthur Ashe",
        "Jimmy Connors"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Of the 19-game regular season series, how many games did the 2004 Red Sox win against the Yankees?",
      "options": [
        "12",
        "9",
        "11",
        "10"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the only member of the team on the show The White Shadow who recognized the Coach as a former NBA player?",
      "options": [
        "Abner Goldstein",
        "James Hayward",
        "Go-Go Gomez",
        "Mario Petrinno"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which New York Yankee pitcher was known as Louisiana Lightning?",
      "options": [
        "Ron Guidry",
        "Bob Turley",
        "Mel Stottlemyre",
        "Fritz Peterson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the first title to change hand in a ladder match at SummerSlam?",
      "options": [
        "Hardcore",
        "European",
        "WWE",
        "IC"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What number did the Babe wear for the New York Yankees?",
      "options": [
        "6",
        "3",
        "9",
        "8"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "A golfer who has done any one of these is no longer considered an amateur. There is an odd one, however, which would not change your status of an amateur.",
      "options": [
        "Played golf for money",
        "Received a trophey of significant monetary value",
        "Taught golf for money",
        "Played along with professional players"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The parade of the nations is part of the opening ceremony of the Olympic Games. Since the1928 Summer Olympics, which nation traditionally leads the parade?",
      "options": [
        "The country with the most medals from the last Olympics",
        "The host country",
        "Greece",
        "The first country in alphabetical order"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Roger Clemens has played for which teams in his baseball career?",
      "options": [
        "Houston, New York",
        "Chicago White Sox, Texas, New York Yankees, Houston",
        "Toronto, Boston, New York Yankees, Houston",
        "Philadelphia, New York Mets, Oakland"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "At which sport is TV character Jim Halpert most adept?",
      "options": [
        "Basketball",
        "Tennis",
        "Paintball",
        "Hockey"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In the movie Rocky IV, Dragos wife was said to be a double gold medalist at the Olympics in which sport?",
      "options": [
        "Athletics",
        "Diving",
        "Archery",
        "Swimming"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The 1979 movie Breaking Away, listed as the 8th best sports movie in history by the American Film Institute in 2008, focuses on this sport.",
      "options": [
        "Tennis",
        "Bicycling",
        "Rugby",
        "Baseball"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The 1962 Soccer World Cup tournament was held in this country.",
      "options": [
        "Chile",
        "Italy",
        "Mexico",
        "Switzerland"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "George Foreman returned to boxing after a 12-year break to become the oldest heavy weight champion ever. How old was he when he beat Michael Moorer?",
      "options": [
        "51",
        "42",
        "48",
        "45"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What year was the St. Louis Cardinals team established?",
      "options": [
        "1900",
        "1882",
        "1910",
        "1890"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What type of injury put the end of Marco van Bastens career in 1995?",
      "options": [
        "Knee injury",
        "Ankle injury",
        "Back injury",
        "Head injury"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This movie was begun in 1998 but released in 2001. Its big all-star cast included Warren Beatty, Diane Keaton, Charlton Heston, Gary Shandling, Andie MacDowell, Goldie Hawn and Jenna Elfman. It was designed to be a simple romantic comedy about making lifes big decisions. It is now considered to be one of the biggest movie flops.",
      "options": [
        "The Postman",
        "Town and Country",
        "Ishtar",
        "Heavens gate"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What are the official colors of the Wimbledon tournament?",
      "options": [
        "purple and green",
        "green and blue",
        "blue and yellow",
        "yellow and purple"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which team won the 1940 National Football League Championship Game with 73-0?",
      "options": [
        "Oakland Raiders",
        "Chicago Bears",
        "Washington Redskins",
        "New York Giants"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what Super Bowl did the Minnesota Vikings make their first appearance?",
      "options": [
        "Super Bowl V",
        "Super Bowl II",
        "Super Bowl IV",
        "Super Bowl VII"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which was the first US state in which karate was taught?",
      "options": [
        "Louisiana",
        "Hawaii",
        "Texas",
        "New York"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who is the first coach to win four Super Bowls?",
      "options": [
        "Chuck Noll",
        "Bill Parcells",
        "Bill Walsh",
        "Don Shula"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following Charger players did NOT break either the National Football League (NFL) rules or the law in 2006?",
      "options": [
        "Terrence Kiel",
        "Shawne Merriman",
        "Antonio Cromartie",
        "Steve Foley"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "As of 2007, when was the last time that the White Sox won the World Series of baseball?",
      "options": [
        "2004",
        "2003",
        "1917",
        "2005"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what 2012 Summer Olympics athletics competition did the gold, silver and bronze medals go to Jamaica?",
      "options": [
        "Womens 400 metres",
        "Mens 100 metres",
        "Mens 200 metres",
        "Womens 100 metres"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these teams did Alex Rodriguez start his career with?",
      "options": [
        "Mariners",
        "Rangers",
        "Yankees",
        "Angels"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Pete Rose got his debut on April 8th of what year?",
      "options": [
        "1963",
        "1966",
        "1965",
        "1964"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "North Carolina State won the 1974 National Collegiate Athletic Association basketball championship, defeating which team?",
      "options": [
        "Georgia",
        "UCLA",
        "Maryland",
        "Marquette"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What trophy is awarded to the Super Bowl-winning team?",
      "options": [
        "None of these",
        "Heisman Trophy",
        "Vince Lombardi Trophy",
        "Don Vamdo Trophy"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the coachs daughter on the long running hit sitcom Coach?",
      "options": [
        "Cassie",
        "Kelsey",
        "Kitty",
        "Kelly"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Born in 1931 in Dallas, this player was a fan favorite as well as a Hall of Famer. He wore #14 and played his whole career for one team, a team whose inability to win had nothing to do with its star shortstops ability.",
      "options": [
        "Tony Kubek",
        "Luis Aparicio",
        "Ernie Banks",
        "Johnny Logan"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What nickname was applied to the St. Louis Cardinals team of the 1934?",
      "options": [
        "Whiz Kids",
        "Flyin Birds",
        "Gashouse Gang",
        "Cardiac Kids"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which American chess player was called The Pride and Sorrow of Chess?",
      "options": [
        "Mikhail Botvinnik",
        "Emmanuel Lasker",
        "Paul Keres",
        "Paul Morphy"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Long before Kevin Harvick won both million dollar events in one season, he was know as what?",
      "options": [
        "Hardwin",
        "Trucker",
        "Happy",
        "Money"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "On April 30, 1922, Charlie Robertson pitched a perfect game for the Chicago White Sox. What team lost that day?",
      "options": [
        "Boston Red Sox",
        "Detroit Tigers",
        "Cleveland Indians",
        "New York Yankees"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Shane Battier had his number retired at Duke. What was his number?",
      "options": [
        "31",
        "1",
        "5",
        "23"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many times a Spanish cyclist has won the Tour de France until 2009?",
      "options": [
        "12",
        "10",
        "14",
        "16"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "When was the first Busch Stadium built?",
      "options": [
        "1966",
        "1970",
        "1960",
        "1956"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these distinguished American presidents home concealed a secret billiards room?",
      "options": [
        "Theodore Roosevelt",
        "Thomas Jefferson",
        "George Washington",
        "Abraham Lincoln"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "As head coach of this team, Paul Bear Bryant won six national championships and thirteen conference championships.",
      "options": [
        "Texas AM University",
        "University of Maryland football team",
        "University of Kentucky football team",
        "University of Alabama football team"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the fourth former Miami Hurricanes player to be inducted into the Pro Football Hall of Fame?",
      "options": [
        "Jim Otto",
        "Michael Irvin",
        "Jim Kelly",
        "Ted Hendricks"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Jim Barbieri was the first player to make these two accomplishments.",
      "options": [
        "Play in the Little League World Series and the Major League World Series",
        "Play in a Major League World Series and in an NBA game",
        "Win an NBA Championship and a Major League World Series",
        "Win a Rose Bowl and a World Series."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Kazuyoshi Funaki was a champion in ski-jumping. You dont have to be a ski-jumping expert to know that he represented this country.",
      "options": [
        "Japan",
        "Russia",
        "Austria",
        "South Korea"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This football player, known as the Jets all-time leading rusher, announced his retirement in July 2007.",
      "options": [
        "Jerry Rice",
        "Curtis Martin",
        "Phillip Jackson",
        "Don Maynard"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On June 28, 1907, this Yankees catcher was unable to throw out any of the 13 Washington Senators who stole second base.",
      "options": [
        "Branch Rickey",
        "John McGraw",
        "Ray Schalk",
        "Casey Stengel"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What Southern martial art did the Chinese American martial artist and actor Bruce Lee practise?",
      "options": [
        "Wing Chun",
        "Black Tiger Kung Fu",
        "Duan Quan",
        "Leopard Kung Fu"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which English batsman took six catches in the first innings of the fourth test of the 2006\u201307 cricket series, becoming only the third player in Test history to do so?",
      "options": [
        "Paul Nixon",
        "Geraint Jones",
        "Chris Read",
        "Paul Collingwood"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where were the Dodgers playing before they moved to L.A.?",
      "options": [
        "Brooklyn, NY",
        "Sacramento, CA",
        "Washington, DC",
        "Newark, NJ"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Starting in 1999, the ACC has challenged what other power conference in a friendly, early-season tournament?",
      "options": [
        "Big East",
        "Big 10",
        "SEC",
        "Pac-10"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What 1968 Olympic citys altitude was responsible for many track and field records being broken because of the rarefied air?",
      "options": [
        "Rome",
        "Helsinki",
        "Denver",
        "Mexico City"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "During which war did the Battle of Marathon take place?",
      "options": [
        "Persian",
        "Peloponnesian",
        "Punic",
        "Parthian"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The Pittsburgh Steelers are the oldest team in the American Conference. What year were they formed?",
      "options": [
        "1923",
        "1943",
        "1933",
        "1953"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the sequence of serves in a 7-point tie-break?",
      "options": [
        "Player A serves to the deuce court. Player A then serves to the Ad court. Player B then serves to the deuce court. Player B then serves to the Ad court.",
        "Player A serves to the Ad court. Player B then serves to the deuce court. Player B then serves to the Ad court. Player A then serves to the deuce court.",
        "Player A serves to the deuce court. Player B then serves to the Ad court. Player B then serves to the deuce court. Player A then serves to the Ad court.",
        "Player A serves to the deuce court. Player B then serves to the Ad court. Player A then serves to the Ad court. Player B then serves to the deuce court."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which country was represented by the highest number of athletes at the Olympic Games of 2008?",
      "options": [
        "USA",
        "China",
        "Russia",
        "India"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What running back led the LSU team in rushing in 2005?",
      "options": [
        "Joseph Addai",
        "Alley Broussard III",
        "Shyrone Carey",
        "Craig Davis"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which great Yankee was not elected to the Hall of Fame during his first year of eligibility?",
      "options": [
        "Joe Dimaggio",
        "Mickey Mantle",
        "Lou Gehrig",
        "Babe Ruth"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Erica Roe is famous for her streak at Twickenham Stadium in 1982. But who were England playing against?",
      "options": [
        "Ireland",
        "Australia",
        "Wales",
        "France"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the movie The Scorpion King, actress Kelly Hu co-starred with which former WWF wrestling champion?",
      "options": [
        "Hulk Hogan",
        "The Rock",
        "Brett Hart",
        "Sean Micheals"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When was Brett Favre born?",
      "options": [
        "November 11, 1969",
        "September 12, 1970",
        "December 11, 1970",
        "October 10, 1969"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The true origin of racquetball is questionable, but which decade did the shortened racquet appear?",
      "options": [
        "1950s",
        "1900s",
        "1930s",
        "1970s"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 1952 Pete and Jerry Cusimano did this at a hockey game.",
      "options": [
        "They threw an octopus on the ice at an NHL game.",
        "They were the first to place plexiglass to separate the fans from the players and ice rink.",
        "They were the first to throw their hats onto the ice when a player scored three goals in one game.",
        "They were the first fans to jump onto the ice to protest a penalty on their team."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Margo Dydek broke the record for the tallest player to ever play in the WNBA. How tall is she?",
      "options": [
        "72 (2.18 m)",
        "67 (2.00 m)",
        "74 (2.23 m)",
        "69 (2.05 m)"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This former player from the University of Southern California Trojans was voted to the NFL All Pro Team as both offensive and defensive back. Who is this famous number 16?",
      "options": [
        "Willie Wood",
        "Ed OBrien",
        "Frank Gifford",
        "Sammy Baugh"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The biggest race of 2006, the Daytona 500, was won by what racer?",
      "options": [
        "Jeff Burton",
        "Jeff Gordon",
        "Tony Stewart",
        "Jimmie Johnson"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Ultimate Warrior and Rick Rude competed for the Intercontinental Title in which SummerSlam?",
      "options": [
        "1990",
        "1988",
        "1991",
        "1989"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which famous soccer player was born under the name Luis Nazario de Lima in a suburb of Rio de Janeiro?",
      "options": [
        "Ronaldo",
        "Kaka",
        "Rivaldo",
        "Ronaldhino"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Football player Diego Maradona was born on October 30, 1960 in this country.",
      "options": [
        "Argentina",
        "Portugal",
        "Colombia",
        "Brazil"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This nation played a style of soccer termed total football and reached consecutive world cups in the 1970s.",
      "options": [
        "Argentina",
        "Brazil",
        "Holland",
        "Germany"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "From 1962-1968, this baseball team was known by the nickname, The Lovable Losers, but in 1969 a miracle happened and they won the World Series.",
      "options": [
        "The Reds",
        "The Mets",
        "The Pirates",
        "The Giants"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "William G. Morgan, Flo Hyman, Dimitar Zlatanov, Bernie Holtzman, and Karch Kiraly are in a Hall of Fame in this city.",
      "options": [
        "Moscow",
        "Charleston, South Carolina",
        "Mexico City",
        "Mt. Holyoke, Massachusetts"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The first Ladies Figure Skating World Champion was crowned in this year.",
      "options": [
        "1896",
        "1912",
        "1904",
        "1906"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was drafted by the Houston Rockets in the first overall selection of the 1984 NBA draft?",
      "options": [
        "Charles Barkley",
        "John Stockton",
        "Michael Jordan",
        "Hakeem Olajuwon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How old was Jack Quinn when he hit a home run on June 27, 1932?",
      "options": [
        "49 years 357 days",
        "47 years 322 days",
        "42 years 12 days",
        "48 years 214 days"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This point guard played for Philadelphia in the NBA after his college career at West Texas State. Over his 15 seasons, he averaged close to 7 assists per game, a great accomplishment for such a long career. After he retired as a player, he became Philadelphias head coach. Who is he?",
      "options": [
        "George Karl",
        "Mike Donleavy",
        "Avery Johnson",
        "Maurice Cheeks"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following statements is true about the Asian martial art Lethwei?",
      "options": [
        "It is unarmed Burmese martial art.",
        "It was created by the Chinese community of SE Asia.",
        "It was developed in Hue, Vietnam.",
        "It is a Filipino foot fight."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the nationality of Adam Ma\u0142ysz, one of the greatest stars of ski jumping?",
      "options": [
        "Finnish",
        "Polish",
        "Norwegian",
        "German"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Danny Biasone is often credited with financially saving this professional sport.",
      "options": [
        "Basketball",
        "Hockey",
        "Football",
        "Soccer"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the last shortstop to start for the Baltimore Orioles before Cal Ripken stepped in and played 2,632 consecutive games?",
      "options": [
        "Floyd Rayford",
        "Boots Day",
        "Razor Shines",
        "Jose Uribe"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which football coach said: You carry on no matter what the obstacles are. You simply refuse to give up - and, when the going gets tough, you get tougher and you win.?",
      "options": [
        "Frosty Westering",
        "Vince Lombardi",
        "John Wooden",
        "Bill Walton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What was the first college to win both the NCAA championship and the National Invitation Tournament in the same year?",
      "options": [
        "San Francisco University",
        "San Francisco City College",
        "City College of New York",
        "University of Kentucky"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "NBA superstar Dominique Wilkins played nearly his entire career for Atlanta. What other NBA teams did he also play for?",
      "options": [
        "Orlando, San Antonio, LA Clippers and Boston",
        "LA Lakers, Orlando, New Jersey and New Orleans",
        "Vancouver, Seattle, Boston, Orlando and Houston",
        "Orlando, Boston, New York, Chicago and Miami"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "One of the most important symbols of the Olympic Games is the flag with five interlocking rings representing the unity of the continents. The rings appear in five colours, on white background. Why were the colours red, blue, green, yellow, and black chosen for the rings?",
      "options": [
        "None of these",
        "Because each of these colours is a symbol of one of the continents",
        "Because these are the colours of Nature",
        "Because each country at that time had one of these colours in its national flag"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This pitcher ended Pete Roses 44 game hit streak in 1978 with a strikeout.",
      "options": [
        "Pat Jarvis",
        "Gene Garber",
        "John Smoltz",
        "Bruce Sutter"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Tiger Woods was undoubtedly a child prodigy. At what age did he start playing golf?",
      "options": [
        "Five",
        "Four",
        "Seven",
        "Two"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "At what PPV was the first ever Punjabi Prison Match?",
      "options": [
        "SummerSlam",
        "New Years Revolution",
        "Unforgiven",
        "No Mercy"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In this year the Dow Jones Industrial Average reached its lowest level of the Great Depression, bottoming out at 41.22, Tarzan the Ape Man opened,and the Winter Olympics were held in Lake Placid, New York.",
      "options": [
        "1931",
        "1936",
        "1932",
        "1937"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who is regarded as the first professional (American style) football player?",
      "options": [
        "William Heffelfinger",
        "Red Grange",
        "Jim Thorpe",
        "Jay Berwanger"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the Stanley Cup champion following the 2003-2004 NHL season?",
      "options": [
        "Detroit Red Wings",
        "Calgary Flames",
        "Carolina Hurricanes",
        "Tampa Bay Lightning"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Len Barker pitch a perfect game for the Cleveland Indians, in a 3-0 win against the Toronto Blue Jays?",
      "options": [
        "1975",
        "1985",
        "1981",
        "1971"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who said Driving a race car is like dancing with a chain saw.?",
      "options": [
        "Cale Yarborough",
        "Jeff Gordon",
        "Brian Vickers",
        "Richard Petty"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This person, president of the International Olympic Committee from 1980 to 2001, was criticised for widespread corruption in IOC members during his term, as well as for his ties with the former fascist government in his country.",
      "options": [
        "Thomas Bach",
        "Franco Carraro",
        "Joao Havelange",
        "Juan Antonio Samaranch"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This is a throwback nickname to Denny Hamlin, the driver of the #11 FedEx Toyota.",
      "options": [
        "Hurricane",
        "Dynamite",
        "Cyclone",
        "Young Buck"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Hurling is an exciting game of Gaelic origin. What is a hurley?",
      "options": [
        "The ball that is hit by the stick",
        "The net used in the game",
        "The uniform worn by players",
        "The stick used to hit the ball"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Largest in terms of attendance SummerSlam took Place in what year?",
      "options": [
        "2002",
        "2001",
        "1992",
        "1994"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which promotion did the Honky Tonk Man begin his career?",
      "options": [
        "NWA (Charlotte region)",
        "World Wide Wrestling Federation",
        "Mid South (Memphis region)",
        "Georgia Championship Wrestling"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Joe Tinker (shortstop), John Evers (second baseman), and Frank Chance (first baseman) were the two from the famous double play combination for the Cubs. Who was the third baseman?",
      "options": [
        "Rogers Hornsby",
        "Harry Steinfeldt",
        "Ron Santo",
        "Hack Wilson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Name the right fielder for the 1983 Phillies who wore #9.",
      "options": [
        "Von Hayes",
        "Jeff Stone",
        "Sixto Lezcano",
        "Bob Dernier"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In 1975 I defeated then popular player, Jimmy Conners, and went on to win the Wimbledon singles title. I retired in 1980 due to health problems with 818 wins and 51 titles. Who am I?",
      "options": [
        "Althea Gibson",
        "Donald Young",
        "James Blake",
        "Arthur Ashe"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The now-commonplace triple Axel-triple toe loop combination was first done by which Olympic champion?",
      "options": [
        "Viktor Petrenko",
        "Robin Cousins",
        "Dick Button",
        "Alexei Yagudin"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the previous name of the Chicago Cubs?",
      "options": [
        "Chicago Colts",
        "Chicago Bears",
        "Chicago Dolphins",
        "Chicago Red Stockings"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following Sun Belt Conference basketball schools competes in football at the 1-AA level and is therefore not a member of the 1-A Sun Belt for football?",
      "options": [
        "University of New Orleans",
        "University of Arkansas at Little Rock",
        "University of Denver",
        "Western Kentucky University"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the length of a cricket pitch?",
      "options": [
        "25 metres",
        "22 yards",
        "100 feet",
        "1/2 furlong"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Jeff Bagwell was drafted by the Red Sox but started his career with which team?",
      "options": [
        "Mets",
        "Phillies",
        "Orioles",
        "Astros"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What is the real name of professional wrestler Jeff Hardy?",
      "options": [
        "Eddie Fatu",
        "Jayson Paul",
        "Sean Morley",
        "Jeff Hardy"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Having played only one season in the majors with the 1959 Phillies, this player, popularly known as Sparky, later made his mark as a manager.",
      "options": [
        "Earl Weaver",
        "George Anderson",
        "John McGraw",
        "Walter Alston"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is Penn State Nittany Lions football teams annual scrimmage game called?",
      "options": [
        "Blue and White Game",
        "Useless Pre-Season Game that is Fun to Go to",
        "Scrimmage At the Beaver",
        "Lions vs. Lions Game"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the worst defeat by points that the Missouri Tigers had during the 20th century?",
      "options": [
        "49-3",
        "77-0",
        "69-0",
        "56-0"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Detroit Tigers won the World Series in which of the following years?",
      "options": [
        "1971",
        "1972",
        "1984",
        "1983"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Mike Marshall and John Slatberger invented this sport in 1972.",
      "options": [
        "Orienteering",
        "Footbag",
        "Seven-man baseball",
        "Frisbee"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Bob Gibson was a great pitcher for the St. Louis Cardinals. What was his real first name?",
      "options": [
        "Earl",
        "Bob",
        "Pack",
        "Omaha"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What gymnastics team won the all around gold medal at the 2008 Olympics?",
      "options": [
        "USA",
        "China",
        "Russia",
        "Japan"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Australian Sydney Cavill is credited as the originator of this swimming stroke, which was first swum in competition in 1933 and is the newest of the four major strokes.",
      "options": [
        "breaststroke",
        "butterfly",
        "free style",
        "backstroke"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is not a Scottish soccer team?",
      "options": [
        "Celtic FC",
        "Dundee United",
        "Aberdeen",
        "Donegal Celtic FC"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Where was the St. Louis Cardinal pitcher Chris Carpenter born?",
      "options": [
        "Chicago, Illinois",
        "Saint Louis, Missouri",
        "Omaha, Nebraska",
        "Exeter, New Hampshire"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what year were numbers first put on baseball uniforms?",
      "options": [
        "1929",
        "1935",
        "1921",
        "1923"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Tommie Smith won the 200-meter dash in the 1968 Olympics. In that same year, John Carlos came in third in that event. Why were Carlos and Smith banned from the Olympic Games?",
      "options": [
        "They made a political gesture on the medal stage.",
        "They refused to take a blood test.",
        "They tested positive for steroids.",
        "They refused to accept the medals."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This Jamaican athlete is a multiple Olympic medallist and the second woman in history to win two consecutive 200 m events at the Olympics.",
      "options": [
        "Delloreen Ennis-London",
        "Shelly-Ann Fraser",
        "Veronica Campbell-Brown",
        "Brigitte Foster-Hylton"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Montgomery Biscuits team from Alabama, United States, compete in this sport.",
      "options": [
        "Basketball",
        "Ice hockey",
        "Soccer",
        "Baseball"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Legend of Bagger Vance (2000) is a popular Hollywood production, depicting the story of a fictional golf player who had lost his swing and found it again. Who played his role?",
      "options": [
        "Brad Pitt",
        "Dustin Hoffman",
        "Matt Damon",
        "Will Smith"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This American shoe company, that offered a job to basketball player Chuck Taylor, was opened in Malden, Massachusetts in 1908.",
      "options": [
        "Converse",
        "Nike",
        "Airbound",
        "Rebound"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This defense to the first move P-K4 involves the move P-K3. It is a very difficult opening to play and was a favorite of Victor Korchnoi.",
      "options": [
        "The Korchnoi Defense",
        "The Two-Knights Defense",
        "The French Defense",
        "The Falkbeer Counter-gambit"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the 2006-2007 Bowl Championship Series team winner?",
      "options": [
        "Florida Gators",
        "USC Trojans",
        "Ohio Buckeyes",
        "Notre Dame Fighting Irish"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In 1963 a sports contest was held in Hermosa, California. Why was it significant?",
      "options": [
        "It was the first time the NFL played the AFL on television.",
        "It was the first baseball game between the Peoples Republic of China and the USA.",
        "It was the first skateboarding championship.",
        "It was the last time Miami of Ohio played Miami of Florida on TV."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which country won the inaugural ICC World Cup of 1975 (aka Prudential Cup 1975)?",
      "options": [
        "England",
        "West Indies",
        "Australia",
        "India"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How many ropes is a calf roper allowed to use in the rodeo event calf roping?",
      "options": [
        "There is no restriction.",
        "Two",
        "One",
        "Three"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What incredible event took place the same month Bob Backlund defeated Bret Hart to win the WWE Title in 1994?",
      "options": [
        "Hogan won his first WCW title.",
        "George Foreman became heavyweight boxing champion.",
        "Backlund had just recovered from hip surgery.",
        "Rick Flair won his 9th world title."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which US President invented the baseball seventh inning stretch?",
      "options": [
        "Harding",
        "Wilson",
        "Hoover",
        "Taft"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What is the name of the oldest field sport in North America, which is practiced by the Choctaw Native American people?",
      "options": [
        "All of these",
        "Chunkey",
        "Choctaw football",
        "Choctaw stickball"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many total wins did Jack Billingham have as a Reds pitcher?",
      "options": [
        "88",
        "97",
        "75",
        "110"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which city did Jim Catfish Hunter start his major league career?",
      "options": [
        "Kansas City",
        "Cincinnati",
        "Baltimore",
        "San Diego"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The Steelers lost their bid for a fifth Championship in Super Bowl XXX to this team in January 1996.",
      "options": [
        "Philadelphia Eagles",
        "Dallas Cowboys",
        "San Diego Chargers",
        "San Francisco 49ers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What team won the first college bowl game?",
      "options": [
        "Bucknell",
        "Tulane",
        "Penn State",
        "Michigan"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In 1987, North Carolina State University defeated what team in the longest basketball game of the year, played in the Atlantic Coast Conference tournament?",
      "options": [
        "Virginia",
        "Wake Forest",
        "Duke",
        "Maryland"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who did the Steelers face in the Super Bowl in the 2005-2006 season?",
      "options": [
        "Colts",
        "Seahawks",
        "Browns",
        "Eagles"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Ryan Newman get his first NASCAR Busch Series victory?",
      "options": [
        "2002",
        "2000",
        "1999",
        "2001"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What team did Oklahoma beat in the 2000 Orange Bowl to win the national title?",
      "options": [
        "Florida Sate",
        "ISU",
        "Nebraska",
        "Miami"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the nickname of Walter Johnson, one of the top pitchers of his era?",
      "options": [
        "Big Train",
        "Wonderful Walter",
        "Shut em Down Time",
        "Wicked Walter"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Although he was born in Pittsburgh, he grew up in Brookline Pennsylvania. His parents were both Lithuanian immigrants. Who is this famous athlete?",
      "options": [
        "Johnny Unitas",
        "Vitas Gerulaitis",
        "Jack Sharkey",
        "Dick Butkus"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This sport, one of the fastest in the world, is the official national winter sport of Canada.",
      "options": [
        "Biathlon",
        "Bobsleigh",
        "Curling",
        "Ice hockey"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Monaco Grand Prix is the crown jewel of Formula One. In what year was the inaugural race run?",
      "options": [
        "1939",
        "1929",
        "1919",
        "1922"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "USA boycotted the 1980 Summer Olympics held in what city?",
      "options": [
        "Tehran",
        "Prague",
        "Beijing",
        "Moscow"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which previous Olympic city hosted the equestrian events of 1956, five months before the rest of the games took place in Melbourne?",
      "options": [
        "Helsinki",
        "Amsterdam",
        "St. Louis",
        "Stockholm"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which University of Alabama coach said, I make my practices real hard because if a player is a quitter, I want him to quit in practice, not in a game.?",
      "options": [
        "Mike Shula",
        "Gene Stallings",
        "Ray Perkins",
        "Bear Bryant"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Malcolm Glazer purchased these two teams in 1995 and 2005 respectively.",
      "options": [
        "Tampa Bay Buccaneers and Tampa Bay (Devil) Rays",
        "Tampa Bay Buccaneers and Manchester United",
        "Tampa Bay (Devil) Rays and New Orleans Saints",
        "New Orleans Saints and Charlote Hornets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1986, Sir Alex Ferguson became manager of this English Premier League soccer club, nicknamed The Red Devils.",
      "options": [
        "Manchester United",
        "Aston Villa",
        "Chelsea",
        "Blackburn Rovers"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This player, known as The Lip, began his career with the Yankees in 1925 and finished it with the St. Louis Browns in 1945. He is a three time All-Star, elected to the Hall of Fame in 1994.",
      "options": [
        "Norm Siebern",
        "Bill Durham",
        "Leo Durocher",
        "Frank Crosetti"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these variations of the game of billiards uses the biggest playing tables?",
      "options": [
        "Snooker",
        "Rotation",
        "Straight Pool",
        "Carom Billiards"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the first team to put players names on their uniforms?",
      "options": [
        "White Sox",
        "Dodgers",
        "Indians",
        "Yankees"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This team won the NBA Championship in 1999.",
      "options": [
        "New York Knicks",
        "Los Angels Lakers",
        "Chicago Bulls",
        "San Antonio Spurs"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Gerald Ford played football for the team of what university?",
      "options": [
        "Michigan",
        "Yale",
        "Nebraska",
        "Notre Dame"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What city did the Kansas City As move to?",
      "options": [
        "Oakland",
        "Chicago",
        "St. Louis",
        "Philadelphia"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In what year did AC Milan win their first UEFA champions league final?",
      "options": [
        "1980",
        "1945",
        "1963",
        "1970"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What part of the body are volleyball players permitted to contact the ball with?",
      "options": [
        "all parts of the body",
        "hands and arms only",
        "hands and head",
        "hands and legs"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these set an NFL record for the most consecutive games with a touchdown pass (1956-1960)?",
      "options": [
        "Y A Tittle",
        "Johnny Unitas",
        "Steve DeBerg",
        "Dan Morino"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "He was the first Major League Baseball manager to win a World Series in both the National and American Leagues.",
      "options": [
        "John McGraw",
        "Jim Leyland",
        "Joe Torre",
        "Sparky Anderson"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What Major League organization released Tim Wakefield, allowing him to sign as a free agent with the Red Sox?",
      "options": [
        "Philadelphia Phillies",
        "Milwaukee Brewers",
        "San Diego Padres",
        "Pittsburgh Pirates"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the nickname of Arkansas Techs mens athletic teams?",
      "options": [
        "Gators",
        "Wonder Boys",
        "Boll Weevils",
        "Golden Suns"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Silvio Berlusconi co-wrote the anthem of what Italian soccer club?",
      "options": [
        "Roma",
        "Juventus",
        "None of these",
        "AC Milan"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The second perfect game in the 20th century took place on October 2, 1908 and was pitched by Addie Joss for what team?",
      "options": [
        "Cleveland Browns",
        "Cleveland Lakers",
        "Cleveland Braves",
        "Cleveland Naps"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Frank Robinson won the Rookie of the Year Award while playing with which team?",
      "options": [
        "CIncinnati Reds",
        "Baltimore Orioles",
        "Cleveland Indians",
        "Houson Colt 45s"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Susan Oliver, an American actress and television director of the 50s and 60s, was keen on what unusual sport?",
      "options": [
        "Skydiving",
        "Sumo",
        "Motocross",
        "Air racing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This defensive back played for Detroit from 1952-1953 and 1956-1964. Not only was he a starting defensive back but he was also the teams punter.",
      "options": [
        "Ray Guy",
        "Yale Larry",
        "Dick Lane",
        "Dick Lebeau"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What sportswriter specializing in golf remarked: The bell that tolls for all in boxing is the cash register.?",
      "options": [
        "Bob Verdi",
        "Bob Arum",
        "Susan Waldman",
        "Don King"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This former U.S. Senator and presidential candidate was inducted into the Basketball Hall of Fame in 1982.",
      "options": [
        "Bill Bradley",
        "Marv Levy",
        "Tom McMillan",
        "Byron (Whizzer) White"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the legendary Jayne Torvil and Christopher Dean win their first World Championship Gold?",
      "options": [
        "1981",
        "1982",
        "They never won a World Championship.",
        "1984"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the first Iditarod Trail Sled Dog Race take place?",
      "options": [
        "1973",
        "1970",
        "1972",
        "1967"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who is the former head coach of the Minnesota Vikings, succeeded by Brad Childress?",
      "options": [
        "John Gruden",
        "Norv Turner",
        "Marty Schottenheimer",
        "Mike Tice"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "When was the last time teams played to a tie in a Series game?",
      "options": [
        "Never",
        "1908",
        "1994",
        "1912"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This player, called Cap or Captain, was the 1971 NBA Finals MVP.",
      "options": [
        "John Havlicek",
        "Rick Barry",
        "Wilt Chamberlain",
        "Kareem Abdul-Jabbar"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Karate had a major influence on what other country also known for its martial art?",
      "options": [
        "India",
        "Korea",
        "Russia",
        "Thailand"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This tennis great was born in 1981 in Basil.",
      "options": [
        "Vlade Hahn",
        "Paul Accola",
        "Roger Federer",
        "Martina Hingis"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Kbach Kun Boran and Kbach Kun Dambong Veng are associated with which country?",
      "options": [
        "Cambodia",
        "Vietnam",
        "Thailand",
        "Myanmar (Burma)"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the book co-written by Dale Earnhardt, Jr. documenting his rookie season?",
      "options": [
        "My Rookie Season",
        "Life In the Fast Lane",
        "Driver #8",
        "My Life as a NASCAR Driver"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In the third Ashes test, Adam Gilchrist\u2019s century in the second innings became the second fastest century in any test match and the fastest in any Ashes test. How many balls did his century score off?",
      "options": [
        "77",
        "67",
        "57",
        "47"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "A golf ball embeds into the side of the hole. How should the player who hit it proceed?",
      "options": [
        "Place the ball on the nearest edge of the hole and play from there",
        "Replay the shot for no penalty",
        "Play the ball as it lies",
        "Consider the ball holed"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "During which season did Arsenal become Englands Champion for the first time?",
      "options": [
        "1970-71",
        "1930-31",
        "1942-43",
        "1932-33"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How was the FIFA World Cup Won in 2006?",
      "options": [
        "penalty kick shootout",
        "One team won in overtime.",
        "None of these",
        "The winner was decided by the end of the regular time."
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the color of A.C. Milans home jersey?",
      "options": [
        "red and black stripes",
        "all white",
        "green and yellow",
        "all black"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who scored a hat-trick when United trashed Southampton 6-1 i the 2001 premiership?",
      "options": [
        "Ruud Van Nistelrooy",
        "Ryan Giggs",
        "Paul Scholes",
        "Andy Cole"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many home runs did the Babe hit while playing major league baseball?",
      "options": [
        "716",
        "714",
        "713",
        "715"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In September 2007 two Mens European Championship finals were held during the same weekend. The final game in volleyball was played in Moscow and the top two basketball teams competed in Madrid. Both finals were between Russia and Spain. Who were the winners?",
      "options": [
        "Russia in Moscow, Spain in Madrid",
        "Russia in both finals",
        "Spain in both finals",
        "Spain in Moscow, Russia in Madrid"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What championship-winning tag team was the Honky Tonk Man a part of?",
      "options": [
        "The Swingers",
        "The Blond Bombers",
        "The Heartbreakers",
        "Rhythm and Blues"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the 1958 NFL Championship Game, the Colts played against the Giants. Which statement is untrue about the game?",
      "options": [
        "The Giants quarterback, Y.A.Tittle, threw a TD pass to Frank Gifford for the Giants first score.",
        "The game was the first NFL Championship to go into sudden-death overtime.",
        "The game was won by the Baltimore Colts on a 2 yard run by Alan Ameche.",
        "Mel Triplett scored a 1 yard TD run."
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The Thrilla in Manila, a boxing match between Muhammad Ali and Joe Frazier, was held in which city?",
      "options": [
        "Quezon City",
        "Pasig City",
        "Cebu City",
        "Davao City"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This baseball player, signed by the New York Yankees as an amateur free agent in 1976, played for the New York Mets during 1984-1987.",
      "options": [
        "Al Pedrique",
        "Rafael Santana",
        "Larry Bowa",
        "Kevin Elster"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Major Leaguer to get more than 160 walks in a season?",
      "options": [
        "Mark McGwire",
        "Hank Aaron",
        "Barry Bonds",
        "Ted Williams"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was the first college to win the NCAA championship in basketball?",
      "options": [
        "Ohio State",
        "Kansas",
        "Kentucky",
        "Oregon"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What team was formed by Abe Saperstein?",
      "options": [
        "Washington generals",
        "Boston Celtics",
        "Harlem Globetrotters",
        "New York Liberty"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This sport, whereby the player navigates the playing field on horseback, is the national game of Argentina.",
      "options": [
        "Parkour",
        "Kosho",
        "Hapkido",
        "Pato"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Though not necessary, there are several pieces of apparatus that can be used in a Pilates work out. Which of these is not used in Pilates?",
      "options": [
        "Balance Beam",
        "Large exercise balls",
        "Resistance Bands",
        "Floor mat"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What phrase did Rod Smart write on the back of his jersey when he played in the XFL?",
      "options": [
        "I Am So-Smart",
        "The Hefty Lefty",
        "So Very Smart",
        "He Hate Me"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The 1992 NBA Championship was won by this team.",
      "options": [
        "New York Knicks",
        "Portland Trail Blazers",
        "Chicago Bulls",
        "Los Angeles Lakers"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "He was the first player to win the Major League Triple Crown. He led both leagues in all three categories.",
      "options": [
        "Lou Gehrig",
        "Yogi Berra",
        "Rogers Hornsby",
        "Ty Cobb"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who is the first player to top 20,000 points in NBA?",
      "options": [
        "Spud Webb",
        "Clyde Drexler",
        "Wilt Chamberlain",
        "Bob Pettit"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where was the first Brickyard 400 held?",
      "options": [
        "Bristol, Tennessee",
        "Jackson, Mississippi",
        "Charlotte, North Carolina",
        "Indianapolis, Indiana"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "A segment of the London 2012 Opening Ceremony paid tribute to the victims of this terrorist attack.",
      "options": [
        "the 18 July 2012 terrorist attack on Israeli tourists in Bourgas, Bulgaria",
        "the 1972 Munich Massacre",
        "All of these",
        "the 2005 London Bombings"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these coaches was the first one to win two national titles as head coach of The Miami Hurricanes?",
      "options": [
        "Jimmy Johnson",
        "Dennis Erickson",
        "Larry Coker",
        "Howard Schellenberger"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who played James Bond in the BBC short film, Happy and Glorious, which stars Queen Elizabeth II as herself?",
      "options": [
        "Daniel Craig",
        "Timothy Dalton",
        "None of these",
        "Pierce Brosnan"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the NBA Finals MVP in 1979?",
      "options": [
        "Bill Walton",
        "Dennis Johnson",
        "JoJo White",
        "Wes Unseld"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "When did Miami Heat enter the NBA?",
      "options": [
        "1988",
        "1963",
        "1958",
        "1974"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The face (good guy) team in the main event of the 1988 Survivor Series consisted of Hulk Hogan, Randy Savage, Hillbilly Jim, Hercules, and what other wrestler?",
      "options": [
        "Brutus Beefcake",
        "Jake The Snake Roberts",
        "Koko B. Ware",
        "Tito Santana"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Golf is \u201ca game in which you shout Fore! shoot six, and write down five\u201d according to which popular ABC radio personality?",
      "options": [
        "Paul Harvey",
        "John Dailey",
        "Vic Raschi",
        "H. L. Mencken"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 1991 inhabitants of this Balkan city celebrated after their football club, Crvena Zvezda, won the European Cup.",
      "options": [
        "Berno",
        "Bucharest",
        "Belgrade",
        "Budapest"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Karl Malone received the award Most Valuable Player in 1996-97. What team did he play for?",
      "options": [
        "Sacramento Kings",
        "Utah Jazz",
        "Miami Heat",
        "LA Lakers"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what NBA season was Kobe Bryant awarded the regular seasons MVP Award?",
      "options": [
        "2007-08",
        "1998-1999",
        "2005-06",
        "2000-01"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the nickname of pitcher Mordecai Brown?",
      "options": [
        "Three Finger",
        "Five Finger",
        "One Finger",
        "Two Finger"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What is the home field of the Southern California Trojans football team?",
      "options": [
        "Los Angeles Memorial Coliseum",
        "Astro Dome",
        "Westwood Field",
        "Tustin Memorial Stadium"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which championship game was called The Greatest Game Ever Played and was the first championship game to go into overtime?",
      "options": [
        "The 1990 Championship Game",
        "The 1958 Championship Game",
        "The 1983 Championship Game",
        "The 1974 Championship Game"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Margret Abbott was the first female American to win an Olympic event. What was her event?",
      "options": [
        "100 meters",
        "diving",
        "Golf",
        "Tennis"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where did Michael Phelps attend college?",
      "options": [
        "Georgetown University",
        "Ohio State",
        "Iowa State",
        "University of Michigan in Ann Arbor"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In what year was the World Series first broadcast on radio?",
      "options": [
        "1922",
        "1932",
        "1942",
        "1912"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What was the maximum capacity of Yankee Stadium when it was first built?",
      "options": [
        "91,200",
        "58,000",
        "63,800",
        "71,900"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the New England Patriots first round pick in 2006?",
      "options": [
        "Richard Seymour",
        "Laurence Maroney",
        "Tom Brady",
        "Sammy Morris"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1978 the Missouri Tigers travelled to Nebraska and won 35-31. What year was the next Tiger victory over Nebraska ?",
      "options": [
        "1988",
        "1983",
        "1992",
        "2003"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What country won the 2010 FIFA World Cup, held in South Africa?",
      "options": [
        "Spain",
        "Argentina",
        "Brazil",
        "The Netherlands"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which NBA star made this statement: Sometimes a players greatest challenge is coming to grips with his/her role on the team.?",
      "options": [
        "Dennis Rodman",
        "Larry Bird",
        "Michael Jordan",
        "Scottie Pippen"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which sportsmans nickname was The Bayonne Bleeder?",
      "options": [
        "Chuck Wepner",
        "Ray Mancini",
        "Gerry Cooney",
        "Archie Moore"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "As a freshman, Herschel Walker headed toward stardom when he ran completely over a linebacker from the University of Tennessee to score a touchdown. This linebacker picked himself up from the turf and went on to be a star defensive player with the Dallas Cowboys. Who is this defensive player?",
      "options": [
        "Bill Bates",
        "Brian Bosworth",
        "Cornelius Bennett",
        "Charlie Waters"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What world famous trail is located near Moab, Utah?",
      "options": [
        "White Rim Trail",
        "Poison Spider Mesa",
        "Slickrock Bike Trail",
        "Klondike Bluffs"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the 2012 Summer Olympics, this athlete won four gold and two silver medals, making him the most decorated Olympic athlete for the third Olympics in a row.",
      "options": [
        "Missy Franklin",
        "Usain Bolt",
        "Mo Farah",
        "Michael Phelps"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "He is the NBAs All-Time scorer.",
      "options": [
        "Clyde Lovelette",
        "Michael Jordan",
        "Kareem Abdul-Jabbar",
        "Ken Johnson"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What NBA coach stated that, You can only receive what you are willing to give?",
      "options": [
        "Pat Riley",
        "Phil Jackson",
        "Larry Brown",
        "Avery Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What team did Kobe Bryant get drafted by in 1996?",
      "options": [
        "Suns",
        "LA Lakers",
        "Hornets",
        "Nets"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Frank Robinson had a long and successful playing career. Which team did Frank debut with on April 17, 1956?",
      "options": [
        "Cardinals",
        "Cubs",
        "Reds",
        "Orioles"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He won the Triple Crown in 2006 and was traded after the next season.",
      "options": [
        "John Clarkson",
        "Johan Santana",
        "Roger Clemens",
        "Jake Peavy"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "in Game 6 of the 1986 World Series, which hitter was on deck when Mookie Wilson hit that infamous groundball?",
      "options": [
        "Kevin Elster",
        "Darryl Strawberry",
        "Howard Johnson",
        "Lee Mazzili"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NBA player to record a quadruple double in a game (double digits in 4 stat categories)?",
      "options": [
        "Nate Thurmond",
        "Alvin Robertson",
        "David Robinson",
        "Hakeem Olajuwon"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "National teams of which country are known in most sports as squadra azzura (blue team)?",
      "options": [
        "Greece",
        "France",
        "Italy",
        "Spain"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The 1972 Dolphins led the NFL in both points scored and points allowed. How many points did they score and allow, respectively?",
      "options": [
        "390-75",
        "347-167",
        "422-162",
        "385-171"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The nickname Dream Team is most often associated with which team?",
      "options": [
        "Brazil, volleyball",
        "Germany, football",
        "USA, basketball",
        "India, cricket"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During World War II, the Steelers merged with these two other teams because of a shortage of war time players.",
      "options": [
        "Cardinals and Giants",
        "Cardinals and Eagles",
        "Giants and Eagles",
        "Browns and Cardinals"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What position is former Major League Baseball player, Joe Morgan most known to have played?",
      "options": [
        "Catcher",
        "Second Base",
        "Outfield",
        "None of these"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This winter sport, which traces its origins to an exercise for Norwegian soldiers, combines cross-country skiing and rifle shooting.",
      "options": [
        "Duathlon",
        "Skeleton",
        "Biathlon",
        "Nordic combined"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What coach does this quote belong to: If the NBA were on Channel 5 and a bunch of frogs were making love on Channel 4, I would watch the frogs even if the picture was coming in fuzzy.?",
      "options": [
        "Dick Vitale",
        "Bobby Knight",
        "Chet Forte",
        "Bill Walton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What country did the first skater to land a single Salchow skate for?",
      "options": [
        "Sweden",
        "United States",
        "Ukraine",
        "Russia"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the movie A League of Their Own, there was an obnoxious little kid who used to go to all of his mothers baseball games. He always sat in the dugout and bothered all of the players. What was the name of this kid?",
      "options": [
        "Anthony",
        "Harvey",
        "T.J.",
        "Stillwell"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the listed NBA players has the most career points?",
      "options": [
        "Karl Malone",
        "Wilt Chamberlain",
        "Michael Jordan",
        "Kareem Abdul-Jabbar"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "After playing an approach shot into the green, you find that some prankster in the group ahead had jammed the flag some 40 feet from where the actual golf hole was. How do you proceed?",
      "options": [
        "Move the ball to the same distance from the hole as it was with the fake hole",
        "None of these",
        "Play the ball as it lies",
        "Replay the shot"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1957, a large crowd came to hear this man speak at Yankee Stadium.",
      "options": [
        "Billy Graham",
        "L.Ron Hubbard",
        "Pope John Paul II",
        "Pope John XXIII"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Gilbert Arenas is famous for doing what before taking a foul shot?",
      "options": [
        "He spins the ball around his waist 3 times and then dribbles the ball 3 times.",
        "He makes the sign of the cross with his hand and looks up in the air with his eyes closed.",
        "He kisses a tattoo of his baby on his left hand and of his babys mama on his right hand.",
        "He dribbles the ball 0 times."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these teams was defeated at the Super Bowl XXXIII game by the Denver Broncos?",
      "options": [
        "Tennessee Titans",
        "Atlanta Falcons",
        "Frankford Yellow Jackets",
        "Providence Steam Roller"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the winning pitcher in game six of the 1995 World Series, 1-0 victory over the Cleveland Indians?",
      "options": [
        "Greg Maddux",
        "Steve Avery",
        "John Smoltz",
        "Tom Glavine"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what city did Andre the Giant defeat Hulk Hogan for the WWF title?",
      "options": [
        "Indianapolis",
        "Boston",
        "St. Paul",
        "Detroit"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The other name of Queens Club Championship is this.",
      "options": [
        "Vodafone Championship",
        "Stella Artois Championship",
        "Sony Championship",
        "Davis Cup"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This catcher was traded to the Mets by the Cubs in 1986 for starting pitcher Ed Lynch.",
      "options": [
        "Ron Hodges",
        "Alex Trevino",
        "Butch Wynegar",
        "Dave Liddell"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which Canadian is the inventor of basketball?",
      "options": [
        "James Naismith",
        "Paul Tracey",
        "Bobby Orr",
        "Ned Hanlan"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which baseball pitcher pitched 11 perfect innings, only to lose the game in the 12th?",
      "options": [
        "Lew Burdette",
        "Johnnie Sain",
        "Warren Sphan",
        "Harvey Haddix"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This chess opening was named after a mythical creature.",
      "options": [
        "The Centaur Variation of the Queens Gambit",
        "The Phoenix Variation of the Trompowsky Attack",
        "The Unicorn Variation of the Kings Gambit",
        "The Dragon Variation of the Sicilian Defense"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The museum honoring this professional baseball player is located in the West Acres Shopping Mall in Fargo, ND.",
      "options": [
        "Travis Hafner",
        "Darin Erstad",
        "Kirby Puckett",
        "Roger Maris"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Vengeance 2007 was called Night of .............?",
      "options": [
        "Divas",
        "Losers",
        "Champions",
        "History"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the President of Entertainment and Sports Programming Network (ESPN) in 2008?",
      "options": [
        "Peter Ubberofft",
        "George Bodenheimer",
        "Phil Knight",
        "Jim Collins"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which country was the European champion in football and basketball in 2006?",
      "options": [
        "France",
        "Greece",
        "Italy",
        "Spain"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This underrated player recorded the very first quadruple-double in NBA history.",
      "options": [
        "John Stockton",
        "Jason Kidd",
        "Nate Thurmond",
        "Michael Jordan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "If you are at 10 meters of depth, and fill a balloon with one liter of air from the cylinder, and then ascend to the surface, what will happen to the balloon?",
      "options": [
        "The balloon will expand to a volume of 1 1/2 liters, and possibly burst.",
        "The balloon will expand to a volume of 2 liters, and possibly burst.",
        "The balloon will shrink to a volume of 1/3 liter.",
        "The balloon will shrink to a volume of 1/2 liter."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This prominent science fiction author dropped out of school at the age of 14, when his father, a professional cricket player, fractured his thigh. His unhappy apprenticeship as a draper inspired his novels The Wheels of Chance and Kip.",
      "options": [
        "George Orwell",
        "Jules Verne",
        "H. G. Wells",
        "Hugo Gernsback"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In the America Bowl at Wembley stadium in 1987, the Welsh Full Back Paul Thorburn made a guest appearance for which NFL team?",
      "options": [
        "L. A. Rams",
        "Chicago Bears",
        "Denver Broncos",
        "Green Bay Packers"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the first European football team for which Diego Maradona played professionally?",
      "options": [
        "Sevilla",
        "Napoli",
        "Barcelona",
        "Real Madrid"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who owned the Yankees when Yankee Stadium was built?",
      "options": [
        "George Steinbrenner and George Costanza",
        "Jacob Ruppert and Dave Devrey",
        "Jacob Ruppert and Dave Ferrell",
        "Jacob Ruppert and Tullinghast LHommedieu"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many teams in the National Football League (NFL) are named for animals?",
      "options": [
        "12",
        "14",
        "9",
        "16"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which set of numbers is most significant to baseball?",
      "options": [
        "9,13,26",
        "1,83,26",
        "1,7,17",
        "3,4,9"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What head football coach makes a cameo in the movie Facing the Giants?",
      "options": [
        "Mark Richt",
        "Frank Beamer",
        "Jim Donnan",
        "Bobby Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which Notre Dame coach said, The only qualifications for a lineman are to be big and dumb. To be a back, you only have to be dumb.?",
      "options": [
        "Charlie Weis",
        "Ty Willingham",
        "Lou Holtz",
        "Knute Rockne"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This person was the first African-American to hit a home run in Major League Baseball.",
      "options": [
        "Dan Bankhead",
        "Jackie Robinson",
        "Larry Doby",
        "Monte Irvin"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who set an NFL record for most consecutive seasons (1959-1961) leading the league in pass attempts?",
      "options": [
        "Drew Bledsoe",
        "Johnny Unitas",
        "George Blanda",
        "Warren Moon"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which league does not hold a post season tournament to determine who their automatic bid is to the NCAA Championship?",
      "options": [
        "Ivy",
        "Big East",
        "Mid West Conference",
        "Sunbelt"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When was the first Daytona 500 held?",
      "options": [
        "1959",
        "1946",
        "1955",
        "1949"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Why was Tiger Woods nicknamed Tiger when he was younger?",
      "options": [
        "Because he was a womanizer",
        "Because he was very fast",
        "He got the nickname from a Vietnamese soldier.",
        "All of these"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which US President signed the law, which established the Congressional Medal of Honor - the highest military decoration awarded by the United States?",
      "options": [
        "Grant",
        "A. Johnson",
        "Lincoln",
        "John Adams"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This was the first U.S. college to win the NCAA basketball championship in both the mens and womens divisions in the same season.",
      "options": [
        "Rutgers",
        "North Carolina",
        "Connecticut",
        "Tennessee"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What company produced the famous race car Sport Kurz between 1928 and 1932?",
      "options": [
        "Mercedes-Benz",
        "Jaguar",
        "Honda",
        "BMW"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Touchdown! A Conestoga wagon pulled by two white ponies named Sooner and Boomer race around Owen Field. Who has scored a touchdown?",
      "options": [
        "Sanford",
        "University of Oklahoma",
        "University of Colorado",
        "Texas A M"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "He was the first 40-year-old to pitch a perfect game.",
      "options": [
        "Randy Johnson",
        "Dizzy Dean",
        "Kenny Rogers",
        "Don Drysdale"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This player from Alabama University was the Championship MVP in 1968.",
      "options": [
        "Paul Horning",
        "Darryl LaMonica",
        "Max McGee",
        "Bart Starr"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who scored the first three-point shot in the NBA?",
      "options": [
        "Chris Ford",
        "JoJo White",
        "Larry Bird",
        "Reggie Miller"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many seasons did Joe Jackson play in the baseball major leagues?",
      "options": [
        "13",
        "15",
        "16",
        "14"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What team led the Parade of Nations at the 2012 Summer Olympic Games Opening Ceremony?",
      "options": [
        "the team of China",
        "the team of Afghanistan",
        "the team of Great Britain",
        "the team of Greece"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Amy Dumas, an American professional wrestler, goes by what ring name?",
      "options": [
        "Candice Michelle",
        "Lita",
        "Victoria",
        "Mickie James"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 2003, I joined the soccer club Real Madrid. Bend it like _______ is a movie title that makes reference to my name. Who am I?",
      "options": [
        "David Beckham",
        "Alfredo Di Stefano",
        "Zico",
        "Ronaldo"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Before leaving the NBA in 2005, this player, mainly associated with the Charlotte Hornets, was the smallest player in the history of the league with his 1.60 m height and 62 kg weight.",
      "options": [
        "Damon Stoudamire",
        "T.J. Ford",
        "Muggsy Bogues",
        "Travis Best"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which of these teams does not have the color blue in their logo?",
      "options": [
        "Washington Capitals",
        "New York Islanders",
        "Atlanta Falcons",
        "Charlotte Bobcats"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Chicgao Blackhawks selected this player with the first overall pick in the 2007 NHL Entry Draft.",
      "options": [
        "Jonathan Toews",
        "Marian Hossa",
        "Duncan Keith",
        "Patrick Kane"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This is the only school to win the NCAA basketball Championship and the NIT basketball tournaments in the same year.",
      "options": [
        "Kentucky",
        "UCLA",
        "Duke",
        "City College of New York"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What NFL team went 1-15 during the 1989 season?",
      "options": [
        "Dallas Cowboys",
        "Houston Texans",
        "The New York Jets",
        "Chicago Bears"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What year did the United States boycott the International Olympic Games?",
      "options": [
        "1972",
        "1984",
        "1976",
        "1980"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In what year did Berlin host the Olympics, allowing Germany to use the event as a Nazi propaganda tool?",
      "options": [
        "1932",
        "1940",
        "1944",
        "1936"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "When keeping a box score of a baseball game, what is the number of the catcher?",
      "options": [
        "1",
        "3",
        "4",
        "2"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who said: You win some, you lose some, you crash some.?",
      "options": [
        "Evander Hollyfield",
        "Dale Earnhardt",
        "Mike Ditka",
        "Jim Loscutoff"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "How many times did Bob Gibson win a Golden Glove Award?",
      "options": [
        "9",
        "7",
        "6",
        "8"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was the Giants running back in Super Bowl XXI?",
      "options": [
        "Tiki Barber",
        "Rodney Hampton",
        "Joe Morris",
        "Otis Anderson"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Did Muhammad Ali return to boxing after his retirement in 1978?",
      "options": [
        "Officially yes, but due to his Parkinsons disease he never fought again.",
        "No",
        "Yes and he lost to Larry Holmes.",
        "Yes, he beat George Foreman in the famous fight in Kinshasa."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "A major concept of karate is attitude. What is it called in Japanese?",
      "options": [
        "Sapporo",
        "Kumite",
        "Kokoro",
        "Tadashi"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the Stanley Cup winner for 2005-2006?",
      "options": [
        "Ottawa Senators",
        "Carolina Hurricanes",
        "New Jersey Devils",
        "Colorado Avalanche"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "He retired with the NBAs highest scoring average (30.1 points per game).",
      "options": [
        "Shaquille ONeal",
        "Michael Jordan",
        "Dwyane Wade",
        "Jarmaine ONeal"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Little League World Series is held in this city.",
      "options": [
        "Lock Haven",
        "Pittsburgh",
        "Williamsport",
        "Harrisburg"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This player was drafted in 1962 by the Celtics. He is also known as Hondo.",
      "options": [
        "Sam Jones",
        "Peja Sojakovich",
        "Jonh Havlicek",
        "Maurice Cheeks"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The putting green refers to this.",
      "options": [
        "The area around water hazards like ponds, lakes, etc.",
        "The area where the ball is first hit (starting position)",
        "The area around sand traps",
        "The area around the actual hole"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "F91 Dudelange is a soccer team based in which country?",
      "options": [
        "Luxembourg",
        "Ireland",
        "Malta",
        "England"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was drafted by the Orlando Magic as the 1st overall pick in the 1992 NBA draft?",
      "options": [
        "Anfernee Hardaway",
        "Christian Laettner",
        "Alonzo Mourning",
        "Shaquille ONeal"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Name the 1974 NBA Finals MVP who was nicknamed Hondo.",
      "options": [
        "Rick Barry",
        "Wilt Chamberlain",
        "JoJo White",
        "John Havlicek"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In 1999, Phoenix City, AL lost the Little League World Series to which team?",
      "options": [
        "Osaka, Japan",
        "Tainan City, Taiwan",
        "Pu-Tzu Town, Taiwan",
        "Li-Teh, Taiwan"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How long is a handball Olympic game?",
      "options": [
        "60min wall clock",
        "60min, breaks excluded",
        "48min wall clock",
        "48min, breaks excluded"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In 1990 the Colorado Buffaloes beat the Tigers due to which of the following?",
      "options": [
        "a fifth down",
        "Both of these",
        "None of these",
        "bad officiating"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was Coroebus?",
      "options": [
        "The man who invented the Olympic Games in 776 b.c.e.",
        "The man who raced from Marathon to Athens.",
        "The first winner of an Olympic event in 776 b.c.e.",
        "The Greek god of sports and the Olympic Games"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What is the official state sport of the U.S. state of Alaska?",
      "options": [
        "Ice skating",
        "Skiing",
        "Mushing",
        "Ice hockey"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Ronald Reagan held many jobs, one of which was in sports. What was this job?",
      "options": [
        "professional baseball player",
        "professional football player",
        "sports caster",
        "Olympic track runner"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the distance, covered by the Kentucky Derby?",
      "options": [
        "Mile and one quarter",
        "Mile and a half",
        "Two miles",
        "Mile and one sixteenth"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the favorite sport of singer Chris Brown?",
      "options": [
        "soccer",
        "baseball",
        "Basketball",
        "football"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Bayern is a top German football team located in Munich. What is the meaning of its name?",
      "options": [
        "It is an adjective form of Bayer, a German pharmaceutical company.",
        "It means Beer Drinkers in local dialect.",
        "It is the German name of Bavaria, the region Munich is capital of.",
        "It commemorates Johann Bayer, a German astronomer."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Major Leaguer to hit 500 homeruns in his career?",
      "options": [
        "Tris Speaker",
        "Jimmie Foxx",
        "Babe Ruth",
        "Lou Gehrig"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Lorenzo Charles hit the game winning shot in the 1983 NCAA Championship, but what was the name of the player who put up the famous air ball?",
      "options": [
        "Derek Whittenburg",
        "Ranzino Smith",
        "Cozell McQueen",
        "Terry Gannon"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Minnesota Twins have produced four American League MVPs--Zoilo Versalles (1965), Harmon Killebrew (1969) and Rod Carew (1977) are three of them. Name the fourth.",
      "options": [
        "Frank Viola",
        "Justin Morneau",
        "Kirby Puckett",
        "Tony Oliva"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1920 Edward P. Eddie Eagan won the first Olympic boxing gold medal for the USA. In 1932, he won a second gold Olympic medal in which sport?",
      "options": [
        "Bobsledding",
        "Wrestling",
        "The Shot Put",
        "Greco-Roman Wrestling"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In the U.S. the largest number of rodeos are held on which weekend?",
      "options": [
        "Veterans Day",
        "Memorial Day",
        "Labor Day",
        "4th of July"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "On the show Coach, Hayden was asked to leave his college team and coach in the pros. He did make the move and took his coaching staff with him. What was the name of the team that Coach Fox coached?",
      "options": [
        "Minnesota Magic",
        "San Diego Gold",
        "New York Knights",
        "Orlando Breakers"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year did baseball catchers first started using chest protectors?",
      "options": [
        "1915",
        "1895",
        "1885",
        "1905"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the manager of the 1986 New York Mets?",
      "options": [
        "John McNamera",
        "Gene Mauch",
        "Davey Johnson",
        "Hal Lanier"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these Hall of Famers was first baseman for the San Francisco Giants?",
      "options": [
        "Jocko Thomas",
        "Bobby Sutter",
        "Willie Mayes",
        "Orlando Cepeda"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which team won every competition they could between 2003-2007, including an Olympic Gold, 2 World Championships and 6 World League cups?",
      "options": [
        "USA, basketball - men",
        "Germany, soccer - men",
        "South Korea, soccer- women",
        "Brazil, volleyball - men"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Kentucky Derby takes place yearly in Louisville, on which day?",
      "options": [
        "Any day chosen by the owners",
        "Fourth of July",
        "First Saturday in May",
        "Midsummers Eve"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The first death spiral was performed by this legendary couple.",
      "options": [
        "Gordeeva Grinkov",
        "Kitty Peter Caruthers",
        "Babilonia Gardner",
        "The Protopopovs"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This Washington Capitals player was the first overall selection in the 2004 NHL Entry Draft.",
      "options": [
        "Wayne Gretzky",
        "Jaromir Jagr",
        "Mark Messier",
        "Alexander Ovechkin"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is a baseball team from Kansas?",
      "options": [
        "Kansas City T-Bones",
        "Wichita Thunder",
        "Kansas City Wizards",
        "Kansas Koyotes"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Where was volleyball invented?",
      "options": [
        "the USA",
        "Cuba",
        "Brazil",
        "Canada"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "LaDainian Tomlinson finished first on the 2006 Chargers team in rushing yards. What running back finished second that year behind Tomlinson?",
      "options": [
        "Philip Rivers",
        "Michael Turner",
        "Lorenzo Neal",
        "Andrew Pinnock"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what sport did actor Matthew Perry excel when he was a student?",
      "options": [
        "Golf",
        "Tennis",
        "Baseball",
        "Soccer"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Select the best definition for a perfect game in Major League baseball.",
      "options": [
        "Any baseball game in which the pitcher allows no hits, no walks, no hit batsmen and in which the winning team commits no errors",
        "Any baseball game of at least 9 innings in which the losing side gets no hits, gets no walks, and never reaches base safely on an error",
        "Any game in which the pitcher or pitchers throw a complete game of nine or more innings without surrendering a base runner",
        "Any baseball game in which the losing side never gets a runner safely on base"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "During modern baseball (i.e. since 1877) this is the first decade in which no pitcher could earn the Triple Crown.",
      "options": [
        "1940s",
        "1890s",
        "1880s",
        "1950s"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1979, this Boston Celtics player scored the first 3 point basket in the NBA.",
      "options": [
        "John Havlicek",
        "Larry Bird",
        "Chris Ford",
        "Jo Jo White"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This former Houston Rocket, who retired in 2002, set an NBA record for blocks in a career.",
      "options": [
        "Bill Russel",
        "David Robinson",
        "Wilt Chamberlain",
        "Hakeem Olajuwon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Gunnery sergeant John Basilone of the US Marine Corps, was awarded the Medal of Honor for what reason?",
      "options": [
        "Outstanding heroism during the attack on Pearl Harbour",
        "Outstanding heroism at Guadalcanal during World War II",
        "Outstanding heroism during the Gulf Wars",
        "Outstanding heroism during the Vietnam War"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where was the first organized soccer team formed?",
      "options": [
        "Milan, Italy",
        "Madrid, Spain",
        "Munich, Germany",
        "Sheffield, England"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This actress, writer, talk-show host and comedian performed The Star Spangled Banner before a baseball game in San Diego on July 25, 1990.",
      "options": [
        "Stephen Lynch",
        "Jerry Seinfeld",
        "Roseanne Barr",
        "Jennifer Lopez"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This Hall of Fame first baseman played with the New York Giants from 1923 to 1936 and was their manager in the period 1932-1941.",
      "options": [
        "Bob Schultes",
        "Jimmy Flowers",
        "Rocky Nelson",
        "Bill Terry"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which team won the second Little League World Series in 1948?",
      "options": [
        "Lockhaven, Pa.",
        "Roswell, N.M.",
        "Tampa, Fl.",
        "Bowling Green, Ky."
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which famous NBA player, founder of the Stand Tall Foundation, was selected by the Milwaukee Bucks in the 1993 NBA Draft.",
      "options": [
        "Magic Johnson",
        "Vin Baker",
        "Dikembe Mutombo",
        "Gary Payton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which team of Brazil won the first Club World Championship organized by FIFA?",
      "options": [
        "Corinthians/SP",
        "Sao Paulo/SP",
        "Flamengo/RJ",
        "Santos/SP"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following sluggers never hit 50 home runs in a single season?",
      "options": [
        "Hank Aaron",
        "Mickey Mantle",
        "Willie Mays",
        "Cecil Fielder"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What number did Don Mattingly wear when he played as a part-time first baseman and outfielder for the New York Yankees in 1983?",
      "options": [
        "33",
        "18",
        "46",
        "23"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which player hit 336 homers in 1423 games while playing for the Toronto Blue Jays?",
      "options": [
        "Carlos Delgado",
        "Joe Carter",
        "George Bell",
        "Dave Winfield"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Bud Abbott and Lou Costello were a comedy team that lasted for 20 years, from the 1930s through the 1950s. What famous baseball routine are they best known for?",
      "options": [
        "Whos Playing Who?",
        "Whos your Daddy?",
        "The Ump is Blind!",
        "Whos on First?"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1968, Catfish Hunter pitched a perfect game for the Oakland Athletics, beating the Minnesota Twins 4 to 0. What is Catfishs real name?",
      "options": [
        "Catfish Hunter is his real name",
        "James Augustus Hunter",
        "John Henry Hunter",
        "Julian Catfish Hunter"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which team did Pete Rose and the Cincinnati Reds beat in the 1975 World Series?",
      "options": [
        "Tigers",
        "None Of These",
        "Red Sox",
        "Yankees"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Gilles Villeneuve was granted a Formula 1 seat after impressing a fellow driver during a non-championship Formula Atlantic race in 1977. Who did Gilles Villeneuve impress to get his first ride in Formula one with McLaren?",
      "options": [
        "Bruce McLaren",
        "Enzo Ferrari",
        "Frank Williams",
        "James Hunt"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In the 1980s Tony Hawks father, Frank Hawk was head of what organization?",
      "options": [
        "The National Rifle Association",
        "The CIA",
        "The National Skateboard Association",
        "Coca Cola of North America"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of Detroits MLB team?",
      "options": [
        "Detroit Red Wings",
        "Detroit Pistons",
        "Detroit Lions",
        "Detroit Tigers"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In what year did the Chicago Cubs win their first World Series?",
      "options": [
        "1907",
        "1945",
        "1908",
        "1932"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This former Major League Baseball center fielder was the first player ever taken in an amateur draft by the Seattle Pilots.",
      "options": [
        "Bob Coluccio",
        "Gorman Thomas",
        "Steve Hovley",
        "Tommy Davis"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This Venezuelan was a great fielding shortstop for the White Sox. On White Sox he teamed with Nellie Fox to form a great fielding duo. Who was this famous #11?",
      "options": [
        "Luis Aparicio",
        "Chico Fernandez",
        "Felix Lopez",
        "Chico Carrasquel"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This player, drafted by The Steelers in 1969, is widely known for being mean and a for Coke commercial with a little kid.",
      "options": [
        "Lynn Swan",
        "Joe Green",
        "Cy Young",
        "Dick Night Train Lane"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Ayrton Senna died on May 1st, 1994 while racing in the San Marino Grand Prix at Imola for Williams. What team did Ayrton Senna start his Formula One career with?",
      "options": [
        "McLaren",
        "Brabham",
        "Toleman",
        "Ferrari"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "It is generally accepted that the game of golf originated in this country.",
      "options": [
        "Scotland",
        "England",
        "Sweden",
        "Ireland"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "He was called Big Train. He was the first baseball player whose last name began with a J to be elected to the Baseball Hall of Fame. Who was he?",
      "options": [
        "Addie Joss",
        "Ban Johnson",
        "Walter Johnson",
        "Judy Johnson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What penalty does a barrel racer get for knocking down a barrel?",
      "options": [
        "5 seconds",
        "10 seconds",
        "Disqualification",
        "20 seconds"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This heavy athlete, nicknamed The Iranian Hercules, lifted 263.5 kg (589.9 lb) at the 2000 Summer Olympics.",
      "options": [
        "Mohamad Khatami",
        "Hossein Barkhah",
        "Hossein Rezza Zadeh",
        "Hossein Tavakoli"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Before becoming Umaga, what gimmick did Eddie Fatu wrestle under?",
      "options": [
        "Jamal of 3 minute warning",
        "Eddie Fatu",
        "Rosey of 3 minute warning",
        "Superfly Eddie Fatu"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What position did Mark McGwire play for the St. Louis Cardinals?",
      "options": [
        "2nd base",
        "shortstop",
        "3rd base",
        "1st base"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The 1985-86 season in the NBA championship saw what number title for the Boston Celtics?",
      "options": [
        "16th",
        "15th",
        "21st",
        "20th"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The Pittsburgh Pirates were a great team in baseballs early years. Unfortunately they lost the first modern World Series in 1903 to this team.",
      "options": [
        "The Bad News Bears",
        "New York Yankees",
        "Chicago Cubs",
        "Boston Red Sox"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This Major League Baseball All-Team member made his personal record-breaking 500th home run in June 1960 at the Cleavland Stadium.",
      "options": [
        "Ted Williams",
        "Babe Ruth",
        "Mickey Mantle",
        "Mell Ott"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In what year did Paul Bryant die?",
      "options": [
        "1982",
        "1987",
        "1990",
        "1983"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "How many games and how many goals are accredited to David Beckham while playing for Manchester United",
      "options": [
        "250-65",
        "394-85",
        "500-91",
        "350-35"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is a golfer said to have, if he is entitled to hit off first?",
      "options": [
        "the badge",
        "the turn",
        "the honour",
        "the hit"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 1958, this team shared their first title from NCAA Division I-A national football championship with Iowa.",
      "options": [
        "BYU",
        "Florida",
        "Army",
        "LSU"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "To which city do the Sacramento Kings trace their origins?",
      "options": [
        "Pittsburgh, PA",
        "Washington, DC",
        "Louisville, KY",
        "Rochester, NY"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This person was one of the first great skateboarders and a video game icon.",
      "options": [
        "Tom Condon",
        "John Walsh",
        "Tony Hawk",
        "Sid Crosby"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Ice hockey was first played in the 1920 Olympics, which were held in what city?",
      "options": [
        "Antwerp",
        "Montreal",
        "Chamonix",
        "Lake Placid"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who is Mizzous arch rival in all sports?",
      "options": [
        "Kansas Jayhawks",
        "Oklahoma",
        "Nebraska",
        "Illinois"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was manager for Birmingham City during the 2004-2005 season?",
      "options": [
        "Bryan Robson",
        "David Moyes",
        "Steve Bruce",
        "Steve Wigley"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This NFL great was the first player to get 14 interceptions in one season.",
      "options": [
        "Jimmy Marsalis",
        "Cornell Green",
        "Herb Adderly",
        "Dick Lane"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This famous singer was often On the Road. His last words were That was a great game of golf fellas.",
      "options": [
        "Bing Crosby",
        "Sam Snead",
        "Rudy Valle",
        "Bobby Jones"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "He was the star quarterback and running back at Notre Dame. He played in the first Super Bowl for the Greenbay Packers.",
      "options": [
        "Paul Hornung",
        "Randy Duncan",
        "Jimmy Taylor",
        "John David Crow"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these gymnastics disciplines, contested at the 2012 Olympic Games, was the last to be recognised as an Olympic discipline?",
      "options": [
        "rhythmic gymnastics",
        "artistic gymnastics",
        "They all became Olympic disciplines in the same year.",
        "trampolining"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What country was the host of the 1968 Summer Olympics, or Games of the XIX Olympiad?",
      "options": [
        "France",
        "Brazil",
        "Norway",
        "Mexico"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This former professional ice hokey player, known as The Great One, is widely accepted as the greatest player to ever play the game of hockey.",
      "options": [
        "Mike Modano",
        "Bobby Orr",
        "Paul Kariya",
        "Wayne Gretzky"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first female driver at the Indianapolis 500?",
      "options": [
        "Janet Guthrie",
        "Sally Rider",
        "Wanda Montgomery",
        "Lyn St. James"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which National Olympic Committee organized Equestrian events during the 2008 Olympic Games?",
      "options": [
        "NOC of Singapur",
        "NOC of China",
        "NOC of Hong-Kong",
        "NOC of Taiwan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What Major Leaguer broke the career record for the most seasons with 40 or more home runs with 11 consecutive seasons?",
      "options": [
        "Hank Aaron",
        "Babe Ruth",
        "Barry Bonds",
        "Alex Rodriguez"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Under what circumstances is it okay to touch underwater creatures?",
      "options": [
        "You can touch underwater creatures if you are wearing gloves.",
        "You can touch underwater creatures if they are not dangerous.",
        "You can touch underwater creatures if you are not wearing gloves.",
        "Under no circumstances should you touch underwater creatures."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Bocce, a sport that developed into its present form in Italy, is classified as what type of sports activity?",
      "options": [
        "Winter sport",
        "Combat sport",
        "Target sport",
        "Strength sport"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Big Ten Conference is a college athletic conference located in the northern United States. It had this many members, as of the beginning of the new millennium.",
      "options": [
        "9",
        "12",
        "10",
        "11"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who won the 1984 World Series MVP award ?",
      "options": [
        "Howard Johnson",
        "Willie Hernandez",
        "Alan Trammell",
        "Kirk Gibson"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What interesting nickname was given to Spanish football club Atletico Madrid?",
      "options": [
        "Carpet Cleaners",
        "Leg Warmers",
        "Mattress Makers",
        "Dish Washers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In professional wrestling, the high side thrust kick, often used by Shawn Michaels as a finishing move, is also known by what name?",
      "options": [
        "Sweet Chin Music",
        "Leg Drop",
        "Batista Bomb",
        "5 Star"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The last National Leaguer to win the Triple Crown in the 20th century had the nickname Ducky. What was his last name?",
      "options": [
        "Hornsby",
        "Medwick",
        "Duffy",
        "Klein"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following was invented before the last time that the Chicago Cubs won The World Series of baseball?",
      "options": [
        "The invention of Corn Flakes",
        "The Invention of the Radio",
        "The Invention of Television",
        "The Invention of instant coffee"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In which decade were sneakers, or tennis shoes invented?",
      "options": [
        "1920s",
        "1890s",
        "1830s",
        "1940s"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which club has won most UEFA Champions League competitions between 1991/1992 and 2006/2007?",
      "options": [
        "Barcelona, 3 times",
        "Liverpool, 4 times",
        "Real Madrid, 4 times",
        "AC Milan and Real Madrid, 3 times each"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "College bands brings out the school spirit in the fans and some bands are renowned in their own right. But the most famous band member in college football is not a member of a drumline or a strutting majorette, hes a sousaphone player. What universitys band is on the field when the sousaphone player dots the i?",
      "options": [
        "Princeton",
        "Ohio State",
        "University of Miami",
        "University of Iowa"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "His name is Lawrence Peter Berra but most people know him by this nickname.",
      "options": [
        "Yogi",
        "Pudge",
        "Stumpy",
        "Bump"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The great manager Paul Richards once said that Yogi Berra was the best bad pitch hitter. What was Yogis response?",
      "options": [
        "They just dont throw it good-I hit it good.",
        "If I can hit it, its a good pitch.",
        "If its a bad pitch, why did they throw it?",
        "They dont call it good, but its a good pitch."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What substance do South American Indians use on the tips of their poison darts?",
      "options": [
        "Metrazol",
        "snake venom",
        "curare",
        "ammonia"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "On a radio show in Budapest, Hungary in 1999, Bobby Fischer described himself as a victim of which of the following?",
      "options": [
        "An international Jewish conspiracy",
        "Child abuse",
        "A black magic curse",
        "Assassination attempts by the CIA"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these players have never won the Super Bowl MVP?",
      "options": [
        "Chuck Howley",
        "Dan Marino",
        "Jake Scott",
        "Richard Dent"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 2009, Tom Renney, ex-head coach of the New York Rangers, became the new assistant coach of what team?",
      "options": [
        "Los Angeles Kings",
        "Phoenix Coyotes",
        "Colorado Avalanche",
        "Edmonton Oilers"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What former Major League Baseball shortstop, who at the time played for the New York Mets, got into a fight with Pete Rose during the 1973 playoffs?",
      "options": [
        "Bud Harrelson",
        "Tim Foli",
        "Rafael Santana",
        "Teddy Martinez"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This team won their second consecutive Super Bowl on January 13th, 1974.",
      "options": [
        "Jets",
        "Steelers",
        "Dolphins",
        "Packers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which Phillies player led the team in stolen bases in 1980?",
      "options": [
        "Pete Rose",
        "Lonnie Smith",
        "Garry Maddox",
        "Larry Bowa"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What was the reason for Diego Maradonas fading health after the end of his professional football career?",
      "options": [
        "All of these",
        "Drug addiction",
        "HIV infection",
        "Hereditary ailments"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the movie Wedding Crashers, who claimed to be first-team All-State and in which sport?",
      "options": [
        "Jeremy, Football",
        "Zach, Football",
        "John, Hunting",
        "Todd, Hunting"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In what type of environment is the sport called parkour most often practiced?",
      "options": [
        "In urban areas",
        "In an open bare field",
        "In swimming pools",
        "In a gym"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these baseball players has never played with the New York Mets?",
      "options": [
        "Bobby Valentine",
        "Fran Healy",
        "Warren Spahn",
        "Joe Torre"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In the 2008 Olympic Games, Michael Phelps swam in 8 events. How many world records did Phelps and/or his team set?",
      "options": [
        "8",
        "7",
        "5",
        "6"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1985, the Giants were so close to the Super Bowl they could taste it. But one forbidding defensive team with a monster coach stopped them dead in their tracks and went on to win the big game themselves. Name that team?",
      "options": [
        "Green Bay Packers",
        "Washington Redskins",
        "Chicago Bears",
        "Dallas Cowboys"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many players are there in a handball team?",
      "options": [
        "8",
        "5",
        "6",
        "7"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Robert De Niro won his first Academy Award for the portrayal of this former boxing champion.",
      "options": [
        "Jake LaMotta",
        "Nino Benvenuti",
        "James Braddock",
        "Marcel Cerdan"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which team did the Toronto Blue Jays beat on October 5, 1985 to win their first division crown.",
      "options": [
        "The Red Sox",
        "The Tigers",
        "The Orioles",
        "The Yankees"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the boxing champions below carried a name into the ring most different from his actual birth name?",
      "options": [
        "Sugar Ray Robinson",
        "Rocky Marciano",
        "Max Baer",
        "Jack Dempsey"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 2004, the New Jersey Nets traded this NBA player to Toronto Raptors, but he refused to play for Toronto, because the teams season record was poor.",
      "options": [
        "Alonzo Mourning",
        "Eric Williams",
        "Jason Kidd",
        "Vince Carter"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which country stood runner-up in the final of the inaugural ICC World Cup?",
      "options": [
        "India",
        "Pakistan",
        "Australia",
        "England"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what year did the University of Georgia win a national title in football?",
      "options": [
        "1980",
        "1982",
        "1981",
        "1983"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What conference is the Penn State Nittany Lions football team in?",
      "options": [
        "Big East",
        "Big Ten",
        "SEC",
        "Pac-10"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the New England Patriots from 1960 through 1970, when the team was part of the American Football League?",
      "options": [
        "New England Minutemen",
        "Foxboro Patriots",
        "Massachusetts Patriots",
        "Boston Patriots"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "When this NBA player was a rookie at the Denver Nuggets, he asked Michael Jordan to make a free throw with his eyes closed. Jordan did it, nailed the shot and told him Welcome to NBA.",
      "options": [
        "Nick Van Exel",
        "Avery Johnson",
        "Tim Hardaway",
        "Dikembe Mutombo"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Elmer Valo, a Major League Baseball player and coach, is one of the few American major leaguers born in this country.",
      "options": [
        "Surinam",
        "Serbia",
        "Germany",
        "The Czech Republic"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following MLB teams hit the most home runs in one major league season?",
      "options": [
        "61 New York Yankees",
        "76 Cincinnati Reds",
        "04 Boston Red Sox",
        "97 Seatle Mariners"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In which city did a bomb explode during the 1996 Olympics, resulting in two deaths?",
      "options": [
        "Nagano",
        "Moscow",
        "Munich",
        "Atlanta"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which one of these basketball players did not attend the University of Arizona?",
      "options": [
        "Desmond Mason",
        "Michael Dickerson",
        "Loren Woods",
        "Mike Bibby"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Marcus Allen from the Southern California Trojans win the Heisman award?",
      "options": [
        "1988",
        "1978",
        "1971",
        "1981"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many NFL all-time records did Brett Favre set?",
      "options": [
        "15",
        "5",
        "10",
        "16"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This ex NFL quarterback created a sensation by appearing on television commercials wearing pantyhose, and in a TV ad for Noxema Shaving Cream, he had a beautiful model lathering his face and saying Take it off...take it all off!",
      "options": [
        "Bart Starr",
        "Joe Namath",
        "Kenny Stabler",
        "Johnny Unitas"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This person runs into the water in search of the balls that the golf players strike inaccurately.",
      "options": [
        "Golf Ball Diver",
        "Golf Ball Seeker",
        "Golf Ball Water Hunter",
        "Golf Ball Swimmer"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "World Confederation of Billiard Sports (WCBS), the international governing centre of billiards, snooker, and pool, is headquartered in what country?",
      "options": [
        "France",
        "Switzerland",
        "United Kingdom",
        "United States"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What former North Carolina State coach was buried in a cemetery overlooking the highway so he could see his boys off to play?",
      "options": [
        "Jim Valvano",
        "Norman Sloan",
        "Press Maravich",
        "Everett Case"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "To what other popular sport is the game called korfball similar?",
      "options": [
        "Basketball",
        "Volleyball",
        "Football",
        "Baseball"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In January 2006, this person became the youngest head coach in the Jets history.",
      "options": [
        "Eric Mangini",
        "Al Groh",
        "Pete Carrol",
        "Herman Edwards"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the nickname of NFL Hall of Famer Reggie White?",
      "options": [
        "The Preacher of Pressure",
        "The Minister of Defense",
        "The Reverend of Defense",
        "The Pastor of Pressure"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "When was the first baseball box score written?",
      "options": [
        "1923",
        "1951",
        "1940",
        "1853"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Brooks Robinson was considered the human vacuum cleaner at his position.",
      "options": [
        "Third Base",
        "Second Base",
        "Shortstop",
        "First Base"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "# 9 on the list of highest-grossing films is this 1975 film that earned $1,945,100,000 and scared the pants off most of the audience. In fact, people swimming in the ocean dropped that year.",
      "options": [
        "Jaws 2",
        "Great White",
        "Jaws 3-D",
        "Jaws"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What type of body movement is involved in the sport called snowkiting?",
      "options": [
        "Gliding on ice",
        "All of these",
        "Gliding in midair",
        "Jumping from considerable heights"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Glory Road is a movie about the first NCAA basketball team with an all African-American starting lineup. Which university is the movie about?",
      "options": [
        "Texas Western",
        "Rutgers University",
        "Kansas",
        "Western Kentucky"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player, nicknamed Mr. Cub, spent nineteen seasons in the Windy City with the Chicago Cubs.",
      "options": [
        "Ernie Banks",
        "Ryne Sandberg",
        "Ferguson Jenkins",
        "Sammy Sosa"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Members of which Olympic team were taken hostage by the terrorist group Black September during the 1972 Munich games?",
      "options": [
        "Israel",
        "Ethiopia",
        "United States of America",
        "Canada"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What sport other than baseball did Bing Crosby have an interest in?",
      "options": [
        "thoroughbred horse racing",
        "tennis",
        "basketball",
        "football"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "For which of these teams did Troy Aikman play?",
      "options": [
        "Cardinals",
        "Seahawks",
        "Cowboys",
        "Jets"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Tracy Chapmans song Fast Car became an international hit when she performed it at the 70th Birthday Tribute to this famous man.",
      "options": [
        "Paul Simon",
        "Paul Newman",
        "Richard Petty, Sr.",
        "Nelson Mandela"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Larry Brown led this team from 1997 to 2003.",
      "options": [
        "Denver Nuggets",
        "Chicago Bulls",
        "LA Lakers",
        "Philadephia 76ers"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "For many years NFL placekickers would line-up directly in front of where the ball was placed. This changed when soccer style placekickers entered the league. These two Hungarian-born brothers were the most significant of the early placekickers.",
      "options": [
        "The Blandas",
        "The Gogolaks",
        "The Grammaticas",
        "The Guys"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which one of the MLB players below has NOT hit at least 200 home runs in both the AL and the NL?",
      "options": [
        "Mark McGwire",
        "Sammy Sosa",
        "Frank Robinson",
        "Fred McGriff"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What is the real name of WWE superstar Viscera?",
      "options": [
        "Nelson",
        "None of these",
        "Mable",
        "Mike"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This second baseman had a batting average of .424 in 1924 while playing with the St. Louis Cardinals.",
      "options": [
        "Ty Cobb",
        "Ryne Sandberg",
        "Rogers Hornsby",
        "Tony Lazzeri"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the last name of the great shortstop whose nickname was Little Louie?",
      "options": [
        "Aparicio",
        "Brock",
        "Banks",
        "Appling"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What medicinal properties do Calendula plants, commonly known as pot marigold, possess?",
      "options": [
        "Aphrodisiac",
        "All of these",
        "Anti-inflammatory",
        "Laxative"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "According to Dickinson poll, in 1928 this football team, coached by Howard Jones, won its first national title.",
      "options": [
        "BYU",
        "USC",
        "LSU",
        "Yale"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the 1st European-born hockey player to be drafted first overall in the NHL entry draft?",
      "options": [
        "Ulf Dahl\u00e9n",
        "Mats Sundin",
        "Jaromir Jagr",
        "Jari Kurri"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was Ted Williams nickname?",
      "options": [
        "The Great Man",
        "The Georgia Peach",
        "Mr. 400",
        "The Splendid Splinter"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The first National Hockey League team in the USA was from this city.",
      "options": [
        "Boston",
        "Detroit",
        "Fargo",
        "Buffalo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In the 1930s two American League pitchers won the Triple Crown twice each. They both had the same nickname. What were their last names?",
      "options": [
        "Grove and Gomez",
        "Dean and Gomez",
        "Gomez and Addams",
        "Vance and Dean"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This was the year the Pittsburgh Penguins hockey team was founded. The same year the NHL doubled in size from the Original Six to twelve teams.",
      "options": [
        "1968",
        "1966",
        "1970",
        "1967"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Wheaties is the Breakfast of Champions. At 18 appearances, which of these sports figures has graced the cover of the Wheaties box more than any other sports figure?",
      "options": [
        "Sarah Huges",
        "Michael Jordan",
        "Babe Ruth",
        "Tiger Woods"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What team did the Steelers defeat to win their first Super Bowl game?",
      "options": [
        "Dallas Cowboys",
        "Oakland Raiders",
        "Minnesota Vikings",
        "Seattle Seahawks"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was on the cover of the first issue of Transworld Skateboarding magazine?",
      "options": [
        "Christian Hosoi",
        "Tony Hawk",
        "Steve Caballero",
        "Stacy Peralta"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "As most NFL fans know, this kicker was born without toes on his right foot.",
      "options": [
        "Adam Vinatieri",
        "Tom Dempsey",
        "George Blanda",
        "Josh Brown"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "When was Dale Earnhardt Jr. born?",
      "options": [
        "March 28, 1980",
        "August 1, 1973",
        "May 29, 1970",
        "October 10, 1974"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was Muhammad Alis first professional fight and victory against?",
      "options": [
        "Tunney Hunsacker",
        "Joe Louis",
        "Archie Moore",
        "Alonzo Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which citys retractable dome stadium wasnt completed in time for the 1976 Olympics due to a construction strike?",
      "options": [
        "Munich",
        "Montreal",
        "Seoul",
        "Moscow"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the name of the bi-annual Cricket Series played between England and Australia?",
      "options": [
        "Admirals Cup",
        "The Bradman Series",
        "Churchill Trophy",
        "The Ashes"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In the movie The Bad News Bears, the Bears actually make it to the championship game. What is the name of the team that the Bears play in the championship?",
      "options": [
        "Angels",
        "Yankees",
        "Mets",
        "Red Sox"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the original version of the game of volleyball called?",
      "options": [
        "Netball",
        "Mintonette",
        "Ballonette",
        "Setball"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Dodger starting infield for the 1965 season set this record.",
      "options": [
        "It was the first infield composed of players all of whom became Hall of Famers.",
        "It was the first time all four infielders stole at least 20 bases each.",
        "It was the first time a complete infield was composed of switch hitters.",
        "It was the first time an infield was made up of four players none of whom were born in the USA."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He was the first World Series Most Valuable Player.",
      "options": [
        "Don Larsen",
        "Yogi Berra",
        "Johnny Podres",
        "Sandy Amoros"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who is the founder of the group that owns Gillette Stadium, the New England Revolution, Rand-Whitney Container Corp, and the New England Patriots?",
      "options": [
        "Arn Tellem",
        "Barton Parelli",
        "Robert Kraft",
        "Arthur Blank"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The NCAA started seeding mens basketball teams in 1979 and 2008 marked the first time when all #1 seeds made it to the Final Four. Name the teams that made it.",
      "options": [
        "Kansas, North Carolina, UCLA, UNLV",
        "Kansas, North Carolina, Duke, Memphis",
        "Kentucky, North Carolina, UCLA, Memphis",
        "Kansas, North Carolina, UCLA, Memphis"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What famous baseball pitcher played the role of Skidmark in the movie Kingpin?",
      "options": [
        "Nolan Ryan",
        "Greg Maddux",
        "Curt Schilling",
        "Roger Clemens"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1986 Detroit Pistons had great luck- they made two good draft picks. One of them was John Salley and the other was the 27th selected player.",
      "options": [
        "Dennis Rodman",
        "LeBron James",
        "Chris Webber",
        "Vlade Divac"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these schools is NOT on the legendary Tobacco Road?",
      "options": [
        "Clemson",
        "Wake Forest",
        "The University of North Carolina (UNC)",
        "Duke"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In this year Notre Dame beat UCLA 71-70 in mens college basketball ending the Bruins 88-game winning streak, The Way We Were by Barbra Streisand was the number 1 song, and The Godfather II came out.",
      "options": [
        "1974",
        "1973",
        "1972",
        "1970"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Fred Gehrke was a running back for the then Los Angeles Rams. Which of the following did he do in 1948?",
      "options": [
        "Painted horns on his helmet",
        "Played all eleven positions in one game",
        "Scored a touchdown running, receiving and throwing.",
        "Ran 100 yards the wrong way"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which statement about Philip Rizzutos birth is true?",
      "options": [
        "He was born Francisco Philip Rizzuto on 25 September, 1920 in Newark, New Jersey.",
        "He was born Philip Francis Rizzuto on 25 September, 1916 in Hillside, New Jersey.",
        "He was born Carlo Philip Rizzuto on 25 September, 1915 in The Bronx, N.Y.",
        "He was born Fiero Francis Rizzuto on 25 September, 1917 in Brooklyn, N.Y."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the St. Louis Cardinals win the World Series after beating the Milwaukee Brewers?",
      "options": [
        "1985",
        "1982",
        "1987",
        "1968"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Although he was never a great scorer, he was a team leader, who was considred the best defensive guard during his prime. A great athlete, he had tryouts for several football teams although basketball was his best sport. Who is this great point guard and former Celtics head coach?",
      "options": [
        "Bob Cousy",
        "John Havlichek",
        "K.C. Jones",
        "Jo-Jo White"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "One of these is an unusual hazard on the golf course.",
      "options": [
        "Ice",
        "Trees",
        "Water",
        "Sand"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which was the first ballpark in which the Chicago Cubs played in the national league?",
      "options": [
        "Wrigley Field",
        "South Side Park",
        "23rd Street Grounds",
        "West Side Grounds"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Ski jumpers used to jump with the skis positioned parallelly. Nowadays the skis are V-shaped during the jump. Who introduced this manner of jumping in 1988?",
      "options": [
        "Jan Bokl\u00f6v",
        "Jens Weissflog",
        "Matti Nyk\u00e4nen",
        "Dieter Thoma"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these Georgia teams was the 1983 Little League World Series?",
      "options": [
        "Roswell, Ga.",
        "Marietta, Ga.",
        "Burns, Ga.",
        "Atlanta, Ga."
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Of what descent is football player Zinedine Zidane?",
      "options": [
        "Algerian",
        "Moroccan",
        "South African",
        "Egyptian"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What song by Steve Allen is played, when a football player is enshrined in the Pro Football Hall of Fame?",
      "options": [
        "Ten Feet Tall",
        "The Wake",
        "Reflections",
        "Meeting of Minds"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year was Ted Williams inducted into The Major league Baseball Hall of Fame?",
      "options": [
        "1964",
        "1967",
        "1966",
        "1965"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Matches in this sport take place in a ring called dohy\u014d.",
      "options": [
        "Karate",
        "Sumo",
        "None of these",
        "Kung fu"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The first professional sports organization in the USA was formed in this city.",
      "options": [
        "Cleveland",
        "Charleston",
        "Boston",
        "Baltimore"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What kind of handlebar would you normally find on a road bike?",
      "options": [
        "Drop handlebar",
        "Crooked handlebar",
        "Fallen handlebar",
        "Straight handlebar"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the reader mail section of monthly skateboarding magazine, Thrasher, in the 1980s?",
      "options": [
        "Mail Drop",
        "Air Mail",
        "Skater Forum",
        "The Daily Grind"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these schools is NOT one of the original members of the Atlantic Coast Conference?",
      "options": [
        "Duke",
        "North Carolina",
        "Boston",
        "Clemson"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What expansion team finished with the NBA worst win/loss record during their first season in 1995\u201396?",
      "options": [
        "Orlando Magic",
        "Charlotte Bobcats",
        "Vancouver Grizzlies",
        "Toronto Raptors"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Eight ball, a popular type of pool in United States and United Kingdom, is played with this number of balls (excluding the cue ball).",
      "options": [
        "Sixteen",
        "Fifteen",
        "Nine",
        "Eight"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What are the two years the Minnesota Twins won the World Baseball Series?",
      "options": [
        "1988 1992",
        "1987 1991",
        "1980 1985",
        "1986 1990"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Chula and Pakpao are very popular in Thailand. Which statement best describes them?",
      "options": [
        "They are forms of gymnastics native to Thailand.",
        "They are forms of mixed martial arts taught in Thailand and derived from Chinese style kung fu.",
        "They are forms of kite fighting.",
        "They are forms of kick boxing developed in Thailand (Siam)."
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What was the second country after the United States to adopt volleyball?",
      "options": [
        "Canada",
        "Brazil",
        "Russia",
        "Mexico"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what state was the first American golf course opened?",
      "options": [
        "Vermont",
        "Georgia",
        "Tennessee",
        "New York"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How many rounds are played in championship fights according to a rule adopted in 1983?",
      "options": [
        "11",
        "12",
        "14",
        "10"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Steelers lost their first playoff game against this team in 1947.",
      "options": [
        "Cleveland Browns.",
        "St. Louis Cardinals",
        "New York Giants",
        "Philadelphia Eagles"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In the rodeo event called calf roping, riders have a rope woven within their belts. What is it called?",
      "options": [
        "Spare rope",
        "Piggin string",
        "Tie wrap",
        "Jerk line"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What country hosted the 1992 Summer Olympic Games, officially called the Games of the XXV Olympiad?",
      "options": [
        "Spain",
        "South Korea",
        "United Kingdom",
        "Brazil"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The 2006\u201307 Ashes series was notable for the retirement of several Australian players. Additionally, the Australian coach also announced prior to the Ashes series that the Ashes 2006-07 was his last series of test matches as coach. What was the name of the Australian coach?",
      "options": [
        "Bob Simpsons",
        "John Buchanan",
        "Gary Kristen",
        "Geoff Marsh"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which auto racing driver became the 2005 Nextel Cup Champion?",
      "options": [
        "Tony Stewart",
        "Jeff Gordon",
        "Carl Edwards",
        "Jimmie Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was the first King of the Ring?",
      "options": [
        "Ted Dibiase",
        "Brett Hart",
        "Don Murraco",
        "Bob Orton"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "He played 3rd base for the 1983 Phillies and wore uniform #20.",
      "options": [
        "Steve Jeltz",
        "Mike Schmidt",
        "Jeff Stone",
        "Tony Perez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which A.C Milan former player was close to becoming president of his native country?",
      "options": [
        "Cafu",
        "marco Van Basten",
        "Cesare Maldini",
        "George Weah"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Donald Trump is known for enthusiastically practicing which of the following sports?",
      "options": [
        "Basketball",
        "Football",
        "Hockey",
        "Golf"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Mike Schmidt starred with the Phillies at what position?",
      "options": [
        "Shortstop",
        "Pitcher",
        "Third Base",
        "Catcher"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How much did Manchester United pay PSV Eindhoven for Ruud Van Nistelrooy in 2001?",
      "options": [
        "200 000 pounds",
        "19 million pounds",
        "18 million pounds",
        "20 million pounds"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How many Premiership titles did Ryan Giggs win dirung 1990-2004?",
      "options": [
        "3",
        "8",
        "4",
        "5"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which of these players was not among the starting five in the North Carolina State University 83 basketball championship team?",
      "options": [
        "Lorenzo Charles",
        "Cozell McQueen",
        "Derek Whitterburg",
        "Anthony Grundy"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What Academy Award-winning movie tells the fact-based story of of two athletes participating in the 1924 Olympic Games?",
      "options": [
        "Chariots of Fire",
        "In the Line of Fire",
        "Courage Under Fire",
        "Quest for Fire"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Two universities are are almost always listed in the number one or number two spot when naming the best college fight song. One song mentioned is Notre Dames Notre Dame Victory March. The second fight song lyrics start: Send a volley cheer on high. Shake down the thunder from the sky. In which university stadium called the big house would you be sitting when the fans starting singing The Victors?",
      "options": [
        "University of Texas",
        "University of Michigan",
        "Cornell",
        "Ohio State"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is one of the nicknames of baseball player George Herman Ruth, also known as Babe Ruth?",
      "options": [
        "The Boston Menace",
        "The Yankee menace",
        "The Iron Horse",
        "The Sultan of Swat"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In which Hall of Fame was Gary Cooper inducted?",
      "options": [
        "The National Hall of Great Americans",
        "National Cowboy and Western Heritage Museum",
        "The ASCAP Hal of Fame",
        "The Screen Actors Guild Hall of Fame"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What German football club is nicknamed The Hollywood Football Club?",
      "options": [
        "FC Bayern Munich",
        "Hamburger SV",
        "FC St. Pauli",
        "Eintracht Frankfurt"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He began his career before the merger of the NFL and AFL. He played for the Broncos and Raiders. He was an integral part of the Raider defense for many years. He played from 1963-1978. He was voted to the AFL All-Time Team.",
      "options": [
        "Willie Brown",
        "Willie Wood",
        "Dennis Smith",
        "J.C.Caroline"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NFL kicker to finish the regular season with a 100% success rate on field goals and extra points?",
      "options": [
        "Jerry Rice",
        "Trey Vickrey",
        "Gary Anderson",
        "Steve Young"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He was the first African-American pitcher in Major League Baseball.",
      "options": [
        "Dan Bankhead",
        "Joe Black",
        "Don Newcombe",
        "Larry Doby"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In what movie does Tom Cruise play a race car driver?",
      "options": [
        "Risky Business",
        "The Outsiders",
        "Days of Thunder",
        "Rain Man"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where was the first ever US Masters Golf tournament played?",
      "options": [
        "Bethpage",
        "Augusta National",
        "Pebble Beach",
        "Outside the US"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Six brothers from one family played during the NHL 1982-1983 season. What was the familys last name?",
      "options": [
        "Sutter",
        "Lemieux",
        "Howe",
        "Hall"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Where is professional wrestler Dave Finlay from?",
      "options": [
        "Omaha, Nebraska",
        "Ireland",
        "Atlanta, Georgia",
        "North Carolina"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first player selected by the Dallas Cowboys in the football draft?",
      "options": [
        "Bedford Wynne",
        "Abner Haynes",
        "Don Meredith",
        "Bob Lilly"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He has been a fine Super Bowl-winning NFL coach, a football commentator and a video game icon.",
      "options": [
        "Buell Gallagher",
        "John Madden",
        "Frank Caliendo",
        "Terrell Owens"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Whether fortunately or unfortunately, strikes and work stoppages are a fact of life in professional sports. When was the first NHL player strike?",
      "options": [
        "1985",
        "1925",
        "1955",
        "1995"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When did the first game played under NFL rules take place?",
      "options": [
        "February 25, 1933",
        "February 24 , 1939",
        "February 25, 1943",
        "February 25, 1946"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In what year was the Minnesota Vikings football team established?",
      "options": [
        "1949",
        "1960",
        "1955",
        "1968"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Joseph Pilates used this term to refer to the muscle group comprised of the abs, buttocks, lower back and hips. All the energy begins in this group and flows outward.",
      "options": [
        "The Engine",
        "The Shell",
        "The Panel",
        "The Powerhouse"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The first FA Cup final took place on this date.",
      "options": [
        "22 April 1895",
        "16 March 1872",
        "19 March 1913",
        "1 May 1900"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In the 100 m butterfly at the 2008 Olympic Games, Michael Phelps beat Milorad \u010cavi\u0107 by this much.",
      "options": [
        "1/10th of a second",
        "2/100ths of a second",
        "1/100th of a second",
        "2/10ths of a second"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the primary role of a bullfighter in the rodeo event bull riding?",
      "options": [
        "Tease the bull",
        "None of these",
        "Protect the rider from harm",
        "Entertain the audience"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first lady to perform a successful triple Axel in a figure skating competition?",
      "options": [
        "Tonya Harding",
        "Midori Ito",
        "Oksana Baiul",
        "Nancy Kerrigan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Pool, also known as pocket billiards, is the most popular variation of billiards in which country?",
      "options": [
        "Australia",
        "Germany",
        "United Kingdom",
        "United States"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which great soccer goalkeeper was nicknamed \u201eThe black spider\u201d?",
      "options": [
        "Michael Balack",
        "Zinedine Zidane",
        "Lev Yashin",
        "Maradona"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This second baseman was part of the New York Yankees murderers row.",
      "options": [
        "Joe Morgan",
        "Tony Lazzeri",
        "Rod Carew",
        "Jackie Robinson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who is the first major leaguer to hit two grand slams in the same inning?",
      "options": [
        "Fernando Tatis",
        "Robin Ventura",
        "Reggie Jackson",
        "Todd Hundley"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This 2005 LSU recruit insisted that he was 100 percent committed to Texas, but on National Signing Day he signed with LSU.",
      "options": [
        "Jeremy Bunting",
        "Dwayne Bowe",
        "Antonio Robinson",
        "Ryan Perrilloux"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what city is the Crew MLS team based?",
      "options": [
        "Columbus",
        "San Antonio",
        "Toronto",
        "Boston"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these sports is not a form of basketball?",
      "options": [
        "Netball",
        "Penague",
        "Korfball",
        "Rezball"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Arguably the most famous NBA team. Michael Jordan played for this team.",
      "options": [
        "Chicago Bulls",
        "Miami Heat",
        "Utah Jazz",
        "Sacramento Kings"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many teams are there in the NHL?",
      "options": [
        "25",
        "15",
        "30",
        "10"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How many shutouts did Terry Sawchuk get in his career?",
      "options": [
        "102",
        "105",
        "104",
        "103"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What sports team does Xander join in the second season of the Buffy series?",
      "options": [
        "The swim team",
        "The baseball team",
        "The tennis team",
        "The football team"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is Dale Earnhardt Juniors full name?",
      "options": [
        "Dale Randall Earnhardt, Jr.",
        "Randall Dale Earnhardt, Jr.",
        "Ralph Dale Earnhardt, Jr.",
        "Dale Ralph Earnhardt, Jr."
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What does the term Kung Fu refer to, apart from Chinese martial arts?",
      "options": [
        "Knowledge",
        "Individual accomplishment or skill",
        "Physical strength",
        "Sense of superiority"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the Mets manager in 1969?",
      "options": [
        "Casey Stengel",
        "George Steinbrenner",
        "Gil Hodges",
        "Yogi Berra"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 1961Ludwig von Bersuda was looking for a game that would also be a good conditioning sport. What sport did he invent?",
      "options": [
        "Underwater rugby",
        "Bo-stethnics",
        "Underwater (American rules) football",
        "Underwater soccer"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the maximum temperature of a compressed 16-ounce Carbon Dioxide tank fit for a paintball gun?",
      "options": [
        "130 degrees F / 55 degrees Celsius",
        "140 degrees F / 60 degrees Celsius",
        "120 degrees F / 50 degrees Celsius",
        "110 degrees F / 43 degrees Celsius"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What pitcher was the first Little Leaguer to make it to the Major Leagues?",
      "options": [
        "Roger Clemens",
        "Joey Jay",
        "Bob Lemon",
        "Bob Gibson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Afghanistan, a poor war-torn country, managed to win a medal at the 2008 Summer Olympics. Which discipline was it in?",
      "options": [
        "Shooting",
        "Table tennis",
        "Taekwondo",
        "Weightlifting"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Name the first golfer to earn more than $100,000 in one year.",
      "options": [
        "Jack Nickolas",
        "Sam Snead",
        "Arnold Palmer",
        "Tiger Woods"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This Dutch soccer legend that played for Ajax is one of the few players named European Footballer of the Year three times.",
      "options": [
        "Johan Cruyff",
        "Cristiano Ronaldo",
        "Hristo Stoichkov",
        "David Beckham"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the meaning of the concept of Chi, that plays a crucial role in the basic training of a student in Kung Fu?",
      "options": [
        "Breath",
        "Stance",
        "Body",
        "Heart"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the following events take place: Jonas Salk began testing his polio vaccine on volunteers, including his wife, his children and himself. The first animal, a tadpole, was cloned. The New York Yankees defeated the Brooklyn Dodgers in the World Series.",
      "options": [
        "1956",
        "1950",
        "1954",
        "1952"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "When did Bobby Fischer win the United States Junior Chess Championship?",
      "options": [
        "July 1956",
        "April 1959",
        "August 1954",
        "January 1960"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "While Sammy Sosa gained most of his fame with the Cubs, which team did he debut for?",
      "options": [
        "Orioles",
        "Rangers",
        "White Sox",
        "Cubs"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who won the first event in the first modern Olympics in 1896?",
      "options": [
        "Pierre de Coubertin",
        "James B. Connolly",
        "Rafer Johnson",
        "Jim Thorpe"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which city hosts the International Clown Hall of Fame?",
      "options": [
        "West Allis, Wisconsin",
        "Sarasota, Florida",
        "Saratoga, NY",
        "West Hollywood, CA"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What year did the New England Patriots win their first Super Bowl?",
      "options": [
        "2003",
        "2000",
        "2006",
        "2001"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He was the first African-American to play in the NBA.",
      "options": [
        "Earl Lloyd",
        "Chuck Connors",
        "Nate Sweetwater Clifton",
        "Chuck Cooper"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which baseball player became the first to hit at least 20 home runs in a month?",
      "options": [
        "Babe Ruth",
        "Ken Griffey",
        "Sammy Sosa",
        "Ken Griffey, Jr."
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "He grew up in a suburb of Pittsburgh. In 2002 he became the owner of the Dallas Mavericks.",
      "options": [
        "Mark Cuban",
        "Peter Uberroth",
        "Jeff Urban",
        "George Pyne"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This Russian grandmaster was known for his intimidating stare. He was considered extremely good at sacrificing pieces. However, poor health caused him to never play to his full potential.",
      "options": [
        "Mikhail Tal",
        "Salo Flohr",
        "Paul Keres",
        "Harry Nelson Pillsbury"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these teams won the most titles in mens volleyvball in the beginning of the 21st century?",
      "options": [
        "Brazil",
        "USA",
        "Italy",
        "Russia"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first non-American born pitcher to pitch a perfect game?",
      "options": [
        "Ferguson Jenkins",
        "Elmer Valo",
        "Pedro Martinez",
        "Dennis Martinez"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which statement is true about Sli Beatha?",
      "options": [
        "It means face to face combat.",
        "It is performed while brandishing a dirk.",
        "It was founded in 1996 by police officer Craig Smith.",
        "It means stick fighting in Irish martial arts."
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these was the nickname of Fred Merkle?",
      "options": [
        "Fathead",
        "Knucklehead",
        "Bonehead",
        "Swellhead"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Jay Silverheels played Tonto, friend of the Lone Ranger on Television. He was, however, a very famous athlete in this sport.",
      "options": [
        "Lacrosse",
        "Rodeo riding",
        "Track and Field",
        "Archery"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Dick Butkus was a great middle linebacker for which team?",
      "options": [
        "Redskins",
        "Steelers",
        "Bears",
        "Ravens"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Between which two tournaments is Wimbledon played?",
      "options": [
        "French Open and US Open",
        "US Open and Australian Open",
        "Australian Open and French Open",
        "German Open and Australian Open"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This commissioner barred both Willie Mays and Mickey Mantle from baseball due to the their involvement in a casino promotion.",
      "options": [
        "Bowie K. Kuhn",
        "A. Bartlett Giamatti",
        "Fay Vincent",
        "Ford C. Frick"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The nickname of this hockey great was The pocket rocket.",
      "options": [
        "Jean Richard",
        "Henri Richard",
        "Louis Richard",
        "Maurice Richard"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which wrestler, winner of the PWI awards for most popular wrestler of the year, and most hated wrestler of the year, was also the first runner-up for the most inspirational wrestler of the year award in 1983?",
      "options": [
        "Roddy Piper",
        "Randy Savage",
        "The Undertaker",
        "Ric Flair"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Baseball commissioners have been lawyers, governors, lieutenants and successful businessmen. Which one of these received a doctorate?",
      "options": [
        "A.B. Happy Chandler",
        "Bud Selig",
        "Peter V. Ueberroth",
        "A. Bartlett Giamatti"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "A golf player addresses their ball and is half way through their backswing when a gust of wind rolled the ball back an inch. What is the ruling?",
      "options": [
        "The player should take no penalty but replay the shot.",
        "Since Mother Nature is to blame for the movement, there is no penalty and the player now plays the ball as it lies.",
        "The player takes one penalty stroke and replaces the ball.",
        "The player takes one penalty stroke and plays the ball as it lies."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Old Aches and Pains played twenty years for the Chicago White Sox, winning batting titles in 1936 and 1943. What is his real name?",
      "options": [
        "Frank Malzone",
        "Tony Lazzeri",
        "Luis Aparicio",
        "Luke Appling"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Golf originated in this country.",
      "options": [
        "Scotland",
        "England",
        "Wales",
        "Ireland"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which team was the first team to win four Super Bowls?",
      "options": [
        "Cowboys",
        "49ers",
        "Steelers",
        "Rams"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the score 0-0 called in tennis?",
      "options": [
        "0-0 all",
        "Love all",
        "0 to 0",
        "Love"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Where is the PRCA Wrangler National Finals Rodeo held ?",
      "options": [
        "Missouri",
        "Wyoming",
        "Nevada",
        "Texas"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In the film Coming to America, what was the name of Clarences barber shop where Clarence and his friends would discuss great boxing legends?",
      "options": [
        "A Cut Above",
        "My-T Sharp",
        "Hair Force",
        "Kwik Cuts"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is Shawn Michaels finishing move?",
      "options": [
        "Sharpshooter",
        "Frog Splash",
        "Sweet Chin Music",
        "Pedigree"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "The first night football game was played in this city.",
      "options": [
        "Pittsburgh",
        "Tioga",
        "Mansfield",
        "State College"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which player received the first MVP award of the The Philippine Basketball Association?",
      "options": [
        "Bogs Adornado",
        "Joy Dionisio",
        "Gil Cortez",
        "Tony Harris"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This great defensive back played from 1964-1977 for the Dallas Cowboys after a great career at Oregon. He was selected to the Pro Bowl 10 times.",
      "options": [
        "Herb Adderley",
        "Chuck Healey",
        "Mel Renfro",
        "Deion Sanders"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What year did the New England Patriots become a franchise?",
      "options": [
        "1960",
        "1989",
        "1981",
        "1959"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What minor league baseball team moved to Casper, Wyoming in 2001?",
      "options": [
        "Bucking Horses",
        "Casper Ghosts",
        "Buffalo Bills",
        "Cowboys"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What object is tossed into the air in the Olympic event Hammer Throw?",
      "options": [
        "A chain saw",
        "An iron ball attached to a wire",
        "A hammer",
        "A screw driver"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Bill France, Sr. is usually considered the founder of NASCAR. Which race course did Bill France Sr. and Bill France Jr. promote?",
      "options": [
        "Darlington, South Carolina",
        "Daytona, Florida",
        "Talladega, Alabama",
        "Martinsville, Virginia"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following sports is a fictional one and exists only in the imaginary world of a popular US science fiction movie?",
      "options": [
        "Air Racing",
        "Cyclocross",
        "Ringo",
        "Podracing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Select the year in which these vents took place: Petroleum production began in the Middle East, the Cubs beat the Tigers in the World Series, and the Montreal Wanderers won the Stanley Cup.",
      "options": [
        "1916",
        "1908",
        "1924",
        "1932"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the host as well as the winner of the first Soccer World Cup which was was held in 1930?",
      "options": [
        "Brazil",
        "Germany",
        "Uruguay",
        "Italy"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When was Italian football club A.C. Milan founded?",
      "options": [
        "12 March 1900",
        "22 January 1900",
        "16 December 1899",
        "29 November 1899"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In the SmackDown! US title match from the 2003 edition of SummerSlam, who walked out the US Champion?",
      "options": [
        "Rhyno",
        "Chris Benoit",
        "Eddie Guerrero",
        "Tajiri"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This American skater with a spellbinding jumping ability became the first man to land 3 quads in the same program in the year 2000.",
      "options": [
        "Todd Eldredge",
        "Johnny Weir",
        "Timothy Goebel",
        "Michael Weiss"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This player was the Hall of Fame first baseman for the Minnesota Twins.",
      "options": [
        "Harmon Killebrew",
        "Ken Stabler",
        "Hank Aaron",
        "Jeff Bagwell"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "London football clubs usually bear the name of the district their stadium is located in. Which of these teams is not based in London?",
      "options": [
        "Tottenham",
        "Chelsea",
        "Aston Villa",
        "Fulham"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "On what kind of surface is the sport called bandy practiced?",
      "options": [
        "Wooden floor",
        "Ice",
        "Trampoline",
        "Grass"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which Italian football team is known by the nickname Il Grifone, or The Griffin?",
      "options": [
        "Inter",
        "Juventus",
        "Parma",
        "Genoa"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Jayne Torvill and Christopher Dean amazed the world performing to Ravels Bolero during the 1984 Olympic Games in Sarajevo. 10 years later they skated at another Olympics. Did they win another medal?",
      "options": [
        "No, their comeback was a complete disaster.",
        "They won, but were disqualified for cheating.",
        "Yes, they won bronze.",
        "Yes, they performed to the same music and won gold again."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who is considered the father of Shotokan Karate?",
      "options": [
        "Motobu Choki",
        "Gichin Funakoshi",
        "Kenwa Mabuni",
        "Ano Itosou"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which Hall of Fame first baseman played for the Chicago Cubs?",
      "options": [
        "Tom Stephens",
        "Ron Santo",
        "Sammy Sosa",
        "Frank Chance"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This backcourt wonder and Basketball Hall of Famer was often billed as the worlds greatest dribbler. He was born in Oklahoma and attended Langston University.",
      "options": [
        "Marques Haynes",
        "John Stockton",
        "Frank McGuire",
        "DicK McGuire"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "On February 8, 1994 a Mercedes Benz cut off this actor in traffic. Having a serious case of road rage, he got out of his car, smashed the windshield and the roof of the Mercedes with a golf club and drove off. He was charged with misdemeanor assault, vandalism and battery.",
      "options": [
        "Jack Nicholson",
        "Jason Priestly",
        "Matthew Perry",
        "Andy Dick"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "At WM 23, what was the stipulation of the Battle of the Billionaires?",
      "options": [
        "Loser gets limo blown up",
        "Loser gos homeless for 2 weeks",
        "Loser gets head shaved bald",
        "Loser gets humiliated big time, anywhere"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This New York-born point guard was a star at Holy Cross before starring with the Celtics. He was one of the first point guards to be able to penetrate the defense and then dish off to another player. After his Celtics career, he became a college coach.",
      "options": [
        "K.C.Jones",
        "Jo-Jo White",
        "Bill Sharman",
        "Bob Cousy"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What animal is the official mascot of the baseball team the Seattle Mariners?",
      "options": [
        "Fox",
        "Moose",
        "Bear",
        "Whale"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "These two colleges played in the first intercollegiate nine-person baseball game.",
      "options": [
        "University of Pittsburgh and Youngstown State University",
        "Fordham University and St. Francis Xavier University.",
        "Cincinnati University and The University of Akron",
        "Rutgers University and Princeton University"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many goals did Denis Law score during his 11 seasons with Manchester United?",
      "options": [
        "260",
        "240",
        "239",
        "179"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "A golf player, on a par 5, hits their drive O.B. (Out of Bounds). What should he/she do after that?",
      "options": [
        "take a stroke penalty and drop a new ball from where the original ball entered the O.B. area",
        "take a stroke-and-distance penalty and play the ball from the tee again, as stroke 3",
        "replay the stroke without a penalty",
        "None of these"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these sports did Arthur Conan Doyle practise?",
      "options": [
        "Football",
        "Golf",
        "Cricket",
        "All of these"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In what year did Tiger Woods win the US Open Championship held at Torrey Pines?",
      "options": [
        "2006",
        "2009",
        "2008",
        "2007"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which team won five NBA titles in the 1980s?",
      "options": [
        "New York Knicks",
        "Boston Celtics",
        "Los Angeles Lakers",
        "Chicago Bulls"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first woman to run 100 meters in under 11 seconds in the Olympics?",
      "options": [
        "Margaret Abbott",
        "Asaffa Powell",
        "Evelyn Ashford",
        "Ingrid Swednersen"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In Major League Baseball, who was the first pitcher to win 200 games in his career?",
      "options": [
        "Walter Johnson",
        "A.G.Spaulding",
        "Cy Young",
        "Babe Ruth"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is the nationality of the World Boxing Organization heavyweight champion Ruslan Chagaev?",
      "options": [
        "Uzbekistani",
        "Russian",
        "Ukrainian",
        "Kazakhstani"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the nickname of The Citadel, the Military College of South Carolina?",
      "options": [
        "Bulldogs",
        "Rebels",
        "Cadets",
        "Falcons"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which ski jumper broke the world record in ski jump length (239m) in 2005?",
      "options": [
        "Bjoern Einar Romoeren",
        "Adam Ma\u0142ysz",
        "Janne Ahonen",
        "Roar Lj\u00f8kels\u00f8y"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This quarterback won the 1966 Heisman Trophy.",
      "options": [
        "Joe Namath",
        "Bert Jones",
        "Archie Manning",
        "Steve Spurrier"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This animal, possessing qualities such as resistance, strength and liveliness, was the first Olympic animal mascot, chosen for the1972 Munich Olympic games.",
      "options": [
        "Waldi, the dachshund",
        "Cobi, the dog",
        "Sam, the eagle",
        "Amik, the beaver"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Boxing legend Cassius Clay was born in Louisville, KY. What did he later change his name to?",
      "options": [
        "Tommy Morrison",
        "George Forman",
        "Johnny Rocket",
        "Muhammad Ali"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This former NFL player is given credit for the first spike in the NFL.",
      "options": [
        "Max McGee",
        "Paul Hornung",
        "Homer Jones",
        "Abner Haynes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Select the one who does not fit.",
      "options": [
        "Brian Leetch (NHL)",
        "Bonnie Sloan (NFL)",
        "William E. Hoy (MLB)",
        "Lance Allred (NBA)"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What statement concerning Shawn Michaels children is true?",
      "options": [
        "His son was born in 2000 and his daughter was born in 2004.",
        "His daughter was born in 2000 and his daughter was born in 2004.",
        "His son was born in 2005 and his daughter was born in 2003.",
        "His son was born in 1998 and his daughter was born in 2008."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Sidney Crosbys Pittsburgh Penguins jersey was the top seller on the NHLs website from September 2005 to February 2008. What number was it?",
      "options": [
        "17",
        "77",
        "87",
        "67"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "After marking their ball on the green, a golf player tosses it to their caddie to clean. Thanks to the caddies excellent hand-eye coordination, he dropped it and the ball rolled into a lake. How should the player proceed?",
      "options": [
        "Continue the hole with a new ball for no penalty",
        "Either retrieve the ball from the lake and play on or take a 1 stroke penalty and continue the hole with a new ball",
        "Either retrieve the ball from the lake and play on or take a 2 stroke penalty and continue the hole with a new ball",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What happened during the second period of Game 4 of the 1988 Stanley Cup Finals between the Boston Bruins and the Edmonton Oilers?",
      "options": [
        "The refs never showed up for the second period.",
        "The coaches had a fight on the ice.",
        "There was a bomb threat.",
        "The lights went out."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What number did Carlton Fisk, who was inducted into the Baseball Hall of Fame in 2000, wear when he played for the Chicago White Sox?",
      "options": [
        "13",
        "15",
        "72",
        "27"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Shane Battier appeared on the cover of what video game?",
      "options": [
        "NBA Live 2007",
        "NCAA March Madness 2002",
        "NCAA March Madness 2001",
        "NBA Live 2006"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is Jeff Hardys favorite sport besides wrestling?",
      "options": [
        "Motocross",
        "Football",
        "Snowboarding",
        "Basketball"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "He was a bellhop, an aerobics instructor and an amateur boxer. In 1992 he began the UFC for mixed martial arts.",
      "options": [
        "Dan Goldberg",
        "Dana White",
        "Jim Plank",
        "Tito Sanchez"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the 1958 season, the Brooklyn Dodgers moved to what city?",
      "options": [
        "Nashville",
        "Los Angeles",
        "Tampa",
        "Chicago"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who played quarterback for the New York Jets from 2000-2008?",
      "options": [
        "Chad Pennington",
        "Tom Brady",
        "Brett Farve",
        "Dan Marino"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How many different teams did Pete Rose play for in the major leagues?",
      "options": [
        "5",
        "4",
        "3",
        "2"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What MLB player won his 7th MVP Award in 2004?",
      "options": [
        "Mike Schmidt",
        "Stan Musial",
        "Roy Campanella",
        "Barry Bonds"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This city was elected to host the 1984 summer Olympics without a vote -- it was the only city to submit a bid.",
      "options": [
        "Moscow",
        "Los Angeles",
        "Tehran",
        "Montreal"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "I have a move named after me and I was born on April 25, 1947. I played for the Ajax Juniors at 10. Who am I?",
      "options": [
        "Johan Cruyff",
        "Babe Ruth",
        "Landon Donovan",
        "Terrel Owens"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What college did Nick Buoniconti attend?",
      "options": [
        "Rutgers",
        "Michigan",
        "Penn State",
        "Notre Dame"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This second baseman was in the middle of the Tinker to _______ to Chance double play combination.",
      "options": [
        "Frank Grant",
        "Bill Mazeroski",
        "Johnny Evers",
        "Nap Lajoie"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first center to lead the NBA in assists for a season?",
      "options": [
        "Bill Walton",
        "Willis Reed",
        "Kareem Abdul-Jabbar",
        "Wilt Chamberlain"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This Hall of Fame Quarterback led the Steelers to 4 Super Bowl victories in the 1970s.",
      "options": [
        "Terry Bradshaw",
        "Jim Thorpe",
        "Joe Montana",
        "John Macenroe"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The members of which of these professional wrestling teams did not begin their career together as a tag team?",
      "options": [
        "Sting and Warrior",
        "Lance Storm and Chris Jericho",
        "Curt Henning and Scott Hall",
        "Rick Steiner and Scott Steiner"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these indoor sports is most popular in Denmark?",
      "options": [
        "Handball",
        "Volleyball",
        "Basketball",
        "Water polo"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What team beat Spain 2-0 in the final of the 1984 UEFA European Football Championship, which was held in France?",
      "options": [
        "France",
        "Netherlands",
        "England",
        "Brazil"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What two baseball teams played on July 28, 1991 when Dennis Martinez pitched a perfect game?",
      "options": [
        "Montreal Expos and Chicago Cubs",
        "Montreal Expos and L.A. Dodgers",
        "L.A. Dodgers and St. Louis Cardinals",
        "Chicago Cubs and San Francisco Giants"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What type of sport is Popinjay, also known as Popingo?",
      "options": [
        "Combat sport",
        "Shooting",
        "Gymnastics",
        "Board sport"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This team is one of the five playing in the Southwest Division of the Western Conference. Tracy McGrady (as of 2005) plays for this team.",
      "options": [
        "Houston Rockets",
        "Minnesota Timberwolves",
        "San Antonio Spurs",
        "Utah Jazz"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The worlds first international football match was played in 1872 between the national teams of Scotland and which country?",
      "options": [
        "Ireland",
        "England",
        "France",
        "Spain"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many brothers does Shawn Michaels have?",
      "options": [
        "1",
        "3",
        "4",
        "2"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who became LSUs head coach before the start of the 2005 season?",
      "options": [
        "Les Miles",
        "Karl Dunbar",
        "Nick Saben",
        "Paul Bryant"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who sipped from the Stanley Cup following the 1995-1996 season?",
      "options": [
        "Ottawa Senators",
        "Colorado Avalanche",
        "Detroit Red Wings",
        "New York Islanders"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The three DiMaggio brothers, who played major league baseball at the same time, were actually born with which of the following names?",
      "options": [
        "Guiseppe, Dominic, Vincent",
        "Chico, Zeppo, Irving",
        "Joseph, Dominico, Vincente",
        "Guido, Dom, Vincenzo"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which one of these lacrosse teams is paired with the correct city?",
      "options": [
        "Long Island - Machine",
        "Toronto - Nationals",
        "Washington - Lizards",
        "Boston - Outlaws"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Derek Jeter was selected by the Yankees 6th overall in the 1992 draft. The first pick went to the Houston Astros, but they drafted this player instead.",
      "options": [
        "Brad Lidge",
        "Paul Shuey",
        "Johnny Damon",
        "Phil Nevin"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Why did Tiger Woods undergo surgery in 1994?",
      "options": [
        "He donated one of his kidneys.",
        "He had a tumor.",
        "He had rhinoplasty.",
        "He suffered from appendicitis."
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "F1 driver Michael Schumacher decided to return to the track for the 2010 season. Which team did he join?",
      "options": [
        "Ferrari",
        "Mercedes",
        "Williams",
        "Toyota"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How did boxer James J. Braddock get most of his money?",
      "options": [
        "Boxing",
        "Shipping",
        "Appearance fees",
        "From Joe Louis"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Wayne Gretzky broke the record for most points in a season in 1985-86 by getting how many points?",
      "options": [
        "214",
        "217",
        "215",
        "216"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This chess opening involves the move P-KB4 (f4) by white, and often the fianchetto of the queens bishop.",
      "options": [
        "Wing Gambit",
        "Queens Gambit",
        "Birds Opening",
        "Benko Gambit"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This Boston Red Sox Hall of Fame outfielder, who served twice in the military as a marine corps pilot, was a two-time MVP winner (1946 and 1949) and a two-time Triple Crown winner (1942 and 1947).",
      "options": [
        "Carl Yastrzemski",
        "Harry Hooper",
        "Babe Ruth",
        "Ted Williams"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "He was the first NASCAR driver with 100 career victories, as well as the first one with 200 career victories.",
      "options": [
        "Dale Earnhardt",
        "Kyle Petty",
        "Richard Petty",
        "Bobby Allison"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the director of first martial arts movie to win an Oscar?",
      "options": [
        "Ang Lee",
        "Zho Yeng",
        "Akira Kurosawa",
        "Koki Mitani"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What popular male singer did Russian tennis player and model Anna Kournikova start dating in 2001?",
      "options": [
        "Marc Anthony",
        "Enrique Iglesias",
        "Ricky Martin",
        "Justin Timberlake"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This baseball player and American national icon was known as The Sultan of Swat.",
      "options": [
        "Babe Ruth",
        "Lou Gehrig",
        "Christy Mathewson",
        "Cy Young"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what year did the the Southeastern Conference (SEC) receive permission from the NCAA to conduct an annual championship game in football?",
      "options": [
        "1991",
        "1992",
        "1993",
        "1990"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The production of the worlds first commercially available bicycles began in what year?",
      "options": [
        "1493",
        "1867",
        "1843",
        "1973"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Janne Ahonen, a top sportsman from Finland, retired in 2008, only to return to his sport a year later. What is his sport?",
      "options": [
        "Javelin",
        "Ski jumping",
        "Nordic combined",
        "WRC rallies"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Golf player A tees off, he mutters a few f-bombs as he watches his ball fly far right into trees and says, Ill play another one. Then he re-tees another ball. His 2nd ball is straighter - in the fairway. Player B claims foul as he did not say he was playing a provisional ball, using those exact words. What should then be done?",
      "options": [
        "Player A is disqualified for swearing.",
        "Player A and B both decide that it was meant as a provisional and thus Player A plays his 3rd shot from the fairway using his 2nd ball.",
        "Player B is disqualified for accusing his partner for cheating.",
        "Player A is disqualified for illegally playing a shot."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which Major League Baseball pitcher was nicknamed, The Spaceman?",
      "options": [
        "Mark Fidrytch",
        "Dennis Rodman",
        "Bill Romanowski",
        "Bill Lee"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following refers to the mechanics that work on the go kart?",
      "options": [
        "Timers",
        "Handy Men",
        "Pit Crew",
        "Secret Agents"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "After a great college career at Louisville, this center became the first star for the old Washington Bullets (now the Washington Wizards). He was less than 68 (2 m) tall but was noted for his great rebounding, picks and fabulous outlet passes. Who is this former NBA great?",
      "options": [
        "Nate Thurmond",
        "Wllis Reed",
        "David Robinson",
        "Wes Unseld"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What player won his 7th Cy Young Award in 2004?",
      "options": [
        "Greg Maddux",
        "Sandy Koufax",
        "Randy Johnson",
        "Roger Clemens"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In the fourth test, at the Melbourne Cricket Ground (MCG), Australian leg-spinner Shane Warne snared his 700th wicket, the first bowler in Test history to do so. Who did he bowl out?",
      "options": [
        "Paul Collingwod",
        "Andrew Flintoff",
        "Andrew Strauss",
        "Chris Read"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Dean Smith was the all-time wins leader among college coaches until Bobby Knight surpassed him on January 1, 2007. How many seasons did Smith coach?",
      "options": [
        "37",
        "36",
        "38",
        "39"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "May 15, 1981 saw a perfect game involving the Toronto Blue Jays and the Cleveland Indians. Who was the winning pitcher?",
      "options": [
        "John Denny",
        "Jim Clancy",
        "Dave Stieb",
        "Len Barker"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is Shawn Michaels real name?",
      "options": [
        "Michael Shawn Hickenbottom",
        "Michael Shawn Hills",
        "Michael Shawn Hicks",
        "Michael Shawn"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This country scored one of soccer World Cups biggest upsets when it defeated Brazil at the 1950 World Cup in Brazil",
      "options": [
        "Uruguay",
        "Argentina",
        "West Germany",
        "Chile"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Major League baseball player to win the MVP Award two years in a row?",
      "options": [
        "Jimmie Foxx",
        "Babe Ruth",
        "Bobby Bonds",
        "Barry Bonds"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where was the Cricket World Cup inaugurated?",
      "options": [
        "West Indies",
        "England",
        "Ireland",
        "Australia"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This was basketball player Kareem Abdul-Jabbar\u2019s name at birth.",
      "options": [
        "Kareem Abdul-Jabbar",
        "Ferdinand Lewis Alcondor, Jr.",
        "Robert Earl Moore",
        "Dennis Kucinich"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the winning pitcher in the clinching games of all three 2004 postseason series?",
      "options": [
        "Mike Timlin",
        "Keith Foulke",
        "Derek Lowe",
        "Tim Wakefield"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which former football quarterback, inducted into the Pro Football Hall of Fame in 1977, was the MVP of the first two Super Bowls?",
      "options": [
        "Eric Dickerson",
        "Bart Starr",
        "Al Davis",
        "Art Donovan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following catchers had the most home runs during his MLB career?",
      "options": [
        "Johhny Bench",
        "Yogi Berra",
        "Mike Piazza",
        "Carlton Fisk"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What type of paint is used in most .68 calibre paintballs?",
      "options": [
        "Watercolors",
        "Acrylic paints",
        "Latex",
        "Anti-climb paint"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In theory, a foursome should get around all 18 holes of a golf course in how many hours?",
      "options": [
        "4 hours",
        "7 hours",
        "2 hours",
        "6 hours"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which tennis player won the first Golden Slam in the history of tennis?",
      "options": [
        "Martina Navratilova",
        "John McEnroe",
        "Steffi Graf",
        "Pete Sampras"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Reginald Martinez Jackson, who started his career with the As, earned what nickname?",
      "options": [
        "Mr. October",
        "Cool Reggie",
        "Billys Headache",
        "Mr. Mouth"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Honky Tonk Man used a version of the swinging neckbreaker as a finishing move. What did he call this move?",
      "options": [
        "The Rock-a-bye",
        "The Rockin Roller",
        "Shake, Rattle, and Roll",
        "The one way ticket"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Robert Parish from the Boston Celtics was better known by his nickname. What was it?",
      "options": [
        "The Chief",
        "The Boss",
        "The Captain",
        "The Playmaker"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "During the mens 200m sprint at the Beijing Olympic Games, the second and third athletes were disqualified. What for?",
      "options": [
        "For running outside of their tracks",
        "For doping",
        "For false-start",
        "For their public support of Tibet"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which player, nicknamed The Captain, was the 1970 NBA Finals MVP?",
      "options": [
        "Willis Reed",
        "Wilt Chamberlain",
        "Kareem Abdul-Jabbar",
        "Jerry West"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The New York football Giants defeated the Denver Broncos in Super Bowl XXI in a convincing fashion. What was the final score?",
      "options": [
        "39-20",
        "24-10",
        "17-0",
        "44-27"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which university did NASCAR driver Ryan Newman graduate from?",
      "options": [
        "Texas Tech",
        "Iowa",
        "Notre Dame",
        "Purdue"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Although this sport originated in Cypress Gardens, Florida, it was further developed by Australians. The sport has three categories: tricks, jumping and slalom.",
      "options": [
        "Speed snorkeling",
        "Nitrox swimming",
        "Nitrox diving",
        "Barefoot waterskiing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In high school, fictional character Al Bundy played this sport and led his team to a championship.",
      "options": [
        "Hockey",
        "Baseball",
        "Football",
        "Basketball"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He was the first NFL player to intercept 14 passes in one season. He did this in his rookie year.",
      "options": [
        "Dick Lane",
        "J.C.Caroline",
        "Jerry Gray",
        "Emlenn Tunnel"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Lance Armstrong had won 7 times the prestigious Tour de France cycling race before retiring. He returned in 2009. What result did he achieve in the Tour?",
      "options": [
        "He finished 100th, with a huge gap to the winner.",
        "He didnt manage to finish.",
        "He came third.",
        "He won it again."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first baseball player to be named rookie of the year?",
      "options": [
        "Jackie Robinson",
        "Babe Ruth",
        "Barry Bonds",
        "Mickey Mantle"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the video, Searching for Animal Chin of successful skate team Bones Brigade, who was Animal Chin?",
      "options": [
        "Stacy Peralta",
        "Tony Hawk",
        "The master of skateboarding",
        "Lance Mountain"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What interesting name was given to the goal scored by Diego Maradona in 1986 at the FIFA World Cup quarter-final in Mexico between Argentina and England?",
      "options": [
        "Hand of God",
        "Hand of an angel",
        "Head of Jesus",
        "Arm of St. Paul"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What year did the Braves move to Atlanta?",
      "options": [
        "1966",
        "1968",
        "1965",
        "1967"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In which sport did actor Richard Gere excel when he was in high school?",
      "options": [
        "Gymnastics",
        "Boxing",
        "Baseball",
        "Football"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What boxer died in the 14th round in a fight against Ray Mancini on November 13, 1982?",
      "options": [
        "Duk Koo Kim",
        "Thomas Hearns",
        "Marvin Hagler",
        "Roberto Duran"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these famous baseball players became the first major league player to hit two grand slams in one game?",
      "options": [
        "Lou Gehrig",
        "Bobby Bonds",
        "Tony Lazzeri",
        "Babe Ruth"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What Russian-French grandmaster was world chess champion from 1927-1935, and then promptly lost the title to Max Euwe?",
      "options": [
        "Aron Nimzovitch",
        "Salo Flohr",
        "Jose Raul Capablanca",
        "Alexander Alekhine"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Hammerin Hank Aaron primarily played which of these positions?",
      "options": [
        "Pitcher",
        "Right Field",
        "Shortstop",
        "Second Base"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which member of the 2006 Chargers coaching staff was fired following the season?",
      "options": [
        "James Lofton",
        "Cam Cameron",
        "Wade Phillips",
        "Marty Schottenheimer"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He is one of the most influential sports agents in the NFL. His clients have included Steve Young, Troy Aikman, Warren Moon, and Kordell Stewart.",
      "options": [
        "Ed Condon",
        "Leigh Steinberg",
        "Max Plank",
        "Tom Phelan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1936, the NFL instituted the first ever draft of college players. Who was the first player ever drafted into the NFL?",
      "options": [
        "Red Grange",
        "Woody Strode",
        "George Halas",
        "Jay Berwanger"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What song was used at the climax of the 2012 Summer Olympics opening ceremony, immediately following the lighting of the cauldron?",
      "options": [
        "Eclipse by Pink Floyd",
        "Rolling in the Deep by Adele",
        "Another Brick in the Wall by Pink Floyd",
        "Beautiful Day by U2"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This 2003 movie won seven Razzies. It had an all-star cast that included Al Pacino, Lainie Kazan, Christopher Walken and a very hot couple. What is the name of this flop directed and written by Martin Brest?",
      "options": [
        "Shanghai Surprise",
        "Town and Country",
        "Gigli",
        "Shanghai Express"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This famous actor/singer owned the Pittsburgh Pirates in the 1940s.",
      "options": [
        "Dean Martin",
        "Bing Crosby",
        "Bob Hope",
        "Frank Sinatra"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "After USC lost 51-0 to Notre Dame, his postgame message to his team was: All those who need showers, take them.",
      "options": [
        "John McKay",
        "Pete Carroll",
        "Howard Jones",
        "John Wooden"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following coaches is known as the all time winningest basketball coach in NCAA history?",
      "options": [
        "Pat Summit",
        "Bobby Knight",
        "John Wooden",
        "Kay Yow"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What year did the New England Patriots go to their first Super Bowl?",
      "options": [
        "1975",
        "1994",
        "1986",
        "2001"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which pitcher recorded 511 wins while pitching in the big leagues?",
      "options": [
        "Jack Chesbro",
        "Cy Young",
        "Sandy Koufax",
        "Walter Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "As of 2007, the Original Six team with the most Stanley Cups is The Canadiens with 24, followed by The Maple Leafs with 13. Who is third with 10 cup wins?",
      "options": [
        "Bruins",
        "Rangers",
        "Red Wings",
        "Blackhawks"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which three teams are eligible to win The Commanders Trophy ?",
      "options": [
        "UCLA, USC and Stanford",
        "Indiana, Purdue and Ball state.",
        "Harvard, Yale, and Princeton",
        "Army, Navy and Air Force"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which baseball player became the first pitcher to throw 277 wild pitches?",
      "options": [
        "Nolan Ryan",
        "Juan Guzman",
        "Phil Niekro",
        "Jack Morris"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "At University High School in Waco, Texas, during his first game, football player LaDanian Tomlinson, nicknamed LT, scored how many touchdowns?",
      "options": [
        "0",
        "5",
        "2",
        "7"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which 90s sports car starred in a TV show named after it?",
      "options": [
        "Mitsubishi 3000GT",
        "Dodge Viper",
        "Chevrolet Corvette",
        "Lotus Esprit"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What jersey number has Jamal Lewis worn for the Cleveland Browns?",
      "options": [
        "92",
        "31",
        "17",
        "3"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What player stole home a record 54 times while playing with the Tigers and As?",
      "options": [
        "John Roseboro",
        "Al Kaline",
        "Ty Cobb",
        "Joe Morgan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 1976, only four years after the 1972 Dolphins won all their games, the Tampa Bay Buccaneers failed to win a game, and finished with a record of 0-14. They were last in the NFL, scoring only 125 points all season. The 1976 Bucs defense allowed 412 points, which was next to last in the league. Which team allowed the most points in 1976?",
      "options": [
        "Kansas City Chiefs",
        "New York Jets",
        "Seattle Seahawks",
        "Buffalo Bills"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What NASCAR driver won 3 races in 2003?",
      "options": [
        "Dale Jr.",
        "Jeff Gordon",
        "Mark Martin",
        "Ryan Newman"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In Chinese martial arts, the series of movements that are combined so they can be practiced as one set of movements are grouped in how many general types?",
      "options": [
        "Six",
        "Two",
        "Four",
        "Three"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In what sport does Sylvester Stallones character Lincoln Hawk compete in the 1987 movie Over the Top?",
      "options": [
        "Boxing",
        "Car racing",
        "Arm wrestling",
        "Chess"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Urban Meyer left the head coach position at the Utah Utes to become head coach of this team.",
      "options": [
        "Bowling Green",
        "University of Miami",
        "Florida St.",
        "University of Florida"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these expressions was not commonly said by Phil Rizzuto as an announcer?",
      "options": [
        "Holy Cow!",
        "High enough, deep enough, gone!",
        "Huckleberry",
        "Unbelievable!"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This neurologist was an Oxford grad who became famous for his athletic ability.",
      "options": [
        "Jonathan Swift",
        "Roger Bannister",
        "Al Oerter",
        "Michael Spitz"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which team had Manuel Francisco dos Santos, the legendary Garrincha, playing for them for 45 minutes in a game against the Fluminense/RJ in the 1960s.",
      "options": [
        "Princesa Solimoes/AM",
        "Mirassol/SP",
        "Botafogo/RJ",
        "Fortaleza/CE"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In the 1975-76 season, Darryl Sittler set the NHL record for most points scored in one game when he recorded this many points against the Boston Bruins.",
      "options": [
        "9",
        "11",
        "8",
        "10"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the distance between the free throw line and the front of the rim in a standard basketball court?",
      "options": [
        "149 yd",
        "15 ft",
        "149 m",
        "14.9 ft"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In which sport would you find Bay Matuka, Blue Charm, Green Highlander, Silver Stoat, and Logie?",
      "options": [
        "Thoroughbred Horse racing",
        "Trout Fishing",
        "Harness Racing",
        "Salmon Fishing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which player was given the Calder Cup trophy in the 2005-2006 NHL season?",
      "options": [
        "Alexander Ovechkin",
        "Eric Staal",
        "Sidney Crosby",
        "Vincent Lacavlier"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This major league baseball player is among the greatest players to ever don a Kansas City Royals uniform.",
      "options": [
        "George Brett",
        "Chris James",
        "Ken Brett",
        "Fred Lynn"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This American professional basketball player, nicknamed The Pearl, was known for his flamboyant dribbling and play-making.",
      "options": [
        "Earl Monroe",
        "Tiny Archibald",
        "Sam Jones",
        "Paul Silas"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the score of the 2008 Super Bowl?",
      "options": [
        "32-28",
        "17-14",
        "21-17",
        "42-24"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "The 2009 US Open Golf Championship was played at Bethpage Black. What was its par?",
      "options": [
        "72",
        "69",
        "71",
        "70"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which Charger led the team in receiving touchdowns in 2006?",
      "options": [
        "Antonio Gates",
        "Keenan McCardell",
        "Eric Parker",
        "Vincent Jackson"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was drafted by the Cleveland Browns first overall in the 2000 NFL draft?",
      "options": [
        "Michael Vick",
        "Courtney Brown",
        "Alge Crumpler",
        "Warrick Dunn"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What nickname was given to the Italian football club AC Milan?",
      "options": [
        "The Icon",
        "The Devil",
        "The Demon",
        "The Angel"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Saturday Nights Main Event aired on what network during the 80s and early 90s?",
      "options": [
        "NBC",
        "ABC",
        "TNT",
        "CBS"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many points did Wilt Chamberlain score in his best game versus New York?",
      "options": [
        "71",
        "82",
        "99",
        "100"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This celebration, observed on 26 December, is known as Boxing Day in in Britain, Australia, New Zealand and Canada.",
      "options": [
        "Saint Stephens Day",
        "Candlemas",
        "Perihelion",
        "Saint Patricks Day"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which professional wrestler was the very first WWF heavyweight champion of Latino descent?",
      "options": [
        "Tito Santana",
        "Pedro Morales",
        "Eddie Guerrerro",
        "Rey Mysterio"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The team that won the first Little League World Series was from which city?",
      "options": [
        "Morrisville, Pa.",
        "WIlliamsport, Pa.",
        "Gary, Pa.",
        "Taipei, Taiwan"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What year did Dennis Bergkamp join Arsenal?",
      "options": [
        "1996",
        "1993",
        "1991",
        "1995"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What player was widely regarded as the best left-handed pitcher in the American League before he was switched to playing the outfield?",
      "options": [
        "Al Simmons",
        "Ty Cobb",
        "Babe Ruth",
        "Joe Dimaggio"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the name of Tony Hawks son, who was born in 1992?",
      "options": [
        "Riley Hawk",
        "Frank Hawk",
        "Tony Hawk Jr.",
        "Chad Hawk"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What was the original name for basketball?",
      "options": [
        "Courtball",
        "Roundball",
        "YMCA-ball",
        "Naismithball"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This team won its first division title in the 1969-70 season, when Spencer Heywood signed with the club.",
      "options": [
        "Philadelphia 76ers",
        "Detroit Pistons",
        "Chicago Bulls",
        "Denver Nuggets"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who acquired soccer club A.C. Milan in 1986?",
      "options": [
        "Joy Damato",
        "Tinto Brass",
        "Benito Craxi",
        "Silvio Berlusconi"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first catcher in the history of baseball to wear a mask?",
      "options": [
        "Bill Lennon, 1871",
        "Fred Thayer, 1877",
        "Hank Gowdy, 1917",
        "Muddy Ruel , 1924"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "After the 1974 season, the Milwaukee Brewers traded Dave May and Roger Alexander for this slugger.",
      "options": [
        "Gorman Thomas",
        "Henry Aaron",
        "Willie Mays",
        "Robin Yount"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "A record for the fastest goal was set at the start of an NHL playoff game on April 17, 1972. How long after the start of the playoff game was it scored?",
      "options": [
        "3 seconds",
        "4 seconds",
        "5 seconds",
        "6 seconds"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many seasons did baseball player Hank Aaron spend with the Milwaukee Brewers?",
      "options": [
        "5",
        "2",
        "0",
        "1"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which team won Super Bowl III in 1969?",
      "options": [
        "Packers",
        "Colts",
        "Jets",
        "Browns"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "How many times did the Yankees win consecutive World Series crowns, before the start of the new millennium?",
      "options": [
        "6",
        "4",
        "2",
        "7"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The book The Boys of Summer tells the story of this baseball team.",
      "options": [
        "The Boston Celtics",
        "The New York Yankees",
        "The Saint Louis Cardinals",
        "The Brooklyn Dodgers"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Yelena Isinbayeva has often been referred to as the tsarina of pole vault, so it was not a surprise when she won the event at the Beijing Olympics. She also set a world record, by jumping this high.",
      "options": [
        "6.00",
        "6.05",
        "5.05",
        "5.00"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which statement is true about Yogi Berras military service?",
      "options": [
        "Yogi never served in the military.",
        "Yogi served in the US Navy.",
        "Yogi served in the Us Air Force.",
        "Yogi served in the US Army."
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "At which track did Ryan Newman win his first Cup Series points race?",
      "options": [
        "New Hampshire",
        "Pocono",
        "Dover",
        "Michigan"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these teams won the UEFA Champions League trophy after trailing 0:3 at half-time during the final match?",
      "options": [
        "Real Madrid",
        "Bayern Munich",
        "Liverpool",
        "AC Milan"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the real first name of golf champion Tiger Woods?",
      "options": [
        "Edward",
        "Eldrick",
        "Edwin",
        "Ewan"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "United is an American professional soccer club located in this city.",
      "options": [
        "Boston",
        "Dallas",
        "Washington DC",
        "Chicago"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The All-American Girls Professional Baseball League existed during these years.",
      "options": [
        "1943-1954",
        "1944-1950",
        "1943-1955",
        "1942-1946"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these is NOT a ski resort in the Catskill Mountains?",
      "options": [
        "Windham",
        "Greek Peak",
        "Hunter",
        "Belleayre"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was baseball announcer Joe Garagiolas best friend in childhood ?",
      "options": [
        "Stan Musial",
        "Yogi Berra",
        "Red Barber",
        "Chris Schenkel"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first Commissioner of Major League Baseball?",
      "options": [
        "Lt. Gen. William D. Eckert",
        "Bowie Kent Kuhn",
        "A.B. Happy Chandler",
        "Kenesaw Mountain Landis"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these became the Red Soxs home ballpark in 1912?",
      "options": [
        "Wrigley Fields",
        "National Park",
        "PNC Park",
        "Fenway Park"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Several universities can be heard yelling Hold that tiger. Hold that tiger as their team rushes to the field. But only one university has each player touch Howards Rock and run straight down a steep hill into the stadium know as Death Valley. What university would you be visiting when these Tigers take the field?",
      "options": [
        "Clemson",
        "Auburn",
        "Memphis",
        "LSU"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which player broke the record for the most home runs by a shortstop in one season in 2002?",
      "options": [
        "Alex Rodriguez",
        "Ernie Banks",
        "Miguel Tejada",
        "Derek Jeter"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This quote is from a coach that was so successful in his field that they named the champions trophy after him: We didnt lose the game; we just ran out of time.",
      "options": [
        "Vince Lombardi",
        "Red Auerbach",
        "Bear Bryant",
        "John W. Heisman"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which statement about athlete Danuta Rosani is true?",
      "options": [
        "She was the first Italian female athlete to win an Olympic gold medal.",
        "She was the first athlete in the track and field events to be disqualified in the Olympics for a banned substance.",
        "She was the first Russian athlete to escape to the USA.",
        "She was the first female athlete found to be technically a male."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who won the 1962 Little League World Series?",
      "options": [
        "Osaka, Japan",
        "Austin, Tx.",
        "San Jose, Ca.",
        "Lakewood, N.J."
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 1913, this young athlete became the first American-born golfer to win the US Open.",
      "options": [
        "Francis Ouimet",
        "Arnold Palmer",
        "Harry Vardon",
        "Gene Sarazen"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What famous NBA basketball star made an appearance as co-pilot Murdock in the movie Airplane!?",
      "options": [
        "Kareem Abdul-Jabbar",
        "Kevin McHale",
        "Magic Johnson",
        "Julius Irving"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This European player was drafted in 2001 by the San Antonio Spurs. He became the youngest player ever to appear in a game with the Spurs making his NBA debut at 19 years old.",
      "options": [
        "Peja Stojakovic",
        "Vlade Divac",
        "Raul Lopez",
        "Tony Parker"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which former University of Southern California Trojans member lost the race for Governor of Pennsylvania?",
      "options": [
        "Justin Fargas",
        "Lynn Swann",
        "Willie Wood",
        "Chris Cash"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What former football player from the University of Southern California was a first round draft choice of the New York Jets but caused so much turmoil that the Jets soon traded him?",
      "options": [
        "Keyshawn Johnson",
        "Terrell Owens",
        "Randy Moss",
        "Dwayne Jarrett"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which quarterback in the NFL is the second cousin of Atlanta Falcons quarterback Michael Vick?",
      "options": [
        "Aaron Brooks",
        "Mike Vanderjagt",
        "T. J. Houshmanzadah",
        "Steve McNair"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The Milwaukee Braves left town to move where?",
      "options": [
        "Nashville",
        "None of these",
        "Boston",
        "Atlanta"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What is the height of former NBA player, Michael Jordan?",
      "options": [
        "68",
        "67",
        "6 6",
        "65"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This player, known as the Iron Horse, spent seventeen seasons with the New York Yankees hitting 493 home runs. When he retired, he brought the crowd at Yankee Stadium to tears by saying he was the luckiest man on the face of the earth.",
      "options": [
        "Hank Bauer",
        "Joe DiMaggio",
        "Lou Gehrig",
        "Babe Ruth"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who is known as the father Missouri Tiger Basketball?",
      "options": [
        "Norm Stewart",
        "Warren Hearnes",
        "Mike Anderson",
        "Don Faurot"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This NASCAR Nextel Cup Series and Busch Series driver won the 2005 Golden Corral 500.",
      "options": [
        "Carl Edwards",
        "Tony Stewart",
        "Jimmie Johnson",
        "Bobby Labonte"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Istanbul is the home city of the most powerful Turkish soccer teams. Which of the following teams is not based in Istanbul?",
      "options": [
        "Genclerbirligi SK",
        "Fenerbahce",
        "Galatasaray",
        "Besiktas"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "For which college did Reggie Jackson play baseball?",
      "options": [
        "UCLA",
        "Arizona State",
        "Florida",
        "Texas"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first man to win gold medals in three straight Olympic Games?",
      "options": [
        "Michael Johnson",
        "Rafer Johnson",
        "Ray Ewry",
        "Jim Thorpe"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "On the first day of the 2008 Olympic Games, three American women took all medals in which event?",
      "options": [
        "Cycling - road race",
        "Fencing - sabre",
        "Swimming - 400m freestyle",
        "Shooting - 10m air rifle"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On July 27 2012, Queen Elizabeth II opened the Olympic Games for the second time in her reign. When was the first time she opened the Olympic Games?",
      "options": [
        "Sidney, Australia 2000",
        "Montreal, Canada 1976",
        "Munich, West Germany 1972",
        "Rome, Italy 1960"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which Brazilian team made a 10-year agreement in 2004 with the international fund of investors Media Sports Investment (MSI)?",
      "options": [
        "CFA/RO",
        "Ceara/CE",
        "Fortaleza/CE",
        "Corinthians/SP"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "He is the shortest player ever to win the Slam Dunk Contest.",
      "options": [
        "Kobe Bryant",
        "Vince Carter",
        "Tracy McGrady",
        "Spud Webb"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these songs, inducted into the Grammy Hall of Fame, was not recorded by the singer-songwriter, born Robert Allen Zimmerman?",
      "options": [
        "Blowin in the Wind",
        "Aint No Mountain High Enough",
        "Mr. Tambourine Man",
        "Like a Rolling Stone"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the 1970s the Swiss biologist Hermann Brandt developed a sport which would depend on teamwork and would not involve the terrible injuries that are so common in other sports. What sport did he invent?",
      "options": [
        "Canopying",
        "Tchoukball",
        "Netball",
        "Orienteering"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which athlete was described by Time Magazine as the Philippines sole bona fide international sports superstar?",
      "options": [
        "Paeng Nepomoceno",
        "Efren Bata Reyes",
        "Manny Pacman Pacquiao",
        "Sam Milby"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many members of the 1972 Miami Dolphins made it to the Pro Bowl that year?",
      "options": [
        "9",
        "6",
        "13",
        "7"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "How many perfect scores did Nadia Comaneci receive in the 1976 Montreal Olympics?",
      "options": [
        "1",
        "2",
        "None",
        "7"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what year did a young John McEnroe first qualify and amazingly reach the semi finals at Wimbledon ?",
      "options": [
        "1978",
        "1977",
        "1975",
        "1976"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the movie \u201cCaddyshack, if one of the caddies won the caddy championship, what did he get in return?",
      "options": [
        "$1,000",
        "Two weeks off with pay",
        "A date with Judge Smails niece",
        "A scholarship"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is Chipper Jones actual first name?",
      "options": [
        "Larry",
        "George",
        "Paul",
        "Peter"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was the New York Mets player who hit 3 home runs in one game in the 1999 National League Division Series held at Shea Stadium?",
      "options": [
        "It never happened.",
        "Carlos Delgado",
        "Darryl Strawberry",
        "Mike Piazza"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 1956, during game 5 of the World Series, the New York Yankees beat the Brooklyn Dodgers 2 to 0 and it took Don Larsen just 97 pitches to complete the game. What catcher caught the game for the Yankees?",
      "options": [
        "Elston Howard",
        "Yogi Berra",
        "Bill Skowron",
        "Enos Slaughter"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these players won the Super Bowl MVP despite his teams loss?",
      "options": [
        "Harvey Martin",
        "Randy White",
        "Roger Staubach",
        "Chuck Howley"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This man, who was head coach at The Ohio State University for 28 years, delivered the following words: There was no one who had better people than I did, or better football players. And, we outworked the other teams.",
      "options": [
        "Dan Devine",
        "Lou Holtz",
        "Woody Hayes",
        "Knute Rockne"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What MLB All-Star and University of South Alabama alumnus was voted the leagues all-time greatest baseball player during the leagues 30th Anniversary celebration in 2006?",
      "options": [
        "Luis Gonzalez",
        "Juan Pierre",
        "Lance Johnson",
        "Jon Lieber"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This giant company owns The Home Depot center, The Los Angeles Kings, The L.A. Galaxy, the Houston Dynamo, the David Beckham Academy, ATP London, the Los Angeles Riptides, the Staples Center, and almost one-eighth of the Los Angeles Lakers. What is the name of this company?",
      "options": [
        "International Sporting Management",
        "Anschutz Entertainment Group",
        "WMG Management",
        "The Southern Cal Sporting Group"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many professional American football teams were there at the end of the 1920 season?",
      "options": [
        "30",
        "14",
        "5",
        "15"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NBA player to win Rookie of the Year and MVP in the same season?",
      "options": [
        "Jerry West",
        "Wilt Chamberlain",
        "Elgin Baylor",
        "Bill Russell"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where is the Wizards team based?",
      "options": [
        "Miami",
        "Washington D.C.",
        "Kansas City",
        "Boston"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "At New Years Revolution 2007, the WWE Womens Champion was Mickie James. Who did she face?",
      "options": [
        "Victoria",
        "Candice Michelle",
        "Trish Stratus",
        "Ashley"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This second baseman played for the Twins and the Angels during his career.",
      "options": [
        "Bid McPhee",
        "Joe Morgan",
        "Rod Carew",
        "Johnny Evers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How many balls are on the snooker table at the beginning of the game?",
      "options": [
        "22",
        "20",
        "15",
        "19"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What NFL teams logo is a horseshoe?",
      "options": [
        "Bears",
        "Colts",
        "Ravens",
        "Falcons"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which football tight end said Im a f*****g soldier. in a an interview, after a game against the University of Tennessee?",
      "options": [
        "Kellen WInslow Jr",
        "Randy Moss",
        "Terrell Owens",
        "Jeremy Shockey"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This defensive back played for San Francisco from 1961-1976. He was All-Pro four times. His brother was a great decathlon athlete and one of Robert Kennedys bodyguards.",
      "options": [
        "Jimmy Johnson",
        "Elroy OBrien",
        "Rod Woodson",
        "Dallas Thompson"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these wrestlers became WWF Intercontinental Champion on April 12, 1999?",
      "options": [
        "The Godfather",
        "Hacksaw Jim Duggan",
        "Vader",
        "Bad News Allen"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first gymnast ever to score a perfect 10.0?",
      "options": [
        "Shannon Miller",
        "Cathy Rigby",
        "Nadia Comaneci",
        "Mary Lou Retton"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the top European club competition in mens basketball?",
      "options": [
        "ULEB Cup",
        "NBA",
        "Euroleague",
        "Champions League"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which two football players played high school football together at Mount Carmel High School?",
      "options": [
        "Marvin Harrison and Jerry Rice",
        "Warren Sapp and Terrell Owens",
        "Tiki and Ronde Barber",
        "Donovan McNabb and Simeon Rice"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "These were the first two first basemen to win the Triple Crown.",
      "options": [
        "Lou Gehrig and Carl Yastremski",
        "Lou Gehrig and Ty Cobb",
        "Jimmy Foxx and Ty Cobb",
        "Jimmy Foxx and Lou Gehrig"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This Yankee shortstops clutch home run made a real dent in the Red Sox in the 1978 playoffs. His given name is Russell Earl. What is his jock name?",
      "options": [
        "Ducky",
        "Bucky",
        "Hopalong",
        "Lucky"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What number do Travis Pastranas motorcycles carry?",
      "options": [
        "123",
        "199",
        "1",
        "183"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This Philadelphia-born athlete was in five Pro Bowls, and in the 1960s All-Decade Team. In 1980, he was inducted into the Pro Football Hall of Fame.",
      "options": [
        "Lem Barney",
        "Dennis Smith",
        "Johnny Sample",
        "Herb Adderley"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many players are on a soccer team?",
      "options": [
        "9",
        "12",
        "10",
        "11"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The crest of which London soccer team features a crossed pair of hammers?",
      "options": [
        "Chelsea FC",
        "Fulham FC",
        "West Ham",
        "Arsenal"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of the mechanism at the bottom of pro-cyclists shoes?",
      "options": [
        "Cleats",
        "Fleats",
        "Sleet",
        "Beat"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Why finishing third in the group stage is important in the UEFA Champions League?",
      "options": [
        "One of the 8 teams that finished third can play in play-offs.",
        "It guarantees qualification to the following season competition.",
        "The team only gains prestige.",
        "The third team of each group goes to UEFA Cup."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In this year Cy Young threw the first perfect game in modern baseball history, movie star Cary Grant was born, and Give My Regards to Broadway was initiated in a Broadway theater.",
      "options": [
        "1904",
        "1906",
        "1900",
        "1908"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which of the following was the first Olympic Games mascot?",
      "options": [
        "an eagle",
        "a panda",
        "a kangaroo",
        "a cartoon character"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Patty Berg was quite a fine golfer. She won the first US Womans Open in 1946. What significant accomplishment did she make in 1959?",
      "options": [
        "She wore a very revealing outfit.",
        "She scored a hole-in-one.",
        "She won the event and the tennis Grand Slam.",
        "She won the event left-handed."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This most popular skiing style, offered by many resorts, is used for recreation among both professionals and non-professionals.",
      "options": [
        "Skijoring",
        "Alpine skiing",
        "Freestyle skiing",
        "Cross country skiing"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When the New Jersey Devils won the Stanley Cup in 2003, where did goaltender, Martin Brodeur take the Cup?",
      "options": [
        "to a car show",
        "to a diner",
        "to the bathroom",
        "to a movie theatre"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "From 1880 to 1903 only two perfect games were thrown. Who were the two winning pitchers?",
      "options": [
        "Ike Delock and Ed Runge",
        "John Lee Richmond and John Montgomery Ward",
        "Walter Johnson and Harry Suitcase Simpson",
        "Ed Cicotte and Augie Donatelli"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who is a libero in a volleyball team?",
      "options": [
        "A player that always stands by the net",
        "The play-maker, who passes balls to attacking players",
        "Its the 7th player, allowed to join only if his team trails by more than 8 points",
        "A player who cannot attack nor block"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year was the longest overtime game in the Stanley Cup playoffs played, prior to the 2006/2007 seasons playoffs.",
      "options": [
        "1973",
        "1967",
        "2006",
        "1936"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which was the first NFL team to have an insignia put on its helmets?",
      "options": [
        "Rams",
        "Redskins",
        "Eagles",
        "Bears"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "On August 12 of this year, the Major League Baseball players went on strike which resulted in the cancellation of the World Series.",
      "options": [
        "1996",
        "1994",
        "1991",
        "1993"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Quentin Richardson, who signed with the New York Knicks in 2005, played college basketball at what school?",
      "options": [
        "Missouri",
        "Memphis",
        "DePaul",
        "Cincinnati"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which two famous baseball personalities grew up on the same street as Yogi Berra?",
      "options": [
        "Joe Garagiola and Phil Rizzuto",
        "Joe Buck and Pete Gray",
        "Joe Garagiola and Joe Buck",
        "Phil Rizzuto and Pete Gray"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1972 RB Larry Csonka rushed 213 times for how many yards?",
      "options": [
        "1,098",
        "1,178",
        "2,143",
        "1,117"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What golf term refers to a score of a 3 on a par 5?",
      "options": [
        "Par",
        "Birdie",
        "Bogey",
        "Eagle"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which leading man in a popular TV Western series briefly played both professional baseball and basketball?",
      "options": [
        "Chuck Connors",
        "Dennis Weaver",
        "Lorne Greene",
        "James Arness"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "With which team did Joe Carter start his career?",
      "options": [
        "Padres",
        "Blue Jays",
        "Indians",
        "Cubs"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which two teams played in the first World Series of baseball to be held west of St. Louis, starting on October 1, 1959, with Game 3 being played on October 4?",
      "options": [
        "Oakland As v Boston Red Sox",
        "LA Dodgers v NY Yankees",
        "LA Dodgers v Chicago White Sox",
        "San Francisco Giants v Chicago Cubs"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which NFL team won Super Bowl XL on February 5, 2006?",
      "options": [
        "Seattle Seahawks",
        "Philadelphia Eagles",
        "New England Patriots",
        "Pittsburgh Steelers"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This man, born in 1963 in New york, is the inventor of the ollie, a skateboarding move.",
      "options": [
        "Natas Kapas",
        "Tommy Guerro",
        "Mike McGill",
        "Alan Gelfand"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What sport did M*A*S*H character Father Mulcahy practice as an amateur when he was younger?",
      "options": [
        "Baseball",
        "Basketball",
        "Boxing",
        "Football"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What country hosted the 2000 Summer Olympics, also known as the Games of the New Millennium, and officially called the Games of the XXVII Olympiad?",
      "options": [
        "United States",
        "Greece",
        "Australia",
        "China"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What style of Kung Fu is not a Southern one?",
      "options": [
        "Eagle Claw",
        "Wing Chun",
        "Five Ancestors",
        "Dragon"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who won the 2006 Pepsi 400 on July 1 and celebrated it by climbing a fence?",
      "options": [
        "Kurt Busch",
        "Carl Edwards",
        "Tony Stewart",
        "Kyle Busch"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "After five seasons as a roving instructor for the Seattle Mariners, this man eventually got hired by the New York Mets as the pitching coach, a position he held for ten years.",
      "options": [
        "Rube Walker",
        "Bob Apodaca",
        "Mel Stottlemyre",
        "Joe Pignatano"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This Brazilian football player is one of the most famous Vasco da Gama players and one of the best goal scorers in the history of Brazilian football, with a total of 744 goals in his professional career.",
      "options": [
        "Edmundo",
        "Ronaldo",
        "Pele",
        "Roberto Dinamite"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This legendary golfer won the PGA Championship a record-tying 5 times and is third in total major wins behind Jack Nicklaus and Tiger Woods.",
      "options": [
        "Arnold Palmer",
        "Walter Hagen",
        "Ben Hogan",
        "Gene Sarazen"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This Hall of Famer played corner back for New England from 1972-1986 and for Oakland from 1983-1989. He played his college ball at Arizona State.",
      "options": [
        "Adalius Thomas",
        "Mike Woodson",
        "Willie Wood",
        "Mike Haynes"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "During which season was the number of teams in the English Premiership reduced to 20?",
      "options": [
        "1993-94",
        "1992-93",
        "1997-98",
        "1995-96"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Why do NASCAR cars turn left?",
      "options": [
        "For safety reasons",
        "It brings good luck.",
        "Richard Petty wanted it that way.",
        "people think its better going left than right"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the two brothers who were both professional skaters in the late 70s, then resurfaced in the 80s to become dominant riders once again?",
      "options": [
        "Steve and Mickey Alba",
        "Stan and Mike McGill",
        "Steve and Tony Alva",
        "Frank and Duane Peters"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "His brother was boxing heavyweight champ. He fought Tyson for the heavyweight title, but lost in an early round KO. Who was he?",
      "options": [
        "Michal Spinks",
        "Danny Lewis",
        "Johnny Fullmer",
        "Steve Norton"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Find the correct statement about Yankee Stadium.",
      "options": [
        "Yankee Stadiums original name was The New York Yankee Baseball Field.",
        "The New York Yankees have always played their regular season games at Yankee Stadium.",
        "Yankee Stadium was always an exclusively baseball field.",
        "Yankee Stadium was the first three-tiered sports facility."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What city was awarded the 1920 Olympics to honor the suffering that had been inflicted on the Belgian people during World War I?",
      "options": [
        "Charleroi",
        "Antwerp",
        "Gent",
        "Brussels"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This Russian chess player played during the 1960s and was one of the first to analyze his opponents earlier games. He is also one of the few players to hold a full-time job as an engineer.",
      "options": [
        "Paul Keres",
        "Mikhail Botvinnik",
        "Mikhail Tal",
        "Tigran Petrosian"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This English city is home to a top European soccer team, which contains the word United in its name and is nicknamed The Red Devils.",
      "options": [
        "Liverpool",
        "Manchester",
        "London",
        "Glasgow"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "He developed basketball as a five-player sport while a faculty member of Springfield College.",
      "options": [
        "Rodney Duff",
        "Amos Alonzo Stagg",
        "Dr. James Naismith",
        "Joe Namath"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This center fielder for the 1983 Phillies was nicknamed Secretary of Defense and wore uniform #31.",
      "options": [
        "Greg Gross",
        "Alejandro Sanches",
        "Garry Maddox",
        "Bob Molinaro"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which was the first U.S. college to win back-to-back NCAA basketball championships?",
      "options": [
        "UCLA",
        "Oklahoma AM",
        "North Carolina",
        "Duke"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This quarterback won the 1996 Heisman Trophy.",
      "options": [
        "Eli Manning",
        "Archie Manning",
        "Danny Wuerffel",
        "Peyton Manning"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "I will not rest until I have you holding a Coke, wearing your own shoe, playing a Sega game featuring you, while singing your own song in a new commercial, starring you, broadcast during the Superbowl, in a game that you are winning, and I will not sleep until that happens. Ill give you fifteen minutes to call me back. (1996)",
      "options": [
        "Saving Private Ryan",
        "Jerry Maguire",
        "American Beauty",
        "Eternal Sunshine of the Spotless Mind"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The tattoo around the Undertakers neck reads Sara. Who is Sara?",
      "options": [
        "His niece",
        "His cousin",
        "His daughter",
        "His wife"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "To win the pitching Triple Crown, a pitcher must lead his league in these categories.",
      "options": [
        "Wins, ERA, strikeouts",
        "Win-loss percentage, saves, strikeouts",
        "Wins or saves, ERA, strikeouts",
        "Wins, ERA, Saves"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This British car make was founded under the name Swallow Sidecar Company in 1922, and is known for its elegant sports cars and luxury saloons.",
      "options": [
        "Land Rover",
        "Bentley",
        "Jaguar",
        "Rolls-Royce"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This quarterback played his college ball at Louisville and his pro ball for Philadelphia. In a game against the Bears, he scored 15 points.",
      "options": [
        "David Akers",
        "George Blanda",
        "Adam Vinatierri",
        "Lou Groza"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How many players are allowed on the ice during an ice hockey game?",
      "options": [
        "10",
        "12",
        "6",
        "5"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What number did O. J. Simpson, a member of the Pro Football Hall of Fame, wear when he played for the Buffalo Bills in the 70s?",
      "options": [
        "32",
        "33",
        "34",
        "44"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This great sportsman was the first football player to be all-pro at defensive back one year and running back another.",
      "options": [
        "Gifford",
        "Grange",
        "Thorpe",
        "Haynes"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NBA player to get 181 triple doubles?",
      "options": [
        "Wilt Chamberlain",
        "Earvin Johnson",
        "Oscar Robertson",
        "Michael Jordan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This team drafted and then exchanged for another player Chris Webber in 1993.",
      "options": [
        "Golden State Warriors",
        "Orlando Magic",
        "Miami Heat",
        "Sacramento Kings"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "When this Yankee retired, he had the record for most World Series most home runs during his career? He still holds that record as of 2005.",
      "options": [
        "Reggie Jackson",
        "Roger Maris",
        "Mickey Mantle",
        "Babe Ruth"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In which of these Brazilian championships soccer legend Pel\u00e9 never played in a team which finished first?",
      "options": [
        "Campeonato Brasileiro",
        "Sao Paulo championship",
        "World Cup",
        "Internacional Costa Rica championship"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This switch hitter, known as the Commerce Comet, was inducted into the Hall of Fame in 1974.",
      "options": [
        "Eddie Murray",
        "Mickey Mantle",
        "Ken Singleton",
        "Bobby Murcer"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Mark Bellhorn hit a home run from each side of the plate in a single inning. Who is the other switch hitter to have accomplished this feat?",
      "options": [
        "Ruben Sierra",
        "Chipper Jones",
        "Carlos Baerga",
        "Jorge Posada"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "On what surface is the Wimbledon tournament played?",
      "options": [
        "clay",
        "carpet",
        "grass",
        "hard"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which White Sox hitter had the highest career batting average?",
      "options": [
        "Joe Jackson",
        "Frank Thomas",
        "Eddie Collins",
        "Luke Appling"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This player of the Philippine Basketball Association (PBA), nicknamed the Triggerman, broke several Filipino and PBA all-time records, including the most points scored in a single game by a Filipino.",
      "options": [
        "Alvin Patrimonio",
        "Johnny Abarientos",
        "Ramon Fernandez",
        "Allan Caidic"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Jim Brown was a great back for the Cleveland Browns. Jay Silverheels was a movie actor. What do they have in common?",
      "options": [
        "They were bornon the same date.",
        "They were both in the movie The Longest day.",
        "They are in the same Hall of Fame.",
        "They were both in the movie The Dirty Dozen."
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The 1980 Summer Olympics, officially known as the Games of the XXII Olympiad, were held in this country.",
      "options": [
        "The Soviet Union",
        "Italy",
        "Finland",
        "Australia"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Where was Michael Fred Phelps born and raised?",
      "options": [
        "Bethesda, Md",
        "Silver Spring, Md",
        "Baltimore, Md",
        "Washington D.C."
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How many saves did Brad Lidge finish the regular 2008 season with?",
      "options": [
        "37",
        "39",
        "41",
        "45"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In which round was Leon Washington drafted by the New York Jets?",
      "options": [
        "1st",
        "4th",
        "2nd",
        "3rd"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Denton True Young is the true birth name of this pioneer pitcher, whose name graces baseballs premier annual pitching award (the Cy Young Award). But how did he acquire the nickname Cy?",
      "options": [
        "He would sigh audibly on the rare occasions when he walked a batter.",
        "Its short for Seymour, his mothers name.",
        "Its short for cyclone, because of the power of his fastball.",
        "Its short for Cyclops, the fearsome, one-eyed monster."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NBA player to average a triple double for an entire season?",
      "options": [
        "Wilt Chamberlain",
        "Oscar Robertson",
        "Bill Russell",
        "Elgin Baylor"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This football player turned actor appeared in four Rocky movies playing boxer Apollo Creed.",
      "options": [
        "Carl Weathers",
        "Fred Williamson",
        "Fred Weathers",
        "Carl Williamson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the movie The Bad News Bears, what is the name of the coach of the Bears, portrayed by Walter Matthau?",
      "options": [
        "Morris Engelberg",
        "Forest Green",
        "Fred Eichelberger",
        "Morris Buttermaker"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "A natural right-hander, this golfer plays left-handed, probably because he copied his fathers swing. He was the second left-handed golfer to win the Masters.",
      "options": [
        "Jim Furyk",
        "Phil Mickelson",
        "Retief Goosen",
        "Corey Pavin"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which statement describes best the University of Southern California?",
      "options": [
        "It is a state school located in Los Angeles, California.",
        "It is a private school located in Los Angeles, California.",
        "It is a state school located in Westwood, California",
        "It is a private school located in Palo Alto, California."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many teams played in the 2006 edition of the UEFA Champions League?",
      "options": [
        "48",
        "24",
        "16",
        "32"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1917, a starting pitcher walked the first batter, was ejected and then the relief pitcher pitched perfectly for the rest of the game. Who was the ejected pitcher?",
      "options": [
        "Dizzy Dean",
        "Walter Johnson",
        "Babe Ruth",
        "Ed Cicotte"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "By scoring 206 runs in the first innings of the second test of the 2006\u201307 Ashes series, he became only the third Englishman to score a double-century in Australia. Can you name him?",
      "options": [
        "Marcus Trescothick",
        "Kevin Pietersen",
        "Andrew Strauss",
        "Paul Collingwood"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which second baseman was known as the silent captain of the Red Sox?",
      "options": [
        "Joe Morgan",
        "Bid McPhee",
        "Johnny Evers",
        "Bobby Doerr"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What sport are the Washington Generals associated with?",
      "options": [
        "American Football",
        "Baseball",
        "Soccer",
        "Basketball"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the very first manager of The Undertaker?",
      "options": [
        "Mr. Fiji",
        "Brother Love",
        "Captain Lou Albano",
        "Paul Bearer"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What track and field athlete became double Olympic champion at the 2012 Olympic Games in London, taking gold in both the 5000 and 10,000 metres?",
      "options": [
        "Galen Rupp",
        "Tariku Bekele",
        "David Rudisha",
        "Mo Farah"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first player to steal a base in a World Series game?",
      "options": [
        "Ty Cobb",
        "Jim Bagby",
        "Jim Sebring",
        "Honus Wagner"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This point guard was a team leader for Seattle and the Celtics. After his college career at Pepperdine, he played in the NBA from 1976-1990. Although always a great leader, he never was a head coach. Who was he?",
      "options": [
        "Hal Greer",
        "Dennis Johnson",
        "Hal Lear",
        "John Stockton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This movie, which opens with scenes from a football game, stars Keanu Reeves as Shane Falco.",
      "options": [
        "Chain Reaction",
        "Hardball",
        "The Watcher",
        "The Replacements"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This Major League Baseball player, whose uniform with #42 was retired on April 15, 1997 by Major League Baseball, became the first African-American to be inducted into the Baseball Hall of Fame.",
      "options": [
        "Rosy Grier",
        "Jack Roosevelt Robinson",
        "Jesse Owens",
        "Jim Brown"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1980, University of Georgia running back Herschel Walker gained 1616 yards to break the previous record for most yards rushed by a freshman. What running back held this record before Herschel broke it?",
      "options": [
        "Oklahomas Billy Sims",
        "Penn States Kurt Warner",
        "Pittsburghs Tony Dorsett",
        "Texas Earl Campbell"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which team beat the Patriots in Super Bowl XX?",
      "options": [
        "Bears",
        "Eagles",
        "Panthers",
        "Rams"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "I won 10 Olympic medals including 9 golds, and 10 World Championships medals including 8 golds, during my career that spanned from 1979 to 1996. My events were the 100, 200, 4X100 relay and the long jump. Who am I?",
      "options": [
        "Maurice Greene",
        "Marion Jones",
        "Torri Edwards",
        "Carl Lewis"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Today in Major League Baseball a ground rule double is when a ball is hit fair, bounces and then goes over the outfield. Which statement is true about this rule?",
      "options": [
        "It was always a rule in the National League but became an American League rule in 1927.",
        "It wasnt a rule until 1930.",
        "It was made a rule in both leagues in 1919.",
        "It became a rule when the baseball rules were canonized in 1886."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In which of the two swimming strokes can the flip turn be used in competitions?",
      "options": [
        "backstroke and breast stroke",
        "free style and backstroke",
        "butterfly and breaststroke",
        "butterfly and free style"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these former basketball players has the most NCAA Championship wins and NBA Championship wins combined?",
      "options": [
        "Michael Jordan",
        "Kareem Abdul Jabbar",
        "Bill Russell",
        "Sam Jones"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "During which Olympics were swimming goggles first used?",
      "options": [
        "1906 Athens",
        "1976 Montreal",
        "1984 Los Angeles",
        "1980 Moscow"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "After the 2007 season there were two people tied for the most games with 3 or more home runs in MLB history. Which of the players listed below is a co-owner of that record?",
      "options": [
        "Sammy Sosa",
        "Babe Ruth",
        "Mickey Mantle",
        "Barry Bonds"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This game is played on an icy, low friction surface. It is sort of a combination of bowling, shuffle board, and house sweeping.",
      "options": [
        "Hurling",
        "Whirling",
        "Curling",
        "Knurling"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This former pro football player was the vice presidential candidate for the losing side in 1996.",
      "options": [
        "Jim Brown",
        "Jack Kemp",
        "Jim Kelly",
        "OJ Simpson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What was the previous name of the club that became Harlequins in 1860?",
      "options": [
        "Harrow Football Club",
        "Hanworth Football Club",
        "Hanwell Football Club",
        "Hampstead Football Club"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What sport did Jean-Claude Van Damme start practicing at the age of sixteen?",
      "options": [
        "Ballet",
        "Gymnastics",
        "Boxing",
        "Swimming"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 1998 this pitcher wore a baseball cap that Babe Ruth had worn in 1920.",
      "options": [
        "Roger Clemens",
        "Jimmy Keys",
        "Dan Wetteland",
        "David Wells"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who won the first chess tournament in the USA?",
      "options": [
        "John Marshall",
        "Henry Bird",
        "Paul Morphy",
        "Adolph Anderssen"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which fact is true about the two baseball players named Goose?",
      "options": [
        "Their playing days were separated by some 50 years.",
        "Both their given names are Gander.",
        "Both were pitchers.",
        "They both loved foie gras."
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He was the first NBA player to hit 98.1 % of his free throws in a season.",
      "options": [
        "Calvin Murphy",
        "Bill Sharman",
        "Jose Calderon",
        "Dolph Schayes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where did the 1928 Summer Olympics, or the Games of the IX Olympiad, take place?",
      "options": [
        "Argentina",
        "The Netherlands",
        "Spain",
        "South Korea"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Where is the Bowling Hall of Fame located?",
      "options": [
        "Canastota, NY",
        "Stroudsberg, PA",
        "Saint Louis, MO",
        "Tucson, AZ"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these former MLB players has the most career strike outs?",
      "options": [
        "Steve Carlton",
        "Nolan Ryan",
        "Chet Lemon",
        "Curt Schilling"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Bret Favres first pass as a Packer was caught by this player.",
      "options": [
        "Bubba Franks",
        "Himself",
        "Donald Driver",
        "Antonio Freeman"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This person is considered the most important man in the world of golf. Without him, PGA Tour events get very low TV ratings.",
      "options": [
        "Arnold Palmer",
        "Jim Collins",
        "Jack Nicklaus",
        "Tiger Woods"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1958, Ted Williams signed an extension with the Boston Red Sox to make him the highest paid player in Major League Baseball at the time. How much was it for?",
      "options": [
        "$527,000",
        "$135,000",
        "$73,000",
        "$206,000"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Par is the theoretical number of strokes that an expert golfer should require for playing the ball into any given hole. If the distance from the starting position to the hole is 225 m - 434 m, then the par is this.",
      "options": [
        "6",
        "4",
        "5",
        "3"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What are colors of the outfits of the national football (soccer) team of Sudan, when playing home and away respectively?",
      "options": [
        "Red and white",
        "Green and blue",
        "Green and Orange",
        "Yellow and red"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these players collected over 200 hits ten times during his career?",
      "options": [
        "Wade Boggs",
        "Pete Rose",
        "Ty Cobb",
        "Willie Keeler"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Cincinnati Red Stockings were the first professional baseball team. They played in the first professional game in 1869. Who did they beat?",
      "options": [
        "The Toledo Mud Hens",
        "Antioch College",
        "The Canton Bull Dogs",
        "Kentucky College"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many runs does a cricket batsman score by clearing the boundary of the playing field in a single hit?",
      "options": [
        "1",
        "6",
        "10",
        "4"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In the movie Miracle, coach Herb Brooks had to cut a player just before the start of the Olympics. Who was the unfortunate player?",
      "options": [
        "Ralph Cox",
        "Dave Christian",
        "Steve Janaszak",
        "Mark Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This Wisconsin-born end had the nickname Crazylegs?",
      "options": [
        "Jerry Rice",
        "Elroy Hirsch",
        "Lance Alworth",
        "Len Goodman"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This former linebacker for the Dallas Cowboys played for the University of Alabama from 1960-1962.",
      "options": [
        "Herschel Walker",
        "Lee Roy Jordan",
        "Pat Sullivan",
        "Terry Beasley"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How many different Figure Skating World Champions in the mens division were there from 1995 to 2005?",
      "options": [
        "10",
        "9",
        "5",
        "8"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During a fight, Muhammad Ali kept asking this boxer, What is my name?.",
      "options": [
        "Ernie Terrell",
        "Floyd Patterson",
        "Zora Folley",
        "Clevland Williams"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The New River is famous for what sport?",
      "options": [
        "Trout fishing",
        "Fly fishing",
        "Canoeing",
        "White-water rafting"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which of these countries was never represented in the UEFA Champions League from 1991 to 2007?",
      "options": [
        "Bulgaria",
        "Ireland",
        "Poland",
        "Finland"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first Major League Baseball pitcher to strike out ten consecutive batters?",
      "options": [
        "Ron Davis",
        "Blake Stein",
        "Nolan Ryan",
        "Tom Seaver"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Where did the Boston Braves move to?",
      "options": [
        "Washington",
        "San Diego",
        "Atlanta",
        "Milwaukee"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which one of the following MLB veterans hit over 20 home runs in a single season?",
      "options": [
        "J.T. Snow",
        "Mark Grace",
        "Keith Hernandez",
        "Tim Raines"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This is the nickname of the first NBA players to play in over 1610 games.",
      "options": [
        "Air Jordan",
        "The Stilt",
        "The Chief",
        "Ice Man"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Guess the nickname of Ty Cobb, who Won the Triple Crown in 1909.",
      "options": [
        "Corn on the Cobb",
        "The Georgia Peach",
        "Kernal Cobb",
        "Georgia On My Mind"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which European soccer player was named European Soccer Player of the Year three times (1988, 89 and 92) and FIFA World Player of the Year in 1992?",
      "options": [
        "Ruud Gullit",
        "Marco van Basten",
        "Franco Baresi",
        "Paolo Maldini"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What religion did Tiger Woods acquire from his mother, Kultida Woods?",
      "options": [
        "Roman Catholicism",
        "Buddhism",
        "Protestantism",
        "Islam"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first US female gymnast to win the all around gold at a fully-attended Olympics?",
      "options": [
        "Shannon Miller",
        "Mary Lou Retton",
        "Carly Patterson",
        "Shawn Johnson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What does a Golf Ball Marshal do?",
      "options": [
        "They are retired golf players",
        "They win golf championships",
        "They carry golf sticks",
        "They search for lost golf balls"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What NFL team went 16-0 for the 2007 season and lost to the New York Giants in the Super Bowl?",
      "options": [
        "The Green Bay Packers",
        "Carolina Panthers",
        "New York Jets",
        "New England Patriots"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many times did Tiger Woods win the PGA Championship prior to 2007?",
      "options": [
        "4",
        "5",
        "2",
        "3"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This tag team won their title match but Vince McMahon decided that the title reign had to be anulled and edited out of the broadcast.",
      "options": [
        "The Rockers",
        "The Killer Bees",
        "Marty Jannety and 1-2-3 Kid",
        "Men On a Mission"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In which volleyball finals did USA participate, in the 2008 Olympics?",
      "options": [
        "Both",
        "Mens",
        "None",
        "Womens"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "When did Shawn Michaels win his first WWE Championship?",
      "options": [
        "2003",
        "1997",
        "1996",
        "2002"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What is specific to the stick fighting known as Istunka?",
      "options": [
        "It is a martial arts festival in Somalia.",
        "It uses fire-hardened sticks.",
        "It comes from Southern Sudan.",
        "It is practiced by herd boys."
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which second baseman was known for breaking the color barrier?",
      "options": [
        "Johnny Evers",
        "Nellie Fox",
        "Jackie Robinson",
        "Joe Morgan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following did not serve as a head coach at the University of Georgia?",
      "options": [
        "Vince Dooley",
        "Ray Goff",
        "Pat Dye",
        "Wally Butts"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "From 2000-2007, Dale Earnhardt, Jr. drove for what famous sponsor?",
      "options": [
        "Pepsi",
        "Miller",
        "Budweiser",
        "Coca-Cola"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What is the home stadium of the New York Mets?",
      "options": [
        "Wrigley Field",
        "Yankee Stadium",
        "Fenway Park",
        "Shea Stadium"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In the anime series, Prince of Tennis, who is Echizens last opponent during the National Tournament?",
      "options": [
        "Kintarou Tooyama",
        "Akutsu",
        "Kuranosuke Shiraishi",
        "Echizen Ryoga"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "At the beginning of his professional golf career, Tiger Woods signed a contract with this sports equipment giant.",
      "options": [
        "Puma",
        "Kappa",
        "Adidas",
        "Nike"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Tommy Bond was the first pitcher to qualify as a Triple Crown winner, but this great pitcher was the first to win it in the 20th century.",
      "options": [
        "Christy Mathewson",
        "Cy Young",
        "Tim Keefe",
        "Walter Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The San Diego Clippers, who moved to Los Angeles, California and changed their name to the Los Angeles Clippers, finished 1984 with what record?",
      "options": [
        "15-67",
        "25-57",
        "31-51",
        "20-62"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following occurred in the 1984 Winter Olympics?",
      "options": [
        "The USA won no gold medals.",
        "American figure skaters came in 1-2.",
        "Two brothers came in 1-2 in the Alpine Slalom.",
        "Russia lead with 112 gold medals."
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What baseball team played their first game on April 5, 1993?",
      "options": [
        "Atlanta Braves",
        "Florida Marlins",
        "Houston Astros",
        "Colorado Rockies"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which former San Diego Charger scored a touchdown against his former team in the Chargers 2006 playoff loss?",
      "options": [
        "Reche Caldwell",
        "Drew Brees",
        "Jesse Chatman",
        "Derek Farmer"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In the sport of figure skating, what is the term for a jump which includes a one-half extra rotation, generally considered to be the hardest one?",
      "options": [
        "Salchow",
        "Flip",
        "Axel",
        "Lutz"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Of the following countries, which one did NOT host both the winter and summer Olympics in the same year?",
      "options": [
        "France",
        "United States",
        "Germany",
        "Japan"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these baseball nicknames comes from a 1990 hit movie?",
      "options": [
        "The Perfect Storm",
        "O-Dog",
        "Hot Diggerty Dog",
        "Pat the Bat"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During what period of time did the original Ottawa Senators franchise run?",
      "options": [
        "1919-1920",
        "1917-1934",
        "1915-1926",
        "1920-1925"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which one of the following players reached the 200+ home run career mark?",
      "options": [
        "Bo Jackson",
        "Tim Wallach",
        "Matt Nokes",
        "John Kruk"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "When were the first formal rules of basketball devised?",
      "options": [
        "1903",
        "1940",
        "1892",
        "1935"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following court types are allowed in racquetball?",
      "options": [
        "It is played outdoors",
        "Three-walled courts",
        "One-walled courts",
        "All of these"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In which country did the sport called campdrafting originate?",
      "options": [
        "Ireland",
        "Australia",
        "United states",
        "Canada"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which of these female tennis players has held the longest winning streak?",
      "options": [
        "Martina Navratilova",
        "Chris Evert",
        "Margaret Court",
        "Steffi Graf"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "For which team did Jim Catfish Hunter pitch a perfect game?",
      "options": [
        "The Oakland As",
        "The New York Yankees",
        "The Washington Senators",
        "The Minnesota Twins"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first Super Bowl MVP for the New England Patriots?",
      "options": [
        "Drew Bledsoe",
        "Tom Brady",
        "Deion Branch",
        "Randy Moss"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of the main character in the American series Kung Fu (1972-1975)?",
      "options": [
        "Kwai Chang Caine",
        "David Carradine",
        "Master Po",
        "Master Kan"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "When was the first intercollegiate basketball game played?",
      "options": [
        "January 18, 1907",
        "January 18, 1904",
        "January 18, 1885",
        "January 18, 1896"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Each year a Liberty Medal is given on July 4th to a prominent world leader in honor of Independence Day. Which award is the medal accompanied by?",
      "options": [
        "$50, 000",
        "$70, 000",
        "$100, 000",
        "$200, 000"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In which sport are the Delaware Destroyers sports team competing?",
      "options": [
        "Ice hockey",
        "Baseball",
        "Football",
        "Basketball"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which team won the Stanley Cup following the 1999-2000 season?",
      "options": [
        "Dallas Stars",
        "Mighty Ducks of Anaheim",
        "Colorado Avalanche",
        "New Jersey Devils"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When did the Los Angeles Dodgers win the fall classic led by Fernando Valenzuela?",
      "options": [
        "1982",
        "1981",
        "1983",
        "1980"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This placekicker started his career in 1982 with the New Orleans Saints. He was 46 when he re-signed with the Atlanta Falcons in 2006.",
      "options": [
        "Jay Feely",
        "Jason Elam",
        "Morten Andersen",
        "Josh Brown"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the name of Shawn Michaels second wife whom he married in 1999?",
      "options": [
        "Victorta",
        "Rachel",
        "Rebecca",
        "Vikki"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What player, wearing uniform #45, pitched the final strike for the 1980 World Champion Philadelphia Phillies?",
      "options": [
        "Tug McGraw",
        "Pete Rose",
        "Mike Schmidt",
        "Steve Carlton"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NBA player to win MVP, All Star MVP, and Finals MVP in the same season?",
      "options": [
        "Shaquille Oneal",
        "Willis Reed",
        "Magic Johnson",
        "Michael Jordan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What European politician and former Prime Minister co-wrote the anthem of a famous football club?",
      "options": [
        "Tony Blair",
        "Vladimir Putin",
        "Dominique de Villepin",
        "Silvio Berlusconi"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What number did Hank Aaron wear for the Atlanta Braves?",
      "options": [
        "44",
        "15",
        "26",
        "7"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What was Mordecai Browns nickname?",
      "options": [
        "Black and Blue Brown",
        "Three Fingers",
        "Music Mordecai",
        "Whizzer"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This baseball commissioner played a vital role in convincing the Chicago Cubs to install lights at the Wrigley Field stadium instead of reimbursing the league for lost night games.",
      "options": [
        "Fay T. Vincent",
        "Peter V. Ueberroth",
        "Bud Selig",
        "A. Bartlett Giamatti"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Former NBA player Michael Jordan won his second Olympic gold medal in what year?",
      "options": [
        "1996",
        "1984",
        "1992",
        "1988"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where did Ben Wallace, signed by the Chicago Bulls in 2006, play college basketball?",
      "options": [
        "Iona",
        "Virginia Commonwealth",
        "Virginia Union",
        "UNC-Wilmington"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Zlatan Ibrahimovic is a .. Swedish football player. He was born in Sweden to a family of immigrants. What country did his parents leave to move to Sweden?",
      "options": [
        "Sri Lanka",
        "Azerbaijan",
        "Former Yugoslavia",
        "Ghana"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This team won the 1994 NCAA Division I-A national football championship. The motto of the team is: Not the victory but the action. Not the goal but the game. In the deed the glory.",
      "options": [
        "Ohio State",
        "Oklahoma",
        "Florida St",
        "Nebraska"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What MLB player set a record for most career hits in 1985?",
      "options": [
        "Pete Rose",
        "Ty Cobb",
        "Stan Musial",
        "Hank Aaron"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The 1988 Summer Olympics, officially called Games of the XXIV Olympiad, were hosted by this Asian country.",
      "options": [
        "India",
        "China",
        "Japan",
        "South Korea"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which university mascot made the April 28, 1997 cover of Sports Illustrated?",
      "options": [
        "Smokey",
        "Handsome Dan",
        "Sue E Pig",
        "Uga"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was Kobe Bryants dads nickname?",
      "options": [
        "Hot Hands",
        "The Philadelphia Prolific",
        "Jellybean",
        "Highflyer"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What year did the popular television sitcom Coach first hit the airwaves?",
      "options": [
        "1991",
        "1987",
        "1989",
        "1993"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Carlton Fisk was a successful Major League Baseball player, who played for 24 years with the Boston Red Sox and Chicago White Sox, in what position?",
      "options": [
        "Left Field",
        "Catcher",
        "None of the Above",
        "Pitcher"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where is the International Tennis Hall of Fame located?",
      "options": [
        "Paris, France",
        "London, England",
        "New York, NY",
        "Newport, Rhode Island"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "On October 13,1960, the Pirates got a homerun from Bill Mazeroski. What is significant about this homerun in baseball history?",
      "options": [
        "It completed the only hitting for a cycle in a World Series game winning the series for Pittsburgh in game 6.",
        "It is the only inside the park homerun in a World Series Game that beat the Yankees in Game 5 of the World Series.",
        "It was the first walk off homerun in a World Series Game 7 that won the Series against the Yankees.",
        "It was the first Grand Slam in World Series history, winning Game 7 and the Series versus the Yankees."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What former Houston Astros player was nicknamed The Toy Cannon?",
      "options": [
        "Jim Umbricht",
        "Jose Cruz",
        "Nolan Ryan",
        "Jimmy Wynn"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "I was born on October 30th 1960 and in 1982 I was transferred to Barcelona for a record \u00a35.000.000 as a transfer fee. Who am I?",
      "options": [
        "Diego Maradona",
        "Jaime Moreno",
        "Alecko Eskandarian",
        "Julio Roberts"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Rudolph Walter Wanderone Jr. was a famous player in what sport?",
      "options": [
        "football",
        "professional wrestling",
        "pool",
        "thoroughbred racing"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What happens with a paintball if put in water for 24 hours or more?",
      "options": [
        "It explodes",
        "Nothing",
        "It expands",
        "It contracts"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Although it was first done in 1988, the mens quad was not successfully landed in Olympic Games until 1998. Which lucky figure skater has his name in the history books for this achievement?",
      "options": [
        "Todd Eldredge",
        "Elvis Stojko",
        "Ilia Kulik",
        "Alexei Yagudin"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the real name of professional wrestler Kelly Kelly?",
      "options": [
        "Kelly Blank",
        "Shannon Brooks",
        "Barbara Blank",
        "Carly Colon"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Oliver Stones 1999 movie Any Given Sunday is about a fictional team competing in what sport?",
      "options": [
        "Tennis",
        "American football",
        "Boxing",
        "Baseball"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Baseball Hall of Fame honored this commissioner with an annual award bearing his name presented to a baseball broadcaster for major contributions to the game.",
      "options": [
        "A.B. Happy Chandler",
        "A. Bartlett Giamatti",
        "Kenesaw Mountain Landis",
        "Ford C. Frick"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What country did boxing champion Lennox Lewis represent?",
      "options": [
        "England",
        "Texas",
        "Ireland",
        "Canada"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What position did Shane Battier play at Duke?",
      "options": [
        "Point Guard",
        "Small Forward",
        "Power Forward",
        "Center"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which goaltender has the nickname King Henrik?",
      "options": [
        "Henrik Suave",
        "Henrik Park",
        "Henrik Lundqvist",
        "Henrik Nittymaki"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Miklos Szabados, Cai Zhenhua, and Michael Maze are prominent players in this sport.",
      "options": [
        "Table tennis",
        "Slalom skiing",
        "Speed skating",
        "Gymnastics"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "When Joseph Pilates moved to England at the age of 32, what did he do for a living?",
      "options": [
        "He was a banker.",
        "He was a physical therapist.",
        "He was a boxer.",
        "He was a professor."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 2007, Fabio Capello was appointed head coach of Englands national football team. His name tells that he is most likely from this country.",
      "options": [
        "Greece",
        "Serbia",
        "Italy",
        "France"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The US Open Tennis Championships were first contested in 1881 as the US National Championships. What events did the players compete in?",
      "options": [
        "mens singles",
        "mens singles and mens doubles",
        "mens singles and womens singles",
        "mens singles and womens doubles"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What pitcher pitched a no hitter on July 4th 1983?",
      "options": [
        "Bob Stanley",
        "Dave Righetti",
        "Bill Sudakis",
        "John Tudor"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In 1956 Ted Kennedy was a starting end on what Ivy League football team?",
      "options": [
        "Yale",
        "Boston College",
        "Princeton",
        "Harvard"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what football team hasnt Johan Cruyff played throughout his career?",
      "options": [
        "Barcelona",
        "Milan",
        "Los Angeles Aztecs",
        "Washington Diplomats"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which team did Dennis Eckersley start his career with?",
      "options": [
        "Oakland As",
        "Cleveland Indians",
        "Cincinnati Reds",
        "San Diego Padres"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Tommy Brown broke the Major League record for the youngest person to hit a home run. How old was he?",
      "options": [
        "17 years, 2 months and 7 days",
        "18 years, 6 months and 122 days",
        "16 years, 4 months and 11 days",
        "15 years, 4 months and 19 days"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This former ice hockey defenseman, born in Ontario, Canada, played 465 games as a New York Ranger and wore number 2.",
      "options": [
        "Brad Park",
        "Guy Lafleur",
        "Clint Smith",
        "Maurice Richard"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The 70th single-season home run baseball hit by this man on October 4, 2001, was sold online for $52,500 by Charles Murphy, the man who caught the ball.",
      "options": [
        "Jose Conseco",
        "Barry Bonds",
        "Luis Gonzales",
        "Mark McGwire"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these ladies dated both Matt Hardy and Edge?",
      "options": [
        "Laura Bush",
        "Amy Dumas",
        "Trish Stratus",
        "Codi Davis"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first Olympian to win gold in the same event in four straight Olympics.",
      "options": [
        "Al Oerter",
        "Michael Johnson",
        "Rafer Johnson",
        "Jim Thorpe"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which first baseman was drafted by the St. Louis Cardinals in 1999?",
      "options": [
        "So Taguchi",
        "Albert Pujols",
        "Jim Edmonds",
        "Scott Rollen"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Former professional wrestler Bob Backlund has held the WWF/WWE world title how many times?",
      "options": [
        "1 time",
        "5 times",
        "2 times",
        "3 times"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This Canadian Mohawk Indian actor, who was inducted into the Western Performers Hall of Fame in 1993, is best known for his many appearances as the Lone Rangers friend, Tonto.",
      "options": [
        "Wes Studi",
        "Iron Eyes Cody",
        "Jay Silverheels",
        "John Two Eagles"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which former Ute was nominated for the Heisman Trophy, and drafted number 1 in the 2005 NFL Draft?",
      "options": [
        "Alex Smith",
        "Paris Warren",
        "Eric Weddle",
        "Quinton Ganther"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This this former LSU star was the first number one draft choice to sign with the AFL rather than the NFL.",
      "options": [
        "King Hill",
        "Tommy Mason",
        "Pete Gogolak",
        "Billy Cannon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first major league baseball player from Japan?",
      "options": [
        "Masanori Murakami",
        "Yashigawa Tabata",
        "Hideki Irabu",
        "Hideki Nomo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He was the first NHL player to buy his former team.",
      "options": [
        "Wayne Gretsky",
        "Patrick Roy",
        "Mario Lemieux",
        "Gordie Howe"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the nickname of the Arsenal F.C. English football club?",
      "options": [
        "The Spikes",
        "The Revolvers",
        "The Rifles",
        "The Gunners"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is Tommys favorite sport in the TV series Rescue Me?",
      "options": [
        "Baseball",
        "Basketball",
        "Ice Hockey",
        "Football"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How old was Bobby Fischer when he won the US chess championship on January 8th 1958?",
      "options": [
        "14",
        "22",
        "12",
        "19"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This man has the record achievement of over 14,000 Major League at-bats.",
      "options": [
        "Minnie Minoso",
        "Cal Ripken, Jr.",
        "Pete Rose",
        "Carl Yastrzemski"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which newly acquired player, upon seeing Nomar Garciaparra leaving the Red Sox clubhouse the day of the 2004 trading deadline, said, Please tell me I wasnt traded for Nomar?",
      "options": [
        "Curtis Leskanic",
        "Orlando Cabrera",
        "Doug Mientkiewitz",
        "Dave Roberts"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which Milan\u2019s defender won six scudetti (Serie A league titles) and three European Cups and his #6 jersey was retired by the club?",
      "options": [
        "Mauro Tassotti",
        "George Best",
        "Franco Baresi",
        "Alessandro Costacurta"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which medal depicts three naked men with their hands on each others shoulders?",
      "options": [
        "The NAMBY Award",
        "The Horatio Alger Prize",
        "The Clio Award",
        "The Nobel Peace Prize"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He was a right-handed pitcher for the Yankees, Athletics, Indians and Mets. In 1962 he was the World Series MVP and won the Babe Ruth Award.",
      "options": [
        "Abner Terry",
        "Terry Pritchard",
        "Ralph Terry",
        "Bill Terry"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which company was the first to start producing catchers mitts?",
      "options": [
        "Bresnahan",
        "Wilson",
        "Draper and Maynard",
        "Rawlings"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Ronald Reagan had many early careers. One of his first was as a Sportscaster for WHO Radio in Des Moines, Iowa. What future president did he watch play in an Iowa - Michigan football game that he called?",
      "options": [
        "Dwight Eisenhower",
        "John F. Kennedy",
        "Gerald Ford",
        "Richard Nixon"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This football player, who spent his entire career with Serie A club A.C. Milan, has been acknowledged as one of the greatest defenders ever to play the game.",
      "options": [
        "Franco Baresi",
        "Kaka",
        "Hernan Crespo",
        "Andrey Shevshenko"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This second baseman played for the Cincinnati Reds with Pete Rose, Johnny Bench, and Tony Perez.",
      "options": [
        "Frank Grant",
        "Ryne Sandberg",
        "Joe Morgan",
        "Bill Mazeroski"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which former US President said I know Im getting better at golf because I hit fewer spectators.",
      "options": [
        "George W. Bush",
        "Carter",
        "Eisenhower",
        "Ford"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "These were the first two NBA players to be traded after winning the MVP Trophy.",
      "options": [
        "Wilt Chamberlain and Karl Malone",
        "Karl Malone and Oscar Robertson",
        "Moses Malone and Austin Carr",
        "Moses Malone and Wilt Chamberlain"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This player scored the famous hand of god goal at the 1986 World Cup.",
      "options": [
        "Pele",
        "Paolo Rossi",
        "Diego Maradonna",
        "David Beckham"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the Stanley Cup champion in 1998-1999?",
      "options": [
        "Detroit Red Wings",
        "New Jersey Devils",
        "Dallas Stars",
        "Colorado Avalanche"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This athlete, awarded The Most Excellent Order of the British Empire, set a world record in womens marathon in 2003.",
      "options": [
        "Paula Radcliffe",
        "Mary Lines",
        "Emma George",
        "Stacy Dragila"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This man was very influential in NCAA football and NFL football. He played right field for the New York Yankees and was a Rose Bowl MVP.",
      "options": [
        "Reggie Bush",
        "George Halas",
        "John Elway",
        "Bo Jackson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This spare outfielder came to the Mets on June 15, 1977 as part of the infamous Tom Seaver trade with the Reds. He hit only .230 in four seasons at Shea.",
      "options": [
        "Joel Youngblood",
        "Ellis Valentine",
        "Steve Henderson",
        "Dan Norman"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1951, this city set a new record for the most fans at a basketball game.",
      "options": [
        "New York City",
        "Berlin",
        "Los Angeles",
        "Melbourne"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Dynamo is an MLS team based in this city.",
      "options": [
        "Cleveland",
        "Dallas",
        "Portland",
        "Houston"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who set an NFL record for the most pass attempts in a season in 1994?",
      "options": [
        "Drew Bledsoe",
        "Doug Williams",
        "John Elway",
        "Bernie Kosar"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Georgi Asparuhov, Magdalena Maleeva, Dan Kolov and Tanya Bogomilova are all great athletes from this nation.",
      "options": [
        "Hungary",
        "Bulgaria",
        "Romania",
        "Serbia"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who is believed to have introduced martial arts in China?",
      "options": [
        "Sima Qian",
        "The First Emperor Qin Shi Huangdi",
        "The Yellow Emperor",
        "Li Bai"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which U.S. football team has Franz Beckenbauer played between 1977 and 1980, and again in 1983?",
      "options": [
        "Columbus Crew",
        "D.C. United",
        "New York Cosmos",
        "New York Red Bulls"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What are the main animals used in a rodeo?",
      "options": [
        "horses and cattle",
        "cattle and pigs",
        "horses and goats",
        "horses and buffalo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "George Herman Ruth, better known as the Babe, usually played this position.",
      "options": [
        "Center Field",
        "Right Field",
        "Catcher",
        "Left Field"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "As a child, this male pairs skater skated singles. Upon losing to a younger skater from the same town, he switched to pairs. He later became a 2-time World Champion and Olympic Champion with his partner, after overcoming a near-fatal accident. Who is he?",
      "options": [
        "Jason Dunjeon",
        "Maxim Marinin",
        "Lloyd Eisler",
        "Peter Caruthers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the minimum number of baseball players, allowed on the field at one time?",
      "options": [
        "8",
        "11",
        "10",
        "9"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When James Bond is invited to play this sport, in 1965s, Thunderball, he remarks that he knows more about women, than about this sport.",
      "options": [
        "Horse riding",
        "Archery",
        "Tennis",
        "Shooting clay pigeons"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This person, widely regarded as the founder of the modern Olympic Games, presented his ideas of reviving the Olympics at a 1894 congress, held in Paris.",
      "options": [
        "Father Henri Martin Didon",
        "Harold Abrahams",
        "Pierre de Coubertin",
        "Gaston Doumergue"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Only one of the combinations (player - his 2003/2004 squad number) is correct, which one?",
      "options": [
        "Beckham - 10",
        "Solskjaer - 20",
        "Keane - 17",
        "G. Nevilee - 3"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which company became A.C. Milans main sponsor during the 2010/2011 season?",
      "options": [
        "Opel",
        "Fly Emirates",
        "Pierelli",
        "Bwin"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first Little League baseball player to become US President?",
      "options": [
        "Gerald Ford",
        "Bill Clinton",
        "Lyndon B. Johnson",
        "George W. Bush"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Shaun Rodgers, who joined the Cleveland Browns in 2008, plays what position?",
      "options": [
        "Wr and QB",
        "Wr, Db",
        "LB",
        "Wr"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Your opponent in tennis hits a drop shot. It lands just on your side of the net. You run as fast as you can to get to it. Your opponent has hit it with so much slice (back-spin) that, before you can get to it, it bounces back over to his side of the net. Your opponent then hits the ball out of bounds. Who wins the point, if anybody, and why?",
      "options": [
        "Nobody wins the point. Its a let. Whenever a hit ball bounces on one side of the net and goes back to the other side of the net without being hit back, the point is played over.",
        "Your opponent wins the point, because you failed to hit the ball back to his side of the net when he hit the drop shot.",
        "You win the point, because your opponents previous shot, the drop-shot which bounced back over to his side of the court, was an illegal shot.",
        "You win the point, because your opponent hit the ball out."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the Charlotte Bobcats record for their very 1st season?",
      "options": [
        "18-64",
        "23-59",
        "14-68",
        "25-57"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Name the last Negro League baseball player to play in the major leagues.",
      "options": [
        "Willie Mays",
        "Hank Aaron",
        "Vic Power",
        "Don Newcombe"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How many points are awarded to the winner of a ski jumping competition in the World Cup circuit?",
      "options": [
        "10",
        "100",
        "25",
        "50"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which Hall of Fame pitcher was known as Rapid Robert?",
      "options": [
        "Bob Miller",
        "Bob Turley",
        "Bob Feller",
        "Bob Esposito"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During the 1963-64 season, he set the United record for most goals in one season -- 46.",
      "options": [
        "Ruud Van Nistelrooy",
        "Bobi Charlton",
        "Erik Cantona",
        "Denis Law"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When was the first Pro Bowl game held?",
      "options": [
        "1939",
        "1935",
        "1970",
        "1955"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "During which season did Manchester United first become English Champions?",
      "options": [
        "1958-59",
        "1956-57",
        "1907-08",
        "1910-11"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This historic soccer player began his career as a poor boy from the slums in Tres Coracoes, Brazil. By the time of his retirement he had scored over a 1000 goals most of which for his Club Santos. Who is this world-famous soccer player?",
      "options": [
        "Ronaldhino",
        "Pele",
        "Kaka",
        "Maradona"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The Cincinnati Reds, a Major League Baseball, became World Champions in what year?",
      "options": [
        "1970",
        "1973",
        "1977",
        "1975"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Known for his elegant edges, this young figure skater was in a tragic accident in 1996 while skating at a show in Mexico. He was told he would never walk again. He came back in the fall of 1997, and until 2004 when he retired he was a fan favorite in competitions, usually earning bronze at best. However, he did rank second in the 2001-2002 Skate America and at the European Championships in 2002. Who is this man, who went on to win the Russian National Championships in the 2002-2003 season?",
      "options": [
        "Alexei Yagudin",
        "Alexander Abt",
        "Evgeni Plushenko",
        "Ilia Klimkin"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Snowboarding, an increasingly common extreme sport, became an official Olympic Games sport at which Winter Olympic Games?",
      "options": [
        "2002 Winter Olympics (USA)",
        "1992 Winter Olympics (France)",
        "1998 Winter Olympics (Japan)",
        "1984 Winter Olympics (Norway)"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many times must athletes circle the stadium in the Olympic 10km run?",
      "options": [
        "20",
        "50",
        "10",
        "25"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many goaltenders must a team have on their roster according to the NHL rules?",
      "options": [
        "1",
        "2",
        "As many as they want",
        "4"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The actor who played Oddjob in the Bond movie Goldfinger won an Olympic Medal. Which statement is true about him?",
      "options": [
        "He won an Olympic Gold Medal in karate in the 1960 Olympics.",
        "He was born in Japan and died in Los Angeles, California.",
        "His name was Toshiyuki Harold Sakata.",
        "He won an Olympic Gold Medal in weightlifting in the 1956 Olympics."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Georgia is a proud member of the Southeastern Conference - Eastern Division, together with the 2006 National Champions, the Florida Gators. Which team is not a member of the SEC-East?",
      "options": [
        "Vanderbilt",
        "Auburn",
        "Tennessee",
        "Kentucky"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player was caught stealing a total of 335 bases in his major league career.",
      "options": [
        "Lou Brock",
        "Maury WIlls",
        "Joe Morgan",
        "Rickey Henderson"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was the highest score in the UEFA Champions League history from 1991/1992 until 2006/2007?",
      "options": [
        "Ajax Amsterdam - FA Red Boys Differdange 14:0",
        "Dinamo Bucharest - Crusaders 11-0",
        "Liverpool - Besiktas 8:0",
        "Arsenal - Slavia Prague 7:0"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "He invented the aerial skateboarding trick, McTwist and first performed it in public in 1984 at the Del-Mar Skatepark contest.",
      "options": [
        "Steve Cabellero",
        "Tony Hawk",
        "Lance Mountain",
        "Mike McGill"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "She was only 4 ft 8.5 inches (1.43 m) tall but won a gold medal in the 1996 Olympics vaulting with a wrenched ankle. What was her name?",
      "options": [
        "Dominique Moceanu",
        "Wendy Bruce",
        "Betty Okino",
        "Kerri Strug"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What NFL team did O.J. Simpson play for at the end of his career?",
      "options": [
        "San Francisco 49ers",
        "Philadelphia Eagles",
        "Oakland Raiders",
        "Miami Dolphins"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He was the first high-profile tennis player to be caught with a banned substance.",
      "options": [
        "Marcelo Rios",
        "Jim Courier",
        "Goran Ivanisevic",
        "Petr Korda"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many NFL teams did Pete Carroll coach for prior to coaching at USC?",
      "options": [
        "1",
        "7",
        "3",
        "5"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where was the famed Alabama football coach Paul Bryant born?",
      "options": [
        "Louisville, Ky",
        "Chicago, IL",
        "Moro Bottom, Ark.",
        "Junction, TX"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The Title of Triple Crown Loser goes to the player who would normally qualify for the Triple Crown, but is last in all three triple crown categories among all starters in his league. Who was the last Triple Crown Loser in the 20th century?",
      "options": [
        "Enzo Hernandez",
        "Woodie Williams",
        "Mark Belanger",
        "Ivan DeJesus"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Carlton Fisk was best known by what nickname?",
      "options": [
        "Minor",
        "Hoppy",
        "Pudge",
        "Sweets"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This power hitting Hall of Famer played at first base primarily with the San Francisco Giants.",
      "options": [
        "Willie Mays",
        "Juan Marichal",
        "Bobby Bonds",
        "Willie McCovey"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What sport did Sarah Palin play in high school?",
      "options": [
        "basketball",
        "softball",
        "volleyball",
        "hockey"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which Hall of Fame is located in Oklahoma City, Oklahoma ?",
      "options": [
        "Sooner Hall of Fame",
        "College Football hall of Fame",
        "Oil Industry Hall of Fame",
        "Cowboy Hall of Fame"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Walter Payton played for this team from 1975 - 1987.",
      "options": [
        "Browns",
        "Seahawks",
        "Bears",
        "Bengals"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How many titles did Gerard Houllier win while with Liverpool?",
      "options": [
        "3",
        "5",
        "4",
        "1"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who was the NBA Finals MVP in 1976?",
      "options": [
        "JoJo White",
        "Rick Barry",
        "Bill Walton",
        "Wes Unseld"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What year did England host and win the World Cup?",
      "options": [
        "1962",
        "1958",
        "1966",
        "1974"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which one of these college-nickname pairs from 2006 is wrong?",
      "options": [
        "Syracuse - Orange(men)",
        "University of Southern Illinois - Salukis",
        "Sacramento State - Hornets",
        "University of Denver - Rams"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Bret Hart wrestled in every SummerSlam that he could, while a WWF SuperStar. From 1988-1997 he missed only one SummerSlam. What year?",
      "options": [
        "1988",
        "1989",
        "1996",
        "1990"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following statements is true about Hwa Rang Do in Korea?",
      "options": [
        "it means The Way of the Flowering Knights",
        "it is used by members of the Royal Court and traveling monks",
        "It originated in the kingdom of Gogoryeo",
        "It is a system of 18 techniques."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In this year the U.S.A. upset the Soviet Union in Olympic hockey, Call Me by Blondie was the #1 song, and Star Wars: Episode V - The Empire Strikes Back came out.",
      "options": [
        "1982",
        "1980",
        "1983",
        "1986"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Abe was the originator, owner, and player for the Harlem Globetrotters. What was Abes last name?",
      "options": [
        "Davidson",
        "Saperstein",
        "Mikan",
        "Davis"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which Hall of Famer played first base with the Cincinnati Reds?.",
      "options": [
        "Bill Madlock",
        "Bill Maddox",
        "John Roseboro",
        "Tony Perez"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which team was Shane Battier traded to in 2006?",
      "options": [
        "Houston Rockets",
        "New Orleans Hornets",
        "Atlanta Hawks",
        "Boston Celtics"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "A thirty-six year old pitcher threw a perfect game for the Montreal Expos on July 28, 1991. Who was the wining pitcher?",
      "options": [
        "Al Leiter",
        "Dennis Martinez",
        "Ferguson Jenkins",
        "Kenny Rogers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When was the first goal in a NHL game scored?",
      "options": [
        "December 19,1924",
        "December 19,1917",
        "December 19 , 1936",
        "December 19 , 1942"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Among Hollywoods athletic box-office stars, this Florida boy probably boasts the most accomplished college-football career of any major movie star.",
      "options": [
        "Tom Selleck",
        "Burt Reynolds",
        "PeeWee Herman",
        "Kevin Costner"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The St. Louis Cardinals play at what stadium?",
      "options": [
        "Coors Field",
        "Tropicana Field",
        "Wrigley Field",
        "Busch Stadium"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "With the 2nd overall pick in the 2004 NBA draft, the Charlotte Bobcats selected what former UConn player?",
      "options": [
        "Bernard Robinson",
        "Emeka Okafor",
        "Jahidi White",
        "Dwight Howard"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This player was the first catcher in the history of professional baseball to play close to the batter.",
      "options": [
        "Charles Zimmer",
        "Willard Hershberger",
        "Larry McLean",
        "Nat Hicks"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What name was given to the tactic that Muhammad Ali used to defeat George Foreman?",
      "options": [
        "Rope a Dope",
        "Run and Hide",
        "Rope and Hope",
        "Hope and Pray"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This player, nicknamed The Sarge, played left field for the 1983 Phillies and wore #34.",
      "options": [
        "Gary Matthews",
        "Greg Gross",
        "Bill Robinson",
        "Bob Dernier"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What is the slogan of the 2012 Summer Olympic Games?",
      "options": [
        "Inspire a Generation",
        "One World, One Dream",
        "Share the Spirit",
        "Friends Forever"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Of the following SEC quarterbacks, which one did not come in second in the Heisman Trophy voting?",
      "options": [
        "Heath Shuler",
        "Peyton Manning",
        "Rex Grossman",
        "Eli Manning"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What science did Aristotle define as \u2018the knowledge of immaterial being\u2019?",
      "options": [
        "Metaphysics",
        "Psychology",
        "Philosophy",
        "Logic"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He is the first baseball player to be caught stealing a base at least 355 times.",
      "options": [
        "Lou Brock",
        "Rickey Henderson",
        "Ty Cobb",
        "Minnie Minoso"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What did Shane Battier major in at Duke?",
      "options": [
        "Music",
        "Political Science",
        "Religion",
        "Mathematics"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What number did Baseball Hall of Famer, Rod Carew, wear on his uniform when he played for the Minnesota Twins?",
      "options": [
        "33",
        "29",
        "44",
        "6"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Gustaf V of Sweden, the last Swedish king to intervene directly in the politics of the country, was also a devoted sportsman, playing in tournaments under the pseudonym Mr G. In 1980, King Gustaf was elected into the International Hall of Fame of this sport.",
      "options": [
        "Chess",
        "Golf",
        "Polo",
        "Tennis"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Nick Bollettieri is one of the most famous tennis coaches. Where is his training campus located?",
      "options": [
        "California",
        "Arizona",
        "Florida",
        "New York"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the first NFL Super Bowl MVP who was not born in the USA?",
      "options": [
        "Mark Rypien",
        "Fred Biletnikoff",
        "Len Dawson",
        "Kurt Warner"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who led the 2005 LSU team in receptions?",
      "options": [
        "Carlos Rachel",
        "Dwayne Bowe",
        "Ryan Perrilloux",
        "Skler Green"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who became the fastest man by setting a world record of 9.69s at the 2008 Olympics 100m run?",
      "options": [
        "Asafa Powell (Jamaica)",
        "Usain Bolt (Jamaica)",
        "Richard Thompson (Trinidad Tobago)",
        "Walter Dix (USA)"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This Australian beachside town has several beaches that are very popular for surfing.",
      "options": [
        "None of these",
        "Byron Bay",
        "Bengal Bay",
        "Booty Bay"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This Grand Slam winner won her first out of a total of seven Ladies singles Wimbledon titles in 1988.",
      "options": [
        "Martina Navratilova",
        "Steffi Graf",
        "Jana Novotna",
        "Chris Evert"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The majors for men are this many in number.",
      "options": [
        "4",
        "6",
        "7",
        "5"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How many Medal of Honor citations have been issued during the Vietnam War?",
      "options": [
        "120",
        "245",
        "345",
        "153"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In which sport was Terry Sawchuck famous?",
      "options": [
        "Hockey",
        "Soccer",
        "Swimming",
        "Weightlifting"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In which of these years did the New York Mets qualify for the postseason as the National League Wild Card team?",
      "options": [
        "2000 and 2003",
        "2000 and 2004",
        "1999 and 2004",
        "1999 and 2000"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1999s match for the FA Cup between Arsenal and Manchester United, who misses the penalty during the first period of extra-time, and who scores later on, thus deciding the outcome of the match?",
      "options": [
        "Bergkamp - Beckham",
        "Bergkamp - Ryan Giggs",
        "Kanu - Ryan Giggs",
        "Henry - Ryan Giggs"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What are the first two numbers officially retired by the Toronto Maple Leafs?",
      "options": [
        "6 99",
        "6 27",
        "5 6",
        "6 9"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "He was a seventeenth round draft choice of the New York Giants out of the University of Iowa. He played for the Giants from 1948-1958. He then played for the Green Bay Packers from 1959-1961.",
      "options": [
        "Dick Lane",
        "J.C.Caroline",
        "Jerry Gray",
        "Emlen Tunell"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Boules is a collective name for a number of games played with what type of balls?",
      "options": [
        "Wooden balls",
        "Rubber balls",
        "Dotted balls",
        "Metal balls"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In high jump, how must the bar be attacked for a valid result?",
      "options": [
        "It doesnt matter",
        "Head first",
        "Butt first",
        "Feet first"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What year did the Pittsburgh Penguins win their first Stanley Cup?",
      "options": [
        "1992",
        "1990",
        "1991",
        "1989"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "The team that became Gloucester RFC played their first game on this site in 1873, which was later developed as the clubs home.",
      "options": [
        "Kingsholm",
        "Queensholm",
        "Franklins Gardens",
        "The Shed"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who has the highest ranking in an NFL game?",
      "options": [
        "The Referee",
        "The Umpire",
        "The Backfield Judge",
        "The Head Linesman"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Jerome Holtzman was a sports journalist of some repute. Which statement is true about him?",
      "options": [
        "He and Bill James wrote many books using statistics to evaluate players.",
        "He was the writer who wrote the original expose on steroids in baseball.",
        "He invented the statistic Saves by a relief pitcher.",
        "He was President of the Baseball Hall of Fame from 1999 to his death in 2008."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these former gymnasts is the most decorated male gymnast in the Olympics?",
      "options": [
        "Xiaopeng Li (China)",
        "Alexander Dityatin (USSR)",
        "Sawao Kato (japan)",
        "Kurt Thomas (USA)"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This player was the 31st selected in 2001 draft by the Golden State Warriors. He and Jamison was chossen to represent the Washington Wizards at the 2005 NBA All-Star Game.",
      "options": [
        "Gilbert Arenas",
        "Ben Gordon",
        "Carmelo Anthony",
        "Vlade Divac"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first pitcher to earn the Triple Crown four times?",
      "options": [
        "Ed Cicotte",
        "Hippo Vaughan",
        "Grover Cleveland Alexander",
        "Cy Young"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How many major league baseball teams did Babe Ruth play for?",
      "options": [
        "2",
        "4",
        "3",
        "5"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which manager of the Chicago Cubs was named Manager of the Year in 1989?",
      "options": [
        "Jim Frey",
        "Don Zimmer",
        "Dusty Baker",
        "Don Baylor"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Just two days after construction of the Berlin Wall began, the first East Berliner escaped, jumping over the barbed fence. Some of the daring attempts to flee the Republic were really amazing; before the frontier barrier was fitted with vertical bars, nine people escaped from East Berlin in a small sports car, driving under the barrier. Do you know what kind of car it was?",
      "options": [
        "Wolkswagen Beatle",
        "Isetta",
        "Mini Cooper",
        "Fiat 500"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What is the maximum length of a modern day cricket test match?",
      "options": [
        "6 hours",
        "150 minutes",
        "5 days",
        "1 week"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which two teams played in the first NFL championship?",
      "options": [
        "Chicago Bears and the Boston Tigers",
        "Chicago Bears and the New York Giants",
        "Canton Bulldogs and the Providence Steamrolles",
        "Canton Bulldogs and the Chicago Cardinals"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Several Major Leaguers have had multiple 50-plus home run seasons. Which player listed below has NOT accomplished this feat at least 3 times?",
      "options": [
        "Alex Rodriguez",
        "Babe Ruth",
        "Mark McGwire",
        "Barry Bonds"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Charles Woodson, who won the Heisman trophy in 1997, played in what position?",
      "options": [
        "Halfback",
        "Wide Receiver",
        "Quarterback",
        "Cornerback"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This 1992 film with an all-star cast which included Kevin Bacon, won numerous categories at both the Academy Awards and the Golden Globe Awards and was also critically acclaimed on Broadway.",
      "options": [
        "A Few Good Men",
        "Footloose",
        "My Dog Skip",
        "Shes Having a Baby"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Steve Garvey is a famous former baseball player, who is known for playing what position?",
      "options": [
        "Shortstop",
        "Catcher",
        "Third Base",
        "First Base"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What sport was invented by James Naismith in 1891?",
      "options": [
        "soccer",
        "basketball",
        "curling",
        "ice hockey"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Where did Missouri coach Mike Anderson served as an assistant for a 17-years?",
      "options": [
        "University of Arkansas",
        "University of Alabama at Birmingham",
        "Tulsa",
        "University of Missouri"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Tom took up acting after having an injury in high school, while playing this sport.",
      "options": [
        "wrestling",
        "soccer",
        "football",
        "hockey"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In which New York area does the US Open take place?",
      "options": [
        "Brooklyn",
        "Staten Island",
        "Queens",
        "Bronx"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Milwaukee Braves won the World Series in what year?",
      "options": [
        "1955",
        "1956",
        "1954",
        "1957"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which statement is true about the British ski jumper Eddie Eagle Edwards?",
      "options": [
        "He was unfit for the sport, had no financial support, but yet kept on jumping.",
        "He was the first black man in the sport.",
        "He was actually a woman after a sex-change operation.",
        "He has won the most medals at the Olympics."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Located about 3 miles from Sydney, what is the name of the popular beach that hosted the beach volleyball competition at the 2000 Summer Olympics?",
      "options": [
        "Bondi Beach",
        "Palm Beach",
        "Balmoral Beach",
        "Waikiki Beach"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What does a red flag signal during athletic events that involve a jump?",
      "options": [
        "The result is not valid because the athlete bounced off pass the measure bar.",
        "The athlete is disqualified.",
        "The result is valid.",
        "The result is not valid because there was too strong back wind."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When did The New York Mets win their first World Series?",
      "options": [
        "1969",
        "1968",
        "1973",
        "1970"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The Alous, with four family members in the MLB, may lineup as baseballs most impressive brood, but only one Alou boasts even the hint of a nickname. What is it?",
      "options": [
        "Matty",
        "Mo",
        "Marty",
        "Jessie"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Andy Corno is known as the starting face off midfielder for this lacrosse team.",
      "options": [
        "Bayhawks",
        "Machine",
        "Barrage",
        "Rattlers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Name the soccer team which is not based in Romania?",
      "options": [
        "FC Arges",
        "Gloria Bistrita",
        "CFR Cluj",
        "Politehnica Chisinau"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "During a performance for the high school drama class at the local theatre, a hole was cracked in the stage floor. Subsequent acts managed to avoid the damaged area until little Freddy, juggling bowling pins, accidentally stepped through the hole up to his knee. He apologized to the audience for his clumsiness. But a heckler in the back of the theatre shouted: Dont worry, Freddy! ______________.",
      "options": [
        "Youll get over it!",
        "Be thankful you didnt get bonked by the pins!",
        "Youll get under it!",
        "Its just a stage youre going through!"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the nickname of H.A. Wheeler, the former track promoter at Lowes?",
      "options": [
        "Hurricane",
        "Silverfox",
        "Happy",
        "Humpy"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Former Minnesota Viking and New York Giant quarterback Fran Tarkenton played for what SEC team?",
      "options": [
        "Tennessee Vols",
        "Georgia Bulldogs",
        "Florida Gators",
        "LSU Tigers"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Lets say John and Judy are playing a mixed doubles match against Mary and Mike. Its Marys turn to serve. She starts the game by serving to Judy. Mary and Mike win the point. Now the score is 15-love. For the next point, who serves to whom?",
      "options": [
        "Mike serves to John.",
        "Mary serves to Judy again.",
        "Mary serves to John.",
        "Mike serves to Judy."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1990, this commissioner banned New York Yankees owner George Steinbrenner from baseball for life.",
      "options": [
        "Bowie Kuhn",
        "Fay T. Vincent",
        "A. Bartlett Giamatti",
        "Bud Selig"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Floorball, a type of team sport popular in Sweden, Finland and Switzerland, is similar to which of these popular sports?",
      "options": [
        "Badminton",
        "Football",
        "Ice hockey",
        "Polo"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This Kentucky grad had a very long Pro Football career. He won games as a kicker and as a quarterback. He originally played for the Chicago bears but also won fame playing for the Houston Oilers and the Oakland Raiders.",
      "options": [
        "Ray Guy",
        "Gary Anderson",
        "George Blanda",
        "Jan Stenerud"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many regular season games did the Chargers win in 2006?",
      "options": [
        "13",
        "12",
        "10",
        "14"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "How may periods are there in a regular ice hockey game?",
      "options": [
        "3",
        "2",
        "4",
        "1"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which pair became the first to do a ratified quadruple twist?",
      "options": [
        "Julia Obertas Sergei Slavnov",
        "Xue Shen Hongbo Zhao",
        "Dan Zhang Hao Zhang",
        "Ekaterina Gordeeva Sergei Grinkov"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is George Herman Ruths nickname?",
      "options": [
        "The Splendid Splinter",
        "Magic",
        "Oh Yeah",
        "Babe"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "He played 1st base for the 1983 Phillies and wore uniform #14.",
      "options": [
        "Juan Samuel",
        "Pete Rose",
        "Joe Lefebvre",
        "Tony Perez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following schools was not a charter member of the Sun Belt Conference when the conference was formed in 1976?",
      "options": [
        "Jacksonville University",
        "University of South Alabama",
        "University of South Florida",
        "University of Alabama at Birmingham"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which pay-per-view of the World Wrestling Federation was named The Night the Lights Went Out in Georgia?",
      "options": [
        "King of the Ring",
        "No Way Out",
        "Judgement Day",
        "Armageddon"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who was the first Southern California Trojans player to win the Heisman award?",
      "options": [
        "Charles White",
        "Anthony Davis",
        "Whizzer White",
        "Mike Garrett"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Football player Edison Arantes do Nascimento, known as Pele, was nicknamed after which of the following?",
      "options": [
        "A hurricane",
        "A cartoon character",
        "A football player",
        "A meal"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What rank did Spain achieve on the Medal table in the Summer Olympics in 1992?",
      "options": [
        "8th",
        "4th",
        "6th",
        "10th"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This retired cornerback, who played college football at Grambling University, was inducted into the Pro Football Hall of Fame on July 28, 1984.",
      "options": [
        "William Brown",
        "Charlie Joiner",
        "Buck Buchanan",
        "Willie Davis"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Danny Zuko, one of the main characters in the movie Grease, received a lettermans sweater for which sport?",
      "options": [
        "Track",
        "Wrestling",
        "Baseball",
        "Basketball"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This college basketball coach won seven straight National Championships between 1967 and 1973. Four times his teams went 30 - 0 and, during a stretch between 1971 and 1974, his team won 88 straight games. He was known as The Wizard of Westwood.",
      "options": [
        "Dean Smith",
        "John Wooden",
        "Bobby Knight",
        "Larry Brown"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where is the Songwriters Hall of Fame located?",
      "options": [
        "Chicago, Illinois",
        "Las Vegas, Nevada",
        "New York City, NY",
        "Detroit , Michigan"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In NASCAR Nextel Cup Racing there is no event more exciting than the season opener the Daytona 500, held at Daytona International Speedway every February. What trophy is the winner of the Daytona 500 awarded?",
      "options": [
        "The Daytona Florida Trophy",
        "Winston Cup",
        "The Harley J. Earl Trophy",
        "Nextel Cup"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This running back and an outfielder said, Football is easy if a person is crazy as hell.",
      "options": [
        "Bo Jackson",
        "Carl Hubbard",
        "O.J. Simpson",
        "Deion Sanders"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 1992, Tony Hawk started what skateboard company together with Per Welinder?",
      "options": [
        "Flip",
        "Blind",
        "Birdhouse Projects",
        "Alien Workshop"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "After the Washington Redskins drafted Ernie Davis, Art Modell of the Browns traded this player for him.",
      "options": [
        "Jim Kelly",
        "leroy kelly",
        "Bobby Mitchell",
        "Marion Motley"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When you are breathing compressed air at depth, a certain amount of the air gets dissolved in the tissues of your body. When you ascend, what happens to this dissolved air?",
      "options": [
        "It comes out of solution, forming gas bubbles in your tissues.",
        "It passes into your urine, whence it is excreted when you go to the bathroom.",
        "It moves into your brain, causing you to become delirious.",
        "Nothing"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This kickers 32-yard field goal won Super Bowl V with five seconds left in the game.",
      "options": [
        "Tom Matte",
        "Jim OBrien",
        "Tom Dempsey",
        "Jim Turner"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who won the NBA Championship in 1995?",
      "options": [
        "Orlando Magic",
        "New York Knicks",
        "Utah Jazz",
        "Houston Rockets"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This former college quarterback went on to play running back for the Dallas Cowboys and then became a head coach in the NFL.",
      "options": [
        "Bert Jones",
        "Calvin Hill",
        "Robert Newhouse",
        "Dan Reeves"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which female pole vaulter was first to clear 5m?",
      "options": [
        "Svetlana Feofanova (Russia)",
        "Jennifer Stuczynski (USA)",
        "Stacy Dragila (USA)",
        "Yelena Isinbayeva (Russia)"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What year was the first Boston Marathon run?",
      "options": [
        "1910",
        "1898",
        "1897",
        "1920"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This team won the 2005 NCAA Football Championship, lead by head coach Mack Brown",
      "options": [
        "Texas",
        "LSU",
        "USC",
        "Notre Dame"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In a Brady Bunch episode, Bobby lies to his friends telling them that a certain professional football player is dropping by for dinner with the Bradys. Bobbys friends are looking forward to meeting the NFL star because he is playing an exhibition game in town the next week. Who was this famous guest star ?",
      "options": [
        "Don Drysdale",
        "Bubba Smith",
        "Deacon Jones",
        "Joe Namath"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In which African country did Muhammad Ali fight George Foreman in a match referred to as The Rumble in the Jungle?",
      "options": [
        "Ghana",
        "Zaire",
        "Cameroon",
        "Egypt"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which NFL team won their 12th Championship in 1997?",
      "options": [
        "Chicago Bears",
        "Cleveland Bowns",
        "New England Patriots",
        "Green Bay Packers"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This player was a feared homerun hitter during his major league playing career. He started his major league career in Milwaukee Braves and ended it in Milwaukee Brewers.",
      "options": [
        "Barry Bonds",
        "Babe Ruth",
        "Willie Mays",
        "Hank Aaron"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This team, with head coach Tom Osborne, won the most NCAA football Championships in the 1990s.",
      "options": [
        "Nebraska",
        "Tennessee",
        "Florida State",
        "Florida"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is not a golf course in the Puerto Vallarta area?",
      "options": [
        "Four Seasons Golf",
        "El Paso Golf",
        "El Tigre Golf",
        "Marina Golf"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Ray Floyd won the PGA Championship two times, the second time at Southern Hills in Tulsa. When and where did this steely-eyed short game master win his first PGA Championship?",
      "options": [
        "NCR Country Club, 1969",
        "Canterbury Golf Club, 1973",
        "Pebble Beach, 1977",
        "Southern Hills Country Club, 1970"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Beijing 2008 Olympic Games have been scheduled to include 28 sports and how many separate events?",
      "options": [
        "301-350",
        "151-200",
        "251-300",
        "201-250"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What Chinese literary genre is based on Chinese martial arts?",
      "options": [
        "Baihua",
        "Wuxia",
        "Shi",
        "Bushid\u014d"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "The year 1969 was a championship season for all of these New York teams, except this one.",
      "options": [
        "Mets",
        "Rangers",
        "Knicks",
        "Jets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The importance of practice was emphasized in the following statement made by this Notre Dame head coach: Lads, youre not to miss practice unless your parents died or you died.",
      "options": [
        "Lou Holtz",
        "Ara Parseghian",
        "Frank Leahy",
        "Knute Rockne"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which one of these has not been a Blue Jay player?",
      "options": [
        "Mitch Williams",
        "Jack Morris",
        "David Cone",
        "Dave Stewart"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Cumberland University, located in Lebanon, Tennessee, lost the most lopsided football game in history to what school?",
      "options": [
        "Middle Tennessee State",
        "Penn State",
        "Georgia Tech",
        "University of North Carolina"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This college basketball coach won 875 games while coaching the University of Kentucky Wildcats basketball team for 41 years.",
      "options": [
        "Eddie Sutton",
        "Adolph Rupp",
        "Pat Riley",
        "Tubby Smith"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Born with the first and middle names Jacobus Franciscus, this legendary athlete is the first American sports figure to ever have a small town named after him.",
      "options": [
        "Wilt Chamberlain",
        "Jim Brown",
        "Jim Thorpe",
        "Joe Montana"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is Pilates based on?",
      "options": [
        "Body Building and Yoga",
        "Yoga and Gymnastics",
        "Aerobics and Meditation",
        "Yoga and Aerobics"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "At the 2012 Summer Olympic Games Opening Ceremony, this celebrity was seen driving a motor boat down the River Thames and under Tower Bridge to the music I Heard Wonders by David Holmes.",
      "options": [
        "Rowan Sebastian Atkinson",
        "Moris Green",
        "Ryan Giggs",
        "David Beckham"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1984, FIBA introduced to basketball regulations the three-point line. What is its length from the center of the basket?",
      "options": [
        "7 ft 1 in (2.15 m)",
        "20 ft 6 in (6.25 m)",
        "23 ft 9 in (7.23 m)",
        "16 ft 7 in (5.05 m)"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What two gymnasts tied for the uneven bar gold at the 2003 World Gymnastics Championships?",
      "options": [
        "Carly Patterson and Nastia Liukin",
        "Annia Hatch and Carlinia Ponor",
        "Hollie Vise and Chellesie Memmel",
        "Courntey Kupets and Terrin Humphry"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Beginning in 1998 he had a significant role in CBS getting the rights to NFL games through at least 2012. His father was a truly great sportscaster.",
      "options": [
        "Henry Rodgers, Jr.",
        "Jonathan Buck",
        "Robert Barber",
        "Sean McManus"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This baseball shortstop player donated $3.9 million to renovate the baseball field at The University of Miami and also won two Gold Gloves.",
      "options": [
        "Derek Jeter",
        "Alex Rodriguiz",
        "Miguel Tejada",
        "Ernie Banks"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which team did the Dallas Cowboys beat to win Super Bowl XXX?",
      "options": [
        "Jets",
        "Packers",
        "Steelers",
        "Bears"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which team did the 2006 Chargers lose to in the playoffs?",
      "options": [
        "Baltimore Ravens",
        "New England Patriots",
        "Indianapolis Colts",
        "New York Jets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Boilermakers is the nickname of which American university?",
      "options": [
        "Northwestern University",
        "University of Michigan",
        "Purdue University",
        "Indiana State University"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What city does the Fire MLS team play in?",
      "options": [
        "Chicago",
        "New York",
        "Seattle",
        "Houston"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In what year was Jeff Hardy released from WWE because of his erratic behavior, drug use, and refusal to go to rehab?",
      "options": [
        "2000",
        "2007",
        "2003",
        "2001"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What were the initial aims of The Tiger Woods Foundation?",
      "options": [
        "Helping save endangered animals",
        "Helping AIDS patients",
        "Helping erase poverty and hunger in Africa",
        "Helping disadvantaged children"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first professional golfer to win all four professional major championships, known as a Career Grand Slam?",
      "options": [
        "Gene Sarazen",
        "Jack Nicklaus",
        "Ben Hogan",
        "Bobby Jones"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This country hosted the 1924 Summer Olympics, officially known as the Games of the VIII Olympiad.",
      "options": [
        "Japan",
        "Greece",
        "Canada",
        "France"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many times did Babe Ruth win the American League MVP award?",
      "options": [
        "2",
        "4",
        "3",
        "1"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What team was Shane Battier selected by in the 2001 NBA draft?",
      "options": [
        "Houston Rockets",
        "Miami Heat",
        "Washington Wizards",
        "Memphis Grizzlies"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1914, this catcher broke the record for throwing out base runners in an inning.",
      "options": [
        "Muddy Reul",
        "Bill Dickey",
        "Steve ONeil",
        "Les Nunamaker"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The golfer who wins the PGA Championship is presented with what trophy?",
      "options": [
        "The Wanamaker Trophy",
        "A Green Jacket",
        "A Wilkinson Sword",
        "The Claret Jug"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the fist US title change at SummerSlam?",
      "options": [
        "John Cena Vs Booker T",
        "Chris Benoit Vs Orlando Jordan",
        "John Cena Vs Carlito",
        "Chris Benoit Vs Chris Jericho"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Greg Harris and Tony Mullane were both pitchers in Major League Baseball. Why are they significant?",
      "options": [
        "They were actually the same person.",
        "Each one pitched both lefty and righty.",
        "Babe Ruth hit his first homer off Mullane and Barry Bonds hit his first homer off Harris.",
        "They pitched in the first extra-innings World Series game."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the quarterback for the Baltimore Ravens when they won the super bowl in 2000?",
      "options": [
        "Trent Dilfer",
        "Jeff Goerge",
        "Tony banks",
        "Brooks Bollinger"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This precision sport, played on ice with polished heavy stones, is especially well established in Canada.",
      "options": [
        "Curling",
        "Skibob",
        "Skeleton",
        "Luge"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This Russian figure skater never won a major title before becoming Olympic Champion in 1994.",
      "options": [
        "Alexei Urmanov",
        "Alexei Yagudin",
        "Evgeni Plushenko",
        "Ilia Kulik"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "How old was Travis Pastrana when he separated his spine from his pelvis as a result of a serious injury?",
      "options": [
        "19",
        "16",
        "12",
        "14"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following is a Czech soccer team?",
      "options": [
        "SK Sigma Olomouc",
        "NK Domzale",
        "FC Nitra",
        "Vejle BK"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This number of trophies have been in use during the competitions long history.",
      "options": [
        "4",
        "3",
        "2",
        "1"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What number did Ralph Kiner, who was inducted into the Baseball Hall of Fame in 1975, wear when he played for the Pittsburgh Pirates in the 40s and 50s?",
      "options": [
        "4",
        "3",
        "11",
        "7"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "According to a Sports Illustrated article on Sam Malone, what was the number of strikeouts he got in his fictional baseball career?",
      "options": [
        "98",
        "59",
        "40",
        "150"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The javelin discipline has been part of the Summer Olympics since what year?",
      "options": [
        "1896",
        "1940",
        "1961",
        "1908"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In which of these sports are Haifas teams most successful?",
      "options": [
        "Swimming",
        "Kadema",
        "Soccer",
        "Basketball"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How many home runs did Hank Aaron hit in his career?",
      "options": [
        "755",
        "750",
        "625",
        "609"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "How many balls make up an over in a cricket match?",
      "options": [
        "12",
        "6",
        "3",
        "10"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "World Heavyweight Champion Mike Tyson said that he wore black trunks to symbolize the death of this person.",
      "options": [
        "His father",
        "His trainer, Angelo Dundee",
        "His step mother",
        "His trainer, Cus DAmato"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The land where Yankee Stadium was built was previously used for this purpose.",
      "options": [
        "Lumber yard",
        "Court House",
        "Celery farm",
        "Car lot"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what position did football star Romario play throughout his career?",
      "options": [
        "Sweeper",
        "Striker",
        "Defender",
        "Midfielder"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Although Kung Fu is often used in English as a collective term for Chinese martial arts, what is the more precise term for them?",
      "options": [
        "Kendo",
        "San Soo",
        "Wushu",
        "Hung Fut"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the Charlotte Bobcats first head coach?",
      "options": [
        "Bernie Bickerstaff",
        "Dan Scwartzer",
        "Lou Hollins",
        "Michael Jordan"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who is the first player in baseball history to hold World Series records as both a pitcher and hitter?",
      "options": [
        "Dizzy Dean",
        "Dizzy Gillespie",
        "Babe Ruth",
        "Ken Brett"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In which football team did Ronaldo de Assis Moreira, known as Ronaldinho, make his European debut in 2001?",
      "options": [
        "Barcelona",
        "Milan",
        "Nantes",
        "Paris Saint-Germain"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who is the first man to land a quadruple-triple combination?",
      "options": [
        "Elvis Stojko",
        "Timothy Goebel",
        "Evgeni Plushenko",
        "Alexei Yagudin"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 1987 he became the first football coach to have Gatorade splashed on his head.",
      "options": [
        "Bud Grant",
        "Bill Parcells",
        "Barry Switzer",
        "Bill Cowher"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "On the show Good Times, Thelmas husband Keith had a knee injury which halted his career as a football player. After his full recovery, he was offered a contract by what NFL team?",
      "options": [
        "Buffalo Bills",
        "Chicago Bears",
        "Atlanta Falcons",
        "New York Jets"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many teams does the Atlantic Division of the Eastern Conference have?",
      "options": [
        "4",
        "5",
        "10",
        "7"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which team won the second World Series between the National League and the American League?",
      "options": [
        "Pittsburgh Pirates",
        "Providence Grays",
        "New York Giants",
        "New York Metropolitans"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In Major League Baseball, first and second bases are this far apart.",
      "options": [
        "90",
        "95",
        "85",
        "93"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Before they were the L.A. Lakers, they played in this city.",
      "options": [
        "Minneapolis",
        "Cincinnati",
        "Milwaukee",
        "Denver"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which Brazilian soccer player was part of Barcelona\u2019s \u201dDream Team\u201d (1993-1994 season) and scored 30 goals in 33 matches?",
      "options": [
        "Rivaldo",
        "Ronaldo",
        "Romario",
        "Pele"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This quarterback was cut by the Steelers and picked up by another team, played in high tops, and his teammates include Lenny Moore and Steve Myhra.",
      "options": [
        "Norm Van Brocklin",
        "Terry Bradshaw",
        "John Brodie",
        "Johnny Unitas"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Why was Gene Hackmans character, Coach Norman Dale, suspended from coaching NCAA basketball?",
      "options": [
        "Recruiting violations",
        "Gambling on the sport",
        "Kicking a referee",
        "Assaulting one of his players"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the NBA Finals MVP in 1978?",
      "options": [
        "Dennis Johnson",
        "Bill Walton",
        "JoJo White",
        "Wes Unseld"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This baseball player, nicknamed True, was a three time 20-game winner for the Oakland As.",
      "options": [
        "Dennis Eckersley",
        "Rollie Fingers",
        "Jim Hunter",
        "Vida Blue"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what sport was Roy Munson crowned the 1979 Iowa State Champion in the movie Kingpin?",
      "options": [
        "Golf",
        "Tennis",
        "Wrestling",
        "Bowling"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This town, after which an Olympic event was named, was the site of a battle where the Athenian army defeated the Persians in 490 BC.",
      "options": [
        "Pentathos",
        "Javelinos River",
        "Decathlos",
        "Marathon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1990, the Toronto Blue Jays traded Tony Frenandez and Fred McGriff to San Diego for whom?",
      "options": [
        "Roberto Alomar and Duane Ward",
        "Joe Carter and Sandy Alomar",
        "Joe Carter and Roberto Alomar",
        "Joe Carter and Duane Ward"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these former Missouri Tiger players has the most super bowl rings?",
      "options": [
        "Tony Galbreath",
        "Eric Wright",
        "Chase Daniel",
        "Johnny Roland"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which former quarterback was named the Most Valuable Player of Super Bowl XXIX, and was inducted into the Pro Football Hall of Fame in 2005?",
      "options": [
        "Steve Young",
        "Norm Van Brocklin",
        "Bobby Layne",
        "Jim Kelly"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Troy Aikman graduated from UCLA, but where did he begin his college career?",
      "options": [
        "Oklahoma",
        "Miami",
        "Texas",
        "Stanford"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What sport has six major tournaments a year in Japan, three in Tokyo and three in other major cities?",
      "options": [
        "judo",
        "aikido",
        "kendo",
        "sumo"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was appointed NFL Commissioner after the retirement of Paul Tagliabue?",
      "options": [
        "Terrell Owens",
        "Mark Cohon",
        "Bert Bell",
        "Roger Goodell"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is the most popular sport among the people of South Africa?",
      "options": [
        "Boxing",
        "Tennis",
        "Athletics",
        "Soccer"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This county seat is known as The Military Capital of the Revolution, and contains sites like Fords Mansion and Jockey Hollow. It was where George Washington encamped in the brutal winter of 1777.",
      "options": [
        "Elizabeth",
        "New Brunswick",
        "Morristown",
        "Trenton"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first player to score 20,000 career points?",
      "options": [
        "Jerry West",
        "George Mikan",
        "Bob Pettit",
        "Oscar Robertson"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Former NBA coach Frank Layton once fined small forward Adrian Dantley thirty pieces of silver. What did Layton say the fine was for?",
      "options": [
        "Asking to be traded",
        "Being late to three practices in a row",
        "Betrayal",
        "Missing three foul shots in a row"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which team won the second Super Bowl?",
      "options": [
        "The Green Bay Packers",
        "The Kansas City Chiefs",
        "The Washington Redskins",
        "The New York Jets"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Klaus is a talking fish who lives with the Smiths in the animated series American Dad. He was once an Olympic skier, but the CIA swapped his brainwaves with those of a goldfish to prevent him from winning the gold medal. What nationality is Klaus?",
      "options": [
        "Russian",
        "Italian",
        "Swedish",
        "German"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In which of the Grand Slam tournaments are matches played on clay courts?",
      "options": [
        "Wimbledon",
        "US Open",
        "Roland Garros",
        "Australian Open"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what sport was the largest number of records set at the 2012 Summer Olympics?",
      "options": [
        "cycling",
        "swimming",
        "weightlifting",
        "athletics"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1983 John McEnroe won Wimbledon for the 2nd time. Who was McEnroes opponent on that occasion ?",
      "options": [
        "Pat Cash",
        "Jimmy Connors",
        "Chris Lewis",
        "Chris Curren"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "By what name did Marco Polo call the capital of China, present-day Beijing?",
      "options": [
        "Peijing",
        "Nahnjing",
        "Cambaluc",
        "Canton"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The first non-American baseball team to win the Little League World Series was from this country.",
      "options": [
        "Japan",
        "Mexico",
        "Venezuela",
        "The Dominican Republic"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On his way to fighting George Foreman, Muhammad Ali lost a fight against this boxer.",
      "options": [
        "Jergin Blin",
        "Ken Norton",
        "Mac Foster",
        "Alvin Lewis"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Arsenal bought Thierry Henry in 1999 from which team?",
      "options": [
        "Milan",
        "Juvenots",
        "Parma",
        "Inter"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This song by Sister Sledge was the anthem of the 1979 World Champion Pittsburgh Pirates.",
      "options": [
        "Blockbuster Boy!",
        "We Are Family!",
        "Reach Your Peak!",
        "Easy Street!"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What was the nickname of Byron White, the only professional football player ever appointed to the Supreme Court?",
      "options": [
        "Whiz Kid",
        "Whizzer",
        "Whitey",
        "Ambulance Chaser"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where was Shane Battier born and raised?",
      "options": [
        "Birmingham, Michigan",
        "Madison, Wisconsin",
        "Cleveland, Ohio",
        "Detroit, Michigan"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Before he nailed down his macho movie career, this African-American actor was known on the gridiron as The Hammer. He played for the Oakland Raiders, then for the Kansas City Chiefs in the first-ever Super Bowl.",
      "options": [
        "Gary Coleman",
        "Bernie Casey",
        "Denzel Washington",
        "Fred Williamson"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which team was the winner of the 1951 Little League World Series?",
      "options": [
        "Houston, TX.",
        "Austin, TX.",
        "Stamford, Ct.",
        "Louisville, Ky."
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which player held the record for the most consecutive 30 home run seasons in Major League history after the completion of the 2007 season?",
      "options": [
        "Hank Aaron",
        "Barry Bonds",
        "Frank Robinson",
        "Babe Ruth"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The land on which Yankee Stadium was built was bought for this price.",
      "options": [
        "$1,25,000",
        "$4,500",
        "$2,500,000",
        "$675,000"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This former Indiana Pacer retired in 2005 as the record holder for most career three-pointers.",
      "options": [
        "Tim Hardaway",
        "Mark Johnson",
        "Reggie Miller",
        "Dale Ellis"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which team won Super Bowl VII and Super Bowl VIII?",
      "options": [
        "Pittsburgh Steelers",
        "San Francisco 49ERs",
        "Miami Dolphins",
        "Dallas Cowboys"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In Saved by the Bell, when Zack hurt his knee and had to have surgery, which sport was he playing?",
      "options": [
        "Volleyball",
        "Track",
        "Basketball",
        "Tennis"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Dwight David Eisenhower was a great US General and the 34th President of the USA. He had thoughts of becoming a football player until he was injured tackling this great athlete.",
      "options": [
        "Jim Thorpe",
        "O.J. Simpson",
        "Red Grange",
        "Jim Brown"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which professional soccer player spent his entire club career (25 years) in A.C. Milan?",
      "options": [
        "Vialli",
        "Marco van Basten",
        "Franco Baresi",
        "Paolo Maldini"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When did Jeff Hardy make his WWE debut?",
      "options": [
        "1996",
        "1995",
        "1997",
        "1998"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first man to run a mile in under 4 minutes?",
      "options": [
        "Jim Thorpe",
        "Bill Hayes",
        "Roger Bannister",
        "Marcel Coe"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What was the nickname of Mike Tyson?",
      "options": [
        "Iron Mike",
        "Mike the Unbeatable",
        "Mike the Machine",
        "Mike the Punisher"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This former AFL offensive tackle was nicknamed The Intellectual Assassin.",
      "options": [
        "Yale Mix",
        "Ron Mix",
        "Ron Munoz",
        "Yale Munoz"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "He is a member of the Grand Ole Opry and the Country Music Hall of Fame, yet he only had one #1 country hit in the USA. It was May the Bird Of Paradise Fly Up Your Nose which hit #4 on the Canadian singles chart. If you were over 10 years old in the mid-60s, you should be able to name this rhinestone-studded performer. Who is he?",
      "options": [
        "Little Jimmy Dickens",
        "Tim Ryan",
        "Dusty Drake",
        "Jerry Kilgore"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "On June 17, 1994 actor and football legend O. J. Simpson, instead of turning himself into the authorities to be charged for the murder of his wife Nicole and her friend Ron Goldman, led the police on a slow speed chase on Interstate 405. O. J. Simpson was a passenger in the white Ford Bronco. Who drove the white Bronco?",
      "options": [
        "John McKay",
        "Robert Shapiro",
        "Al Cowlings",
        "Robert Kardashian"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What was the first Unification title match at SummerSlam?",
      "options": [
        "IC Champion Jeff Jarrett Vs Euorpeon Champion D-Lo Brown",
        "WWE Champion C.M. Punk Vs WWE champion John Cena",
        "WWE World Tag Champions The Undertaker Kane Vs WCW Tag Champions DDP Kanyon",
        "Lightweight Champion X-Pac Vs Cruiserweight Champion Tajiri"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "His first name was Jimmy and he was a great defensive back for the San Francisco 49ers from 1961 -1976. He is in the Pro Football Hall of Fame. His brother, Rafer, is more famous as an athlete and as a part-time special bodyguard. What is Jimmy and Rafers last name?",
      "options": [
        "James",
        "Johnson",
        "Jackson",
        "Jameson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This NFL defensive back, called Night Train, began his career in 1952 and led the league in interceptions as a rookie. He was elected to the Professional Football Hall of Fame in 1974.",
      "options": [
        "Bobby Layne",
        "Dick Lane",
        "Dick Patton",
        "Ronnie Lott"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The Steelers began playing at this Stadium in the 2001 season.",
      "options": [
        "Forbes Field",
        "Texas Stadium",
        "Heinz Field",
        "Three Rivers Stadium"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During the 1970-1971 season, which Eastern Conference team had the best record and got the Most Valuable Player Award?",
      "options": [
        "NY Knicks",
        "Milwaukee Bucks",
        "Philadelphia 76ers",
        "Boston Celtics"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "How many are the Grand Slam tournaments?",
      "options": [
        "4",
        "8",
        "3",
        "5"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first Major League Baseball player to hit four homers in one game and three triples in another game?",
      "options": [
        "Tris Speaker",
        "Mickey Mantle",
        "Joe Dimaggio",
        "Willie Mays"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which statement is true about major league baseball pitcher Danny Graves?",
      "options": [
        "He was the first major league pitcher to hit a grandslam home run in his first MLB game.",
        "He was the first major leaguer from Vietnam.",
        "He was the first major leaguer from New Zealand.",
        "He was the first MLB player to toss a shutout in his first three games."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "While starting his career with the Red Sox, it was with the Yankees that Wade Boggs won the World Series. Where did you usually see Wade play?",
      "options": [
        "Shortstop",
        "Left Field",
        "Third Base",
        "Right Field"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This famous player from South Dakota is the first placekicker to win four NFL championships.",
      "options": [
        "Tom Dempsey",
        "Gary Anderson",
        "Adam Vinatieri",
        "George Blanda"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what year did the Pittsburgh Penguins win their first Playoff Series?",
      "options": [
        "1972",
        "1967",
        "1968",
        "1970"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Philadelphia Warriors became the first NBA champions in this year.",
      "options": [
        "1950",
        "1947",
        "1939",
        "1943"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What professional team did hockey great Wayne Gretzky start his career with?",
      "options": [
        "Los Angeles Kings",
        "New York Rangers",
        "St Louis Blues",
        "Edmonton Oilers"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This great pitcher of the New York Mets won the Rookie of the Year award in 1972 by going 15-10 with a 2.32 ERA.",
      "options": [
        "Tom Seaver",
        "Nino Espinosa",
        "Jerry Koosman",
        "Jon Matlack"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1979, she became the first person to swim from the Bahamas to Florida.",
      "options": [
        "Tracy Caulkins",
        "Diane Nyad",
        "Michelle Yu",
        "Gertrude Ederle"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first man to drive a car at at least 60 miles per hour?",
      "options": [
        "Carl G. Fisher",
        "Barney Oldfield",
        "Bob Burman",
        "Cale Yarborough"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Harrison Ford is an avid fan of this sport.",
      "options": [
        "Badminton",
        "Mixed Martial Arts",
        "Fishing",
        "Drag Racing"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who was he first man to win the tennis Grand Slam?",
      "options": [
        "Rene Lacoste",
        "Spencer W. Gore",
        "Don Budge",
        "Rod Laver"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which two teams had the best NBA records in the 1997-1998 Season?",
      "options": [
        "Chicago Bulls and Utah jazz",
        "Houston Rockets and Seattle Supersonics",
        "New York Knicks and Miami Heat",
        "San Antonio and L.A. Lakers"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who screamed the now famous words, Struck em out! Struck em out! The Mets have won the World Series!?",
      "options": [
        "Bob Murphy",
        "Howie Rose",
        "Ralph Kiner",
        "Gary Thorne"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who became coach of the Minnesota Wild in the 2009-2010 season?",
      "options": [
        "Brad Bomadiar",
        "Phil Housley",
        "Todd Richards",
        "Jacques Lemaire"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This sportsman has been a great NHL player and head coach and part-owner of the Phoenix Coyotes.",
      "options": [
        "Gordie Howe",
        "Scotty Bowman",
        "Wayne Gretzky",
        "Bobby Hull"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "On the TV show The White Shadow, the Coach was cut from which NBA team?",
      "options": [
        "Los Angeles Clippers",
        "Chicago Bulls",
        "It was never specified.",
        "New York Knicks"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Dating back to 776 B.C., the ancient Olympic Games were held in the valley of Olympia in southwestern Greece, to honor this god.",
      "options": [
        "Apollo",
        "Poseidon",
        "Zeus",
        "Hermes"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1997 the Atlanta Braves baseball team started playing its home games at Turner Field. What was Turner Field used for before it was a baseball stadium?",
      "options": [
        "Soccer",
        "Football",
        "Lacrosse",
        "Track and Field"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Where did the Philadelphia Eagles use to play?",
      "options": [
        "Cincinnati, OH",
        "Rochest, NY",
        "Pittsburgh and Philadelphia",
        "Canton, OH"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following tennis players was the World number one player for the most number of consecutive weeks?",
      "options": [
        "Pete Sampras (USA)",
        "Ivan Lendl (Czechoslovakia and USA)",
        "Roger Federer (Switzerland)",
        "Jimmy Connors (USA)"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This Joe was the youngest player to pitch during the 20th century.",
      "options": [
        "Cronin",
        "Torre",
        "Nuxhall",
        "Mauer"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Why did professional wrestler Stacy Keibler retire from wrestling?",
      "options": [
        "She wanted to have a social life and move on to other endeavors.",
        "She didnt quit.",
        "She really wanted to dance, and take a break.",
        "She didnt like the fame anymore."
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This Hall of Famer played for The Philadelphia Athletics from 1925 to 1935.",
      "options": [
        "Connie Mack",
        "Jimmie Foxx",
        "Clay Jointer",
        "Roger Breece"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What former professional wrestler won the 1986 Slammy Award for Best Male Performance?",
      "options": [
        "Hulk Hogan",
        "Roddy Piper",
        "Mr. Wonderful",
        "Junk Yard Dog"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This point guard grew up in Kansas, where he went to school. Somehow, Red Auerbach got him into the Connecticut National Guard, to keep him from being drafted. Who is he?",
      "options": [
        "Stefan Telfair",
        "JoJo White",
        "Dennis Johnson",
        "Nate Archibald"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What team did Tony Dorsett play for after he left the Cowboys?",
      "options": [
        "Falcons",
        "Vikings",
        "Colts",
        "Broncons"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Danny Granger played basketball at what college?",
      "options": [
        "Colorado State",
        "New Mexico",
        "Wyoming",
        "Utah State"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following is not true about Gilbert Arenas?",
      "options": [
        "He has a large tent in his house converted to a low oxygen level similar to that of Colorado.",
        "His middle name is not Jay.",
        "He officially owns Team Final Boss, a professional Halo 2 gaming team.",
        "He has mentored a D.C. boy who lost his family in a fire at age 10."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the first logo of the New England Patriots?",
      "options": [
        "a hat",
        "a head",
        "a banana",
        "a boot"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Three of these MLB players have hit at least 400 home runs in one single decade. Who does not belong to the group?",
      "options": [
        "Ted Williams",
        "Mark McGwire",
        "Babe Ruth",
        "Jimmie Fox"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where did the Atlanta Braves team originate?",
      "options": [
        "Boston",
        "Milwaukee",
        "Sacramento",
        "They were always in Atlanta"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In what year did Paul Bryant become head coach for the University of Alabama?",
      "options": [
        "1966",
        "1958",
        "1973",
        "1956"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "After graduating from the University of California at Berkley, this great point guard became the NBA rookie of the year for the 1994/1995 year. He has been in at least 8 All-Star games.",
      "options": [
        "Kobe Bryant",
        "Jason Kidd",
        "John Stockton",
        "Steve Nash"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what year did Specialized Bicycle Components produce the first mountain bike called the Stumpjumper?",
      "options": [
        "1982",
        "1973",
        "1978",
        "1984"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This well known tag team wrestlers son was drafted by the St. Louis Rams in the 2nd Round as the 35th overall pick in the 2009 NFL draft.",
      "options": [
        "Road Warrior Animal",
        "Harlem Heats Stevie Ray",
        "Jim The Anvil Neidhart",
        "Demolitions Smash"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In this year Wembley becomes the official host of the competition.",
      "options": [
        "1944",
        "1929",
        "1923",
        "1934"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In what country did the disc dog sport, commonly known as frisbee dog, originate?",
      "options": [
        "United States",
        "Scotland",
        "Australia",
        "China"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which team won Super Bowl XXXII?",
      "options": [
        "Seahawks",
        "Steelers",
        "Packers",
        "Broncos"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Kart racing, a sport that originated in the 1950s in the United States, was created and popularised in which of these professional fields?",
      "options": [
        "Military air forces",
        "Military medics",
        "Infantry",
        "Military mechanicians"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What quarter back led in passing yards in 2002?",
      "options": [
        "Payton Manning",
        "Rich Gannon",
        "Donovan McNabb",
        "Brett Farve"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Jason Williams, nicknamed White Chocolate, played college basketball at the University of Florida in 1998. What school did Williams play for before he transferred to Florida?",
      "options": [
        "West Virginia",
        "Western Kentucky",
        "Marshall",
        "Cincinnati"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What bull was commonly referred to as \u201cThe World\u2019s Most Dangerous Bull\u201d?",
      "options": [
        "Yellow Jacket",
        "Grasshopper",
        "Wolf Man",
        "Bodacious"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which city did the New York Giants move to?",
      "options": [
        "San Diego",
        "Seattle",
        "Tampa",
        "San Francisco"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What was the final score of LSUs 2005 bowl game?",
      "options": [
        "LSU 41 - Miami 17",
        "LSU 49 - Miami 3",
        "LSU 10 - Miami 45",
        "LSU 40 - Miami 3"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What is the purpose of the piece of rope used by a calf roper?",
      "options": [
        "It makes the horse back up.",
        "It is used to tie the calf.",
        "It makes the horse stop.",
        "None of these"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Each year the NFL gives an award for kickers which is named after this former NFL great.",
      "options": [
        "Tommy OBrien",
        "Elbert Dubinion",
        "Lou Groza",
        "Sammy Baugh"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Compton Junior College gave us this all-time great runner, who played fullback and was nicknamed Joe the Jet.",
      "options": [
        "Neale",
        "Battles",
        "Sanders",
        "Perry"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Philadelphia 76ers are a basketball team. What does 76 represent?",
      "options": [
        "1776, the year the Declaration of Independence was signed",
        "The amount of money (in thousands) the teams founders had",
        "The age of Danny Biasone when he founded the team",
        "1976, the year in which the club was established"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which German soccer star was voted European Soccer Player of the Year in both 1972 and 1976?",
      "options": [
        "Lev Yashin",
        "Michael Balack",
        "Ferenc Puskas",
        "Franz Beckenbauer"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "During the period 1984-1989, how many times did the Edmonton OIlers win the NHL championship?",
      "options": [
        "5",
        "0",
        "4",
        "3"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Guess the nickname of Henry Louis Gehrig.",
      "options": [
        "The Iron Horse",
        "Hank",
        "Swish",
        "Joltin Joe"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "One of college footballs greatest traditions is the Rose Bowl played on New Years Day. What university hosted the only Rose Bowl not played in Pasadena?",
      "options": [
        "Sanford",
        "Duke",
        "University of Oklahoma",
        "University of Washington"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What team won the World Series in 1980?",
      "options": [
        "Yankees",
        "Royals",
        "Phillies",
        "Dodgers"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How much should a boxer weigh in order to be in the Lightweight class?",
      "options": [
        "up to 49.0 kg",
        "up to 47.6 kg",
        "up to 53.5",
        "up to 59.0 kg"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Major League players at this position were the first to hit over 37,000 home runs.",
      "options": [
        "First base",
        "Center Field",
        "Right Field",
        "Left field"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This Texas artist drew the artwork for Zorlac skateboards and was a regular contributing artist for Thrasher magazine.",
      "options": [
        "Lance Armstrong",
        "Pushead",
        "Henry Vincent",
        "Vincent VanGogh"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What talented NHL player, future Hall of Famer, held the record for longest-serving captain in 2007?",
      "options": [
        "Wayne Gretzky",
        "Mario Lemuiex",
        "Gordie Howe",
        "Steve Yzerman"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This major league baseball player was easily the best pitcher in the National League in 1986.",
      "options": [
        "J.R. Richard",
        "Jack Clark",
        "Matt Clark",
        "Mike Scott"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following players scored 76 goals in his rookie season?",
      "options": [
        "Brett Hull",
        "Jagomir Jagr",
        "Teemu Sel\u00e4nne",
        "Wayne Gretzky"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When did the New York Giants win the World Series over the Cleveland Indians?",
      "options": [
        "1954",
        "1956",
        "1959",
        "1951"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what month and year did John McEnroe become the worlds number 1 player according to the association of tennis professionals?",
      "options": [
        "March 1980",
        "February 1979",
        "March 1982",
        "February 1981"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which team won the NCAA Womens National Championship in 1985 as a member of the Sun Belt Conference?",
      "options": [
        "Old Dominion University",
        "Louisiana Tech University",
        "University of North Carolina-Charlotte",
        "Western Kentucky University"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which of these is not a reported benefit of Pilates?",
      "options": [
        "Decreased appetite",
        "Improved Posture",
        "Improved flexibility",
        "Decreased back pain"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which cyclist was diagnosed with testicle cancer, but recovered and won the prestigious Tour de France race for a record breaking 7 consecutive years?",
      "options": [
        "Bernard Hinault (France)",
        "Lance Armstrong (USA)",
        "Eddy Merckx (Belgium)",
        "Miguel Indurain (Spain)"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "During these Summer Olympics, 11 members of the Israeli team were taken hostage and later killed by Palestinian terrorists.",
      "options": [
        "Los Angeles 1984",
        "Munich 1972",
        "Barcelona 1992",
        "Montreal 1976"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which two schools are given credit for playing the first college football game?",
      "options": [
        "Princeton - Rutgers",
        "Chicago - Ohio State",
        "Purdue - Notre Dame",
        "UCLA - USC"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first gymnast in Olympic history to score a perfect 10?",
      "options": [
        "Svetlana Boguinskaya (Russia)",
        "Olga Korbut (USSR)",
        "Nadia Comaneci (Romania)",
        "Mary Lou Retton (USA)"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Why does a diving mask cover the nose?",
      "options": [
        "To prevent mask squeeze",
        "To allow you to breathe through your nose",
        "To increase your visibility",
        "To keep water from going up your nose"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In a 1942 fight, Tommy Cross entered the ring and then had to suddenly leave. Why?",
      "options": [
        "He came out for the wrong fight.",
        "He was not wearing his trunks.",
        "The ring was out in the open and it began to rain terribly.",
        "He was in the wrong boxing ring."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When was the first US auto race held?",
      "options": [
        "1895",
        "1910",
        "1925",
        "1905"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "If you ever get drafted by the Detroit Red Wings and you want to wear #19 you are out of luck. # 19 was retired to honor this former Red Wings captain on January 2, 2007.",
      "options": [
        "Ted Lindsay",
        "Steve Yzerman",
        "Gordie Howe",
        "Chris Chelios"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Keanu Reeves dreamed of a career in this sport when he was a student.",
      "options": [
        "Basketball",
        "Rugby",
        "Baseball",
        "Hockey"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Washington Senators of 1960 left for which one of these cities?",
      "options": [
        "Detroit",
        "Minneapolis",
        "Chicago",
        "Milwaukee"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What was the first Asian city to host the Olympics, in 1964?",
      "options": [
        "Sapporo",
        "Tokyo",
        "Seoul",
        "Nagano"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The catcher Gary Carter, who wore number 8, was a powerful hitter. He sent one over the green monster at Fenway Park during the World Series. Which team did the Mets acquire him from?",
      "options": [
        "Philadelphia Phillies",
        "Florida Marlins",
        "Montreal Expos",
        "Kansas City Royals"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Pittsburgh Steelers of the 50s had a third string quarterback from Louisville, who was not making it. They cut him and he landed with the Colts. Who was he?",
      "options": [
        "Len Dawson",
        "Johnny Unitas",
        "Bert Jones Jr",
        "Terry Bradshaw"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Elements of which sport does the game called pickleball include?",
      "options": [
        "All of these",
        "Badminton",
        "Tennis",
        "Ping-pong"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This Yankee slugger hit a total of 23 Grand Slams in his career.",
      "options": [
        "Reggie Jackson",
        "Lou Gehrig",
        "Yogi Berra",
        "Mickey Mantle"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In the movie Happy Gilmore, Happy takes his soon to be girlfriend, Virginia to an ice skating rink where they slow dance. What was the name of the song playing in the background while they were skating?",
      "options": [
        "Baby Come To Me",
        "Endless Love",
        "50 Ways To Leave Your Lover",
        "Just You And I"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Joe Girardi caught a perfect game on July 18, 1999. Who was the winning pitcher?",
      "options": [
        "David Cone",
        "David Wells",
        "Jimmy Keys",
        "Al Leiter"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "There are open, semi-open and closed openings. Which of the following openings would be considered an open game?",
      "options": [
        "The Kings Indian Defense",
        "The Two Knights Defense",
        "The Queens Indian Defense",
        "The Queens Gambit"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these men is not associated with NASCAR?",
      "options": [
        "Jack Roush",
        "Dale Earnhardt, Jr.",
        "Eric Grubman",
        "Brian France"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first woman drafted to the NBA?",
      "options": [
        "it never happened",
        "Lynette Woodard",
        "Ann Meyers",
        "Cheryl Miller"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "It is generally accepted that the phrase red herring, which has been in popular parlance for many years, is derived from which sport?",
      "options": [
        "Fox hunting",
        "Fencing",
        "Golf",
        "Bowling"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which one of these players became a U.S. citizen during the 2004 season?",
      "options": [
        "Orlando Cabrera",
        "Manny Ramirez",
        "David Ortiz",
        "Pedro Martinez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Wilt The Stilt Chamberlain became the first NBA player who has scored 100 points in a single game. Against which team did he score the 100 points?",
      "options": [
        "The Fort Wayne Pistons",
        "The Saint Louis Hawks",
        "The New York Knicks",
        "The Chicago Bulls"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Baseball player Alexander Rodriguez, who became the youngest player ever to hit 500 home runs, started his professional career with this team.",
      "options": [
        "Detroit Tigers",
        "Texas Rangers",
        "New York Yankees",
        "Seattle Mariners"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "For what U.S. football team did David Beckham start playing in 2007?",
      "options": [
        "Los Angeles Galaxy",
        "New York Red Bulls",
        "D.C. United",
        "Columbus Crew"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which golf course is commonly referred to as the home of golf?",
      "options": [
        "Pebble Beach",
        "St. Andrews",
        "Turnberry",
        "Royal Birkdale"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which British novelist and essayist defined sport in this way: \u201cSerious sport has nothing to do with fair play. It is bound up with hatred, jealousy, boastfulness, disregard of all rules and sadistic pleasure in witnessing violence. In other words, it is war without the shooting.\u201d?",
      "options": [
        "George Orwell",
        "Dwight Eisenhower",
        "Omar Bradley",
        "George Custer"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Soviet Union pair to win the Winter Olympics?",
      "options": [
        "The Protopopovs",
        "Rodnina Zaitsev",
        "Gordeeva Grinkov",
        "Mishkatanuk Dmitriev"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the national sport of Greenland?",
      "options": [
        "Ice skating",
        "Skiing",
        "Ice hockey",
        "Football"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Whitey Ford was a successful Major League Baseball player, who played in what position?",
      "options": [
        "First Base",
        "Catcher",
        "Pitcher",
        "Shortstop"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This college was first to have the first overall pick for both the NFL and the NBA in the same year.",
      "options": [
        "Notre Dame",
        "Utah",
        "Texas",
        "USC"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What college did Gilbert Arenas play for?",
      "options": [
        "Duke",
        "Georgetown",
        "Arizona State",
        "North Carolina"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which player scored the winning penalty to secure Italys 4th World Cup victory in 2006?",
      "options": [
        "Gennarro Gattusso",
        "Luca Toni",
        "Franseco Totti",
        "Fabio Grosso"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where was Brett Favre raised?",
      "options": [
        "Kiln, Mississippi",
        "Green Bay, Wisconsin",
        "Burton, Alabama",
        "Memphis, Tennessee"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What do Oscar Robertson (ex-NBA All-Star) and Roy Orbison (the great singer/songwriter) have in common?",
      "options": [
        "The same nickname",
        "The same birthplace",
        "The same wife",
        "The same birthdate"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Bill Bowerman and this man co-founded the sports line Nike.",
      "options": [
        "Tony Ponturro",
        "Steve Prontier",
        "Phil Knight",
        "Jim Collins"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which ski jumper was badly injured in a training session in 2002, but recovered in a month to win 2 gold medals at the Salt Lake City Olympics?",
      "options": [
        "Adam Ma\u0142ysz",
        "Sven Hannavald",
        "Simon Ammann",
        "Matti Hautamaeki"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Before becoming an important political figure, this George was a businessman, involved with the oil industry and then with professional sports.",
      "options": [
        "George Orwell",
        "George W Bush",
        "George Washington",
        "George Eliot"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1948 this duo recorded Im My Own Grandpa and theyre also noted for the boxing song, You Blacked My Blue Eyes Once Too Often. If you watched Sesame Street or Stewie on Family Guy singing Hole In the Bottom of the Sea, it was this pair who sang it first as pure country. Who are they?",
      "options": [
        "Lonzo Oscar",
        "Big Rich",
        "Homer Jethro",
        "Brooks Dunn"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player scored six goals at the 1997 match between Vasco/RJ and Uniao Joao de Araras, thus breaking the record for the most goals in a single game in the Brazilian Championship.",
      "options": [
        "Pele",
        "Edmundo",
        "Ronaldo",
        "Dude"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which European soccer star was nicknamed \u201cThe black pearl\u201d?",
      "options": [
        "Ferenc Puskas",
        "Ronaldinho",
        "George Weah",
        "Eusebio da Silva Ferriera"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Coached by Yao Bin, this Chinese pair team have a lot of firsts under their belts. They were the first Chinese team to stand on the podium at the World Figure Skating Championships, earning silver in 1999. They later became the first Chinese team to medal at the Winter Olympics in 2002, earning the bronze, and in March of 2002 they were the first to win gold at the World Championships. Who are they?",
      "options": [
        "Xue Shen Hongbo Zhao",
        "Qing Pang Jion Tong",
        "None of these",
        "Dan Hao Zhang"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which Bear Bryant quarterback said When you win, nothing hurts.?",
      "options": [
        "Kenny Stabler",
        "Mike Ditka",
        "Jerry Rome",
        "Joe Namath"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Tinku sounds like the noise my old car made but its not. What phrase would you connect with this art?",
      "options": [
        "Mexican professional wrestling",
        "Founded in 1980 by Robert Puch",
        "African slaves in Brazil",
        "Potosi region of Bolivia"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Dale Earnhardts death led to more safety features added to race cars to improve a drivers chance to escape harm. Which one was not a safety feature added as a result of his death?",
      "options": [
        "Roof and Hatch Escape",
        "Restrictor Plates",
        "Head and Neck Restraints HANS",
        "SAFFR Barrier"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which quarterback did not play at the University of Georgia?",
      "options": [
        "Buck Belue",
        "Mike Bobo",
        "Todd Blackledge",
        "Fran Tarkington"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the baseball players known as Sparky, has the first and middle name of George Lee?",
      "options": [
        "Sparky Anderson",
        "Sparky Farkas",
        "Sparky Frickshun",
        "Sparky Lyle"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What was Bob Gibsons earned run average in 1968?",
      "options": [
        "1.00",
        "1.58",
        "1.12",
        "1.39"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What is the nickname of the University of Cincinnati?",
      "options": [
        "Bearcats",
        "Wildcats",
        "Bearpack",
        "Tigers"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This infielder came to the New York Mets from the Dodgers in December 1983.",
      "options": [
        "Carlos Diaz",
        "Buddy Biancalana",
        "Billy Almon",
        "Ross Jones"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which NBA star was elected president of the Executive Committee of National Basketball Player Association in 2004?",
      "options": [
        "Antonio Davis",
        "Pat Garrity",
        "P.J. Brown",
        "Derek Fisher"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these ladies was the first woman to play on a professional minor league baseball team?",
      "options": [
        "Julie Croteau",
        "Maria Pepe",
        "Carla Stotz",
        "Kendra Hanes"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following events marred the 1972 summer Olympics in Munich?",
      "options": [
        "Eleven Israeli athletes were killed after being kidnapped by Palestinian terrorists.",
        "The marathon winner was found to have run only a portion of the race, hitching a ride for several miles before returning to the course.",
        "Three boxing judges were accused of bribery after they awarded the decision to a South Korean light middleweight who was dominated by his American opponent.",
        "The quarters of several Austrian athletes were raided as part of a massive doping investigation."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What type of surgery did football star Diego Maradona undergo on March 6, 2005?",
      "options": [
        "Gastric bypass surgery",
        "Brain surgery",
        "Knee surgery",
        "Plastic surgery"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the first tag team title change at SummerSlam?",
      "options": [
        "Andre The Giant And Haku Vs Legion of Doom",
        "Hart Foundation Vs Legion of Doom",
        "Demolition Vs The Hart Foundation",
        "Andre The Giant and Haku Vs Demolition"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "During his lifetime Bob Hope was part-owner of the Cleveland Indians baseball team and what NFL football team?",
      "options": [
        "Cleveland Browns",
        "Los Angeles Rams",
        "San Diego Chargers",
        "Dallas Cowboys"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This durable player retired in 1997 as the record holder for most games played in a career.",
      "options": [
        "Magic Johnson",
        "John Stockton",
        "Karl Malone",
        "Robert Parish"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the name of Tiger Woods first-born child, who was born on June 18, 2007?",
      "options": [
        "Sam",
        "Elin",
        "Michaela",
        "Christine"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the score of Penn State Nittany Lions in the first game of the 2008-2009 season vs. Coastal Carolina?",
      "options": [
        "66-17, Penn State lost",
        "66-10, Penn State won",
        "55-14, Penn State won",
        "24-21, Penn State lost"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these sluggers never hit for at least 40 home runs in a single MLB season?",
      "options": [
        "Reggie Jackson",
        "Joe Carter",
        "Eddie Matthews",
        "Jose Canseco"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This football player was accused of murdering his former wife Nicole Brown, and her friend, Ronald Goldman, in 1994. He was acquitted the following year.",
      "options": [
        "David Beckam",
        "O. J. Simpson",
        "Christian Brando",
        "Rae Carruth"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first person to become a member of both the Pro Football Hall of Fame and the Baseball Hall of Fame?",
      "options": [
        "Cal Hubbard",
        "Jackie Jensen",
        "Bo Jackson",
        "Dave Winfield"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who won the Stanley Cup for the 2004-2005 NHL season?",
      "options": [
        "Anaheim Ducks",
        "New Jersey Devils",
        "Colorado Avalanche",
        "None of these"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Phil Rizzuto often said I gotta get over that bridge. To what did this phrase refer?",
      "options": [
        "He worried bout the game having to go to extra innings so hed have to work overtime.",
        "He was worried about getting home late because of traffic on the George Washington Bridge to NJ.",
        "He was worried about getting through to the sixth inning when Bill White would take over the announcing, making White his bridge to relaxing.",
        "He was worried about getting through the seventh inning when he got an inning off."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was manager of the Boston Red Sox when they won their first World Series in over 90 years?",
      "options": [
        "Terry Francona",
        "Terry Barr",
        "Abner Terry",
        "Terry Baker"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How many teams did Brett Favre play for in his professional career?",
      "options": [
        "2",
        "1",
        "4",
        "3"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NHL player to score 100 points in a season?",
      "options": [
        "Esposito",
        "Howe",
        "Gretsky",
        "Richard"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which one of the following Sun Belt Conference Member schools is not paired up correctly with its mascot?",
      "options": [
        "Middle Tennessee State - Blue Raiders",
        "New Orleans - Privateers",
        "Western Kentucky - Hilltoppers",
        "Arkansas State - Red Wolves"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which member of the McMahon family tried to drug Triple H backstage in one of the editions of Raw?",
      "options": [
        "Vince McMahon",
        "Stephanie McMahon",
        "Linda McMahon",
        "Shane McMahon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the second Major League Baseball switch-hitter to hit 500 home runs?",
      "options": [
        "Mickey Mantle",
        "Eddie Mathews",
        "Eddie Murray",
        "Harmon Killebrew"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which sport is mentioned in Shakespeares Henry V?",
      "options": [
        "Golf",
        "Darts",
        "Tennis",
        "Bowling"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This box-office heavyweight has portrayed numerous athlete-heroes in his movie career, but in real life his favorite competitive sport is auto racing.",
      "options": [
        "Paul Newman",
        "Tom Cruise",
        "Woody Allen",
        "Robert Redford"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "During this decade, MTV was launched, the Chernobyl accident happened, and NBA star Michael Jordan rose to fame.",
      "options": [
        "1980s",
        "1990s",
        "1960s",
        "1970s"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Moe Berg was a professional baseball player, a catcher. Which one of these statements about him is correct?",
      "options": [
        "He was an international spy.",
        "He was the last out in Don Larsens perfect game.",
        "He was the only catcher to catch three no hitters.",
        "He was on base when Ruth hit home run number 60."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This early Auburn coach said Gentlemen, it is better to have died a small boy than to fumble this football.",
      "options": [
        "John Heisman",
        "Willie Stargel",
        "Pop Warner",
        "Otis Armstrong"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 2001 this player became the first ever wild card entry to win the Wimbledon tournament.",
      "options": [
        "Goran Ivani\u0161evi\u0107",
        "Boris Becker",
        "Pat Rafter",
        "Andy Roddick"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "When the New York Mets traded Rick Ownbey and Neil Allen to the St. Louis Cardinals in 1983 who did they get in return?",
      "options": [
        "Kevin Mitchell",
        "Ron Darling",
        "Ray Knight",
        "Keith Hernandez"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which mens national team is NOT correctly matched with the sport in which they won a gold medal in the 2012 Summer Olympics?",
      "options": [
        "Football - Mexico",
        "Brazil - indoor volleyball",
        "The USA - basketball",
        "France - Handball"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following did veteran pitcher Eddie Harris NOT use as a foreign substance to doctor the baseball in the movie Major League?",
      "options": [
        "Crisco",
        "K-Y jelly",
        "Bardol",
        "Vagisil"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The first references to indoor billiards date back to this century, when the game became especially fashionable among royalties.",
      "options": [
        "7th century",
        "13th century",
        "10th century",
        "15th century"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Bubba was the birth name of how many of these eight athletes: Church, Crosby, Franks, Long, Trammell, Smith, Walton, Wells?",
      "options": [
        "All",
        "2",
        "1",
        "0"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year did Ted Williams debut with the Boston Red Sox?",
      "options": [
        "1940",
        "1939",
        "1937",
        "1941"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In the autumn of 2006 Poland won two silver medals at the World Championships in these sports.",
      "options": [
        "Football (Men) and Basketball (Women)",
        "Football (Women) and Handball (Women)",
        "Volleyball (Men) and Handball (Men)",
        "Basketball (Men) and Volleyball (Women)"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1994 in Lilihammer, this lady became the first Chinese skater to win a medal.",
      "options": [
        "Dan Fang",
        "None of these",
        "Caroline Zhang",
        "Lu Chen"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This company, with a huge ad budget in the world of sports, has a sports marketing division which creates advertising material for the Super Bowl.",
      "options": [
        "Concast",
        "Colgate-Palmolive",
        "Anheuser-Busch",
        "Verizon"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This great NBA guard played from 1958\u20131967 for the Boston Celtics. For many years he was the best defensive guard in the NBA.",
      "options": [
        "John Havlichek",
        "Mike Farmer",
        "K.C. Jones",
        "Sam Jones"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What type of sport is enduro?",
      "options": [
        "Motorcycle sport",
        "None of these",
        "Running marathon",
        "Martial art"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This Joe played primarily first base for the Yankees starting in 1962.",
      "options": [
        "Skowron",
        "Pepitone",
        "Jacoby",
        "Jeter"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This place kicker, who would later play for the NFL Chicago Bears, kicked a 60 yard game-winning field goal against the Clemson Tigers in 1984.",
      "options": [
        "Al Del Greco",
        "Kevin Butler",
        "Van Tiffen",
        "Rex Robinson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where is outfielder Shane Victorino from?",
      "options": [
        "California",
        "Alaska",
        "Japan",
        "Hawaii"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which team did the Mets beat to win the NL pennant and reach the World Series?",
      "options": [
        "Atlanta Braves",
        "Houston Astros",
        "Los Angeles Dodgers",
        "Cincinnati Reds"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What year was the first Super Bowl played?",
      "options": [
        "1965",
        "1968",
        "1966",
        "1967"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "For what team did Tony Dorsett play after he left the Cowboys?",
      "options": [
        "Houston Oilers",
        "Minnesota Vikings",
        "Pittsburgh Steelers",
        "Denver Broncos"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the starting quarterback for LSU in their 2005 bowl game?",
      "options": [
        "Jeremy Bunting",
        "JaMarcus Russell",
        "Craig Davis",
        "Matt Flynn"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1992, after 20 years of isolation, Bobby Fischer re-emerged to play a match against this player in Yugoslavia.",
      "options": [
        "Karpov",
        "Kasparov",
        "Spassky",
        "Berlitz"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What was Phil Rizzutos forte?",
      "options": [
        "Bunting and defense",
        "Knocking in runners from second and third",
        "Getting extra base hits (doubles and triples)",
        "Hitting home runs"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What does NASCAR stand for?",
      "options": [
        "National Association for Street Car Auto Racing",
        "National Alliance for Sports Car Auto Racing",
        "National Association for Stock Car Auto Racing",
        "Non Athletic Sport Centered Around Rednecks"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Mets won how many regular season games en route to their postseason and title?",
      "options": [
        "109",
        "106",
        "107",
        "108"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these cyclists has the most Tour De France wins?",
      "options": [
        "Eddie Merckx",
        "Bernard Hinault",
        "Lance Armstrong",
        "Jacques Anquetil"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This basketball Hall Of Famer was known for 22 years, as the Clown Prince of the Globetrotters, a team upon which he left his mark as a player. His first name was Meadowlark . What is his last name ?",
      "options": [
        "Lemon",
        "Watkins",
        "McCoy",
        "Johnson"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How Many Times has Randy Savage been the Macho King at SummerSlam?",
      "options": [
        "2",
        "3",
        "0",
        "1"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The presence of two members of this sports family raises the TV ratings at tennis tournaments even when they are not winning.",
      "options": [
        "Sharpe",
        "Williams",
        "Clooney",
        "Nastasee"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In which European country were the 2006 Winter Olympics held?",
      "options": [
        "Germany",
        "France",
        "Italy",
        "Switzerland"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What is the name of the second baseman of the 2008 Philadelphia Phillies?",
      "options": [
        "Chase Utley",
        "Matt Stairs",
        "Brett Myers",
        "Ramon Feliz"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What NFL wide receiver was drafted by the Colts in 1996?",
      "options": [
        "Terrell Owens",
        "Marvin Harrison",
        "Pearless Price",
        "Jerry Rice"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1983, N.C. State had to win the Atlantic Coast Conference tournament to be included in the National Collegiate Athletic Association field. What three teams did they defeat to win the tournament?",
      "options": [
        "Virginia, Duke, and Maryland",
        "Duke, South Carolina, and North Carolina",
        "Wake Forest, North Carolina, and Virginia",
        "Wake Forest, Georgia Tech, and Duke"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "NBA player Eddie Jones played college basketball at what school?",
      "options": [
        "Temple",
        "Alabama",
        "Villanova",
        "Houston"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In what year did Roger Staubach win the Heisman Trophy?",
      "options": [
        "1963",
        "1965",
        "1962",
        "1964"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What interesting nickname was given to football player Ronaldo Luis Nazario de Lima, better known simply as Ronaldo?",
      "options": [
        "The Magician",
        "The Phenomenon",
        "The Unbelievable",
        "The Miracle"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "At the 1988 Olympics, this lady earned a bronze medal, thus becoming the first African-American to win an Olympic medal.",
      "options": [
        "Debi Thomas",
        "Jill Trenary",
        "Rory Flack",
        "None of these"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Why are peanuts believed to be bad for auto racing?",
      "options": [
        "They get thrown on the track",
        "Fans throw them at cars.",
        "They distract drivers while in the car.",
        "They are considered bad luck."
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This shortstop had a great year in 1962 winning his second consecutive Gold Glove, the NL MVP Award, and hitting a homerun both rightly and lefty in one game.",
      "options": [
        "Alvin Dark",
        "Maury Wills",
        "Ernie Banks",
        "Dick Groat"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In the 2004 Olympic Games, Michael Phelps set a number of world records, Olympic records, and American records. How many of each did he set?",
      "options": [
        "3 WR, 2 OR, and 2 AR",
        "1 WR, 4 OR, and 2 AR",
        "4 WR, 1 OR, and 2 AR",
        "2 WR, 3 OR, and 2 AR"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who won the first NBA Championship in 1947?",
      "options": [
        "Boston Celtics",
        "Minneapolis Lakers",
        "New York Knicks",
        "Philadelphia Warriors"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "After being detained in Japan in 2004, Bobby Fischer was granted citizenship in this country.",
      "options": [
        "Germany",
        "Italy",
        "Poland",
        "Iceland"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which boxers shared the boxing heavyweight crown in 1978 ?",
      "options": [
        "Ali, Spinks and Holmes",
        "Norton, Spinks, Holmes and Dokes",
        "Ali, Norton, Spinks, Holmes and Ali",
        "Ali and Norton"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which were the first modern Olympic Games to be subject to a boycott by more than one country?",
      "options": [
        "1956, Melbourne",
        "1920, Antwerp",
        "1980, Moscow",
        "1936, Berlin"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 2005, Michelle Kwan won her 9th US title, tying the record set by what other American female skater?",
      "options": [
        "Dorothy Hamill",
        "Maribel Vinson Owen",
        "Carol Heiss",
        "Kristi Yamaguchi"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Michael Phelps (USA, swimming) declared he would set a record by winning 8 gold medals at the Olympic Games in Beijing. How many did he actually win?",
      "options": [
        "6",
        "7",
        "9",
        "8"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This great running back was once traded for eleven players. He had great speed and great moves, returned kicks, caught passes, and ran the ball.",
      "options": [
        "Ollie Matson",
        "Dick Lane",
        "Barry Sanders",
        "Marcus Allen"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How many wins did NASCAR driver Ryan Newman have in 2003?",
      "options": [
        "1",
        "3",
        "8",
        "5"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "She should have gone to the library like she told her old man but shes too busy makin the Indy 500 look like a Roman chariot race, now. Too bad cause Daddy got wise (you shouldnt have lied, you shouldnt have lied) and there isnt going to be anymore Fun, Fun, Fun. What make of car did Daddy take away?",
      "options": [
        "T-Bird",
        "Mercedes Benz",
        "Little Red Corvette",
        "Pink Cadillac"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "During the 80s this man performed and wrestled for the then-WWF. Later, he became the most popular wrestler in the business. His real name is Terrence Gene Bollea. What is his professional name?",
      "options": [
        "Ric Flair",
        "Alexis Arguello",
        "The Undertaker",
        "Hulk Hogan"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who did Muhammad Ali fight against in his come-back match in 1970?",
      "options": [
        "Jerry Quarry",
        "Oscar Bonavena",
        "Zora Folley",
        "Jimmy Ellis"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This town in Illinois became the site of the first Dairy Queen in 1940. It is the hometown of singer Lionel Richie, basketball star George Mikan, and actors Mercedes McCambridge and Anthony Rapp. It is also home to a famous federal prison.",
      "options": [
        "Joliet",
        "Ganamorra",
        "Chicago",
        "Springfield"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This left-handed pitcher, who was also a basketball player, won the National League Triple Crown for the Dodgers in 1963, 1965, and 1966.",
      "options": [
        "Lou Alcindor",
        "Juan Marichal",
        "Don Drysdale",
        "Sandy Koufax"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Dale Ellis set a record for the most minutes in a game. How many minutes did he play against the Milwaukee Bucks on November 9 1989?",
      "options": [
        "57",
        "96",
        "54",
        "69"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What golfer won his 18th major championship in 1986?",
      "options": [
        "Ben Hogan",
        "Walter Hagen",
        "Jack Nicklaus",
        "Tiger Woods"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who started at third base for the New York Mets on Opening Day in 1962?",
      "options": [
        "Rod Kanehl",
        "Elio Chacon",
        "Ed Charles",
        "Don Zimmer"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following soccer teams plays in the French Le Championat?",
      "options": [
        "AJ Auxerre",
        "DSC Arminia Bilefeld",
        "Charleroi SC",
        "AS Jeunesse Esch"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In tennis, how much time does the server have between the time the previous point ends and the time he/she serves the ball for the next point, to avoid being cited by the umpire for delaying the game?",
      "options": [
        "30 seconds",
        "20 seconds",
        "25 seconds",
        "40 seconds"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1998, every crew member of every team formed a line to shake the hand of race car driver Dale Earnhardt on his way to Victory Lane. He had finally won the one big race that had eluded him for twenty years. What was the race?",
      "options": [
        "Charlotte 600",
        "Talldageda",
        "Dayton 500",
        "Firecracker 400 at Darlington"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The 2006 film See No Evil, released on May 19, stars what famous WWE wrestler?",
      "options": [
        "Goldberg",
        "Undertaker",
        "Kane",
        "Shawn Michaels"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Athletes from which country took all gold medals in table tennis in the Olympic Games in 2000, 2004 and 2008?",
      "options": [
        "USA",
        "China",
        "Singapore",
        "Poland"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This right-handed Major League Baseball player won the World Series MVP award, and then became the first player to sign with new team after winning the award, joining the Orioles in 1987.",
      "options": [
        "Lenny Dykstra",
        "Darryl Strawberry",
        "Dave Kingman",
        "Ray Knight"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This former baseball player called The Major won the World Series in his first two seasons as manager.",
      "options": [
        "Dick Howser",
        "Earl Weaver",
        "Ralph Houk",
        "Joe McCarthy"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Three Alou brothers played for the Giants. What were their first names?",
      "options": [
        "Matty, Moises, Edgardo",
        "Felipe, Moises, Ozzie",
        "Hullub, Bob, Goto",
        "Felipe, Matty, Jesus"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In the karate terminology, what does kata mean?",
      "options": [
        "Position",
        "Fist",
        "Way",
        "Form"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Rio de Janeiro won its bid to host the 2016 Summer Olympics. What other cities were on the short list?",
      "options": [
        "Chicago, Madrid and Tokyo",
        "Prague, Tokyo, and Toronto",
        "Chicago, Baku, and London",
        "Baku, Prague and London"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Major League Baseball started giving Rookie of the Year Award in each league in what year?",
      "options": [
        "1948",
        "1947",
        "1950",
        "1949"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Many pitchers have been great fielders. This man is the first pitcher to be involved in 94 double plays.",
      "options": [
        "Bobby Shantz",
        "Harvey Haddix",
        "Greg Maddux",
        "Jim Kaat"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which family owns the Pitsburgh Steelers?",
      "options": [
        "Rooney",
        "Mara",
        "Davis",
        "Belicheck"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "When did Bob and Mike Bryan win the US Open doubles final for the first time?",
      "options": [
        "2008",
        "1998",
        "2005",
        "2000"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was Eddie Eagan?",
      "options": [
        "Eddie The Eagle was a British skier who won a silver medal at the 1984 Olympic Games.",
        "The first person to win gold in the Winter Olympic Games and in the Summer Olympic Games",
        "The first President of the International Olympic Committee",
        "The first American to win an Olympic medal"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which boxing heavyweight champ was the subject of the movie The Great White Hope?",
      "options": [
        "Jersey Joe Walcott",
        "Jack Johnson",
        "Marvin Hart",
        "Tommy Burns"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which SEC member is not in the SEC East Division?",
      "options": [
        "Tennessee",
        "South Carolina",
        "Florida",
        "Auburn"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This NHL team was nicknamed The Broad Street Bullies during their first ever winning season in 1973.",
      "options": [
        "The New York Rangers",
        "The St Louis Blues",
        "The Philadelphia Flyers",
        "The Chicago Blackhawks"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which famous boxer, born on January 17, won a gold medal in the 1960 Olympics?",
      "options": [
        "Henry Cooper",
        "Joe Fraizer",
        "Mike Tyson",
        "Muhammad Ali"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What are the two basic types of serves in racquetball?",
      "options": [
        "Stoop serve and Straight serve",
        "Drive serve and Lob serve",
        "Stick serve and Flick serve",
        "Pure serve and Fake serve"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In one of the stories, Pooh and his friends played a game which became so popular worldwide that each year a World Championship takes places in Oxfordshire. The game is known as this.",
      "options": [
        "Poohsticks",
        "Poohball",
        "Poohhockey",
        "Poohskiing"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What distinction does Masanori Murakami hold?",
      "options": [
        "The first player to hit a home run in an international competition.",
        "The first player to steal a base in the Olympics.",
        "The first Japanese-born major league baseball player.",
        "The first player to hit a home run in the Olympics."
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which alpine skier is known as Herminator?",
      "options": [
        "Herman Maier (Austria)",
        "Alberto Tomba (Italy)",
        "Pirmin Zurbriggen (Switzerland)",
        "Bode Miller (USA)"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What team did Ozzie Smith play for before joining the St. Louis Cardinals in 1982?",
      "options": [
        "LA Dodgers",
        "San Diego Padres",
        "New York Mets",
        "Oakland As"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1990 and 1991, this quarterback set an NFL record for most consecutive passes attempts, with no interception.",
      "options": [
        "Bernie Kosar",
        "John Elway",
        "Vinny Testaverde",
        "Bart Starr"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the nickname of Ryan Newman, the winner of the 50th annual Daytona 500, who also has a degree in vehicle structure engineering from Purdue University?",
      "options": [
        "Rayne Man",
        "June Bug",
        "Flyin Ryan",
        "Rocket Man"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which Hall of Fame is located in Cleveland, Ohio?",
      "options": [
        "Basketball",
        "Rock and Roll",
        "Ohio",
        "Hockey"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In the game of billiards, what situation does the term Double kiss refer to?",
      "options": [
        "A shot with the cue ball being very closely clung to another ball",
        "A shot intended to separate two closely clung balls",
        "A coloured ball rebounding in a rail and striking the cue ball that has just hit it",
        "A shot pocketing two balls at the same time"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first professional athlete in baseball history to hit a home run and score a touchdown in the same week?",
      "options": [
        "Mel Hubbard",
        "Jim Thorpe",
        "Deion Sanders",
        "Bo Jackson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What European football club has been nicknamed The Yellow Submarine?",
      "options": [
        "Liverpool",
        "Nantes",
        "Villarreal",
        "Chelsea"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What team did Alex Goligoski join in 2004?",
      "options": [
        "New York Islanders",
        "None of these",
        "St. Louis Blues",
        "Pittsburgh Penguins"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Only two drivers each got 6 poles in 2006. Kasey Kahne was one. Name the other.",
      "options": [
        "Jeff Burton",
        "Kurt Busch",
        "Ryan Newman",
        "Scott Riggs"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Paul Hines was the first Triple Crown winner in the Majors. When did he win the award?",
      "options": [
        "1878",
        "1887",
        "1922",
        "1894"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which one of these players won an MVP Award while playing with the Houston Astros?",
      "options": [
        "Nolan Ryan",
        "Jeff Bagwell",
        "Jose Cruz",
        "Jeff Kent"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is Kobe Bryants nickname?",
      "options": [
        "Jellybean",
        "Black Mamba",
        "Beef",
        "The Kid"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "My real name is Edson Arantes do Nascimento and I scored 77 goals in 92 appearances with my national team. Who am I?",
      "options": [
        "Zidane",
        "None of these",
        "Lucio",
        "Pele"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1955 this baseball Hall of Famer broke the record for most consecutive times struck out.",
      "options": [
        "Willie Keeler",
        "Nolan Ryan",
        "Cy Young",
        "Sandy Koufax"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which Hall of Fame is located in Stillwater, Oklahoma ?",
      "options": [
        "American Track and Field Hall of Fame",
        "American Softball hall of Fame",
        "National Museum of College Football",
        "National Wrestling Hall of Fame"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Before he won the world welterweight boxing championship, and long before he had any acting experience, Brooklyns Mark Breland was tapped to debut in this military-school drama.",
      "options": [
        "Lords of Dogtown",
        "Taps",
        "The Lords of Flatbush",
        "The Lords of Discipline"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Two of the founding members of the NFL are in existence today. What are their original names?",
      "options": [
        "Decatur Staleys and Racine Cardinals",
        "Dayton Triangles and Canton Bulldogs",
        "Racine Cardinals and Green Bay Packers",
        "Canton Bulldogs and Akron Pros"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the name of Babe Ruths second wife?",
      "options": [
        "Claire",
        "Cindy",
        "Cloris",
        "Clara"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which quarterback led the New York Jets to the super bowl in the 1968- 1969 season?",
      "options": [
        "Terry Bredshaw",
        "Joe Namath",
        "Steve Young",
        "Joe Montana"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which basketball league was the first to institute a three-point shot?",
      "options": [
        "ABA",
        "NBA",
        "NCAA",
        "ABL"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This Major Leaguer was the college roommate of the great wide receiver Lynn Swann.",
      "options": [
        "Randy Flores",
        "Fred Lynn",
        "Aaron Boone",
        "Tom Seaver"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What mens basketball team won their 11th NCAA Championship in 1996?",
      "options": [
        "North Carolina",
        "Kentucky",
        "UCLA",
        "Duke"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was Muhammad Alis last opponent before his boxing license was suspended in 1967?",
      "options": [
        "Cleveland Williams",
        "George Chuvalo",
        "Zora Folley",
        "Ernie Terell"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Mogul Donald Trump, who is also famous for his signature hairstyle, is keen on what sport?",
      "options": [
        "Baseball",
        "Horseback riding",
        "Golf",
        "Snooker"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 2005 the Indianapolis Colts won their first 13 games and appeared ready to challenge the 1972 Miami Dolphins record, but then lost their next 2 games. Which 1998 team also won their first 13 games but lost their next 2?",
      "options": [
        "Green Bay Packers",
        "New York Jets",
        "Denver Broncos",
        "Dallas Cowboys"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1933 this team won the first NFL Championship Game.",
      "options": [
        "Canton Bulldogs",
        "Washington Redskins",
        "New York Giants",
        "Chicago Bears"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What do golfers Adam Scott, Greg Norman and Geoff Ogilvy have in common?",
      "options": [
        "They have never won majors championships.",
        "They were all born in Australia.",
        "They were all born in New Zealand.",
        "They were all born in 1980."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Gilbert Arenas was drafted into the NBA by what team?",
      "options": [
        "The Indianapolis Jets",
        "The Golden State Warriors",
        "The Washington Wizards",
        "The Orlando Magic"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This former LA Laker retired in 1989 as the record holder for most points scored in a career.",
      "options": [
        "Bill Russel",
        "Kareem Abdul-Jabbar",
        "Magic Johnson",
        "Moses Malone"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which team did Babe Ruth start his career with?",
      "options": [
        "Red Sox",
        "Braves",
        "White Sox",
        "Yankees"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "As of 2007, of the Original Six Teams the Montreal Canadiens have the most Stanley Cup wins. Which two Original Six teams are tied for the most Stanley Cup losses with 12?",
      "options": [
        "Red Wings Bruins",
        "Blackhawks Toronto",
        "Red Wings Canadiens",
        "Rangers Blackhawks"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who lost the Battle of Marathon?",
      "options": [
        "Xerces I",
        "Cyrus I",
        "Parimedes",
        "Darius I"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Where were the winter Olympics held in 1960, the first time the host country won the gold medal in ice hockey?",
      "options": [
        "Lake Placid",
        "Squaw Valley",
        "Oslo",
        "Calgary"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what 2005 bowl game did LSU defeat Miami?",
      "options": [
        "Peach bowl",
        "Cotton bowl",
        "Rose bowl",
        "Outback bowl"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which Hungarian soccer player was known throughout his career as The Galloping Major and later with Real Madrid as \u201cLittle Cannon?",
      "options": [
        "Trifon Ivanov",
        "Lukas Podolski",
        "Ferenc Puskas",
        "Victor Valdes"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first switch hitter in the Baseball Hall of Fame?",
      "options": [
        "Eddie Murray",
        "Rogers Hornsby",
        "Frankie Frisch",
        "Mickey Mantle"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Fat Tire Week takes place in what town in the state of Colorado?",
      "options": [
        "Fort Collins",
        "Aspen",
        "Crested Butte",
        "Denver"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which Ethiopian is widely considered one of the greatest long distance runners in history?",
      "options": [
        "Paavo Nurmi",
        "Wilson Boit Kipketer",
        "Haile Gebrselassie",
        "Hicham El Guerrouj"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which 2 NHL teams faced off in a preseason game in London, England, in 1992?",
      "options": [
        "Edmonton Oilers vs. Calgary Flames",
        "Vancouver Canucks vs. Detroit Red Wings",
        "Chicago Blackhawks vs. Montreal Canadians",
        "Toronto Maple Leafs vs. Boston Bruins"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who is given credit for taking the first jump shot in college basketball?",
      "options": [
        "Terry Joe Barker",
        "Maurice Stokes",
        "Joe Fulks",
        "Ken Sailors"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The 1999 match between Juventus and Manchester United ends in 2:3. Which player scored first for Manchester United?",
      "options": [
        "Ryan Giggs",
        "Andy Cole",
        "David Bekcham",
        "Roy Keane"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1886, Ab Smith added this term to sports vocabulary.",
      "options": [
        "grand slam",
        "birdie",
        "ace",
        "hole-in-one"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Big John Studd wrestled for Fritz Von Erichs World Class promotion under which identity?",
      "options": [
        "Captain USA",
        "John Bolder",
        "The Assassin",
        "Big Ben Caster"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Goose Goslin and this man are the only Major League baseball players to hit into 4 double plays in a single game.",
      "options": [
        "Frank Howard",
        "Reggie Jackson",
        "Joe Torre",
        "Frank Torre"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What country hosted the 1948 Summer Olympics, officially known as the Games of the XIV Olympiad?",
      "options": [
        "United Kingdom",
        "China",
        "United States",
        "Brazil"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 1986, this musician, famous for performing the song Johnny B. Goode, became the first person inducted into the Rock and Roll Hall of Fame.",
      "options": [
        "Bill Haley",
        "Chuck Berry",
        "Jerry Lee Lewis",
        "Elvis Presley"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The 1986-87 NFC Championship game was at Giants Stadium in a cold, blustery evening with a mean, swirling wind. The Giants won 17-0 over which division rival?",
      "options": [
        "Dallas Cowboys",
        "Washington Redskins",
        "Buffalo Bills",
        "Philadelphia Eagles"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This former NFL player, nicknamed Mad Stork, stood 67 and weighed 220 lbs. He began his playing career with the Baltimore Colts in 1969 \u2013 1970.",
      "options": [
        "Gino Marchetti",
        "Ted Hendricks",
        "Ed Jones",
        "Larry Little"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which former Utah football player became a member of the Carolina Panthers in 2001?",
      "options": [
        "Steve Smith",
        "Eric Weddle",
        "Jamal Anderson",
        "Kevin Dyson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What US college football team plays on blue grass?",
      "options": [
        "Utah State",
        "Kentucky",
        "Boise State",
        "Louisville"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Of the players listed below, who has the most career MLB home runs?",
      "options": [
        "Frank Robinson",
        "Rafael Palmeiro",
        "Mickey Mantle",
        "Sammy Sosa"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the longtime girlfriend/eventual wife of the Coach on the show of the same name?",
      "options": [
        "Sally Legweak",
        "Shannon Hoon",
        "Christine Armstrong",
        "Mary Mulcahy"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is not a stroke in volleyball?",
      "options": [
        "spike",
        "palm",
        "bump",
        "dip"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This famous head American football coach at Florida A M College, used to say: I like my boys to be agile, mobile, and hostile.",
      "options": [
        "Jake Gaither",
        "Knute Rockne",
        "Peal Bear Bryant",
        "Joe Paterno"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When was the International Olympic Committee founded?",
      "options": [
        "1896",
        "1898",
        "1900",
        "1894"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "What was the first WWE title change at SummerSlam?",
      "options": [
        "Randy Savage Vs Ric Flair",
        "Hulk Hogan Vs Zues",
        "Shawn Micheals Vs Vader",
        "Bret Hart Vs The Undertaker"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the head football coach at the University of Alabama after Harold Red Drew?",
      "options": [
        "Wallace Wade",
        "Frank Thomas",
        "JB Ears Whitworth",
        "Gene Stallings"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the New England Patriots first round pick in 2008?",
      "options": [
        "Jason Webster",
        "Jerod Mayo",
        "Daniel Graham",
        "Tebucky Jones"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 3 of the 4 major tennis tournaments, the deciding set of the match (5th set for men, 3rd set for women) does not utilize a tie break if the score is tied at 6-6. In which of these tournaments is a tie break used even in the deciding set of a match?",
      "options": [
        "U.S. Open",
        "Australian Open",
        "Wimbledon",
        "French Open"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the first football club for which David Beckham played professionally?",
      "options": [
        "Chelsea",
        "Manchester United",
        "Tottenham Hotspur",
        "Liverpool"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "I wondered why the baseball kept getting bigger. Add the next 4-word sentence.",
      "options": [
        "It was an illusion.",
        "It was a balloon.",
        "Then there was light.",
        "Then it hit me."
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Paul McCartney closed the opening ceremony of the 2012 Summer Olympics singing this song and inviting the audience to join in on the coda.",
      "options": [
        "Live and Let Die",
        "Hey Jude",
        "Yesterday",
        "Let It Be"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where did the San Francisco Giants play before San Francisco?",
      "options": [
        "Atlanta, GA",
        "Washington, DC",
        "New York, NY",
        "Buffalo, NY"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who lost the boxing heavyweight championship to Joe Louis?",
      "options": [
        "Jess Willard",
        "Jack Dempsey",
        "James J. Braddock",
        "Max Baer"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What year did football become a program for the University of Utah?",
      "options": [
        "1892",
        "1911",
        "1900",
        "1905"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Footballs Iron Man, Brett Farve was a quarterback for which team prior to signing with Green Bay?",
      "options": [
        "Chicago Bears",
        "New York Jets",
        "He was always a Packer",
        "Atlanta Falcons"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What Italian football player turned out to be the first-born son of football star Diego Armando Maradona?",
      "options": [
        "Diego Anjel",
        "Diego Christiano",
        "Diego Aguero",
        "Diego Sinagra"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many of the four top-seeded female tennis players made it to the semifinals at 2008 Summer Olympics?",
      "options": [
        "All",
        "1",
        "None",
        "3"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Dale Earnhardt Jr., the son of NASCAR legend Dale Earnhardt, had how many wins in the 2005 NASCAR season?",
      "options": [
        "1",
        "4",
        "2",
        "5"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In the 1989 movie Back to the Future Part II, Slamball was mentioned in a scene taking place in 2015. In what year was the sport Slamball actually created?",
      "options": [
        "1989",
        "2009",
        "2001",
        "1985"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which American actor, known for his passion for basketball and the LA Lakers in particular, appeared in One Flew Over the Cuckoos Nest as Randle Patrick McMurphy?",
      "options": [
        "Gene Hackman",
        "Dustin Hoffman",
        "Matthew Perry",
        "Jack Nicholson"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The ratings for the Beijing Olympics were far above those of the Athens Olympics. This is due, in part, to this man, the Chairman of Sports at NBC in 2008.",
      "options": [
        "Dick Ebersol",
        "Jim Collins",
        "Phil Knight",
        "Tony Ponturro"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Although Muhammad Ali was from Louisville, Kentucky he represented this major American city as a junior in the Golden Gloves.",
      "options": [
        "Washington",
        "Dallas",
        "Chicago",
        "New York"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which city hosted the first Olympics not held in a leap year?",
      "options": [
        "Nagano",
        "Sydney",
        "Lillehammer",
        "Paris"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where is the Red Bulls MLS team based?",
      "options": [
        "Los Angeles",
        "Houston",
        "Washington DC",
        "New York"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In April 2009, Senator Ted Kennedy was asked to throw out the ceremonial first pitch on opening day for this major league team. In what stadium would you be sitting to watch Senator Kennedys first pitch?",
      "options": [
        "Yankee Stadium",
        "Wrigley Field",
        "Fenway Park",
        "Candlestick Park"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Frances Marina Anissina and Gwendal Peizerat are famous for what incredible move?",
      "options": [
        "Hydroblade",
        "Dance spin",
        "A lift in which Marina lifts Gwendal",
        "Twizzles"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Cowboys had the first selection in the 1974 draft. Who did they take?",
      "options": [
        "Ed Too Tall Jones",
        "Thomas Henderson",
        "Tony Dorsett",
        "Randy White"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What award did NASCAR driver Ryan Newman win in 2003?",
      "options": [
        "Winston cup",
        "Rookie of the Year",
        "Most popular driver",
        "SPEED Channel American Driver of the Year"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Svetlana Kuznietzova and Maria Sharapova are top tennis players (and beauties as well). Judging by their surnames, what country are they from?",
      "options": [
        "Switzerland",
        "Russia",
        "Sweden",
        "Australia"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1945 Fidel Castro entered the University of Havana. Besides studying law there he played which position for the schools baseball team?",
      "options": [
        "Centerfield",
        "Right-handed pitcher",
        "First base",
        "Left-handed pitcher"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NHL goalie to get a shutout?",
      "options": [
        "Gump Worsley",
        "Roger Stanley",
        "Charlie Broadieaux",
        "Georges Vezina"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "With what team did Babe Ruth finish his major league baseball playing career?",
      "options": [
        "New York Yankees",
        "St. Louis Cardinals",
        "Boston Braves",
        "None Of These"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Formula 1 driver Kimi Raikonnen is called The Iceman. Judging by his surname, what northern country is he from?",
      "options": [
        "Finland",
        "Canada",
        "Denmark",
        "Norway"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The first official Winter Olympic games, initially called \u2018The International Winter Sports Week, were held in 1924 in this Alpine town.",
      "options": [
        "Chamonix",
        "Davos",
        "Bormio",
        "Kitzbuhel"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of the listed soccer teams is from Norway?",
      "options": [
        "IF Elfsborg",
        "VFL Wolfsburg",
        "Rosenborg BK",
        "Silkeborg IF"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Looking to expand the alternatives for Bike to Work Day, Jeff Obst coined the phrase B-BOP (Bike, Bus, Or carPool) Day. In what year was this campaign initiated?",
      "options": [
        "1973",
        "1991",
        "1996",
        "1989"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Stella Walsh was a Polish-born athlete residing in Cleveland, Ohio. She won an Olympic gold medal in the 1932 Olympic (100 meters) and a silver medal in the 1936 Olympics (100 meters). Which statement is untrue about Stella Walsh?",
      "options": [
        "She had male genitalia",
        "She had XX-chromosomes",
        "She had female genitalia",
        "She had XY-chromosomes"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the most common gas used in paintball guns propellants?",
      "options": [
        "Air",
        "Nitrogen",
        "Nitrous oxide",
        "Carbon dioxide"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who won the most Formula 1 Championships in the period 1985-2008?",
      "options": [
        "Fernando Alonso (Spain)",
        "Michael Schumacher (Germany)",
        "Ayrton Senna (Brazil)",
        "Lewis Hamilton (UK)"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This second baseman, elected to the Hall of Fame in 1989 by the Veterans Committee, played with Stan Musial, another Hall of Famer.",
      "options": [
        "Joe Morgan",
        "Ryne Sandberg",
        "Red Schoendienst",
        "Rod Carew"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Actor Liam Neeson started taking lessons in this sport at the age of nine, and later became amateur senior champion.",
      "options": [
        "Skiing",
        "Swimming",
        "Boxing",
        "Baseball"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1987, former AWA World Champion Rick Martel formed the tag team Strike Force with which wrestler?",
      "options": [
        "Tito Santana",
        "Tony Garea",
        "Tom Zenk",
        "None of these"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which is the oldest and most prestigious event in the sport of tennis?",
      "options": [
        "French Open",
        "Australian Open",
        "Wimbledon",
        "US Open"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the 1996-1997 season, which team broke the best record for an NBA season?",
      "options": [
        "Boston Celtics",
        "San Antonio Spurs",
        "Detroit Pistons",
        "Chicago Bulls"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "If the final match in the UEFA Champions League ends in a tie, how is the winner decided?",
      "options": [
        "Extra time is played and if the winner is not decided, penalties are held.",
        "Penalties shootout",
        "Extra time with a golden goal (the first team to score is the winner)",
        "By drawing"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which city hosted the first modern Olympiad in 1896?",
      "options": [
        "Paris",
        "Athens",
        "Rome",
        "Moscow"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "How old was Jim Brown when he retired from the Cleveland Browns?",
      "options": [
        "30",
        "31",
        "33",
        "45"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was running back for the Atlanta Falcons from 2002-2007?",
      "options": [
        "Warrick Dunn",
        "Shaun Alexander",
        "Tiki Barber",
        "Cory Dillion"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who scored the first basket in the first NBA game in 1946?",
      "options": [
        "Paul Arizan",
        "Ossie Scechtman",
        "Bob Kurland",
        "George Mikan"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This agent has represented Yao Ming, Tracy McGrady, T.J. Ford, Ben Wallace, Jordan Farmar and Jermaine ONeal.",
      "options": [
        "Arn Tellum",
        "Leigh Steinberg",
        "Tom Condon",
        "LeMarcus Perkins"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the name of the ancient Greek wrestling school, which was later used for delivering lectures and conducting intellectual conversations?",
      "options": [
        "palaestra",
        "corycelum",
        "bouleuterion",
        "gymnasium"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What color is the championship jacket for which Shooter and Happy are playing against each other in the movie Happy Gilmore?",
      "options": [
        "Blue",
        "Green",
        "Yellow",
        "Gold"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 2007, English soccer player David Beckham, whose fame has extended well beyond sport, joined what American Major League Soccer team?",
      "options": [
        "Los Angeles Galaxy",
        "Houston Dynamo",
        "D.C. United",
        "Chicago Fire"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In the 1970s this professional soccer team played their home games at Yankee Stadium.",
      "options": [
        "The Cosmos",
        "The Nets",
        "Milan A.C.",
        "The Kicks"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "David Wells pitched a perfect game for the New York Yankees on May 17, 1998. What team was the loser?",
      "options": [
        "California Angels",
        "Baltimore Orioles",
        "Minnesota Twins",
        "Texas Rangers"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What Oriole made the final out of the 1969 World Series?",
      "options": [
        "Brooks Robinson",
        "Frank Robinson",
        "Davey Johnson",
        "Boog Powell"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What Blue Jay pitcher was nicknamed Terminator?",
      "options": [
        "Dave Stieb",
        "Duane Ward",
        "Jimme Key",
        "Tom Henke"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In 1877, Spencer Gore was the first winner of what tournament?",
      "options": [
        "Wimbledon",
        "World Open",
        "The Masters",
        "Cricket World Cup"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "History was made in 1988 when this man became the first skater to land a retified quadruple in competition.",
      "options": [
        "Brian Boitano",
        "Scott Hamilton",
        "Josef Sobavcek",
        "Kurt Browning"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "David Beckhams parents were ardent fans of this football team, and they passed the passion to their son.",
      "options": [
        "Real Madrid",
        "Tottenham Hotspur",
        "Manchester United",
        "Milan"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This practitioner of pocket billiards, called the Magician, is famous for winning many of the most prestigious nine-ball tournaments.",
      "options": [
        "Efren Bata Reyes",
        "Alex Pagulayan",
        "Juan Dela Cruz",
        "Dyango Bustamante"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In college football, 2007 may well be remembered as the year of the upset. On October 13, November 23, 24 and December 1st both the # 1and # 2 teams in the US suffered upsets and the 2007 regular season ended with Pitts shocking win over West Virginia. But it was the defeat of Michigan, the fifth ranked team in the nation, by a 1-AA team that has been touted by many as the greatest upset in college football history. What team became the first 1-AA team to beat a ranked 1- A team?",
      "options": [
        "University of Delaware",
        "Appalachian State University",
        "Montana State",
        "The Citadel"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "During the 2008 Olympics, the 12-years old record of Michael Johnson in 200m run was broken. What was the new time?",
      "options": [
        "15.60s",
        "19.30s",
        "19.80s",
        "9.69s"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which college has the team nicknamed The Boiler Makers?",
      "options": [
        "Stanford",
        "Florida",
        "Purdue",
        "Miami"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Bowling for Columbine, And Justice for All, Fahrenheit 9/11",
      "options": [
        "Reggio, Godfrey",
        "Moore, Michael",
        "Spielberg, Steven",
        "Coppola, Francis Ford"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In the September 30, 1984 game between the California Angels and the Texas Rangers, Mike Witt threw a perfect game. What was the final score?",
      "options": [
        "Angels 6, Rangers 0",
        "Rangers 1, Angels 0",
        "Rangers 6, Angels 0",
        "Angels 1 Rangers 0"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was the fist WCW/World title change at SummerSlam?",
      "options": [
        "The Rock Vs Booker T",
        "Triple H Vs Shawn Michaels",
        "C.M.Punk Vs Jeff Hardy",
        "Randy Orton Vs Chris Benoit"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This former player of the Southern California Trojans also played DB for the New York Giants but is perhaps more famous for proposing to actress Angie Harmon on The Tonight Show.",
      "options": [
        "Champ Bailey",
        "Kori Dickson",
        "Reggie Bush",
        "Jason Sehorn"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1972 Yogi Berra became manager of this team.",
      "options": [
        "The Washington Senators",
        "The Los Angeles Dodgers",
        "The Pittsburgh Pirates",
        "The New York Mets"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who did Kobe Bryant take to his senior prom?",
      "options": [
        "Brittany Spears",
        "Brandy Norwood",
        "Jessica Simpson",
        "Jessica Alba"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In what year did Babe Ruth hit 60 home runs?",
      "options": [
        "1921",
        "1927",
        "1919",
        "1923"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which is the location of the International Table Tennis Hall of Fame?",
      "options": [
        "Taiwan",
        "China",
        "Switzerland",
        "Norway"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the 2004 Athens Summer Olympic Games, how many gold and bronze medals did Michael Phelps win?",
      "options": [
        "5 gold, 2 bronze",
        "5 gold, 3 bronze",
        "6 gold, 2 bronze",
        "6 gold, 1 bronze"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In what state was the first college basketball game played?",
      "options": [
        "Massachusetts",
        "Minnesota",
        "Missouri",
        "Maine"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This baseball player and manager, nicknamed The Ol Professor, said, Sports do not build character. They reveal it.",
      "options": [
        "Bill Veeck",
        "Bud Selig",
        "Al Shalk",
        "Casey Stengel"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who did the Duke Blue Devils beat in 2001 to win the NCAA National Championship?",
      "options": [
        "Maryland Terrapins",
        "Michigan State Spartans",
        "University of Southern California Trojans",
        "Arizona Wildcats"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Wally the Green Monster is the mascot for which sports team?",
      "options": [
        "Boston Red Sox",
        "Baltimore Orioles",
        "Cincinnati Reds",
        "Chicago White Sox"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The image of a bucking horse and rider is a registered trademark of which state?",
      "options": [
        "Texas",
        "Nevada",
        "Wyoming",
        "Colorado"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This speed skater, inducted into the United States Hall of Fame in 2004, set a junior world record at the age of sixteen.",
      "options": [
        "Joey Cheek",
        "Peter Mueller",
        "Jack Shea",
        "Daniel Jansen"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first ski jumper ever to win the World Cup 3 times in a row?",
      "options": [
        "Matti Nyk\u00e4nen",
        "Jens Weissflog",
        "Andreas Goldberger",
        "Adam Ma\u0142ysz"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which was the first NBA basketball team to sign a female player?",
      "options": [
        "The New York Knicks",
        "Chicago Bulls",
        "The Indiana Pacers",
        "Cleveland Cavaliers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which great soccer player is famous for his \u201cHand of God goal against England in 1986 FIFA World Cup quarter-final?",
      "options": [
        "Maradona",
        "Zidane",
        "Messi",
        "Pele"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What city hosted the first Olympics to include the U.S.S.R., in 1952?",
      "options": [
        "Melbourne",
        "Amsterdam",
        "Helsinki",
        "Rome"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Nancy Drews tall, handsome boyfriend is quite the athlete. In addition to being a football star, Ned Nickerson also plays on the varsity teams of what other two sports at Emerson College?",
      "options": [
        "Basketball and track field",
        "Baseball and basketball",
        "Track field and rowing",
        "Baseball and rowing"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In the first innings of the fifth test of the 2006-07 Ashes series, Australia amassed 393 all out. Surprisingly, in the second innings they needed only 46 runs to clinch the final test. By how many wickets did Australia win the match?",
      "options": [
        "8",
        "7",
        "9",
        "10"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "When fictional character Sam Malone bought Cheers he hired as a bartender Ernie Pantusso, also known as Coach. When Ernie was a baseball player and coach, he was an expert in what?",
      "options": [
        "Infield Fake",
        "spitball",
        "stealing homeplate",
        "being hit by pitches"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What pitcher, who last played with the St. Louis Cardinals, died suddenly in his hotel room in Chicago in 2002?",
      "options": [
        "Darryl Kile",
        "Bob Tewksbury",
        "John Tudor",
        "Steve Carlton"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first player to hit a home run in a World Series game?",
      "options": [
        "Jim Sebring",
        "Jim Bagby",
        "Honus Wagner",
        "Home Run Baker"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many innings are in a Little League baseball game, excluding extra innings?",
      "options": [
        "7",
        "8",
        "5",
        "6"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where was Travis Pastrana born?",
      "options": [
        "Branson, Missouri",
        "Provedence, Rode Island",
        "Los Angeles, California",
        "Annapolis, Maryland"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which member of the 1972 Miami Dolphins once said, Perfection ends a lot of arguments.?",
      "options": [
        "TE Jim Mandich",
        "QB Bob Griese",
        "WR Paul Warfield",
        "RB Larry Csonka"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This pioneer of the Beat generation earned a scholarship for Columbia University due to his athletic skills as a running back in American football. After cracking a tibia his football career was over and he dropped out of university.",
      "options": [
        "Truman Capote",
        "Jack Kerouac",
        "John Dos Passos",
        "Henry Miller"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Complete, live color TV broadcasts of the Olympics were featured first in this Olympic year.",
      "options": [
        "1960",
        "1968",
        "1936",
        "1956"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The first PGA championship was held at Siwonay in New York in 1916 and won by this golfer. The 2006 Championship was conducted at Medinah, and won by this golfer.",
      "options": [
        "Jim Barnes/Tiger Woods",
        "Jim Barnes/Phil Mickelson",
        "Francis Ouimet/Phil Mickelson",
        "Francis Ouimet/Tiger Woods"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following is not a player whose number was retired by the New York Jets?",
      "options": [
        "Joe Namath",
        "Weeb Ewbank",
        "Don Maynard",
        "Joe Klecko"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The worlds largest swimming pool in 2007 was in this country.",
      "options": [
        "Chile",
        "North Korea",
        "Venezuela",
        "Morocco"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "For which college did Wilt Chamberlain play?",
      "options": [
        "Kansas",
        "Villanova",
        "North Carolina",
        "UCLA"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these is not one of Ted Williams nicknames?",
      "options": [
        "Splendid Splinter",
        "The Boston Bomber",
        "The Kid",
        "Teddy Ballgame"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 2002, this former ice hockey defenseman became head coach of the Detroit Red Wings, after the retirement of Scotty Bowman.",
      "options": [
        "Dave Lewis",
        "Mike Babcock",
        "Scotty Bowman",
        "Mike Ilitch"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of Santas eight famous Reindeer was the coach of the Reindeer Games in Rudolph the Red-Nosed Reindeer?",
      "options": [
        "Dasher",
        "Comet",
        "Donner",
        "Vixen"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where is the New England Revolution team based?",
      "options": [
        "Salt Lake",
        "Houston",
        "New York",
        "Foxborough"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Where did the word golf originate?",
      "options": [
        "Ireland",
        "Italy",
        "Canada",
        "Scotland"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "May 6, 2006 saw a victory for this popular NASCAR driver in the Crown Royal 400 in Richmond.",
      "options": [
        "Dale Earnhardt, Jr.",
        "Kasey Kahne",
        "Jimmie Johnson",
        "Tony Stewart"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 1941 this NCAA Mens basketball team set the record for lowest points scored in a Championship appearance.",
      "options": [
        "Mississippi Valley St.",
        "North Carolina",
        "Yale",
        "North Texas University"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "After reigning as the world light-heavyweight boxing champion from 1932-34, this pugilist proceeded to transform himself into one of the first and most successful athletes-turned-actors in Hollywood history.",
      "options": [
        "Max Baer, Jr.",
        "Max Baer, Sr",
        "Max Headroom",
        "Maxie Rosenbloom"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was impressive about Reggie Jacksons homers in Game 6 of the 1977 Series?",
      "options": [
        "He hit them all against pitchers who were former teammates",
        "He hit each of his homers on the first pitch.",
        "He hit 2 of them as a switch-hitting right-hander.",
        "He ignored all the bunt signs."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Nicknamed The Splendid Splinter, this Hall of Fame baseball player interrupted his career twice to serve in World War II and the Korean War.",
      "options": [
        "Ted Williams",
        "Jackie Robinson",
        "Yogi Berra",
        "Mickey Mantle"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Golden State Warriors of the NBA once traded a player and a draft choice for center, Billy Joel Carroll. Who were the two players they traded?",
      "options": [
        "Dennis Johnson and JoJo White",
        "Robert Parrish and Kevin McHale",
        "Cliff Hagan and Easy Ed MCCauley",
        "Rick Barry and Fred Hetzel"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where was the Stanley Cup made?",
      "options": [
        "France",
        "Canada",
        "New York, New York",
        "London, England"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "On June 21, 1964, the Philadelphia Phillies beat the New York Mets 6 to 0 behind a perfect game pitched by this player.",
      "options": [
        "Jim Bunning",
        "Kirk Gibson",
        "Dick Allen",
        "Dennis Bennett"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which popular author and screenwriter is also widely known as a devoted Red Sox fan and has co-written a book entitled Faithful: Two Diehard Boston Red Sox Fans Chronicle the Historic 2004 Season?",
      "options": [
        "John Grisham",
        "F. Scott Fitzgerald",
        "W.P. Kinsella",
        "Stephen King"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following is a NFL running back born in Ashtabula, Ohio?",
      "options": [
        "Lawrence Taylor",
        "Anthony Wright",
        "Benny Friedman",
        "Jarrod R. Bunch"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "You hit your tee shot deep into the woods, where it might be lost. You announce that youll play a provisional and immediately hit before your playing partner. Your buddy says you should be penalized for playing out of turn. What should you do according to golf rules?",
      "options": [
        "Take no penalty but replay your provisional in order",
        "Take a 1-stroke penalty for not waiting for all other playing partners to hit before taking a provisional",
        "Take no penalty because you were not going out of order to give one player an advantage",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1909 the Pirates won their first World Series versus the Detroit Tigers. This same year they started playing in this Ball Park that would be their home until 1970.",
      "options": [
        "Allegheny Ball Park",
        "Central Park of Pittsburgh",
        "Two Rivers Stadium",
        "Forbes Field"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the catcher Pete Rose collided into in the 1970 All-star game?",
      "options": [
        "None Of These",
        "Dave Duncan",
        "John Roseboro",
        "Ray Fosse"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This 2009 sports drama movie, starring Sandra Bullock, is based on the true life story of a great offensive tackle.",
      "options": [
        "The Blind Side",
        "Life on the Line",
        "Time of Possession",
        "Ole Miss"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Find the incorrect statement about sportsman Yuichiro Miura.",
      "options": [
        "He was the first seventy-year old person to climb Mount Everest.",
        "He skied Mount Everest.",
        "He was the first seventy-year old person to climb Mount Fuji.",
        "He climbed Mount Everest at the age of 75 years 7 months."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Born in Lagos, Nigeria in 1963, this player led his team to two consecutive NBA crowns in 1994 and 1995. Who is he?",
      "options": [
        "Manute Bol",
        "Mikebe Mitumbo",
        "Dino Meneghin",
        "Hakeem Olajuwon"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This pro wrestler signed with the Los Angeles Raiders of the NFL but was released before the season began.",
      "options": [
        "Batista",
        "Bill Goldberg",
        "John Bradshaw Layfield",
        "The Big Show"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The moves in this sport include Barani, Triffus, Miller, and Randy.",
      "options": [
        "Ballroom Dancing",
        "Figure Skating",
        "Trampoline",
        "BMX"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following is NOT true of Charger running back LaDainian Tomlinson?",
      "options": [
        "In 2006, he broke the single season scoring record.",
        "In 2006, he rushed for over 2,000 yards.",
        "In 2006, he became the player to reach 100 touchdowns for a career in the shortest length of time.",
        "In 2006, he won the NFL Most Valuable Player award."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Approximately how many people attended the soccer match between Uruguay and Brazil during the 1950 FIFA World Cup tournament?",
      "options": [
        "500,000",
        "300,000",
        "199,800",
        "1,000,000"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In what year did Notre Dame and their head coach Knute Rockne, win their first NCAA football Championship?",
      "options": [
        "1924",
        "1980",
        "1938",
        "1987"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which Brazilian team signed a contract with soccer legend Edson Arantes do Nascimento, Pel\u00e9, when he was just 15 years old?",
      "options": [
        "Santo Andre/SP",
        "Santos/SP",
        "Sport/PE",
        "Vasco/RJ"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player collected his 3000th hit in 1985. Who was this California Angels player ?",
      "options": [
        "Bert Campaneris",
        "Rod Carew",
        "Reggie Jackson",
        "Don Baylor"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of Dale Earnhardt Juniors mother?",
      "options": [
        "Kelley",
        "Brenda",
        "Kathy",
        "Barbara"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who did Steve Austin mock backstage during a promotional shoot for Extreme Championship Wrestling?",
      "options": [
        "Hulk Hogan",
        "Macho Man Randy Savage",
        "Kevin Nash",
        "Eric Bischoff"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The Pittsburgh Pirates, nicknamed The Bucs, won which World Series in the 1970s?",
      "options": [
        "1977",
        "1976",
        "1978",
        "1979"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "I was born crippled and the operation that let me walk left me with a distorted leg. Yet, I managed to win two World Cup titles. Who am I?",
      "options": [
        "Michael Platini",
        "Garrincha",
        "Stanley Mathews",
        "Zico"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who is the only player to hit 3 home runs twice in a World Series game? If more than one person has done it, who was first?",
      "options": [
        "Babe Ruth",
        "Reggie Jackson",
        "Hank Aaron",
        "No one"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What two teams played the first overtime game in the history of Division-I college football?",
      "options": [
        "Auburn and Georgia",
        "Toledo and Nevada",
        "Washington and Washington State",
        "Arkansas and Ole Miss"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the original home to the NFL Rams?",
      "options": [
        "Cleveland, OH",
        "L.A., CA",
        "Cincinnati, OH",
        "Canton, OH"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was the head football coach for Utah from 1990-1998?",
      "options": [
        "Jack Cutrice",
        "Ray Nagel",
        "Urban Meyer",
        "Ron McBride"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following NBA marksmen has the best free throw percentage in a career?",
      "options": [
        "John Stockton",
        "Mark Price",
        "Gary Payton",
        "Michael Jordan"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What city did the Philadelphia As move to?",
      "options": [
        "St. Louis",
        "Kansas City",
        "Las Vegas",
        "Oakland"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What was the name of the colourful celebration, conducted by the of the offensive players of the St. Louis Rams in the end zone, after scoring a touchdown?",
      "options": [
        "The Circle Jerk",
        "The Bounce",
        "The Ram Wiggle",
        "The Bob and Weave"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This southpaw was traded by the Yankees for Roger Clemens.",
      "options": [
        "Sid Fernandez",
        "David Wells",
        "Fernando Valenzuela",
        "Terry Forster"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Dale Earnhardt, Jr. has a sister, half brother and half sister. What are their names?",
      "options": [
        "Kathy, Jeff and Tara",
        "Kelley, Kerry and Taylor",
        "Susie, Mike and Carol",
        "Ann, Jimmy and Monica"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many Chargers were elected to (including replacement player) the 2006 AFC Pro Bowl from the 2006 team?",
      "options": [
        "6",
        "7",
        "8",
        "10"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Although the New York Mets drafted this right hander in 1978, he was 29 years old by the time he made his major league debut in 1986.",
      "options": [
        "Roger Craig",
        "Rick Anderson",
        "Calvin Schiraldi",
        "Bruce Berenyi"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What former Cardinal played against his old team in the 1985 World Series as a member of the Kansas City Royals?",
      "options": [
        "Terry Pendleton",
        "Dane Iorg",
        "Ken Oberkfell",
        "Keith Hernandez"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "When did Mean Joe Greenes Coke commercial first air on TV?",
      "options": [
        "October 1980",
        "September 1979",
        "October 1979",
        "September 1980"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first NBA player to play 1192 consecutive games?",
      "options": [
        "A.C. Green",
        "Calvin Murphy",
        "Bob Lanier",
        "Walt Bellamy"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This person was a great basketball player, a poor outfielder, and a minority stockholder in the Charlotte Bobcats of the NBA. Who is he?",
      "options": [
        "Michael Jordan",
        "Del Rice",
        "Deion Sanders",
        "Bo Jackson"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Where was the inaugural ICC World Cup final played?",
      "options": [
        "Lords, London",
        "Edgbaston Cricket Ground, Birmingham",
        "Trent Bridge, Nottingham",
        "The Oval, London"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which teams played in the first Super Bowl?",
      "options": [
        "Kansas City and Green Bay",
        "Chicago and Boston",
        "Green Bay and New York",
        "Chicago and New York"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Barry Bonds hit the headlines since he became a rookie for which of these teams?",
      "options": [
        "Astros",
        "Pirates",
        "Giants",
        "Mets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Dale Earnhardt Junior owns a share in the Paducah Raceway along with Tony Stewart and what other driver?",
      "options": [
        "Ken Schrader",
        "Mark Martin",
        "Michael Waltrip",
        "Kyle Petty"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What baseball team was founded in Manhattan in 1960?",
      "options": [
        "New York Rockies",
        "New York Brewers",
        "New York Cardinals",
        "New York Mets"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What other name was given to the Kentucky Derby?",
      "options": [
        "The Run for the Roses",
        "The Fastest Two Minutes in Sport",
        "The Run for Glory",
        "The Kentucky Speed Trial"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "After Ted Williams retired from play, he went on to manage what major league team?",
      "options": [
        "Washington Senators",
        "San Fransisco Giants",
        "Minnesota Twins",
        "San Diego Padres"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This college and pro great had a very strange nickname -Crazy Legs. His last name was Hirsch. What was his real first name ?",
      "options": [
        "Lester",
        "Arnie",
        "Elroy",
        "Cliff"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these teams won three Super Bowls during the 1990s?",
      "options": [
        "San Francisco 49ers",
        "Denver Broncos",
        "Dallas Cowboys",
        "Pittsburgh Steelers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Andre Agassi won first position in singles rankings for the first time in his career in this year.",
      "options": [
        "1997",
        "1995",
        "1993",
        "1992"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This historic soccer player was still playing professionally at the age of 50 in the top division. At his best in the late 40s to mid 50s he only played for two clubs, Blackpool and Stoke. Who is this world-famous soccer player?",
      "options": [
        "Ronaldo",
        "George Best",
        "Stanley Matthews",
        "Michel Platini"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the the New England Patriots first round draft pick in 2007?",
      "options": [
        "Jerod Mayo",
        "Ellis Hobbs",
        "Brandon Meriweather",
        "Randy Moss"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which old timer struck out a total of 4 times in 1920 while playing with the Indians?",
      "options": [
        "Joe Sewell",
        "Billy Martin",
        "Jimmy Foxx",
        "Don Mattingly"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who purchased the Dallas Cowboys in 1989?",
      "options": [
        "Lawrence Tisch",
        "Wellington Mara",
        "Peter Angelos",
        "Jerry Jones"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The Kentucky Derby is held at which racetrack?",
      "options": [
        "Aqueduct",
        "Santa Anita",
        "Saratoga",
        "Churchill Downs"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What team defeated the New York Yankees in the 1960 World Series?",
      "options": [
        "Pittsburgh Pirates",
        "Los Angeles Dodgers",
        "St. Louis Cardinals",
        "San Francisco Giants"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The top price for a ticket to the Super Bowl I in 1967.",
      "options": [
        "$100",
        "$27",
        "$55",
        "$12"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This Australian special force deals with reconnaissance and counter-terrorism. It played a significant role in providing security during the Sydney Olympic Games in 2000.",
      "options": [
        "KS",
        "SAU",
        "SASR",
        "DGSE"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first NBA player to win the Finals MVP award in 1969?",
      "options": [
        "Jerry West",
        "Elgin Baylor",
        "Bill Russell",
        "Sam Jones"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Simply Red is a British band. The bands name is related to this soccer team.",
      "options": [
        "Arsenal",
        "Manchester United",
        "Liverpool",
        "Middlesbrough"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In 1986 he became Executive Director of the Major League Baseball Players Association.",
      "options": [
        "Marvin Miller",
        "Donald Fehr",
        "Theodore Forstmann",
        "Chuck Commisky"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The following statement was made by which famous basketball player: What counts is not necessarily the size of the dog in the fight \u2013 it\u2019s the size of the fight in the dog?",
      "options": [
        "Larry Bird",
        "Greg Anderson",
        "Michael Jordan",
        "Ben Wallace"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which 20-year-old first baseman made his debut for the New York Mets during the 1974 season?",
      "options": [
        "Brock Pemberton",
        "Rudy Pemberton",
        "Greg Brock",
        "Lou Brock"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the MVP of Super Bowl XXI?",
      "options": [
        "Phil Simms",
        "Mark Bavaro",
        "Joe Morris",
        "Otis Anderson"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which Dodger pitcher was named the 1963 World Series most valuable player?",
      "options": [
        "Johnny Podres",
        "Jerry Reuss",
        "Sandy Koufax",
        "Don Drysdale"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who is the Conn Smythe Trophy awarded to every year?",
      "options": [
        "The top rookie",
        "The top goalie",
        "The MVP in the Stanley Cup Playoffs",
        "The MVP for the regular season."
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the film Mr. Baseball, Tom Selleck portrays an aging New York Yankees player who is traded to what Japanese baseball team?",
      "options": [
        "Nagoya Chunichi Dragons",
        "Seibu Lions",
        "Yomiuri Giants",
        "Nippon Ham Fighters"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This second baseman hit a game winning home run in the 1960 world series.",
      "options": [
        "Jackie Robinson",
        "Pete Rose",
        "Bill Mazeroski",
        "Joe Morgan"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "When Yogi Berra first joined the Yankees, they already had a great catcher. Who was he?",
      "options": [
        "Gus Triandos",
        "Sherm Lollar",
        "Roy Campanella",
        "Bill Dickey"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How must the calf be caught in the event known as calf roping?",
      "options": [
        "By tripping it up",
        "By two feet",
        "With rope only",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following players did not hit 4 home runs in one game?",
      "options": [
        "Babe Ruth",
        "Lou Gehrig",
        "Mickey Mantle",
        "Carlos Delgado"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which Red Sox player saw limited duty and limited success in 2004, after an embarrassing incident in which he made an obscene gesture to the fans before a 2003 playoff game?",
      "options": [
        "Byung-Hyun Kim",
        "Gabe Kapler",
        "Ramiro Mendoza",
        "David McCarty"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In this year Casablanca premiered at the Hollywood Theater in New York City, Paul McCartney was born, and the St. Louis Cardinals beat the New York Yankees in the World Series.",
      "options": [
        "1940",
        "1944",
        "1942",
        "1946"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In this year the Green Bay Packers won the Super Bowl, Foolish Games/You Were Meant for Me by Jewel was the number 2 song, and the movie Titanic came out.",
      "options": [
        "1999",
        "1992",
        "1997",
        "1995"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The thoroughbred horses that run at the Kentucky Derby must be at what age?",
      "options": [
        "Any age",
        "Three years old",
        "Two years old",
        "Yearlings"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Two of the 2008 Olympic Games competitors, Natalia Partyka (Poland, table tennis) and Natalie du Toit (South Africa, swimming) are known for something very unusual. What do the two Natalys have in common, besides their first names?",
      "options": [
        "They competed both in 2008 Olympic Games and 2008 Summer Paralympics",
        "Aged 13, they were the youngest competitors",
        "They gave birth just days before the opening ceremony but still managed to take part in their competitions",
        "They are twin sisters adopted by the different families just after birth; they met during the Olympics for the first time"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This chess opening involves no pawn moves beyond the third rank.",
      "options": [
        "The Hamster Defense",
        "The British Defense",
        "The Squirrel Defense",
        "The Hedgehog Defense"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who did the Toronto Blue Jays pick in their first ever expansion draft?",
      "options": [
        "Ron Fairly",
        "Bob Bailor",
        "Jerry Johnson",
        "Doug Ault"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1986, the North Carolina State University Football team defeated the highly ranked South Carolina team on a miracle Hail Mary pass. Which receiver caught that pass?",
      "options": [
        "Danny Peebles",
        "Nasrallah Worthen",
        "Haywood Jeffries",
        "Torry Holt"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The first perfect game in the 20th century was pitched on May 5, 1904. Who was the winning pitcher?",
      "options": [
        "Rube Waddell",
        "Addie Joss",
        "Cy Young",
        "Babe Ruth"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of the Grand Slams has not been won by Pete Sampras?",
      "options": [
        "Australian Open",
        "Roland Garros",
        "Wimbledon",
        "US Open"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which score is impossible in a tennis tie-break set?",
      "options": [
        "7-5",
        "8-6",
        "8-5",
        "99-97"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who replaced coach Don Faurot when he retired in 1956?",
      "options": [
        "Dan Devine",
        "Frank Broyles",
        "Al Onofrio",
        "Chauncey Simpson"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which English Premier rugby teams ground is furthest north?",
      "options": [
        "Sale",
        "Glasgow",
        "Newcastle",
        "Leeds"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which nation defeated Brazil, the defending champions, in the quarter finals of the 2006 FIFA World Cup?",
      "options": [
        "France",
        "Portugal",
        "Italy",
        "Germany"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What trophie did Chelsea win in 2000?",
      "options": [
        "League Cup",
        "FA Cup",
        "UEFA Cup",
        "Premiership Cup"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which of these wrestlers did not win an IWGP championship title in the 20th century?",
      "options": [
        "Owen Hart",
        "El Samurai",
        "Chris Jericho",
        "The Pegasus Kid"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This Baseball Hall of Famer is known as The Splendid Splinter.",
      "options": [
        "Joe DiMaggio",
        "Hank Aaron",
        "Johnny Bench",
        "Ted Williams"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The actresss father created The Today Show, The Wide World of Sports, Your Show of Shows(aka the Sid Caesar Show) and helped create The Tonight Show.",
      "options": [
        "Diane Lane",
        "Sigourney Weaver",
        "Debbie Allen",
        "Jobeth Williams"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the maximum number of teams from one country that can participate in the UEFA Champions League?",
      "options": [
        "5",
        "4",
        "There is no limit.",
        "3"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Olympic Flame was introduced in 1928 and carrying it in a relay in the lead-up to each game began in 1936. Where in Greece is the flame lit at the start of the relay?",
      "options": [
        "Rhodes",
        "Olympia",
        "Athens",
        "Olympus"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In this year Welmbley ceases from being the official host of the Competition.",
      "options": [
        "1998",
        "2001",
        "1999",
        "2000"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In skateboarding, what is a Boneless one?",
      "options": [
        "A skateboard without a nose guard",
        "A classic trick, invented by Garry Scott Davis",
        "A fall that doesnt break anything",
        "A skater that doesnt like to fall"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What position is former Major League Baseball player, Rollie Fingers famous for playing?",
      "options": [
        "Third Base",
        "First Base",
        "Pitcher",
        "Catcher"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which organization gave Yogi Berra the Silver Buffalo Award?",
      "options": [
        "The Daughters of the American Revolution",
        "The Elks Club",
        "The Boy Scouts of America",
        "The American Legion"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which Premier teams home ground is nearest to Twickenham Stadium?",
      "options": [
        "Saracens",
        "Harlequins",
        "London Irish",
        "Wasps"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Kobe Bryant said on TNT that he wanted this jersey number as a rookie in the 2006-2007 season.",
      "options": [
        "19",
        "33",
        "24",
        "12"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This country was the host of the 1932 Summer Olympics, or the Games of the X Olympiad.",
      "options": [
        "Japan",
        "The United States",
        "Belgium",
        "Australia"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What country employs the blue color as its national sports color, as it denotes secularism?",
      "options": [
        "South Korea",
        "Spain",
        "India",
        "Italy"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the position number of a Center in basketball?",
      "options": [
        "1",
        "4",
        "5",
        "3"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Why did Jeff Hardy got suspended for 60 days in May 2008?",
      "options": [
        "None of these",
        "Not showing for a match",
        "He has never been suspended.",
        "For illegal drug use"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where did the Yankees play immediately before Yankee Stadium was built?",
      "options": [
        "Oriole Park-the home of the Baltimore Orioles",
        "Shea Stadium-the home of the New York Mets",
        "The Polo Grounds-the home of the New York Giants",
        "Ebbets Field-the home of the Brooklyn Dodgers"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What sport was nicknamed wiff-waff?",
      "options": [
        "golf",
        "tennis",
        "table tennis",
        "hockey"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these is different in the two variations of volleyball - beach and indoor?",
      "options": [
        "number of sets in a match",
        "number of players in a team",
        "all of these",
        "size of court"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these positions is former baseball player, Dwight Evans most famous for?",
      "options": [
        "Center Field",
        "Pitcher",
        "Second Base",
        "Right Field"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is a soccer team from the U.S. state of Virginia?",
      "options": [
        "Lynchburg Hillcats",
        "Pulaski Mariners",
        "Hampton Roads Piranhas",
        "Richmond Renegades"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "During the 2007/08 season, Wasps play their home matches at Adams Park. In which Buckinghamshire town is it located?",
      "options": [
        "High Wycombe",
        "Milton Keynes",
        "Aylesbury",
        "Bletchley"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following gymnasts was not on the 2004 US Olympic Gymnastics team?",
      "options": [
        "Carly Patterson",
        "Shannon Miller",
        "Paul Hamm",
        "Blaine Wilson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which division do the Sacramento Kings play in?",
      "options": [
        "Atlantic Division of the Eastern Conference",
        "Central Division of the Eastern Conference",
        "Southwest Division of the Western Conference",
        "Pacific Division of the Western Conference"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the last hockey player to be cut from the 1980 USA Olympic team by coach Herb Brooks, and what college team did he play for?",
      "options": [
        "Ralph Ocallahan - BU",
        "Ralph Ocallahan - UNH",
        "Ralph Cox - UNH",
        "Ralph Cox - BU"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Scoring a safety is a rare occurrence in an NFL game. This defensive end, who played for the Rams, was the first NFLer to score two safeties in one game.",
      "options": [
        "Ted Hendricks",
        "Fred Dryer",
        "Doug English",
        "Jack Youngblood"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the nickname of the University of Tennessees teams?",
      "options": [
        "Crimsom Tide",
        "Hokies",
        "Volunteers",
        "Terrapins"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This annual prestigious sport competition, held in Monaco, was organized for the first time in 1929 by Anthony Nogh\u00e8s.",
      "options": [
        "Monte Carlo Open",
        "Monte Carlo Masters",
        "Monte Carlo Rally",
        "Monaco Grand Prix"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What NFL team won the 1999 Super Bowl?",
      "options": [
        "San Diego Chargers",
        "New England Patriots",
        "Denver Broncos",
        "Atlanta Falcons"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What is the most distinctive feature of Cyber Sunday?",
      "options": [
        "It is all about the Gold",
        "Fans take over",
        "It is all about McMahon",
        "Retired wrestlers come back"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This two-time MVP player, known as The Mailman, was selected in 1996 as one of the 50 Greatest Players in NBA History.",
      "options": [
        "Bill Cartright",
        "Larry Bird",
        "Karl Malone",
        "Bernard King"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Former UCLA and Rams lineman Woody Strode fought a brief but memorable arena battle as a gladiator in what famous movie?",
      "options": [
        "The Professionals",
        "Spartacus",
        "Ben Hur",
        "Gladiator"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What tennis player won the US Open in 1990, becoming the youngest ever US Open champion in mens singles?",
      "options": [
        "Bill Tilden",
        "John McEnroe",
        "Pete Sampras",
        "Andre Agassi"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The first steel cage match at SummerSlam was between which two competitors?",
      "options": [
        "Diesel/Mabel",
        "Bret Hart/Owen Hart",
        "Ultimate Warrior/Rick Rude",
        "Mankind/Hunter Hearst Helmsley"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This chess opening involves up to 3 knight moves in succession before any other piece or pawn is moved.",
      "options": [
        "Nimzovitch",
        "Alekhine",
        "Sicilian",
        "Pirc"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Glima sounds like a nasty disease but it really is what?",
      "options": [
        "Icelandic term for wrestling",
        "unarmed combat from the Holy Roman Empire",
        "technique of stick fighting",
        "acronym for a style of Russian fighting"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many Cy Young Awards did Bob Gibson win?",
      "options": [
        "4",
        "2",
        "3",
        "1"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Lynn Swann was a wide receiver for which N.F.L. team?",
      "options": [
        "Dolphins",
        "Bengals",
        "Colts",
        "Steelers"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Dale Earnhardt drove for several owners. Which owner was he driving for when he won his first NASCAR championship?",
      "options": [
        "Richard Childress",
        "Wood Brothers",
        "Bud Moore",
        "Rod Osterland"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who was the first Major Leaguer to hit a grand slam home run in a Major League All-Star game?",
      "options": [
        "Jackie Robinson",
        "Roberto Clemente",
        "Fred Lynn",
        "Jimmy Piersall"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which versatile athlete, inducted into the Pro Football Hall of Fame in 1963, won Olympic gold medals in the pentathlon and decathlon?",
      "options": [
        "Kirk Gibson",
        "Bo Jackson",
        "Jim Thorpe",
        "Jim Brown"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 2003 the Chicago Cubs retired the jersey of which player?",
      "options": [
        "Ernie Banks",
        "Billy Williams",
        "Ryne Sandberg",
        "Ron Santo"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many wickets must fall (barring retirement or injury) for a cricket team to be all out?",
      "options": [
        "10",
        "5",
        "11",
        "3"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This Italian city on the Olona river is famous for its fashion, its soccer clubs, and a Grand Prix circuit.",
      "options": [
        "Modena",
        "Monte Carlo",
        "Milan",
        "Marseilles"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Herman Blix, John Weissmuller, Clarence Crabbe, and Glenn Morris were all Americans who won Olympic medals. What else did they have in common?",
      "options": [
        "They all died in abject poverty.",
        "They all became actors and played the same part in different movies.",
        "They all had their pictures on Wheaties boxes.",
        "They were all given special medals by President Herbert Hoover."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which WWE star has used the ring names Vampiro Americano, Death Mask and Johnny Hawk?",
      "options": [
        "Cena",
        "JBL",
        "HHH",
        "Bret Hart"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Teams in the NHL and the NBA both usually play this many regular season games.",
      "options": [
        "55",
        "96",
        "82",
        "104"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which American university has chosen the spider as its official mascot?",
      "options": [
        "University of Richmond",
        "University of Rhode Island",
        "Valipariaso",
        "Boston College"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This player, nicknamed The Big Dipper, Goliath and Mr.100, became the 1972 NBA Finals MVP.",
      "options": [
        "Wilt Chamberlain",
        "Bill Walton",
        "Kareem Abdul-Jabbar",
        "JoJo White"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The 1960 Summer Olympics, the first to be fully covered by television, were held in which city?",
      "options": [
        "Rome",
        "Innsbruck",
        "Grenoble",
        "Tokyo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Joe McNull was a star of .. the Polish national basketball team. His name suggests that he must have been born somewhere else. What basketball loving country is most likely his homeland?",
      "options": [
        "France",
        "The USA",
        "Italy",
        "England"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On the show Coach, what was the name of the fictional university at which the Coach worked?",
      "options": [
        "Minnesota State University",
        "Caciolo University",
        "Iowa State University",
        "Georgia University"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following does not have a monument at Monument Park, a section of Yankee Stadium contains a collection of monuments?",
      "options": [
        "Pope John Paul II",
        "The Victims of 9/11",
        "Wellington Mara",
        "Pope Paul VI"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Atlanta Braves traded Doyle Alexander to the Detroit Tigers on August 12, 1987, for which player?",
      "options": [
        "Tom Glavine",
        "John Smoltz",
        "Greg Maddux",
        "Steve Avery"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Jose Canseco, a cast member on The Surreal Life 5, played what sport?",
      "options": [
        "baseball",
        "basketball",
        "football",
        "soccer"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What type of pitcher was Bob Gibson?",
      "options": [
        "Righthanded reliever",
        "Starting lefthander",
        "Starting righthander",
        "Lefthanded reliever"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This French soccer player, who in 2001 was transferred from Italian team, Juventus to Spanish club, Real Madrid, won the 2003 FIFA World Player of the Year Award.",
      "options": [
        "Zinedine Zidane",
        "Thierry Henry",
        "Jean-Pierre Papin",
        "Robert Pires"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This Joe roamed the outfield during the Oakland As heyday of the early 1970s.",
      "options": [
        "Girardi",
        "Morgan",
        "Carter",
        "Rudi"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Arguably the second most important sports car race held in the world is the 24 hours of Daytona. In what year was the inaugural 24 hours of Daytona held?",
      "options": [
        "1969",
        "1962",
        "1966",
        "1973"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Hermann Maier (Herminator) was an Austrian star of which winter sport?",
      "options": [
        "Alpine skiing",
        "Cross-country skiing",
        "Ski jumping",
        "Ice hockey"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the two teams, established in Ohio in the 20th century, joined the NFL earlier?",
      "options": [
        "The Cleveland Browns",
        "The Cincinnati Bengals",
        "none of these",
        "They joined the NFL in the same year."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "WWE superstar Edge is the former brother-in-law of this wrestler.",
      "options": [
        "Hardcore Holly",
        "Brian Kendrick",
        "Val Venus",
        "Christian"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The inaugural Indianapolis 500 held in 1911 was won by Ray Harroun driving a Marmon \u201cWasp\u201d. What was his average winning speed?",
      "options": [
        "174.602 mph",
        "74.602 mph",
        "7.602mph",
        "47.602 mph"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This French soccer legend finished top scorer in A Series for three consecutive seasons (1982-83, 1983-84 and 1984-85) and was voted Player of the Year by World Soccer magazine in 1984 and 1985. Who is he?",
      "options": [
        "Papen",
        "Platini",
        "Vialli",
        "Reina"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which sport is most unlike the others?",
      "options": [
        "Klootschieten",
        "Boules",
        "Bocce",
        "Varpa"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How is Tiger Woods playing style often described?",
      "options": [
        "Energetic",
        "Confident",
        "Aggressive",
        "Cautious"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the Man of the Series in the inaugural ICC World Cup of 1975?",
      "options": [
        "Ian Chappell",
        "Vivian Richards",
        "none",
        "Clive Lloyd"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who is the shortest player in the history of NBA?",
      "options": [
        "Spud Webb",
        "Larry Bird",
        "Eddie Griffin",
        "Tyronne Bogues"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When Utah first broke the BCS, they played against this team in this BCS Bowl Game.",
      "options": [
        "Tulsa/Armed Forces Bowl",
        "Pittsburgh/Fiesta Bowl",
        "Alabama/Sugar Bowl",
        "Georgia Tech/Emerald Bowl"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which player was sent off in the 2006 FIFA World Cup quarter final match between England and Portugal?",
      "options": [
        "Michael Owen",
        "David Beckham",
        "Owen Hargreves",
        "Wayne Rooney"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was the Detroit Red Wings nickname from 1926 to 1930?",
      "options": [
        "Shamrocks",
        "Falcons",
        "Cougars",
        "Cardinals"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was the first male athlete to win the decathlon and pentathlon at Olympics Games?",
      "options": [
        "Michael Johnson",
        "Jim Thorpe",
        "Rafer Johnson",
        "Ray Ewry"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first man to win 8 gold medals at a single Olympics?",
      "options": [
        "Alexander Dityatin (USSR, gymnastics)",
        "Carl Lewis (USA, track and field)",
        "Usain Bolt (Jamaica, track and field)",
        "Michael Phelps (USA, swimming)"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which player top scored at the 2006 FIFA World Cup?",
      "options": [
        "Michael Owen",
        "Zinadine Zidane",
        "Miroslav Klose",
        "Luca Toni"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which slugger from the Chicago Cubs had the most career Home Runs playing for his team?",
      "options": [
        "Ron Santo",
        "Billy Willams",
        "Ernie Banks",
        "Sammy Sosa"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Hockey Hall of Fame located in Toronto, Ontario, has inducted some of the greatest of hockey players over the years. Which member of the Montreal Canadiens was inducted into the Hockey Hall of Fame in 2006?",
      "options": [
        "The 63rd",
        "The 42nd",
        "The 44th",
        "The 51st"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This former pitcher, manager and executive in Major League Baseball, who led the Philadelphia Phillies to their first World Series title in 1980, managed the New York Mets during 1993-96.",
      "options": [
        "Bobby Valentine",
        "Dallas Green",
        "Davey Johnson",
        "Joe Torre"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What ACC school won the NCAA championship in 2005?",
      "options": [
        "Duke",
        "NC State",
        "Maryland",
        "UNC"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first Houston Astros Manager?",
      "options": [
        "Phil Garner",
        "Hal Lanier",
        "Harry Craft",
        "Leo Durocher"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In what year did Kobe Bryant first become a member of the USA Mens Senior Olympics Team?",
      "options": [
        "2004",
        "1996",
        "2008",
        "2000"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Nobody knows for sure why Love means nothing on a tennis court. Which of these theories is NOT one of the common theories of where this usage originated?",
      "options": [
        "In the Dutch phrase, iets voor lof doen (to do something for nothing), lof means nothing.",
        "Love is a more pleasant word than zero. Since tennis is a highly civilized sport, love evolved as a tactful way of denoting a score zero.",
        "In French, Loeuf means Egg and an egg is in the shape of a zero.",
        "In French, Lheure means The hour. Since some people think that the 15-30-40 scoring refers to 15, 30 and 40 minutes after the hour, the hour might mean zero."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these defensive players did not play linebacker for The Miami Hurricanes?",
      "options": [
        "Dan Morgan",
        "Michael Barrow",
        "Al Blades",
        "Jonathan Vilma"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What was the combined record of the 1972 Dolphins regular and post season (Super Bowl included) opponents?",
      "options": [
        "98-123-3",
        "78-143-3",
        "101-122-1",
        "119-101-4"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What NFL football team had the second to worst record in 2007?",
      "options": [
        "Green Bay Packers",
        "The Tennessee Titans",
        "Atlanta Falcons",
        "St. Louis Rams"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What do these major leaguers have in common: Jim Bibby, Robin Roberts, Curt Simmons, and Woody Fryman?",
      "options": [
        "They all pitched 27 consecutive outs but had perfect games foiled by the first batter.",
        "They all hit winning homers in perfect games.",
        "They were all on the field for two perfect games.",
        "They were all losing pitchers in two perfect games."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Athletics is called the queen of all sports. Who won the first gold in athletics during the 2008 Olympic Games?",
      "options": [
        "Tomasz Majewski (Poland, shot put)",
        "Tirunesh Dibaba (Ethiopia, 10km)",
        "Hyleas Fountain (USA, heptathlon)",
        "Nicoleta Grasu (Romania, discus)"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these soccer teams cannot play in the Italian Championship Serie A?",
      "options": [
        "Getafe CF",
        "Fiorentina",
        "Reggina",
        "Lazio"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these players was nicknamed The Fridge?",
      "options": [
        "William Perry",
        "Manute Bol",
        "Jared Allen",
        "Art Monk"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What race is often referred to as The Grand Prix of Endurance?",
      "options": [
        "The Milan Grand Prix",
        "The Indianapolis 500",
        "The Grand prix of Monaco",
        "24 Hours of Le Mans"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is not the name of a pitcher who threw a perfect game?",
      "options": [
        "Charlie Robertson",
        "Cy Young",
        "Addie Joss",
        "Walter Johnson"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Sir Purr is the mascot of what NFL football team?",
      "options": [
        "The saints",
        "The Falcons",
        "The Panthers",
        "The Bucks"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Ray Harroun win the first Indianapolis 500?",
      "options": [
        "1911",
        "1941",
        "1925",
        "1931"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What New York Mets slugger won Rookie of the Year in 1983?",
      "options": [
        "Mookie Wilson",
        "Darryl Strawberry",
        "David Wright",
        "George Foster"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of these NBA teams is not in the Atlantic Division of the Eastern Conference?",
      "options": [
        "Philadelphia",
        "Toronto",
        "Boston",
        "Miami"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Where was the first NASCAR-sanctioned race held?",
      "options": [
        "Talladega, Alabama",
        "Indianapolis, Indiana",
        "Daytona, Florida",
        "Martinsville, Virginia"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In what Arabian country has A.C. Milan played?",
      "options": [
        "Qatar",
        "All of these",
        "Saudi Arabia",
        "United Arabian Emirates"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Vale-tudo has become a very popular international sport. What other term refers to this sport?",
      "options": [
        "Snowboarding",
        "Mixed martial arts",
        "Golf",
        "Surfing"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In the film Ferris Buellers Day Off , on their day off Ferris and his friends go to a baseball game, played at this stadium.",
      "options": [
        "Wrigley Field",
        "Soldier Field",
        "Comiskey Park",
        "Chicago Stadium"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What year did the popular sitcom Coach leave the airwaves?",
      "options": [
        "1993",
        "2000",
        "1998",
        "1997"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What former catcher managed the New York Mets in 1973?",
      "options": [
        "Gil Hodges",
        "Wes Westrum",
        "Yogi Berra",
        "Joe Frazier"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these 2004 Red Sox stars was not a first-round draft pick?",
      "options": [
        "Jason Varitek",
        "David Ortiz",
        "Nomar Garciaparra",
        "Manny Ramirez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Bobby Fischer become the world chess champion?",
      "options": [
        "1968",
        "1978",
        "1977",
        "1972"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following is the nickname of The Atlanta Braves?",
      "options": [
        "The Bravos",
        "Teds Boys",
        "The Georgians",
        "The Peaches"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the only undefeated boxing heavyweight champ, later killed in an airplane accident?",
      "options": [
        "Rocky Marciano",
        "Floyd Patterson",
        "Leon Spinks",
        "Ezzard Charles"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what season did the Montreal Canadiens win their first Stanley Cup?",
      "options": [
        "1917-1918",
        "1916-1918",
        "1919-1920",
        "1915-1916"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In his 31-year career, this driver, nicknamed The Iceman, has won over 20 major NASCAR races.",
      "options": [
        "Terry Wine",
        "Terry Pratchett",
        "Terry Labonte",
        "Abner Terry"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This Japanese dynamo became the first lady to land a quadruple jump in competition. It was a junior competition, but it still counts as a figure skating first.",
      "options": [
        "Shizuka Arakawa",
        "Mao Asada",
        "Mai Asada",
        "Miki Ando"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What song, written by Jimmy Hart, is Shawn Michaels entrance music?",
      "options": [
        "Sexy Boy",
        "Hello Ladies",
        "The Time Is Now",
        "LovePassionFuryEnergy"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the former major league baseball great who managed the Rockford Peaches in the movie A League of Their Own?",
      "options": [
        "Honus Wagner",
        "Billy McIntyre",
        "Jimmy Dugan",
        "Jackie Coogan"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In squash, small coloured dots on the ball indicate the level of bounciness, hence the skills needed to handle the ball. According to the Professional Squash Association standards, what does the red colour indicate?",
      "options": [
        "Fast ball",
        "Slow ball",
        "Medium ball",
        "Extra slow ball"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who had the longest hitting streak until 1941?",
      "options": [
        "Willie Keeler",
        "Pete Rose",
        "Ty Cobb",
        "George Sisler"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was the first African American NFL quarterback?",
      "options": [
        "Jack Tosser",
        "Doug Williams",
        "Marlin Briscoe",
        "Willie Thrower"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first Cleveland Cavalier player to get the prize NBA Rookie of the year in 2004, when he was only 19?",
      "options": [
        "Lebron James",
        "Luke Jackson",
        "Alan Henderson",
        "Eric Snow"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Gheorghe Mure\u015fan, one of the tallest players to ever play in the NBA, was born in this country.",
      "options": [
        "Uganda",
        "Nigeria",
        "Sudan",
        "Romania"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "At what time of the year is the US Open held?",
      "options": [
        "August / September",
        "May / June",
        "January",
        "June / July"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What was the name for the first Most Valuable Player Award in Major League baseball?",
      "options": [
        "Chalmers Award",
        "The Chadwick Award",
        "The Most Valuable Player Award",
        "The MVP"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What does the abbreviation SCUBA stand for?",
      "options": [
        "Self-Contained Underwater Breathing Apparatus",
        "Swimming Continuously Underwater Breathing Air",
        "Swimming Confidently Underwater Breathing Air",
        "Swimming Confined to Underwater Breathable Air"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What National League pitcher threw a perfect game against the New York Mets on Fathers day in 1964?",
      "options": [
        "Warren Spahn",
        "Sandy Koufax",
        "Jim Bunning",
        "Bob Gibson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1984, Bobby Fischer wrote to the editors of this publication to have his name removed from it.",
      "options": [
        "Encyclopedia Americana",
        "Colliers encyclopedia",
        "Encyclopedia Judaica",
        "Encyclopedia Britannica"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This pitcher was the first Little Leaguer to be inducted into the Baseball Hall of Fame.",
      "options": [
        "Joey Jay",
        "Jim Hunter",
        "Don Drysdale",
        "Bob Gibson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In December 1998, this figure skater, winner of two Olympic gold medals appeared on the cover of Playboy magazine.",
      "options": [
        "Michelle Kwan",
        "Nancy Kerrigan",
        "Katarina Witt",
        "Tonya Harding"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Roy Campanella starred for the Brooklyn Dodgers during the 1950s at which position?",
      "options": [
        "Catcher",
        "Second Base",
        "Designated Hitter",
        "First Base"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Top Fuel race cars run on this type of fuel.",
      "options": [
        "Nitroglycerin and Methanol",
        "Propane and Methane",
        "Ethanol and Nitropropane",
        "Nitromethane and Methanol"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "If I were to visit the wrist-wrestling capital of the world, where would I go?",
      "options": [
        "Riga, Latvia",
        "Petaluma, California.",
        "Sofia, Bulgaria",
        "Norman, Oklahoma"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these NBA teams originated in Minnesota?",
      "options": [
        "Memphis Grizzlies",
        "Portland Trail Blazers",
        "Los Angeles Lakers",
        "Atlanta Hawks"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these teams won their ninth World Series title in 1982?",
      "options": [
        "The NY Yankees",
        "The Braves (Boston, Milwaukee, Atlanta)",
        "The St. Louis Cardinals",
        "The Athletics (Phila., Kansas City, Oakland)"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This Italian manufacturer of sports cars was founded in 1929, and in 1947 it started producing street-legal vehicles.",
      "options": [
        "Lamborghini",
        "Ferrari",
        "Maserati",
        "None of these"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Why did baseball player Mordecai Brown get the nickname Three-Finger Brown?",
      "options": [
        "For emphasis, he used to give opponents the finger, in triplicate.",
        "He was born with just 3 fingers on his pitching hand.",
        "At age 7, his hand was mangled by a corn shredder.",
        "He held up 3 fingers to taunt batters before throwing them 3 straight fastballs."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "The Steelers finally won their 5th Championship in Super Bowl XL against the Seattle Seahawks in this year.",
      "options": [
        "2005",
        "2003",
        "2004",
        "2006"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these was not one of Dale Earnhardts nicknames?",
      "options": [
        "Ironheart",
        "The Man in Black",
        "The Intimidator",
        "Ironhead"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Where did the Tour de France start in 2007?",
      "options": [
        "Parliament Square",
        "Covent Garden",
        "Leicester Square",
        "Trafalgar Square"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The 1896 Summer Olympics, or the Games of the I Olympiad, were hosted by this European country.",
      "options": [
        "Germany",
        "France",
        "Greece",
        "Sweden"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In one of the more controversial wins of 2006 NASCAR, who picked up his first career cup win in Talledega on October 8 in the UAW-Ford 500?",
      "options": [
        "Clint Bowyer",
        "Martin Truex, Jr.",
        "Denny Hamlin",
        "Brian Vickers"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "On July 2, 2008 the NHRA ruled that Top Fuel and Funny Car races can not be longer than 1000 feet. This ruling was spurred by the accidental racetrack death of this driver.",
      "options": [
        "Red Brundige",
        "Robert Hight",
        "Scott Kalitta",
        "John Maintrop"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "After a great college career at Bowling Green, this center played power forward for the Warriors because Wilt Cahmberlain played center. After Wilt was traded back to Philadelphia, he bloomed as a center. Who is this player who once pulled down 18 rebounds in one quarter?",
      "options": [
        "Swede Holbrooke",
        "Nate Thurmond",
        "Moses Malone",
        "Willis Reed"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Name the first NFL team to win the Super Bowl indoors.",
      "options": [
        "Dallas",
        "Miami",
        "Tampa Bay",
        "Pittsburgh"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "At the 2006 Unforgiven PPV, there was a Womens Championship Match between Lita and Trish Stratus. What was the stipulation?",
      "options": [
        "Loser barks like a dog",
        "Winner takes the Title",
        "There was no stipulation",
        "Bra and Panty"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "For many years he made all the announcements at Yankee Stadium.",
      "options": [
        "Red Barber",
        "Mel Allen",
        "Bob Sheppard",
        "Michael Kaye"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What measures, related to Native American tribes, did the National Collegiate Athletic Association take in 2005?",
      "options": [
        "They created the Native American Soccer League.",
        "They allowed Native American teams to take part in tournaments.",
        "They banned the abusive Native American imagery and nicknames in athletics.",
        "They founded a scholarship for Native American athletes."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which NBA star, famous for taking part in a Sprite commercial, was granted the 2004-2005 NBA Sportsmanship Award for his sportsmanship, ethical behavior, fair play and integrity?",
      "options": [
        "Grant Hill",
        "David Robinson",
        "Ray Allen",
        "Joe Dumars"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Allman Brothers classic rock instrumental, Jessica, was used in what popular baseball movie?",
      "options": [
        "For the Love of the Game",
        "Major League II",
        "Field of Dreams",
        "The Rookie"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Jim Quick umpired a perfect game on September 16, 1988. Tom Browning was the winning pitcher for the home team. The game was played at Riverfront Stadium. Name the wining team.",
      "options": [
        "The Twins",
        "The Red Sox",
        "The Reds",
        "The Padres"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many foster homes was the Undertaker put in after his parents were killed according to a WrestleMania storyline?",
      "options": [
        "3",
        "1",
        "2",
        "0"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Terry Gene Bollea is a famous athlete better known by this name.",
      "options": [
        "Gerald Ford",
        "Mohammed Ali",
        "Warren Beatty",
        "Hulk Hogan"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1996, the NBA Championship was won by this team.",
      "options": [
        "Houston Rockets",
        "Seattle SuperSonics",
        "Orlando Magic",
        "Chicago Bulls"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which pitcher had the most victories with the 1980 Philadelphia Phillies?",
      "options": [
        "Bob Walk",
        "Steve Lefty Carlton",
        "Marty Bystrom",
        "Ron Reed"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "On which TV show did Phil Rizzuto appear as the first mystery guest?",
      "options": [
        "Beat the Clock!",
        "Whom Do You trust?",
        "Truth or Consequences",
        "Whats My Line?"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This famous football nation won its first World Cup in 1978.",
      "options": [
        "Argentina",
        "the Soviet Union",
        "France",
        "Holland"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What number did American football quarterback Joe Montana wear when he played for the college team Notre Dame?",
      "options": [
        "16",
        "12",
        "18",
        "3"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Tampa, FL. lost the 1975 Little League World Series to which team?",
      "options": [
        "Morristown, TN.",
        "Osaka, Japan",
        "Lakewood, N. J.",
        "Seoul, South Korea"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Before Arkansas State University went to the New Orleans Bowl in 2005, which Sun Belt Conference school represented the Sun Belt Conference in the Bowl the previous four years?",
      "options": [
        "University of North Texas",
        "Middle Tennessee State University",
        "New Mexico State University",
        "University of Louisiana at Lafayette"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "On October 13th, 1971, Major League Baseball history was made when the first night game of a World Series was played between the Pittsburgh Pirates and this team.",
      "options": [
        "Boston Red Sox",
        "Baltimore Orioles",
        "Houston Astros",
        "Texas Rangers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many medals did the Gymnastics US team get in the 2004 Olympic Games?",
      "options": [
        "18",
        "0",
        "9",
        "5"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Dale Murphy played his last game on May 21, 1993 for the Colorado Rockies and he started his career with which of these teams?",
      "options": [
        "Phillies",
        "Reds",
        "Braves",
        "Mariners"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Georgetown Universitys mascot is a bulldog. What is its nickname?",
      "options": [
        "Huskies",
        "Hoyas",
        "Panthers",
        "Wildcats"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following has never been a nickname for Yankee Stadium?",
      "options": [
        "The house that Lindsay rebuilt",
        "The house that Ruth built",
        "The house that built baseball",
        "The house that was built for Ruth"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He is one of the best quarterbacks in the history of the Pittsburgh Steelers. He has also been a fairly successful actor and sports analyst.",
      "options": [
        "Brad Terry",
        "Terry Bradshaw",
        "Terry Clark",
        "Stanley Terry"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This player, who joined the Minnesota Wild in the 2001\u20132002 NHL season, is nicknamed Bruno.",
      "options": [
        "Mikko Koivu",
        "Cal Clutterbuck",
        "Andrew Brunette",
        "Pierre Marc-Bouchard"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the manager of the 1981 World Series-winning team?",
      "options": [
        "Tommy Lasorda",
        "Walter Alston",
        "Billy Martin",
        "Bob Lemon"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What nationality is Travis Pastranas father?",
      "options": [
        "Puerto Rican",
        "Italian",
        "Cuban",
        "Mexican"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In what city is the Sounders team based?",
      "options": [
        "Miami",
        "Seattle",
        "Philadelphia",
        "Los Angeles"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which country won the maximum number of US Open championships since the beginning of the Open Era in 1968 until 2008?",
      "options": [
        "Switzerland",
        "Spain",
        "United States",
        "Australia"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Kajukenbo is not a computer game. What statement best suits this form of martial art?",
      "options": [
        "It is the art of espionage.",
        "It originated on the territory of Hawaii, USA",
        "It means Way of the Sword.",
        "It was developed by Morihei Ueshiba."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On the show Just Shoot Me, Dennis Finch, who went to Hudson River Junior College, was a member of what athletic team?",
      "options": [
        "Football",
        "Wrestling",
        "Baseball",
        "Cheerleading"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What World Champion bull rider had his face crushed by a bull named Bodacious?",
      "options": [
        "Tuff Hedeman",
        "Lane Frost",
        "Jerome Davis",
        "Ty Murray"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the very first basketball game each team comprised of this many players.",
      "options": [
        "9",
        "11",
        "10",
        "5"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Although \u201conly\u201d 67 (2 m) tall he was the first of the great defensive players in the NBA. His college team won the NCAA championship. His pro team won many championships. Who is he?",
      "options": [
        "Wilt Chamberlain",
        "George Mikan",
        "Nate Thurmond",
        "Bill Russell"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This great center was sometimes called The Howler\u201d because he used to yell at opponents in order to ruin the shooters concentration. His other nickname is associated with his career between college and the NBA. Who is this three-time Olympian who once scored a quadruple double?",
      "options": [
        "Wes Unseld",
        "Moses malone",
        "David Robinson",
        "Bill Walton"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is the birthplace of St. Louis Cardinals outfielder, So Taguchi?",
      "options": [
        "Hyogo Prefecture",
        "Santa Fe",
        "Carson City",
        "Los Angles"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the college football and track coach of Native American Jim Thorpe, one of the great athletes in world history?",
      "options": [
        "Pop Warner",
        "Dennis Carlisle",
        "Bulldog Turner",
        "Knute Rockne"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What hockey team plays in Calgary?",
      "options": [
        "Avalanche",
        "Hurricanes",
        "Flames",
        "Tornadoes"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What number did Major League Baseball player Pete Rose wear when he played for the Cincinnati Reds?",
      "options": [
        "5",
        "14",
        "7",
        "4"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This Hall of Famer played primarily for the Baltimore Orioles at first base.",
      "options": [
        "Jim Palmer",
        "Eddie Murray",
        "Al Newton",
        "Tony Perez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who won the Stanley Cup at the end of the 1993-1994 season?",
      "options": [
        "New Jersey Devils",
        "Montreal Canadiens",
        "New York Rangers",
        "New York Islanders"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What boxer was crowned Sportsman of the Century by Sports Illustrated and the BBC in 1999?",
      "options": [
        "Rocky Marciano",
        "Muhammad Ali",
        "Sugar Ray Leonard",
        "Mike Tyson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these volleyball players wears a jersey in a contrasting color to the jerseys of his/her teammates?",
      "options": [
        "outside hitter",
        "opposite hitter",
        "libero",
        "setter"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which nation didnt concede a goal in the entire 2006 FIFA World tournament?",
      "options": [
        "Germany",
        "Italy",
        "France",
        "Switzerland"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was the first European title change at SummerSlam?",
      "options": [
        "Triple H Vs Jeff Jarrett",
        "Triple H Vs Shawn Michaels",
        "D-Lo Brown Vs Jeff Jarrett",
        "Al Snow Vs Val Venis"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first African-American to play in an NBA game in 1950?",
      "options": [
        "Don Barksdale",
        "Earl Lloyd",
        "Chuck Cooper",
        "Nat Sweetwater Clifton"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "If you blow up a balloon to a volume of one liter of air at the surface, and then take the balloon down to a depth of 10 meters, what will happen?",
      "options": [
        "The balloon will completely collapse.",
        "The balloon will blow up.",
        "The balloon will increase in volume to 2 liters.",
        "The balloon will decrease in volume to 1/2 liter."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Successful Major League Baseball player and coach, Donald Edward Don Gullett, was famous for playing what position?",
      "options": [
        "Right Field",
        "Catcher",
        "Pitcher",
        "Second Base"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In June 1964 the St. Louis Cardinals traded Bobby Shantz, Ernie Broglio and Doug Clemens to the Chicago Cubs for which future Hall of Famer?",
      "options": [
        "Bob Gibson",
        "Ryne Sandberg",
        "Ernie Banks",
        "Lou Brock"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which brilliant top goal scorer is a product of Atletico Madrids youth system but legend of the rival team Real Madrid?",
      "options": [
        "Victor Valdes",
        "Raul Blanco",
        "Michel Platini",
        "Mendieta"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which nation was banned from the first Cricket World Cup tournament?",
      "options": [
        "South Africa",
        "Australia",
        "Sri Lanka",
        "Pakistan"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In this year George Martin, English producer of The Beatles, was born, Fox Film bought the Movietone system for recording sound onto tape, and Joe Paterno, longtime coach of Pennsylvania State Universitys college football team was born.",
      "options": [
        "1927",
        "1929",
        "1923",
        "1926"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1999, the reigning World Champion Michelle Kwan lost to a Russian who became the first woman from her country to win a Figure Skating World Championship. Who is she?",
      "options": [
        "Ekaterina Gordeeva",
        "Maria Butyrskaya",
        "Irina Slutskaya",
        "Oksana Baiul"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the most common and popular sport in Honduras?",
      "options": [
        "Baseball",
        "Soccer",
        "Cricket",
        "Rugby"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In this year the New York Jets of the American Football League beat the favored Baltimore Colts of the National Football League 16-7 in Super Bowl III, Butch Cassidy and the Sundance Kid came out, and Stevie Wonder came out with I Dont Know Why.",
      "options": [
        "1966",
        "1967",
        "1969",
        "1968"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is not included in the popular Ironman Triathlon race?",
      "options": [
        "Running",
        "Swimming",
        "Biking",
        "Jumping"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In paintball markers, tubes that hold extra paintballs while in a battle are called what?",
      "options": [
        "Ballholders",
        "Their is no such tanks.",
        "Extraloaders",
        "Speedloaders"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which NASCAR race was formerly called The World 600?",
      "options": [
        "Coca Cola 600",
        "Aarons 600",
        "Southern 600",
        "Food Yard 600"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Why did baseball player Derek Jeter acquire the nickname Mr. November?",
      "options": [
        "That is his bats nickname.",
        "His uniform number is 11.",
        "He hit a game-winning homer in the first World Series game ever played in November.",
        "He loves Thanksgiving."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When the Charlotte Bobcats first came into the NBA, how many NBA players did they pick to be on the inaugural roster in their expansion draft?",
      "options": [
        "15",
        "21",
        "19",
        "17"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What role did Brad Pitt play at the 2008 Summer Olympic Games?",
      "options": [
        "He was an umpire in the baseball tournament",
        "He fought in the boxing tournament and was eliminated in the first round",
        "He organized a pro-Tibet march in Hong-Kong",
        "He presented the last gold medal to Michael Phelps"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was not one of the starting outfielders for the Mets in the 1969 World Series?",
      "options": [
        "Cleon Jones",
        "Ron Swaboda",
        "Don Hahn",
        "Tommy Agee"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Nap Lajoie was the first American League hitter to win the Triple Crown. For which team did he win it?",
      "options": [
        "The Oakland Athletics",
        "The Philadelphia Athletics",
        "The Kansas City Athletics",
        "The St. Louis Browns"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "According to volleyball official rules, touching the net during play is not considered a fault in which case?",
      "options": [
        "Touching the net with foot",
        "Touching the net with a part of ones clothing",
        "Touching the net with hair",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which team is known as All Blacks?",
      "options": [
        "USA, basketball",
        "Pakistan, cricket",
        "New Zealand, rugby",
        "Zimbabwe, football"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What award did Shane Battier win in 2001?",
      "options": [
        "ACC Scorer of the Year",
        "National Defender of the Year",
        "ACC Defender of the Year",
        "National Player of the Year"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In paintball, you perform a Safe Velocity Test by means of what device?",
      "options": [
        "Velocity chronograph",
        "Velocity detector",
        "A simple stopwatch",
        "Velocity tester"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who were the people on the first cover of Sports Illustrated?",
      "options": [
        "Ben Hogan, Bobby Jones, and Sam Snead",
        "President Dwight David Eisenhower and his caddy, Mitch MacKenzie",
        "Eddie Mathews, Wes Westrum and Augie Donatelli",
        "Ted Williams and Joe DiMaggiio"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "During the 1980s decade how many titles did the Celtics win?",
      "options": [
        "4",
        "2",
        "3",
        "5"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first lady to win 6 consecutive Ladies singles titles at Wimbledon?",
      "options": [
        "Martina Navratilova",
        "Steffi Graf",
        "Arantxa Sanchez Vicario",
        "Martina Hingis"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is Dale Earnhardt Juniors favourite football team?",
      "options": [
        "Carolina Panthers",
        "Dallas Cowboys",
        "Washington Redskins",
        "Oakland Raiders"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first NFL player to get 200 sacks?",
      "options": [
        "Reggie White",
        "Michael Strahan",
        "Kevin Greene",
        "Bruce Smith"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Rugby player Tim Rodber, of Northampton and England, was a member of which of the British armed forces?",
      "options": [
        "The Army",
        "Royal Air Force",
        "Royal Marines",
        "Royal Navy"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How many premiership titles did Liverpool win during the period of 1992-2004?",
      "options": [
        "0",
        "4",
        "1",
        "3"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Kansas City Royalss player George Brett starred at this position.",
      "options": [
        "Pitcher",
        "Third Base",
        "Center Field",
        "Catcher"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What is Pete Roses middle name?",
      "options": [
        "John",
        "Edward",
        "James",
        "Eugene"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What player nicknamed Greyhound was the NBA Finals MVP in 1975?",
      "options": [
        "Bill Walton",
        "Wes Unseld",
        "Rick Barry",
        "Dennis Johnson"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Pilates coordinates your movements with which of the following?",
      "options": [
        "your breathing",
        "your strength",
        "your balance",
        "your partners movements"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In addition to hosting the Centennial Olympic Games in 1996, what other significant sporting event was held in Atlanta in the same year?",
      "options": [
        "World Series",
        "World Cup",
        "Super Bowl",
        "Tyson-Holyfield Fight"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who were the NBA Champions in 1990?",
      "options": [
        "Chicago Bulls",
        "Detroit Pistons",
        "Portland Trail Blazers",
        "Los Angeles Lakers"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who was the Mets starting third baseman in 1969?",
      "options": [
        "Wayne Garrett",
        "Bud Harrelson",
        "Ed Charles",
        "Al Weis"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What number did baseball player Darryl Strawberry wear when he played for the Los Angeles Dodgers in the 1990s?",
      "options": [
        "8",
        "18",
        "39",
        "44"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "All of the following players have at least 50 home runs in a season. Which one of these has the lowest overall career home run total?",
      "options": [
        "Johnny Mize",
        "Greg Vaughn",
        "Roger Maris",
        "Albert Belle"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first American pair to win a World Figure Skating Championship Gold Medal?",
      "options": [
        "Kitty Peter Caruthers",
        "Kyoko Ina Jason Dunjeon",
        "Karol Michael Kennedy",
        "Babilonia Gardner"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This side defeated Herbert Chapmans great Arsenal side 2-0 in 1933.",
      "options": [
        "Yeovil",
        "Bristol City",
        "Swansea",
        "Walsall"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What position is former baseball player for the Cincinnati Reds, Johnny Bench famous for playing?",
      "options": [
        "Pitcher",
        "Shortstop",
        "Second Base",
        "Catcher"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "If you hit the tennis ball toward your opponent, and hes standing at the net, and he reaches over the net and hits the ball before it crosses over the net to his side of the court, and it lands in your court, and then you hit it out of bounds, who wins the point and why?",
      "options": [
        "Your opponent wins the point because you hit it out.",
        "You win the point because your opponent hit the ball before it crossed into his side of the court.",
        "You win the point because your opponents racket crossed over the net into your court.",
        "Your opponent wins the point because he was able to hit the ball before it got to his side of the net."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which big legend of Manchester United survived an airplane crash in 1958?",
      "options": [
        "Sir Stanley Matthews",
        "George Best",
        "David Seaman",
        "Sir Bobby Charlton"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which player for the New York Mets was called Choo-Choo?",
      "options": [
        "Jerry Grote",
        "Rod Kanehl",
        "Rusty Staub",
        "Clarence Coleman"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "As of 2007, which team has been the winner of the most World Series of baseball?",
      "options": [
        "Cubs",
        "White Sox",
        "Its a Tie",
        "Bulls"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "How many years did John Franco spend with the New York Mets?",
      "options": [
        "16",
        "15",
        "13",
        "12"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what sport are the New York Knicks competing?",
      "options": [
        "Basketball",
        "Football",
        "Ice hockey",
        "Baseball"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Before becoming head coach of the University of Alabama football team, Paul Bear Bryant was head coach of three other university teams. Name the team which he did not coach.",
      "options": [
        "Maryland",
        "Texas Tech",
        "Kentucky",
        "Texas AM"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which team did English soccer star David Beckham play for before joining Real Madrid in 2003?",
      "options": [
        "FC Bayern",
        "FC Arsenal",
        "Manchester United",
        "DC United"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When keeping a baseball boxscore, which number signifies the shortstop?",
      "options": [
        "3",
        "4",
        "6",
        "5"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 2006, it was announced that Phil Rizzuto had what medical problems?",
      "options": [
        "Lou Gehrigs Disease",
        "cerebral palsy",
        "muscle atrophy andesophageal problems",
        "skin cancer"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what state was the first womens college basketball game played?",
      "options": [
        "Massachusetts",
        "Missouri",
        "New York",
        "California"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Welsh football (soccer) team qualified for the World Cup finals in 1958. What were the circumstances of their entry?",
      "options": [
        "They won a play-off match with Israel who were grouped with various Arab nations - none of whom would play them.",
        "Scotland dropped out due to financial pressures and Wales, being near neighbours, were invited to take their place.",
        "All the countries that applied to enter were allowed into the competition.",
        "They topped their qualifying group."
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This catcher for the 1983 Phillies wore uniform #6. He was killed by a satellite dish that fell on him.",
      "options": [
        "Darren Daulton",
        "Bo Diaz",
        "Luis Aguayo",
        "Ozzie Virgil"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The Eagles athletic teams represent which college/university?",
      "options": [
        "Yale",
        "University of Arizona",
        "Boston College",
        "University of Philadelphia"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Where is WWEs headquarters?",
      "options": [
        "Stamford, Connecticut",
        "New York, New York",
        "Hartford, Connecticut",
        "L.A., California"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Although he wasnt the best player on his college team, he became an All-Star player in his fifth season. Detroit Pistons drafted him in 1971.",
      "options": [
        "Roko Ukic",
        "Ben Gordon",
        "Jackson Vroman",
        "Curtis Rowe"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the second wrestler to become Mr. Money in the Bank?",
      "options": [
        "Snitsky",
        "RVD",
        "Mick Foley",
        "Edge"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Mad Hungarian was the nickname given to which of these ballplayers?",
      "options": [
        "Greg Maddux",
        "Al Hrabosky",
        "Rafael Furcal",
        "Rube Marquard"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Golfer Ernie Els has the same nickname as this city.",
      "options": [
        "Edmonton",
        "Exeter",
        "Tucson",
        "New Orleans"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What year was Tom Seaver elected to the Reds Hall of Fame?",
      "options": [
        "1998",
        "2004",
        "1999",
        "2006"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This teenager was the Mets starting shortstop in 1983.",
      "options": [
        "Kelvin Chapman",
        "Ron Gardenhire",
        "Jose Oquendo",
        "Wally Backman"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the winning pitcher in game five of the 1969 World Series, clinching the Series for the Mets?",
      "options": [
        "Gary Gentry",
        "Jerry Koosman",
        "Tug McGraw",
        "Tom Seaver"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This family has had three starting NFL quarterbacks who have won at least two Super Bowls in a row.",
      "options": [
        "Simms",
        "Griese",
        "Manning",
        "Hassellback"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these players was a pinch running specialist for the 1992 New York Mets?",
      "options": [
        "Joe Orsulak",
        "Rodney McCray",
        "Richie Ashburn",
        "Len Dykstra"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Already a permanent part of the American Basketball Association, the 3-point shot was instituted by the NBA in what year?",
      "options": [
        "1977",
        "1980",
        "1955",
        "1965"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Name the NBA Champions of 1991.",
      "options": [
        "Portland Trail Blazers",
        "Phoenix Suns",
        "Los Angeles Lakers",
        "Chicago Bulls"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Lets say you hit the ball so hard back to your opponent that it hits him in the chest. He does not hit the ball back. Who wins the point, and why?",
      "options": [
        "Your opponent wins the point because you engaged in unsportsmanlike conduct.",
        "You win the point because your opponent touched the ball with his body.",
        "You win the point because your opponent didnt hit the ball back to your side of the court.",
        "Your opponent wins the point because you used unnecessary force."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This figure skater made history in 1998 when he won his second Olympic Gold Medal with a different partner, who was going for her first Olympic Gold. Name the first man to win the Olympics twice with two different partners?",
      "options": [
        "Artur Dmitriev",
        "Maxim Marinin",
        "Alexei Tikhonov",
        "Anton Sikharulidze"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What college basketball team did Billy King, general manager of the Philadelphia 76ers, play for?",
      "options": [
        "Alabama",
        "Georgetown",
        "UCLA",
        "Duke"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which Chicago Cubs player won the MVP award in back to back seasons?",
      "options": [
        "Ernie Banks",
        "Sammy Sosa",
        "Andre Dawson",
        "Ryne Sandberg"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which college football team set the record for most consecutive wins, eventually losing to Notre Dame?",
      "options": [
        "Nebraska",
        "USC",
        "Army",
        "Oklahoma"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "A perfect game was pitched for the Philadelphia Phillies on June 21, 1964. What was extra special about this game?",
      "options": [
        "The wining pitcher later became a member of the US House of Representatives.",
        "It was the first time a lefty pitched a perfect game.",
        "Because of rain the game lasted over four hours.",
        "The losing team won the World Series that year."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which US team won the Little League World Series championship game in 1970?",
      "options": [
        "Wayne, N. J.",
        "St. Petersburg, FL.",
        "Gary, IN.",
        "Campbell, CA."
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What year was Tony Perez elected to the Reds Hall of Fame?",
      "options": [
        "1998",
        "1994",
        "1983",
        "1981"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first pitcher to win the Gold Glove Award 17 times?",
      "options": [
        "Bobby Shantz",
        "Bob Gibson",
        "Jim Kaat",
        "Greg Maddox"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In his career, Nolan Ryan had 5,714 strikeouts. How many of them came while he played with the Houston Astros?",
      "options": [
        "2745",
        "1866",
        "1296",
        "2000"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1984, who became the first American ever to win the all-around title at the Olympics?",
      "options": [
        "Carly Patterson",
        "Mary Lou Retton",
        "Bret Conor",
        "Paul Hamm"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what sport are the Arizona Diamondbacks team competing?",
      "options": [
        "Baseball",
        "Basketball",
        "Rugby",
        "Ice hockey"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "George Clooney tried to play this sport professionally when he was younger.",
      "options": [
        "Rugby",
        "Football",
        "Tennis",
        "Baseball"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what sport does the Portland Trail Blazers team from Oregon, USA, compete?",
      "options": [
        "Basketball",
        "Baseball",
        "Soccer",
        "Ice hockey"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "On July 28, 1994 a perfect game was pitched in Arlington, Texas. This time the Rangers beat the Angels. Who was the wining pitcher?",
      "options": [
        "Nolan Ryan",
        "Kenny Rogers",
        "Pedro Martinez",
        "Al Leiter"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Pete Rose was traded once in his career for which of these players?",
      "options": [
        "Bob Boone",
        "Tim Foli",
        "Tim Flannery",
        "Tom Lawless"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The 1985-86 Boston Celtics were on top of the world. There had just won their 16th NBA championship and their super star Larry Bird won the MVP. To make things even better, they drafted a young man in 1986 who was considered by many to be the future of the Celtics. Tragically, this young man died of a cocaine overdose just 48 hours after he was drafted. What was the name of this person whose death shocked the country?",
      "options": [
        "Jimmy Black",
        "Ralph Sampson",
        "Reggie Lewis",
        "Len Bias"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these schools is not a Div I or I-AA member in football?",
      "options": [
        "Boise State",
        "Montana",
        "Wyoming",
        "South Dakota U"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "After graduating college and before becoming a pro wrestler he worked as a junior high school substitute teacher.",
      "options": [
        "Kane",
        "Mick Foley",
        "Matt Striker",
        "Arn Anderson"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these baseball players did not lead the majors in home runs at least 3 consecutive years in a row?",
      "options": [
        "Hank Aaron",
        "Babe Ruth",
        "Ralph Kiner",
        "Mike Schmidt"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What member of the British royal family won a silver medal in the 2012 Summer Olympics?",
      "options": [
        "Prince Edward",
        "Zara Phillips",
        "Prince Harry",
        "Prince William"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The inaugural Canadian Grand Prix race (for F1 cars) was held at Mosport Park in Bowmanville, Ontario approximately 70 miles northeast of Toronto, in what year?",
      "options": [
        "1967",
        "1965",
        "1973",
        "1969"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When he was young, Anthony Quinn competed professionally in this sport.",
      "options": [
        "Bodybuilding",
        "Wrestling",
        "Boxing",
        "Weightlifting"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the movie Grown Ups when the guys were younger, they won a basketball championship in junior high school. What was their coachs name?",
      "options": [
        "Buzzer",
        "Crazy Eddie",
        "Mr. Drier",
        "Zeke"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How old was Travis Pastrana when he won his first X Games gold metal?",
      "options": [
        "22",
        "18",
        "13",
        "15"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When did the tragic fire that killed Kane and the Undertakers parents occur according to a WrestleMania storyline?",
      "options": [
        "November 8 1977",
        "November 9 1977",
        "November 7 1977",
        "November 6 1977"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This NHL player, known as Boom Boom, was credited with popularizing the slap shot. He was inducted into the Hockey Hall of Fame in 1972.",
      "options": [
        "Rod Gilbert",
        "Bobby Hull",
        "Bernie Geoffrion",
        "Frank Mahavolich"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This chess player, famous for his Anti-Semitism and his reclusiveness, became the first American to win the official world chess championship.",
      "options": [
        "Frank Marshall",
        "Paul Morphy",
        "Bobby Fischer",
        "William Steinitz"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who scored the game winning goal for the Detroit Red Wings in the 1950 Stanley Cup finals?",
      "options": [
        "Jimmy Skinner",
        "Tommy Ivan",
        "Metro Prystai",
        "Pete Babando"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What are the two main colors on the Steelers uniforms?",
      "options": [
        "black and red",
        "yellow and gray",
        "black and gold",
        "blue and red"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Romania is famous for its achievements in womens gymnastics. At the 1976 Olympic Games in Montreal this Romanian gymnast obtained the first 10 ever awarded in modern gymnastics.",
      "options": [
        "Lavinia Milosevici",
        "Emilia Eberle",
        "Teodora Ungureanu",
        "Nadia Comaneci"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This excellent amateur golfer who instituted his clambake at Rancho Santa Fe in San Diego died after a round of eighteen holes of golf in Madrid, Spain. His last words were reported as, That was a great game of golf, fellas.",
      "options": [
        "Bobby Jones",
        "Bing Crosby",
        "Bob Hope",
        "Francis Ouimet"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In January of 2006, Rene Inoue and John Baldwin, Jr. made history at the United States National Championships. What was their historic achievement?",
      "options": [
        "They invented a lift never done before.",
        "They became the first Japanese-Americans to win the National Championships.",
        "They successfully executed the first throw triple Axel.",
        "They successfully executed the first throw quadruple Salchow."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Unlike most NFL players, this great kicker was born in Fenstud, Norway. In Super Bowl IV, he kicked three field goals. Who was this soccer-style kicker?",
      "options": [
        "Morten Andersen",
        "George Blanda",
        "Gary Anderson",
        "Jan Stenerud"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which was the first professional baseball player to hit at least 24 home runs while a still teenager?",
      "options": [
        "Gil McDougald",
        "Ken Griffey, Jr.",
        "Mel Ott",
        "Tony Conigliaro"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 2002, this nation stunned some of soccers big names to reach the semi finals of the World Cup.",
      "options": [
        "Australia",
        "Cameroon",
        "Japan",
        "South Korea"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In the Iliad, Homer tells of a wrestling match between Odysseus and whom?",
      "options": [
        "Telamonian Ajax",
        "Achilles",
        "Priam",
        "Paris"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He is known as the owner of the Boston Red Sox and Roush Fenway Racing.",
      "options": [
        "Manny Ramirez",
        "Robert Kraft",
        "Brian Roberts",
        "John Henry"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1942 Yogi Berra was not signed by the team he wanted to play for. Which team was his first choice?",
      "options": [
        "The Brooklyn Dodgers",
        "The St. Louis Cardinals",
        "The New York Yankees",
        "The New York Mets"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Whhich is the official bank of the NFL and Major League Baseball?",
      "options": [
        "Bank of America",
        "Chase Manhattan Bank",
        "Grand Caymans National Bank",
        "CitiCorp"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What decade witnessed the publishing of Charles Darwins The Origin of Species, and the first official game of baseball?",
      "options": [
        "1790s",
        "1850s",
        "1800s",
        "1890s"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the winner of the WWF champion vs. the NWA champion match in 1980?",
      "options": [
        "Dusty Rhodes",
        "Harley Race",
        "Bob Backlund",
        "Ric Flair"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who has managed the wrestlers Chris Jericho, the Undertaker, Ice Train, Jazz, Sid Vicious and Too Cold Scorpio?",
      "options": [
        "Teddy Long",
        "Michael Hayes",
        "Paul Heyman",
        "Stephen Pritchard"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which one of his boxing opponents did Muhammad Ali label The Washer Woman?",
      "options": [
        "Zora Folley",
        "Clevland Williams",
        "George Chuvalo",
        "Ernie Terrell"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This former University of Southern California Trojans player became an All-Star offensive tackle in the old AFL.",
      "options": [
        "Jack Del Rio",
        "Ron Mix",
        "Lynn Swann",
        "Jeff Fisher"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In racquetball a player must win by at least how many points?",
      "options": [
        "3",
        "1",
        "4",
        "2"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The Philadelphia Phillies gave up on this Hall of Famer after just 13 games, trading him to the Chicago Cubs for Ivan DeJesus.",
      "options": [
        "Billy Williams",
        "Ryne Sandberg",
        "Scott Rolen",
        "Ron Cey"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is a Hungarian soccer club?",
      "options": [
        "FC Haka",
        "FC Sopron",
        "FC Ashdod",
        "SCR Altach"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This former American football player, who played for the Atlanta Falcons and Washington Redskins, won the 1971 Heisman Trophy.",
      "options": [
        "Pat Sullivan",
        "Archie Manning",
        "Joe Cribbs",
        "Jay Barker"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What NBA team is known for their cowbells?",
      "options": [
        "San Antonio Spurs",
        "Portland Trail Blazers",
        "Sacramento Kings",
        "Atlanta Hawks"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "On May 26, 1959 this pitcher pitched 12 perfect innings.",
      "options": [
        "Warren Sphan",
        "Don Drysdale",
        "Bob Gibson",
        "Harvey Haddix"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The first world champion, Steinitz lost many games against this opening which involves the moves 1 P-K4 P-K4 2 N-KB3 N-QB3 3 B-B4 B-B4 4 P-QN4.",
      "options": [
        "Benko Gambit",
        "Wing Gambit",
        "Trompowsky Attack",
        "Evans Gambit"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the nickname of the University of Pennsylvania?",
      "options": [
        "Quakers",
        "Wildcats",
        "Lions",
        "Owls"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How many wins did Tom Seaver accumulate in 1969?",
      "options": [
        "25",
        "27",
        "22",
        "19"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Despite losing the 1950 World series in four straight games, this baseball team was nicknamed The Whiz Kids.",
      "options": [
        "Braves",
        "Phillies",
        "Dodgers",
        "Cubs"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This former pro wrestler made news headlines in 2004 for causing an anthrax scare at Bostons Downtown Crossing MBTA station.",
      "options": [
        "Brutus The Barber Beefcake",
        "Jake The Snake Roberts",
        "Ken Patera",
        "Macho Man Randy Savage"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "According to the official classification, which country won the medal count at the Olympic Games held in Beijing?",
      "options": [
        "Russia",
        "China",
        "USA",
        "Germany"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The 2006-2007 NHL Stanley Cup Finals were won by this team.",
      "options": [
        "Phoenix Coyotes",
        "Anaheim Ducks",
        "Detroit Red Wings",
        "Ottawa Senators"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In 1978, Sir Bobby Robson wins his first FA Cup trophy as a manager of this team.",
      "options": [
        "Ipswich Town",
        "Derby County",
        "Newcastle United",
        "Portsmouth"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the wrestler that knocked Lilian Garcia off the ring apron during the 5th edition of RAW?",
      "options": [
        "Shelton Benjamin",
        "Kane",
        "Johnny Nitro",
        "Charlie Haas"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which boxer became the youngest world champion in 1976?",
      "options": [
        "Roberto Duran",
        "Sugar Ray Leonard",
        "Carlos Palomino",
        "Wilfredo Benitez"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "How many lines are on a standard tennis court?",
      "options": [
        "10",
        "9",
        "15",
        "5"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In 2003, this former football player became head coach at the University of Alabama, replacing Mike Price.",
      "options": [
        "Mike Shula",
        "Michael Gibbs",
        "Mike Anderson",
        "Mike Bowden"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was John Oleruds batting average when he won the batting title in 1993?",
      "options": [
        ".375",
        ".358",
        ".363",
        ".380"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "These were the first two men to win the Triple Crown twice each.",
      "options": [
        "Rogers Hornsby and Ted Williams",
        "Frank Robinson and Mickey Mantle",
        "Ted Williams and Frank Robinson",
        "Rogers Hornsby and Ducky Duffy"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "At the World Cup in 1982, this player was involved in a controversial incident in his countrys semi-final victory.",
      "options": [
        "Paolo Rossi",
        "Micelle Platini",
        "Marco Materazzi",
        "Harald Schumacher"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player, nicknamed Baby Bull, made his debut on April 15, 1958 hitting a home run against the L.A. Dodgers. He hit 379 home runs over a seventeen-year career and was the national League MVP in 1967.",
      "options": [
        "Orlando Cepeda",
        "Bobby Bonds",
        "Danny Tartabull",
        "Wes Westrum"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the home run record until 1879?",
      "options": [
        "4",
        "5",
        "2",
        "10"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In which of these major American sports does Detroit have a professional team?",
      "options": [
        "Basketball and Baseball",
        "All of these",
        "Baseball and Ice Hockey",
        "Basketball, Baseball and American Football"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "As of 2007, when was the last time the Chicago Cubs won the World Series of baseball?",
      "options": [
        "1908",
        "2005",
        "1906",
        "1945"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "On September 17, 1948 Greenbay played Boston in an NFL game. What was the significance of the game?",
      "options": [
        "It was the first time a penalty flag was thrown.",
        "It was the first NFL game to be on radio.",
        "It was the first time a NFL game that went into overtime.",
        "It was the first time an interception was returned for a touchdown."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "He is the youngest NBA player to score 10,000 points.",
      "options": [
        "Spud Webb",
        "Michael Jordon",
        "Moses Malone",
        "Kobe Bryant"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This man was the head coach of the Pittsburgh Steelers from 1969 through 1991.",
      "options": [
        "Chuck Knoks",
        "Chuck Knoll",
        "Chuck Nocks",
        "Chuck Noll"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What astronomical event was visible the night the Red Sox completed the World Series sweep against the Cardinals?",
      "options": [
        "Lunar eclipse",
        "Perseid meteor shower",
        "Aurora Borealis",
        "Hale-Bopp comet"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Actor Craig T. Nelson played the Coach on the show of the same name. What was the coachs name?",
      "options": [
        "Hitch Fox",
        "Gil Again",
        "Harvey Fox",
        "Hayden Fox"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the Cleveland Browns win their first NFL Championships?",
      "options": [
        "1955",
        "1964",
        "1954",
        "1950"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these movies features Atlanta Motor Speedway?",
      "options": [
        "Dale",
        "Smokey and the Bandit II",
        "Three",
        "The Ride of Their Lives"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Three of these MLB players have hit a home run in at least 8 consecutive games. Which of the listed players did not accomplish this feat?",
      "options": [
        "Don Mattingly",
        "Robin Ventura",
        "Ken Griffey Jr.",
        "Dale Long"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "With whom of these tennis players has Martina Navratilova not won a Wimbledon Ladies doubles title?",
      "options": [
        "Chris Evert",
        "Billie Jean King",
        "Pam Shriver",
        "Gigi Fernandez"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Before the Bobcats, what NBA team played in Charlotte?",
      "options": [
        "New Orleans Hornets",
        "Dallas Mavericks",
        "New York Knicks",
        "Miami Heat"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the nickname of the Italian football club Napoli?",
      "options": [
        "Horse",
        "Rooster",
        "Donkey",
        "Ram"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 2005 Reggie Bush from the Southern California Trojans won what individual award?",
      "options": [
        "Heisman Trophy",
        "Maxwell Award",
        "Dick Butkus Award",
        "Walter Camp Award"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the first baseball player to have his uniform number retired?",
      "options": [
        "Babe Ruth",
        "Miller Huggins",
        "Joe Dimaggio",
        "Lou Gehrig"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which college has the team nicknamed The Sooners?",
      "options": [
        "Purdue",
        "San Diego State",
        "Oklahoma",
        "Florida"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "When did the Pittsburgh Pirates win the World Series?",
      "options": [
        "1962",
        "1961",
        "1963",
        "1960"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who is the only slugger in the following list that has had a 50+ home run season?",
      "options": [
        "Jay Buhner",
        "Mo Vaughn",
        "Frank Thomas",
        "Andruw Jones"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Upon the conclusion of the 2007 season, who held the Major League Baseball rookie record for most home runs hit in a season?",
      "options": [
        "Ryan Howard",
        "Alex Rodriguez",
        "Mark McGwire",
        "Cecil Fielder"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What was the first womens title change at SummerSlam?",
      "options": [
        "Melina Vs Mickie James",
        "Alundra Blayze Vs Bertha Faye",
        "Trish Stratus Vs Lita",
        "Fabulous Moohlah Vs Wendi Richter"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What former Utah Jazz player set an NBA record for assists in a career?",
      "options": [
        "Magic Johnson",
        "Moe Cheeks",
        "Mark Johnson",
        "John Stockton"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is the only Major League Baseball team Bob Gibson played for?",
      "options": [
        "Dodgers",
        "Yankees",
        "Rockies",
        "Cardinals"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "He was the first person to hold the worlds record for running 50 yards, 75 yards and 100 yards backwards.",
      "options": [
        "Bob Hayes",
        "Jim Thorpe",
        "R.P. Williams",
        "Bill Robinson"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who became the first wrestler to win a gold medal in three different Olympics?",
      "options": [
        "Dan Saunderson",
        "Chris Taylor",
        "Aleksandr Medved",
        "Dan Gable"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "He founded \u201eLittle Caesars Pizza\u201d in 1959. He is the owner of the Detroit Red Wings of the NHL and the Detroit Tigers of Major League Baseball. Who i sthies person?",
      "options": [
        "Kenneth Richards",
        "Pat Bowlen",
        "William Clay Ford, Jr.",
        "Mike Ilitch"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which NBA star was charged with sexual assault on a 19-year old hotel employee in the summer of 2003?",
      "options": [
        "Kobe Bryant",
        "Sam Cassell",
        "Jason Caffey",
        "Gary Payton"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who did New England Patriots play against in their second Super Bowl appearance?",
      "options": [
        "the Cowboys",
        "the Packers",
        "the 49ers",
        "the Rams"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This Pittsburgh Penguin became the first player/owner in NHL history in the year 2000.",
      "options": [
        "Scotty Bowman",
        "Mario Lemieux",
        "Ron Francis",
        "Jaromir Jagr"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which one of these players did NOT hit a walk-off home run in a World Series game?",
      "options": [
        "Carlton Fisk",
        "Joe Carter",
        "Bobby Thomson",
        "Bill Mazeroski"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In its very first year, 1877, Wimbledon began with 22 contestants, competing for this title.",
      "options": [
        "Mens doubles title",
        "Mens singles title",
        "Ladies doubles title",
        "Ladies singles title"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This former professional wrestler introduced the Undertaker to the WWF at the 1990 Survivor Series.",
      "options": [
        "Captain Lou Albano",
        "Paul Bearer",
        "Slick",
        "Ted Million Dollar Man Dibiase"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Babe Ruth had many nicknames such as The Babe, The Bambino, The Sultan of Swat. Can you pick out another one of his nicknames?",
      "options": [
        "The Clout Master",
        "The Strongman of Clout",
        "The Wizard of Clout",
        "The Colossus of Clout"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Boston Celtics were the dominant professional basketball team in the 1950s. Which one of these never played for the Celtics in the 1950s?",
      "options": [
        "Walter Dukes",
        "K.C. Jones",
        "Frank Ramsey",
        "Jack Nichols"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "He was a great silent screen star. He was well known as the best pie thrower in the movies. He was a great athlete and did almost all of his own stunts. He was famous for rarely showing emotion in his face. Who was he?",
      "options": [
        "Joseph Schenck",
        "Buster Keaton",
        "Charlie Chaplin",
        "Fatty Arbuckle"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The 1918 regular baseball season was shortened because of World War I. What happened in the 1918 World Series, played in September?",
      "options": [
        "The Chicago Cubs were accused of throwing the game to the Boston Red Sox.",
        "The Chicago White Sox were accused of throwing the series.",
        "It was the first World Series that was a best 4 out of 7 series of games.",
        "The Star Spangled Banner was sung for the first time at a sporting event."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following Major League players has NOT had multiple seasons in which he hit 50 or more home runs?",
      "options": [
        "Ken Griffey Jr.",
        "Jimmie Foxx",
        "Micky Mantle",
        "Lou Gehrig"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following is one of Nicaraguas boxing world champions?",
      "options": [
        "Vicente Padilla",
        "Alexis Arguello",
        "Tito Trinidad",
        "Dennis Martinez"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The Fischer Defense to the Kings Gambit involves which of the following moves by black?",
      "options": [
        "B-QB4, N-KB3, N-QB3",
        "P-Q4, N-KB3, and in some cases QxP",
        "P-Q3, P-KN4, P-KR3, B-KN2",
        "N-KB3, Q-K2, P-Q3, N-Q2"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1965, I became the first British soccer player to be knighted. Who am I?",
      "options": [
        "Pele",
        "Jamaal Lewis",
        "Stanley Matthews",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Pole vaulting, an athletics jumping discipline event, in which competitors use a long, flexible pole to leap over a bar, is under what number in the decathlon order?",
      "options": [
        "Four",
        "Nine",
        "Eight",
        "Three"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who won the fight referred to as The Thrilla in Manila?",
      "options": [
        "Ali won on points",
        "Ali knocked out Frazier after 14 rounds.",
        "Ali won by a technical knock out after 14 rounds.",
        "Ali knocked out Frazier in the final round."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Brad Miller of the Sacramento Kings played basketball at what Big Ten University?",
      "options": [
        "Penn State",
        "Purdue",
        "Michigan State",
        "Wisconsin"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How did Lawrence Peter Berra get the nickname Yogi?",
      "options": [
        "It is short for an affectionate Italian expression.",
        "He licked yogurt.",
        "It was the name of a popular cartoon character.",
        "He looked like a character in a movie."
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "If you are diving and begin to choke, what should you do?",
      "options": [
        "Take off your regulator and cough.",
        "Hold your breath and swim to the surface immediately.",
        "Swim to the surface immediately, exhaling as you go.",
        "Cough into the regulator."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "How many points did the rookie Teemu Selanne get in the 1992-1993 season?",
      "options": [
        "132",
        "120",
        "128",
        "136"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Where did Chicago Bears defensive lineman, William Fridge Perry, play college football?",
      "options": [
        "Georgia",
        "Eastern Carolina",
        "South Carolina AT",
        "Clemson"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Where did Scottie Pippen play college basketball?",
      "options": [
        "SE Oklahoma",
        "Central Arkansas",
        "Texas Tech",
        "Southern Mississippi"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This wrestlers father is a former National Hockey League forward.",
      "options": [
        "Rick Martel",
        "Chris Jericho",
        "Edge",
        "Christian"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "In which year was the Association of Tennis Professionals (ATP) formed?",
      "options": [
        "1960",
        "1983",
        "1972",
        "1951"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "How many times has SummerSlam been in New York City, at Madison Square Garden?",
      "options": [
        "1",
        "0",
        "At least 3",
        "2"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "On which hill does the World Cup ski jumping season traditionally end?",
      "options": [
        "Letalnica (formerly Velikanka) in Planica, Slovenia",
        "Hollmenkollen in Oslo, Norway",
        "Gross Olympiaschanze in Garmisch-Partenkirchen, Germany",
        "Wielka Krokiew in Zakopane, Poland"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This player was 30 years old when he broke into the big leagues on September 14, 2003, with the New York Mets.",
      "options": [
        "Tommie Aaron",
        "Dale Berra",
        "Mike Glavine",
        "Tony Piazza"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which two teams played in the first NBA game in 1946?",
      "options": [
        "New York Knicks and Boston Celtics",
        "New York Knicks and Toronto Huskies",
        "Philidelphia Warrior and New York Knicks",
        "Boston Celtics and Toronto Huskies"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "People Magazine named a 2007 Star of the Year. This star is the new face of Versace, plays around with a Grand-Am race car and became the father of two. Who is this Prince Charming?",
      "options": [
        "Johnny Depp",
        "Tiger Woods",
        "Brad Pitt",
        "Patrick Dempsey"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Joe Morgan became an instant star when he was traded to the Reds. What was his position?",
      "options": [
        "Third Base",
        "Catcher",
        "Second Base",
        "Center Field"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Since the beginning of the NCAA Mens Basketball tournament until 2009, what team had the most tournament appearances without ever having gone to the Championship game?",
      "options": [
        "BYU",
        "Texas Tech",
        "Yale",
        "Missouri"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Pittsburgh Pirates moved from Three Rivers Stadium to this ball park at the start of the 2001 season.",
      "options": [
        "Willie Stargell Stadium",
        "Federal Field",
        "PNC Park",
        "Forbes Field"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "I played for the national team of West Germany from 1965-1977. I went on to become national team manager and led our team to the World Cup finals in 1990 and 1986. Who am I?",
      "options": [
        "Ruud Gullit",
        "Johan Cruyff",
        "Marco Van Basten",
        "Franz Beckenbauer"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first Major Leaguer to win the All-Star Game MVP Award?",
      "options": [
        "Maury Wills",
        "Mickey Mantle",
        "Babe Ruth",
        "Jimmie Foxx"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Detroit is the capital of the US automotive industry. The Detroit basketball team is named after what car parts?",
      "options": [
        "Wheels",
        "Brakes",
        "Cylinders",
        "Pistons"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "While surfing the Internet you may be using Cisco networking equipment without even knowing it. But do you know the origin of the name Cisco?",
      "options": [
        "The founders were named Alain CISse and Erwin COfalka",
        "The founders where from Colorado, Indiana, South Carolina and Oregon",
        "It stands for Communication and Information Systems COrporation",
        "It was named for San FranCISCO"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What does the abbreviation L.B.W stand for in cricket?",
      "options": [
        "Luck Beyond Wonder",
        "Last Ball Went",
        "Leg Before Wicket",
        "Lost Behind Winner"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "On June 22, 1938 a famous boxing match was held in Yakee Stadium. Who lost?",
      "options": [
        "Max Schmelling",
        "Joe Louis",
        "Max Baer",
        "Jack Demosey"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who returned at Survivor Series 2007 after a 4-month absence?",
      "options": [
        "Edge",
        "Big Show",
        "Triple H",
        "John Cena"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What university did Bob Gibson attend?",
      "options": [
        "University of Kansas",
        "University of Colorado",
        "Creighton University",
        "University of Missouri"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 1945 catcher Harry ONeill was killed on Iwo Jima. In 1979 catcher Thurmond Munson died in a plane crash. How did catcher Bo Diaz die in 1990?",
      "options": [
        "Crushed by a cable TV dish",
        "Fishing boat accident",
        "Drowned in his bath tub",
        "Hunting accident"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year were the Olympic Games held in Tokyo?",
      "options": [
        "1996",
        "1948",
        "1936",
        "1964"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which baseball commissioner was widely criticized for refusing to cancel games following the assassinations of Martin Luther King and Robert Kennedy?",
      "options": [
        "Ford C. Frick",
        "A.B. Happy Chandler",
        "Lt. Gen. William D. Eckert",
        "Bowie K. Kuhn"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Until 2008, only three Spanish players made it to the finals of the US Open. Manuel Santana and Manuel Orantes lifted the trophy in 1965 and 1975, respectively. Who stayed runner-up in the 2003 final?",
      "options": [
        "Tommy Robredo",
        "Juan Carlos Ferrero",
        "Carlos Moya",
        "Rafael Nadal"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What NFL football team won the first two Super Bowls in a row?",
      "options": [
        "Carolina Panthers",
        "Green Bay Packers",
        "Atlanta Falcons",
        "New England Patriots"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What city hosted the Olympics in 1994, only two years after the previous games were held?",
      "options": [
        "Lillehammer",
        "Atlanta",
        "Barcelona",
        "Albertville"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the real name of the professional wrestler known as the Boogeyman?",
      "options": [
        "James Gibson",
        "Cliff Compton",
        "Martin Wright",
        "Brian Myers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The first All Star games of baseball were played in Chicago but at which ball park and in what year?",
      "options": [
        "Comiskey Park, 1933",
        "Comiskey Park, 1935",
        "Wrigley Field, 1933",
        "Wrigley Field, 1935"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "There is some debate as to which city was the first to serve hot dogs at baseball games, but it seems that one of these two cities was the first.",
      "options": [
        "St. Louis or New York",
        "Cincinnati or New York",
        "St. Louis or Chicago",
        "Chicago or Cincinnati"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first catcher to catch 4 no-hitters in his career?",
      "options": [
        "Ray Schalk",
        "Jorge Posada",
        "Johnny Bench",
        "Bill Dickey"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "2005 featured one of the most moving Super Bowl commercials ever aired. The only sound heard is the background noise of an airport terminal until you hear one person starting to clap their hands. Others start to clap until the entire waiting room is filled with the sounds of clapping hands. Who was passing by the crowd in this scene of the Super Bowl commercial?",
      "options": [
        "Fireman",
        "Desert Storm Soldiers",
        "George W. Bush",
        "Ali"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "During the 2000 NFL Playoffs, this coach of the Baltimore Ravens banned his players from using the word playoffs and had them use the word Festivus instead.",
      "options": [
        "Bill Parcells",
        "Brian Billick",
        "Jim Mora",
        "Pete Carroll"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This winter sport is the second fastest non-motorized sport on Earth, after speed skydiving.",
      "options": [
        "Bobsleigh",
        "Speed skating",
        "Freestyle skiing",
        "Speed skiing"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In which of these years did The Miami Hurricanes not win a national title in football?",
      "options": [
        "2000",
        "1983",
        "1991",
        "1987"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This basketball player, who played for the Harlem Globetrotters, had amazing ball-handing abilities -- he would often dribble long enough for other players to rest.",
      "options": [
        "Darren McCune",
        "Marques Haynes",
        "Bill The Hill McGill",
        "Larry Big Hands Culpepper"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where is race car driver Ryan Newman originally from?",
      "options": [
        "Louisville, KY",
        "South Bend, IN",
        "St. Louis, MO",
        "Indianapolis, IN"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 1960, the New York Yankees set a record for having three catchers each of whom hit at least twenty home runs. Who were they?",
      "options": [
        "Yogi Berra, Elston Howard, Thurmon Munson",
        "Yogi Berra, Elston Howard, Hank Bauer",
        "Yogi Berra, Elston Howard, Johnny Blanchard",
        "Yogi Berra, Sammy White, Elston Howard"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who set an NFL record for most consecutive seasons (1963-1965) leading the league in completions?",
      "options": [
        "Len Dawson",
        "Rick Mirer",
        "George Blanda",
        "John Elway"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Where were the summer Olympics held in 1992, when a black African woman won a gold medal for the first time?",
      "options": [
        "Sydney",
        "Amsterdam",
        "Barcelona",
        "Los Angeles"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This former American football wide receiver, nicknamed Bambi, was inducted into the Pro Football Hall of Fame in 1978.",
      "options": [
        "Don Hutson",
        "Lance Alworth",
        "Bobby Mitchell",
        "Charlie Joiner"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who won the Little League World Series in 1998?",
      "options": [
        "Toms River, N.J.",
        "David, Panama",
        "Tainan, Taiwan",
        "Osaka, Japan"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which of these soccer players is popular not only on the soccerfield, but in the fashion circles, too?",
      "options": [
        "Pele",
        "Maradona",
        "David Beckham",
        "Lev Yashin"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which team did the 2006 Chargers shut out on the road on Monday night by the score of 27-0?",
      "options": [
        "Oakland Raiders",
        "Kansas City Chiefs",
        "Pittsburgh Steelers",
        "Tennessee Titans"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Games 4 and 5 of the 2004 American League Championship Series were dramatic extra-inning victories for the Red Sox. How many total innings were played in those two games?",
      "options": [
        "26",
        "24",
        "23",
        "25"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these pitchers has won a Cy Young Award in 2004, while playing for the Houston Astros?",
      "options": [
        "None of these",
        "Eric Gagne",
        "Randy Johnson",
        "Roger Clemens"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which two wrestlers helped Yokozuna retain the WWE Championship in the first ever casket match.",
      "options": [
        "Jeff Jarrett and Diesel",
        "Matt and Jeff Hardy",
        "Vince and Shane McMahon",
        "Kane and Big Show"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who led the 2004 Red Sox regular season in number of stolen bases?",
      "options": [
        "Jason Varitek",
        "Mark Bellhorn",
        "Pokey Reese",
        "Johnny Damon"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is not one of the colors for the Atlanta Braves team uniforms?",
      "options": [
        "White",
        "Green",
        "Blue",
        "Red"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This classy left-hander, known as Lefty, was a ten-time All-Star and winner of four Cy Young Awards.",
      "options": [
        "Randy Jones",
        "Whitey Ford",
        "Warren Spahn",
        "Steve Carlton"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who did LSU hire as Defensive Coordinator before the start of the 2005 season?",
      "options": [
        "Bo Pelini",
        "Doug Mallory",
        "Stacy Searels",
        "Jimbo Fisher"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "From 1983-1998 John Elway was the starting quarterback for which team?",
      "options": [
        "Broncos",
        "Rams",
        "Packers",
        "Jets"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which statement regarding the 1959 season is false?",
      "options": [
        "The American League lost the All-Star Game on July 7 5 to 4.",
        "Orlando Cepeda and Stan Musial were the starting All-Star first basemen.",
        "Frank Robinson was the American League manager.",
        "The National League lost the All Star Game on August 3 5 to 3."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Many major league baseball players are from the Dominican Republic. Who was the first major leaguer from the Dominican Republic?",
      "options": [
        "Ozzie Virgil",
        "Rodrico Humberro",
        "Umberto Pena",
        "Chico Fernandez"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Approximately how many people claimed to regularly practice Pilates in the United States according to a 2008 survey?",
      "options": [
        "3,500,000",
        "500,000",
        "10,000,000",
        "12,000"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 2009, New York Rangers defenseman Michal Rozs\u00edval switched to this number.",
      "options": [
        "76",
        "3",
        "33",
        "19"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "All good things must come to an end; which title and what year did John McEnroe win his last grand slam?",
      "options": [
        "US Open, 1985",
        "Australian Open, 1986",
        "US Open, 1984",
        "Wimbledon, 1985"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "It is the 1954 Cotton Bowl between Rice and Alabama. Rices All-American running back, Dicky Moegle, is leading his team to a crushing of the Bart Starr led Alabama team. On one run, he was stopped on his own 35 yard line, where he was tackled. The referee blew his whistle and awarded a touchdown. Why ?",
      "options": [
        "He flipped the ball to another player who scored",
        "He was tackled by Tommy Lewis",
        "He ran the wrong way",
        "The referee made a mistake on a penalty"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "When did Muhammad Ali defeat Sonny Liston to win the World Heavyweight Championship?",
      "options": [
        "October 1964",
        "May 1964",
        "February 1964",
        "December 1963"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of the professional wrestling tag team consisting of The Undertaker and Kane?",
      "options": [
        "The Brothers of Destruction",
        "The Brothers of Damage",
        "The Brothers of Pain",
        "The Brothers of Death"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Imaginary Dead Baseball Players Live in My Cornfield is the Chinese title of this movie.",
      "options": [
        "The Perfect Game",
        "North by Northwest",
        "Field of Dreams",
        "The Wizard of Oz"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When did the Oakland Athletics win their first of three consecutive World Series?",
      "options": [
        "1970",
        "1969",
        "1972",
        "1971"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Carl Michael Yastrzemski, who played his entire career with the Boston Red Sox, was best known for what nickname?",
      "options": [
        "King",
        "Mr. April",
        "Rovin Carl",
        "Yaz"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is UNC Wilmingtons nickname?",
      "options": [
        "Seahawks",
        "Wolfpack",
        "Rams",
        "Tribe"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The International Olympic Committee, created in June of 1894 to revive the Olympic Games, is the supreme authority of the Olympic Movement. It is based in which city?",
      "options": [
        "Lausanne",
        "Paris",
        "Davos",
        "Geneva"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Hulk Hogan had two title defences on Saturday Nights Main Event in 1985. Which of the listed wrestlers was one of his opponents?",
      "options": [
        "Cowboy Bob Orton",
        "Mr. Wonderful",
        "Roddy Piper",
        "Big John Studd"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "On September 9, 1965, this Hall of Fame Pitcher threw a perfect game against the Chicago Cubs. Who was he and what team did he pitch for?",
      "options": [
        "Don Drysdale, Brooklyn Dodgers",
        "Sandy Koufax, Brooklyn Dodgers",
        "Sandy Koufax, L.A. Dodgers",
        "Don Drysdale, L.A. Dodgers"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This baseball Hall Of Fame shortstop starred for the Dodgers in the 1950s.",
      "options": [
        "Amos Otis",
        "Dave Concepcion",
        "Tony Kubek",
        "Pee Wee Reese"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Bobby Fischer was a member of this church/denomination.",
      "options": [
        "Unitarian Universalist",
        "Worldwide Church of God",
        "First United Methodist",
        "Jehovahs Witnesses"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In butterfly swimming, how must the athlete finish the race to have a valid result?",
      "options": [
        "By touching the pools ending wall with his/her feet",
        "By touching the pools ending wall with both hands simultaneously",
        "By stepping out of the pool",
        "By touching the pools ending wall with with one hand only"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Originally drafted by the Detroit Tigers, this baseman joined the New York Mets in 1997 just for one game.",
      "options": [
        "Joe Morgan",
        "Kevin Morgan",
        "Aurelio Rodriguez",
        "Howard Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what sport do the Atlanta Hawks team from Georgia, USA compete?",
      "options": [
        "Basketball",
        "Baseball",
        "Hockey",
        "Soccer"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What New England Patriots player was named AP Defensive Rookie of the Year for 2008?",
      "options": [
        "Vince Wilfork",
        "Jerod Mayo",
        "Terry Glenn",
        "Logan Mankins"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This first baseman, known as Stretch, played 22 seasons of Major League baseball.",
      "options": [
        "Jim Gentile",
        "Lou Whittaker",
        "Cecil Fielder",
        "Willie McCovey"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The first days of the 2008 Olympic Games were held in the shadow of a military confrontation between Georgia and Russia. In which event did both countries representatives win medals and embraced on the podium?",
      "options": [
        "Shooting - 10m air pistol, women",
        "Athletics - shot put, women",
        "Judo - 66kg, men",
        "Weightlifting - 48kg, men"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which player of the the St. Louis Cardinals set a major league record by hitting two grand slams in a single inning against the Los Angeles Dodgers?",
      "options": [
        "Fernando Tatis",
        "Mike Shannon",
        "Ken Boyer",
        "Terry Pendleton"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In which city does the Australian Open take place?",
      "options": [
        "Canberra",
        "Adelaide",
        "Sydney",
        "Melbourne"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In 1992, 1984, and 2005, who was Penn State Nittany Lions football teams head coach?",
      "options": [
        "Joe Paterno",
        "Galen Hall",
        "Tim Curley",
        "Rip Engle"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "According to the official rules of the United States Racquetball Association a match may be forfeited by the referee in which of the following cases?",
      "options": [
        "Any player leaves the court without permission of the referee during a game",
        "Any player for a singles match, or any team for a doubles match, fails to report to play. Normally, 20 minutes from the scheduled game time will be allowed before forfeiture.",
        "All of these",
        "Any player refuses to abide by the referees decision, or engages in unsportsmanlike conduct."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Marilyn Monroe married this famous baseball star in January 1954, after a two-year courtship.",
      "options": [
        "Frank Sinatra",
        "Tom Ewell",
        "Joe DiMaggio",
        "Dean Martin"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In what sport is the Mississippi Braves team competing?",
      "options": [
        "Soccer",
        "Rugby",
        "Baseball",
        "Hockey"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who broke Hank Aarons career home run record?",
      "options": [
        "Barry Bonds",
        "Larry Bonds",
        "Binny Jane",
        "Boe Jinards"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This person, who coached at Michigan State from 1954-1972, said Football is not a contact sport - it is a collision sport. Dancing is a contact sport.",
      "options": [
        "Wayne Hardin",
        "Bo Shembechler",
        "Jerry Doak Walker",
        "Duffy Daugherty"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Every summer, a special basketball tournament is held in Harlem, NY. What is the original name of the tournament?",
      "options": [
        "The Harlem Five on Five",
        "The Holcombe Tournament",
        "The Entertainers Basketball Classic",
        "The Rucker Tournament"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Schwingen is considered a national sport in this country and takes this form.",
      "options": [
        "Germany - grappling",
        "Austria - grappling without touching the legs",
        "Germany - grappling with swords",
        "Switzerland - grappling"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This legendary Green Bay Packers head coach, inducted into the Pro Football Hall of Fame in 1971, had the following maxim: Winning isnt everything; its the only thing.",
      "options": [
        "Tom Landry",
        "Bill Parcells",
        "Vince Lombardi",
        "Chuck Noll"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which driver swept both races at Pocono in 2006, winning also both poles?",
      "options": [
        "J.J. Yeley",
        "Clint Bowyer",
        "Martin Truex, Jr.",
        "Denny Hamlin"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Chicago Bulls drafted this player in 1984, who is probably the best in the NBA ever. He played his final game on April 16, 2003.",
      "options": [
        "Michael Jordan",
        "Magic Johnson",
        "Shaquille ONeal",
        "Kevin Garnett"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This baseball player appeared in 14 World Series, won the American League MVP Award three times and was elected to the Hall of Fame in 1972. His given name is Lawrence Peter but hes better known under what nickname?",
      "options": [
        "Dutch",
        "Larry",
        "Yogi",
        "L.P."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "How many countries were represented by athletes of Chinese origin at the 2008 Olympic Games table tennis competitions?",
      "options": [
        "21",
        "13",
        "2",
        "7"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the last triple crown winner of the 20th century?",
      "options": [
        "Mickey Mantle",
        "Carl Yastremski",
        "Frank Robinson",
        "Ted Williams"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who won the 2008 Royal Rumble?",
      "options": [
        "John Cena",
        "Batista",
        "Shawn Michaels",
        "HHH"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Larry Bird wore which Boston Celtics number that was retired February 4, 1993?",
      "options": [
        "12",
        "10",
        "23",
        "33"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "How many fouls are there in the fictional sport Quidditch?",
      "options": [
        "500",
        "700",
        "300",
        "900"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What team did the Minnesota Vikings lose to in Super Bowl VIII?",
      "options": [
        "Dallas Cowboys",
        "Pittsburgh Steelers",
        "Miami Dolphins",
        "Green Bay Packers"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which of these sports can a father be a mudder, as explained to Costello by Abbott in one of their comedy routines?",
      "options": [
        "polo",
        "wrestling",
        "golf",
        "horse racing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Martin Broduer started his professional career with this ice hockey team.",
      "options": [
        "Pittsburgh Penguins",
        "New Jersey Devils",
        "New York Islander",
        "New York Rangers"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following is not one of Gilbert Arenas nicknames?",
      "options": [
        "G.A.",
        "The Assassin",
        "Gilly-Willy",
        "Agent Zero"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Joe DiMaggio had two brothers who played in the baseball major leagues. One was Dom or Dominick. What was the name of his other brother?",
      "options": [
        "Vance",
        "Denny",
        "Vince",
        "Jim"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who is considered the first modern heavyweight boxing champion?",
      "options": [
        "Bob Fotzsimmons",
        "John L. Sullivan",
        "Jimmy Ellis",
        "James J. Corbett"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who were the only two players on the Red Sox 2004 World Series roster who already had World Series rings?",
      "options": [
        "Keith Foulke and Mike Timlin",
        "Dave Roberts and Keith Foulke",
        "Mike Timlin and Curt Schilling",
        "Curt Schilling and Ramiro Mendoza"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1996 this Michael was chosen as one of the 50 greatest players of all time and then in 1999 ESPN voted him as the greatest athlete of the twentieth century.",
      "options": [
        "Michael Owen",
        "Mike Tyson",
        "Michael Jordan",
        "Michael Brashnikov"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Former NBA player, Michael Jeffrey Jordan was born on February 17, what year?",
      "options": [
        "1965",
        "1961",
        "1963",
        "1960"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Zorbing is a sport that was developed in the 1990s. What is a zorb?",
      "options": [
        "A long, plastic sheet that has very little friction when wet",
        "A tandem skydiving rig which can be easily undone",
        "A large, clear plastic ball",
        "A ten-foot wall on which large amounts of velcro are mounted"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1982, Spain hosted the FIFA World Cup for the first time. How many cities in Spain hosted this world tournament?",
      "options": [
        "8",
        "10",
        "12",
        "14"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these bascetball players scored 100 points in one college game?",
      "options": [
        "Kareem Abdul Jabbar",
        "Rod Thorn",
        "Frank Selvey",
        "Wilt Chamberlain"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these happened for the first time in 1913?",
      "options": [
        "Baseball fans were allowed onto the field after the game.",
        "The baseball catcher wore a chest protector for the first time.",
        "Baseball fans were allowed to keep foul balls.",
        "The baseball catcher wore a face mask for the first time."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This beautiful small city in South Carolina was named for the president of the South Carolina Canal and Railroad Company, who built the first railroad that went through it. It was famous for years for its winter colony and its horse industry, and later as a center of nuclear technology. Polo matches are played on Sunday afternoons there.",
      "options": [
        "North Augusta",
        "Sumter",
        "Aiken",
        "Orangeburg"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who won the first NBA slam dunk contest in 1984?",
      "options": [
        "Dominique Wilkins",
        "Julius Erving",
        "Larry Nance",
        "Michael Jordan"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which great infielder broke the record for the most at-bats in a season in 2007?",
      "options": [
        "Pete Rose",
        "Jimmy Rollins",
        "Miguel Tejada",
        "Jose Reyes"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In what country did Joseph Pilates develop the exercise system Pilates?",
      "options": [
        "Germany",
        "Greece",
        "USA",
        "Switzerland"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "During the 2004-2005 season, which team ended Arsenals streak of 49 matches without defeat?",
      "options": [
        "Fulham",
        "Liverpool",
        "Chelsea",
        "Manchester United"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "When was the Federation Internationale de Football Association formed?",
      "options": [
        "1934",
        "1904",
        "1914",
        "1924"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which hill is called the Mecca of ski jumping?",
      "options": [
        "Holmenkollen in Oslo, Norway",
        "Okurayama in Sapporr, Japan",
        "Bergisel in Innsbruck, Austria",
        "Letalnica in Planica, Slovenia"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who scored the first basket in the NBA?",
      "options": [
        "Chris Ford",
        "Maurice Stokes",
        "Ozzie Schectman",
        "Amos Alonzo Stagg"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 1874 Major Clopton Wingfield revolutionized this sport.",
      "options": [
        "Rugby",
        "Soccer",
        "Tennis",
        "Cricket"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "On what planet was the Silver Surfer born?",
      "options": [
        "Mars",
        "Thanagar",
        "Krypton",
        "Zen La"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This designer brand was created in 1978 by Gianni, and is currently headed by Donatella. The products are distributed through a network of 240 exclusive boutiques, over 150 dedicated spaces in major department stores and duty-free areas, as well as a number of multi-brand boutiques in 60 countries. The company has many brands including Gianni, Versus, Jeans Couture, Ceramic Designs, Classic, Classic V2, Sport, Intensive, Precious Items, Young and Palazzo.",
      "options": [
        "Versace",
        "Calvin Klein",
        "Levis",
        "Fendi"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Phil Rizzuto won the Hickok Belt which is awarded to whom?",
      "options": [
        "The best professional athlete of the year",
        "The best baseball player of the year",
        "The best announcer of the year",
        "The best defensive player in baseball"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Where is Club Deportivo Chivas USA based?",
      "options": [
        "Seattle",
        "Boston",
        "Carson",
        "Kansas City"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This great defensive end came from South Carolina State and played for the Rams. He is credited with inventing the head slap move.",
      "options": [
        "Merlin Olsen",
        "David Jones",
        "Rosy Grier",
        "Lamar Lundy"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1973, this person who played for four different NBA teams set a record for blocked shots in one game, with 17.",
      "options": [
        "Bill Russel",
        "Elmore Smith",
        "Wilt Chamberlain",
        "Moses Malone"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which country won the most medals at the 2012 Summer Olympic Games?",
      "options": [
        "Russia",
        "China",
        "USA",
        "Great Britain"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What president awarded Helen Keller the Presidential Medal of Freedom?",
      "options": [
        "Harry Truman",
        "Warren Harding",
        "Lyndon Johnson",
        "Herbert Hoover"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "When was the first Little League World Series played?",
      "options": [
        "1947",
        "1952",
        "1971",
        "1939"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Why was Bobby Fischer detained at Narita international airport in Narita, Japan in 2004?",
      "options": [
        "Making comments about committing terrorism",
        "Possession of a firearm",
        "Possession of marijuana",
        "Using a revoked U.S. passport"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In most variations of the game of billiards, chalk is applied on what?",
      "options": [
        "The players hands",
        "None of these",
        "The table",
        "The cue tip"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following players did not have his number retired by the Boston Red Sox?",
      "options": [
        "Luis Aparicio",
        "Carl Yastrzemski",
        "Ted Williams",
        "Bobby Doerr"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What school did NBA player Tim Duncan attend?",
      "options": [
        "Virginia",
        "UNC",
        "Georgia Tech",
        "Wake Forest"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This diminutive second baseman, known as Nellie Fox, led the Chicago White Sox into the World Series in 1959 against the Dodgers.",
      "options": [
        "Frank James",
        "Jacob Nelson",
        "Mordecai Abraham",
        "Samuel Sheridan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "John Patrick McEnroe was born on February the 16th 1959 in which European country ?",
      "options": [
        "West Germany",
        "France",
        "Italy",
        "East Germany"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "When was the first indoor NCAA Football Bowl game played?",
      "options": [
        "1955",
        "1964",
        "1976",
        "1939"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "David Seaman, Ian Wright, John Jensen, Dennis Bergkamp, David Platt, Patrick Vieira, Marc Overmars, Fredrik Ljungberg, and Thierry Henry are top players who have all played for one of the following soccer clubs.",
      "options": [
        "FC Bayern Mnchen",
        "Arsenal FC",
        "Real Madrid CF",
        "AC Milan"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Paul and Morgan Hamm made history in 2000 for which of these?",
      "options": [
        "Being the first brothers ever to compete together in the Olympics",
        "They did not make history in 2000, as did not start competing until 2001",
        "Being the first set of twins to compete for USA in Gymnastics",
        "Being the youngest people ever to compete in the Olympics"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Baseball Hall of Famer Ryne Sandburg is best known as a player for the Chicago Cubs. Where else did he play?",
      "options": [
        "Philadelphia",
        "Arizona and Tampa Bay",
        "Atlanta and New York Yankees",
        "Philadelphia and Atlanta"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Before they were the Detroit Pistons, the Pistons played in this city.",
      "options": [
        "Louisville, Kentucky",
        "Gary, Indiana",
        "Ft. Wayne, Indiana",
        "Cincinnati, Ohio"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Union is an American professional soccer team based in this city.",
      "options": [
        "Houston",
        "Toronto",
        "Philadelphia",
        "New York"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following players has NOT hit over 50 home runs in a single MLB season?",
      "options": [
        "All of them have accomplished this feat.",
        "Ralph Kiner",
        "Mickey Mantle",
        "Jim Thome"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What former football player co-starred in the 80s TV series Webster?",
      "options": [
        "Jack Youngblood",
        "Mike Golic",
        "Alex Karras",
        "Lyle Alzado"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What animals pull the sleds in the Iditarod Trail Sled Race, which is held annually in Alaska?",
      "options": [
        "horses",
        "deer",
        "dogs",
        "wolves"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This player is considered one of the greatest Philadelphia Phillies players of all time. He played third base for the world champion Phillies in 1980.",
      "options": [
        "Mike Schmidt",
        "Garry Maddox",
        "Pete Rose",
        "Richie Hebner"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What type of engine uses a combustion chamber that is shaped like half a sphere?",
      "options": [
        "Hemi",
        "V-12",
        "V-Tech",
        "DECT-8"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Yogi Berra is famous for his Yogisms. Which of the following is NOT a Yogi quote?",
      "options": [
        "Ninety percent of this game is half mental.",
        "Its tough making predictions especially about the future.",
        "When you come to a fork in the road , take it.",
        "Man this is a long game... were two hours into the sixth inning."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1996, this golf player, known as The Golden Bear, became the first person in the history of the PGA to win the same Senior PGA Tour event four times.",
      "options": [
        "Tiger Woods",
        "Jesper Parnevik",
        "Ben Hogan",
        "Jack Nicklaus"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these teams won their first Super Bowl in 2005?",
      "options": [
        "Atlanta",
        "Cincinnati",
        "Seattle",
        "None of these"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who became head coach of the Steelers in 1992?",
      "options": [
        "Tom Landry",
        "Joe Green",
        "Bill Cowher",
        "Joe Montana"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In The Bad News Bears, Ahmad is an African American boy who plays right field for the Bears and wears uniform #44. He is a big fan of what Hall of Fame baseball player?",
      "options": [
        "Reggie Jackson",
        "Hank Aaron",
        "Willey McCovey",
        "Orlando Cepeda"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was Ted Williams\u2019 number on the Boston Red Sox?",
      "options": [
        "6",
        "8",
        "11",
        "9"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Where was Yogi Berra born?",
      "options": [
        "Brooklyn, New York",
        "St. Louis, Missouri",
        "Montclair, New Jersey",
        "Milan, Italy"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which word refers to the bull doggers partner in the rodeo discipline known as steer wrestling?",
      "options": [
        "Heeler",
        "Header",
        "Hazer",
        "Flanker"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Find the incorrect statement about Tiger Woods.",
      "options": [
        "He was the youngest golfer to win all four majors in one year.",
        "He won four straight US Amateur titles.",
        "He has two half-brothers and one half-sister.",
        "He was the first 15 year-old to win the US Junior Amateur Championship."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who is the 2005 Womens Sr. National Gymnastics Champion in the all-around?",
      "options": [
        "Nastia Liukin",
        "Cathy Rigby",
        "Shannon Miller",
        "Mary Lou Retton"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following sports celebrities has twin sons?",
      "options": [
        "Kurt Warner",
        "Raul",
        "Roger Federer",
        "Lance Armstrong"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What year was Babe Ruth born?",
      "options": [
        "1901",
        "1902",
        "1899",
        "1895"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Pepsi 400 is the name of what major annual sports event held on July 4th, or the Saturday of the July 4th weekend?",
      "options": [
        "A series of extreme sports events",
        "Motorbike racing",
        "Baseball games",
        "Car racing"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "When was the first intercollegiate womens basketball game played?",
      "options": [
        "April 4, 1926",
        "April 4, 1906",
        "April 4, 1916",
        "April 4, 1896"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Colorado Rockies star left fielder Matt Holiday earned All-American honors in two sports during his senior year of high school. What were these sports?",
      "options": [
        "Baseball and football",
        "Football and basketball",
        "Baseball and basketball",
        "Baseball and hockey"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 1890 MIZZOU played its first football game against whom?",
      "options": [
        "Washington University",
        "Kansas",
        "Illinois",
        "Nebraska"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The Celtic and The Rangers are rival clubs from which city?",
      "options": [
        "Glasgow",
        "Boston",
        "Arlington (Texas)",
        "New York"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "The 24 Hours of Le Mans has been held almost every year since 1923. The race was cancelled from 1940 to 1948 due to WWII and in what other year?",
      "options": [
        "1926",
        "1973",
        "1948",
        "1936"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Although originally drafted in the second round as a forward, this man took over the center spot for his only NBA team and led them to an NBA championship. He later coached at Creighton University. Who is this center who was nicknamed The Captain\u201d in the NBA?",
      "options": [
        "Walter Dukes",
        "Bill Lanier",
        "Nate Thurmond",
        "Willis Reed"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is not a former Southern California Trojans football player?",
      "options": [
        "Mike Holmgren",
        "Jack Del Rio",
        "Art Shell",
        "Jim Fassell"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The Honky Tonk man lost the Intercontinental Title to Ultimate Warrior at the first SummerSlam in 1988, but who was Honky originally to defend his title against?",
      "options": [
        "Don Murracco",
        "Brutus Beefcake",
        "Jim Duggan",
        "Jake Roberts"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "One of the following statements is incorrect.",
      "options": [
        "Long shots may reduce the total number of strokes for a given hole.",
        "Long shots are less precise than short ones.",
        "A frequent result of long shots is that the ball goes out of bounds.",
        "A frequent result of short shots is that the ball comes to rest on difficult ground."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following teams did not win the UEFA Champions League in the period 1991/1992-2006/2007?",
      "options": [
        "Valencia",
        "FC Porto",
        "Olimpique Marseilles",
        "Borussia Dortmund"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What city hosted the first womens Olympic marathon in 1984?",
      "options": [
        "Los Angeles",
        "Rome",
        "Barcelona",
        "Montreal"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who managed the Reds to the World Series victory in 1975?",
      "options": [
        "Danny Murtaugh",
        "Jack McKeon",
        "Bill Plummer",
        "Sparky Anderson"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which one of these ladies has 10 Figure Skating World Championship Gold Medals?",
      "options": [
        "Dorothy Hamill",
        "Sonja Hennie",
        "Michelle Kwan",
        "Peggy Flemming"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Prior to becoming a pro wrestler this man played for various professional European basketball teams. When his career ended due to injury he enlisted in the 202nd Military Police Company in Germany and served in a NATO facility for two years.",
      "options": [
        "Davey Boy Smith",
        "Kevin Nash",
        "Barry Windham",
        "William Regal"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who pitched a perfect game for the California Angels on September 30, 1984?",
      "options": [
        "Chuck Finley",
        "Frank Tanana",
        "Nolan Ryan",
        "Mike Witt"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Edvin van der Saar is famous as the goalie of Manchester United. What nationality is his name typical of?",
      "options": [
        "Dutch",
        "French",
        "Danish",
        "Turkish"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Professional wrestler Ric Flair, better known by the ring name The Nature Boy was involved in what kind of accident in 1975?",
      "options": [
        "motorcycle accident",
        "plane accident",
        "car accident",
        "jet-ski accident"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Lets say your opponent hits a shot to your side of the net, but he hits it so far over to one side of the tennis court that, when you finally get to it, youre way off to the side of the court. You hit the ball so that it goes around the outside of the net, landing in your opponents court. Your shot did not go over the net. Rather, it went around the net. Your opponent then misses the shot. Who wins the point, if anybody?",
      "options": [
        "Your opponent wins the point. Your shot around the outside of the net was not a legal shot. The tennis ball has to go over the net to be in play.",
        "Nobody wins the point. This is a let. The point is played over.",
        "This situation is impossible. It isnt physically possible to hit the ball around the outside of the net.",
        "You win the point. Its not required to hit the ball over the net. It can go over the net or around it."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "A go kart will go faster but handle worse, if you do which of the following?",
      "options": [
        "Go down on the air pressure in the tires",
        "Cut a whole in the front of the go kart",
        "Go up on the air pressure in the tires",
        "Crash"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who of the following never played quarterback for Alabama Crimson Tide?",
      "options": [
        "Joe Namath",
        "Kenny Stabler",
        "Archie Manning",
        "Bart Starr"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which Canadian club dominated the NHL during the 1980s?",
      "options": [
        "Ottawa Diesels",
        "Calgary Gasolines",
        "Montreal Benzins",
        "Edmonton Oilers"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What was the nickname of the American mens basketball team at the Olympic Games held in Beijing?",
      "options": [
        "Redeem Team",
        "Ming Team",
        "Dream Team",
        "Dream Team V"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the first televised basketball game air?",
      "options": [
        "1948",
        "1956",
        "1944",
        "1940"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This American businessman is one of the founders of Home Depot and owner of the NFL Atlanta Falcons.",
      "options": [
        "Arthur Blank",
        "Pat Bowlen",
        "Arthur Tisch",
        "Jim Nash"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Basketball has always been a physical sport. This player is a record breaker for the most personal fouls in one NBA season.",
      "options": [
        "Darryl Dawkins",
        "Moses Malone",
        "Joe Dumars",
        "Wilt Chamberlin"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Pas dArmes was a tournament, in which knights were dared to fight. If knights refused to fight, they had to leave this behind as a sign of humiliation.",
      "options": [
        "Spurs",
        "Clothes",
        "Helmet",
        "Horse"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Dennis Johnson, better known as DJ, played how many seasons with the Celtics?",
      "options": [
        "10",
        "9",
        "7",
        "8"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of these is the last name of the two brothers who have each won the Cy Young Award given to the best Major League Baseball pitchers?",
      "options": [
        "Niekro",
        "Dean",
        "Hernandez",
        "Perry"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1988 Bobby Fischer filed a U.S. patent for what?",
      "options": [
        "a software program",
        "a type of laptop computer",
        "a digital chess clock",
        "a rechargeable battery"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This baseball star of the 1950s was the second black player to be signed by a Major League team.",
      "options": [
        "Satchel Paige",
        "Josh Gibson",
        "Minnie Minoso",
        "Larry Doby"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Stanley Matthews won his first Ever FA Trophy while on this team.",
      "options": [
        "Fulham",
        "Blackpool",
        "Blackburn",
        "Bolton"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What is the state sport of the U.S. state of South Dakota?",
      "options": [
        "Baseball",
        "Rodeo",
        "Golf",
        "Bowling"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Ken Griffey Jr. has played with the Reds but which other team did he start his career with?",
      "options": [
        "Mariners",
        "Cardinals",
        "Braves",
        "Red Sox"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these disciplines was included for the first time in the Olympic program at the 2012 Summer Olympics?",
      "options": [
        "womens boxing",
        "mens rhythmic gymnastics",
        "womens weightlifting",
        "womens judo"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who did professional wrestler Roddy Piper not face on Saturday Nights Main Event in 1985 and 1986?",
      "options": [
        "Mr. Wonderful",
        "Bob Orton",
        "The Iron Shiek",
        "Mr. T"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following is not one of the players who have won five US Open titles?",
      "options": [
        "Pete Sampras",
        "Jimmy Connors",
        "John McEnroe",
        "Roger Federer"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "I used to have a fear of hurdles, but I _______________.",
      "options": [
        "gave up and went swimming",
        "got over it",
        "found my stride",
        "stumbled through them"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "The sport of noodling has become very popular in the USA. What does it involve?",
      "options": [
        "A form of mixed martial arts with no rules",
        "Pushing an enormous plastic ball into your opponents goal",
        "Outdoor bowling on ice",
        "Catching catfish barehanded"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In the 1960s the Brunswick Sporting Goods Company made a Snurfer, water ski with a rope in the front. This toy led to the development of which of the following?",
      "options": [
        "Halfpipe skiing",
        "Inline Skating",
        "Skateboarding",
        "Snowboarding"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What recognition did Diego Maradona receive in 2000?",
      "options": [
        "He was voted FIFA Best Football Player of the Century",
        "He was voted Best Footballer in the World.",
        "He was voted Best Player of the FIFA World Cup.",
        "He was voted Sportsman of the Year"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Name the three members of the original Team Xtreme.",
      "options": [
        "Matt Hardy, Lita, Shannon Moore",
        "Shannon Moore, Matt Hardy, Crash Holly",
        "Jeff Hardy, Matt Hardy, Lita",
        "Sable, Torrie Wilson, Dawn Marie"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This NFL team, established in 1933, plays its home games in Heinz Field. In 2008, ESPN.com ranked this teams fans as the best in the NFL partly due to their sellout streak of 299 consecutive games.",
      "options": [
        "Pittsburgh Steelers",
        "New York Giants",
        "Chicago Bears",
        "Dallas Cowboys"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which multiple MVP winner was called the Georgia Peach?",
      "options": [
        "Eddie Murray",
        "Walter Johnson",
        "Albert Belle",
        "Ty Cobb"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following Swedish twin pairs are not ice hockey players?",
      "options": [
        "Patrick are Peter Sundstorm",
        "Henrik and Joel Lundqvist",
        "Andreas and Thomas Ravelli",
        "Daniel are Henrik Sedin"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of these pitchers threw 7 no hitters during his career?",
      "options": [
        "Bob Moose",
        "J.R. Richard",
        "Sandy Koufax",
        "Nolan Ryan"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these horses is not a child of thoroughbred race horse, Seabiscuit?",
      "options": [
        "First Biscuit",
        "Sea Swallow",
        "Sea Sovereign",
        "Sea Orbit"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which one of the following MLB players has ever hit over 40 or more home runs in a single season?",
      "options": [
        "Reggie Jackson",
        "Joe Carter",
        "Eddie Murray",
        "Fred McGriff"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Roughly how many television viewers watched the 2000 Olympic Games in Sydney, Australia over the whole course of the event?",
      "options": [
        "38 million",
        "3.8 billion",
        "38 billion",
        "3.8 million"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What pitcher was known as Old Pete?",
      "options": [
        "Grover Cleveland Alexander",
        "Cap Anson",
        "Pete Incaviglia",
        "Pee Wee Reese"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which was the first football team to win back to back Super Bowls with different coaches?",
      "options": [
        "San Francisco",
        "Dallas",
        "Miami",
        "Pittsburgh"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This is the first team to have three perfect games pitched against them.",
      "options": [
        "Blue Jays",
        "Rangers",
        "Dodgers",
        "White Sox"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "India is the second most populous country in the world, but their first individual Olympic gold came only at the 2008 Games. Which was the historical discipline?",
      "options": [
        "Badminton",
        "Shooting",
        "Table tennis",
        "Judo"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "He was drafted in 2002 by Phoenix Suns, right after Nikoloz Tskitishvili , Dajuan Wagner, Nene, and Chris Wilcox.",
      "options": [
        "Amare Stoudemire",
        "LeBron James",
        "Jason Kidd",
        "Shawn Kemp"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these cities does not host any Tennis Masters Series tournaments?",
      "options": [
        "Monaco",
        "Rome",
        "Madrid",
        "London"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The St. Louis Browns packed up and went to which city?",
      "options": [
        "San Francisco",
        "Chicago",
        "Los Angeles",
        "Baltimore"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This Sudanese/American basketball player and activist, 77 (2.31 m) tall, managed to block 397 shots during the 1985-1986 season, thus setting a rookie record.",
      "options": [
        "Manute Bol",
        "Yao Ming",
        "Wilt Chamberlain",
        "Swede Holbrook"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In 1954 this first baseman was elected to the Baseball Hall of Fame.",
      "options": [
        "Bill Terry",
        "Ron Terry",
        "Abner Terry",
        "Terry Francis"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What year was the NFL Players Association formed?",
      "options": [
        "1964",
        "1945",
        "1956",
        "1972"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In which of these European football teams hasnt Diego Maradona played?",
      "options": [
        "Napoli",
        "Sevilla",
        "Barcelona",
        "Real Madrid"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Baltimore Orioles, Cal Ripken Jr. is most known for playing what position?",
      "options": [
        "Right Field",
        "Shortstop",
        "Catcher",
        "Pitcher"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following players had NOT hit over 50 home runs in a single Major League Baseball season by the conclusion of the 2007 season?",
      "options": [
        "Ken Griffey Jr.",
        "Jimmy Foxx",
        "Ryan Howard",
        "Carlos Delgado"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which Hall of Fame pitcher was best known as Dizzy?",
      "options": [
        "Paul Dean",
        "Bill Dean",
        "Don Dean",
        "Jay Dean"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1950, this NHL team scored a game-winning goal in overtime of game seven, Stanley Cup Finals.",
      "options": [
        "The Detroit Red Wings",
        "The Montreal Canadiens",
        "The Chicago Blackhawks",
        "The Boston Bruins"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "From 1988-1989 this player set a new Major League record for most consecutive bases stolen without being thrown out.",
      "options": [
        "Ichiro Suzuki",
        "Rickey Henderson",
        "Lou Brock",
        "Vince Coleman"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What Notre Dame coach said, Show me a good and gracious loser, and Ill show you a failure.?",
      "options": [
        "Lou Holtz",
        "Knute Rockne",
        "Charlie Weis",
        "Ara Parsegian"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many parts are in a basketball game during the Olympic tournament?",
      "options": [
        "3",
        "2",
        "1",
        "4"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is the weight of gloves in heavyweight bouts?",
      "options": [
        "10 ounces",
        "8 ounces",
        "12 ounces",
        "14 ounces"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Napoleon\u2019s uncle Rico is constantly contemplating his high school football years and one particular game when the coach failed to put him in the game. What year was that game played?",
      "options": [
        "1980",
        "1989",
        "1982",
        "1979"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This sports official, who served as the seventh President of the International Olympic Committee, died in April 2010.",
      "options": [
        "Jacques Rogge",
        "Juan Antonio Samaranch",
        "Michael Morris",
        "Pierre de Coubertin"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What number did football quarterback Brian Griese wear while playing for the Chicago Bears (2006-2007)?",
      "options": [
        "12",
        "14",
        "11",
        "10"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is the title of the book written by Tiger Woods in 2001?",
      "options": [
        "Be The Best",
        "How I Play Golf",
        "The Way Of The Golf Ball",
        "How To Be A Tiger"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What NFL safety made this witty remark: Most football teams are tempermental. Thats 90% temper and 10 % mental.?",
      "options": [
        "Doug Plank",
        "Phil Simms",
        "Ron Jaworski",
        "Shannon Sharpe"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "There is no greater honour for a professional athlete to have his number retired by the franchise for which he used to play. Prior to the 2007-2008 season, how many retired numbers were there in the Montreal Canadiens hockey team?",
      "options": [
        "12",
        "16",
        "11",
        "7"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which Red Sox pitcher gave up the most home runs in the 2004 regular season?",
      "options": [
        "Tim Wakefield",
        "Bronson Arroyo",
        "Curt Schilling",
        "Pedro Martinez"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Kirsty Coventry won four medals and set a new world record in the 200m backstroke at the 2008 Summer Olympic Games. Which country did she represent?",
      "options": [
        "Australia",
        "USA",
        "UK",
        "Zimbabwe"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "We all know that at the 2006 FIFA World Cup, Italy defeated France in a penalty shoot out, but which Italian player had the honour of holding the World Cup aloft as the winning captain?",
      "options": [
        "Gianluigi Buffon",
        "Fabio Cannavaro",
        "Andrea Pirlo",
        "Francesco Totti"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these people has been a Commissioner of the NBA for over 24 years?",
      "options": [
        "Marques Haynes",
        "David Stern",
        "Pete Rozelle",
        "Rick Barry"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What school did Miami lose to in the 1992 Sugar Bowl, halting their efforts of winning back-to-back national titles?",
      "options": [
        "Oklahoma",
        "Ohio State",
        "Nebraska",
        "University of Alabama"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "On April 18, 1923 Babe Ruth hit the first home run in Yankee Stadium against this team.",
      "options": [
        "Oakland Athletics",
        "Canton Bulldogs",
        "Boston Red Sox",
        "Chicago White Sox"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Bok-Fu or Bok Fu Do sounds akin to Kung-Fu but it really fits this description.",
      "options": [
        "It translates to White Tiger.",
        "It means means to bear a weapon.",
        "It is a type of Chinese Wushu.",
        "It is a Persian martial art."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is the difference between the Olympic and the World Cup soccer tournaments?",
      "options": [
        "The ball used at the Olympic Games is oval, more like the one used in American Football.",
        "Red cards are not used during the Olympic games.",
        "In the Olympic tournament there are no penalty shoot-outs when a play-off match ends in a tie.",
        "In the Olympic tournament only players under 23 years old are allowed."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following female swimmers did not set a world record at the 2012 Summer Olympics?",
      "options": [
        "Rebecca Soni",
        "Elizabeth Beisel",
        "Missy Franklin",
        "Dana Vollmer"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "How many goals did Diego Maradona manage to score throughout his professional career, from 1976 to 1997?",
      "options": [
        "564 goals",
        "198 goals",
        "258 goals",
        "1000 goals"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How long does a set in volleyball last?",
      "options": [
        "30 minutes",
        "Until one of the teams gets 25 points",
        "Until one of the teams gets at least 25 points with at least two points advantage over the other team.",
        "15 minutes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which year and what grand slam did John McEnroe first claim ?",
      "options": [
        "1978, US Open",
        "1979, US Open",
        "1980, Wimbledon",
        "1979, Australian Open"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who won the mens tennis competition at the Olympic Games in 2008?",
      "options": [
        "James Blake (USA)",
        "Rafael Nadal (Spain)",
        "Novak Djokovic (Serbia)",
        "Roger Federer (Switzerland)"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What shortstop for the 1983 Phillies wore uniform # 11?",
      "options": [
        "Steve Jeltz",
        "Tony Ghelfi",
        "Ivan DeJesus",
        "Purfi Altamirano"
      ],
      "answerIndex": 2,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This team, nicknamed The Hurricanes, won three NCAA Football Titles in the 1980s.",
      "options": [
        "Miami",
        "Penn State",
        "Oklahoma",
        "Notre Dame"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 1978 John McEnroe won both singles rubbers in the Davis Cup final to help the U.S.A cleam the Davis Cup for the 1st time since 1972. Which country did the U.S.A defeat?",
      "options": [
        "West Germany",
        "Australia",
        "United Kingdom",
        "Argentina"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who were the Stanley Cup champions for the 1994-1995 season?",
      "options": [
        "Detroit Red Wings",
        "New Jersey Devils",
        "Colorado Avalanche",
        "Quebec Nordiques"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What stadium became the Pittsburgh Steelers home field in 2001?",
      "options": [
        "Heinz Field",
        "Qwest Field",
        "Pitt Stadium",
        "Husky Stadium"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Drafted by the Montreal Expos in 1972, The Kid won three Gold Gloves as a catcher. He finished his career with 324 home runs and was elected to the Hall of Fame in 2003. What is his real name?",
      "options": [
        "Ted Simmons",
        "Carlton Fisk",
        "Gary Carter",
        "Lance Parrish"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What device reduces the pressure in the cylinder to the pressure of the surroundings, so that the diver will always be breathing in air at the appropriate pressure of the current depth?",
      "options": [
        "The submersible pressure gauge",
        "The mask",
        "The buoyancy compensator",
        "The regulator"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Players from which country did NOT play for A.C. Milan from the foundation of the club until the 2010/2011 season.",
      "options": [
        "Serbia",
        "Netherlands",
        "Sweden",
        "Brazil"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which team did Dave Stieb hold hitless in 1990 to pitch the first no hitter in Blue Jays history?",
      "options": [
        "Kansas City Royals",
        "Detroit Tigers",
        "Chicago White Sox",
        "Cleveland Indians"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What skateboard company switched their focus and skyrocketed to success with their clothing line in the mid eighties?",
      "options": [
        "Vans",
        "Vision Street Wear",
        "Mad Rats",
        "Rector"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following statements about Major League baseball player Marvellous Marv Throneberry is false?",
      "options": [
        "He was part of a trade package in which the Yankees acquired Roger Maris.",
        "He was chosen by the Mets in the 1961 Expansion Draft.",
        "He was the first sportsman to appear in a Miller Lite beer commercial.",
        "He appeared in a World Series game with the New York Yankees."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In April 1987, this boxer went on a hunger strike for over a month to protest against the conditions for a certain category of boxers.",
      "options": [
        "Hector de la Concha",
        "Lady Tyger Trimiar",
        "Harvey Katowicz",
        "Ray Boom Boom Mancini"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Athletes representing which discipline were the first to compete during the 2008 Olympic Games?",
      "options": [
        "Football / Soccer",
        "Swimming",
        "Field Track",
        "Gymnastics"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "How many Detroit Red Wings players won gold medals in mens hockey in the 2006 Winter Olympics?",
      "options": [
        "5",
        "2",
        "3",
        "4"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "He is the first baseball player to strike out at least 2,597 times.",
      "options": [
        "Babe Ruth",
        "Reggie Jackson",
        "Hank Aaron",
        "Willie Stargell"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This player, nicknamed \u201cBig Red-Head\u201d, was the NBA Finals MVP in 1977?",
      "options": [
        "JoJo White",
        "Wes Unseld",
        "Dennis Johnson",
        "Bill Walton"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which two NBA teams had the two best records in 1960-1961?",
      "options": [
        "New York Knicks and St Louis Hawks",
        "Boston Celtics and St Louis Hawks",
        "Philly Warriors and Detriot Pistons",
        "Los Angeles Lakers and Boston Celtics"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What is the size in circumference of the standard NBA basketball?",
      "options": [
        "30 to 31 (76.2 to 78.7 cm)",
        "29 1/2 to 29 3/4 (74.9 to 76.8 cm)",
        "29 to 29 3/4 (73.6 to 76.8 cm)",
        "29 3/4 to 30 (76.8 to 76.2 cm)"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "At the 1992 Olympics in Albertville, this figure skater became the first Asian-American to medal at the Winter Olympics.",
      "options": [
        "Michelle Kwan",
        "Karen Kwan",
        "Kristi Yamaguchi",
        "None of these"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This former Major League Baseball player was the first pitcher to win a World Series game in three different decades.",
      "options": [
        "Roger Clemens of the Red Sox",
        "Whitey Ford of the Yankees",
        "Sandy Koufax of the Dodgers",
        "Jim Palmer of the Orioles"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which player broke the dead lock with only 2 minutes left of extra time in the Germany v Italy 2006 World Cup semi final?",
      "options": [
        "Alberto Gilardino",
        "Fabio Grosso",
        "Luca Toni",
        "Alessandro Delpiero"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On the 2006 album Stadium Arcadium by the Red Hot Chili Peppers, which song is about the death of bassist Fleas dog?",
      "options": [
        "Death of a Martian",
        "Dani California",
        "Wet Sand",
        "Tell Me Baby"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This great football player is known for catching the immaculate reception .",
      "options": [
        "O.J. Simpson",
        "Lynn Swann",
        "John Stallworth",
        "Franco Harris"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This player, known as Chocolate Thunder, was the first to jump right from high school to the NBA.",
      "options": [
        "Moses Malone",
        "Marvin Webster",
        "Darryl Dawkins",
        "Bob McAdoo"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What name was given to the London 2012 Olympic Games Opening Ceremony that took place on 27 July 2012?",
      "options": [
        "Isles of Inspiration",
        "Games of Courage",
        "Beautiful Olympics",
        "Isles of Wonder"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1992 this owner and President of the Milwaukee Brewers became Commissioner of Major League baseball.",
      "options": [
        "Allan Selig",
        "Barry Bonds",
        "Phil Knight",
        "Jerome Holtzman"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This Major League Baseball player for the Detroit Tigers was given the nickname, The Bird.",
      "options": [
        "Mark Fidrych",
        "Dennis Rodman",
        "Bill Romanowski",
        "Bill Lee"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who had the most touchdown passes in a season before Payton Manning set a new record?",
      "options": [
        "Steve Macnair",
        "Dauntee Coulpper",
        "Michael Vick",
        "Dan Marino"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was the first year Olympians marched into the stadium behind their countrys flag?",
      "options": [
        "1936-Berlin",
        "1900-Paris",
        "1908-London",
        "1944-Chicago"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What job does Jake LaMotta take on after he retires from boxing?",
      "options": [
        "stand up comedian and night club owner",
        "usher at a movie theatre",
        "bus driver",
        "boxing trainer"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This chess player, originally from Armenia, was the chess champion of the world from 1985 to 2000, when he lost the title to Vladimir Kramnik. He is also known in the chess world for his numerous and titanic struggles with Anatoly Karpov.",
      "options": [
        "Mikhail Tal",
        "Garry Kasparov",
        "Akiba Rubinstein",
        "Victor Korchnoi"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which one of the following baseball players led or co-led their league in home runs in the most consecutive years?",
      "options": [
        "Willie Mays",
        "Babe Ruth",
        "Harmon Killibrew",
        "Ralph Kinner"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Many Spanish sport clubs are named Real. What does it mean in Spanish?",
      "options": [
        "Royal",
        "Real",
        "Sport",
        "Soccer"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which of these nicknames was given to Pete Rose?",
      "options": [
        "Pistol Pete",
        "Ramblin Rose",
        "Thorny",
        "Charlie Hustle"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first lady to win the Figure Skating World Championships?",
      "options": [
        "Madge Syers-Cave",
        "Sonja Hennie",
        "Maribel Vinson Owen",
        "Herma Szabo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This former Finnish ski jumper is one of the best in the history of the sport with his five Olympic medals (four Golds), nine World championships medals (five Golds) and 22 Finnish championships medals (13 Golds).",
      "options": [
        "Jens Wessflog",
        "Janne Ahonen",
        "Matti Nyk\u00e4nen",
        "Adam Ma\u0142ysz"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "A variation of which of these sports is called Killer?",
      "options": [
        "Windsurfing",
        "Kickboxing",
        "Pool",
        "Aerobatics"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "At the 2008 Olympic Games, the gold and silver medalists in womens all round competition in gymnastics represented this country.",
      "options": [
        "USA",
        "Russia",
        "Romania",
        "China"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Where is the Baseball Hall of Fame located?",
      "options": [
        "New York, NY",
        "Canton, OH",
        "Cooperstown, N.Y",
        "Hoboken, NJ"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In which athletic conference do the Southern California Trojans teams participate?",
      "options": [
        "Big West",
        "WAC-10",
        "PAC-10",
        "Conference USA"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In soccer, what happens to a goalkeeper who goes outside of his penalty box?",
      "options": [
        "His team is penalized by a free kick.",
        "He is allowed to, but he cannot touch the ball with his hands.",
        "He is allowed only if his team is defending.",
        "He gets a red card."
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which one of the following statements is true about the pigskin brothers, Tiki and Ronde Barber?",
      "options": [
        "They are named after Hawaiian snack foods.",
        "Both of their jock names are nicknames.",
        "They were born in a huddle.",
        "They are fraternal, not identical twins."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What year was the first F1 US Grand Prix held?",
      "options": [
        "1969",
        "1979",
        "1949",
        "1959"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "A street in Michael Phelps hometown was renamed this to honor him.",
      "options": [
        "Phelps Drive",
        "Michael Phelps Way",
        "Phelps Street",
        "Michael Phelps Drive"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This first baseman, member of the Hall of Fame, was a main cog of the New York Yankees.",
      "options": [
        "Yogi Berra",
        "Lou Gehrig",
        "Babe Ruth",
        "Mickey Mantle"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which city is home of Panathinaikos Sport Club?",
      "options": [
        "Athens",
        "Pana City (Illinois)",
        "Palo Alto",
        "San Antonio"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What team did the Toronto Blue Jays beat on May 9, 1990, for their 1000th regular season win?",
      "options": [
        "The White Sox",
        "The Yankees",
        "The Devil Rays",
        "The Red Sox"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which team won the most FA cups during the 1909-2005 period?",
      "options": [
        "Arsenal",
        "Tottenham Hotspur",
        "Manchester United",
        "Liverpool"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Why was the 2005/06 Four Hills Ski Jumping Tournament unique?",
      "options": [
        "The winner, Sven Hannawald, won all four competitions.",
        "It was won ex equo by Janne Ahonen and Jakub Janda.",
        "The winner, Andreas Jacobsen, was the youngest ever in the history of the tournament .",
        "The winner was disqualified."
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Where did Shawn Michaels grow up?",
      "options": [
        "San Antonio, TX.",
        "Houston,TX",
        "Dallas, TX",
        "Austin, TX"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Wally Szczerbiak , who spent much of his childhood in Europe, played basketball at what college?",
      "options": [
        "Miami (Ohio)",
        "Indiana State",
        "Ball State",
        "Bowling Green"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Several Rugby clubs play their home games at stadiums which are also used for football (soccer). Where do Saracens play their home matches?",
      "options": [
        "Adams Park",
        "Vicarage Road",
        "Loftus Road",
        "The Emirates Stadium"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where did The Detroit Red Wings play their home games during the Original Six NHL era?",
      "options": [
        "The Olympia",
        "The Silver Dome",
        "The Gardens",
        "The Palace"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the nickname of San Diego State University during 2006?",
      "options": [
        "Aztecs",
        "Indians",
        "Colonials",
        "Warriors"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "The three machines, introduced by Lou Albano in the mid-80s, featured three masked superstars. They were Axe, Andre the Giant, and who else?",
      "options": [
        "Samoan Afa",
        "Big John Studd",
        "Sgt. Slaughter",
        "Blackjack Mulligan"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Before the 2009 playoffs began, New York Rangers head coach Tom Renney and this assistant coach were fired.",
      "options": [
        "Mike Pelino",
        "Matt Berrie",
        "Glen Sather",
        "Perry Pearn"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "He was selected by the Phoenix Suns in the first round (15th pick overall) of the 1996 NBA Draft. In 2005 he was awarded MVP (most valuable player).",
      "options": [
        "Carmelo Anthony",
        "Kobe Bryant",
        "Karl Malone",
        "Steve Nash"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "When was the first ice dance competition held at the World Championships?",
      "options": [
        "1975",
        "1896",
        "1952",
        "1901"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "He played for the Boston Bruins from 1966 to 1976. On May 10, 1970 he scored an amazing goal diving through the air after being tripped, giving Boston its first Stanley Cup in 29 years.",
      "options": [
        "Phil Espeszito",
        "Wayne Greztky",
        "Bobby Orr",
        "Gordie Howe"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In his rookie season Dan Marino was the starting quarterback for which team?",
      "options": [
        "Dolphins",
        "Cowboys",
        "Chargers",
        "Saints"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Atlanta Fulton County Stadium had what nickname?",
      "options": [
        "The Hot-Lanta",
        "The Launching Pad",
        "Braveland",
        "The Homer Dome"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Tony Hawk is considered the pioneer of what style of skating?",
      "options": [
        "Air skating",
        "Street skating",
        "Vertical skating",
        "Grind skating"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How many sets are played in male table tennis at the Olympics?",
      "options": [
        "Up to 3",
        "Up to 5",
        "Up to 7",
        "Always 3"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 1956, this city set a new record for the most fans at a baseball game - 114,000.",
      "options": [
        "Mexico City",
        "Osaka",
        "New York City",
        "Melbourne"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of the ice hockey team based in Stillwater, Minnesota?",
      "options": [
        "The Stllwater Tigers",
        "The Stllwater Ponies",
        "The Stllwater Stallions",
        "The Stllwater Rockets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "He was a first round draft choice of the NFL Cardinals but he chose to play Major League Baseball. He is probably most famous for his home run in the 1988 World Series. Who is this two-sport legend?",
      "options": [
        "Deion Sanders",
        "Gene Conley",
        "Kirk Gibson",
        "Bo Jackson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who played the role of the cheerful, but vacuous Assistant Coach Luther Van Dam on the popular show Coach?",
      "options": [
        "Jerry Van Dyke",
        "Sherit Blackbelt",
        "Bill Fagerbakke",
        "Travis McKenna"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Do you believe in miracles? YES! Sportscaster Al Michaelss description summed up the play and excitement surrounding the USA Olympic hockey team at the 1980 games at Lake Placid. What team did the USA hockey team beat to take the gold at the 1980 Games?",
      "options": [
        "Finland",
        "Czechoslovakia",
        "Norway",
        "Soviet Union"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In what year did the two Chicago baseball teams, Cubs and Sox play each other in the World Series and who won?",
      "options": [
        "It never happened.",
        "1919 and the Cubs winning.",
        "1908 and the Cubs Winning",
        "1906 and the Sox winning"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In 1915, the great American baseball player of the 1920s, Babe Ruth, hit his first home against which team?",
      "options": [
        "The Yankees",
        "The Red Sox",
        "The White Sox",
        "The Red Stockings"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This basketball player helped the Knicks win the NBA championship during the 1969-1970 season.",
      "options": [
        "Joe Jackson",
        "Fred Lynn",
        "Willis Reed",
        "Otis Taylor"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which driver won the Golden Corral 500 on March 20, 2006 in Atlanta?",
      "options": [
        "Ryan Newman",
        "Carl Edwards",
        "Dale Earnhardt, Jr.",
        "Kasey Kahne"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following teams did not become a member of Western Athletic Conference (WAC) by leaving the Sun Belt?",
      "options": [
        "New Mexico State University",
        "University of Nevada",
        "University of Idaho",
        "Utah State University"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What is the name of the Tokyo professional baseball team?",
      "options": [
        "Giants",
        "Hawks",
        "Swallows",
        "Tigers"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which one of these players has been enshrined in the Basketball Hall of Fame both as a player and coach?",
      "options": [
        "Nat Holman",
        "Lenny Wilkins",
        "Red Holtzman",
        "Red Auerbach"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Her grandfather Frank was not only a high-ranking amateur tennis player who made it to the finals of Wimbledon, but he also co-starred with Mickey Rooney in a 1937 movie.",
      "options": [
        "Brooke Smith",
        "Brooke Shields",
        "Brooke Adams",
        "Brooke Astor"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "To win the Triple Crown a batter must lead his league in these categories.",
      "options": [
        "Home runs, slugging percentage, rbis",
        "Home runs, rbis, batting average",
        "Home runs, hits, rbis",
        "Home runs, batting average, slugging percentage"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was Bob Gibsons primary uniform number?",
      "options": [
        "45",
        "7",
        "10",
        "44"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these NFL players played the most career games?",
      "options": [
        "Jerry Rice",
        "They played the same number of games.",
        "Dan Marino",
        "George Blanda"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1990 I was sold to Juventus for \u00a37,700,000. Not to mention I scored 24 goals in 40 games with Fiorentina. Who am I?",
      "options": [
        "Alfredo Di Stefano",
        "Roberto Baggio",
        "Zico",
        "Eusebio"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What NBA team won their 16th NBA Championship title on June 8,1986?",
      "options": [
        "Chicago Bulls",
        "L.A. Lakers",
        "Houston Rockets",
        "Boston Celtics"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The racquetball term avoidable hinder refers to which of the following?",
      "options": [
        "Illegal placement of a foot before or during the serve",
        "Serve that hits the ceiling",
        "Intimidating the opponent by playing too close",
        "Interference, not necessarily intentional"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who won the Sharpie 500 in Bristol on August 26, 2006?",
      "options": [
        "Kevin Harvick",
        "Kurt Busch",
        "Kyle Busch",
        "Matt Kenseth"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Michael Jordan majored in geography at what university?",
      "options": [
        "Duke University",
        "University of North Carolina",
        "Florida State University",
        "Arizona State University"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This sports great was called The Wizard of Dribble and The Magician.",
      "options": [
        "Stan Matthews",
        "Bob Cousy",
        "Marcus Haynes",
        "Curly Neal"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first repeat winner of the slam dunk contest?",
      "options": [
        "Michael Jordan",
        "Dominique Wilkins",
        "Spud Webb",
        "Jason Richardson"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these world-famous tennis players became the Wimbledon 2004 Champion?",
      "options": [
        "Maria Kirilenko",
        "Maria Bueno",
        "Mary Pierce",
        "Maria Sharapova"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "On what part of a kart can you place a shield to improve aerodynamics?",
      "options": [
        "wheels",
        "motor",
        "steering column",
        "bar"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Thats a winner! is a quote by what famous announcer of the St. Louis Cardinals?",
      "options": [
        "Jack Buck",
        "Joe Morgan",
        "Joe Buck",
        "Sammy Sosa"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In the 2006\u201307 Ashes series, which batsman took the single winning run as Australia dashed to a 5-0 whitewash against England for the first time in 86 years?",
      "options": [
        "Justin Langer",
        "Ricky Ponting",
        "Adam Gilchrist",
        "Mathew Hayden"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What is the official winter sport of Canada?",
      "options": [
        "Ice hockey",
        "Curling",
        "Skiing",
        "Ice skating"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first Houston Astros player to be inducted into the Baseball Hall of Fame?",
      "options": [
        "Carl Everett",
        "Jim Abbott",
        "Jacob Nelson Nellie Fox",
        "Joe Morgan"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "He moved from running Radio City Music Hall to becoming CEO of The United States Tennis Association.",
      "options": [
        "Mike Silve",
        "Jon Litner",
        "Arlen Kantarian",
        "Stan Kroenke"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What Conference did the ACC challenge in a friendly, early-season tournament prior to 1999?",
      "options": [
        "Big East",
        "Big Ten",
        "SEC",
        "Pac-10"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these medical items is the nickname of Doug Mientkiewicz?",
      "options": [
        "Ear Plugs",
        "Eye Chart",
        "Syringe",
        "Stethoscope"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who is the first quarterback to start for two different losing Super Bowl teams?",
      "options": [
        "John Unitas",
        "Fran Tarkenton",
        "Trent Dilfer",
        "Craig Morton"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In 1888, this Norwegian explorer became the first human to cross by ski the Greenland ice cap.",
      "options": [
        "Roald Amundsen",
        "Fridtjof Nansen",
        "Knud Rasmussen",
        "Otto Sverdrup"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The Washington Senators moved to this city after the 1971 season.",
      "options": [
        "Houston",
        "Arlington",
        "Dallas",
        "El Paso"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Clubs from the top divisions and the Premier League join the competition at this stage.",
      "options": [
        "Second Round",
        "Fourth Round",
        "Third Round",
        "Fifth Round"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Ernie Banks, known as Mr. Cub, started his career with which team?",
      "options": [
        "Pirates",
        "Dodgers",
        "Cubs",
        "Giants"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This former baseball player, born in Donora, Pa, has 3630 hits in his career - 1815 hits at home and 1815 hits on the road.",
      "options": [
        "Stan Musial",
        "Ken Griffey",
        "Ken Griffey, Jr.",
        "Frank Thomas"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Idi Amin once challenged this African leader to a boxing match.",
      "options": [
        "Robert Mugabe",
        "Julius Nyerere",
        "Kwame Nkrumah",
        "Jomo Kenyatta"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This great pitcher threw the first perfect game of the 20th century.",
      "options": [
        "Ed Cicotte",
        "Cy Young",
        "Ike Delock",
        "Walter Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "You mark your golf ball on the green with a coin, but when you return the ball to its spot, you realize you stepped on the coin and its now stuck to your shoe. What should you do?",
      "options": [
        "Pretend that nothing happened any quickly toss the coin down so your partners dont suspect foul",
        "Take a 2-stroke penalty and replace your marker",
        "Add 1 stroke to your score and replace it as near as possible to its original position",
        "Replace the marker as close as possible to the original location without penalty"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following players has won a Heisman Trophy in 1973 while in the Pennsylvania State University?",
      "options": [
        "John Cappelletti",
        "Michael Robinson",
        "Tony Hunt",
        "Ki-Jana Carter"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "How many horses are allowed to run in the Kentucky Derby?",
      "options": [
        "20",
        "18",
        "Unlimited number",
        "15"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who plays the role of washed-up-golf-pro-turned teacher Chubbs Peterson in the comedy Happy Gilmore?",
      "options": [
        "Carl Weathers",
        "Apollo Creed",
        "Paul Warfield",
        "Billy Dee Williams"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Bob Griese was the quarterback for which team?",
      "options": [
        "Dolphins",
        "Saints",
        "Vikings",
        "Patriots"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which country was the first to beat the US basketball Dream Team at the Olympic Games?",
      "options": [
        "Spain",
        "Soviet Union",
        "Puerto Rico",
        "Argentina"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The White Horse Final took place on this date.",
      "options": [
        "4 May 1924",
        "4 April 1924",
        "28 April 1923",
        "28 April 1924"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This Major League baseball player, who spent his career with the Chicago Cubs and St. Louis Cardinals, was elected to the Baseball Hall of Fame in 1985.",
      "options": [
        "Red Schoendienst",
        "Hank Aaron",
        "Willie Stargell",
        "Lou Brock"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first player to score over 1000 goals in soccer?",
      "options": [
        "David Beckham",
        "Rinaldo",
        "Pele",
        "Johann De Gruyff"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Dale Earnhardt, Jr. won his first NASCAR Cup Series race at which track in 2000?",
      "options": [
        "Texas",
        "Richmond",
        "Bristol",
        "Darlington"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Where in the USA would you find the Circus Hall of Fame?",
      "options": [
        "Augusta, GA",
        "Mobile, Alabama",
        "Saratoga, NY",
        "Sarasota, Florida"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What are the common links connecting the Boston Red Sox, the film Capote and the TV series Homicide?",
      "options": [
        "The movie and show were produced by Ted Williams nephew.",
        "The movie and TV show included major scenes in Fenway Park.",
        "Truman Capote looked divine in red.",
        "The sister of a Red Sox executive produced Homicide, and her husband wrote Capote."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who is the first tennis player to have twice won all four Grand Slam singles titles in the same year?",
      "options": [
        "Roger Federer",
        "Arthur Ashe",
        "Bjorn Borg",
        "Rod Laver"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was the date for the first induction class into the Pro Football Hall of Fame?",
      "options": [
        "July 15, 1962",
        "August 30, 1964",
        "October 9, 1961",
        "September 7, 1963"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "New York Mets pitcher Tom Glavine began his baseball career with which team?",
      "options": [
        "Atlanta Braves",
        "Boston Red Sox",
        "Philadephia Philles",
        "New York Yankees"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 2002 this man, who was President of Indiana University, became President of the NCAA.",
      "options": [
        "Sean McManus",
        "Tony Ponturo",
        "David Hill",
        "Myles Brand"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What year did Thurman Munson win the Rookie of the Year Award?",
      "options": [
        "1965",
        "1970",
        "1972",
        "1968"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who portrays aging Atlanta Braves baseball scout Gus Lobel in the sports-drama film Trouble with the Curve?",
      "options": [
        "Clint Eastwood",
        "Tommy Lee Jones",
        "Jack Nicholson",
        "Nicolas Cage"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Many of the greatest coaches, both pro and college, trace their learning to Miami University of Ohio and the teachings of this coaching great, who led Cleveland to many championships.",
      "options": [
        "Paul Brown",
        "Don Shula",
        "Woody Hayes",
        "Weeb Ewbank"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "When was the first NBA Championship game played?",
      "options": [
        "1889",
        "1947",
        "1937",
        "1905"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Who had the most home runs in the 2007 Major League Baseball season?",
      "options": [
        "Troy Glaus",
        "David Ortiz",
        "Vladimir Guerrero",
        "Alex Rodriguez"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This former baseball player, called The Ol Perfesser, left his mark on the game as a manager.",
      "options": [
        "Connie Mack",
        "Earl Weaver",
        "Miller Huggins",
        "Casey Stengel"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This basketball player and his teammates Glenn Robinson and Ray Allen formed the Milwaukee Bucks Big Three in the period between 1999 and 2003 .",
      "options": [
        "Kevin Garnett",
        "Tim Duncan",
        "Sam Cassell",
        "Tracy McGrady"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When was the first Virginia 500 held?",
      "options": [
        "1946",
        "1938",
        "1949.",
        "1950"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Mark Price, Larry Nance, Brad Daugerty, Shawn Kemp and Austin Carr have been chosen to be this teams all-time starting five.",
      "options": [
        "Philadelphia 76ers",
        "Cleveland Cavaliers",
        "Houston Rockets",
        "Denver Nuggets"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these former NFL quarterbacks has the most passing yards?",
      "options": [
        "John Elway",
        "Dan Marino",
        "Warren Moon",
        "Brett Favre"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Peter Framptons incredible 1976 album Frampton Comes Alive featured the hit songs Do You Feel Like We Do? and Show Me the Way and made him a bona fide stadium-filling arena rocker. What band was he a member of before going solo?",
      "options": [
        "The Easybeats",
        "Vanilla Fudge",
        "Humble Pie",
        "King Crimson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which statement is untrue about Jackie Robinson, who broke the color barrier in professional baseball in 1947?",
      "options": [
        "When Walter Alston signed him, both Alston and Robinson received death threats.",
        "He played three sports for UCLA.",
        "His older brother was considered the best athlete in the family but was forced to take a job as a sanitation worker in Los Angeles because of segregation.",
        "He also integrated the city of Stamford, Connecticut."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What baseball player had the first unassisted triple play in a World Series game?",
      "options": [
        "Bill Wambsganss",
        "Harry Chiti",
        "Gus Zernial",
        "Lou Skisas"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Diego Maradona became friends with this political leader and even tattooed hit portrait on his left leg.",
      "options": [
        "George H. W. Bush",
        "Lech Walesa",
        "Fidel Castro",
        "Mikhail Gorbachev"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the Greenbay Packers first round draft pick in 1961?",
      "options": [
        "Herb Adderly",
        "Paul Dudley",
        "Phil Nugent",
        "Ron Kostelnik"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "African national football teams usually have a nickname. Which countrys footballers are known as Bafana, Bafana (The Boys)?",
      "options": [
        "Ghana",
        "Nigeria",
        "South Africa",
        "Cameroon"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What sport had Arnold Schwarzenegger practiced before he took up bodybuilding?",
      "options": [
        "Baseball",
        "Tennis",
        "Rugby",
        "Soccer"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This professional NASCAR driver, winner of the 1989 Winston Cup Championship, retired after the 2005 NASCAR Nextel Cup season.",
      "options": [
        "Ken Schrader",
        "Ricky Rudd",
        "Mark Martin",
        "Rusty Wallace"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "This player became the first to hit into 350 double plays in a Major League baseball career.",
      "options": [
        "Babe Ruth",
        "Cal Ripken, Jr.",
        "Hank Aaron",
        "Jim Rice"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which team do the Jets share their stadium with?",
      "options": [
        "Giants",
        "Patriots",
        "Dolphins",
        "Bills"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these Hall of Famers played first base for the Detroit Tigers?",
      "options": [
        "Al Kaline",
        "Denny McLain",
        "Hank Greenberg",
        "Alan Trammel"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Mens Gymnastics at Beijing Olympic Games was dominated by Chinese athletes. Who was the only gold medalist from a different country?",
      "options": [
        "Leszek Blanik (Poland, vault)",
        "Gervasio Deferr (Spain, floor)",
        "Shawn Johnson (USA, Beam)",
        "USA (team all-around)"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What NBA team did Bill Walton lead to a NBA title?",
      "options": [
        "San Antonio Spurs",
        "Houston Rockets",
        "Portland Trail Blazers",
        "Utah Jazz"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In the USG Sheetrock 400, who claimed victory at the Chicagoland raceway in controversial fashion on July 9, 2006?",
      "options": [
        "Matt Kenseth",
        "Jeff Gordon",
        "Tony Stewart",
        "Kevin Harvick"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these wrestlers was a member of the professional wrestling stable the Four Horsemen only for three weeks?",
      "options": [
        "Sid Vicious",
        "Curt Henning",
        "Lex Lugar",
        "Paul Roma"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "After Elston Howard took over most of the catching duties with the Yankees, what position did Yogi Berra learn to play?",
      "options": [
        "Shortstop",
        "Leftfield",
        "Centerfield",
        "Secondbase"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which was the first country to win two consecutive FIFA World Cups in 1958 and 1962?",
      "options": [
        "Argentina",
        "France",
        "Brazil",
        "Italy"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Joe Tinker was the shortstop in the famous combination Tinkers to Evers to Chance.\u201c What was the name of the famous poem that immortalized these three players?",
      "options": [
        "Bad Days in Chi-town",
        "Baseballs Sad Lexicon",
        "Casey at the Bat",
        "The Deadly Trio"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these people founded the World Wrestling Entertainment, Inc?",
      "options": [
        "Hulk Hogan",
        "Ric Flair",
        "Shane McHamon",
        "Vincent McMahon"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many times did Roger Federer defeat an American player in the final during his successive five championship wins (2004-2008)?",
      "options": [
        "3",
        "1",
        "0",
        "2"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Name the first team to both play in and lose four Super Bowls.",
      "options": [
        "Rams",
        "Vikings",
        "Falcons",
        "Colts"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In NCAA football, a conference can play a conference championship game if it has this many teams.",
      "options": [
        "16",
        "12",
        "10",
        "11"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What year did Auburns Pat Sullivan win the Heisman Trophy?",
      "options": [
        "1972",
        "1970",
        "1973",
        "1971"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What was Happy Gilmores favorite sport in the self-titled movie?",
      "options": [
        "Hockey",
        "Baseball",
        "Football",
        "Golf"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "His real name is Yelverton Abraham, and he played for San Francisco as well as the NY Giants. He attended LSU.",
      "options": [
        "Motley",
        "Tittle",
        "Groza",
        "Strong"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Why was the All American Girls Professional Baseball League (AAGPBL) created in the first place in the great movie A League of Their Own?",
      "options": [
        "The women were bored and wanted to play ball.",
        "World War ll was going to shut down Major League Baseball due to the fact that many of the players were in the military.",
        "The powerful Womens Lib Movement struck a deal with Major League Baseball.",
        "JustSomeGuy was bored and felt like starting his own Baseball League."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "While playing with different teams throughout his career, Eddie Murray was great at what position mostly with the Orioles?",
      "options": [
        "First Base",
        "Center Field",
        "Left Field",
        "Second Base"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "How long is the Olympic cycling race?",
      "options": [
        "200miles",
        "It is not set",
        "200km",
        "189.5km"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What is the nickname of Ouachita Baptist Universitys athletic teams?",
      "options": [
        "Tigers",
        "Lions",
        "Giraffes",
        "Elephants"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "When did Norm Stewart win his first Conference Championship?",
      "options": [
        "1976",
        "1987",
        "1981",
        "1994"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "After graduating from Duke University, Matt Breslin became the goalie for this Major League Lacrosse team.",
      "options": [
        "The Outlaws",
        "The Lizards",
        "The Pride",
        "The Cannons"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Canyoning is the extreme sport of travelling down canyons, using which of the following techniques?",
      "options": [
        "Scrambling and climbing",
        "All of these",
        "Jumping",
        "Abseiling"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Which player was the center at UCLA when the Bruins won 88 straight games?",
      "options": [
        "Kareem Abdul-Jabbar (aka Lew Alcindor)",
        "Dave Cowens",
        "Bill Walton",
        "Sidney Wicks"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Joining the team in 1962, this former infielder, manager and coach was the first 3rd baseman to play for the New York Mets.",
      "options": [
        "Elliot Maddox",
        "Don Zimmer",
        "Ed Charles",
        "Wayne Garrett"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Where was Bobby Fischer born?",
      "options": [
        "Boston, Massachusetts",
        "Chicago, Illinois",
        "Philadelphia, Pennsylvania",
        "Atlanta, Georgia"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which English football team has been nicknamed The Pensioners?",
      "options": [
        "Manchester United",
        "Chelsea",
        "Liverpool",
        "Tottenham Hotspur"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Where did professional boxing start in 1891?",
      "options": [
        "England",
        "USA",
        "Russia",
        "Germany"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first baseball player to hit a home run in Minute Maid Park?",
      "options": [
        "Scott Rolen",
        "Jeff Bagwell",
        "Barry Bonds",
        "Richard Hidalgo"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What did Ara Abrahamian (Sweden, wrestling) do at the medal ceremony for 84kg greco-roman event of the 2008 Summer Olympics?",
      "options": [
        "Took off his t-shirt and displayed another with the flag of Tibet",
        "Shouted Russia will pay dearly for attacking Georgia in his native language, Armenian",
        "Stepped from the podium, dropped his medal and walked off",
        "Refused to accept the gold medal"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who served as the Mets pitching coach in 1986?",
      "options": [
        "Rick Peterson",
        "Sid Fernandez",
        "Bill Robinson",
        "Mel Stottlemeyer"
      ],
      "answerIndex": 3,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Which college used to have the nickname The Ramblin Wrecks?",
      "options": [
        "Purdue",
        "Texas Tech",
        "Oklahoma State",
        "Georgia Tech"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "She was the first woman to sign a contract with a National Basketball Association team, the Indiana Pacers. She was also the first player to be part of the U.S. National team while still in high school.",
      "options": [
        "Cheryl Miller",
        "Nancy Lieberman",
        "Carol Blazejowski",
        "Ann Meyers"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This great point guard had the nickname Clyde when he played for the New York Knicks.",
      "options": [
        "Jack Clyde Drexler",
        "Richie Clyde Guerin",
        "Jack Clyde Twyman",
        "Walt Clyde Frazier"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Ron Santo, who played almost his entire career with the Chicago Cubs, was named a National League All-Star how many times?",
      "options": [
        "ten",
        "eight",
        "eleven",
        "nine"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This football player, known as Sweetness, spent his entire 13-year career with the same NFL team. He ran for 275 yards in a game in 1977 and is one of the few players to run for, throw for, and catch a touchdown pass in the same game.",
      "options": [
        "Otis Anderson",
        "Jim Brown",
        "Walter Payton",
        "John Riggins"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who pitched the first no-hitter in Series history?",
      "options": [
        "Orel Hershiser",
        "Don Larsen",
        "Nolan Ryan",
        "Lew Burdette"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What were the original team colors of the Pittsburgh Penguins?",
      "options": [
        "black and gold",
        "They have always worn black and gold.",
        "blue and white",
        "gold and white"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the manager of the 1980 Philadelphia Phillies?",
      "options": [
        "Dallas Green",
        "Jim Fregosi",
        "Danny Ozark",
        "Joe Altobelli"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "Who was the first Major League Baseball player born in what was then called Czechoslovakia?",
      "options": [
        "Ernie Orvitz",
        "Reno Bertoia",
        "Elmer Valo",
        "Andy Pafko"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the first baseball player to hit more than 40 home runs in a season?",
      "options": [
        "Lou Gehrig",
        "Home Run Baker",
        "Babe Ruth",
        "Nap Lajoie"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What was the fist IC Title change at SummerSlam?",
      "options": [
        "The Ultimate Warrior Vs Hercules",
        "Ultimate Warrior Vs Randy Savage",
        "Ultimate Warrior Vs Rick Rude",
        "The Ultimate Warrior Vs Honky Tonk Man"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What sport do Vivian and Edward watch in Pretty Woman?",
      "options": [
        "Football",
        "Rugby",
        "Cricket",
        "Polo"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "In 1954, this nation, widely believed to be the greatest team of all time, were stunned by West Germany in the final.",
      "options": [
        "Brazil",
        "Sweden",
        "Hungary",
        "Italy"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which of these musicians was not among the first class inducted into the Jazz Hall of Fame?",
      "options": [
        "Art Tatum",
        "Ray Charles",
        "Benny Carter",
        "Earl Hines"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which facility, located in Quezon City, Philippines, was nicknamed The Big Dome?",
      "options": [
        "Ynares Gym",
        "Makati Sports Complex",
        "Araneta Coliseum",
        "Cuneta Astrodome"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of these ballplayers has the nicknames Mr. November, Captain Clutch and D-Jitty?",
      "options": [
        "Davey Johnson",
        "Dazzy Vance",
        "Darrell Rasner",
        "Derek Jeter"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In paintball, which term refers to the tank that holds the paintballs?",
      "options": [
        "Hopper",
        "Dopper",
        "Holding tube",
        "Holding tank"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This great golfer never won the PGA Championship, though he came close a couple of times.",
      "options": [
        "Nick Price",
        "Dave Marr",
        "Lanny Wadkins",
        "Greg Norman"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Native to Algeria and from a very poor background like many top players from the past, this soccer player contributed to Frances victory in the 1998 World Cup. Who is this soccer player?",
      "options": [
        "Alessandro del Piero",
        "Ferenc Puskas",
        "Zinedine Zidane",
        "Jean Pierre Papen"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1962, this former Philadelphia 76er set the record for most points scored in a game.",
      "options": [
        "Bill Russel",
        "Wilt Chamberlain",
        "Michael Jordon",
        "Hakeem Olajuwon"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This team won its first World Series title in 1980.",
      "options": [
        "Kansas City Royals",
        "Houston Astros",
        "Philadelphia Phillies",
        "Colorado Rockies"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Who was the first pitcher to hit a home run in a World Series game?",
      "options": [
        "Jim Sebring",
        "Jim Bagby",
        "Cy Young",
        "Walter Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of these drivers won the most World Rally Championships and individual rallies?",
      "options": [
        "S\u00e9bastien Loeb (France)",
        "Juha Kankkunen (Finland)",
        "Carlos Sainz (Spain)",
        "Colin McRae (UK)"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In golf, this type of shot is the first shot played from a teeing ground and is usually made with a driver.",
      "options": [
        "tee shot",
        "bunker shot",
        "flop",
        "chip"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Who was the fourth baseball player to hit 600 home runs in the US major leagues (Babe Ruth, of course, was the first)?",
      "options": [
        "Sammy Sosa",
        "Ken Griffey, Jr.",
        "Willie Mays",
        "Barry Bonds"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first catcher to win both the Silver Slugger Award (Best Hitter at his position) and Golden Glove Award (Best fielder at his position) in the same year?",
      "options": [
        "Carleton Fisk",
        "Johnny Bench",
        "Ivan Rodriguez",
        "Roy Campanella"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Rodeo is the official state sport of this U.S. state.",
      "options": [
        "South Dakota",
        "Texas",
        "Wyoming",
        "All of these"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What is the national sport of Bangladesh?",
      "options": [
        "Rugby",
        "Field Hockey",
        "Kabaddi",
        "Kho Kho"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which reliever, who had been the Red Sox closer in 2003, had a better earned run average in the 2004 season than the new closer, Keith Foulke?",
      "options": [
        "Mike Timlin",
        "Alan Embree",
        "Scott Williamson",
        "Ramiro Mendoza"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In the movie Point Break, FBI agent Utah was quarterback for a major college football team and ended up getting hurt in the Rose Bowl. What team did he play against in that bowl game?",
      "options": [
        "UCLA",
        "Arizona",
        "USC",
        "Arizona State"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This Triple Crown winner was an outfielder for the Cincinnati Reds until he was traded to the Orioles for Milt Pappas.",
      "options": [
        "Vada Pinson",
        "Ducky Duffy",
        "Frank Robinson",
        "Wally Post"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What former tag team partner of Tony Atlas inducted him into the WWE Hall of Fame?",
      "options": [
        "Hulk Hogan",
        "Chief Jay Strongbow",
        "S.D. Jones",
        "Rocky Johnson"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which player received the Golden Ball award at the 2006 FIFA World Cup finals?",
      "options": [
        "Zinadine Zidane",
        "Gianluigi Buffon",
        "Wayne Rooney",
        "Fabio Cannavarro"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "I played for the French national team but I was ejected from the 2006 World Cup Final for headbutting an Italian player. Who am I?",
      "options": [
        "Zinedine Zidane",
        "Terry Henry",
        "None of these",
        "David Trezeguet"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is part of the result calculation in ski-jumping?",
      "options": [
        "Distance only",
        "Distance, but if the jumpers jumped the same distance, style is taken into account",
        "Distance and style",
        "Style only"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which one of these teams is not in the Big Ten Conference?",
      "options": [
        "Iowa State",
        "Illinois",
        "Michigan State",
        "Penn State"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What year was the Montreal Canadiens hockey team founded?",
      "options": [
        "1909",
        "1908",
        "1917",
        "1902"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "How many games did Spain lose in the UEFA Euro 2008 Tournament?",
      "options": [
        "0",
        "2",
        "1",
        "3"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "From whom did Muhammad Ali get the championship the first time?",
      "options": [
        "Sonny Liston",
        "Cassius Clay",
        "Floyd Patterson",
        "Leon Spinks"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the film Hoosiers, the best basketball player in town hasnt played since his old coach died. He steps up for Coach Dale, saves Coach Dales job, and joins the team. What is his name?",
      "options": [
        "James Henrywood",
        "James Arrowood",
        "Jimmy Chitwood",
        "Jimmy Tipwood"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In what city did the same skier win all three Olympic alpine events for the first time in history, in 1956?",
      "options": [
        "Grenoble",
        "Torino",
        "Cortina DAmpezzo",
        "Oslo"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What number did Michael Jordan wear after the return to NBA from his first retirement?",
      "options": [
        "23",
        "45",
        "15",
        "3"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "In 2002, the team of Brazil became a FIFA World Cup winner beating the team of which country?",
      "options": [
        "Italy",
        "Germany",
        "Sweden",
        "France"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Who was the Super Bowl MVP in 1972?",
      "options": [
        "WR Paul Warfield",
        "S Jake Scott",
        "RB Mercury Morris",
        "RB Larry Csonka"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "After many unsuccessful tries, this man in black, also known as The Intimidator, finally won The Daytona 500 in 1998 which was also the track we lost him at.",
      "options": [
        "Cale Yarborough",
        "Denny Hamlin",
        "Dale Earnhardt",
        "Dale Earnhardt Jr."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What number did Tom Seaver, who was elected to the Baseball Hall of Fame on January in 1992, wear when he was a player for the New York Mets in the 1970s?",
      "options": [
        "47",
        "35",
        "41",
        "32"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "I attended Indiana University and was drafted 2nd overall in the 1981 NBA draft by the Detroit Pistons. Who am I?",
      "options": [
        "Larry Bird",
        "Joe Dumars",
        "Isiah Thomas",
        "Bill Laimbeer"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What year was former baseball player Pete Rose born?",
      "options": [
        "1943",
        "1941",
        "1942",
        "1944"
      ],
      "answerIndex": 1,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "This batter was hit by a pitch 50 times in a season in 1971.",
      "options": [
        "Dock Ellis",
        "Gary Carter",
        "Reggie Jackson",
        "Ron Hunt"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In which team sport can you see a player called libero, whose jersey is a different color from the rest of the team?",
      "options": [
        "Handball",
        "Football",
        "Basketball",
        "Volleyball"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The team of this country won the first FIFA Womens World Cup.",
      "options": [
        "The USA",
        "Brazil",
        "Italy",
        "Germany"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these former gymnasts won the most medals in the Olympics?",
      "options": [
        "Nadia Comaneci (Romania)",
        "Olga Korbut (Soviet Union)",
        "Larissa Latynina (Russia)",
        "Shannon Miller (USA)"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following people was a big fan of bowling?",
      "options": [
        "Cromwell",
        "Napolen",
        "Luther",
        "Mozart"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of LSUs mascot?",
      "options": [
        "Mike the Tiger",
        "Michael the Lion",
        "Mike the Rabbit",
        "Tiger"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What gas is the most abundant gas in the atmospheric air we breathe every day?",
      "options": [
        "Nitrogen",
        "Carbon Dioxide",
        "Oxygen",
        "Helium"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What word refers to the match officials in a cricket match?",
      "options": [
        "Referee",
        "Line Judge",
        "Umpire",
        "Sir"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The 2008 owner of the Seattle Seahawks and Portland Trailblazers was a co-founder of this company.",
      "options": [
        "ESPN",
        "Lockheed",
        "Microsoft",
        "Nike"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "How many pitchers threw perfect games in the 20th century?",
      "options": [
        "14",
        "15",
        "8",
        "10"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Three of the Hall-of-Fame players listed below never won a World Series championship. Who is the lucky exception?",
      "options": [
        "Rod Carew",
        "Ernie Banks",
        "Bob Feller",
        "Ted Williams"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who is the first man to catch more than one perfect game?",
      "options": [
        "Jeff Torborg",
        "Ron Hassey",
        "Joe Giradi",
        "Yogi Berra"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Henry Aaron hit home run number 715 off of which Dodger pitcher?",
      "options": [
        "Don Drysdale",
        "Al Downing",
        "Sandy Koufax",
        "Don Sutton"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who did Utah play in the Sugar Bowl the second time they broke the BCS?",
      "options": [
        "Michigan",
        "Oregon",
        "Alabama",
        "Louisville"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "By which team was former Penn State Nittany Lions player Michael Robinson chosen in the NFL Draft in 2006?",
      "options": [
        "Seattle Seahawks",
        "San Francisco 49ers",
        "Oakland raiders",
        "Pittsburgh Steelers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What was the nickname of the Minnesota Vikings defensive line in the late 1960s?",
      "options": [
        "the Purple Swarm",
        "the Purple People Eaters",
        "They didnt have a nickname.",
        "the Berserks"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Early in the movie Miracle, at the opening practice, how does coach Herb Brooks upset the U.S. ice hockey officials?",
      "options": [
        "By refusing to pick a selectors son",
        "By already picking the squad of 26 players he wanted with no consultation from them",
        "By not showing up to practice",
        "By bringing his wife to training"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The Olympic motto Citius, Altius, Fortius embodies the spirit of the Olympic movement. What is the English translation of these Latin words?",
      "options": [
        "Swifter, Higher, Stronger",
        "Quicker, Shorter, Better",
        "Faster, Taller, Tougher",
        "Bigger, Better, Cleaner"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these sports teams is a baseball team from the U.S. state of Missouri?",
      "options": [
        "Kansas City Chiefs",
        "St. Louis Cardinals",
        "Springfield Lasers",
        "St. Louis Blues"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following New York Rangers retired after the 2008-09 season?",
      "options": [
        "Brendan Shanhan",
        "Wade Redden",
        "Markus Naslund",
        "Jaromir Jagr"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What city hosted the 1998 debut of snowboarding as an official Olympic sport?",
      "options": [
        "Albertville",
        "Salt Lake City",
        "Torino",
        "Nagano"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He was a player, coach, and owner -all for one team. He was also instrumental in developing the NFL.",
      "options": [
        "George Halas",
        "Wellington Mara",
        "Pete Rozelle",
        "Red Grange"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is Dale Earnhardt, Jr.s real first name?",
      "options": [
        "James",
        "Albert",
        "Michael",
        "Ralph"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "After the 1981 season, the St. Louis Cardinals and the San Diego Padres swapped which shortstops?",
      "options": [
        "Jose Oquendo and Jerry Royster",
        "Garry Templeton and Dave Concepcion",
        "Ozzie Smith and Garry Templeton",
        "Ozzie Smith and Royce Clayton"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which country took all medals in the 100m womens sprint race at the Beijing Olympic Games?",
      "options": [
        "China",
        "Jamaica",
        "UK",
        "USA"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This team, known as the oldest in professional hockey, set a world record for most goals in a game on March 3, 1920.",
      "options": [
        "Toronto Maple Leafs",
        "Montreal Canadiens",
        "Ottawa Senators",
        "Boston Bruins"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which athlete on a Minnesota team is nicknamed The Big Ticket?",
      "options": [
        "Seimone Augustus",
        "Kevin Garnett",
        "Marian Gaborik",
        "Torii Hunter"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Who won the NHLs holy grail for the 2000-2001 season?",
      "options": [
        "Detroit Red Wings",
        "New Jersey Devils",
        "Colorado Avalanche",
        "Carolina Hurricanes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Wilt Chamberlain is a great player indeed. In a game against the Celtics he made the best rebounding effort ever. How many rebounds did he make in this famous game?",
      "options": [
        "16",
        "57",
        "31",
        "55"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which WWF group does this theme music belong to?",
      "options": [
        "Nation of Domination",
        "Legion of Doom",
        "D-Generation X",
        "Hart Foundation"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which pitcher was not on the Mets staff in 1969?",
      "options": [
        "Jon Matlack",
        "Jerry Koosman",
        "Gery Gentry",
        "Nolan Ryan"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "According to the rules of the International Skating Union, major speed skating competitions can be held on outdoor or indoor ice ovals, of what standard length?",
      "options": [
        "400 m (1,310 ft)",
        "500 m (1,640 ft)",
        "1000 m (3,280 ft)",
        "700 m (2,300 ft)"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "At the 2006 Cyber Sunday, the fans decided to see Mickie James vs. Lita in what kind of match?",
      "options": [
        "Bra Panty",
        "Diva LumberJack",
        "No DQ",
        "Pillow Fight"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The great Brazilian soccer player was born Manoel Francisco dos Santos, but we known him better by this name.",
      "options": [
        "Pele",
        "Garrincha",
        "Ronaldo",
        "Zico"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What two teams played in the 1989 World Series?",
      "options": [
        "Twins vs. Cardinals",
        "As vs. Reds",
        "As vs. Giants",
        "As vs. Dodgers"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "This old time wrestler was a football coach at Madison High School in Madison Heights, MI where he would eventually become a member of the Michigan Coaches Hall of Fame.",
      "options": [
        "George The Animal Steele",
        "Bob Backlund",
        "Dean Malenko",
        "Tony Garea"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "It is widely known that the New York Mets traded Tom Seaver on June 15, 1977. Who else did the Mets trade that same day?",
      "options": [
        "Joe Torre",
        "Dave Kingman",
        "Bobby Valentine",
        "Doug Flynn"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This great Ultimate Fighting champion played Gaft in the pilot episode of Blade: The Series.",
      "options": [
        "Tito Sanchez",
        "Rich Franklin",
        "Chuck Lidell",
        "Matt Hughes"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What Arkansas Razorback coach said, The man who complains about the way the ball bounces is likely to be the one who dropped it.?",
      "options": [
        "Houston Nutt",
        "Lou Holtz",
        "Frank Broyles",
        "Tommy Nobles"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of the following is not among the many ways of getting a lane violation in basketball?",
      "options": [
        "On a free throw when you cross the line before the shooter has shot",
        "On defense when you are in the key for more than three seconds not guarding someone",
        "When you stand in the key on offense for more than three seconds",
        "On a free throw when the shooter crosses the free throw line before the ball hits the rim"
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What two teams competed in the finals of the mens football (soccer) tournament at the Beijing Olympics?",
      "options": [
        "USA-Brazil",
        "USA-China",
        "Brazil-Argentina",
        "Argentina-Nigeria"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which professional golfer was known as The Hawk?",
      "options": [
        "Ben Hogan",
        "Babe Didrickson",
        "Fred Couples",
        "Byron Nelson"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "To which Notre Dame legend is the following quote attributed? Ive found that prayers work best when you have big players.",
      "options": [
        "Frank Leahy",
        "Knute Rockne",
        "Ara Parseghian",
        "Jessie Harper"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the cap insignia of the Los Angeles Dodgers?",
      "options": [
        "A over D",
        "T over A",
        "A over L",
        "D over L"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What statement is true about Kathryn Johnston?",
      "options": [
        "She was the first female in the Baseball Hall of Fame.",
        "She was the winningest pitcher in the All-American Girls Baseball League during World War II.",
        "She was the first girl to play in the Little League.",
        "She was the first female baseball player in NCAA baseball."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This basketball player, drafted by the Cleveland Cavaliers in 2003, is famous for doing commercials for Sprite, Nike, and Upper Deck.",
      "options": [
        "Kellen Winslow III",
        "Bob Lemon",
        "LeBron James",
        "Brad Daugherty"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "These NHL relatives were known as the Rocket and the Pocket Rocket.",
      "options": [
        "Maurice and Henri Richard",
        "Bobby and Brett Hull",
        "Brent and Brian Sutter",
        "Frank and Peter Mahavolich"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What uniform number did baseball player Johnny Bench wear while with the Reds?",
      "options": [
        "15",
        "10",
        "5",
        "14"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Big Don No-Hit Larson pitched a perfect game for the Yankees. What was extra special about his perfect game?",
      "options": [
        "It lasted over three hours.",
        "Larson hit two homers to win the game for the Yankees.",
        "It was played in the World Series.",
        "It was played in the American League Championship series."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In which branch of the military did Ted Williams serve?",
      "options": [
        "Army",
        "Air Force",
        "Navy",
        "Marines"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "The award for the top pitcher in each of the two major leagues is named after which Hall of Fame pitcher?",
      "options": [
        "Cy Young",
        "Tom Seaver",
        "None Of These",
        "Don Drysdale"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What was the name of Newsweeks unsuccessful sports publication?",
      "options": [
        "The Week in Sports",
        "Inside Sports",
        "Sports Weekly",
        "Sports Newsweek"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "He was born in 1987 and is considered one of the top player in his sport. He was nicknamed The Next One.",
      "options": [
        "Tiger Woods",
        "Sidney Crosby",
        "Evan Longoria",
        "LaDamien Tomlinson"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "He was the first player selected in the first NFL draft in 1936.",
      "options": [
        "Jay Berwanger",
        "Tommy Harmon",
        "Bill Dudley",
        "George Halas"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Of all the great players\u2019 numbers retired by the Montreal Canadiens, one number has actually been retired more than once. Which number is it?",
      "options": [
        "12",
        "10",
        "9",
        "1"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "In which World Series did the New York Yankees become world champions led by Mantle and Berra?",
      "options": [
        "1959",
        "1957",
        "1960",
        "1958"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What was the first Hardcore title change at SummerSlam?",
      "options": [
        "Bossman Vs Hardcore Holly",
        "Hardcore Holly Vs Crash Holly",
        "Crash Holly Vs Mean Street Posse",
        "Al Snow Vs Bossman"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Georgia won the Southeastern Conference title in 2005 and in 2003 defeating which two teams?",
      "options": [
        "Tennessee and Alabama",
        "Auburn and LSU",
        "Alabama and Auburn",
        "Arkansas and LSU"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following soccer teams is not from Cyprus?",
      "options": [
        "Omonia",
        "Appolon",
        "Kerkira",
        "AEK Larnaca"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "What is the capacity of the Twickenham Stadium?",
      "options": [
        "82,000",
        "97,000",
        "75,000",
        "67,000"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these famous Italians are known as A.C Milan fans?",
      "options": [
        "Laura Pausini and Cristina Scabbia",
        "Verdi and Rafaelo",
        "Luciano Pavarotti and Luca Damiano",
        "Mussolini and Gratsiani"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what was billed as the Battle of the Sexes, tennis champ Billie Jean King didnt show any love as she won this match in straight sets. Who did Billie Jean King beat to win the Battle of the Sexes?",
      "options": [
        "Bjorn Borg",
        "Jimmy Conners",
        "Bobby Riggs",
        "Vitas Gerulaitis"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Danny Boyle, the artistic director of 2012 Summer Olympics Opening Ceremony, won an Academy Award for which of the following movies?",
      "options": [
        "Slumdog Millionaire",
        "28 Days Later",
        "Shallow Grave",
        "Trainspotting"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Who did Muhammad Ali beat to get the boxing crown the second time?",
      "options": [
        "George Foreman",
        "Joe Frazier",
        "Ken Norton",
        "Ernie Terrell"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "The first perfect game played in Calfornia was played in this city.",
      "options": [
        "Los Angeles",
        "Oakland",
        "San Francisco",
        "San Diego"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What is the name of Tony Hawks father?",
      "options": [
        "Steve Hawk",
        "Riley Hawk",
        "Spencer Hawk",
        "Frank Hawk"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Name the oldest pitcher of the 2008 Philadelphia Phillies.",
      "options": [
        "J.C. Romero",
        "Jamie Moyer",
        "Brad Lidge",
        "Bret Myers"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "This tennis players nickname is Mr Boom Boom.",
      "options": [
        "Pete Sampras",
        "Ivan Lendl",
        "Boris Becker",
        "Michael Cheng"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which professional wrestler had won more titles than any other wrestler until he became King of the Ring in 2006?",
      "options": [
        "Shawn Michaels",
        "Sting",
        "Bret Hart",
        "Booker T"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "This sport, which evolved from the medieval sports of caid and cnapean, is played with either 13 or 15 players. (There are two modern variants.)",
      "options": [
        "Rugby",
        "Soccer",
        "Croquet",
        "Curling"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which of these NFL quarterbacks retired in 2009 as the record holder for most passing yards gained in a career?",
      "options": [
        "Dan Marino",
        "Sammy Baugh",
        "Fran Tarkenton",
        "Brett Farve"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What famous football player stated, The word genius isnt applicable in football. A genius is a guy like Norman Einstein.?",
      "options": [
        "John Elway",
        "Joe Namath",
        "Joe Theisman",
        "Brett Favre"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The 2004 Boston Red Sox played 13 extra inning games during the regular season. How many of them did they win?",
      "options": [
        "5",
        "9",
        "7",
        "11"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In1986 the Penn State Nittany Lions football team won their which National Championship?",
      "options": [
        "First",
        "Third",
        "Second",
        "Fifth"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which team captured the NHL title and the coveted Stanley Cup for the 1997-1998 season?",
      "options": [
        "Colorado Avalanche",
        "Washington Capitals",
        "Detroit Red Wings",
        "Buffalo Sabres"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What television network carried the popular sitcom Coach?",
      "options": [
        "ABC",
        "NBC",
        "CBS",
        "TBS"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which of these real-life jockeys, chosen as one of People Magazines 50 Most Beautiful People in 2003, played another real-life jockey in Seabiscuit?",
      "options": [
        "Julie Krone",
        "Billy Barty",
        "Edgar Prado",
        "Gary Stevens"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was The Rocks tag team partner when he battled Evolution at Wrestlemania XX?",
      "options": [
        "Stone Cold Steve Austin",
        "Mick Foley",
        "Hulk Hogan",
        "Ric Flair"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This Olympic great was one of Robert F. Kennedys personal bodyguards.",
      "options": [
        "Rafer Johnson",
        "Al Oerter",
        "Ray Ewry",
        "Rosey Grier"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Eddie Feigner, Cat Osterman, and Lisa Fernandez became well known for practicing this sport.",
      "options": [
        "Softball",
        "Billiards",
        "Golf",
        "Canopying"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In the 1956 World Series against the Brooklyn Dodgers, Yogi Berra caught a very special game. What is untrue about the game?",
      "options": [
        "Don Larson pitched for the Yankees.",
        "There is a famous photo of Yogi jumping into the arms of the Yankee pitcher.",
        "Yogi hit a grand slam in the second inning.",
        "Sal Maglie pitched for the Dodgers."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What is a dao?",
      "options": [
        "Stance",
        "Sword",
        "Form",
        "Martial art"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "What famous basketball players father was murdered on July 23, 1993?",
      "options": [
        "Shaq",
        "David Robinson",
        "Magic Johnson",
        "Michael Jordan"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What school was the first to represent the Sun Belt Conference with an At-Large bid to a Bowl Game?",
      "options": [
        "University of North Texas",
        "Troy University",
        "Arkansas State University",
        "University of Louisiana at Lafayette"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In what country were the 2008 Summer Olympics held?",
      "options": [
        "Greece",
        "Japan",
        "United States",
        "China"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This team, led by head coach James Tressel, won the 2002 NCAA championship, beating Miami in overtime.",
      "options": [
        "Miami",
        "USC",
        "LSU",
        "Ohio State"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This quarterback from Louisiana Tech was the first player selected in the 1970 NFL Draft by the Pittsburgh Steelers.",
      "options": [
        "Troy Aikman",
        "Jim Plunkett",
        "Ron Yary",
        "Terry Bradshaw"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The Detroit Tigers defeated the San Diego Padres in the 1984 World Series. The Tigers clinched the series in game 5 when Kirk Gibson hit a three-run homerun off of this famous closer (pitcher).",
      "options": [
        "Steve Bedrosian",
        "Donnie Moore",
        "Bruce Sutter",
        "Goose Gossage"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In this movie, the protagonist pitched a perfect game in his first pro baseball game.",
      "options": [
        "For Love of the Game",
        "The Scout",
        "The Best Day",
        "Maybe a Miracle"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which of these is considered the most common foul in timed roping rodeo events?",
      "options": [
        "Improper roping",
        "Animal abuse",
        "Breaking the barrier",
        "Improper equipment"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This great kicker was a Danish soccer star as a teenager. He was a visiting high school student in Indianapolis when he kicked a field goal, just to try it. This led to a scholarship to Michigan State and a fine Pro career.",
      "options": [
        "Jay Feely",
        "Morten Andersen",
        "Gary Anderson",
        "Jan Stenerud"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Reggie Jackson was inducted into the Baseball Hall of Fame in 1993. Which team did he start his career with?",
      "options": [
        "Angels",
        "Orioles",
        "Athletics",
        "Yankees"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What two teams were playing when Randy Johnson pitched a perfect game on May 18, 2004?",
      "options": [
        "Arizona Diamondbacks and the New York Yankees",
        "Atlanta Braves and the New York Yankees",
        "Arizona Diamondbacks and the Atlanta Braves",
        "New York Yankees and Boston Red Soxs"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In tennis, what are the two shots that are the same movement?",
      "options": [
        "Lob/Serve",
        "Volley/Forehand",
        "Serve/Overhead",
        "Forehand/Backhand"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "The Peanuts characters played baseball frequently. Who isnt matched with their usual position?",
      "options": [
        "Lucy - 1st base",
        "Pig Pen - Third base",
        "Schroeder - Catcher",
        "Charlie Brown - Pitcher"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "This 2009 film deals with Nelson Mandelas use of an integrated South African rugby team to help unify his nation.",
      "options": [
        "A Serious Man",
        "Scrum",
        "Invictus",
        "The Objective"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "How many meters can be swum underwater in swimming races from the start and from each turn?",
      "options": [
        "5",
        "20",
        "15",
        "10"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which Spanish football team is nicknamed Los Cules, or The Bottoms?",
      "options": [
        "Real Oviedo",
        "Real Madrid",
        "FC Barcelona",
        "Valencia"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In which city did a 2002 figure skating judging scandal result in the awarding of two Olympic gold medals?",
      "options": [
        "Salt Lake City",
        "Innsbruck",
        "Lillehammer",
        "Calgary"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The EHF Champions League is a major competition in this sport.",
      "options": [
        "Volleyball",
        "Football",
        "Basketball",
        "Handball"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Who was the Boston Bruins head coach during their 1971-1972 Stanley Cup winning season?",
      "options": [
        "Bep Guidolin",
        "Don Cherry",
        "Tom Johnson",
        "Harry Sinden"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "What uniform number did Walter Payton wear when he played for the Bears?",
      "options": [
        "99",
        "54",
        "29",
        "34"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The following words originated from what language: canoe, hurricane, and hammock?",
      "options": [
        "Taino",
        "Techetulan",
        "Tanzanian",
        "Tagalog"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of these teams did Wayne Gretzky play for?",
      "options": [
        "Los Angeles Kings",
        "Detroit Red Wings",
        "Chicago Blackhawks",
        "Pittsburgh Penguins"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "What sport did The King of Queens character Doug Heffernan play in high school?",
      "options": [
        "Baseball",
        "Football",
        "Lacrosse",
        "Bowling"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which UEFA member cannot have a team in the Champions League?",
      "options": [
        "San Marino",
        "Bosnia and Herzegovina",
        "Andorra",
        "Liechtenstein"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what state is the Sikeston Jaycee Bootheel Rodeo held?",
      "options": [
        "Missouri",
        "Michigan",
        "Montana",
        "Mississippi"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "80% of the competitors in the 1904 Olympic games were from which country?",
      "options": [
        "France",
        "Greece",
        "The USA",
        "Australia"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This great player was in seven Pro Bowls, and was a seven time All-League Cornerback. He played from 1967-1977 for the Detroit Lions.",
      "options": [
        "Ken Riley",
        "Lem Barney",
        "J.C.Caroline",
        "Dennis Smith"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "The New York Mets lost to which team in the 1988 NLCS?",
      "options": [
        "CIncinatti Reds",
        "Los Angeles Dodgers",
        "Atlanta Braves",
        "San Diego Padres"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which team won the 1993 Little League World Series?",
      "options": [
        "Long Beach, Ca.",
        "Norwalk, CT.",
        "Birmingham, AL.",
        "Houston, TX."
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What was the name of the minor league baseball team, featured in the 1987 movie Long Gone starring William L. Peterson?",
      "options": [
        "Tampa Cigars",
        "Tampico Stogies",
        "St. Pete. Cardinals",
        "St. Peter."
      ],
      "answerIndex": 1,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The Cardinals beat the Mets to gain entry into the 2006 World Series. What made Mookie Wilson, a former Mets star, so happy?",
      "options": [
        "Mookie lives in St. Louis.",
        "Preston Wilson, his nephew, plays for the Cardinals.",
        "Preston Wilson, his stepson, plays for the Cardinals.",
        "Preston Wilson, his nephew and stepson, plays for the Cardinals."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who set an NFL record for most passing yards gained in a game in 1951?",
      "options": [
        "Kenny Stabler",
        "Peyton Manning",
        "Norm Van Brocklin",
        "Joe Montana"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "In 1987 the first World Beach Volleyball Championships was played in this country.",
      "options": [
        "the Netherlands",
        "Russia",
        "the USA",
        "Brazil"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "How many times was Johnny Vander Meer selected to the National League All-star team?",
      "options": [
        "5",
        "6",
        "4",
        "7"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Music plays an important role in the French style of bullfighting, course camarguaise. What music is played every time something impressive happens in the arena?",
      "options": [
        "Richard Wagner - Die Walk\u00fcre (The Valkyrie).",
        "Maurice Ravel - Lheure espagnole.",
        "Georges Bizet - Carmen",
        "Claude Debussy - En blanc et noir"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What city did the Seattle Pilots move to?",
      "options": [
        "Atlanta",
        "Washington",
        "Milwaukee",
        "San Francisco"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "The Detroit Red Wings won their first Stanley Cup, after defeating the Toronto Maple Leafs in what year?",
      "options": [
        "1934",
        "1925",
        "1936",
        "1959"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "He played in the NFL from 1987-2003 after his college career at Purdue. Throughout most of his defensive backs career he played in Pittsburgh. He became a TV analyst for ESPN.",
      "options": [
        "Terry Bradshaw",
        "Jack Youngblood",
        "Rod Woodson",
        "Herb Adderley"
      ],
      "answerIndex": 2,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "What slang term is applied to a batsmans score of 0 in cricket?",
      "options": [
        "Quail",
        "Duck",
        "Goose",
        "Turkey"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "When was the Missouri Tigers first conference championship?",
      "options": [
        "1975-76",
        "1929-30",
        "1920-21",
        "1917-18"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What is the most popular sport in the Dominican Republic?",
      "options": [
        "Baseball",
        "Basketball",
        "Handball",
        "Football"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "In 1984, the New York Jets began playing their home games in this state.",
      "options": [
        "New York",
        "New Jersey",
        "Pennsylvania",
        "Georgia"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "A golf player hits the ball from the tee onto the green and in the hole all in one shot. What is this called?",
      "options": [
        "Birdie",
        "Bogey",
        "Hole-in-one",
        "Holed"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This would-be jockey became the heartthrob of the made for TV band The Monkees.",
      "options": [
        "Davy Jones",
        "Dave Coulier",
        "David Cross",
        "Dave Thomas"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who became owner of Major League Baseball, New york Mets in 1961?",
      "options": [
        "Lorinda De Roulet",
        "Joan Payson",
        "Nelson Doubleday",
        "M. Donald Grant"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following statements about the position of the catcher in baseball is true?",
      "options": [
        "The catcher is the only player in professional sports who is in foul territory before each play.",
        "There is no limit on the maximum size for a catchers mitt.",
        "Every team is required to have at least three catchers on their roster.",
        "The catcher almost always bats last or next to last."
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The Indianapolis Motor Speedway is known to many fans as \u201cThe Brickyard\u201d because it was once surfaced with 3.2 million bricks which replaced its original surface to make it safer for racing. What was the Speedway originally surfaced with?",
      "options": [
        "Cobblestone",
        "Crushed rock and Tar",
        "Concrete",
        "Sand and saw dust"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "On May 14, 1904, the first Olympic Games to be held in the U.S. opened in what city?",
      "options": [
        "St. Louis",
        "Chicago",
        "Lake Placid",
        "Los Angeles"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This universitys symbol, a golden eagle, soared over the crowd to help begin the 2002 Winter Olympics at Salt Lake City, Utah. This year War Eagle VII will soar above the stadium to the cry of War Eagle! War Eagle! What university is home to the War Eagle named Tiger?",
      "options": [
        "Brown",
        "Auburn",
        "UCLA",
        "Princeton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which is the nickname of North Carolina and of the University of North Carolina at Chapel Hill?",
      "options": [
        "Hoyas",
        "Buckeyes",
        "Bruins",
        "Tar Heels"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "What was the nickname of Oregon State University in 2006?",
      "options": [
        "Beavers",
        "Badgers",
        "Ducks",
        "Birds"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "This second baseman played for the Chicago Cubs in the 1980s.",
      "options": [
        "Frank Grant",
        "Ryne Sandberg",
        "Tony Lazzeri",
        "Frankie Frisch"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which of these soccer teams is based in Poland?",
      "options": [
        "Skonto FC",
        "Metalist Kharkiv",
        "Korona Kielce",
        "Zimbru Chisinau"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "At which stadium was the 2006 FIFA World Cup final held?",
      "options": [
        "Olympiastadium (Berlin)",
        "Signal Iduna Park (Dortmund)",
        "Allianz Stadium (Munich)",
        "Aol Arena (Hamburg)"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This baseball star won his only MVP award in 1923.",
      "options": [
        "Roy Campanella",
        "Willie Mays",
        "Babe Ruth",
        "Yogi Berra"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "In 1972 the Yankees retired Yogi Berras uniform number. What was the number?",
      "options": [
        "7",
        "32",
        "8",
        "12"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Known as Charlie Hustle, this player played with Cincinnati, Montreal, and Philadelphia.",
      "options": [
        "Pete Rose",
        "Hank Aaron",
        "Gary Templeton",
        "Tony Perez"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who was the head coach at Florida State, who preceded Bobby Bowden?",
      "options": [
        "Bill McCartney",
        "Darrell Mudra",
        "Lee Corso",
        "None Of These"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What Dominican Republic born baseball player, played shortstop for the New York Mets in 1979?",
      "options": [
        "Mike Phillips",
        "Tim Foli",
        "Frank Taveras",
        "Ray Sadecki"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "This swimmer won three silver medals at the 2008 Olympics at the age of 40.",
      "options": [
        "Ian Thorpe",
        "Jeanne Llwellyn",
        "Janice Forde",
        "Dara Torres"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Michael Jordan returned to the NBA twice. After his first return in 1995, he led the Chicago Bulls to three titles. What statement is true about his second return in 2001?",
      "options": [
        "He played for the Washington Wizzards and led them to their first title ever.",
        "He led the Chicago Bulls to another title.",
        "He joined the Washington Wizzards but his team did not did not qualify for the play-offs.",
        "He returned to the Chicago Bulls, but played mostly as a substitute."
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1963 the National Football League suspended these two players for gambling.",
      "options": [
        "Paul Hornung and Mike Lucci",
        "Art Schlichter and Mike Lucci",
        "Paul Hornung and Alex Karras",
        "Paul Hornung and Pete Rose"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who were the first two losing teams in the Super Bowl?",
      "options": [
        "Rams and Eagles",
        "Chiefs and Raiders",
        "Falcons and Colts",
        "Chiefs and Packers"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "What is the first Major League baseball franchise to lose more than 9,000 games?",
      "options": [
        "Brooklyn/Los Angeles Dodgers",
        "Cincinnati Reds",
        "Chicago Cubs",
        "Philadelphia Phillies"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What year was Ewell Blackwell elected to the Reds Hall of Fame?",
      "options": [
        "1963",
        "1961",
        "1960",
        "1962"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Dan and Darlene bonded by playing this sport in the backyard.",
      "options": [
        "Football",
        "Basketball",
        "Hockey",
        "Pitch and Catch"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "How many red balls are in a game of snooker?",
      "options": [
        "3",
        "1",
        "15",
        "8"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of these statements about famous baseball catchers is incorrect?",
      "options": [
        "Clint Courtney was the first catcher to wear an oversized mitt",
        "Clint Courtney was the first catcher to wear glasses",
        "Mike Piazza was the first catcher to hit 50 homers and 200 hits in a season",
        "Yogi Berra hit the first pinch hit home run in the World Series"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the first pitcher in major league baseball history to strike out over 3000 batters but to have less than 1000 bases on balls?",
      "options": [
        "Nolan Ryan",
        "Don Newcombe",
        "Sandy Koufax",
        "Ferguson Jenkins"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who built the tennis court that is in the Hampton Court in England?",
      "options": [
        "King Henry VIII",
        "Ben Franklin",
        "Winston Churchill",
        "Christopher Wren"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the first Houston Astros player ever to win the Rookie of the Year Award?",
      "options": [
        "Brad Ausmus",
        "Jeff Bagwell",
        "Lance Berkman",
        "Craig Biggio"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Probably the greatest player of all time at his position, Johnny Bench was elected to the Hall of Fame in 1989.",
      "options": [
        "Left Field",
        "Shortstop",
        "Right Field",
        "Catcher"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In what year did General Motors decide to drop GTO as a separate model and reinstate the GTO as an option package for the LeMans and LeMans sport coupes?",
      "options": [
        "1972",
        "1981",
        "1971",
        "1975"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Where were the NBA Hawks located, before moving to Atlanta?",
      "options": [
        "Cincinnati, OH",
        "St. Louis,MO",
        "Syracuse, NY",
        "Rochester, NY"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Which Baseball Hall of Famer is credited with throwing the first curveball?",
      "options": [
        "William Arthur Cummings",
        "Martyn Stephen Darrow",
        "Denton True Young",
        "Harold Joseph Chandler"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Robin Williams passion for a certain sport resulted in his massive collection of these objects.",
      "options": [
        "Boxing gloves",
        "Bicycles",
        "Baseballs",
        "Tennis rackets"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "This NHL goalie won the Rookie of the Year in 1952 with the New York Rangers. Known as Gump, he was one of the last goalies to play the position without a mask.",
      "options": [
        "Johnny Bower",
        "Lorne Worsley",
        "Glenn Hall",
        "Terry Sawchuck"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This golf course, the venue for the 2007 PGA Championship, was established in 1936.",
      "options": [
        "Crooked Stick, Carmel Indiana",
        "Sahalee, Redmond Washington",
        "Southern Hills, Tulsa Oklahoma",
        "Inverness, Toledo Ohio"
      ],
      "answerIndex": 2,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "This baseball player, who started his career with the Texas Rangers in 1991 at the age of 19, is known as Pudge.",
      "options": [
        "Alfonso Soriano",
        "Doug Mirabelli",
        "Ivan Rodriguez",
        "Rusty Greer"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What school won the 2006 ACC Mens Basketball Tournament Championship?",
      "options": [
        "Wake Forest",
        "NC State",
        "Duke",
        "UNC"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Which of the following is a Hypermodern opening?",
      "options": [
        "Sicilian Defense",
        "Benko Gambit",
        "Queens Gambit",
        "English Opening"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What delicious nickname is used to refer to the English football club Everton?",
      "options": [
        "The Truffles",
        "The Toffees",
        "The Chocolates",
        "The Caramels"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Five players were elected to the Baseball Hall of Fame in the first balloting in 1936. The first four were Ty Cobb, Babe Ruth, Honus Wagner, Christy Mathewson. Who was the fifth inductee?",
      "options": [
        "Cy Young",
        "Nap Lajoie",
        "Walter Johnson",
        "Clark Griffith"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What sport does the team Indiana Pacers compete in?",
      "options": [
        "Ice hockey",
        "Basketball",
        "Baseball",
        "American football"
      ],
      "answerIndex": 1,
      "difficulty": 1
    },
    {
      "prompt": "Which city has been chosen to host the 2012 Olympics, thus becoming the first three-time Olympic host city?",
      "options": [
        "Los Angeles",
        "Innsbruck",
        "Paris",
        "London"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "In dogsled racing, a timed competition of teams consisting of a number of sleddogs and a dog driver, what is the name of the short neckline snapped to each dog\u2019s collar?",
      "options": [
        "neckline",
        "gangline",
        "tugline",
        "shock cord"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "The first night baseball game to be played at Wrigley Field in Chicago happened on which date?",
      "options": [
        "August 8, 1988",
        "August 9, 1988",
        "July 8, 1977",
        "July 7, 1977"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 1995, this professional basketball player, nicknamed The Big Ticket and The Kid was drafted out of high school to Minnesota Timberwolves.",
      "options": [
        "Kenny Anderson",
        "Jason Kidd",
        "Kevin Garnett",
        "Tim Hardaway"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Which one of the following players hit for more than 40 home runs during any season throughout his MLB career?",
      "options": [
        "Roberto Clemente",
        "Bo Jackson",
        "Joe Dimaggio",
        "Joe Torre"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Where did karate originally begin?",
      "options": [
        "Malaysia",
        "China",
        "Indonesia",
        "Japan"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This Canadian political figure had his #29 retired by the Montreal Canadiens on January 29, 2007.",
      "options": [
        "Ken Dryden",
        "Brian Mulroney",
        "Steven Harper",
        "Guy Lafleur"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In 2003-04, who became the new owner of Chelsea?",
      "options": [
        "Ivan Abramovich",
        "Malcolm Glaizer",
        "Not listed here as an option",
        "Roman Abramovich"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "What is the collective nickname of Dale Earnhardt, Jr.s friends from his hometown?",
      "options": [
        "Beach Bums",
        "Magnificent 7",
        "Three Musketeers",
        "Dirty Mo Posse"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which 68 reliever played for the New York Mets during the 1992 season?",
      "options": [
        "Eric Hillman",
        "Joe Vitko",
        "Spud Webb",
        "Randy Johnson"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "It was the most famous artistic work of ancient Greece. The statue was made of gold and ivory and presided over the Olympic games. The games were forbidden, accused of being pagan in the 5th century by Emperor Theodosius I. Later, the statue disappeared and its fate has been unknown since.",
      "options": [
        "The Ziggurat of Marduk",
        "The Statue of Zeus at Olympia",
        "The Parthenon",
        "The Colossus of Helios at Rhodes"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This team moved to Detroit in 1957. It was founded by Fred Zollner in 1940.",
      "options": [
        "Knicks",
        "Warriors",
        "Lakers",
        "Pistons"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "Which of these lacrosse teams was founded in Chicago?",
      "options": [
        "Machine",
        "Barrage",
        "Pride",
        "Bayhawks"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "What was the name of the basketball coach in the TV series The White Shadow?",
      "options": [
        "Coach Howard",
        "Coach Bernard",
        "Coach Willis",
        "Coach Reeves"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "In what year did the Southern California Trojans finish the football season untied and undefeated for the fourth time in the teams history?",
      "options": [
        "2002",
        "1990",
        "2004",
        "2000"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Some of the swimming events at the 2012 Olympic Games were held in this venue, which also hosts a race every Christmas morning for the Peter Pan Cup.",
      "options": [
        "the Thames",
        "the Serpentine",
        "the Avon",
        "the English Channel"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This Michael made his career as a football player for Liverpool. He was named European Footballer of the Year in December 2001.",
      "options": [
        "Michael Owen",
        "Michael Johnson",
        "Mike Tyson",
        "Michael Bolton"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which one of the following schools was NOT added to the Atlantic Coast Conference in 2004 and 2005?",
      "options": [
        "Miami",
        "Virginia",
        "Boston College",
        "Virginia Tech"
      ],
      "answerIndex": 1,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "These are the only two original NBA teams that never moved.",
      "options": [
        "Knicks and Celtics",
        "Bulls and Celtics",
        "Warriors and Bulls",
        "Warriors and Knicks"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "On January 19, 2000, Jordan returned to the NBA not as a player, but as part owner and President of Basketball Operations of which team?",
      "options": [
        "The Chicago Bulls",
        "The Washington Wizards",
        "The Los Angeles Clippers",
        "The Indiana Pacers"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "In 2000, this man became the first Italian swimmer to receive a gold medal in the Olympic Games, winning both 100m and 200m breaststroke races.",
      "options": [
        "Davide Rummolo",
        "Emanuelle Merisi",
        "Giorgio Lamberti",
        "Domenico Fioravanti"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "The players of which of these baseball teams do NOT wear green uniforms on St. Patricks Day?",
      "options": [
        "Pittsburgh Pirates",
        "New York Yankees",
        "Boston Red Sox",
        "St. Louis Cardinals"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The Open Championship was first played on 17 October 1860 at this golf course.",
      "options": [
        "Prestwick",
        "St. Andrews",
        "Royal Birkdale",
        "Lahinch Golf Club"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "What nation won the fourth World Cup (of football/soccer) in 1950?",
      "options": [
        "England",
        "Brazil",
        "France",
        "Uruguay"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "The New York Yankees got pitcher Bob Sykes in return for this two time batting champion.",
      "options": [
        "Jay Buhner",
        "Fred McGriff",
        "Willie McGee",
        "Bill Madlock"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What number did Kirby Puckett, who was elected to the Baseball Hall of Fame in 2001, wear when he was a player for the Minnesota Twins?",
      "options": [
        "34",
        "18",
        "14",
        "32"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Find the true statement about Lisa Leslie.",
      "options": [
        "She was the first woman to dunk a basketball in the WNBA.",
        "She was the first woman to score 60 points in a WNBA game.",
        "She was the first woman to play in the NBA.",
        "She was the first leading scorer in the WNBA."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "The first player form the University of Southern California to win the Outland Trophy (for best college lineman) became a solid left offensive tackle for the Minnesota Vikings. Who is he?",
      "options": [
        "Winston Justice",
        "Ron Yary",
        "Shaun Cody",
        "Sam Baker"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What is the only non-public university that is a member of the Sun Belt Conference?",
      "options": [
        "University of South Alabama",
        "Troy University",
        "University of Denver",
        "University of New Orleans"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In 1978, Muhammad Ali lost to this boxer but then defeated him later that year, thus regaining the heavyweight championship title for a record 3rd time.",
      "options": [
        "Joe Frazier",
        "Leon Spinks",
        "Joe Bugner",
        "Ken Norton"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "This defense to the first move P-K4 involves the move P-QB3. It is considered solid, and was a favorite of world champion Anatoly Karpov.",
      "options": [
        "Sicilian Defense",
        "Nimzovitch Defense",
        "Caro-Kann Defense",
        "French Defense"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "This NFL team established their dominance in the 1980s, winning three Super Bowls during the decade.",
      "options": [
        "Pittsburgh Steelers",
        "Green Bay Packers",
        "San Francisco 49ers",
        "Washington Redskins"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Where did New Jersey Net guard Jason Kidd go to college?",
      "options": [
        "California",
        "UCLA",
        "USC",
        "Arizona"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Who is the owner of the Denver Broncos?",
      "options": [
        "Pat Bowlen",
        "Jon Litner",
        "Coin Baden",
        "Kevin Plank"
      ],
      "answerIndex": 0,
      "difficulty": 1
    }
  ],
  [
    {
      "prompt": "In 2004, this company acquired Warrior Lacrosse, the manufacturer of lacrosse equipment.",
      "options": [
        "New Balance",
        "STX",
        "Nike",
        "Under Armour"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In the movie Major League, Jakes girlfriend Lynn, played by Rene Russo, is a former Olympic swimmer. What Olympics did she qualify for?",
      "options": [
        "1976 in Montreal",
        "1988 in Seoul",
        "1984 in Los Angeles",
        "1980 in Moscow"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Ever since the MLBs live ball era, which began in 1920, home runs have become more popular and more abundant. Which of the following is the only decade that has not had a player hit for at least 50 home runs?",
      "options": [
        "1920",
        "1960",
        "1940",
        "1980"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Pele, probably the most famous soccer player ever, retired in 1974 after having won three world championships with Brazil. He returned a few months later and joined which club?",
      "options": [
        "New York Cosmos, USA",
        "He did not join any club, but he still played for the Brazilian national team.",
        "Santos, Brazil",
        "Real Madrid, Spain"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Which Bulgarian soccer star played for FC Barcelona in the years when they were famous as \u201cDream Team\u201d?",
      "options": [
        "Dimitar Berbatov",
        "Hristo Ivanov",
        "Trifon Ivanov",
        "Hristo Stoichkov"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Which one of these baseball players was known as The Bird?",
      "options": [
        "Mark Fidrych",
        "Joe Medwick",
        "Steve Hamiliton",
        "Howard Earl Averill"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "In what year did Glen Sather become President and GM of the New York Rangers?",
      "options": [
        "2003",
        "2005",
        "2000",
        "1995"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Who was the Goalie acquired from the Buffalo Sabres who played for the Pittsburgh Penguins in their first two Stanley Cup victories?",
      "options": [
        "Tom Barrasso",
        "Bruce Racine",
        "Wendell Young",
        "Frank Pietrangelo"
      ],
      "answerIndex": 0,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "Which team won Treble in 1999?",
      "options": [
        "Arsenal",
        "Liverpool",
        "Manchester United",
        "Chelsea"
      ],
      "answerIndex": 2,
      "difficulty": 1
    },
    {
      "prompt": "Swimming champion Dara Torres retired and returned two times. Which statement about her comebacks is true?",
      "options": [
        "Her first return, in Sydney, earned her 3 silver medals but the second time, in Beijing, she was not successful.",
        "She won 3 Olympic silver medals the first time, but failed to qualify the second time for the Beijing Olympic team.",
        "Her first return in 2000, after giving birth, was a disaster, but the second time she won 5 medals at the Olympics in Sydney.",
        "She won a gold medal and four other medals in Sydney (2000) and three silver medals in Beijing (2008)."
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "At the age of 14 she became the youngest-ever female Olympic champion in swimming. She is the first female swimmer to have ever won the same swimming event at 3 consecutive Summer Olympics.",
      "options": [
        "Jennifer Thompson",
        "Krisztina Egerszegi",
        "Kyoko Iwasaki",
        "Franziska van Almsick"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Besides being co-owner of Chance 2 Motorsports, what other company does Dale Earnhardt Jr. own?",
      "options": [
        "Earnhardt Racing Co.",
        "JR Inc.",
        "JR Motorsports",
        "Second Chance Driving"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "In a relay race, which swimmer is called an anchor?",
      "options": [
        "the second fastest",
        "the one who swims last",
        "the slowest",
        "the one who swims first"
      ],
      "answerIndex": 1,
      "difficulty": 2
    },
    {
      "prompt": "Bjorn Borg shocked the tennis world when he retired in his prime years (he was only 25 and was at the top). What did he achieve when he returned in the early 1990s?",
      "options": [
        "He failed to win a single match in 10 consecutive tournaments.",
        "He won all Grand Slam tournaments.",
        "He became the Olympic Champion.",
        "He appeared in four Grand Slam finals, but failed to win anything."
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "What is a rabbit punch in boxing?",
      "options": [
        "A punch with the inside of the glove",
        "A hit with a head",
        "A punch to the back of the neck",
        "A punch to the lower back"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which of these former MLB players has the most career RBIs?",
      "options": [
        "Hank Aaron",
        "Brad Wilkerson",
        "Lou Gehrig",
        "Babe Ruth"
      ],
      "answerIndex": 0,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "Who was the winning captain of the inaugural ICC World Cup tournament?",
      "options": [
        "Garry Gilmour",
        "Vivian Richards",
        "Clive Lloyd",
        "AIvin Kallicharran"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "Which answer best describes how many Congressional Medal of Honor medals were awarded during the Civil War",
      "options": [
        "Between 1200 and 2000",
        "Between 2000 and 4000",
        "Between 600 and 1200",
        "Less than 600"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "This movie tells the story of a woman who becomes the coach of the New York Knicks.",
      "options": [
        "White Men Cant Jump",
        "Eddie",
        "Drive , She Said",
        "Rebound"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Which Argentinean top goal scorer played most of his career for the famous 1950s Real Madrid team as they dominated the European Club Cup?",
      "options": [
        "Alfredo Di Stefano",
        "Diego Maradona",
        "George Best",
        "Zinedine Zidane"
      ],
      "answerIndex": 0,
      "difficulty": 3
    },
    {
      "prompt": "Several countries had only one representative at the 2008 Olympic Games. Which is not one of them?",
      "options": [
        "Timor-Leste",
        "Haiti",
        "Nauru",
        "Grenada"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which U.S. president had the first bowling alley put in the White House?",
      "options": [
        "Taft",
        "Eisenhower",
        "Truman",
        "Nixon"
      ],
      "answerIndex": 2,
      "difficulty": 2
    },
    {
      "prompt": "On what date did the Toronto Blue Jays play their first regular season game?",
      "options": [
        "May 7, 1976",
        "April 7, 1978",
        "May 7, 1977",
        "April 7, 1977"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "What was the name of the Pittsburgh Steelers when the team was founded in 1933?",
      "options": [
        "Steelers",
        "Millers",
        "Gridirons",
        "Pirates"
      ],
      "answerIndex": 3,
      "difficulty": 2
    }
  ],
  [
    {
      "prompt": "In what year was the NCAA Mens Basketball Tournament founded?",
      "options": [
        "1907",
        "1917",
        "1956",
        "1939"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "Which Dutch speed skater, postman by profession, set a world record at the 1976 Winter Olympics?",
      "options": [
        "Hans van Helden",
        "Dan Immerfall",
        "Sten Stensen",
        "Piete Kleine"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "This Old Timer, known as Dizzy Dean, pitched twelve years for the St. Louis Cardinals, Chicago Cubs, and St. Louis Browns.",
      "options": [
        "Peter Paul",
        "Marvin Edward",
        "Jay Hanna",
        "Henry Haymaker"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "Who was the trainer of thoroughbred race horse, Seabiscuit, that rarely spoke?",
      "options": [
        "John Smith",
        "James Fitzsimmons",
        "Richard Fitzsimmons",
        "Tom Smith"
      ],
      "answerIndex": 3,
      "difficulty": 2
    },
    {
      "prompt": "He was the coach of the first American football team to have numbers on their uniforms.",
      "options": [
        "George Halas",
        "Pop Warner",
        "Knute Rockne",
        "Amos Alonzo Stagg"
      ],
      "answerIndex": 3,
      "difficulty": 3
    },
    {
      "prompt": "Who was the oldest player in the 2004 Red Sox team?",
      "options": [
        "Ellis Burks",
        "Mike Timlin",
        "Curt Schilling",
        "Tim Wakefield"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "I was the third baseman for the Yankees when Dave Righetti threw his no hitter in 1983. Who am I?",
      "options": [
        "Fred Stanley",
        "Mike Pagliarulo",
        "Bert Campaneris",
        "Graig Nettles"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "What did the football teams of Syracuse, Alabama, and Penn State have in common in 1965?",
      "options": [
        "They were the only unbeaten teams in Div I football",
        "All three averaged more than 500 yds offense per game",
        "All three had assistant coaches elevated to head coaches before midseason",
        "All three had the players number on their helmets"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ],
  [
    {
      "prompt": "In 1979, this wrestler won the PWI Rookie of the year award, by the name of Sweet Brown Sugar. He went on to lose all three of his Wrestlemania appearances, and was a mid-carder at best in the WWF.",
      "options": [
        "Butch Reed",
        "Koko B. Ware",
        "Virgil",
        "Bad News Brown"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What does WKA stand for?",
      "options": [
        "Witfield Karting Association",
        "Willowbrook Kart Alignment",
        "World Kangaroo Association",
        "World Karting Association"
      ],
      "answerIndex": 3,
      "difficulty": 1
    },
    {
      "prompt": "This former Utah Jazz player, who retired in 2003, set a record for steals in a career.",
      "options": [
        "Karl Malone",
        "Derek Harper.",
        "John Stockton",
        "Jeff Hornacek"
      ],
      "answerIndex": 2,
      "difficulty": 3
    },
    {
      "prompt": "When you go paintballing what is the first thing you do before you put the carbon dioxide tank in?",
      "options": [
        "Take safety off",
        "Put barrel plug in",
        "Load in the paintballs",
        "Cock it"
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "What does the term baseball diamond denote?",
      "options": [
        "Baseball field",
        "A title given to the greatest baseball players",
        "A female baseball player",
        "An award"
      ],
      "answerIndex": 0,
      "difficulty": 1
    },
    {
      "prompt": "Which famous artist also went to try his hand at chess?",
      "options": [
        "Marcel Duchamp",
        "Pablo Picasso",
        "Henri Matisse",
        "Man Ray"
      ],
      "answerIndex": 0,
      "difficulty": 2
    },
    {
      "prompt": "Which of the following is a line in Lou Gehrigs famous farewell speach?",
      "options": [
        "Today I consider myself the luckiest man on the face of the Earth.",
        "But today I consider myself the luckiest man on the face of the Earth.",
        "Today I am the luckiest man on Earth.",
        "I consider myself the luckiest man in the whole world."
      ],
      "answerIndex": 1,
      "difficulty": 3
    },
    {
      "prompt": "Jim Brown was a fullback from 1957 - 1965 and was elected to the Hall Of Fame in 1971. Which team did he play for?",
      "options": [
        "Jets",
        "Steelers",
        "Packers",
        "Browns"
      ],
      "answerIndex": 3,
      "difficulty": 3
    }
  ]
];

const SPORTS_QUESTIONS: TriviaQuestion[] = SPORTS_DAILY_PACKS.reduce<TriviaQuestion[]>((allQuestions, pack) => {
  allQuestions.push(...pack);
  return allQuestions;
}, []);

export const SPORTS_CATEGORY: TriviaCategory = {
  id: SPORTS_CATEGORY_ID,
  name: SPORTS_CATEGORY_NAME,
  description: SPORTS_CATEGORY_DESCRIPTION,
  questions: SPORTS_QUESTIONS,
};

export default SPORTS_CATEGORY;
