// tables.js — all generation content lives here. No logic, no DOM.
// Phase 1: a starter set to prove the comedy bar. Phase 2 expands to 200+ entries.
// Every entry is original writing. Placeholders like {X} are filled by generator.js.

export const RARITIES = [
  { id: 'trash',     name: 'Trash',     weight: 40,  tier: 0 },
  { id: 'common',    name: 'Common',    weight: 30,  tier: 1 },
  { id: 'uncommon',  name: 'Uncommon',  weight: 15,  tier: 2 },
  { id: 'rare',      name: 'Rare',      weight: 9,   tier: 3 },
  { id: 'epic',      name: 'Epic',      weight: 4,   tier: 4 },
  { id: 'legendary', name: 'Legendary', weight: 1.5, tier: 5 },
  { id: 'cursed',    name: 'Cursed',    weight: 0.5, tier: 6 },
];

// Base items. Each carries its own bespoke jokes (statHooks / flavorHooks) so
// generated items read as written-for-purpose, not madlibs.
export const BASE_ITEMS = [
  {
    name: 'Shortsword', type: 'weapon',
    statHooks: [
      "Whispers 'sorry' after every critical hit",
      'On kill: bows respectfully to the corpse, costing you one turn of dignity',
    ],
    flavorHooks: [
      'Forged by a swordsmith who deeply resented conflict.',
      "The blade is engraved with 'PLEASE BE REASONABLE' in six dead languages.",
    ],
  },
  {
    name: 'Greataxe', type: 'weapon',
    statHooks: [
      'Deals double damage to furniture',
      'Cleave: hits the enemy, the enemy behind them, and any nearby load-bearing pillar',
    ],
    flavorHooks: [
      'Its previous owner had one strategy and, briefly, one arm.',
      'The haft is worn smooth in the shape of a very confident grip.',
    ],
  },
  {
    name: 'Dagger', type: 'weapon',
    statHooks: [
      '+{X} to sneak attacks; refuses to work if the target seems nice',
      'Can be thrown. Cannot be thrown well.',
    ],
    flavorHooks: [
      'Small enough to hide anywhere, which is exactly what its last three owners thought.',
      'Technically a letter opener that got ambitious.',
    ],
  },
  {
    name: 'Warhammer', type: 'weapon',
    statHooks: [
      'Ignores armor, doors, and the concept of subtlety',
      'On hit: 30% chance nearby structures file a complaint',
    ],
    flavorHooks: [
      'Solves most problems. Creates most of the rest.',
      'The head bears a dent shaped exactly like consequences.',
    ],
  },
  {
    name: 'Crossbow', type: 'weapon',
    statHooks: [
      'Reload time: one deep, judgmental breath',
      'Never misses. Frequently hits the wrong thing.',
    ],
    flavorHooks: [
      'Point-and-click interface. Medieval user error.',
      'Comes pre-loaded with one bolt and unlimited hesitation.',
    ],
  },
  {
    name: 'Wand', type: 'weapon',
    statHooks: [
      "Casts a random cantrip; {X}0% chance it's the one you wanted",
      'Charges: yes. How many: it would rather not say.',
    ],
    flavorHooks: [
      'The previous owner labeled it "DO NOT" and then, in smaller writing, "seriously".',
      'Hums when magic is near, which in a dungeon means it never, ever stops.',
    ],
  },
  {
    name: 'Bucket Helm', type: 'armor',
    statHooks: [
      '+{X} armor, -4 peripheral vision, +1 resonant clang',
      'Immune to embarrassment (wearer only; onlookers take double)',
    ],
    flavorHooks: [
      'It was a bucket. Someone believed in it.',
      'Smells faintly of the well it came from and strongly of the man who came out of the well.',
    ],
  },
  {
    name: 'Chainmail Vest', type: 'armor',
    statHooks: [
      'Immune to light chafing. Vulnerable to magnets.',
      '+{X} armor; jingles a merry tune during stealth checks',
    ],
    flavorHooks: [
      'Each ring was lovingly hand-linked by someone who is now very tired.',
      'The label says "one size fits most survivors."',
    ],
  },
  {
    name: 'Boots', type: 'armor',
    statHooks: [
      '+{X}% movement speed; squeaks on the offbeat',
      'Wearer always lands on their feet, legally speaking',
    ],
    flavorHooks: [
      'The left boot is slightly haunted. The right boot is slightly jealous.',
      'Broken in by a courier who was also, eventually, broken.',
    ],
  },
  {
    name: 'Cloak', type: 'armor',
    statHooks: [
      'Advantage on stealth; smells aggressively of mushrooms',
      'Billows dramatically even indoors. Especially indoors.',
    ],
    flavorHooks: [
      'Woven from shadow, lint, and one deeply committed spider.',
      'The hood is sized for a head with more secrets than yours.',
    ],
  },
  {
    name: 'Tower Shield', type: 'armor',
    statHooks: [
      'Blocks attacks, criticism, and eye contact',
      '+{X} armor; doubles as a door, a table, and a personality',
    ],
    flavorHooks: [
      'Dented in a pattern archaeologists would describe as "a bad afternoon."',
      'Whoever painted the crest on it was attacked partway through, which explains the crest.',
    ],
  },
  {
    name: 'Mystery Potion', type: 'potion',
    statHooks: [
      'Effect: yes. Duration: also yes.',
      'Restores {X}d6 of something. The label is smudged exactly where it matters.',
    ],
    flavorHooks: [
      "The label reads 'DRINK ME' in handwriting that gets less confident with each letter.",
      'It swirls when nobody is looking. You can tell because it is always mid-swirl.',
    ],
  },
  {
    name: 'Healing Salve', type: 'potion',
    statHooks: [
      'Restores {X}d6 HP and one repressed memory',
      'Heals wounds, cuts, scrapes, and — with a doctor’s note — feelings',
    ],
    flavorHooks: [
      'Smells like mint, ozone, and a promise someone intends to keep this time.',
      'Directions: apply to injury. Do not apply to enemy. It works on them too.',
    ],
  },
  {
    name: 'Combustion Scroll', type: 'scroll',
    statHooks: [
      'Casts Fireball at the nearest flammable regret',
      'Deals {X}d6 fire damage, split evenly between the target and your eyebrows',
    ],
    flavorHooks: [
      'The margins are full of corrections in a different, more panicked handwriting.',
      'The final instruction is just the word "RUN," underlined twice.',
    ],
  },
  {
    name: 'Scroll of Summoning', type: 'scroll',
    statHooks: [
      'Summons a creature of CR {X}. It summons you right back. It is a whole thing.',
      'Summons help. Definition of "help" determined at runtime.',
    ],
    flavorHooks: [
      'The summoning circle diagram has a coffee ring on it that may or may not be structural.',
      'Someone has crossed out "servant" and written "roommate."',
    ],
  },
  {
    name: 'Amulet', type: 'trinket',
    statHooks: [
      'Wearer always knows which way is north, whether they asked or not',
      '+{X} to saving throws against advice',
    ],
    flavorHooks: [
      'Warm to the touch, like it just came out of someone else’s pocket. It did.',
      'The gem inside blinks. Amulets should not blink.',
    ],
  },
  {
    name: 'Signet Ring', type: 'trinket',
    statHooks: [
      '+{X} Charisma when speaking to doors',
      'Grants noble status in one (1) collapsed kingdom',
    ],
    flavorHooks: [
      "Inscribed inside: 'If found, keep it. Trust me.'",
      'The crest depicts a lion doing something lions cannot do, which is apologize.',
    ],
  },
  {
    name: 'Lute', type: 'trinket',
    statHooks: [
      'Bards within 60 ft take {X}d4 psychic damage from jealousy',
      'Playing it grants advantage on performance and disadvantage on friendship',
    ],
    flavorHooks: [
      'Perfectly tuned. This is somehow more unsettling than the alternative.',
      'One string is a different color and the lute will not discuss it.',
    ],
  },
  {
    name: 'Torch', type: 'tool',
    statHooks: [
      'Illuminates a 30-foot radius of disappointment',
      'Burns for {X} hours or until narratively inconvenient, whichever is sooner',
    ],
    flavorHooks: [
      'Fire technology, now with handle.',
      'The flame leans away from certain corridors. Consider the flame’s opinion.',
    ],
  },
  {
    name: 'Rope (50 ft)', type: 'tool',
    statHooks: [
      'Holds up to 300 lbs or one broken promise',
      'Knot difficulty scales with how urgently you need the knot',
    ],
    flavorHooks: [
      'Fifty feet of optimism, coiled.',
      'The frayed end has a story. The other end has a witness.',
    ],
  },
  {
    name: 'Grappling Hook', type: 'tool',
    statHooks: [
      'Attaches to any surface except the one you aimed at',
      'Retrieval: guaranteed. Of the hook: negotiable.',
    ],
    flavorHooks: [
      'Sold by a climber who no longer climbs and will not say why.',
      'The prongs are bent inward, like it hugged something once and regrets it.',
    ],
  },
];

