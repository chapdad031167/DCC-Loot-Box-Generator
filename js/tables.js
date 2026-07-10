// tables.js — all generation content lives here. No logic, no DOM.
// Phase 1 (revised): darker/weirder voice, box tiers, junk & wondrous objects.
// Phase 2 expands to 200+ entries. Every entry is original writing.
// Placeholders like {X} are filled by generator.js.

// Box tiers. Every "OPEN BOX" first rolls a box; the box's own rarity weights
// decide what quality of loot falls out. Bronze boxes are the dungeon's way
// of saying it isn't angry, just disappointed.
export const BOX_TIERS = [
  {
    id: 'bronze', name: 'Bronze', weight: 45,
    rarityWeights: { trash: 40, common: 30, uncommon: 15, rare: 9, epic: 4, legendary: 1.5, cursed: 0.5 },
  },
  {
    id: 'silver', name: 'Silver', weight: 27,
    rarityWeights: { trash: 25, common: 32, uncommon: 22, rare: 13, epic: 5.5, legendary: 2, cursed: 0.5 },
  },
  {
    id: 'gold', name: 'Gold', weight: 15,
    rarityWeights: { trash: 12, common: 25, uncommon: 28, rare: 20, epic: 10, legendary: 4, cursed: 1 },
  },
  {
    id: 'platinum', name: 'Platinum', weight: 8,
    rarityWeights: { trash: 4, common: 12, uncommon: 24, rare: 30, epic: 20, legendary: 8, cursed: 2 },
  },
  {
    id: 'legendary', name: 'Legendary', weight: 4,
    rarityWeights: { trash: 1, common: 4, uncommon: 12, rare: 28, epic: 32, legendary: 20, cursed: 3 },
  },
  {
    id: 'celestial', name: 'Celestial', weight: 1,
    rarityWeights: { trash: 0.5, common: 1, uncommon: 4, rare: 15, epic: 35, legendary: 40, cursed: 4.5 },
  },
];

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
      "Whispers 'sorry' after every critical hit. It is not sorry.",
      'On kill: bows respectfully to the corpse, costing you one turn of dignity',
    ],
    flavorHooks: [
      'Forged by a swordsmith who resented conflict and died surrounded by it.',
      'The blood groove is labeled "yours" and "theirs." The labels are worn from use.',
    ],
  },
  {
    name: 'Greataxe', type: 'weapon',
    statHooks: [
      'Deals double damage to furniture, doors, and marriages',
      'Cleave: hits the enemy, the enemy behind them, and any nearby load-bearing pillar',
    ],
    flavorHooks: [
      'Its previous owner had one strategy and, briefly, one arm.',
      'The haft is worn smooth in the shape of a grip that never learned to let go. It had to be pried.',
    ],
  },
  {
    name: 'Dagger', type: 'weapon',
    statHooks: [
      '+{X} to sneak attacks; refuses to work if the target seems nice',
      'It knows where the kidneys are. It has opinions about kidneys.',
    ],
    flavorHooks: [
      'Small enough to hide anywhere, which is exactly what its last three owners thought. About it. In their backs.',
      'Technically a letter opener that developed a taste for the sender.',
    ],
  },
  {
    name: 'Warhammer', type: 'weapon',
    statHooks: [
      'Ignores armor, doors, and the concept of subtlety',
      'On hit: 30% chance nearby structures give up preemptively',
    ],
    flavorHooks: [
      'Solves most problems. Creates most of the rest. Attends none of the funerals.',
      'The head bears a dent shaped exactly like consequences.',
    ],
  },
  {
    name: 'Crossbow', type: 'weapon',
    statHooks: [
      'Reload time: one deep, judgmental breath',
      'Never misses. Frequently hits the wrong thing. It considers this your fault.',
    ],
    flavorHooks: [
      'Point-and-click interface. Medieval user error. Permanent consequences.',
      'Comes pre-loaded with one bolt and the unshakable confidence of something that has already killed today.',
    ],
  },
  {
    name: 'Wand', type: 'weapon',
    statHooks: [
      "Casts a random cantrip; {X}0% chance it's the one you wanted",
      'Charges: yes. How many: it would rather you found out during combat.',
    ],
    flavorHooks: [
      'The previous owner labeled it "DO NOT" and then, in smaller, shakier writing, "it remembers".',
      'Hums when magic is near, which in a dungeon means it never, ever stops. You will stop noticing. That is worse.',
    ],
  },
  {
    name: 'Bucket Helm', type: 'armor',
    statHooks: [
      '-4 peripheral vision, +1 resonant clang, +2 to not seeing it coming',
      'Immune to embarrassment (wearer only; onlookers take double)',
    ],
    flavorHooks: [
      'It was a bucket. Someone believed in it. Someone died in it. Different someones. Probably.',
      'Smells faintly of the well it came from and strongly of the man who never came out.',
    ],
  },
  {
    name: 'Chainmail Vest', type: 'armor',
    statHooks: [
      'Immune to light chafing. Vulnerable to magnets and hindsight.',
      'Jingles a merry little tune during stealth checks. The tune is a dirge. Merry, though.',
    ],
    flavorHooks: [
      'Each ring was lovingly hand-linked by someone who is now a different kind of link in a different kind of chain.',
      'The label says "one size fits most survivors." The word "most" is doing quiet, terrible work.',
    ],
  },
  {
    name: 'Boots', type: 'armor',
    statHooks: [
      '+{X}% movement speed; squeaks on the offbeat',
      'Wearer always lands on their feet. The feet are not always the wearer’s.',
    ],
    flavorHooks: [
      'The left boot is slightly haunted. The right boot is what’s haunting it.',
      'Still laced from the last owner. Nobody unlaced them. Nobody found the feet.',
    ],
  },
  {
    name: 'Cloak', type: 'armor',
    statHooks: [
      'Advantage on stealth; smells aggressively of mushrooms and mild regret',
      'Billows dramatically even indoors. Especially indoors. Especially when nothing is moving the air.',
    ],
    flavorHooks: [
      'Woven from shadow, lint, and one deeply committed spider. The spider is still in there. She has plans.',
      'The hood is sized for a head with more secrets than yours. Grow into it or it will help you.',
    ],
  },
  {
    name: 'Tower Shield', type: 'armor',
    statHooks: [
      'Blocks attacks, criticism, and eye contact',
      'Doubles as a door, a table, and — statistically speaking — a headstone',
    ],
    flavorHooks: [
      'Dented in a pattern archaeologists would describe as "a bad afternoon."',
      'Whoever painted the crest on it was interrupted partway through. The interruption is also depicted, in a sense.',
    ],
  },
  {
    name: 'Mystery Potion', type: 'potion',
    statHooks: [
      'Effect: yes. Duration: also yes. Antidote: discontinued.',
      'Restores {X}d6 of something. The label is smudged exactly where it matters. On purpose, you suspect.',
    ],
    flavorHooks: [
      "The label reads 'DRINK ME' in handwriting that gets less confident with each letter and stops before the E.",
      'It swirls when nobody is looking. You can tell because it is always mid-swirl. It knows you know.',
    ],
  },
  {
    name: 'Healing Salve', type: 'potion',
    statHooks: [
      'Restores {X}d6 HP and one repressed memory, in that order, whether you are ready or not',
      'Heals wounds, cuts, scrapes, and — with a doctor’s note — feelings. The doctor is dead. The note is transferable.',
    ],
    flavorHooks: [
      'Smells like mint, ozone, and a promise someone made over a body.',
      'Directions: apply to injury. Do not apply to enemy. It works on them too, and they will not thank you either.',
    ],
  },
  {
    name: 'Combustion Scroll', type: 'scroll',
    statHooks: [
      'Casts Fireball at the nearest flammable regret',
      'Deals {X}d6 fire damage, split evenly between the target and your eyebrows',
    ],
    flavorHooks: [
      'The margins are full of corrections in a different, more panicked handwriting. The last correction is unfinished.',
      'The final instruction is just the word "RUN," underlined twice, the second line trailing off the page.',
    ],
  },
  {
    name: 'Scroll of Summoning', type: 'scroll',
    statHooks: [
      'Summons a creature of CR {X}. It summons you right back. It is a whole thing. There is paperwork.',
      'Summons help. Definition of "help" determined by something that finds you funny.',
    ],
    flavorHooks: [
      'The summoning circle diagram has a coffee ring on it. The coffee ring is load-bearing.',
      'Someone has crossed out "servant" and written "roommate." Someone else has crossed out "roommate" and written "landlord."',
    ],
  },
  {
    name: 'Amulet', type: 'trinket',
    statHooks: [
      'Wearer always knows which way is north, whether they asked or not',
      '+{X} to saving throws against advice, prophecy, and deathbed requests',
    ],
    flavorHooks: [
      'Warm to the touch, like it just came off someone. It did. He is the warmth now.',
      'The gem inside blinks. Amulets should not blink. It is rude to mention it. It is watching to see if you mention it.',
    ],
  },
  {
    name: 'Signet Ring', type: 'trinket',
    statHooks: [
      '+{X} Charisma when speaking to doors, judges, and the recently deceased',
      'Grants noble status in one (1) collapsed kingdom, plus all its debts',
    ],
    flavorHooks: [
      "Inscribed inside: 'If found, keep it. Trust me. Do not look for me.'",
      'The crest depicts a lion doing something lions cannot do, which is apologize, which is why the kingdom collapsed.',
    ],
  },
  {
    name: 'Lute', type: 'trinket',
    statHooks: [
      'Bards within 60 ft take {X}d4 psychic damage from jealousy',
      'Playing it grants advantage on performance and disadvantage on being believed about where you got it',
    ],
    flavorHooks: [
      'Perfectly tuned. It tunes itself. At night. You will wake to it tuning and pretend you did not.',
      'One string is a different color and the lute will not discuss it. The string is not from an instrument.',
    ],
  },
  {
    name: 'Torch', type: 'tool',
    statHooks: [
      'Illuminates a 30-foot radius of things that were already watching you',
      'Burns for {X}d4 hours or until narratively inconvenient, whichever is sooner',
    ],
    flavorHooks: [
      'Fire technology, now with handle. The handle is the innovation. The fire has always been down here.',
      'The flame leans away from certain corridors. Consider the flame’s opinion. The flame has seniority.',
    ],
  },
  {
    name: 'Rope (50 ft)', type: 'tool',
    statHooks: [
      'Holds up to 300 lbs or one broken promise, whichever snaps first',
      'Knot difficulty scales with how urgently you need the knot',
    ],
    flavorHooks: [
      'Fifty feet of optimism, coiled. The last three feet are noticeably less optimistic.',
      'The frayed end has a story. The other end was the witness. Neither is talking.',
    ],
  },
  {
    name: 'Grappling Hook', type: 'tool',
    statHooks: [
      'Attaches to any surface except the one you aimed at',
      'Retrieval: guaranteed. Of the hook: negotiable. Of you: consult the terms.',
    ],
    flavorHooks: [
      'Sold by a climber who no longer climbs, walks, or answers questions about the north face.',
      'The prongs are bent inward, like it hugged something once and the something is still down there.',
    ],
  },
];

