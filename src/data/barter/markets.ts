import type { Good, GoodId, GoodSkin } from './types.ts';

export interface BarterMarketTheme {
  id: string;
  name: string;
  emoji: string;
  flavor: string;
  hiddenStall: string;
  skins: Record<GoodId, GoodSkin>;
}

type SkinEntry = [name: string, emoji: string];

function makeSkins(entries: Record<GoodId, SkinEntry>): Record<GoodId, GoodSkin> {
  return {
    spice: { id: 'spice', name: entries.spice[0], emoji: entries.spice[1] },
    wool: { id: 'wool', name: entries.wool[0], emoji: entries.wool[1] },
    tea: { id: 'tea', name: entries.tea[0], emoji: entries.tea[1] },
    salt: { id: 'salt', name: entries.salt[0], emoji: entries.salt[1] },
    timber: { id: 'timber', name: entries.timber[0], emoji: entries.timber[1] },
    silk: { id: 'silk', name: entries.silk[0], emoji: entries.silk[1] },
    porcelain: { id: 'porcelain', name: entries.porcelain[0], emoji: entries.porcelain[1] },
    gold: { id: 'gold', name: entries.gold[0], emoji: entries.gold[1] },
    gems: { id: 'gems', name: entries.gems[0], emoji: entries.gems[1] },
    jade: { id: 'jade', name: entries.jade[0], emoji: entries.jade[1] },
  };
}

function market(
  id: string,
  name: string,
  emoji: string,
  flavor: string,
  hiddenStall: string,
  skins: Record<GoodId, SkinEntry>
): BarterMarketTheme {
  return { id, name, emoji, flavor, hiddenStall, skins: makeSkins(skins) };
}

