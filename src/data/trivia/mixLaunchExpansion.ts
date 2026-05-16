import type {
  TriviaCitation,
  TriviaDifficultyTarget,
  TriviaLookupRisk,
} from './types';
import type { CuratedTriviaSourceQuestion } from './curatedTriviaSources';

type MixArtsWorkCard = {
  work: string;
  creator: string;
  form: string;
  subdomain: string;
  salience: number;
};

type MixHistoryFigureCard = {
  person: string;
  title: string;
  place: string;
  salience: number;
};

type MixScienceCard = {
  scientist: string;
  field: string;
  discovery: string;
  salience: number;
};

type MixCountryCard = {
  country: string;
  capital: string;
  currency: string;
  language: string;
  continent: string;
};

function q(question: CuratedTriviaSourceQuestion): CuratedTriviaSourceQuestion {
  return question;
}

function dedupeLocal(values: string[]): string[] {
  return [...new Set(values)];
}

function pickPeerValues(values: string[], current: string, index: number): [string, string] {
  const peers = values.filter((value) => value !== current);
  const first = peers[index % peers.length] ?? peers[0] ?? current;
  const second = peers[(index + 3) % peers.length] ?? peers[1] ?? first;
  return [first, second];
}

function buildOptions(correct: string, distractors: [string, string]): string[] {
  return [correct, distractors[0], distractors[1]];
}

function hardTailSalience(
  baseSalience: number,
  index: number,
  hardStart: number,
  hardValue: number,
  softStart?: number,
  softValue?: number
): number {
  if (index >= hardStart) return Math.min(baseSalience, hardValue);
  if (softStart != null && softValue != null && index >= softStart) {
    return Math.min(baseSalience, softValue);
  }
  return baseSalience;
}