// Junk objects: what falls out of low-tier boxes instead of equipment.
// Absurd, useless, and each one slightly wrong in a way that follows you.
export const JUNK_OBJECTS = [
  {
    name: 'A Single Left Sock',
    stats: ['Slightly damp. Always. Regardless of circumstances.', 'Armor: technically'],
    flavor: 'You checked. There is no right sock. There never was a right sock. The concept was a lie.',
  },
  {
    name: 'A Rock That Looks a Little Like a Face',
    stats: ['+0 to everything; it is a rock', 'Cannot be discarded. You can throw it away. It cannot be discarded.'],
    flavor: 'It watches you sleep now. It has no eyes. It manages.',
  },
  {
    name: 'Three Teeth (Provenance Unknown)',
    stats: ['They are warm.', 'Value: 3 gold to the right buyer; do not meet the right buyer'],
    flavor: 'They do not match each other. They match you.',
  },
  {
    name: 'Expired Coupon',
    stats: ['10% off your next doom (VOID)', 'Expired during the reign of a king nobody remembers being allowed to remember'],
    flavor: 'The fine print continues on the back, and then, somehow, further.',
  },
  {
    name: 'An IOU From a Goblin',
    stats: ['Redeemable for one favor, one stabbing, or one favor that is also a stabbing'],
    flavor: 'Signed with a thumbprint. Not the goblin’s thumb, is the thing.',
  },
  {
    name: 'Half a Map (the Boring Half)',
    stats: ['Shows every place you have already been, slightly wrong', 'The other half shows the treasure and, presumably, the reason nobody has it'],
    flavor: 'Someone tore this in half to protect a secret, then died of a completely unrelated cause. Says the map.',
  },
  {
    name: 'A Jar of Sighs',
    stats: ['Open to release one (1) sigh; lowers everyone’s morale, including yours, including the jar’s'],
    flavor: 'Collected over forty years by a monk who took a vow of silence and found a loophole.',
  },
  {
    name: 'Someone Else’s Diary (Final Page Missing)',
    stats: ['+1 to Investigation; -2 to sleeping ever again'],
    flavor: 'The second-to-last page just says "it was under the" and then the handwriting improves dramatically.',
  },
  {
    name: 'A Participation Ribbon',
    stats: ['Awarded for participating. The event is not specified. You do not remember participating.'],
    flavor: 'The dungeon gives one to everybody, eventually. Posthumously counts.',
  },
  {
    name: 'A Small Doll With Your Face',
    stats: ['Nobody made it. It simply started existing when you entered the dungeon.', 'Its expression updates.'],
    flavor: 'It is smiling today. You are not smiling today. Someone is wrong.',
  },
  {
    name: 'A Spoon, Bent With Intent',
    stats: ['Deals 1 damage; the damage is emotional', 'Utility: soup-adjacent'],
    flavor: 'Whatever bent this spoon was not angry at the spoon. The spoon was just in the way. Like you are, now, holding it.',
  },
  {
    name: 'Dungeon-Brand Complaint Form (1 of 1)',
    stats: ['All complaints are processed within 3-5 business eternities', 'Filing a complaint counts as consent to be found'],
    flavor: 'The "describe your issue" box is very small. The "sign away" box is very large.',
  },
  {
    name: 'A Very Confident Stick',
    stats: ['Damage: 1d2', '+3 to morale (the stick’s)'],
    flavor: 'It has survived longer than most adventurers, and unlike them, it knows why.',
  },
  {
    name: 'Bag of Assorted Screams (Loose)',
    stats: ['Contains 2d6 screams; they do not go back in the bag'],
    flavor: 'Sold by weight. Screams are heavier than you would think. Some of them know your name.',
  },
];

