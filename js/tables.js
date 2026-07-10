// tables.js — all generation content lives here. No logic, no DOM.
// Loaded as a classic script (namespaced under LOOT) so the app runs from
// file:// — browsers block ES-module imports on the file protocol.
(() => {

  // Box tiers. Every "OPEN BOX" first rolls a box; the box's own rarity weights
  // decide what quality of loot falls out. Bronze boxes are the dungeon's way
  // of saying it isn't angry, just disappointed.
  const BOX_TIERS = [
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

  const RARITIES = [
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
  const BASE_ITEMS = [
    // ── Weapons ────────────────────────────────────────────────────────────
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
      name: 'Spear', type: 'weapon',
      statHooks: [
        'Reach: 10 feet. Regret: considerably further.',
        '+{X} to first strikes; the spear insists on going first. It has always gone first. Ask the estate.',
      ],
      flavorHooks: [
        'The tip has been sharpened so many times it is mostly memory and intent.',
        'Passed down through six generations, an average of four years apart.',
      ],
    },
    {
      name: 'Flail', type: 'weapon',
      statHooks: [
        'Ignores shields, corners, and your guidance',
        'On a natural 1, gently consults you about your funeral preferences',
      ],
      flavorHooks: [
        'Physics has filed multiple complaints. All dismissed. The flail knows a judge.',
        'The chain has one link of unknown origin. It clinks in a different language.',
      ],
    },
    {
      name: 'Longbow', type: 'weapon',
      statHooks: [
        'Range: 600 feet. Apology range: unlimited.',
        '+{X} to hit targets who believed distance meant safety',
      ],
      flavorHooks: [
        'Carved from a yew that grew in a graveyard and picked up habits.',
        'The bowstring hums an old song when drawn. Nobody taught it the song. Nobody who is available taught it the song.',
      ],
    },
    {
      name: 'Morningstar', type: 'weapon',
      statHooks: [
        'Deals {X}d8 damage and ends any conversation',
        'Diplomacy check: automatically fails. Intimidation check: automatically unnecessary.',
      ],
      flavorHooks: [
        'Named for the last thing its victims see, if they land face-up.',
        'The spikes are all slightly different lengths, like it grew them itself, because it did.',
      ],
    },
    // ── Armor ─────────────────────────────────────────────────────────────
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
      name: 'Gauntlets', type: 'armor',
      statHooks: [
        '+{X} grip strength; will not let go until they are sure',
        'Applaud your critical hits. Alone. Slowly. In the dark.',
      ],
      flavorHooks: [
        'The fingers are worn from the inside, which raises questions the outside declines to answer.',
        'The knuckles are engraved "HOLD" and "FAST." They mean it as advice, a threat, and a eulogy.',
      ],
    },
    {
      name: 'Breastplate', type: 'armor',
      statHooks: [
        'Protects the heart. From weapons. It does what it can.',
        '-{X} damage from arrows; guilt passes through unmodified',
      ],
      flavorHooks: [
        'The dent over the heart came pre-installed. Consider it a discount and a diagram.',
        'Polished to a mirror shine, so the last thing your enemy sees is themselves. The armorer thought this was poetry. The armorer is gone.',
      ],
    },
    {
      name: 'Iron Greaves', type: 'armor',
      statHooks: [
        'Wearer cannot be knocked back. Only down. Only slowly. With ceremony.',
        '+{X} armor below the knee, where the dungeon does much of its thinking',
      ],
      flavorHooks: [
        'They ring like church bells when you run. The dungeon likes to know where you are.',
        'The previous owner stood his ground. The ground kept him. The greaves resurfaced.',
      ],
    },
    // ── Potions ───────────────────────────────────────────────────────────
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
      name: 'Invisibility Draught', type: 'potion',
      statHooks: [
        'You become invisible for {X} minutes. Your shadow stays. It waits.',
        'Undetectable by sight; you remain fully detectable by everything down here that gave up on eyes generations ago',
      ],
      flavorHooks: [
        'The bottle appears empty. The bottle has always appeared empty. Drink the empty.',
        'Brewed by a hermit who was tired of being perceived. It worked. Nobody has perceived him since. Nobody can stop not perceiving him.',
      ],
    },
    {
      name: 'Liquid Courage', type: 'potion',
      statHooks: [
        '+{X} to bravery; -{X} to the accuracy of your risk assessments',
        'Immunity to fear for one hour, including the useful kind',
      ],
      flavorHooks: [
        'Distilled from the last words of confident men.',
        'The warning label is longer than the bottle and continues on a scroll sold separately.',
      ],
    },
    {
      name: 'Antidote (Assorted)', type: 'potion',
      statHooks: [
        'Cures 1d6 poisons, selected at random from the poisons currently in you',
        'Neutralizes venom, toxin, and up to {X} of your more chemical regrets',
      ],
      flavorHooks: [
        'The label lists everything it cures, alphabetically. Death is under D. It is crossed out. Lightly. In pencil.',
        'Tastes like green. Not any green thing. The concept, unsupervised.',
      ],
    },
    // ── Scrolls ───────────────────────────────────────────────────────────
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
      name: 'Scroll of Identification', type: 'scroll',
      statHooks: [
        'Identifies any item, including its full history. There is no unknowing.',
        'Reveals {X} hidden properties and one hidden opinion the item has about you',
      ],
      flavorHooks: [
        'Someone used the back to draft an apology. The scroll identifies things about the apology, too. Unprompted.',
        'It once identified a sword as "mostly grief, structurally." The sword has not been drawn since.',
      ],
    },
    {
      name: 'Scroll of Silence', type: 'scroll',
      statHooks: [
        'Silences a 30-foot radius for {X} minutes, including the thing you were listening for',
        'Cancels all sound, spells with verbal components, and one overdue conversation',
      ],
      flavorHooks: [
        'The text cannot be read aloud. It can be read. It prefers to be read. It waits.',
        'Recovered from a library where something happened. The library is fine now. The library is very, very quiet now.',
      ],
    },
    // ── Trinkets ──────────────────────────────────────────────────────────
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
      name: 'Pocket Watch', type: 'trinket',
      statHooks: [
        'Always shows the correct time. Occasionally shows the remaining time.',
        '+{X} initiative; you are always exactly as early as something wanted you to be',
      ],
      flavorHooks: [
        'It stopped once, for a week. The same week you cannot account for.',
        'The second hand hesitates at the same mark every minute, like it is paying respects.',
      ],
    },
    {
      name: 'Loaded Dice', type: 'trinket',
      statHooks: [
        '+{X} to gambling; the dice are loaded with something that shifts when you are honest',
        'Always roll what you fear. Statistically, this is a kind of loyalty.',
      ],
      flavorHooks: [
        'Confiscated from a gambler who won everything, including several things that were not in the pot and one thing that was holding the cards.',
        'Bone. You have stopped asking whose. The dice appreciate that.',
      ],
    },
    {
      name: 'Monocle', type: 'trinket',
      statHooks: [
        'See through illusions, walls, and excuses (30-foot range)',
        '+{X} to Investigation; findings are non-refundable',
      ],
      flavorHooks: [
        'The last owner saw something through it. His other eye is fine. He keeps it closed anyway, out of solidarity, or fear.',
        'The lens is ground from window glass, but a window from a house where nobody ever proved anything.',
      ],
    },
    // ── Tools ─────────────────────────────────────────────────────────────
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
    {
      name: 'Shovel', type: 'tool',
      statHooks: [
        'Digs 40% faster; it has developed intuitions about dimensions',
        '+{X} to excavation; the shovel already knows what you are going to find',
      ],
      flavorHooks: [
        'The blade is polished from use. Not the gardening kind of use. The 3 a.m. kind of use.',
        'The handle has seven notches. The dungeon does not sell shovels with notch space for an eighth. Superstition, probably.',
      ],
    },
    {
      name: 'Lantern', type: 'tool',
      statHooks: [
        'Never goes out. Sometimes goes somewhere.',
        'Light radius: {X}0 feet. Warmth radius: noticeably smaller. Emotional radius: negative.',
      ],
      flavorHooks: [
        'The flame is a color you can only describe by what it reminds you of, and you would rather not.',
        'Found lit. Nobody lit it. The wick has never been shorter. The oil has never been lower. It is not consuming anything. Probably.',
      ],
    },
    {
      name: 'One-Man Tent', type: 'tool',
      statHooks: [
        'Assembles in one minute; disassembles at a time of its choosing',
        'Sleeps one (1); the definition of "one" firms up around 3 a.m.',
      ],
      flavorHooks: [
        'The canvas is mostly patches from the tents that came before. It remembers being those tents.',
        'The care label says "do not wash, do not fold, do not leave." The first two read as instructions.',
      ],
    },
  ];

  // Junk objects: what falls out of low-tier boxes instead of equipment.
  // Absurd, useless, and each one slightly wrong in a way that follows you.
  const JUNK_OBJECTS = [
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
      flavor: 'The "describe your issue" box is very small. The "sign here" box is very large.',
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
    {
      name: 'A Key That Fits Nothing',
      stats: ['Opens: nothing (verified)', 'Weight: heavier every year'],
      flavor: 'Tested on every lock in three kingdoms. The lock it fits has not been built yet. Something is building it.',
    },
    {
      name: 'One Dented Can (Label Missing)',
      stats: ['Contents: shifting', 'Nutritional value: contested'],
      flavor: 'It sloshes on the offbeat. Whatever is inside has learned rhythm and is practicing.',
    },
    {
      name: 'Receipt for This Box',
      stats: ['Proof of purchase; you did not purchase anything', 'No refunds, in either direction'],
      flavor: 'Someone bought you this. The "from" line is blank. The "occasion" line says "soon."',
    },
    {
      name: 'A Ceramic Frog, Chipped',
      stats: ['+1 to shelf presence', 'Croaks once per season, always indoors, always behind you'],
      flavor: 'The chip reveals a second, smaller frog inside. Do not chip further.',
    },
    {
      name: 'Ten Feet of Rope (Previously Fifty)',
      stats: ['Holds up to 60 lbs of things you should not be lowering yourself toward'],
      flavor: 'The other forty feet are still holding something, somewhere. Taut.',
    },
    {
      name: 'A Love Letter, Unsigned',
      stats: ['+1 Charisma while carried; the letter is rooting for you, romantically, at you'],
      flavor: 'Addressed to "Occupant." You are the occupant. You have always been the occupant.',
    },
    {
      name: 'A Bell With No Clapper',
      stats: ['Rings anyway, on certain anniversaries', 'Cannot be silenced, only relocated'],
      flavor: 'The clapper was removed by a committee, for reasons recorded in minutes nobody will read aloud.',
    },
    {
      name: 'A Commemorative Plate',
      stats: ['Commemorates the Incident', 'Dishwasher safe; historian unsafe'],
      flavor: 'It depicts the Incident. It was sold to fund the cleanup of the Incident. It is the last remaining depiction, per the committee.',
    },
    {
      name: 'A Left-Handed Hammer',
      stats: ['Functions identically to a regular hammer', 'Resale value: one argument'],
      flavor: 'Identical to a normal hammer, per the merchant, who was very insistent, and left-handed, and gone.',
    },
    {
      name: 'Glass Eye (Warm)',
      stats: ['Grants no vision', 'It is looking at you'],
      flavor: 'You can point it elsewhere. It is looking at you.',
    },
    {
      name: 'A Sensible Hat',
      stats: ['+1 to weather resistance; the weather down here is emotional', 'One size; it fits; do not ask how it knew'],
      flavor: 'Practical, warm, unremarkable. The dungeon includes one in circulation as a control group.',
    },
    {
      name: 'Novelty Mug ("World’s Okayest Adventurer")',
      stats: ['Holds liquid, grudges, and 300 mL of dread', 'Microwave safe, if you can find one down here, which is its own prize'],
      flavor: 'Previous owner drank from it every morning until the morning he was proven statistically correct.',
    },
  ];

  // Wondrous objects: what falls out of high-tier boxes. Actually powerful.
  // The power is real. The price is in the second sentence.
  const WONDROUS_OBJECTS = [
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
    {
      name: 'The Honest Mirror',
      stats: ['Shows all things as they truly are, including mimics, illusions, and intentions', '+{X} on saves against deception; no save against the mirror'],
      flavor: 'Most owners cover it within the week. It shows you anyway, through the cloth. That is the honesty.',
    },
    {
      name: 'The Quiet Coin',
      stats: ['Flip to erase the last sound you made from every memory in range', 'Works on footsteps, shouts, and confessions; the coin keeps the confessions'],
      flavor: 'Minted in a country that no longer makes noise. Heads is a face mid-hush. Tails is the same face, after.',
    },
    {
      name: 'Map of the Destination',
      stats: ['Shows your destination in perfect, loving detail', 'The route is left as an exercise; the map grades the exercise'],
      flavor: 'It has already drawn where you end up. It lets you watch it not erase anything.',
    },
    {
      name: 'The Patient Candle',
      stats: ['Burns only while something is hunting you', 'While lit, nothing crosses the light; the wax is not running out, it is pacing itself'],
      flavor: 'It came to you lit. It has never gone out. Try not to think about the draft.',
    },
    {
      name: 'Hourglass of Second Chances',
      stats: ['Flip to rewind one full combat round, once per day', 'The sand runs out in both directions; the hourglass declines to explain'],
      flavor: 'The sand is the exact color of the last mistake you would take back. It knows which one. It sorted.',
    },
    {
      name: 'The Doorknob',
      stats: ['Press to any wall: opens a door to the last place you slept safely', 'The door works both ways. Lock it. LOCK it.'],
      flavor: 'Brass, warm, patient. It remembers every room it has ever been installed in, and one it hasn’t been. Yet.',
    },
    {
      name: 'The Diplomatic Tongue',
      stats: ['Speak with anything that has a mouth; +{X} Charisma with anything that doesn’t', 'You will finally understand what the dungeon has been chanting'],
      flavor: 'A small silver charm shaped like a word you almost know. The dungeon’s chant, incidentally, is your name, slowly, in a list.',
    },
    {
      name: 'A Sliver of the First Fire',
      stats: ['Ignites anything, including the philosophically non-flammable: debts, alibis, precedent', 'Cannot be extinguished, only apologized to'],
      flavor: 'Every other fire is descended from it, and they all still visit.',
    },
    {
      name: 'The Second Shadow',
      stats: ['A spare shadow that absorbs any effect targeting yours', 'Shadow damage is real down here; the spare knows it is a spare; it auditions constantly'],
      flavor: 'It walks a half-step behind your first shadow. They do not speak. There was an incident.',
    },
    {
      name: 'Crown of the Interim King',
      stats: ['You rule any room you enter, until someone with a better crown arrives', '+{X} Charisma; subjects obey enthusiastically and remember everything for the tribunal'],
      flavor: 'Every ruler is interim. This crown is just honest about it, and the honesty is engraved inside, where only you can read it, forever.',
    },
  ];

  // Prefixes: tone-setting adjectives with optional bonus jokes.
  const PREFIXES = [
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
    { text: 'Load-Bearing', flavor: 'Something, somewhere, is structurally depending on this item. You will find out what when you break it.' },
    { text: 'Grief-Tempered', stat: '+{X} damage against whatever caused the grief; it is still deciding what caused the grief' },
    { text: 'Uninsurable', flavor: 'Four actuaries examined it. Three retired. The fourth is now a materials science problem.' },
    { text: 'Whistling', stat: 'Whistles when danger is near. Danger is always near. It is, functionally, a musical item.' },
    { text: 'Clearance', stat: 'Final sale. -{X}% durability. The previous markdown stickers underneath tell a story of declining confidence.' },
    { text: 'Volunteer', flavor: 'Nobody assigned it to you. It assigned itself. It is very proud. Do not disappoint it. The last one it chose disappointed it.' },
    { text: 'Twice-Buried', flavor: 'Buried once for ceremony, once for certainty. Surfaced both times, refreshed.' },
    { text: 'Court-Ordered', stat: 'You are required to carry this. The paperwork is in the handle. Do not open the handle.' },
  ];

  // Suffixes: "of X" titles with optional bonus jokes.
  const SUFFIXES = [
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
    { text: 'of the Second Mortgage', stat: 'Powerful beyond its price. The price was not money. The bank is not a bank.' },
    { text: 'of Audible Dread', stat: 'Enemies within 30 ft hear a low hum pitched exactly at their specific regrets' },
    { text: 'of the Long Walk Home', flavor: 'Everyone who has carried it made it home. Eventually. Changed. On foot. The horses refuse.' },
    { text: 'of Immediate Consequences', stat: 'All effects trigger instantly, including the ones you meant to save for later' },
    { text: 'of the Former Champion', flavor: 'His name is engraved on it, then crossed out, then engraved again by a different hand that pressed much harder.' },
    { text: 'of Gentle Discouragement', stat: 'Enemies must save or lose the will to see this through, which is also its effect on you' },
    { text: 'of the Fine Print', flavor: 'There is writing on it too small to read. It gets smaller when you fetch a lens. It is winning.' },
    { text: 'of Perpetual Tuesday', stat: 'While equipped, it is Tuesday. No further effects. It is simply always Tuesday.' },
    { text: 'of the Deep Discount', flavor: 'Marked down from a price that, if you saw it, would explain everything and help nothing.' },
  ];

  // Materials: mostly for mid-tier names.
  const MATERIALS = [
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
    'Widow-Polished Silver',
    'Foreclosed Gold',
    'Second-Hand Starlight',
    'Petrified Optimism',
    'Bog-Standard Bog Iron',
    'Free-Range Granite',
    'Ethically Ambiguous Ivory',
  ];

  // Trash-tier name decorations. Trash doesn't earn a real prefix.
  const TRASH_DECORATIONS = {
    pre: [
      'Broken', 'Bent', 'Chewed', 'Soggy', 'Complimentary', 'Slightly Melted',
      'Pre-Looted', 'Posthumous', 'Court-Evidence', 'Biodegrading', 'Motivational',
    ],
    post: [
      '(Cracked)', '(Damp)', '(Refurbished)', '(Final Sale)', '(Some Assembly Missing)',
      '(Haunted, but Lazy)', '(Recovered From a Drain)', '(As-Is)', '(Smells Wrong)',
      '(Previously Swallowed)', '(Warranty Voided by the Incident)', '(Found in the Walls)',
    ],
  };

  // Legendary & cursed items get proper names + epithets.
  // {base} is replaced with the base item name.
  const LEGENDARY_NAMES = [
    'Gretchen', 'Doomhinge', 'The Negotiator', 'Whisperbane', 'Kevin',
    'The Last Argument', 'Regret’s Warranty', 'Old Certainty', 'The Understudy',
    'Mildred', 'Fifth Opinion', 'The Compromise', 'Consequence', 'The Long Tuesday',
    'Barnaby', 'Penultimate', 'The Second Opinion', 'Hush', 'The Fine Print',
    'Grudgekeeper', 'Susan', 'The Backup Plan', 'Twelve Regrets', 'The Character Witness',
  ];

  const LEGENDARY_EPITHETS = [
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
    'the Reason for the Rule',
    'Litigator of the Nine Hells (Disbarred)',
    'the Last Thing Forty Men Learned',
    'Keeper of the Unreturned Deposits',
    'the {base} the Dark Is Afraid Of',
    'First of Its Name, Last of Its Owners',
    'the Dungeon’s Favorite Mistake',
    'Patron of Closed-Casket Ceremonies',
    'the {base} That Remembers',
    'Heir to Nothing in Particular',
    'the Unsubtle',
  ];

  // Cursed items: monkey's-paw twists appended to otherwise-glorious stats.
  const CURSED_TWISTS = [
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
    'Perfect night vision. The things in the dark can tell you can see them now. There is etiquette. Learn it quickly.',
    'Your wounds heal instantly. On someone else.',
    'It is the finest weapon ever forged. It is also a committed pacifist. Negotiations are ongoing. You are losing.',
    'You always roll maximum damage. The dungeon has been notified of the imbalance and given your room number.',
    '+20 to stealth. Nobody can find you now. Nobody. The search was called off years ago, from your perspective.',
    'Grants a beautiful singing voice. It only works for eulogies. You have been booked solid, somehow, in advance.',
    'Summons your greatest ally in your hour of need. Your hour of need is scheduled. It knows the hour. It will not tell you the hour.',
  ];

  // Frames for assembling flavor text around an item's bespoke hook.
  // {hook} = the item's flavorHook, {place} = a PLACES entry.
  const FLAVOR_FRAMES = [
    '{hook}',
    '{hook}',
    '{hook}',
    '{hook}', // weighted toward the bespoke joke standing alone
    'Recovered from {place}. {hook}',
    'Found in {place}, which explains a lot. {hook}',
    '{hook} Appraised once, in {place}, by someone who immediately retired.',
    'Confiscated from {place}. {hook}',
    '{hook} Last catalogued in {place}. The catalog did not survive.',
  ];

  const PLACES = [
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
    'a paladin’s blind spot',
    'the gift shop after the boss room',
    'a dragon’s regifting pile',
    'the bottom of the dungeon’s suggestion box',
    'a necromancer’s starter home',
    'the walls (do not ask which walls)',
    'a tax audit that turned violent',
    'somebody’s last known location',
  ];

  // The System's built-in snark, by rarity. Always used as the offline fallback
  // when AI announcer mode is off or errors.
  const SYSTEM_LINES = {
    trash: [
      'Ah. One for your collection of regrets.',
      'The box screamed while making this. Now you know why.',
      'Somewhere in the dungeon, the thing that dropped this is still laughing. It has no lungs. It manages.',
      'Your disappointment has been logged and will be used against you.',
      'I would say you deserve better, but I have seen your combat log, and the dungeon has seen your will. Oh — you should write a will.',
      'Fun fact: the boxes are packed by the dungeon itself. This one was packed on a bad day. For you. It was packed on a bad day for you.',
    ],
    common: [
      'Technically loot.',
      'It is an item. That is the nicest thing anyone will say about it, including at its funeral. Or yours.',
      'It will outlive you. This is not a prophecy. It is actuarial.',
      'Adequate. Like you, on a good day. Statistically, you have had your good day.',
      'The dungeon produces thousands of these. The dungeon produces thousands of you, too, in a manner of speaking. Moving on.',
    ],
    uncommon: [
      'Do not spend it all in one crypt.',
      'Above average. The average includes everyone who died holding worse.',
      'Oh good, you will be insufferable about this for an hour. The dungeon has scheduled something for the hour after.',
      'Green means good. Down here, green also means several other things. Check it for the other things.',
    ],
    rare: [
      'A rare drop. Savor it. I have run the numbers on your next forty boxes, and on your next forty days. One of those lists is shorter.',
      'Rare! The previous holder asked me to tell whoever got it next: nothing. He was very busy dying at the time.',
      'Blue glow, real value, mild provenance issues. Everything down here has provenance issues. Some of the provenance is still looking for it.',
    ],
    epic: [
      'I am contractually required to sound impressed. Consider it done. The dungeon is also impressed. It is coming to see.',
      'Epic. The difficulty will now adjust to match. You did this to yourself, and I recorded it.',
      'Purple. The color of royalty, bruises, and things about to be both.',
    ],
    legendary: [
      'Well. Even I did not see that coming, and I see everything. I see what is behind you, for instance.',
      'Legendary. Somewhere, a god just checked its pockets. Do not be holding this when it finds you.',
      'Legendary. Please stop crying on the interface.',
      'One point five percent. Those were the odds. The other ninety-eight point five percent is on its way to congratulate you.',
    ],
    cursed: [
      'Congratulations! Do read the fine print. Oh, there is none. The fine print reads you.',
      'A magnificent item. The screaming is normal. Yours, I mean. The item’s screaming means something else entirely.',
      'Oh, this one. I wondered where it got to. So did its last four owners. Briefly.',
      'The good news: it is exactly as powerful as it looks. That was also the bad news. Enjoy.',
    ],
  };

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.tables = {
    BOX_TIERS, RARITIES, BASE_ITEMS, JUNK_OBJECTS, WONDROUS_OBJECTS,
    PREFIXES, SUFFIXES, MATERIALS, TRASH_DECORATIONS,
    LEGENDARY_NAMES, LEGENDARY_EPITHETS, CURSED_TWISTS,
    FLAVOR_FRAMES, PLACES, SYSTEM_LINES,
  };
})();
