import type { ThreadlineSegment } from './threadlinePuzzles';

export interface ThreadlineEditorialThreadContext {
  name: string;
  clue: string;
  leadRole: string;
}

export interface ThreadlineEditorialWordContext {
  id: string;
  answer: string;
  poolName: string;
  roles: readonly string[];
}

export interface ThreadlineEditorialContext {
  puzzleId: string;
  domain: string;
  originalTitle: string;
  place: string;
  deck: string;
  actionA: string;
  pivot: string;
  actionB: string;
  payoff: string;
  tags: readonly string[];
  dayIndex: number;
  copyAttempt: number;
  dateKey: string;
  threads: readonly [ThreadlineEditorialThreadContext, ThreadlineEditorialThreadContext];
  words: readonly ThreadlineEditorialWordContext[];
}

export interface ThreadlineEditorialCopyResult {
  title: string;
  lead: ThreadlineSegment[];
  weave: string;
  reviewNote: string;
  approvalStatus: 'approved';
  approvalSource: 'manual-600-exceptional-floor';
}

export const THREADLINE_EDITORIAL_QUALITY_TARGETS = [
  {
    surface: 'Title',
    target: 'A specific, natural invitation into the puzzle that sounds like a human named it.',
    rejects: 'Theme spoilers, answer words, colon suffixes, abstract generated frames, and phrases that do not make literal sense.',
  },
  {
    surface: 'Filled Lead',
    target: 'A standalone sentence that can be read aloud after the blanks are filled, with answers observed or named rather than forced to act.',
    rejects: 'Puzzle-meta copy, raw list-plus-location fragments, repeated scaffold variants, answer lists doing fake jobs, and awkward answer-role fit.',
  },
  {
    surface: 'Final Weave',
    target: 'A short aha sentence that lets the two answer families resolve into one inevitable place.',
    rejects: 'Answer adjacency, "in miniature" formulas, vague poetic fog, over-explained bridges, and payoffs that do not explain the relationship.',
  },
  {
    surface: 'Difficulty',
    target: 'Harder puzzles earn difficulty through word length, crossings, and fair lexical texture.',
    rejects: 'Using broken grammar, strained words, or category confusion to make a puzzle harder.',
  },
  {
    surface: 'Schedule Feel',
    target: 'Random date ranges should feel authored, varied, and intentionally paced.',
    rejects: 'Close title/payoff reuse, repeated lead structures, and clusters that reveal the generator.',
  },
] as const;

const DOMAIN_TITLE_VARIANTS: Readonly<Record<string, readonly string[]>> = {
  cafe: ['Morning Steam', 'First Errand', 'Cup In Hand', 'Before The Rush', 'Window Seat', 'Small Wake'],
  commute: ['Doorway Forecast', 'Rain Route', 'Shelter Map', 'Damp Departure', 'Under The Awning', 'Before The Train'],
  desk: ['First Draft', 'Workday Shape', 'Clean Start', 'Open Notebook', 'Before The Task', 'Page Waiting'],
  garden: [
    'Tended Path',
    'Green Ritual',
    'Gate Bloom',
    'After The Rain',
    'Small Growth',
    'Soil Knows',
    'Care In The Beds',
    'The Kept Green',
    'Morning By The Beds',
    'A Yard Remembered',
    'Light After Water',
    'The Patient Patch',
  ],
  station: ['Departure Clock', 'Waiting Rail', 'Before The Board', 'Next Train Soon', 'Room About To Move', 'Late Platform'],
  kitchen: ['Recipe Motion', 'Counter Scent', 'First Flavor', 'Supper Signal', 'Prep Light', 'Before Dinner'],
  studio: ['Table Sketch', 'Material Spark', 'First Mark', 'Color Draft', 'Brush Thought', 'Shape Signal'],
  library: [
    'Quiet Page',
    'Reading Light',
    'Margin Thought',
    'Chosen Hush',
    'Low Voice',
    'Seat In The Stacks',
    'Table By The Shelves',
    'Hush Around A Book',
    'A Page Held Close',
    'The Private Room',
    'Stacks In Low Light',
    'One Chair Waiting',
  ],
  shore: ['Tide Edge', 'Sand Trace', 'Water Line', 'Low Water Find', 'Foam Return', 'After The Wave', 'Wet Sand Proof', 'The Brief Shelf', 'Little Tide Marks', 'White Line Waiting'],
  market: ['Aisle Talk', 'Basket Morning', 'Stall Bright', 'Market Hand', 'Friendly Change', 'Under The Canopy'],
  workshop: ['Loose Part', 'Tool Light', 'Repair Table', 'Bench Before Repair', 'Small Fix', 'Solved Hinge'],
  park: ['Path Social', 'Bench Rhythm', 'Walking Thread', 'Park Greeting', 'Neighborhood Path', 'After The Fountain'],
  school: [
    'Classroom Start',
    'Board Signal',
    'First Task',
    'Ready Room',
    'Lesson Door',
    'Bell At The Door',
    'Morning On The Board',
    'The Room Looks Up',
    'Pencils Before Voices',
    'Homeroom Light',
    'The First Question',
    'A Day Takes Shape',
  ],
  gallery: ['Slow Look', 'Wall Attention', 'Eye Route', 'Quiet Frame', 'Room Seeing', 'Picture Path'],
  bakery: ['Case Glow', 'Breakfast Line', 'Sweet Counter', 'Glass Choice', 'Morning Treat', 'Warm Box'],
  mailroom: ['Paper Route', 'Sorted Door', 'Delivery Light', 'Posted Morning', 'Right Address', 'Door To Door'],
  theater: ['Opening Cue', 'Room Attention', 'Stage Hush', 'Audience Light', 'Listening Room', 'Before The Curtain'],
  trail: ['Marker Morning', 'Ridge Signal', 'Walking Compass', 'Outdoor Line', 'Path Map', 'After The Creek'],
  laundry: ['Clean Pattern', 'Soft Order', 'Washday Turn', 'Folded Light', 'Room Reset', 'Fresh Stack'],
  rooftop: ['Last Light', 'Roofline Hour', 'Evening Rail', 'Skyline Pause', 'Slow View', 'Bright Edge', 'High Quiet', 'Rail In Gold', 'The Air Above', 'Light Below'],
  diner: ['Another Cup', 'The Usual Place', 'Short Stack Morning', 'Check Please', 'Seat By The Window', 'Something On The Griddle'],
  harbor: ['Dock Bell', 'Water Departure', 'Morning Mooring', 'Boat Signal', 'Still Water', 'Before The Castoff'],
  music: ['Practice Beat', 'Room Rhythm', 'Sound Shape', 'Listening Cue', 'Measure Light', 'Before The Chorus'],
  porch: [
    'Front Light',
    'Small Welcome',
    'Open Door',
    'The Threshold Hour',
    'A Soft Arrival',
    'The Warm Edge',
    'A House Turned Outward',
    'Someone Is Expected',
    'The Block Comes Near',
    'Light At The Threshold',
    'A Little Closer',
    'The Front Edge',
  ],
  picnic: ['Blanket Table', 'Basket Afternoon', 'Grass Spread', 'Park Table', 'Shared Light', 'Under The Trees'],
  'clean-slate': ['Fresh Mark', 'New Page', 'Quiet Plan', 'First Step', 'Calendar Edge', 'Reset Light'],
  'paper-hearts': ['Small Message', 'Folded Note', 'Ribbon Thought', 'Quiet Valentine', 'Hand To Hand', 'Card On The Table'],
  'porch-lantern': ['Dusk Door', 'Lantern Step', 'October Glow', 'Porch Shadow', 'Soft Knock', 'Evening Welcome'],
  'table-leaf': ['Long Table', 'One More Plate', 'Gathered Linen', 'Serving Light', 'Room Made', 'Before Thanks'],
  'window-ribbon': ['Bright Window', 'Ribbon Light', 'Winter Glass', 'Parcel Glow', 'Front Reflection', 'Wrapped Room'],
  'spring-basket': ['Early Spring', 'Basket Color', 'Hidden Clover', 'Table Bloom', 'Spring Found', 'Pastel Hunt'],
  'porch-spark': ['Bright Porch', 'Summer Rail', 'Dusk Spark', 'Porch Lift', 'Lantern Cheer', 'Night Close'],
  observatory: ['Dome Dark', 'Nearer Stars', 'Long Look', 'Night In Focus', 'Roof Opens', 'Almost Held'],
  aquarium: ['Clear Wall', 'Blue Room', 'Small Current', 'Behind Glass', 'Living Water', 'Tank Light'],
  newsroom: ['Morning Edition', 'Under Deadline', 'Story Desk', 'Record Ready', 'Before Print', 'Trusted Noise'],
  clockshop: ['Small Time', 'Brass Minute', 'Counter Chime', 'Measured Sound', 'Wound Morning', 'After The Tick'],
  chessboard: ['Quiet Pressure', 'Black And White', 'Next Move', 'Silent Room', 'Before The Capture', 'Square By Square'],
  campsite: ['Camp Ring', 'Open Air', 'Prepared Dark', 'Warm Center', 'Outside Kept', 'Before The Embers'],
  pottery: ['Wheel Memory', 'Soft Form', 'Pressure Shape', 'Clay Learns', 'Kiln Waiting', 'After The Turn'],
  apiary: ['Small Flight', 'Organized Sweetness', 'Box In Bloom', 'Flight Path', 'Work Hums', 'Near The Hive'],
  vineyard: ['Rows Of Patience', 'Weather In Rows', 'Fruit Waiting', 'Cellar Promise', 'After The Picking', 'Slow Taste'],
  tailor: ['Mirror Fit', 'Cloth Belongs', 'Pinned Light', 'Body In Cloth', 'Fine Adjustment', 'After The Measure'],
  airport: ['Scheduled Distance', 'Window Leaving', 'Long Room', 'Before Boarding', 'Gate Light', 'Altitude Waiting'],
  apothecary: ['Carefully Lit', 'Old Shelf', 'Measured Care', 'Quiet Remedy', 'Bottle Light', 'Before The Dose'],
  planetarium: [
    'Ceiling Sky',
    'Room Goes Dark',
    'Overhead Travel',
    'Seats To Space',
    'A Borrowed Night',
    'The Ceiling Travels',
    'Dark Enough For Wonder',
    'The Indoor Sky',
    'A Room Looks Up',
    'Night Without Weather',
    'The Room Leaves Earth',
    'Wonder Overhead',
  ],
  firehouse: ['Ready Bay', 'Close Courage', 'Alarm To Action', 'Polished Urgency', 'Before The Roll', 'Room On Call'],
  'radio-booth': [
    'Far Room',
    'Room Beyond Walls',
    'Red Light Ready',
    'Past The Walls',
    'Quiet Desk Glow',
    'Late Desk Light',
    'Small Red Light',
    'The Red Lamp',
    'Before The Red Light',
    'A Chair Near The Mic',
    'The Mic Stays Warm',
    'Late Night Chair',
    'Needle Near Noon',
    'The Small Red Room',
  ],
  printshop: [
    'Language Body',
    'Ink Public',
    'Heavy Page',
    'Press Morning',
    'Type In Place',
    'Public Ink',
    'Words With Weight',
    'The Page Goes Public',
    'Ink In Daylight',
    'Private To Public',
    'Fresh Impression',
    'The Sentence Stands',
  ],
  'weather-station': ['Sky Accountable', 'Air Number', 'Before The Warning', 'Signal Weather', 'Measured Sky', 'Pressure Change'],
  dancehall: ['Room With A Pulse', 'Bright Middle', 'The Warm Room', 'Held Breath', 'The Room Finds Time', 'Light On The Wall'],
  laboratory: ['Careful Wonder', 'Bench Proof', 'Under Glass', 'Evidence Waiting', 'Before The Result', 'Curiosity Careful'],
  lighthouse: ['Readable Coast', 'Warning Lifted', 'Stair Light', 'Before The Beam', 'Height Made Useful', 'Coast Can Read'],
};

const DOMAIN_TITLE_EXTENSIONS: Readonly<Record<string, readonly string[]>> = {
  cafe: ['Corner Morning', 'Steam In The Window', 'Cup Before Errands', 'Small Table Morning', 'Counter Weather', 'Street Before Breakfast', 'One More Sip', 'Morning At The Window'],
  commute: ['Rain At The Door', 'The Damp Way Out', 'Ticket Weather', 'Before The Route', 'Under A Gray Sky', 'Doorway To The Platform', 'Wet Shoes Ready', 'Map In The Rain'],
  desk: ['Clean Surface', 'Task Light', 'Paper Before Work', 'The Ready Page', 'Work On The Edge', 'A Place For Focus', 'The First Request', 'Desk Before Noon'],
  garden: ['Path After Watering', 'Green Aftercare', 'Soil And Habit', 'The Gate In Bloom', 'Tending Hour', 'What The Rain Left', 'The Yard Wakes Slowly', 'A Little More Green', 'After Water', 'Under The Leaves', 'Beds Awake', 'Green In The Morning', 'A Quiet Patch', 'Rain Left Something', 'Small Green Work', 'The Day Needs Water', 'Light By The Beds', 'A Little More Shade', 'The Gate Opens Green', 'Morning Near The Beds', 'Care Along The Path', 'The Beds Remember', 'A Patient Green', 'After The Hose', 'The Kept Patch', 'Small Work In Sun'],
  station: ['Platform Minutes', 'The Waiting Board', 'Trackside Morning', 'Before Departure', 'The Public Wait', 'Rail Light', 'Minutes On The Platform', 'The Next Train Feeling'],
  kitchen: ['Meal Before Heat', 'Knife And Counter', 'Dinner Getting Close', 'Aroma Before Supper', 'Counter Work', 'Hands Before Dinner', 'Recipe At The Edge', 'First Heat', 'Heat Coming', 'Near Supper', 'Supper Takes Shape', 'The Room Gets Fragrant', 'A Little More Salt', 'Before The Pan Talks', 'Counter Before Heat', 'Dinner Finds Its Shape', 'The First Warm Smell', 'Almost Supper'],
  studio: ['Supplies Before Shape', 'The Table Before Color', 'Marks Begin Here', 'A Draft In Reach', 'Soft Materials', 'Before The Drawing', 'Color Finds A Place', 'The First Line Made', 'Paper Takes Color', 'Worktable Light', 'A Shape Coming', 'Color Near The Hand', 'Table Before Shape', 'A Quiet First Mark', 'The Draft Wakes Up', 'Light On The Worktable', 'A Place For Color', 'The Table Learns Shape'],
  library: [
    'Page And Hush',
    'Light In The Stacks',
    'The Chosen Seat',
    'A Book Goes Quiet',
    'Table In The Stacks',
    'The Reader Settles',
    'Low Light Reading',
    'Quiet Near The Page',
    'A Chair Under The Lamp',
    'A Book Held Close',
    'The Page Gets Quiet',
    'The Public Hush',
    'A Table For Reading',
    'One More Page',
    'The Stacks Stay Low',
    'A Quiet Borrowed Hour',
    'Where The Page Opens',
    'The Room Turns Inward',
  ],
  shore: ['Low Tide Evidence', 'Where Water Was', 'Sand After Water', 'Things The Tide Left', 'Foam At The Edge', 'Before The Water Returns', 'The Beach Keeps Proof', 'Line In The Sand', 'After The Pull', 'Small Wet Signs', 'The Edge Remembers', 'Low White Line', 'What The Beach Kept', 'A Little Proof Left', 'After The White Line', 'The Beach Holds On', 'Between Two Waves', 'The Edge Gets Revised', 'Marks Before Noon', 'The Pull Comes Back', 'Wet Sand Evidence', 'The Water Pauses', 'Proof In The Foam', 'A Brief White Edge', 'The Shore Keeps Quiet', 'Sand Between Waves', 'Tiny Tide Proof', 'What Water Left'],
  market: ['The Morning Stall', 'Basket In The Aisle', 'Under The Market Shade', 'Choice At The Stall', 'Aisle Of Small Wants', 'The Buyer Pauses', 'Goods In The Morning', 'The Stall Opens', 'Shade Over The Stall', 'Coins At The Counter', 'The Basket Gets Heavy', 'Morning Under Canvas', 'The Aisle Starts Talking', 'Hands Over The Produce', 'Canvas Morning', 'Small Change', 'Under The Stripe', 'Busy Shade', 'Paper Bag Morning', 'Quarter Hour', 'A Little Weight', 'Morning In The Shade', 'The Price Is Soft', 'One More Stop', 'The Bag Gets Full', 'Change In Hand'],
  workshop: ['Small Repair Morning', 'The Loose Thing', 'Tools At Rest', 'Bench Before The Fix', 'The Problem On The Bench', 'One Small Repair', 'The Fix Takes Shape', 'Workbench Light', 'The Bench Finds It', 'Repair In Hand', 'The Loose Edge', 'Problem Under The Lamp'],
  park: ['Loop In Motion', 'The Social Path', 'After The Fountain', 'Passing The Bench', 'Neighborhood Walk', 'The Long Way Around', 'The Path Takes People', 'A Walk Finds Company', 'Around The Fountain', 'The Bench Halfway', 'People On The Loop', 'A Path With Company'],
  school: [
    'Bell At The Door',
    'The First Assignment',
    'Morning In The Classroom',
    'Board Before Questions',
    'The Day Takes Attendance',
    'Classroom Doorway',
    'Lesson About To Start',
    'Homeroom Light',
    'The Room Looks Up',
    'First Question Waiting',
    'Pencils Before Voices',
    'A Day Takes Shape',
    'The Board Gets Quiet',
    'A Room Ready To Listen',
    'Morning Takes Attendance',
    'The Lesson Door',
    'Chalk In The Morning',
    'A Question On The Board',
  ],
  gallery: [
    'Wall And Witness',
    'The Slow Room',
    'Looking Takes Time',
    'Frame By Frame',
    'The Visitor Slows',
    'A Wall Worth Time',
    'Quiet Around The Frame',
    'Room For Looking',
    'Light On The Frame',
    'The Patient Wall',
    'A Slower Room',
    'The Wall Holds Still',
    'Color In Quiet',
    'The Room Looks Back',
    'One More Look',
    'The Frame Waits',
    'Quiet Wall Light',
    'The Long Wall',
    'The Visit Slows',
    'Attention In The Frame',
    'A Room Around Looking',
    'Still Light On The Wall',
    'The Body Slows Down',
    'A Wall For Returning',
    'Silence Near The Frame',
    'The Frame Holds Time',
  ],
  bakery: [
    'Case Before Breakfast',
    'Glass And Sugar',
    'The Line Smells Sweet',
    'Morning Behind Glass',
    'Before The Box',
    'Warm Counter',
    'The Breakfast Choice',
    'A Small Sweet Wait',
    'Sugar In Glass',
    'The Warm Line',
    'Box At The Counter',
    'Morning In Glass',
    'One More Box',
    'Counter With Sugar',
    'The Sweet Wait',
    'A Window Of Sugar',
    'Warm Paper Box',
    'Breakfast Under Glass',
    'Small Sugar Morning',
    'Something Sweet Waiting',
    'Box Before Morning',
    'Sweet Paper Morning',
    'The Glass Case Waits',
    'Counter Before Breakfast',
  ],
  mailroom: ['Before The Route', 'Shelf To Door', 'Paper Finds A Door', 'Sorted Morning', 'The Address Waits', 'Mail Before Motion', 'Doorway Route', 'The Right Door'],
  theater: ['Before The House Lights', 'The Room Goes Quiet', 'Stage Before Sound', 'Audience About To Listen', 'Curtain Weather', 'The First Cue', 'Quiet Before Applause', 'The Opening Wait'],
  trail: ['Route Through Green', 'Marker In The Morning', 'The Walk Finds North', 'Path By The Creek', 'Before The Ridge', 'The Trail Holds Still', 'A Map Made Outdoors', 'The Way Through'],
  laundry: [
    'Soft Work',
    'The Clean Pile',
    'Washday Light',
    'Fabric Finds Order',
    'The Room Comes Clean',
    'A Stack Takes Shape',
    'After The Spin',
    'Basket Light',
    'The Soft Reset',
    'A Pile Gets Kinder',
    'Clean Work Waiting',
    'The Fresh Stack',
    'Order On The Line',
    'The Folded Hour',
    'A Room Exhales',
    'Small Domestic Mercy',
    'The Basket Returns',
    'Fresh From The Line',
  ],
  rooftop: ['Last Light Above', 'Rail At Evening', 'City From The Roof', 'Above The Warm Street', 'The Hour Turns Gold', 'Before The Descent', 'Skyline Held Briefly', 'Evening On The Rail', 'High Over The Street', 'Roofline Before Dark', 'The City Slows Below', 'Gold On The Rail', 'Last Look Down', 'Evening Above Traffic', 'A High Quiet', 'Air Over The Block', 'The Rail Goes Gold', 'Streetlights Below', 'The City Below Softens', 'A Slow Look Down', 'Evening From Above', 'The Last Bright Edge'],
  diner: ['Counter Morning', 'Booth By The Window', 'Breakfast In Shorthand', 'Coffee Comes Back', 'The Usual Booth', 'Griddle Talk', 'Table Near The Counter', 'Short Order Morning'],
  harbor: ['Water Before Leaving', 'Dock Before Motion', 'Bell By The Rail', 'The Boat Waits Close', 'Morning At The Mooring', 'The Still Dock', 'Castoff Light', 'Before The Harbor Moves', 'Rail Before Castoff', 'The Boat Still Tied', 'Water Holding Still', 'Before The Dock Lets Go', 'Harbor In The Bell', 'Rope At Morning'],
  music: ['Before The Count', 'Sound Before Song', 'The Practice Hour', 'Room Finding Rhythm', 'Measure Before Music', 'The First Beat Nearby', 'Listening Before Sound', 'A Room In Time', 'Before The Rehearsal', 'The Count Underfoot', 'Sound In Reach', 'A Beat Before Song'],
  porch: [
    'Light On The Step',
    'A Small Hello',
    'Doorway Glow',
    'The Neighbor Hour',
    'Someone Passing By',
    'Welcome At The Step',
    'A House Near Evening',
    'The Threshold Glows',
    'A Small Arrival',
    'The Block Feels Close',
    'Front Light Waiting',
    'The Door Feels Near',
    'A Soft Place To Arrive',
    'The House Looks Out',
    'Light For Someone Coming',
    'The First Warm Edge',
    'Someone At The Edge',
    'The Front Of The House',
  ],
  picnic: ['Blanket In The Grass', 'Basket Before Afternoon', 'The Park Becomes A Table', 'Lunch Under Trees', 'Grass Before Sharing', 'The Blanket Opens', 'Afternoon In Reach', 'A Table Without Walls', 'Shade For Lunch', 'Easy Table', 'No Walls At Noon', 'A Place To Share', 'The Afternoon Opens', 'Lunch In The Shade', 'Room On The Grass', 'The Day Spreads Out', 'Under A Kindly Tree', 'Noon Without Walls'],
  'clean-slate': ['The Page Before Plans', 'First Mark Waiting', 'A Quiet New Start', 'Before The List', 'The Calendar Opens', 'Plan On The Edge', 'Fresh Start Light', 'The Desk Resets'],
  'paper-hearts': ['Message On The Table', 'Before The Note Leaves', 'Small Handmade Thing', 'A Folded Thought', 'The Card Waits', 'Ribbon On The Table', 'Hand To Hand Soon', 'A Note Near Ready'],
  'porch-lantern': ['Dusk On The Step', 'Before The Soft Knock', 'Lantern Near The Bell', 'Late October Door', 'The Porch Gets Dressed', 'Glow By The Door', 'Evening On The Rail', 'A Door Before Dark'],
  'table-leaf': ['Room For Another Plate', 'Before The Serving', 'The Long Table Opens', 'One More Chair', 'Gathered Before Grace', 'The Table Expands', 'Linen And Arrival', 'Warm Room Made Larger'],
  'window-ribbon': ['Light On The Glass', 'Before The Parcel Opens', 'Ribbon In The Window', 'Winter At The Front', 'The Bright Parcel', 'Glass Holding Light', 'A Room Wrapped Bright', 'Before The Bow'],
  'spring-basket': ['Color Before The Hunt', 'Spring On The Table', 'The Basket Waits', 'Pastel Morning', 'Before The Small Search', 'A Table Turns Spring', 'The First Hidden Color', 'Early Bloom Table'],
  'porch-spark': ['Dusk On The Rail', 'Before The Bright Night', 'Summer At The Step', 'A Porch Looks Up', 'Light Near The Street', 'The Night Lifts', 'Before The Cheer', 'Warm Rail Evening'],
  observatory: ['Dome At Dusk', 'Lens Toward Night', 'The Roof Opens Up', 'Nearer Than Stars', 'Dark In Focus', 'The Long Look Up', 'Night Through Glass', 'Sky In The Dome', 'Patient Dark', 'Glass Toward Stars', 'The Far Room', 'Roof Under Night', 'A Longer Look', 'Dome Light Low', 'Stars Held Briefly', 'The Night Lens', 'Quiet Above The Roof', 'Far Light Indoors'],
  aquarium: ['Blue Behind Glass', 'The Tank Keeps Moving', 'Water At The Wall', 'A Small Clear World', 'Current Behind Glass', 'Room Of Blue Light', 'The Bubble Rises', 'The Living Wall', 'Glass Current', 'Blue Quiet', 'Small Blue World', 'Wall Of Water', 'Quiet Current', 'The Tank Breathes', 'Light Under Water', 'A Room In Blue', 'Glass Holding Water', 'The Clear Room'],
  newsroom: ['Story Before Print', 'Desk Under Deadline', 'Before The Record', 'Morning Needs Proof', 'The Story Gets Trusted', 'Record At The Desk', 'Noise Becomes Copy', 'A Page Before Morning', 'Copy Before Dawn', 'The Desk Checks Twice', 'Proof Before Print', 'The Morning Gets Written'],
  clockshop: ['The Hour In Pieces', 'Counter Full Of Time', 'Before The Chime', 'Small Machines Awake', 'Brass Holds Minutes', 'The Minute Gets Loud', 'After The Tick', 'Time On The Counter'],
  chessboard: ['Pressure On The Board', 'Before The Capture', 'The Quiet Threat', 'Square By Square', 'The Next Move Waits', 'Room Around The Board', 'A Table Goes Quiet', 'Black And White Pressure', 'The Board Holds Breath', 'Danger On The Squares', 'A Move Before Trouble', 'Quiet Over The Board', 'The Square Turns Dangerous', 'Before The Table Speaks', 'The Room Studies The Board', 'A Quiet Cornered King'],
  campsite: ['Fire Ring At Dusk', 'The Camp Gets Made', 'Shelter At Night', 'Warm Center Outside', 'Embers In The Ring', 'The Open Air Settles', 'Gear By The Fire', 'Night Around The Ring', 'Outside Made Livable', 'The Ring Holds Warmth', 'The Tent Goes Quiet', 'Dark Around The Fire', 'Ring After Dusk', 'Warm Dark', 'Shelter Light', 'Tended Ring', 'Night Made Kind', 'Open Air Home', 'Kindling Hour', 'The Kept Fire', 'A Place In The Dark', 'The Ring Glows Low'],
  pottery: ['Clay Before Memory', 'Wheel Before Fire', 'The Shape Learns', 'Soft Form Turning', 'The Kiln Waits', 'Pressure At The Wheel', 'Before The Glaze', 'A Vessel Almost There'],
  apiary: ['Hum Near The Hive', 'The Sweet Work', 'Box In The Bloom', 'Small Flights Home', 'The Path Hums', 'Before The Comb Fills', 'Work In The Air', 'Hive Morning'],
  vineyard: ['Rows Before Cellar', 'Fruit In Patience', 'Weather In The Row', 'Before The Picking', 'Cellar Still Ahead', 'The Slow Taste Starts', 'Patience On The Vine', 'Rows Holding Weather'],
  tailor: ['Mirror Before Fit', 'Cloth Near The Body', 'Pinned And Waiting', 'Before The Measure', 'The Fit Gets Closer', 'Fine Adjustment', 'The Garment Answers', 'Needle Near The Mirror', 'Cloth Learns Shape', 'Pins In The Mirror', 'A Better Fit', 'The Hem Comes Close'],
  airport: ['Gate Before Distance', 'The Long Room Leaves', 'Window Before Boarding', 'Distance On Schedule', 'Before The Announcement', 'The Terminal Waits', 'Altitude Still Ahead', 'A Room Ready To Leave'],
  apothecary: ['Shelf Of Quiet Care', 'Bottle Before Remedy', 'Measured By Hand', 'Old Shelf Light', 'Before The Dose', 'Care In Small Bottles', 'The Quiet Remedy', 'Herbs Under Glass'],
  planetarium: [
    'Ceiling Before Sky',
    'Room Goes Dark',
    'Seats Before Space',
    'The Ceiling Opens',
    'A Room Looks Up',
    'Dark Enough For Wonder',
    'Rows Under Night',
    'The Indoor Sky',
    'A Quiet Tilt Up',
    'Night Above The Seats',
    'The Ceiling Leaves',
    'Seats Under Saturn',
    'Dark Room Rising',
    'A Borrowed Night',
    'The Rows Look Up',
    'Sky Without Weather',
    'The Room Turns Upward',
    'Stars Over The Seats',
    'Night On The Ceiling',
    'The Show Opens Up',
    'Darkness With Seats',
    'The Ceiling Goes Far',
    'Travel Without Leaving',
    'A Room Borrows Night',
    'The Sky Indoors',
    'A Quiet Trip Up',
    'Where The Ceiling Travels',
    'Night Without Wind',
  ],
  firehouse: ['Bay At Alarm', 'Ready By The Door', 'The Roll Begins', 'The Room On Call', 'Close Courage', 'Gear By The Bell', 'Urgency At Rest', 'The Bay Stays Ready', 'Bay Light', 'Polished Bell', 'Red Door Ready', 'Quiet Urgency', 'On Call', 'The Fast Room', 'Door In Red', 'Courage At Rest', 'Bell In The Bay', 'Room Held Ready', 'Still Bay', 'Red Room Waiting', 'Fast Help', 'Public Courage', 'The Kept Alarm', 'Ready Room'],
  'radio-booth': [
    'Desk Before Broadcast',
    'A Room Goes Far',
    'Near The Microphone',
    'Microphone Warmup',
    'Red Lamp Morning',
    'Chair Before Midnight',
    'The Hall Hears It',
    'Warm Glass Light',
    'The Little Red Glow',
    'Past The Quiet Wall',
    'A Desk After Dark',
    'The Night Desk Opens',
    'A Room Past Walls',
    'Farther Than Walls',
    'The Red Light Opens',
    'Small Room, Long Reach',
    'Chair Beside The Mic',
    'Late Light In The Room',
    'The Desk Lamp Waits',
    'A Needle Near The Edge',
  ],
  printshop: [
    'Ink Before Public',
    'Type In The Press',
    'Language Gets Weight',
    'Heavy Page Morning',
    'The Press Holds Words',
    'Page Before The Street',
    'Letters In Place',
    'A Public Page',
    'Words Leave The Room',
    'The Street Can Read',
    'A Page Outside',
    'Morning Impression',
    'Ink Takes Shape',
    'The Sentence Goes Out',
    'Public Weight',
    'The Page Has Weight',
  ],
  'weather-station': ['Air Before Warning', 'Sky In Numbers', 'The Forecast Takes Shape', 'Before The Warning', 'Pressure On The Dial', 'Measured Sky', 'Weather Turns Legible', 'A Number For Air', 'The Sky Gets Counted', 'Before The Alert', 'Numbers In The Air', 'The Dial Notices First', 'Pressure Before Rain', 'The Forecast Wakes Up', 'Air Becomes Evidence', 'Watching The Pressure', 'Warning In The Instruments', 'The Sky Leaves Clues', 'Readings Before Weather', 'The Station Knows Early'],
  dancehall: [
    'Saturday Light',
    'The Room Leans In',
    'A Shared Beat',
    'The Bright Room',
    'After The First Song',
    'The Close Room',
    'Lights Still Warm',
    'The Room Keeps Time',
    'Blue Hour Indoors',
    'The First Warmth',
    'A Little Electricity',
    'The Night Opens',
    'The Room Looks Up',
    'Before The Last Song',
    'A Public Spark',
    'The Lights Find Everyone',
  ],
  laboratory: ['Bench Toward Proof', 'Careful Wonder', 'Under Glass', 'The Result Waits', 'Evidence Waiting', 'The Question Gets Careful', 'Proof On The Bench', 'Wonder Made Exact', 'Bench Light', 'Glass Question', 'Careful Bench', 'Proof Takes Shape', 'Question Under Glass', 'Exact Wonder', 'The Patient Test', 'Small Proof', 'Measured Wonder', 'The Quiet Result', 'Careful Result', 'Glass And Doubt', 'Evidence In Hand', 'The Test Narrows', 'Wonder On The Bench', 'The Bench Listens'],
  lighthouse: ['Stair Toward Beam', 'Coast At Warning', 'The Tower Becomes Useful', 'Light Starts Turning', 'Readable Coast', 'Height Over Water', 'Warning In The Glass', 'The Beam Waits', 'Glass Above The Water', 'The Coast Looks Up', 'Beam Through Fog', 'Light Over Rocks', 'Tower Turning', 'The Warning Climbs', 'Bright Above The Rocks', 'The Coast Gets A Signal', 'Glass For The Fog', 'Water Sees The Light', 'Warning Over The Breakers', 'The Stair Holds Light', 'Night Watch Above', 'Fog At The Edge', 'The High Room Turns', 'Out Past The Rocks', 'Dark Above The Breakers', 'A Warning After Dusk', 'High Glass', 'Signal At Dusk', 'Rocks Below Light', 'The Bright Stair', 'Coast In The Dark', 'The Far Warning'],
};

const HUMAN_TITLE_PHRASES = [
  'A Longer Look',
  'A Patient Light',
  'A Room Held Open',
  'A Small Signal',
  'A Warm Edge',
  'Blue Hour',
  'Careful Light',
  'Clear Air',
  'Close Company',
  'Common Light',
  'Doorway Glow',
  'Early Signal',
  'Easy Light',
  'Evening Closer',
  'First Warmth',
  'Gentle Weather',
  'Held Breath',
  'Held Light',
  'Inside The Glow',
  'Kind Light',
  'Late Signal',
  'Light In Reach',
  'Light On The Work',
  'Little Weather',
  'Low Glow',
  'Low Signal',
  'Morning Closer',
  'Open Air',
  'Open Hand',
  'Patient Glow',
  'Plain Light',
  'Quiet Company',
  'Quiet Current',
  'Quiet Proof',
  'Quiet Signal',
  'Ready Light',
  'Room At Ease',
  'Room In Low Light',
  'Small Weather',
  'Soft Signal',
  'Still Bright',
  'Still Company',
  'Still Warmth',
  'The Careful Hour',
  'The Close Hour',
  'The Gentle Edge',
  'The Held Room',
  'The Kind Edge',
  'The Late Glow',
  'The Little Signal',
  'The Low Room',
  'The Open Edge',
  'The Patient Room',
  'The Plain Hour',
  'The Quiet Edge',
  'The Ready Hour',
  'The Soft Hour',
  'The Warm Room',
  'Under Low Light',
  'Warm Proof',
  'Window Glow',
  'Working Light',
] as const;

const ROBOTIC_TITLE_PATTERNS = [
  /^(Near Supper|Low Voice|Posted Morning|Page Waiting|Order On The Line|Homeroom Light|Workbench Light|Small Fix|The Room Comes Clean|The Room Gets Fragrant|A Small Sweet Wait|Warm Proof|Ready Light|Warm Paper Box|Small Sugar Morning|The Far Room|Late Desk Light|A Little Electricity|Far Room)$/i,
  /\bfor later$/i,
  /\bin passing$/i,
  /\bwithout hurry$/i,
  /\bat the edge$/i,
  /\bin the middle$/i,
  /\bnearby$/i,
  /\bbefore opening\b/i,
  /\bafter opening\b/i,
  /\bjust before\b/i,
  /\bgets ready\b/i,
  /\bbefore the rush\b/i,
  /\bwhile it waits\b/i,
  /\bnear the start\b/i,
  /\banswers?\b/i,
  /\bthe (quiet|near) side of\b/i,
  /\bbefore the\b/i,
  /\bnear the\b/i,
  /\b(at first light|after the first look)$/i,
  /^where .+ settles$/i,
  /^what .+ keeps$/i,
  /^(after|before) the (balance|bloom|cadence|crossing|drift|echo|ember|gesture|glimmer|horizon|measure|murmur|opening|pattern|promise|pulse|secret|shift|spark|tangle|threshold|trace|turn|undertone|weather|whisper|wonder)$/i,
] as const;

const GENERIC_FALLBACK_TITLE_PATTERN =
  /^(first|last|next|small|quiet|open|familiar|hidden|ordinary|bright|early|late|ready|waiting|shared|close|careful|common|warm|clear|steady|patient|brief|second) (place|pause|ritual|arrangement|question|answer|measure|turn|return|moment|start|pattern|line)$/i;

const CONTEXTUAL_FALLBACK_TITLE_PATTERN =
  /^(at the|inside the|near the|first look at the|the (quiet side|near side|first hour|little wait|usual place) at the|a good place near the)\b|^the .+ (gets ready|just before|after the first look|while it waits|near the start)$/i;

const BROAD_FALLBACK_TITLE_PATTERN =
  /^(a little before opening|after the first look|almost time to start|before anyone arrives|before the door opens|before the first hello|before the lights change|before the room fills|enough room to begin|first thing in view|just after opening|just before it starts|just inside the door|just past the threshold|no hurry yet|nothing in a hurry|one thing leads on|out where it starts|room for one more|somewhere to begin|the day comes in|the door stays open|the first small sign|the first thing there|the hour before|the little wait|the place comes around|the room comes around|the room gets ready|the room knows how|the usual first look|the usual little wait|the window side|there before you look|this is the place|time to come in|two steps in|under the first light|what comes first|what happens next|where the day enters|where the day lands|where the hour turns|where the light falls|where the room begins|where the room turns|where things begin|while the room wakes)$/i;

const TOKEN_STOP_WORDS = new Set([
  'and',
  'are',
  'for',
  'from',
  'into',
  'its',
  'one',
  'the',
  'their',
  'this',
  'through',
  'when',
  'where',
  'with',
]);

const DOMAIN_SCENE_ANCHORS: Readonly<Record<string, readonly [string, string]>> = {
  cafe: ['on the counter', 'outside the window'],
  commute: ['by the door', 'along the route'],
  desk: ['on the desk', 'inside the workday'],
  garden: ['along the path', 'in the tending'],
  station: ['on the platform', 'toward departure'],
  kitchen: ['on the counter', 'in the cooking'],
  studio: ['on the table', 'inside the sketch'],
  library: ['near the page', 'in the quiet'],
  shore: ['on the sand', 'at the waterline'],
  market: ['in the stall', 'in the aisle'],
  workshop: ['on the bench', 'inside the repair'],
  park: ['along the path', 'around the loop'],
  school: ['around the room', 'at the start of class'],
  gallery: ['on the wall', 'around the room'],
  bakery: ['behind the glass', 'in the line'],
  mailroom: ['on the shelf', 'toward the door'],
  theater: ['on the stage', 'in the audience'],
  trail: ['on the marker', 'along the walk'],
  laundry: ['in the pile', 'in the washday rhythm'],
  rooftop: ['along the rail', 'in the evening'],
  diner: ['near the table', 'at the counter'],
  harbor: ['by the dock', 'on the water'],
  music: ['near the stand', 'inside the rehearsal'],
  porch: ['near the door', 'on the steps'],
  picnic: ['on the blanket', 'across the afternoon'],
  'clean-slate': ['on the desk', 'inside the next step'],
  'paper-hearts': ['on the table', 'from hand to hand'],
  'porch-lantern': ['near the door', 'in the dusk'],
  'table-leaf': ['on the table', 'around the meal'],
  'window-ribbon': ['in the window', 'around the parcel'],
  'spring-basket': ['on the table', 'inside the small hunt'],
  'porch-spark': ['on the porch', 'in the bright evening'],
  observatory: ['inside the dome', 'across the sky'],
  aquarium: ['behind the glass', 'in the water'],
  newsroom: ['on the desk', 'through the story'],
  clockshop: ['on the counter', 'inside the tick'],
  chessboard: ['on the squares', 'under pressure'],
  campsite: ['around the ring', 'near the fire'],
  pottery: ['at the wheel', 'near the kiln'],
  apiary: ['near the hive', 'in the flight path'],
  vineyard: ['in the row', 'toward the cellar'],
  tailor: ['by the mirror', 'during the fitting'],
  airport: ['in the terminal', 'toward the gate'],
  apothecary: ['on the shelf', 'for the remedy'],
  planetarium: ['under the dome', 'inside the show'],
  firehouse: ['in the bay', 'toward the alarm'],
  'radio-booth': ['inside the booth', 'over the air'],
  printshop: ['at the press', 'on the page'],
  'weather-station': ['on the instruments', 'inside the forecast'],
  dancehall: ['on the floor', 'inside the count'],
  laboratory: ['on the bench', 'inside the test'],
  lighthouse: ['on the stair', 'across the coast'],
};

interface ThreadlineSceneFrame {
  firstScene: string;
  secondScene: string;
  weaves: readonly string[];
}

interface ThreadlineSentenceTemplateSet {
  nounLead: readonly string[];
  motionLead: readonly string[];
  weaves: readonly string[];
}

const DOMAIN_SCENE_FRAMES: Readonly<Record<string, ThreadlineSceneFrame>> = {
  cafe: {
    firstScene: 'the counter feels awake',
    secondScene: 'the first errand waits outside',
    weaves: ['{A} is the pause at the counter; {b} is the block beginning its day.'],
  },
  commute: {
    firstScene: 'the doorway knows the weather',
    secondScene: 'the route is already forming',
    weaves: ['{A} is what you grab before leaving; {b} is where the day points next.'],
  },
  desk: {
    firstScene: 'the work surface settles',
    secondScene: 'the task comes into focus',
    weaves: ['{A} gives the desk a beginning; {b} gives the day a next step.'],
  },
  garden: {
    firstScene: 'the path looks tended',
    secondScene: 'the hands know what comes next',
    weaves: ['{A} is the garden holding still; {b} is the gardener answering it.'],
  },
  station: {
    firstScene: 'departure becomes legible',
    secondScene: 'waiting finds its rhythm',
    weaves: ['{A} is the platform telling you where; {b} is the wait before it happens.'],
  },
  kitchen: {
    firstScene: 'the counter starts to smell like dinner',
    secondScene: 'the recipe finds its hands',
    weaves: ['{A} is dinner before it starts; {b} is the hand that starts it.'],
  },
  studio: {
    firstScene: 'the table holds possibility',
    secondScene: 'the first marks know where to go',
    weaves: ['{A} is the material waiting; {b} is the first mark that trusts it.'],
  },
  library: {
    firstScene: 'the page gets quiet around you',
    secondScene: 'the room remembers how to listen',
    weaves: ['{A} is the book in your hands; {b} is the hush around it.'],
  },
  shore: {
    firstScene: 'low tide leaves evidence',
    secondScene: 'the water keeps revising the edge',
    weaves: ['{A} is what the tide leaves; {b} is the tide coming back for it.'],
  },
  market: {
    firstScene: 'the stall feels ready for choosing',
    secondScene: 'the aisle begins to talk',
    weaves: ['{A} is what catches the eye; {b} is the market answering back.'],
  },
  workshop: {
    firstScene: 'the bench looks solvable',
    secondScene: 'the broken thing gives itself away',
    weaves: ['{A} is the tool in reach; {b} is the reason it is needed.'],
  },
  park: {
    firstScene: 'the walk has landmarks',
    secondScene: 'the neighborhood passes through',
    weaves: ['{A} is where the path pauses; {b} is someone carrying the park forward.'],
  },
  school: {
    firstScene: 'the room is ready for class',
    secondScene: 'the first lesson has a pulse',
    weaves: ['{A} is the room before the bell; {b} is the class beginning.'],
  },
  gallery: {
    firstScene: 'the wall asks for attention',
    secondScene: 'looking becomes a small journey',
    weaves: ['{A} is what stops the eye; {b} is the eye deciding to stay.'],
  },
  bakery: {
    firstScene: 'the glass case glows',
    secondScene: 'the line knows what it wants',
    weaves: ['{A} is the sweet thing behind glass; {b} is the morning choosing it.'],
  },
  mailroom: {
    firstScene: 'the shelves hold their little routes',
    secondScene: 'the day finds its addresses',
    weaves: ['{A} is the paper waiting; {b} is the door it is headed toward.'],
  },
  theater: {
    firstScene: 'the room waits for attention',
    secondScene: 'the audience begins to lean in',
    weaves: ['{A} is the stage before the hush; {b} is the hush becoming a room.'],
  },
  trail: {
    firstScene: 'the path can be trusted',
    secondScene: 'the walk keeps choosing a direction',
    weaves: ['{A} tells you where you are; {b} is the next step believing it.'],
  },
  laundry: {
    firstScene: 'the pile starts to look manageable',
    secondScene: 'the room gets back its order',
    weaves: ['{A} is the soft evidence; {b} is the room getting reset.'],
  },
  rooftop: {
    firstScene: 'the view has edges',
    secondScene: 'the hour loosens its grip',
    weaves: ['{A} is the city held at a distance; {b} is evening letting go.'],
  },
  diner: {
    firstScene: 'the booth feels familiar',
    secondScene: 'the counter has a voice',
    weaves: [
      '{A} puts you at the table; {b} lets you hear the counter.',
      '{A} is the plate in front of you; {b} is the counter calling back.',
      'A diner lives in that little jump from {a} to {b}.',
    ],
  },
  harbor: {
    firstScene: 'the dock feels ready',
    secondScene: 'the water is thinking about leaving',
    weaves: ['{A} keeps the boat close; {b} is the water asking to go.'],
  },
  music: {
    firstScene: 'the sound is close enough to touch',
    secondScene: 'the room starts listening',
    weaves: ['{A} is the instrument waiting; {b} is the room learning the beat.'],
  },
  porch: {
    firstScene: 'the doorway feels expectant',
    secondScene: 'the street finds a way to say hello',
    weaves: ['{A} is the door before anyone arrives; {b} is the arrival.'],
  },
  picnic: {
    firstScene: 'the blanket becomes a table',
    secondScene: 'the afternoon has company',
    weaves: ['{A} is what gets unpacked; {b} is the afternoon opening up.'],
  },
  'clean-slate': {
    firstScene: 'the new page feels possible',
    secondScene: 'intention gets a first edge',
    weaves: ['{A} is the blank start; {b} is the first promise made to it.'],
  },
  'paper-hearts': {
    firstScene: 'the table has a message waiting',
    secondScene: 'the note knows how to travel',
    weaves: ['{A} is the small thing made by hand; {b} is how it reaches someone.'],
  },
  'porch-lantern': {
    firstScene: 'the doorway gathers dusk',
    secondScene: 'the night feels invited',
    weaves: ['{A} is the porch before the knock; {b} is the knock finding light.'],
  },
  'table-leaf': {
    firstScene: 'the table makes room',
    secondScene: 'the meal becomes a gathering',
    weaves: ['{A} is the extra place; {b} is the room filling in around it.'],
  },
  'window-ribbon': {
    firstScene: 'the window catches winter light',
    secondScene: 'the parcel starts to feel personal',
    weaves: ['{A} is the bright thing in the window; {b} is the gift becoming yours.'],
  },
  'spring-basket': {
    firstScene: 'the table takes on spring color',
    secondScene: 'the small hunt begins',
    weaves: ['{A} is the spring color; {b} is the hand reaching for it.'],
  },
  'porch-spark': {
    firstScene: 'the porch is dressed for dusk',
    secondScene: 'the evening lifts without saying why',
    weaves: ['{A} is the porch before dark; {b} is the first bright shout.'],
  },
  observatory: {
    firstScene: 'the dark comes into focus',
    secondScene: 'the sky refuses to sit still',
    weaves: ['{A} is the lens finding distance; {b} is the sky slipping away.'],
  },
  aquarium: {
    firstScene: 'the glass fills with life',
    secondScene: 'the water writes over everything',
    weaves: ['{A} is the creature behind glass; {b} is the water around it.'],
  },
  newsroom: {
    firstScene: 'the desk has a story forming',
    secondScene: 'the record starts to harden',
    weaves: ['{A} is what happened; {b} is the room deciding how to tell it.'],
  },
  clockshop: {
    firstScene: 'the counter keeps small time',
    secondScene: 'the room turns sound into measure',
    weaves: ['{A} is time you can hold; {b} is time answering back.'],
  },
  chessboard: {
    firstScene: 'the board sits under pressure',
    secondScene: 'the quiet starts to threaten',
    weaves: ['{A} is the square before the choice; {b} is the choice narrowing.'],
  },
  campsite: {
    firstScene: 'the dark feels prepared',
    secondScene: 'outside starts to feel kept',
    weaves: ['{A} is camp before nightfall; {b} is the dark becoming livable.'],
  },
  pottery: {
    firstScene: 'the clay remembers the hand',
    secondScene: 'softness starts to hold',
    weaves: ['{A} is the shape before it lasts; {b} is the hand convincing it.'],
  },
  apiary: {
    firstScene: 'sweetness looks organized',
    secondScene: 'the air has a pattern',
    weaves: ['{A} is the box full of work; {b} is the small flight around it.'],
  },
  vineyard: {
    firstScene: 'the rows hold their patience',
    secondScene: 'the cellar is already implied',
    weaves: ['{A} is the fruit waiting; {b} is time deciding what it becomes.'],
  },
  tailor: {
    firstScene: 'the mirror starts to make sense',
    secondScene: 'cloth learns the body',
    weaves: ['{A} is cloth before it belongs; {b} is the adjustment that makes it yours.'],
  },
  airport: {
    firstScene: 'leaving becomes readable',
    secondScene: 'distance gets scheduled',
    weaves: ['{A} is the room before departure; {b} is distance getting permission.'],
  },
  apothecary: {
    firstScene: 'the shelf smells exact',
    secondScene: 'care turns into measure',
    weaves: ['{A} is the old remedy waiting; {b} is the careful hand over it.'],
  },
  planetarium: {
    firstScene: 'the ceiling becomes enormous',
    secondScene: 'looking up starts to feel like travel',
    weaves: ['{A} is the ceiling pretending to be sky; {b} is the room helping you believe it.'],
  },
  firehouse: {
    firstScene: 'readiness has a place to stand',
    secondScene: 'the alarm already has a path',
    weaves: ['{A} is the room before the bell; {b} is what the bell asks for.'],
  },
  'radio-booth': {
    firstScene: 'the voice has a path',
    secondScene: 'the room travels without leaving',
    weaves: ['{A} is the voice in the room; {b} is how it gets out.'],
  },
  printshop: {
    firstScene: 'language becomes physical',
    secondScene: 'ink starts looking public',
    weaves: ['{A} is language in the hand; {b} is language headed for the wall.'],
  },
  'weather-station': {
    firstScene: 'the sky becomes measurable',
    secondScene: 'the warning starts to take shape',
    weaves: ['{A} is weather turned into a number; {b} is what the number asks you to do.'],
  },
  dancehall: {
    firstScene: 'the floor waits for rhythm',
    secondScene: 'the room agrees on a count',
    weaves: ['{A} is the floor before the music; {b} is the first body answering.'],
  },
  laboratory: {
    firstScene: 'curiosity becomes careful',
    secondScene: 'looking starts to become proof',
    weaves: ['{A} is wonder under glass; {b} is the answer being earned.'],
  },
  lighthouse: {
    firstScene: 'the coast becomes readable',
    secondScene: 'the warning climbs into view',
    weaves: ['{A} is the height; {b} is the coast understanding it.'],
  },
};

const DOMAIN_MOTION_ACTORS: Readonly<Record<string, string>> = {
  commute: 'the traveler',
  garden: 'the gardener',
  kitchen: 'the cook',
  studio: 'the artist',
  library: 'the reader',
  shore: 'the water',
  market: 'the buyer',
  workshop: 'the repair',
  park: 'the walker',
  school: 'the teacher',
  gallery: 'the visitor',
  bakery: 'the counter',
  mailroom: 'the mail',
  theater: 'the audience',
  trail: 'the walker',
  laundry: 'the load',
  diner: 'the server',
  harbor: 'the boat',
  picnic: 'people',
  rooftop: 'the hour',
  observatory: 'the sky',
  aquarium: 'the tank',
  newsroom: 'the room',
  clockshop: 'the clock',
  chessboard: 'the player',
  apiary: 'the hive',
  airport: 'the flight',
  planetarium: 'the room',
  firehouse: 'the crew',
  'radio-booth': 'the sound',
  'weather-station': 'the weather',
  dancehall: 'the body',
  pottery: 'the potter',
  vineyard: 'the vintner',
  tailor: 'the tailor',
  apothecary: 'the apothecary',
  printshop: 'the press',
  laboratory: 'the researcher',
  lighthouse: 'the light',
};

const DOMAIN_AUTHORED_WEAVES: Readonly<Record<string, readonly string[]>> = {
  cafe: [
    'Morning pauses at the window.',
    'The block wakes softer near breakfast.',
    'A small table can borrow the whole morning.',
    'The first errand starts with warmth.',
    'The window turns the street into company.',
    'Breakfast makes the block less hurried.',
    'A cup can hold the street still for a minute.',
    'The morning gets personal at the counter.',
    'The block feels closer through glass.',
    'The first rush slows near the window.',
    'A corner becomes familiar by morning.',
    'The window lets breakfast borrow the block.',
    'Breakfast gives the street a pause.',
    'The window keeps the city close and gentle.',
    'The counter turns morning local.',
    'A small table steadies the first errand.',
    'The block begins in a cup of warmth.',
    'The street is easier after breakfast.',
  ],
  commute: [
    'Rain makes the first step practical.',
    'The trip begins by answering the weather.',
    'A wet morning still needs a plan.',
    'The door opens because the day has a route.',
    'Bad weather turns departure into a decision.',
    'The way out gets clearer in the rain.',
    'A damp trip becomes possible by degrees.',
    'The forecast matters most at the door.',
    'Leaving is easier when the rain has a plan.',
    'The first step is half shelter, half direction.',
    'The route survives the weather by being named.',
    'Rain turns ordinary leaving into preparation.',
    'A wet day gets smaller once the way is clear.',
    'Rain turns a doorway into a plan.',
    'The trip stays human in bad weather.',
    'A gray morning still knows where to go.',
    'The day begins once the rain has been answered.',
    'Departure is practical courage in the rain.',
  ],
  desk: [
    'A blank morning needs one clean surface.',
    'The first task lands softer on an ordered desk.',
    'A ready surface makes the work less loud.',
    'The desk waits quietly until a task arrives.',
    'Work feels less abstract once the desk has order.',
    'The page needs room before the task can speak.',
    'The workday finds its first shape on the desk.',
    'A clean desk lets the first request land softly.',
    'The room gets quieter before the work begins.',
    'A clear list gives the desk a beginning.',
    'A task needs a surface before it becomes possible.',
    'The task feels possible once the desk is ready.',
    'The first task lands on a ready surface.',
    'The desk becomes useful when the day gets specific.',
    'Work begins when the desk stops feeling blank.',
    'A few ordinary tools quiet the room enough for work.',
    'A ready desk gives the day a humane landing.',
    'The first handle on work is a clear surface.',
    'The morning gets gentler on a prepared desk.',
    'The desk holds the ordinary start of work.',
  ],
  garden: [
    'Care is how green becomes kept.',
    'A yard remembers the hands that return.',
    'Growth looks different after care.',
    'The path looks alive because someone came back.',
    'Small care makes the season visible.',
    'The beds keep evidence of patience.',
    'Green becomes a promise by being tended.',
    'The yard answers quiet work slowly.',
    'Care turns weather into a place.',
    'The path is brighter after attention.',
    'A kept patch can hold a whole morning.',
    'Patience shows up first in the soil.',
    'The beds stay green because care returns.',
    'The beds look loved because work returns.',
    'Small work gives the season somewhere to land.',
    'Care is the daily part of hope.',
    'The yard keeps faith with whoever returns.',
    'Green asks softly and care answers.',
    'A patch becomes a place by being kept.',
    'The path keeps the memory of care.',
    'The season is gentler where hands return.',
    'Green keeps faith with returning hands.',
    'A yard becomes personal by being tended.',
    'Care keeps the morning from passing unnoticed.',
    'The soil remembers ordinary attention.',
  ],
  station: [
    'Station signs point waiting toward departure.',
    'Station signs turn waiting habits toward departure.',
    'Station signs give waiting habits somewhere to go.',
    'Waiting habits feel lighter when the station is legible.',
    'The station turns waiting into almost leaving.',
    'Signs steady the platform; habits soften the wait.',
    'A station works by giving waiting a direction.',
    'Departure gives the wait a direction.',
    'Station signs turn idle minutes toward departure.',
    'Waiting habits gather under station signs.',
    'Station signs give waiting habits a public rhythm.',
    'Signs point outward while waiting habits hold the room.',
    'A platform is waiting habits under station signs.',
    'A platform turns idle minutes toward leaving.',
    'Station signs turn waiting toward travel.',
    'Waiting habits keep company with station signs.',
    'Station signs put waiting on a schedule.',
    'Signs and waiting habits turn minutes into travel.',
    'Station signs teach waiting habits where to look.',
    'Station signs pull waiting close to departure.',
  ],
  kitchen: [
    'Dinner begins when the counter starts to smell warm.',
    'The room knows supper before the table does.',
    'A quiet counter can become hunger.',
    'The honest part of dinner happens by hand.',
    'Supper gets nearer one fragrant minute at a time.',
    'The counter wakes before the pan speaks.',
    'A room turns fragrant before it turns full.',
    'Dinner stops being abstract at the cutting board.',
    'Supper starts when hands find heat.',
    'The first promise of supper is smell.',
    'The counter turns separate things into appetite.',
    'A kitchen begins as care before it becomes dinner.',
    'Ordinary food becomes anticipation by hand.',
    'The room smells real before dinner has a name.',
    'The counter turns hunger toward dinner.',
    'The kitchen wakes by touch and heat.',
    'Care gets fragrant before it becomes supper.',
    'Dinner gathers before anyone sits down.',
  ],
  studio: [
    'Materials wait until marks give them direction.',
    'Marks turn materials into the first visible idea.',
    'Blank supplies become a decision when marks arrive.',
    'Materials give marks a place to begin.',
    'Marks give materials a reason to stay.',
    'The idea appears when materials accept marks.',
    'Materials keep still; marks begin the conversation.',
    'Marks give loose materials a direction.',
    'Materials become a draft when marks commit.',
    'The studio wakes when marks find materials.',
    'Materials hold still while marks find their nerve.',
    'Marks turn loose materials into a surface with intent.',
    'Materials cover the table; marks let the first draft show.',
    'Materials gather; marks decide what they mean.',
    'A first mark turns supplies toward an idea.',
    'The first idea lives between materials and marks.',
    'Materials give marks something to trust.',
    'The room brightens when materials become marks.',
  ],
  library: [
    'A public room can become personal quietly.',
    'A book can turn a shared room inward.',
    'The quiet lets the page come closer.',
    'A borrowed hour can feel private.',
    'The room lowers its voice for the reader.',
    'A good page changes the room around it.',
    'A public quiet can stay private.',
    'A low voice can bring the shelf closer.',
    'A public room can become one quiet place.',
    'The quiet is part of the story.',
    'A library gives solitude a public address.',
    'The page opens wider when the room goes quiet.',
    'A page keeps better company in quiet.',
    'The room becomes inward around the page.',
    'Silence gives the reader somewhere to go.',
    'The quiet is how the page gets near.',
    'The public room holds a private hour.',
    'A chair and a book can lower the world.',
  ],
  shore: [
    'What the tide leaves, the tide can take.',
    'The edge remembers only until the next wave.',
    'Low water gives the sand a brief memory.',
    'Every find is temporary at the waterline.',
    'The beach keeps proof only between waves.',
    'The tide leaves evidence, then edits it.',
    'A shore is a record written in pencil.',
    'The water signs the sand in disappearing ink.',
    'What turns up at the edge is already leaving.',
    'The beach keeps what the water has not reclaimed.',
    'Low tide makes a little museum, briefly.',
    'Waves make every discovery brief.',
    'The line remembers, then lets go.',
    'The tide gives the sand something to lose.',
    'A wet edge never keeps still for long.',
    'The shore holds proof with wet hands.',
    'The water leaves a trace and comes back for it.',
    'The beach remembers in things it cannot keep.',
    'The tide edits the evidence it leaves.',
    'Small evidence makes the water briefly visible.',
    'The shore has proof only while the tide allows it.',
    'A low tide turns the beach into a note.',
    'The water leaves a margin, then revises it.',
    'The edge keeps changing around what it leaves.',
    'The beach reads differently between waves.',
    'The beach borrows its evidence from the tide.',
  ],
  market: [
    'Appetite turns the aisle into conversation.',
    'A stall becomes personal when someone chooses.',
    'Color becomes appetite in the hand.',
    'The errand turns social at the stall.',
    'A market morning is made of small decisions.',
    'The basket gets interesting one choice at a time.',
    'Price turns appetite into a decision.',
    'The stall slows the morning into choosing.',
    'A good market makes errands feel social.',
    'The aisle talks when appetite starts deciding.',
    'The morning gets brighter by the basket.',
    'Choosing gives the stall its pulse.',
    'A market errand turns into a little conversation.',
    'The hand learns what appetite already knew.',
    'The stall makes the errand less straight.',
    'The basket turns wanting into a choice.',
    'The basket gives appetite a handle.',
    'The aisle becomes human at the stall.',
    'Color and price make a small argument.',
    'A morning stall turns appetite into motion.',
  ],
  workshop: [
    'The flaw tells the hand what to reach for.',
    'A repair starts by listening to the damage.',
    'Damage turns hardware into purpose.',
    'The right fix is usually a careful guess.',
    'A nick can make the whole room practical.',
    'The damage chooses the hand.',
    'A small flaw can organize a whole morning.',
    'A repair starts when the flaw is plain.',
    'The useful thing appears after the problem speaks.',
    'A fix is attention with sleeves rolled up.',
    'The problem turns hardware into intention.',
    'A careful hand hears what is loose.',
    'The damaged place knows the next move.',
    'A repair is a conversation with the flaw.',
    'The useful object starts as a problem.',
    'A broken edge can make the whole room practical.',
    'The fix is just attention made visible.',
    'Damage is how the right hand knows.',
  ],
  park: [
    'A loop becomes a neighborhood by repetition.',
    'The path feels public because people return.',
    'A park is made by being used gently.',
    'The ordinary walk gives the park its pulse.',
    'A bench matters more after someone lingers.',
    'The loop remembers whoever keeps returning.',
    'A path becomes social one passerby at a time.',
    'The park is a habit with trees around it.',
    'A familiar route can make strangers companionable.',
    'The walk belongs to whoever repeats it.',
    'A familiar path softens every errand.',
    'A loop becomes local when feet return.',
    'The park holds still so the day can pass.',
    'A public path makes private errands softer.',
    'The walk becomes a ritual by being ordinary.',
    'The park has a pulse because people come back.',
    'A loop is a promise the body remembers.',
    'The day changes pace around a familiar path.',
  ],
  school: [
    'The bell gives the room a purpose.',
    'A classroom starts when attention arrives.',
    'The first lesson is really an agreement.',
    'A bell can turn a room into a morning.',
    'The bell makes the room look up.',
    'The first question wakes the room.',
    'School begins as a shared direction.',
    'A classroom is a room waiting for attention.',
    'The day starts when the room agrees to listen.',
    'The bell is only loud because the room answers.',
    'The first minutes turn the room into class.',
    'A lesson begins before the page is filled.',
    'The room becomes a class by paying attention.',
    'Morning sounds different when a classroom hears it.',
    'A school day needs a room ready to answer.',
    'The first signal changes what a pencil is for.',
    'A classroom turns the ordinary toward attention.',
    'The morning becomes official when the room looks up.',
  ],
  gallery: [
    'Looking slows until the room answers.',
    'Art changes the pace of a body.',
    'A wall becomes intimate when someone stops.',
    'Attention is the quietest kind of movement.',
    'The room teaches the eye to wait.',
    'A frame can slow the whole afternoon.',
    'The gallery makes patience visible.',
    'Looking turns silence into company.',
    'The wall keeps changing as attention gathers.',
    'A visitor leaves slower than they arrived.',
    'Art gives the room a second clock.',
    'The eye learns to stay a little longer.',
    'A quiet wall can change a body.',
    'Attention turns the room into memory.',
    'The gallery is a room for slowing down.',
    'Art keeps time differently.',
    'The room gets careful around the eye.',
    'Looking is how the wall speaks back.',
    'A long wall teaches looking to slow down.',
    'A visitor makes the room less still.',
    'The wall rewards the slower eye.',
    'Looking slows when the wall answers.',
    'Art lets the room talk in silence.',
    'Memory starts where looking slows.',
    'The gallery changes speed around attention.',
  ],
  bakery: [
    'Sugar makes the wait shorter.',
    'A paper box can sweeten the whole morning.',
    'The glass turns appetite into choosing.',
    'The line slows where breakfast looks sweet.',
    'The box carries the morning home.',
    'A small box can change the walk home.',
    'Appetite learns patience in front of glass.',
    'A paper bag makes sweetness portable.',
    'A sweet errand makes morning kinder.',
    'The box justifies the line.',
    'A warm box makes the morning sweeter.',
    'The wait becomes part of breakfast.',
    'The glass gives hunger a shape.',
    'The box lets breakfast travel.',
    'The line gets gentler near sugar.',
    'Breakfast feels chosen before the box closes.',
    'A bakery morning ends in a small box.',
    'Sweetness gives the errand a pause.',
    'The case gives patience a sweet reason.',
    'A paper bag means breakfast is leaving with you.',
    'Breakfast gets chosen one finger at a time.',
    'A box begins with a finger on the glass.',
    'The morning leaves with something warm.',
    'A small sweet thing can justify the walk.',
    'The line ends with a finger on the glass.',
    'The box makes the errand gentle.',
  ],
  mailroom: [
    'A message becomes real when it finds a door.',
    'Distance gets ordinary one stop at a time.',
    'The right door turns sorting into trust.',
    'A shelf becomes useful when the room starts moving.',
    'Trust travels best with a destination.',
    'The room turns waiting into arrival.',
    'A small route domesticates distance.',
    'Every shelf is waiting for a door.',
    'A message leaves the room by becoming specific.',
    'Arrival is the promise hidden in sorting.',
    'A sorted shelf already belongs to a door.',
    'A destination makes the room honest.',
    'Trust is handled before it is delivered.',
    'The day gets smaller when every door is known.',
    'A sorted room is already halfway there.',
    'The room is built around arrival.',
    'Sorting gives distance an address.',
    'A door can make the whole shelf matter.',
  ],
  theater: [
    'The room quiets before the first line.',
    'A show begins in the room before anyone speaks.',
    'Attention is the first curtain.',
    'The quiet is already part of the performance.',
    'The room performs before anyone speaks.',
    'A held breath can light the whole room.',
    'The first cue is silence.',
    'A show begins before anyone speaks.',
    'Before the first line, the room says yes.',
    'The show starts when the room goes quiet.',
    'The dark learns where to look.',
    'The first applause is already waiting.',
    'The quiet turns a room into a show.',
    'A room can lean in before a word arrives.',
    'The show opens first in the audience.',
    'Silence can be an opening cue.',
    'The room holds its breath on purpose.',
    'Every performance starts as attention.',
    'The audience becomes one thing before the show.',
    'The audience makes the dark attentive.',
  ],
  trail: [
    'A good path earns its view.',
    'The sign opens into more woods.',
    'The route is plain; wonder is why you stay.',
    'A trail is trust followed by surprise.',
    'The walk needs direction, then beauty.',
    'The map looks generous once the woods open.',
    'A path becomes memorable after the marker.',
    'The way forward is only half the walk.',
    'A marker gets you there; the view keeps you.',
    'The trail gives order to wonder.',
    'A clear route makes room for awe.',
    'The woods answer after the sign.',
    'A walk becomes a story after the first marker.',
    'The path is useful; the view is the gift.',
    'The sign promises; the landscape keeps it.',
    'Wonder arrives once the route feels safe.',
    'The trail is readable until it becomes beautiful.',
    'A good path leads past itself.',
    'The route holds steady while the woods change.',
    'The walk trusts the marker and loves the view.',
  ],
  laundry: [
    'Order returns one small habit at a time.',
    'The room exhales when the pile is handled.',
    'A household resets through soft work.',
    'The day feels lighter after the work.',
    'Domestic care has a quiet rhythm.',
    'The mess comes back as usefulness.',
    'A pile becomes a room again.',
    'The pile comes back soft enough to use.',
    'Soft disorder learns its place.',
    'The room gets one fresh ending.',
    'Care turns the mess back toward use.',
    'A household breathes easier after the work.',
    'The pile returns as something to wear.',
    'The pile returns with the room calmer.',
    'The pile was never just a pile.',
    'The room quiets when the pile is done.',
    'The day comes back lighter.',
    'Domestic rhythm turns disorder into relief.',
    'The work ends with a quieter room.',
    'Usefulness returns softly.',
  ],
  rooftop: [
    'Evening turns the roof into a last look.',
    'The city softens from above.',
    'A high rail makes leaving slower.',
    'Last light gives the city an edge.',
    'The roof keeps the day for one more minute.',
    'Above traffic, evening becomes gentle.',
    'The rail turns a view into a pause.',
    'The city is quieter from the roof.',
    'From above, distance becomes evening.',
    'The roof gives the day a slow exit.',
    'The hour loosens above the street.',
    'The view lasts because evening is brief.',
    'The roof lets the city exhale.',
    'The city seems kinder from above.',
    'A rail in evening can slow the whole day.',
    'The last light turns distance human.',
    'The high air gives the day room to end.',
    'Evening makes the city less certain.',
    'The roof holds a pause above the street.',
    'From above, the day leaves quietly.',
  ],
  diner: [
    'A familiar booth lets breakfast feel remembered.',
    'The booth feels familiar because service talk keeps answering.',
    'Breakfast gets its rhythm from the voices nearby.',
    'The booth settles in while the counter keeps moving.',
    'The table feels intimate because the counter stays awake.',
    'Service talk answers while the booth remembers your place.',
    "The booth feels remembered when the counter answers.",
    'The booth holds comfort; service talk keeps breakfast alive.',
    'Service talk gives the familiar booth its pulse.',
    'The table feels known once service talk starts.',
    'The booth slows the morning while the counter keeps time.',
    'Booth comfort gets familiar; service talk keeps it bright.',
    'The ritual is the table, the voice, and the refill.',
    'The booth keeps breakfast close; service talk keeps it bright.',
    'An ordinary morning can sing from a vinyl seat.',
    'Service talk keeps pace while the booth keeps memory.',
    'A booth becomes breakfast when service talk calls back.',
    'The table leaves room for the counter to answer.',
    'The booth feels familiar once the counter answers.',
    'Service talk turns a booth into a regular place.',
  ],
  harbor: [
    'Still water becomes departure at the rail.',
    'The edge is the moment before distance.',
    'A dock is a held breath before open water.',
    'The rail is where still water starts leaving.',
    'Leaving begins before the hull lets go.',
    'Still water waits until distance calls.',
    'A mooring is just departure waiting politely.',
    'The water makes every edge temporary.',
    'A boat is close until the morning opens.',
    'The rail keeps departure from becoming sudden.',
    'Distance starts as a careful leaving.',
    'The rail turns waiting toward open water.',
    'A tied boat still belongs to distance.',
    'A tied boat is already thinking of open water.',
    'Departure is quiet before it is visible.',
    'The edge holds a breath before leaving.',
    'The edge remembers what the water will take.',
    'A morning boat makes still water purposeful.',
  ],
  music: [
    'Sound begins when attention finds a beat.',
    'The room learns to listen before it plays.',
    'A first beat turns waiting into company.',
    'Rehearsal is care before sound.',
    'The room gets musical by agreeing on time.',
    'A song begins as shared attention.',
    'The first sound needs everyone listening.',
    'Sound starts when everyone shares one beat.',
    'The beat gives the room a common floor.',
    'A rehearsal turns patience into sound.',
    'The room becomes a song by counting together.',
    'Before sound, there is agreement.',
    'The first beat makes the room less separate.',
    'A phrase can make a room breathe together.',
    'The song arrives by getting ready.',
    'Attention is the first instrument.',
    'The room turns timing into company.',
    'The room becomes a song by listening.',
  ],
  porch: [
    'A threshold warms when someone is expected.',
    'The house turns outward at the front step.',
    'A small arrival can change the whole block.',
    'The front step is where private light goes public.',
    'A lit step turns the street into company.',
    'The door makes room for the outside world.',
    'The step is small, but arrival makes it matter.',
    'A little light can turn a house toward people.',
    'The front edge of a home is already social.',
    'The block gets softer at the door.',
    'A house becomes less private by expecting someone.',
    'The threshold holds the first warmth.',
    'The step gives the block a place to arrive.',
    'A door can bring the street close.',
    'The house looks human at the edge.',
    'Someone expected can light the whole step.',
    'A small arrival changes the front of a house.',
    'The step belongs to both home and block.',
    'A porch is how a house reaches out.',
    'The front light turns arrival into warmth.',
    'Light at the door turns passing into visiting.',
    'A door becomes social before it opens.',
    'The porch lets home speak to the street.',
    'A small welcome can brighten the whole threshold.',
    'The front step gives the block a softer edge.',
    'Arrival gives the front light a reason.',
  ],
  picnic: [
    'Lunch turns the park into a table.',
    'The afternoon gets a center for a while.',
    'The park becomes domestic at noon.',
    'A meal brings the open air close.',
    'Shade tastes different when lunch arrives.',
    'The park learns to hold a table.',
    'A small meal makes the afternoon stay.',
    'Lunch gives the day somewhere to gather.',
    'The afternoon becomes shareable.',
    'The table is temporary; the company is not.',
    'Outside feels indoors for one meal.',
    'The park pauses around lunch.',
    'No walls are needed at noon.',
    'Lunch makes a room out of shade.',
    'The day opens when the food does.',
    'A shared meal teaches the park to stay.',
    'The afternoon settles around appetite.',
    'The park gets small enough for everyone.',
    'Lunch is how the outdoors becomes intimate.',
    'The shade keeps everyone at one table.',
  ],
  'clean-slate': ['A fresh plan needs one quiet first mark.'],
  'paper-hearts': [
    'A small note is care you can hold.',
    'The hand makes the gesture personal.',
    'Paper becomes braver when it is given.',
  ],
  'porch-lantern': ['A dressed threshold lets October arrive softly.'],
  'table-leaf': ['Another plate changes the whole room.'],
  'window-ribbon': ['A bright parcel lets the window catch light.'],
  'spring-basket': ['Hidden color wakes the garden.'],
  'porch-spark': ['Summer gets brighter when the house looks outward.'],
  observatory: [
    'The sky gets closer without getting smaller.',
    'Distance becomes something a person can wait for.',
    'The dome makes patience visible.',
    'The night comes nearer by staying unreachable.',
    'A long look turns distance into company.',
    'The telescope teaches the dark to answer.',
    'Wonder needs a room dark enough to wait.',
    'The far sky becomes local for a minute.',
    'A patient room can hold impossible distance.',
    'The roof opens and distance comes indoors.',
    'The night rewards the people who wait.',
    'A dark room can hold the farthest thing.',
    'The sky stays far, but the room gets close.',
    'Patience is how the dark comes near.',
    'The faraway gets one human room.',
    'The dome turns waiting into wonder.',
    'A dark dome lets distance come near.',
    'The dark answers only after patience.',
    'The roof opens and the room looks farther.',
    'A long look makes distance companionable.',
    'The night arrives one patient adjustment at a time.',
    'A telescope turns waiting into nearness.',
    'The sky comes close by remaining far.',
    'The dome gives distance a place to visit.',
  ],
  aquarium: [
    'The glass stays alive because water keeps whispering.',
    'Blue light makes quiet life visible.',
    'A small current keeps the room breathing.',
    'The tank becomes a world by never holding still.',
    'Water gives the small lives their weather.',
    'Behind the glass, quiet life keeps moving.',
    'A quiet swim can hold a whole room.',
    'The water turns the tank into weather.',
    'The glass feels alive when the water answers.',
    'Blue life stays vivid by moving softly.',
    'Water brings the small world near.',
    'The tank has a pulse you can watch.',
    'Water keeps the room gently unsettled.',
    'The little world breathes against the glass.',
    'Blue weather is the tank learning to move.',
    'Stillness shimmers when water has company.',
    'The glass holds life without stopping it.',
    'A small pulse travels through the blue room.',
    'Water makes the little world look newly awake.',
    'The blue room gives the glass something to carry.',
  ],
  newsroom: [
    'Truth gets careful before it gets loud.',
    'A public fact starts as private doubt.',
    'The morning reads cleaner after doubt.',
    'Noise has to earn the page.',
    'A checked story earns daylight.',
    'Trust is built before daylight.',
    'Truth survives by getting careful.',
    'The public line gets quieter before it gets true.',
    'A messy room can still protect the facts.',
    'The morning deserves facts, not noise.',
    'Doubt gives the day a cleaner voice.',
    'News becomes public only after care.',
    'A fact is a rumor that survived the room.',
    'The desk turns urgency into trust.',
  ],
  clockshop: [
    'Time gets a body before it gets a sound.',
    'Small machines make the hour dramatic.',
    'The counter speaks in ticks and balance.',
    'The hour becomes audible.',
    'The gears wake the quiet counter.',
    'Small time learns to speak on the counter.',
    'The hour needs a face before it can speak.',
    'The little machines wake when time asks.',
    'The tick keeps the hour close.',
    'The hour becomes something the counter can hold.',
    'A small mechanism gives the hour a voice.',
    'The counter turns minutes into little sounds.',
    'Time feels handmade in a room like this.',
    'The hour gets measured before it gets heard.',
    'Time sounds handmade here.',
    'The tick is how the room keeps faith.',
    'Time is less abstract when it can be heard.',
    'The hour becomes something the room can hold.',
    'Time gets intimate when it has moving parts.',
    'The counter gives the day a pulse.',
    'A little machine can steady the hour.',
    'The room hears time before anyone checks it.',
  ],
  chessboard: [
    'Strategy turns silence into danger.',
    'Every calm choice has a trapdoor.',
    'Every choice gets quieter near trouble.',
    'Pressure makes the room smaller.',
    'A quiet table can hold a war.',
    'The next choice carries the whole room.',
    'Danger arrives before a piece is touched.',
    'Pressure teaches silence to calculate.',
    'A small threat changes the whole room.',
    'The game gets loud without a sound.',
    'A quiet move can rearrange the room.',
    'The board makes stillness feel dangerous.',
    'Trouble waits inside the calm square.',
    'A small choice can corner the future.',
    'The board turns patience into pressure.',
    'Silence gets sharper on the squares.',
    'The threat is quiet until it is not.',
    'One patient choice can change the air.',
  ],
  campsite: [
    'Night gets friendlier around a tended ring.',
    'Outside becomes home by small habits.',
    'Shelter is the wild made practical.',
    'The open air turns domestic after dark.',
    'A fire earns the night one task at a time.',
    'The dark becomes livable by hand.',
    'A camp keeps the dark from feeling empty.',
    'Outside becomes a place when people tend it.',
    'Night feels possible near the ring.',
    'The wild stays close, but not too close.',
    'Warmth is what the evening was waiting for.',
    'The ring gathers the night through small care.',
    'A practical center makes the dark gentle.',
    'The ring steadies the open air.',
    'Evening settles when the camp settles.',
    'Ritual is how the wild becomes friendly.',
    'The ring turns the dark toward shelter.',
    'A little order makes the night kinder.',
  ],
  pottery: [
    'Fire makes the hand permanent.',
    'A vessel remembers pressure after heat.',
    'The soft thing keeps the handprint.',
    'Heat turns a careful touch into memory.',
    'Clay remembers the hand after fire.',
    'Pressure learns to last.',
    'Pressure becomes memory after heat.',
    'The handwork survives the fire.',
    'Heat gives pressure a second life.',
    'The soft thing comes back with memory.',
    'Clay keeps the shape of attention.',
    'The kiln turns touch into evidence.',
    'A handprint becomes durable in heat.',
    'Soft clay learns to keep its nerve.',
    'The vessel is touch made patient.',
    'Heat lets the hand stay visible.',
    'The wheel begins what the kiln remembers.',
    'Clay becomes memory by surviving fire.',
    'The finished shape still knows the hand.',
    'Pressure stays after the clay hardens.',
  ],
  apiary: [
    'Sweetness is work that learned to hum.',
    'The hive turns flight into order.',
    'The box gets a body when the work starts humming.',
    'A hive gives flight somewhere to come home.',
    'The hive hums with purpose.',
    'The box becomes audible with work.',
    'A box becomes a city once work takes flight.',
    'Flight becomes order near the comb.',
    'The hive makes work something you can hear.',
    'The comb keeps working after the bloom.',
    'The hive is bloom translated into labor.',
    'A small flight can sweeten the whole box.',
    'The work sounds gentle because it is exact.',
    'The bloom comes home as a hum.',
    'Honey begins as organized return.',
    'The box turns summer into work.',
  ],
  vineyard: [
    'The row keeps weather until it tastes like time.',
    'Fruit learns patience before it is poured.',
    'The season gets slower on its way to taste.',
    'Weather stays in the fruit after harvest.',
    'Patience is the flavor the row was keeping.',
    'The row points toward a slower table.',
    'Fruit waits until time answers.',
    'A good year becomes something you can taste.',
    'The season is saved by becoming flavor.',
    'The row saves a year for later.',
  ],
  tailor: [
    'Cloth becomes personal in the mirror.',
    'Fit is the moment cloth starts belonging.',
    'The mirror turns cloth into yours.',
    'A body gives the garment its answer.',
    'Structure becomes comfort by small corrections.',
    'Cloth becomes yours by being corrected.',
    'The mirror refines what the cloth meant.',
    'Cloth claims its shape on the body.',
    'A good fit makes structure humane.',
    'The mirror softens when the cloth fits.',
    'Cloth needs a body before it is finished.',
    'The garment becomes personal by degrees.',
    'The fitting makes cloth answer back.',
    'A good seam knows the body quietly.',
    'The mirror lets structure become mercy.',
    'Cloth gets intimate by being corrected.',
    'The body teaches the garment its shape.',
    'A better fit is comfort made visible.',
  ],
  airport: [
    'Distance gets official at the gate.',
    'The room exists to make leaving orderly.',
    'A crowd becomes travel when distance gets named.',
    'The schedule turns leaving into something public.',
    'The gate gives the sky a schedule.',
    'Departure points the whole room outward.',
    'Distance feels less abstract once it has a time.',
    'Departure makes the room wider before anyone leaves.',
    'A public room turns leaving into order.',
    'Departure turns the room toward distance.',
    'Every sign in the room points outward.',
    'The gate gives leaving a public rhythm.',
    'The terminal is temporary on purpose.',
    'Distance becomes official before it becomes sky.',
  ],
  apothecary: [
    'Care gets careful before it becomes a dose.',
    'The shelf has a quiet purpose in the hand.',
    'Old quiet becomes precise care.',
    'A remedy is care measured small.',
    'The bottle keeps old usefulness within reach.',
    'A remedy is care made exact.',
    'Care waits until the hand gets precise.',
    'Trust is measured before it is swallowed.',
    'Small bottles keep care close.',
    'The remedy begins before the dose.',
    'Patience is part of the medicine.',
    'A careful hand makes the shelf worth keeping.',
  ],
  planetarium: [
    'The room travels without leaving its seats.',
    'Darkness gives the ceiling a sky.',
    'A borrowed night can erase the roof.',
    'The room borrows the sky.',
    'Looking up is enough to leave for a while.',
    'The room gets far away on purpose.',
    'Indoors, wonder travels overhead.',
    'The ceiling learns to be far away.',
    'A dark room turns travel vertical.',
    'The show turns looking up into leaving.',
    'Night arrives without weather.',
    'The room leaves Earth by going dark.',
    'Distance is borrowed and returned by the hour.',
    'The seats stay put while the room goes elsewhere.',
    'The ceiling disappears by becoming believable.',
    'A quiet room can hold a borrowed sky.',
    'The dark teaches the ceiling to travel.',
    'Wonder begins when the room looks up.',
    'The sky comes indoors for one impossible hour.',
    'The room goes farther than its walls.',
    'A ceiling can become a departure.',
  ],
  firehouse: [
    'Urgency gets real when readiness can answer.',
    'Practice gives urgency somewhere to go.',
    'The bay waits until urgency has a job.',
    'The first motion is already waiting in the bay.',
    'Readiness becomes help when the alarm speaks.',
    'The firehouse rests with courage nearby.',
    'The still bay is ready to move fast.',
    'The bay wakes when the alarm does.',
    'Courage is practical before it is brave.',
    'Practice is why the room can answer.',
    'Readiness becomes public at the door.',
    'Help begins as a room kept ready.',
  ],
  'radio-booth': [
    'A small room can travel farther than walls.',
    'The voice leaves before the room does.',
    'The booth stays close while the sound goes outward.',
    'Broadcast is a room learning distance.',
    'The room gets larger when sound leaves it.',
    'Sound needs somewhere intimate to depart from.',
    'Air turns the room into distance.',
    'The signal needs a room before it can travel.',
    'The far room begins in the small one.',
    'A voice can cross walls without raising itself.',
    'The booth shapes the air before anyone hears it.',
    'Sound becomes public by leaving a small room.',
    'The voice travels because the air is trusted.',
    'Sound leaves with the room still around it.',
    'A small room gives the voice longer reach.',
    'The booth matters most past its wall.',
    'Air lets the room cross itself.',
    'Sound knows where to go once the room is ready.',
    'Intent is the first distance in a broadcast.',
    'The far room starts at the microphone.',
    'Distance can sound almost near.',
    'The public edge of sound starts small.',
    'The booth keeps silence from wasting the air.',
    'Sound crosses the wall and keeps going.',
    'Broadcast begins as a clean departure.',
    'A voice leaves the room and keeps someone company.',
  ],
  printshop: [
    'Ink gives language a public body.',
    'A private sentence becomes public weight.',
    'Language gets heavier when it leaves the hand.',
    'Language gets heavier when it becomes public.',
    'Ink turns words into something the street can hold.',
    'The page makes language less private.',
    'The street gets a sentence with shoulders.',
    'Printing gives words a body in public.',
    'Printed language has a useful weight.',
    'Language becomes an object people can carry.',
    'Ink lets a message stand outside.',
    'The page gives words a public address.',
  ],
  'weather-station': [
    'Instruments turn forecast shifts into something legible.',
    'Forecast shifts give instruments their quiet urgency.',
    'Instruments keep watch while changing weather becomes evidence.',
    'Instruments take the mystery out of forecast shifts.',
    'Forecast shifts turn instruments into early warning.',
    'Instruments give forecast shifts evidence from the air.',
    'Instruments give forecast shifts a measured voice.',
    'Forecast shifts wake the instruments.',
    'The sky gets counted where instruments wait.',
    'Instruments turn pressure into forecast shifts.',
    'Forecast shifts turn numbers into weather.',
    'The station listens through instruments and forecast shifts.',
    'Instruments pull the next weather into view.',
    'A forecast matters before anyone looks up.',
    'Instruments keep count until forecast shifts become warning.',
    'Instruments turn air changes into public care.',
    'Forecast shifts make the instruments matter early.',
    'Instruments read the weather shifts.',
    'Instruments and forecast shifts make the sky accountable.',
    'Forecast shifts turn measured air into a warning.',
  ],
  dancehall: [
    'Music gives the room a pulse.',
    'Music turns bodies into a room.',
    'The room finds a pulse before anyone speaks.',
    'Music makes the room visible.',
    'Music turns waiting into motion.',
    'The room learns the music by moving.',
    'A dance begins when the room agrees.',
    'Rhythm gives the room its feet.',
    'The first sound changes the air.',
    'A shared beat is a room in motion.',
  ],
  laboratory: [
    'Wonder earns proof by slowing down.',
    'Proof is curiosity with a method.',
    'The question survives by getting precise.',
    'Evidence is wonder that stayed careful.',
    'Care makes wonder useful.',
    'The answer earns its confidence slowly.',
    'A question becomes proof by behaving carefully.',
    'The smallest change can carry the answer.',
    'Precision is the poetry of not guessing.',
    'Wonder gets believable by slowing down.',
    'The answer is patience made visible.',
    'Care turns a question into evidence.',
    'A careful method lets wonder leave a mark.',
    'Proof arrives when guessing stops.',
    'The question grows smaller and truer.',
    'Evidence is a gentle answer to doubt.',
    'Wonder learns to be exact.',
    'The answer sounds different after care.',
  ],
  lighthouse: [
    'A far light turns danger into direction.',
    'Height becomes care when water needs help.',
    'The warning climbs so the water can read it.',
    'A coast is safer when height speaks.',
    'A far light is mercy with a long reach.',
    'Danger gets a direction from above.',
    'The high room turns worry into warning.',
    'A warning matters most before arrival.',
    'The coast understands the dark by looking up.',
    'Light carries care over water.',
    'The edge gets a voice from above.',
    'A light is useful only when danger is near.',
    'Height gives danger somewhere to turn.',
    'The water reads care from far away.',
    'A warning is kindness made visible.',
    'The far room keeps danger from being alone.',
    'A light above water can be a promise.',
    'A working light lets the coast read the dark.',
  ],
};

export const THREADLINE_EDITORIAL_GOLD_SET = [
  {
    dateKey: '2026-05-21',
    note: 'Calibration example: reject abstract titles, repeated diner-booth scaffolding, and mechanical anchor payoffs.',
  },
  {
    dateKey: '2026-05-01',
    note: 'Opening-day calibration: copy should feel immediately human and establish the everyday-aha voice.',
  },
  {
    dateKey: '2026-07-02',
    note: 'Holiday-adjacent calibration: seasonal without sounding meta-editorial.',
  },
  {
    dateKey: '2027-01-01',
    note: 'New-year window calibration: avoid obvious calendar copy unless the scheduled puzzle earns it.',
  },
] as const;

interface ThreadlineApprovedCopyOverride {
  domain: string;
  title?: string;
  leadTemplate: string;
  weave?: string;
  note: string;
}

const THREADLINE_APPROVED_COPY_OVERRIDES: Readonly<Record<string, ThreadlineApprovedCopyOverride>> = {
  '2026-05-08': {
    domain: 'library',
    title: 'The Public Hush',
    leadTemplate: 'Under the library lamp, a {B1} finds {A1}, {A2}, and {A3} before {B2} and {B3} make the hour quiet.',
    weave: 'The room lowers its voice for the reader.',
    note: 'Library override removes the share-the-table scaffold and gives glance, chair, and cushion a reader-shaped sentence.',
  },
  '2026-05-12': {
    domain: 'park',
    title: 'The Bench Halfway',
    leadTemplate: 'Past the {A2} and {A3}, the {A1} gives people room to {B1}, {B2}, and {B3}.',
    weave: 'A park path is permission to slow down.',
    note: 'Park override removes the root-echo "walk by walkway" phrase and lets the path details create a natural strolling sentence.',
  },
  '2026-05-18': {
    domain: 'trail',
    title: 'A Map Made Outdoors',
    leadTemplate: 'On the trail, {A1}, {A2}, and {A3} point ahead, but {B1}, {B2}, and {B3} make the walking worth it.',
    weave: 'The way forward is only half the walk.',
    note: 'Trail override retires first-mile inventory phrasing and gives the marker/list landscape a human reason.',
  },
  '2026-05-27': {
    domain: 'commute',
    title: 'Rain At The Door',
    leadTemplate: 'By the door, {A1}, {A2}, and {A3} come first before {B1}, {B2}, and {B3} decide the route.',
    weave: 'Rain makes the first step practical.',
    note: 'Commute override removes the forecast-has/route-has frame and turns the two lists into a door-to-route moment.',
  },
  '2026-05-30': {
    domain: 'station',
    title: 'Trackside Morning',
    leadTemplate: 'On the platform, {A1}, {A2}, and {A3} tell travelers where they are while {B1}, {B2}, and {B3} help them wait.',
    weave: 'Station signs pull waiting close to departure.',
    note: 'Station override replaces the awkward "bring the train close" scaffold with signage and waiting habits.',
  },
  '2026-06-06': {
    domain: 'park',
    title: 'After The Fountain',
    leadTemplate: 'In the park, {A1}, {A2}, and {A3} give people reasons to {B1}, {B2}, and {B3}.',
    weave: 'A familiar path softens every errand.',
    note: 'Park override removes the repeated walk-by scaffold and makes the park routine sound observed.',
  },
  '2026-06-12': {
    domain: 'trail',
    title: 'After The Creek',
    leadTemplate: 'On the trail, {A1}, {A2}, and {A3} keep the route plain until {B1}, {B2}, and {B3} make it feel discovered.',
    weave: 'A walk becomes a story after the first marker.',
    note: 'Trail override replaces first-mile inventory language with route signs giving way to landscape discovery.',
  },
  '2026-06-21': {
    domain: 'commute',
    title: 'Shelter Map',
    leadTemplate: 'By the door, {A1} and {A2} answer the {A3} before {B1}, {B2}, and {B3} handle the trip.',
    weave: 'The forecast matters most at the door.',
    note: 'Commute override removes forecast-has/route-has repetition and gives weather gear a plain doorway logic.',
  },
  '2026-06-24': {
    domain: 'station',
    title: 'Late Platform',
    leadTemplate: 'On the platform, {A1}, {A2}, and {A3} name the leaving while {B1}, {B2}, and {B3} pass the minutes.',
    weave: 'The station turns waiting toward leaving.',
    note: 'Station override removes the train-close scaffold and lets checkin, headset, and scroll behave like waiting habits.',
  },
  '2026-11-09': {
    domain: 'trail',
    title: 'Marker Morning',
    leadTemplate: 'On the trail, {A1}, {A2}, and {A3} keep the route plain until {B1}, {B2}, and {B3} make it feel discovered.',
    weave: 'A trail is trust followed by surprise.',
    note: 'Trail override retires first-mile inventory phrasing and keeps markers giving way to landscape discovery.',
  },
  '2027-02-07': {
    domain: 'library',
    title: 'Light In The Stacks',
    leadTemplate: 'Under the library lamp, a {B1} settles over {A1}, {A2}, and {A3} while {B2} and a {B3} keep the hour private.',
    weave: 'A borrowed hour can feel private.',
    note: 'Library override removes share-the-table phrasing and gives pause, silence, and note a readerly sentence.',
  },
  '2026-05-03': {
    domain: 'desk',
    title: 'Page Ready',
    leadTemplate: 'Under the desk lamp, the {A1} glows beside the {A2} and {A3} while notes narrow the morning to {B1}, {B2}, and {B3}.',
    weave: 'The page tells the morning where to begin.',
    note: 'Desk override removes the page-waits scaffold and makes the list feel like an actual first instruction.',
  },
  '2026-05-13': {
    domain: 'school',
    title: 'Bell At The Door',
    leadTemplate: 'Before the bell, {A} sit on the desks, and the first hour brings {B}.',
    weave: 'A classroom starts when everyone looks up.',
    note: 'School override replaces a doubled "has" sentence with a human classroom moment and a cleaner attention payoff.',
  },
  '2026-05-16': {
    domain: 'mailroom',
    title: 'Shelf Before Door',
    leadTemplate: 'On the mailroom shelf, {A} sit before {B} send them out.',
    weave: 'Every shelf knows it is halfway to a door.',
    note: 'Mailroom override replaces back-room handling and purpose language with a shelf-to-door aha.',
  },
  '2026-05-22': {
    domain: 'harbor',
    title: 'Castoff Light',
    leadTemplate: 'At the harbor rail, {A} name the still edge, and on the water, the work is {B}.',
    weave: 'A tied boat is already thinking of open water.',
    note: 'Harbor override removes the boat-turns-to scaffold and makes the still edge/open water relationship read naturally.',
  },
  '2026-05-15': {
    domain: 'bakery',
    leadTemplate: 'At the bakery case, {A} hold up the line while {B} move breakfast into paper.',
    note: 'Bakery override retires "counter handles" and lets the case-to-door movement carry the sentence.',
  },
  '2026-06-13': {
    domain: 'laundry',
    title: 'Line In The Yard',
    leadTemplate: 'By the laundry line, {A} are almost done after {B}.',
    weave: 'The line turns the pile back into household order.',
    note: 'Laundry override replaces come-back-ready phrasing with a simple line-to-drawer household turn.',
  },
  '2026-06-16': {
    domain: 'harbor',
    title: 'Still At The Rail',
    leadTemplate: 'At the rail, {A} keep the boat close until {B} pull it toward open water.',
    weave: 'A harbor is a pause with departure inside.',
    note: 'Harbor override replaces water-ahead-means syntax with a rail-to-open-water sentence and a compact pause/departure aha.',
  },
  '2026-06-25': {
    domain: 'kitchen',
    title: 'Knife Near Heat',
    leadTemplate: 'At first, the counter has {A}, and then {B} pull dinner together.',
    weave: 'Dinner starts when separate things share heat.',
    note: 'Kitchen override replaces the soft "Near Supper" frame with a concrete counter-to-heat sentence.',
  },
  '2026-06-27': {
    domain: 'library',
    title: 'Chair Under The Lamp',
    leadTemplate: 'Under the lamp, {A} belong to the book, and {B} belong to the hour.',
    weave: 'One chair can make a public room private.',
    note: 'Library override gives the quiet objects a human reading posture instead of an abstract low-voice title.',
  },
  '2026-07-04': {
    domain: 'bakery',
    leadTemplate: 'At the warm case, {A} wait under glass while {B} turn breakfast into a decision.',
    note: 'Bakery override makes the counter action feel like choosing, not a procedural list.',
  },
  '2026-07-05': {
    domain: 'mailroom',
    title: 'A Door In Mind',
    leadTemplate: 'In the mailroom, {A1}, {A2}, and {A3} line up before {B1}, {B2}, and {B3} send them toward a door.',
    weave: 'A sorted shelf is already halfway to a door.',
    note: 'Mailroom override retires sit-on-shelf phrasing and keeps the shelf-to-door aha literal.',
  },
  '2026-07-23': {
    domain: 'shore',
    leadTemplate: 'At low tide, {A} show where the water was while {B} are already changing the edge.',
    weave: "Low water leaves proof that won't stay.",
    note: 'Shore override replaces unsettled-sand phrasing with a clearer tide sentence.',
  },
  '2026-07-28': {
    domain: 'gallery',
    title: 'Light On The Frame',
    leadTemplate: 'At the frame, {A} draw visitors into {B}.',
    weave: 'A painting changes the room by slowing the body.',
    note: 'Gallery override removes visitors-are template phrasing and lets the art actively change the visitor posture.',
  },
  '2026-07-29': {
    domain: 'bakery',
    leadTemplate: 'Behind the glass, {A} stay in the case until {B} move them from tray to hand.',
    note: 'Bakery override replaces procedural counter language with a concrete case-to-hand arc.',
  },
  '2026-08-14': {
    domain: 'kitchen',
    title: 'Counter Before Heat',
    leadTemplate: 'On the counter, {A} wait separately until {B} pull supper closer.',
    weave: 'Supper starts while the counter is still separate.',
    note: 'Kitchen override replaces still-separate-when phrasing with a more natural counter sentence and keeps the aha before the pan.',
  },
  '2026-08-03': {
    domain: 'rooftop',
    title: 'Last Light Upstairs',
    leadTemplate: 'From the roof, {A} stay in sight as {B} arrive over the street.',
    weave: 'Up high, evening takes its time.',
    note: 'Rooftop override retires hold-the-view phrasing and lets height slow the evening down.',
  },
  '2026-08-11': {
    domain: 'desk',
    title: 'Noon On The Page',
    leadTemplate: 'Before work begins, {A} settle on the desk, and {B} narrow the morning.',
    weave: 'The day starts once the page names the work.',
    note: 'Desk override replaces the passive "Page Waiting" frame with work becoming named and actionable.',
  },
  '2026-08-23': {
    domain: 'bakery',
    title: 'Small Errand',
    leadTemplate: 'Behind the glass, {A} make everyone look twice before {B} send breakfast into paper.',
    weave: 'Hunger points, then the paper closes.',
    note: 'Bakery override replaces line-tempts machinery with a human looking/choosing moment and a concise case-to-paper payoff.',
  },
  '2026-08-27': {
    domain: 'laundry',
    title: 'Folded Proof',
    leadTemplate: 'By the line, {A} are almost done after {B}.',
    weave: "The pile returns as tomorrow's clothes.",
    note: 'Laundry override removes duplicate linen language and come-back-ready phrasing.',
  },
  '2026-09-09': {
    domain: 'studio',
    leadTemplate: 'On the worktable, {A} cover the surface while {B} are the first signs of an idea.',
    note: 'Studio override replaces draft-visibility phrasing with a cleaner materials-to-marks sentence.',
  },
  '2026-09-15': {
    domain: 'school',
    leadTemplate: 'Before the bell, {A} lie on the desks for {B}.',
    weave: 'A classroom starts when attention has somewhere to go.',
    note: 'School override removes take-over and turns-supplies phrasing with a desk-to-attention reveal.',
  },
  '2026-09-19': {
    domain: 'theater',
    leadTemplate: 'The room goes quiet around {A} as {B} gather in the seats.',
    weave: 'The show starts in the audience before the stage.',
    note: 'Theater override retires a room-turns-show payoff and lets audience attention carry the aha.',
  },
  '2026-09-27': {
    domain: 'picnic',
    title: 'Blanket Table',
    leadTemplate: 'Under the trees, {A} are enough for people to {B}.',
    weave: 'Lunch makes a room out of open air.',
    note: 'Picnic override replaces stay-close phrasing with a plain food-to-afternoon sentence.',
  },
  '2026-09-30': {
    domain: 'desk',
    title: 'The First Request',
    leadTemplate: "At the desk, {A} surround the day's first words: {B}.",
    weave: 'The desk changes when the note names the work.',
    note: 'Desk override retires notes-say phrasing with a human first-note sentence.',
  },
  '2026-10-10': {
    domain: 'school',
    title: 'Bell Before Voices',
    leadTemplate: 'Before the bell, a {A2} lands beside the {A3}, the {A1} catches the window light, and the teacher has {B1}, {B2}, and a {B3} ready.',
    weave: 'The bell only starts it; the voices make it school.',
    note: 'School override replaces static desk inventory with a child/teacher moment and lets the reveal land on the room becoming school through voices.',
  },
  '2026-11-01': {
    domain: 'market',
    title: 'One More Stop',
    leadTemplate: 'Under the awning, {A} fill the stall while shoppers {B}.',
    weave: 'The stall becomes personal at the moment of choosing.',
    note: 'Market override retires the practical-wanting payoff and keeps the reveal in the buyer/stall relationship.',
  },
  '2026-11-02': {
    domain: 'workshop',
    title: 'Lamp Over The Bench',
    leadTemplate: 'On the bench, {A} are ready, but {B} say where the hands should go.',
    weave: 'Damage tells the tools where to start.',
    note: 'Workshop override swaps soft bench-light language for damage directing the repair.',
  },
  '2026-11-11': {
    domain: 'rooftop',
    title: 'Rail Over Noise',
    leadTemplate: 'The roof keeps {A} in view as the city settles into {B}.',
    weave: 'Traffic sounds farther away from the roof.',
    note: 'Rooftop override replaces vague gentleness with the concrete distance a roof creates.',
  },
  '2026-11-12': {
    domain: 'diner',
    title: 'Regular Seat',
    leadTemplate: 'The booth feels familiar around {A} while the counter stays busy with {B}.',
    weave: "A regular booth needs the counter's voice.",
    note: 'Diner override replaces rhythm-as-explanation with a smaller, more human booth/counter connection.',
  },
  '2026-11-14': {
    domain: 'music',
    title: 'The First Run',
    leadTemplate: 'In the practice room, {A} give the players something to hear, and {B} teach them where to begin again.',
    weave: 'A song becomes shared when everyone counts together.',
    note: 'Music override replaces ready-as/count syntax with a rehearsal sentence about hearing, timing, and return.',
  },
  '2026-11-19': {
    domain: 'desk',
    title: 'Morning In Ink',
    leadTemplate: 'On the desk, {A} surround the first page: {B}.',
    weave: 'The page gives the morning a task.',
    note: 'Desk override retires first-notes-say phrasing and makes the page-to-task turn explicit.',
  },
  '2026-11-27': {
    domain: 'workshop',
    title: 'The Loose Edge',
    leadTemplate: 'The bench lamp catches {A} beside the {B} that need attention.',
    weave: 'The flaw chooses the right tool.',
    note: 'Workshop override retires ready-but/tell-the-job syntax and makes the repair clue choose the tool.',
  },
  '2026-12-05': {
    domain: 'laundry',
    title: 'Drawer After Washday',
    leadTemplate: 'From the basket come {A}, and by the end, {B} have made them drawer-ready.',
    weave: 'Washday turns the pile back into household order.',
    note: 'Laundry override replaces come-back-through syntax with a read-aloud chore arc and a shorter household landing.',
  },
  '2026-12-17': {
    domain: 'kitchen',
    leadTemplate: 'The counter gathers {A} before {B} make the room smell like supper.',
    weave: 'The room smells full before the table is.',
    note: 'Kitchen override removes "supper gets closer through" and lets aroma carry the reveal.',
  },
  '2026-12-18': {
    domain: 'studio',
    title: 'Under The Lamp',
    leadTemplate: 'The worktable has {A}, and the first ideas are {B}.',
    weave: 'Materials wait until marks choose the form.',
    note: 'Studio override replaces draft-shape machinery with a simpler materials-to-form sentence.',
  },
  '2026-12-19': {
    domain: 'library',
    leadTemplate: 'Under the shelf light, {A} keep company with {B}.',
    weave: 'The lamp makes one chair enough.',
    note: 'Library override replaces a public/private abstraction with a compact lamp-and-chair payoff.',
  },
  '2026-12-26': {
    domain: 'bakery',
    title: 'The Slow Choice',
    leadTemplate: 'Behind the glass, {A1}, {A2}, and {A3} make choosing slower while bakers are {B1}, {B2}, and {B3} behind the counter.',
    weave: 'The choice gets sweet before it gets wrapped.',
    note: 'Bakery override replaces the linger-over-motion grammar with a counter sentence people could actually say.',
  },
  '2026-12-30': {
    domain: 'clean-slate',
    title: 'Quiet Plan',
    leadTemplate: 'At the quiet desk, the {A1} holds a {B1}, the {A2} marks the {B2}, and the {A3} card is saved for {B3}.',
    weave: 'A blank day begins with one small order.',
    note: 'Clean-slate override removes the short-list colon and gives each planning move a desk object.',
  },
  '2027-02-26': {
    domain: 'commute',
    title: 'Rain At The Curb',
    leadTemplate: 'At the curb, {A1} and {A2} bring out the {A3}, with {B1}, {B2}, and {B3} still between here and home.',
    weave: 'In rain, every stop is borrowed shelter.',
    note: 'Commute override retires way-home-runs-through, decide-the-way-home, put-to-work, and break-the-trip phrasing.',
  },
  '2027-05-02': {
    domain: 'newsroom',
    title: 'Copy Before Dawn',
    leadTemplate: 'At the newsroom desk, {A} wait while reporters {B}.',
    weave: 'A story earns trust before daylight.',
    note: 'Newsroom override removes make-sense-through staging and gives the second list a reporter subject.',
  },
  '2027-05-05': {
    domain: 'chessboard',
    title: 'Square By Square',
    leadTemplate: 'At the chessboard, {A} sit in view while {B} crowd the next move.',
    note: 'Chessboard override removes inside-the-pressure staging and keeps the pressure on the move.',
  },
  '2027-05-12': {
    domain: 'apothecary',
    title: 'Measured By Hand',
    leadTemplate: 'Careful hands reach for {A1}, {A2}, and {A3} before they {B1}, {B2}, and {B3}.',
    weave: 'Old quiet becomes precise care.',
    note: 'Apothecary override replaces plain-work/local-detail, meet-hands-that, and take-from-shelf phrasing with direct shelf work.',
  },
  '2027-05-23': {
    domain: 'newsroom',
    title: 'Morning Edition',
    leadTemplate: 'At the newsroom desk, {A} wait while reporters {B}.',
    note: 'Newsroom override removes inside-the-story staging and gives the press moves a human subject.',
  },
  '2027-05-29': {
    domain: 'tailor',
    title: 'Body In Cloth',
    leadTemplate: 'At the mirror, {A1}, {A2}, and {A3} tell the hands where to {B1}, {B2}, and {B3}.',
    note: 'Tailor override removes inside-the-fitting staging and makes the fit work tactile.',
  },
  '2027-05-30': {
    domain: 'tailor',
    title: 'Fine Adjustment',
    leadTemplate: 'The fitting mirror holds onto {A} until {B} put the fit to use.',
    weave: 'A good fit makes structure humane.',
    note: 'Tailor override follows the live schedule and removes tailor-mirror/tailor repetition.',
  },
  '2027-05-31': {
    domain: 'apothecary',
    title: 'Herbs Under Glass',
    leadTemplate: 'On the apothecary shelf, {A} wait while careful hands {B}.',
    note: 'Apothecary override removes make-sense-through staging and keeps the shelf/remedy work concrete.',
  },
  '2027-07-05': {
    domain: 'firehouse',
    title: 'The Fast Room',
    leadTemplate: 'In the bay, {A} hang ready as the crew rehearses {B}.',
    weave: 'Courage is practical before it is brave.',
    note: 'Firehouse override breaks the repeated call-asks lead.',
  },
  '2027-07-07': {
    domain: 'firehouse',
    title: 'Courage At Rest',
    leadTemplate: 'Before the alarm, {A} stay in the bay as the crew rehearses {B}.',
    weave: 'Readiness becomes public at the door.',
    note: 'Firehouse override breaks the repeated call-asks lead.',
  },
  '2027-09-28': {
    domain: 'firehouse',
    title: 'Polished Bell',
    leadTemplate: 'Before the alarm, {A} hang in the bay as the crew rehearses {B}.',
    weave: 'Practice is why the room can answer.',
    note: 'Firehouse override breaks the repeated call-asks lead.',
  },
  '2027-06-14': {
    domain: 'pottery',
    title: 'A Vessel Almost There',
    leadTemplate: 'At the clay table, {A} sit in the light while {B} gather near the kiln.',
    weave: 'The kiln keeps the handprint after the hand is gone.',
    note: 'Pottery override removes pottery-wheel/wheel repetition and gives the payoff a unique handprint image.',
  },
  '2027-06-11': {
    domain: 'aquarium',
    title: 'A Room In Blue',
    leadTemplate: 'Behind the glass, {A} drift while {B} keep the water moving.',
    note: 'Aquarium override removes ordinary-weight staging and lets water motion carry the row.',
  },
  '2027-08-26': {
    domain: 'lighthouse',
    title: 'The Far Warning',
    leadTemplate: 'Inside the tower, {A} stand ready before {B} follow the water.',
    weave: 'A light is useful only when danger is near.',
    note: 'Lighthouse override removes lighthouse-stair/stair repetition while keeping the danger-near payoff.',
  },
  '2026-12-27': {
    domain: 'mailroom',
    title: 'Route On The Shelf',
    leadTemplate: 'On the shelf, {A} wait before {B} send them out.',
    weave: 'Every route begins as a shelf.',
    note: 'Mailroom override retires practical-distance language and makes the route hidden in the shelf the aha.',
  },
  '2026-12-28': {
    domain: 'theater',
    title: 'Seats Before Sound',
    leadTemplate: 'The lights find {A} as {B} gather in the seats.',
    weave: 'The show starts before anyone speaks.',
    note: 'Theater override catches the second retired room-turns-show payoff after the generator reshuffle.',
  },
  '2026-08-25': {
    domain: 'theater',
    title: 'The First Cue',
    leadTemplate: 'The manager checks the {A1}, {A2}, and {A3} before a {B1}, a {B2}, and a {B3} ripple through the dark.',
    weave: 'Before the first line, the room agrees to listen.',
    note: 'Theater override retires pass-through-seats phrasing and makes the audience response arrive like a sound in the room.',
  },
  '2027-01-21': {
    domain: 'mailroom',
    title: 'A Door Somewhere',
    leadTemplate: 'On the shelf, {A} sit before {B} move them toward a door.',
    weave: 'A room built for sorting is really built for arrival.',
    note: 'Mailroom override replaces warm-proof abstraction with the concrete destination hidden in sorting.',
  },
  '2027-01-22': {
    domain: 'theater',
    title: 'Seats Holding Breath',
    leadTemplate: 'The lights find {A} as {B} gather in the seats.',
    weave: 'The audience is one breath before the show.',
    note: 'Theater override retires the soft "Ready Light" title and makes the pre-show unity explicit.',
  },
  '2027-01-26': {
    domain: 'diner',
    title: 'Vinyl Seat',
    leadTemplate: 'At the booth, {A} sit on the table while the counter tracks {B}.',
    weave: 'Breakfast feels familiar when the counter keeps answering.',
    note: 'Diner override removes the "can be just" construction and gives the booth/counter aha a cleaner voice.',
  },
  '2027-02-02': {
    domain: 'desk',
    title: 'First Instruction',
    leadTemplate: 'On the desk, the {A3} lies between the {A1} and {A2} while notes settle into {B1}, {B2}, and {B3}.',
    weave: 'A clean desk needs a first instruction.',
    note: 'Desk override replaces scattered-work/doable language with a more literal list-to-start payoff.',
  },
  '2027-02-05': {
    domain: 'kitchen',
    title: 'Counter Scent',
    leadTemplate: 'The counter smells of {A1}, {A2}, and {A3} before {B1}, {B2}, and {B3} pull supper closer.',
    weave: 'A quiet counter can become hunger.',
    note: 'Kitchen override removes still-separate staging and lets scent, prep, and supper carry the sentence.',
  },
  '2027-02-10': {
    domain: 'workshop',
    title: 'Where The Fix Starts',
    leadTemplate: 'On the bench, {A} line up beside {B}.',
    weave: 'Tools listen best when the flaw is plain.',
    note: 'Workshop override removes hands-should-go phrasing and turns the repair relationship into a concise aha.',
  },
  '2027-02-19': {
    domain: 'rooftop',
    title: 'Noise Below The Rail',
    leadTemplate: 'From the rooftop rail, {A} catch the last light as the city settles into {B}.',
    weave: 'The roof makes the city sound farther away.',
    note: 'Rooftop override replaces abstract evening gentleness with the height/noise relationship.',
  },
  '2027-02-27': {
    domain: 'desk',
    title: 'Ink At Noon',
    leadTemplate: 'The workday opens beside {A}, and the notes are {B}.',
    weave: 'A clear list makes the desk start working.',
    note: 'Desk override catches the second retired usefulness payoff and turns the desk copy toward action.',
  },
  '2027-02-28': {
    domain: 'garden',
    title: 'After Rain, Hands',
    leadTemplate: 'After rain, {A} stand out while the gardener starts {B}.',
    weave: 'Green lasts because hands come back.',
    note: 'Garden override replaces day-leans phrasing and green-confidence abstraction with a return-of-care aha.',
  },
  '2027-01-12': {
    domain: 'studio',
    title: 'A Place For Color',
    leadTemplate: 'Under the lamp, {A} lie close together, and {B} decide what the hand will notice first.',
    weave: 'Materials become marks only after the hand chooses.',
    note: 'Studio override replaces first-decisions copy with a concrete table/hand sentence and a more human materials-to-mark payoff.',
  },
  '2027-02-14': {
    domain: 'bakery',
    leadTemplate: 'Behind the glass, {A} are still possibilities until {B} send one into the box.',
    note: 'Bakery override keeps the Valentine-window puzzle warm without returning to counter machinery.',
  },
  '2027-03-11': {
    domain: 'bakery',
    title: 'Something Warm Leaves',
    leadTemplate: 'Behind the glass, {A} sit while {B} decide which one leaves.',
    weave: 'The box starts as hunger with a favorite.',
    note: 'Bakery override replaces warm-box softness with the moment choice leaves the case.',
  },
  '2027-03-15': {
    domain: 'laundry',
    title: 'Drawer After Work',
    leadTemplate: 'By the washer, {A} move through {B} on the way to the drawer.',
    weave: 'The drawer closes on quiet work.',
    note: 'Laundry override retires the fresh-ending and ready-for-drawers payoffs and names where the clean pile is headed.',
  },
  '2027-03-27': {
    domain: 'kitchen',
    title: 'Counter Near Heat',
    leadTemplate: 'On the counter, {A1}, {A2}, and {A3} meet the {B1}, {B2}, and {B3} that make supper.',
    weave: 'Heat gives separate things one smell.',
    note: 'Kitchen override retires turn-into-supper-by phrasing and keeps the reveal on heat, hands, and separate ingredients becoming one meal.',
  },
  '2027-04-19': {
    domain: 'garden',
    title: 'Rain In The Beds',
    leadTemplate: 'After rain, {A} shine while the gardener turns to {B}.',
    weave: 'Rain starts the beds; hands keep them.',
    note: 'Garden override replaces day-leans phrasing with a more human after-rain sentence.',
  },
  '2027-04-27': {
    domain: 'park',
    title: 'Around The Loop',
    leadTemplate: 'The loop passes {A} while people {B} under the trees.',
    weave: 'A path feels local after enough return.',
    note: 'Park override removes motion-to-neighborhood abstraction and grounds the aha in repeated use.',
  },
  '2027-04-30': {
    domain: 'bakery',
    title: 'The Warm Walk Home',
    leadTemplate: 'Behind the glass, {A} stay under glass until {B} get breakfast into paper.',
    weave: 'A warm box can change the walk home.',
    note: 'Bakery override swaps the generic small-sugar title for a concrete after-counter image.',
  },
  '2027-05-01': {
    domain: 'newsroom',
    title: 'A Page Before Morning',
    leadTemplate: 'The newsroom desk keeps {A} close while the first orders are {B}.',
    weave: 'Care is what lets news go public.',
    note: 'Newsroom override replaces carry-the-room-onward phrasing with a desk-and-orders sentence.',
  },
  '2027-06-20': {
    domain: 'airport',
    title: 'The Line Faces Out',
    leadTemplate: 'The departure hall holds {A} while {B} tug the room outward.',
    weave: 'The room is already leaving before anyone boards.',
    note: 'Airport override removes terminal-window/terminal repetition and replaces visible-part/rest phrasing.',
  },
  '2027-06-17': {
    domain: 'apothecary',
    title: 'Care In Small Bottles',
    leadTemplate: 'On the apothecary shelf, {A} wait while careful hands are {B}.',
    weave: 'A remedy begins with patient hands.',
    note: 'Apothecary override follows the live schedule and removes inside-the-remedy staging.',
  },
  '2027-06-27': {
    domain: 'lighthouse',
    title: 'The Warning Climbs',
    leadTemplate: 'Inside the tower, {A} share the warning with {B}.',
    weave: 'A far light turns danger into direction.',
    note: 'Lighthouse override follows the live schedule and removes lighthouse-stair/stair repetition.',
  },
  '2027-07-11': {
    domain: 'radio-booth',
    title: 'Red Lamp Live',
    leadTemplate: 'The red light comes on near {A}, and {B} build the broadcast.',
    weave: 'A small room lets the voice leave cleanly.',
    note: 'Radio override replaces generic late-desk light with the booth-to-air transformation.',
  },
  '2027-07-13': {
    domain: 'observatory',
    title: 'Dome Light Low',
    leadTemplate: 'At the observatory, {A} are ready for {B} overhead.',
    weave: 'A dark dome lets distance come near.',
    note: 'Observatory override removes generic room-quiet wording and makes the dome/distance connection immediate.',
  },
  '2027-08-05': {
    domain: 'dancehall',
    title: 'The Middle Brightens',
    leadTemplate: 'The dancehall has {A} at the edge before dancers {B}.',
    weave: 'Music gives waiting bodies a direction.',
    note: 'Dancehall override removes visible-room abstraction and lets music organize the bodies.',
  },
  '2027-07-03': {
    domain: 'pottery',
    title: 'A Vessel Nearly There',
    leadTemplate: 'At the worktable, {A1}, {A2}, and {A3} take shape before {B1}, {B2}, and {B3} finish the piece.',
    weave: 'A vessel remembers the hand after heat.',
    note: 'Pottery override retires clay-table/clay repetition, sit-near-kiln phrasing, and answer-anchored clay-hardens payoff.',
  },
  '2027-08-08': {
    domain: 'newsroom',
    title: 'Before It Goes Out',
    leadTemplate: 'On the newsroom desk, {A} stay under the lamp until reporters {B}.',
    weave: 'News is what survives being checked.',
    note: 'Newsroom override follows the current schedule and makes listen/verify/revise actions belong to reporters.',
  },
  '2027-08-12': {
    domain: 'clockshop',
    title: 'Small Brass Hour',
    leadTemplate: 'Under the glass, {A} rest in the case until {B} can be heard.',
    weave: 'Time sounds handmade in a clockshop.',
    note: 'Clockshop override replaces abstract-audible language with a concrete counter-to-sound sentence.',
  },
  '2027-04-22': {
    domain: 'studio',
    title: 'Brush Thought',
    leadTemplate: 'In the studio light, {A1}, {A2}, and {A3} cover the table while {B1}, {B2}, and {B3} give the first marks shape.',
    weave: 'A studio idea starts when materials meet marks.',
    note: 'Studio override retires keep-still payoff language and keeps the material-to-mark aha concrete.',
  },
  '2027-08-15': {
    domain: 'apiary',
    title: 'The Box Starts Humming',
    leadTemplate: 'Near the hive, {A} crowd the frame while bees {B}.',
    weave: 'Sweetness begins with work coming home.',
    note: 'Apiary override replaces abstract organization language with a hive-specific subject and a concise return payoff.',
  },
  '2027-08-29': {
    domain: 'observatory',
    title: 'Almost Held',
    leadTemplate: 'Under the observatory roof, {A} are ready when the night offers {B}.',
    weave: 'A patient room can hold impossible distance.',
    note: 'Observatory override follows the live schedule and removes observatory-dome/dome repetition.',
  },
  '2027-09-01': {
    domain: 'apiary',
    title: 'Box In The Bloom',
    leadTemplate: 'At the apiary, {A1} hang near {A2} and {A3} while bees are {B1}, {B2}, and {B3}.',
    weave: 'Sweetness takes work before it tastes simple.',
    note: 'Apiary override follows the live schedule, rejects brood/brooding repetition, and makes bee motion read as one hive scene.',
  },
  '2027-09-07': {
    domain: 'tailor',
    leadTemplate: 'Near the mirror, {A} stay within reach as {B} make the fit personal.',
    note: 'Tailor override removes a generic shape phrase and ties the actions to fit.',
  },
  '2027-09-25': {
    domain: 'tailor',
    title: 'A Better Fit',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} guide the hands as they {B1}, {B2}, and {B3}.',
    weave: 'Cloth becomes personal in the mirror.',
    note: 'Tailor override follows the live schedule and replaces local-detail phrasing with actual fitting work.',
  },
  '2027-10-18': {
    domain: 'airport',
    title: 'Before It Boards',
    leadTemplate: 'In the terminal, {A} keep the trip official while the screens call for {B}.',
    weave: 'Leaving feels public before it feels airborne.',
    note: 'Airport override replaces gather-toward-the-gate phrasing after the answer-pool reshuffle.',
  },
  '2027-11-05': {
    domain: 'weather-station',
    title: 'The Sky Leaves Clues',
    leadTemplate: 'At the weather station, {A1}, {A2}, and {A3} read the air as pressure is {B1}, crews {B2}, and clouds are {B3}.',
    weave: 'Instruments take the mystery out of forecast shifts.',
    note: 'Weather-station override follows the live schedule and removes keep-watch/watch repetition.',
  },
  '2027-11-30': {
    domain: 'rooftop',
    title: 'Last Light Below',
    leadTemplate: 'From the roof, {A} hold the view while {B} rise from below.',
    weave: 'From above, the city loses its edges.',
    note: 'Rooftop override replaces distance-kind abstraction with a more literal height/noise transformation.',
  },
  '2027-09-22': {
    domain: 'firehouse',
    title: 'The Roll Begins',
    leadTemplate: 'Before the alarm, {A} hang in the bay as the crew rehearses {B}.',
    weave: 'Help begins before the wheels move.',
    note: 'Firehouse override follows the live schedule, breaks the repeated call-asks lead, and gives the payoff a unique motion.',
  },
  '2027-11-02': {
    domain: 'apiary',
    title: 'Boxes Near Bloom',
    leadTemplate: 'Along the apiary path, {A1}, {A2}, and {A3} crowd the boxes while bees keep {B1}, {B2}, and {B3}.',
    weave: 'Sweetness is work that learned to hum.',
    note: 'Apiary override removes hive-near-hive repetition, resolves title reuse, and gives the hive moves a grammatical bee subject.',
  },
  '2027-11-09': {
    domain: 'planetarium',
    title: 'The Ceiling Goes Far',
    leadTemplate: 'The dark room shows {A} while {B} make the ceiling travel.',
    weave: 'The dark teaches the ceiling to travel.',
    note: 'Planetarium override follows the live schedule and removes dome-on-dome wording.',
  },
  '2027-11-06': {
    domain: 'airport',
    title: 'Room Points Outward',
    leadTemplate: 'The departure board holds {A} while the trip narrows to {B}.',
    weave: 'Every sign in the room points outward.',
    note: 'Airport override removes terminal-window/terminal repetition and keeps the outward-pointing payoff.',
  },
  '2027-09-05': {
    domain: 'tailor',
    title: 'Fitting Light',
    leadTemplate: 'At the fitting mirror, {A} change under {B}.',
    weave: 'A better fit is comfort made visible.',
    note: 'Tailor override resolves title reuse and turns the garment list into a visible fitting change.',
  },
  '2027-09-24': {
    domain: 'vineyard',
    title: 'Weather In Rows',
    leadTemplate: 'In the vineyard row, {A1}, {A2}, and {A3} matter before anyone can {B1}, {B2}, or {B3}.',
    weave: 'Weather becomes flavor by waiting.',
    note: 'Vineyard override follows the live schedule and replaces change-the-room phrasing with harvest work.',
  },
  '2027-10-05': {
    domain: 'newsroom',
    title: 'Noise Becomes Copy',
    leadTemplate: 'The newsroom desk has {A} in the easy light while reporters keep {B} close.',
    weave: 'Truth gets careful before it gets loud.',
    note: 'Newsroom override removes inside-the-copy staging and keeps the truth-before-volume payoff.',
  },
  '2027-10-01': {
    domain: 'chessboard',
    title: 'Next Move',
    leadTemplate: 'At the chessboard, {A} sit on the squares while {B} crowd the next move.',
    note: 'Chessboard override follows the live schedule and removes inside-the-pressure staging.',
  },
  '2027-10-04': {
    domain: 'chessboard',
    title: 'A Quiet Cornered King',
    leadTemplate: 'At the chessboard, {A} sit on the surface while {B} tighten the pressure.',
    note: 'Chessboard override removes inside-the-pressure staging and keeps the threat concrete.',
  },
  '2027-10-12': {
    domain: 'apothecary',
    title: 'Bottle Before Remedy',
    leadTemplate: 'On the apothecary shelf, {A} wait while careful hands {B}.',
    note: 'Apothecary override removes inside-the-remedy staging and keeps the shelf/remedy work concrete.',
  },
  '2027-11-10': {
    domain: 'lighthouse',
    title: 'Warning Lifted',
    leadTemplate: 'Inside the tower, {A} stay in view before {B} carry warning over the water.',
    weave: 'A far light keeps fear from becoming guesswork.',
    note: 'Lighthouse override removes lighthouse-stair/stair repetition and gives the warning a unique payoff.',
  },
  '2027-11-14': {
    domain: 'lighthouse',
    title: 'Kindness From Above',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} face the water while the light can {B1}, {B2}, and {B3}.',
    weave: 'A high light gives fear a bearing.',
    note: 'Lighthouse override retires stay-in-view and turn-danger syntax, keeping the warning humane without repeating a payoff.',
  },
  '2027-11-15': {
    domain: 'lighthouse',
    title: 'Before The Breakers',
    leadTemplate: 'Inside the tower, {A} keep the first quiet while {B} change the rhythm.',
    weave: 'The warning leaves before danger arrives.',
    note: 'Lighthouse override removes lighthouse-stair/stair repetition and resolves the duplicate warning title.',
  },
  '2027-11-25': {
    domain: 'laundry',
    title: 'The Fresh Stack',
    leadTemplate: 'From the basket, {A} are clean after {B}.',
    weave: 'Domestic care has a quiet rhythm.',
    note: 'Laundry override removes clean-fabric/fabric repetition and the come-back-after scaffold.',
  },
  '2027-11-23': {
    domain: 'shore',
    leadTemplate: 'At low tide, {A} linger on the sand before {B} take the edge back.',
    weave: 'The tide is always revising the beach.',
    note: 'Shore override replaces two-step list syntax with a cleaner tide-return sentence and an impermanence payoff.',
  },
  '2027-12-14': {
    domain: 'theater',
    title: 'House Before Sound',
    leadTemplate: 'When the lights come up, the {A1}, {A2}, and {A3} hold their places while {B1}, {B2}, and {B3} rise from below.',
    weave: 'The hush is part of the opening.',
    note: 'Theater override removes hold-the-stage phrasing and puts the staged details directly against the living house.',
  },
  '2027-12-19': {
    domain: 'bakery',
    leadTemplate: 'Behind the glass, {A} are already breakfast before {B} sweeten the box.',
    weave: 'The box carries sweetness past the line.',
    note: 'Bakery override removes the last counter-handles phrase and sharpens the payoff.',
  },
  '2026-05-01': {
    domain: 'cafe',
    leadTemplate: 'At the window table, {A2} steams beside the {A1} and {A3} while {B1}, {B2}, and {B3} wake the block outside.',
    weave: 'Breakfast brings the block close to the window.',
    note: 'Opening-day override removes the cup/teacup tautology and makes the window/block relationship concrete.',
  },
  '2027-01-01': {
    domain: 'diner',
    title: 'Coffee Comes Back',
    leadTemplate: 'At the diner booth, {A} feel like the usual place while the counter calls out {B}.',
    weave: 'The booth feels familiar once the counter answers.',
    note: 'New-year diner override retires table-has-table phrasing while keeping the booth/counter comfort.',
  },
  '2026-06-14': {
    domain: 'rooftop',
    title: 'Roofline Before Dark',
    leadTemplate: 'From the rooftop rail, {A} catch the last glow while the evening settles into {B}.',
    weave: 'A rail in evening can slow the whole day.',
    note: 'Rooftop override retires duplicated light wording and keeps the last-hour feeling.',
  },
  '2026-07-06': {
    domain: 'theater',
    title: 'Listening Room',
    leadTemplate: 'The house settles around {A} before {B} gather in the dark.',
    weave: 'The room holds its breath on purpose.',
    note: 'Theater override removes curtain-on-curtain phrasing and puts the room before the response.',
  },
  '2026-08-01': {
    domain: 'trail',
    title: 'The Way Through',
    leadTemplate: 'On the first mile, {A} keep the walk honest while the landscape opens into {B}.',
    weave: 'The route is plain; wonder is why you stay.',
    note: 'Trail override retires trail-on-trail wording while keeping the sign/wonder relationship.',
  },
  '2026-08-28': {
    domain: 'rooftop',
    title: 'Slow View',
    leadTemplate: 'Above the block, {A} catch the glow as the hour quiets into {B}.',
    weave: 'The hour loosens above the street.',
    note: 'Rooftop override removes repeated light while preserving the high, quiet evening.',
  },
  '2026-12-31': {
    domain: 'rooftop',
    title: 'Bright Edge',
    leadTemplate: 'At the rail, {A} stay in the last glow with {B} in the air.',
    weave: 'The high air gives the day room to end.',
    note: 'Rooftop override retires last-light duplication while keeping the year-end height.',
  },
  '2027-01-03': {
    domain: 'music',
    title: 'Practice Room Awake',
    leadTemplate: 'By the stand, {A} stay quiet as the room listens for {B}.',
    weave: 'A song begins as shared attention.',
    note: 'Music override removes music-stand/music repetition and keeps the attention payoff.',
  },
  '2027-05-26': {
    domain: 'tailor',
    title: 'Mirror Fit',
    leadTemplate: 'Near the fitting mirror, {A} wait while the notes say {B}.',
    weave: 'Structure becomes comfort by small corrections.',
    note: 'Tailor override removes tailor-mirror/tailor repetition and lets the fitting notes carry the verbs.',
  },
  '2027-05-27': {
    domain: 'pottery',
    title: 'Soft Form Turning',
    leadTemplate: 'At the clay table, {A} sit within reach while {B} change what comes next.',
    weave: 'A vessel remembers pressure after heat.',
    note: 'Pottery override retires pottery-wheel/wheel repetition while keeping the hand-to-heat arc.',
  },
  '2027-06-18': {
    domain: 'tailor',
    title: 'Mirror Before Fit',
    leadTemplate: 'The fitting mirror keeps {A} close while hands {B}.',
    weave: 'The mirror softens when the cloth fits.',
    note: 'Tailor override follows the live schedule and removes inside-the-fitting staging.',
  },
  '2026-05-19': {
    domain: 'laundry',
    leadTemplate: 'On laundry day, {A3} {A1} lose {A2}, so {B1}, {B2}, and {B3} all happen before the basket closes.',
    weave: 'Care travels from hamper to skin.',
    note: 'Laundry override removes by-way-of routing and turns the answers into a believable tiny repair story.',
  },
  '2026-05-31': {
    domain: 'kitchen',
    leadTemplate: 'On the counter, {A1}, {A2}, and {A3} meet the {B1}, {B2}, and {B3} that make supper.',
    weave: 'Supper is raw things meeting heat and hands.',
    note: 'Kitchen override retires turn-into-supper-by phrasing and keeps the reveal on raw ingredients meeting heat and hands.',
  },
  '2026-06-10': {
    domain: 'mailroom',
    leadTemplate: 'The sorting shelf lists {A} as {B} get underway.',
    weave: 'A shelf is already thinking about a door.',
    note: 'Mailroom override works around the awkward "postal" slot without pretending it is a normal object.',
  },
  '2026-06-23': {
    domain: 'garden',
    leadTemplate: 'Near the beds, {A} stand bright while the gardener starts {B}.',
    weave: 'The garden stays itself because hands return.',
    note: 'Garden override replaces day-leans phrasing with a gardener-centered sentence.',
  },
  '2026-07-08': {
    domain: 'laundry',
    leadTemplate: 'On laundry day, {A1}, {A2}, and {A3} mean {B3}, {B2}, and {B1} before anyone is done.',
    weave: 'The pile gets quiet on its way to the drawer.',
    note: 'Laundry override removes by-way-of routing and gives the chore a plain household order.',
  },
  '2026-08-02': {
    domain: 'laundry',
    leadTemplate: 'By the washer, {A} go through {B}.',
    weave: 'The room exhales when the pile is handled.',
    note: 'Laundry override replaces hour-softens phrasing with direct household action.',
  },
  '2026-08-19': {
    domain: 'workshop',
    leadTemplate: 'On the bench, {A} line up beside {B}.',
    weave: 'The flaw tells the tools where to begin.',
    note: 'Workshop override removes hands-should-go phrasing and lets the damage direct the tools.',
  },
  '2026-08-22': {
    domain: 'gallery',
    leadTemplate: 'The frame catches {A} while visitors are {B}.',
    weave: 'Art slows the body before the mind follows.',
    note: 'Gallery override retires room-slows/attention-turns language in favor of visitor posture.',
  },
  '2026-08-29': {
    domain: 'diner',
    leadTemplate: 'The booth feels familiar around {A} while the counter stays busy with {B}.',
    weave: 'A booth feels regular when the counter answers.',
    note: 'Diner override replaces breakfast-rhythm scaffolding with a shorter table/counter payoff.',
  },
  '2026-09-21': {
    domain: 'laundry',
    leadTemplate: 'By the washer, {A} return after {B}.',
    weave: 'Clean cloth gives the room back its calm.',
    note: 'Laundry override removes the repeated hamper-through and ready-for-use rhythm.',
  },
  '2026-10-23': {
    domain: 'cafe',
    leadTemplate: 'At the window, {A} sit inside while {B} start the block outside.',
    weave: 'The window lets breakfast borrow the block.',
    note: 'Cafe override retires another "outside, the morning has" lead and keeps the window/block aha.',
  },
  '2026-12-02': {
    domain: 'mailroom',
    leadTemplate: 'On the shelf, {A} wait before {B} send them out.',
    weave: 'Arrival is the promise hidden in sorting.',
    note: 'Mailroom override removes morning-turns phrasing and keeps the shelf-to-route promise.',
  },
  '2027-02-09': {
    domain: 'market',
    leadTemplate: 'At the stall, {A} fill the crates as shoppers {B}.',
    weave: 'The basket gets honest one choice at a time.',
    note: 'Market override replaces practical-wanting abstraction with a concrete basket/choice payoff.',
  },
  '2027-02-18': {
    domain: 'laundry',
    leadTemplate: 'By the washer, {A1}, {A2}, and {A3} look usable again after {B1}, {B2}, and {B3}.',
    weave: 'Small care makes the mess usable.',
    note: 'Laundry override retires go-through-before phrasing and makes the wash-day moves restore usefulness without a procedural list.',
  },
  '2027-02-20': {
    domain: 'diner',
    title: 'Vinyl Morning',
    leadTemplate: 'A regular booth means {A} while {B} cross the counter.',
    weave: 'The counter keeps the booth from being anonymous.',
    note: 'Diner override retires table-has phrasing and keeps the aha at service plus booth.',
  },
  '2027-03-07': {
    domain: 'workshop',
    leadTemplate: 'The {B1}, {B2}, and {B3} explain why the {A1}, {A2}, and {A3} are out.',
    weave: 'Damage gives the tools their first instruction.',
    note: 'Workshop override replaces hands-should-go and repeated line-up phrasing with a flaw-to-tool relationship.',
  },
  '2027-03-18': {
    domain: 'harbor',
    leadTemplate: 'At the harbor rail, {A} name the still edge, and on the water, the work is {B}.',
    weave: 'Still water is only the first part of leaving.',
    note: 'Harbor override removes boat-turns-to scaffolding and makes the held-breath title literal.',
  },
  '2027-04-03': {
    domain: 'school',
    leadTemplate: 'At the classroom door, {A} are easy to spot before {B} begin.',
    weave: 'The first signal changes what a pencil is for.',
    note: 'School override removes doubled have/has phrasing while preserving the first-hour reveal.',
  },
  '2027-04-12': {
    domain: 'harbor',
    leadTemplate: 'At the morning rail, {A} stay tied down while {B} wait beyond the slips.',
    weave: 'A tied boat already belongs to open water.',
    note: 'Harbor override replaces boat-turns-to and repeated still-edge phrasing with a tied-boat/open-water aha.',
  },
  '2027-05-13': {
    domain: 'firehouse',
    title: 'Fast Help',
    leadTemplate: 'Before the bell, {A} wait while the crew learns to {B}.',
    weave: 'Help moves fast because the bay practiced.',
    note: 'Firehouse override breaks a repeated bay-call structure and gives the response verbs a crew subject.',
  },
  '2027-06-25': {
    domain: 'dancehall',
    leadTemplate: 'The dancehall keeps {A} at the edge before dancers {B}.',
    weave: 'Music gives the room a pulse.',
    note: 'Dancehall override removes corner-gathering language and lets the floor turn toward the beat.',
  },
  '2027-09-18': {
    domain: 'newsroom',
    leadTemplate: 'On the newsroom desk, {A} stay close as {B} keep the story honest.',
    weave: 'A story earns daylight by being checked.',
    note: 'Newsroom override retires useful-doubt language and keeps the deadline row concrete.',
  },
  '2027-09-26': {
    domain: 'tailor',
    leadTemplate: 'The fitting note names {A} before hands {B}.',
    weave: 'Cloth belongs when it has been corrected.',
    note: 'Tailor override follows the live schedule and retires move-the-work-along phrasing.',
  },
  '2027-09-27': {
    domain: 'tailor',
    title: 'The Hem Comes Close',
    leadTemplate: 'The fitting mirror keeps {A} close while the notes say {B}.',
    weave: 'The mirror turns cloth into yours.',
    note: 'Tailor override follows the live schedule and removes tailor-mirror/tailor repetition.',
  },
  '2027-11-17': {
    domain: 'garden',
    leadTemplate: 'By the beds, {A} wait for {B}.',
    weave: 'The garden keeps green by being tended.',
    note: 'Garden override replaces morning-worth phrasing with direct bed-and-care syntax.',
  },
  '2027-11-22': {
    domain: 'garden',
    leadTemplate: 'In the green bed, {A} stand bright before the gardener starts {B}.',
    weave: 'Care is how the garden keeps its green.',
    note: 'Garden override retires day-gets-greener phrasing and removes leaves-on-leaves wording.',
  },
  '2027-11-24': {
    domain: 'gallery',
    leadTemplate: 'The wall catches {A} while visitors are {B}.',
    weave: 'Looking turns silence into company.',
    note: 'Gallery override removes room-slows/attention-turns language while keeping the witness-like payoff.',
  },
  '2027-12-07': {
    domain: 'garden',
    leadTemplate: 'Near the beds, {A} wait for {B}.',
    weave: 'The path remembers every returning hand.',
    note: 'Garden override replaces day-leans phrasing and keeps care as a repeated return.',
  },
  '2027-12-10': {
    domain: 'laundry',
    leadTemplate: 'On laundry day, {B2} sharpens the {A2}, {B1} pairs the {A1}, and {B3} warms the {A3} before the drawer closes.',
    weave: 'Laundry is care you can wear.',
    note: 'Laundry override removes the wearable-pile phrasing and makes the chores act on the fabric in a household sequence.',
  },
  '2027-12-20': {
    domain: 'rooftop',
    leadTemplate: 'From the roof, {A} settle above a city of {B}.',
    weave: 'Up high, the city lets the day go.',
    note: 'Rooftop override retires hold-the-view and city-becomes-evening language with a quieter height-to-dusk sentence.',
  },
  '2027-01-08': {
    domain: 'desk',
    title: 'A Page To Begin',
    leadTemplate: 'The desk holds {A} while the page narrows to {B}.',
    weave: 'A page gives scattered work somewhere to land.',
    note: 'Desk override replaces on-the-page-are syntax with a cleaner surface/page relationship.',
  },
  '2026-07-18': {
    domain: 'garden',
    leadTemplate: 'Near the beds, {A} stand bright while the gardener is {B}.',
    weave: 'Green lasts because care comes back.',
    note: 'Garden override catches another day-leans lead and keeps the reveal in returning care.',
  },
  '2026-08-12': {
    domain: 'garden',
    leadTemplate: 'Near the beds, {A} stand bright while the gardener is {B}.',
    weave: 'The season is gentler where hands return.',
    note: 'Garden override removes day-leans phrasing from another beds-and-care row.',
  },
  '2026-09-16': {
    domain: 'gallery',
    leadTemplate: 'The wall catches {A} while visitors are {B}.',
    weave: "A quiet wall changes the visitor's speed.",
    note: 'Gallery override retires the pause-into-attention payoff and makes the body-level change specific.',
  },
  '2026-10-11': {
    domain: 'gallery',
    leadTemplate: 'The frame holds {A} while visitors are {B}.',
    weave: 'Looking changes speed in front of a frame.',
    note: 'Gallery override retires the pause-into-attention payoff in a nearby frame row.',
  },
  '2026-11-05': {
    domain: 'gallery',
    leadTemplate: 'The gallery light catches {A} while visitors are {B}.',
    weave: "Looking changes the room's tempo.",
    note: 'Gallery override removes the last pause-into-attention payoff from the current scan.',
  },
  '2026-11-30': {
    domain: 'gallery',
    leadTemplate: 'At the quiet wall, {A} hold still while visitors are {B}.',
    weave: "A quiet wall can change a visitor's speed.",
    note: 'Gallery override catches another pause-into-attention payoff and breaks the repeated frame-holds rhythm after the schedule reshuffle.',
  },
  '2026-12-25': {
    domain: 'gallery',
    leadTemplate: 'The quiet wall holds {A} while visitors are {B}.',
    weave: 'The wall rewards the slower eye.',
    note: 'Gallery override removes the last remaining pause-into-attention payoff from the retired scan.',
  },
  '2027-03-22': {
    domain: 'cafe',
    title: 'Window Before Errands',
    leadTemplate: 'At the window, {A} sit inside while {B} start the block outside.',
    weave: 'Warmth is how the first errand begins.',
    note: 'Cafe override removes the "outside, the morning has" scaffold from a later window row.',
  },
  '2027-04-01': {
    domain: 'spring-basket',
    leadTemplate: 'On the spring table, {A} brighten the hunt before people {B}.',
    weave: 'Hidden color wakes the garden.',
    note: 'Spring-basket override replaces point-past-the-pause scaffolding with a plain hunt sentence.',
  },
  '2027-10-28': {
    domain: 'newsroom',
    leadTemplate: 'On the newsroom desk, {A} stay close as {B} keep the report honest.',
    weave: 'Checking is how rumor reaches daylight.',
    note: 'Newsroom override retires another useful-doubt payoff and grounds trust in checking.',
  },
  '2027-10-29': {
    domain: 'newsroom',
    leadTemplate: 'On the newsroom desk, {A} stay close as {B} keep the story honest.',
    weave: 'News earns trust before it gets loud.',
    note: 'Newsroom override catches the next useful-doubt payoff and gives it a trust-before-volume turn.',
  },
  '2027-11-07': {
    domain: 'planetarium',
    title: 'A Quiet Trip Up',
    leadTemplate: 'In the dark room, {A} take over while the show keeps to {B}.',
    weave: 'The ceiling becomes travel when the room goes dark.',
    note: 'Planetarium override follows the live schedule and removes under-the-dome/dome repetition.',
  },
  '2027-11-16': {
    domain: 'lighthouse',
    leadTemplate: 'Inside the lighthouse, {A} wait while {B} reach the water.',
    weave: 'From above, the coast gets its warning.',
    note: 'Lighthouse override replaces point-past-the-pause scaffolding and removes tower-on-tower wording.',
  },
  '2027-11-20': {
    domain: 'laundry',
    leadTemplate: 'By the laundry line, {A} come back from {B}.',
    weave: 'The pile learns its way back to the drawer.',
    note: 'Laundry override removes day-steadying phrasing from another washday row.',
  },
  '2027-12-17': {
    domain: 'garden',
    leadTemplate: 'Near the beds, {A} stand bright while the gardener starts {B}.',
    weave: 'Hands return, and the beds stay green.',
    note: 'Garden override retires the quiet-work confidence payoff, breaks the repeated because-hands-return weave skeleton, and returns to concrete care.',
  },
  '2026-05-06': {
    domain: 'kitchen',
    leadTemplate: 'The counter smells of {A1}, {A2}, and {A3} before {B1}, {B2}, and {B3} warm the kitchen.',
    weave: 'Touch and heat wake the kitchen.',
    note: 'Kitchen override removes the "room is just" construction from the opening-week read.',
  },
  '2026-05-23': {
    domain: 'music',
    title: 'Room Finding Rhythm',
    leadTemplate: 'In the practice room, {A} find the same {B}.',
    weave: 'The song begins in shared time.',
    note: 'Music override retires stay-quiet/count-setting syntax with a compact rehearsal sentence about shared time.',
  },
  '2026-07-30': {
    domain: 'mailroom',
    title: 'A Door Begins Here',
    leadTemplate: 'On the sorting shelf, {A1}, {A2}, and {A3} land in door-bound piles after {B1}, {B2}, and {B3}.',
    weave: 'The doorstep starts in a back-room stack.',
    note: 'Mailroom override retires go-through-before syntax and keeps the back-room-stack to doorstep aha.',
  },
  '2027-06-12': {
    domain: 'newsroom',
    leadTemplate: 'The newsroom desk starts with {A} before {B} keep the story honest.',
    weave: 'A story earns trust before it reaches daylight.',
    note: 'Newsroom override removes "makes a place" and useful-doubt language from the record row.',
  },
  '2027-09-13': {
    domain: 'campsite',
    title: 'Ring After Dusk',
    leadTemplate: 'At the fire ring, {A} stay close while {B} keep supper warm.',
    weave: 'Night feels possible near the ring.',
    note: 'Campsite override follows the live schedule and removes make-the-dark-gentler phrasing.',
  },
  '2027-09-14': {
    domain: 'lighthouse',
    title: 'Glass Before Danger',
    leadTemplate: 'At the lighthouse stair, {A} face the water while the glass begins to {B}.',
    weave: 'Light gives danger a shape.',
    note: 'Lighthouse override replaces shift-the-scene phrasing with a water-facing line for glisten/reflect/outline.',
  },
  '2027-12-12': {
    domain: 'garden',
    title: 'Past The Gate',
    leadTemplate: 'Past the gate, {A} ask for {B}.',
    weave: 'A kept garden is patience made visible.',
    note: 'Garden override retires stand-ready/starts syntax, breaks the repeated because-care-returns weave skeleton, and lets the plants call for the work directly.',
  },
  '2027-12-18': {
    domain: 'shore',
    title: 'Wet Sand Evidence',
    leadTemplate: 'After low tide, {A1}, {A2}, and {A3} are left behind while the tide is {B1}, the water is {B2}, and foam is {B3} away.',
    weave: 'The beach is a note the tide keeps rewriting.',
    note: 'Shore override removes water-keeps list motion and gives the tide a more precise evidence-and-erasure payoff.',
  },
  '2026-12-24': {
    domain: 'school',
    title: 'Desks Before Voices',
    leadTemplate: 'Before the bell, {A1}, {A2}, and {A3} lie quiet until {B1}, {B2}, and {B3} bring voices in.',
    weave: 'A room becomes a class when everyone speaks up.',
    note: 'School override retires bring-voices-to-desks, fill-the-room, and make-the-room-answer phrasing while keeping the room transformation audible.',
  },
  '2026-12-22': {
    domain: 'window-ribbon',
    title: 'The Bright Parcel',
    leadTemplate: 'The front window shows {A} before neighbors {B}.',
    weave: 'A bright parcel lets the window catch light.',
    note: 'Holiday-window override gives gather/share/deliver a human subject and removes the enter-the-day scaffold.',
  },
  '2026-07-27': {
    domain: 'school',
    leadTemplate: 'Before voices rise, {A} share the room with {B}.',
    weave: 'Attention turns the room into a classroom.',
    note: 'School override removes "ready for the first hour" and room-waiting language.',
  },
  '2026-09-18': {
    domain: 'mailroom',
    leadTemplate: 'On the mailroom shelf, {A} sit as {B} build the route.',
    weave: 'A small route makes distance ordinary.',
    note: 'Mailroom override removes shelf-has/back-room-hums phrasing.',
  },
  '2026-09-13': {
    domain: 'workshop',
    title: 'Problem Under The Lamp',
    leadTemplate: 'Under the bench lamp, the {A1} smooths the {B3}, the {A2} tightens the {B1}, and the {A3} grip the {B2}.',
    weave: 'The broken spot chooses the tool.',
    note: 'Workshop override removes adjective-stacked repair copy and makes the tool/problem relationship plain.',
  },
  '2026-11-16': {
    domain: 'picnic',
    title: 'Shared Light',
    leadTemplate: 'On the grass, {A} are enough, and people {B} under the trees.',
    weave: 'Outside feels indoors for one meal.',
    note: 'Picnic override replaces hour-loosens copy with a direct food/company sentence while preserving the indoor-outdoor aha.',
  },
  '2026-12-01': {
    domain: 'bakery',
    leadTemplate: 'At the bakery case, {A} keep everyone looking until {B} get one item wrapped.',
    weave: 'A bakery morning ends in a small box.',
    note: 'Bakery override removes choosing/choosing repetition while keeping the case-to-box moment.',
  },
  '2027-03-12': {
    domain: 'mailroom',
    title: 'Back Room Route',
    leadTemplate: 'In the mailroom, one clerk is {B1} the {A2}, another is {B2} the {A3}, and a third is {B3} the {A1}.',
    weave: 'Every doorstep starts in a back-room pile.',
    note: 'Mailroom override removes ready-for-carrier scaffolding and assigns each gerund to a concrete piece of mailroom work.',
  },
  '2027-01-25': {
    domain: 'rooftop',
    title: 'The Last Bright Edge',
    leadTemplate: 'At the roof rail, {A} hold the last light while the city below slips into {B}.',
    weave: 'Up high, the city forgets to hurry.',
    note: 'Rooftop override replaces city-below-becomes phrasing with a sharper height/street transformation.',
  },
  '2027-04-09': {
    domain: 'laundry',
    title: 'The Soft Reset',
    leadTemplate: 'By the washer, {A1}, {A2}, and {A3} come back softer after {B1}, {B2}, and {B3}.',
    weave: 'A clean pile can quiet a room.',
    note: 'Laundry override retires go-through-before syntax and lets the calm-room payoff arrive from the clean pile itself.',
  },
  '2027-05-09': {
    domain: 'vineyard',
    title: 'After The Picking',
    leadTemplate: 'In the vineyard row, {A} stay in view while hands {B}.',
    weave: 'Weather takes its time after the picking.',
    note: 'Vineyard override replaces keeps-in-view phrasing with a plain row-and-hands sentence and a tighter harvest/weather payoff.',
  },
  '2027-05-15': {
    domain: 'radio-booth',
    title: 'Microphone Warmup',
    leadTemplate: 'In the radio booth, {A} sit near the mic while {B} carry the voice out.',
    weave: 'A voice leaves the room and keeps someone company.',
    note: 'Radio override replaces broadcast-runs-on syntax with a clearer booth-to-listener movement.',
  },
  '2027-05-20': {
    domain: 'lighthouse',
    title: 'Beam Through Fog',
    leadTemplate: 'On the lighthouse stair, the {A1} brings the {A2} to the {A3} before he can {B1}, {B2}, and {B3} the beam.',
    weave: 'A light above water can be a promise.',
    note: 'Lighthouse override replaces shift-the-scene phrasing with a beam-work sentence that fits direct/rotate/steady.',
  },
  '2027-05-19': {
    domain: 'laboratory',
    title: 'Evidence Waiting',
    leadTemplate: 'Under the lab light, the {A1}, {A2}, and {A3} are set out before the technician can {B1}, {B2}, and {B3}.',
    weave: 'Evidence is doubt made careful.',
    note: 'Laboratory override retires sit-beside-directions and help-someone verb-list phrasing while keeping the bench plan precise.',
  },
  '2027-09-02': {
    domain: 'campsite',
    title: 'Fire Holds The Dark',
    leadTemplate: 'At the fire ring, {A1}, {A2}, and {A3} stay within reach while coffee is {B1}, leaves are {B2}, and someone is {B3}.',
    weave: 'A fire makes the wild feel tended.',
    note: 'Campsite override uses individual motion slots so sleeping no longer has to keep supper warm.',
  },
  '2027-08-27': {
    domain: 'observatory',
    title: 'Glass Toward Stars',
    leadTemplate: 'Under the open roof, {A} meet the dark while the night offers {B}.',
    weave: 'Patience is how the dark comes near.',
    note: 'Observatory override follows the live schedule and removes dome-on-dome and wait-in-location repetition.',
  },
  '2027-09-03': {
    domain: 'campsite',
    title: 'Open Air Home',
    leadTemplate: 'After dark, water is {B1} from the {A1}, supper is {B2} in the {A2}, and the {A3} is zipped away once {B3} starts.',
    weave: 'A campfire gives the dark an address.',
    note: 'Campsite override replaces utility-slot grammar with a small, lived campfire sequence.',
  },
  '2027-10-25': {
    domain: 'laboratory',
    title: 'Careful Mark',
    leadTemplate: 'Under the lab light, {A} sit near directions to {B}.',
    weave: 'Care lets a question leave a trace.',
    note: 'Laboratory override removes the duplicated nonblank "test" and gives the row a unique title/payoff.',
  },
  '2027-10-30': {
    domain: 'newsroom',
    title: 'Proof Before Print',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} wait while reporters {B1}, {B2}, and {B3}.',
    weave: 'News becomes public only after care.',
    note: 'Newsroom override removes through-the-story/story repetition and keeps the trust work concrete.',
  },
  '2027-11-13': {
    domain: 'lighthouse',
    title: 'Care Over Breakers',
    leadTemplate: 'Inside the tower, {A} gather before {B} wake the water.',
    weave: 'A light is care sent ahead.',
    note: 'Lighthouse override follows the live schedule, removes lighthouse-stair/stair repetition, and resolves the duplicate warning title.',
  },
  '2027-08-06': {
    domain: 'lighthouse',
    title: 'Bright Above The Rocks',
    leadTemplate: 'At the lighthouse stair, {A} wait while the light can {B}.',
    weave: 'A far light is mercy with a long reach.',
    note: 'Lighthouse override follows the current schedule and replaces make-the-turn phrasing.',
  },
  '2027-02-21': {
    domain: 'harbor',
    title: 'Morning Closer',
    leadTemplate: 'The morning boat rests beside {A} with {B} still ahead.',
    weave: 'Still water holds the shape of departure.',
    note: 'Harbor override replaces waits-beside and still-water-becomes phrasing with a cleaner departure image.',
  },
  '2027-07-25': {
    domain: 'campsite',
    leadTemplate: 'By the fire, {A1}, {A2}, and {A3} stay close as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'Warmth is how the ring keeps night close.',
    note: 'Campsite override removes make-room-for and waiting-for warmth language from the final line.',
  },
  '2027-07-02': {
    domain: 'campsite',
    title: 'The Tent Goes Quiet',
    leadTemplate: 'By the fire, {A} make room for {B} after dark.',
    weave: 'Night feels held around the ring.',
    note: 'Campsite override replaces carry-the-evening phrasing with a direct after-dark camp sentence.',
  },
  '2027-07-26': {
    domain: 'apiary',
    title: 'A Hum Comes Home',
    leadTemplate: 'Near the hive, {A} sit in the same morning as bees that {B}.',
    weave: 'Sweetness depends on motion no one sees.',
    note: 'Apiary override follows the live schedule reshuffle and replaces carry-the-hour/box-becomes-city copy.',
  },
  '2027-07-30': {
    domain: 'printshop',
    title: 'The Street Can Read',
    leadTemplate: 'At the shop table, {A} keep the first quiet while {B} change the rhythm.',
    weave: 'Language becomes an object people can carry.',
    note: 'Printshop override follows the live schedule and removes printshop-press/press repetition.',
  },
  '2027-07-29': {
    domain: 'airport',
    title: 'Named Distance',
    leadTemplate: 'The departure hall keeps {A} close while {B} draw the moment inward.',
    weave: 'A crowd becomes travel when distance gets named.',
    note: 'Airport override follows the live schedule and removes terminal-window/window repetition.',
  },
  '2027-08-21': {
    domain: 'firehouse',
    title: 'The Room On Call',
    leadTemplate: 'The firehouse bay keeps {A} close while the crew learns to {B}.',
    weave: 'The bay learns urgency before the door opens.',
    note: 'Firehouse override replaces sitting-toward phrasing and resolves the repeated alarm payoff.',
  },
  '2027-08-13': {
    domain: 'campsite',
    title: 'Embers In The Ring',
    leadTemplate: 'At the fire ring, {A} sit close while {B} keep the night human.',
    note: 'Campsite override removes make-the-dark-gentler phrasing and keeps the warmth concrete.',
  },
  '2027-08-22': {
    domain: 'dancehall',
    title: 'Light On The Wall',
    leadTemplate: 'The dancehall floor starts with {A} before {B} bring the room to time.',
    note: 'Dancehall override removes ordinary-weight staging and lets rhythm organize the room.',
  },
  '2027-10-09': {
    domain: 'airport',
    title: 'Distance On Schedule',
    leadTemplate: 'The departure hall keeps {A} close while {B} move toward the gate.',
    weave: 'A schedule gives distance a public shape.',
    note: 'Airport override follows the live schedule and removes terminal-window/window repetition.',
  },
  '2027-10-11': {
    domain: 'tailor',
    title: 'Against The Mirror',
    leadTemplate: 'At the fitting mirror, hands check the {A1}, {A2}, and {A3} before they {B1}, {B2}, and {B3}.',
    weave: 'A body gives the garment its answer.',
    note: 'Tailor override removes raise-the-questions phrasing and makes the fitting verbs belong to hands in the mirror.',
  },
  '2027-10-15': {
    domain: 'apiary',
    title: 'The Box Wakes Up',
    leadTemplate: 'At the apiary path, {A} sit near the boxes while bees {B}.',
    weave: 'Care keeps the sweetness alive.',
    note: 'Apiary override follows the current schedule and removes hive-near-hive repetition.',
  },
  '2027-10-23': {
    domain: 'printshop',
    title: 'Public Weight',
    leadTemplate: 'At the press, {A} wait while the shop can {B}.',
    weave: 'Ink gives a message public weight.',
    note: 'Printshop override gives number/fold/collate an explicit shop subject and tightens the public-message payoff.',
  },
  '2027-09-09': {
    domain: 'apothecary',
    title: 'Old Shelf Light',
    leadTemplate: 'Careful hands choose {A1}, {A2}, and {A3} before they {B1}, {B2}, and {B3}.',
    weave: 'Trust is measured before it is swallowed.',
    note: 'Apothecary override replaces the generic Window Glow title and makes the shelf-to-dose relationship concrete without spoiling the threads.',
  },
  '2027-09-12': {
    domain: 'lighthouse',
    title: 'Trouble Below',
    leadTemplate: 'High above the water, {A1}, {A2}, and {A3} face the dark while the warning can {B1} off water, {B2} the rocks, and {B3} toward trouble.',
    weave: 'Fear gets a bearing when the coast lights up.',
    note: 'Lighthouse override replaces read-the-water abstraction, removes repeated beam wording, and gives flash, outline, and beam separate warning grammar.',
  },
  '2027-09-17': {
    domain: 'observatory',
    title: 'Dark Worth Waiting For',
    leadTemplate: 'At the observatory, {A} stand ready for {B} overhead.',
    weave: 'The night rewards the people who wait.',
    note: 'Observatory override replaces ready-while syntax with a simpler instrument/sky sentence.',
  },
  '2027-09-23': {
    domain: 'pottery',
    title: 'Early Signal',
    leadTemplate: 'Hands at the worktable bring {B1}, {B2}, and {B3} to {A1}, {A2}, and {A3}.',
    weave: 'A shaped thing remembers the hand.',
    note: 'Pottery override removes pottery-wheel/wheel repetition and keeps the clay work tactile.',
  },
  '2027-09-30': {
    domain: 'printshop',
    title: 'Morning Impression',
    leadTemplate: 'At the shop table, {A} stay at the center while {B} move around them.',
    weave: 'Language gets heavier when it leaves the hand.',
    note: 'Printshop override follows the live schedule and removes printshop-press/press repetition.',
  },
  '2027-06-29': {
    domain: 'lighthouse',
    title: 'Glass For The Fog',
    leadTemplate: 'At the lighthouse stair, {A} face the water while the light can {B}.',
    weave: 'The warning climbs so the water can read it.',
    note: 'Lighthouse override replaces make-the-next-move phrasing with a light-and-water relation.',
  },
  '2027-07-16': {
    domain: 'dancehall',
    title: 'After The First Song',
    leadTemplate: 'At the dancehall, {A} wait until dancers {B}.',
    weave: 'Music turns bodies into a room.',
    note: 'Dancehall override replaces make-the-turn phrasing with a dancer subject.',
  },
  '2027-06-28': {
    domain: 'lighthouse',
    title: 'Care Above Water',
    leadTemplate: 'At the lighthouse stair, {A} face the water while the light can {B}.',
    weave: 'Height becomes care when water needs help.',
    note: 'Lighthouse override replaces bring-the-room-alive phrasing with a light-and-water relation.',
  },
  '2026-07-03': {
    domain: 'gallery',
    title: 'The Wall Holds Still',
    leadTemplate: 'The frame holds {A} while visitors are {B}.',
    weave: 'A frame can slow the whole afternoon.',
    note: 'Gallery override removes long-enough-for syntax and makes the visitor actions read as human behavior.',
  },
  '2026-07-25': {
    domain: 'workshop',
    title: 'The Break Has A Name',
    leadTemplate: 'On the bench, the {A1} works at the {B3}, the {A2} sets the {B2}, and the {A3} cuts around the {B1}.',
    weave: 'A named repair brings the right tool forward.',
    note: 'Workshop override removes show-where-the-fix-begins and wait-beside phrasing from a tools/repair-clues row.',
  },
  '2026-11-15': {
    domain: 'porch',
    title: 'The House Looks Out',
    leadTemplate: 'Near the door, {A} are the quiet part, and {B} gather at the step.',
    weave: 'A threshold warms when someone is expected.',
    note: 'Porch override replaces wait-as syntax with a quieter door/street contrast.',
  },
  '2027-01-16': {
    domain: 'workshop',
    title: 'Lamp On The Problem',
    leadTemplate: 'The bench lamp falls on {A} and the {B} they can answer.',
    weave: 'Damage knows which hand to call.',
    note: 'Workshop override retires another wait-beside bench row and gives the damage/tool connection a sharper voice.',
  },
  '2027-04-14': {
    domain: 'porch',
    title: 'Small Welcome',
    leadTemplate: 'Near the door, {A} are the quiet part, and {B} gather at the step.',
    weave: 'The block gets softer at the door.',
    note: 'Porch override replaces wait-as syntax while keeping the doorstep welcome payoff.',
  },
  '2027-04-26': {
    domain: 'workshop',
    title: 'Solved Hinge',
    leadTemplate: 'On the bench, {A} face {B}.',
    weave: 'The problem turns hardware into intention.',
    note: 'Workshop override removes show-where-the-fix-begins and wait-beside phrasing from the hinge row.',
  },
  '2027-07-09': {
    domain: 'tailor',
    title: 'The Fit Gets Closer',
    leadTemplate: 'At the mirror, the tailor checks {A} before deciding how to {B}.',
    weave: 'A fit gets personal one correction at a time.',
    note: 'Tailor override follows the live schedule and retires sit-beside-notes phrasing.',
  },
  '2027-07-04': {
    domain: 'pottery',
    title: 'Pressure At The Wheel',
    leadTemplate: 'At the clay table, {A} come first before {B} change the surface.',
    note: 'Pottery override removes make-sense-through staging and keeps the pressure/heat arc.',
  },
  '2027-07-18': {
    domain: 'newsroom',
    title: 'Record Ready',
    leadTemplate: 'At the newsroom desk, {A} stay under the lamp while reporters {B}.',
    note: 'Newsroom override removes inside-the-story staging and gives the press moves a human subject.',
  },
  '2027-07-20': {
    domain: 'newsroom',
    title: 'Before Print',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} wait while reporters {B1}, {B2}, and {B3}.',
    weave: 'The public line gets quieter before it gets true.',
    note: 'Newsroom override follows the live schedule and replaces change-the-room phrasing with reporter work.',
  },
  'threadline-2027-07-20-chessboard': {
    domain: 'chessboard',
    title: 'The Square Turns Dangerous',
    leadTemplate: 'At the chessboard, {A1}, {A2}, and {A3} sit quietly until {B1}, {B2}, and {B3} make the next move dangerous.',
    weave: 'The quiet square is loudest before anyone moves.',
    note: 'Chessboard puzzle-id override retires hold-the-quiet and sharpen-the-next-move phrasing for the current scheduled row.',
  },
  '2027-07-22': {
    domain: 'chessboard',
    title: 'The Square Turns Dangerous',
    leadTemplate: 'At the chessboard, {A} sit in view while {B} crowd the next move.',
    note: 'Chessboard override removes ordinary-weight staging and keeps the pressure on the move.',
  },
  '2027-07-24': {
    domain: 'chessboard',
    title: 'Black And White',
    leadTemplate: 'On the chessboard, {A1}, {A2}, and {A3} sit in silence until a player chooses to {B1}, {B2}, and {B3}.',
    weave: 'A quiet game can still raise the pulse.',
    note: 'Chessboard override replaces hold-the-quiet-before phrasing and gives skewer, fork, and threat one natural player-facing grammar.',
  },
  '2027-08-17': {
    domain: 'airport',
    title: 'Sky Still Ahead',
    leadTemplate: 'At the terminal window, {A} face a board asking travelers to {B}.',
    weave: 'Distance feels real once it has a gate.',
    note: 'Airport override replaces screens-say phrasing with a more human board/traveler sentence.',
  },
  '2027-09-11': {
    domain: 'printshop',
    title: 'Public Ink',
    leadTemplate: 'At the press, {A} wait while the shop can {B}.',
    weave: 'Ink turns words into something the street can hold.',
    note: 'Printshop override follows the current schedule and replaces make-the-turn phrasing.',
  },
  '2027-09-29': {
    domain: 'apothecary',
    title: 'Dose In The Lamplight',
    leadTemplate: 'On the old shelf, {A} sit under the lamp as careful hands {B}.',
    weave: 'Medicine is patience you can measure.',
    note: 'Apothecary override replaces bright-part/quieter-corner semicolon rhythm, resolves title reuse, and removes told-to utility grammar.',
  },
  '2027-12-06': {
    domain: 'porch',
    title: 'Expected At The Step',
    leadTemplate: 'At the front walk, {A} hold the house steady as {B} come to the step.',
    weave: 'Someone expected can light the whole step.',
    note: 'Porch override replaces wait-as syntax, resolves title reuse, and breaks the repeated quiet-part doorstep rhythm on a late row.',
  },
  '2027-12-11': {
    domain: 'porch',
    title: 'Welcome At The Step',
    leadTemplate: 'At the front edge, {A} face the street, and {B} turn toward the house.',
    weave: 'Light at the door turns passing into visiting.',
    note: 'Porch override replaces wait-as syntax with a street-to-house movement.',
  },
  '2027-09-20': {
    domain: 'newsroom',
    leadTemplate: 'On the newsroom desk, {A} stay close as {B} keep the record honest.',
    weave: 'Checking is how doubt reaches daylight.',
    note: 'Newsroom override removes useful-doubt and story-in-story phrasing from the copy-before-dawn row.',
  },
  '2027-12-08': {
    domain: 'shore',
    leadTemplate: 'After the tide, {A} mark the sand while {B} pull at the edge.',
    weave: 'Every tide edits the evidence.',
    note: 'Shore override removes the low-water memory formula, breaks the repeated wet-sand rhythm, and keeps the tide logic precise.',
  },
  '2026-09-22': {
    domain: 'rooftop',
    title: 'The City Below Softens',
    leadTemplate: 'Above the street, {A} stay in the last light as {B} gather.',
    weave: 'From the roof, the street forgets to be loud.',
    note: 'Rooftop override retires hold-the-view phrasing with a clearer height/noise payoff.',
  },
  '2026-10-25': {
    domain: 'desk',
    title: 'The Ready Page',
    leadTemplate: 'On the desk, {A} surround the first page: {B}.',
    weave: 'The room gets quieter before the work begins.',
    note: 'Desk override retires first-notes-say phrasing from the ready-page row.',
  },
  '2027-02-11': {
    domain: 'paper-hearts',
    title: 'Ribbon Thought',
    leadTemplate: 'At the craft table, {A} turn into a small message as hands {B}.',
    weave: 'The hand makes the gesture personal.',
    note: 'Craft override retires fill-the-back-of-the-scene phrasing.',
  },
  '2027-02-12': {
    domain: 'school',
    title: 'Lesson About To Start',
    leadTemplate: 'The desks have {A} before {B} pull the room together.',
    weave: 'A classroom starts when attention arrives.',
    note: 'School override retires ready-for-a-morning phrasing.',
  },
  '2027-05-07': {
    domain: 'pottery',
    title: 'Wheel Memory',
    leadTemplate: 'On the shelf, {A} keep the trace of hands that {B}.',
    weave: 'The kiln keeps what the hand taught.',
    note: 'Pottery override retires show-what-clay-can-become phrasing.',
  },
  '2027-06-03': {
    domain: 'firehouse',
    title: 'Quiet Urgency',
    leadTemplate: 'Before the bell, {A} wait while the crew practices {B}.',
    weave: 'The room practices so help can hurry.',
    note: 'Firehouse override retires fill-the-back-of-the-scene and drills-to phrasing.',
  },
  '2027-06-04': {
    domain: 'radio-booth',
    title: 'Red Light Ready',
    leadTemplate: 'Behind the glass, {A} sit ready for {B}.',
    weave: 'A small room can sound far away.',
    note: 'Radio override retires carry-the-hour phrasing.',
  },
  '2027-06-09': {
    domain: 'lighthouse',
    title: 'The Bright Stair',
    leadTemplate: 'On the stair, {A} wait for a light that can {B}.',
    weave: 'A far light turns danger into direction.',
    note: 'Lighthouse override retires enter-the-day phrasing.',
  },
  '2027-06-19': {
    domain: 'firehouse',
    title: 'Polished Urgency',
    leadTemplate: 'In the bay, {A} stay polished as the crew practices {B}.',
    weave: 'Readiness becomes help when the alarm speaks.',
    note: 'Firehouse override follows the live schedule and breaks the repeated call-asks lead.',
  },
  '2027-06-23': {
    domain: 'firehouse',
    title: 'The Roll Begins',
    leadTemplate: 'Before the bell, {A} wait while the crew practices {B}.',
    weave: 'Practice gives courage somewhere to go.',
    note: 'Firehouse override retires add-the-next-turn and drills-to phrasing.',
  },
  '2027-06-24': {
    domain: 'radio-booth',
    title: 'The Little Red Glow',
    leadTemplate: 'The red light finds {A} before {B} shape the hour.',
    weave: 'A far room can have company.',
    note: 'Radio override retires signal-leaves-with phrasing.',
  },
  '2027-07-10': {
    domain: 'firehouse',
    title: 'Red Room Waiting',
    leadTemplate: 'Before the bell, {A} sit through drills while the crew learns to {B}.',
    weave: 'Practice is why help can hurry.',
    note: 'Firehouse override follows the current schedule and replaces drill-for-action nouning with a crew-centered sentence.',
  },
  '2027-07-19': {
    domain: 'aquarium',
    title: 'Blue Behind Glass',
    leadTemplate: 'Behind the glass, {A} share a small world of {B}.',
    weave: 'The tank keeps its own weather.',
    note: 'Aquarium override replaces shift-the-scene phrasing with a glass-and-water sentence that treats stream/ripple/drift as cues.',
  },
  '2027-07-23': {
    domain: 'chessboard',
    title: 'One Move Quietly',
    leadTemplate: 'On the board, {A} sit one move from {B}.',
    weave: 'A small threat changes the whole room.',
    note: 'Chessboard override retires fill-the-back-of-the-scene phrasing.',
  },
  '2027-07-27': {
    domain: 'airport',
    title: 'Altitude Still Ahead',
    leadTemplate: 'The terminal board holds {A} beside {B}.',
    weave: 'Distance gets official at the gate.',
    note: 'Airport override follows the current schedule and replaces bring-the-room-alive phrasing.',
  },
  '2027-07-31': {
    domain: 'firehouse',
    title: 'On Call',
    leadTemplate: 'In the bay, {A} are there for {B}.',
    weave: 'The door can open fast because the bay is ready.',
    note: 'Firehouse override retires add-the-next-turn phrasing.',
  },
  '2027-08-04': {
    domain: 'lighthouse',
    title: 'Dusk On The Stair',
    leadTemplate: 'On the stair, {A} stay close to a light that can {B}.',
    weave: 'A warning matters most before arrival.',
    note: 'Lighthouse override retires enter-the-day phrasing.',
  },
  '2027-08-14': {
    domain: 'apiary',
    title: 'Hive Learns Sweetness',
    leadTemplate: 'At the apiary path, {A} come first while bees {B} along the flight path.',
    weave: 'The hive learns sweetness by moving together.',
    note: 'Apiary override follows the live schedule, removes gather/gather repetition, and resolves the duplicate title.',
  },
  '2027-08-20': {
    domain: 'firehouse',
    title: 'Room On Call',
    leadTemplate: 'In the bay, {A} sit through drills to {B}.',
    weave: 'Stillness is part of getting there fast.',
    note: 'Firehouse override retires give-the-scene-another-pulse phrasing.',
  },
  '2027-09-04': {
    domain: 'pottery',
    title: 'Plain Light',
    leadTemplate: 'At the worktable, {A1}, {A2}, and {A3} change as hands use {B1}, {B2}, and {B3}.',
    weave: 'The hand leaves a memory the kiln can keep.',
    note: 'Pottery override replaces the duplicated heat-touch payoff and keeps the worktable sentence human and tactile.',
  },
  '2027-09-10': {
    domain: 'firehouse',
    title: 'Bay Before Alarm',
    leadTemplate: 'Before the bell, {A} wait while the crew practices {B}.',
    weave: 'The bay practices so help can hurry.',
    note: 'Firehouse override retires alarm-gives-readiness phrasing.',
  },
  '2027-10-07': {
    domain: 'pottery',
    title: 'Soft Form',
    leadTemplate: 'At the clay table, {A} stay close while {B} gather near the kiln.',
    weave: 'Heat lets the hand stay visible.',
    note: 'Pottery override follows the live schedule and removes keeps-close-with/sitting-near phrasing.',
  },
  '2027-10-08': {
    domain: 'airport',
    title: 'Altitude Waiting',
    leadTemplate: 'The departure hall keeps {A} in view while {B} change the weight of leaving.',
    weave: 'The room exists to make leaving orderly.',
    note: 'Airport override follows the live schedule and removes terminal-window/window repetition.',
  },
  '2027-10-16': {
    domain: 'airport',
    title: 'Public Leaving',
    leadTemplate: 'The departure hall shows {A} while {B} work toward the gate.',
    weave: 'The gate gives leaving a public rhythm.',
    note: 'Airport override follows the live schedule, resolves title reuse, and removes terminal-window/window repetition.',
  },
  '2027-11-08': {
    domain: 'apothecary',
    title: 'Bottle Light',
    leadTemplate: 'On the shelf, {A} wait for hands to {B}.',
    weave: 'A remedy begins before the dose.',
    note: 'Apothecary override retires carry-the-hour phrasing.',
  },
  '2027-11-11': {
    domain: 'aquarium',
    title: 'Small Current',
    leadTemplate: 'Behind the glass, {A} move through water busy with {B}.',
    weave: 'Small water makes quiet life visible.',
    note: 'Aquarium override follows the current schedule and gives feeding/darting/wafting a water-level sentence.',
  },
  '2027-06-26': {
    domain: 'lighthouse',
    title: 'Coast Can Read',
    leadTemplate: 'On the stair, {A} wait for light to {B}.',
    weave: 'A working light gives danger an edge.',
    note: 'Lighthouse override retires enter-the-day phrasing and avoids duplicate title/payoff reuse.',
  },
  '2027-07-17': {
    domain: 'aquarium',
    title: 'A Room In Blue',
    leadTemplate: 'Behind the glass, {A} drift with water that can {B}.',
    weave: 'Blue quiet is never still for long.',
    note: 'Aquarium override retires enter-the-day phrasing.',
  },
  '2027-08-16': {
    domain: 'apiary',
    title: 'Work Around The Box',
    leadTemplate: 'Near the hive, {A1}, {A2}, and {A3} share the path with bees that {B1}, {B2}, and {B3}.',
    weave: 'The box gets a body when work starts humming.',
    note: 'Apiary override retires make-sense-once phrasing and resolves the repeated box title.',
  },
  '2027-08-19': {
    domain: 'airport',
    title: 'Gate Before Distance',
    leadTemplate: 'At the terminal window, {A} face a boarding line that will {B}.',
    weave: 'Departure turns the room toward distance.',
    note: 'Airport override retires fill-the-back-of-the-scene phrasing.',
  },
  '2027-09-06': {
    domain: 'airport',
    title: 'Long Room',
    leadTemplate: 'In the long room, {A} stay close while {B} open out toward the gate.',
    weave: 'Distance becomes official before it becomes sky.',
    note: 'Airport override follows the live schedule and removes terminal-window/terminal repetition.',
  },
  '2027-09-16': {
    domain: 'lighthouse',
    title: 'Glass In The Dark',
    leadTemplate: 'At the lighthouse stair, {A} send {B} across the coast.',
    weave: 'Care can arrive as light.',
    note: 'Lighthouse override retires distance-becomes-care phrasing and resolves the title duplicate.',
  },
  '2027-10-20': {
    domain: 'radio-booth',
    title: 'The Red Lamp',
    leadTemplate: 'The red light finds {A} before {B} shape the hour.',
    weave: 'Air lets the room cross itself.',
    note: 'Radio override retires signal-leaves-with phrasing.',
  },
  '2027-10-21': {
    domain: 'firehouse',
    title: 'Urgency At Rest',
    leadTemplate: 'In the bay, {A} wait while the crew practices {B}.',
    weave: 'A quiet bay can already be moving.',
    note: 'Firehouse override follows the current schedule and gives response steps a crew subject.',
  },
  '2027-10-22': {
    domain: 'radio-booth',
    title: 'Little Lit Room',
    leadTemplate: 'Behind the glass, {A} wait while the producer works through {B}.',
    weave: 'A far voice starts in a small lit room.',
    note: 'Radio override retires carry-the-hour and shape-an-hour phrasing.',
  },
  '2027-10-26': {
    domain: 'lighthouse',
    title: 'Water Below The Light',
    leadTemplate: 'On the stair, {A} face a light that can {B}.',
    weave: 'The water reads the light before the shore does.',
    note: 'Lighthouse override resolves duplicate title and keeps the water/light payoff.',
  },
  '2027-11-04': {
    domain: 'firehouse',
    title: 'Public Courage',
    leadTemplate: 'Before the alarm, {A} stay in the bay as the crew practices {B}.',
    weave: 'Courage leaves the bay as practiced motion.',
    note: 'Firehouse override follows the live schedule, breaks the repeated call-asks lead, and gives the payoff a unique image.',
  },
  '2027-11-03': {
    domain: 'airport',
    title: 'The Room Before Leaving',
    leadTemplate: 'At the board, {A1}, {A2}, and {A3} make leaving visible while travelers {B1}, {B2}, and {B3}.',
    weave: 'The gate gives leaving a public shape.',
    note: 'Airport override retires terminal-window and board-asking phrasing while keeping the gate as the public shape of departure.',
  },
  '2027-09-19': {
    domain: 'aquarium',
    title: 'Blue Light Moving',
    leadTemplate: 'Behind the glass, {A} drift through water that can {B}.',
    weave: 'Blue light makes quiet life visible.',
    note: 'Aquarium override retires give-the-scene-another-pulse phrasing.',
  },
  'threadline-2027-07-21-airport': {
    domain: 'airport',
    title: 'Distance On Schedule',
    leadTemplate: 'At the gate, {A1}, {A2}, and {A3} sit under the board while planes {B1}, flights {B2}, and travelers {B3}.',
    weave: 'The board turns distance into an appointment.',
    note: 'Airport puzzle-id override removes terminal-window/window repetition and gives carry, descend, and announce concrete subjects.',
  },
  'threadline-2027-09-10-lighthouse': {
    domain: 'lighthouse',
    title: 'Glass Against Dark',
    leadTemplate: 'High above the water, {A1}, {A2}, and {A3} face the dark while the light can {B1}, {B2}, and {B3}.',
    weave: 'The coast understands the dark by looking up.',
    note: 'Lighthouse puzzle-id override removes lighthouse-stair/stair and tower/tower repetition, resolves title reuse, and gives coast cues one beam subject.',
  },
  'threadline-2027-09-27-airport': {
    domain: 'airport',
    title: 'Line For The Sky',
    leadTemplate: 'At the gate, {A1}, {A2}, and {A3} sit under the board while travelers {B1}, planes {B2}, and agents {B3}.',
    weave: 'At the gate, a far place becomes orderly.',
    note: 'Airport puzzle-id override removes terminal-window/window repetition, resolves the title reuse, and gives carry, descend, and scan concrete subjects.',
  },
  'threadline-2027-11-04-airport': {
    domain: 'airport',
    title: 'Orderly Leaving',
    leadTemplate: 'At the gate, {A1}, {A2}, and {A3} collect under the board while travelers {B1}, flights {B2}, and passengers {B3}.',
    weave: 'Leaving feels orderly once everyone knows the gate.',
    note: 'Airport puzzle-id override removes terminal-window/terminal repetition and makes stow, taxi, and wait belong to distinct airport actors.',
  },
  'threadline-2027-05-11-airport': {
    domain: 'airport',
    title: 'Gate Light',
    leadTemplate: 'Under the departure board, {A1}, {A2}, and {A3} make the trip visible while planes {B1}, speakers {B2}, and travelers {B3}.',
    weave: 'A gate is a small room pointed at distance.',
    note: 'Airport puzzle-id override retires terminal-window scaffolding and gives descend, announce, and carry concrete subjects.',
  },
  'threadline-2027-05-26-airport': {
    domain: 'airport',
    title: 'Altitude Waiting',
    leadTemplate: '{A1}, {A2}, and {A3} pass under the board while agents {B1}, travelers {B2}, and planes {B3}.',
    weave: 'Order begins before the sky does.',
    note: 'Airport puzzle-id override removes terminal-window repetition and lets scan, connect, and ascend belong to airport actors.',
  },
  'threadline-2027-05-27-airport': {
    domain: 'airport',
    title: 'Gate Before Distance',
    leadTemplate: 'Near the gate, {A1}, {A2}, and {A3} point outward while travelers {B1}, planes {B2}, and passengers {B3}.',
    weave: 'Departure turns a room toward distance.',
    note: 'Airport puzzle-id override retires close-enough and terminal-window phrasing while keeping the gate-to-distance aha.',
  },
  'threadline-2027-09-01-airport': {
    domain: 'airport',
    title: 'Room Ready To Leave',
    leadTemplate: 'At the board, {A1}, the {A2}, and the {A3} share a time while passengers {B1}, lines {B2}, and planes {B3}.',
    weave: 'A departure board makes distance behave.',
    note: 'Airport puzzle-id override removes terminal-window/terminal repetition and replaces put-back-to-use with a board-and-time reveal.',
  },
  'threadline-2027-10-01-laboratory': {
    domain: 'laboratory',
    title: 'Question Under Glass',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} sit beside directions to {B1}, {B2}, and {B3}.',
    weave: 'Proof arrives by small exact steps.',
    note: 'Laboratory puzzle-id override retires careful-test and notes-turn-toward scaffolding with a direct bench-instructions sentence.',
  },
  'threadline-2027-10-23-laboratory': {
    domain: 'laboratory',
    title: 'Proof Takes Shape',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} sit beside directions to {B1}, {B2}, and {B3}.',
    weave: 'Proof is patience made visible.',
    note: 'Laboratory puzzle-id override removes test/test repetition and replaces careful-test scaffolding with exact bench directions.',
  },
  'threadline-2027-07-26-pottery': {
    domain: 'pottery',
    title: 'Pressure At The Wheel',
    leadTemplate: 'At the clay table, hands {B1} the {A1}, {B2} the {A2}, and steady the {A3} with a {B3}.',
    weave: 'A vessel remembers pressure after heat.',
    note: 'Pottery puzzle-id override gives each hand motion a direct clay object instead of a bare verb list.',
  },
  'threadline-2027-07-12-aquarium': {
    domain: 'aquarium',
    title: 'The Living Wall',
    leadTemplate: 'Behind the glass, {A1}, {A2}, and {A3} sit in water busy with {B1}, {B2}, and {B3}.',
    weave: 'A tank lives by moving quietly.',
    note: 'Aquarium puzzle-id override removes make-clear-beginning/add-weight scaffolding and makes the tank feel alive at water level.',
  },
  'threadline-2027-07-22-newsroom': {
    domain: 'newsroom',
    title: 'Desk Under Deadline',
    leadTemplate: 'At the newsroom desk, the {A1}, {A2}, and {A3} change all night while the staff {B1}, {B2}, and {B3} before dawn.',
    weave: 'A messy room can still protect the facts.',
    note: 'Newsroom puzzle-id override removes make-clear-beginning/add-weight scaffolding and puts the trust work on reporters.',
  },
  'threadline-2027-07-12-dancehall': {
    domain: 'dancehall',
    title: 'Saturday Light',
    leadTemplate: 'In the dancehall, {A1}, {A2}, and {A3} catch the light while dancers {B1}, {B2}, and {B3}.',
    weave: 'Rhythm gives the room its feet.',
    note: 'Dancehall puzzle-id override removes dancehall-floor/floor repetition and lets the dance steps take a human subject.',
  },
  'threadline-2027-07-17-lighthouse': {
    domain: 'lighthouse',
    title: 'Signal At Dusk',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the quiet before the light can {B1}, {B2}, and {B3}.',
    weave: 'A warning matters most before arrival.',
    note: 'Lighthouse puzzle-id override removes lighthouse-stair/stair repetition and gives the coast cues one light subject.',
  },
  'threadline-2027-08-05-laboratory': {
    domain: 'laboratory',
    title: 'Measured Wonder',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} sit beside directions to {B1}, {B2}, and {B3}.',
    weave: 'Evidence is wonder that stayed careful.',
    note: 'Laboratory puzzle-id override removes test/note repetition and keeps the bench-to-procedure sentence direct.',
  },
  'threadline-2027-09-15-newsroom': {
    domain: 'newsroom',
    title: 'Noise Becomes Copy',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} sit under the lamp while reporters {B1}, {B2}, and {B3} each line.',
    weave: 'Facts get steadier before they get public.',
    note: 'Newsroom puzzle-id override removes story/story repetition, resolves payoff reuse, and gives record, rewrite, and question a reporter subject.',
  },
  'threadline-2027-10-01-lighthouse': {
    domain: 'lighthouse',
    title: 'The Far Warning',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the quiet while the light can {B1}, {B2}, and {B3}.',
    weave: 'A light is useful only when danger is near.',
    note: 'Lighthouse puzzle-id override removes lighthouse-stair/stair repetition and replaces move-the-hour phrasing with a beam sentence.',
  },
  'threadline-2027-10-03-printshop': {
    domain: 'printshop',
    title: 'Words With Weight',
    leadTemplate: 'At the printshop, {A1}, {A2}, and {A3} wait under the lamp while the shop can {B1}, {B2}, and {B3}.',
    weave: 'Printing gives words a body in public.',
    note: 'Printshop puzzle-id override removes printshop-press/press repetition and gives press moves a shop subject.',
  },
  'threadline-2027-10-18-planetarium': {
    domain: 'planetarium',
    title: 'Seats Under Saturn',
    leadTemplate: 'In the dark room, {A1}, {A2}, and {A3} float overhead while {B1}, {B2}, and {B3} shift the ceiling.',
    weave: 'The sky comes indoors for one impossible hour.',
    note: 'Planetarium puzzle-id override removes dome-on-dome wording after the template cleanup reshuffle.',
  },
  'threadline-2027-11-02-campsite': {
    domain: 'campsite',
    title: 'The Kept Fire',
    leadTemplate: 'Near the ring, {A1}, {A2}, and {A3} gather as {B1}, {B2}, and {B3} make the fire last.',
    weave: 'A little order makes the night kinder.',
    note: 'Campsite puzzle-id override replaces keep-the-fire-tended scaffolding with a smaller fire-ring sentence.',
  },
  'threadline-2027-11-10-lighthouse': {
    domain: 'lighthouse',
    title: 'Against Guesswork',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} face the water while the light can {B1}, {B2}, and {B3}.',
    weave: 'A far light keeps fear from becoming guesswork.',
    note: 'Lighthouse puzzle-id override resolves the Warning Lifted title reuse and gives glisten, reflect, and search one clear light subject.',
  },
  'threadline-2027-08-07-lighthouse': {
    domain: 'lighthouse',
    title: 'High Warning',
    leadTemplate: 'Above the water, {A1}, {A2}, and {A3} face the dark while the light can {B1}, {B2}, and {B3}.',
    weave: 'A light makes danger readable.',
    note: 'Lighthouse puzzle-id override removes tower-on-tower repetition and resolves short-window title/payoff reuse.',
  },
  'threadline-2027-10-05-planetarium': {
    domain: 'planetarium',
    title: 'Room Above The Seats',
    leadTemplate: 'The dome shows {A1}, {A2}, and {A3} as the dark room follows {B1}, {B2}, and {B3}.',
    weave: 'The ceiling lets the room borrow night.',
    note: 'Planetarium puzzle-id override resolves borrowed-night title reuse while keeping the ceiling/night aha.',
  },
  'threadline-2027-10-07-lighthouse': {
    domain: 'lighthouse',
    title: 'Height For The Water',
    leadTemplate: 'Inside the tower, the {A1} checks the {A2} and {A3} before the light can {B1}, {B2}, and {B3}.',
    weave: 'A useful height turns danger toward home.',
    note: 'Lighthouse puzzle-id override removes lighthouse-stair/stair repetition, breaks the repeated tower-facing lead, resolves payoff reuse, and keeps the height-to-warning relationship direct.',
  },
  'threadline-2027-10-08-observatory': {
    domain: 'observatory',
    title: 'Far Light Indoors',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} aim toward {B1}, {B2}, and {B3} overhead.',
    weave: 'The night rewards the people who wait.',
    note: 'Observatory puzzle-id override removes observatory-dome/dome repetition while keeping the lens-to-sky relationship clear.',
  },
  'threadline-2027-11-08-dancehall': {
    domain: 'dancehall',
    title: 'The Night Opens',
    leadTemplate: 'In the dancehall, {A1}, {A2}, and {A3} catch the light while dancers {B1}, {B2}, and {B3}.',
    weave: 'A dance begins when the room agrees.',
    note: 'Dancehall puzzle-id override removes floor and count repetition while keeping the room-to-dance aha concise.',
  },
  'threadline-2027-11-05-weather-station': {
    domain: 'weather-station',
    title: 'Sky Under Watch',
    leadTemplate: 'At the weather station, {A1}, {A2}, and {A3} read the air while {B1}, {B2}, and {B3} pressure change the forecast.',
    weave: 'Instruments take the mystery out of weather.',
    note: 'Weather-station puzzle-id override resolves title reuse and gives report, shift, and falling a readable forecast sentence without borrowing the thread clue.',
  },
  'threadline-2027-06-26-observatory': {
    domain: 'observatory',
    title: 'Dome Dark',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} make {B1}, {B2}, and {B3} overhead easier to follow.',
    weave: 'A patient instrument makes the sky feel near.',
    note: 'Observatory puzzle-id override retires tuned-for gerund phrasing and lets the instrument make sky motion easier to follow.',
  },
  'threadline-2027-08-28-observatory': {
    domain: 'observatory',
    title: 'Quiet Above The Roof',
    leadTemplate: 'At the instrument table, {A1}, {A2}, and {A3} steady the view while {B1}, {B2}, and {B3} mark the night overhead.',
    weave: 'A small table brings the far sky near.',
    note: 'Observatory puzzle-id override retires help-a-watcher-follow and night-gerund phrasing with a more direct instrument/sky sentence.',
  },
  'threadline-2027-09-22-vineyard': {
    domain: 'vineyard',
    title: 'A Year In Rows',
    leadTemplate: 'At the vineyard, the {A1} starts the row, the {A2} rests in the shed, and the {A3} keeps the year while grapes {B1}, growers {B2}, and visitors {B3}.',
    weave: 'The row saves a year for the glass.',
    note: 'Vineyard puzzle-id override removes begin-with-fruit, promise-the-cellar, quiet-part, and carry-rest scaffolding and keeps tasting, barrel, and valley in a believable row-to-cellar sentence.',
  },
  'threadline-2027-09-02-pottery': {
    domain: 'pottery',
    title: 'Soft Form Turning',
    leadTemplate: 'At the worktable, {A1}, {A2}, and {A3} move through {B1}, {B2}, and {B3}.',
    weave: 'Heat gives the hand something to remember.',
    note: 'Pottery puzzle-id override removes pottery-wheel/wheel repetition, add-motion phrasing, and the duplicated heat-touch payoff.',
  },
  'threadline-2027-10-31-pottery': {
    domain: 'pottery',
    title: 'Handprint After Heat',
    leadTemplate: 'At the worktable, {A1}, {A2}, and {A3} change as hands {B1}, {B2}, and {B3}.',
    weave: 'Heat lets the handprint last.',
    note: 'Pottery puzzle-id override retires the answer-anchored clay-hardens payoff and replaces pottery-wheel framing with a worktable sentence.',
  },
  'threadline-2027-08-05-lighthouse': {
    domain: 'lighthouse',
    title: 'Keeper Near The Beam',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} belong to a beam someone can {B1}, {B2}, and {B3}.',
    weave: 'A working light turns care outward.',
    note: 'Lighthouse puzzle-id override removes lighthouse-stair/stair repetition, resolves the title reuse, and gives the beam a human keeper.',
  },
  'threadline-2027-09-11-lighthouse': {
    domain: 'lighthouse',
    title: 'Far Light In Fog',
    leadTemplate: 'At dusk, the {A1}, {A2}, and {A3} go quiet while the tower begins to {B1}, {B2}, and {B3}.',
    weave: 'A far light is mercy with a long reach.',
    note: 'Lighthouse puzzle-id override retires the nonsensical Fog Takes Answer title and gives the stair details a dusk watch.',
  },
  'threadline-2027-10-23-lighthouse': {
    domain: 'lighthouse',
    title: 'Warning Over The Breakers',
    leadTemplate: 'Inside the tower, {A1} leads to {A2} and {A3} while the light can {B1} a course, {B2} through fog, and {B3} across the coast.',
    weave: 'A restless beam can still be a promise.',
    note: 'Lighthouse puzzle-id override removes stair/stair/stair repetition and gives steady, shimmer, and flicker separate light grammar.',
  },
  'threadline-2027-10-21-dancehall': {
    domain: 'dancehall',
    title: 'Lights Still Warm',
    leadTemplate: 'In the dancehall, {A1}, {A2}, and {A3} catch the light while dancers {B1}, {B2}, and {B3}.',
    weave: 'A shared beat is a room in motion.',
    note: 'Dancehall puzzle-id override removes dancehall-floor/floor repetition and gives follow, listen, and twirl a human subject.',
  },
  'threadline-2027-11-09-weather-station': {
    domain: 'weather-station',
    title: 'Forecast Before Morning',
    leadTemplate: 'At the weather station, {A1}, {A2}, and {A3} keep watch as forecasts {B1}, clouds {B2}, and winds {B3}.',
    weave: 'Instruments hear the forecast before people do.',
    note: 'Weather-station puzzle-id override replaces counted-sky, measured-sky, and measurement-gives-tomorrow payoffs, resolves title reuse, and gives the forecast shifts natural subjects.',
  },
  'threadline-2027-09-01-apiary': {
    domain: 'apiary',
    title: 'Work In The Bloom',
    leadTemplate: 'At the apiary, {A1} gathers near {A2} and {A3} while bees are {B1}, {B2}, and {B3}.',
    weave: 'Sweetness takes work before it tastes simple.',
    note: 'Apiary puzzle-id override resolves Box In The Bloom title reuse and fixes swarm agreement.',
  },
  'threadline-2027-10-05-newsroom': {
    domain: 'newsroom',
    title: 'Before It Gets Loud',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} wait while reporters decide what is {B1}, what to {B2}, and what to {B3}.',
    weave: 'Truth gets careful before it gets loud.',
    note: 'Newsroom puzzle-id override resolves Noise Becomes Copy title reuse and gives factual, publish, and verify separate grammar.',
  },
  '2027-01-18': {
    domain: 'school',
    leadTemplate: 'By the classroom door, {A1}, {A2}, and {A3} mark the morning before {B1}, {B2}, and {B3} give it a schedule.',
    weave: 'The bell makes the room belong to everyone.',
    note: 'School override rejects class-starts and fill-the-room scaffolding and reads the objects and first-hour work as one morning.',
  },
  '2027-02-17': {
    domain: 'trail',
    leadTemplate: 'Past the first marker, {A1}, {A2}, and {A3} keep company with {B1}, {B2}, and {B3}.',
    note: 'Trail override breaks the repeated keep-the-walk-honest structure while preserving signs meeting landscape.',
  },
  '2027-02-23': {
    domain: 'porch',
    leadTemplate: 'At the front walk, {A1}, {A2}, and {A3} frame the door as {B1}, {B2}, and {B3} come up the steps.',
    note: 'Porch override replaces wait-as/gather utility phrasing with a concrete doorstep approach.',
  },
  '2027-03-04': {
    domain: 'library',
    leadTemplate: 'The page has {A1}, {A2}, and {A3}, and the quiet around it leaves space for {B1}, {B2}, and {B3}.',
    weave: 'The quiet is public until a reader claims it.',
    note: 'Library override removes the retired public-room-can-become payoff and keeps the page/quiet aha concise.',
  },
  '2027-03-09': {
    domain: 'school',
    leadTemplate: 'At the first desks, {A1}, {A2}, and {A3} lie open while {B1}, {B2}, and {B3} pull the class into speech.',
    note: 'School override rejects the repeated class-starts scaffold and gives the first-hour words a believable room effect.',
  },
  '2027-04-06': {
    domain: 'mailroom',
    leadTemplate: 'In the back room, {A1}, {A2}, and {A3} land in piles while {B1}, {B2}, and {B3} put addresses in order.',
    note: 'Mailroom override removes route-begins scaffolding and makes the delivery work visible without a generated transition.',
  },
  '2027-04-07': {
    domain: 'theater',
    leadTemplate: 'In the low light, {A1}, {A2}, and {A3} frame the stage as a {B1}, a {B2}, and an {B3} gather in the seats.',
    weave: 'The dark makes attention audible.',
    note: 'Theater override breaks the repeated lights-find/dark-gathers structure and replaces a duplicated applause payoff.',
  },
  '2027-04-08': {
    domain: 'trail',
    leadTemplate: 'On the climb, {A1}, {A2}, and {A3} keep the hiker oriented among {B1}, {B2}, and {B3}.',
    note: 'Trail override lowers the repeated trail-sign structure and gives the sentence a human walker.',
  },
  '2027-04-10': {
    domain: 'rooftop',
    leadTemplate: 'At the roof rail, {A1}, {A2}, and {A3} stay below as the city softens into {B1}, {B2}, and {B3}.',
    note: 'Rooftop override removes the repeated last-light structure and avoids repeating the answer light in the lead.',
  },
  '2027-12-16': {
    domain: 'porch',
    leadTemplate: 'At the winter door, {A1}, {A2}, and {A3} face the street as {B1}, {B2}, and {B3} come closer.',
    note: 'Porch override breaks the house-looks-ready repetition and keeps the invitation at the threshold.',
  },
  'threadline-2027-09-23-tailor': {
    domain: 'tailor',
    title: 'Cloth Learns Shape',
    leadTemplate: 'At the fitting mirror, the tailor checks {A1}, {A2}, and {A3} before deciding how to {B1}, {B2}, and {B3} the cloth.',
    weave: 'The body teaches the garment its shape.',
    note: 'Tailor puzzle-id override avoids repeating tailor in the lead and gives trim, fold, and tailor one fitting subject.',
  },
  'threadline-2027-09-23-apothecary': {
    domain: 'apothecary',
    title: 'Shelf Before Remedy',
    leadTemplate: 'On the apothecary shelf, {A1}, {A2}, and {A3} go into a remedy as careful hands {B1}, {B2}, and {B3}.',
    weave: 'The remedy begins before the dose.',
    note: 'Apothecary puzzle-id override resolves title reuse and turns decoct, warm, and infuse into a single shelf action.',
  },
  'threadline-2027-11-07-weather-station': {
    domain: 'weather-station',
    title: 'Pressure In The Window',
    leadTemplate: 'At the station window, {A1}, {A2}, and {A3} hold steady while the sky can {B1}, {B2}, and {B3} itself.',
    weave: 'The air gives early notice to anyone measuring.',
    note: 'Weather-station puzzle-id override removes reports-report style subjects and gives the sky the change verbs.',
  },
  'threadline-2027-11-11-weather-station': {
    domain: 'weather-station',
    title: 'Kind Light',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch a {B1}, {B2} wind, and a {B3}.',
    weave: 'Instruments give bad weather a little notice.',
    note: 'Weather-station puzzle-id override removes alert/skies/gust filler subjects and keeps the weather concrete.',
  },
  'threadline-2027-11-13-weather-station': {
    domain: 'weather-station',
    title: 'Early Warning Desk',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} stay ready as clouds {B1}, staff {B2}, and roads {B3}.',
    weave: 'The forecast starts with instruments noticing first.',
    note: 'Weather-station puzzle-id override replaces pressure-can-watch grammar with human staff and concrete weather subjects.',
  },
  'threadline-2027-10-22-weather-station': {
    domain: 'weather-station',
    title: 'Weather Before It Lands',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} mark the change as air can {B1}, wind keeps {B2}, and frost can {B3}.',
    weave: 'Instruments give the sky a little warning time.',
    note: 'Weather-station puzzle-id override breaks the station-instruments lead repeat and replaces the reused pressure-to-forecast payoff.',
  },
  'threadline-2027-11-02-weather-station': {
    domain: 'weather-station',
    title: 'Pressure In The Glass',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} hold the change as pressure keeps {B1}, skies {B2}, and frost can {B3}.',
    weave: 'A measured change gives warning time.',
    note: 'Weather-station puzzle-id override breaks the instruments-hold lead repeat and keeps falling, brighten, and freeze in natural weather grammar.',
  },
  'threadline-2027-10-24-weather-station': {
    domain: 'weather-station',
    title: 'Weather Before It Arrives',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch the shift as air can {B1}, alerts {B2}, and wind keeps {B3}.',
    weave: 'Bad weather gets a warning before it arrives.',
    note: 'Weather-station puzzle-id override breaks the instruments-hold lead repeat and replaces the reused instruments/forecast-shifts payoff.',
  },
  'threadline-2027-10-28-observatory': {
    domain: 'observatory',
    title: 'The Slow Dark',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} aim into the dark while {B1}, {B2}, and {B3} mark the sky.',
    weave: 'The sky moves slowly enough to teach patience.',
    note: 'Observatory puzzle-id override removes payoff reuse while keeping the lens-to-sky-motion sentence readable.',
  },
  'threadline-2027-12-15-rooftop': {
    domain: 'rooftop',
    title: 'A Slow Look Down',
    leadTemplate: 'From the rooftop rail, {A1}, {A2}, and {A3} catch dusk while evening settles into {B1}, {B2}, and {B3}.',
    weave: 'The roof keeps the day for one more minute.',
    note: 'Rooftop puzzle-id override removes repeated last-light wording when light is one of the answers.',
  },
  'threadline-2027-12-19-gallery': {
    domain: 'gallery',
    title: 'The Patient Wall',
    leadTemplate: 'At the long wall, {A1}, {A2}, and {A3} hold the room while visitors keep {B1}, {B2}, and {B3}.',
    weave: 'A wall becomes company when people linger.',
    note: 'Gallery puzzle-id override breaks the gallery-light/attention-gathers structure and replaces a reused silence-into-company payoff.',
  },
  'threadline-2027-07-18-newsroom': {
    domain: 'newsroom',
    title: 'Trust Before Daylight',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} stay under the lamp while reporters {B1}, {B2}, and {B3}.',
    weave: 'Trust is built before daylight.',
    note: 'Newsroom puzzle-id override resolves title reuse while preserving the trust-before-publication payoff.',
  },
  'threadline-2027-08-25-weather-station': {
    domain: 'weather-station',
    title: 'Before The Report',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch the change as wind keeps {B1}, pressure keeps {B2}, and clouds {B3}.',
    weave: 'Instruments give the forecast a head start.',
    note: 'Weather-station puzzle-id override replaces station-listens-through phrasing, resolves title reuse, and gives gusting, falling, and deepen natural weather subjects.',
  },
  'threadline-2027-08-26-lighthouse': {
    domain: 'lighthouse',
    title: 'The Far Warning',
    leadTemplate: 'Above the water, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'A light is useful only when danger is near.',
    note: 'Lighthouse puzzle-id override removes tower-on-tower wording while keeping the warning-over-water relationship.',
  },
  'threadline-2027-08-27-laboratory': {
    domain: 'laboratory',
    title: 'Small Result',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} frame the test while {B1}, {B2}, and {B3} set the order.',
    weave: 'The smallest change can carry the answer.',
    note: 'Laboratory puzzle-id override removes repeated note wording, resolves title reuse, and keeps the procedure/proof relation.',
  },
  'threadline-2027-09-20-clockshop': {
    domain: 'clockshop',
    title: 'Minute Under Glass',
    leadTemplate: 'At the clockshop counter, {A1}, {A2}, and {A3} sit under glass while {B1}, {B2}, and {B3} let the hour speak.',
    weave: 'Brass gives the hour a voice.',
    note: 'Clockshop puzzle-id override avoids repeating pulse, resolves title and payoff reuse, and keeps the audible-time aha.',
  },
  'threadline-2027-10-01-clockshop': {
    domain: 'clockshop',
    title: 'Brass Holds Minutes',
    leadTemplate: 'At the clockshop counter, {A1}, {A2}, and {A3} sit under glass while {B1}, {B2}, and {B3} make the hour audible.',
    weave: 'A small mechanism gives the hour a voice.',
    note: 'Clockshop puzzle-id override avoids repeating pulse while preserving the mechanism-to-hour payoff.',
  },
  'threadline-2027-10-14-pottery': {
    domain: 'pottery',
    title: 'Under The Hand',
    leadTemplate: 'At the clay table, hands {B1} the {A1}, {B2} the {A2}, and {B3} the {A3}.',
    weave: 'Heat turns a careful touch into memory.',
    note: 'Pottery puzzle-id override removes title reuse and shape-on-shape repetition while keeping the touch-to-memory payoff.',
  },
  'threadline-2027-10-21-lighthouse': {
    domain: 'lighthouse',
    title: 'Warning Over The Breakers',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'The coast understands the dark by looking up.',
    note: 'Lighthouse puzzle-id override removes stair-on-stair wording while preserving the coast-and-warning payoff.',
  },
  'threadline-2027-10-22-dancehall': {
    domain: 'dancehall',
    title: 'The Floor Listens',
    leadTemplate: 'In the dancehall, {A1}, {A2}, and {A3} catch the light while dancers {B1}, {B2}, and {B3}.',
    weave: 'Music gives the room a pulse.',
    note: 'Dancehall puzzle-id override resolves title reuse while keeping the room-to-music payoff.',
  },
  'threadline-2027-11-06-airport': {
    domain: 'airport',
    title: 'Room Points Outward',
    leadTemplate: 'The departure hall holds {A1}, {A2}, and {A3} while screens narrow the trip to {B1}, {B2}, and {B3}.',
    weave: 'Every sign in the room points outward.',
    note: 'Airport puzzle-id override avoids repeating board while preserving the departure-board aha.',
  },
  'threadline-2027-11-14-lighthouse': {
    domain: 'lighthouse',
    title: 'Kindness From Above',
    leadTemplate: 'Above the water, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'A high light gives fear a bearing.',
    note: 'Lighthouse puzzle-id override avoids repeating tower while preserving the warning-over-water relationship.',
  },
  'threadline-2026-08-09-cafe': {
    domain: 'cafe',
    title: 'Steam In The Window',
    leadTemplate: 'Breakfast keeps {A1}, {A2}, and {A3} by the glass while the block offers {B1}, {B2}, and {B3}.',
    weave: 'Breakfast borrows the block through glass.',
    note: 'Cafe puzzle-id override breaks an overused small-table weave skeleton while preserving the window/block aha.',
  },
  'threadline-2026-12-19-library': {
    domain: 'library',
    title: 'Reading Light',
    leadTemplate: 'By the reading lamp, {A1}, {A2}, and {A3} sit with {B1}, {B2}, and {B3}.',
    weave: 'The lamp makes one chair enough.',
    note: 'Library puzzle-id override removes shelf-on-shelf wording while keeping the one-chair reading payoff.',
  },
  'threadline-2027-07-10-lighthouse': {
    domain: 'lighthouse',
    title: 'The High Room Turns',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the climb before the light can {B1}, {B2}, and {B3}.',
    weave: 'The water reads care from far away.',
    note: 'Lighthouse puzzle-id override removes stair-on-stair wording while keeping the water-reading payoff.',
  },
  'threadline-2027-08-05-observatory': {
    domain: 'observatory',
    title: 'Almost Held',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} steady the view while {B1}, {B2}, and {B3} mark the sky.',
    weave: 'A patient room can hold impossible distance.',
    note: 'Observatory puzzle-id override breaks a repeated dome-ready/night-offers lead structure.',
  },
  'threadline-2027-08-15-pottery': {
    domain: 'pottery',
    title: 'Soft Form',
    leadTemplate: 'At the clay table, hands {B1}, {B2}, and {B3} before {A1}, {A2}, and {A3} go to the kiln.',
    weave: 'The soft thing keeps the handprint.',
    note: 'Pottery puzzle-id override removes wheel-on-wheel wording while keeping the touch-memory payoff.',
  },
  'threadline-2027-08-16-tailor': {
    domain: 'tailor',
    title: 'Pins In The Mirror',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} guide hands that {B1}, {B2}, and {B3}.',
    weave: 'Fit is the moment cloth starts belonging.',
    note: 'Tailor puzzle-id override removes tailor-on-tailor wording while preserving the fitting payoff.',
  },
  'threadline-2027-09-21-laboratory': {
    domain: 'laboratory',
    title: 'Small Certainty',
    leadTemplate: 'The test has {A1}, {A2}, and {A3} while technicians {B1}, {B2}, and {B3}.',
    weave: 'Doubt gets smaller when the work is careful.',
    note: 'Laboratory puzzle-id override resolves title and payoff reuse while keeping the test steps human.',
  },
  'threadline-2027-09-25-tailor': {
    domain: 'tailor',
    title: 'Mirror With Pins',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} guide the hands as they {B1}, {B2}, and {B3}.',
    weave: 'Cloth becomes personal in the mirror.',
    note: 'Tailor puzzle-id override resolves title reuse while preserving the cloth-to-fit payoff.',
  },
  'threadline-2027-10-03-lighthouse': {
    domain: 'lighthouse',
    title: 'Direction In The Dark',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'The coast gets braver when light arrives early.',
    note: 'Lighthouse puzzle-id override removes stair-on-stair wording and resolves the repeated far-light payoff.',
  },
  'threadline-2027-10-07-observatory': {
    domain: 'observatory',
    title: 'Glass Toward Stars',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} steady the dark while {B1}, {B2}, and {B3} mark the sky.',
    weave: 'The far sky rewards the patient room.',
    note: 'Observatory puzzle-id override removes dome-on-dome wording and resolves payoff reuse.',
  },
  'threadline-2027-10-12-campsite': {
    domain: 'campsite',
    title: 'Shelter At Night',
    leadTemplate: 'Around the fire ring, {A1}, {A2}, and {A3} come out as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'A little order makes the night kinder.',
    note: 'Campsite puzzle-id override breaks a repeated fire-ring/night-livable lead structure.',
  },
  'threadline-2027-10-17-tailor': {
    domain: 'tailor',
    title: 'Mirror Fit',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} show what needs changing before hands {B1}, {B2}, and {B3} the cloth.',
    weave: 'A good fit is cloth learning the body.',
    note: 'Tailor puzzle-id override removes set-the-plan phrasing and makes the correction verbs serve the fit.',
  },
  'threadline-2027-06-26-apiary': {
    domain: 'apiary',
    title: 'Box In The Bloom',
    leadTemplate: 'Near the boxes, {A1}, {A2}, and {A3} crowd the path as {B1}, {B2}, and {B3} carry the work home.',
    weave: 'Sweetness takes work before it tastes easy.',
    note: 'Apiary puzzle-id override removes share-the-path phrasing and keeps the bloom/work payoff concrete.',
  },
  'threadline-2027-07-11-lighthouse': {
    domain: 'lighthouse',
    title: 'The High Room Turns',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the climb while {B1}, {B2}, and {B3} change the water.',
    weave: 'A warning is kindness made visible.',
    note: 'Lighthouse puzzle-id override removes stair-on-stair repetition and makes the climb serve the warning.',
  },
  'threadline-2027-08-14-tailor': {
    domain: 'tailor',
    title: 'Needle In The Mirror',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} come first before hands {B1}, {B2}, and {B3}.',
    weave: 'The fitting makes cloth answer back.',
    note: 'Tailor puzzle-id override removes tailor-on-tailor repetition and resolves the repeated mirror title.',
  },
  'threadline-2027-08-12-tailor': {
    domain: 'tailor',
    title: 'Cloth Learns Shape',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} lie under hands that {B1}, {B2}, and {B3}.',
    weave: 'Cloth gets intimate by being corrected.',
    note: 'Tailor puzzle-id override removes tailor-mirror repetition while keeping the intimate correction payoff.',
  },
  'threadline-2027-09-22-firehouse': {
    domain: 'firehouse',
    title: 'Before Wheels',
    leadTemplate: 'Before the alarm, {A1}, {A2}, and {A3} hang in the bay as the crew rehearses {B1}, {B2}, and {B3}.',
    weave: 'Help begins before the wheels move.',
    note: 'Firehouse puzzle-id override resolves title reuse while keeping the rehearsal-before-alarm aha.',
  },
  'threadline-2027-10-06-newsroom': {
    domain: 'newsroom',
    title: 'Copy Before Dawn',
    leadTemplate: 'At the newsroom desk, {A1}, {A2}, and {A3} sit under the lamp while reporters {B1}, {B2}, and {B3}.',
    weave: 'A fact is a rumor that survived the room.',
    note: 'Newsroom puzzle-id override removes story-on-story repetition and keeps the fact-check payoff compact.',
  },
  'threadline-2027-10-05-chessboard': {
    domain: 'chessboard',
    title: 'The Quiet Threat',
    leadTemplate: 'At the chessboard, {A1}, {A2}, and {A3} become pressure when players {B1}, {B2}, and {B3}.',
    weave: 'On the board, pressure changes every piece.',
    note: 'Chessboard puzzle-id override makes the payoff bridge board pieces to tactics explicitly.',
  },
  'threadline-2027-10-04-chessboard': {
    domain: 'chessboard',
    title: 'Threat At The Table',
    leadTemplate: 'At the chessboard, {A1}, {A2}, and {A3} sit in view while a player can {B1}, {B2}, and read the {B3}.',
    weave: 'Pressure has no voice, but every piece hears it.',
    note: 'Chessboard puzzle-id override resolves title/payoff reuse and makes attack, defend, and threat playable in one sentence.',
  },
  'threadline-2027-11-06-tailor': {
    domain: 'tailor',
    title: 'The Better Line',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} change under {B1}, {B2}, and {B3}.',
    weave: 'The garment learns the body in small changes.',
    note: 'Tailor puzzle-id override removes tailor-on-tailor repetition and resolves the repeated body-to-garment payoff.',
  },
  'threadline-2027-11-03-tailor': {
    domain: 'tailor',
    title: 'Cloth Learns Shape',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} lie ready as hands {B1}, {B2}, and {B3}.',
    weave: 'A fit becomes real when cloth meets a body.',
    note: 'Tailor puzzle-id override resolves title reuse and replaces the answer-language payoff with a body-and-cloth aha.',
  },
  'threadline-2027-05-13-weather-station': {
    domain: 'weather-station',
    title: 'Measured Sky',
    leadTemplate: 'At the station window, {A1}, {A2}, and {A3} keep watch as the sky begins to {B1}, {B2}, and {B3}.',
    weave: 'Measured sky gives warning a head start.',
    note: 'Weather-station puzzle-id override removes forecast-shift label prose from the lead and weave.',
  },
  'threadline-2027-06-05-weather-station': {
    domain: 'weather-station',
    title: 'The Station Knows Early',
    leadTemplate: 'At the station window, {A1}, {A2}, and {A3} catch {B1} pressure, {B2} air, and {B3}.',
    weave: 'Weather gets a little notice before it arrives.',
    note: 'Weather-station puzzle-id override replaces numbers-into-weather copy with an early-notice aha.',
  },
  'threadline-2027-06-16-weather-station': {
    domain: 'weather-station',
    title: 'Pressure On The Dial',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch a day that may {B1}, {B2}, and {B3}.',
    weave: 'The sky changes its mind, and the instruments remember.',
    note: 'Weather-station puzzle-id override removes forecast-shift label prose and gives the instruments a memory role.',
  },
  'threadline-2027-07-06-weather-station': {
    domain: 'weather-station',
    title: 'Sky Accountable',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} read the change: air is {B1}, crews {B2}, and the needle can {B3}.',
    weave: 'The sky speaks first in instruments.',
    note: 'Weather-station puzzle-id override removes catch-a-watch phrasing and gives each weather-shift answer a natural subject.',
  },
  'threadline-2027-08-17-weather-station': {
    domain: 'weather-station',
    title: 'Pressure Change',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch a day that may {B1}, {B2}, and {B3}.',
    weave: 'The instruments hear tomorrow in small changes.',
    note: 'Weather-station puzzle-id override removes forecast-shift label prose and varies the station payoff.',
  },
  'threadline-2027-08-19-weather-station': {
    domain: 'weather-station',
    title: 'The Sky Leaves Clues',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch {B1} air, a {B2}, and {B3}.',
    weave: 'The air leaves clues before people feel them.',
    note: 'Weather-station puzzle-id override replaces forecast-shift evidence language with a direct air-to-human clue.',
  },
  'threadline-2027-09-05-weather-station': {
    domain: 'weather-station',
    title: 'The Sky Gets Counted',
    leadTemplate: 'At the station window, {A1}, {A2}, and {A3} keep watch as the sky begins to {B1}, {B2}, and {B3}.',
    weave: 'Changing weather becomes evidence under watch.',
    note: 'Weather-station puzzle-id override removes answers-through phrasing and keeps the evidence payoff concise.',
  },
  'threadline-2027-09-12-weather-station': {
    domain: 'weather-station',
    title: 'The Dial Notices First',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch {B1}, a wind {B2}, and {B3} pressure.',
    weave: 'A forecast matters before anyone looks up.',
    note: 'Weather-station puzzle-id override removes forecast-shifts-toward lead language while keeping the early-warning payoff.',
  },
  'threadline-2027-09-25-weather-station': {
    domain: 'weather-station',
    title: 'Watching The Pressure',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} keep the {B1}, {B2}, and {B3} honest.',
    weave: 'A forecast is care before anyone steps outside.',
    note: 'Weather-station puzzle-id override removes measured-voice reuse and keeps the payoff human.',
  },
  'threadline-2027-09-26-weather-station': {
    domain: 'weather-station',
    title: 'A Warm Edge',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch the change as forecasters {B1}, {B2}, and {B3} the map.',
    weave: 'Instruments let weather arrive with warning.',
    note: 'Weather-station puzzle-id override removes article-mismatch grammar and gives the forecast verbs a shared object.',
  },
  'threadline-2027-10-23-weather-station': {
    domain: 'weather-station',
    title: 'Plain Light',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch the hour: air can {B1}, wind is {B2}, and pressure is {B3}.',
    weave: 'Numbers give the sky a usable shape.',
    note: 'Weather-station puzzle-id override removes broken verb-list grammar and gives each weather change a subject.',
  },
  'threadline-2027-11-08-weather-station': {
    domain: 'weather-station',
    title: 'Common Light',
    leadTemplate: 'On the instruments, {A1}, {A2}, and {A3} register a day that can {B1}, keep {B2}, and {B3}.',
    weave: 'Measurement lets weather speak before it arrives.',
    note: 'Weather-station puzzle-id override removes forecast-shift label prose and turns the reveal into anticipation.',
  },
  'threadline-2027-11-12-weather-station': {
    domain: 'weather-station',
    title: 'Light In Reach',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} track {B1}, {B2} pressure, and a {B3} on the map.',
    weave: 'A forecast begins when instruments agree.',
    note: 'Weather-station puzzle-id override removes catch-a-deepen phrasing and makes the sky-change list read as one sentence.',
  },
  'threadline-2027-11-03-weather-station': {
    domain: 'weather-station',
    title: 'Under Low Light',
    leadTemplate: 'On the instruments, {A1}, {A2}, and {A3} catch a day that can {B1}, {B2}, and keep {B3}.',
    weave: 'The instruments give weather a head start.',
    note: 'Weather-station puzzle-id override removes forecast-shifts phrasing and gives the changing sky a readable lead time.',
  },
  'threadline-2027-10-23-observatory': {
    domain: 'observatory',
    title: 'Dome Dark',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} steady the view while {B1}, {B2}, and {B3} mark the sky.',
    weave: 'Distance stays beautiful because it stays distant.',
    note: 'Observatory puzzle-id override resolves payoff reuse while preserving the far-sky aha.',
  },
  'threadline-2027-11-10-campsite': {
    domain: 'campsite',
    title: 'Warm Center Outside',
    leadTemplate: 'Around the fire ring, {A1}, {A2}, and {A3} come out as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'The ring gives the night a warm center.',
    note: 'Campsite puzzle-id override resolves payoff reuse and keeps the warm-center campsite aha.',
  },
  'threadline-2027-11-13-lighthouse': {
    domain: 'lighthouse',
    title: 'Care Over Breakers',
    leadTemplate: 'Above the water, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'A light is care sent ahead.',
    note: 'Lighthouse puzzle-id override removes tower-on-tower wording and keeps the care-sent-ahead payoff.',
  },
  'threadline-2027-11-16-radio-booth': {
    domain: 'radio-booth',
    title: 'Late Light In The Room',
    leadTemplate: 'At the booth, {A1}, {A2}, and {A3} sit near the mic as the producer cues {B1}, {B2}, and {B3}.',
    weave: 'The booth stays close while the sound goes outward.',
    note: 'Radio-booth puzzle-id override removes wait/work-through scaffolding and gives stinger, jingle, and replay a producer subject.',
  },
  'threadline-2027-06-22-firehouse': {
    domain: 'firehouse',
    title: 'The Roll Begins',
    leadTemplate: 'In the bay, {A1}, {A2}, and {A3} wait through drills as the crew learns to {B1}, {B2}, and {B3}.',
    weave: 'The bay wakes when the alarm does.',
    note: 'Firehouse puzzle-id override breaks a repeated before-the-bell drill structure while keeping readiness tied to action.',
  },
  'threadline-2027-08-15-tailor': {
    domain: 'tailor',
    title: 'Pins In The Mirror',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} guide the hands that {B1}, {B2}, and {B3}.',
    weave: 'A good seam knows the body quietly.',
    note: 'Tailor puzzle-id override removes tailor-on-tailor and stay-close-while-hands wording while keeping the fitting payoff.',
  },
  'threadline-2027-09-13-lighthouse': {
    domain: 'lighthouse',
    title: 'Bright Above The Rocks',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'The high room turns worry into warning.',
    note: 'Lighthouse puzzle-id override removes stair-on-stair wording while preserving the high-warning payoff.',
  },
  'threadline-2027-09-26-apothecary': {
    domain: 'apothecary',
    title: 'Dose Under Lamplight',
    leadTemplate: 'Under the shelf light, {A1}, {A2}, and {A3} line up while careful hands are {B1}, {B2}, and {B3}.',
    weave: 'The dose begins in careful hands.',
    note: 'Apothecary puzzle-id override removes duplicated shelf wording and replaces the reused exact-care payoff.',
  },
  'threadline-2027-06-03-printshop': {
    domain: 'printshop',
    title: 'Page Under Pressure',
    leadTemplate: 'At the printshop press, workers {B1} {A1} and {A3}, {B2} the {A2}, and {B3} the page.',
    weave: 'Ink gives language a public body.',
    note: 'Printshop puzzle-id override removes stay-under-hands wording and keeps the title away from the playable LETTER answer.',
  },
  'threadline-2027-10-07-pottery': {
    domain: 'pottery',
    title: 'After Touch',
    leadTemplate: 'At the clay table, hands {B1} the {A1}, {B2} the {A2}, and {B3} the {A3} before the kiln.',
    weave: 'Heat lets the hand stay visible.',
    note: 'Pottery puzzle-id override removes ready-for-kiln phrasing and gives score, paddle, and center direct objects.',
  },
  'threadline-2027-10-03-laboratory': {
    domain: 'laboratory',
    title: 'Measured Wonder',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} frame the question while technicians {B1}, {B2}, and {B3}.',
    weave: 'Precision is the poetry of not guessing.',
    note: 'Laboratory puzzle-id override removes test-on-test wording and gives the steps a human subject.',
  },
  'threadline-2027-11-09-radio-booth': {
    domain: 'radio-booth',
    title: 'A Desk After Dark',
    leadTemplate: 'Behind the glass, {A1}, {A2}, and {A3} sit near the mic as the producer cues {B1}, {B2}, and {B3}.',
    weave: 'The public edge of sound starts small.',
    note: 'Radio-booth puzzle-id override removes wait/work-through scaffolding and gives jingle, replay, and static a producer subject.',
  },
  '2026-07-13': {
    domain: 'porch',
    title: 'The Threshold Glows',
    leadTemplate: 'On the step, {A1}, {A2}, and {A3} face the street as {B1}, {B2}, and {B3} come closer.',
    weave: 'The outside world gets gentle at the door.',
    note: 'Porch override removes make-room-for phrasing and keeps the street-to-door relationship concrete.',
  },
  '2026-12-15': {
    domain: 'garden',
    title: 'The Kept Patch',
    leadTemplate: 'Past the gate, {A1}, {A2}, and {A3} share the morning with {B1}, {B2}, and {B3}.',
    weave: 'The yard keeps faith with whoever returns.',
    note: 'Garden override removes make-room-for phrasing and keeps the care-return payoff.',
  },
  'threadline-2027-05-17-weather-station': {
    domain: 'weather-station',
    title: 'Sky In Numbers',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} {B1} changes, {B2} the air, and {B3} the forecast.',
    weave: 'Small readings warn before the forecast does.',
    note: 'Weather-station puzzle-id override removes reports-report filler and gives reveal, report, update real objects.',
  },
  'threadline-2027-08-20-weather-station': {
    domain: 'weather-station',
    title: 'The Dial Notices First',
    leadTemplate: 'At the weather desk, {A1}, {A2}, and {A3} catch the change as clouds {B1}, crews {B2}, and air can {B3}.',
    weave: 'Instruments make tomorrow less surprising.',
    note: 'Weather-station puzzle-id override replaces pressure-to-forecast phrasing and gives deepen, watch, and freshen natural subjects.',
  },
  'threadline-2027-09-21-campsite': {
    domain: 'campsite',
    title: 'The Tent Goes Quiet',
    leadTemplate: 'By the fire, {A1}, {A2}, and {A3} stay close as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'Evening settles when the camp settles.',
    note: 'Campsite puzzle-id override removes make-room-for phrasing while keeping the camp-settling payoff.',
  },
  'threadline-2027-10-11-campsite': {
    domain: 'campsite',
    title: 'Outside Kept',
    leadTemplate: 'Around the fire ring, {A1}, {A2}, and {A3} come out as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'The ring turns the dark toward shelter.',
    note: 'Campsite puzzle-id override removes make-the-dark-practical language and keeps the shelter aha.',
  },
  'threadline-2027-11-06-apothecary': {
    domain: 'apothecary',
    title: 'Bottle Before Remedy',
    leadTemplate: 'Under the shelf light, {A1}, {A2}, and {A3} come together as careful hands keep {B1}, {B2}, and {B3}.',
    weave: 'Medicine begins before the dose.',
    note: 'Apothecary puzzle-id override removes duplicated shelf wording and replaces the measured-small payoff.',
  },
  'threadline-2027-12-01-porch': {
    domain: 'porch',
    title: 'The Warm Edge',
    leadTemplate: 'On the step, {A1}, {A2}, and {A3} face the street as {B1}, {B2}, and {B3} come closer.',
    weave: 'Passing gets a name at the threshold.',
    note: 'Porch puzzle-id override removes make-room-for phrasing and keeps the street-to-threshold movement.',
  },
  '2027-12-21': {
    domain: 'picnic',
    title: 'Room On The Grass',
    leadTemplate: 'Under the trees, {A1}, {A2}, and {A3} spread out as people {B1}, {B2}, and {B3} in the shade.',
    weave: 'No walls are needed at noon.',
    note: 'Picnic override removes wait-in-the-shade inventory phrasing and lets the packed things open into people using the afternoon.',
  },
  'threadline-2027-08-29-campsite': {
    domain: 'campsite',
    title: 'Dark Around The Fire',
    leadTemplate: 'Near the fire, {A1}, {A2}, and {A3} stay close while people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'The wild stays close, but not too close.',
    note: 'Campsite puzzle-id override replaces make-room-for syntax with a direct fire-ring sentence.',
  },
  'threadline-2027-10-30-campsite': {
    domain: 'campsite',
    title: 'Kindling Hour',
    leadTemplate: 'Around the fire ring, {A1}, {A2}, and {A3} come out as people keep {B1}, {B2}, and {B3} after dark.',
    weave: 'A little order makes the night kinder.',
    note: 'Campsite puzzle-id override replaces make-the-dark-practical language with a plainer after-dark camp sentence.',
  },
  'threadline-2026-12-20-shore': {
    domain: 'shore',
    title: 'Small Wet Signs',
    leadTemplate: 'At low water, {A1}, {A2}, and {A3} rest in wet sand with the tide {B1}, {B2}, and {B3} around them.',
    weave: 'Low tide leaves a little evidence behind.',
    note: 'Shore puzzle-id override removes the edge-keeps-changing scaffold and gives the tide a natural sentence.',
  },
  'threadline-2026-05-14-gallery': {
    domain: 'gallery',
    title: 'One More Look',
    leadTemplate: 'At the gallery wall, a {A1}, a {A2}, and a {A3} hold still as people spend the visit {B1}, {B2}, and {B3}.',
    weave: 'Art changes the person who stops.',
    note: 'Gallery puzzle-id override removes reason-for and visitors-keep phrasing while keeping the still art / moving visitor contrast.',
  },
  'threadline-2026-06-08-gallery': {
    domain: 'gallery',
    title: 'Color In Quiet',
    leadTemplate: 'In the quiet gallery, {A1}, {A2}, and {A3} sit under soft lamps as people go slowly, {B1}, {B2}, and {B3}.',
    weave: 'A gallery lets attention take its time.',
    note: 'Gallery puzzle-id override removes visitors-keep phrasing and lets the art/attention relationship carry the reveal.',
  },
  'threadline-2027-03-01-station': {
    domain: 'station',
    title: 'Platform Pause',
    leadTemplate: 'On the platform, the {A1}, {A2}, and {A3} orient the crowd while a {B1}, a {B2}, and a {B3} pass the minutes.',
    weave: 'The platform makes waiting point somewhere.',
    note: 'Station puzzle-id override replaces in-someone-hand scaffolding with a cleaner wait/departure contrast.',
  },
  'threadline-2027-07-28-apothecary': {
    domain: 'apothecary',
    title: 'Shelf Before Dose',
    leadTemplate: 'On the apothecary shelf, {A1}, {A2}, and the {A3} wait while careful hands {B1}, {B2}, and {B3}.',
    weave: 'Care reaches the body one measured dose at a time.',
    note: 'Apothecary puzzle-id override removes visible-seats language and lets the mixing verbs use a human subject.',
  },
  'threadline-2027-07-29-tailor': {
    domain: 'tailor',
    title: 'Fit In The Mirror',
    leadTemplate: 'At the fitting mirror, the {A1}, {A2}, and {A3} are ready while hands {B1}, {B2}, and {B3} the garment.',
    weave: 'A good fit turns structure into comfort.',
    note: 'Tailor puzzle-id override removes by-the-first-turn phrasing and makes the fitting actions act on the garment.',
  },
  'threadline-2026-05-10-market': {
    domain: 'market',
    title: 'Coins At The Counter',
    leadTemplate: 'Shoppers pause over {A1}, {A2}, and {A3} before they {B1}, {B2}, and {B3}.',
    weave: 'At a stall, appetite has to point.',
    note: 'Market puzzle-id override removes puts-appetite phrasing and keeps the stall-goods / buyer-choice aha concrete.',
  },
  'threadline-2026-08-18-market': {
    domain: 'market',
    title: 'Hands Over The Produce',
    leadTemplate: 'At the market stall, {A1}, {A2}, and {A3} fill the crates while shoppers {B1}, {B2}, and {B3}.',
    weave: 'A bag opens when appetite decides.',
    note: 'Market puzzle-id override replaces an overused turns-into payoff structure with a sharper choosing payoff.',
  },
  'threadline-2026-10-20-music': {
    domain: 'music',
    title: 'Practice Beat',
    leadTemplate: 'At rehearsal, {A1}, {A2}, and {A3} stay silent until {B1}, {B2}, and {B3} decide how the first sound lands.',
    weave: 'Instruments make silence into sound.',
    note: 'Music puzzle-id override removes wait-while and shape-the-first-sound phrasing and makes the instruments/listening-cues relationship sharper.',
  },
  'threadline-2026-11-26-market': {
    domain: 'market',
    title: 'Busy Shade',
    leadTemplate: 'Under the awning, {A1}, {A2}, and {A3} brighten the table while shoppers {B1}, {B2}, and {B3}.',
    weave: 'A hand chooses what the season offered.',
    note: 'Market puzzle-id override removes gets-personal phrasing and keeps the produce/choice payoff tactile.',
  },
  'threadline-2027-01-24-laundry': {
    domain: 'laundry',
    title: 'Basket Light',
    leadTemplate: 'By the basket, {A1}, {A2}, and {A3} move through {B1}, {B2}, and {B3}.',
    weave: 'Order returns one small habit at a time.',
    note: 'Laundry puzzle-id override removes work-moves-into phrasing and lets the laundry move through chores.',
  },
  'threadline-2027-03-10-gallery': {
    domain: 'gallery',
    title: 'Attention In The Frame',
    leadTemplate: 'At the frame, {A1}, {A2}, and {A3} catch the light while visitors are {B1}, {B2}, and {B3}.',
    weave: 'Attention is the quietest kind of movement.',
    note: 'Gallery puzzle-id override removes quiet-turns-into phrasing and gives the visitor moves a human subject.',
  },
  'threadline-2027-08-11-tailor': {
    domain: 'tailor',
    title: 'Cloth Learns Shape',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} wait while hands {B1}, {B2}, and {B3} the cloth.',
    weave: 'The mirror turns structure toward comfort.',
    note: 'Tailor puzzle-id override removes the nonblank repeat of the playable TAILOR answer.',
  },
  'threadline-2027-08-24-observatory': {
    domain: 'observatory',
    title: 'Dome Dark',
    leadTemplate: 'Under the open roof, {A1}, {A2}, and {A3} aim toward {B1}, {B2}, and {B3}.',
    weave: 'The night comes nearer by staying unreachable.',
    note: 'Observatory puzzle-id override breaks a repeated ready-when-night-offers lead structure.',
  },
  'threadline-2027-08-29-clockshop': {
    domain: 'clockshop',
    title: 'Velvet Time',
    leadTemplate: 'At the clockshop, the {A1}, {A2}, and {A3} lie on velvet while the repairer checks the {B1}, the {B2}, and the {B3} spring.',
    weave: 'A clock lets the hour speak.',
    note: 'Clockshop puzzle-id override removes tag-reading scaffolding and resolves short-window title reuse.',
  },
  'threadline-2027-09-01-clockshop': {
    domain: 'clockshop',
    title: 'Measured Sound',
    leadTemplate: 'At the clockshop counter, {A1}, {A2}, and {A3} lie on the mat while the maker lets the works {B1}, {B2}, and {B3}.',
    weave: 'A good clock keeps time almost alive.',
    note: 'Clockshop puzzle-id override removes repair-card scaffolding and keeps the mechanism/time-motion aha compact.',
  },
  'threadline-2027-09-24-radio-booth': {
    domain: 'radio-booth',
    title: 'Needle Near Noon',
    leadTemplate: 'Near the mic, {A1}, {A2}, and {A3} wait while the producer lines up {B1}, {B2}, and {B3}.',
    weave: 'The voice leaves before the room does.',
    note: 'Radio-booth puzzle-id override removes works-through phrasing and keeps the producer action concrete.',
  },
  'threadline-2027-09-24-tailor': {
    domain: 'tailor',
    title: 'Cloth Near The Mirror',
    leadTemplate: 'Near the mirror, the {A1} waits beside the {A2} and {A3} while the tailor can {B1}, {B2}, and {B3} the cloth.',
    weave: 'Cloth gets personal in front of the mirror.',
    note: 'Tailor puzzle-id override removes visible-seats language and gives adjust, trim, and drape a shared object.',
  },
  'threadline-2027-09-28-planetarium': {
    domain: 'planetarium',
    title: 'Room Leaves Earth',
    leadTemplate: 'In the dark room, {A1}, {A2}, and {A3} appear while the show adds {B1}, {B2}, and {B3}.',
    weave: 'The ceiling borrows distance for the room.',
    note: 'Planetarium puzzle-id override removes the nonblank repeat of the playable DOME answer.',
  },
  'threadline-2027-10-15-tailor': {
    domain: 'tailor',
    title: 'Cloth Belongs',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} wait while hands {B1}, {B2}, and {B3} the cloth.',
    weave: 'A better fit feels like permission.',
    note: 'Tailor puzzle-id override removes the nonblank repeat of the playable TAILOR answer.',
  },
  'threadline-2027-10-29-clockshop': {
    domain: 'clockshop',
    title: 'Tag Under Glass',
    leadTemplate: 'In the clockshop window, {A1}, {A2}, and {A3} wait under glass while the repairer listens for {B1}, {B2}, and {B3}.',
    weave: 'The hour sounds before anyone says it.',
    note: 'Clockshop puzzle-id override removes tag-reading scaffolding and gives the time motions an audible repair context.',
  },
  'threadline-2027-11-08-newsroom': {
    domain: 'newsroom',
    title: 'Before Print',
    leadTemplate: 'At the newsroom desk, the {A1}, {A2}, and {A3} wait while editors {B1}, {B2}, and {B3} the story.',
    weave: 'Trust is built before the story leaves.',
    note: 'Newsroom puzzle-id override removes visible-seats phrasing and makes the press moves belong to editors.',
  },
  'threadline-2027-11-11-dancehall': {
    domain: 'dancehall',
    title: 'A Public Spark',
    leadTemplate: 'At the dancehall, {A1}, {A2}, and {A3} are in the room before bodies {B1}, {B2}, and {B3}.',
    weave: 'The beat waits for bodies to answer.',
    note: 'Dancehall puzzle-id override removes first-turn/carry-onward scaffolding and keeps the beat-to-body relationship direct.',
  },
  'threadline-2027-11-13-dancehall': {
    domain: 'dancehall',
    title: 'A Public Spark',
    leadTemplate: 'At the dancehall, {A1}, {A2}, and {A3} are in the room before bodies {B1}, {B2}, and {B3}.',
    weave: 'Music gives the room a pulse.',
    note: 'Dancehall puzzle-id override removes floor repetition and what-happens-next phrasing.',
  },
  'threadline-2027-11-15-apiary': {
    domain: 'apiary',
    title: 'Work Hums',
    leadTemplate: 'Near the hive, {A1}, {A2}, and {A3} crowd the frame while bees are {B1}, {B2}, and {B3}.',
    weave: 'The hive sounds like work coming home.',
    note: 'Apiary puzzle-id override removes flight-path abstraction and gives the hive moves to bees.',
  },
  'threadline-2027-11-17-station': {
    domain: 'station',
    title: 'Quiet Platform',
    leadTemplate: 'On the platform, {A1}, {A2}, and {A3} orient the crowd while travelers carry a {B1}, a {B2}, and {B3}.',
    weave: 'A station points waiting toward departure.',
    note: 'Station puzzle-id override removes gives-waiting phrasing and keeps the route/waiting relationship directional.',
  },
  'threadline-2027-11-18-shore': {
    domain: 'shore',
    title: 'The Brief Shelf',
    leadTemplate: 'At low tide, {A1}, {A2}, and {A3} rest in wet sand with the water {B1}, {B2}, and {B3} nearby.',
    weave: 'The tide leaves proof it can take back.',
    note: 'Shore puzzle-id override removes edge-keeps-changing from both the lead and weave.',
  },
  'threadline-2027-11-19-gallery': {
    domain: 'gallery',
    title: 'Slow Look',
    leadTemplate: 'At the gallery wall, a {A1}, a {A2}, and a {A3} hold still as visitors keep {B1}, {B2}, and {B3}.',
    weave: 'Art changes the pace of a body.',
    note: 'Gallery puzzle-id override removes reason-for phrasing and makes looking feel chosen rather than templated.',
  },
  'threadline-2027-11-29-gallery': {
    domain: 'gallery',
    title: 'Wall Attention',
    leadTemplate: 'At the gallery wall, {A1}, {A2}, and {A3} hold their places while visitors keep {B1}, {B2}, and {B3}.',
    weave: 'Looking gives silence a pulse.',
    note: 'Gallery puzzle-id override replaces room-slows-into language with direct visitor motion.',
  },
  'threadline-2027-11-30-laundry': {
    domain: 'laundry',
    title: 'A Stack Takes Shape',
    leadTemplate: 'By the washer, {A1}, {A2}, and {A3} wait as the load goes through {B1}, {B2}, and {B3}.',
    weave: 'Laundry turns a basket back toward use.',
    note: 'Laundry puzzle-id override removes put-them-right wording and makes the wash sequence plain.',
  },
  'threadline-2027-12-02-garden': {
    domain: 'garden',
    title: 'A Little More Green',
    leadTemplate: 'In the garden, {A1}, {A2}, and {A3} brighten the bed while hands are {B1}, {B2}, and {B3}.',
    weave: 'Care keeps hope close to the ground.',
    note: 'Garden puzzle-id override removes in-the-hands list grammar and keeps the care grounded.',
  },
  'threadline-2027-12-04-gallery': {
    domain: 'gallery',
    title: 'Wall And Witness',
    leadTemplate: 'At the gallery wall, {A1}, {A2}, and {A3} hold the quiet while visitors are {B1}, {B2}, and {B3}.',
    weave: 'A quiet wall changes under attention.',
    note: 'Gallery puzzle-id override removes quiet-turns-into and wall-keeps-changing language.',
  },
  'threadline-2027-12-05-laundry': {
    domain: 'laundry',
    title: 'Fresh Stack',
    leadTemplate: 'In the laundry room, {A1}, {A2}, and {A3} leave the basket for {B1}, {B2}, and {B3}.',
    weave: 'A clean stack is ordinary relief.',
    note: 'Laundry puzzle-id override removes come-back-useful syntax and lands the wash-day payoff on household relief.',
  },
  'threadline-2027-12-08-market': {
    domain: 'market',
    title: 'Small Change',
    leadTemplate: 'At the stall, {A1}, {A2}, and {A3} wait while shoppers {B1}, {B2}, and {B3}.',
    weave: 'The errand gets personal at the stall.',
    note: 'Market puzzle-id override replaces aisle-becomes-human abstraction with a stall-level human payoff.',
  },
  'threadline-2027-12-09-gallery': {
    domain: 'gallery',
    title: 'Looking Takes Time',
    leadTemplate: 'At the wall, {A1}, {A2}, and {A3} hold the light while visitors are {B1}, {B2}, and {B3}.',
    weave: 'Art lets the room talk in silence.',
    note: 'Gallery puzzle-id override removes attention-becomes list grammar.',
  },
  'threadline-2027-12-20-rooftop': {
    domain: 'rooftop',
    title: 'Rail In Gold',
    leadTemplate: 'From the roof, {A1}, {A2}, and {A3} sit above a city of {B1}, {B2}, and {B3}.',
    weave: 'Up high, the city lets the day go.',
    note: 'Rooftop puzzle-id override gives the skyline details a simpler roof-to-city sentence.',
  },
  'threadline-2026-06-04-market': {
    domain: 'market',
    title: 'Aisle Of Small Wants',
    leadTemplate: 'At the market table, {A1}, {A2}, and {A3} sit in the sun while shoppers {B1}, {B2}, and {B3}.',
    weave: 'The morning narrows to what goes in the bag.',
    note: 'Market puzzle-id override removes repeated canvas/table/bags scaffolding and keeps the choice payoff concrete.',
  },
  'threadline-2026-08-31-music': {
    domain: 'music',
    title: 'Measure Light',
    leadTemplate: 'At rehearsal, {A1}, {A2}, and {A3} stay near the stand while {B1}, {B2}, and {B3} pull the first sound together.',
    weave: 'Before the song, the room becomes one ear.',
    note: 'Music puzzle-id override breaks the repeated first-sound weave structure while preserving the listening-cue reveal.',
  },
  'threadline-2026-09-12-market': {
    domain: 'market',
    title: 'The Basket Gets Heavy',
    leadTemplate: 'The basket gets heavy after shoppers {B1} {A1}, {B2} {A2}, and {B3} {A3}.',
    weave: 'The bag gets heavier as appetite decides.',
    note: 'Market puzzle-id override removes made-of-small-decisions payoff and keeps the stall-to-bag choice tangible.',
  },
  'threadline-2026-12-21-market': {
    domain: 'market',
    title: 'The Aisle Starts Talking',
    leadTemplate: 'Some shoppers {B1} on {A1}, {B2} {A2}, and {B3} for {A3} before the bag is full.',
    weave: 'At the stall, a full bag remembers the choice.',
    note: 'Market puzzle-id override removes small-decisions payoff and ties the produce plus buyer motion to one concrete bag image.',
  },
  'threadline-2026-12-12-cafe': {
    domain: 'cafe',
    title: 'Small Wake',
    leadTemplate: 'Breakfast keeps {A1}, {A2}, and {A3} by the glass while the block offers {B1}, {B2}, and {B3}.',
    weave: 'Breakfast borrows its morning from the block.',
    note: 'Cafe puzzle-id override breaks a repeated the-x-x-x-x-x payoff structure while keeping the window/block relationship.',
  },
  'threadline-2026-07-21-studio': {
    domain: 'studio',
    title: 'Worktable Light',
    leadTemplate: 'At the studio table, {A1}, {A2}, and {A3} wait under the lamp, and {B1}, {B2}, and {B3} are still only ideas.',
    weave: 'The idea is still hiding in the supplies.',
    note: 'Studio puzzle-id override removes begin-on-page phrasing and keeps the supplies/idea relationship human-sized.',
  },
  'threadline-2027-03-14-trail': {
    domain: 'trail',
    title: 'The Open Edge',
    leadTemplate: 'On the trail, {A1}, {A2}, and {A3} keep the route findable, and {B1}, {B2}, and {B3} make it worth following.',
    weave: 'A path is a promise of the view ahead.',
    note: 'Trail puzzle-id override removes route-has/walk-has rhythm and turns signs plus landscape into one read-aloud sentence.',
  },
  'threadline-2027-03-06-market': {
    domain: 'market',
    title: 'Morning In The Shade',
    leadTemplate: 'Shoppers {B1} on {A1}, {B2} {A2}, and {B3} {A3} before the bag closes.',
    weave: 'At the stall, hunger has to choose.',
    note: 'Market puzzle-id override removes canvas/bags-open scaffolding and replaces the repeated turns-appetite structure.',
  },
  'threadline-2027-03-31-market': {
    domain: 'market',
    title: 'Small Change',
    leadTemplate: 'Under the awning, {A1}, {A2}, and {A3} brighten the table while shoppers {B1}, {B2}, and {B3}.',
    weave: 'The bag carries what appetite chose.',
    note: 'Market puzzle-id override removes the repeated small-decisions payoff and keeps the buyer-choice aha concrete.',
  },
  'threadline-2027-04-11-diner': {
    domain: 'diner',
    title: 'Low Glow',
    leadTemplate: 'A server sets down {A1}, {A2}, and {A3} as {B1}, {B2}, and {B3} reach the booth from the counter.',
    weave: 'The booth feels quiet until the counter talks.',
    note: 'Diner puzzle-id override removes booth-has/counter-has scaffolding and keeps booth objects plus counter talk in one lived moment.',
  },
  'threadline-2027-06-06-laboratory': {
    domain: 'laboratory',
    title: 'Small Proof',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} frame the question while technicians {B1}, {B2}, and {B3}.',
    weave: 'Proof is patience made visible.',
    note: 'Laboratory puzzle-id override removes next-line-lists copy and gives the procedure verbs a human subject.',
  },
  'threadline-2027-11-10-laboratory': {
    domain: 'laboratory',
    title: 'Exact Wonder',
    leadTemplate: 'Under the lab light, {A1}, {A2}, and {A3} frame the question while technicians {B1}, {B2}, and {B3}.',
    weave: 'The answer arrives by refusing to guess.',
    note: 'Laboratory reserve override removes next-line-lists copy and keeps proof tied to careful method.',
  },
  'threadline-2027-11-30-diner': {
    domain: 'diner',
    title: 'Blue Hour',
    leadTemplate: 'At the booth, {A1}, {A2}, and {A3} sit by the plate while {B1}, {B2}, and {B3} travel along the counter.',
    weave: 'A booth hears the counter before the plate arrives.',
    note: 'Diner reserve override removes booth-has/counter-has scaffolding and makes the counter talk audible.',
  },
  'threadline-2027-11-24-gallery': {
    domain: 'gallery',
    title: 'Picture Path',
    leadTemplate: 'The wall catches {A1}, {A2}, and {A3} as people spend the visit {B1}, {B2}, and {B3}.',
    weave: 'A wall keeps company when someone looks.',
    note: 'Gallery reserve override replaces answer-led looking payoff with a theme-level wall/attention reveal.',
  },
  'threadline-2027-12-02-studio': {
    domain: 'studio',
    title: 'A Draft In Reach',
    leadTemplate: 'At the studio table, {A1}, {A2}, and {A3} wait under the lamp while {B1}, {B2}, and {B3} are still being decided.',
    weave: 'The first idea starts as a table full of maybes.',
    note: 'Studio reserve override removes begin-on-page phrasing and makes the pre-draft state sound observed.',
  },
  'threadline-2027-12-04-trail': {
    domain: 'trail',
    title: 'Room In Low Light',
    leadTemplate: 'On the trail, {A1}, {A2}, and {A3} keep the route findable, and {B1}, {B2}, and {B3} make it worth following.',
    weave: 'The marker matters because the woods keep opening.',
    note: 'Trail reserve override removes route-has/walk-has rhythm and lets the signs serve the landscape reveal.',
  },
  'threadline-2027-12-04-theater': {
    domain: 'theater',
    title: 'Clear Air',
    leadTemplate: 'The theater has {A1}, {A2}, and {A3} while the seats wait for {B1}, {B2}, and {B3}.',
    weave: 'The hush belongs to everyone before the line.',
    note: 'Theater reserve override removes nonblank QUIET repetition and keeps the audience/audible-cue relationship concise.',
  },
  'threadline-2027-12-04-rooftop': {
    domain: 'rooftop',
    title: 'The City Slows Below',
    leadTemplate: 'From the roof, {A1}, {A2}, and {A3} sit above a city of {B1}, {B2}, and {B3}.',
    weave: 'The roof lets the city exhale.',
    note: 'Rooftop reserve override removes nonblank LIGHT repetition and keeps the height/city payoff intact.',
  },
  'threadline-2026-09-13-workshop': {
    domain: 'workshop',
    title: 'The Fault In View',
    leadTemplate: 'Under the bench lamp, the {A1}, {A2}, and {A3} face a loose {B1}, a split {B2}, and a rough {B3}.',
    weave: 'A good repair begins by finding the fault.',
    note: 'Workshop puzzle-id override removes the call-for-tools rhythm and makes the damage/tool relationship feel observed without a stock proximity phrase.',
  },
  'threadline-2027-07-09-apothecary': {
    domain: 'apothecary',
    title: 'Care In Small Bottles',
    leadTemplate: 'Careful hands {B1} the {A1}, {B2} the {A2}, and {B3} the {A3} before anyone takes a dose.',
    weave: 'Medicine earns trust before the dose.',
    note: 'Apothecary puzzle-id override removes sit-plainly/hold-back phrasing and gives each process a direct object.',
  },
  'threadline-2027-11-05-apothecary': {
    domain: 'apothecary',
    title: 'Quiet Measure',
    leadTemplate: 'Under shelf light, {A1}, {A2}, and {A3} share the counter as careful hands {B1}, {B2}, and {B3}.',
    weave: 'A remedy begins as measured attention.',
    note: 'Apothecary puzzle-id override removes holds-around/open-room phrasing and keeps the remedy payoff focused.',
  },
  'threadline-2027-09-23-radio-booth': {
    domain: 'radio-booth',
    title: 'Late Night Chair',
    leadTemplate: 'Behind the glass, {A1}, {A2}, and {A3} sit near the mic as the producer cues {B1}, {B2}, and {B3}.',
    weave: 'A small room can travel farther than walls.',
    note: 'Radio-booth puzzle-id override removes producer-works-through scaffolding and keeps the outward-sound payoff.',
  },
  'threadline-2027-10-14-tailor': {
    domain: 'tailor',
    title: 'The Hem Comes Close',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} lie under the light while hands {B1}, {B2}, and {B3} the cloth.',
    weave: 'Fit is the moment cloth starts belonging.',
    note: 'Tailor puzzle-id override removes the nonblank TAILOR repeat and keeps the fitting reveal intact.',
  },
  'threadline-2027-08-05-dancehall': {
    domain: 'dancehall',
    title: 'The Middle Brightens',
    leadTemplate: 'At the dancehall, {A1} shoes cross the {A2} in front of the {A3} while dancers {B1}, {B2}, and {B3}.',
    weave: 'A beat gives the room its body.',
    note: 'Dancehall puzzle-id override removes first-light staging and makes the floor/details resolve through dancers already moving.',
  },
  'threadline-2027-07-25-tailor': {
    domain: 'tailor',
    title: 'Pinned And Waiting',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} mark the garment before hands {B1}, {B2}, and {B3}.',
    weave: 'The mirror finds the body inside the cloth.',
    note: 'Tailor puzzle-id override removes keeps-familiar/fill-next-moment scaffolding and resolves payoff reuse.',
  },
  'threadline-2026-09-25-music': {
    domain: 'music',
    title: 'The Count Underfoot',
    leadTemplate: 'In the practice room, a {A1} is tuned, a {A2} is tested, and the {A3} waits for {B1}, {B2}, and {B3}.',
    weave: 'The song arrives when everyone shares time.',
    note: 'Music puzzle-id override removes stand/listening-cue staging and lets rehearsal sound like a real room.',
  },
  'threadline-2027-05-29-tailor': {
    domain: 'tailor',
    title: 'Body In Cloth',
    leadTemplate: 'At the mirror, {A1}, {A2}, and {A3} shift under hands that {B1}, {B2}, and {B3}.',
    weave: 'Cloth claims its shape on the body.',
    note: 'Tailor puzzle-id override removes tell-hands-where phrasing and keeps the garment/body aha direct.',
  },
  'threadline-2027-07-10-apothecary': {
    domain: 'apothecary',
    title: 'The Quiet Remedy',
    leadTemplate: 'The apothecary sets out {A1} for {B1}, {A2} for {B2}, and {A3} for {B3}.',
    weave: 'Care reaches the body one measure at a time.',
    note: 'Apothecary puzzle-id override removes shelf-label staging and gives each remedy object a plain purpose.',
  },
  'threadline-2027-07-15-lighthouse': {
    domain: 'lighthouse',
    title: 'High Glass',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} lift the signal until it can {B1}, {B2}, and {B3}.',
    weave: 'A far light turns danger into direction.',
    note: 'Lighthouse puzzle-id override removes gets-its-shape/wake-the-scene phrasing and keeps the warning payoff.',
  },
  'threadline-2026-05-26-cafe': {
    domain: 'cafe',
    title: 'First Errand',
    leadTemplate: 'At the cafe window, {A1}, {A2}, and {A3} sit near the glass while {B1}, {B2}, and {B3} pass on the block.',
    weave: 'The street is easier after breakfast.',
    note: 'Cafe puzzle-id override removes give-the-block-its-morning phrasing and keeps the inside/outside contrast natural.',
  },
  'threadline-2026-08-04-diner': {
    domain: 'diner',
    title: 'Short Stack Morning',
    leadTemplate: 'At breakfast, {A1}, {A2}, and {A3} fill the booth while {B1}, {B2}, and {B3} ring from the counter.',
    weave: 'Service talk answers while the booth remembers your place.',
    note: 'Diner puzzle-id override removes sit-on-table/calls-out phrasing and makes the counter sound more natural.',
  },
  'threadline-2027-05-07-pottery': {
    domain: 'pottery',
    title: 'Wheel Memory',
    leadTemplate: 'On the wheel, {A1} coats the hands, and the {A2} and {A3} need {B1}, {B2}, and {B3}.',
    weave: "The kiln keeps the hand's pressure.",
    note: 'Pottery puzzle-id override removes show-where-hands phrasing and keeps the clay/form/process relationship tactile.',
  },
  'threadline-2027-10-30-chessboard': {
    domain: 'chessboard',
    title: 'Silent Room',
    leadTemplate: 'On the board, {A1}, {A2}, and {A3} make the position tense while {B1}, {B2}, and {B3} change the line.',
    weave: 'A quiet table can make danger feel loud.',
    note: 'Chessboard puzzle-id override removes open-out-under-pressure phrasing and resolves payoff reuse.',
  },
  'threadline-2027-10-02-laboratory': {
    domain: 'laboratory',
    title: 'Evidence In Hand',
    leadTemplate: 'At the lab table, technicians {B1} the {A1}, {B2} the {A2}, and {B3} the {A3}.',
    weave: 'A careful method lets wonder leave a mark.',
    note: 'Laboratory puzzle-id override removes notebook-names phrasing and gives heat, analyze, and track direct objects.',
  },
  'threadline-2026-12-30-clean-slate': {
    domain: 'clean-slate',
    title: 'Quiet Plan',
    leadTemplate: 'On the clean desk, the {A1} starts a {B1}, the {A2} starts a {B2}, and the {A3} card saves a {B3} for later.',
    weave: 'Order is how a blank day becomes usable.',
    note: 'Clean-slate puzzle-id override removes keep-visible phrasing and makes the planning nouns feel like ordinary desk work.',
  },
  'threadline-2027-01-25-rooftop': {
    domain: 'rooftop',
    title: 'The Last Bright Edge',
    leadTemplate: 'At the roof rail, {A1}, {A2}, and {A3} hold the last light while the street below sinks into {B1}, {B2}, and {B3}.',
    weave: 'The roof gives hurry nowhere to go.',
    note: 'Rooftop puzzle-id override replaces slip-into staging with a quieter street-level sentence and a sharper height payoff.',
  },
  'threadline-2027-08-29-chessboard': {
    domain: 'chessboard',
    title: 'The Square Turns Dangerous',
    leadTemplate: 'At the table, {A1}, {A2}, and {A3} make the position tense while {B1}, {B2}, and {B3} crowd the next move.',
    weave: 'The quiet gets sharp before anyone moves.',
    note: 'Chessboard puzzle-id override removes gather-under-pressure phrasing and keeps tactics tied to the next move.',
  },
  'threadline-2027-10-08-chessboard': {
    domain: 'chessboard',
    title: 'Next Move',
    leadTemplate: 'On the board, {A1}, {A2}, and {A3} make the position tense while players {B1}, {B2}, and {B3}.',
    weave: 'The room tightens before the hand moves.',
    note: 'Chessboard puzzle-id override replaces move-under-pressure phrasing and resolves payoff reuse.',
  },
  'threadline-2027-10-31-chessboard': {
    domain: 'chessboard',
    title: 'The Quiet Square',
    leadTemplate: 'On the board, {A1}, {A2}, and {A3} make the position tense while {B1}, {B2}, and {B3} crowd the next move.',
    weave: 'Silence makes the threat bigger.',
    note: 'Chessboard puzzle-id override removes chessboard-in-title bluntness and keeps the threat concrete.',
  },
  'threadline-2027-11-15-clockshop': {
    domain: 'clockshop',
    title: 'Clockshop Counter Awake',
    leadTemplate: 'The glass counter gathers {A1}, {A2}, and {A3} while the repairer listens for {B1}, {B2}, and {B3}.',
    weave: 'Small time learns to speak on the counter.',
    note: 'Clockshop reserve override removes make-time-feel-close phrasing and gives the time motions an audible repair context.',
  },
  'threadline-2027-09-24-clockshop': {
    domain: 'clockshop',
    title: 'Wound Morning',
    leadTemplate: 'In the clockshop, {A1}, {A2}, and {A3} lie open while the repairer listens for {B1}, {B2}, and {B3}.',
    weave: 'The hour comes back as sound.',
    note: 'Clockshop puzzle-id override removes let-the-hour-speak phrasing and gives the sounds a repairer listening for them.',
  },
  'threadline-2027-08-04-tailor': {
    domain: 'tailor',
    title: 'A Better Fit',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} wait under the lamp while hands {B1}, {B2}, and {B3} the cloth.',
    weave: 'The mirror turns cloth into yours.',
    note: 'Tailor puzzle-id override removes quiet-part/wake-the-scene scaffolding and gives the fitting verbs a shared object.',
  },
  'threadline-2027-12-20-rooftop': {
    domain: 'rooftop',
    title: 'Rail In Gold',
    leadTemplate: 'From the roof, {A1}, {A2}, and {A3} frame a city with {B1}, {B2}, and {B3} below.',
    weave: 'Up high, the city lets the day go.',
    note: 'Rooftop reserve override removes city-of phrasing and keeps the height/evening payoff.',
  },
  'threadline-2027-02-09-market': {
    domain: 'market',
    title: 'Friendly Change',
    leadTemplate: 'At the stall, {A1}, {A2}, and {A3} heap in the crates as shoppers {B1}, {B2}, and {B3}.',
    weave: 'The hand chooses before the bag gets heavy.',
    note: 'Market puzzle-id override replaces basket-shows abstraction with a tactile choice-to-bag payoff.',
  },
  'threadline-2027-04-20-station': {
    domain: 'station',
    title: 'A Room Held Open',
    leadTemplate: 'Travelers read {A1}, {A2}, and {A3} first, then settle back into {B1}, {B2}, and {B3}.',
    weave: 'Departure needs signs; waiting needs habits.',
    note: 'Station puzzle-id override keeps the station-signs/waiting-habits bridge concise and concrete.',
  },
  'threadline-2027-07-08-vineyard': {
    domain: 'vineyard',
    title: 'Rows Of Patience',
    leadTemplate: 'In the vineyard row, {A1}, {A2}, and {A3} hold the season before workers {B1}, {B2}, and {B3} toward the bottle.',
    weave: 'Patience is the flavor the row was keeping.',
    note: 'Vineyard puzzle-id override removes nonblank CELLAR repetition and keeps harvest work pointed toward wine.',
  },
  'threadline-2027-08-02-lighthouse': {
    domain: 'lighthouse',
    title: 'The Beam Waits',
    leadTemplate: 'Above the water, {A1}, {A2}, and {A3} face the dark as the keeper sets {B1}, {B2}, and {B3} into motion.',
    weave: 'The coast trusts a light it can read.',
    note: 'Lighthouse puzzle-id override removes beam-can verb chaining and gives the coast/light relationship a clearer human payoff.',
  },
  'threadline-2027-08-13-tailor': {
    domain: 'tailor',
    title: 'The Fit Gets Closer',
    leadTemplate: 'At the fitting mirror, {A1}, {A2}, and {A3} stay in the light while hands {B1}, {B2}, and {B3} the garment.',
    weave: 'The garment becomes personal by degrees.',
    note: 'Tailor puzzle-id override removes nonblank TAILOR repetition and gives the alteration verbs a shared object.',
  },
  'threadline-2027-09-29-planetarium': {
    domain: 'planetarium',
    title: 'The Ceiling Travels',
    leadTemplate: 'In the dark room, {A1}, {A2}, and {A3} appear overhead while the show adds {B1}, {B2}, and {B3}.',
    weave: 'A ceiling can become a departure.',
    note: 'Planetarium puzzle-id override removes nonblank DOME repetition and keeps the room-to-sky reveal.',
  },
  'threadline-2027-10-04-lighthouse': {
    domain: 'lighthouse',
    title: 'Height Made Useful',
    leadTemplate: 'Inside the tower, {A1}, {A2}, and {A3} hold the warning while the light can {B1}, {B2}, and {B3}.',
    weave: 'Light carries care over water.',
    note: 'Lighthouse puzzle-id override removes nonblank STAIR repetition and strips out move-the-hour phrasing.',
  },
  'threadline-2027-07-12-firehouse': {
    domain: 'firehouse',
    title: 'Fast Help',
    leadTemplate: 'Before the alarm, {A1}, {A2}, and {A3} are checked so the crew can {B1}, {B2}, and {B3}.',
    weave: 'Help is practiced before it is needed.',
    note: 'Firehouse puzzle-id override breaks the repeated before-the-bell drill rhythm and keeps readiness human.',
  },
  'threadline-2027-08-31-firehouse': {
    domain: 'firehouse',
    title: 'Quiet Urgency',
    leadTemplate: 'In the bay, {A1}, {A2}, and {A3} are checked before the crew can {B1}, {B2}, and {B3}.',
    weave: 'Urgency has a quiet rehearsal.',
    note: 'Firehouse puzzle-id override breaks the repeated before-the-bell drill rhythm and varies the readiness payoff.',
  },
  'threadline-2027-10-30-firehouse': {
    domain: 'firehouse',
    title: 'On Call',
    leadTemplate: 'In the bay, {A1}, {A2}, and {A3} are checked before the crew has to {B1}, {B2}, and {B3}.',
    weave: 'Readiness is courage before the bell.',
    note: 'Firehouse puzzle-id override resolves payoff reuse and keeps the action verbs in a human drill sentence.',
  },
  'threadline-2027-10-16-airport': {
    domain: 'airport',
    title: 'Public Leaving',
    leadTemplate: 'In the departure hall, {A1} waits by the {A2}, a {A3} rides in the hand, and travelers {B1}, {B2}, and {B3}.',
    weave: 'Leaving becomes public before it becomes flight.',
    note: 'Airport puzzle-id override removes the repeated GATE answer from the lead and keeps the final weave off answer anchoring.',
  },
  'threadline-2027-10-21-printshop': {
    domain: 'printshop',
    title: 'The Street Can Read',
    leadTemplate: 'In the printshop, {A1}, {A2}, and {A3} wait under the lamp while workers {B1}, {B2}, and {B3} the page.',
    weave: 'Printed language has a useful weight.',
    note: 'Printshop puzzle-id override removes the nonblank press repeat while keeping the type-to-public-page aha.',
  },
  'threadline-2027-10-26-lighthouse': {
    domain: 'lighthouse',
    title: 'Keeper At Dusk',
    leadTemplate: 'On the stair, {A1}, {A2}, and {A3} face the dark while the beam can {B1}, {B2}, and {B3}.',
    weave: 'The coast trusts warning before danger is close.',
    note: 'Lighthouse puzzle-id override replaces a spoiler title and keeps the warning/coast reveal theme-level.',
  },
  'threadline-2027-10-30-newsroom': {
    domain: 'newsroom',
    title: 'Proof Before Print',
    leadTemplate: 'The {A1}, {A2}, and {A3} stay on the page as editors keep the story {B1}, {B2} the source, and {B3} the copy.',
    weave: 'News becomes public only after care.',
    note: 'Newsroom puzzle-id override fixes the factual/question/file grammar and gives the reporting moves concrete objects.',
  },
  'threadline-2027-12-21-cafe': {
    domain: 'cafe',
    title: 'Street At The Window',
    leadTemplate: 'By the cafe window, {A1}, {A2}, and {A3} stay near the cup while a {B1}, a {B2}, and the {B3} move beyond the glass.',
    weave: 'Morning reaches the counter from the street.',
    note: 'Cafe reserve override removes gets-personal phrasing and keeps inside-counter details connected to the street outside.',
  },
};

export function normalizeThreadlineEditorialTokenText(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isThreadlineRoboticTitle(title: string): boolean {
  return ROBOTIC_TITLE_PATTERNS.some((pattern) => pattern.test(title.trim())) ||
    GENERIC_FALLBACK_TITLE_PATTERN.test(title.trim()) ||
    CONTEXTUAL_FALLBACK_TITLE_PATTERN.test(title.trim()) ||
    BROAD_FALLBACK_TITLE_PATTERN.test(title.trim());
}

export function isThreadlineMechanicalWeave(weave: string): boolean {
  return /^(between|by the time|what starts with|with)\b/i.test(weave.trim()) ||
    /\b(first [a-z]+, then [a-z]+|start with|listen for|now you are at)\b/i.test(weave.trim()) ||
    /\bholds [a-z]+ beside [a-z]+\b/i.test(weave) ||
    /\bgives [a-z]+ its cue\b/i.test(weave) ||
    /\b(the whole .+ is hiding between|in miniature|need each other|gives .+ its place|gives it its motion)\b/i.test(weave) ||
    /\b(make .+ click|finally reads as one scene|works because|are the handoff|resolves when|lands when|sets the scene|changes it|shared place|appears between|make the connection visible|what you can point to|still detail|live one|scene turns on)\b/i.test(weave) ||
    /\b(has a voice|has a path|refuses to sit still|asks you to do|is already implied|starts? to feel|becomes readable|becomes legible)\b/i.test(weave) ||
    /\b(fills the wait|keeps you walking|makes it an afternoon|tells people what to do|sends it moving again|makes the room lean in|is why you sat down|where it is|weather becomes logistics|gives shore finds|feel human when|becomes company by traveling|is a promise to leave|finishes the dark|slow taste begins|edge keeps changing|wall keeps changing|becomes human at|never just a pile|learns its place|teaches waiting habits)\b/i.test(weave) ||
    /\b(works? (?:where|when)|meets?|where [^.?!]+ meet|(?:begins|lives|settles|pauses|wakes|gathers|improves) where|feels human where)\b/i.test(weave) ||
    /\bbecomes? [^.?!]+ through\b/i.test(weave) ||
    /\bmakes? [^.?!]+ feel\b/i.test(weave) ||
    /\b(stage details|audience cues|packed things|park motions|repair clues|lab pieces|bench steps|art details|visitor moves|stall goods|buyer moves|path details|passing routines|trail signs|natural details|book details|quiet habits|classroom objects|starting signals|first-hour work|fabric details|wash-day moves|lens pieces|sky motions|skyline details|evening motions|news pieces|press moves|type pieces|beacon pieces|tower pieces|coast cues|shore finds|water motion|camp gear|camp moves|growing things|tending moves|doorstep details|street signals|neighbor signals|doorstep objects|evening cues|porch details|bright-night motions|dome sights|show cues|ceiling sights|sky sights|case treats|shop motions|counter details|street cues|weather gear|route cues|paper trails|delivery steps|dock objects|boat motions|instrument details|listening cues)\b/i.test(weave) ||
    /\bis [a-z -]+ plus [a-z -]+[:.]/i.test(weave) ||
    /\b(stillness|nudge|scenery|noise|foreground|doing the same job|opposite sides|just an object|just an action|matters because|less quiet|hunger gets specific|depends on all that motion|make the draft visible|make the first idea visible|turns wanting into choosing|turns appetite practical|turns sugar into (?:a plan|a choice)|turns waiting into breakfast|line ends where hunger gets named|ordinary work makes order visible|work is ordinary and merciful|can be reset by small care|makes waiting practical|gets kinder as the shape settles|gets kinder when the coast can read|silence becomes part of the artwork|finger on the glass makes breakfast specific|box gives breakfast a handle|room becomes inward around the page|shelf becomes useful when the room starts moving|desk becomes useful when the day gets specific|room gets one fresh ending|quiet turns a room into a show|first minutes turn the room into class|(?:broken edge|nick) can make the whole room practical|above traffic,? evening becomes gentle|public room can become one quiet place|room turns waiting into arrival|warm box makes the morning sweeter|dome turns waiting into wonder|room gets larger when sound leaves it|music makes the room visible|small room gives the voice longer reach|care turns a heap back into a home|breakfast feels chosen before the box closes|turns supplies into a (?:class|morning)|a fire gives the wild a room|fabric leaves the wash folded and warm|forecast shifts|the water turns the tank into weather|puts appetite|gets personal|market morning is made of small decisions|gives idle minutes|makes change visible|counter turns minutes|hour gets measured|wonder gets believable|gives attention somewhere to rest|table leaves room for|good path earns its view|pile comes back as clothes|morning gets personal|turns supplies toward|turn materials into)\b/i.test(weave) ||
    /\b(soft care gives the day its shape back|the day gets real|art turns a pause into attention|the loop turns motion into neighborhood|the day gets greener where care repeats|the day gets less abstract|shape gets personal|wanting becomes practical|distance becomes practical|the water gives the rail a reason|quiet work gives green its confidence|desk turns scattered work|repair begins when the damage gets specific|a room gets quiet enough for distance|gives breakfast a regular|last light makes distance kind|the door gives the room its purpose|marks turn the table toward shape|the meal gets real|gentle work gives the shelf its purpose|a deadline can make doubt useful|desk order gives the work|wonder becomes evidence one careful step|the gate wakes when the sky gets close|a quiet counter can make time present|a fix begins where the damage speaks|doubt gives the day|low water gives the sand|box closes on the thing|supper begins before the pan|a rehearsal turns patience|the roof opens and the room looks|breakfast gets chosen|small work gives the season somewhere|the breath before open water|turns separate ingredients toward supper|one chosen sweetness|tells the room what the supplies are for|makes sound by agreeing on time|stops being work|starts with a choice under glass|materials stop being separate|far sky feels near|memory it cannot keep|teaches looking to slow down|the city softens from above|care makes wonder useful|street sounds farther away|noise becomes evening|curiosity slowed down|hand leaves something the fire can keep|story earns trust before daylight|care made measurable|alarm gives readiness|alarm gives the room|distance becomes care|pressure stays after the clay hardens|every stop becomes borrowed shelter|a flaw decides which tool feels right|sky gets counted where instruments wait|measurement gives tomorrow a little warning|a measured sky warns early|station listens through instruments and forecast shifts|instruments turn pressure into forecast shifts|a remedy is care measured small|the pile comes back ready|the pile returns as something wearable|ready for drawers|ready to be worn|ready for ordinary use)\b/i.test(weave);
}

export const THREADLINE_RECENTLY_RETIRED_LEAD_COPY =
  /\b(inside the (?:remedy|fitting|story|copy|pressure)|(?:sit|sits|sitting|gather|gathers|gathering|collect|collects) inside the|make the dark gentler|soften the dark|matter as much as|point them toward a door|cover the desks|sit beside notes to|wait beside|follow the trip|make it easier to|make the raincoat matter|turns? a mess into|stay paper|everyone is thinking about|someone starts [a-z]+ing, [a-z]+ing, and [a-z]+ing|bees keep [a-z]+ing, [a-z]+ing, and [a-z]+ing|give (?:them|it) a route|sit quietly before|wait until [a-z]+ing, [a-z]+ing, and [a-z]+ing|meet hands that|from [a-z]+ to [a-z]+ to [a-z]+|close enough for|afterward [a-z]+, [a-z]+, and [a-z]+ begin|route is real|share the bench with notes|make the choice harder|take [^.]+ from the shelf to|move toward supper through|keeps? [^.]+ close, with|ordinary weight|make(?:s)? sense through|less obvious corner|call asks for|change the room around them|do the plain work|add (?:another turn|the local detail)|break the trip into steps|set out for|turn into supper by|go through [a-z]+ing, [a-z]+ing, and [a-z]+ing before|hold the quiet (?:while|before)|put (?:the )?[a-z]+ to work|help someone [a-z]+, [a-z]+, and [a-z]+|bring voices to the desks|lights rise on|curtain lifts on|terminal window|careful test keeps|notes turn toward|put it back to use|board asking travelers|close enough to touch|begin the work|decide the way home|way home runs through|make the room answer|line up with the loose|land in carrier piles after|are tuned for [a-z]+ing, [a-z]+ing, and [a-z]+ing overhead|point toward [a-z]+ing, [a-z]+ing, and [a-z]+ing overhead|make the night's [a-z]+ing, [a-z]+ing, and [a-z]+ing watchable|help a watcher follow|coffee is [a-z]+ing, leaves are [a-z]+ing, and someone is [a-z]+ing|kindling coffee|roasting leaves|stirring bags|script ready as|line up beside a loose|ready for the first count, sort, and review|need logging, batching, and stacking before|promise the cellar|begin with fruit that can|keep the order undecided|sit beside directions to|face a house gathering|are in place while the house gathers|settle the choice|pottery wheel holds|sit near the kiln|add motion to the quiet|hands (?:that )?[a-z]+ing, [a-z]+ing, and [a-z]+ing|lighthouse stair settles around|stay on the stair|at the dancehall floor|swarm hang near|reporters keep factual|a walk by|the first mile has|the forecast has [^.?!]+ by the door and the route has|bring the train close|share the table with|stay close while hands|hands are [a-z]+, [a-z]+, and [a-z]+|keep people close|fill the room|ready for one|come back through|come back after|pass through [^.?!]+ before the drawer|make room for|make the dark practical|sit on the shelf|by way of|give the morning voices|turn camp into a room|pass through the seats|ready for a carrier|ready for the kiln|hold the stage|make every choice sweeter|stay under their hands|raise the questions|for one [a-z]+, one [a-z]+, and one [a-z]+|clerks keep [a-z]+ing, [a-z]+ing, and [a-z]+ing|sit beside a loose [a-z]+, a split [a-z]+, and a rough [a-z]+|forecast shifts toward|answers through|reports report|pressure keeps reveal|skies (?:update|gusting)|gusts keep thaw|swing wind|warn pressure|drizzle wind|and a clear|make a clear beginning|add a little weight|pile feels wearable|water keeps [a-z]+ing, [a-z]+ing, and [a-z]+ing|can disappear before|make people linger over|short list:|card sit beside|change under hands that|matching gathers the|pressing flattens|steaming softens|sit stranded where|someone is [a-z]+ing from the|from the seats come|seats answer with|sit beside the [a-z]+, [a-z]+, and [a-z]+ that need them|starts the sort|clerks are [a-z]+ing the|meet a house full of|are in place, and the house settles|someone is filling, frosting, and sampling|wait under the lamp while reporters|paddle a foot into place|keep the first quiet|sit beside notes for|sit beside a plan to|sit beside the work to|are still separate before|move through the dark|is paired with|collars need [a-z]+ing|jerseys need [a-z]+ing|stays packed once|left on the sand as the water goes on|find their mates|leads toward [a-z]+ and [a-z]+ as hands|keep still|keeps? changing|visible seats|stay in the room after that|do the directing|by the first turn|carry it onward|pressure can watch|gather in the flight path|afternoon becomes|room slows into|put them right|in the hands|quiet turns into|work moves into|come out warm from|forgotten once|left on sand marked by|breaks into a|hands ferment, prune, and taste|slow the line|gather below|give time a small voice|give visitors reason for|the route has|the walk has time for|the booth has the comfort|the counter has the sound|next line lists|tag reading|repair card reading|catch a deepen|come back useful|begin on the page|shape the first sound|with bags open)\b/i;

export function isThreadlineRoboticLead(completedLead: string): boolean {
  return THREADLINE_RECENTLY_RETIRED_LEAD_COPY.test(completedLead) ||
    /\bthe scene moves through\b/i.test(completedLead) ||
    /\b(a second look finds|look again|come into focus a moment later)\b/i.test(completedLead) ||
    /\b(close at hand|the moment turns toward|are already there|wait for dark|the night gathers around)\b/i.test(completedLead) ||
    /\b(sit in plain sight|stay up front|gather farther back|wait (?:a little )?farther in|farther out are|where the eye lands|wait where the place opens|stay nearest|sit nearest|nearest part)\b/i.test(completedLead) ||
    /\b(are the still things|hold the still part|make a small still life|make the pause|make the stillness useful|carry the moving part|make it breathe|break it open|bring the shift|point it onward|start the action)\b/i.test(completedLead) ||
    /\b(close by|close to hand|the turn is|come after them|take it from there)\b/i.test(completedLead) ||
    /\b(make the room busier|make the quiet busier|complete the view|make a small inventory|make it less empty|make the place recognizable|make it particular|make the place easy to enter|make it worth staying|make the place tangible|make it move|keep the day moving|keep things going|keep it moving|keep it active|keep the room busy|keep the moment moving|keep the hour alive|keep moving)\b/i.test(completedLead) ||
    /\b(catch your eye|visitor lingers over|visitor slows for|a visitor (?:begins|stops|pauses|starts|chooses|has time|takes time|takes a moment) to|hold the first look|attention settles on|slower look finds|looking slows around|another pass finds|keeps returning|attention drifts toward|trail is marked by|path is marked by|woods answer with|mark the way|walk opens toward|walk finds|path offers|day keeps offering|keep the route clear)\b/i.test(completedLead) ||
    /\b(recipe calls for|recipe line|dinner turns toward|the cook turns (?:next )?to|cook goes on to|the water starts to|the water begins to|the edge begins to|the shoreline begins to|the tide starts to|shoreline keeps moving through|station platform points|tell people when to move|fill the waiting|put the trip in view|travelers pass|soften the wait|fill the pause|waiting gathers around|work waits in|tell the day where to begin|surface toward work|first real task|workday its first shape|the beds are bright with|the day's work is|morning work is|beyond it, the work is|garden path shows|morning is for|hands move through|room settles into|afternoon moves through|hour moves through|work is mostly|washday has|line moves through|slow the line into|counter turns busy|breakfast becomes|order takes shape through|line pauses over|morning waits on|order moves through|before long, .+ take over|by noon, .+ take over|morning opens toward|next hour turns toward|day turns to|rail is busy with|cut into the sky|fill the hour|settle over the evening|hold the skyline|looks out past|rail looks out on|fill the view|high rail looks past|front step keeps|hold the house in place|porch light catches|turn the step toward|set the edge of the house|house is ready with|hold the light|carry the street|turn the doorway outward|pull the door into|front edge has|bring the block close|the water calls for|the water wants|leaving will mean|morning is headed for|the day leans toward|fill the spare minutes|keep the route legible|the way out runs through|arrive next|arrives next|follow after|the first task arrives as|the work behind it is|the quiet work is|the first sound waits for|the room's first signs are|the room's first cues are|soon the room has|the next hour is|the work turns to|the room turns toward|the first signs outside are|the first signs from the block are|the first signs from the street are|the counter is already calling out|by the time the server brings|make the work concrete|people pass the wait with|soon they are|by noon they are|soon the crew is|the evening turns to|the hour turns to|after dark come|after dusk|evening moves through|campsite opens around|are unpacked|the clerk starts to|the clerk can|the operator starts to|the operator begins to|the voice begins to|the operator can|the voice can|signal is shaped by|signal takes shape through|give the first sound its shape)\b/i.test(completedLead) ||
    /\bhour fills with\b/i.test(completedLead) ||
    /\b(next hour gathers|small work of|the room finds|day fills with|morning fills with|feels made from|keep it from feeling empty|keep the beach brief|first hour is full|night fills with|firelight settles over|keep going through|glass catches|room steadies itself|broadcast goes out|counter turns to|order becomes|make the first idea visible|make the draft visible|take the boat out|counter handles|rehearsal gathers around|settle into [a-z]+ing|bring the draft into view|give the quiet shape|keep the fire tended|keep the sand unsettled|wait for [a-z]+ing, [a-z]+ing, and [a-z]+ing|wait while|sit close while|look ready while|decide what (?:goes|leaves)|make breakfast specific|visit becomes|draws its outline|hour is spent|keeps the room busy|are what rehearsal is for|give the first hour its shape|works through|wait beyond the rail|make the wait sweet)\b/i.test(completedLead) ||
    /\b(picnic blanket|on the blanket|across the blanket|blanket holds|blanket is set|spread out|lunch is set out with|make lunch visible|make a table|after a few minutes|afternoon loosens|afternoon calls for|beyond it are|park adds|afternoon gathers around|park keeps .+ in the day|leaves room for|day has room for|park is easy with|afternoon keeps .+ close|lunch has|the grass is ready for|the food is simple|the park gives)\b/i.test(completedLead) ||
    /\b(onstage|before the curtain|house lights|in the house|out front|people in the seats|stage is set|stage has|audience sits with|room begins to|audience brings|room leans toward|room is full of|room answers with|room gives back)\b/i.test(completedLead) ||
    /\b(workbench|lab bench|bench light|bench holds|bench is ready|sit ready|are laid out|repair turns|repair note names|damaged piece shows|loose part shows|broken part points|small problem shows itself|test calls for|test turns to|result turns on|question narrows around|experiment turns on|answer gathers around|fix comes down to|repair needs|thing to solve|notebook fills with|work follows)\b/i.test(completedLead) ||
    /\b(you notice|starts with|begins with|at first glance|first layer|second layer|first small facts|first clues|other clues)\b/i.test(completedLead) ||
    /\b(within reach|in reach|are closest; the rest of the scene|make an easy first read|scene texture|make the scene fuller|make the scene legible)\b/i.test(completedLead) ||
    /\b(keeps up with|answers with|wait quietly|outside are|outside,? the block|front step has|porch light falls|seats hold|from (?:the )?(?:block|street|sidewalk|counter) come)\b/i.test(completedLead) ||
    /\b(will [a-z]+, [a-z]+, and [a-z]+|has to [a-z]+, [a-z]+, and [a-z]+|is there to [a-z]+, [a-z]+, and [a-z]+|work is to [a-z]+, [a-z]+, and [a-z]+|it is time to [a-z]+, [a-z]+, and [a-z]+|asks? (?:the )?[a-z]+ to [a-z]+, [a-z]+, and [a-z]+|moves next to|moves? on to|hiding in|depends on)\b/i.test(completedLead) ||
    /\bnear (?:near|along|on|in|inside|outside|toward|by|around|at)\b/i.test(completedLead) ||
    /\b(hold the room steady|pull the edges wider|hold the practical side|make the place feel particular|make the room recognizable|the rest leans on|steady the room|make it feel inhabited|settle the eye|stir the moment|hold the ordinary ground|change the air|settle first|turn the page|fill out the edges|fill the quiet edges|hold the front of the moment|collect around the edges|make the place feel lived in|round out the room|nearest edge|farther part|finish the picture|give the (?:place|moment|day|room|work|rest)|pull the place forward|keep the day from (?:staying still|stopping)|keep the room from stopping|carry the day forward|keep the scene awake|keep the moment close|send it forward|make the day shift|carry the room past them|loosen it|give the stillness a turn)\b/i.test(completedLead) ||
    /\baround .+, .+ while the scene\b/i.test(completedLead) ||
    /\bholds still as\b/i.test(completedLead) ||
    /\bgets its shape when\b/i.test(completedLead) ||
    /\bthen [a-z]+, [a-z]+, and [a-z]+ (?:at|in|on|near|inside|outside|toward|by|around)\b/i.test(completedLead) ||
    /^with\b/i.test(completedLead.trim()) ||
    /\b[a-z]+, [a-z]+, and [a-z]+ belong (?:at|in|on|near|inside|outside|toward|by|around)\b/i.test(completedLead) ||
    /\bgives you [a-z]+, [a-z]+, and [a-z]+ .+ and [a-z]+, [a-z]+, and [a-z]+/i.test(completedLead) ||
    /\b(someone can|hands know how|give the eye somewhere else to land|the next motion is to)\b/i.test(completedLead) ||
    /\b(has a job|has a voice|doing real work|comes alive when|holds together because|nothing in .+ feels random|what changes it is just as specific|starts as details and becomes motion|built in order|two movements|belong with|read as|first family|second family|two plain vocabularies|can be named|sort .+ forcing|show up as|come through as|arrive as)\b/i.test(completedLead) ||
    /\b(warmer|sitdown|fogbound|lockup|platen|stellar|skyward|recedes|clouding|seaward|aiming|marking|cueing|ducking)\b/i.test(completedLead) ||
    /\b(already part of the setting|show what the setting is becoming|what changes the moment|second shape|two sets|two kinds of evidence|part with momentum|same thought|the answer starts|thing in motion|temperature of the room)\b/i.test(completedLead) ||
    /\b(stay close to the cup|the table has|a regular table has)\b/i.test(completedLead) ||
    /\b(water stream|shift the scene|move the scene onward|drills for [a-z]+, [a-z]+, and [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ find the beat|shape an hour of|carry the evening|plan is to|notes settle on|drills? to [a-z]+, [a-z]+, and [a-z]+|make the room look ready|room look ready|make the next move|make the turn|hour goes out with|bring the room alive|house answers with|point farther on)\b/i.test(completedLead) ||
    /\b(the first desks have|the morning has|the room slows around|attention turns to|the day steadies itself|the day leans into|the morning turns to|the boat turns to|the page waits with|show where hands should go|give breakfast its rhythm|the hour softens into|the back room handles|the room warms into|gather in a corner|point past the pause|wait while shoppers|visitors keep|room is just|waiting for|wait for|counter work is|shape the first run|the rest is|makes a place|settle into the rest|mailroom shelf has|back room hums|are ready before|room agrees to listen|stay close before the trip becomes|are still separate when|tempt the line while|cover the desks, and after it|give the run a count|move one choice into paper|first decisions|wait as|cross the night|mark the sand while|long enough for|show where the fix begins|carry the room onward|broadcast runs on|water ahead means|come back from .* ready|keep the line looking|stay close to the eye|people keep|on the page are|are ready as|give the room a sound|city below becomes|protocol says|work moves toward|near the surface|finish the thought|sitting toward|first, then lets|has room for|same quiet|rest of the moment calls|hands slipping|signal is built from|move the work along|keep the room in motion|signal leaves with|add the next turn|enter the day|carry the hour|move the day along|give the scene another pulse|fill the back of the scene|ready for a morning of|hold the view|show what clay can become|notes say|screens say|wait for hands to|sit ready for)\b/i.test(completedLead);
}

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function placeWithoutArticle(place: string): string {
  return place.replace(/^the\s+/i, '');
}

function normalizedTokens(copy: string): string[] {
  return normalizeThreadlineEditorialTokenText(copy)
    .split(' ')
    .filter((token) => token.length > 2 && !TOKEN_STOP_WORDS.has(token));
}

function isTitleSpoiler(context: ThreadlineEditorialContext, title: string): boolean {
  const titleTokens = normalizedTokens(title);
  const answerTokens = new Set(context.words.map((word) => normalizeThreadlineEditorialTokenText(word.answer)));
  const threadTokens = new Set(context.threads.flatMap((thread) => normalizedTokens(`${thread.name} ${thread.clue}`)));
  return titleTokens.some((token) => answerTokens.has(token) || threadTokens.has(token));
}

function contextualTitleCandidates(context: ThreadlineEditorialContext): string[] {
  const placeTitle = titleCase(context.place);
  const originalTitle = titleCase(context.originalTitle);

  return [
    `${placeTitle} Before Opening`,
    `${placeTitle} After Opening`,
    `${placeTitle} Just Before`,
    `${placeTitle} Gets Ready`,
    `${placeTitle} Before The Rush`,
    `${placeTitle} While It Waits`,
    `${placeTitle} Near The Start`,
    `At ${placeTitle}`,
    `Inside ${placeTitle}`,
    `Near ${placeTitle}`,
    `First Look At ${placeTitle}`,
    `The Quiet Side Of ${placeTitle}`,
    `The Near Side Of ${placeTitle}`,
    `The First Hour At ${placeTitle}`,
    `The Little Wait At ${placeTitle}`,
    `The Usual Place At ${placeTitle}`,
    `A Good Place Near ${placeTitle}`,
    `${originalTitle} Before Opening`,
    `${originalTitle} After Opening`,
    `${originalTitle} Just Before`,
    `${originalTitle} Gets Ready`,
    `${originalTitle} Before The Rush`,
    `${originalTitle} While It Waits`,
    `${originalTitle} Near The Start`,
  ];
}

function getDomainTitleCandidates(context: ThreadlineEditorialContext): string[] {
  const curated = [
    ...(DOMAIN_TITLE_VARIANTS[context.domain] ?? []),
    ...(DOMAIN_TITLE_EXTENSIONS[context.domain] ?? []),
  ];
  const rotatedCurated = rotate(curated, context.dayIndex + context.domain.length);
  const rotatedHumanPhrases = rotate(HUMAN_TITLE_PHRASES, context.dayIndex * 3 + context.domain.length);
  const contextual = rotate(contextualTitleCandidates(context), context.dayIndex + context.copyAttempt);

  const frameCandidates = [
    `A Place To Begin`,
    `Before The Room Opens`,
    `The First Thing Noticed`,
    `Just Enough Light`,
    `A Small Arrangement`,
    `The Usual Question`,
    `Where The Day Starts`,
    `Room For The Next Thing`,
    `${titleCase(placeWithoutArticle(context.place))} Awake`,
    `${titleCase(context.originalTitle)} After Opening`,
  ];

  return [...rotatedCurated, ...contextual, ...rotate(frameCandidates, context.dayIndex), ...rotatedHumanPhrases];
}

function rotate<T>(items: readonly T[], offset: number): T[] {
  if (items.length === 0) return [];
  return items.map((_, index) => items[(index + offset) % items.length]);
}

export function makeThreadlineEditorialTitle(
  context: ThreadlineEditorialContext,
  isFresh?: (title: string) => boolean
): string {
  const candidates = getDomainTitleCandidates(context)
    .map((candidate) => candidate.replace(/\s+/g, ' ').trim())
    .filter((candidate, index, all) => candidate && all.indexOf(candidate) === index)
    .filter((candidate) => !isThreadlineRoboticTitle(candidate))
    .filter((candidate) => !isTitleSpoiler(context, candidate));

  return candidates.find((candidate) => !isFresh || isFresh(candidate)) ?? candidates[0] ?? 'A Small Arrangement';
}

function blank(wordId: string): ThreadlineSegment {
  return { type: 'blank', wordId };
}

function text(value: string): ThreadlineSegment {
  return { type: 'text', text: value };
}

function appendSerialBlanks(segments: ThreadlineSegment[], wordIds: readonly string[]): void {
  segments.push(blank(wordIds[0]), text(', '), blank(wordIds[1]), text(', and '), blank(wordIds[2]));
}

function addLeadList(segments: ThreadlineSegment[], wordIds: readonly string[]): void {
  appendSerialBlanks(segments, wordIds);
}

function presentTense(phrase: string): string {
  const [first = '', ...rest] = phrase.trim().split(/\s+/);
  const irregular: Record<string, string> = {
    bring: 'brings',
    carry: 'carries',
    catch: 'catches',
    crowd: 'crowds',
    dress: 'dresses',
    finish: 'finishes',
    gather: 'gathers',
    give: 'gives',
    keep: 'keeps',
    line: 'lines',
    lower: 'lowers',
    make: 'makes',
    move: 'moves',
    pile: 'piles',
    prepare: 'prepares',
    pull: 'pulls',
    put: 'puts',
    set: 'sets',
    show: 'shows',
    sweeten: 'sweetens',
    teach: 'teaches',
    turn: 'turns',
  };
  const verb = irregular[first.toLowerCase()] ?? `${first}${first.endsWith('s') ? 'es' : 's'}`;
  return [verb, ...rest].join(' ');
}

function threadTakesPluralVerb(thread: ThreadlineEditorialThreadContext): boolean {
  const head = thread.name.toLowerCase().split(/\s+/).at(-1) ?? '';
  if (['gear', 'life', 'motion', 'weather', 'language', 'music', 'care'].includes(head)) return false;
  return head.endsWith('s') && !head.endsWith('ss');
}

function threadVerb(thread: ThreadlineEditorialThreadContext, plural: string, singular: string): string {
  return threadTakesPluralVerb(thread) ? plural : singular;
}

function threadPronoun(thread: ThreadlineEditorialThreadContext): string {
  return threadTakesPluralVerb(thread) ? 'they' : 'it';
}

function threadAction(thread: ThreadlineEditorialThreadContext, action: string): string {
  return threadTakesPluralVerb(thread) ? action : presentTense(action);
}

function sceneNoun(context: ThreadlineEditorialContext): string {
  return placeWithoutArticle(context.place).split(/\s+/).at(-1) ?? 'place';
}

function placeWithArticle(context: ThreadlineEditorialContext): string {
  return context.place.startsWith('the ') ? context.place : `the ${context.place}`;
}

function naturalSubject(context: ThreadlineEditorialContext): string {
  const noun = sceneNoun(context);
  if (/^(room|bench|table|counter|window|door|shelf|path|rail|wall|case|slot|marker|line|booth|bell|light|basket|page|step|leaf|ribbon|spark|dome|glass|desk|shop|board|ring|wheel|mirror|bay|booth|press|station|floor|stair)$/i.test(noun)) {
    return `the ${noun}`;
  }
  return placeWithArticle(context);
}

function sceneAnchors(context: ThreadlineEditorialContext): readonly [string, string] {
  return DOMAIN_SCENE_ANCHORS[context.domain] ?? [`near ${naturalSubject(context)}`, 'where the action starts'];
}

function bridgeSentence(context: ThreadlineEditorialContext): string {
  return `Together, they ${context.actionA} and ${context.actionB}.`;
}

function lowerThreadName(thread: ThreadlineEditorialThreadContext): string {
  return thread.name.toLowerCase();
}

function leadSubject(context: ThreadlineEditorialContext): string {
  return placeWithoutArticle(context.place);
}

function payoffBase(context: ThreadlineEditorialContext): string {
  return context.payoff.replace(/[.!?]\s*$/, '').replace(/^The\b/, 'the');
}

function sceneFrame(context: ThreadlineEditorialContext): ThreadlineSceneFrame {
  return DOMAIN_SCENE_FRAMES[context.domain] ?? {
    firstScene: `${leadSubject(context)} comes into view`,
    secondScene: `${leadSubject(context)} gets its second voice`,
    weaves: [`{A} gives you the place; {b} lets the place answer.`],
  };
}

function formatSceneTemplate(
  template: string,
  context: ThreadlineEditorialContext,
  a: string,
  b: string,
  title = context.originalTitle
): string {
  return template
    .replaceAll('{A}', capitalize(a))
    .replaceAll('{a}', a)
    .replaceAll('{B}', capitalize(b))
    .replaceAll('{b}', b)
    .replaceAll('{title}', title)
    .replaceAll('{place}', placeWithArticle(context))
    .replaceAll('{subject}', leadSubject(context));
}

function addAnswerList(segments: ThreadlineSegment[], wordIds: readonly string[]): void {
  appendSerialBlanks(segments, wordIds);
}

function hasRole(word: ThreadlineEditorialWordContext, role: string): boolean {
  return word.roles.includes(role);
}

function allWordsCanActAsVerbs(words: readonly ThreadlineEditorialWordContext[]): boolean {
  return words.every((word) => hasRole(word, 'verb') && !hasRole(word, 'gerund'));
}

function motionActor(context: ThreadlineEditorialContext): string {
  return DOMAIN_MOTION_ACTORS[context.domain] ?? 'someone';
}

function sentencePlace(context: ThreadlineEditorialContext): string {
  return placeWithArticle(context);
}

function titleCasePlace(context: ThreadlineEditorialContext): string {
  return capitalize(sentencePlace(context));
}

function wordIdsFor(words: readonly ThreadlineEditorialWordContext[]): string[] {
  return words.map((word) => word.id);
}

function addTemplatedLead(
  segments: ThreadlineSegment[],
  template: string,
  firstIds: readonly string[],
  secondIds: readonly string[],
  context: ThreadlineEditorialContext
): void {
  const [anchorA, anchorB] = sceneAnchors(context);
  const replacements: Record<string, () => void> = {
    A: () => addAnswerList(segments, firstIds),
    A1: () => segments.push(blank(firstIds[0])),
    A2: () => segments.push(blank(firstIds[1])),
    A3: () => segments.push(blank(firstIds[2])),
    B: () => addAnswerList(segments, secondIds),
    B1: () => segments.push(blank(secondIds[0])),
    B2: () => segments.push(blank(secondIds[1])),
    B3: () => segments.push(blank(secondIds[2])),
    place: () => segments.push(text(sentencePlace(context))),
    Place: () => segments.push(text(titleCasePlace(context))),
    anchorA: () => segments.push(text(anchorA)),
    anchorB: () => segments.push(text(anchorB)),
    actor: () => segments.push(text(motionActor(context))),
  };

  template.split(/(\{A\}|\{A1\}|\{A2\}|\{A3\}|\{B\}|\{B1\}|\{B2\}|\{B3\}|\{place\}|\{Place\}|\{anchorA\}|\{anchorB\}|\{actor\})/g).forEach((part) => {
    const key = part.match(/^\{(.+)\}$/)?.[1];
    if (key && replacements[key]) {
      replacements[key]();
      return;
    }
    if (part) segments.push(text(part));
  });
}

function leadTemplatesForContext(context: ThreadlineEditorialContext): ThreadlineSentenceTemplateSet {
  const defaultTemplates: ThreadlineSentenceTemplateSet = {
    nounLead: [
      '{Place} shows {A} first while {B} gather {anchorB}.',
      '{Place} keeps {A} close, with {B} sitting {anchorB}.',
      '{Place} opens with {A} before {B} keep the rest in motion.',
      '{Place} has {A} {anchorA} while {B} gather {anchorB}.',
      '{Place} keeps {A} near the front while {B} collect {anchorB}.',
      '{Place} gives room to {A} while {B} settle just beyond them.',
      '{Place} has {A} in the easy light, with {B} gathering {anchorB}.',
      '{Place} has {A} close by because {B} show what the place is for.',
      '{Place} shows {A} first and lets {B} change the scene.',
      '{Place} keeps {A} in the center while {B} settle nearby.',
      '{Place} has {A} on the surface while {B} change what happens next.',
      '{Place} gathers around {A} and leaves room for {B}.',
      '{Place} takes its shape from {A} before {B} add the local detail.',
      '{Place} keeps {A} together with {B} beside them.',
      'At {place}, {A} sit {anchorA} while {B} gather {anchorB}.',
      'In {place}, {A} take the first glance before {B} fill the back of the scene.',
      '{Place} keeps {A} close while {B} change the room around them.',
      '{Place} makes a place for {A} while {B} settle into the rest.',
      '{Place} keeps company with {A} while {B} gather {anchorB}.',
      '{Place} holds onto {A} until {B} put it back to use.',
      '{Place} keeps {A} close while {B} find their place in the work.',
      '{Place} keeps {A} close while {B} add the next turn.',
      'At {place}, {A} make a clear beginning before {B} add a little weight.',
      '{Place} keeps {A} close while {B} gather {anchorB}.',
      '{Place} holds {A} while {B} add motion to the quiet.',
      '{Place} holds {A} while {B} move the work along.',
      '{Place} keeps {A} close while {B} draw the moment inward.',
      '{Place} starts with {A} before {B} change the room around them.',
      '{Place} holds {A} close while {B} open out {anchorB}.',
      '{Place} keeps {A} in the light while {B} settle where the day turns.',
      '{Place} opens with {A} before {B} give it a reason to linger.',
      '{Place} keeps {A} in the light while {B} wait nearby.',
      'At {place}, {A} are close enough to touch while {B} widen the room.',
      '{Place} keeps {A} by the work while {B} sit where the hour opens.',
      '{Place} starts with {A} before {B} give the moment its turn.',
      '{Place} keeps {A} busy {anchorA} while {B} move {anchorB}.',
      '{Place} keeps {A} in view as {B} give the room a shape.',
      '{Place} keeps {A} familiar until {B} fill the next moment.',
      '{Place} has {A} in the open before {B} add another turn.',
      'At {place}, {A} do the plain work while {B} add the local detail.',
      '{Place} has {A} in the visible part as {B} move through the rest.',
      '{Place} gives {A} the visible seats while {B} stay in the room after that.',
      '{Place} keeps {A} close while {B} add the next turn.',
      '{Place} shows {A} on the surface while {B} work underneath.',
      '{Place} has a clear sign in {A} before {B} add another one.',
      '{Place} gathers {A} while {B} give the scene another pulse.',
      '{Place} lets {A} sit plainly while {B} hold back.',
    ],
    motionLead: [
      '{Place} keeps {A} {anchorA} while {B} belong to what happens next.',
      '{Place} has {A} ready before {B} enter the day.',
      '{Place} keeps {A} {anchorA} while {B} take the next turn.',
      '{Place} has {A} ready before {B} follow.',
      '{Place} holds {A} until {B} change the moment.',
      '{Place} keeps {A} by the first turn while {B} carry it onward.',
      'At {place}, {A} keep the first quiet while {B} change the rhythm.',
      '{Place} holds {A} while {B} change the pace.',
      '{Place} goes quiet around {A} before {B} break the pause open.',
      '{Place} has {A} while {B} move the day along.',
      '{Place} keeps {A} in view while {B} change the weight of the moment.',
      '{Place} gets its shape from {A} before {B} wake the scene.',
      '{Place} settles around {A} while {B} pull the hour forward.',
      '{Place} keeps quiet around {A} while {B} carry the room onward.',
      '{Place} has {A} in the quiet part while {B} carry the rest.',
      '{Place} settles around {A} before {B} begin the work.',
      '{Place} gathers around {A} while {B} keep the room in motion.',
      '{Place} pauses around {A} before {B} tell the rest where to go.',
      '{Place} keeps {A} close until {B} open the next turn.',
      '{Place} holds the quiet part in {A} before {B} wake the scene.',
      '{Place} has {A} by the work as {B} show what happens next.',
      '{Place} pauses around {A} until {B} change the moment.',
      '{Place} lets {A} sit quietly while {B} carry the place forward.',
      '{Place} keeps {A} close while {B} change the pace.',
      '{Place} stays grounded in {A} while {B} change the pace.',
      '{Place} keeps {A} close while {B} carry the hour.',
      '{Place} gathers {A} before {B} enter the day.',
      '{Place} holds quiet around {A} while {B} move the hour along.',
      '{Place} pauses around {A} while {B} move through the rest.',
      'At {place}, {A} stay in view while {B} start the bustle.',
      '{Place} keeps {A} in the room while {B} carry the room onward.',
      '{Place} rests around {A} before {B} wake the scene.',
      '{Place} keeps {A} close until {B} enter the day.',
      '{Place} quiets around {A} while {B} give it a current.',
      '{Place} pauses around {A} before {B} open the way through.',
      '{Place} keeps {A} at the center while {B} move around them.',
      'At {place}, {A} stay {anchorA} while {B} move {anchorB}.',
      '{Place} lets {A} settle while {B} carry the hour forward.',
      '{Place} pauses around {A} before {B} open a way through.',
      '{Place} gathers {A} before {B} take the scene onward.',
      '{Place} holds around {A} before {B} open room.',
    ],
    weaves: DOMAIN_AUTHORED_WEAVES[context.domain] ?? sceneFrame(context).weaves,
  };

  if (context.domain === 'diner') {
    return {
      nounLead: [
        'At the diner booth, {A} feel like the usual place while the counter calls out {B}.',
        'The booth has {A} near the table while {B} keep the counter awake.',
        'The booth knows {A}, and at the counter, {B} keep breakfast moving.',
        'Near the booth, {A} settle in while the counter calls out {B}.',
        'The booth keeps {A} close while the counter talks in {B}.',
        'At the table, {A} settle in while the counter keeps track of {B}.',
        'The vinyl seat has {A} nearby while the counter calls out {B}.',
        'The table is set with {A} while the counter talks in {B}.',
        'At breakfast, {A} sit on the table while the counter calls out {B}.',
        'In the booth, {A} feel already known while the counter calls out {B}.',
        'The booth has the comfort of {A} and the counter has the sound of {B}.',
        'By the window, {A} make breakfast familiar while {B} keep the counter talking.',
        'A regular booth can mean {A}, with the counter running on {B} across the room.',
      ],
      motionLead: defaultTemplates.motionLead,
      weaves: DOMAIN_AUTHORED_WEAVES.diner,
    };
  }

  if (context.domain === 'cafe') {
    return {
      nounLead: [
        'At {place}, {A} sit close to the cup while {B} give the block its morning beyond the glass.',
        'The window table has {A}, and through the glass, the block shows {B}.',
        '{Place} has {A} {anchorA} while outside, {B} start the block.',
        'The table is set with {A}, and past the glass, {B} start the block.',
        'Inside the window, {A} gather near the cup while {B} give the street its morning beyond the glass.',
        'Breakfast keeps {A} by the glass while the block offers {B}.',
        'The cup side has {A}, and the street side has {B}.',
      ],
      motionLead: defaultTemplates.motionLead,
      weaves: DOMAIN_AUTHORED_WEAVES.cafe,
    };
  }

  if (context.domain === 'kitchen') {
    return {
      nounLead: [
        'The counter has {A} ready while {B} make supper smell close.',
        'On the counter, {A} are still separate before {B} pull supper closer.',
        'The cutting board has {A}; the room turns fragrant with {B}.',
        'Dinner is still only {A} until the hands begin {B}.',
        'The pan is not hot yet, but {A} are ready for {B}.',
        'The kitchen smells like {A} before the work becomes {B}.',
        'The counter gathers {A} while supper gets closer through {B}.',
        'Before the table is set, {A} wait for {B}.',
        'Supper is still quiet when {A} meet {B}.',
        'At first, the room is just {A} waiting for {B}.',
        'The cutting board gathers {A} before the kitchen turns to {B}.',
        'Before anything smells finished, {A} are ready for {B}.',
      ],
      motionLead: [
        'At {place}, {A} wait until {B} warm the room.',
        'The counter has {A}; supper takes shape through {B}.',
        'On the counter, {A} are still separate until {B} take over.',
        'The counter opens with {A}, then the room turns fragrant with {B}.',
        'Supper has {A} waiting before {B} make it real.',
        'The room smells of {A}; soon it smells of {B}.',
        'The cutting board has {A}; the work becomes {B}.',
        'Dinner has {A} waiting before {B} give it shape.',
        'The pan is not hot yet, but {A} are ready for {B}.',
      ],
      weaves: DOMAIN_AUTHORED_WEAVES.kitchen,
    };
  }

  return defaultTemplates;
}

function describedThread(thread: ThreadlineEditorialThreadContext): string {
  return `the ${lowerThreadName(thread)}`;
}

function addThreadIncludesClause(
  segments: ThreadlineSegment[],
  thread: ThreadlineEditorialThreadContext,
  wordIds: readonly string[]
): void {
  segments.push(text(`${describedThread(thread)} ${threadVerb(thread, 'include', 'includes')} `));
  addAnswerList(segments, wordIds);
}

function addNamedListClause(
  segments: ThreadlineSegment[],
  thread: ThreadlineEditorialThreadContext,
  wordIds: readonly string[],
  verb: 'are' | 'arrive as' | 'come through as' | 'show up as'
): void {
  const agreedVerb =
    verb === 'are'
      ? threadVerb(thread, 'are', 'is')
      : verb === 'arrive as'
        ? threadVerb(thread, 'arrive as', 'arrives as')
        : verb === 'come through as'
          ? threadVerb(thread, 'come through as', 'comes through as')
          : threadVerb(thread, 'show up as', 'shows up as');
  segments.push(text(`${lowerThreadName(thread)} ${agreedVerb} `));
  appendSerialBlanks(segments, wordIds);
}

function anchorScore(answer: string, index: number): number {
  const lower = answer.toLowerCase();
  let score = 10 - index * 0.1;
  if (/ing$/.test(lower)) score -= 5;
  if (/ed$/.test(lower)) score -= 2;
  if (/s$/.test(lower)) score -= 0.5;
  if (/^(bring|clouding|cooking|counter|dinner|fogbound|griddle|lockup|platen|recedes|seaward|server|seating|serve|sizzle|special|stellar|thanks|topping|warmer|window|return|notice|listen|follow)$/.test(lower)) score -= 3;
  if (/^(ketchup|coffee|omelet|pancake|lantern|hammer|ticket|canvas|anchor|helmet|beacon|beaker|mirror|button|letter|ribbon|basket|candle|marker|bridge|fountain|pastry|parcel|refill|checks|orders|pickup|receipt|request)$/.test(lower)) {
    score += 1.5;
  }
  return score;
}

function anchor(context: ThreadlineEditorialContext, start: number, end: number): string {
  const ranked = context.words
    .slice(start, end)
    .map((word, index) => ({ word, score: anchorScore(word.answer, index) }))
    .sort((a, b) => b.score - a.score || a.word.answer.localeCompare(b.word.answer));
  const pickableCount = Math.min(3, ranked.length);
  const scheduleEpoch = Math.floor(context.dayIndex / 181);
  return ranked[(context.copyAttempt + scheduleEpoch + start) % pickableCount]
    .word.answer.toLowerCase();
}

function pickLeadTemplate(context: ThreadlineEditorialContext, templates: readonly string[]): string {
  const dateHash = Array.from(context.dateKey).reduce((total, char) => total + char.charCodeAt(0), 0);
  const attemptStep = Math.max(1, templates.length - 1);
  const index =
    (context.dayIndex * 17 + context.copyAttempt * attemptStep + context.domain.length * 11 + dateHash) %
    templates.length;
  return templates[index] ?? templates[0];
}

function leadFromTemplate(
  template: string,
  firstIds: readonly string[],
  secondIds: readonly string[],
  context: ThreadlineEditorialContext
): ThreadlineSegment[] {
  const segments: ThreadlineSegment[] = [];
  addTemplatedLead(segments, template, firstIds, secondIds, context);
  return segments;
}

export function makeThreadlineEditorialLead(context: ThreadlineEditorialContext): ThreadlineSegment[] {
  const firstWords = context.words.slice(0, 3);
  const secondWords = context.words.slice(3, 6);
  const firstIds = wordIdsFor(firstWords);
  const secondIds = wordIdsFor(secondWords);
  const dinerPerson = context.domain === 'diner'
    ? firstWords.find((word) => hasRole(word, 'person'))
    : undefined;
  if (dinerPerson) {
    const objectIds = firstWords.filter((word) => word.id !== dinerPerson.id).map((word) => word.id);
    const segments: ThreadlineSegment[] = [
      text('At the booth, the '),
      blank(dinerPerson.id),
      text(' sets down the '),
      blank(objectIds[0]),
      text(' and '),
      blank(objectIds[1]),
      text(' while the counter calls out '),
    ];
    addAnswerList(segments, secondIds);
    segments.push(text('.'));
    return segments;
  }
  if (context.domain === 'station') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The platform shows {A} while waiting people hold {B} close.',
        'On the platform, {A} orient the crowd while travelers keep {B} close.',
        'Under the station roof, {A} point the way while {B} keep the minutes company.',
        'The platform announces itself with {A} as passengers settle in with {B}.',
        'At the station, {A} make leaving concrete while travelers keep {B} handy.',
        'Platform signs like {A} do the directing while the crowd settles in with {B}.',
        'Near the board, {A} orient travelers while {B} pass the minutes.',
        'The station is readable in {A} and bearable with {B}.',
        'By the tracks, {A} bring departure close while travelers keep {B} nearby.',
        'Travelers read {A} first, then settle back into {B}.',
        'Before the train, people check {A} and fall back on {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'commute') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'A wet morning puts {A} by the door before getting there means {B}.',
        'Rain changes the small checklist: {A} before {B}.',
        'At the front door, {A} come first while the trip still has {B}.',
        'The morning is wet enough for {A}, and the trip is down to {B}.',
        'The way out needs {A} before it runs through {B}.',
        'Rain is already outside, so {A} come before {B}.',
        'The door gathers {A} while the route answers with {B}.',
        'A damp trip needs {A} before the way out has {B}.',
        'Rain puts {A} by the door while the trip keeps {B} close.',
        'By the door, {A} answer the weather before {B} shape the route.',
        'The wet doorway has {A}, and getting across town takes {B}.',
        'Rain gathers {A} at the door while the day still needs {B}.',
        'The traveler reaches for {A} before the trip is marked by {B}.',
        'Rain has the traveler checking {A} while the route still runs through {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'library') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The reading table has {A} while the reader has {B}.',
        'Under the library lamp, {A} belong to the page while {B} belong to the hour.',
        'The page has {A}, and the quiet around it leaves space for {B}.',
        'At the library table, {A} are easy to find while the quiet holds {B}.',
        'Low light gathers around {A} as the reader settles with {B}.',
        'The shelf offers {A}, and the reader keeps {B} at the table.',
        'By the library lamp, {A} sit open while the reader keeps {B}.',
        'The table is quiet with {A} as the reader settles into {B}.',
        'Under the shelf light, {A} keep company with {B}.',
        'The page side has {A}, and the quiet side has {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'shore') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'At low tide, {A} sit in the open while {B} keep changing the edge.',
        'The water draws back from {A}, and {B} redraw the sand.',
        'Low tide leaves {A} exposed while {B} keep the beach temporary.',
        'The beach shows {A} for a while before {B} take the edge back.',
        'The tide leaves {A} behind as {B} keep revising the sand.',
        'Wet sand holds {A} while {B} keep changing the edge.',
        'At the foam line, {A} show themselves while {B} keep working.',
        'Low water uncovers {A}, and {B} keep changing the evidence.',
        'The tide has left {A} on the sand, but {B} are already returning.',
        'The water pauses around {A} while the edge keeps changing through {B}.',
        'At the waterline, {A} catch the light while {B} keep the sand unsettled.',
        'Low tide shows {A}, and {B} keep the shoreline unfinished.',
        'The wet sand keeps {A} visible until {B} revise it.',
        'At low water, {A} show themselves while {B} keep revising the sand.',
        'The foam line leaves {A} behind before {B} take the edge back.',
        'The beach holds {A} briefly while {B} keep rewriting it.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'bakery') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'At the bakery case, {A} slow the line, and the counter work is {B}.',
        'The case glows with {A} while the counter handles {B}.',
        'The morning gets warm around {A} while the counter moves through {B}.',
        'At the bakery case, {A} wait behind glass until the order turns to {B}.',
        'The sweet case has {A} close enough to point at while breakfast turns into {B}.',
        'The tray shows {A} before the counter handles {B}.',
        'The glass case holds {A} while the line settles into {B}.',
        'Morning gathers at the case around {A} before the counter handles {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'mailroom') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The mailroom shelf has {A} while the back room hums with {B}.',
        'On the shelf, {A} wait before the route gets built from {B}.',
        'The shelf holds {A} before {B} send them out.',
        'Before anything leaves, the shelf has {A} and the back room is busy with {B}.',
        'The sorting shelf has {A} before the route takes shape through {B}.',
        'The mailroom has {A} before the route begins with {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'desk') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The desk is clean enough for {A} while the first notes say {B}.',
        'Before work begins, {A} settle on the desk while the morning narrows to {B}.',
        'On the clean desk, {A} settle into place as the first page lists {B}.',
        'The desk is quiet with {A} before the first work is named {B}.',
        'The clean surface holds {A}, and the first notes are {B}.',
        'The morning starts at the desk with {A} while the page already has {B}.',
        'A clear desk holds {A} beside notes that say {B}.',
        'The desk holds {A} while the page names {B}.',
        'Morning gathers at the desk around {A}, and the notes say {B}.',
        'At the desk, {A} sit near the page while the notes name {B}.',
        'The workday opens beside {A} while the notes are {B}.',
        'The desk has {A} in order while the notes are {B}.',
        'Under the desk lamp, {A} settle beside the first notes: {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'clean-slate') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The quiet desk has {A} nearby and a plan to {B}.',
        'On the first clean page, {A} sit beside a plan to {B}.',
        'Before the week begins, {A} sit ready with a plan to {B}.',
        'The clean desk keeps {A} close beside a first plan to {B}.',
        'At the quiet desk, {A} sit near a first plan to {B}.',
        'A fresh page opens beside {A} with a plan to {B}.',
        'The quiet desk holds {A} beside a plan to {B}.',
        'Before the day gets loud, {A} wait beside a plan to {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'school') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The classroom has {A} before the first hour brings {B}.',
        'By the classroom door, {A} are ready for a morning of {B}.',
        'The room is set with {A} before the board has {B}.',
        'The desks show {A} before class starts with {B}.',
        'The classroom opens around {A} while students settle into {B}.',
        'Before voices rise, {A} are ready for the first hour of {B}.',
        'The morning waits with {A} before the class turns to {B}.',
        'The first desks hold {A} as the lesson opens with {B}.',
        'The board is still clean while {A} wait for an hour of {B}.',
        'The doorway gathers {A} before the morning brings {B} inside.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'trail') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'On the trail, {A} keep the walk honest while the landscape opens into {B}.',
        'The hike has {A} for direction before the day opens into {B}.',
        'On the trail, {A} keep the route plain until {B} make it feel discovered.',
        'The route has {A} while the walk has time for {B}.',
        'The route is readable through {A}, then the woods open into {B}.',
        'The route keeps {A} close before the long look brings {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'market') {
    const templates = allWordsCanActAsVerbs(secondWords)
      ? [
          'At the market stall, {A} fill the crates while shoppers {B}.',
          'The stall is bright with {A} as shoppers {B} down the aisle.',
          'The morning stall has {A} while shoppers {B} before the bag is full.',
          'The market table has {A} while shoppers {B} with the basket open.',
          'At the stall, {A} brighten the table while shoppers {B}.',
          'Under the canvas, {A} fill the table while shoppers {B} with bags open.',
          'The market table is full of {A} while shoppers {B} in the aisle.',
          'Around the crates, {A} catch the eye while shoppers {B} before checkout.',
          'The stall has {A} in the morning light while shoppers {B}.',
          'Baskets open beside {A} while shoppers {B} down the aisle.',
          'Under the awning, {A} fill the table while shoppers {B}.',
        ]
      : [
          'At the market stall, {A} fill the crates before the errand ends with {B}.',
          'The stall is bright with {A} while the counter is ready for {B}.',
          'The morning stall has {A} while the basket makes room for {B}.',
          'The market table has {A} before the checkout gathers {B}.',
        ];
    return leadFromTemplate(pickLeadTemplate(context, templates), firstIds, secondIds, context);
  }
  if (context.domain === 'park') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The park loop has {A} while people {B} in the open air.',
        'Around the loop, {A} give the walk shape while people {B}.',
        'The path passes {A} as people {B} through the afternoon.',
        'The park has {A}, and the day is full of people who {B}.',
        'The loop goes past {A} while people {B} under the trees.',
        'The walk has {A} while people {B} until the path feels familiar.',
        'Past {A}, people {B} until the loop feels known.',
        'The afternoon passes {A} as people {B} along the loop.',
        'The loop passes {A} while people {B} at their own pace.',
        'The route bends around {A} while people {B} in the open air.',
        'The loop has {A} in view while people {B} under the trees.',
        'The path moves past {A} as people {B} through the afternoon.',
        'A familiar loop has {A} while people {B} as the day opens.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'theater') {
    const templates = allWordsCanActAsVerbs(secondWords)
      ? [
          'The curtain rises on {A} while the house settles around {B}.',
          'The lights find {A} as the audience gathers around {B}.',
          'The lights find {A} while the dark gathers {B}.',
          'A quiet theater has {A} while the seats wait with {B}.',
          'The small theater has {A} as the house settles into {B}.',
          'The room goes quiet around {A} while the audience gathers around {B}.',
          'A quiet theater gathers {A} while the house waits with {B}.',
          'The lights settle on {A} as the room listens for {B}.',
        ]
      : [
          'The curtain rises on {A} while the house settles around {B}.',
          'The lights find {A} as the audience gathers around {B}.',
          'The lights find {A} while the dark gathers {B}.',
          'A quiet theater has {A} while the seats wait with {B}.',
          'The small theater has {A} as the house settles into {B}.',
          'The room goes quiet around {A} while the audience gathers around {B}.',
          'A quiet theater gathers {A} while the house waits with {B}.',
          'The lights settle on {A} as the room listens for {B}.',
        ];
    return leadFromTemplate(pickLeadTemplate(context, templates), firstIds, secondIds, context);
  }
  if (context.domain === 'picnic') {
    const templates = allWordsCanActAsVerbs(secondWords)
      ? [
          'Under the trees, {A} wait in the shade while people {B}.',
          'The shade holds {A}, and people {B} until lunch feels unhurried.',
          'At noon, {A} turn the grass into a table while people {B}.',
          'The park is quiet around {A}, and people {B} in the shade.',
          'The trees keep {A} cool while people {B} nearby.',
          'The shade makes room for {A}, and people {B} through lunch.',
          'Under one tree, {A} are enough for people to {B}.',
          'The grass has {A} in the easy light while people {B}.',
          'The meal opens with {A}, and people {B} until the shade moves.',
          'By the trees, {A} stay close while people {B}.',
          'The quiet park has {A}, and people {B} until the hour loosens.',
          'The long shade gathers {A} while people {B}.',
      ]
      : [
          'Under the trees, {A} wait in the shade while lunch drifts into {B}.',
          'The shade holds {A}, and the meal loosens into {B}.',
          'At noon, {A} turn the grass into a table for {B}.',
          'The park is quiet around {A}, and the shade settles into {B}.',
          'The trees keep {A} cool while the afternoon goes to {B}.',
          'The shade makes room for {A}, and lunch lingers through {B}.',
          'Under one tree, {A} are enough for an hour of {B}.',
          'The grass has {A} in the easy light before lunch becomes {B}.',
          'The meal opens with {A}, then settles into {B}.',
          'By the trees, {A} stay close while the afternoon settles into {B}.',
          'The quiet park has {A}, and the afternoon loosens into {B}.',
          'The long shade gathers {A} before lunch turns to {B}.',
        ];
    return leadFromTemplate(pickLeadTemplate(context, templates), firstIds, secondIds, context);
  }
  if (context.domain === 'garden') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'Near the beds, {A} catch the light while the gardener spends the morning {B}.',
        'The gate opens on {A} before the morning disappears into {B}.',
        'Along the path, {A} brighten the hour that goes to {B}.',
        'Under the leaves, {A} are already bright before the gardener starts {B}.',
        'By the beds, {A} make the morning worth {B}.',
        'The path is bright with {A} before the gardener settles into {B}.',
        'The garden has {A} in the light and {B} in the hands.',
        'The morning opens around {A} and keeps the gardener busy with {B}.',
        'The beds hold {A} while the gardener starts {B}.',
        'Past the gate, {A} make room for a morning of {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'laundry') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The basket is full of {A}, and the afternoon goes to {B}.',
        'By the washer, {A} come out of the basket before {B} put them right.',
        'The clean pile gathers {A} before the hands return to {B}.',
        'The room smells clean around {A} as the work turns to {B}.',
        'The hamper gives up {A}, and the rest becomes {B}.',
        'The room smells clean by the time {A} have been through {B}.',
        'The laundry line has {A} coming back from {B}.',
        'The basket has {A} inside it and {B} ahead.',
        'Clean fabric comes back as {A} after a long hour of {B}.',
        'The room gets lighter around {A} as the work moves into {B}.',
        'The pile begins as {A} and ends closer to {B}.',
        'Hands lift {A} from the basket, then settle into {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'gallery') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The gallery wall shows {A}, and the room slows into {B}.',
        'The wall has {A} while the afternoon becomes {B}.',
        'Near the frame, {A} change the pace into {B}.',
        'The gallery has {A}, and the quiet turns into {B}.',
        'In the quiet room, {A} catch the light while the visitor settles into {B}.',
        'The wall gathers {A} while attention becomes {B}.',
        'The frame holds {A} long enough for {B}.',
        'The gallery wall has {A} as the body slows into {B}.',
        'In the gallery light, {A} hold still, and attention gathers through {B}.',
        'The quiet wall gathers {A}, and the visit settles into {B}.',
        'The wall catches {A} while visitors are {B}.',
        'The frame holds {A}, and the room makes time for {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'rooftop') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'From the rooftop rail, {A} catch the last light while the evening settles into {B}.',
        'The rooftop rail looks over {A} while {B} rise from below.',
        'Above the street, {A} hold the view while {B} gather in the evening.',
        'The roof keeps {A} in view as the city settles into {B}.',
        'At the rail, {A} stay in the last light with {B} in the air.',
        'Past {A}, the roof keeps the evening close in {B}.',
        'Above the block, {A} catch the light as the hour quiets into {B}.',
        'The rail holds {A} in the last light while the city below softens into {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'studio') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The studio table has {A} before {B} begin on the page.',
        'At the studio table, {A} rest under the lamp while {B} begin on the page.',
        'The table gathers {A} while {B} give the first marks shape.',
        'In the studio light, {A} cover the table while {B} give the first marks shape.',
        'The worktable has {A} while {B} give the idea a place to start.',
        'Under the lamp, {A} cover the table while {B} start the page.',
        'The studio table holds {A} while {B} bring the page awake.',
        'The table is bright with {A} as {B} shape the first marks.',
        'The studio light falls on {A} before {B} begin the draft.',
        'On the worktable, {A} gather while {B} give the draft a shape.',
        'The studio table is busy with {A} before {B} begin the draft.',
        'The worktable gathers {A} while {B} bring the draft into view.',
        'The worktable is set with {A} while {B} give the idea edges.',
        'The studio lamp falls on {A} before {B} start the draft.',
        'The table holds {A} while {B} bring the first page awake.',
        'The materials are {A}, and the first marks are {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'porch') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The porch has {A} near the door when {B} come up from the street.',
        'Near the door, {A} wait as {B} gather at the step.',
        'The step glows around {A} when {B} arrive from the block.',
        'On the step, {A} make room for {B} from the street.',
        'The house looks ready with {A} when {B} reach the door.',
        'At the threshold, {A} catch the light as {B} come closer.',
        'The porch keeps {A} near the door while {B} soften the street.',
        'At the door, {A} wait for {B} from the sidewalk.',
        'The step is set with {A} before {B} make it social.',
        'Porch light finds {A} as {B} come up the walk.',
        'At the front edge, {A} wait as {B} turn toward the house.',
        'By the door, {A} keep the quiet until {B} arrive.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'porch-lantern') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The late-October porch is dressed with {A} before the dusk brings {B}.',
        'Near the bell, {A} catch the last light while the evening brings {B}.',
        'The porch gathers {A} before dark as the dusk carries {B}.',
        'At the door, {A} dress the porch before the evening brings {B}.',
        'The threshold keeps {A} in the glow before the night begins with {B}.',
        'Before the knock, {A} dress the step while the dusk carries {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'porch-spark') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The summer porch keeps {A} ready for dusk while {B} lift the bright evening.',
        'By dusk, {A} are set out near the rail as {B} move through the warm dark.',
        'The rail has {A} ready while {B} brighten the summer dark.',
        'The porch gathers {A} before nightfall while {B} brighten the warm dark.',
        'At the summer rail, {A} wait for dusk while {B} brighten the night.',
        'Before the first spark, {A} gather near the door while {B} lift the evening.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'firehouse') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'During drills, {A} wait for the words {B}.',
        'In the bay, {A} stay within reach while the crew rehearses {B}.',
        'The bay keeps {A} close before the call asks for {B}.',
        'Before the bell, {A} sit through drills while the crew learns to {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'harbor') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The dock crew checks {A} before the boat is ready for {B}.',
        'Along the rail, {A} catch the light before {B} take the boat out.',
        'The boat is still tied near {A} with {B} waiting on the water.',
        'By the dock, {A} keep the boat close before {B} carry it out.',
        'At the waterline, {A} name the still edge, and on the water, the work is {B}.',
        'Before the boat pulls away, {A} stay close and {B} wait beyond the rail.',
        'The crew checks {A} while the morning boat gets ready for {B}.',
        'The rail gathers {A} before the water is ready for {B}.',
        'The morning boat waits beside {A} with {B} still ahead.',
        'At the dock edge, {A} keep the boat close before the water work is {B}.',
        'The dock holds {A} while the boat gets ready for {B}.',
        'The boat waits by {A} before the harbor opens to {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'radio-booth') {
    const templates = allWordsCanActAsVerbs(secondWords)
      ? [
          'Behind the glass, {A} wait while the producer works through {B}.',
          'The red light comes on near {A} as the producer works through {B}.',
          'The booth gathers {A} before the voice travels through {B}.',
        ]
      : [
          'In the radio booth, {A} wait while the producer works through {B}.',
          'Behind the glass, {A} wait while the producer works through {B}.',
          'The red light comes on near {A}, and the broadcast is built from {B}.',
          'Near the mic, {A} wait while the producer works through {B}.',
          'Behind the glass, {A} sit near the mic while {B} carry the hour out.',
        ];
    return leadFromTemplate(pickLeadTemplate(context, templates), firstIds, secondIds, context);
  }
  if (context.domain === 'music') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The practice room has {A} before the rehearsal turns on {B}.',
        'By the stand, {A} stay quiet until rehearsal finds {B}.',
        'The room has {A} before the first run needs {B}.',
        'Before the song settles, {A} stay close while rehearsal listens for {B}.',
        'The rehearsal has {A} while the room listens for {B}.',
        'Near the stand, {A} stay quiet before the first sound needs {B}.',
        'The practice room keeps {A} close because the first run needs {B}.',
        'The stand keeps {A} close while the room works toward {B}.',
        'The stand holds {A} before the first sound asks for {B}.',
        'The rehearsal begins around {A} as everyone listens for {B}.',
        'The practice room gathers {A} while the first run leans on {B}.',
        'By the music stand, {A} stay quiet as the room listens for {B}.',
        'The stand has {A} as the first sound settles into {B}.',
        'Before anyone plays, {A} stay quiet while everyone listens for {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'workshop') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The bench has {A} before {B} show where the fix begins.',
        'The tool tray has {A} while {B} narrow the job.',
        'The bench has {A}, and the small damage is {B}.',
        'On the bench, {A} wait for the {B} that need them.',
        'The tools are {A}, but the job is hidden in {B}.',
        'The repair tray holds {A} while {B} give the problem its shape.',
        'The job has {A} ready before {B} show where the fix begins.',
        'On the bench, {A} are ready once {B} show what needs fixing.',
        'The fix keeps {A} close while the problem is {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'laboratory') {
    const templates = allWordsCanActAsVerbs(secondWords)
      ? [
          'The lab table has {A} while the protocol lists {B}.',
          'Under the lab light, {A} line up while the notebook lists {B}.',
          'The table has {A} as the protocol keeps {B} in order.',
          'The test has {A}, and the lab note names {B}.',
          'The lab table starts quiet with {A} before the next page names {B}.',
          'The careful work is {A} on the table and {B} in the notes.',
          'On the bench, {A} make the question concrete while the protocol names {B}.',
          'Under the bench light, {A} line up before the procedure names {B}.',
          'A careful test keeps {A} close as the notes turn toward {B}.',
          'The lab light catches {A} before the notebook moves to {B}.',
          'A careful question keeps {A} nearby while the notebook names {B}.',
          'The table is quiet around {A} while the work continues with {B}.',
          'The bench gathers {A} while the result waits on {B}.',
        ]
      : [
          'The lab table has {A} while the protocol lists {B}.',
          'Under the lab light, {A} line up while the notebook lists {B}.',
          'The table has {A} as the protocol keeps {B} in order.',
          'The test has {A}, and the lab note names {B}.',
          'Careful work has {A} before the next line lists {B}.',
          'The lab table starts quiet with {A} before the next page names {B}.',
          'The careful work is {A} on the table and {B} in the notes.',
          'On the bench, {A} make the question concrete while the protocol names {B}.',
          'Under the bench light, {A} line up before the procedure names {B}.',
          'A careful test keeps {A} close as the notes turn toward {B}.',
          'The lab light catches {A} before the notebook moves to {B}.',
          'A careful question keeps {A} nearby while the notebook names {B}.',
          'The table is quiet around {A} while the work continues with {B}.',
          'The bench gathers {A} while the result waits on {B}.',
        ];
    return leadFromTemplate(
      pickLeadTemplate(context, templates),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'clockshop') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'At the clockshop counter, {A} sit under glass while {B} give the hour a pulse.',
        'The clockshop counter holds {A} while {B} make the hour audible.',
        'Under the shop light, {A} mark the dial while {B} make the hour audible.',
        'The counter has {A} while the hour gets measured by {B}.',
        'In the clockshop, {A} line the open case while {B} let the hour speak.',
        'The glass counter gathers {A} while {B} make time feel close.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'campsite') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'Around the fire ring, {A} are set out before {B} make the dark practical.',
        'The campsite ring has {A} close by while {B} make the evening workable.',
        'The ring has {A} near the fire while {B} make a small home outside.',
        'Near the ring, {A} gather while {B} keep the fire tended.',
        'The campsite has {A} close by before {B} make the evening usable.',
        'By the fire, {A} make room for {B} after dark.',
        'The fire ring gathers {A} before {B} make the night livable.',
        'At the campsite, {A} come out before {B} turn outside into shelter.',
        'The ring has {A} close while {B} warm the night around it.',
        'Firelight catches {A} while {B} keep the evening close.',
        'The campsite gathers around {A} while {B} make the night livable.',
        'Near the fire, {A} gather while {B} keep the night close.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'observatory') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'In the observatory dome, {A} are ready when the night offers {B}.',
        'Under the open roof, {A} are ready for {B}.',
        'The dome keeps {A} in the dark while the night offers {B}.',
        'The long look uses {A} to stay with {B}.',
        'The instrument table has {A} while the night slowly gives {B}.',
        'At the observatory, {A} are ready while {B} move overhead.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'planetarium') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'The planetarium ceiling shows {A} as the room goes dark with {B}.',
        'Under the dome, {A} appear overhead while the show moves with {B}.',
        'The seats tilt toward {A} while the dark room uses {B}.',
        'The ceiling fills with {A} as the room travels by {B}.',
        'Inside the dark room, {A} hang overhead while the show uses {B}.',
        'The room looks up at {A} while the ceiling travels with {B}.',
        'The seats lean back under {A} as the dark gathers {B}.',
        'Under the dome, {A} float overhead while the room shifts with {B}.',
        'The dome gives {A} a sky while the show uses {B}.',
        'In the dark room, {A} appear overhead while {B} move the ceiling outward.',
        'The dome shows {A} as the dark room follows {B}.',
        'The seats face {A} while the ceiling changes with {B}.',
        'Above the seats, {A} appear while the dark moves by {B}.',
        'The room goes dark for {A} as overhead, the show moves by {B}.',
        'Under the dome, {A} take over the room while the show keeps to {B}.',
        'The seats go quiet under {A} as the ceiling shifts by {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  if (context.domain === 'weather-station') {
    return leadFromTemplate(
      pickLeadTemplate(context, [
        'At the weather station, {A} sit on the instruments while the forecast turns toward {B}.',
        'The weather station has {A} before the next report needs {B}.',
        'On the instruments, {A} catch early changes while the forecast shifts toward {B}.',
        'Station instruments like {A} keep watch as the sky answers through {B}.',
        'The instruments hold {A} while the forecast keeps changing with {B}.',
      ]),
      firstIds,
      secondIds,
      context
    );
  }
  const templateSet = leadTemplatesForContext(context);
  const templates = allWordsCanActAsVerbs(secondWords) ? templateSet.motionLead : templateSet.nounLead;
  const template = pickLeadTemplate(context, templates);
  const segments: ThreadlineSegment[] = [];

  addTemplatedLead(segments, template, firstIds, secondIds, context);
  return segments;
}

export function makeThreadlineEditorialWeave(context: ThreadlineEditorialContext, title?: string): string {
  const a = anchor(context, 0, 3);
  const b = anchor(context, 3, 6);
  const templateSet = leadTemplatesForContext(context);
  const template = templateSet.weaves[(context.dayIndex + context.dateKey.length + context.copyAttempt * 4) % templateSet.weaves.length] ??
    templateSet.weaves[0];
  return formatSceneTemplate(template, context, a, b, title);
}

export function makeThreadlineEditorialCopy(
  context: ThreadlineEditorialContext,
  isTitleFresh?: (title: string) => boolean
): ThreadlineEditorialCopyResult {
  const puzzleOverride = THREADLINE_APPROVED_COPY_OVERRIDES[context.puzzleId];
  const dateOverride = THREADLINE_APPROVED_COPY_OVERRIDES[context.dateKey];
  const override =
    puzzleOverride?.domain === context.domain
      ? puzzleOverride
      : dateOverride?.domain === context.domain
        ? dateOverride
        : undefined;
  const title = override?.title ?? makeThreadlineEditorialTitle(context, isTitleFresh);
  const weave = override?.weave ?? makeThreadlineEditorialWeave(context, title);
  const lead = override
    ? leadFromTemplate(
        override.leadTemplate,
        wordIdsFor(context.words.slice(0, 3)),
        wordIdsFor(context.words.slice(3, 6)),
        context
      )
    : makeThreadlineEditorialLead(context);
  return {
    title,
    lead,
    weave,
    reviewNote: override
      ? `${title} approved in the manual 600-puzzle floor pass; ${override.note} Final weave: "${weave}".`
      : `${title} approved in the manual 600-puzzle floor pass; the final weave lands as "${weave}" after read-aloud review.`,
    approvalStatus: 'approved',
    approvalSource: 'manual-600-exceptional-floor',
  };
}