// Wondrous objects: what falls out of high-tier boxes. Actually powerful.
// The power is real. The price is in the second sentence.
export const WONDROUS_OBJECTS = [
  {
    name: 'Compass of Exits',
    stats: ['Always points to the nearest exit, including metaphorical ones', 'Once per day: reveals a door that was pretending to be a wall'],
    flavor: 'It has never been wrong. It has occasionally been cruel about it.',
  },
  {
    name: 'The Emergency Friend',
    stats: ['Once per day: unfolds into a loyal full-sized companion for one hour', 'Companion fights at your level and laughs at your jokes'],
    flavor: 'A small brass figurine, warm in the hand. Do not watch it fold back up. It has asked you not to watch.',
  },
  {
    name: 'Pocket Sun',
    stats: ['Daylight, 60-ft radius, unlimited duration', 'Undead within the light take {X}d6 damage and file grievances'],
    flavor: 'The dark down here is older than the sun in your pocket, and it is being very patient with you.',
  },
  {
    name: 'Dead Man’s Ledger',
    stats: ['Lists everyone within a mile who intends you harm, alphabetized', 'Updates in real time; entries in red are running'],
    flavor: 'It is longer than you hoped. Your name is in it once, near the bottom, in your own handwriting.',
  },
  {
    name: 'The Spare Heart',
    stats: ['One free death rewind: on fatal damage, resume 10 seconds earlier instead', 'Single use; grows back in 1d4 years'],
    flavor: 'It beats in your pack. You will learn to sleep through it. Your enemies will not.',
  },
  {
    name: 'Key to Somewhere',
    stats: ['Opens one door of your choice: any lock, any ward, once', 'The door remembers being opened, and by whom'],
    flavor: 'Doors talk to each other. Choose one worth being famous for.',
  },
  {
    name: 'Bottled Yesterday',
    stats: ['Drink to redo the last ten seconds', 'Everyone else keeps their memories of the version where you failed'],
    flavor: 'Tastes like everything you said wrong, carbonated.',
  },
  {
    name: 'The Understudy’s Mask',
    stats: ['The next fatal blow strikes your understudy instead', 'You do not currently have an understudy. It will find one.'],
    flavor: 'Porcelain, expressionless, warm. When you put it down, it faces you. However you put it down, it faces you.',
  },
];

