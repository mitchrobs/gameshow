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
    'Bright bolts hang over narrow lanes while brokers trade in whispers and hand signs.',
    'A curtained silk broker is tying up one last night offer.',
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
  market('spice-wharf', 'Spice Wharf', '🌶️', 'Dockhands unload red sacks before sunrise; every stall smells expensive by noon.', 'A quay cook is grinding a night-only offer behind the shutters.', {
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
  market('golden-caravan', 'Golden Caravan', '🐪', 'Caravan bells mark the rhythm here, and every trader watches what leaves the shade.', 'A caravan guard is unpacking a locked chest for nightfall.', {
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
  market('jade-exchange', 'Jade Exchange', '🏺', 'Polished counters, quiet offers, and one wrong imbalance can echo through the room.', 'A back-room appraiser is preparing one sealed night quote.', {
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
  market('porcelain-court', 'Porcelain Court', '🫖', 'Tea steam curls over porcelain shelves while patient vendors wait for perfect pairs.', 'A court steward is polishing a night contract behind the screen.', {
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
  market('saffron-arcade', 'Saffron Arcade', '🟧', 'Lanterns catch on saffron dust, and fast deals can cost more than they seem.', 'A spice painter is opening a side shutter for nightfall.', {
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
  market('lantern-market', 'Lantern Market', '🏮', 'Paper lanterns mark the night stalls early, giving careful planners a route to read.', 'A paper-lantern vendor is lighting one covered stall.', {
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
  market('amber-row', 'Amber Row', '🟠', 'Amber beads click across tables as merchants test whether you saved the right pieces.', 'A bead cutter is sorting a private strand for the night row.', {
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
  market('salt-timber', 'Salt & Timber Yard', '🧂', 'Salt blocks and timber stacks move slowly here, but the right bundle travels far.', 'A yard foreman is unlocking one night stack.', {
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
  market('copperstone', 'Copperstone Square', '🪙', 'Copper scales ring all morning; the square rewards balance more than speed.', 'A copper minter is setting one scale behind the arch.', {
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
  market('moonlit-souk', 'Moonlit Souk', '🌙', 'Moonlit awnings hide one late stall, so the visible contracts matter even more.', 'A moonlit stall is still hidden behind a blue awning.', {
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
  market('rivergate', 'Rivergate Trades', '🌊', 'River barges arrive in pairs, and the best traders keep their cargo matched.', 'A lock keeper is raising one hidden night gate.', {
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
  market('crimson-ledger', 'Crimson Ledger', '🟥', 'Every offer is marked in red ink; overpay once and the ledger remembers.', 'A red-ink auditor is balancing one hidden night line.', {
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
  market('starlit-agora', 'Starlit Agora', '✨', 'Under open sky, vendors price the future before the night market fully wakes.', 'An agora speaker is waiting to announce one night offer.', {
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
  market('indigo-harbor', 'Indigo Harbor', '⚓️', 'Indigo tarps snap in the harbor wind while rare goods wait behind clean timing.', 'A dock lamp is swinging over one hidden night crate.', {
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
  market('windmill', 'Windmill Exchange', '🌬️', 'Canvas sails turn over the stalls, and every gust seems to change what a fair trade means.', 'A miller is raising one canvas shutter for the night market.', {
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
  market('oasis-ledger', 'Oasis Ledger', '🌴', 'Water sellers and caravan clerks count every promise before the night lamps are lit.', 'A water clerk is uncorking one night reserve.', {
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
  market('tea-road', 'Tea Road Arcade', '🍵', 'Tea tins pass from stall to stall; the clever route keeps enough warmth for later.', 'A tea master is steeping one hidden night blend.', {
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
  market('mariners', "Mariner's Market", '⚓️', 'Rope, salt, and tide charts crowd the tables; nothing stays useful forever.', 'A mariner is tying off one hidden night mooring.', {
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
  market('atlas', 'Atlas Bazaar', '🗺️', 'Mapmakers argue over routes while vendors reward the trader who planned two turns ahead.', 'A cartographer is inking one hidden night route.', {
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
  market('sunrise-caravan', 'Sunrise Caravan', '🌅', 'Sunrise opens the caravan gates, but the best bargains are aimed at night.', 'A pack master is tying one hidden bundle for nightfall.', {
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
      flavor: `${emoji} Traders are setting their stalls for a route that rewards careful timing.`,
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