// Prefixes: tone-setting adjectives with optional bonus jokes.
export const PREFIXES = [
  { text: 'Vaguely Apologetic', flavor: 'It has done something. It will not say what.' },
  { text: 'Passive-Aggressive', stat: 'Deals +{X} damage, but sighs first' },
  { text: 'Slightly Haunted', stat: 'A ghost lives in it. She has opinions.' },
  { text: 'Artisanal', flavor: 'Hand-crafted in small batches by someone with strong feelings about your technique.' },
  { text: 'Previously Owned', flavor: 'Previous owner: unavailable for comment. Or anything else.' },
  { text: 'Regulation-Grade', stat: 'Meets the dungeon safety code, which does not exist' },
  { text: 'Ominously Damp', flavor: 'It is dry to the touch. It is damp in some other way.' },
  { text: 'Self-Aware', flavor: 'It knows it came out of a loot box. It is coping.' },
  { text: 'Budget', stat: '-1 to all stats, +5 to perceived value' },
  { text: 'Screaming', stat: 'Screams. Constantly. No other effects.' },
  { text: 'Overachieving', stat: 'Also does the job of two lesser items, and mentions it' },
  { text: 'Bureaucratic', stat: 'All effects require a form, in triplicate, in blood (any blood)' },
  { text: 'Feral', flavor: 'It was raised by weapons racks in the wild.' },
  { text: 'Municipal', flavor: 'Property of a town that no longer exists. Taxes still apply.' },
];