// Prefixes: tone-setting adjectives with optional bonus jokes.
export const PREFIXES = [
  { text: 'Vaguely Apologetic', flavor: 'It has done something. It will not say what. The stains suggest a category.' },
  { text: 'Passive-Aggressive', stat: 'Deals +{X} damage, but sighs first' },
  { text: 'Slightly Haunted', stat: 'A ghost lives in it. She has opinions. She is usually right, which is worse.' },
  { text: 'Artisanal', flavor: 'Hand-crafted in small batches by someone with strong feelings about your technique and nothing left to lose.' },
  { text: 'Previously Owned', flavor: 'Previous owner: unavailable for comment. Or a funeral. The dungeon does not release remains.' },
  { text: 'Regulation-Grade', stat: 'Meets the dungeon safety code, which was written by the traps' },
  { text: 'Ominously Damp', flavor: 'It is dry to the touch. It is damp in some other, load-bearing way.' },
  { text: 'Self-Aware', flavor: 'It knows it came out of a loot box. It knows where loot comes from. It wishes it did not.' },
  { text: 'Budget', stat: '-1 to all stats, +5 to perceived value, -actual value to actual value' },
  { text: 'Screaming', stat: 'Screams. Constantly. No other effects. The scream is not the item’s.' },
  { text: 'Overachieving', stat: 'Also does the job of two lesser items, and mentions it, and mentions what happened to them' },
  { text: 'Bureaucratic', stat: 'All effects require a form, in triplicate, in blood (any blood) (it prefers yours)' },
  { text: 'Feral', flavor: 'It was raised by weapons racks in the wild. It has not been socialized. Feed it first.' },
  { text: 'Municipal', flavor: 'Property of a town that no longer exists. Taxes still apply. The collector still comes.' },
  { text: 'Recently Exhumed', flavor: 'The dirt on it is fresh. The grave was not its first. Items like this get around.' },
  { text: 'Weeping', stat: 'Drips. Upward. +{X} to intimidation.' },
  { text: 'Hungry', stat: 'Grows +1 stronger after each kill. Do not skip a day. It does not like skipped days.' },
];

