// tables.js — all generation content lives here. No logic, no DOM.
// Loaded as a classic script (namespaced under LOOT) so the app runs from
// file:// — browsers block ES-module imports on the file protocol.
(() => {

  // Box tiers. Every "OPEN BOX" first rolls a box; the box's own rarity weights
  // decide what quality of loot falls out. Bronze boxes are the dungeon's way
  // of saying it isn't angry, just disappointed.
  const BOX_TIERS = [
    {
      id: 'bronze', name: 'Bronze', weight: 32,
      rarityWeights: { trash: 31, common: 32, uncommon: 20, rare: 12, epic: 4, legendary: 0.8, cursed: 0.2 },
    },
    {
      id: 'silver', name: 'Silver', weight: 27,
      rarityWeights: { trash: 18, common: 29, uncommon: 25, rare: 19, epic: 7, legendary: 1.6, cursed: 0.4 },
    },
    {
      id: 'gold', name: 'Gold', weight: 20,
      rarityWeights: { trash: 7, common: 18, uncommon: 27, rare: 27, epic: 15, legendary: 5, cursed: 1 },
    },
    {
      id: 'platinum', name: 'Platinum', weight: 12,
      rarityWeights: { trash: 2.5, common: 8, uncommon: 20, rare: 31, epic: 27, legendary: 9, cursed: 2.5 },
    },
    {
      id: 'legendary', name: 'Legendary', weight: 6,
      rarityWeights: { trash: 0.5, common: 2, uncommon: 8, rare: 25, epic: 38, legendary: 22, cursed: 4.5 },
    },
    {
      id: 'celestial', name: 'Celestial', weight: 3,
      rarityWeights: { trash: 0, common: 0.5, uncommon: 2, rare: 11, epic: 36, legendary: 44, cursed: 6.5 },
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
    // ── The crude drawer ───────────────────────────────────────────────────
    {
      name: 'Codpiece', type: 'armor', crude: true,
      statHooks: [
        'All of the coverage is concentrated in one heroic and frankly overstated region',
        'Enemies must save or stare; staring enemies take {X} psychic damage from what they are staring at',
      ],
      flavorHooks: [
        'Sized optimistically by its first owner and never resized by anyone since, out of respect or fear.',
        'It announces you. It announces you from the next room. It has arrived at parties you declined.',
      ],
    },
    {
      name: 'Toe Ring', type: 'trinket', crude: true,
      statHooks: [
        '+{X} to charm, but only against people with a very particular interest',
        'Cannot be removed while anyone nearby is barefoot; it wants to be seen',
      ],
      flavorHooks: [
        'It belonged to somebody’s father. It was his favorite. He wore it to family dinners. On purpose.',
        'Warm. Always warm. There is no toe in it. There is warmth in it.',
      ],
    },
    {
      name: 'Tankard', type: 'tool', crude: true,
      statHooks: [
        'Refills with something alcoholic every hour; the something is not consistent and is sometimes not liquid',
        'Drinking grants +{X} courage and -{X} to every roll that courage makes you attempt',
      ],
      flavorHooks: [
        'The rim is worn down on one side by ten thousand identical bad nights.',
        'Somebody carved “LAST ONE” into the base. The carving has been crossed out and redone eleven times.',
      ],
    },
    {
      name: 'Loincloth', type: 'armor', crude: true,
      statHooks: [
        'Coverage: negotiable. Confidence: unearned and total.',
        '+{X} to seduction, -{X} to being taken seriously by anyone holding a real weapon',
      ],
      flavorHooks: [
        'Barbarian-standard. It has seen more combat than most kingdoms and less soap than all of them.',
        'It has never been washed, only rested. It is resting now. Do not wake it.',
      ],
    },
    {
      name: 'Chastity Belt', type: 'armor', crude: true,
      statHooks: [
        'Protects, comprehensively, the one region nobody was aiming for anyway',
        'The key was lost {X} centuries ago. The lock has since developed opinions about that.',
      ],
      flavorHooks: [
        'A monument to one nobleman’s trust issues, still standing long after the marriage, the nobleman, and the kingdom.',
        'It clanks. In rhythm. With your walking. Everyone can hear the rhythm and everyone knows the rhythm.',
      ],
    },
    {
      name: 'Chamber Pot', type: 'tool', crude: true,
      statHooks: [
        'Effectiveness varies entirely with how the day is going',
        'Can be worn as a helmet. The dungeon logs everyone who does. The log is read aloud annually.',
      ],
      flavorHooks: [
        'Porcelain, gilt-rimmed, and used. Historically significant. Historically unwashed.',
        'A duke died on this. Mid-sentence. The sentence was a complaint about the pot.',
      ],
    },
    {
      name: 'Bone Whistle', type: 'trinket', crude: true,
      statHooks: [
        'Blowing it summons something within {X} miles that heard it and now wants to know who blew it',
        'The pitch is exactly wrong. Dogs weep. Men explain that they are not weeping.',
      ],
      flavorHooks: [
        'It is somebody’s. The bone, that is. It is somebody’s bone, and the somebody is nearby, and short one.',
        'Everyone who finds it blows it once. Everyone. Nobody has ever managed not to. You already have.',
      ],
    },
    {
      name: 'Wineskin', type: 'potion', crude: true,
      statHooks: [
        'Gets stronger as the night makes worse suggestions',
        'Restores {X} HP; removes an equal quantity of judgment and the memory of removing it',
      ],
      flavorHooks: [
        'The previous owner drank the whole thing, fought a bear, won, and cannot be told about it without crying.',
        'It sloshes when nobody is moving it. It is keeping its own hours.',
      ],
    },
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
      name: 'A Crusty Sock (Not From a Pair)',
      stats: ['Stiff enough to stand unaided, and it does', 'Armor: 0. Deterrent: considerable.'],
      flavor: 'Nobody has ever asked what happened to this sock. The dungeon volunteers the answer anyway, at night, in detail.',
      crude: true,
    },
    {
      name: 'Somebody’s Used Loincloth',
      stats: ['Emits a smell with a {X}-foot radius and, arguably, opinions', 'Cannot be burned. It has tried to burn itself.'],
      flavor: 'Still warm. It has been in this box for two hundred years and it is still warm. Take that up with someone else.',
      crude: true,
    },
    {
      name: 'A Chamber Pot, Recently Used',
      stats: ['Contents: present', 'Utility: 1/10, and that one point is spite'],
      flavor: 'The dungeon wants you to know it did not do this. The dungeon is naming no names. The dungeon is, however, looking at you.',
      crude: true,
    },
    {
      name: 'Half a Sausage (Gnawed)',
      stats: ['Restores {X} HP and a lifetime of questions', 'The teeth marks do not match any known jaw'],
      flavor: 'Someone was eating this. Someone stopped. The stopping was not voluntary and the sausage was not the reason.',
      crude: true,
    },
    {
      name: 'A Jar of Something',
      stats: ['Sloshes. Warm. Do not open. You will open it.', 'Value: {X} gold to the wrong sort of collector'],
      flavor: 'The label came off centuries ago. Everyone who has held it has arrived at the same theory and refused to say it out loud.',
      crude: true,
    },
    {
      name: 'A Tooth With a Filling Made of Gold',
      stats: ['Value: {X} gold, minus the dental extraction fee you already paid in kind', 'Still slightly warm from the jaw'],
      flavor: 'It was pulled recently and not by a dentist. The root is intact, which tells you about the technique and the hurry.',
      crude: true,
    },
    {
      name: 'A Bucket of Suspicious Broth',
      stats: ['Restores {X} HP', 'Anyone who watches you drink it takes {X} psychic damage'],
      flavor: 'There are things floating in it. Some of them are floating on purpose. One of them surfaced to look at you and went back down.',
      crude: true,
    },
    {
      name: 'The Previous Adventurer’s Underwear',
      stats: ['Armor: +0', 'You now know his name. He is telling you. He will not stop telling you.'],
      flavor: 'Laundered never. Recovered posthumously. The dungeon considers this a full set of remains and has closed the file.',
      crude: true,
    },
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
      name: 'The Never-Empty Tankard',
      stats: ['Refills forever with strong drink', 'Drinker gains +{X} to everything and -{X} to knowing what everything is'],
      flavor: 'Undefeated. Forty-one champions have tried to drain it. Their names are on the base, in the order they gave up, then in the order they died.',
      crude: true,
    },
    {
      name: 'Codpiece of the Unearned Legend',
      stats: ['Armor: +{X}', 'All who behold it must save or believe the rumours, which then become true'],
      flavor: 'It does nothing. The reputation does everything. Three wars ended because of a reputation this codpiece invented on the walk over.',
      crude: true,
    },
    {
      name: 'The Honest Mirror (Full Length)',
      stats: ['Shows you exactly as others see you, naked, in unforgiving light', '+{X} Wisdom, permanently, immediately, at a cost'],
      flavor: 'Nobody has ever looked twice. One man looked once and went to become a monk, in a hurry, on foot.',
      crude: true,
    },
    {
      name: 'Girdle of Absolute Continence',
      stats: ['You will never again need a privy', 'It holds everything. It is holding it now. It holds a running total.'],
      flavor: 'Blessed by a saint who died of something related. The wearer feels magnificent and, on some level they cannot name, overdue.',
      crude: true,
    },
    {
      name: 'The Sobering Stone',
      stats: ['Once per day: instantly cure any drunkenness', 'The cured party receives every memory at once, in order, at full volume'],
      flavor: 'Used twice in recorded history. Both users asked, immediately and sincerely, to be made drunk again.',
      crude: true,
    },
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
  const CRUDE_PREFIXES = [
    { text: 'Daddy’s', flavor: 'It was Daddy’s. Daddy had a whole thing going on. Nobody in the family discusses the thing.' },
    { text: 'Crotch-Warmed', stat: '+{X} to heat retention; the heat is not yours and never was' },
    { text: 'Piss-Soaked', stat: '-{X} to diplomacy, +{X} to territory disputes, which you will now win' },
    { text: 'Shit-Faced', stat: '+{X} damage, -{X} accuracy, +100% confidence, 0% recollection' },
    { text: 'Sweat-Cured', flavor: 'Aged in a gambeson for eleven years by a man who considered bathing a moral failing.' },
    { text: 'Fondled', flavor: 'Extensively. Lovingly. By many hands, over centuries. It has stopped flinching. That happened recently.' },
    { text: 'Chafing', stat: 'Deals {X} damage per hour to you, specifically, in the worst available place' },
    { text: 'Unwashed', flavor: 'The smell arrives four seconds before the item does and stays nine hours after it leaves.' },
    { text: 'Backdoor-Tested', stat: 'Certified by an inspector who has since changed careers, name, and continent' },
    { text: 'Well-Endowed', stat: '+{X} to a stat the dungeon has declined to name in mixed company' },
    { text: 'Post-Coital', flavor: 'It is exhausted, faintly smug, and would rather not talk right now.' },
    { text: 'Rank', stat: 'Enemies must save or gag; allies get no save, on purpose, as a lesson' },
    { text: 'Freshly Passed', flavor: 'Out of a goblin. Recently. The goblin is relieved. You should be many things, and relieved is not among them.' },
    { text: 'Cheeks-Out', stat: '+{X} to mobility, -{X} to armor coverage in the region most likely to be attacked' },
    { text: 'Drunk', stat: 'Rolls twice, takes whichever result it finds funnier' },
    { text: 'Grubby', flavor: 'The grime is load-bearing. Cleaned once. It fell apart and the cleaner was billed.' },
    { text: 'Bottom-Shelf', stat: '-{X} to everything except regret, which scales beautifully' },
    { text: 'Suspiciously Sticky', flavor: 'Four adventurers have asked what it is. The dungeon answered one of them. He walked into the sea.' },
  ];

  const CLEAN_PREFIXES = [
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

  const PREFIXES = [...CRUDE_PREFIXES, ...CLEAN_PREFIXES];

  // Suffixes: "of X" titles with optional bonus jokes.
  const CRUDE_SUFFIXES = [
    { text: 'of Girth', stat: '+{X} to girth. The dungeon measured. The dungeon writes it down. The dungeon tells people.' },
    { text: 'of the Shit-Faced Drunk', stat: '+{X} damage, -{X} to hitting the intended target, +{X} to hitting a friend' },
    { text: 'of the Foot Fetish', flavor: 'It only activates near bare feet. It has never explained this. It has never needed to.' },
    { text: 'of Unwiped Shame', stat: 'Leaves a trail. Trackers gain +{X}. So does everyone else with a nose.' },
    { text: 'of the Back Alley', flavor: 'Acquired behind a tavern, from a man who was leaving anyway, at a price that suited his hurry.' },
    { text: 'of Premature Discharge', stat: 'Fires early. Always early. It has apologized {X} times and improved zero.' },
    { text: 'of the Weeping Groin', stat: 'Deals {X} damage to the wielder\'s dignity per round; the wound is emotional and slightly literal' },
    { text: 'of Grandma’s Basement', flavor: 'It was down there for sixty years. So was the box. So was the reason for the box.' },
    { text: 'of the Wet Fart', stat: 'Emits a sound on activation. Enemies must save or laugh. You must save or die of it.' },
    { text: 'of Regrettable Choices', flavor: 'Every previous owner made the same decision at the same moment. The dungeon has the footage.' },
    { text: 'of the Village Bicycle', stat: 'Everyone has had a turn. It remembers all of them. It has favorites and it is not you.' },
    { text: 'of Rancid Confidence', stat: '+{X} to intimidation, sourced entirely from smell' },
    { text: 'of the Third Nipple', flavor: 'It has one. Nobody asked it to have one. It is not sorry, and it will show anyone.' },
    { text: 'of Cheap Liquor', stat: 'Restores {X} HP, removes {X} memories, keeps the worst one for contrast' },
    { text: 'of the Bad Decision', flavor: 'It was funny at the time. Nobody involved thinks it is funny now. It thinks it is hilarious.' },
    { text: 'of Swamp Ass', stat: '-{X} to comfort, +{X} to a swamp that follows you' },
    { text: 'of the Morning After', stat: 'All effects are excellent, then arrive again at dawn, worse, uninvited' },
    { text: 'of Uncomfortable Length', stat: '+{X} reach. Doorways are now a negotiation you lose.' },
    { text: 'of the Tavern Wench’s Revenge', flavor: 'She was owed money. She was paid in this. She would like it known she came out ahead.' },
    { text: 'of Loose Morals', stat: 'Works for anyone who picks it up, immediately, enthusiastically, with no loyalty whatsoever' },
  ];

  const CLEAN_SUFFIXES = [
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

  const SUFFIXES = [...CRUDE_SUFFIXES, ...CLEAN_SUFFIXES];

  // Materials: mostly for mid-tier names.
  const CRUDE_MATERIALS = [
    'Ball-Sweat Bronze',
    'Unwashed Leather',
    'Rendered Goblin Fat',
    'Tavern-Floor Oak',
    'Piss-Tempered Steel',
    'Boiled Arse-Hide',
    'Backwash Crystal',
    'Sour-Milk Marble',
    'Bathhouse Copper',
    'Knuckle Bone',
    'Latrine-Cured Tin',
    'Hangover Glass',
  ];

  const CLEAN_MATERIALS = [
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

  const MATERIALS = [...CRUDE_MATERIALS, ...CLEAN_MATERIALS];

  // Trash-tier name decorations. Trash doesn't earn a real prefix.
  const TRASH_DECORATIONS = {
    pre: [
      'Broken', 'Bent', 'Chewed', 'Soggy', 'Complimentary', 'Slightly Melted',
      'Pre-Looted', 'Posthumous', 'Court-Evidence', 'Biodegrading', 'Motivational',
    ],
    crudePre: [
      'Crusty', 'Pissed-On', 'Gnawed', 'Sticky', 'Half-Digested', 'Sweaty',
      'Flea-Ridden', 'Skidmarked', 'Mouldy', 'Third-Hand', 'Suspiciously Warm',
    ],
    post: [
      '(Cracked)', '(Damp)', '(Refurbished)', '(Final Sale)', '(Some Assembly Missing)',
      '(Haunted, but Lazy)', '(Recovered From a Drain)', '(As-Is)', '(Smells Wrong)',
      '(Previously Swallowed)', '(Warranty Voided by the Incident)', '(Found in the Walls)',
    ],
    crudePost: [
      '(Previously Excreted)', '(Do Not Sniff)', '(Still Warm)', '(Crotch-Adjacent)',
      '(Licked)', '(Recovered From a Corpse, Badly)', '(Smells of Regret and Urine)',
      '(Someone Slept On This)', '(Sold As Seen, Wept Over Later)',
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

  const CRUDE_LEGENDARY_EPITHETS = [
    'the Unwiped',
    'Splitter of Trousers',
    'Bane of the Marriage Bed',
    'the {base} They Do Not Discuss at Dinner',
    'Ruiner of Perfectly Good Underwear',
    'the Reason the Brothel Has a Waiver',
    'Girthbringer',
    'the {base} That Made a Bishop Swear',
    'Emptier of Bladders',
    'Patron of the Morning-After Regret',
    'the Unflushed',
    'She Who Ends Bloodlines Personally',
    'the {base} of a Thousand Bad Nights',
    'Deflowerer of the Ninth Floor',
    'the Sticky Verdict',
  ];

  const CLEAN_LEGENDARY_EPITHETS = [
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

  const LEGENDARY_EPITHETS = [...CRUDE_LEGENDARY_EPITHETS, ...CLEAN_LEGENDARY_EPITHETS];

  // Cursed items: monkey's-paw twists appended to otherwise-glorious stats.
  const CRUDE_CURSED_TWISTS = [
    '+10 to every stat. You are permanently, visibly aroused in combat. Enemies have filed a complaint. The complaint was upheld.',
    'Grants perfect health. You will shit yourself once per day, at a time the item selects for maximum audience.',
    'You are irresistible to everyone who meets you. Everyone. The dungeon is full of things that meet you.',
    'Doubles your lifespan. You will spend the extra years incontinent and lucid, in that order, aware of both.',
    '+15 Charisma. Your voice is now your mother’s. Everyone hears it. You hear it most.',
    'You never need to eat again. You will still be hungry. Constantly. For something the item will eventually name.',
    'Grants immortality. You stop aging. Nothing else stops. Your bladder in particular does not stop.',
    'You become the greatest lover in the realm. The realm keeps records. The records are public. Your mother has read them.',
    'All your wounds heal overnight. You wake covered in someone else’s fluids and a note that says “even.”',
    'Grants perfect memory. You now remember every single thing you have ever done drunk, in order, forever.',
    'You can speak to any creature. They all want to talk about your body. They have notes. The notes are detailed.',
    'Absolute protection from harm. You sweat continuously and horribly. Nobody will stand near enough to save.',
  ];

  const CLEAN_CURSED_TWISTS = [
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

  const CURSED_TWISTS = [...CRUDE_CURSED_TWISTS, ...CLEAN_CURSED_TWISTS];

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

  const CRUDE_PLACES = [
    'the brothel’s lost-and-found',
    'a latrine pit with unusually good acoustics',
    'the floor of a tavern, at closing, in a puddle',
    'under a barbarian’s loincloth',
    'the bathhouse drain on the ninth floor',
    'a drunk paladin’s saddlebag',
    'somewhere inside a troll, retrieved the slow way',
    'the back room of an establishment with no sign',
    'a bachelor party that became a war crime',
    'the bottom of a chamber pot in a duke’s bedroom',
    'a bard’s bedroll, which explains the smell',
    'the crotch of a very old suit of armor',
  ];

  const CLEAN_PLACES = [
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

  const PLACES = [...CRUDE_PLACES, ...CLEAN_PLACES];

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

  // The crude register, kept in its own pool so the generator can lean on
  // it heavily while the drier originals stay in rotation.
  const CRUDE_SYSTEM_LINES = {
    trash: [
      'That is not loot. That is what loot leaves behind.',
      'I have watched a goblin shit with more precision than that box just managed.',
      'Keep it. Nobody else will ever want it, and neither will you, but keep it.',
      'The box is laughing. I checked. It has no mouth. It found a way.',
      'Somewhere your ancestors are watching this and quietly revising the family tree.',
      'Absolute arse. And I mean that technically — I looked up the classification.',
      'A thousand years this dungeon has stood, and it produced that, for you, on purpose.',
      'The loot table coughed. That was the cough.',
      'Even the mimics are embarrassed, and they eat people for a living.',
      'Congratulations. You have been officially pissed on by probability.',
      'I would call it garbage, but garbage decomposes and this will outlive us both out of spite.',
      'Do not look at me like that. I did not pack it. I only laugh.',
      'This is what the dungeon scrapes off itself at the end of a long week.',
      'You wanted treasure. The dungeon heard “novelty item” and stopped listening.',
      'A rat just found something better in a drain. It is having a better day than you.',
      'That box had one job and did the equivalent of showing up drunk and naked.',
      'Put it in the bag. Let it sit with the others. Let them talk about you.',
      'Ah. Shit. Literally, in one documented case, and I am not saying which.',
      'The box shat this out. I watched it happen. It was not dignified for either of you.',
      'You reached into a magic box and pulled out this. Somewhere, your father feels a disappointment he cannot explain.',
      'I have seen corpses looted with more enthusiasm than you are about to muster.',
      'Congratulations, you absolute sponge. That is not a compliment. Sponges are at least useful and absorbent.',
      'This is the loot equivalent of a wet fart in a crowded lift. Technically an event. Universally unwelcome.',
      'Pick it up. Go on. Let everyone watch you decide it is worth keeping.',
    ],
    common: [
      'It exists. So do wasps. Existence is not an achievement.',
      'Perfectly functional and completely forgettable, like a handshake or a marriage.',
      'Serviceable. That word is doing an enormous amount of work and it is very tired.',
      'You could do worse. You have done worse. I have the log. Shall I read it out?',
      'The kind of item you die holding and nobody mentions at the funeral.',
      'Grey. The colour of pigeons, wet cardboard, and your combat record.',
      'It is fine. Fine is the loudest insult in the language and I mean every letter of it.',
      'This will get you through the next four rooms and disappoint you in all of them.',
      'A workhorse. Not a good horse. A horse that works because the alternative is glue.',
      'You will use this until something better drops, then drop it without a word. It knows. It has been left before.',
      'Middle of the road. Which, down here, is where the flattened things are.',
      'Neither a triumph nor a disaster. Just a Tuesday with a handle on it.',
      'Adequate. If I had shoulders, I would be shrugging with all of them.',
      'The dungeon made this while thinking about something else entirely.',
      'It will do the job. It will not enjoy the job. Neither will you. That is teamwork.',
      'Not every drop can be a story. Some drops are just weight in the bag.',
      'You are welcome, I suppose. That is the enthusiasm the item has earned.',
      'Technically loot. Barely. Like a piss is technically a bath.',
      'It works. That is the whole review. That is also your annual performance review.',
      'Middling. Forgettable. You two are going to get on famously.',
      'Not shit. Not good. The exact texture of your entire personality.',
    ],
    uncommon: [
      'Green. The colour of hope, envy, and the mould on the last one.',
      'Genuinely useful. Do not get used to it, and do not tell the others.',
      'Well now. Somebody has been sacrificing to somebody.',
      'A real upgrade. Your standards have been raised by roughly two inches. Enjoy the view.',
      'Not bad, you sweaty little opportunist. Not bad at all.',
      'The dungeon slipped. Grab it before the dungeon notices it slipped.',
      'You will get four good rooms out of this and one very memorable bad one.',
      'Uncommon. Which is also the word I would use for your personal hygiene.',
      'This is the part where you feel briefly competent. Savour it. It is a short scene.',
      'Solid. Dependable. Everything you are not, hanging conveniently off your belt.',
      'A step up. Small step. Still a step. Try not to trip on it.',
      'Now that is a proper bit of kit. Try not to lose it in a bog like the last one.',
      'I am nodding. Slowly. Do not push it.',
      'It does what it says. Rare quality, that. Around here, so is saying anything true.',
      'The dungeon is testing whether kindness works on you. Early data: inconclusive.',
      'Good. Now the difficulty knows you have it, and the difficulty is a gossip.',
      'You are up. Marginally. Statistically. Do not make a speech.',
      'Green. Like the thing growing in your boots that you have decided not to investigate.',
      'Better than you deserve, which is a low bar I keep watching you limbo under.',
      'Oh, look at you. Get it out. Show everyone. Nobody is going to clap but get it out anyway.',
      'A genuine upgrade. Try not to embarrass it the way you embarrassed the last one.',
    ],
    rare: [
      'Oh, that is proper. That is a genuinely proper piece of kit and I hate saying it.',
      'Blue. The colour of the sky you will never see again, and of this, which is nicer anyway.',
      'You have earned nothing and received something. That is the dungeon all over.',
      'Rare. Somebody died for one of these last week. He was better than you. Sleep on that.',
      'Look at it. Go on. Get it out and look at it. You will not get many of these.',
      'Now you are dangerous. Mildly. In the way a drunk with a bottle is dangerous.',
      'That is a real drop. I am obliged to note it in the record. I am doing so bitterly.',
      'The bastards upstairs are going to hear about this and adjust something.',
      'Rare. Roughly one in five. So: better odds than your last four relationships.',
      'Yes. Fine. Well done. There, I said it. Do not make me say it again.',
      'This will carry you for a while. Longer than your friends did.',
      'Something in the dark just stopped chewing and looked up. That is about you now.',
      'A proper find. Wipe it first. You do not know where the dungeon has been. I do.',
      'That is worth more than everything else on your person, including the person.',
      'The dungeon gave you a good one. It wants something. It always wants something.',
      'Rare drop, and you had the decency to look surprised. Charming.',
      'Hold it up. Let the room see. Let the room resent you. It is good for circulation.',
      'Rare! Go on, tell someone. Tell a stranger. Watch their face do the thing where they stop caring mid-sentence.',
      'Blue. Rare. Genuinely good. I am as shocked as you and I have considerably better information.',
      'You lucky bastard. And I mean that with the full weight of what I know about your parents.',
    ],
    epic: [
      'Now we are talking. Now we are properly, filthily talking.',
      'Purple as a bad bruise and twice as memorable.',
      'Epic. I would say you earned it, but I have watched you fight and we both know.',
      'That is the good stuff. That is the stuff that gets people followed home.',
      'Somebody just lost this permanently. His loss is loud and your gain is louder.',
      'Oh, that is obscene. That is genuinely obscene and I am delighted.',
      'The difficulty just recalculated. It did the maths twice. It is coming anyway.',
      'Epic drop. Try to look like this happens to you. It does not. But try.',
      'That thing is going to make you insufferable and I am going to enjoy watching it.',
      'You are carrying something that outclasses you by a considerable margin. Do not embarrass it.',
      'One in eight. And it went to the sweatiest person in the room, as always.',
      'This is above your station, your skill level, and frankly your hygiene bracket.',
      'A serious item. Handle it better than you handle everything else.',
      'The dungeon does not hand these out. The dungeon lost a bet. I was the bet.',
      'Epic. And you will still die to something stupid. But you will die well-equipped.',
      'That will end arguments. Several of them. Permanently.',
      'Take it. Go on. Before the dungeon reads its own paperwork.',
      'Well, piss on my circuits. That is an actual, genuine, upsettingly good item.',
      'Purple. The colour of royalty, bruises, and whatever you will be once the dungeon reads this drop log.',
      'Epic. Somewhere a better adventurer just felt a chill and does not know why. It is you. You are the chill. Enjoy it, briefly.',
    ],
    legendary: [
      'Oh, you filthy, lucky, undeserving sod. LOOK at it.',
      'Legendary. I am going to have to file something. Several somethings. In triplicate.',
      'The dungeon has never given me a reason to raise my voice until precisely now.',
      'That is a weapon of consequence in the hands of a man who loses his own boots.',
      'Somewhere a hero who trained forty years just got a cursed spoon. And you got that.',
      'Legendary! Get it out! Wave it about! You have earned exactly one wave!',
      'I have watched ten thousand boxes open. This is in the top nine.',
      'A god is going to want that back. A god is going to send someone. Bring a friend.',
      'That item has a name, a history, and standards. You have none of those.',
      'One in eighteen. And the dungeon cannot believe it either.',
      'The floor is going to remember this. The floor talks. The floor talks to the walls.',
      'Legendary. Frame it. Sleep with it. Neglect your responsibilities over it. I do not care.',
      'That is the sort of drop that starts a war and ends a marriage, usually in that order.',
      'Oh, magnificent. Absolutely magnificent. And in YOUR hands. The comedy writes itself.',
      'You have peaked. Right here. Everything after this is a slow, dignified decline.',
      'The auditors have been notified. They are not coming to congratulate you.',
      'Legendary drop. Say nothing clever. You will ruin it. You always ruin it.',
      'Oh, you jammy shit. You absolute horseshoe-swallowing bastard. Look at it. LOOK at it.',
      'Legendary. I need a moment. Not for you. I do not have moments for you. This one is mine.',
      'A god just felt that. A god just sat up in the dark and asked who. Do not be holding it when the answer arrives.',
      'One point five percent. One point five. And it went to you, of all the sweating, gormless meat in this dungeon.',
    ],
    cursed: [
      'Oh, delicious. That one is going to cost you something you cannot itemise.',
      'Beautiful. Powerful. Absolutely riddled. Enjoy every one of the minutes you have left.',
      'It has already started. You will not notice for eleven days. Mark the calendar.',
      'Cursed. And you picked it up immediately. You did not even hesitate. I love you.',
      'That is going to do things to you that require a specialist and a very discreet one.',
      'It chose you. It could have waited for someone better. It chose you. Sit with that.',
      'The power is real. So is the price. The price is negotiable the way weather is negotiable.',
      'Whatever it asks for later, remember: you picked it up in a good mood.',
      'Oh, that one is nasty. That one has a personality and the personality has plans.',
      'Congratulations on your new co-owner. It considers you the junior partner.',
      'Cursed. About one in ninety. The dungeon was saving that for someone special and settled for you.',
      'It is going to be so good, and then it is going to be so, so bad.',
      'You will get about six glorious hours. Enjoy them loudly. Everyone will hear the rest.',
      'That item has outlived four owners and remembers all their faces. It is learning yours now.',
      'Take it. Absolutely take it. I want to see what happens. I want that very much.',
      'Powerful, gorgeous, and quietly ruining you from the inside. Like most of your decisions.',
      'Cursed! And the best part is you will keep using it. They always keep using it.',
      'Oh, that is a bad one. That is a genuinely, deliciously, catastrophically bad one. I am thrilled.',
      'Magnificent. Powerful. Absolutely going to ruin you in a way that will require a specialist and a bucket.',
      'You have picked up something that had already picked you up. It got there first. It usually does.',
      'Enjoy it. Truly. And when it starts, and it will start, remember that I said nothing and that I was smiling.',
    ],
  };

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.tables = {
    BOX_TIERS, RARITIES, BASE_ITEMS, JUNK_OBJECTS, WONDROUS_OBJECTS,
    PREFIXES, SUFFIXES, MATERIALS, TRASH_DECORATIONS,
    LEGENDARY_NAMES, LEGENDARY_EPITHETS, CURSED_TWISTS,
    FLAVOR_FRAMES, PLACES, SYSTEM_LINES,
    // Crude-only pools. The generator draws from these most of the time (see
    // CRUDE_BIAS) so the register stays filthy instead of merely occasional.
    CRUDE_PREFIXES, CRUDE_SUFFIXES, CRUDE_MATERIALS,
    CRUDE_LEGENDARY_EPITHETS, CRUDE_CURSED_TWISTS, CRUDE_PLACES,
    CRUDE_SYSTEM_LINES,
  };
})();