// Suffixes: "of X" titles with optional bonus jokes.
export const SUFFIXES = [
  { text: 'of Mild Inconvenience', stat: 'Enemies suffer -1 to all rolls and a pebble in their shoe' },
  { text: 'of the Unpaid Intern', stat: 'Does everything; credit goes to your other equipment' },
  { text: 'of Probable Doom', stat: 'Doom probability: 60%, rounded down from 100%' },
  { text: 'of Sighing', flavor: 'When drawn, it exhales like it had other plans.' },
  { text: 'of the Middle Manager', stat: 'Can delegate up to {X} damage to nearby allies' },
  { text: 'of Adequate Warmth', stat: 'Wearer is never cold, merely disappointed' },
  { text: 'of Forbidden Knowledge (Abridged)', flavor: 'Contains the forbidden knowledge, minus the parts that made it worth forbidding.' },
  { text: 'of Infinite Storage (Terms Apply)', stat: 'Holds anything. Returns items alphabetically, not urgently.' },
  { text: 'of Minor Smiting', stat: 'Smites, but, like, gently' },
  { text: 'of Emotional Support', stat: '+{X} to morale; the item believes in you, statistically alone' },
  { text: 'of the Void (Decorative)', flavor: 'The void inside is purely ornamental. Do not feed it.' },
  { text: 'of the Damp Depths', flavor: 'You can hear the ocean in it. The ocean can hear you.' },
];

// Materials: mostly for mid/high-tier names.
export const MATERIALS = [
  'Gently-Used Iron',
  'Artisan Pig Iron',
  'Recalled Mithril',
  'Compressed Regret',
  'Damp Oak',
  'Reclaimed Bone',
  'Lint-Forged Steel',
  'Expired Brass',
  'Cave-Aged Leather',
  'Discount Obsidian',
  'Genuine Dragonhide (Allegedly)',
  'Municipal Bronze',
];