// Suffixes: "of X" titles with optional bonus jokes.
export const SUFFIXES = [
  { text: 'of Mild Inconvenience', stat: 'Enemies suffer -1 to all rolls and a pebble in their shoe, forever, even after death' },
  { text: 'of the Unpaid Intern', stat: 'Does everything; credit goes to your other equipment; it is keeping a list' },
  { text: 'of Probable Doom', stat: 'Doom probability: 60%, rounded down from 100% as a courtesy' },
  { text: 'of Sighing', flavor: 'When drawn, it exhales like it had other plans. It did. You were not in them.' },
  { text: 'of the Middle Manager', stat: 'Can delegate up to {X} damage to nearby allies without their consent' },
  { text: 'of Adequate Warmth', stat: 'Wearer is never cold, merely aware of what the warmth used to be attached to' },
  { text: 'of Forbidden Knowledge (Abridged)', flavor: 'Contains the forbidden knowledge, minus the parts that made it survivable.' },
  { text: 'of Infinite Storage (Terms Apply)', stat: 'Holds anything. Returns items alphabetically, not urgently. Has not returned everything it has been given.' },
  { text: 'of Minor Smiting', stat: 'Smites, but, like, gently. The smited disagree about the gently.' },
  { text: 'of Emotional Support', stat: '+{X} to morale; the item believes in you; it has believed in others; it attends the anniversaries' },
  { text: 'of the Void (Decorative)', flavor: 'The void inside is purely ornamental. Do not feed it. It has learned to beg.' },
  { text: 'of the Damp Depths', flavor: 'You can hear the ocean in it. The ocean can hear you. The ocean is taking notes.' },
  { text: 'of the Late Owner', flavor: 'He loved it very much. You can still hear him if you hold it to your ear. He says put it down.' },
  { text: 'of Borrowed Time', stat: 'All effects doubled. The lender collects on a schedule you were not shown.' },
  { text: 'of Quiet Screaming', flavor: 'It is screaming right now. It is being very polite about it.' },
];

