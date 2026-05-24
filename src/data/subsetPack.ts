import type { SubsetReservePuzzle, SubsetScheduledPuzzle } from "./subsetSchedule";

export const SUBSET_LIVE_PUZZLES = [
  {
    "id": "subset-2026-05-15-outings-where-to-sit-snacks-sound-cues",
    "date": "2026-05-15",
    "dayIndex": 0,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "POPCORN",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "PRETZEL",
          "WAVES"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "POPCORN",
          "APPLAUSE"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "NACHOS",
          "CHEERS"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-05-16-rooms-fixtures-built-ins-linens",
    "date": "2026-05-16",
    "dayIndex": 1,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "VANITY",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "PANTRY",
          "DISHCLOTH"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "VANITY",
          "TOWEL"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "CLOSET",
          "SHEET"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-05-17-opened-locked-shared-digital-household-teamwork",
    "date": "2026-05-17",
    "dayIndex": 2,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "DOOR",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "WINDOW",
          "CALENDAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "DOOR",
          "ACCOUNT"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "ROOM",
          "DOC"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-05-18-workspaces-drafts-furniture-supplies",
    "date": "2026-05-18",
    "dayIndex": 3,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "DESK",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "EASEL",
          "BRUSH"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "DESK",
          "STAPLER"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "CHAIR",
          "RULER"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-05-19-travel-stops-sleep-bags-arrival",
    "date": "2026-05-19",
    "dayIndex": 4,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LUGGAGE",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "CARRYON",
          "GATE"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "LUGGAGE",
          "LOBBY"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "BACKPACK",
          "SITE"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "GATE",
        "LOBBY",
        "SITE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-05-20-color-cues-places",
    "date": "2026-05-20",
    "dayIndex": 5,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Color cues in everyday places",
    "centerWord": "SENSOR",
    "rows": [
      {
        "label": "Color Cues",
        "words": [
          "SWATCH",
          "YELLOW",
          "BLOOM"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "ROLLER",
          "SENSOR",
          "TROWEL"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "MATCH",
          "STOP",
          "WATER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Paint Store",
        "words": [
          "SWATCH",
          "ROLLER",
          "MATCH"
        ]
      },
      {
        "label": "Traffic Light",
        "words": [
          "YELLOW",
          "SENSOR",
          "STOP"
        ]
      },
      {
        "label": "Garden Bed",
        "words": [
          "BLOOM",
          "TROWEL",
          "WATER"
        ]
      }
    ],
    "grid": [
      [
        "SWATCH",
        "YELLOW",
        "BLOOM"
      ],
      [
        "ROLLER",
        "SENSOR",
        "TROWEL"
      ],
      [
        "MATCH",
        "STOP",
        "WATER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "color-cues-places"
  },
  {
    "id": "subset-2026-05-21-park-days-underfoot-rest-spots-posted-rules",
    "date": "2026-05-21",
    "dayIndex": 6,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SWING",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "BENCH",
          "LABEL"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SWING",
          "RULES"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "LOG",
          "MARKER"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "LABEL",
        "RULES",
        "MARKER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-05-22-food-stops-crew-service-spots-breakfast",
    "date": "2026-05-22",
    "dayIndex": 7,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "BOOTH",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Service Spots",
        "words": [
          "CASE",
          "BOOTH",
          "STALL"
        ]
      },
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "CASE",
          "MUFFIN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "BOOTH",
          "OMELET"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "STALL",
          "BERRIES"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "CASE",
        "BOOTH",
        "STALL"
      ],
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-05-23-media-modes-openers-people-audio-cues",
    "date": "2026-05-23",
    "dayIndex": 8,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "ACTOR",
    "rows": [
      {
        "label": "Openers",
        "words": [
          "INTRO",
          "SCENE",
          "HEADLINE"
        ]
      },
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "INTRO",
          "HOST",
          "MIC"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "ACTOR",
          "THEME"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "HEADLINE",
          "EDITOR",
          "TONE"
        ]
      }
    ],
    "grid": [
      [
        "INTRO",
        "SCENE",
        "HEADLINE"
      ],
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-05-24-market-stations-vendors-display-gear-takeaways",
    "date": "2026-05-24",
    "dayIndex": 9,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Weekend market stations",
    "centerWord": "BUCKET",
    "rows": [
      {
        "label": "Vendors",
        "words": [
          "BAKER",
          "FLORIST",
          "FARMER"
        ]
      },
      {
        "label": "Display Gear",
        "words": [
          "CASE",
          "BUCKET",
          "CRATE"
        ]
      },
      {
        "label": "Takeaways",
        "words": [
          "BREAD",
          "DAISY",
          "PEACH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "CASE",
          "BREAD"
        ]
      },
      {
        "label": "Flower Stall",
        "words": [
          "FLORIST",
          "BUCKET",
          "DAISY"
        ]
      },
      {
        "label": "Produce Stand",
        "words": [
          "FARMER",
          "CRATE",
          "PEACH"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "FLORIST",
        "FARMER"
      ],
      [
        "CASE",
        "BUCKET",
        "CRATE"
      ],
      [
        "BREAD",
        "DAISY",
        "PEACH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "market-stations"
  },
  {
    "id": "subset-2026-05-25-holiday-memorial-day",
    "date": "2026-05-25",
    "dayIndex": 10,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Memorial Day",
    "centerWord": "GATHERING",
    "rows": [
      {
        "label": "Memorial Day",
        "words": [
          "FLAG",
          "PARADE",
          "HONOR"
        ]
      },
      {
        "label": "Community",
        "words": [
          "WREATH",
          "GATHERING",
          "MEMORY"
        ]
      },
      {
        "label": "Service",
        "words": [
          "BADGE",
          "SALUTE",
          "DUTY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Symbols",
        "words": [
          "FLAG",
          "WREATH",
          "BADGE"
        ]
      },
      {
        "label": "Ceremonies",
        "words": [
          "PARADE",
          "GATHERING",
          "SALUTE"
        ]
      },
      {
        "label": "Memory",
        "words": [
          "HONOR",
          "MEMORY",
          "DUTY"
        ]
      }
    ],
    "grid": [
      [
        "FLAG",
        "PARADE",
        "HONOR"
      ],
      [
        "WREATH",
        "GATHERING",
        "MEMORY"
      ],
      [
        "BADGE",
        "SALUTE",
        "DUTY"
      ]
    ],
    "holiday": {
      "name": "Memorial Day",
      "axis": "row",
      "index": 0,
      "label": "Memorial Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-memorial-day"
  },
  {
    "id": "subset-2026-05-26-music-groups-players-sheets-signals",
    "date": "2026-05-26",
    "dayIndex": 11,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "SCORE",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Sheets",
        "words": [
          "SETLIST",
          "SCORE",
          "HYMNAL"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "SETLIST",
          "COUNT"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "SCORE",
          "BATON"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "HYMNAL",
          "CUE"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "SETLIST",
        "SCORE",
        "HYMNAL"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-05-27-farm-stand-flow",
    "date": "2026-05-27",
    "dayIndex": 12,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Farm stand counters and handoffs",
    "centerWord": "CRATE",
    "rows": [
      {
        "label": "Vendors",
        "words": [
          "GROWER",
          "PRESSER",
          "FLORIST"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "SCALE",
          "CRATE",
          "VASE"
        ]
      },
      {
        "label": "Takeaways",
        "words": [
          "PEACH",
          "CIDER",
          "DAISY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Produce Stall",
        "words": [
          "GROWER",
          "SCALE",
          "PEACH"
        ]
      },
      {
        "label": "Cider Press",
        "words": [
          "PRESSER",
          "CRATE",
          "CIDER"
        ]
      },
      {
        "label": "Flower Booth",
        "words": [
          "FLORIST",
          "VASE",
          "DAISY"
        ]
      }
    ],
    "grid": [
      [
        "GROWER",
        "PRESSER",
        "FLORIST"
      ],
      [
        "SCALE",
        "CRATE",
        "VASE"
      ],
      [
        "PEACH",
        "CIDER",
        "DAISY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "farm-stand-flow"
  },
  {
    "id": "subset-2026-05-28-nature-zones-wildlife-movement-colors",
    "date": "2026-05-28",
    "dayIndex": 13,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CURRENT",
    "rows": [
      {
        "label": "Wildlife",
        "words": [
          "FOX",
          "SEAL",
          "EAGLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOX",
          "RUSTLE",
          "MOSS"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SEAL",
          "CURRENT",
          "CORAL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "EAGLE",
          "BREEZE",
          "AZURE"
        ]
      }
    ],
    "grid": [
      [
        "FOX",
        "SEAL",
        "EAGLE"
      ],
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-05-29-city-outings-entry-points-guides-workers",
    "date": "2026-05-29",
    "dayIndex": 14,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "GALLERY",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Guides",
        "words": [
          "ROUTE",
          "GALLERY",
          "MENU"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "ROUTE",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "GALLERY",
          "DOCENT"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "MENU",
          "WAITER"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "ROUTE",
        "GALLERY",
        "MENU"
      ],
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-05-30-harbor-morning",
    "date": "2026-05-30",
    "dayIndex": 15,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Harbor morning roles",
    "centerWord": "CLEAT",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "FISHER",
          "DECKHAND",
          "HARBORMASTER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "NET",
          "CLEAT",
          "LOGBOOK"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "WEIGH",
          "TIE",
          "INSPECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Fish Stall",
        "words": [
          "FISHER",
          "NET",
          "WEIGH"
        ]
      },
      {
        "label": "Boat Dock",
        "words": [
          "DECKHAND",
          "CLEAT",
          "TIE"
        ]
      },
      {
        "label": "Harbor Office",
        "words": [
          "HARBORMASTER",
          "LOGBOOK",
          "INSPECT"
        ]
      }
    ],
    "grid": [
      [
        "FISHER",
        "DECKHAND",
        "HARBORMASTER"
      ],
      [
        "NET",
        "CLEAT",
        "LOGBOOK"
      ],
      [
        "WEIGH",
        "TIE",
        "INSPECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "harbor-morning"
  },
  {
    "id": "subset-2026-05-31-errands-staff-papers-cards-and-slips",
    "date": "2026-05-31",
    "dayIndex": 16,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "PRESCRIPTION",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "CHECK",
          "DEBIT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "PRESCRIPTION",
          "INSURANCE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "STAMP",
          "POSTCARD"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-06-01-school-life-adults-equipment-routines",
    "date": "2026-06-01",
    "dayIndex": 17,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "WHISTLE",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "SHELF",
          "QUIET"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "WHISTLE",
          "DRILLS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "MICROSCOPE",
          "SAFETY"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-06-02-maker-tools-prep-tools-surfaces-safety-wear",
    "date": "2026-06-02",
    "dayIndex": 18,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "BEAM",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "COUNTER",
          "APRON"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "BEAM",
          "GOGGLES"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "BACKDROP",
          "STRAP"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-06-03-birthday-picnic",
    "date": "2026-06-03",
    "dayIndex": 19,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Birthday picnic details",
    "centerWord": "RIBBON",
    "rows": [
      {
        "label": "Hosts",
        "words": [
          "PARENT",
          "FRIEND",
          "PHOTOGRAPHER"
        ]
      },
      {
        "label": "Party Props",
        "words": [
          "CAKE",
          "RIBBON",
          "BALLOON"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SING",
          "UNWRAP",
          "POSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Picnic Table",
        "words": [
          "PARENT",
          "CAKE",
          "SING"
        ]
      },
      {
        "label": "Gift Bag",
        "words": [
          "FRIEND",
          "RIBBON",
          "UNWRAP"
        ]
      },
      {
        "label": "Photo Spot",
        "words": [
          "PHOTOGRAPHER",
          "BALLOON",
          "POSE"
        ]
      }
    ],
    "grid": [
      [
        "PARENT",
        "FRIEND",
        "PHOTOGRAPHER"
      ],
      [
        "CAKE",
        "RIBBON",
        "BALLOON"
      ],
      [
        "SING",
        "UNWRAP",
        "POSE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "birthday-picnic"
  },
  {
    "id": "subset-2026-06-04-commute-stops-access-moving",
    "date": "2026-06-04",
    "dayIndex": 20,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "PASS",
    "rows": [
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RACK",
          "LOCK",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "SHELTER",
          "PASS",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "STATION",
          "TICKET",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-06-05-pets-homes-meals-care",
    "date": "2026-06-05",
    "dayIndex": 21,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "TUNA",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "KIBBLE",
          "LEASH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "TUNA",
          "LITTER"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FLAKES",
          "FILTER"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-06-06-daily-tech-parts-power-quick-moves",
    "date": "2026-06-06",
    "dayIndex": 22,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CABLE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CHARGER",
          "CALL"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "CABLE",
          "TYPE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "BATTERY",
          "SNAP"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CALL",
        "TYPE",
        "SNAP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-06-07-post-office-rush-live-workers-tools-moves",
    "date": "2026-06-07",
    "dayIndex": 23,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Post office rush",
    "centerWord": "SCANNER",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "POSTMASTER",
          "COURIER",
          "SORTER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "SCALE",
          "SCANNER",
          "BIN"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "STAMP",
          "DELIVER",
          "ROUTE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Post Office",
        "words": [
          "POSTMASTER",
          "SCALE",
          "STAMP"
        ]
      },
      {
        "label": "Delivery Van",
        "words": [
          "COURIER",
          "SCANNER",
          "DELIVER"
        ]
      },
      {
        "label": "Mailroom",
        "words": [
          "SORTER",
          "BIN",
          "ROUTE"
        ]
      }
    ],
    "grid": [
      [
        "POSTMASTER",
        "COURIER",
        "SORTER"
      ],
      [
        "SCALE",
        "SCANNER",
        "BIN"
      ],
      [
        "STAMP",
        "DELIVER",
        "ROUTE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "post-office-rush-live"
  },
  {
    "id": "subset-2026-06-08-outings-on-duty-entry-props-day-gear",
    "date": "2026-06-08",
    "dayIndex": 24,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "PLAYBILL",
    "rows": [
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LIFEGUARD",
          "WRISTBAND",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "USHER",
          "PLAYBILL",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "UMPIRE",
          "STUB",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-06-09-rooms-morning-floor-items-glow",
    "date": "2026-06-09",
    "dayIndex": 25,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "SCALE",
    "rows": [
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "COFFEE",
          "MAT",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "RAZOR",
          "SCALE",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "ALARM",
          "RUG",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-06-10-opened-locked-shared-household-pantry-shelf-class-kit",
    "date": "2026-06-10",
    "dayIndex": 26,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "CABINET",
    "rows": [
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "WINDOW",
          "JAR",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "DOOR",
          "CABINET",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "ROOM",
          "RECIPE",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-06-11-workspaces-drafts-displays-feedback",
    "date": "2026-06-11",
    "dayIndex": 27,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "MONITOR",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "CANVAS",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "MONITOR",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "PROJECTOR",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-06-12-travel-stops-comfort-bites-beacons",
    "date": "2026-06-12",
    "dayIndex": 28,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "BUFFET",
    "rows": [
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "PILLOW",
          "PRETZEL",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "ROBE",
          "BUFFET",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BLANKET",
          "GRANOLA",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-06-13-ferry-terminal",
    "date": "2026-06-13",
    "dayIndex": 29,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Ferry terminal moments",
    "centerWord": "ROPE",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "TICKETER",
          "DECKHAND",
          "SNACKCLERK"
        ]
      },
      {
        "label": "Items",
        "words": [
          "FARE",
          "ROPE",
          "COOKIE"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "STAMP",
          "MOOR",
          "SNACK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Window",
        "words": [
          "TICKETER",
          "FARE",
          "STAMP"
        ]
      },
      {
        "label": "Dock",
        "words": [
          "DECKHAND",
          "ROPE",
          "MOOR"
        ]
      },
      {
        "label": "Snack Bar",
        "words": [
          "SNACKCLERK",
          "COOKIE",
          "SNACK"
        ]
      }
    ],
    "grid": [
      [
        "TICKETER",
        "DECKHAND",
        "SNACKCLERK"
      ],
      [
        "FARE",
        "ROPE",
        "COOKIE"
      ],
      [
        "STAMP",
        "MOOR",
        "SNACK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "ferry-terminal"
  },
  {
    "id": "subset-2026-06-14-park-days-water-finds-tools-wildlife",
    "date": "2026-06-14",
    "dayIndex": 30,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SHOVEL",
    "rows": [
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "HOSE",
          "RAKE",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SPRINKLER",
          "SHOVEL",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "STREAM",
          "COMPASS",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-06-15-food-stops-crew-paper-sweet",
    "date": "2026-06-15",
    "dayIndex": 31,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "PLACEMAT",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "BAG",
          "ICING"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "PLACEMAT",
          "SYRUP"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "LIST",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-06-16-media-modes-people-units-following",
    "date": "2026-06-16",
    "dayIndex": 32,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "SCENE",
    "rows": [
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Units",
        "words": [
          "EPISODE",
          "SCENE",
          "ISSUE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "HOST",
          "EPISODE",
          "SUBSCRIBE"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "ACTOR",
          "SCENE",
          "WATCHLIST"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "EDITOR",
          "ISSUE",
          "INBOX"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "EPISODE",
        "SCENE",
        "ISSUE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-06-17-repair-counters-live-specialists-parts-tasks",
    "date": "2026-06-17",
    "dayIndex": 33,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Repair counters in common language",
    "centerWord": "CHAIN",
    "rows": [
      {
        "label": "Specialists",
        "words": [
          "TAILOR",
          "MECHANIC",
          "COBBLER"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "BUTTON",
          "CHAIN",
          "SOLE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "HEM",
          "TUNE",
          "RESOLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Alterations",
        "words": [
          "TAILOR",
          "BUTTON",
          "HEM"
        ]
      },
      {
        "label": "Bike Shop",
        "words": [
          "MECHANIC",
          "CHAIN",
          "TUNE"
        ]
      },
      {
        "label": "Shoe Counter",
        "words": [
          "COBBLER",
          "SOLE",
          "RESOLE"
        ]
      }
    ],
    "grid": [
      [
        "TAILOR",
        "MECHANIC",
        "COBBLER"
      ],
      [
        "BUTTON",
        "CHAIN",
        "SOLE"
      ],
      [
        "HEM",
        "TUNE",
        "RESOLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "repair-counters-live"
  },
  {
    "id": "subset-2026-06-18-sports-fields-gear-places-fans",
    "date": "2026-06-18",
    "dayIndex": 34,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "COURT",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "DUGOUT",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "COURT",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "FIELD",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-06-19-holiday-juneteenth",
    "date": "2026-06-19",
    "dayIndex": 35,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Juneteenth",
    "centerWord": "JUSTICE",
    "rows": [
      {
        "label": "Juneteenth",
        "words": [
          "BARBECUE",
          "FREEDOM",
          "JUBILEE"
        ]
      },
      {
        "label": "Community",
        "words": [
          "POTLUCK",
          "JUSTICE",
          "PARADE"
        ]
      },
      {
        "label": "Family Table",
        "words": [
          "DINNER",
          "JOY",
          "REUNION"
        ]
      }
    ],
    "columns": [
      {
        "label": "Freedom Table",
        "words": [
          "BARBECUE",
          "POTLUCK",
          "DINNER"
        ]
      },
      {
        "label": "Values",
        "words": [
          "FREEDOM",
          "JUSTICE",
          "JOY"
        ]
      },
      {
        "label": "Gatherings",
        "words": [
          "JUBILEE",
          "PARADE",
          "REUNION"
        ]
      }
    ],
    "grid": [
      [
        "BARBECUE",
        "FREEDOM",
        "JUBILEE"
      ],
      [
        "POTLUCK",
        "JUSTICE",
        "PARADE"
      ],
      [
        "DINNER",
        "JOY",
        "REUNION"
      ]
    ],
    "holiday": {
      "name": "Juneteenth",
      "axis": "row",
      "index": 0,
      "label": "Juneteenth"
    },
    "packRole": "live",
    "themeGroupId": "holiday-juneteenth"
  },
  {
    "id": "subset-2026-06-20-hotel-lobby-flow",
    "date": "2026-06-20",
    "dayIndex": 36,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Hotel lobby touchpoints",
    "centerWord": "BUTTON",
    "rows": [
      {
        "label": "Lobby Staff",
        "words": [
          "CONCIERGE",
          "PORTER",
          "HOST"
        ]
      },
      {
        "label": "Lobby Pieces",
        "words": [
          "KEYCARD",
          "BUTTON",
          "WAFFLE"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "CHECKIN",
          "RIDE",
          "REFILL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Front Desk",
        "words": [
          "CONCIERGE",
          "KEYCARD",
          "CHECKIN"
        ]
      },
      {
        "label": "Elevator",
        "words": [
          "PORTER",
          "BUTTON",
          "RIDE"
        ]
      },
      {
        "label": "Breakfast Bar",
        "words": [
          "HOST",
          "WAFFLE",
          "REFILL"
        ]
      }
    ],
    "grid": [
      [
        "CONCIERGE",
        "PORTER",
        "HOST"
      ],
      [
        "KEYCARD",
        "BUTTON",
        "WAFFLE"
      ],
      [
        "CHECKIN",
        "RIDE",
        "REFILL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "hotel-lobby-flow"
  },
  {
    "id": "subset-2026-06-21-holiday-father-s-day",
    "date": "2026-06-21",
    "dayIndex": 37,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Father's Day",
    "centerWord": "BURGER",
    "rows": [
      {
        "label": "Father's Day",
        "words": [
          "DAD",
          "GRILL",
          "TIE"
        ]
      },
      {
        "label": "Cookout",
        "words": [
          "UNCLE",
          "BURGER",
          "CAP"
        ]
      },
      {
        "label": "Childhood",
        "words": [
          "CHILD",
          "SNACK",
          "DRAWING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Family",
        "words": [
          "DAD",
          "UNCLE",
          "CHILD"
        ]
      },
      {
        "label": "Cookout Fare",
        "words": [
          "GRILL",
          "BURGER",
          "SNACK"
        ]
      },
      {
        "label": "Gifts",
        "words": [
          "TIE",
          "CAP",
          "DRAWING"
        ]
      }
    ],
    "grid": [
      [
        "DAD",
        "GRILL",
        "TIE"
      ],
      [
        "UNCLE",
        "BURGER",
        "CAP"
      ],
      [
        "CHILD",
        "SNACK",
        "DRAWING"
      ]
    ],
    "holiday": {
      "name": "Father's Day",
      "axis": "row",
      "index": 0,
      "label": "Father's Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-father-s-day"
  },
  {
    "id": "subset-2026-06-22-city-outings-rest-spots-waiting-hand-props",
    "date": "2026-06-22",
    "dayIndex": 38,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "LINE",
    "rows": [
      {
        "label": "Rest Spots",
        "words": [
          "SEAT",
          "BENCH",
          "BOOTH"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "SEAT",
          "PLATFORM",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "BENCH",
          "LINE",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "BOOTH",
          "TABLE",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "SEAT",
        "BENCH",
        "BOOTH"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-06-23-craft-fair",
    "date": "2026-06-23",
    "dayIndex": 39,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Craft fair booths",
    "centerWord": "BRACELET",
    "rows": [
      {
        "label": "Makers",
        "words": [
          "POTTER",
          "JEWELER",
          "PRINTER"
        ]
      },
      {
        "label": "Display",
        "words": [
          "BOWL",
          "BRACELET",
          "POSTER"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "GLAZE",
          "POLISH",
          "INK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Clay Table",
        "words": [
          "POTTER",
          "BOWL",
          "GLAZE"
        ]
      },
      {
        "label": "Jewelry Case",
        "words": [
          "JEWELER",
          "BRACELET",
          "POLISH"
        ]
      },
      {
        "label": "Print Rack",
        "words": [
          "PRINTER",
          "POSTER",
          "INK"
        ]
      }
    ],
    "grid": [
      [
        "POTTER",
        "JEWELER",
        "PRINTER"
      ],
      [
        "BOWL",
        "BRACELET",
        "POSTER"
      ],
      [
        "GLAZE",
        "POLISH",
        "INK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "craft-fair"
  },
  {
    "id": "subset-2026-06-24-errands-staff-back-shelves-numbers",
    "date": "2026-06-24",
    "dayIndex": 40,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DRAWER",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "VAULT",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "DRAWER",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "BOX",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-06-25-school-life-adults-room-noise-class-tasks",
    "date": "2026-06-25",
    "dayIndex": 41,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "BUZZER",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "PAGE",
          "READING"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "BUZZER",
          "LAPS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "BEEP",
          "EXPERIMENT"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-06-26-maker-tools-prep-tools-measures-kits",
    "date": "2026-06-26",
    "dayIndex": 42,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "LEVEL",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "TIMER",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "LEVEL",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "APERTURE",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-06-27-graduation-day",
    "date": "2026-06-27",
    "dayIndex": 43,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Graduation day details",
    "centerWord": "PHOTO",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "SPEAKER",
          "GRANDPARENT",
          "HOST"
        ]
      },
      {
        "label": "Keepsakes",
        "words": [
          "DIPLOMA",
          "PHOTO",
          "PROGRAM"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "CHEER",
          "HUG",
          "TOAST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Stage",
        "words": [
          "SPEAKER",
          "DIPLOMA",
          "CHEER"
        ]
      },
      {
        "label": "Family Row",
        "words": [
          "GRANDPARENT",
          "PHOTO",
          "HUG"
        ]
      },
      {
        "label": "Reception",
        "words": [
          "HOST",
          "PROGRAM",
          "TOAST"
        ]
      }
    ],
    "grid": [
      [
        "SPEAKER",
        "GRANDPARENT",
        "HOST"
      ],
      [
        "DIPLOMA",
        "PHOTO",
        "PROGRAM"
      ],
      [
        "CHEER",
        "HUG",
        "TOAST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "graduation-day"
  },
  {
    "id": "subset-2026-06-28-commute-operators-routes-signals",
    "date": "2026-06-28",
    "dayIndex": 44,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "ROUTE",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "LANE",
          "BELL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "ROUTE",
          "SIGN"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "TRACK",
          "WHISTLE"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-06-29-pets-pet-noises-playthings-movement",
    "date": "2026-06-29",
    "dayIndex": 45,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "YARN",
    "rows": [
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "BARK",
          "BALL",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "MEOW",
          "YARN",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "BUBBLES",
          "CASTLE",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-06-30-daily-tech-power-saved-stuff-warnings",
    "date": "2026-06-30",
    "dayIndex": 46,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "FILES",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "CONTACTS",
          "ALERT"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "FILES",
          "CRASH"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "ALBUM",
          "BLUR"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-07-01-vet-clinic-stations-care-team-treatment-gear-visit-moves",
    "date": "2026-07-01",
    "dayIndex": 47,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Vet clinic stations",
    "centerWord": "BANDAGE",
    "rows": [
      {
        "label": "Care Team",
        "words": [
          "VET",
          "TECH",
          "GROOMER"
        ]
      },
      {
        "label": "Treatment Gear",
        "words": [
          "LEASH",
          "BANDAGE",
          "BRUSH"
        ]
      },
      {
        "label": "Visit Moves",
        "words": [
          "EXAM",
          "WRAP",
          "TRIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Exam Room",
        "words": [
          "VET",
          "LEASH",
          "EXAM"
        ]
      },
      {
        "label": "Recovery",
        "words": [
          "TECH",
          "BANDAGE",
          "WRAP"
        ]
      },
      {
        "label": "Grooming",
        "words": [
          "GROOMER",
          "BRUSH",
          "TRIM"
        ]
      }
    ],
    "grid": [
      [
        "VET",
        "TECH",
        "GROOMER"
      ],
      [
        "LEASH",
        "BANDAGE",
        "BRUSH"
      ],
      [
        "EXAM",
        "WRAP",
        "TRIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "vet-clinic-stations"
  },
  {
    "id": "subset-2026-07-02-outings-where-to-sit-sound-cues-on-duty",
    "date": "2026-07-02",
    "dayIndex": 48,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "APPLAUSE",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "WAVES",
          "LIFEGUARD"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "APPLAUSE",
          "USHER"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "CHEERS",
          "UMPIRE"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-07-03-rooms-built-ins-linens-morning",
    "date": "2026-07-03",
    "dayIndex": 49,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "TOWEL",
    "rows": [
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "PANTRY",
          "DISHCLOTH",
          "COFFEE"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "VANITY",
          "TOWEL",
          "RAZOR"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "CLOSET",
          "SHEET",
          "ALARM"
        ]
      }
    ],
    "grid": [
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-07-04-holiday-independence-day",
    "date": "2026-07-04",
    "dayIndex": 50,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Independence Day",
    "centerWord": "PICNIC",
    "rows": [
      {
        "label": "Independence Day",
        "words": [
          "FIREWORKS",
          "PARADE",
          "FLAG"
        ]
      },
      {
        "label": "Town Night",
        "words": [
          "SPARKLERS",
          "PICNIC",
          "BANNER"
        ]
      },
      {
        "label": "Civic Hall",
        "words": [
          "LANTERN",
          "CROWD",
          "BADGE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Lights",
        "words": [
          "FIREWORKS",
          "SPARKLERS",
          "LANTERN"
        ]
      },
      {
        "label": "Gatherings",
        "words": [
          "PARADE",
          "PICNIC",
          "CROWD"
        ]
      },
      {
        "label": "Symbols",
        "words": [
          "FLAG",
          "BANNER",
          "BADGE"
        ]
      }
    ],
    "grid": [
      [
        "FIREWORKS",
        "PARADE",
        "FLAG"
      ],
      [
        "SPARKLERS",
        "PICNIC",
        "BANNER"
      ],
      [
        "LANTERN",
        "CROWD",
        "BADGE"
      ]
    ],
    "holiday": {
      "name": "Independence Day",
      "axis": "row",
      "index": 0,
      "label": "Independence Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-independence-day"
  },
  {
    "id": "subset-2026-07-05-workspaces-furniture-supplies-deadlines",
    "date": "2026-07-05",
    "dayIndex": 51,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "STAPLER",
    "rows": [
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "EASEL",
          "BRUSH",
          "COMMISSION"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "DESK",
          "STAPLER",
          "REPORT"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "CHAIR",
          "RULER",
          "HOMEWORK"
        ]
      }
    ],
    "grid": [
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-07-06-travel-stops-bags-arrival-comfort",
    "date": "2026-07-06",
    "dayIndex": 52,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LOBBY",
    "rows": [
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "CARRYON",
          "GATE",
          "PILLOW"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LUGGAGE",
          "LOBBY",
          "ROBE"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BACKPACK",
          "SITE",
          "BLANKET"
        ]
      }
    ],
    "grid": [
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-07-07-public-pool-day",
    "date": "2026-07-07",
    "dayIndex": 53,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Public pool zones",
    "centerWord": "LOCKER",
    "rows": [
      {
        "label": "Pool Roles",
        "words": [
          "LIFEGUARD",
          "ATTENDANT",
          "VENDOR"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "WHISTLE",
          "LOCKER",
          "POPSICLE"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "WATCH",
          "RINSE",
          "SERVE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Guard Chair",
        "words": [
          "LIFEGUARD",
          "WHISTLE",
          "WATCH"
        ]
      },
      {
        "label": "Locker Room",
        "words": [
          "ATTENDANT",
          "LOCKER",
          "RINSE"
        ]
      },
      {
        "label": "Snack Stand",
        "words": [
          "VENDOR",
          "POPSICLE",
          "SERVE"
        ]
      }
    ],
    "grid": [
      [
        "LIFEGUARD",
        "ATTENDANT",
        "VENDOR"
      ],
      [
        "WHISTLE",
        "LOCKER",
        "POPSICLE"
      ],
      [
        "WATCH",
        "RINSE",
        "SERVE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "public-pool-day"
  },
  {
    "id": "subset-2026-07-08-park-days-underfoot-posted-rules-water-finds",
    "date": "2026-07-08",
    "dayIndex": 54,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "RULES",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "LABEL",
          "HOSE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "RULES",
          "SPRINKLER"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "MARKER",
          "STREAM"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "LABEL",
        "RULES",
        "MARKER"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-07-09-food-stops-breakfast-sweet-counter-tools",
    "date": "2026-07-09",
    "dayIndex": 55,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "SYRUP",
    "rows": [
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      },
      {
        "label": "Counter Tools",
        "words": [
          "OVEN",
          "GRIDDLE",
          "SCALE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "MUFFIN",
          "ICING",
          "OVEN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "OMELET",
          "SYRUP",
          "GRIDDLE"
        ]
      },
      {
        "label": "Market",
        "words": [
          "BERRIES",
          "HONEY",
          "SCALE"
        ]
      }
    ],
    "grid": [
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ],
      [
        "OVEN",
        "GRIDDLE",
        "SCALE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-07-10-media-modes-audio-cues-following-opinion",
    "date": "2026-07-10",
    "dayIndex": 56,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "WATCHLIST",
    "rows": [
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "MIC",
          "SUBSCRIBE",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "THEME",
          "WATCHLIST",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "TONE",
          "INBOX",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "MIC",
        "THEME",
        "TONE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-07-11-library-flow-live-library-staff-desk-tools-library-tasks",
    "date": "2026-07-11",
    "dayIndex": 57,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "How a library moves a book",
    "centerWord": "CART",
    "rows": [
      {
        "label": "Library Staff",
        "words": [
          "LIBRARIAN",
          "SHELVER",
          "ASSISTANT"
        ]
      },
      {
        "label": "Desk Tools",
        "words": [
          "CATALOG",
          "CART",
          "BARCODE"
        ]
      },
      {
        "label": "Library Tasks",
        "words": [
          "RECOMMEND",
          "SORT",
          "CHECKOUT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Reference Desk",
        "words": [
          "LIBRARIAN",
          "CATALOG",
          "RECOMMEND"
        ]
      },
      {
        "label": "Stacks",
        "words": [
          "SHELVER",
          "CART",
          "SORT"
        ]
      },
      {
        "label": "Front Desk",
        "words": [
          "ASSISTANT",
          "BARCODE",
          "CHECKOUT"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "SHELVER",
        "ASSISTANT"
      ],
      [
        "CATALOG",
        "CART",
        "BARCODE"
      ],
      [
        "RECOMMEND",
        "SORT",
        "CHECKOUT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "library-flow-live"
  },
  {
    "id": "subset-2026-07-12-sports-fields-gear-scoring-play-moves",
    "date": "2026-07-12",
    "dayIndex": 58,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SET",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "RUN",
          "PITCH"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "SET",
          "SERVE"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "GOAL",
          "PASS"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-07-13-music-groups-practice-cues-parts-big-sounds",
    "date": "2026-07-13",
    "dayIndex": 59,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "MOVEMENT",
    "rows": [
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "RIFF",
          "SOLO",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "REHEARSAL",
          "MOVEMENT",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "WARMUP",
          "VERSE",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-07-14-art-class-stations",
    "date": "2026-07-14",
    "dayIndex": 60,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Art class stations",
    "centerWord": "WIRE",
    "rows": [
      {
        "label": "Supplies",
        "words": [
          "CANVAS",
          "CLAY",
          "SPONGE"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "BRUSH",
          "WIRE",
          "TAP"
        ]
      },
      {
        "label": "Techniques",
        "words": [
          "SKETCH",
          "MOLD",
          "RINSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Easel",
        "words": [
          "CANVAS",
          "BRUSH",
          "SKETCH"
        ]
      },
      {
        "label": "Clay Table",
        "words": [
          "CLAY",
          "WIRE",
          "MOLD"
        ]
      },
      {
        "label": "Sink",
        "words": [
          "SPONGE",
          "TAP",
          "RINSE"
        ]
      }
    ],
    "grid": [
      [
        "CANVAS",
        "CLAY",
        "SPONGE"
      ],
      [
        "BRUSH",
        "WIRE",
        "TAP"
      ],
      [
        "SKETCH",
        "MOLD",
        "RINSE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "art-class-stations"
  },
  {
    "id": "subset-2026-07-15-nature-zones-colors-atmosphere-treasures",
    "date": "2026-07-15",
    "dayIndex": 61,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "SPRAY",
    "rows": [
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "MOSS",
          "FOG",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CORAL",
          "SPRAY",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "AZURE",
          "CLOUD",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-07-16-city-outings-entry-points-rest-spots-waiting",
    "date": "2026-07-16",
    "dayIndex": 62,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "BENCH",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "SEAT",
          "BENCH",
          "BOOTH"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "SEAT",
          "PLATFORM"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "BENCH",
          "LINE"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "BOOTH",
          "TABLE"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "SEAT",
        "BENCH",
        "BOOTH"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-07-17-nature-center",
    "date": "2026-07-17",
    "dayIndex": 63,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Nature center stops",
    "centerWord": "BINOCULARS",
    "rows": [
      {
        "label": "Guides",
        "words": [
          "RANGER",
          "BIRDER",
          "DOCENT"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "MAP",
          "BINOCULARS",
          "NET"
        ]
      },
      {
        "label": "Sights",
        "words": [
          "MARKER",
          "HERON",
          "TADPOLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Trail Desk",
        "words": [
          "RANGER",
          "MAP",
          "MARKER"
        ]
      },
      {
        "label": "Bird Blind",
        "words": [
          "BIRDER",
          "BINOCULARS",
          "HERON"
        ]
      },
      {
        "label": "Pond Deck",
        "words": [
          "DOCENT",
          "NET",
          "TADPOLE"
        ]
      }
    ],
    "grid": [
      [
        "RANGER",
        "BIRDER",
        "DOCENT"
      ],
      [
        "MAP",
        "BINOCULARS",
        "NET"
      ],
      [
        "MARKER",
        "HERON",
        "TADPOLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-center"
  },
  {
    "id": "subset-2026-07-18-errands-papers-cards-and-slips-back-shelves",
    "date": "2026-07-18",
    "dayIndex": 64,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "INSURANCE",
    "rows": [
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "CHECK",
          "DEBIT",
          "VAULT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PRESCRIPTION",
          "INSURANCE",
          "DRAWER"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "STAMP",
          "POSTCARD",
          "BOX"
        ]
      }
    ],
    "grid": [
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-07-19-school-life-routines-class-tasks-back-rooms",
    "date": "2026-07-19",
    "dayIndex": 65,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "LAPS",
    "rows": [
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "QUIET",
          "READING",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "DRILLS",
          "LAPS",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SAFETY",
          "EXPERIMENT",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-07-20-maker-tools-surfaces-outputs-measures",
    "date": "2026-07-20",
    "dayIndex": 66,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "FRAME",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "SAUCE",
          "TIMER"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "FRAME",
          "LEVEL"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "PORTRAIT",
          "APERTURE"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-07-21-block-party",
    "date": "2026-07-21",
    "dayIndex": 67,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Block party corners",
    "centerWord": "BALL",
    "rows": [
      {
        "label": "Neighbors",
        "words": [
          "COOK",
          "REFEREE",
          "DJ"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "TONGS",
          "BALL",
          "SPEAKER"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "FLIP",
          "LAUGH",
          "DANCE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Grill Table",
        "words": [
          "COOK",
          "TONGS",
          "FLIP"
        ]
      },
      {
        "label": "Game Lawn",
        "words": [
          "REFEREE",
          "BALL",
          "LAUGH"
        ]
      },
      {
        "label": "Music Porch",
        "words": [
          "DJ",
          "SPEAKER",
          "DANCE"
        ]
      }
    ],
    "grid": [
      [
        "COOK",
        "REFEREE",
        "DJ"
      ],
      [
        "TONGS",
        "BALL",
        "SPEAKER"
      ],
      [
        "FLIP",
        "LAUGH",
        "DANCE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "block-party"
  },
  {
    "id": "subset-2026-07-22-commute-operators-stops-moving",
    "date": "2026-07-22",
    "dayIndex": 68,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SHELTER",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "RACK",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "SHELTER",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "STATION",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-07-23-pets-homes-care-pet-noises",
    "date": "2026-07-23",
    "dayIndex": 69,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "LITTER",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "LEASH",
          "BARK"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "LITTER",
          "MEOW"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FILTER",
          "BUBBLES"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-07-24-daily-tech-saved-stuff-warnings-accessories",
    "date": "2026-07-24",
    "dayIndex": 70,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CRASH",
    "rows": [
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CONTACTS",
          "ALERT",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "FILES",
          "CRASH",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "ALBUM",
          "BLUR",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-07-25-firehouse-response-crew-gear-moves",
    "date": "2026-07-25",
    "dayIndex": 71,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Firehouse response zones",
    "centerWord": "HOSE",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "CAPTAIN",
          "DRIVER",
          "MEDIC"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "RADIO",
          "HOSE",
          "KIT"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "DISPATCH",
          "PUMP",
          "TREAT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Command Desk",
        "words": [
          "CAPTAIN",
          "RADIO",
          "DISPATCH"
        ]
      },
      {
        "label": "Engine Bay",
        "words": [
          "DRIVER",
          "HOSE",
          "PUMP"
        ]
      },
      {
        "label": "Ambulance",
        "words": [
          "MEDIC",
          "KIT",
          "TREAT"
        ]
      }
    ],
    "grid": [
      [
        "CAPTAIN",
        "DRIVER",
        "MEDIC"
      ],
      [
        "RADIO",
        "HOSE",
        "KIT"
      ],
      [
        "DISPATCH",
        "PUMP",
        "TREAT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "firehouse-response"
  },
  {
    "id": "subset-2026-07-26-outings-snacks-on-duty-entry-props",
    "date": "2026-07-26",
    "dayIndex": 72,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "USHER",
    "rows": [
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "PRETZEL",
          "LIFEGUARD",
          "WRISTBAND"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "POPCORN",
          "USHER",
          "PLAYBILL"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "NACHOS",
          "UMPIRE",
          "STUB"
        ]
      }
    ],
    "grid": [
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-07-27-rooms-built-ins-morning-glow",
    "date": "2026-07-27",
    "dayIndex": 73,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "RAZOR",
    "rows": [
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "PANTRY",
          "COFFEE",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "VANITY",
          "RAZOR",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "CLOSET",
          "ALARM",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-07-28-opened-locked-shared-household-teamwork-pantry-shelf",
    "date": "2026-07-28",
    "dayIndex": 74,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "ACCOUNT",
    "rows": [
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "WINDOW",
          "CALENDAR",
          "JAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "DOOR",
          "ACCOUNT",
          "CABINET"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "ROOM",
          "DOC",
          "RECIPE"
        ]
      }
    ],
    "grid": [
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-07-29-workspaces-drafts-furniture-displays",
    "date": "2026-07-29",
    "dayIndex": 75,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "DESK",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "EASEL",
          "CANVAS"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "DESK",
          "MONITOR"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "CHAIR",
          "PROJECTOR"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-07-30-travel-stops-sleep-comfort-beacons",
    "date": "2026-07-30",
    "dayIndex": 76,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "ROBE",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "PILLOW",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "ROBE",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "BLANKET",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-07-31-train-trip-flow",
    "date": "2026-07-31",
    "dayIndex": 77,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Train trip flow",
    "centerWord": "SUITCASE",
    "rows": [
      {
        "label": "Train Crew",
        "words": [
          "AGENT",
          "BRAKEMAN",
          "SERVER"
        ]
      },
      {
        "label": "Trip Gear",
        "words": [
          "TICKET",
          "SUITCASE",
          "MENU"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "RESERVE",
          "WAIT",
          "ORDER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Counter",
        "words": [
          "AGENT",
          "TICKET",
          "RESERVE"
        ]
      },
      {
        "label": "Platform",
        "words": [
          "BRAKEMAN",
          "SUITCASE",
          "WAIT"
        ]
      },
      {
        "label": "Dining Car",
        "words": [
          "SERVER",
          "MENU",
          "ORDER"
        ]
      }
    ],
    "grid": [
      [
        "AGENT",
        "BRAKEMAN",
        "SERVER"
      ],
      [
        "TICKET",
        "SUITCASE",
        "MENU"
      ],
      [
        "RESERVE",
        "WAIT",
        "ORDER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "train-trip-flow"
  },
  {
    "id": "subset-2026-08-01-park-days-underfoot-water-finds-tools",
    "date": "2026-08-01",
    "dayIndex": 78,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SPRINKLER",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "HOSE",
          "RAKE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SPRINKLER",
          "SHOVEL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "STREAM",
          "COMPASS"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-08-02-food-stops-crew-breakfast-paper",
    "date": "2026-08-02",
    "dayIndex": 79,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "OMELET",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "MUFFIN",
          "BAG"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "OMELET",
          "PLACEMAT"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "BERRIES",
          "LIST"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-08-03-media-modes-openers-audio-cues-opinion",
    "date": "2026-08-03",
    "dayIndex": 80,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "THEME",
    "rows": [
      {
        "label": "Openers",
        "words": [
          "INTRO",
          "SCENE",
          "HEADLINE"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "INTRO",
          "MIC",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "THEME",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "HEADLINE",
          "TONE",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "INTRO",
        "SCENE",
        "HEADLINE"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-08-04-camp-stations-leaders-gear-activities",
    "date": "2026-08-04",
    "dayIndex": 81,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Summer camp stations",
    "centerWord": "VEST",
    "rows": [
      {
        "label": "Leaders",
        "words": [
          "COUNSELOR",
          "LIFEGUARD",
          "RANGER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "GLUE",
          "VEST",
          "COMPASS"
        ]
      },
      {
        "label": "Activities",
        "words": [
          "CRAFT",
          "SWIM",
          "HIKE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Craft Cabin",
        "words": [
          "COUNSELOR",
          "GLUE",
          "CRAFT"
        ]
      },
      {
        "label": "Waterfront",
        "words": [
          "LIFEGUARD",
          "VEST",
          "SWIM"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "RANGER",
          "COMPASS",
          "HIKE"
        ]
      }
    ],
    "grid": [
      [
        "COUNSELOR",
        "LIFEGUARD",
        "RANGER"
      ],
      [
        "GLUE",
        "VEST",
        "COMPASS"
      ],
      [
        "CRAFT",
        "SWIM",
        "HIKE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "camp-stations"
  },
  {
    "id": "subset-2026-08-05-sports-fields-scoring-play-moves-fans",
    "date": "2026-08-05",
    "dayIndex": 82,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SERVE",
    "rows": [
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "RUN",
          "PITCH",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "SET",
          "SERVE",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "GOAL",
          "PASS",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-08-06-music-groups-players-practice-cues-big-sounds",
    "date": "2026-08-06",
    "dayIndex": 83,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "REHEARSAL",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "RIFF",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "REHEARSAL",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "WARMUP",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-08-07-campground-evening",
    "date": "2026-08-07",
    "dayIndex": 84,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Campground evening routines",
    "centerWord": "TARP",
    "rows": [
      {
        "label": "Camp Roles",
        "words": [
          "COOK",
          "CAMPER",
          "RANGER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "MATCHES",
          "TARP",
          "GUIDEBOOK"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "ROAST",
          "PITCH",
          "PERMIT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Fire Ring",
        "words": [
          "COOK",
          "MATCHES",
          "ROAST"
        ]
      },
      {
        "label": "Tent Site",
        "words": [
          "CAMPER",
          "TARP",
          "PITCH"
        ]
      },
      {
        "label": "Ranger Desk",
        "words": [
          "RANGER",
          "GUIDEBOOK",
          "PERMIT"
        ]
      }
    ],
    "grid": [
      [
        "COOK",
        "CAMPER",
        "RANGER"
      ],
      [
        "MATCHES",
        "TARP",
        "GUIDEBOOK"
      ],
      [
        "ROAST",
        "PITCH",
        "PERMIT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "campground-evening"
  },
  {
    "id": "subset-2026-08-08-nature-zones-atmosphere-curves-treasures",
    "date": "2026-08-08",
    "dayIndex": 85,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "WAVE",
    "rows": [
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      },
      {
        "label": "Curves",
        "words": [
          "RING",
          "WAVE",
          "ARC"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOG",
          "RING",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SPRAY",
          "WAVE",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "CLOUD",
          "ARC",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ],
      [
        "RING",
        "WAVE",
        "ARC"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-08-09-city-outings-entry-points-guides-hand-props",
    "date": "2026-08-09",
    "dayIndex": 86,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "GALLERY",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Guides",
        "words": [
          "ROUTE",
          "GALLERY",
          "MENU"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "ROUTE",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "GALLERY",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "MENU",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "ROUTE",
        "GALLERY",
        "MENU"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-08-10-newsroom-day",
    "date": "2026-08-10",
    "dayIndex": 87,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Newsroom desk work",
    "centerWord": "CAPTION",
    "rows": [
      {
        "label": "Editors",
        "words": [
          "COPYEDITOR",
          "PHOTOEDITOR",
          "PRODUCER"
        ]
      },
      {
        "label": "Assets",
        "words": [
          "STYLEBOOK",
          "CAPTION",
          "LINK"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "PROOF",
          "CROP",
          "POST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Copy Team",
        "words": [
          "COPYEDITOR",
          "STYLEBOOK",
          "PROOF"
        ]
      },
      {
        "label": "Photo Lab",
        "words": [
          "PHOTOEDITOR",
          "CAPTION",
          "CROP"
        ]
      },
      {
        "label": "Website",
        "words": [
          "PRODUCER",
          "LINK",
          "POST"
        ]
      }
    ],
    "grid": [
      [
        "COPYEDITOR",
        "PHOTOEDITOR",
        "PRODUCER"
      ],
      [
        "STYLEBOOK",
        "CAPTION",
        "LINK"
      ],
      [
        "PROOF",
        "CROP",
        "POST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "newsroom-day"
  },
  {
    "id": "subset-2026-08-11-errands-staff-numbers-receipts",
    "date": "2026-08-11",
    "dayIndex": 88,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DOSE",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      },
      {
        "label": "Receipts",
        "words": [
          "RECEIPT",
          "LABEL",
          "TRACKING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "PIN",
          "RECEIPT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "DOSE",
          "LABEL"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "ZIP",
          "TRACKING"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ],
      [
        "RECEIPT",
        "LABEL",
        "TRACKING"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-08-12-school-life-equipment-routines-room-noise",
    "date": "2026-08-12",
    "dayIndex": 89,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "DRILLS",
    "rows": [
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "SHELF",
          "QUIET",
          "PAGE"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "WHISTLE",
          "DRILLS",
          "BUZZER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "MICROSCOPE",
          "SAFETY",
          "BEEP"
        ]
      }
    ],
    "grid": [
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-08-13-maker-tools-surfaces-safety-wear-kits",
    "date": "2026-08-13",
    "dayIndex": 90,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "GOGGLES",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "APRON",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "GOGGLES",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "STRAP",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-08-14-team-banquet",
    "date": "2026-08-14",
    "dayIndex": 91,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Team banquet moments",
    "centerWord": "PLATE",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "CAPTAIN",
          "SERVER",
          "COACH"
        ]
      },
      {
        "label": "Awards",
        "words": [
          "TROPHY",
          "PLATE",
          "NOTES"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "CLAP",
          "SERVE",
          "THANK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Awards Table",
        "words": [
          "CAPTAIN",
          "TROPHY",
          "CLAP"
        ]
      },
      {
        "label": "Dinner Line",
        "words": [
          "SERVER",
          "PLATE",
          "SERVE"
        ]
      },
      {
        "label": "Coach Speech",
        "words": [
          "COACH",
          "NOTES",
          "THANK"
        ]
      }
    ],
    "grid": [
      [
        "CAPTAIN",
        "SERVER",
        "COACH"
      ],
      [
        "TROPHY",
        "PLATE",
        "NOTES"
      ],
      [
        "CLAP",
        "SERVE",
        "THANK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "team-banquet"
  },
  {
    "id": "subset-2026-08-15-commute-operators-access-moving",
    "date": "2026-08-15",
    "dayIndex": 92,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "PASS",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "LOCK",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "PASS",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "TICKET",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-08-16-pets-meals-pet-noises-movement",
    "date": "2026-08-16",
    "dayIndex": 93,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "MEOW",
    "rows": [
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KIBBLE",
          "BARK",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "TUNA",
          "MEOW",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FLAKES",
          "BUBBLES",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-08-17-daily-tech-power-quick-moves-saved-stuff",
    "date": "2026-08-17",
    "dayIndex": 94,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "TYPE",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "CALL",
          "CONTACTS"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "TYPE",
          "FILES"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "SNAP",
          "ALBUM"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-08-18-museum-exhibit-flow-museum-staff-gallery-items-tasks",
    "date": "2026-08-18",
    "dayIndex": 95,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Museum exhibit workflow",
    "centerWord": "HANGER",
    "rows": [
      {
        "label": "Museum Staff",
        "words": [
          "CURATOR",
          "FRAMER",
          "GUARD"
        ]
      },
      {
        "label": "Gallery Items",
        "words": [
          "LABEL",
          "HANGER",
          "BADGE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "SELECT",
          "MOUNT",
          "WATCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Exhibit",
        "words": [
          "CURATOR",
          "LABEL",
          "SELECT"
        ]
      },
      {
        "label": "Workshop",
        "words": [
          "FRAMER",
          "HANGER",
          "MOUNT"
        ]
      },
      {
        "label": "Gallery Door",
        "words": [
          "GUARD",
          "BADGE",
          "WATCH"
        ]
      }
    ],
    "grid": [
      [
        "CURATOR",
        "FRAMER",
        "GUARD"
      ],
      [
        "LABEL",
        "HANGER",
        "BADGE"
      ],
      [
        "SELECT",
        "MOUNT",
        "WATCH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "museum-exhibit-flow"
  },
  {
    "id": "subset-2026-08-19-outings-where-to-sit-entry-props-day-gear",
    "date": "2026-08-19",
    "dayIndex": 96,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "PLAYBILL",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "WRISTBAND",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "PLAYBILL",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "STUB",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-08-20-rooms-linens-floor-items-glow",
    "date": "2026-08-20",
    "dayIndex": 97,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "SCALE",
    "rows": [
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "DISHCLOTH",
          "MAT",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "TOWEL",
          "SCALE",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "SHEET",
          "RUG",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-08-21-opened-locked-shared-digital-pantry-shelf-class-kit",
    "date": "2026-08-21",
    "dayIndex": 98,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "CABINET",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "JAR",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "CABINET",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "RECIPE",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-08-22-workspaces-supplies-deadlines-displays",
    "date": "2026-08-22",
    "dayIndex": 99,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "REPORT",
    "rows": [
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "BRUSH",
          "COMMISSION",
          "CANVAS"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "STAPLER",
          "REPORT",
          "MONITOR"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "RULER",
          "HOMEWORK",
          "PROJECTOR"
        ]
      }
    ],
    "grid": [
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-08-23-travel-stops-sleep-bags-bites",
    "date": "2026-08-23",
    "dayIndex": 100,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LUGGAGE",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "CARRYON",
          "PRETZEL"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "LUGGAGE",
          "BUFFET"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "BACKPACK",
          "GRANOLA"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-08-24-bike-shop-loop",
    "date": "2026-08-24",
    "dayIndex": 101,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bike shop loop",
    "centerWord": "CHAIN",
    "rows": [
      {
        "label": "Shop Roles",
        "words": [
          "SALESPERSON",
          "MECHANIC",
          "RIDER"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "HELMET",
          "CHAIN",
          "CONE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "FIT",
          "TUNE",
          "PEDAL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Sales Floor",
        "words": [
          "SALESPERSON",
          "HELMET",
          "FIT"
        ]
      },
      {
        "label": "Repair Bench",
        "words": [
          "MECHANIC",
          "CHAIN",
          "TUNE"
        ]
      },
      {
        "label": "Test Lane",
        "words": [
          "RIDER",
          "CONE",
          "PEDAL"
        ]
      }
    ],
    "grid": [
      [
        "SALESPERSON",
        "MECHANIC",
        "RIDER"
      ],
      [
        "HELMET",
        "CHAIN",
        "CONE"
      ],
      [
        "FIT",
        "TUNE",
        "PEDAL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bike-shop-loop"
  },
  {
    "id": "subset-2026-08-25-park-days-rest-spots-tools-wildlife",
    "date": "2026-08-25",
    "dayIndex": 102,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SHOVEL",
    "rows": [
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "BENCH",
          "RAKE",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SWING",
          "SHOVEL",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "LOG",
          "COMPASS",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-08-26-food-stops-service-spots-paper-sweet",
    "date": "2026-08-26",
    "dayIndex": 103,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "PLACEMAT",
    "rows": [
      {
        "label": "Service Spots",
        "words": [
          "CASE",
          "BOOTH",
          "STALL"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "CASE",
          "BAG",
          "ICING"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "BOOTH",
          "PLACEMAT",
          "SYRUP"
        ]
      },
      {
        "label": "Market",
        "words": [
          "STALL",
          "LIST",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "CASE",
        "BOOTH",
        "STALL"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-08-27-media-modes-people-units-opinion",
    "date": "2026-08-27",
    "dayIndex": 104,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "SCENE",
    "rows": [
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Units",
        "words": [
          "EPISODE",
          "SCENE",
          "ISSUE"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "HOST",
          "EPISODE",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "ACTOR",
          "SCENE",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "EDITOR",
          "ISSUE",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "EPISODE",
        "SCENE",
        "ISSUE"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-08-28-studio-stations-live-people-equipment-outputs",
    "date": "2026-08-28",
    "dayIndex": 105,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Studio stations and outputs",
    "centerWord": "FADER",
    "rows": [
      {
        "label": "People",
        "words": [
          "SINGER",
          "ENGINEER",
          "PHOTOGRAPHER"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "MIC",
          "FADER",
          "CAMERA"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "VERSE",
          "MIX",
          "PORTRAIT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Vocal Booth",
        "words": [
          "SINGER",
          "MIC",
          "VERSE"
        ]
      },
      {
        "label": "Control Room",
        "words": [
          "ENGINEER",
          "FADER",
          "MIX"
        ]
      },
      {
        "label": "Photo Corner",
        "words": [
          "PHOTOGRAPHER",
          "CAMERA",
          "PORTRAIT"
        ]
      }
    ],
    "grid": [
      [
        "SINGER",
        "ENGINEER",
        "PHOTOGRAPHER"
      ],
      [
        "MIC",
        "FADER",
        "CAMERA"
      ],
      [
        "VERSE",
        "MIX",
        "PORTRAIT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "studio-stations-live"
  },
  {
    "id": "subset-2026-08-29-sports-fields-gear-places-officials",
    "date": "2026-08-29",
    "dayIndex": 106,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "COURT",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "DUGOUT",
          "UMPIRE"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "COURT",
          "REFEREE"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "FIELD",
          "REF"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-08-30-music-groups-parts-sheets-signals",
    "date": "2026-08-30",
    "dayIndex": 107,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "SCORE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Sheets",
        "words": [
          "SETLIST",
          "SCORE",
          "HYMNAL"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "SOLO",
          "SETLIST",
          "COUNT"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "MOVEMENT",
          "SCORE",
          "BATON"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "VERSE",
          "HYMNAL",
          "CUE"
        ]
      }
    ],
    "grid": [
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "SETLIST",
        "SCORE",
        "HYMNAL"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-08-31-market-tasting",
    "date": "2026-08-31",
    "dayIndex": 108,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Market tasting tables",
    "centerWord": "JAR",
    "rows": [
      {
        "label": "Vendors",
        "words": [
          "FROMAGER",
          "BEEKEEPER",
          "GROWER"
        ]
      },
      {
        "label": "Samples",
        "words": [
          "WEDGE",
          "JAR",
          "BASIL"
        ]
      },
      {
        "label": "Tasting Moves",
        "words": [
          "TASTE",
          "DRIZZLE",
          "SNIFF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cheese Stall",
        "words": [
          "FROMAGER",
          "WEDGE",
          "TASTE"
        ]
      },
      {
        "label": "Honey Booth",
        "words": [
          "BEEKEEPER",
          "JAR",
          "DRIZZLE"
        ]
      },
      {
        "label": "Herb Table",
        "words": [
          "GROWER",
          "BASIL",
          "SNIFF"
        ]
      }
    ],
    "grid": [
      [
        "FROMAGER",
        "BEEKEEPER",
        "GROWER"
      ],
      [
        "WEDGE",
        "JAR",
        "BASIL"
      ],
      [
        "TASTE",
        "DRIZZLE",
        "SNIFF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "market-tasting"
  },
  {
    "id": "subset-2026-09-01-nature-zones-movement-colors-curves",
    "date": "2026-09-01",
    "dayIndex": 109,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CORAL",
    "rows": [
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Curves",
        "words": [
          "RING",
          "WAVE",
          "ARC"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "RUSTLE",
          "MOSS",
          "RING"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CURRENT",
          "CORAL",
          "WAVE"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "BREEZE",
          "AZURE",
          "ARC"
        ]
      }
    ],
    "grid": [
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "RING",
        "WAVE",
        "ARC"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-09-02-city-outings-workers-waiting-hand-props",
    "date": "2026-09-02",
    "dayIndex": 110,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "LINE",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "CONDUCTOR",
          "PLATFORM",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "DOCENT",
          "LINE",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "WAITER",
          "TABLE",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-09-03-community-garden",
    "date": "2026-09-03",
    "dayIndex": 111,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Community garden plots",
    "centerWord": "BASIL",
    "rows": [
      {
        "label": "Tenders",
        "words": [
          "VOLUNTEER",
          "COOK",
          "GARDENER"
        ]
      },
      {
        "label": "Garden Gear",
        "words": [
          "SCRAPS",
          "BASIL",
          "HOE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "TURN",
          "PINCH",
          "STORE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Compost Bin",
        "words": [
          "VOLUNTEER",
          "SCRAPS",
          "TURN"
        ]
      },
      {
        "label": "Herb Plot",
        "words": [
          "COOK",
          "BASIL",
          "PINCH"
        ]
      },
      {
        "label": "Tool Shed",
        "words": [
          "GARDENER",
          "HOE",
          "STORE"
        ]
      }
    ],
    "grid": [
      [
        "VOLUNTEER",
        "COOK",
        "GARDENER"
      ],
      [
        "SCRAPS",
        "BASIL",
        "HOE"
      ],
      [
        "TURN",
        "PINCH",
        "STORE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "community-garden"
  },
  {
    "id": "subset-2026-09-04-errands-papers-back-shelves-numbers",
    "date": "2026-09-04",
    "dayIndex": 112,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DRAWER",
    "rows": [
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "CHECK",
          "VAULT",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PRESCRIPTION",
          "DRAWER",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "STAMP",
          "BOX",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-09-05-school-life-adults-equipment-room-noise",
    "date": "2026-09-05",
    "dayIndex": 113,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "WHISTLE",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "SHELF",
          "PAGE"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "WHISTLE",
          "BUZZER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "MICROSCOPE",
          "BEEP"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-09-06-maker-tools-safety-wear-measures-kits",
    "date": "2026-09-06",
    "dayIndex": 114,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "LEVEL",
    "rows": [
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "APRON",
          "TIMER",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "GOGGLES",
          "LEVEL",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "STRAP",
          "APERTURE",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-09-07-holiday-labor-day",
    "date": "2026-09-07",
    "dayIndex": 115,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Labor Day",
    "centerWord": "BREAK",
    "rows": [
      {
        "label": "Labor Day",
        "words": [
          "WORKERS",
          "PICNIC",
          "PARADE"
        ]
      },
      {
        "label": "Shop Crew",
        "words": [
          "CLERK",
          "BREAK",
          "BLOCK"
        ]
      },
      {
        "label": "Town Shift",
        "words": [
          "DRIVER",
          "PATIO",
          "FAIR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Labor Roles",
        "words": [
          "WORKERS",
          "CLERK",
          "DRIVER"
        ]
      },
      {
        "label": "Rest",
        "words": [
          "PICNIC",
          "BREAK",
          "PATIO"
        ]
      },
      {
        "label": "Community",
        "words": [
          "PARADE",
          "BLOCK",
          "FAIR"
        ]
      }
    ],
    "grid": [
      [
        "WORKERS",
        "PICNIC",
        "PARADE"
      ],
      [
        "CLERK",
        "BREAK",
        "BLOCK"
      ],
      [
        "DRIVER",
        "PATIO",
        "FAIR"
      ]
    ],
    "holiday": {
      "name": "Labor Day",
      "axis": "row",
      "index": 0,
      "label": "Labor Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-labor-day"
  },
  {
    "id": "subset-2026-09-08-commute-routes-signals-moving",
    "date": "2026-09-08",
    "dayIndex": 116,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SIGN",
    "rows": [
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "LANE",
          "BELL",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "ROUTE",
          "SIGN",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "TRACK",
          "WHISTLE",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-09-09-pets-homes-meals-movement",
    "date": "2026-09-09",
    "dayIndex": 117,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "TUNA",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "KIBBLE",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "TUNA",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FLAKES",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-09-10-daily-tech-quick-moves-saved-stuff-warnings",
    "date": "2026-09-10",
    "dayIndex": 118,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "FILES",
    "rows": [
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CALL",
          "CONTACTS",
          "ALERT"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "TYPE",
          "FILES",
          "CRASH"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "SNAP",
          "ALBUM",
          "BLUR"
        ]
      }
    ],
    "grid": [
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-09-11-school-fair-stations-helpers-fair-supplies-fair-moves",
    "date": "2026-09-11",
    "dayIndex": 119,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "School fair stations",
    "centerWord": "RAFFLE",
    "rows": [
      {
        "label": "Helpers",
        "words": [
          "TEACHER",
          "STUDENT",
          "PARENT"
        ]
      },
      {
        "label": "Fair Supplies",
        "words": [
          "POSTER",
          "RAFFLE",
          "PRIZE"
        ]
      },
      {
        "label": "Fair Moves",
        "words": [
          "ANNOUNCE",
          "SELL",
          "CHEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Stage",
        "words": [
          "TEACHER",
          "POSTER",
          "ANNOUNCE"
        ]
      },
      {
        "label": "Game Table",
        "words": [
          "STUDENT",
          "RAFFLE",
          "SELL"
        ]
      },
      {
        "label": "Crowd",
        "words": [
          "PARENT",
          "PRIZE",
          "CHEER"
        ]
      }
    ],
    "grid": [
      [
        "TEACHER",
        "STUDENT",
        "PARENT"
      ],
      [
        "POSTER",
        "RAFFLE",
        "PRIZE"
      ],
      [
        "ANNOUNCE",
        "SELL",
        "CHEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-fair-stations"
  },
  {
    "id": "subset-2026-09-12-outings-snacks-sound-cues-day-gear",
    "date": "2026-09-12",
    "dayIndex": 120,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "APPLAUSE",
    "rows": [
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "PRETZEL",
          "WAVES",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "POPCORN",
          "APPLAUSE",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "NACHOS",
          "CHEERS",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-09-13-rooms-built-ins-linens-floor-items",
    "date": "2026-09-13",
    "dayIndex": 121,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "TOWEL",
    "rows": [
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "PANTRY",
          "DISHCLOTH",
          "MAT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "VANITY",
          "TOWEL",
          "SCALE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "CLOSET",
          "SHEET",
          "RUG"
        ]
      }
    ],
    "grid": [
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-09-14-opened-locked-shared-digital-household-class-kit",
    "date": "2026-09-14",
    "dayIndex": 122,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "DOOR",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "WINDOW",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "DOOR",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "ROOM",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-09-15-workspaces-furniture-supplies-feedback",
    "date": "2026-09-15",
    "dayIndex": 123,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "STAPLER",
    "rows": [
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "EASEL",
          "BRUSH",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "DESK",
          "STAPLER",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "CHAIR",
          "RULER",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-09-16-travel-stops-bags-arrival-beacons",
    "date": "2026-09-16",
    "dayIndex": 124,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LOBBY",
    "rows": [
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "CARRYON",
          "GATE",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LUGGAGE",
          "LOBBY",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BACKPACK",
          "SITE",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-09-17-school-play-night",
    "date": "2026-09-17",
    "dayIndex": 125,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "School play night",
    "centerWord": "MIC",
    "rows": [
      {
        "label": "Cast Crew",
        "words": [
          "USHER",
          "ACTOR",
          "DRESSER"
        ]
      },
      {
        "label": "Stage Items",
        "words": [
          "PROGRAM",
          "MIC",
          "CAPE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "SEAT",
          "CUE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Box Office",
        "words": [
          "USHER",
          "PROGRAM",
          "SEAT"
        ]
      },
      {
        "label": "Stage",
        "words": [
          "ACTOR",
          "MIC",
          "CUE"
        ]
      },
      {
        "label": "Costume Rack",
        "words": [
          "DRESSER",
          "CAPE",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "USHER",
        "ACTOR",
        "DRESSER"
      ],
      [
        "PROGRAM",
        "MIC",
        "CAPE"
      ],
      [
        "SEAT",
        "CUE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-play-night"
  },
  {
    "id": "subset-2026-09-18-park-days-rest-spots-posted-rules-wildlife",
    "date": "2026-09-18",
    "dayIndex": 126,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "RULES",
    "rows": [
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "BENCH",
          "LABEL",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SWING",
          "RULES",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "LOG",
          "MARKER",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "LABEL",
        "RULES",
        "MARKER"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-09-19-food-stops-crew-service-spots-paper",
    "date": "2026-09-19",
    "dayIndex": 127,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "BOOTH",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Service Spots",
        "words": [
          "CASE",
          "BOOTH",
          "STALL"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "CASE",
          "BAG"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "BOOTH",
          "PLACEMAT"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "STALL",
          "LIST"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "CASE",
        "BOOTH",
        "STALL"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-09-20-media-modes-openers-people-following",
    "date": "2026-09-20",
    "dayIndex": 128,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "ACTOR",
    "rows": [
      {
        "label": "Openers",
        "words": [
          "INTRO",
          "SCENE",
          "HEADLINE"
        ]
      },
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "INTRO",
          "HOST",
          "SUBSCRIBE"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "ACTOR",
          "WATCHLIST"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "HEADLINE",
          "EDITOR",
          "INBOX"
        ]
      }
    ],
    "grid": [
      [
        "INTRO",
        "SCENE",
        "HEADLINE"
      ],
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-09-21-food-truck-row-workers-counter-gear-orders",
    "date": "2026-09-21",
    "dayIndex": 129,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Food truck row handoffs",
    "centerWord": "REGISTER",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "COOK",
          "CASHIER",
          "BARISTA"
        ]
      },
      {
        "label": "Counter Gear",
        "words": [
          "GRIDDLE",
          "REGISTER",
          "STEAMER"
        ]
      },
      {
        "label": "Orders",
        "words": [
          "TACO",
          "RECEIPT",
          "LATTE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Taco Truck",
        "words": [
          "COOK",
          "GRIDDLE",
          "TACO"
        ]
      },
      {
        "label": "Pay Window",
        "words": [
          "CASHIER",
          "REGISTER",
          "RECEIPT"
        ]
      },
      {
        "label": "Coffee Cart",
        "words": [
          "BARISTA",
          "STEAMER",
          "LATTE"
        ]
      }
    ],
    "grid": [
      [
        "COOK",
        "CASHIER",
        "BARISTA"
      ],
      [
        "GRIDDLE",
        "REGISTER",
        "STEAMER"
      ],
      [
        "TACO",
        "RECEIPT",
        "LATTE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-truck-row"
  },
  {
    "id": "subset-2026-09-22-sports-fields-scoring-officials-fans",
    "date": "2026-09-22",
    "dayIndex": 130,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "REFEREE",
    "rows": [
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "RUN",
          "UMPIRE",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "SET",
          "REFEREE",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "GOAL",
          "REF",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-09-23-music-groups-players-signals-big-sounds",
    "date": "2026-09-23",
    "dayIndex": 131,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "BATON",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "COUNT",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "BATON",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "CUE",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-09-24-aquarium-visit",
    "date": "2026-09-24",
    "dayIndex": 132,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Aquarium visit stops",
    "centerWord": "REEF",
    "rows": [
      {
        "label": "Aquarium Staff",
        "words": [
          "TICKETER",
          "DIVER",
          "GUIDE"
        ]
      },
      {
        "label": "Exhibit Items",
        "words": [
          "WRISTBAND",
          "REEF",
          "MAGNET"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "ENTER",
          "FEED",
          "BUY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Desk",
        "words": [
          "TICKETER",
          "WRISTBAND",
          "ENTER"
        ]
      },
      {
        "label": "Reef Tank",
        "words": [
          "DIVER",
          "REEF",
          "FEED"
        ]
      },
      {
        "label": "Gift Shop",
        "words": [
          "GUIDE",
          "MAGNET",
          "BUY"
        ]
      }
    ],
    "grid": [
      [
        "TICKETER",
        "DIVER",
        "GUIDE"
      ],
      [
        "WRISTBAND",
        "REEF",
        "MAGNET"
      ],
      [
        "ENTER",
        "FEED",
        "BUY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "aquarium-visit"
  },
  {
    "id": "subset-2026-09-25-nature-zones-movement-atmosphere-treasures",
    "date": "2026-09-25",
    "dayIndex": 133,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "SPRAY",
    "rows": [
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "RUSTLE",
          "FOG",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CURRENT",
          "SPRAY",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "BREEZE",
          "CLOUD",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-09-26-city-outings-entry-points-workers-waiting",
    "date": "2026-09-26",
    "dayIndex": 134,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "DOCENT",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "CONDUCTOR",
          "PLATFORM"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "DOCENT",
          "LINE"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "WAITER",
          "TABLE"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-09-27-bookstore-event",
    "date": "2026-09-27",
    "dayIndex": 135,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bookstore event night",
    "centerWord": "CHAIR",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "AUTHOR",
          "READER",
          "BOOKSELLER"
        ]
      },
      {
        "label": "Items",
        "words": [
          "PEN",
          "CHAIR",
          "BOOKMARK"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SIGN",
          "APPLAUD",
          "BAG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Signing Table",
        "words": [
          "AUTHOR",
          "PEN",
          "SIGN"
        ]
      },
      {
        "label": "Reading Area",
        "words": [
          "READER",
          "CHAIR",
          "APPLAUD"
        ]
      },
      {
        "label": "Checkout",
        "words": [
          "BOOKSELLER",
          "BOOKMARK",
          "BAG"
        ]
      }
    ],
    "grid": [
      [
        "AUTHOR",
        "READER",
        "BOOKSELLER"
      ],
      [
        "PEN",
        "CHAIR",
        "BOOKMARK"
      ],
      [
        "SIGN",
        "APPLAUD",
        "BAG"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bookstore-event"
  },
  {
    "id": "subset-2026-09-28-errands-papers-cards-and-slips-numbers",
    "date": "2026-09-28",
    "dayIndex": 136,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "INSURANCE",
    "rows": [
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "CHECK",
          "DEBIT",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PRESCRIPTION",
          "INSURANCE",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "STAMP",
          "POSTCARD",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-09-29-school-life-routines-room-noise-class-tasks",
    "date": "2026-09-29",
    "dayIndex": 137,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "BUZZER",
    "rows": [
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "QUIET",
          "PAGE",
          "READING"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "DRILLS",
          "BUZZER",
          "LAPS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SAFETY",
          "BEEP",
          "EXPERIMENT"
        ]
      }
    ],
    "grid": [
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-09-30-maker-tools-prep-tools-surfaces-outputs",
    "date": "2026-09-30",
    "dayIndex": 138,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "BEAM",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "COUNTER",
          "SAUCE"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "BEAM",
          "FRAME"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "BACKDROP",
          "PORTRAIT"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-10-01-new-home-party",
    "date": "2026-10-01",
    "dayIndex": 139,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "New home party details",
    "centerWord": "DIP",
    "rows": [
      {
        "label": "Guests",
        "words": [
          "NEIGHBOR",
          "COUSIN",
          "ROOMMATE"
        ]
      },
      {
        "label": "House Gifts",
        "words": [
          "KEY",
          "DIP",
          "LANTERN"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "TOUR",
          "SNACK",
          "CHAT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Front Door",
        "words": [
          "NEIGHBOR",
          "KEY",
          "TOUR"
        ]
      },
      {
        "label": "Kitchen Island",
        "words": [
          "COUSIN",
          "DIP",
          "SNACK"
        ]
      },
      {
        "label": "Back Patio",
        "words": [
          "ROOMMATE",
          "LANTERN",
          "CHAT"
        ]
      }
    ],
    "grid": [
      [
        "NEIGHBOR",
        "COUSIN",
        "ROOMMATE"
      ],
      [
        "KEY",
        "DIP",
        "LANTERN"
      ],
      [
        "TOUR",
        "SNACK",
        "CHAT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "new-home-party"
  },
  {
    "id": "subset-2026-10-02-commute-routes-stops-signals",
    "date": "2026-10-02",
    "dayIndex": 140,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SHELTER",
    "rows": [
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "LANE",
          "RACK",
          "BELL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "ROUTE",
          "SHELTER",
          "SIGN"
        ]
      },
      {
        "label": "Train",
        "words": [
          "TRACK",
          "STATION",
          "WHISTLE"
        ]
      }
    ],
    "grid": [
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-10-03-pets-homes-care-playthings",
    "date": "2026-10-03",
    "dayIndex": 141,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "LITTER",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "LEASH",
          "BALL"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "LITTER",
          "YARN"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FILTER",
          "CASTLE"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-10-04-daily-tech-parts-power-warnings",
    "date": "2026-10-04",
    "dayIndex": 142,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CABLE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CHARGER",
          "ALERT"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "CABLE",
          "CRASH"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "BATTERY",
          "BLUR"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-10-05-camping-outfitter-staff-trip-gear-prep-moves",
    "date": "2026-10-05",
    "dayIndex": 143,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Camping outfitter stops",
    "centerWord": "LANTERN",
    "rows": [
      {
        "label": "Staff",
        "words": [
          "GUIDE",
          "OUTFITTER",
          "RANGER"
        ]
      },
      {
        "label": "Trip Gear",
        "words": [
          "MAP",
          "LANTERN",
          "PERMIT"
        ]
      },
      {
        "label": "Prep Moves",
        "words": [
          "PLAN",
          "PACK",
          "CHECK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Trail Desk",
        "words": [
          "GUIDE",
          "MAP",
          "PLAN"
        ]
      },
      {
        "label": "Gear Shop",
        "words": [
          "OUTFITTER",
          "LANTERN",
          "PACK"
        ]
      },
      {
        "label": "Ranger Station",
        "words": [
          "RANGER",
          "PERMIT",
          "CHECK"
        ]
      }
    ],
    "grid": [
      [
        "GUIDE",
        "OUTFITTER",
        "RANGER"
      ],
      [
        "MAP",
        "LANTERN",
        "PERMIT"
      ],
      [
        "PLAN",
        "PACK",
        "CHECK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "camping-outfitter"
  },
  {
    "id": "subset-2026-10-06-outings-where-to-sit-snacks-entry-props",
    "date": "2026-10-06",
    "dayIndex": 144,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "POPCORN",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "PRETZEL",
          "WRISTBAND"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "POPCORN",
          "PLAYBILL"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "NACHOS",
          "STUB"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-10-07-rooms-fixtures-morning-glow",
    "date": "2026-10-07",
    "dayIndex": 145,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "RAZOR",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "COFFEE",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "RAZOR",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "ALARM",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-10-08-opened-locked-shared-digital-teamwork-pantry-shelf",
    "date": "2026-10-08",
    "dayIndex": 146,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "ACCOUNT",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "CALENDAR",
          "JAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "ACCOUNT",
          "CABINET"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "DOC",
          "RECIPE"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-10-09-workspaces-deadlines-displays-feedback",
    "date": "2026-10-09",
    "dayIndex": 147,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "MONITOR",
    "rows": [
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "COMMISSION",
          "CANVAS",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "REPORT",
          "MONITOR",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "HOMEWORK",
          "PROJECTOR",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-10-10-travel-stops-arrival-comfort-beacons",
    "date": "2026-10-10",
    "dayIndex": 148,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "ROBE",
    "rows": [
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "GATE",
          "PILLOW",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LOBBY",
          "ROBE",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "SITE",
          "BLANKET",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-10-11-airport-morning",
    "date": "2026-10-11",
    "dayIndex": 149,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Airport morning checkpoints",
    "centerWord": "TRAY",
    "rows": [
      {
        "label": "Airport Staff",
        "words": [
          "AGENT",
          "SCREENER",
          "BARISTA"
        ]
      },
      {
        "label": "Travel Gear",
        "words": [
          "TAG",
          "TRAY",
          "LATTE"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "CHECK",
          "SCAN",
          "SIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Check-in",
        "words": [
          "AGENT",
          "TAG",
          "CHECK"
        ]
      },
      {
        "label": "Security",
        "words": [
          "SCREENER",
          "TRAY",
          "SCAN"
        ]
      },
      {
        "label": "Coffee Kiosk",
        "words": [
          "BARISTA",
          "LATTE",
          "SIP"
        ]
      }
    ],
    "grid": [
      [
        "AGENT",
        "SCREENER",
        "BARISTA"
      ],
      [
        "TAG",
        "TRAY",
        "LATTE"
      ],
      [
        "CHECK",
        "SCAN",
        "SIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "airport-morning"
  },
  {
    "id": "subset-2026-10-12-park-days-underfoot-water-finds-wildlife",
    "date": "2026-10-12",
    "dayIndex": 150,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SPRINKLER",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "HOSE",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SPRINKLER",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "STREAM",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-10-13-food-stops-crew-breakfast-sweet",
    "date": "2026-10-13",
    "dayIndex": 151,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "OMELET",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "MUFFIN",
          "ICING"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "OMELET",
          "SYRUP"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "BERRIES",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-10-14-media-modes-units-audio-cues-following",
    "date": "2026-10-14",
    "dayIndex": 152,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "THEME",
    "rows": [
      {
        "label": "Units",
        "words": [
          "EPISODE",
          "SCENE",
          "ISSUE"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "EPISODE",
          "MIC",
          "SUBSCRIBE"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "THEME",
          "WATCHLIST"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "ISSUE",
          "TONE",
          "INBOX"
        ]
      }
    ],
    "grid": [
      [
        "EPISODE",
        "SCENE",
        "ISSUE"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-10-15-community-garden-jobs-helpers-supplies-results",
    "date": "2026-10-15",
    "dayIndex": 153,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Community garden jobs",
    "centerWord": "BIN",
    "rows": [
      {
        "label": "Helpers",
        "words": [
          "GARDENER",
          "VOLUNTEER",
          "BEEKEEPER"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "SEED",
          "BIN",
          "SMOKER"
        ]
      },
      {
        "label": "Results",
        "words": [
          "HERB",
          "SOIL",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden Bed",
        "words": [
          "GARDENER",
          "SEED",
          "HERB"
        ]
      },
      {
        "label": "Compost",
        "words": [
          "VOLUNTEER",
          "BIN",
          "SOIL"
        ]
      },
      {
        "label": "Hive",
        "words": [
          "BEEKEEPER",
          "SMOKER",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "GARDENER",
        "VOLUNTEER",
        "BEEKEEPER"
      ],
      [
        "SEED",
        "BIN",
        "SMOKER"
      ],
      [
        "HERB",
        "SOIL",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "community-garden-jobs"
  },
  {
    "id": "subset-2026-10-16-sports-fields-gear-scoring-places",
    "date": "2026-10-16",
    "dayIndex": 154,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SET",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "RUN",
          "DUGOUT"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "SET",
          "COURT"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "GOAL",
          "FIELD"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-10-17-music-groups-players-practice-cues-parts",
    "date": "2026-10-17",
    "dayIndex": 155,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "REHEARSAL",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "RIFF",
          "SOLO"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "REHEARSAL",
          "MOVEMENT"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "WARMUP",
          "VERSE"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-10-18-picnic-prep",
    "date": "2026-10-18",
    "dayIndex": 156,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Picnic prep stations",
    "centerWord": "BASKET",
    "rows": [
      {
        "label": "Picnic Fare",
        "words": [
          "LEMONADE",
          "SALAD",
          "BURGER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "ICE",
          "BASKET",
          "TONGS"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "CHILL",
          "SPREAD",
          "FLIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cooler",
        "words": [
          "LEMONADE",
          "ICE",
          "CHILL"
        ]
      },
      {
        "label": "Blanket",
        "words": [
          "SALAD",
          "BASKET",
          "SPREAD"
        ]
      },
      {
        "label": "Grill",
        "words": [
          "BURGER",
          "TONGS",
          "FLIP"
        ]
      }
    ],
    "grid": [
      [
        "LEMONADE",
        "SALAD",
        "BURGER"
      ],
      [
        "ICE",
        "BASKET",
        "TONGS"
      ],
      [
        "CHILL",
        "SPREAD",
        "FLIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "picnic-prep"
  },
  {
    "id": "subset-2026-10-19-nature-zones-colors-curves-treasures",
    "date": "2026-10-19",
    "dayIndex": 157,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "WAVE",
    "rows": [
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Curves",
        "words": [
          "RING",
          "WAVE",
          "ARC"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "MOSS",
          "RING",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CORAL",
          "WAVE",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "AZURE",
          "ARC",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "RING",
        "WAVE",
        "ARC"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-10-20-city-outings-entry-points-rest-spots-hand-props",
    "date": "2026-10-20",
    "dayIndex": 158,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "BENCH",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "SEAT",
          "BENCH",
          "BOOTH"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "SEAT",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "BENCH",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "BOOTH",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "SEAT",
        "BENCH",
        "BOOTH"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-10-21-science-lab",
    "date": "2026-10-21",
    "dayIndex": 159,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "School science lab",
    "centerWord": "FAUCET",
    "rows": [
      {
        "label": "Learners",
        "words": [
          "STUDENT",
          "PARTNER",
          "AIDE"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "BEAKER",
          "FAUCET",
          "GOGGLES"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "MEASURE",
          "WASH",
          "BORROW"
        ]
      }
    ],
    "columns": [
      {
        "label": "Lab Bench",
        "words": [
          "STUDENT",
          "BEAKER",
          "MEASURE"
        ]
      },
      {
        "label": "Sink",
        "words": [
          "PARTNER",
          "FAUCET",
          "WASH"
        ]
      },
      {
        "label": "Supply Cart",
        "words": [
          "AIDE",
          "GOGGLES",
          "BORROW"
        ]
      }
    ],
    "grid": [
      [
        "STUDENT",
        "PARTNER",
        "AIDE"
      ],
      [
        "BEAKER",
        "FAUCET",
        "GOGGLES"
      ],
      [
        "MEASURE",
        "WASH",
        "BORROW"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "science-lab"
  },
  {
    "id": "subset-2026-10-22-errands-cards-and-slips-numbers-receipts",
    "date": "2026-10-22",
    "dayIndex": 160,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DOSE",
    "rows": [
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      },
      {
        "label": "Receipts",
        "words": [
          "RECEIPT",
          "LABEL",
          "TRACKING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "DEBIT",
          "PIN",
          "RECEIPT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "INSURANCE",
          "DOSE",
          "LABEL"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "POSTCARD",
          "ZIP",
          "TRACKING"
        ]
      }
    ],
    "grid": [
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ],
      [
        "RECEIPT",
        "LABEL",
        "TRACKING"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-10-23-school-life-adults-class-tasks-back-rooms",
    "date": "2026-10-23",
    "dayIndex": 161,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "LAPS",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "READING",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "LAPS",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "EXPERIMENT",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-10-24-maker-tools-prep-tools-safety-wear-measures",
    "date": "2026-10-24",
    "dayIndex": 162,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "GOGGLES",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "APRON",
          "TIMER"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "GOGGLES",
          "LEVEL"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "STRAP",
          "APERTURE"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-10-25-recital-night",
    "date": "2026-10-25",
    "dayIndex": 163,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Recital night details",
    "centerWord": "SONATA",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "USHER",
          "STUDENT",
          "AUNT"
        ]
      },
      {
        "label": "Recital Props",
        "words": [
          "TICKET",
          "SONATA",
          "BOUQUET"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SEAT",
          "BOW",
          "SMILE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Lobby",
        "words": [
          "USHER",
          "TICKET",
          "SEAT"
        ]
      },
      {
        "label": "Piano Bench",
        "words": [
          "STUDENT",
          "SONATA",
          "BOW"
        ]
      },
      {
        "label": "Flower Table",
        "words": [
          "AUNT",
          "BOUQUET",
          "SMILE"
        ]
      }
    ],
    "grid": [
      [
        "USHER",
        "STUDENT",
        "AUNT"
      ],
      [
        "TICKET",
        "SONATA",
        "BOUQUET"
      ],
      [
        "SEAT",
        "BOW",
        "SMILE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "recital-night"
  },
  {
    "id": "subset-2026-10-26-commute-operators-routes-stops",
    "date": "2026-10-26",
    "dayIndex": 164,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "ROUTE",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "LANE",
          "RACK"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "ROUTE",
          "SHELTER"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "TRACK",
          "STATION"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-10-27-pets-care-pet-noises-movement",
    "date": "2026-10-27",
    "dayIndex": 165,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "MEOW",
    "rows": [
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "LEASH",
          "BARK",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "LITTER",
          "MEOW",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FILTER",
          "BUBBLES",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-10-28-daily-tech-parts-quick-moves-saved-stuff",
    "date": "2026-10-28",
    "dayIndex": 166,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "TYPE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CALL",
          "CONTACTS"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "TYPE",
          "FILES"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "SNAP",
          "ALBUM"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-10-29-newsroom-handoffs-live-roles-materials-desk-moves",
    "date": "2026-10-29",
    "dayIndex": 167,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Newsroom handoffs",
    "centerWord": "PHOTO",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "REPORTER",
          "EDITOR",
          "DESIGNER"
        ]
      },
      {
        "label": "Materials",
        "words": [
          "NOTEBOOK",
          "PHOTO",
          "LAYOUT"
        ]
      },
      {
        "label": "Desk Moves",
        "words": [
          "INTERVIEW",
          "CROP",
          "PUBLISH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Reporting",
        "words": [
          "REPORTER",
          "NOTEBOOK",
          "INTERVIEW"
        ]
      },
      {
        "label": "Photo Lab",
        "words": [
          "EDITOR",
          "PHOTO",
          "CROP"
        ]
      },
      {
        "label": "Website",
        "words": [
          "DESIGNER",
          "LAYOUT",
          "PUBLISH"
        ]
      }
    ],
    "grid": [
      [
        "REPORTER",
        "EDITOR",
        "DESIGNER"
      ],
      [
        "NOTEBOOK",
        "PHOTO",
        "LAYOUT"
      ],
      [
        "INTERVIEW",
        "CROP",
        "PUBLISH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "newsroom-handoffs-live"
  },
  {
    "id": "subset-2026-10-30-outings-sound-cues-on-duty-day-gear",
    "date": "2026-10-30",
    "dayIndex": 168,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "USHER",
    "rows": [
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "WAVES",
          "LIFEGUARD",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "APPLAUSE",
          "USHER",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "CHEERS",
          "UMPIRE",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-10-31-holiday-halloween",
    "date": "2026-10-31",
    "dayIndex": 169,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Halloween",
    "centerWord": "MASK",
    "rows": [
      {
        "label": "Halloween",
        "words": [
          "CANDY",
          "COSTUME",
          "GHOST"
        ]
      },
      {
        "label": "Monster",
        "words": [
          "COOKIE",
          "MASK",
          "VAMPIRE"
        ]
      },
      {
        "label": "Party",
        "words": [
          "CAKE",
          "HAT",
          "SHADOW"
        ]
      }
    ],
    "columns": [
      {
        "label": "Sweets",
        "words": [
          "CANDY",
          "COOKIE",
          "CAKE"
        ]
      },
      {
        "label": "Outfits",
        "words": [
          "COSTUME",
          "MASK",
          "HAT"
        ]
      },
      {
        "label": "Spooky",
        "words": [
          "GHOST",
          "VAMPIRE",
          "SHADOW"
        ]
      }
    ],
    "grid": [
      [
        "CANDY",
        "COSTUME",
        "GHOST"
      ],
      [
        "COOKIE",
        "MASK",
        "VAMPIRE"
      ],
      [
        "CAKE",
        "HAT",
        "SHADOW"
      ]
    ],
    "holiday": {
      "name": "Halloween",
      "axis": "row",
      "index": 0,
      "label": "Halloween"
    },
    "packRole": "live",
    "themeGroupId": "holiday-halloween"
  },
  {
    "id": "subset-2026-11-01-opened-locked-shared-teamwork-trip-kit-pantry-shelf",
    "date": "2026-11-01",
    "dayIndex": 170,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "LUGGAGE",
    "rows": [
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Trip Kit",
        "words": [
          "GATE",
          "LUGGAGE",
          "RIDE"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "CALENDAR",
          "GATE",
          "JAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "ACCOUNT",
          "LUGGAGE",
          "CABINET"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "DOC",
          "RIDE",
          "RECIPE"
        ]
      }
    ],
    "grid": [
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "GATE",
        "LUGGAGE",
        "RIDE"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-11-02-workspaces-drafts-deadlines-displays",
    "date": "2026-11-02",
    "dayIndex": 171,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "REPORT",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "COMMISSION",
          "CANVAS"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "REPORT",
          "MONITOR"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "HOMEWORK",
          "PROJECTOR"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-11-03-pillar-hope",
    "date": "2026-11-03",
    "dayIndex": 172,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar",
      "keystone"
    ],
    "theme": "Birthday keystone",
    "centerWord": "HOPE",
    "pillarWord": "HOPE",
    "rows": [
      {
        "label": "Morning",
        "words": [
          "BREW",
          "CALM",
          "SUNRISE"
        ]
      },
      {
        "label": "Birthday",
        "words": [
          "CARD",
          "HOPE",
          "CAKE"
        ]
      },
      {
        "label": "Garden",
        "words": [
          "PLANT",
          "PATIENCE",
          "HARVEST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Small Rituals",
        "words": [
          "BREW",
          "CARD",
          "PLANT"
        ]
      },
      {
        "label": "Warm Wishes",
        "words": [
          "CALM",
          "HOPE",
          "PATIENCE"
        ]
      },
      {
        "label": "Good Things",
        "words": [
          "SUNRISE",
          "CAKE",
          "HARVEST"
        ]
      }
    ],
    "grid": [
      [
        "BREW",
        "CALM",
        "SUNRISE"
      ],
      [
        "CARD",
        "HOPE",
        "CAKE"
      ],
      [
        "PLANT",
        "PATIENCE",
        "HARVEST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pillar-hope"
  },
  {
    "id": "subset-2026-11-04-bakery-morning",
    "date": "2026-11-04",
    "dayIndex": 173,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bakery morning stations",
    "centerWord": "LOAF",
    "rows": [
      {
        "label": "Bakery Crew",
        "words": [
          "BAKER",
          "APPRENTICE",
          "SELLER"
        ]
      },
      {
        "label": "Items",
        "words": [
          "DOUGH",
          "LOAF",
          "TART"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "WHISK",
          "BAKE",
          "SELL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Mixer",
        "words": [
          "BAKER",
          "DOUGH",
          "WHISK"
        ]
      },
      {
        "label": "Oven",
        "words": [
          "APPRENTICE",
          "LOAF",
          "BAKE"
        ]
      },
      {
        "label": "Display Case",
        "words": [
          "SELLER",
          "TART",
          "SELL"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "APPRENTICE",
        "SELLER"
      ],
      [
        "DOUGH",
        "LOAF",
        "TART"
      ],
      [
        "WHISK",
        "BAKE",
        "SELL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bakery-morning"
  },
  {
    "id": "subset-2026-11-05-park-days-underfoot-tools-wildlife",
    "date": "2026-11-05",
    "dayIndex": 174,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SHOVEL",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "RAKE",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SHOVEL",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "COMPASS",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-11-06-food-stops-paper-sweet-counter-tools",
    "date": "2026-11-06",
    "dayIndex": 175,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "SYRUP",
    "rows": [
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      },
      {
        "label": "Counter Tools",
        "words": [
          "OVEN",
          "GRIDDLE",
          "SCALE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAG",
          "ICING",
          "OVEN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "PLACEMAT",
          "SYRUP",
          "GRIDDLE"
        ]
      },
      {
        "label": "Market",
        "words": [
          "LIST",
          "HONEY",
          "SCALE"
        ]
      }
    ],
    "grid": [
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ],
      [
        "OVEN",
        "GRIDDLE",
        "SCALE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-11-07-media-modes-people-following-opinion",
    "date": "2026-11-07",
    "dayIndex": 176,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "WATCHLIST",
    "rows": [
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "HOST",
          "SUBSCRIBE",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "ACTOR",
          "WATCHLIST",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "EDITOR",
          "INBOX",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-11-08-theater-work-zones-crew-show-pieces-moments",
    "date": "2026-11-08",
    "dayIndex": 177,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Theater night work zones",
    "centerWord": "RIGGING",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "USHER",
          "STAGEHAND",
          "COSTUMER"
        ]
      },
      {
        "label": "Show Pieces",
        "words": [
          "TICKET",
          "RIGGING",
          "WIG"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SEAT",
          "CUE",
          "CHANGE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Lobby",
        "words": [
          "USHER",
          "TICKET",
          "SEAT"
        ]
      },
      {
        "label": "Stage",
        "words": [
          "STAGEHAND",
          "RIGGING",
          "CUE"
        ]
      },
      {
        "label": "Dressing Room",
        "words": [
          "COSTUMER",
          "WIG",
          "CHANGE"
        ]
      }
    ],
    "grid": [
      [
        "USHER",
        "STAGEHAND",
        "COSTUMER"
      ],
      [
        "TICKET",
        "RIGGING",
        "WIG"
      ],
      [
        "SEAT",
        "CUE",
        "CHANGE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "theater-work-zones"
  },
  {
    "id": "subset-2026-11-09-sports-fields-places-play-moves-fans",
    "date": "2026-11-09",
    "dayIndex": 178,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SERVE",
    "rows": [
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "DUGOUT",
          "PITCH",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "COURT",
          "SERVE",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "FIELD",
          "PASS",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-11-10-music-groups-practice-cues-parts-sheets",
    "date": "2026-11-10",
    "dayIndex": 179,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "MOVEMENT",
    "rows": [
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Sheets",
        "words": [
          "SETLIST",
          "SCORE",
          "HYMNAL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "RIFF",
          "SOLO",
          "SETLIST"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "REHEARSAL",
          "MOVEMENT",
          "SCORE"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "WARMUP",
          "VERSE",
          "HYMNAL"
        ]
      }
    ],
    "grid": [
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "SETLIST",
        "SCORE",
        "HYMNAL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-11-11-holiday-veterans-day",
    "date": "2026-11-11",
    "dayIndex": 180,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Veterans Day",
    "centerWord": "SALUTE",
    "rows": [
      {
        "label": "Veterans Day",
        "words": [
          "FLAG",
          "MEDAL",
          "SERVICE"
        ]
      },
      {
        "label": "Community",
        "words": [
          "WREATH",
          "SALUTE",
          "MEMORY"
        ]
      },
      {
        "label": "Uniform",
        "words": [
          "BADGE",
          "RANK",
          "DUTY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Symbols",
        "words": [
          "FLAG",
          "WREATH",
          "BADGE"
        ]
      },
      {
        "label": "Honors",
        "words": [
          "MEDAL",
          "SALUTE",
          "RANK"
        ]
      },
      {
        "label": "Service",
        "words": [
          "SERVICE",
          "MEMORY",
          "DUTY"
        ]
      }
    ],
    "grid": [
      [
        "FLAG",
        "MEDAL",
        "SERVICE"
      ],
      [
        "WREATH",
        "SALUTE",
        "MEMORY"
      ],
      [
        "BADGE",
        "RANK",
        "DUTY"
      ]
    ],
    "holiday": {
      "name": "Veterans Day",
      "axis": "row",
      "index": 0,
      "label": "Veterans Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-veterans-day"
  },
  {
    "id": "subset-2026-11-12-nature-zones-wildlife-movement-atmosphere",
    "date": "2026-11-12",
    "dayIndex": 181,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CURRENT",
    "rows": [
      {
        "label": "Wildlife",
        "words": [
          "FOX",
          "SEAL",
          "EAGLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOX",
          "RUSTLE",
          "FOG"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SEAL",
          "CURRENT",
          "SPRAY"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "EAGLE",
          "BREEZE",
          "CLOUD"
        ]
      }
    ],
    "grid": [
      [
        "FOX",
        "SEAL",
        "EAGLE"
      ],
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-11-13-city-outings-entry-points-waiting-hand-props",
    "date": "2026-11-13",
    "dayIndex": 182,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "LINE",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "PLATFORM",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "LINE",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "TABLE",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-11-14-lakeside-rental",
    "date": "2026-11-14",
    "dayIndex": 183,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Lakeside rental counter",
    "centerWord": "WORMS",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "PADDLER",
          "CLERK",
          "HOST"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "PADDLE",
          "WORMS",
          "COOLER"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "LAUNCH",
          "SELL",
          "UNPACK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Canoe Rack",
        "words": [
          "PADDLER",
          "PADDLE",
          "LAUNCH"
        ]
      },
      {
        "label": "Bait Shop",
        "words": [
          "CLERK",
          "WORMS",
          "SELL"
        ]
      },
      {
        "label": "Picnic Dock",
        "words": [
          "HOST",
          "COOLER",
          "UNPACK"
        ]
      }
    ],
    "grid": [
      [
        "PADDLER",
        "CLERK",
        "HOST"
      ],
      [
        "PADDLE",
        "WORMS",
        "COOLER"
      ],
      [
        "LAUNCH",
        "SELL",
        "UNPACK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "lakeside-rental"
  },
  {
    "id": "subset-2026-11-15-errands-staff-papers-back-shelves",
    "date": "2026-11-15",
    "dayIndex": 184,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "PRESCRIPTION",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "CHECK",
          "VAULT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "PRESCRIPTION",
          "DRAWER"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "STAMP",
          "BOX"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-11-16-school-life-adults-routines-back-rooms",
    "date": "2026-11-16",
    "dayIndex": 185,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "DRILLS",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "QUIET",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "DRILLS",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "SAFETY",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-11-17-maker-tools-surfaces-measures-kits",
    "date": "2026-11-17",
    "dayIndex": 186,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "LEVEL",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "TIMER",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "LEVEL",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "APERTURE",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-11-18-retirement-toast",
    "date": "2026-11-18",
    "dayIndex": 187,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Retirement toast details",
    "centerWord": "FROSTING",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "MENTOR",
          "BAKER",
          "MANAGER"
        ]
      },
      {
        "label": "Toast Props",
        "words": [
          "CARD",
          "FROSTING",
          "GLASS"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SIGN",
          "CUT",
          "PRAISE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Office",
        "words": [
          "MENTOR",
          "CARD",
          "SIGN"
        ]
      },
      {
        "label": "Cake Table",
        "words": [
          "BAKER",
          "FROSTING",
          "CUT"
        ]
      },
      {
        "label": "Toast Circle",
        "words": [
          "MANAGER",
          "GLASS",
          "PRAISE"
        ]
      }
    ],
    "grid": [
      [
        "MENTOR",
        "BAKER",
        "MANAGER"
      ],
      [
        "CARD",
        "FROSTING",
        "GLASS"
      ],
      [
        "SIGN",
        "CUT",
        "PRAISE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "retirement-toast"
  },
  {
    "id": "subset-2026-11-19-commute-stops-signals-moving",
    "date": "2026-11-19",
    "dayIndex": 188,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SIGN",
    "rows": [
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RACK",
          "BELL",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "SHELTER",
          "SIGN",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "STATION",
          "WHISTLE",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-11-20-pets-homes-meals-pet-noises",
    "date": "2026-11-20",
    "dayIndex": 189,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "TUNA",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "KIBBLE",
          "BARK"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "TUNA",
          "MEOW"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FLAKES",
          "BUBBLES"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-11-21-daily-tech-power-warnings-accessories",
    "date": "2026-11-21",
    "dayIndex": 190,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CRASH",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "ALERT",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "CRASH",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "BLUR",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-11-22-bakery-morning-stations-bakery-staff-tools-outputs",
    "date": "2026-11-22",
    "dayIndex": 191,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bakery morning stations",
    "centerWord": "OVEN",
    "rows": [
      {
        "label": "Bakery Staff",
        "words": [
          "BAKER",
          "CASHIER",
          "DECORATOR"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "MIXER",
          "OVEN",
          "PIPINGBAG"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "LOAF",
          "PIE",
          "ROSETTE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bread Bench",
        "words": [
          "BAKER",
          "MIXER",
          "LOAF"
        ]
      },
      {
        "label": "Hot Case",
        "words": [
          "CASHIER",
          "OVEN",
          "PIE"
        ]
      },
      {
        "label": "Cake Table",
        "words": [
          "DECORATOR",
          "PIPINGBAG",
          "ROSETTE"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "CASHIER",
        "DECORATOR"
      ],
      [
        "MIXER",
        "OVEN",
        "PIPINGBAG"
      ],
      [
        "LOAF",
        "PIE",
        "ROSETTE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bakery-morning-stations"
  },
  {
    "id": "subset-2026-11-23-outings-where-to-sit-sound-cues-entry-props",
    "date": "2026-11-23",
    "dayIndex": 192,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "APPLAUSE",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "WAVES",
          "WRISTBAND"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "APPLAUSE",
          "PLAYBILL"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "CHEERS",
          "STUB"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-11-24-rooms-fixtures-built-ins-glow",
    "date": "2026-11-24",
    "dayIndex": 193,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "VANITY",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "PANTRY",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "VANITY",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "CLOSET",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-11-25-opened-locked-shared-teamwork-pantry-shelf-class-kit",
    "date": "2026-11-25",
    "dayIndex": 194,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "CABINET",
    "rows": [
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "CALENDAR",
          "JAR",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "ACCOUNT",
          "CABINET",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "DOC",
          "RECIPE",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-11-26-holiday-thanksgiving",
    "date": "2026-11-26",
    "dayIndex": 195,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Thanksgiving",
    "centerWord": "REUNION",
    "rows": [
      {
        "label": "Thanksgiving",
        "words": [
          "TURKEY",
          "PARADE",
          "THANKS"
        ]
      },
      {
        "label": "Family Table",
        "words": [
          "DINNER",
          "REUNION",
          "TOAST"
        ]
      },
      {
        "label": "Kitchen Crew",
        "words": [
          "PIE",
          "COOKING",
          "PRAISE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Holiday Feast",
        "words": [
          "TURKEY",
          "DINNER",
          "PIE"
        ]
      },
      {
        "label": "Events",
        "words": [
          "PARADE",
          "REUNION",
          "COOKING"
        ]
      },
      {
        "label": "Gratitude",
        "words": [
          "THANKS",
          "TOAST",
          "PRAISE"
        ]
      }
    ],
    "grid": [
      [
        "TURKEY",
        "PARADE",
        "THANKS"
      ],
      [
        "DINNER",
        "REUNION",
        "TOAST"
      ],
      [
        "PIE",
        "COOKING",
        "PRAISE"
      ]
    ],
    "holiday": {
      "name": "Thanksgiving",
      "axis": "row",
      "index": 0,
      "label": "Thanksgiving"
    },
    "packRole": "live",
    "themeGroupId": "holiday-thanksgiving"
  },
  {
    "id": "subset-2026-11-27-travel-stops-sleep-bites-beacons",
    "date": "2026-11-27",
    "dayIndex": 196,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "BUFFET",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "PRETZEL",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "BUFFET",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "GRANOLA",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-11-28-library-visit",
    "date": "2026-11-28",
    "dayIndex": 197,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Library visit flow",
    "centerWord": "LAMP",
    "rows": [
      {
        "label": "Library Helpers",
        "words": [
          "LIBRARIAN",
          "READER",
          "VOLUNTEER"
        ]
      },
      {
        "label": "Shelf Finds",
        "words": [
          "CARD",
          "LAMP",
          "NOVEL"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "ASK",
          "BROWSE",
          "SORT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Info Desk",
        "words": [
          "LIBRARIAN",
          "CARD",
          "ASK"
        ]
      },
      {
        "label": "Reading Nook",
        "words": [
          "READER",
          "LAMP",
          "BROWSE"
        ]
      },
      {
        "label": "Return Bin",
        "words": [
          "VOLUNTEER",
          "NOVEL",
          "SORT"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "READER",
        "VOLUNTEER"
      ],
      [
        "CARD",
        "LAMP",
        "NOVEL"
      ],
      [
        "ASK",
        "BROWSE",
        "SORT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "library-visit"
  },
  {
    "id": "subset-2026-11-29-park-days-rest-spots-posted-rules-water-finds",
    "date": "2026-11-29",
    "dayIndex": 198,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "RULES",
    "rows": [
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "BENCH",
          "LABEL",
          "HOSE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SWING",
          "RULES",
          "SPRINKLER"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "LOG",
          "MARKER",
          "STREAM"
        ]
      }
    ],
    "grid": [
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "LABEL",
        "RULES",
        "MARKER"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-11-30-food-stops-breakfast-paper-sweet",
    "date": "2026-11-30",
    "dayIndex": 199,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "PLACEMAT",
    "rows": [
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "MUFFIN",
          "BAG",
          "ICING"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "OMELET",
          "PLACEMAT",
          "SYRUP"
        ]
      },
      {
        "label": "Market",
        "words": [
          "BERRIES",
          "LIST",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2026-12-01-media-modes-people-units-audio-cues",
    "date": "2026-12-01",
    "dayIndex": 200,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "SCENE",
    "rows": [
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Units",
        "words": [
          "EPISODE",
          "SCENE",
          "ISSUE"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "HOST",
          "EPISODE",
          "MIC"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "ACTOR",
          "SCENE",
          "THEME"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "EDITOR",
          "ISSUE",
          "TONE"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "EPISODE",
        "SCENE",
        "ISSUE"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2026-12-02-clinic-visit-pathways-care-team-exam-items-visit-steps",
    "date": "2026-12-02",
    "dayIndex": 201,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Clinic visit pathways",
    "centerWord": "THERMOMETER",
    "rows": [
      {
        "label": "Care Team",
        "words": [
          "RECEPTIONIST",
          "NURSE",
          "PHARMACIST"
        ]
      },
      {
        "label": "Exam Items",
        "words": [
          "FORM",
          "THERMOMETER",
          "VIAL"
        ]
      },
      {
        "label": "Visit Steps",
        "words": [
          "CHECKIN",
          "EXAM",
          "REFILL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Intake",
        "words": [
          "RECEPTIONIST",
          "FORM",
          "CHECKIN"
        ]
      },
      {
        "label": "Exam Room",
        "words": [
          "NURSE",
          "THERMOMETER",
          "EXAM"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "VIAL",
          "REFILL"
        ]
      }
    ],
    "grid": [
      [
        "RECEPTIONIST",
        "NURSE",
        "PHARMACIST"
      ],
      [
        "FORM",
        "THERMOMETER",
        "VIAL"
      ],
      [
        "CHECKIN",
        "EXAM",
        "REFILL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "clinic-visit-pathways"
  },
  {
    "id": "subset-2026-12-03-sports-fields-gear-officials-play-moves",
    "date": "2026-12-03",
    "dayIndex": 202,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "REFEREE",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "UMPIRE",
          "PITCH"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "REFEREE",
          "SERVE"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "REF",
          "PASS"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-12-04-music-groups-practice-cues-signals-big-sounds",
    "date": "2026-12-04",
    "dayIndex": 203,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "BATON",
    "rows": [
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "RIFF",
          "COUNT",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "REHEARSAL",
          "BATON",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "WARMUP",
          "CUE",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-12-05-rainy-commute",
    "date": "2026-12-05",
    "dayIndex": 204,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Rainy commute places",
    "centerWord": "WIPER",
    "rows": [
      {
        "label": "Commuters",
        "words": [
          "RIDER",
          "DRIVER",
          "GUARD"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "UMBRELLA",
          "WIPER",
          "MAT"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "WAIT",
          "PARK",
          "DRIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bus Stop",
        "words": [
          "RIDER",
          "UMBRELLA",
          "WAIT"
        ]
      },
      {
        "label": "Car",
        "words": [
          "DRIVER",
          "WIPER",
          "PARK"
        ]
      },
      {
        "label": "Office Lobby",
        "words": [
          "GUARD",
          "MAT",
          "DRIP"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "GUARD"
      ],
      [
        "UMBRELLA",
        "WIPER",
        "MAT"
      ],
      [
        "WAIT",
        "PARK",
        "DRIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rainy-commute"
  },
  {
    "id": "subset-2026-12-06-nature-zones-movement-colors-atmosphere",
    "date": "2026-12-06",
    "dayIndex": 205,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CORAL",
    "rows": [
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "RUSTLE",
          "MOSS",
          "FOG"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CURRENT",
          "CORAL",
          "SPRAY"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "BREEZE",
          "AZURE",
          "CLOUD"
        ]
      }
    ],
    "grid": [
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-12-07-city-outings-guides-workers-waiting",
    "date": "2026-12-07",
    "dayIndex": 206,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "DOCENT",
    "rows": [
      {
        "label": "Guides",
        "words": [
          "ROUTE",
          "GALLERY",
          "MENU"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "ROUTE",
          "CONDUCTOR",
          "PLATFORM"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "GALLERY",
          "DOCENT",
          "LINE"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "MENU",
          "WAITER",
          "TABLE"
        ]
      }
    ],
    "grid": [
      [
        "ROUTE",
        "GALLERY",
        "MENU"
      ],
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2026-12-08-animal-shelter",
    "date": "2026-12-08",
    "dayIndex": 207,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Animal shelter routines",
    "centerWord": "STETHOSCOPE",
    "rows": [
      {
        "label": "Helpers",
        "words": [
          "HANDLER",
          "VET",
          "COUNSELOR"
        ]
      },
      {
        "label": "Shelter Gear",
        "words": [
          "LEASH",
          "STETHOSCOPE",
          "FORM"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "FEED",
          "CHECK",
          "MATCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Kennel",
        "words": [
          "HANDLER",
          "LEASH",
          "FEED"
        ]
      },
      {
        "label": "Exam Table",
        "words": [
          "VET",
          "STETHOSCOPE",
          "CHECK"
        ]
      },
      {
        "label": "Adoption Desk",
        "words": [
          "COUNSELOR",
          "FORM",
          "MATCH"
        ]
      }
    ],
    "grid": [
      [
        "HANDLER",
        "VET",
        "COUNSELOR"
      ],
      [
        "LEASH",
        "STETHOSCOPE",
        "FORM"
      ],
      [
        "FEED",
        "CHECK",
        "MATCH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "animal-shelter"
  },
  {
    "id": "subset-2026-12-09-errands-staff-cards-and-slips-back-shelves",
    "date": "2026-12-09",
    "dayIndex": 208,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "INSURANCE",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "DEBIT",
          "VAULT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "INSURANCE",
          "DRAWER"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "POSTCARD",
          "BOX"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2026-12-10-school-life-equipment-room-noise-class-tasks",
    "date": "2026-12-10",
    "dayIndex": 209,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "BUZZER",
    "rows": [
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "SHELF",
          "PAGE",
          "READING"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "WHISTLE",
          "BUZZER",
          "LAPS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "MICROSCOPE",
          "BEEP",
          "EXPERIMENT"
        ]
      }
    ],
    "grid": [
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2026-12-11-maker-tools-prep-tools-outputs-measures",
    "date": "2026-12-11",
    "dayIndex": 210,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "FRAME",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "SAUCE",
          "TIMER"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "FRAME",
          "LEVEL"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "PORTRAIT",
          "APERTURE"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2026-12-12-opening-night",
    "date": "2026-12-12",
    "dayIndex": 211,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Opening night details",
    "centerWord": "MIRROR",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "USHER",
          "ACTOR",
          "DIRECTOR"
        ]
      },
      {
        "label": "Backstage Props",
        "words": [
          "POSTER",
          "MIRROR",
          "ROSES"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "WELCOME",
          "COSTUME",
          "APPLAUD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Marquee",
        "words": [
          "USHER",
          "POSTER",
          "WELCOME"
        ]
      },
      {
        "label": "Dressing Room",
        "words": [
          "ACTOR",
          "MIRROR",
          "COSTUME"
        ]
      },
      {
        "label": "Curtain Call",
        "words": [
          "DIRECTOR",
          "ROSES",
          "APPLAUD"
        ]
      }
    ],
    "grid": [
      [
        "USHER",
        "ACTOR",
        "DIRECTOR"
      ],
      [
        "POSTER",
        "MIRROR",
        "ROSES"
      ],
      [
        "WELCOME",
        "COSTUME",
        "APPLAUD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opening-night"
  },
  {
    "id": "subset-2026-12-13-commute-routes-stops-moving",
    "date": "2026-12-13",
    "dayIndex": 212,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SHELTER",
    "rows": [
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "LANE",
          "RACK",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "ROUTE",
          "SHELTER",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "TRACK",
          "STATION",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2026-12-14-pets-meals-care-movement",
    "date": "2026-12-14",
    "dayIndex": 213,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "LITTER",
    "rows": [
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KIBBLE",
          "LEASH",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "TUNA",
          "LITTER",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FLAKES",
          "FILTER",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2026-12-15-daily-tech-parts-power-saved-stuff",
    "date": "2026-12-15",
    "dayIndex": 214,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CABLE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CHARGER",
          "CONTACTS"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "CABLE",
          "FILES"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "BATTERY",
          "ALBUM"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2026-12-16-city-park-crew-crew-park-items-park-tasks",
    "date": "2026-12-16",
    "dayIndex": 215,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "City park crew",
    "centerWord": "KIOSK",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "GARDENER",
          "RANGER",
          "VOLUNTEER"
        ]
      },
      {
        "label": "Park Items",
        "words": [
          "RAKE",
          "KIOSK",
          "BAG"
        ]
      },
      {
        "label": "Park Tasks",
        "words": [
          "PLANT",
          "GUIDE",
          "CLEAN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Flower Bed",
        "words": [
          "GARDENER",
          "RAKE",
          "PLANT"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "RANGER",
          "KIOSK",
          "GUIDE"
        ]
      },
      {
        "label": "Cleanup",
        "words": [
          "VOLUNTEER",
          "BAG",
          "CLEAN"
        ]
      }
    ],
    "grid": [
      [
        "GARDENER",
        "RANGER",
        "VOLUNTEER"
      ],
      [
        "RAKE",
        "KIOSK",
        "BAG"
      ],
      [
        "PLANT",
        "GUIDE",
        "CLEAN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-park-crew"
  },
  {
    "id": "subset-2026-12-17-outings-sound-cues-entry-props-day-gear",
    "date": "2026-12-17",
    "dayIndex": 216,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "PLAYBILL",
    "rows": [
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "WAVES",
          "WRISTBAND",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "APPLAUSE",
          "PLAYBILL",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "CHEERS",
          "STUB",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2026-12-18-rooms-linens-morning-floor-items",
    "date": "2026-12-18",
    "dayIndex": 217,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "RAZOR",
    "rows": [
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "DISHCLOTH",
          "COFFEE",
          "MAT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "TOWEL",
          "RAZOR",
          "SCALE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "SHEET",
          "ALARM",
          "RUG"
        ]
      }
    ],
    "grid": [
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2026-12-19-opened-locked-shared-household-teamwork-class-kit",
    "date": "2026-12-19",
    "dayIndex": 218,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "ACCOUNT",
    "rows": [
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "WINDOW",
          "CALENDAR",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "DOOR",
          "ACCOUNT",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "ROOM",
          "DOC",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2026-12-20-workspaces-furniture-supplies-displays",
    "date": "2026-12-20",
    "dayIndex": 219,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "STAPLER",
    "rows": [
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "EASEL",
          "BRUSH",
          "CANVAS"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "DESK",
          "STAPLER",
          "MONITOR"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "CHAIR",
          "RULER",
          "PROJECTOR"
        ]
      }
    ],
    "grid": [
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2026-12-21-travel-stops-bags-comfort-bites",
    "date": "2026-12-21",
    "dayIndex": 220,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "ROBE",
    "rows": [
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "CARRYON",
          "PILLOW",
          "PRETZEL"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LUGGAGE",
          "ROBE",
          "BUFFET"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BACKPACK",
          "BLANKET",
          "GRANOLA"
        ]
      }
    ],
    "grid": [
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2026-12-22-dog-park-loop",
    "date": "2026-12-22",
    "dayIndex": 221,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Dog park loops",
    "centerWord": "TUNNEL",
    "rows": [
      {
        "label": "Dog Handlers",
        "words": [
          "OWNER",
          "TRAINER",
          "WALKER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "LEASH",
          "TUNNEL",
          "BOWL"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "LATCH",
          "JUMP",
          "DRINK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gate",
        "words": [
          "OWNER",
          "LEASH",
          "LATCH"
        ]
      },
      {
        "label": "Agility Area",
        "words": [
          "TRAINER",
          "TUNNEL",
          "JUMP"
        ]
      },
      {
        "label": "Water Bowl",
        "words": [
          "WALKER",
          "BOWL",
          "DRINK"
        ]
      }
    ],
    "grid": [
      [
        "OWNER",
        "TRAINER",
        "WALKER"
      ],
      [
        "LEASH",
        "TUNNEL",
        "BOWL"
      ],
      [
        "LATCH",
        "JUMP",
        "DRINK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "dog-park-loop"
  },
  {
    "id": "subset-2026-12-23-park-days-posted-rules-water-finds-tools",
    "date": "2026-12-23",
    "dayIndex": 222,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SPRINKLER",
    "rows": [
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "LABEL",
          "HOSE",
          "RAKE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "RULES",
          "SPRINKLER",
          "SHOVEL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "MARKER",
          "STREAM",
          "COMPASS"
        ]
      }
    ],
    "grid": [
      [
        "LABEL",
        "RULES",
        "MARKER"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2026-12-24-holiday-christmas-eve",
    "date": "2026-12-24",
    "dayIndex": 223,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Christmas Eve",
    "centerWord": "SURPRISE",
    "rows": [
      {
        "label": "Christmas Eve",
        "words": [
          "CAROL",
          "GIFT",
          "TREE"
        ]
      },
      {
        "label": "Birthday",
        "words": [
          "SONG",
          "SURPRISE",
          "BALLOON"
        ]
      },
      {
        "label": "Service",
        "words": [
          "HYMN",
          "CARD",
          "WREATH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Carols",
        "words": [
          "CAROL",
          "SONG",
          "HYMN"
        ]
      },
      {
        "label": "Gifts",
        "words": [
          "GIFT",
          "SURPRISE",
          "CARD"
        ]
      },
      {
        "label": "Decor",
        "words": [
          "TREE",
          "BALLOON",
          "WREATH"
        ]
      }
    ],
    "grid": [
      [
        "CAROL",
        "GIFT",
        "TREE"
      ],
      [
        "SONG",
        "SURPRISE",
        "BALLOON"
      ],
      [
        "HYMN",
        "CARD",
        "WREATH"
      ]
    ],
    "holiday": {
      "name": "Christmas Eve",
      "axis": "row",
      "index": 0,
      "label": "Christmas Eve"
    },
    "packRole": "live",
    "themeGroupId": "holiday-christmas-eve"
  },
  {
    "id": "subset-2026-12-25-holiday-christmas",
    "date": "2026-12-25",
    "dayIndex": 224,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Christmas",
    "centerWord": "PRESENT",
    "rows": [
      {
        "label": "Christmas",
        "words": [
          "COOKIE",
          "STOCKING",
          "SANTA"
        ]
      },
      {
        "label": "Birthday",
        "words": [
          "CAKE",
          "PRESENT",
          "GUEST"
        ]
      },
      {
        "label": "Housewarming",
        "words": [
          "PIE",
          "PLANT",
          "NEIGHBOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Sweets",
        "words": [
          "COOKIE",
          "CAKE",
          "PIE"
        ]
      },
      {
        "label": "Given Things",
        "words": [
          "STOCKING",
          "PRESENT",
          "PLANT"
        ]
      },
      {
        "label": "Visitors",
        "words": [
          "SANTA",
          "GUEST",
          "NEIGHBOR"
        ]
      }
    ],
    "grid": [
      [
        "COOKIE",
        "STOCKING",
        "SANTA"
      ],
      [
        "CAKE",
        "PRESENT",
        "GUEST"
      ],
      [
        "PIE",
        "PLANT",
        "NEIGHBOR"
      ]
    ],
    "holiday": {
      "name": "Christmas",
      "axis": "row",
      "index": 0,
      "label": "Christmas"
    },
    "packRole": "live",
    "themeGroupId": "holiday-christmas"
  },
  {
    "id": "subset-2026-12-26-winter-lodge-stations-staff-gear-places",
    "date": "2026-12-26",
    "dayIndex": 225,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Winter lodge stations",
    "centerWord": "SKIS",
    "rows": [
      {
        "label": "Staff",
        "words": [
          "HOST",
          "INSTRUCTOR",
          "PATROLLER"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "KEYCARD",
          "SKIS",
          "RADIO"
        ]
      },
      {
        "label": "Places",
        "words": [
          "ROOM",
          "SLOPE",
          "LOOKOUT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Lodge Desk",
        "words": [
          "HOST",
          "KEYCARD",
          "ROOM"
        ]
      },
      {
        "label": "Ski School",
        "words": [
          "INSTRUCTOR",
          "SKIS",
          "SLOPE"
        ]
      },
      {
        "label": "Patrol Hut",
        "words": [
          "PATROLLER",
          "RADIO",
          "LOOKOUT"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "INSTRUCTOR",
        "PATROLLER"
      ],
      [
        "KEYCARD",
        "SKIS",
        "RADIO"
      ],
      [
        "ROOM",
        "SLOPE",
        "LOOKOUT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "winter-lodge-stations"
  },
  {
    "id": "subset-2026-12-27-sports-fields-scoring-places-fans",
    "date": "2026-12-27",
    "dayIndex": 226,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "COURT",
    "rows": [
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "RUN",
          "DUGOUT",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "SET",
          "COURT",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "GOAL",
          "FIELD",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2026-12-28-music-groups-players-sheets-big-sounds",
    "date": "2026-12-28",
    "dayIndex": 227,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "SCORE",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Sheets",
        "words": [
          "SETLIST",
          "SCORE",
          "HYMNAL"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "SETLIST",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "SCORE",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "HYMNAL",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "SETLIST",
        "SCORE",
        "HYMNAL"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2026-12-29-movie-night",
    "date": "2026-12-29",
    "dayIndex": 228,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Movie night counters",
    "centerWord": "NACHOS",
    "rows": [
      {
        "label": "Cinema Crew",
        "words": [
          "TICKETTAKER",
          "COOK",
          "USHER"
        ]
      },
      {
        "label": "Movie Gear",
        "words": [
          "STUB",
          "NACHOS",
          "CUSHION"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "PAY",
          "SALT",
          "RECLINE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Booth",
        "words": [
          "TICKETTAKER",
          "STUB",
          "PAY"
        ]
      },
      {
        "label": "Concession",
        "words": [
          "COOK",
          "NACHOS",
          "SALT"
        ]
      },
      {
        "label": "Theater Seat",
        "words": [
          "USHER",
          "CUSHION",
          "RECLINE"
        ]
      }
    ],
    "grid": [
      [
        "TICKETTAKER",
        "COOK",
        "USHER"
      ],
      [
        "STUB",
        "NACHOS",
        "CUSHION"
      ],
      [
        "PAY",
        "SALT",
        "RECLINE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "movie-night"
  },
  {
    "id": "subset-2026-12-30-nature-zones-movement-curves-treasures",
    "date": "2026-12-30",
    "dayIndex": 229,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "WAVE",
    "rows": [
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Curves",
        "words": [
          "RING",
          "WAVE",
          "ARC"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "RUSTLE",
          "RING",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CURRENT",
          "WAVE",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "BREEZE",
          "ARC",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "RING",
        "WAVE",
        "ARC"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2026-12-31-holiday-new-year-s-eve",
    "date": "2026-12-31",
    "dayIndex": 230,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "New Year's Eve",
    "centerWord": "CHAMPAGNE",
    "rows": [
      {
        "label": "New Year's Eve",
        "words": [
          "COUNTDOWN",
          "CIDER",
          "RESOLUTION"
        ]
      },
      {
        "label": "Celebration",
        "words": [
          "MIDNIGHT",
          "CHAMPAGNE",
          "WISH"
        ]
      },
      {
        "label": "Planning",
        "words": [
          "DEADLINE",
          "COFFEE",
          "GOAL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Moments",
        "words": [
          "COUNTDOWN",
          "MIDNIGHT",
          "DEADLINE"
        ]
      },
      {
        "label": "Toasts",
        "words": [
          "CIDER",
          "CHAMPAGNE",
          "COFFEE"
        ]
      },
      {
        "label": "Promises",
        "words": [
          "RESOLUTION",
          "WISH",
          "GOAL"
        ]
      }
    ],
    "grid": [
      [
        "COUNTDOWN",
        "CIDER",
        "RESOLUTION"
      ],
      [
        "MIDNIGHT",
        "CHAMPAGNE",
        "WISH"
      ],
      [
        "DEADLINE",
        "COFFEE",
        "GOAL"
      ]
    ],
    "holiday": {
      "name": "New Year's Eve",
      "axis": "row",
      "index": 0,
      "label": "New Year's Eve"
    },
    "packRole": "live",
    "themeGroupId": "holiday-new-year-s-eve"
  },
  {
    "id": "subset-2027-01-01-holiday-new-year-s-day",
    "date": "2027-01-01",
    "dayIndex": 231,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "New Year's Day",
    "centerWord": "PLAN",
    "rows": [
      {
        "label": "New Year's Day",
        "words": [
          "FRESH",
          "RESOLUTION",
          "START"
        ]
      },
      {
        "label": "Garden",
        "words": [
          "SEED",
          "PLAN",
          "SPROUT"
        ]
      },
      {
        "label": "Desk Reset",
        "words": [
          "NOTEBOOK",
          "SCHEDULE",
          "DRAFT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Fresh",
        "words": [
          "FRESH",
          "SEED",
          "NOTEBOOK"
        ]
      },
      {
        "label": "Plans",
        "words": [
          "RESOLUTION",
          "PLAN",
          "SCHEDULE"
        ]
      },
      {
        "label": "Beginnings",
        "words": [
          "START",
          "SPROUT",
          "DRAFT"
        ]
      }
    ],
    "grid": [
      [
        "FRESH",
        "RESOLUTION",
        "START"
      ],
      [
        "SEED",
        "PLAN",
        "SPROUT"
      ],
      [
        "NOTEBOOK",
        "SCHEDULE",
        "DRAFT"
      ]
    ],
    "holiday": {
      "name": "New Year's Day",
      "axis": "row",
      "index": 0,
      "label": "New Year's Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-new-year-s-day"
  },
  {
    "id": "subset-2027-01-02-errands-cards-and-slips-back-shelves-numbers",
    "date": "2027-01-02",
    "dayIndex": 232,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DRAWER",
    "rows": [
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "DEBIT",
          "VAULT",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "INSURANCE",
          "DRAWER",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "POSTCARD",
          "BOX",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-01-03-school-life-room-noise-class-tasks-back-rooms",
    "date": "2027-01-03",
    "dayIndex": 233,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "LAPS",
    "rows": [
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "PAGE",
          "READING",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "BUZZER",
          "LAPS",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "BEEP",
          "EXPERIMENT",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-01-04-maker-tools-surfaces-safety-wear-outputs",
    "date": "2027-01-04",
    "dayIndex": 234,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "GOGGLES",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "APRON",
          "SAUCE"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "GOGGLES",
          "FRAME"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "STRAP",
          "PORTRAIT"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2027-01-05-cookout-party",
    "date": "2027-01-05",
    "dayIndex": 235,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Cookout party stations",
    "centerWord": "ICE",
    "rows": [
      {
        "label": "Helpers",
        "words": [
          "GRILLER",
          "RUNNER",
          "HOST"
        ]
      },
      {
        "label": "Cookout Gear",
        "words": [
          "SPATULA",
          "ICE",
          "NAPKINS"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SEAR",
          "CHILL",
          "SHARE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Grill",
        "words": [
          "GRILLER",
          "SPATULA",
          "SEAR"
        ]
      },
      {
        "label": "Cooler",
        "words": [
          "RUNNER",
          "ICE",
          "CHILL"
        ]
      },
      {
        "label": "Picnic Table",
        "words": [
          "HOST",
          "NAPKINS",
          "SHARE"
        ]
      }
    ],
    "grid": [
      [
        "GRILLER",
        "RUNNER",
        "HOST"
      ],
      [
        "SPATULA",
        "ICE",
        "NAPKINS"
      ],
      [
        "SEAR",
        "CHILL",
        "SHARE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "cookout-party"
  },
  {
    "id": "subset-2027-01-06-commute-operators-routes-access",
    "date": "2027-01-06",
    "dayIndex": 236,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "ROUTE",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "LANE",
          "LOCK"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "ROUTE",
          "PASS"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "TRACK",
          "TICKET"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-01-07-pets-homes-playthings-movement",
    "date": "2027-01-07",
    "dayIndex": 237,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "YARN",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "BALL",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "YARN",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "CASTLE",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-01-08-daily-tech-parts-saved-stuff-warnings",
    "date": "2027-01-08",
    "dayIndex": 238,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "FILES",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CONTACTS",
          "ALERT"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "FILES",
          "CRASH"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "ALBUM",
          "BLUR"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-01-09-airport-gate-flow-airport-staff-travel-gear-airport-moves",
    "date": "2027-01-09",
    "dayIndex": 239,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Airport gate flow",
    "centerWord": "HEADSET",
    "rows": [
      {
        "label": "Airport Staff",
        "words": [
          "AGENT",
          "PILOT",
          "OFFICER"
        ]
      },
      {
        "label": "Travel Gear",
        "words": [
          "PASS",
          "HEADSET",
          "PASSPORT"
        ]
      },
      {
        "label": "Airport Moves",
        "words": [
          "BOARD",
          "TAXI",
          "DECLARE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gate",
        "words": [
          "AGENT",
          "PASS",
          "BOARD"
        ]
      },
      {
        "label": "Cockpit",
        "words": [
          "PILOT",
          "HEADSET",
          "TAXI"
        ]
      },
      {
        "label": "Customs",
        "words": [
          "OFFICER",
          "PASSPORT",
          "DECLARE"
        ]
      }
    ],
    "grid": [
      [
        "AGENT",
        "PILOT",
        "OFFICER"
      ],
      [
        "PASS",
        "HEADSET",
        "PASSPORT"
      ],
      [
        "BOARD",
        "TAXI",
        "DECLARE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "airport-gate-flow"
  },
  {
    "id": "subset-2027-01-10-outings-where-to-sit-on-duty-day-gear",
    "date": "2027-01-10",
    "dayIndex": 240,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "USHER",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "LIFEGUARD",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "USHER",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "UMPIRE",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-01-11-rooms-built-ins-floor-items-glow",
    "date": "2027-01-11",
    "dayIndex": 241,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "SCALE",
    "rows": [
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "PANTRY",
          "MAT",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "VANITY",
          "SCALE",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "CLOSET",
          "RUG",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-01-12-opened-locked-shared-digital-household-trip-kit",
    "date": "2027-01-12",
    "dayIndex": 242,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "DOOR",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Trip Kit",
        "words": [
          "GATE",
          "LUGGAGE",
          "RIDE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "WINDOW",
          "GATE"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "DOOR",
          "LUGGAGE"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "ROOM",
          "RIDE"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "GATE",
        "LUGGAGE",
        "RIDE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-01-13-workspaces-drafts-furniture-feedback",
    "date": "2027-01-13",
    "dayIndex": 243,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "DESK",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "EASEL",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "DESK",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "CHAIR",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-01-14-travel-stops-sleep-arrival-comfort",
    "date": "2027-01-14",
    "dayIndex": 244,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LOBBY",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "GATE",
          "PILLOW"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "LOBBY",
          "ROBE"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "SITE",
          "BLANKET"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2027-01-15-garden-center",
    "date": "2027-01-15",
    "dayIndex": 245,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Garden center path",
    "centerWord": "SOIL",
    "rows": [
      {
        "label": "Garden Roles",
        "words": [
          "SHOPPER",
          "GARDENER",
          "SELLER"
        ]
      },
      {
        "label": "Planting Picks",
        "words": [
          "PACKET",
          "SOIL",
          "SEEDLING"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "PICK",
          "PLANT",
          "TOTAL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Seed Rack",
        "words": [
          "SHOPPER",
          "PACKET",
          "PICK"
        ]
      },
      {
        "label": "Potting Bench",
        "words": [
          "GARDENER",
          "SOIL",
          "PLANT"
        ]
      },
      {
        "label": "Checkout",
        "words": [
          "SELLER",
          "SEEDLING",
          "TOTAL"
        ]
      }
    ],
    "grid": [
      [
        "SHOPPER",
        "GARDENER",
        "SELLER"
      ],
      [
        "PACKET",
        "SOIL",
        "SEEDLING"
      ],
      [
        "PICK",
        "PLANT",
        "TOTAL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "garden-center"
  },
  {
    "id": "subset-2027-01-16-park-days-underfoot-rest-spots-tools",
    "date": "2027-01-16",
    "dayIndex": 246,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SWING",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "BENCH",
          "RAKE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SWING",
          "SHOVEL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "LOG",
          "COMPASS"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2027-01-17-food-stops-crew-service-spots-sweet",
    "date": "2027-01-17",
    "dayIndex": 247,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "BOOTH",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Service Spots",
        "words": [
          "CASE",
          "BOOTH",
          "STALL"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "CASE",
          "ICING"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "BOOTH",
          "SYRUP"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "STALL",
          "HONEY"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "CASE",
        "BOOTH",
        "STALL"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2027-01-18-holiday-mlk-day",
    "date": "2027-01-18",
    "dayIndex": 248,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "MLK Day",
    "centerWord": "ESSAY",
    "rows": [
      {
        "label": "MLK Day",
        "words": [
          "DREAM",
          "SPEECH",
          "MARCH"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "FAIRNESS",
          "ESSAY",
          "PROJECT"
        ]
      },
      {
        "label": "Courtroom",
        "words": [
          "JUSTICE",
          "ARGUMENT",
          "VERDICT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Values",
        "words": [
          "DREAM",
          "FAIRNESS",
          "JUSTICE"
        ]
      },
      {
        "label": "Words",
        "words": [
          "SPEECH",
          "ESSAY",
          "ARGUMENT"
        ]
      },
      {
        "label": "Civic Acts",
        "words": [
          "MARCH",
          "PROJECT",
          "VERDICT"
        ]
      }
    ],
    "grid": [
      [
        "DREAM",
        "SPEECH",
        "MARCH"
      ],
      [
        "FAIRNESS",
        "ESSAY",
        "PROJECT"
      ],
      [
        "JUSTICE",
        "ARGUMENT",
        "VERDICT"
      ]
    ],
    "holiday": {
      "name": "MLK Day",
      "axis": "row",
      "index": 0,
      "label": "MLK Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-mlk-day"
  },
  {
    "id": "subset-2027-01-19-aquarium-care-zones-keepers-creatures-care",
    "date": "2027-01-19",
    "dayIndex": 249,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Aquarium care zones",
    "centerWord": "RAY",
    "rows": [
      {
        "label": "Keepers",
        "words": [
          "AQUARIST",
          "DIVER",
          "EDUCATOR"
        ]
      },
      {
        "label": "Creatures",
        "words": [
          "CLOWNFISH",
          "RAY",
          "OTTER"
        ]
      },
      {
        "label": "Care",
        "words": [
          "SALINITY",
          "FEEDING",
          "TALK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Reef Tank",
        "words": [
          "AQUARIST",
          "CLOWNFISH",
          "SALINITY"
        ]
      },
      {
        "label": "Touch Pool",
        "words": [
          "DIVER",
          "RAY",
          "FEEDING"
        ]
      },
      {
        "label": "Show Area",
        "words": [
          "EDUCATOR",
          "OTTER",
          "TALK"
        ]
      }
    ],
    "grid": [
      [
        "AQUARIST",
        "DIVER",
        "EDUCATOR"
      ],
      [
        "CLOWNFISH",
        "RAY",
        "OTTER"
      ],
      [
        "SALINITY",
        "FEEDING",
        "TALK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "aquarium-care-zones"
  },
  {
    "id": "subset-2027-01-20-sports-fields-gear-scoring-fans",
    "date": "2027-01-20",
    "dayIndex": 250,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SET",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "RUN",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "SET",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "GOAL",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2027-01-21-music-groups-players-parts-signals",
    "date": "2027-01-21",
    "dayIndex": 251,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "MOVEMENT",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "SOLO",
          "COUNT"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "MOVEMENT",
          "BATON"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "VERSE",
          "CUE"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2027-01-22-beach-day",
    "date": "2027-01-22",
    "dayIndex": 252,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Beach day zones",
    "centerWord": "SHADE",
    "rows": [
      {
        "label": "Beach Roles",
        "words": [
          "LIFEGUARD",
          "SUNBATHER",
          "VENDOR"
        ]
      },
      {
        "label": "Beach Gear",
        "words": [
          "FLAG",
          "SHADE",
          "LEMONADE"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "SCAN",
          "LOUNGE",
          "SERVE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Guard Tower",
        "words": [
          "LIFEGUARD",
          "FLAG",
          "SCAN"
        ]
      },
      {
        "label": "Umbrella",
        "words": [
          "SUNBATHER",
          "SHADE",
          "LOUNGE"
        ]
      },
      {
        "label": "Snack Cart",
        "words": [
          "VENDOR",
          "LEMONADE",
          "SERVE"
        ]
      }
    ],
    "grid": [
      [
        "LIFEGUARD",
        "SUNBATHER",
        "VENDOR"
      ],
      [
        "FLAG",
        "SHADE",
        "LEMONADE"
      ],
      [
        "SCAN",
        "LOUNGE",
        "SERVE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "beach-day"
  },
  {
    "id": "subset-2027-01-23-nature-zones-wildlife-atmosphere-treasures",
    "date": "2027-01-23",
    "dayIndex": 253,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "SPRAY",
    "rows": [
      {
        "label": "Wildlife",
        "words": [
          "FOX",
          "SEAL",
          "EAGLE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOX",
          "FOG",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SEAL",
          "SPRAY",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "EAGLE",
          "CLOUD",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "FOX",
        "SEAL",
        "EAGLE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2027-01-24-city-outings-entry-points-guides-waiting",
    "date": "2027-01-24",
    "dayIndex": 254,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "GALLERY",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Guides",
        "words": [
          "ROUTE",
          "GALLERY",
          "MENU"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "ROUTE",
          "PLATFORM"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "GALLERY",
          "LINE"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "MENU",
          "TABLE"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "ROUTE",
        "GALLERY",
        "MENU"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2027-01-25-post-office-rush",
    "date": "2027-01-25",
    "dayIndex": 255,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Post office rush",
    "centerWord": "STAMP",
    "rows": [
      {
        "label": "Staffers",
        "words": [
          "CARRIER",
          "CLERK",
          "SORTER"
        ]
      },
      {
        "label": "Mail Pieces",
        "words": [
          "LETTER",
          "STAMP",
          "BIN"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "DROP",
          "WEIGH",
          "ROUTE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Mail Slot",
        "words": [
          "CARRIER",
          "LETTER",
          "DROP"
        ]
      },
      {
        "label": "Counter",
        "words": [
          "CLERK",
          "STAMP",
          "WEIGH"
        ]
      },
      {
        "label": "Sorting Room",
        "words": [
          "SORTER",
          "BIN",
          "ROUTE"
        ]
      }
    ],
    "grid": [
      [
        "CARRIER",
        "CLERK",
        "SORTER"
      ],
      [
        "LETTER",
        "STAMP",
        "BIN"
      ],
      [
        "DROP",
        "WEIGH",
        "ROUTE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "post-office-rush"
  },
  {
    "id": "subset-2027-01-26-errands-staff-papers-numbers",
    "date": "2027-01-26",
    "dayIndex": 256,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "PRESCRIPTION",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "CHECK",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "PRESCRIPTION",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "STAMP",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-01-27-school-life-adults-routines-room-noise",
    "date": "2027-01-27",
    "dayIndex": 257,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "DRILLS",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "QUIET",
          "PAGE"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "DRILLS",
          "BUZZER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "SAFETY",
          "BEEP"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-01-28-maker-tools-prep-tools-surfaces-measures",
    "date": "2027-01-28",
    "dayIndex": 258,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "BEAM",
    "rows": [
      {
        "label": "Prep Tools",
        "words": [
          "WHISK",
          "HAMMER",
          "TRIPOD"
        ]
      },
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "WHISK",
          "COUNTER",
          "TIMER"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "HAMMER",
          "BEAM",
          "LEVEL"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "TRIPOD",
          "BACKDROP",
          "APERTURE"
        ]
      }
    ],
    "grid": [
      [
        "WHISK",
        "HAMMER",
        "TRIPOD"
      ],
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2027-01-29-award-night",
    "date": "2027-01-29",
    "dayIndex": 259,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Award night details",
    "centerWord": "BADGE",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "EMCEE",
          "NOMINEE",
          "DANCER"
        ]
      },
      {
        "label": "Award Props",
        "words": [
          "ENVELOPE",
          "BADGE",
          "CONFETTI"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "ANNOUNCE",
          "WIN",
          "SPARKLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podium",
        "words": [
          "EMCEE",
          "ENVELOPE",
          "ANNOUNCE"
        ]
      },
      {
        "label": "Seat Row",
        "words": [
          "NOMINEE",
          "BADGE",
          "WIN"
        ]
      },
      {
        "label": "Afterparty",
        "words": [
          "DANCER",
          "CONFETTI",
          "SPARKLE"
        ]
      }
    ],
    "grid": [
      [
        "EMCEE",
        "NOMINEE",
        "DANCER"
      ],
      [
        "ENVELOPE",
        "BADGE",
        "CONFETTI"
      ],
      [
        "ANNOUNCE",
        "WIN",
        "SPARKLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "award-night"
  },
  {
    "id": "subset-2027-01-30-commute-stops-signals-access",
    "date": "2027-01-30",
    "dayIndex": 260,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SIGN",
    "rows": [
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RACK",
          "BELL",
          "LOCK"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "SHELTER",
          "SIGN",
          "PASS"
        ]
      },
      {
        "label": "Train",
        "words": [
          "STATION",
          "WHISTLE",
          "TICKET"
        ]
      }
    ],
    "grid": [
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-01-31-pets-meals-pet-noises-playthings",
    "date": "2027-01-31",
    "dayIndex": 261,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "MEOW",
    "rows": [
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KIBBLE",
          "BARK",
          "BALL"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "TUNA",
          "MEOW",
          "YARN"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FLAKES",
          "BUBBLES",
          "CASTLE"
        ]
      }
    ],
    "grid": [
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-02-01-daily-tech-power-quick-moves-warnings",
    "date": "2027-02-01",
    "dayIndex": 262,
    "difficulty": "easy",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "TYPE",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "CALL",
          "ALERT"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "TYPE",
          "CRASH"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "SNAP",
          "BLUR"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-02-02-bookstore-event-flow-people-event-tools-moments",
    "date": "2027-02-02",
    "dayIndex": 263,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bookstore event flow",
    "centerWord": "PODIUM",
    "rows": [
      {
        "label": "People",
        "words": [
          "AUTHOR",
          "HOST",
          "BOOKSELLER"
        ]
      },
      {
        "label": "Event Tools",
        "words": [
          "PEN",
          "PODIUM",
          "REGISTER"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "SIGN",
          "INTRODUCE",
          "SELL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Signing Table",
        "words": [
          "AUTHOR",
          "PEN",
          "SIGN"
        ]
      },
      {
        "label": "Stage",
        "words": [
          "HOST",
          "PODIUM",
          "INTRODUCE"
        ]
      },
      {
        "label": "Checkout",
        "words": [
          "BOOKSELLER",
          "REGISTER",
          "SELL"
        ]
      }
    ],
    "grid": [
      [
        "AUTHOR",
        "HOST",
        "BOOKSELLER"
      ],
      [
        "PEN",
        "PODIUM",
        "REGISTER"
      ],
      [
        "SIGN",
        "INTRODUCE",
        "SELL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bookstore-event-flow"
  },
  {
    "id": "subset-2027-02-03-outings-where-to-sit-snacks-day-gear",
    "date": "2027-02-03",
    "dayIndex": 264,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "POPCORN",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "PRETZEL",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "POPCORN",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "NACHOS",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-02-04-rooms-fixtures-linens-morning",
    "date": "2027-02-04",
    "dayIndex": 265,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "TOWEL",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "DISHCLOTH",
          "COFFEE"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "TOWEL",
          "RAZOR"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "SHEET",
          "ALARM"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-02-05-opened-locked-shared-digital-trip-kit-pantry-shelf",
    "date": "2027-02-05",
    "dayIndex": 266,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "LUGGAGE",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Trip Kit",
        "words": [
          "GATE",
          "LUGGAGE",
          "RIDE"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "GATE",
          "JAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "LUGGAGE",
          "CABINET"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "RIDE",
          "RECIPE"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "GATE",
        "LUGGAGE",
        "RIDE"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-02-06-workspaces-supplies-deadlines-feedback",
    "date": "2027-02-06",
    "dayIndex": 267,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "REPORT",
    "rows": [
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "BRUSH",
          "COMMISSION",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "STAPLER",
          "REPORT",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "RULER",
          "HOMEWORK",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-02-07-travel-stops-bags-bites-beacons",
    "date": "2027-02-07",
    "dayIndex": 268,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "BUFFET",
    "rows": [
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "CARRYON",
          "PRETZEL",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LUGGAGE",
          "BUFFET",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BACKPACK",
          "GRANOLA",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2027-02-08-clinic-visit",
    "date": "2027-02-08",
    "dayIndex": 269,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Clinic visit flow",
    "centerWord": "SCOPE",
    "rows": [
      {
        "label": "Clinic Staff",
        "words": [
          "RECEPTIONIST",
          "NURSE",
          "PHARMACIST"
        ]
      },
      {
        "label": "Exam Items",
        "words": [
          "FORM",
          "SCOPE",
          "BOTTLE"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "SIGN",
          "CHECK",
          "DISPENSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Front Desk",
        "words": [
          "RECEPTIONIST",
          "FORM",
          "SIGN"
        ]
      },
      {
        "label": "Exam Room",
        "words": [
          "NURSE",
          "SCOPE",
          "CHECK"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "BOTTLE",
          "DISPENSE"
        ]
      }
    ],
    "grid": [
      [
        "RECEPTIONIST",
        "NURSE",
        "PHARMACIST"
      ],
      [
        "FORM",
        "SCOPE",
        "BOTTLE"
      ],
      [
        "SIGN",
        "CHECK",
        "DISPENSE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "clinic-visit"
  },
  {
    "id": "subset-2027-02-09-park-days-underfoot-posted-rules-wildlife",
    "date": "2027-02-09",
    "dayIndex": 270,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "RULES",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Posted Rules",
        "words": [
          "LABEL",
          "RULES",
          "MARKER"
        ]
      },
      {
        "label": "Wildlife",
        "words": [
          "BEE",
          "SQUIRREL",
          "DEER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "LABEL",
          "BEE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "RULES",
          "SQUIRREL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "MARKER",
          "DEER"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "LABEL",
        "RULES",
        "MARKER"
      ],
      [
        "BEE",
        "SQUIRREL",
        "DEER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2027-02-10-food-stops-service-spots-breakfast-paper",
    "date": "2027-02-10",
    "dayIndex": 271,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "OMELET",
    "rows": [
      {
        "label": "Service Spots",
        "words": [
          "CASE",
          "BOOTH",
          "STALL"
        ]
      },
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "CASE",
          "MUFFIN",
          "BAG"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "BOOTH",
          "OMELET",
          "PLACEMAT"
        ]
      },
      {
        "label": "Market",
        "words": [
          "STALL",
          "BERRIES",
          "LIST"
        ]
      }
    ],
    "grid": [
      [
        "CASE",
        "BOOTH",
        "STALL"
      ],
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2027-02-11-media-modes-openers-audio-cues-following",
    "date": "2027-02-11",
    "dayIndex": 272,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "THEME",
    "rows": [
      {
        "label": "Openers",
        "words": [
          "INTRO",
          "SCENE",
          "HEADLINE"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "INTRO",
          "MIC",
          "SUBSCRIBE"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "THEME",
          "WATCHLIST"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "HEADLINE",
          "TONE",
          "INBOX"
        ]
      }
    ],
    "grid": [
      [
        "INTRO",
        "SCENE",
        "HEADLINE"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2027-02-12-print-shop-workflow-live-specialists-materials-moves",
    "date": "2027-02-12",
    "dayIndex": 273,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Print shop workflow",
    "centerWord": "INK",
    "rows": [
      {
        "label": "Specialists",
        "words": [
          "DESIGNER",
          "PRINTER",
          "BINDER"
        ]
      },
      {
        "label": "Materials",
        "words": [
          "PROOF",
          "INK",
          "THREAD"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "LAYOUT",
          "PRESS",
          "STITCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Design Desk",
        "words": [
          "DESIGNER",
          "PROOF",
          "LAYOUT"
        ]
      },
      {
        "label": "Press",
        "words": [
          "PRINTER",
          "INK",
          "PRESS"
        ]
      },
      {
        "label": "Bindery",
        "words": [
          "BINDER",
          "THREAD",
          "STITCH"
        ]
      }
    ],
    "grid": [
      [
        "DESIGNER",
        "PRINTER",
        "BINDER"
      ],
      [
        "PROOF",
        "INK",
        "THREAD"
      ],
      [
        "LAYOUT",
        "PRESS",
        "STITCH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "print-shop-workflow-live"
  },
  {
    "id": "subset-2027-02-13-sports-fields-places-officials-play-moves",
    "date": "2027-02-13",
    "dayIndex": 274,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "REFEREE",
    "rows": [
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "DUGOUT",
          "UMPIRE",
          "PITCH"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "COURT",
          "REFEREE",
          "SERVE"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "FIELD",
          "REF",
          "PASS"
        ]
      }
    ],
    "grid": [
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2027-02-14-holiday-valentine-s-day",
    "date": "2027-02-14",
    "dayIndex": 275,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Valentine's Day",
    "centerWord": "BOUQUET",
    "rows": [
      {
        "label": "Valentine's Day",
        "words": [
          "CARD",
          "ROSES",
          "HEART"
        ]
      },
      {
        "label": "Commitments",
        "words": [
          "RING",
          "BOUQUET",
          "VOW"
        ]
      },
      {
        "label": "Friendship",
        "words": [
          "NOTE",
          "DAISY",
          "HUG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gifts",
        "words": [
          "CARD",
          "RING",
          "NOTE"
        ]
      },
      {
        "label": "Flowers",
        "words": [
          "ROSES",
          "BOUQUET",
          "DAISY"
        ]
      },
      {
        "label": "Affection",
        "words": [
          "HEART",
          "VOW",
          "HUG"
        ]
      }
    ],
    "grid": [
      [
        "CARD",
        "ROSES",
        "HEART"
      ],
      [
        "RING",
        "BOUQUET",
        "VOW"
      ],
      [
        "NOTE",
        "DAISY",
        "HUG"
      ]
    ],
    "holiday": {
      "name": "Valentine's Day",
      "axis": "row",
      "index": 0,
      "label": "Valentine's Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-valentine-s-day"
  },
  {
    "id": "subset-2027-02-15-holiday-presidents-day",
    "date": "2027-02-15",
    "dayIndex": 276,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Presidents' Day",
    "centerWord": "PRINCIPAL",
    "rows": [
      {
        "label": "Presidents' Day",
        "words": [
          "BALLOT",
          "LINCOLN",
          "WASHINGTON"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ELECTION",
          "PRINCIPAL",
          "CONSTITUTION"
        ]
      },
      {
        "label": "City Hall",
        "words": [
          "POLL",
          "MAYOR",
          "CAPITOL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Voting",
        "words": [
          "BALLOT",
          "ELECTION",
          "POLL"
        ]
      },
      {
        "label": "Leaders",
        "words": [
          "LINCOLN",
          "PRINCIPAL",
          "MAYOR"
        ]
      },
      {
        "label": "Civics",
        "words": [
          "WASHINGTON",
          "CONSTITUTION",
          "CAPITOL"
        ]
      }
    ],
    "grid": [
      [
        "BALLOT",
        "LINCOLN",
        "WASHINGTON"
      ],
      [
        "ELECTION",
        "PRINCIPAL",
        "CONSTITUTION"
      ],
      [
        "POLL",
        "MAYOR",
        "CAPITOL"
      ]
    ],
    "holiday": {
      "name": "Presidents' Day",
      "axis": "row",
      "index": 0,
      "label": "Presidents' Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-presidents-day"
  },
  {
    "id": "subset-2027-02-16-nature-zones-wildlife-colors-atmosphere",
    "date": "2027-02-16",
    "dayIndex": 277,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CORAL",
    "rows": [
      {
        "label": "Wildlife",
        "words": [
          "FOX",
          "SEAL",
          "EAGLE"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOX",
          "MOSS",
          "FOG"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SEAL",
          "CORAL",
          "SPRAY"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "EAGLE",
          "AZURE",
          "CLOUD"
        ]
      }
    ],
    "grid": [
      [
        "FOX",
        "SEAL",
        "EAGLE"
      ],
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2027-02-17-city-outings-entry-points-workers-hand-props",
    "date": "2027-02-17",
    "dayIndex": 278,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "DOCENT",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "CONDUCTOR",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "DOCENT",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "WAITER",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2027-02-18-rehearsal-room",
    "date": "2027-02-18",
    "dayIndex": 279,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Rehearsal room setup",
    "centerWord": "TAPE",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "PLAYER",
          "ACTOR",
          "STAGEHAND"
        ]
      },
      {
        "label": "Rehearsal Props",
        "words": [
          "SHEET",
          "TAPE",
          "CUP"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "TUNE",
          "BLOCK",
          "PLACE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Music Stand",
        "words": [
          "PLAYER",
          "SHEET",
          "TUNE"
        ]
      },
      {
        "label": "Stage Mark",
        "words": [
          "ACTOR",
          "TAPE",
          "BLOCK"
        ]
      },
      {
        "label": "Prop Table",
        "words": [
          "STAGEHAND",
          "CUP",
          "PLACE"
        ]
      }
    ],
    "grid": [
      [
        "PLAYER",
        "ACTOR",
        "STAGEHAND"
      ],
      [
        "SHEET",
        "TAPE",
        "CUP"
      ],
      [
        "TUNE",
        "BLOCK",
        "PLACE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rehearsal-room"
  },
  {
    "id": "subset-2027-02-19-errands-staff-cards-and-slips-numbers",
    "date": "2027-02-19",
    "dayIndex": 280,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "INSURANCE",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Cards And Slips",
        "words": [
          "DEBIT",
          "INSURANCE",
          "POSTCARD"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "DEBIT",
          "PIN"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "INSURANCE",
          "DOSE"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "POSTCARD",
          "ZIP"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "DEBIT",
        "INSURANCE",
        "POSTCARD"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-02-20-school-life-adults-equipment-class-tasks",
    "date": "2027-02-20",
    "dayIndex": 281,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "WHISTLE",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "SHELF",
          "READING"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "WHISTLE",
          "LAPS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "MICROSCOPE",
          "EXPERIMENT"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-02-21-maker-tools-safety-wear-outputs-kits",
    "date": "2027-02-21",
    "dayIndex": 282,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "FRAME",
    "rows": [
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "APRON",
          "SAUCE",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "GOGGLES",
          "FRAME",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "STRAP",
          "PORTRAIT",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2027-02-22-shower-brunch",
    "date": "2027-02-22",
    "dayIndex": 283,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Shower brunch details",
    "centerWord": "QUICHE",
    "rows": [
      {
        "label": "Guests",
        "words": [
          "SIBLING",
          "CHEF",
          "FRIEND"
        ]
      },
      {
        "label": "Brunch Gifts",
        "words": [
          "WRAP",
          "QUICHE",
          "NOTE"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "OPEN",
          "SCOOP",
          "WISH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gift Table",
        "words": [
          "SIBLING",
          "WRAP",
          "OPEN"
        ]
      },
      {
        "label": "Brunch Bar",
        "words": [
          "CHEF",
          "QUICHE",
          "SCOOP"
        ]
      },
      {
        "label": "Advice Jar",
        "words": [
          "FRIEND",
          "NOTE",
          "WISH"
        ]
      }
    ],
    "grid": [
      [
        "SIBLING",
        "CHEF",
        "FRIEND"
      ],
      [
        "WRAP",
        "QUICHE",
        "NOTE"
      ],
      [
        "OPEN",
        "SCOOP",
        "WISH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "shower-brunch"
  },
  {
    "id": "subset-2027-02-23-commute-routes-stops-access",
    "date": "2027-02-23",
    "dayIndex": 284,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SHELTER",
    "rows": [
      {
        "label": "Routes",
        "words": [
          "LANE",
          "ROUTE",
          "TRACK"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "LANE",
          "RACK",
          "LOCK"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "ROUTE",
          "SHELTER",
          "PASS"
        ]
      },
      {
        "label": "Train",
        "words": [
          "TRACK",
          "STATION",
          "TICKET"
        ]
      }
    ],
    "grid": [
      [
        "LANE",
        "ROUTE",
        "TRACK"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-02-24-pets-meals-care-pet-noises",
    "date": "2027-02-24",
    "dayIndex": 285,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "LITTER",
    "rows": [
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KIBBLE",
          "LEASH",
          "BARK"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "TUNA",
          "LITTER",
          "MEOW"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FLAKES",
          "FILTER",
          "BUBBLES"
        ]
      }
    ],
    "grid": [
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-02-25-daily-tech-quick-moves-warnings-accessories",
    "date": "2027-02-25",
    "dayIndex": 286,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CRASH",
    "rows": [
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Warnings",
        "words": [
          "ALERT",
          "CRASH",
          "BLUR"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CALL",
          "ALERT",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "TYPE",
          "CRASH",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "SNAP",
          "BLUR",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "ALERT",
        "CRASH",
        "BLUR"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-02-26-hardware-store-counters-staff-counter-items-store-moves",
    "date": "2027-02-26",
    "dayIndex": 287,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Hardware store counters",
    "centerWord": "LEVEL",
    "rows": [
      {
        "label": "Staff",
        "words": [
          "KEYCUTTER",
          "PLUMBER",
          "PAINTER"
        ]
      },
      {
        "label": "Counter Items",
        "words": [
          "KEY",
          "LEVEL",
          "SWATCH"
        ]
      },
      {
        "label": "Store Moves",
        "words": [
          "CUT",
          "MEASURE",
          "MATCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Key Desk",
        "words": [
          "KEYCUTTER",
          "KEY",
          "CUT"
        ]
      },
      {
        "label": "Tool Aisle",
        "words": [
          "PLUMBER",
          "LEVEL",
          "MEASURE"
        ]
      },
      {
        "label": "Paint Counter",
        "words": [
          "PAINTER",
          "SWATCH",
          "MATCH"
        ]
      }
    ],
    "grid": [
      [
        "KEYCUTTER",
        "PLUMBER",
        "PAINTER"
      ],
      [
        "KEY",
        "LEVEL",
        "SWATCH"
      ],
      [
        "CUT",
        "MEASURE",
        "MATCH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "hardware-store-counters"
  },
  {
    "id": "subset-2027-02-27-outings-snacks-sound-cues-entry-props",
    "date": "2027-02-27",
    "dayIndex": 288,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "APPLAUSE",
    "rows": [
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "PRETZEL",
          "WAVES",
          "WRISTBAND"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "POPCORN",
          "APPLAUSE",
          "PLAYBILL"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "NACHOS",
          "CHEERS",
          "STUB"
        ]
      }
    ],
    "grid": [
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-02-28-rooms-fixtures-built-ins-floor-items",
    "date": "2027-02-28",
    "dayIndex": 289,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "VANITY",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Floor Items",
        "words": [
          "MAT",
          "SCALE",
          "RUG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "PANTRY",
          "MAT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "VANITY",
          "SCALE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "CLOSET",
          "RUG"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "MAT",
        "SCALE",
        "RUG"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-03-01-opened-locked-shared-household-teamwork-trip-kit",
    "date": "2027-03-01",
    "dayIndex": 290,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "ACCOUNT",
    "rows": [
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Trip Kit",
        "words": [
          "GATE",
          "LUGGAGE",
          "RIDE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "WINDOW",
          "CALENDAR",
          "GATE"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "DOOR",
          "ACCOUNT",
          "LUGGAGE"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "ROOM",
          "DOC",
          "RIDE"
        ]
      }
    ],
    "grid": [
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "GATE",
        "LUGGAGE",
        "RIDE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-03-02-workspaces-furniture-displays-feedback",
    "date": "2027-03-02",
    "dayIndex": 291,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "MONITOR",
    "rows": [
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "EASEL",
          "CANVAS",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "DESK",
          "MONITOR",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "CHAIR",
          "PROJECTOR",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-03-03-travel-stops-bags-comfort-beacons",
    "date": "2027-03-03",
    "dayIndex": 292,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "ROBE",
    "rows": [
      {
        "label": "Bags",
        "words": [
          "CARRYON",
          "LUGGAGE",
          "BACKPACK"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "CARRYON",
          "PILLOW",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LUGGAGE",
          "ROBE",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "BACKPACK",
          "BLANKET",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "CARRYON",
        "LUGGAGE",
        "BACKPACK"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2027-03-04-museum-day",
    "date": "2027-03-04",
    "dayIndex": 293,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Museum day stops",
    "centerWord": "PAINTING",
    "rows": [
      {
        "label": "Museum Roles",
        "words": [
          "DOCENT",
          "PAINTER",
          "BARISTA"
        ]
      },
      {
        "label": "Museum Finds",
        "words": [
          "BADGE",
          "PAINTING",
          "MUFFIN"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "GUIDE",
          "VIEW",
          "SIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Desk",
        "words": [
          "DOCENT",
          "BADGE",
          "GUIDE"
        ]
      },
      {
        "label": "Gallery",
        "words": [
          "PAINTER",
          "PAINTING",
          "VIEW"
        ]
      },
      {
        "label": "Cafe",
        "words": [
          "BARISTA",
          "MUFFIN",
          "SIP"
        ]
      }
    ],
    "grid": [
      [
        "DOCENT",
        "PAINTER",
        "BARISTA"
      ],
      [
        "BADGE",
        "PAINTING",
        "MUFFIN"
      ],
      [
        "GUIDE",
        "VIEW",
        "SIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "museum-day"
  },
  {
    "id": "subset-2027-03-05-park-days-rest-spots-water-finds-tools",
    "date": "2027-03-05",
    "dayIndex": 294,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SPRINKLER",
    "rows": [
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "RAKE",
          "SHOVEL",
          "COMPASS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "BENCH",
          "HOSE",
          "RAKE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SWING",
          "SPRINKLER",
          "SHOVEL"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "LOG",
          "STREAM",
          "COMPASS"
        ]
      }
    ],
    "grid": [
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ],
      [
        "RAKE",
        "SHOVEL",
        "COMPASS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2027-03-06-food-stops-crew-sweet-counter-tools",
    "date": "2027-03-06",
    "dayIndex": 295,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "SYRUP",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Sweet",
        "words": [
          "ICING",
          "SYRUP",
          "HONEY"
        ]
      },
      {
        "label": "Counter Tools",
        "words": [
          "OVEN",
          "GRIDDLE",
          "SCALE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "ICING",
          "OVEN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "SYRUP",
          "GRIDDLE"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "HONEY",
          "SCALE"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "ICING",
        "SYRUP",
        "HONEY"
      ],
      [
        "OVEN",
        "GRIDDLE",
        "SCALE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2027-03-07-media-modes-openers-people-opinion",
    "date": "2027-03-07",
    "dayIndex": 296,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "ACTOR",
    "rows": [
      {
        "label": "Openers",
        "words": [
          "INTRO",
          "SCENE",
          "HEADLINE"
        ]
      },
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "INTRO",
          "HOST",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "ACTOR",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "HEADLINE",
          "EDITOR",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "INTRO",
        "SCENE",
        "HEADLINE"
      ],
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2027-03-08-train-station-handoffs-staff-travel-items-station-moves",
    "date": "2027-03-08",
    "dayIndex": 297,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Train station handoffs",
    "centerWord": "TICKET",
    "rows": [
      {
        "label": "Staff",
        "words": [
          "AGENT",
          "ATTENDANT",
          "PORTER"
        ]
      },
      {
        "label": "Travel Items",
        "words": [
          "MAP",
          "TICKET",
          "CART"
        ]
      },
      {
        "label": "Station Moves",
        "words": [
          "DIRECT",
          "BOARD",
          "LOAD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Info Booth",
        "words": [
          "AGENT",
          "MAP",
          "DIRECT"
        ]
      },
      {
        "label": "Platform",
        "words": [
          "ATTENDANT",
          "TICKET",
          "BOARD"
        ]
      },
      {
        "label": "Baggage",
        "words": [
          "PORTER",
          "CART",
          "LOAD"
        ]
      }
    ],
    "grid": [
      [
        "AGENT",
        "ATTENDANT",
        "PORTER"
      ],
      [
        "MAP",
        "TICKET",
        "CART"
      ],
      [
        "DIRECT",
        "BOARD",
        "LOAD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "train-station-handoffs"
  },
  {
    "id": "subset-2027-03-09-sports-fields-scoring-places-officials",
    "date": "2027-03-09",
    "dayIndex": 298,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "COURT",
    "rows": [
      {
        "label": "Scoring",
        "words": [
          "RUN",
          "SET",
          "GOAL"
        ]
      },
      {
        "label": "Places",
        "words": [
          "DUGOUT",
          "COURT",
          "FIELD"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "RUN",
          "DUGOUT",
          "UMPIRE"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "SET",
          "COURT",
          "REFEREE"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "GOAL",
          "FIELD",
          "REF"
        ]
      }
    ],
    "grid": [
      [
        "RUN",
        "SET",
        "GOAL"
      ],
      [
        "DUGOUT",
        "COURT",
        "FIELD"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2027-03-10-music-groups-parts-signals-big-sounds",
    "date": "2027-03-10",
    "dayIndex": 299,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "BATON",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      },
      {
        "label": "Big Sounds",
        "words": [
          "CHORD",
          "CRESCENDO",
          "HARMONY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "SOLO",
          "COUNT",
          "CHORD"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "MOVEMENT",
          "BATON",
          "CRESCENDO"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "VERSE",
          "CUE",
          "HARMONY"
        ]
      }
    ],
    "grid": [
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ],
      [
        "CHORD",
        "CRESCENDO",
        "HARMONY"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2027-03-11-winter-rink",
    "date": "2027-03-11",
    "dayIndex": 300,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Winter rink routines",
    "centerWord": "PUCK",
    "rows": [
      {
        "label": "Rink Roles",
        "words": [
          "ATTENDANT",
          "SKATER",
          "COACH"
        ]
      },
      {
        "label": "Gear",
        "words": [
          "SKATES",
          "PUCK",
          "LACES"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "RENT",
          "GLIDE",
          "TIE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Rental Counter",
        "words": [
          "ATTENDANT",
          "SKATES",
          "RENT"
        ]
      },
      {
        "label": "Ice",
        "words": [
          "SKATER",
          "PUCK",
          "GLIDE"
        ]
      },
      {
        "label": "Bench",
        "words": [
          "COACH",
          "LACES",
          "TIE"
        ]
      }
    ],
    "grid": [
      [
        "ATTENDANT",
        "SKATER",
        "COACH"
      ],
      [
        "SKATES",
        "PUCK",
        "LACES"
      ],
      [
        "RENT",
        "GLIDE",
        "TIE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "winter-rink"
  },
  {
    "id": "subset-2027-03-12-nature-zones-wildlife-movement-treasures",
    "date": "2027-03-12",
    "dayIndex": 301,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CURRENT",
    "rows": [
      {
        "label": "Wildlife",
        "words": [
          "FOX",
          "SEAL",
          "EAGLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "FOX",
          "RUSTLE",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "SEAL",
          "CURRENT",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "EAGLE",
          "BREEZE",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "FOX",
        "SEAL",
        "EAGLE"
      ],
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2027-03-13-city-outings-workers-rest-spots-waiting",
    "date": "2027-03-13",
    "dayIndex": 302,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "BENCH",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "SEAT",
          "BENCH",
          "BOOTH"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "CONDUCTOR",
          "SEAT",
          "PLATFORM"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "DOCENT",
          "BENCH",
          "LINE"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "WAITER",
          "BOOTH",
          "TABLE"
        ]
      }
    ],
    "grid": [
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "SEAT",
        "BENCH",
        "BOOTH"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2027-03-14-bakery-case",
    "date": "2027-03-14",
    "dayIndex": 303,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Bakery case morning",
    "centerWord": "LOAF",
    "rows": [
      {
        "label": "Bakery Crew",
        "words": [
          "BAKER",
          "APPRENTICE",
          "CASHIER"
        ]
      },
      {
        "label": "Bakes",
        "words": [
          "BATTER",
          "LOAF",
          "TART"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "WHISK",
          "SLICE",
          "LABEL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Mixer",
        "words": [
          "BAKER",
          "BATTER",
          "WHISK"
        ]
      },
      {
        "label": "Oven",
        "words": [
          "APPRENTICE",
          "LOAF",
          "SLICE"
        ]
      },
      {
        "label": "Display Case",
        "words": [
          "CASHIER",
          "TART",
          "LABEL"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "APPRENTICE",
        "CASHIER"
      ],
      [
        "BATTER",
        "LOAF",
        "TART"
      ],
      [
        "WHISK",
        "SLICE",
        "LABEL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "bakery-case"
  },
  {
    "id": "subset-2027-03-15-errands-papers-back-shelves-receipts",
    "date": "2027-03-15",
    "dayIndex": 304,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DRAWER",
    "rows": [
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      },
      {
        "label": "Receipts",
        "words": [
          "RECEIPT",
          "LABEL",
          "TRACKING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "CHECK",
          "VAULT",
          "RECEIPT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PRESCRIPTION",
          "DRAWER",
          "LABEL"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "STAMP",
          "BOX",
          "TRACKING"
        ]
      }
    ],
    "grid": [
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ],
      [
        "RECEIPT",
        "LABEL",
        "TRACKING"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-03-16-school-life-routines-room-noise-back-rooms",
    "date": "2027-03-16",
    "dayIndex": 305,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "BUZZER",
    "rows": [
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Room Noise",
        "words": [
          "PAGE",
          "BUZZER",
          "BEEP"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "QUIET",
          "PAGE",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "DRILLS",
          "BUZZER",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SAFETY",
          "BEEP",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "PAGE",
        "BUZZER",
        "BEEP"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-03-17-holiday-st-patrick-s-day",
    "date": "2027-03-17",
    "dayIndex": 306,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "St. Patrick's Day",
    "centerWord": "MARKER",
    "rows": [
      {
        "label": "St. Patrick's Day",
        "words": [
          "GREEN",
          "CLOVER",
          "SHAMROCK"
        ]
      },
      {
        "label": "Garden",
        "words": [
          "MOSS",
          "MARKER",
          "FERN"
        ]
      },
      {
        "label": "Park",
        "words": [
          "LAWN",
          "SIGN",
          "HEDGE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Green",
        "words": [
          "GREEN",
          "MOSS",
          "LAWN"
        ]
      },
      {
        "label": "Symbols",
        "words": [
          "CLOVER",
          "MARKER",
          "SIGN"
        ]
      },
      {
        "label": "Plants",
        "words": [
          "SHAMROCK",
          "FERN",
          "HEDGE"
        ]
      }
    ],
    "grid": [
      [
        "GREEN",
        "CLOVER",
        "SHAMROCK"
      ],
      [
        "MOSS",
        "MARKER",
        "FERN"
      ],
      [
        "LAWN",
        "SIGN",
        "HEDGE"
      ]
    ],
    "holiday": {
      "name": "St. Patrick's Day",
      "axis": "row",
      "index": 0,
      "label": "St. Patrick's Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-st-patrick-s-day"
  },
  {
    "id": "subset-2027-03-18-parade-day",
    "date": "2027-03-18",
    "dayIndex": 307,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Parade day moments",
    "centerWord": "STREAMER",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "SPECTATOR",
          "BUILDER",
          "DRUMMER"
        ]
      },
      {
        "label": "Parade Props",
        "words": [
          "FLAG",
          "STREAMER",
          "CYMBAL"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "WAVE",
          "ROLL",
          "MARCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Curb",
        "words": [
          "SPECTATOR",
          "FLAG",
          "WAVE"
        ]
      },
      {
        "label": "Float",
        "words": [
          "BUILDER",
          "STREAMER",
          "ROLL"
        ]
      },
      {
        "label": "Band Row",
        "words": [
          "DRUMMER",
          "CYMBAL",
          "MARCH"
        ]
      }
    ],
    "grid": [
      [
        "SPECTATOR",
        "BUILDER",
        "DRUMMER"
      ],
      [
        "FLAG",
        "STREAMER",
        "CYMBAL"
      ],
      [
        "WAVE",
        "ROLL",
        "MARCH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "parade-day"
  },
  {
    "id": "subset-2027-03-19-commute-signals-access-moving",
    "date": "2027-03-19",
    "dayIndex": 308,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "PASS",
    "rows": [
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "BELL",
          "LOCK",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "SIGN",
          "PASS",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "WHISTLE",
          "TICKET",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-03-20-pets-care-playthings-movement",
    "date": "2027-03-20",
    "dayIndex": 309,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "YARN",
    "rows": [
      {
        "label": "Care",
        "words": [
          "LEASH",
          "LITTER",
          "FILTER"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "LEASH",
          "BALL",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "LITTER",
          "YARN",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "FILTER",
          "CASTLE",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "LEASH",
        "LITTER",
        "FILTER"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-03-21-daily-tech-power-saved-stuff-accessories",
    "date": "2027-03-21",
    "dayIndex": 310,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "FILES",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Saved Stuff",
        "words": [
          "CONTACTS",
          "FILES",
          "ALBUM"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "CONTACTS",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "FILES",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "ALBUM",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CONTACTS",
        "FILES",
        "ALBUM"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-03-22-farmers-market-demo-people-setup-gear-moves",
    "date": "2027-03-22",
    "dayIndex": 311,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Farmers market demo",
    "centerWord": "SKILLET",
    "rows": [
      {
        "label": "People",
        "words": [
          "FARMER",
          "CHEF",
          "MUSICIAN"
        ]
      },
      {
        "label": "Setup Gear",
        "words": [
          "CRATE",
          "SKILLET",
          "GUITAR"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "HARVEST",
          "SAUTE",
          "STRUM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Produce Stall",
        "words": [
          "FARMER",
          "CRATE",
          "HARVEST"
        ]
      },
      {
        "label": "Demo Tent",
        "words": [
          "CHEF",
          "SKILLET",
          "SAUTE"
        ]
      },
      {
        "label": "Busker Corner",
        "words": [
          "MUSICIAN",
          "GUITAR",
          "STRUM"
        ]
      }
    ],
    "grid": [
      [
        "FARMER",
        "CHEF",
        "MUSICIAN"
      ],
      [
        "CRATE",
        "SKILLET",
        "GUITAR"
      ],
      [
        "HARVEST",
        "SAUTE",
        "STRUM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "farmers-market-demo"
  },
  {
    "id": "subset-2027-03-23-outings-where-to-sit-on-duty-entry-props",
    "date": "2027-03-23",
    "dayIndex": 312,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "USHER",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "On Duty",
        "words": [
          "LIFEGUARD",
          "USHER",
          "UMPIRE"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "LIFEGUARD",
          "WRISTBAND"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "USHER",
          "PLAYBILL"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "UMPIRE",
          "STUB"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "LIFEGUARD",
        "USHER",
        "UMPIRE"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-03-24-rooms-linens-morning-glow",
    "date": "2027-03-24",
    "dayIndex": 313,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "RAZOR",
    "rows": [
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "DISHCLOTH",
          "COFFEE",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "TOWEL",
          "RAZOR",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "SHEET",
          "ALARM",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-03-25-opened-locked-shared-digital-household-pantry-shelf",
    "date": "2027-03-25",
    "dayIndex": 314,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "DOOR",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Household",
        "words": [
          "WINDOW",
          "DOOR",
          "ROOM"
        ]
      },
      {
        "label": "Pantry Shelf",
        "words": [
          "JAR",
          "CABINET",
          "RECIPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "WINDOW",
          "JAR"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "DOOR",
          "CABINET"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "ROOM",
          "RECIPE"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "WINDOW",
        "DOOR",
        "ROOM"
      ],
      [
        "JAR",
        "CABINET",
        "RECIPE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-03-26-workspaces-drafts-supplies-displays",
    "date": "2027-03-26",
    "dayIndex": 315,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "STAPLER",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "BRUSH",
          "CANVAS"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "STAPLER",
          "MONITOR"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "RULER",
          "PROJECTOR"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-03-27-travel-stops-sleep-arrival-beacons",
    "date": "2027-03-27",
    "dayIndex": 316,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "LOBBY",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "GATE",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "LOBBY",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "SITE",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2027-03-28-holiday-easter",
    "date": "2027-03-28",
    "dayIndex": 317,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Easter",
    "centerWord": "ANT",
    "rows": [
      {
        "label": "Easter",
        "words": [
          "CHOCOLATE",
          "BUNNY",
          "LILY"
        ]
      },
      {
        "label": "Picnic",
        "words": [
          "COOKIE",
          "ANT",
          "DAISY"
        ]
      },
      {
        "label": "Garden",
        "words": [
          "HONEY",
          "BEE",
          "ROSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Treats",
        "words": [
          "CHOCOLATE",
          "COOKIE",
          "HONEY"
        ]
      },
      {
        "label": "Spring Animals",
        "words": [
          "BUNNY",
          "ANT",
          "BEE"
        ]
      },
      {
        "label": "Flowers",
        "words": [
          "LILY",
          "DAISY",
          "ROSE"
        ]
      }
    ],
    "grid": [
      [
        "CHOCOLATE",
        "BUNNY",
        "LILY"
      ],
      [
        "COOKIE",
        "ANT",
        "DAISY"
      ],
      [
        "HONEY",
        "BEE",
        "ROSE"
      ]
    ],
    "holiday": {
      "name": "Easter",
      "axis": "row",
      "index": 0,
      "label": "Easter"
    },
    "packRole": "live",
    "themeGroupId": "holiday-easter"
  },
  {
    "id": "subset-2027-03-29-park-days-underfoot-rest-spots-water-finds",
    "date": "2027-03-29",
    "dayIndex": 318,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Green spaces and the things inside them",
    "centerWord": "SWING",
    "rows": [
      {
        "label": "Underfoot",
        "words": [
          "MULCH",
          "SAND",
          "GRAVEL"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "BENCH",
          "SWING",
          "LOG"
        ]
      },
      {
        "label": "Water Finds",
        "words": [
          "HOSE",
          "SPRINKLER",
          "STREAM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Garden",
        "words": [
          "MULCH",
          "BENCH",
          "HOSE"
        ]
      },
      {
        "label": "Playground",
        "words": [
          "SAND",
          "SWING",
          "SPRINKLER"
        ]
      },
      {
        "label": "Trail",
        "words": [
          "GRAVEL",
          "LOG",
          "STREAM"
        ]
      }
    ],
    "grid": [
      [
        "MULCH",
        "SAND",
        "GRAVEL"
      ],
      [
        "BENCH",
        "SWING",
        "LOG"
      ],
      [
        "HOSE",
        "SPRINKLER",
        "STREAM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "park-days"
  },
  {
    "id": "subset-2027-03-30-food-stops-breakfast-paper-counter-tools",
    "date": "2027-03-30",
    "dayIndex": 319,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "PLACEMAT",
    "rows": [
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Paper",
        "words": [
          "BAG",
          "PLACEMAT",
          "LIST"
        ]
      },
      {
        "label": "Counter Tools",
        "words": [
          "OVEN",
          "GRIDDLE",
          "SCALE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "MUFFIN",
          "BAG",
          "OVEN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "OMELET",
          "PLACEMAT",
          "GRIDDLE"
        ]
      },
      {
        "label": "Market",
        "words": [
          "BERRIES",
          "LIST",
          "SCALE"
        ]
      }
    ],
    "grid": [
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "BAG",
        "PLACEMAT",
        "LIST"
      ],
      [
        "OVEN",
        "GRIDDLE",
        "SCALE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2027-03-31-media-modes-units-following-opinion",
    "date": "2027-03-31",
    "dayIndex": 320,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "WATCHLIST",
    "rows": [
      {
        "label": "Units",
        "words": [
          "EPISODE",
          "SCENE",
          "ISSUE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      },
      {
        "label": "Opinion",
        "words": [
          "RATING",
          "REVIEW",
          "COMMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "EPISODE",
          "SUBSCRIBE",
          "RATING"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "SCENE",
          "WATCHLIST",
          "REVIEW"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "ISSUE",
          "INBOX",
          "COMMENT"
        ]
      }
    ],
    "grid": [
      [
        "EPISODE",
        "SCENE",
        "ISSUE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ],
      [
        "RATING",
        "REVIEW",
        "COMMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2027-04-01-holiday-april-fools-day",
    "date": "2027-04-01",
    "dayIndex": 321,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar",
      "interaction"
    ],
    "theme": "April Fools' Day misdirection",
    "centerWord": "MICROPHONE",
    "rows": [
      {
        "label": "April Fools' Day",
        "words": [
          "HOAX",
          "BIT",
          "TRICK"
        ]
      },
      {
        "label": "Props",
        "words": [
          "WHOOPIE",
          "MICROPHONE",
          "TOPHAT"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "MISDIRECT",
          "HECKLE",
          "VANISH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Prank",
        "words": [
          "HOAX",
          "WHOOPIE",
          "MISDIRECT"
        ]
      },
      {
        "label": "Comedy Club",
        "words": [
          "BIT",
          "MICROPHONE",
          "HECKLE"
        ]
      },
      {
        "label": "Magic Show",
        "words": [
          "TRICK",
          "TOPHAT",
          "VANISH"
        ]
      }
    ],
    "grid": [
      [
        "HOAX",
        "BIT",
        "TRICK"
      ],
      [
        "WHOOPIE",
        "MICROPHONE",
        "TOPHAT"
      ],
      [
        "MISDIRECT",
        "HECKLE",
        "VANISH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "holiday-april-fools-day",
    "holiday": {
      "name": "April Fools' Day",
      "axis": "row",
      "index": 0,
      "label": "April Fools' Day"
    }
  },
  {
    "id": "subset-2027-04-02-sports-fields-gear-play-moves-fans",
    "date": "2027-04-02",
    "dayIndex": 322,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "SERVE",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Play Moves",
        "words": [
          "PITCH",
          "SERVE",
          "PASS"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "PITCH",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "SERVE",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "PASS",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "PITCH",
        "SERVE",
        "PASS"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2027-04-03-music-groups-players-practice-cues-sheets",
    "date": "2027-04-03",
    "dayIndex": 323,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "REHEARSAL",
    "rows": [
      {
        "label": "Players",
        "words": [
          "DRUMMER",
          "VIOLINIST",
          "SINGER"
        ]
      },
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Sheets",
        "words": [
          "SETLIST",
          "SCORE",
          "HYMNAL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "DRUMMER",
          "RIFF",
          "SETLIST"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "VIOLINIST",
          "REHEARSAL",
          "SCORE"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "SINGER",
          "WARMUP",
          "HYMNAL"
        ]
      }
    ],
    "grid": [
      [
        "DRUMMER",
        "VIOLINIST",
        "SINGER"
      ],
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "SETLIST",
        "SCORE",
        "HYMNAL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2027-04-04-holiday-easter",
    "date": "2027-04-04",
    "dayIndex": 324,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar",
      "place-context"
    ],
    "theme": "Easter morning rituals",
    "centerWord": "NAPKIN",
    "rows": [
      {
        "label": "Easter",
        "words": [
          "BASKET",
          "OMELET",
          "LILY"
        ]
      },
      {
        "label": "Setups",
        "words": [
          "MAP",
          "NAPKIN",
          "TROWEL"
        ]
      },
      {
        "label": "Finds",
        "words": [
          "CLUE",
          "MIMOSA",
          "BLOOM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Egg Hunt",
        "words": [
          "BASKET",
          "MAP",
          "CLUE"
        ]
      },
      {
        "label": "Brunch",
        "words": [
          "OMELET",
          "NAPKIN",
          "MIMOSA"
        ]
      },
      {
        "label": "Spring Garden",
        "words": [
          "LILY",
          "TROWEL",
          "BLOOM"
        ]
      }
    ],
    "grid": [
      [
        "BASKET",
        "OMELET",
        "LILY"
      ],
      [
        "MAP",
        "NAPKIN",
        "TROWEL"
      ],
      [
        "CLUE",
        "MIMOSA",
        "BLOOM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "holiday-easter",
    "holiday": {
      "name": "Easter",
      "axis": "row",
      "index": 0,
      "label": "Easter"
    }
  },
  {
    "id": "subset-2027-04-05-nature-zones-colors-atmosphere-curves",
    "date": "2027-04-05",
    "dayIndex": 325,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "SPRAY",
    "rows": [
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Atmosphere",
        "words": [
          "FOG",
          "SPRAY",
          "CLOUD"
        ]
      },
      {
        "label": "Curves",
        "words": [
          "RING",
          "WAVE",
          "ARC"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "MOSS",
          "FOG",
          "RING"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CORAL",
          "SPRAY",
          "WAVE"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "AZURE",
          "CLOUD",
          "ARC"
        ]
      }
    ],
    "grid": [
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "FOG",
        "SPRAY",
        "CLOUD"
      ],
      [
        "RING",
        "WAVE",
        "ARC"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2027-04-06-city-outings-guides-waiting-hand-props",
    "date": "2027-04-06",
    "dayIndex": 326,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "LINE",
    "rows": [
      {
        "label": "Guides",
        "words": [
          "ROUTE",
          "GALLERY",
          "MENU"
        ]
      },
      {
        "label": "Waiting",
        "words": [
          "PLATFORM",
          "LINE",
          "TABLE"
        ]
      },
      {
        "label": "Hand Props",
        "words": [
          "TOKEN",
          "FRAME",
          "FORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "ROUTE",
          "PLATFORM",
          "TOKEN"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "GALLERY",
          "LINE",
          "FRAME"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "MENU",
          "TABLE",
          "FORK"
        ]
      }
    ],
    "grid": [
      [
        "ROUTE",
        "GALLERY",
        "MENU"
      ],
      [
        "PLATFORM",
        "LINE",
        "TABLE"
      ],
      [
        "TOKEN",
        "FRAME",
        "FORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2027-04-07-boat-tour",
    "date": "2027-04-07",
    "dayIndex": 327,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Boat tour flow",
    "centerWord": "RAIL",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "GUIDE",
          "MATE",
          "CAPTAIN"
        ]
      },
      {
        "label": "Tour Gear",
        "words": [
          "WRISTBAND",
          "RAIL",
          "BINOCULARS"
        ]
      },
      {
        "label": "Steps",
        "words": [
          "BOARD",
          "STEADY",
          "POINT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ticket Tent",
        "words": [
          "GUIDE",
          "WRISTBAND",
          "BOARD"
        ]
      },
      {
        "label": "Gangway",
        "words": [
          "MATE",
          "RAIL",
          "STEADY"
        ]
      },
      {
        "label": "Upper Deck",
        "words": [
          "CAPTAIN",
          "BINOCULARS",
          "POINT"
        ]
      }
    ],
    "grid": [
      [
        "GUIDE",
        "MATE",
        "CAPTAIN"
      ],
      [
        "WRISTBAND",
        "RAIL",
        "BINOCULARS"
      ],
      [
        "BOARD",
        "STEADY",
        "POINT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "boat-tour"
  },
  {
    "id": "subset-2027-04-08-errands-staff-papers-receipts",
    "date": "2027-04-08",
    "dayIndex": 328,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "PRESCRIPTION",
    "rows": [
      {
        "label": "Counter Staff",
        "words": [
          "TELLER",
          "PHARMACIST",
          "CLERK"
        ]
      },
      {
        "label": "Papers",
        "words": [
          "CHECK",
          "PRESCRIPTION",
          "STAMP"
        ]
      },
      {
        "label": "Receipts",
        "words": [
          "RECEIPT",
          "LABEL",
          "TRACKING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "TELLER",
          "CHECK",
          "RECEIPT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "PRESCRIPTION",
          "LABEL"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "CLERK",
          "STAMP",
          "TRACKING"
        ]
      }
    ],
    "grid": [
      [
        "TELLER",
        "PHARMACIST",
        "CLERK"
      ],
      [
        "CHECK",
        "PRESCRIPTION",
        "STAMP"
      ],
      [
        "RECEIPT",
        "LABEL",
        "TRACKING"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-04-09-school-life-adults-routines-class-tasks",
    "date": "2027-04-09",
    "dayIndex": 329,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "DRILLS",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Routines",
        "words": [
          "QUIET",
          "DRILLS",
          "SAFETY"
        ]
      },
      {
        "label": "Class Tasks",
        "words": [
          "READING",
          "LAPS",
          "EXPERIMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "QUIET",
          "READING"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "DRILLS",
          "LAPS"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "SAFETY",
          "EXPERIMENT"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "QUIET",
        "DRILLS",
        "SAFETY"
      ],
      [
        "READING",
        "LAPS",
        "EXPERIMENT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-04-10-maker-tools-surfaces-safety-wear-measures",
    "date": "2027-04-10",
    "dayIndex": 330,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "GOGGLES",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Safety Wear",
        "words": [
          "APRON",
          "GOGGLES",
          "STRAP"
        ]
      },
      {
        "label": "Measures",
        "words": [
          "TIMER",
          "LEVEL",
          "APERTURE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "APRON",
          "TIMER"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "GOGGLES",
          "LEVEL"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "STRAP",
          "APERTURE"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "APRON",
        "GOGGLES",
        "STRAP"
      ],
      [
        "TIMER",
        "LEVEL",
        "APERTURE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2027-04-11-reunion-table",
    "date": "2027-04-11",
    "dayIndex": 331,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "role-context",
      "keystone"
    ],
    "theme": "Reunion table details",
    "centerWord": "CASSEROLE",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "COUSIN",
          "COOK",
          "STORYTELLER"
        ]
      },
      {
        "label": "Table Keepsakes",
        "words": [
          "MARKER",
          "CASSEROLE",
          "ROCKER"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "RECONNECT",
          "SCOOP",
          "REMEMBER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Name Tags",
        "words": [
          "COUSIN",
          "MARKER",
          "RECONNECT"
        ]
      },
      {
        "label": "Buffet",
        "words": [
          "COOK",
          "CASSEROLE",
          "SCOOP"
        ]
      },
      {
        "label": "Porch",
        "words": [
          "STORYTELLER",
          "ROCKER",
          "REMEMBER"
        ]
      }
    ],
    "grid": [
      [
        "COUSIN",
        "COOK",
        "STORYTELLER"
      ],
      [
        "MARKER",
        "CASSEROLE",
        "ROCKER"
      ],
      [
        "RECONNECT",
        "SCOOP",
        "REMEMBER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "reunion-table"
  },
  {
    "id": "subset-2027-04-12-commute-operators-signals-moving",
    "date": "2027-04-12",
    "dayIndex": 332,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SIGN",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "BELL",
          "SIGN",
          "WHISTLE"
        ]
      },
      {
        "label": "Moving",
        "words": [
          "PEDAL",
          "RIDE",
          "RAIL"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "BELL",
          "PEDAL"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "SIGN",
          "RIDE"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "WHISTLE",
          "RAIL"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "BELL",
        "SIGN",
        "WHISTLE"
      ],
      [
        "PEDAL",
        "RIDE",
        "RAIL"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-04-13-pets-homes-pet-noises-movement",
    "date": "2027-04-13",
    "dayIndex": 333,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "MEOW",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Pet Noises",
        "words": [
          "BARK",
          "MEOW",
          "BUBBLES"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "FETCH",
          "POUNCE",
          "SWIM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "BARK",
          "FETCH"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "MEOW",
          "POUNCE"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "BUBBLES",
          "SWIM"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "BARK",
        "MEOW",
        "BUBBLES"
      ],
      [
        "FETCH",
        "POUNCE",
        "SWIM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-04-14-daily-tech-parts-power-accessories",
    "date": "2027-04-14",
    "dayIndex": 334,
    "difficulty": "medium",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "CABLE",
    "rows": [
      {
        "label": "Parts",
        "words": [
          "SCREEN",
          "KEYBOARD",
          "LENS"
        ]
      },
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "SCREEN",
          "CHARGER",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "KEYBOARD",
          "CABLE",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "LENS",
          "BATTERY",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "SCREEN",
        "KEYBOARD",
        "LENS"
      ],
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-04-15-harbor-day-handoffs-crew-dock-gear-harbor-jobs",
    "date": "2027-04-15",
    "dayIndex": 335,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Harbor day handoffs",
    "centerWord": "DOCK",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "FISHER",
          "SAILOR",
          "HARBORMASTER"
        ]
      },
      {
        "label": "Dock Gear",
        "words": [
          "NET",
          "DOCK",
          "LOGBOOK"
        ]
      },
      {
        "label": "Harbor Jobs",
        "words": [
          "WEIGH",
          "TIE",
          "INSPECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Fish Stall",
        "words": [
          "FISHER",
          "NET",
          "WEIGH"
        ]
      },
      {
        "label": "Boat Slip",
        "words": [
          "SAILOR",
          "DOCK",
          "TIE"
        ]
      },
      {
        "label": "Harbor Office",
        "words": [
          "HARBORMASTER",
          "LOGBOOK",
          "INSPECT"
        ]
      }
    ],
    "grid": [
      [
        "FISHER",
        "SAILOR",
        "HARBORMASTER"
      ],
      [
        "NET",
        "DOCK",
        "LOGBOOK"
      ],
      [
        "WEIGH",
        "TIE",
        "INSPECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "harbor-day-handoffs"
  },
  {
    "id": "subset-2027-04-16-outings-snacks-entry-props-day-gear",
    "date": "2027-04-16",
    "dayIndex": 336,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "PLAYBILL",
    "rows": [
      {
        "label": "Snacks",
        "words": [
          "PRETZEL",
          "POPCORN",
          "NACHOS"
        ]
      },
      {
        "label": "Entry Props",
        "words": [
          "WRISTBAND",
          "PLAYBILL",
          "STUB"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "PRETZEL",
          "WRISTBAND",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "POPCORN",
          "PLAYBILL",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "NACHOS",
          "STUB",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "PRETZEL",
        "POPCORN",
        "NACHOS"
      ],
      [
        "WRISTBAND",
        "PLAYBILL",
        "STUB"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-04-17-rooms-built-ins-linens-glow",
    "date": "2027-04-17",
    "dayIndex": 337,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "TOWEL",
    "rows": [
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Linens",
        "words": [
          "DISHCLOTH",
          "TOWEL",
          "SHEET"
        ]
      },
      {
        "label": "Glow",
        "words": [
          "PENDANT",
          "SCONCE",
          "NIGHTLIGHT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "PANTRY",
          "DISHCLOTH",
          "PENDANT"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "VANITY",
          "TOWEL",
          "SCONCE"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "CLOSET",
          "SHEET",
          "NIGHTLIGHT"
        ]
      }
    ],
    "grid": [
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "DISHCLOTH",
        "TOWEL",
        "SHEET"
      ],
      [
        "PENDANT",
        "SCONCE",
        "NIGHTLIGHT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-04-18-opened-locked-shared-teamwork-trip-kit-class-kit",
    "date": "2027-04-18",
    "dayIndex": 338,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "LUGGAGE",
    "rows": [
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Trip Kit",
        "words": [
          "GATE",
          "LUGGAGE",
          "RIDE"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "CALENDAR",
          "GATE",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "ACCOUNT",
          "LUGGAGE",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "DOC",
          "RIDE",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "GATE",
        "LUGGAGE",
        "RIDE"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-04-19-workspaces-drafts-furniture-deadlines",
    "date": "2027-04-19",
    "dayIndex": 339,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "DESK",
    "rows": [
      {
        "label": "Drafts",
        "words": [
          "SKETCH",
          "MEMO",
          "ESSAY"
        ]
      },
      {
        "label": "Furniture",
        "words": [
          "EASEL",
          "DESK",
          "CHAIR"
        ]
      },
      {
        "label": "Deadlines",
        "words": [
          "COMMISSION",
          "REPORT",
          "HOMEWORK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "SKETCH",
          "EASEL",
          "COMMISSION"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "MEMO",
          "DESK",
          "REPORT"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "ESSAY",
          "CHAIR",
          "HOMEWORK"
        ]
      }
    ],
    "grid": [
      [
        "SKETCH",
        "MEMO",
        "ESSAY"
      ],
      [
        "EASEL",
        "DESK",
        "CHAIR"
      ],
      [
        "COMMISSION",
        "REPORT",
        "HOMEWORK"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-04-20-travel-stops-arrival-bites-beacons",
    "date": "2027-04-20",
    "dayIndex": 340,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "BUFFET",
    "rows": [
      {
        "label": "Arrival",
        "words": [
          "GATE",
          "LOBBY",
          "SITE"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      },
      {
        "label": "Beacons",
        "words": [
          "BEACON",
          "LAMP",
          "LANTERN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "GATE",
          "PRETZEL",
          "BEACON"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "LOBBY",
          "BUFFET",
          "LAMP"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "SITE",
          "GRANOLA",
          "LANTERN"
        ]
      }
    ],
    "grid": [
      [
        "GATE",
        "LOBBY",
        "SITE"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ],
      [
        "BEACON",
        "LAMP",
        "LANTERN"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  },
  {
    "id": "subset-2027-04-21-music-lesson",
    "date": "2027-04-21",
    "dayIndex": 341,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Music lesson rooms",
    "centerWord": "STICKS",
    "rows": [
      {
        "label": "Lesson Roles",
        "words": [
          "TEACHER",
          "DRUMMER",
          "PARENT"
        ]
      },
      {
        "label": "Lesson Gear",
        "words": [
          "KEYS",
          "STICKS",
          "COAT"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "PRACTICE",
          "TAP",
          "WAIT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Piano Room",
        "words": [
          "TEACHER",
          "KEYS",
          "PRACTICE"
        ]
      },
      {
        "label": "Drum Room",
        "words": [
          "DRUMMER",
          "STICKS",
          "TAP"
        ]
      },
      {
        "label": "Lobby",
        "words": [
          "PARENT",
          "COAT",
          "WAIT"
        ]
      }
    ],
    "grid": [
      [
        "TEACHER",
        "DRUMMER",
        "PARENT"
      ],
      [
        "KEYS",
        "STICKS",
        "COAT"
      ],
      [
        "PRACTICE",
        "TAP",
        "WAIT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-lesson"
  },
  {
    "id": "subset-2027-04-22-holiday-earth-day",
    "date": "2027-04-22",
    "dayIndex": 342,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Earth Day",
    "centerWord": "EARTH",
    "rows": [
      {
        "label": "Earth Day",
        "words": [
          "CLIMATE",
          "PLANET",
          "RECYCLE"
        ]
      },
      {
        "label": "Garden",
        "words": [
          "SOIL",
          "EARTH",
          "COMPOST"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "TIDE",
          "REEF",
          "CLEANUP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Nature",
        "words": [
          "CLIMATE",
          "SOIL",
          "TIDE"
        ]
      },
      {
        "label": "Planet",
        "words": [
          "PLANET",
          "EARTH",
          "REEF"
        ]
      },
      {
        "label": "Care",
        "words": [
          "RECYCLE",
          "COMPOST",
          "CLEANUP"
        ]
      }
    ],
    "grid": [
      [
        "CLIMATE",
        "PLANET",
        "RECYCLE"
      ],
      [
        "SOIL",
        "EARTH",
        "COMPOST"
      ],
      [
        "TIDE",
        "REEF",
        "CLEANUP"
      ]
    ],
    "holiday": {
      "name": "Earth Day",
      "axis": "row",
      "index": 0,
      "label": "Earth Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-earth-day"
  },
  {
    "id": "subset-2027-04-23-food-stops-crew-breakfast-counter-tools",
    "date": "2027-04-23",
    "dayIndex": 343,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places to get something good",
    "centerWord": "OMELET",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "BAKER",
          "SERVER",
          "CASHIER"
        ]
      },
      {
        "label": "Breakfast",
        "words": [
          "MUFFIN",
          "OMELET",
          "BERRIES"
        ]
      },
      {
        "label": "Counter Tools",
        "words": [
          "OVEN",
          "GRIDDLE",
          "SCALE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "BAKER",
          "MUFFIN",
          "OVEN"
        ]
      },
      {
        "label": "Diner",
        "words": [
          "SERVER",
          "OMELET",
          "GRIDDLE"
        ]
      },
      {
        "label": "Market",
        "words": [
          "CASHIER",
          "BERRIES",
          "SCALE"
        ]
      }
    ],
    "grid": [
      [
        "BAKER",
        "SERVER",
        "CASHIER"
      ],
      [
        "MUFFIN",
        "OMELET",
        "BERRIES"
      ],
      [
        "OVEN",
        "GRIDDLE",
        "SCALE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "food-stops"
  },
  {
    "id": "subset-2027-04-24-media-modes-people-audio-cues-following",
    "date": "2027-04-24",
    "dayIndex": 344,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Modern media in three formats",
    "centerWord": "THEME",
    "rows": [
      {
        "label": "Media Roles",
        "words": [
          "HOST",
          "ACTOR",
          "EDITOR"
        ]
      },
      {
        "label": "Audio Cues",
        "words": [
          "MIC",
          "THEME",
          "TONE"
        ]
      },
      {
        "label": "Following",
        "words": [
          "SUBSCRIBE",
          "WATCHLIST",
          "INBOX"
        ]
      }
    ],
    "columns": [
      {
        "label": "Podcast",
        "words": [
          "HOST",
          "MIC",
          "SUBSCRIBE"
        ]
      },
      {
        "label": "Movie",
        "words": [
          "ACTOR",
          "THEME",
          "WATCHLIST"
        ]
      },
      {
        "label": "Newsletter",
        "words": [
          "EDITOR",
          "TONE",
          "INBOX"
        ]
      }
    ],
    "grid": [
      [
        "HOST",
        "ACTOR",
        "EDITOR"
      ],
      [
        "MIC",
        "THEME",
        "TONE"
      ],
      [
        "SUBSCRIBE",
        "WATCHLIST",
        "INBOX"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "media-modes"
  },
  {
    "id": "subset-2027-04-25-nature-center-zones-guides-tools-tasks",
    "date": "2027-04-25",
    "dayIndex": 345,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Nature center work zones",
    "centerWord": "BASKET",
    "rows": [
      {
        "label": "Guides",
        "words": [
          "RANGER",
          "VOLUNTEER",
          "KEEPER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "FIELDGUIDE",
          "BASKET",
          "ENCLOSURE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "IDENTIFY",
          "COLLECT",
          "FEED"
        ]
      }
    ],
    "columns": [
      {
        "label": "Trail Walk",
        "words": [
          "RANGER",
          "FIELDGUIDE",
          "IDENTIFY"
        ]
      },
      {
        "label": "Cleanup",
        "words": [
          "VOLUNTEER",
          "BASKET",
          "COLLECT"
        ]
      },
      {
        "label": "Animal Room",
        "words": [
          "KEEPER",
          "ENCLOSURE",
          "FEED"
        ]
      }
    ],
    "grid": [
      [
        "RANGER",
        "VOLUNTEER",
        "KEEPER"
      ],
      [
        "FIELDGUIDE",
        "BASKET",
        "ENCLOSURE"
      ],
      [
        "IDENTIFY",
        "COLLECT",
        "FEED"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-center-zones"
  },
  {
    "id": "subset-2027-04-26-sports-fields-gear-officials-fans",
    "date": "2027-04-26",
    "dayIndex": 346,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Sports through their objects and rhythms",
    "centerWord": "REFEREE",
    "rows": [
      {
        "label": "Gear",
        "words": [
          "BAT",
          "RACKET",
          "CLEATS"
        ]
      },
      {
        "label": "Officials",
        "words": [
          "UMPIRE",
          "REFEREE",
          "REF"
        ]
      },
      {
        "label": "Fans",
        "words": [
          "CAP",
          "VISOR",
          "SCARF"
        ]
      }
    ],
    "columns": [
      {
        "label": "Baseball",
        "words": [
          "BAT",
          "UMPIRE",
          "CAP"
        ]
      },
      {
        "label": "Tennis",
        "words": [
          "RACKET",
          "REFEREE",
          "VISOR"
        ]
      },
      {
        "label": "Soccer",
        "words": [
          "CLEATS",
          "REF",
          "SCARF"
        ]
      }
    ],
    "grid": [
      [
        "BAT",
        "RACKET",
        "CLEATS"
      ],
      [
        "UMPIRE",
        "REFEREE",
        "REF"
      ],
      [
        "CAP",
        "VISOR",
        "SCARF"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "sports-fields"
  },
  {
    "id": "subset-2027-04-27-music-groups-practice-cues-parts-signals",
    "date": "2027-04-27",
    "dayIndex": 347,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Three ways people make music together",
    "centerWord": "MOVEMENT",
    "rows": [
      {
        "label": "Practice Cues",
        "words": [
          "RIFF",
          "REHEARSAL",
          "WARMUP"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "SOLO",
          "MOVEMENT",
          "VERSE"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "COUNT",
          "BATON",
          "CUE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Band",
        "words": [
          "RIFF",
          "SOLO",
          "COUNT"
        ]
      },
      {
        "label": "Orchestra",
        "words": [
          "REHEARSAL",
          "MOVEMENT",
          "BATON"
        ]
      },
      {
        "label": "Choir",
        "words": [
          "WARMUP",
          "VERSE",
          "CUE"
        ]
      }
    ],
    "grid": [
      [
        "RIFF",
        "REHEARSAL",
        "WARMUP"
      ],
      [
        "SOLO",
        "MOVEMENT",
        "VERSE"
      ],
      [
        "COUNT",
        "BATON",
        "CUE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "music-groups"
  },
  {
    "id": "subset-2027-04-28-city-park-flow",
    "date": "2027-04-28",
    "dayIndex": 348,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "City park flow",
    "centerWord": "PADDLE",
    "rows": [
      {
        "label": "Park Goers",
        "words": [
          "CHILD",
          "BOATER",
          "FAMILY"
        ]
      },
      {
        "label": "Park Gear",
        "words": [
          "SLIDE",
          "PADDLE",
          "CUP"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "CLIMB",
          "ROW",
          "SHARE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Playground",
        "words": [
          "CHILD",
          "SLIDE",
          "CLIMB"
        ]
      },
      {
        "label": "Pond",
        "words": [
          "BOATER",
          "PADDLE",
          "ROW"
        ]
      },
      {
        "label": "Picnic Table",
        "words": [
          "FAMILY",
          "CUP",
          "SHARE"
        ]
      }
    ],
    "grid": [
      [
        "CHILD",
        "BOATER",
        "FAMILY"
      ],
      [
        "SLIDE",
        "PADDLE",
        "CUP"
      ],
      [
        "CLIMB",
        "ROW",
        "SHARE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-park-flow"
  },
  {
    "id": "subset-2027-04-29-nature-zones-movement-colors-treasures",
    "date": "2027-04-29",
    "dayIndex": 349,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Nature by habitat and texture",
    "centerWord": "CORAL",
    "rows": [
      {
        "label": "Movement",
        "words": [
          "RUSTLE",
          "CURRENT",
          "BREEZE"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "MOSS",
          "CORAL",
          "AZURE"
        ]
      },
      {
        "label": "Treasures",
        "words": [
          "ACORN",
          "PEARL",
          "STAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Forest",
        "words": [
          "RUSTLE",
          "MOSS",
          "ACORN"
        ]
      },
      {
        "label": "Ocean",
        "words": [
          "CURRENT",
          "CORAL",
          "PEARL"
        ]
      },
      {
        "label": "Sky",
        "words": [
          "BREEZE",
          "AZURE",
          "STAR"
        ]
      }
    ],
    "grid": [
      [
        "RUSTLE",
        "CURRENT",
        "BREEZE"
      ],
      [
        "MOSS",
        "CORAL",
        "AZURE"
      ],
      [
        "ACORN",
        "PEARL",
        "STAR"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "nature-zones"
  },
  {
    "id": "subset-2027-04-30-city-outings-entry-points-workers-rest-spots",
    "date": "2027-04-30",
    "dayIndex": 350,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A day moving through the city",
    "centerWord": "DOCENT",
    "rows": [
      {
        "label": "Entry Points",
        "words": [
          "FARE",
          "ADMISSION",
          "RESERVATION"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "CONDUCTOR",
          "DOCENT",
          "WAITER"
        ]
      },
      {
        "label": "Rest Spots",
        "words": [
          "SEAT",
          "BENCH",
          "BOOTH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Subway",
        "words": [
          "FARE",
          "CONDUCTOR",
          "SEAT"
        ]
      },
      {
        "label": "Museum",
        "words": [
          "ADMISSION",
          "DOCENT",
          "BENCH"
        ]
      },
      {
        "label": "Restaurant",
        "words": [
          "RESERVATION",
          "WAITER",
          "BOOTH"
        ]
      }
    ],
    "grid": [
      [
        "FARE",
        "ADMISSION",
        "RESERVATION"
      ],
      [
        "CONDUCTOR",
        "DOCENT",
        "WAITER"
      ],
      [
        "SEAT",
        "BENCH",
        "BOOTH"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "city-outings"
  },
  {
    "id": "subset-2027-05-01-art-fair",
    "date": "2027-05-01",
    "dayIndex": 351,
    "difficulty": "hard",
    "editorialLane": "hybrid",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Art fair walk",
    "centerWord": "STATUE",
    "rows": [
      {
        "label": "Hosts",
        "words": [
          "CURATOR",
          "ARTIST",
          "BARISTA"
        ]
      },
      {
        "label": "Pieces",
        "words": [
          "CANVAS",
          "STATUE",
          "PASTRY"
        ]
      },
      {
        "label": "Moves",
        "words": [
          "VIEW",
          "CAST",
          "SIP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gallery Tent",
        "words": [
          "CURATOR",
          "CANVAS",
          "VIEW"
        ]
      },
      {
        "label": "Sculpture Lawn",
        "words": [
          "ARTIST",
          "STATUE",
          "CAST"
        ]
      },
      {
        "label": "Cafe Cart",
        "words": [
          "BARISTA",
          "PASTRY",
          "SIP"
        ]
      }
    ],
    "grid": [
      [
        "CURATOR",
        "ARTIST",
        "BARISTA"
      ],
      [
        "CANVAS",
        "STATUE",
        "PASTRY"
      ],
      [
        "VIEW",
        "CAST",
        "SIP"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "art-fair"
  },
  {
    "id": "subset-2027-05-02-errands-back-shelves-numbers-receipts",
    "date": "2027-05-02",
    "dayIndex": 352,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Small errands with their own rituals",
    "centerWord": "DOSE",
    "rows": [
      {
        "label": "Back Shelves",
        "words": [
          "VAULT",
          "DRAWER",
          "BOX"
        ]
      },
      {
        "label": "Numbers",
        "words": [
          "PIN",
          "DOSE",
          "ZIP"
        ]
      },
      {
        "label": "Receipts",
        "words": [
          "RECEIPT",
          "LABEL",
          "TRACKING"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bank",
        "words": [
          "VAULT",
          "PIN",
          "RECEIPT"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "DRAWER",
          "DOSE",
          "LABEL"
        ]
      },
      {
        "label": "Post Office",
        "words": [
          "BOX",
          "ZIP",
          "TRACKING"
        ]
      }
    ],
    "grid": [
      [
        "VAULT",
        "DRAWER",
        "BOX"
      ],
      [
        "PIN",
        "DOSE",
        "ZIP"
      ],
      [
        "RECEIPT",
        "LABEL",
        "TRACKING"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "errands"
  },
  {
    "id": "subset-2027-05-03-school-life-adults-equipment-back-rooms",
    "date": "2027-05-03",
    "dayIndex": 353,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "A school building after the bell",
    "centerWord": "WHISTLE",
    "rows": [
      {
        "label": "Adults",
        "words": [
          "LIBRARIAN",
          "COACH",
          "SCIENTIST"
        ]
      },
      {
        "label": "Equipment",
        "words": [
          "SHELF",
          "WHISTLE",
          "MICROSCOPE"
        ]
      },
      {
        "label": "Back Rooms",
        "words": [
          "STACK",
          "LOCKER",
          "FREEZER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Library",
        "words": [
          "LIBRARIAN",
          "SHELF",
          "STACK"
        ]
      },
      {
        "label": "Gym",
        "words": [
          "COACH",
          "WHISTLE",
          "LOCKER"
        ]
      },
      {
        "label": "Lab",
        "words": [
          "SCIENTIST",
          "MICROSCOPE",
          "FREEZER"
        ]
      }
    ],
    "grid": [
      [
        "LIBRARIAN",
        "COACH",
        "SCIENTIST"
      ],
      [
        "SHELF",
        "WHISTLE",
        "MICROSCOPE"
      ],
      [
        "STACK",
        "LOCKER",
        "FREEZER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "school-life"
  },
  {
    "id": "subset-2027-05-04-maker-tools-surfaces-outputs-kits",
    "date": "2027-05-04",
    "dayIndex": 354,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Makers and the tools they reach for",
    "centerWord": "FRAME",
    "rows": [
      {
        "label": "Surfaces",
        "words": [
          "COUNTER",
          "BEAM",
          "BACKDROP"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SAUCE",
          "FRAME",
          "PORTRAIT"
        ]
      },
      {
        "label": "Kits",
        "words": [
          "PAN",
          "NAILS",
          "LENS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Chef",
        "words": [
          "COUNTER",
          "SAUCE",
          "PAN"
        ]
      },
      {
        "label": "Builder",
        "words": [
          "BEAM",
          "FRAME",
          "NAILS"
        ]
      },
      {
        "label": "Photo Set",
        "words": [
          "BACKDROP",
          "PORTRAIT",
          "LENS"
        ]
      }
    ],
    "grid": [
      [
        "COUNTER",
        "BEAM",
        "BACKDROP"
      ],
      [
        "SAUCE",
        "FRAME",
        "PORTRAIT"
      ],
      [
        "PAN",
        "NAILS",
        "LENS"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "maker-tools"
  },
  {
    "id": "subset-2027-05-05-holiday-cinco-de-mayo",
    "date": "2027-05-05",
    "dayIndex": 355,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Cinco de Mayo",
    "centerWord": "DRUM",
    "rows": [
      {
        "label": "Cinco de Mayo",
        "words": [
          "PUEBLA",
          "MARIACHI",
          "DANCE"
        ]
      },
      {
        "label": "Parade",
        "words": [
          "PLAZA",
          "DRUM",
          "MARCH"
        ]
      },
      {
        "label": "Festival",
        "words": [
          "MARKET",
          "BAND",
          "WALTZ"
        ]
      }
    ],
    "columns": [
      {
        "label": "Places",
        "words": [
          "PUEBLA",
          "PLAZA",
          "MARKET"
        ]
      },
      {
        "label": "Festival Music",
        "words": [
          "MARIACHI",
          "DRUM",
          "BAND"
        ]
      },
      {
        "label": "Movement",
        "words": [
          "DANCE",
          "MARCH",
          "WALTZ"
        ]
      }
    ],
    "grid": [
      [
        "PUEBLA",
        "MARIACHI",
        "DANCE"
      ],
      [
        "PLAZA",
        "DRUM",
        "MARCH"
      ],
      [
        "MARKET",
        "BAND",
        "WALTZ"
      ]
    ],
    "holiday": {
      "name": "Cinco de Mayo",
      "axis": "row",
      "index": 0,
      "label": "Cinco de Mayo"
    },
    "packRole": "live",
    "themeGroupId": "holiday-cinco-de-mayo"
  },
  {
    "id": "subset-2027-05-06-commute-operators-stops-access",
    "date": "2027-05-06",
    "dayIndex": 356,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Getting across town",
    "centerWord": "SHELTER",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "RIDER",
          "DRIVER",
          "CONDUCTOR"
        ]
      },
      {
        "label": "Stops",
        "words": [
          "RACK",
          "SHELTER",
          "STATION"
        ]
      },
      {
        "label": "Access",
        "words": [
          "LOCK",
          "PASS",
          "TICKET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bike",
        "words": [
          "RIDER",
          "RACK",
          "LOCK"
        ]
      },
      {
        "label": "Bus",
        "words": [
          "DRIVER",
          "SHELTER",
          "PASS"
        ]
      },
      {
        "label": "Train",
        "words": [
          "CONDUCTOR",
          "STATION",
          "TICKET"
        ]
      }
    ],
    "grid": [
      [
        "RIDER",
        "DRIVER",
        "CONDUCTOR"
      ],
      [
        "RACK",
        "SHELTER",
        "STATION"
      ],
      [
        "LOCK",
        "PASS",
        "TICKET"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "commute"
  },
  {
    "id": "subset-2027-05-07-pets-homes-meals-playthings",
    "date": "2027-05-07",
    "dayIndex": 357,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Pets by care, sound, and play",
    "centerWord": "TUNA",
    "rows": [
      {
        "label": "Homes",
        "words": [
          "KENNEL",
          "CONDO",
          "TANK"
        ]
      },
      {
        "label": "Meals",
        "words": [
          "KIBBLE",
          "TUNA",
          "FLAKES"
        ]
      },
      {
        "label": "Playthings",
        "words": [
          "BALL",
          "YARN",
          "CASTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Dog",
        "words": [
          "KENNEL",
          "KIBBLE",
          "BALL"
        ]
      },
      {
        "label": "Cat",
        "words": [
          "CONDO",
          "TUNA",
          "YARN"
        ]
      },
      {
        "label": "Fish",
        "words": [
          "TANK",
          "FLAKES",
          "CASTLE"
        ]
      }
    ],
    "grid": [
      [
        "KENNEL",
        "CONDO",
        "TANK"
      ],
      [
        "KIBBLE",
        "TUNA",
        "FLAKES"
      ],
      [
        "BALL",
        "YARN",
        "CASTLE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "pets"
  },
  {
    "id": "subset-2027-05-08-daily-tech-power-quick-moves-accessories",
    "date": "2027-05-08",
    "dayIndex": 358,
    "difficulty": "hard",
    "editorialLane": "modern",
    "themeTypes": [
      "role-context"
    ],
    "theme": "Personal tech by use and parts",
    "centerWord": "TYPE",
    "rows": [
      {
        "label": "Power",
        "words": [
          "CHARGER",
          "CABLE",
          "BATTERY"
        ]
      },
      {
        "label": "Quick Moves",
        "words": [
          "CALL",
          "TYPE",
          "SNAP"
        ]
      },
      {
        "label": "Accessories",
        "words": [
          "CASE",
          "MOUSE",
          "TRIPOD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Phone",
        "words": [
          "CHARGER",
          "CALL",
          "CASE"
        ]
      },
      {
        "label": "Laptop",
        "words": [
          "CABLE",
          "TYPE",
          "MOUSE"
        ]
      },
      {
        "label": "Camera",
        "words": [
          "BATTERY",
          "SNAP",
          "TRIPOD"
        ]
      }
    ],
    "grid": [
      [
        "CHARGER",
        "CABLE",
        "BATTERY"
      ],
      [
        "CALL",
        "TYPE",
        "SNAP"
      ],
      [
        "CASE",
        "MOUSE",
        "TRIPOD"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "daily-tech"
  },
  {
    "id": "subset-2027-05-09-holiday-mother-s-day",
    "date": "2027-05-09",
    "dayIndex": 359,
    "difficulty": "easy",
    "editorialLane": "hybrid",
    "themeTypes": [
      "calendar"
    ],
    "theme": "Mother's Day",
    "centerWord": "LILIES",
    "rows": [
      {
        "label": "Mother's Day",
        "words": [
          "CARD",
          "ROSES",
          "MOM"
        ]
      },
      {
        "label": "Family Visit",
        "words": [
          "PHOTO",
          "LILIES",
          "AUNT"
        ]
      },
      {
        "label": "Childhood",
        "words": [
          "DRAWING",
          "DAISY",
          "CHILD"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gifts",
        "words": [
          "CARD",
          "PHOTO",
          "DRAWING"
        ]
      },
      {
        "label": "Flowers",
        "words": [
          "ROSES",
          "LILIES",
          "DAISY"
        ]
      },
      {
        "label": "Family",
        "words": [
          "MOM",
          "AUNT",
          "CHILD"
        ]
      }
    ],
    "grid": [
      [
        "CARD",
        "ROSES",
        "MOM"
      ],
      [
        "PHOTO",
        "LILIES",
        "AUNT"
      ],
      [
        "DRAWING",
        "DAISY",
        "CHILD"
      ]
    ],
    "holiday": {
      "name": "Mother's Day",
      "axis": "row",
      "index": 0,
      "label": "Mother's Day"
    },
    "packRole": "live",
    "themeGroupId": "holiday-mother-s-day"
  },
  {
    "id": "subset-2027-05-10-outings-where-to-sit-sound-cues-day-gear",
    "date": "2027-05-10",
    "dayIndex": 360,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Places people go together",
    "centerWord": "APPLAUSE",
    "rows": [
      {
        "label": "Where To Sit",
        "words": [
          "LOUNGER",
          "BALCONY",
          "BLEACHERS"
        ]
      },
      {
        "label": "Sound Cues",
        "words": [
          "WAVES",
          "APPLAUSE",
          "CHEERS"
        ]
      },
      {
        "label": "Day Gear",
        "words": [
          "UMBRELLA",
          "PROP",
          "FOAMFINGER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LOUNGER",
          "WAVES",
          "UMBRELLA"
        ]
      },
      {
        "label": "Playhouse",
        "words": [
          "BALCONY",
          "APPLAUSE",
          "PROP"
        ]
      },
      {
        "label": "Stadium",
        "words": [
          "BLEACHERS",
          "CHEERS",
          "FOAMFINGER"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGER",
        "BALCONY",
        "BLEACHERS"
      ],
      [
        "WAVES",
        "APPLAUSE",
        "CHEERS"
      ],
      [
        "UMBRELLA",
        "PROP",
        "FOAMFINGER"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "outings"
  },
  {
    "id": "subset-2027-05-11-rooms-fixtures-built-ins-morning",
    "date": "2027-05-11",
    "dayIndex": 361,
    "difficulty": "easy",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Rooms and the objects that define them",
    "centerWord": "VANITY",
    "rows": [
      {
        "label": "Fixtures",
        "words": [
          "OVEN",
          "SHOWER",
          "BED"
        ]
      },
      {
        "label": "Built-Ins",
        "words": [
          "PANTRY",
          "VANITY",
          "CLOSET"
        ]
      },
      {
        "label": "Morning",
        "words": [
          "COFFEE",
          "RAZOR",
          "ALARM"
        ]
      }
    ],
    "columns": [
      {
        "label": "Cook Space",
        "words": [
          "OVEN",
          "PANTRY",
          "COFFEE"
        ]
      },
      {
        "label": "Washroom",
        "words": [
          "SHOWER",
          "VANITY",
          "RAZOR"
        ]
      },
      {
        "label": "Bedroom",
        "words": [
          "BED",
          "CLOSET",
          "ALARM"
        ]
      }
    ],
    "grid": [
      [
        "OVEN",
        "SHOWER",
        "BED"
      ],
      [
        "PANTRY",
        "VANITY",
        "CLOSET"
      ],
      [
        "COFFEE",
        "RAZOR",
        "ALARM"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "rooms"
  },
  {
    "id": "subset-2027-05-12-opened-locked-shared-digital-teamwork-class-kit",
    "date": "2027-05-12",
    "dayIndex": 362,
    "difficulty": "medium",
    "editorialLane": "hybrid",
    "themeTypes": [
      "interaction"
    ],
    "theme": "Everyday things by interaction",
    "centerWord": "ACCOUNT",
    "rows": [
      {
        "label": "Digital",
        "words": [
          "FILE",
          "PHONE",
          "LINK"
        ]
      },
      {
        "label": "Teamwork",
        "words": [
          "CALENDAR",
          "ACCOUNT",
          "DOC"
        ]
      },
      {
        "label": "Class Kit",
        "words": [
          "BOOK",
          "LOCKER",
          "PROJECT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Opened",
        "words": [
          "FILE",
          "CALENDAR",
          "BOOK"
        ]
      },
      {
        "label": "Locked",
        "words": [
          "PHONE",
          "ACCOUNT",
          "LOCKER"
        ]
      },
      {
        "label": "Shared",
        "words": [
          "LINK",
          "DOC",
          "PROJECT"
        ]
      }
    ],
    "grid": [
      [
        "FILE",
        "PHONE",
        "LINK"
      ],
      [
        "CALENDAR",
        "ACCOUNT",
        "DOC"
      ],
      [
        "BOOK",
        "LOCKER",
        "PROJECT"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "opened-locked-shared"
  },
  {
    "id": "subset-2027-05-13-workspaces-supplies-displays-feedback",
    "date": "2027-05-13",
    "dayIndex": 363,
    "difficulty": "hard",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Creative and focused work spaces",
    "centerWord": "MONITOR",
    "rows": [
      {
        "label": "Supplies",
        "words": [
          "BRUSH",
          "STAPLER",
          "RULER"
        ]
      },
      {
        "label": "Displays",
        "words": [
          "CANVAS",
          "MONITOR",
          "PROJECTOR"
        ]
      },
      {
        "label": "Feedback",
        "words": [
          "CRITIQUE",
          "REVIEW",
          "GRADE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Studio",
        "words": [
          "BRUSH",
          "CANVAS",
          "CRITIQUE"
        ]
      },
      {
        "label": "Desk",
        "words": [
          "STAPLER",
          "MONITOR",
          "REVIEW"
        ]
      },
      {
        "label": "Classroom",
        "words": [
          "RULER",
          "PROJECTOR",
          "GRADE"
        ]
      }
    ],
    "grid": [
      [
        "BRUSH",
        "STAPLER",
        "RULER"
      ],
      [
        "CANVAS",
        "MONITOR",
        "PROJECTOR"
      ],
      [
        "CRITIQUE",
        "REVIEW",
        "GRADE"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "workspaces"
  },
  {
    "id": "subset-2027-05-14-travel-stops-sleep-comfort-bites",
    "date": "2027-05-14",
    "dayIndex": 364,
    "difficulty": "medium",
    "editorialLane": "concrete",
    "themeTypes": [
      "place-context"
    ],
    "theme": "Travel stops and what they ask of you",
    "centerWord": "ROBE",
    "rows": [
      {
        "label": "Sleep",
        "words": [
          "LOUNGE",
          "SUITE",
          "TENT"
        ]
      },
      {
        "label": "Comfort",
        "words": [
          "PILLOW",
          "ROBE",
          "BLANKET"
        ]
      },
      {
        "label": "Bites",
        "words": [
          "PRETZEL",
          "BUFFET",
          "GRANOLA"
        ]
      }
    ],
    "columns": [
      {
        "label": "Airport",
        "words": [
          "LOUNGE",
          "PILLOW",
          "PRETZEL"
        ]
      },
      {
        "label": "Hotel",
        "words": [
          "SUITE",
          "ROBE",
          "BUFFET"
        ]
      },
      {
        "label": "Camp",
        "words": [
          "TENT",
          "BLANKET",
          "GRANOLA"
        ]
      }
    ],
    "grid": [
      [
        "LOUNGE",
        "SUITE",
        "TENT"
      ],
      [
        "PILLOW",
        "ROBE",
        "BLANKET"
      ],
      [
        "PRETZEL",
        "BUFFET",
        "GRANOLA"
      ]
    ],
    "packRole": "live",
    "themeGroupId": "travel-stops"
  }
] as const satisfies readonly SubsetScheduledPuzzle[];

export const SUBSET_RESERVE_PUZZLES = [
  {
    "id": "subset-reserve-001",
    "packRole": "reserve",
    "reserveId": "reserve-001",
    "difficulty": "easy",
    "editorialLane": "science",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Night-sky viewing places",
    "themeGroupId": "observatory-night",
    "centerWord": "PROJECTOR",
    "rows": [
      {
        "label": "Sky Staff",
        "words": [
          "ASTRONOMER",
          "PRESENTER",
          "OPTICIAN"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "SEXTANT",
          "PROJECTOR",
          "EYEPIECE"
        ]
      },
      {
        "label": "Sights",
        "words": [
          "COMET",
          "DOME",
          "NEBULA"
        ]
      }
    ],
    "columns": [
      {
        "label": "Observatory",
        "words": [
          "ASTRONOMER",
          "SEXTANT",
          "COMET"
        ]
      },
      {
        "label": "Planetarium",
        "words": [
          "PRESENTER",
          "PROJECTOR",
          "DOME"
        ]
      },
      {
        "label": "Telescope",
        "words": [
          "OPTICIAN",
          "EYEPIECE",
          "NEBULA"
        ]
      }
    ],
    "grid": [
      [
        "ASTRONOMER",
        "PRESENTER",
        "OPTICIAN"
      ],
      [
        "SEXTANT",
        "PROJECTOR",
        "EYEPIECE"
      ],
      [
        "COMET",
        "DOME",
        "NEBULA"
      ]
    ]
  },
  {
    "id": "subset-reserve-002",
    "packRole": "reserve",
    "reserveId": "reserve-002",
    "difficulty": "medium",
    "editorialLane": "workshop",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Material studios and what belongs there",
    "themeGroupId": "maker-studios",
    "centerWord": "BLOWPIPE",
    "rows": [
      {
        "label": "Makers",
        "words": [
          "THROWER",
          "BLOWER",
          "JOINER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "KILN",
          "BLOWPIPE",
          "PLANE"
        ]
      },
      {
        "label": "Finishes",
        "words": [
          "GLAZE",
          "ETCH",
          "VARNISH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Pottery",
        "words": [
          "THROWER",
          "KILN",
          "GLAZE"
        ]
      },
      {
        "label": "Glass",
        "words": [
          "BLOWER",
          "BLOWPIPE",
          "ETCH"
        ]
      },
      {
        "label": "Woodshop",
        "words": [
          "JOINER",
          "PLANE",
          "VARNISH"
        ]
      }
    ],
    "grid": [
      [
        "THROWER",
        "BLOWER",
        "JOINER"
      ],
      [
        "KILN",
        "BLOWPIPE",
        "PLANE"
      ],
      [
        "GLAZE",
        "ETCH",
        "VARNISH"
      ]
    ]
  },
  {
    "id": "subset-reserve-003",
    "packRole": "reserve",
    "reserveId": "reserve-003",
    "difficulty": "hard",
    "editorialLane": "food",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Specialty market counters",
    "themeGroupId": "market-counters",
    "centerWord": "PASTRAMI",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "PASTRYCOOK",
          "SLICER",
          "MONGER"
        ]
      },
      {
        "label": "Display",
        "words": [
          "BAGUETTE",
          "PASTRAMI",
          "HALIBUT"
        ]
      },
      {
        "label": "Prep",
        "words": [
          "LAMINATE",
          "BRINE",
          "FILLET"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bakery",
        "words": [
          "PASTRYCOOK",
          "BAGUETTE",
          "LAMINATE"
        ]
      },
      {
        "label": "Deli",
        "words": [
          "SLICER",
          "PASTRAMI",
          "BRINE"
        ]
      },
      {
        "label": "Fishmonger",
        "words": [
          "MONGER",
          "HALIBUT",
          "FILLET"
        ]
      }
    ],
    "grid": [
      [
        "PASTRYCOOK",
        "SLICER",
        "MONGER"
      ],
      [
        "BAGUETTE",
        "PASTRAMI",
        "HALIBUT"
      ],
      [
        "LAMINATE",
        "BRINE",
        "FILLET"
      ]
    ]
  },
  {
    "id": "subset-reserve-004",
    "packRole": "reserve",
    "reserveId": "reserve-004",
    "difficulty": "easy",
    "editorialLane": "wordplay",
    "themeTypes": [
      "phrase",
      "wordplay"
    ],
    "theme": "Words after paper",
    "themeGroupId": "things-after-paper",
    "centerWord": "PACK",
    "rows": [
      {
        "label": "Office",
        "words": [
          "CLIP",
          "CLICK",
          "STAMP"
        ]
      },
      {
        "label": "School",
        "words": [
          "BACK",
          "PACK",
          "FOLDER"
        ]
      },
      {
        "label": "News",
        "words": [
          "TRAIL",
          "TRILL",
          "COLUMN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Paper ___",
        "words": [
          "CLIP",
          "BACK",
          "TRAIL"
        ]
      },
      {
        "label": "Soundalike",
        "words": [
          "CLICK",
          "PACK",
          "TRILL"
        ]
      },
      {
        "label": "Desk Use",
        "words": [
          "STAMP",
          "FOLDER",
          "COLUMN"
        ]
      }
    ],
    "grid": [
      [
        "CLIP",
        "CLICK",
        "STAMP"
      ],
      [
        "BACK",
        "PACK",
        "FOLDER"
      ],
      [
        "TRAIL",
        "TRILL",
        "COLUMN"
      ]
    ]
  },
  {
    "id": "subset-reserve-005",
    "packRole": "reserve",
    "reserveId": "reserve-005",
    "difficulty": "medium",
    "editorialLane": "outdoors",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Player-facing shoreline places",
    "themeGroupId": "shoreline-places",
    "centerWord": "BUOY",
    "rows": [
      {
        "label": "People",
        "words": [
          "LIFEGUARD",
          "HARBORMASTER",
          "KEEPER"
        ]
      },
      {
        "label": "Markers",
        "words": [
          "FLAG",
          "BUOY",
          "BEACON"
        ]
      },
      {
        "label": "Hazards",
        "words": [
          "RIPTIDE",
          "WAKE",
          "FOG"
        ]
      }
    ],
    "columns": [
      {
        "label": "Beach",
        "words": [
          "LIFEGUARD",
          "FLAG",
          "RIPTIDE"
        ]
      },
      {
        "label": "Marina",
        "words": [
          "HARBORMASTER",
          "BUOY",
          "WAKE"
        ]
      },
      {
        "label": "Lighthouse",
        "words": [
          "KEEPER",
          "BEACON",
          "FOG"
        ]
      }
    ],
    "grid": [
      [
        "LIFEGUARD",
        "HARBORMASTER",
        "KEEPER"
      ],
      [
        "FLAG",
        "BUOY",
        "BEACON"
      ],
      [
        "RIPTIDE",
        "WAKE",
        "FOG"
      ]
    ]
  },
  {
    "id": "subset-reserve-006",
    "packRole": "reserve",
    "reserveId": "reserve-006",
    "difficulty": "hard",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around light",
    "themeGroupId": "before-light",
    "centerWord": "HOUSE",
    "rows": [
      {
        "label": "Signals",
        "words": [
          "RED",
          "SPOT",
          "STROBE"
        ]
      },
      {
        "label": "Controls",
        "words": [
          "STOP",
          "HOUSE",
          "BULB"
        ]
      },
      {
        "label": "Colors",
        "words": [
          "GREEN",
          "FOOT",
          "WHITE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Traffic Pair",
        "words": [
          "RED",
          "STOP",
          "GREEN"
        ]
      },
      {
        "label": "Theater Lights",
        "words": [
          "SPOT",
          "HOUSE",
          "FOOT"
        ]
      },
      {
        "label": "Camera Flash",
        "words": [
          "STROBE",
          "BULB",
          "WHITE"
        ]
      }
    ],
    "grid": [
      [
        "RED",
        "SPOT",
        "STROBE"
      ],
      [
        "STOP",
        "HOUSE",
        "BULB"
      ],
      [
        "GREEN",
        "FOOT",
        "WHITE"
      ]
    ]
  },
  {
    "id": "subset-reserve-007",
    "packRole": "reserve",
    "reserveId": "reserve-007",
    "difficulty": "easy",
    "editorialLane": "culture",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Museum jobs, spaces, and artifacts",
    "themeGroupId": "museum-workflow",
    "centerWord": "VAULT",
    "rows": [
      {
        "label": "Museum Staff",
        "words": [
          "DOCENT",
          "ARCHIVIST",
          "RESTORER"
        ]
      },
      {
        "label": "Spaces",
        "words": [
          "ROTUNDA",
          "VAULT",
          "LAB"
        ]
      },
      {
        "label": "Collection Items",
        "words": [
          "PORTRAIT",
          "FOLIO",
          "PIGMENT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gallery",
        "words": [
          "DOCENT",
          "ROTUNDA",
          "PORTRAIT"
        ]
      },
      {
        "label": "Archive",
        "words": [
          "ARCHIVIST",
          "VAULT",
          "FOLIO"
        ]
      },
      {
        "label": "Conservation",
        "words": [
          "RESTORER",
          "LAB",
          "PIGMENT"
        ]
      }
    ],
    "grid": [
      [
        "DOCENT",
        "ARCHIVIST",
        "RESTORER"
      ],
      [
        "ROTUNDA",
        "VAULT",
        "LAB"
      ],
      [
        "PORTRAIT",
        "FOLIO",
        "PIGMENT"
      ]
    ]
  },
  {
    "id": "subset-reserve-008",
    "packRole": "reserve",
    "reserveId": "reserve-008",
    "difficulty": "medium",
    "editorialLane": "outdoors",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Garden zones with distinct care",
    "themeGroupId": "garden-zones",
    "centerWord": "LADDER",
    "rows": [
      {
        "label": "Tenders",
        "words": [
          "PROPAGATOR",
          "PRUNER",
          "BEEKEEPER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "MISTER",
          "LADDER",
          "SMOKER"
        ]
      },
      {
        "label": "Harvests",
        "words": [
          "ORCHID",
          "PEAR",
          "HONEYCOMB"
        ]
      }
    ],
    "columns": [
      {
        "label": "Greenhouse",
        "words": [
          "PROPAGATOR",
          "MISTER",
          "ORCHID"
        ]
      },
      {
        "label": "Orchard",
        "words": [
          "PRUNER",
          "LADDER",
          "PEAR"
        ]
      },
      {
        "label": "Apiary",
        "words": [
          "BEEKEEPER",
          "SMOKER",
          "HONEYCOMB"
        ]
      }
    ],
    "grid": [
      [
        "PROPAGATOR",
        "PRUNER",
        "BEEKEEPER"
      ],
      [
        "MISTER",
        "LADDER",
        "SMOKER"
      ],
      [
        "ORCHID",
        "PEAR",
        "HONEYCOMB"
      ]
    ]
  },
  {
    "id": "subset-reserve-009",
    "packRole": "reserve",
    "reserveId": "reserve-009",
    "difficulty": "hard",
    "editorialLane": "culture",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Theater departments in common language",
    "themeGroupId": "stage-departments",
    "centerWord": "GEL",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "TAILOR",
          "GAFFER",
          "PROPMAN"
        ]
      },
      {
        "label": "Stage Props",
        "words": [
          "WIG",
          "GEL",
          "SWORD"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "HEM",
          "DIM",
          "PLACE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Costume",
        "words": [
          "TAILOR",
          "WIG",
          "HEM"
        ]
      },
      {
        "label": "Lights",
        "words": [
          "GAFFER",
          "GEL",
          "DIM"
        ]
      },
      {
        "label": "Props",
        "words": [
          "PROPMAN",
          "SWORD",
          "PLACE"
        ]
      }
    ],
    "grid": [
      [
        "TAILOR",
        "GAFFER",
        "PROPMAN"
      ],
      [
        "WIG",
        "GEL",
        "SWORD"
      ],
      [
        "HEM",
        "DIM",
        "PLACE"
      ]
    ]
  },
  {
    "id": "subset-reserve-010",
    "packRole": "reserve",
    "reserveId": "reserve-010",
    "difficulty": "easy",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Bank words with nonmoney second lives",
    "themeGroupId": "double-duty-bank",
    "centerWord": "LIBRARIAN",
    "rows": [
      {
        "label": "Deposits",
        "words": [
          "SILT",
          "ARCHIVE",
          "CANS"
        ]
      },
      {
        "label": "Workers",
        "words": [
          "DREDGER",
          "LIBRARIAN",
          "SORTER"
        ]
      },
      {
        "label": "Bank Moves",
        "words": [
          "ERODE",
          "BACKUP",
          "DONATE"
        ]
      }
    ],
    "columns": [
      {
        "label": "River Edge",
        "words": [
          "SILT",
          "DREDGER",
          "ERODE"
        ]
      },
      {
        "label": "Data Archive",
        "words": [
          "ARCHIVE",
          "LIBRARIAN",
          "BACKUP"
        ]
      },
      {
        "label": "Food Pantry",
        "words": [
          "CANS",
          "SORTER",
          "DONATE"
        ]
      }
    ],
    "grid": [
      [
        "SILT",
        "ARCHIVE",
        "CANS"
      ],
      [
        "DREDGER",
        "LIBRARIAN",
        "SORTER"
      ],
      [
        "ERODE",
        "BACKUP",
        "DONATE"
      ]
    ]
  },
  {
    "id": "subset-reserve-011",
    "packRole": "reserve",
    "reserveId": "reserve-011",
    "difficulty": "medium",
    "editorialLane": "outdoors",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Winter maintenance settings",
    "themeGroupId": "winter-maintenance",
    "centerWord": "BOARDS",
    "rows": [
      {
        "label": "Operators",
        "words": [
          "LIFTIE",
          "ZAMBONI",
          "DRIVER"
        ]
      },
      {
        "label": "Surfaces",
        "words": [
          "GONDOLA",
          "BOARDS",
          "ASPHALT"
        ]
      },
      {
        "label": "Trouble",
        "words": [
          "WINDHOLD",
          "RUT",
          "WHITEOUT"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ski Lift",
        "words": [
          "LIFTIE",
          "GONDOLA",
          "WINDHOLD"
        ]
      },
      {
        "label": "Ice Rink",
        "words": [
          "ZAMBONI",
          "BOARDS",
          "RUT"
        ]
      },
      {
        "label": "Snowplow",
        "words": [
          "DRIVER",
          "ASPHALT",
          "WHITEOUT"
        ]
      }
    ],
    "grid": [
      [
        "LIFTIE",
        "ZAMBONI",
        "DRIVER"
      ],
      [
        "GONDOLA",
        "BOARDS",
        "ASPHALT"
      ],
      [
        "WINDHOLD",
        "RUT",
        "WHITEOUT"
      ]
    ]
  },
  {
    "id": "subset-reserve-012",
    "packRole": "reserve",
    "reserveId": "reserve-012",
    "difficulty": "hard",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around moon",
    "themeGroupId": "things-after-moon",
    "centerWord": "SHIFT",
    "rows": [
      {
        "label": "Natural",
        "words": [
          "BEAM",
          "FALL",
          "LARK"
        ]
      },
      {
        "label": "Time",
        "words": [
          "RISE",
          "SHIFT",
          "LINE"
        ]
      },
      {
        "label": "Object",
        "words": [
          "STONE",
          "CAP",
          "HOOK"
        ]
      }
    ],
    "columns": [
      {
        "label": "Moon Pair",
        "words": [
          "BEAM",
          "RISE",
          "STONE"
        ]
      },
      {
        "label": "Night Pair",
        "words": [
          "FALL",
          "SHIFT",
          "CAP"
        ]
      },
      {
        "label": "Sky Pair",
        "words": [
          "LARK",
          "LINE",
          "HOOK"
        ]
      }
    ],
    "grid": [
      [
        "BEAM",
        "FALL",
        "LARK"
      ],
      [
        "RISE",
        "SHIFT",
        "LINE"
      ],
      [
        "STONE",
        "CAP",
        "HOOK"
      ]
    ]
  },
  {
    "id": "subset-reserve-013",
    "packRole": "reserve",
    "reserveId": "reserve-013",
    "difficulty": "easy",
    "editorialLane": "culture",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "How a library moves knowledge around",
    "themeGroupId": "library-systems",
    "centerWord": "BOOKEND",
    "rows": [
      {
        "label": "Library Staff",
        "words": [
          "INDEXER",
          "SHELVER",
          "CLERK"
        ]
      },
      {
        "label": "Shelf Tools",
        "words": [
          "CALLNO",
          "BOOKEND",
          "BARCODE"
        ]
      },
      {
        "label": "Library Tasks",
        "words": [
          "CLASSIFY",
          "RESHELVE",
          "RENEW"
        ]
      }
    ],
    "columns": [
      {
        "label": "Catalog",
        "words": [
          "INDEXER",
          "CALLNO",
          "CLASSIFY"
        ]
      },
      {
        "label": "Stacks",
        "words": [
          "SHELVER",
          "BOOKEND",
          "RESHELVE"
        ]
      },
      {
        "label": "Checkout",
        "words": [
          "CLERK",
          "BARCODE",
          "RENEW"
        ]
      }
    ],
    "grid": [
      [
        "INDEXER",
        "SHELVER",
        "CLERK"
      ],
      [
        "CALLNO",
        "BOOKEND",
        "BARCODE"
      ],
      [
        "CLASSIFY",
        "RESHELVE",
        "RENEW"
      ]
    ]
  },
  {
    "id": "subset-reserve-014",
    "packRole": "reserve",
    "reserveId": "reserve-014",
    "difficulty": "medium",
    "editorialLane": "food",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Restaurant kitchen stations",
    "themeGroupId": "kitchen-stations",
    "centerWord": "SILPAT",
    "rows": [
      {
        "label": "Cooks",
        "words": [
          "GRILLCOOK",
          "BAKER",
          "PREPCOOK"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "PLANCHA",
          "SILPAT",
          "MANDOLINE"
        ]
      },
      {
        "label": "Outputs",
        "words": [
          "SKEWER",
          "TARTLET",
          "TERRINE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Grill",
        "words": [
          "GRILLCOOK",
          "PLANCHA",
          "SKEWER"
        ]
      },
      {
        "label": "Pastry",
        "words": [
          "BAKER",
          "SILPAT",
          "TARTLET"
        ]
      },
      {
        "label": "Pantry",
        "words": [
          "PREPCOOK",
          "MANDOLINE",
          "TERRINE"
        ]
      }
    ],
    "grid": [
      [
        "GRILLCOOK",
        "BAKER",
        "PREPCOOK"
      ],
      [
        "PLANCHA",
        "SILPAT",
        "MANDOLINE"
      ],
      [
        "SKEWER",
        "TARTLET",
        "TERRINE"
      ]
    ]
  },
  {
    "id": "subset-reserve-015",
    "packRole": "reserve",
    "reserveId": "reserve-015",
    "difficulty": "hard",
    "editorialLane": "workshop",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Print-shop pieces and processes",
    "themeGroupId": "print-shop",
    "centerWord": "MESH",
    "rows": [
      {
        "label": "Specialists",
        "words": [
          "COMPOSITOR",
          "SQUEEGEE",
          "BOOKBINDER"
        ]
      },
      {
        "label": "Materials",
        "words": [
          "TYPEBLOCK",
          "MESH",
          "ENDPAPER"
        ]
      },
      {
        "label": "Press Moves",
        "words": [
          "IMPOSE",
          "PULL",
          "STITCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Letterpress",
        "words": [
          "COMPOSITOR",
          "TYPEBLOCK",
          "IMPOSE"
        ]
      },
      {
        "label": "Screenprint",
        "words": [
          "SQUEEGEE",
          "MESH",
          "PULL"
        ]
      },
      {
        "label": "Bindery",
        "words": [
          "BOOKBINDER",
          "ENDPAPER",
          "STITCH"
        ]
      }
    ],
    "grid": [
      [
        "COMPOSITOR",
        "SQUEEGEE",
        "BOOKBINDER"
      ],
      [
        "TYPEBLOCK",
        "MESH",
        "ENDPAPER"
      ],
      [
        "IMPOSE",
        "PULL",
        "STITCH"
      ]
    ]
  },
  {
    "id": "subset-reserve-016",
    "packRole": "reserve",
    "reserveId": "reserve-016",
    "difficulty": "easy",
    "editorialLane": "travel",
    "themeTypes": [
      "place-context",
      "role-context"
    ],
    "theme": "Airport zones and who uses them",
    "themeGroupId": "airport-zones",
    "centerWord": "THRESHOLD",
    "rows": [
      {
        "label": "Personnel",
        "words": [
          "AGENT",
          "MARSHAL",
          "OFFICER"
        ]
      },
      {
        "label": "Markers",
        "words": [
          "JETBRIDGE",
          "THRESHOLD",
          "PASSPORT"
        ]
      },
      {
        "label": "Airport Steps",
        "words": [
          "BOARD",
          "TAXI",
          "DECLARE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Gate",
        "words": [
          "AGENT",
          "JETBRIDGE",
          "BOARD"
        ]
      },
      {
        "label": "Runway",
        "words": [
          "MARSHAL",
          "THRESHOLD",
          "TAXI"
        ]
      },
      {
        "label": "Customs",
        "words": [
          "OFFICER",
          "PASSPORT",
          "DECLARE"
        ]
      }
    ],
    "grid": [
      [
        "AGENT",
        "MARSHAL",
        "OFFICER"
      ],
      [
        "JETBRIDGE",
        "THRESHOLD",
        "PASSPORT"
      ],
      [
        "BOARD",
        "TAXI",
        "DECLARE"
      ]
    ]
  },
  {
    "id": "subset-reserve-017",
    "packRole": "reserve",
    "reserveId": "reserve-017",
    "difficulty": "medium",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around line",
    "themeGroupId": "words-before-line",
    "centerWord": "PICKET",
    "rows": [
      {
        "label": "Race",
        "words": [
          "START",
          "CONGA",
          "SHORE"
        ]
      },
      {
        "label": "Boundary",
        "words": [
          "GOAL",
          "PICKET",
          "STATE"
        ]
      },
      {
        "label": "Queue",
        "words": [
          "WAIT",
          "PHONE",
          "SKY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Finish Line",
        "words": [
          "START",
          "GOAL",
          "WAIT"
        ]
      },
      {
        "label": "Party Line",
        "words": [
          "CONGA",
          "PICKET",
          "PHONE"
        ]
      },
      {
        "label": "Coast Line",
        "words": [
          "SHORE",
          "STATE",
          "SKY"
        ]
      }
    ],
    "grid": [
      [
        "START",
        "CONGA",
        "SHORE"
      ],
      [
        "GOAL",
        "PICKET",
        "STATE"
      ],
      [
        "WAIT",
        "PHONE",
        "SKY"
      ]
    ]
  },
  {
    "id": "subset-reserve-018",
    "packRole": "reserve",
    "reserveId": "reserve-018",
    "difficulty": "hard",
    "editorialLane": "culture",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Newspaper desk roles and artifacts",
    "themeGroupId": "newspaper-desk",
    "centerWord": "CONTACTSHEET",
    "rows": [
      {
        "label": "Roles",
        "words": [
          "COPYEDITOR",
          "PHOTOEDITOR",
          "COLUMNIST"
        ]
      },
      {
        "label": "Materials",
        "words": [
          "STYLEBOOK",
          "CONTACTSHEET",
          "OPED"
        ]
      },
      {
        "label": "Desk Tasks",
        "words": [
          "FACTCHECK",
          "CAPTION",
          "ENDORSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Copy Team",
        "words": [
          "COPYEDITOR",
          "STYLEBOOK",
          "FACTCHECK"
        ]
      },
      {
        "label": "Photo Lab",
        "words": [
          "PHOTOEDITOR",
          "CONTACTSHEET",
          "CAPTION"
        ]
      },
      {
        "label": "Opinion Page",
        "words": [
          "COLUMNIST",
          "OPED",
          "ENDORSE"
        ]
      }
    ],
    "grid": [
      [
        "COPYEDITOR",
        "PHOTOEDITOR",
        "COLUMNIST"
      ],
      [
        "STYLEBOOK",
        "CONTACTSHEET",
        "OPED"
      ],
      [
        "FACTCHECK",
        "CAPTION",
        "ENDORSE"
      ]
    ]
  },
  {
    "id": "subset-reserve-019",
    "packRole": "reserve",
    "reserveId": "reserve-019",
    "difficulty": "easy",
    "editorialLane": "travel",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Rail-yard jobs and hardware",
    "themeGroupId": "rail-yard",
    "centerWord": "COUPLER",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "SIGNALMAN",
          "BRAKEMAN",
          "STEWARD"
        ]
      },
      {
        "label": "Hardware",
        "words": [
          "SEMAPHORE",
          "COUPLER",
          "CART"
        ]
      },
      {
        "label": "Rail Tasks",
        "words": [
          "CLEAR",
          "SHUNT",
          "SERVE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Signal Box",
        "words": [
          "SIGNALMAN",
          "SEMAPHORE",
          "CLEAR"
        ]
      },
      {
        "label": "Switch Yard",
        "words": [
          "BRAKEMAN",
          "COUPLER",
          "SHUNT"
        ]
      },
      {
        "label": "Dining Car",
        "words": [
          "STEWARD",
          "CART",
          "SERVE"
        ]
      }
    ],
    "grid": [
      [
        "SIGNALMAN",
        "BRAKEMAN",
        "STEWARD"
      ],
      [
        "SEMAPHORE",
        "COUPLER",
        "CART"
      ],
      [
        "CLEAR",
        "SHUNT",
        "SERVE"
      ]
    ]
  },
  {
    "id": "subset-reserve-020",
    "packRole": "reserve",
    "reserveId": "reserve-020",
    "difficulty": "medium",
    "editorialLane": "music",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Recording studio stations",
    "themeGroupId": "sound-studio",
    "centerWord": "FADER",
    "rows": [
      {
        "label": "Specialists",
        "words": [
          "SINGER",
          "ENGINEER",
          "WALKER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "POPFILTER",
          "FADER",
          "PROPBOX"
        ]
      },
      {
        "label": "Studio Moves",
        "words": [
          "HARMONIZE",
          "BALANCE",
          "RUSTLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Vocal Booth",
        "words": [
          "SINGER",
          "POPFILTER",
          "HARMONIZE"
        ]
      },
      {
        "label": "Mix Room",
        "words": [
          "ENGINEER",
          "FADER",
          "BALANCE"
        ]
      },
      {
        "label": "Foley Stage",
        "words": [
          "WALKER",
          "PROPBOX",
          "RUSTLE"
        ]
      }
    ],
    "grid": [
      [
        "SINGER",
        "ENGINEER",
        "WALKER"
      ],
      [
        "POPFILTER",
        "FADER",
        "PROPBOX"
      ],
      [
        "HARMONIZE",
        "BALANCE",
        "RUSTLE"
      ]
    ]
  },
  {
    "id": "subset-reserve-021",
    "packRole": "reserve",
    "reserveId": "reserve-021",
    "difficulty": "hard",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around star",
    "themeGroupId": "things-after-star",
    "centerWord": "SUIT",
    "rows": [
      {
        "label": "Star Roles",
        "words": [
          "STRUCK",
          "CADET",
          "MANAGER"
        ]
      },
      {
        "label": "Stage Things",
        "words": [
          "CHART",
          "SUIT",
          "DOOR"
        ]
      },
      {
        "label": "Show Moves",
        "words": [
          "GAZE",
          "WALK",
          "DIVE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Star Pair",
        "words": [
          "STRUCK",
          "CHART",
          "GAZE"
        ]
      },
      {
        "label": "Space Pair",
        "words": [
          "CADET",
          "SUIT",
          "WALK"
        ]
      },
      {
        "label": "Stage Pair",
        "words": [
          "MANAGER",
          "DOOR",
          "DIVE"
        ]
      }
    ],
    "grid": [
      [
        "STRUCK",
        "CADET",
        "MANAGER"
      ],
      [
        "CHART",
        "SUIT",
        "DOOR"
      ],
      [
        "GAZE",
        "WALK",
        "DIVE"
      ]
    ]
  },
  {
    "id": "subset-reserve-022",
    "packRole": "reserve",
    "reserveId": "reserve-022",
    "difficulty": "easy",
    "editorialLane": "everyday",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Clinic pathways without stock filler",
    "themeGroupId": "clinic-pathways",
    "centerWord": "OTOSCOPE",
    "rows": [
      {
        "label": "Care Team",
        "words": [
          "RECEPTIONIST",
          "CLINICIAN",
          "PHARMACIST"
        ]
      },
      {
        "label": "Exam Items",
        "words": [
          "FORM",
          "OTOSCOPE",
          "VIAL"
        ]
      },
      {
        "label": "Visit Steps",
        "words": [
          "TRIAGE",
          "DIAGNOSE",
          "DISPENSE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Intake",
        "words": [
          "RECEPTIONIST",
          "FORM",
          "TRIAGE"
        ]
      },
      {
        "label": "Exam Room",
        "words": [
          "CLINICIAN",
          "OTOSCOPE",
          "DIAGNOSE"
        ]
      },
      {
        "label": "Pharmacy",
        "words": [
          "PHARMACIST",
          "VIAL",
          "DISPENSE"
        ]
      }
    ],
    "grid": [
      [
        "RECEPTIONIST",
        "CLINICIAN",
        "PHARMACIST"
      ],
      [
        "FORM",
        "OTOSCOPE",
        "VIAL"
      ],
      [
        "TRIAGE",
        "DIAGNOSE",
        "DISPENSE"
      ]
    ]
  },
  {
    "id": "subset-reserve-023",
    "packRole": "reserve",
    "reserveId": "reserve-023",
    "difficulty": "medium",
    "editorialLane": "outdoors",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Trail systems by terrain",
    "themeGroupId": "trail-systems",
    "centerWord": "BLAZE",
    "rows": [
      {
        "label": "Guides",
        "words": [
          "RANGER",
          "TRACKER",
          "MOUNTAINEER"
        ]
      },
      {
        "label": "Markers",
        "words": [
          "CAIRN",
          "BLAZE",
          "CORNICE"
        ]
      },
      {
        "label": "Risks",
        "words": [
          "HEAT",
          "ROOTS",
          "AVALANCHE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Desert Route",
        "words": [
          "RANGER",
          "CAIRN",
          "HEAT"
        ]
      },
      {
        "label": "Forest Path",
        "words": [
          "TRACKER",
          "BLAZE",
          "ROOTS"
        ]
      },
      {
        "label": "Alpine Ridge",
        "words": [
          "MOUNTAINEER",
          "CORNICE",
          "AVALANCHE"
        ]
      }
    ],
    "grid": [
      [
        "RANGER",
        "TRACKER",
        "MOUNTAINEER"
      ],
      [
        "CAIRN",
        "BLAZE",
        "CORNICE"
      ],
      [
        "HEAT",
        "ROOTS",
        "AVALANCHE"
      ]
    ]
  },
  {
    "id": "subset-reserve-024",
    "packRole": "reserve",
    "reserveId": "reserve-024",
    "difficulty": "hard",
    "editorialLane": "civic",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Courtroom roles and paper trails",
    "themeGroupId": "courtroom-roles",
    "centerWord": "VERDICT",
    "rows": [
      {
        "label": "Court Roles",
        "words": [
          "JUDGE",
          "FOREPERSON",
          "CLERK"
        ]
      },
      {
        "label": "Documents",
        "words": [
          "ORDER",
          "VERDICT",
          "DOCKET"
        ]
      },
      {
        "label": "Court Moves",
        "words": [
          "SUSTAIN",
          "DELIBERATE",
          "CERTIFY"
        ]
      }
    ],
    "columns": [
      {
        "label": "Bench",
        "words": [
          "JUDGE",
          "ORDER",
          "SUSTAIN"
        ]
      },
      {
        "label": "Jury Box",
        "words": [
          "FOREPERSON",
          "VERDICT",
          "DELIBERATE"
        ]
      },
      {
        "label": "Clerk Desk",
        "words": [
          "CLERK",
          "DOCKET",
          "CERTIFY"
        ]
      }
    ],
    "grid": [
      [
        "JUDGE",
        "FOREPERSON",
        "CLERK"
      ],
      [
        "ORDER",
        "VERDICT",
        "DOCKET"
      ],
      [
        "SUSTAIN",
        "DELIBERATE",
        "CERTIFY"
      ]
    ]
  },
  {
    "id": "subset-reserve-025",
    "packRole": "reserve",
    "reserveId": "reserve-025",
    "difficulty": "easy",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around key",
    "themeGroupId": "words-after-key",
    "centerWord": "STEP",
    "rows": [
      {
        "label": "Key Things",
        "words": [
          "RING",
          "PICK",
          "BENCH"
        ]
      },
      {
        "label": "Key Moves",
        "words": [
          "STONE",
          "STEP",
          "ROLL"
        ]
      },
      {
        "label": "Signals",
        "words": [
          "NOTE",
          "CLICK",
          "TUNER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Key Pair",
        "words": [
          "RING",
          "STONE",
          "NOTE"
        ]
      },
      {
        "label": "Lock Pair",
        "words": [
          "PICK",
          "STEP",
          "CLICK"
        ]
      },
      {
        "label": "Piano Pair",
        "words": [
          "BENCH",
          "ROLL",
          "TUNER"
        ]
      }
    ],
    "grid": [
      [
        "RING",
        "PICK",
        "BENCH"
      ],
      [
        "STONE",
        "STEP",
        "ROLL"
      ],
      [
        "NOTE",
        "CLICK",
        "TUNER"
      ]
    ]
  },
  {
    "id": "subset-reserve-026",
    "packRole": "reserve",
    "reserveId": "reserve-026",
    "difficulty": "medium",
    "editorialLane": "food",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Harvest work by crop",
    "themeGroupId": "harvest-lines",
    "centerWord": "BEATER",
    "rows": [
      {
        "label": "Workers",
        "words": [
          "PICKER",
          "BOGGER",
          "SUGARMAKER"
        ]
      },
      {
        "label": "Tools",
        "words": [
          "SECATEURS",
          "BEATER",
          "TAP"
        ]
      },
      {
        "label": "Products",
        "words": [
          "MUST",
          "RELISH",
          "SYRUP"
        ]
      }
    ],
    "columns": [
      {
        "label": "Vineyard",
        "words": [
          "PICKER",
          "SECATEURS",
          "MUST"
        ]
      },
      {
        "label": "Cranberry Bog",
        "words": [
          "BOGGER",
          "BEATER",
          "RELISH"
        ]
      },
      {
        "label": "Maple Grove",
        "words": [
          "SUGARMAKER",
          "TAP",
          "SYRUP"
        ]
      }
    ],
    "grid": [
      [
        "PICKER",
        "BOGGER",
        "SUGARMAKER"
      ],
      [
        "SECATEURS",
        "BEATER",
        "TAP"
      ],
      [
        "MUST",
        "RELISH",
        "SYRUP"
      ]
    ]
  },
  {
    "id": "subset-reserve-027",
    "packRole": "reserve",
    "reserveId": "reserve-027",
    "difficulty": "hard",
    "editorialLane": "workshop",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Repair counters in common language",
    "themeGroupId": "repair-counters",
    "centerWord": "CHAIN",
    "rows": [
      {
        "label": "Specialists",
        "words": [
          "WATCHMAKER",
          "MECHANIC",
          "COBBLER"
        ]
      },
      {
        "label": "Parts",
        "words": [
          "GEAR",
          "CHAIN",
          "SOLE"
        ]
      },
      {
        "label": "Tasks",
        "words": [
          "WIND",
          "TUNE",
          "RESOLE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Watch Bench",
        "words": [
          "WATCHMAKER",
          "GEAR",
          "WIND"
        ]
      },
      {
        "label": "Bike Shop",
        "words": [
          "MECHANIC",
          "CHAIN",
          "TUNE"
        ]
      },
      {
        "label": "Shoe Counter",
        "words": [
          "COBBLER",
          "SOLE",
          "RESOLE"
        ]
      }
    ],
    "grid": [
      [
        "WATCHMAKER",
        "MECHANIC",
        "COBBLER"
      ],
      [
        "GEAR",
        "CHAIN",
        "SOLE"
      ],
      [
        "WIND",
        "TUNE",
        "RESOLE"
      ]
    ]
  },
  {
    "id": "subset-reserve-028",
    "packRole": "reserve",
    "reserveId": "reserve-028",
    "difficulty": "easy",
    "editorialLane": "science",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Weather-office data and alerts",
    "themeGroupId": "weather-office",
    "centerWord": "SWELL",
    "rows": [
      {
        "label": "Weather Staff",
        "words": [
          "METEOROLOGIST",
          "TECHNICIAN",
          "FORECASTER"
        ]
      },
      {
        "label": "Readings",
        "words": [
          "REFLECTIVITY",
          "SWELL",
          "PRESSURE"
        ]
      },
      {
        "label": "Alerts",
        "words": [
          "ECHO",
          "GALE",
          "WATCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Radar Desk",
        "words": [
          "METEOROLOGIST",
          "REFLECTIVITY",
          "ECHO"
        ]
      },
      {
        "label": "Buoy Station",
        "words": [
          "TECHNICIAN",
          "SWELL",
          "GALE"
        ]
      },
      {
        "label": "Storm Desk",
        "words": [
          "FORECASTER",
          "PRESSURE",
          "WATCH"
        ]
      }
    ],
    "grid": [
      [
        "METEOROLOGIST",
        "TECHNICIAN",
        "FORECASTER"
      ],
      [
        "REFLECTIVITY",
        "SWELL",
        "PRESSURE"
      ],
      [
        "ECHO",
        "GALE",
        "WATCH"
      ]
    ]
  },
  {
    "id": "subset-reserve-029",
    "packRole": "reserve",
    "reserveId": "reserve-029",
    "difficulty": "medium",
    "editorialLane": "culture",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Circus departments without generic spectacle",
    "themeGroupId": "circus-departments",
    "centerWord": "PEDESTAL",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "RIGGER",
          "RINGMASTER",
          "COSTUMER"
        ]
      },
      {
        "label": "Show Pieces",
        "words": [
          "CARABINER",
          "PEDESTAL",
          "SEQUIN"
        ]
      },
      {
        "label": "Ring Tasks",
        "words": [
          "TENSION",
          "INTRODUCE",
          "ALTER"
        ]
      }
    ],
    "columns": [
      {
        "label": "Rigging",
        "words": [
          "RIGGER",
          "CARABINER",
          "TENSION"
        ]
      },
      {
        "label": "Ring",
        "words": [
          "RINGMASTER",
          "PEDESTAL",
          "INTRODUCE"
        ]
      },
      {
        "label": "Wardrobe",
        "words": [
          "COSTUMER",
          "SEQUIN",
          "ALTER"
        ]
      }
    ],
    "grid": [
      [
        "RIGGER",
        "RINGMASTER",
        "COSTUMER"
      ],
      [
        "CARABINER",
        "PEDESTAL",
        "SEQUIN"
      ],
      [
        "TENSION",
        "INTRODUCE",
        "ALTER"
      ]
    ]
  },
  {
    "id": "subset-reserve-030",
    "packRole": "reserve",
    "reserveId": "reserve-030",
    "difficulty": "hard",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around box",
    "themeGroupId": "things-before-box",
    "centerWord": "CAFETERIA",
    "rows": [
      {
        "label": "Containers",
        "words": [
          "DROP",
          "BENTO",
          "PUPPET"
        ]
      },
      {
        "label": "Places",
        "words": [
          "POST",
          "CAFETERIA",
          "THEATER"
        ]
      },
      {
        "label": "Box Moves",
        "words": [
          "CHECK",
          "PACK",
          "SPAR"
        ]
      }
    ],
    "columns": [
      {
        "label": "Mail Pair",
        "words": [
          "DROP",
          "POST",
          "CHECK"
        ]
      },
      {
        "label": "Lunch Pair",
        "words": [
          "BENTO",
          "CAFETERIA",
          "PACK"
        ]
      },
      {
        "label": "Shadow Pair",
        "words": [
          "PUPPET",
          "THEATER",
          "SPAR"
        ]
      }
    ],
    "grid": [
      [
        "DROP",
        "BENTO",
        "PUPPET"
      ],
      [
        "POST",
        "CAFETERIA",
        "THEATER"
      ],
      [
        "CHECK",
        "PACK",
        "SPAR"
      ]
    ]
  },
  {
    "id": "subset-reserve-031",
    "packRole": "reserve",
    "reserveId": "reserve-031",
    "difficulty": "easy",
    "editorialLane": "music",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Festival backstage systems",
    "themeGroupId": "festival-backstage",
    "centerWord": "TILL",
    "rows": [
      {
        "label": "Festival Crew",
        "words": [
          "STAGEHAND",
          "VENDOR",
          "MEDIC"
        ]
      },
      {
        "label": "Supplies",
        "words": [
          "RISER",
          "TILL",
          "BANDAGE"
        ]
      },
      {
        "label": "Moments",
        "words": [
          "LINECHECK",
          "RUSH",
          "ASSESS"
        ]
      }
    ],
    "columns": [
      {
        "label": "Main Stage",
        "words": [
          "STAGEHAND",
          "RISER",
          "LINECHECK"
        ]
      },
      {
        "label": "Vendor Row",
        "words": [
          "VENDOR",
          "TILL",
          "RUSH"
        ]
      },
      {
        "label": "First Aid",
        "words": [
          "MEDIC",
          "BANDAGE",
          "ASSESS"
        ]
      }
    ],
    "grid": [
      [
        "STAGEHAND",
        "VENDOR",
        "MEDIC"
      ],
      [
        "RISER",
        "TILL",
        "BANDAGE"
      ],
      [
        "LINECHECK",
        "RUSH",
        "ASSESS"
      ]
    ]
  },
  {
    "id": "subset-reserve-032",
    "packRole": "reserve",
    "reserveId": "reserve-032",
    "difficulty": "medium",
    "editorialLane": "science",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Aquarium zones and care",
    "themeGroupId": "aquarium-zones",
    "centerWord": "SEADRAGON",
    "rows": [
      {
        "label": "Keepers",
        "words": [
          "AQUARIST",
          "DIVER",
          "EDUCATOR"
        ]
      },
      {
        "label": "Creatures",
        "words": [
          "CLOWNFISH",
          "SEADRAGON",
          "RAY"
        ]
      },
      {
        "label": "Care",
        "words": [
          "SALINITY",
          "FEEDING",
          "SANITIZE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Reef Tank",
        "words": [
          "AQUARIST",
          "CLOWNFISH",
          "SALINITY"
        ]
      },
      {
        "label": "Kelp Forest",
        "words": [
          "DIVER",
          "SEADRAGON",
          "FEEDING"
        ]
      },
      {
        "label": "Touch Pool",
        "words": [
          "EDUCATOR",
          "RAY",
          "SANITIZE"
        ]
      }
    ],
    "grid": [
      [
        "AQUARIST",
        "DIVER",
        "EDUCATOR"
      ],
      [
        "CLOWNFISH",
        "SEADRAGON",
        "RAY"
      ],
      [
        "SALINITY",
        "FEEDING",
        "SANITIZE"
      ]
    ]
  },
  {
    "id": "subset-reserve-033",
    "packRole": "reserve",
    "reserveId": "reserve-033",
    "difficulty": "hard",
    "editorialLane": "wordplay",
    "themeTypes": [
      "wordplay",
      "interaction"
    ],
    "theme": "Phrase pairs around ice",
    "themeGroupId": "words-after-ice",
    "centerWord": "BREW",
    "rows": [
      {
        "label": "Sport",
        "words": [
          "DANCE",
          "PLUNGE",
          "GAMES"
        ]
      },
      {
        "label": "Frozen Treats",
        "words": [
          "CREAM",
          "BREW",
          "SQUASH"
        ]
      },
      {
        "label": "Nature",
        "words": [
          "BERG",
          "FRONT",
          "WREN"
        ]
      }
    ],
    "columns": [
      {
        "label": "Ice Pair",
        "words": [
          "DANCE",
          "CREAM",
          "BERG"
        ]
      },
      {
        "label": "Cold Pair",
        "words": [
          "PLUNGE",
          "BREW",
          "FRONT"
        ]
      },
      {
        "label": "Winter Pair",
        "words": [
          "GAMES",
          "SQUASH",
          "WREN"
        ]
      }
    ],
    "grid": [
      [
        "DANCE",
        "PLUNGE",
        "GAMES"
      ],
      [
        "CREAM",
        "BREW",
        "SQUASH"
      ],
      [
        "BERG",
        "FRONT",
        "WREN"
      ]
    ]
  },
  {
    "id": "subset-reserve-034",
    "packRole": "reserve",
    "reserveId": "reserve-034",
    "difficulty": "easy",
    "editorialLane": "culture",
    "themeTypes": [
      "role-context",
      "interaction"
    ],
    "theme": "Film-set departments and handoffs",
    "themeGroupId": "film-set",
    "centerWord": "GARMENTBAG",
    "rows": [
      {
        "label": "Crew",
        "words": [
          "CAMERAOP",
          "TAILOR",
          "SCRIPTY"
        ]
      },
      {
        "label": "Set Items",
        "words": [
          "SLATE",
          "GARMENTBAG",
          "POLAROID"
        ]
      },
      {
        "label": "Set Moves",
        "words": [
          "RACK",
          "HEM",
          "MATCH"
        ]
      }
    ],
    "columns": [
      {
        "label": "Camera",
        "words": [
          "CAMERAOP",
          "SLATE",
          "RACK"
        ]
      },
      {
        "label": "Wardrobe",
        "words": [
          "TAILOR",
          "GARMENTBAG",
          "HEM"
        ]
      },
      {
        "label": "Continuity",
        "words": [
          "SCRIPTY",
          "POLAROID",
          "MATCH"
        ]
      }
    ],
    "grid": [
      [
        "CAMERAOP",
        "TAILOR",
        "SCRIPTY"
      ],
      [
        "SLATE",
        "GARMENTBAG",
        "POLAROID"
      ],
      [
        "RACK",
        "HEM",
        "MATCH"
      ]
    ]
  },
  {
    "id": "subset-reserve-035",
    "packRole": "reserve",
    "reserveId": "reserve-035",
    "difficulty": "medium",
    "editorialLane": "food",
    "themeTypes": [
      "place-context",
      "interaction"
    ],
    "theme": "Farmers market flow",
    "themeGroupId": "farmers-market-flow",
    "centerWord": "WHEEL",
    "rows": [
      {
        "label": "Vendors",
        "words": [
          "FLORIST",
          "FROMAGER",
          "VOLUNTEER"
        ]
      },
      {
        "label": "Market Goods",
        "words": [
          "BOUQUET",
          "WHEEL",
          "BUCKET"
        ]
      },
      {
        "label": "Market Moves",
        "words": [
          "ARRANGE",
          "CURE",
          "SCRAPE"
        ]
      }
    ],
    "columns": [
      {
        "label": "Flower Stall",
        "words": [
          "FLORIST",
          "BOUQUET",
          "ARRANGE"
        ]
      },
      {
        "label": "Cheese Stall",
        "words": [
          "FROMAGER",
          "WHEEL",
          "CURE"
        ]
      },
      {
        "label": "Compost Booth",
        "words": [
          "VOLUNTEER",
          "BUCKET",
          "SCRAPE"
        ]
      }
    ],
    "grid": [
      [
        "FLORIST",
        "FROMAGER",
        "VOLUNTEER"
      ],
      [
        "BOUQUET",
        "WHEEL",
        "BUCKET"
      ],
      [
        "ARRANGE",
        "CURE",
        "SCRAPE"
      ]
    ]
  }
] as const satisfies readonly SubsetReservePuzzle[];

export const SUBSET_ALL_PACK_PUZZLES = [
  ...SUBSET_LIVE_PUZZLES,
  ...SUBSET_RESERVE_PUZZLES,
] as const;