// Trash-tier name decorations. Trash doesn't earn a real prefix.
export const TRASH_DECORATIONS = {
  pre: ['Broken', 'Bent', 'Chewed', 'Soggy', 'Complimentary', 'Slightly Melted', 'Pre-Looted'],
  post: ['(Cracked)', '(Damp)', '(Refurbished)', '(Final Sale)', '(Some Assembly Missing)', '(Haunted, but Lazy)'],
};

// Legendary & cursed items get proper names + epithets.
// {base} is replaced with the base item name.
export const LEGENDARY_NAMES = [
  'Gretchen', 'Doomhinge', 'The Negotiator', 'Whisperbane', 'Kevin',
  'The Last Argument', 'Regret’s Warranty', 'Old Certainty', 'The Understudy',
  'Mildred', 'Fifth Opinion', 'The Compromise',
];

export const LEGENDARY_EPITHETS = [
  'Devourer of Warranties',
  'Bane of Load-Bearing Walls',
  'Herald of the Refund',
  'the {base} That Ends Conversations',
  'Last of the Honest {base}s',
  'Widowmaker (Certified Pre-Owned)',
  'the Apology Nobody Asked For',
  'Third-Least-Cursed of Its Dynasty',
  'the {base} of Prophecy (Lesser Prophecy)',
  'Auditor of Souls',
];

// Cursed items: monkey's-paw twists appended to otherwise-glorious stats.
export const CURSED_TWISTS = [
  '+10 Strength. Your arms now belong to the item. It lets you borrow them.',
  'Grants flight. Landing sold separately.',
  'You cannot die while wielding it. You will want to.',
  'Doubles all gold found. The gold screams.',
  '+5 Luck. The luck is deducted from everyone you love.',
  'Answers any question truthfully. It answers all of them. Constantly. At 3 a.m.',
  'Immunity to fire. You are now legally the item’s emotional support human.',
  'Teleports you out of danger, to somewhere it considers funnier.',
  'Grants eternal youth to your reflection. Only your reflection.',
];

// Frames for assembling flavor text around an item's bespoke hook.
// {hook} = the item's flavorHook, {place} = a PLACES entry.
export const FLAVOR_FRAMES = [
  '{hook}',
  '{hook}',
  '{hook}', // weighted toward the bespoke joke standing alone
  'Recovered from {place}. {hook}',
  'Found in {place}, which explains a lot. {hook}',
  '{hook} Appraised once, in {place}, by someone who immediately retired.',
];

export const PLACES = [
  'a mimic’s stomach',
  'the dungeon’s lost-and-found',
  'the crawlspace beneath a suspiciously polite altar',
  'a hero’s estate sale',
  'the third-least-cursed crypt in the region',
  'a goblin timeshare',
  'the previous adventurer',
  'a wizard’s junk drawer',
  'the discount bin of destiny',
];

// The System's built-in snark, by rarity. Used always in Phase 1;
// later the fallback when AI announcer mode is off or errors.
export const SYSTEM_LINES = {
  trash: [
    'Ah. One for your collection of regrets.',
    'The box worked perfectly. That is what came out.',
    'Somewhere, a merchant is laughing. It is me. I am the merchant.',
    'I would say you deserve better, but I have seen your combat log.',
  ],
  common: [
    'Technically loot.',
    'It is an item. That is the nicest thing anyone will ever say about it.',
    'Adequate. Like you, on a good day.',
  ],
  uncommon: [
    'Do not spend it all in one crypt.',
    'Above average. The average was very low, but still.',
    'Oh good, you will be insufferable about this for an hour.',
  ],
  rare: [
    'A rare drop. Savor it. I have run the numbers on your next forty boxes.',
    'Rare! Try not to sell it for potions immediately. Try.',
  ],
  epic: [
    'I am contractually required to sound impressed. Consider it done.',
    'Epic. The dungeon will be adjusting its difficulty accordingly. You are welcome.',
  ],
  legendary: [
    'Well. Even I did not see that coming, and I see everything.',
    'Legendary. Please stop crying on the interface.',
  ],
  cursed: [
    'Congratulations! Do read the fine print. Oh, there is none. Even better.',
    'A magnificent item. The screaming is normal. Yours, I mean.',
  ],
};