function searchCitation(label: string, query: string): TriviaCitation[] {
  const encoded = encodeURIComponent(query);
  return [
    {
      title: label,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encoded}`,
      sourceType: 'editorial',
      accessedAt: '2026-05-02',
    },
  ];
}

function parseRows<T>(rows: string, mapper: (parts: string[]) => T): T[] {
  return rows
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => mapper(line.split('|').map((part) => part.trim())));
}

const MIX_ARTS_WORK_CARDS = parseRows<MixArtsWorkCard>(
  `
Pride and Prejudice|Jane Austen|novel|literature|92
1984|George Orwell|novel|literature|92
Moby-Dick|Herman Melville|novel|literature|86
The Great Gatsby|F. Scott Fitzgerald|novel|literature|90
To Kill a Mockingbird|Harper Lee|novel|literature|92
Jane Eyre|Charlotte Bronte|novel|literature|88
Wuthering Heights|Emily Bronte|novel|literature|86
The Catcher in the Rye|J.D. Salinger|novel|literature|88
The Hobbit|J.R.R. Tolkien|novel|literature|92
The Lord of the Rings|J.R.R. Tolkien|novel|literature|94
Crime and Punishment|Fyodor Dostoevsky|novel|literature|88
War and Peace|Leo Tolstoy|novel|literature|88
Anna Karenina|Leo Tolstoy|novel|literature|86
The Odyssey|Homer|epic poem|literature|90
The Iliad|Homer|epic poem|literature|88
The Divine Comedy|Dante Alighieri|epic poem|literature|88
Don Quixote|Miguel de Cervantes|novel|literature|88
The Adventures of Huckleberry Finn|Mark Twain|novel|literature|88
The Scarlet Letter|Nathaniel Hawthorne|novel|literature|84
One Hundred Years of Solitude|Gabriel Garcia Marquez|novel|literature|86
Beloved|Toni Morrison|novel|literature|84
The Grapes of Wrath|John Steinbeck|novel|literature|86
Of Mice and Men|John Steinbeck|novel|literature|88
The Old Man and the Sea|Ernest Hemingway|novel|literature|86
A Tale of Two Cities|Charles Dickens|novel|literature|88
Great Expectations|Charles Dickens|novel|literature|86
Les Miserables|Victor Hugo|novel|literature|88
Frankenstein|Mary Shelley|novel|literature|90
Dracula|Bram Stoker|novel|literature|88
The Picture of Dorian Gray|Oscar Wilde|novel|literature|84
Hamlet|William Shakespeare|play|literature|94
Macbeth|William Shakespeare|play|literature|92
Romeo and Juliet|William Shakespeare|play|literature|94
King Lear|William Shakespeare|play|literature|88
Othello|William Shakespeare|play|literature|88
A Midsummer Night's Dream|William Shakespeare|play|literature|88
The Tempest|William Shakespeare|play|literature|86
Waiting for Godot|Samuel Beckett|play|literature|84
Death of a Salesman|Arthur Miller|play|literature|86
The Crucible|Arthur Miller|play|literature|88
A Streetcar Named Desire|Tennessee Williams|play|literature|86
The Starry Night|Vincent van Gogh|painting|pop-culture|96
The Last Supper|Leonardo da Vinci|mural|pop-culture|96
Mona Lisa|Leonardo da Vinci|painting|pop-culture|98
Guernica|Pablo Picasso|painting|pop-culture|92
The Persistence of Memory|Salvador Dali|painting|pop-culture|90
The School of Athens|Raphael|fresco|pop-culture|88
The Birth of Venus|Sandro Botticelli|painting|pop-culture|90
American Gothic|Grant Wood|painting|pop-culture|88
The Scream|Edvard Munch|painting|pop-culture|92
The Night Watch|Rembrandt|painting|pop-culture|88
Girl with a Pearl Earring|Johannes Vermeer|painting|pop-culture|90
Water Lilies|Claude Monet|painting|pop-culture|86
David|Michelangelo|sculpture|pop-culture|94
The Thinker|Auguste Rodin|sculpture|pop-culture|90
Swan Lake|Pyotr Ilyich Tchaikovsky|ballet|music|90
The Nutcracker|Pyotr Ilyich Tchaikovsky|ballet|music|92
The Magic Flute|Wolfgang Amadeus Mozart|opera|music|88
The Marriage of Figaro|Wolfgang Amadeus Mozart|opera|music|86
The Four Seasons|Antonio Vivaldi|concerto|music|90
Symphony No. 5|Ludwig van Beethoven|symphony|music|94
Messiah|George Frideric Handel|oratorio|music|88
Carmen|Georges Bizet|opera|music|88
Rite of Spring|Igor Stravinsky|ballet|music|86
Bolero|Maurice Ravel|orchestral work|music|86
The Planets|Gustav Holst|suite|music|84
Carmina Burana|Carl Orff|cantata|music|82
Madama Butterfly|Giacomo Puccini|opera|music|84
La Traviata|Giuseppe Verdi|opera|music|86
Pictures at an Exhibition|Modest Mussorgsky|suite|music|82
Appalachian Spring|Aaron Copland|ballet|music|80
West Side Story|Leonard Bernstein|musical|music|90
The Sound of Music|Richard Rodgers|musical|music|92
The Brothers Karamazov|Fyodor Dostoevsky|novel|literature|82
The Trial|Franz Kafka|novel|literature|80
The Metamorphosis|Franz Kafka|novel|literature|82
Candide|Voltaire|novel|literature|80
The Cherry Orchard|Anton Chekhov|play|literature|80
Pygmalion|George Bernard Shaw|play|literature|82
Don Giovanni|Wolfgang Amadeus Mozart|opera|music|84
Aida|Giuseppe Verdi|opera|music|84
The Seagull|Anton Chekhov|play|literature|80
The Barber of Seville|Gioachino Rossini|opera|music|84
Rhapsody in Blue|George Gershwin|orchestral work|music|86
The Stranger|Albert Camus|novel|literature|84
Invisible Man|Ralph Ellison|novel|literature|84
Things Fall Apart|Chinua Achebe|novel|literature|86
Their Eyes Were Watching God|Zora Neale Hurston|novel|literature|82
Mrs Dalloway|Virginia Woolf|novel|literature|82
To the Lighthouse|Virginia Woolf|novel|literature|80
The Sound and the Fury|William Faulkner|novel|literature|82
Heart of Darkness|Joseph Conrad|novel|literature|84
The Aeneid|Virgil|epic poem|literature|84
Paradise Lost|John Milton|epic poem|literature|86
The Canterbury Tales|Geoffrey Chaucer|poetry collection|literature|84
Leaves of Grass|Walt Whitman|poetry collection|literature|82
The Sun Also Rises|Ernest Hemingway|novel|literature|82
Native Son|Richard Wright|novel|literature|82
The Bluest Eye|Toni Morrison|novel|literature|80
Slaughterhouse-Five|Kurt Vonnegut|novel|literature|84
One Flew Over the Cuckoo's Nest|Ken Kesey|novel|literature|84
Rebecca|Daphne du Maurier|novel|literature|82
Persuasion|Jane Austen|novel|literature|84
Antigone|Sophocles|play|literature|88
Our Town|Thornton Wilder|play|literature|82
The Glass Menagerie|Tennessee Williams|play|literature|84
The Importance of Being Earnest|Oscar Wilde|play|literature|86
No Exit|Jean-Paul Sartre|play|literature|80
Long Day's Journey into Night|Eugene O'Neill|play|literature|80
Oedipus Rex|Sophocles|play|literature|88
Las Meninas|Diego Velazquez|painting|pop-culture|86
The Arnolfini Portrait|Jan van Eyck|painting|pop-culture|84
Liberty Leading the People|Eugene Delacroix|painting|pop-culture|88
Nighthawks|Edward Hopper|painting|pop-culture|90
Whistler's Mother|James McNeill Whistler|painting|pop-culture|84
The Kiss|Gustav Klimt|painting|pop-culture|88
The Garden of Earthly Delights|Hieronymus Bosch|painting|pop-culture|84
Olympia|Edouard Manet|painting|pop-culture|82
Campbell's Soup Cans|Andy Warhol|painting|pop-culture|88
The Blue Danube|Johann Strauss II|orchestral work|music|86
The Firebird|Igor Stravinsky|ballet|music|84
Tosca|Giacomo Puccini|opera|music|84
Turandot|Giacomo Puccini|opera|music|84
The Creation|Joseph Haydn|oratorio|music|82
Cosi fan tutte|Wolfgang Amadeus Mozart|opera|music|82
Madame Bovary|Gustave Flaubert|novel|literature|86
The House of the Spirits|Isabel Allende|novel|literature|82
The Great Wave off Kanagawa|Hokusai|print|pop-culture|90
A Sunday Afternoon on the Island of La Grande Jatte|Georges Seurat|painting|pop-culture|84
Peer Gynt|Henrik Ibsen|play|literature|82
Ulysses|James Joyce|novel|literature|82
The Count of Monte Cristo|Alexandre Dumas|novel|literature|88
The Three Musketeers|Alexandre Dumas|novel|literature|86
Fahrenheit 451|Ray Bradbury|novel|literature|88
Catch-22|Joseph Heller|novel|literature|86
Lolita|Vladimir Nabokov|novel|literature|82
A Farewell to Arms|Ernest Hemingway|novel|literature|84
The Raven|Edgar Allan Poe|poem|literature|88
Medea|Euripides|play|literature|86
Lysistrata|Aristophanes|play|literature|84
Faust|Johann Wolfgang von Goethe|play|literature|86
The Republic|Plato|dialogue|literature|86
The Prince|Niccolo Machiavelli|political treatise|literature|84
Impression, Sunrise|Claude Monet|painting|pop-culture|90
The Son of Man|Rene Magritte|painting|pop-culture|88
The Treachery of Images|Rene Magritte|painting|pop-culture|84
The Raft of the Medusa|Theodore Gericault|painting|pop-culture|84
Wanderer above the Sea of Fog|Caspar David Friedrich|painting|pop-culture|86
Christina's World|Andrew Wyeth|painting|pop-culture|84
The Sleeping Gypsy|Henri Rousseau|painting|pop-culture|82
No. 5, 1948|Jackson Pollock|painting|pop-culture|84
Clair de Lune|Claude Debussy|piano piece|music|90
Moonlight Sonata|Ludwig van Beethoven|piano sonata|music|94
Canon in D|Johann Pachelbel|chamber work|music|90
Eine kleine Nachtmusik|Wolfgang Amadeus Mozart|serenade|music|90
The Moldau|Bedrich Smetana|orchestral work|music|84
1812 Overture|Pyotr Ilyich Tchaikovsky|orchestral work|music|88
Peer Gynt Suite|Edvard Grieg|suite|music|84
The Odyssey of Captain Blood|Rafael Sabatini|novel|literature|78
Kind of Blue|Miles Davis|album|music|92
`, ([work, creator, form, subdomain, salience]) => ({
    work,
    creator,
    form,
    subdomain,
    salience: Number(salience),
  })
);

const MIX_HISTORY_FIGURE_CARDS = parseRows<MixHistoryFigureCard>(
  `
Cleopatra|queen|Egypt|94
Julius Caesar|dictator|Rome|96
Augustus|emperor|Rome|94
Alexander the Great|king|Macedon|96
Hammurabi|king|Babylon|86
Ashoka|emperor|the Maurya Empire|86
Charlemagne|emperor|the Franks|90
William the Conqueror|king|England|90
Joan of Arc|military heroine|France|90
Genghis Khan|founder|the Mongol Empire|94
Kublai Khan|emperor|the Yuan dynasty|82
Mansa Musa|emperor|the Mali Empire|88
Suleiman the Magnificent|sultan|the Ottoman Empire|88
Akbar|emperor|the Mughal Empire|86
Louis XIV|king|France|92
Peter the Great|tsar|Russia|90
Catherine the Great|empress|Russia|88
Napoleon Bonaparte|emperor|France|96
George Washington|president|the United States|96
Thomas Jefferson|president|the United States|90
Abraham Lincoln|president|the United States|98
Theodore Roosevelt|president|the United States|92
Franklin D. Roosevelt|president|the United States|96
Winston Churchill|prime minister|the United Kingdom|96
Charles de Gaulle|president|France|84
Otto von Bismarck|chancellor|Germany|88
Simon Bolivar|liberator|northern South America|88
Toussaint Louverture|revolutionary leader|Haiti|84
Miguel Hidalgo|priest and rebel leader|Mexico|82
Giuseppe Garibaldi|revolutionary leader|Italy|82
Sun Yat-sen|revolutionary leader|China|84
Mao Zedong|chairman|China|94
Deng Xiaoping|paramount leader|China|84
Mikhail Gorbachev|leader|the Soviet Union|90
Vladimir Lenin|revolutionary leader|Russia|92
Joseph Stalin|leader|the Soviet Union|94
Nelson Mandela|president|South Africa|96
Mahatma Gandhi|independence leader|India|96
Jawaharlal Nehru|prime minister|India|86
Indira Gandhi|prime minister|India|84
Mustafa Kemal Ataturk|founder|modern Turkey|88
Saladin|sultan|Egypt and Syria|84
Harriet Tubman|abolitionist|the United States|90
Frederick Douglass|abolitionist|the United States|86
Susan B. Anthony|suffragist|the United States|84
Emmeline Pankhurst|suffragist|the United Kingdom|82
Martin Luther King Jr.|civil rights leader|the United States|96
Malcolm X|civil rights leader|the United States|88
Lech Walesa|labor leader|Poland|80
Vaclav Havel|president|the Czech Republic|80
Sitting Bull|Lakota leader|the Great Plains|84
Geronimo|Apache leader|the American Southwest|82
Hernan Cortes|conquistador|Mexico|84
Francisco Pizarro|conquistador|Peru|82
Ferdinand Magellan|explorer|Spain|86
Vasco da Gama|explorer|Portugal|84
Christopher Columbus|explorer|Spain|94
Marco Polo|traveler|Venice|84
Ibn Battuta|traveler|the Islamic world|82
Leif Erikson|explorer|Norse Greenland|82
Pericles|statesman|Athens|86
Solon|lawgiver|Athens|78
Boudica|queen|the Iceni|80
Attila|leader|the Huns|84
Tokugawa Ieyasu|shogun|Japan|84
Oda Nobunaga|warlord|Japan|80
Hideyoshi|regent|Japan|78
Cyrus the Great|king|Persia|88
Darius the Great|king|Persia|84
Qin Shi Huang|emperor|China|86
Hannibal|general|Carthage|84
Richard the Lionheart|king|England|84
Eleanor of Aquitaine|queen|France and England|82
Martin Luther|reformer|Germany|88
John Calvin|reformer|Geneva|80
Niccolo Machiavelli|writer and diplomat|Florence|80
Catherine de Medici|queen and regent|France|80
Cardinal Richelieu|cardinal and statesman|France|80
Oliver Cromwell|leader|England|82
Elizabeth I|queen|England|90
Frederick the Great|king|Prussia|84
Zheng He|admiral|Ming China|80
Hatshepsut|pharaoh|Egypt|84
Ramesses II|pharaoh|Egypt|84
Queen Victoria|queen|the United Kingdom|92
Cicero|statesman|Rome|82
Alfred the Great|king|Wessex|84
William Wilberforce|abolitionist|the United Kingdom|82
Cincinnatus|statesman|Rome|78
Aurelian|emperor|Rome|80
Tamerlane|conqueror|Central Asia|80
Francisco de Miranda|revolutionary leader|Venezuela|80
Atahualpa|emperor|the Inca Empire|80
Nikita Khrushchev|leader|the Soviet Union|84
Benjamin Franklin|statesman|the United States|90
Thomas Paine|pamphleteer and revolutionary|the Atlantic world|82
Queen Nzinga|queen|Ndongo and Matamba|80
Emiliano Zapata|revolutionary leader|Mexico|82
Elizabeth Cady Stanton|suffragist|the United States|84
Marcus Aurelius|emperor|Rome|86
Constantine the Great|emperor|Rome|88
Justinian I|emperor|the Byzantine Empire|84
Theodora|empress|the Byzantine Empire|80
Xerxes I|king|Persia|82
Nebuchadnezzar II|king|Babylon|82
Spartacus|rebel leader|Rome|84
Robespierre|revolutionary leader|France|82
Marquis de Lafayette|revolutionary leader|France and the United States|84
Thomas Cromwell|statesman|England|80
Marcus Garvey|Black nationalist leader|Jamaica and the United States|82
Rosa Parks|civil rights activist|the United States|90
Eleanor Roosevelt|first lady and diplomat|the United States|84
Margaret Thatcher|prime minister|the United Kingdom|88
Golda Meir|prime minister|Israel|82
David Ben-Gurion|prime minister|Israel|82
Ho Chi Minh|revolutionary leader|Vietnam|84
Gamal Abdel Nasser|president|Egypt|82
Kwame Nkrumah|president|Ghana|80
Corazon Aquino|president|the Philippines|80
Simone de Beauvoir|writer and philosopher|France|80
Francisco Franco|leader|Spain|80
`, ([person, title, place, salience]) => ({
    person,
    title,
    place,
    salience: Number(salience),
  })
);

const MIX_SCIENCE_CARDS = parseRows<MixScienceCard>(
  `
Albert Einstein|physics|the theory of relativity|98
Isaac Newton|physics|the laws of motion|98
Galileo Galilei|astronomy|telescopic observations of Jupiter's moons|94
Nicolaus Copernicus|astronomy|the heliocentric model|92
Johannes Kepler|astronomy|the laws of planetary motion|90
Tycho Brahe|astronomy|precise observations of planetary motion|82
Marie Curie|chemistry|radioactivity|96
Pierre Curie|physics|radioactivity research|84
Dmitri Mendeleev|chemistry|the periodic table|92
Antoine Lavoisier|chemistry|modern chemistry|88
Robert Boyle|chemistry|Boyle's law|86
John Dalton|chemistry|atomic theory|86
Amedeo Avogadro|chemistry|Avogadro's law|84
Niels Bohr|physics|the Bohr model of the atom|90
Ernest Rutherford|physics|the nuclear model of the atom|88
Michael Faraday|physics|electromagnetic induction|90
James Clerk Maxwell|physics|Maxwell's equations|88
Max Planck|physics|quantum theory|88
Werner Heisenberg|physics|the uncertainty principle|86
Erwin Schrodinger|physics|wave mechanics|86
Louis Pasteur|biology|pasteurization|94
Gregor Mendel|biology|the laws of heredity|92
Charles Darwin|biology|evolution by natural selection|98
Alfred Russel Wallace|biology|natural selection|82
Rosalind Franklin|biology|X-ray work on DNA|90
James Watson|biology|the structure of DNA|88
Francis Crick|biology|the structure of DNA|88
Barbara McClintock|biology|jumping genes|82
Carl Linnaeus|biology|modern taxonomy|88
Rachel Carson|biology|environmental science|86
Edward Jenner|medicine|the smallpox vaccine|92
Jonas Salk|medicine|the polio vaccine|92
Alexander Fleming|medicine|penicillin|94
Robert Koch|medicine|disease-causing bacteria|88
William Harvey|medicine|the circulation of blood|86
Andreas Vesalius|medicine|modern anatomy|84
Florence Nightingale|nursing|modern nursing|88
Joseph Lister|medicine|antiseptic surgery|84
Sigmund Freud|psychology|psychoanalysis|84
Ivan Pavlov|physiology|classical conditioning|86
B. F. Skinner|psychology|operant conditioning|82
Jane Goodall|primatology|chimpanzee behavior research|90
Dian Fossey|primatology|gorilla behavior research|84
Stephen Hawking|physics|black hole theory|94
Edwin Hubble|astronomy|the expanding universe|90
Carl Sagan|astronomy|popular astronomy communication|90
Katherine Johnson|mathematics|orbital mechanics for NASA|90
Ada Lovelace|mathematics|early computer programming|90
Alan Turing|computer science|the Turing machine|94
Grace Hopper|computer science|compiler development|88
Tim Berners-Lee|computer science|the World Wide Web|92
Nikola Tesla|engineering|alternating current power|92
Thomas Edison|engineering|the practical incandescent light bulb|90
Guglielmo Marconi|engineering|radio transmission|86
Alexander Graham Bell|engineering|the telephone|90
George Washington Carver|agricultural science|crop rotation and peanut research|86
Temple Grandin|animal science|livestock facility design|82
Sally Ride|physics|becoming the first American woman in space|88
Mae Jemison|engineering|becoming the first Black woman in space|86
Valentina Tereshkova|engineering|becoming the first woman in space|86
Neil deGrasse Tyson|astrophysics|popular astronomy communication|84
Archimedes|mathematics|buoyancy and the lever|90
Blaise Pascal|mathematics|Pascal's law|84
Gottfried Wilhelm Leibniz|mathematics|calculus|84
Antonie van Leeuwenhoek|biology|microscopy of microorganisms|84
James Watt|engineering|the improved steam engine|88
Orville Wright|engineering|powered flight|88
Wilbur Wright|engineering|powered flight|88
Richard Feynman|physics|quantum electrodynamics|88
Chien-Shiung Wu|physics|the Wu experiment|82
Emmy Noether|mathematics|Noether's theorem|82
Johannes Gutenberg|engineering|moveable-type printing in Europe|88
Srinivasa Ramanujan|mathematics|number theory|82
Hedy Lamarr|engineering|frequency-hopping radio technology|84
Carl Friedrich Gauss|mathematics|number theory and statistics|84
James Joule|physics|the mechanical equivalent of heat|80
Enrico Fermi|physics|the first controlled nuclear chain reaction|88
Dorothy Hodgkin|chemistry|X-ray structures of biomolecules|82
Subrahmanyan Chandrasekhar|astrophysics|stellar evolution|80
Jennifer Doudna|biology|CRISPR gene editing|88
Katalin Kariko|medicine|mRNA vaccine research|86
Tu Youyou|medicine|artemisinin|84
Santiago Ramon y Cajal|biology|modern neuroscience|82
Robert Hooke|physics|Hooke's law|86
Christiaan Huygens|physics|wave theory of light|84
Alfred Wegener|geology|continental drift|88
Cecilia Payne-Gaposchkin|astronomy|stellar composition|82
Vera Rubin|astronomy|evidence for dark matter|86
Linus Pauling|chemistry|the nature of the chemical bond|86
Lise Meitner|physics|nuclear fission research|84
Henrietta Swan Leavitt|astronomy|Cepheid variable stars|84
Georges Lemaitre|physics|the Big Bang theory|86
Svante Arrhenius|chemistry|electrolytic dissociation|82
Rita Levi-Montalcini|medicine|nerve growth factor|82
August Kekule|chemistry|the ring structure of benzene|84
James Hutton|geology|deep time in geology|82
Carl Woese|biology|the domain system of life|82
Rosalyn Yalow|medicine|radioimmunoassay|80
`, ([scientist, field, discovery, salience]) => ({
    scientist,
    field,
    discovery,
    salience: Number(salience),
  })
);

const EXTRA_MIX_COUNTRY_CARDS = parseRows<MixCountryCard>(
  `
Algeria|Algiers|Algerian dinar|Arabic|Africa
Angola|Luanda|Kwanza|Portuguese|Africa
Bolivia|Sucre|Boliviano|Spanish|South America
Cambodia|Phnom Penh|Riel|Khmer|Asia
Croatia|Zagreb|Euro|Croatian|Europe
Cuba|Havana|Cuban peso|Spanish|North America
Dominican Republic|Santo Domingo|Dominican peso|Spanish|North America
Ecuador|Quito|U.S. dollar|Spanish|South America
Estonia|Tallinn|Euro|Estonian|Europe
Guatemala|Guatemala City|Quetzal|Spanish|North America
Iran|Tehran|Iranian rial|Persian|Asia
Iraq|Baghdad|Iraqi dinar|Arabic|Asia
Jamaica|Kingston|Jamaican dollar|English|North America
Jordan|Amman|Jordanian dinar|Arabic|Asia
Kazakhstan|Astana|Tenge|Kazakh|Asia
Laos|Vientiane|Kip|Lao|Asia
Lebanon|Beirut|Lebanese pound|Arabic|Asia
Luxembourg|Luxembourg City|Euro|Luxembourgish|Europe
Madagascar|Antananarivo|Ariary|Malagasy|Africa
Mauritius|Port Louis|Mauritian rupee|English|Africa
Mongolia|Ulaanbaatar|Tugrik|Mongolian|Asia
Myanmar|Naypyidaw|Kyat|Burmese|Asia
Oman|Muscat|Omani rial|Arabic|Asia
Panama|Panama City|Balboa|Spanish|North America
Paraguay|Asuncion|Guarani|Spanish|South America
Qatar|Doha|Qatari riyal|Arabic|Asia
Senegal|Dakar|West African CFA franc|French|Africa
Serbia|Belgrade|Serbian dinar|Serbian|Europe
Slovakia|Bratislava|Euro|Slovak|Europe
Slovenia|Ljubljana|Euro|Slovene|Europe
Tanzania|Dodoma|Tanzanian shilling|Swahili|Africa
Tunisia|Tunis|Tunisian dinar|Arabic|Africa
Uganda|Kampala|Ugandan shilling|English|Africa
Uruguay|Montevideo|Uruguayan peso|Spanish|South America
Uzbekistan|Tashkent|Som|Uzbek|Asia
Zambia|Lusaka|Zambian kwacha|English|Africa
Zimbabwe|Harare|Zimbabwean dollar|English|Africa
Latvia|Riga|Euro|Latvian|Europe
Lithuania|Vilnius|Euro|Lithuanian|Europe
Costa Rica|San Jose|Costa Rican colon|Spanish|North America
Nepal|Kathmandu|Nepalese rupee|Nepali|Asia
Sri Lanka|Sri Jayawardenepura Kotte|Sri Lankan rupee|Sinhala|Asia
Cameroon|Yaounde|Central African CFA franc|French|Africa
Botswana|Gaborone|Pula|English|Africa
Iceland|Reykjavik|Icelandic krona|Icelandic|Europe
Honduras|Tegucigalpa|Lempira|Spanish|North America
El Salvador|San Salvador|U.S. dollar|Spanish|North America
Albania|Tirana|Lek|Albanian|Europe
Armenia|Yerevan|Dram|Armenian|Asia
Georgia|Tbilisi|Lari|Georgian|Asia
Moldova|Chisinau|Moldovan leu|Romanian|Europe
Namibia|Windhoek|Namibian dollar|English|Africa
Bahrain|Manama|Bahraini dinar|Arabic|Asia
`, ([country, capital, currency, language, continent]) => ({
    country,
    capital,
    currency,
    language,
    continent,
  })
);

const MIX_ARTS_WORK_CARD_EXPANSION = parseRows<MixArtsWorkCard>(
  `
A Raisin in the Sun|Lorraine Hansberry|play|literature|86
The Color Purple|Alice Walker|novel|literature|86
The Handmaid's Tale|Margaret Atwood|novel|literature|88
The Bell Jar|Sylvia Plath|novel|literature|84
On the Road|Jack Kerouac|novel|literature|84
The Maltese Falcon|Dashiell Hammett|novel|literature|82
The Name of the Rose|Umberto Eco|novel|literature|82
The Remains of the Day|Kazuo Ishiguro|novel|literature|84
Love in the Time of Cholera|Gabriel Garcia Marquez|novel|literature|84
The Left Hand of Darkness|Ursula K. Le Guin|novel|literature|82
A Doll's House|Henrik Ibsen|play|literature|86
Who's Afraid of Virginia Woolf?|Edward Albee|play|literature|82
The Phantom of the Opera|Andrew Lloyd Webber|musical|music|88
Blue Train|John Coltrane|album|music|82
A Love Supreme|John Coltrane|album|music|84
Thriller|Michael Jackson|album|music|96
Rumours|Fleetwood Mac|album|music|90
Abbey Road|The Beatles|album|music|94
The Wall|Pink Floyd|album|music|90
Nevermind|Nirvana|album|music|88
Blue|Joni Mitchell|album|music|86
Pet Sounds|The Beach Boys|album|music|86
Sleeping Beauty|Pyotr Ilyich Tchaikovsky|ballet|music|88
An American in Paris|George Gershwin|orchestral work|music|82
The Goldfinch|Carel Fabritius|painting|pop-culture|84
Bal du moulin de la Galette|Pierre-Auguste Renoir|painting|pop-culture|82
The Hay Wain|John Constable|painting|pop-culture|82
The Third of May 1808|Francisco Goya|painting|pop-culture|84
The Sleeping Venus|Giorgione|painting|pop-culture|80
Nocturnes|Frederic Chopin|piano works|music|84
The Age of Innocence|Edith Wharton|novel|literature|82
Giovanni's Room|James Baldwin|novel|literature|82
Under the Volcano|Malcolm Lowry|novel|literature|80
The House on Mango Street|Sandra Cisneros|novel|literature|84
The Wind-Up Bird Chronicle|Haruki Murakami|novel|literature|82
Bluebeard's Castle|Bela Bartok|opera|music|80
Tapestry|Carole King|album|music|86
Graceland|Paul Simon|album|music|88
The Velvet Underground & Nico|The Velvet Underground|album|music|82
OK Computer|Radiohead|album|music|88
The Little Prince|Antoine de Saint-Exupery|novel|literature|86
The Tin Drum|Gunter Grass|novel|literature|80
The Prime of Miss Jean Brodie|Muriel Spark|novel|literature|80
The Leopard|Giuseppe Tomasi di Lampedusa|novel|literature|80
Ficciones|Jorge Luis Borges|short story collection|literature|82
Jagged Little Pill|Alanis Morissette|album|music|88
Back to Black|Amy Winehouse|album|music|88
The Joshua Tree|U2|album|music|88
The Dark Side of the Moon|Pink Floyd|album|music|94
Blood on the Tracks|Bob Dylan|album|music|86
Invisible Cities|Italo Calvino|novel|literature|82
The Sea|John Banville|novel|literature|80
Harvest|Neil Young|album|music|86
The Queen Is Dead|The Smiths|album|music|84
Hotel California|Eagles|album|music|88
Bel Canto|Ann Patchett|novel|literature|82
The Amazing Adventures of Kavalier & Clay|Michael Chabon|novel|literature|82
Horses|Patti Smith|album|music|84
Blue Lines|Massive Attack|album|music|82
The Chronic|Dr. Dre|album|music|84
`,
  ([work, creator, form, subdomain, salience]) => ({
    work,
    creator,
    form,
    subdomain,
    salience: Number(salience),
  })
);

const MIX_HISTORY_FIGURE_CARD_EXPANSION = parseRows<MixHistoryFigureCard>(
  `
Charlemagne|emperor|the Frankish Empire|88
Suleiman the Magnificent|sultan|the Ottoman Empire|86
Akbar|emperor|the Mughal Empire|84
Sun Yat-sen|founding leader|China|84
Otto von Bismarck|chancellor|Germany|88
Ataturk|founding president|Turkey|86
Susan B. Anthony|suffrage leader|the United States|88
Frederick Douglass|abolitionist|the United States|88
Emmeline Pankhurst|suffrage leader|Britain|84
Toussaint Louverture|revolutionary leader|Haiti|84
Lech Walesa|labor leader|Poland|82
Benito Juarez|president|Mexico|84
Pericles|statesman|Athens|84
Solon|lawgiver|Athens|82
Tokugawa Ieyasu|shogun|Japan|84
John Locke|philosopher|England|84
Niccolo Machiavelli|statesman|Florence|84
Genghis Khan|founder|the Mongol Empire|90
Sojourner Truth|abolitionist|the United States|84
Cyrus the Great|founder|the Persian Empire|88
Simon Bolivar|liberator|Gran Colombia|86
Thomas More|statesman|England|82
Saladin|sultan|Egypt and Syria|84
Emperor Meiji|emperor|Japan|84
Boudica|rebel leader|Britain|82
`,
  ([person, title, place, salience]) => ({
    person,
    title,
    place,
    salience: Number(salience),
  })
);

const MIX_SCIENCE_CARD_EXPANSION = parseRows<MixScienceCard>(
  `
Johannes Kepler|astronomy|the laws of planetary motion|88
Gregory Mendel|genetics|the basic laws of heredity|88
Dmitri Mendeleev|chemistry|the periodic table|90
Enrico Fermi|physics|the first nuclear reactor|86
Barbara McClintock|genetics|jumping genes|84
J. Robert Oppenheimer|physics|the Manhattan Project|88
Ada Lovelace|mathematics|the first computer algorithm|88
Alan Turing|computer science|the Turing machine|90
Richard Feynman|physics|quantum electrodynamics|84
Jane Goodall|primatology|chimpanzee behavior|88
Niels Bohr|physics|the Bohr model of the atom|88
Max Planck|physics|quantum theory|86
Archimedes|mathematics|buoyancy|88
James Clerk Maxwell|physics|electromagnetism|86
Annie Jump Cannon|astronomy|stellar classification|84
Dorothy Hodgkin|chemistry|the structure of vitamin B12|82
Srinivasa Ramanujan|mathematics|infinite series|84
Antoine Lavoisier|chemistry|modern chemistry|88
Robert Boyle|chemistry|Boyle's law|86
Jonas Salk|medicine|the polio vaccine|92
Carl Linnaeus|biology|binomial nomenclature|86
Alexander Fleming|medicine|penicillin|92
Werner Heisenberg|physics|the uncertainty principle|86
Erwin Schrodinger|physics|wave mechanics|84
Tycho Brahe|astronomy|precise planetary observations|84
Edmond Halley|astronomy|Halley's Comet|86
Lynn Margulis|biology|endosymbiotic theory|82
Murray Gell-Mann|physics|quarks|82
Chien-Shiung Wu|physics|beta decay experiments|82
Inge Lehmann|geophysics|Earth's inner core|82
`,
  ([scientist, field, discovery, salience]) => ({
    scientist,
    field,
    discovery,
    salience: Number(salience),
  })
);

const EXTRA_MIX_COUNTRY_CARD_EXPANSION = parseRows<MixCountryCard>(
  `
Kenya|Nairobi|Kenyan shilling|English|Africa
Morocco|Rabat|Moroccan dirham|Arabic|Africa
Peru|Lima|Sol|Spanish|South America
Chile|Santiago|Chilean peso|Spanish|South America
Thailand|Bangkok|Baht|Thai|Asia
Vietnam|Hanoi|Dong|Vietnamese|Asia
Malaysia|Kuala Lumpur|Malaysian ringgit|Malay|Asia
Pakistan|Islamabad|Pakistani rupee|Urdu|Asia
New Zealand|Wellington|New Zealand dollar|English|Oceania
Portugal|Lisbon|Euro|Portuguese|Europe
Greece|Athens|Euro|Greek|Europe
Romania|Bucharest|Romanian leu|Romanian|Europe
Nigeria|Abuja|Naira|English|Africa
Argentina|Buenos Aires|Argentine peso|Spanish|South America
Brazil|Brasilia|Brazilian real|Portuguese|South America
Ethiopia|Addis Ababa|Ethiopian birr|Amharic|Africa
Japan|Tokyo|Yen|Japanese|Asia
South Korea|Seoul|South Korean won|Korean|Asia
Sweden|Stockholm|Swedish krona|Swedish|Europe
Norway|Oslo|Norwegian krone|Norwegian|Europe
Mexico|Mexico City|Mexican peso|Spanish|North America
Poland|Warsaw|Zloty|Polish|Europe
Czech Republic|Prague|Czech koruna|Czech|Europe
Finland|Helsinki|Euro|Finnish|Europe
Denmark|Copenhagen|Danish krone|Danish|Europe
Indonesia|Jakarta|Indonesian rupiah|Indonesian|Asia
Philippines|Manila|Philippine peso|Filipino|Asia
Colombia|Bogota|Colombian peso|Spanish|South America
Ghana|Accra|Ghanaian cedi|English|Africa
Saudi Arabia|Riyadh|Saudi riyal|Arabic|Asia
Turkey|Ankara|Turkish lira|Turkish|Asia
Egypt|Cairo|Egyptian pound|Arabic|Africa
Bangladesh|Dhaka|Taka|Bengali|Asia
`,
  ([country, capital, currency, language, continent]) => ({
    country,
    capital,
    currency,
    language,
    continent,
  })
);

function inferCreatorVerb(form: string): string {
  if (/(novel|play|poem|epic poem)/i.test(form)) return 'wrote';
  if (/(opera|ballet|concerto|symphony|oratorio|suite|cantata|musical|orchestral work)/i.test(form)) {
    return 'composed';
  }
  return 'created';
}

function buildMixArtsExpansion(cards: MixArtsWorkCard[]): CuratedTriviaSourceQuestion[] {
  const works = cards.map((card) => card.work);
  const creators = dedupeLocal(cards.map((card) => card.creator));
  const forms = dedupeLocal(cards.map((card) => card.form));

  return cards.flatMap((card, index) => {
    const [workA, workB] = pickPeerValues(works, card.work, index);
    const [creatorA, creatorB] = pickPeerValues(creators, card.creator, index + 1);
    const [formA, formB] = pickPeerValues(forms, card.form, index + 2);
    const verb = inferCreatorVerb(card.form);
    return [
      q({
        prompt: `Who ${verb} ${card.work}?`,
        options: buildOptions(card.creator, [creatorA, creatorB]),
        answerIndex: 0,
        difficulty: index < 50 ? 2 : 3,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'low' as TriviaLookupRisk,
        promptKind: 'work',
        salienceScore: card.salience,
        citations: searchCitation(`Reference search: ${card.work}`, `${card.work} ${card.creator}`),
      }),
      q({
        prompt: `${card.work} is best known as which kind of work?`,
        options: buildOptions(card.form, [formA, formB]),
        answerIndex: 0,
        difficulty: 2,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: Math.max(78, card.salience - 8),
        citations: searchCitation(`Reference search: ${card.work} form`, `${card.work} ${card.form}`),
      }),
      q({
        prompt: `Which work is most closely associated with ${card.creator}?`,
        options: buildOptions(card.work, [workA, workB]),
        answerIndex: 0,
        difficulty: index < 20 ? 2 : 3,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'person',
        salienceScore: Math.max(76, card.salience - 6),
        citations: searchCitation(`Reference search: ${card.creator} work`, `${card.creator} ${card.work}`),
      }),
      q({
        prompt: `${card.creator} is best known for working in which art form here?`,
        options: buildOptions(card.form, [formA, formB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'person',
        salienceScore: Math.max(74, card.salience - 10),
        citations: searchCitation(`Reference search: ${card.creator} ${card.form}`, `${card.creator} ${card.form}`),
      }),
      q({
        prompt: `Which ${card.form} was ${verb} by ${card.creator}?`,
        options: buildOptions(card.work, [workA, workB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'work',
        salienceScore: Math.max(74, card.salience - 6),
        citations: searchCitation(`Reference search: ${card.creator} ${card.work}`, `${card.creator} ${card.work} ${card.form}`),
      }),
      q({
        prompt: `Which creator is most closely associated with ${card.work}?`,
        options: buildOptions(card.creator, [creatorA, creatorB]),
        answerIndex: 0,
        difficulty: index < 28 ? 1 : 2,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: Math.max(78, card.salience - 4),
        citations: searchCitation(`Reference search: ${card.work} creator`, `${card.work} ${card.creator}`),
      }),
      q({
        prompt: `Which creator made the ${card.form} ${card.work}?`,
        options: buildOptions(card.creator, [creatorA, creatorB]),
        answerIndex: 0,
        difficulty: index < 36 ? 1 : index < 96 ? 2 : 3,
        domain: 'arts',
        subdomain: card.subdomain,
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: hardTailSalience(Math.max(80, card.salience - 4), index, 96, 72, 36, 78),
        citations: searchCitation(`Reference search: ${card.work} ${card.creator}`, `${card.work} ${card.creator} ${card.form}`),
      }),
    ];
  });
}

function buildMixHistoryExpansion(cards: MixHistoryFigureCard[]): CuratedTriviaSourceQuestion[] {
  const people = cards.map((card) => card.person);
  const titles = dedupeLocal(cards.map((card) => card.title));
  const places = dedupeLocal(cards.map((card) => card.place));

  return cards.flatMap((card, index) => {
    const [personA, personB] = pickPeerValues(people, card.person, index);
    const [titleA, titleB] = pickPeerValues(titles, card.title, index + 1);
    const [placeA, placeB] = pickPeerValues(places, card.place, index + 2);
    return [
      q({
        prompt: `Which historical figure is most associated with being the ${card.title} of ${card.place}?`,
        options: buildOptions(card.person, [personA, personB]),
        answerIndex: 0,
        difficulty: index < 50 ? 2 : 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: card.salience,
        citations: searchCitation(`Reference search: ${card.person}`, `${card.person} ${card.title} ${card.place}`),
      }),
      q({
        prompt: `${card.person} is most closely associated with leading or ruling which place?`,
        options: buildOptions(card.place, [placeA, placeB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'place',
        salienceScore: hardTailSalience(Math.max(76, card.salience - 4), index, 52, 72),
        citations: searchCitation(`Reference search: ${card.person} place`, `${card.person} ${card.place}`),
      }),
      q({
        prompt: `Which title is most closely associated with ${card.person}?`,
        options: buildOptions(card.title, [titleA, titleB]),
        answerIndex: 0,
        difficulty: 2,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 6), index, 52, 72),
        citations: searchCitation(`Reference search: ${card.person} title`, `${card.person} ${card.title}`),
      }),
      q({
        prompt: `Which place is most closely associated with the historical figure ${card.person}?`,
        options: buildOptions(card.place, [placeA, placeB]),
        answerIndex: 0,
        difficulty: 2,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 8), index, 52, 72),
        citations: searchCitation(`Reference search: ${card.person} place reverse`, `${card.person} ${card.place}`),
      }),
      q({
        prompt: `Which place is most closely associated with the title ${card.title}?`,
        options: buildOptions(card.place, [placeA, placeB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(Math.max(74, card.salience - 8), index, 52, 72),
        citations: searchCitation(`Reference search: ${card.title} ${card.place}`, `${card.title} ${card.place}`),
      }),
      q({
        prompt: `Which title is most closely associated with ruling ${card.place}?`,
        options: buildOptions(card.title, [titleA, titleB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(72, card.salience - 10), index, 52, 70),
        citations: searchCitation(`Reference search: ${card.place} ${card.title}`, `${card.place} ${card.title}`),
      }),
      q({
        prompt: `Which historical figure is most closely associated with ${card.place}?`,
        options: buildOptions(card.person, [personA, personB]),
        answerIndex: 0,
        difficulty: index < 24 ? 1 : index < 64 ? 2 : 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 4), index, 64, 70, 24, 76),
        citations: searchCitation(`Reference search: ${card.place} figure`, `${card.person} ${card.place}`),
      }),
      q({
        prompt: `Which title did ${card.person} most famously hold?`,
        options: buildOptions(card.title, [titleA, titleB]),
        answerIndex: 0,
        difficulty: index < 32 ? 1 : index < 88 ? 2 : 3,
        domain: 'history',
        subdomain: 'people',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(80, card.salience - 4), index, 88, 70, 32, 78),
        citations: searchCitation(`Reference search: ${card.person} title`, `${card.person} ${card.title}`),
      }),
    ];
  });
}

function buildMixScienceExpansion(cards: MixScienceCard[]): CuratedTriviaSourceQuestion[] {
  const scientists = cards.map((card) => card.scientist);
  const fields = dedupeLocal(cards.map((card) => card.field));
  const discoveries = cards.map((card) => card.discovery);

  return cards.flatMap((card, index) => {
    const [scientistA, scientistB] = pickPeerValues(scientists, card.scientist, index);
    const [fieldA, fieldB] = pickPeerValues(fields, card.field, index + 1);
    const [discoveryA, discoveryB] = pickPeerValues(discoveries, card.discovery, index + 2);
    return [
      q({
        prompt: `Which scientist is most closely associated with ${card.discovery}?`,
        options: buildOptions(card.scientist, [scientistA, scientistB]),
        answerIndex: 0,
        difficulty: index < 48 ? 2 : 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: card.salience,
        citations: searchCitation(`Reference search: ${card.scientist}`, `${card.scientist} ${card.discovery}`),
      }),
      q({
        prompt: `${card.scientist} worked primarily in which scientific field?`,
        options: buildOptions(card.field, [fieldA, fieldB]),
        answerIndex: 0,
        difficulty: 2,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 8), index, 20, 72),
        citations: searchCitation(`Reference search: ${card.scientist} field`, `${card.scientist} ${card.field}`),
      }),
      q({
        prompt: `${card.discovery} is most closely associated with which scientific field?`,
        options: buildOptions(card.field, [fieldA, fieldB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(74, card.salience - 10), index, 20, 72),
        citations: searchCitation(`Reference search: ${card.discovery} field`, `${card.discovery} ${card.field}`),
      }),
      q({
        prompt: `Which scientist worked primarily in ${card.field}?`,
        options: buildOptions(card.scientist, [scientistA, scientistB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'person',
        salienceScore: hardTailSalience(Math.max(76, card.salience - 6), index, 20, 72),
        citations: searchCitation(`Reference search: ${card.field} scientist`, `${card.scientist} ${card.field}`),
      }),
      q({
        prompt: `Which discovery is most closely associated with ${card.scientist}?`,
        options: buildOptions(card.discovery, [discoveryA, discoveryB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(74, card.salience - 8), index, 20, 72),
        citations: searchCitation(`Reference search: ${card.scientist} discovery`, `${card.scientist} ${card.discovery}`),
      }),
      q({
        prompt: `Which scientist is associated with ${card.discovery} in ${card.field}?`,
        options: buildOptions(card.scientist, [scientistA, scientistB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'person',
        salienceScore: hardTailSalience(Math.max(72, card.salience - 10), index, 20, 70),
        citations: searchCitation(`Reference search: ${card.scientist} ${card.discovery}`, `${card.scientist} ${card.discovery} ${card.field}`),
      }),
      q({
        prompt: `Which field is most closely associated with ${card.scientist}?`,
        options: buildOptions(card.field, [fieldA, fieldB]),
        answerIndex: 0,
        difficulty: index < 20 ? 1 : index < 60 ? 2 : 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 6), index, 60, 70, 20, 76),
        citations: searchCitation(`Reference search: ${card.scientist} field short`, `${card.scientist} ${card.field}`),
      }),
      q({
        prompt: `Which discovery is most closely associated with the field ${card.field}?`,
        options: buildOptions(card.discovery, [discoveryA, discoveryB]),
        answerIndex: 0,
        difficulty: index < 22 ? 1 : index < 72 ? 2 : 3,
        domain: 'science',
        subdomain: 'science-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'medium',
        promptKind: 'concept',
        salienceScore: hardTailSalience(Math.max(78, card.salience - 6), index, 72, 70, 22, 76),
        citations: searchCitation(`Reference search: ${card.field} discovery`, `${card.field} ${card.discovery}`),
      }),
    ];
  });
}

function buildExtraCountryExpansion(cards: MixCountryCard[]): CuratedTriviaSourceQuestion[] {
  const countries = cards.map((card) => card.country);
  const capitals = dedupeLocal(cards.map((card) => card.capital));
  const currencies = dedupeLocal(cards.map((card) => card.currency));
  const languages = dedupeLocal(cards.map((card) => card.language));
  const continents = dedupeLocal(cards.map((card) => card.continent));

  return cards.flatMap((card, index) => {
    const [countryA, countryB] = pickPeerValues(countries, card.country, index + 3);
    const [capitalA, capitalB] = pickPeerValues(capitals, card.capital, index);
    const [currencyA, currencyB] = pickPeerValues(currencies, card.currency, index + 1);
    const [languageA, languageB] = pickPeerValues(languages, card.language, index + 2);
    const [continentA, continentB] = pickPeerValues(continents, card.continent, index + 4);
    return [
      q({
        prompt: `What is the capital of ${card.country}?`,
        options: buildOptions(card.capital, [capitalA, capitalB]),
        answerIndex: 0,
        difficulty: index < 24 ? 2 : 3,
        domain: 'world',
        subdomain: 'geography',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: index < 8 ? 80 : 74,
        citations: searchCitation(`Reference search: capital of ${card.country}`, `${card.country} capital ${card.capital}`),
      }),
      q({
        prompt: `Which country has ${card.capital} as its capital?`,
        options: buildOptions(card.country, [countryA, countryB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'world',
        subdomain: 'geography',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(74, index, 12, 72),
        citations: searchCitation(`Reference search: ${card.capital} capital country`, `${card.capital} capital ${card.country}`),
      }),
      q({
        prompt: `Which currency is used in ${card.country}?`,
        options: buildOptions(card.currency, [currencyA, currencyB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'world',
        subdomain: 'world-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(74, index, 12, 72),
        citations: searchCitation(`Reference search: currency of ${card.country}`, `${card.country} currency ${card.currency}`),
      }),
      q({
        prompt: `Which country uses ${card.currency} as its currency?`,
        options: buildOptions(card.country, [countryA, countryB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'world',
        subdomain: 'world-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(72, index, 12, 72),
        citations: searchCitation(`Reference search: ${card.currency} country`, `${card.currency} ${card.country}`),
      }),
      q({
        prompt: `Which language is official in ${card.country}?`,
        options: buildOptions(card.language, [languageA, languageB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'world',
        subdomain: 'culture',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'concept',
        salienceScore: hardTailSalience(74, index, 12, 72),
        citations: searchCitation(`Reference search: official language of ${card.country}`, `${card.country} official language ${card.language}`),
      }),
      q({
        prompt: `Which continent is ${card.country} on?`,
        options: buildOptions(card.continent, [continentA, continentB]),
        answerIndex: 0,
        difficulty: 2,
        domain: 'world',
        subdomain: 'geography',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: 80,
        citations: searchCitation(`Reference search: ${card.country} continent`, `${card.country} continent ${card.continent}`),
      }),
      q({
        prompt: `Which country is in ${card.continent} and uses ${card.currency}?`,
        options: buildOptions(card.country, [countryA, countryB]),
        answerIndex: 0,
        difficulty: 3,
        domain: 'world',
        subdomain: 'world-facts',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(74, index, 12, 72),
        citations: searchCitation(`Reference search: ${card.country} ${card.currency}`, `${card.country} ${card.continent} ${card.currency}`),
      }),
      q({
        prompt: `Which country lists ${card.language} as an official language?`,
        options: buildOptions(card.country, [countryA, countryB]),
        answerIndex: 0,
        difficulty: index < 18 ? 1 : 2,
        domain: 'world',
        subdomain: 'culture',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: index < 18 ? 80 : 74,
        citations: searchCitation(`Reference search: ${card.country} language`, `${card.country} official language ${card.language}`),
      }),
      q({
        prompt: `Which country is in ${card.continent} and has ${card.capital} as its capital?`,
        options: buildOptions(card.country, [countryA, countryB]),
        answerIndex: 0,
        difficulty: index < 16 ? 1 : index < 40 ? 2 : 3,
        domain: 'world',
        subdomain: 'geography',
        editorialBucket: 'evergreen',
        lookupRisk: 'low',
        promptKind: 'place',
        salienceScore: hardTailSalience(78, index, 40, 72, 16, 80),
        citations: searchCitation(`Reference search: ${card.country} ${card.capital}`, `${card.country} capital ${card.capital} ${card.continent}`),
      }),
    ];
  });
}

export const CURATED_MIX_LAUNCH_EXPANSION: CuratedTriviaSourceQuestion[] = [
  ...buildMixArtsExpansion([...MIX_ARTS_WORK_CARDS, ...MIX_ARTS_WORK_CARD_EXPANSION]),
  ...buildMixHistoryExpansion([...MIX_HISTORY_FIGURE_CARDS, ...MIX_HISTORY_FIGURE_CARD_EXPANSION]),
  ...buildMixScienceExpansion([...MIX_SCIENCE_CARDS, ...MIX_SCIENCE_CARD_EXPANSION]),
  ...buildExtraCountryExpansion([...EXTRA_MIX_COUNTRY_CARDS, ...EXTRA_MIX_COUNTRY_CARD_EXPANSION]),
  q({
    prompt: 'What does the music term staccato tell performers to do?',
    options: ['Play the notes short and detached', 'Slow down at the end of the phrase', 'Repeat the melody one octave lower'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 85,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Staccato means the notes should sound short and detached.',
    rationaleLong: 'In musical notation, staccato calls for crisp, separated notes instead of a smooth connected line.',
    citations: searchCitation('Staccato music', 'staccato music'),
  }),
  q({
    prompt: 'In storytelling, what is a prologue?',
    options: ['An opening section before the main narrative begins', 'A final scene that shows what happens years later', 'A side plot told only through dialogue'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'work',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A prologue is the opening section before the main story.',
    rationaleLong: 'Writers use a prologue to set mood, background, or stakes before the central narrative fully begins.',
    citations: searchCitation('Prologue literature', 'prologue literature'),
  }),
  q({
    prompt: 'In art, what is a diptych?',
    options: ['A work made of two connected panels', 'A sketch done only in charcoal', 'A sculpture carved from a single block'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A diptych is a work arranged in two linked panels.',
    rationaleLong: 'The term diptych originally referred to paired hinged tablets and now usually means an artwork split across two connected parts.',
    citations: searchCitation('Diptych art', 'diptych art'),
  }),
  q({
    prompt: 'What does the tempo marking allegro usually mean?',
    options: ['Fast and lively', 'Very soft and subdued', 'Free of strict rhythm'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Allegro signals a fast, lively tempo.',
    rationaleLong: 'In classical music markings, allegro tells performers the passage should move briskly and energetically.',
    citations: searchCitation('Allegro tempo', 'allegro tempo'),
  }),
  q({
    prompt: 'In writing, what is dramatic irony?',
    options: ['When the audience knows something a character does not', 'When a story is told in reverse order', 'When two characters speak in rhyme'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Dramatic irony happens when the audience knows more than a character.',
    rationaleLong: 'Writers use dramatic irony to create tension because players or readers can see danger or misunderstanding coming before the character does.',
    citations: searchCitation('Dramatic irony', 'dramatic irony'),
  }),
  q({
    prompt: 'What is a refrain in poetry or song?',
    options: ['A repeated line or phrase', 'A sudden change of narrator', 'A line that breaks the rhyme pattern on purpose'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A refrain is a repeated line or phrase.',
    rationaleLong: 'Poems and songs use refrains to create emphasis, structure, and a memorable returning idea.',
    citations: searchCitation('Refrain poetry', 'refrain poetry'),
  }),
  q({
    prompt: 'What does the term unreliable narrator mean?',
    options: ['A storyteller whose account cannot be fully trusted', 'A narrator who never appears in the first person', 'A speaker who interrupts the story with stage directions'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An unreliable narrator gives a version of events that cannot be fully trusted.',
    rationaleLong: 'Readers have to read between the lines with an unreliable narrator because the storyteller is biased, mistaken, deceptive, or limited.',
    citations: searchCitation('Unreliable narrator', 'unreliable narrator'),
  }),
  q({
    prompt: 'In photography, what is a silhouette?',
    options: ['A dark outline seen against a brighter background', 'A close-up shot taken with a wide-angle lens', 'A portrait lit only from directly overhead'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A silhouette shows a dark shape against a brighter background.',
    rationaleLong: 'Silhouettes emphasize outline and shape by backlighting the subject so details inside the form disappear.',
    citations: searchCitation('Silhouette photography', 'silhouette photography'),
  }),
  q({
    prompt: 'What does the word dormant describe?',
    options: ['Temporarily inactive but able to become active again', 'Naturally resistant to heat and fire', 'Moving in a regular repeating cycle'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'biology',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Dormant means temporarily inactive.',
    rationaleLong: 'Seeds, volcanoes, and even business terms use dormant to mean inactive for now but capable of becoming active again.',
    citations: searchCitation('Dormant definition science', 'dormant definition science'),
  }),
  q({
    prompt: 'In chemistry, what is a catalyst?',
    options: ['Something that speeds a reaction without being used up', 'A substance that stops a reaction completely', 'The final solid left after a liquid evaporates'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'chemistry',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 86,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A catalyst speeds up a reaction without being consumed.',
    rationaleLong: 'Catalysts lower the energy barrier for a reaction, helping it happen faster while remaining available to work again.',
    citations: searchCitation('Catalyst chemistry', 'catalyst chemistry'),
  }),
  q({
    prompt: 'What does biodegradable describe?',
    options: ['Able to break down naturally through living processes', 'Safe to store only below freezing', 'Made entirely from recycled metal'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'environment',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Biodegradable means it can break down naturally.',
    rationaleLong: 'Materials described as biodegradable can be decomposed by microorganisms and other natural processes over time.',
    citations: searchCitation('Biodegradable meaning', 'biodegradable meaning'),
  }),
  q({
    prompt: 'What is an isotope?',
    options: ['Atoms of the same element with different numbers of neutrons', 'A mineral made from compressed plant matter', 'A cloud layer made of frozen water vapor'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'chemistry',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Isotopes are versions of the same element with different neutron counts.',
    rationaleLong: 'Because they share the same number of protons, isotopes are the same element, but their differing neutrons can change mass and stability.',
    citations: searchCitation('Isotope chemistry', 'isotope chemistry'),
  }),
  q({
    prompt: 'What does perennial describe in plant life?',
    options: ['A plant that lives for more than two years', 'A plant that blooms only at night', 'A plant that grows only in deserts'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'biology',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A perennial plant lives for more than two years.',
    rationaleLong: 'Perennials return across multiple growing seasons, unlike annuals that complete their life cycle in a single year.',
    citations: searchCitation('Perennial plant', 'perennial plant'),
  }),
  q({
    prompt: 'What does the word eclipse describe?',
    options: ['One celestial body moving into the shadow of another', 'A planet completing one orbit around its star', 'A comet breaking apart near the sun'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'space',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An eclipse happens when one celestial body moves into another’s shadow.',
    rationaleLong: 'Solar and lunar eclipses are both shadow events caused by the alignment of the Sun, Earth, and Moon.',
    citations: searchCitation('Eclipse astronomy', 'eclipse astronomy'),
  }),
  q({
    prompt: 'What does the word saline describe?',
    options: ['Containing salt', 'Giving off light', 'Unable to conduct electricity'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'science',
    subdomain: 'chemistry',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 81,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Saline means salty or containing salt.',
    rationaleLong: 'The word saline is commonly used for saltwater or salt-based medical solutions such as normal saline.',
    citations: searchCitation('Saline meaning', 'saline meaning'),
  }),
  q({
    prompt: 'What is an isthmus?',
    options: ['A narrow strip of land connecting two larger land areas', 'A steep-sided desert plateau', 'A valley carved by a glacier'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An isthmus is a narrow strip of land linking larger landmasses.',
    rationaleLong: 'Famous examples include the Isthmus of Panama, where a thin land bridge connects much larger continental areas.',
    citations: searchCitation('Isthmus geography', 'isthmus geography'),
  }),
  q({
    prompt: 'What is an atoll?',
    options: ['A ring-shaped coral island or reef', 'A cliff formed by cooled lava', 'A river delta split by mountain ridges'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An atoll is a ring-shaped coral island or reef.',
    rationaleLong: 'Atolls usually form around a lagoon after coral grows around a sinking volcanic island.',
    citations: searchCitation('Atoll geography', 'atoll geography'),
  }),
  q({
    prompt: 'What does embargo mean in international affairs?',
    options: ['An official ban on trade with a country', 'A formal agreement to share military bases', 'A process for settling border disputes through voting'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'civics',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An embargo is an official restriction on trade.',
    rationaleLong: 'Governments use embargos to block commerce with another country as a form of pressure or punishment.',
    citations: searchCitation('Embargo definition', 'embargo definition'),
  }),
  q({
    prompt: 'What does armistice mean?',
    options: ['A formal agreement to stop fighting', 'A demand that one side surrender without conditions', 'A treaty that creates a military alliance'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'An armistice is an agreement to stop fighting.',
    rationaleLong: 'An armistice halts active combat, though it is not always the same thing as a final peace treaty.',
    citations: searchCitation('Armistice definition', 'armistice definition'),
  }),
  q({
    prompt: 'What does it mean to abdicate?',
    options: ['To give up a throne or other position of rule', 'To rule jointly with a rival claimant', 'To inherit power through a written charter'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 84,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'To abdicate is to step down from a throne or ruling position.',
    rationaleLong: 'The verb is most often used for monarchs who formally give up the crown before death.',
    citations: searchCitation('Abdicate definition', 'abdicate definition'),
  }),
  q({
    prompt: 'What does diaspora describe?',
    options: ['A people dispersed from an original homeland', 'A government led by military officers', 'A border region claimed by two empires at once'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Diaspora refers to a people dispersed away from their homeland.',
    rationaleLong: 'The word diaspora is used for communities living outside an ancestral homeland while still linked by origin or identity.',
    citations: searchCitation('Diaspora definition', 'diaspora definition'),
  }),
  q({
    prompt: 'What is a referendum?',
    options: ['A direct public vote on a specific proposal', 'A court review of a disputed election', 'A speech given to open a new legislature'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'world',
    subdomain: 'civics',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 83,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A referendum is a direct vote by the public on a specific measure.',
    rationaleLong: 'Governments use referendums when a proposal is sent directly to voters rather than decided only by elected lawmakers.',
    citations: searchCitation('Referendum definition', 'referendum definition'),
  }),
  q({
    prompt: 'In history or politics, what does annex mean?',
    options: ['To add territory to an existing state', 'To divide a country into smaller provinces', 'To end a monarchy by public vote'],
    answerIndex: 0,
    difficulty: 2,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 82,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'To annex is to add territory to an existing state.',
    rationaleLong: 'Annexation happens when a state takes in land and treats it as part of its own territory.',
    citations: searchCitation('Annex definition politics', 'annex definition politics'),
  }),
  q({
    prompt: 'In music and film, what is a leitmotif?',
    options: ['A recurring theme linked to a character, place, or idea', 'A melody sung by the audience between acts', 'A final section that returns to the opening tempo'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A leitmotif is a recurring theme tied to a character, place, or idea.',
    rationaleLong: 'Composers and film scorers use leitmotifs so a musical phrase becomes shorthand for a person, setting, or emotional idea.',
    citations: searchCitation('Leitmotif definition', 'leitmotif definition'),
  }),
  q({
    prompt: 'In visual art, what is chiaroscuro?',
    options: ['Strong contrast between light and shadow', 'A painting done only with a palette knife', 'A sculpture designed to be viewed from above'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Chiaroscuro means strong contrast between light and dark.',
    rationaleLong: 'Artists use chiaroscuro to create volume, drama, and depth by sharply modeling forms with light and shadow.',
    citations: searchCitation('Chiaroscuro definition', 'chiaroscuro definition'),
  }),
  q({
    prompt: 'In film, what does diegetic sound mean?',
    options: ['Sound that exists within the story world', 'Sound heard only by the audience as score', 'Dialogue added later in postproduction'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'movies',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 68,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Diegetic sound comes from within the story world.',
    rationaleLong: 'If characters can hear the sound too, like a radio in the scene or a door slamming, it counts as diegetic.',
    citations: searchCitation('Diegetic sound definition', 'diegetic sound definition'),
  }),
  q({
    prompt: 'In art, what is foreshortening?',
    options: ['Showing an object or body part as compressed in depth', 'Painting wet plaster before it dries', 'Balancing a composition around perfect symmetry'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 68,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Foreshortening shows something compressed in depth because of perspective.',
    rationaleLong: 'Artists foreshorten forms to make arms, legs, or objects look as though they project toward or away from the viewer.',
    citations: searchCitation('Foreshortening definition', 'foreshortening definition'),
  }),
  q({
    prompt: 'In economics, what does mercantilism emphasize?',
    options: ['Building national wealth through trade surpluses and state control', 'Ending all tariffs in favor of open world trade', 'Measuring productivity only by industrial output'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Mercantilism emphasizes state-controlled trade and accumulating wealth.',
    rationaleLong: 'Mercantilist systems favored exports, restricted imports, and treated economic policy as a tool of state power.',
    citations: searchCitation('Mercantilism definition', 'mercantilism definition'),
  }),
  q({
    prompt: 'What does bicameral mean in government?',
    options: ['Having two legislative chambers', 'Allowing judges to veto legislation directly', 'Choosing a head of state by lottery'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'civics',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Bicameral means a legislature has two chambers.',
    rationaleLong: 'A bicameral system divides the lawmaking body into two houses, such as a senate and a lower chamber.',
    citations: searchCitation('Bicameral definition', 'bicameral definition'),
  }),
  q({
    prompt: 'In politics, what is a protectorate?',
    options: ['A territory controlled by a stronger state while keeping limited local rule', 'A neutral zone governed jointly by two neighboring states', 'A republic whose constitution cannot be amended'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'civics',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 68,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A protectorate is a territory under the protection and control of a stronger state.',
    rationaleLong: 'Protectorates often keep local authorities in place while foreign policy or military power is effectively controlled from outside.',
    citations: searchCitation('Protectorate definition', 'protectorate definition'),
  }),
  q({
    prompt: 'What does secession mean in politics?',
    options: ['Formal withdrawal from a larger political union', 'Joint rule by two rival governments', 'Transferring power from civilian leaders to the military'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Secession means withdrawing from a larger political union.',
    rationaleLong: 'The term is used when a region or state attempts to break away and become separate from the larger political body it belonged to.',
    citations: searchCitation('Secession definition', 'secession definition'),
  }),
  q({
    prompt: 'In science, what does entropy measure most broadly?',
    options: ['The degree of disorder or energy dispersal in a system', 'The speed at which a reaction reaches equilibrium', 'The number of protons inside an atomic nucleus'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Entropy broadly measures disorder or energy dispersal.',
    rationaleLong: 'In thermodynamics, entropy describes how energy spreads out and how ordered or disordered a system is overall.',
    citations: searchCitation('Entropy definition', 'entropy definition'),
  }),
  q({
    prompt: 'What is osmosis?',
    options: ['The movement of water through a semipermeable membrane', 'The splitting of atomic nuclei in a chain reaction', 'The transfer of heat by direct contact only'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 69,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Osmosis is the movement of water across a semipermeable membrane.',
    rationaleLong: 'Water moves through the membrane toward the side with the higher concentration of dissolved material, helping balance concentrations.',
    citations: searchCitation('Osmosis definition', 'osmosis definition'),
  }),
  q({
    prompt: 'In chemistry, what does exothermic mean?',
    options: ['Releasing heat to the surroundings', 'Absorbing all available light energy', 'Turning a liquid directly into a solid'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 68,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'Exothermic means heat is released to the surroundings.',
    rationaleLong: 'An exothermic process gives off energy as heat, which is why the surroundings warm up rather than cool down.',
    citations: searchCitation('Exothermic definition', 'exothermic definition'),
  }),
  q({
    prompt: 'In genetics, what is a phenotype?',
    options: ['The observable traits of an organism', 'The complete set of its DNA code', 'A sudden change in chromosome number'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'term',
    salienceScore: 68,
    lookupRisk: 'low',
    isTrickQuestion: true,
    rationaleShort: 'A phenotype is an organism’s observable traits.',
    rationaleLong: 'Phenotype covers visible or measurable characteristics that result from genes interacting with the environment.',
    citations: searchCitation('Phenotype definition', 'phenotype definition'),
  }),
  q({
    prompt: 'Which composer wrote The Rite of Spring?',
    options: ['Igor Stravinsky', 'Claude Debussy', 'Sergei Rachmaninoff'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Igor Stravinsky wrote The Rite of Spring.',
    rationaleLong: 'The Rite of Spring is one of Stravinsky’s signature works and one of the most famous premieres in music history.',
    citations: searchCitation('The Rite of Spring composer', 'The Rite of Spring composer'),
  }),
  q({
    prompt: 'Which artist painted Nighthawks?',
    options: ['Edward Hopper', 'Grant Wood', 'Georgia O Keeffe'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Edward Hopper painted Nighthawks.',
    rationaleLong: 'Hopper’s Nighthawks is one of the best-known American paintings of the twentieth century.',
    citations: searchCitation('Nighthawks painter', 'Nighthawks painter'),
  }),
  q({
    prompt: 'Which novelist wrote Beloved?',
    options: ['Toni Morrison', 'Alice Walker', 'Maya Angelou'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Beloved was written by Toni Morrison.',
    rationaleLong: 'Toni Morrison wrote Beloved, the acclaimed novel centered on memory, trauma, and the legacy of slavery.',
    citations: searchCitation('Beloved author', 'Beloved author'),
  }),
  q({
    prompt: 'Which playwright wrote Pygmalion?',
    options: ['George Bernard Shaw', 'Oscar Wilde', 'Henrik Ibsen'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'George Bernard Shaw wrote Pygmalion.',
    rationaleLong: 'Pygmalion is the famous Shaw play later adapted into the musical My Fair Lady.',
    citations: searchCitation('Pygmalion playwright', 'Pygmalion playwright'),
  }),
  q({
    prompt: 'Which musician recorded the landmark jazz album Kind of Blue?',
    options: ['Miles Davis', 'John Coltrane', 'Duke Ellington'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Miles Davis recorded Kind of Blue.',
    rationaleLong: 'Kind of Blue is Miles Davis’s most famous album and one of jazz’s best-known recordings.',
    citations: searchCitation('Kind of Blue artist', 'Kind of Blue Miles Davis'),
  }),
  q({
    prompt: 'Which country uses the forint?',
    options: ['Hungary', 'Romania', 'Croatia'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'currency',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Hungary uses the forint.',
    rationaleLong: 'The Hungarian national currency is the forint, rather than the euro used by many other European countries.',
    citations: searchCitation('Hungary currency forint', 'Hungary currency forint'),
  }),
  q({
    prompt: 'Which country uses the baht?',
    options: ['Thailand', 'Vietnam', 'Malaysia'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'currency',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Thailand uses the baht.',
    rationaleLong: 'The baht is the currency of Thailand.',
    citations: searchCitation('Thailand baht currency', 'Thailand baht currency'),
  }),
  q({
    prompt: 'Which river flows through Baghdad?',
    options: ['Tigris', 'Euphrates', 'Jordan'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Baghdad sits on the Tigris.',
    rationaleLong: 'Baghdad is located along the Tigris River, one of the two great rivers of Mesopotamia.',
    citations: searchCitation('Baghdad river Tigris', 'Baghdad river Tigris'),
  }),
  q({
    prompt: 'Which city sits on the Bosporus Strait?',
    options: ['Istanbul', 'Athens', 'Alexandria'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Istanbul sits on the Bosporus Strait.',
    rationaleLong: 'Istanbul’s famous position on the Bosporus places the city between Europe and Asia.',
    citations: searchCitation('Bosporus city Istanbul', 'Bosporus city Istanbul'),
  }),
  q({
    prompt: 'Which mountain range is commonly used as part of the boundary between Europe and Asia?',
    options: ['The Ural Mountains', 'The Pyrenees', 'The Carpathians'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'The Urals are commonly treated as part of the Europe-Asia boundary.',
    rationaleLong: 'Geographers often use the Ural Mountains as a major segment of the conventional dividing line between Europe and Asia.',
    citations: searchCitation('Europe Asia boundary Ural Mountains', 'Europe Asia boundary Ural Mountains'),
  }),
  q({
    prompt: 'Which empire was ruled from Constantinople?',
    options: ['The Byzantine Empire', 'The Ottoman Empire', 'The Holy Roman Empire'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Constantinople was the capital of the Byzantine Empire.',
    rationaleLong: 'The Byzantine Empire ruled from Constantinople for centuries after the fall of the western Roman Empire.',
    citations: searchCitation('Constantinople Byzantine Empire', 'Constantinople Byzantine Empire'),
  }),
  q({
    prompt: 'Which battle ended Napoleon’s rule in 1815?',
    options: ['Waterloo', 'Austerlitz', 'Trafalgar'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'event',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Napoleon’s final defeat came at Waterloo.',
    rationaleLong: 'The Battle of Waterloo in 1815 ended Napoleon Bonaparte’s rule and marked the close of the Napoleonic Wars.',
    citations: searchCitation('Napoleon final defeat Waterloo', 'Napoleon final defeat Waterloo'),
  }),
  q({
    prompt: 'Which leader introduced the New Deal in the United States?',
    options: ['Franklin D. Roosevelt', 'Harry S. Truman', 'Herbert Hoover'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Franklin D. Roosevelt introduced the New Deal.',
    rationaleLong: 'Roosevelt launched the New Deal as the signature set of programs and reforms aimed at responding to the Great Depression.',
    citations: searchCitation('New Deal Franklin Roosevelt', 'New Deal Franklin Roosevelt'),
  }),
  q({
    prompt: 'Which reform movement fought for women’s voting rights?',
    options: ['The suffrage movement', 'The enclosure movement', 'The abolition of serfdom'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'event',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'The suffrage movement fought for women’s voting rights.',
    rationaleLong: 'Suffrage movements in many countries campaigned to secure women the legal right to vote.',
    citations: searchCitation('suffrage movement women voting rights', 'suffrage movement women voting rights'),
  }),
  q({
    prompt: 'Which scientist proposed continental drift?',
    options: ['Alfred Wegener', 'Niels Bohr', 'Louis Pasteur'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Alfred Wegener proposed continental drift.',
    rationaleLong: 'Wegener argued that continents had once been joined and later drifted apart, anticipating plate-tectonic theory.',
    citations: searchCitation('continental drift Alfred Wegener', 'continental drift Alfred Wegener'),
  }),
  q({
    prompt: 'Which astronomer is most associated with showing that galaxies exist beyond the Milky Way?',
    options: ['Edwin Hubble', 'Tycho Brahe', 'Nicolaus Copernicus'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Edwin Hubble helped show that galaxies exist beyond the Milky Way.',
    rationaleLong: 'Hubble’s observations of distant galaxies transformed astronomy by proving the Milky Way is not the whole universe.',
    citations: searchCitation('Edwin Hubble galaxies beyond Milky Way', 'Edwin Hubble galaxies beyond Milky Way'),
  }),
  q({
    prompt: 'Which element has the chemical symbol Sn?',
    options: ['Tin', 'Sodium', 'Silicon'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Sn is the symbol for tin.',
    rationaleLong: 'The symbol Sn comes from the Latin word stannum, which is the source of the modern chemical symbol for tin.',
    citations: searchCitation('Sn chemical symbol tin', 'Sn chemical symbol tin'),
  }),
  q({
    prompt: 'What is the name for the boundary where one tectonic plate sinks beneath another?',
    options: ['A subduction zone', 'A floodplain', 'A biosphere'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'That boundary is called a subduction zone.',
    rationaleLong: 'Subduction zones form where one tectonic plate is forced downward beneath another at a convergent boundary.',
    citations: searchCitation('subduction zone definition', 'subduction zone definition'),
  }),
  q({
    prompt: 'Which novelist wrote The Color Purple?',
    options: ['Alice Walker', 'Toni Morrison', 'Zora Neale Hurston'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Alice Walker wrote The Color Purple.',
    rationaleLong: 'The Color Purple is one of Alice Walker’s best-known novels and a major modern American work.',
    citations: searchCitation('The Color Purple author', 'The Color Purple author'),
  }),
  q({
    prompt: 'Which painter created American Gothic?',
    options: ['Grant Wood', 'Thomas Hart Benton', 'Edward Hopper'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Grant Wood created American Gothic.',
    rationaleLong: 'American Gothic is the iconic Grant Wood painting famous for its stern Midwestern portrait pair.',
    citations: searchCitation('American Gothic painter', 'American Gothic painter'),
  }),
  q({
    prompt: 'Which artist painted Liberty Leading the People?',
    options: ['Eugene Delacroix', 'Jacques-Louis David', 'Jean-Auguste-Dominique Ingres'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'visual-art',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Eugene Delacroix painted Liberty Leading the People.',
    rationaleLong: 'Delacroix’s Liberty Leading the People became one of the defining images of nineteenth-century French painting.',
    citations: searchCitation('Liberty Leading the People painter', 'Liberty Leading the People painter'),
  }),
  q({
    prompt: 'Which album is most closely associated with Fleetwood Mac here?',
    options: ['Rumours', 'Tapestry', 'Graceland'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'music',
    editorialBucket: 'experimental',
    promptKind: 'work',
    salienceScore: 74,
    lookupRisk: 'low',
    rationaleShort: 'Rumours is the Fleetwood Mac album in this set.',
    rationaleLong: 'Rumours is the landmark Fleetwood Mac album and one of the best-known records of the 1970s.',
    citations: searchCitation('Fleetwood Mac Rumours album', 'Fleetwood Mac Rumours album'),
  }),
  q({
    prompt: "Which novelist wrote The Handmaid's Tale?",
    options: ['Margaret Atwood', 'Alice Munro', 'Doris Lessing'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'arts',
    subdomain: 'literature',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: "Margaret Atwood wrote The Handmaid's Tale.",
    rationaleLong: "The Handmaid's Tale is Margaret Atwood’s dystopian novel about power, gender, and authoritarian control.",
    citations: searchCitation('The Handmaid s Tale author', 'The Handmaid s Tale author'),
  }),
  q({
    prompt: 'Which country uses the zloty?',
    options: ['Poland', 'Hungary', 'Croatia'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'currency',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Poland uses the zloty.',
    rationaleLong: 'The zloty is the national currency of Poland.',
    citations: searchCitation('Poland zloty currency', 'Poland zloty currency'),
  }),
  q({
    prompt: 'Which strait separates Asia from North America?',
    options: ['Bering Strait', 'Bosporus Strait', 'Strait of Gibraltar'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Asia and North America are separated by the Bering Strait.',
    rationaleLong: 'The Bering Strait lies between Russia and Alaska and conventionally marks the divide between Asia and North America.',
    citations: searchCitation('Asia North America strait Bering', 'Asia North America strait Bering'),
  }),
  q({
    prompt: 'Which desert covers much of northern Chile?',
    options: ['Atacama Desert', 'Kalahari Desert', 'Gobi Desert'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Northern Chile is home to the Atacama Desert.',
    rationaleLong: 'The Atacama Desert stretches across northern Chile and is one of the driest places on Earth.',
    citations: searchCitation('northern Chile desert Atacama', 'northern Chile desert Atacama'),
  }),
  q({
    prompt: 'Which country uses the ringgit?',
    options: ['Malaysia', 'Indonesia', 'Vietnam'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'currency',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Malaysia uses the ringgit.',
    rationaleLong: 'The Malaysian national currency is the ringgit.',
    citations: searchCitation('Malaysia ringgit currency', 'Malaysia ringgit currency'),
  }),
  q({
    prompt: 'Which country has Ankara as its capital?',
    options: ['Turkey', 'Greece', 'Egypt'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'world',
    subdomain: 'geography',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Ankara is the capital of Turkey.',
    rationaleLong: 'Turkey’s capital is Ankara, even though Istanbul is the country’s largest city.',
    citations: searchCitation('Ankara capital country', 'Ankara capital country'),
  }),
  q({
    prompt: 'Which leader was known as the Iron Chancellor?',
    options: ['Otto von Bismarck', 'Klemens von Metternich', 'Giuseppe Garibaldi'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Otto von Bismarck was known as the Iron Chancellor.',
    rationaleLong: 'Bismarck earned the nickname Iron Chancellor as the dominant statesman behind German unification.',
    citations: searchCitation('Iron Chancellor Bismarck', 'Iron Chancellor Bismarck'),
  }),
  q({
    prompt: 'Which empire built Machu Picchu?',
    options: ['The Inca Empire', 'The Aztec Empire', 'The Byzantine Empire'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Machu Picchu was built by the Inca Empire.',
    rationaleLong: 'The Inca built Machu Picchu high in the Andes, making it one of the most famous sites of pre-Columbian America.',
    citations: searchCitation('Machu Picchu Inca Empire', 'Machu Picchu Inca Empire'),
  }),
  q({
    prompt: 'Which reformer is associated with the Ninety-five Theses?',
    options: ['Martin Luther', 'John Calvin', 'Jan Hus'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Martin Luther is associated with the Ninety-five Theses.',
    rationaleLong: 'Martin Luther’s Ninety-five Theses became a defining spark of the Protestant Reformation.',
    citations: searchCitation('Ninety-five Theses Martin Luther', 'Ninety-five Theses Martin Luther'),
  }),
  q({
    prompt: 'Which city was once known as Byzantium before becoming Constantinople?',
    options: ['Istanbul', 'Athens', 'Alexandria'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'history',
    subdomain: 'history-facts',
    editorialBucket: 'experimental',
    promptKind: 'place',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Istanbul was the city once known as Byzantium and then Constantinople.',
    rationaleLong: 'The city now called Istanbul was first Byzantium, then Constantinople, before taking its modern name.',
    citations: searchCitation('Byzantium Constantinople Istanbul', 'Byzantium Constantinople Istanbul'),
  }),
  q({
    prompt: 'Which scientist is associated with the uncertainty principle?',
    options: ['Werner Heisenberg', 'Max Planck', 'Erwin Schrodinger'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Werner Heisenberg is associated with the uncertainty principle.',
    rationaleLong: 'Heisenberg’s uncertainty principle is one of the central ideas of quantum mechanics.',
    citations: searchCitation('uncertainty principle Heisenberg', 'uncertainty principle Heisenberg'),
  }),
  q({
    prompt: 'Which element is represented by the chemical symbol W?',
    options: ['Tungsten', 'Tantalum', 'Titanium'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'W is the symbol for tungsten.',
    rationaleLong: 'The symbol W comes from wolfram, the older name that survives in tungsten’s chemical shorthand.',
    citations: searchCitation('W chemical symbol tungsten', 'W chemical symbol tungsten'),
  }),
  q({
    prompt: 'Which scientist is most associated with the periodic table?',
    options: ['Dmitri Mendeleev', 'Antoine Lavoisier', 'Michael Faraday'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 73,
    lookupRisk: 'low',
    rationaleShort: 'Dmitri Mendeleev is most associated with the periodic table.',
    rationaleLong: 'Mendeleev organized the periodic table in a way that helped predict undiscovered elements.',
    citations: searchCitation('periodic table Mendeleev', 'periodic table Mendeleev'),
  }),
  q({
    prompt: 'Which scientist is associated with the first practical polio vaccine?',
    options: ['Jonas Salk', 'Louis Pasteur', 'Alexander Fleming'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'person',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Jonas Salk is associated with the first practical polio vaccine.',
    rationaleLong: 'Jonas Salk became world-famous for leading the development of the first widely used polio vaccine.',
    citations: searchCitation('Jonas Salk polio vaccine', 'Jonas Salk polio vaccine'),
  }),
  q({
    prompt: 'Which branch of biology studies heredity and inherited traits?',
    options: ['Genetics', 'Ecology', 'Geology'],
    answerIndex: 0,
    difficulty: 3,
    domain: 'science',
    subdomain: 'science-facts',
    editorialBucket: 'experimental',
    promptKind: 'concept',
    salienceScore: 72,
    lookupRisk: 'low',
    rationaleShort: 'Genetics is the study of heredity and inherited traits.',
    rationaleLong: 'Genetics focuses on how traits are passed from one generation to the next through genes and DNA.',
    citations: searchCitation('genetics heredity definition', 'genetics heredity definition'),
  }),
];