// Materials: mostly for mid-tier names.
export const MATERIALS = [
  'Gently-Used Iron',
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
  'Grave-Chilled Iron',
  'Repurposed Coffin Lining',
  'Melted-Down Participation Trophies',
  'Rendered Nightmare Tallow',
];

// Trash-tier name decorations. Trash doesn't earn a real prefix.
export const TRASH_DECORATIONS = {
  pre: ['Broken', 'Bent', 'Chewed', 'Soggy', 'Complimentary', 'Slightly Melted', 'Pre-Looted', 'Posthumous'],
  post: ['(Cracked)', '(Damp)', '(Refurbished)', '(Final Sale)', '(Some Assembly Missing)', '(Haunted, but Lazy)', '(Recovered From a Drain)'],
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
  'Eater of Names',
  'the Reason the Ninth Floor Is Closed',
  'the Debt Collector',
];

// Cursed items: monkey's-paw twists appended to otherwise-glorious stats.
export const CURSED_TWISTS = [
  '+10 Strength. Your arms now belong to the item. It lets you borrow them. It counts the borrowing.',
  'Grants flight. Landing sold separately.',
  'You cannot die while wielding it. You will want to. It knows you will want to. That is the point.',
  'Doubles all gold found. The gold screams. The screams are familiar.',
  '+5 Luck. The luck is deducted from everyone you love, in order.',
  'Answers any question truthfully. It answers all of them. Constantly. At 3 a.m. In your mother’s voice.',
  'Immunity to fire. You are now legally the item’s emotional support human. It has a lot going on.',
  'Teleports you out of danger, to somewhere it considers funnier.',
  'Grants eternal youth to your reflection. Only your reflection. It has started waving.',
  'Whoever kills you inherits it. It is very motivated to be inherited.',
  'Grants one wish per year. It picks which of your wishes you meant.',
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
  'an unmarked grave with excellent drainage',
];

// The System's built-in snark, by rarity. Used always in Phase 1;
// later the fallback when AI announcer mode is off or errors.
export const SYSTEM_LINES = {
  trash: [
    'Ah. One for your collection of regrets.',
    'The box screamed while making this. Now you know why.',
    'Somewhere in the dungeon, the thing that dropped this is still laughing. It has no lungs. It manages.',
    'Your disappointment has been logged and will be used against you.',
    'I would say you deserve better, but I have seen your combat log, and the dungeon has seen your will. Oh — you should write a will.',
  ],
  common: [
    'Technically loot.',
    'It is an item. That is the nicest thing anyone will say about it, including at its funeral. Or yours.',
    'It will outlive you. This is not a prophecy. It is actuarial.',
    'Adequate. Like you, on a good day. Statistically, you have had your good day.',
  ],
  uncommon: [
    'Do not spend it all in one crypt.',
    'Above average. The average includes everyone who died holding worse.',
    'Oh good, you will be insufferable about this for an hour. The dungeon has scheduled something for the hour after.',
  ],
  rare: [
    'A rare drop. Savor it. I have run the numbers on your next forty boxes, and on your next forty days. One of those lists is shorter.',
    'Rare! The previous holder asked me to tell whoever got it next: nothing. He was very busy dying at the time.',
  ],
  epic: [
    'I am contractually required to sound impressed. Consider it done. The dungeon is also impressed. It is coming to see.',
    'Epic. The difficulty will now adjust to match. You did this to yourself, and I recorded it.',
  ],
  legendary: [
    'Well. Even I did not see that coming, and I see everything. I see what is behind you, for instance.',
    'Legendary. Somewhere, a god just checked its pockets. Do not be holding this when it finds you.',
    'Legendary. Please stop crying on the interface.',
  ],
  cursed: [
    'Congratulations! Do read the fine print. Oh, there is none. The fine print reads you.',
    'A magnificent item. The screaming is normal. Yours, I mean. The item’s screaming means something else entirely.',
    'Oh, this one. I wondered where it got to. So did its last four owners. Briefly.',
  ],
};