export const BARTER_MARKETS: BarterMarketTheme[] = [
  market(
    'silk-road',
    'Silk Road Bazaar',
    '🧵',
    'Brocade, tea, and desert salt crowd a lane where every handoff matters.',
    'A curtained night stall is tying off one last cloth bundle.',
    {
      spice: ['Saffron Pinches', '🟧'],
      wool: ['Yak Wool', '🧶'],
      tea: ['Caravan Tea', '🍵'],
      salt: ['Desert Salt', '🧂'],
      timber: ['Cedar Crates', '🪵'],
      silk: ['Brocade Bolts', '🧵'],
      porcelain: ['Painted Cups', '🫖'],
      gold: ['Coin Seals', '🪙'],
      gems: ['Lapis Beads', '💎'],
      jade: ['Jade Charms', '🏺'],
    }
  ),
  market('spice-wharf', 'Spice Wharf', '🌶️', 'Pepper sacks hit wet boards while brass scales swing in the harbor air.', 'A shuttered quay stall is grinding one night-only mix.', {
    spice: ['Pepper Sacks', '🌶️'],
    wool: ['Rope Coils', '🪢'],
    tea: ['Mint Tins', '🍵'],
    salt: ['Sea Salt', '🧂'],
    timber: ['Dock Planks', '🪵'],
    silk: ['Dyed Sashes', '🧣'],
    porcelain: ['Glazed Jars', '🏺'],
    gold: ['Brass Tokens', '🪙'],
    gems: ['Pearl Lots', '🦪'],
    jade: ['Coral Idols', '🪸'],
  }),
  market('golden-caravan', 'Golden Caravan', '🐪', 'Camel bells, shade cloth, and sun coins turn each exchange into a small wager.', 'A locked caravan chest is being opened for nightfall.', {
    spice: ['Date Bundles', '🌴'],
    wool: ['Camel Blankets', '🐪'],
    tea: ['Travel Tea', '🍵'],
    salt: ['Salt Licks', '🧂'],
    timber: ['Tent Poles', '⛺'],
    silk: ['Saddle Cloth', '🧵'],
    porcelain: ['Water Jugs', '🏺'],
    gold: ['Sun Coins', '🪙'],
    gems: ['Amber Drops', '🟠'],
    jade: ['Oasis Relics', '🏺'],
  }),
  market('jade-exchange', 'Jade Exchange', '🏺', 'Quiet counters and green stone weights make every imbalance easy to see.', 'A sealed back-room quote is being set out for night.', {
    spice: ['Ink Cakes', '⚫'],
    wool: ['Felt Wraps', '🧶'],
    tea: ['Green Tea', '🍵'],
    salt: ['Scale Salt', '🧂'],
    timber: ['Display Stands', '🪵'],
    silk: ['Jade Cords', '🧵'],
    porcelain: ['White Cups', '🫖'],
    gold: ['Gold Foil', '🪙'],
    gems: ['Moonstones', '💎'],
    jade: ['Jade Tablets', '🏺'],
  }),
  market('porcelain-court', 'Porcelain Court', '🫖', 'Tea steam, kiln salt, and white cups make this market precise and patient.', 'A screened court table is setting one night contract.', {
    spice: ['Cinnamon Dust', '🟤'],
    wool: ['Tea Towels', '🧺'],
    tea: ['Oolong Cups', '🍵'],
    salt: ['Kiln Salt', '🧂'],
    timber: ['Kiln Wood', '🪵'],
    silk: ['Table Runners', '🧵'],
    porcelain: ['Court Cups', '🫖'],
    gold: ['Gilt Rims', '🪙'],
    gems: ['Glass Beads', '💎'],
    jade: ['Celadon Vases', '🏺'],
  }),
  market('saffron-arcade', 'Saffron Arcade', '🟧', 'Red-gold dust hangs in the arcade, and quick deals rarely stay simple.', 'A side shutter is opening for one late spice offer.', {
    spice: ['Saffron Threads', '🟧'],
    wool: ['Dyed Wool', '🧶'],
    tea: ['Cardamom Tea', '🍵'],
    salt: ['Rose Salt', '🧂'],
    timber: ['Arcade Boxes', '📦'],
    silk: ['Gold Sashes', '🧣'],
    porcelain: ['Spice Bowls', '🥣'],
    gold: ['Lamp Coins', '🪙'],
    gems: ['Topaz Chips', '💎'],
    jade: ['Amber Vessels', '🏺'],
  }),
  market('lantern-market', 'Lantern Market', '🏮', 'Unlit lantern frames point toward the night stalls before dusk arrives.', 'A covered lantern stall is being lit for night.', {
    spice: ['Red Dye', '🔴'],
    wool: ['Wick Twine', '🧶'],
    tea: ['Night Tea', '🍵'],
    salt: ['Lamp Salt', '🧂'],
    timber: ['Bamboo Frames', '🎋'],
    silk: ['Paper Shades', '🏮'],
    porcelain: ['Oil Cups', '🫖'],
    gold: ['Glow Coins', '🪙'],
    gems: ['Star Glass', '💎'],
    jade: ['Moon Charms', '🏺'],
  }),
  market('amber-row', 'Amber Row', '🟠', 'Amber beads, waxed thread, and warm coins reward what stays in hand.', 'A private amber strand is being sorted for night.', {
    spice: ['Honey Resin', '🍯'],
    wool: ['Waxed Thread', '🧵'],
    tea: ['Resin Tea', '🍵'],
    salt: ['Polish Salt', '🧂'],
    timber: ['Bead Trays', '🪵'],
    silk: ['Amber Cord', '🧶'],
    porcelain: ['Candle Cups', '🕯️'],
    gold: ['Warm Coins', '🪙'],
    gems: ['Amber Beads', '🟠'],
    jade: ['Carved Pendants', '🏺'],
  }),
  market('salt-timber', 'Salt & Timber Yard', '🧂', 'Salt blocks and timber stacks move slowly, but the right bundle travels far.', 'One locked yard stack is being opened for night.', {
    spice: ['Pitch Pots', '🛢️'],
    wool: ['Work Ropes', '🪢'],
    tea: ['Camp Tea', '🍵'],
    salt: ['Salt Blocks', '🧂'],
    timber: ['Timber Stacks', '🪵'],
    silk: ['Canvas Rolls', '🧵'],
    porcelain: ['Pitch Jars', '🏺'],
    gold: ['Foreman Tags', '🪙'],
    gems: ['Quartz Chips', '💎'],
    jade: ['Stone Markers', '🪨'],
  }),
  market('copperstone', 'Copperstone Square', '🪙', 'Copper scales ring across the square, weighing speed against balance.', 'A scale behind the arch is being set for night.', {
    spice: ['Verdigris Powder', '🟢'],
    wool: ['Scale Pads', '🧶'],
    tea: ['Mint Tea', '🍵'],
    salt: ['Assay Salt', '🧂'],
    timber: ['Coin Crates', '📦'],
    silk: ['Purse Strings', '🧵'],
    porcelain: ['Scale Bowls', '⚖️'],
    gold: ['Copper Coins', '🪙'],
    gems: ['Agate Stones', '💎'],
    jade: ['Mint Seals', '🏛️'],
  }),
  market('moonlit-souk', 'Moonlit Souk', '🌙', 'Blue awnings hold the shade while the visible night stalls do the talking.', 'A covered moonlit stall waits behind a blue awning.', {
    spice: ['Night Dates', '🌴'],
    wool: ['Awnings Cloth', '⛺'],
    tea: ['Mint Glasses', '🍵'],
    salt: ['Cool Salt', '🧂'],
    timber: ['Tent Stakes', '🪵'],
    silk: ['Blue Veils', '🧵'],
    porcelain: ['Lamp Bowls', '🏮'],
    gold: ['Moon Coins', '🪙'],
    gems: ['Opal Sparks', '💎'],
    jade: ['Blue Vases', '🏺'],
  }),
  market('rivergate', 'Rivergate Trades', '🌊', 'Barges arrive in pairs, and matched cargo moves cleanly through the gate.', 'One hidden river gate is lifting for night.', {
    spice: ['River Herbs', '🌿'],
    wool: ['Tow Ropes', '🪢'],
    tea: ['Barge Tea', '🍵'],
    salt: ['Brine Cakes', '🧂'],
    timber: ['Gate Beams', '🪵'],
    silk: ['Sail Patches', '⛵'],
    porcelain: ['Canal Jugs', '🏺'],
    gold: ['Ferry Tokens', '🪙'],
    gems: ['River Pearls', '🦪'],
    jade: ['Gate Stones', '🪨'],
  }),
  market('crimson-ledger', 'Crimson Ledger', '🟥', 'Red ink marks every overpay, and the page remembers what was spent.', 'A final red-ink line is being balanced for night.', {
    spice: ['Red Ink', '🖋️'],
    wool: ['Binding Cord', '🧵'],
    tea: ['Clerk Tea', '🍵'],
    salt: ['Blotting Salt', '🧂'],
    timber: ['Ledger Boards', '📕'],
    silk: ['Ribbon Marks', '🎀'],
    porcelain: ['Ink Cups', '🏺'],
    gold: ['Stamped Fees', '🪙'],
    gems: ['Seal Stones', '💎'],
    jade: ['Audit Seals', '🏺'],
  }),
  market('starlit-agora', 'Starlit Agora', '✨', 'Open-air tables price tomorrow before the stars come out.', 'One late agora offer is waiting for its signal.', {
    spice: ['Fig Baskets', '🧺'],
    wool: ['Speaker Robes', '🧶'],
    tea: ['Agora Tea', '🍵'],
    salt: ['Marble Salt', '🧂'],
    timber: ['Pillar Wood', '🏛️'],
    silk: ['Star Banners', '✨'],
    porcelain: ['Vote Urns', '🏺'],
    gold: ['Drachmae', '🪙'],
    gems: ['Star Shards', '💎'],
    jade: ['Oracle Tablets', '📜'],
  }),
  market('indigo-harbor', 'Indigo Harbor', '⚓️', 'Blue tarps snap over crates while rare cargo waits for the tide.', 'A dock lamp is swinging over one covered crate.', {
    spice: ['Indigo Dye', '🟦'],
    wool: ['Net Bundles', '🕸️'],
    tea: ['Dock Tea', '🍵'],
    salt: ['Harbor Salt', '🧂'],
    timber: ['Crate Wood', '📦'],
    silk: ['Blue Tarps', '🟦'],
    porcelain: ['Cargo Jars', '🏺'],
    gold: ['Port Chits', '🪙'],
    gems: ['Sea Glass', '💎'],
    jade: ['Anchor Charms', '⚓'],
  }),
  market('windmill', 'Windmill Exchange', '🌬️', 'Canvas sails turn above the stalls, making each fair trade feel windblown.', 'One canvas shutter is rising for the night market.', {
    spice: ['Rye Sacks', '🌾'],
    wool: ['Canvas Ties', '🧶'],
    tea: ['Miller Tea', '🍵'],
    salt: ['Grinding Salt', '🧂'],
    timber: ['Sail Struts', '🪵'],
    silk: ['Canvas Sails', '⛵'],
    porcelain: ['Flour Crocks', '🏺'],
    gold: ['Mill Tokens', '🪙'],
    gems: ['Glass Vanes', '💎'],
    jade: ['Windstones', '🪨'],
  }),
  market('oasis-ledger', 'Oasis Ledger', '🌴', 'Water jars, sun salt, and ledger marks make every promise count.', 'One cool night reserve is being uncorked.', {
    spice: ['Palm Dates', '🌴'],
    wool: ['Water Skins', '💧'],
    tea: ['Oasis Tea', '🍵'],
    salt: ['Sun Salt', '🧂'],
    timber: ['Palm Slats', '🪵'],
    silk: ['Shade Cloth', '⛺'],
    porcelain: ['Water Jars', '🏺'],
    gold: ['Ledger Marks', '🪙'],
    gems: ['Dew Glass', '💎'],
    jade: ['Oasis Seals', '🏺'],
  }),
  market('tea-road', 'Tea Road Arcade', '🍵', 'Tea tins pass from stall to stall; warmth saved early matters late.', 'A hidden night blend is still steeping.', {
    spice: ['Ginger Chips', '🫚'],
    wool: ['Tea Towels', '🧺'],
    tea: ['Tea Tins', '🍵'],
    salt: ['Preserve Salt', '🧂'],
    timber: ['Tea Crates', '📦'],
    silk: ['Steam Cloth', '🧵'],
    porcelain: ['Cup Sets', '🫖'],
    gold: ['Tea Tokens', '🪙'],
    gems: ['Sugar Crystals', '💎'],
    jade: ['Ceremonial Pots', '🏺'],
  }),
  market('mariners', "Mariner's Market", '⚓️', 'Rope, salt, and tide charts crowd the tables; usefulness shifts with the water.', 'One hidden night mooring is being tied off.', {
    spice: ['Ship Biscuits', '🍞'],
    wool: ['Mooring Rope', '🪢'],
    tea: ['Galley Tea', '🍵'],
    salt: ['Sea Salt', '🧂'],
    timber: ['Mast Timber', '🪵'],
    silk: ['Sailcloth', '⛵'],
    porcelain: ['Chart Tubes', '🗺️'],
    gold: ['Harbor Coins', '🪙'],
    gems: ['Compass Glass', '🧭'],
    jade: ['Anchor Relics', '⚓'],
  }),
  market('atlas', 'Atlas Bazaar', '🗺️', 'Maps, pins, and ribbons turn each exchange into a path across the table.', 'One covered map case is being inked for night.', {
    spice: ['Red Pins', '📍'],
    wool: ['Map Canvas', '🧵'],
    tea: ['Survey Tea', '🍵'],
    salt: ['Trail Salt', '🧂'],
    timber: ['Map Cases', '🧭'],
    silk: ['Route Ribbons', '🎀'],
    porcelain: ['Ink Pots', '🏺'],
    gold: ['Compass Coins', '🪙'],
    gems: ['North Stars', '✨'],
    jade: ['Atlas Plates', '🗺️'],
  }),
  market('sunrise-caravan', 'Sunrise Caravan', '🌅', 'Morning gates open wide, but the best packs are aimed at dusk.', 'One hidden bundle is being tied for nightfall.', {
    spice: ['Morning Dates', '🌅'],
    wool: ['Pack Cloth', '🎒'],
    tea: ['Dawn Tea', '🍵'],
    salt: ['Trail Salt', '🧂'],
    timber: ['Pack Frames', '🪵'],
    silk: ['Sun Banners', '🧵'],
    porcelain: ['Camp Jugs', '🏺'],
    gold: ['Dawn Coins', '🪙'],
    gems: ['Sunstone Chips', '💎'],
    jade: ['Caravan Seals', '🏺'],
  }),
];

export function getMarketThemeBySeed(seed: number): BarterMarketTheme {
  return BARTER_MARKETS[Math.abs(seed) % BARTER_MARKETS.length];
}

export function getMarketThemeByName(name: string): BarterMarketTheme | null {
  return BARTER_MARKETS.find((theme) => theme.name === name) ?? null;
}

export function getMarketIdentity(name: string, emoji: string): Pick<BarterMarketTheme, 'flavor' | 'hiddenStall'> {
  return (
    getMarketThemeByName(name) ?? {
      id: 'fallback',
      name,
      emoji,
      flavor: `${emoji} Stalls open with enough information to plan the night.`,
      hiddenStall: 'One night stall is still setting up.',
      skins: BARTER_MARKETS[0].skins,
    }
  );
}

export function skinGoodsForMarket(goods: Good[], market: BarterMarketTheme): Good[] {
  return goods.map((good) => {
    const skin = market.skins[good.id];
    return skin ? { ...good, name: skin.name, emoji: skin.emoji } : good;
  });
}
