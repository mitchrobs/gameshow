import type { BarterPuzzle } from './types.ts';

export const PRECOMPUTED_BARTER_PUZZLES: Record<string, BarterPuzzle> = {
  "2026-04-16": {
  "id": "barter-20260416",
  "dateKey": "2026-04-16",
  "difficulty": "Hard",
  "marketName": "Windmill Exchange",
  "marketEmoji": "🌬️",
  "goods": [
    {
      "id": "spice",
      "name": "Rye Sacks",
      "emoji": "🌾",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Miller Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Grinding Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Canvas Sails",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Flour Crocks",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Windstones",
      "emoji": "🪨",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 3,
    "wool": 0,
    "tea": 19,
    "salt": 1,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "classic",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "bulk_heap",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "recovery"
},
  "2026-04-17": {
  "id": "barter-20260417",
  "dateKey": "2026-04-17",
  "difficulty": "Hard",
  "marketName": "Oasis Ledger",
  "marketEmoji": "🌴",
  "goods": [
    {
      "id": "spice",
      "name": "Palm Dates",
      "emoji": "🌴",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Oasis Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sun Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Shade Cloth",
      "emoji": "⛺",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Oasis Seals",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 8,
    "wool": 0,
    "tea": 9,
    "salt": 1,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "heavy",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "balanced_pair",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-18": {
  "id": "barter-20260418",
  "dateKey": "2026-04-18",
  "difficulty": "Hard",
  "marketName": "Tea Road Arcade",
  "marketEmoji": "🍵",
  "goods": [
    {
      "id": "spice",
      "name": "Ginger Chips",
      "emoji": "🫚",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Tea Tins",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Preserve Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Steam Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cup Sets",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Ceremonial Pots",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 5,
    "wool": 0,
    "tea": 9,
    "salt": 3,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "scarce_bridge",
  "topology": "scarce_bridge",
  "texture": "pivot",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "split_capital",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "alternate"
},
  "2026-04-19": {
  "id": "barter-20260419",
  "dateKey": "2026-04-19",
  "difficulty": "Hard",
  "marketName": "Mariner's Market",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "spice",
      "name": "Ship Biscuits",
      "emoji": "🍞",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Galley Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Mast Timber",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sailcloth",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Chart Tubes",
      "emoji": "🗺️",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Compass Glass",
      "emoji": "🧭",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 0,
    "tea": 10,
    "salt": 0,
    "timber": 6,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "tempo_discount",
  "topology": "tempo_discount",
  "texture": "brisk",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "prepared_piece",
  "economicThesis": "round_trip",
  "hiddenVendorPurpose": "alternate"
},
  "2026-04-20": {
  "id": "barter-20260420",
  "dateKey": "2026-04-20",
  "difficulty": "Hard",
  "marketName": "Atlas Bazaar",
  "marketEmoji": "🗺️",
  "goods": [
    {
      "id": "spice",
      "name": "Red Pins",
      "emoji": "📍",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Map Canvas",
      "emoji": "🧵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Map Cases",
      "emoji": "🧭",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Route Ribbons",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Pots",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Atlas Plates",
      "emoji": "🗺️",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 7,
    "wool": 1,
    "tea": 0,
    "salt": 0,
    "timber": 9,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "scarce_coupon",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-21": {
  "id": "barter-20260421",
  "dateKey": "2026-04-21",
  "difficulty": "Hard",
  "marketName": "Sunrise Caravan",
  "marketEmoji": "🌅",
  "goods": [
    {
      "id": "spice",
      "name": "Morning Dates",
      "emoji": "🌅",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Pack Cloth",
      "emoji": "🎒",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Dawn Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sun Banners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Camp Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Dawn Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 2,
    "wool": 9,
    "tea": 5,
    "salt": 0,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "classic",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "messy_pantry",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-04-22": {
  "id": "barter-20260422",
  "dateKey": "2026-04-22",
  "difficulty": "Hard",
  "marketName": "Silk Road Bazaar",
  "marketEmoji": "🧵",
  "goods": [
    {
      "id": "wool",
      "name": "Yak Wool",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Caravan Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Desert Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Brocade Bolts",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Painted Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Jade Charms",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 3,
    "tea": 19,
    "salt": 1,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 11,
  "maxTrades": 13,
  "earlyWindowTrades": 5,
  "archetype": "split_pipeline",
  "topology": "split_pipeline",
  "texture": "heavy",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "bulk_heap",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-23": {
  "id": "barter-20260423",
  "dateKey": "2026-04-23",
  "difficulty": "Hard",
  "marketName": "Spice Wharf",
  "marketEmoji": "🌶️",
  "goods": [
    {
      "id": "spice",
      "name": "Pepper Sacks",
      "emoji": "🌶️",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Mint Tins",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sea Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Dyed Sashes",
      "emoji": "🧣",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Glazed Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Coral Idols",
      "emoji": "🪸",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 0,
    "tea": 1,
    "salt": 8,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "compression",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "balanced_pair",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "compression"
},
  "2026-04-24": {
  "id": "barter-20260424",
  "dateKey": "2026-04-24",
  "difficulty": "Hard",
  "marketName": "Golden Caravan",
  "marketEmoji": "🐪",
  "goods": [
    {
      "id": "tea",
      "name": "Travel Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Salt Licks",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tent Poles",
      "emoji": "⛺",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Saddle Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Amber Drops",
      "emoji": "🟠",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 0,
    "tea": 1,
    "salt": 9,
    "timber": 7,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "pivot",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "scarce_coupon",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-25": {
  "id": "barter-20260425",
  "dateKey": "2026-04-25",
  "difficulty": "Hard",
  "marketName": "Jade Exchange",
  "marketEmoji": "🏺",
  "goods": [
    {
      "id": "spice",
      "name": "Ink Cakes",
      "emoji": "⚫",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Felt Wraps",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Green Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Jade Cords",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "White Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Gold Foil",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 6,
    "tea": 10,
    "salt": 0,
    "timber": 0,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "classic",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "prepared_piece",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-26": {
  "id": "barter-20260426",
  "dateKey": "2026-04-26",
  "difficulty": "Hard",
  "marketName": "Porcelain Court",
  "marketEmoji": "🫖",
  "goods": [
    {
      "id": "wool",
      "name": "Tea Towels",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Kiln Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Kiln Wood",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Table Runners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Court Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Celadon Vases",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 3,
    "tea": 0,
    "salt": 9,
    "timber": 5,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "trap",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "split_capital",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "alternate"
},
  "2026-04-27": {
  "id": "barter-20260427",
  "dateKey": "2026-04-27",
  "difficulty": "Hard",
  "marketName": "Saffron Arcade",
  "marketEmoji": "🟧",
  "goods": [
    {
      "id": "wool",
      "name": "Dyed Wool",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Rose Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Arcade Boxes",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Gold Sashes",
      "emoji": "🧣",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Spice Bowls",
      "emoji": "🥣",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Lamp Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 2,
    "tea": 0,
    "salt": 5,
    "timber": 9,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "heavy",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "messy_pantry",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-28": {
  "id": "barter-20260428",
  "dateKey": "2026-04-28",
  "difficulty": "Hard",
  "marketName": "Lantern Market",
  "marketEmoji": "🏮",
  "goods": [
    {
      "id": "spice",
      "name": "Red Dye",
      "emoji": "🔴",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Wick Twine",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Bamboo Frames",
      "emoji": "🎋",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Paper Shades",
      "emoji": "🏮",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Oil Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Moon Charms",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 19,
    "tea": 0,
    "salt": 0,
    "timber": 3,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "brisk",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "bulk_heap",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-04-29": {
  "id": "barter-20260429",
  "dateKey": "2026-04-29",
  "difficulty": "Hard",
  "marketName": "Amber Row",
  "marketEmoji": "🟠",
  "goods": [
    {
      "id": "spice",
      "name": "Honey Resin",
      "emoji": "🍯",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Resin Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Bead Trays",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Amber Cord",
      "emoji": "🧶",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Candle Cups",
      "emoji": "🕯️",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Carved Pendants",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 10,
    "wool": 0,
    "tea": 6,
    "salt": 0,
    "timber": 1,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "night_pivot",
  "topology": "night_pivot",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "prepared_piece",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-04-30": {
  "id": "barter-20260430",
  "dateKey": "2026-04-30",
  "difficulty": "Hard",
  "marketName": "Salt & Timber Yard",
  "marketEmoji": "🧂",
  "goods": [
    {
      "id": "spice",
      "name": "Pitch Pots",
      "emoji": "🛢️",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Camp Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Salt Blocks",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Canvas Rolls",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Pitch Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Quartz Chips",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 0,
    "tea": 3,
    "salt": 21,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 8
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "split_pipeline",
  "topology": "split_pipeline",
  "texture": "pivot",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "bulk_heap",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-01": {
  "id": "barter-20260501",
  "dateKey": "2026-05-01",
  "difficulty": "Hard",
  "marketName": "Oasis Ledger",
  "marketEmoji": "🌴",
  "goods": [
    {
      "id": "spice",
      "name": "Palm Dates",
      "emoji": "🌴",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Water Skins",
      "emoji": "💧",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Oasis Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Shade Cloth",
      "emoji": "⛺",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Ledger Marks",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 1,
    "tea": 8,
    "salt": 0,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "split_pipeline",
  "topology": "split_pipeline",
  "texture": "classic",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "balanced_pair",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-02": {
  "id": "barter-20260502",
  "dateKey": "2026-05-02",
  "difficulty": "Hard",
  "marketName": "Tea Road Arcade",
  "marketEmoji": "🍵",
  "goods": [
    {
      "id": "wool",
      "name": "Tea Towels",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Preserve Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tea Crates",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Steam Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cup Sets",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Tea Tokens",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 5,
    "tea": 0,
    "salt": 3,
    "timber": 9,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "classic",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "split_capital",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "compression"
},
  "2026-05-03": {
  "id": "barter-20260503",
  "dateKey": "2026-05-03",
  "difficulty": "Hard",
  "marketName": "Mariner's Market",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "wool",
      "name": "Mooring Rope",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sea Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Mast Timber",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sailcloth",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Chart Tubes",
      "emoji": "🗺️",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Harbor Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 6,
    "tea": 0,
    "salt": 1,
    "timber": 9,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "heavy",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "prepared_piece",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-04": {
  "id": "barter-20260504",
  "dateKey": "2026-05-04",
  "difficulty": "Hard",
  "marketName": "Atlas Bazaar",
  "marketEmoji": "🗺️",
  "goods": [
    {
      "id": "spice",
      "name": "Red Pins",
      "emoji": "📍",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Survey Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Map Cases",
      "emoji": "🧭",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Route Ribbons",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Pots",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Compass Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 7,
    "wool": 0,
    "tea": 9,
    "salt": 0,
    "timber": 1,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "scarce_coupon",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-05": {
  "id": "barter-20260505",
  "dateKey": "2026-05-05",
  "difficulty": "Hard",
  "marketName": "Sunrise Caravan",
  "marketEmoji": "🌅",
  "goods": [
    {
      "id": "wool",
      "name": "Pack Cloth",
      "emoji": "🎒",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Dawn Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Trail Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sun Banners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Camp Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Sunstone Chips",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 5,
    "tea": 2,
    "salt": 9,
    "timber": 0,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "brisk",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "messy_pantry",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-06": {
  "id": "barter-20260506",
  "dateKey": "2026-05-06",
  "difficulty": "Hard",
  "marketName": "Silk Road Bazaar",
  "marketEmoji": "🧵",
  "goods": [
    {
      "id": "spice",
      "name": "Saffron Pinches",
      "emoji": "🟧",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Yak Wool",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Cedar Crates",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Brocade Bolts",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Painted Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Jade Charms",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 21,
    "wool": 3,
    "tea": 0,
    "salt": 0,
    "timber": 1,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "scarce_bridge",
  "topology": "scarce_bridge",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "bulk_heap",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-07": {
  "id": "barter-20260507",
  "dateKey": "2026-05-07",
  "difficulty": "Hard",
  "marketName": "Spice Wharf",
  "marketEmoji": "🌶️",
  "goods": [
    {
      "id": "wool",
      "name": "Rope Coils",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Mint Tins",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sea Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Dyed Sashes",
      "emoji": "🧣",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Glazed Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Pearl Lots",
      "emoji": "🦪",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 8,
    "tea": 1,
    "salt": 9,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "tempo_discount",
  "topology": "tempo_discount",
  "texture": "classic",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "balanced_pair",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-08": {
  "id": "barter-20260508",
  "dateKey": "2026-05-08",
  "difficulty": "Hard",
  "marketName": "Golden Caravan",
  "marketEmoji": "🐪",
  "goods": [
    {
      "id": "spice",
      "name": "Date Bundles",
      "emoji": "🌴",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Salt Licks",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tent Poles",
      "emoji": "⛺",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Saddle Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Amber Drops",
      "emoji": "🟠",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 0,
    "tea": 0,
    "salt": 9,
    "timber": 7,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "night_pivot",
  "topology": "night_pivot",
  "texture": "pivot",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "scarce_coupon",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-09": {
  "id": "barter-20260509",
  "dateKey": "2026-05-09",
  "difficulty": "Hard",
  "marketName": "Jade Exchange",
  "marketEmoji": "🏺",
  "goods": [
    {
      "id": "wool",
      "name": "Felt Wraps",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Scale Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Display Stands",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Jade Cords",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "White Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Jade Tablets",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 10,
    "tea": 0,
    "salt": 6,
    "timber": 1,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "heavy",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "prepared_piece",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-10": {
  "id": "barter-20260510",
  "dateKey": "2026-05-10",
  "difficulty": "Hard",
  "marketName": "Porcelain Court",
  "marketEmoji": "🫖",
  "goods": [
    {
      "id": "spice",
      "name": "Cinnamon Dust",
      "emoji": "🟤",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Oolong Cups",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Kiln Wood",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Table Runners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Court Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Celadon Vases",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 0,
    "tea": 5,
    "salt": 0,
    "timber": 3,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 8
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 6
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 6
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "heavy",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "split_capital",
  "economicThesis": "round_trip",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-11": {
  "id": "barter-20260511",
  "dateKey": "2026-05-11",
  "difficulty": "Hard",
  "marketName": "Saffron Arcade",
  "marketEmoji": "🟧",
  "goods": [
    {
      "id": "spice",
      "name": "Saffron Threads",
      "emoji": "🟧",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Cardamom Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Rose Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Gold Sashes",
      "emoji": "🧣",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Spice Bowls",
      "emoji": "🥣",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Amber Vessels",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 2,
    "wool": 0,
    "tea": 9,
    "salt": 5,
    "timber": 0,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "messy_pantry",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-12": {
  "id": "barter-20260512",
  "dateKey": "2026-05-12",
  "difficulty": "Hard",
  "marketName": "Lantern Market",
  "marketEmoji": "🏮",
  "goods": [
    {
      "id": "wool",
      "name": "Wick Twine",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Night Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Lamp Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Paper Shades",
      "emoji": "🏮",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Oil Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Moon Charms",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 1,
    "tea": 21,
    "salt": 3,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "classic",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "bulk_heap",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-13": {
  "id": "barter-20260513",
  "dateKey": "2026-05-13",
  "difficulty": "Hard",
  "marketName": "Amber Row",
  "marketEmoji": "🟠",
  "goods": [
    {
      "id": "spice",
      "name": "Honey Resin",
      "emoji": "🍯",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Resin Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Polish Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Amber Cord",
      "emoji": "🧶",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Candle Cups",
      "emoji": "🕯️",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Amber Beads",
      "emoji": "🟠",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 10,
    "wool": 0,
    "tea": 6,
    "salt": 1,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 4
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "prepared_piece",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-14": {
  "id": "barter-20260514",
  "dateKey": "2026-05-14",
  "difficulty": "Hard",
  "marketName": "Salt & Timber Yard",
  "marketEmoji": "🧂",
  "goods": [
    {
      "id": "spice",
      "name": "Pitch Pots",
      "emoji": "🛢️",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Work Ropes",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Salt Blocks",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Canvas Rolls",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Pitch Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Stone Markers",
      "emoji": "🪨",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 20,
    "tea": 0,
    "salt": 3,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "classic",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "bulk_heap",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-15": {
  "id": "barter-20260515",
  "dateKey": "2026-05-15",
  "difficulty": "Hard",
  "marketName": "Copperstone Square",
  "marketEmoji": "🪙",
  "goods": [
    {
      "id": "spice",
      "name": "Verdigris Powder",
      "emoji": "🟢",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Scale Pads",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Coin Crates",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Purse Strings",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Scale Bowls",
      "emoji": "⚖️",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Copper Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 8,
    "wool": 9,
    "tea": 0,
    "salt": 0,
    "timber": 1,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "scarce_bridge",
  "topology": "scarce_bridge",
  "texture": "heavy",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "balanced_pair",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-16": {
  "id": "barter-20260516",
  "dateKey": "2026-05-16",
  "difficulty": "Hard",
  "marketName": "Moonlit Souk",
  "marketEmoji": "🌙",
  "goods": [
    {
      "id": "spice",
      "name": "Night Dates",
      "emoji": "🌴",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Mint Glasses",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tent Stakes",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Blue Veils",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Lamp Bowls",
      "emoji": "🏮",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Blue Vases",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 5,
    "wool": 0,
    "tea": 9,
    "salt": 0,
    "timber": 3,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "tempo_discount",
  "topology": "tempo_discount",
  "texture": "pivot",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "split_capital",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-17": {
  "id": "barter-20260517",
  "dateKey": "2026-05-17",
  "difficulty": "Hard",
  "marketName": "Rivergate Trades",
  "marketEmoji": "🌊",
  "goods": [
    {
      "id": "spice",
      "name": "River Herbs",
      "emoji": "🌿",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Tow Ropes",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Brine Cakes",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sail Patches",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Canal Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Gate Stones",
      "emoji": "🪨",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 10,
    "tea": 0,
    "salt": 6,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "night_pivot",
  "topology": "night_pivot",
  "texture": "brisk",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "prepared_piece",
  "economicThesis": "round_trip",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-18": {
  "id": "barter-20260518",
  "dateKey": "2026-05-18",
  "difficulty": "Hard",
  "marketName": "Crimson Ledger",
  "marketEmoji": "🟥",
  "goods": [
    {
      "id": "spice",
      "name": "Red Ink",
      "emoji": "🖋️",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Clerk Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Blotting Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Ribbon Marks",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Cups",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Stamped Fees",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 7,
    "wool": 0,
    "tea": 1,
    "salt": 9,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "scarce_coupon",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-19": {
  "id": "barter-20260519",
  "dateKey": "2026-05-19",
  "difficulty": "Hard",
  "marketName": "Starlit Agora",
  "marketEmoji": "✨",
  "goods": [
    {
      "id": "spice",
      "name": "Fig Baskets",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Agora Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Pillar Wood",
      "emoji": "🏛️",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Star Banners",
      "emoji": "✨",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Vote Urns",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Oracle Tablets",
      "emoji": "📜",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 5,
    "wool": 0,
    "tea": 9,
    "salt": 0,
    "timber": 2,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "split_pipeline",
  "topology": "split_pipeline",
  "texture": "classic",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "messy_pantry",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-20": {
  "id": "barter-20260520",
  "dateKey": "2026-05-20",
  "difficulty": "Hard",
  "marketName": "Indigo Harbor",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "spice",
      "name": "Indigo Dye",
      "emoji": "🟦",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Net Bundles",
      "emoji": "🕸️",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Crate Wood",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Blue Tarps",
      "emoji": "🟦",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cargo Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Port Chits",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 3,
    "wool": 1,
    "tea": 0,
    "salt": 0,
    "timber": 20,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 8
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 5,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "heavy",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "bulk_heap",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-21": {
  "id": "barter-20260521",
  "dateKey": "2026-05-21",
  "difficulty": "Hard",
  "marketName": "Windmill Exchange",
  "marketEmoji": "🌬️",
  "goods": [
    {
      "id": "spice",
      "name": "Rye Sacks",
      "emoji": "🌾",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Canvas Ties",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Miller Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Canvas Sails",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Flour Crocks",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Windstones",
      "emoji": "🪨",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 1,
    "tea": 8,
    "salt": 0,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "compression",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "balanced_pair",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-22": {
  "id": "barter-20260522",
  "dateKey": "2026-05-22",
  "difficulty": "Hard",
  "marketName": "Oasis Ledger",
  "marketEmoji": "🌴",
  "goods": [
    {
      "id": "wool",
      "name": "Water Skins",
      "emoji": "💧",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sun Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Palm Slats",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Shade Cloth",
      "emoji": "⛺",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Ledger Marks",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 7,
    "tea": 0,
    "salt": 9,
    "timber": 1,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "pivot",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "scarce_coupon",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-23": {
  "id": "barter-20260523",
  "dateKey": "2026-05-23",
  "difficulty": "Hard",
  "marketName": "Tea Road Arcade",
  "marketEmoji": "🍵",
  "goods": [
    {
      "id": "tea",
      "name": "Tea Tins",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Preserve Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tea Crates",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Steam Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cup Sets",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Tea Tokens",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 0,
    "tea": 1,
    "salt": 6,
    "timber": 10,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "classic",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "prepared_piece",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-24": {
  "id": "barter-20260524",
  "dateKey": "2026-05-24",
  "difficulty": "Hard",
  "marketName": "Mariner's Market",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "tea",
      "name": "Galley Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sea Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Mast Timber",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sailcloth",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Chart Tubes",
      "emoji": "🗺️",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Anchor Relics",
      "emoji": "⚓",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 0,
    "tea": 9,
    "salt": 3,
    "timber": 5,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "scarce_bridge",
  "topology": "scarce_bridge",
  "texture": "trap",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "split_capital",
  "economicThesis": "round_trip",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-25": {
  "id": "barter-20260525",
  "dateKey": "2026-05-25",
  "difficulty": "Hard",
  "marketName": "Atlas Bazaar",
  "marketEmoji": "🗺️",
  "goods": [
    {
      "id": "spice",
      "name": "Red Pins",
      "emoji": "📍",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Map Canvas",
      "emoji": "🧵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Trail Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Route Ribbons",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Pots",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Atlas Plates",
      "emoji": "🗺️",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 5,
    "tea": 0,
    "salt": 2,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "heavy",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "messy_pantry",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-26": {
  "id": "barter-20260526",
  "dateKey": "2026-05-26",
  "difficulty": "Hard",
  "marketName": "Sunrise Caravan",
  "marketEmoji": "🌅",
  "goods": [
    {
      "id": "spice",
      "name": "Morning Dates",
      "emoji": "🌅",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Pack Cloth",
      "emoji": "🎒",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Dawn Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sun Banners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Camp Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Dawn Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 3,
    "wool": 20,
    "tea": 1,
    "salt": 0,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "brisk",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "bulk_heap",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-05-27": {
  "id": "barter-20260527",
  "dateKey": "2026-05-27",
  "difficulty": "Hard",
  "marketName": "Silk Road Bazaar",
  "marketEmoji": "🧵",
  "goods": [
    {
      "id": "spice",
      "name": "Saffron Pinches",
      "emoji": "🟧",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Yak Wool",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Caravan Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Brocade Bolts",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Painted Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Coin Seals",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 6,
    "wool": 10,
    "tea": 1,
    "salt": 0,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "prepared_piece",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-28": {
  "id": "barter-20260528",
  "dateKey": "2026-05-28",
  "difficulty": "Hard",
  "marketName": "Spice Wharf",
  "marketEmoji": "🌶️",
  "goods": [
    {
      "id": "spice",
      "name": "Pepper Sacks",
      "emoji": "🌶️",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Rope Coils",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Sea Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Dyed Sashes",
      "emoji": "🧣",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Glazed Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Brass Tokens",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 19,
    "wool": 3,
    "tea": 0,
    "salt": 1,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 8
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "split_pipeline",
  "topology": "split_pipeline",
  "texture": "pivot",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "bulk_heap",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "alternate"
},
  "2026-05-29": {
  "id": "barter-20260529",
  "dateKey": "2026-05-29",
  "difficulty": "Hard",
  "marketName": "Golden Caravan",
  "marketEmoji": "🐪",
  "goods": [
    {
      "id": "tea",
      "name": "Travel Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Salt Licks",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tent Poles",
      "emoji": "⛺",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Saddle Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Amber Drops",
      "emoji": "🟠",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 0,
    "tea": 9,
    "salt": 1,
    "timber": 8,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "classic",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "balanced_pair",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "compression"
},
  "2026-05-30": {
  "id": "barter-20260530",
  "dateKey": "2026-05-30",
  "difficulty": "Hard",
  "marketName": "Jade Exchange",
  "marketEmoji": "🏺",
  "goods": [
    {
      "id": "tea",
      "name": "Green Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Scale Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Display Stands",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Jade Cords",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "White Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Jade Tablets",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 0,
    "tea": 9,
    "salt": 3,
    "timber": 5,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "salt",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "salt",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "classic",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "split_capital",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-05-31": {
  "id": "barter-20260531",
  "dateKey": "2026-05-31",
  "difficulty": "Hard",
  "marketName": "Porcelain Court",
  "marketEmoji": "🫖",
  "goods": [
    {
      "id": "spice",
      "name": "Cinnamon Dust",
      "emoji": "🟤",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Tea Towels",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Oolong Cups",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Table Runners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Court Cups",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Gilt Rims",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 6,
    "wool": 9,
    "tea": 1,
    "salt": 0,
    "timber": 0,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        },
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "heavy",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "prepared_piece",
  "economicThesis": "round_trip",
  "hiddenVendorPurpose": "alternate"
},
  "2026-06-01": {
  "id": "barter-20260601",
  "dateKey": "2026-06-01",
  "difficulty": "Hard",
  "marketName": "Rivergate Trades",
  "marketEmoji": "🌊",
  "goods": [
    {
      "id": "spice",
      "name": "River Herbs",
      "emoji": "🌿",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Tow Ropes",
      "emoji": "🪢",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Barge Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sail Patches",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Canal Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Gate Stones",
      "emoji": "🪨",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 9,
    "tea": 7,
    "salt": 0,
    "timber": 0,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "scarce_coupon",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-06-02": {
  "id": "barter-20260602",
  "dateKey": "2026-06-02",
  "difficulty": "Hard",
  "marketName": "Crimson Ledger",
  "marketEmoji": "🟥",
  "goods": [
    {
      "id": "spice",
      "name": "Red Ink",
      "emoji": "🖋️",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Binding Cord",
      "emoji": "🧵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Ledger Boards",
      "emoji": "📕",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Ribbon Marks",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Cups",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Seal Stones",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 5,
    "wool": 2,
    "tea": 0,
    "salt": 0,
    "timber": 9,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "scarce_bridge",
  "topology": "scarce_bridge",
  "texture": "brisk",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "messy_pantry",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-06-03": {
  "id": "barter-20260603",
  "dateKey": "2026-06-03",
  "difficulty": "Hard",
  "marketName": "Starlit Agora",
  "marketEmoji": "✨",
  "goods": [
    {
      "id": "spice",
      "name": "Fig Baskets",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "wool",
      "name": "Speaker Robes",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Pillar Wood",
      "emoji": "🏛️",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Star Banners",
      "emoji": "✨",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Vote Urns",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Star Shards",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 3,
    "wool": 1,
    "tea": 0,
    "salt": 0,
    "timber": 19,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "tempo_discount",
  "topology": "tempo_discount",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "bulk_heap",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-06-04": {
  "id": "barter-20260604",
  "dateKey": "2026-06-04",
  "difficulty": "Hard",
  "marketName": "Indigo Harbor",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "spice",
      "name": "Indigo Dye",
      "emoji": "🟦",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Dock Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Crate Wood",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Blue Tarps",
      "emoji": "🟦",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cargo Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Port Chits",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 8,
    "wool": 0,
    "tea": 1,
    "salt": 0,
    "timber": 9,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 6
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 8
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "night_pivot",
  "topology": "night_pivot",
  "texture": "classic",
  "thesis": "Carry a matched pair into night; the visible bundle is the shortcut.",
  "feltThesis": "carry_the_pair",
  "startEconomy": "balanced_pair",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "alternate"
},
  "2026-06-05": {
  "id": "barter-20260605",
  "dateKey": "2026-06-05",
  "difficulty": "Hard",
  "marketName": "Windmill Exchange",
  "marketEmoji": "🌬️",
  "goods": [
    {
      "id": "wool",
      "name": "Canvas Ties",
      "emoji": "🧶",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Miller Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Sail Struts",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Canvas Sails",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Flour Crocks",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Glass Vanes",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 7,
    "tea": 9,
    "salt": 0,
    "timber": 1,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 7
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 5
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 10,
      "role": "engine_payoff",
      "line": "engine",
      "variant": true,
      "vendorRole": "reserve_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "pivot",
  "thesis": "You start rich but awkward. Turn the heap into useful pieces before night.",
  "feltThesis": "spend_the_heap",
  "startEconomy": "scarce_coupon",
  "economicThesis": "stay_flexible",
  "hiddenVendorPurpose": "compression"
},
  "2026-06-06": {
  "id": "barter-20260606",
  "dateKey": "2026-06-06",
  "difficulty": "Hard",
  "marketName": "Oasis Ledger",
  "marketEmoji": "🌴",
  "goods": [
    {
      "id": "wool",
      "name": "Water Skins",
      "emoji": "💧",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Oasis Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Palm Slats",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Shade Cloth",
      "emoji": "⛺",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Water Jars",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "gems",
      "name": "Dew Glass",
      "emoji": "💎",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 6,
    "tea": 10,
    "salt": 0,
    "timber": 1,
    "silk": 0,
    "porcelain": 1,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gems",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 4
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "gems",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "delayed_multiplier",
  "topology": "delayed_multiplier",
  "texture": "heavy",
  "thesis": "Save the flexible good; it has two jobs tonight.",
  "feltThesis": "protect_key_good",
  "startEconomy": "prepared_piece",
  "economicThesis": "save_one_good",
  "hiddenVendorPurpose": "compression"
},
  "2026-06-07": {
  "id": "barter-20260607",
  "dateKey": "2026-06-07",
  "difficulty": "Hard",
  "marketName": "Tea Road Arcade",
  "marketEmoji": "🍵",
  "goods": [
    {
      "id": "wool",
      "name": "Tea Towels",
      "emoji": "🧺",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Tea Tins",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Tea Crates",
      "emoji": "📦",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Steam Cloth",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Cup Sets",
      "emoji": "🫖",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Ceremonial Pots",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 0,
    "wool": 9,
    "tea": 5,
    "salt": 0,
    "timber": 3,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 8
  },
  "trades": [
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 6
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 4
        },
        {
          "good": "timber",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "wool",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 4,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 6
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "engine_payoff",
      "line": "shared",
      "variant": true,
      "vendorRole": "loop_finisher"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 5,
  "archetype": "compression_route",
  "topology": "compression_route",
  "texture": "heavy",
  "thesis": "The odd-looking day trade is useful because it opens the night route.",
  "feltThesis": "use_the_ugly_trade",
  "startEconomy": "split_capital",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "alternate"
},
  "2026-06-08": {
  "id": "barter-20260608",
  "dateKey": "2026-06-08",
  "difficulty": "Hard",
  "marketName": "Mariner's Market",
  "marketEmoji": "⚓️",
  "goods": [
    {
      "id": "spice",
      "name": "Ship Biscuits",
      "emoji": "🍞",
      "tier": "common"
    },
    {
      "id": "tea",
      "name": "Galley Tea",
      "emoji": "🍵",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Mast Timber",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sailcloth",
      "emoji": "⛵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Chart Tubes",
      "emoji": "🗺️",
      "tier": "uncommon"
    },
    {
      "id": "gold",
      "name": "Harbor Coins",
      "emoji": "🪙",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 9,
    "wool": 0,
    "tea": 2,
    "salt": 0,
    "timber": 5,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "gold",
    "qty": 4
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        },
        {
          "good": "tea",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "tea",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "gold",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 8,
  "maxTrades": 10,
  "earlyWindowTrades": 4,
  "archetype": "overproduction_trap",
  "topology": "overproduction_trap",
  "texture": "trap",
  "thesis": "More is not always better. Stop once the bundle has enough.",
  "feltThesis": "stop_early",
  "startEconomy": "messy_pantry",
  "economicThesis": "enough_not_more",
  "hiddenVendorPurpose": "safety_valve"
},
  "2026-06-09": {
  "id": "barter-20260609",
  "dateKey": "2026-06-09",
  "difficulty": "Hard",
  "marketName": "Atlas Bazaar",
  "marketEmoji": "🗺️",
  "goods": [
    {
      "id": "spice",
      "name": "Red Pins",
      "emoji": "📍",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Trail Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Map Cases",
      "emoji": "🧭",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Route Ribbons",
      "emoji": "🎀",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Ink Pots",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Atlas Plates",
      "emoji": "🗺️",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 0,
    "tea": 0,
    "salt": 3,
    "timber": 19,
    "silk": 0,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 7
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 2
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "tempo",
      "line": "tempo",
      "variant": false
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 3
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 5
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 3
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 9,
  "maxTrades": 11,
  "earlyWindowTrades": 4,
  "archetype": "balanced_pair",
  "topology": "balanced_pair",
  "texture": "classic",
  "thesis": "The visible Night Market already tells you what to prepare.",
  "feltThesis": "night_told_you",
  "startEconomy": "bulk_heap",
  "economicThesis": "prepare_the_bundle",
  "hiddenVendorPurpose": "recovery"
},
  "2026-06-10": {
  "id": "barter-20260610",
  "dateKey": "2026-06-10",
  "difficulty": "Hard",
  "marketName": "Sunrise Caravan",
  "marketEmoji": "🌅",
  "goods": [
    {
      "id": "spice",
      "name": "Morning Dates",
      "emoji": "🌅",
      "tier": "common"
    },
    {
      "id": "salt",
      "name": "Trail Salt",
      "emoji": "🧂",
      "tier": "common"
    },
    {
      "id": "timber",
      "name": "Pack Frames",
      "emoji": "🪵",
      "tier": "common"
    },
    {
      "id": "silk",
      "name": "Sun Banners",
      "emoji": "🧵",
      "tier": "uncommon"
    },
    {
      "id": "porcelain",
      "name": "Camp Jugs",
      "emoji": "🏺",
      "tier": "uncommon"
    },
    {
      "id": "jade",
      "name": "Caravan Seals",
      "emoji": "🏺",
      "tier": "rare"
    }
  ],
  "inventory": {
    "spice": 1,
    "wool": 0,
    "tea": 0,
    "salt": 6,
    "timber": 10,
    "silk": 1,
    "porcelain": 0,
    "gold": 0,
    "gems": 0,
    "jade": 0
  },
  "goal": {
    "good": "jade",
    "qty": 5
  },
  "trades": [
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 7,
      "role": "tempo_bailout",
      "line": "tempo",
      "hiddenUntilNight": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 11,
      "role": "variant",
      "line": "shared",
      "variant": true,
      "vendorRole": "recycler"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 3,
      "role": "variant",
      "line": "tempo",
      "variant": true
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "solution": [
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "timber",
          "qty": 4
        }
      ],
      "receive": [
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "window": "early",
      "stage": 5,
      "role": "variant",
      "line": "shared",
      "variant": true
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "timber",
          "qty": 3
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 1,
      "role": "engine_setup",
      "line": "engine"
    },
    {
      "give": [
        {
          "good": "salt",
          "qty": 6
        }
      ],
      "receive": [
        {
          "good": "spice",
          "qty": 1
        }
      ],
      "window": "early",
      "stage": 2,
      "role": "tempo",
      "line": "tempo"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "porcelain",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "silk",
          "qty": 3
        }
      ],
      "window": "late",
      "stage": 6,
      "role": "engine_payoff",
      "line": "engine",
      "vendorRole": "bridge_vendor"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "spice",
          "qty": 1
        },
        {
          "good": "silk",
          "qty": 1
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 1
        }
      ],
      "window": "late",
      "stage": 8,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    },
    {
      "give": [
        {
          "good": "silk",
          "qty": 4
        },
        {
          "good": "porcelain",
          "qty": 2
        }
      ],
      "receive": [
        {
          "good": "jade",
          "qty": 2
        }
      ],
      "window": "late",
      "stage": 9,
      "role": "compound_gate",
      "line": "shared",
      "vendorRole": "bundle_payoff"
    }
  ],
  "par": 10,
  "maxTrades": 12,
  "earlyWindowTrades": 4,
  "archetype": "catalyst_debt",
  "topology": "catalyst_debt",
  "texture": "compression",
  "thesis": "The hidden stall is a recovery tool. The clean plan is visible now.",
  "feltThesis": "hidden_is_mercy",
  "startEconomy": "prepared_piece",
  "economicThesis": "rebuild_the_catalyst",
  "hiddenVendorPurpose": "safety_valve"
},
};

export type PrecomputedBarterDateKey = keyof typeof PRECOMPUTED_BARTER_PUZZLES;
