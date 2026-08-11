// generator.js — pure item-generation logic. No DOM, no storage.
// Takes an rng (see rng.js) so results are reproducible under ?seed=.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const {
    BOX_TIERS, RARITIES, BASE_ITEMS, PREFIXES, SUFFIXES, MATERIALS,
    TRASH_DECORATIONS, LEGENDARY_NAMES, LEGENDARY_EPITHETS,
    CURSED_TWISTS, FLAVOR_FRAMES, PLACES, SYSTEM_LINES,
    CRUDE_PREFIXES, CRUDE_SUFFIXES, CRUDE_MATERIALS,
    CRUDE_LEGENDARY_EPITHETS, CRUDE_CURSED_TWISTS, CRUDE_PLACES,
    CRUDE_SYSTEM_LINES,
    JUNK_OBJECTS, WONDROUS_OBJECTS,
  } = globalThis.LOOT.tables;


  // The house register is crude. Each flavour pool comes in two halves — the
  // filthy one and the drier originals — and this draws from the filthy half
  // most of the time, so the tone is the rule rather than a lucky roll. The
  // dry entries still surface often enough to keep the joke from flattening.
  const CRUDE_BIAS = 0.75;
  const CRUDE_BASE_ITEMS = BASE_ITEMS.filter((b) => b.crude);
  const PLAIN_BASE_ITEMS = BASE_ITEMS.filter((b) => !b.crude);

  function pickCrude(rng, crudePool, cleanPool) {
    const useCrude = crudePool?.length && (!cleanPool?.length || rng.chance(CRUDE_BIAS));
    return rng.pick(useCrude ? crudePool : cleanPool);
  }

  // Every opening rolls a box tier first; the tier's own weights decide loot rarity.
  function pickBoxTier(rng, forcedId) {
    if (forcedId) {
      const forced = BOX_TIERS.find((b) => b.id === forcedId);
      if (forced) return forced;
    }
    return rng.weighted(BOX_TIERS);
  }

  function pickRarity(rng, boxTier, forcedId) {
    if (forcedId) {
      const forced = RARITIES.find((r) => r.id === forcedId);
      if (forced) return forced;
    }
    const weights = boxTier?.rarityWeights;
    const pool = weights
      ? RARITIES.map((r) => ({ ...r, weight: weights[r.id] ?? r.weight }))
      : RARITIES;
    return rng.weighted(pool);
  }

  // Chance that a given rarity yields a random object instead of equipment.
  // Low rarity -> absurd junk; rare and up -> wondrous (powerful, still unsettling).
  const OBJECT_CHANCE = { trash: 0.55, common: 0.25, uncommon: 0, rare: 0.2, epic: 0.2, legendary: 0.15, cursed: 0 };

  // Rarity tier -> the {X} magnitude range for stat lines.
  const POWER = [
    [1, 1], // trash
    [1, 2], // common
    [2, 3], // uncommon
    [3, 4], // rare
    [4, 6], // epic
    [7, 9], // legendary
    [7, 9], // cursed (looks legendary right up until it doesn't)
  ];

  function fill(template, rng, tier) {
    const [lo, hi] = POWER[tier];
    // Each {X} gets its own roll so "d6" counts and bonuses can differ.
    return template.replaceAll('{X}', () => String(rng.int(lo, hi)));
  }

  function coreStat(base, rng, tier) {
    const [lo, hi] = POWER[tier];
    const n = rng.int(lo, hi);
    switch (base.type) {
      case 'weapon':
        return tier === 0
          ? 'Damage: 1d4 - 1 (minimum 0, usually 0)'
          : `Damage: ${n}d6 + ${rng.int(lo, hi)}`;
      case 'armor':
        return tier === 0 ? 'Armor: +0 (it tries)' : `Armor: +${n}`;
      case 'potion':
        return tier === 0 ? 'Potency: expired' : `Potency: ${n * 10 + rng.int(0, 9)}%`;
      case 'scroll':
        return tier === 0
          ? 'Spell level: 0 (the scroll is blank on one side; unfortunately, both sides are that side)'
          : `Spell level: ${n} — single use (allegedly)`;
      case 'trinket':
        return tier === 0 ? 'Aura: none detected' : `Aura: ${n * 10} ft radius of smug`;
      case 'tool':
        return tier === 0 ? 'Utility: 1/10' : `Utility: ${Math.min(n + 4, 10)}/10`;
      default:
        return `Power: ${n}`;
    }
  }

  function bonusStat(rng, tier) {
    const roll = rng.random();
    if (roll < 0.4) {
      const max = rng.int(30, 60);
      const cur = tier === 0 ? rng.int(1, 4) : rng.int(Math.floor(max * 0.5), max);
      const note = tier === 0 ? ' (do not ask)' : cur < max * 0.7 ? ' (it has been through something)' : '';
      return `Durability: ${cur}/${max}${note}`;
    }
    if (roll < 0.7) {
      return `Weight: ${rng.int(1, 12)} lbs, emotionally heavier`;
    }
    const value = tier === 0 ? rng.int(0, 2) : rng.int(5, 50) * (tier + 1);
    return `Value: ${value} gold (before the merchant sees you coming)`;
  }

  // Legendary proper names shouldn't repeat back-to-back in a session; cycle
  // through the pool before reusing any. The memory lives on the rng instance
  // so identical seeds still produce identical sequences (reproducibility).
  function pickLegendaryName(rng) {
    const used = (rng.usedLegendaryNames ??= new Set());
    let pool = LEGENDARY_NAMES.filter((n) => !used.has(n));
    if (pool.length === 0) {
      used.clear();
      pool = LEGENDARY_NAMES;
    }
    const name = rng.pick(pool);
    used.add(name);
    return name;
  }

  function buildName(rng, base, tier) {
    const parts = { prefix: null, suffix: null, material: null };
    let name;

    if (tier === 0) {
      name = rng.chance(0.6)
        ? `${pickCrude(rng, TRASH_DECORATIONS.crudePre, TRASH_DECORATIONS.pre)} ${base.name}`
        : `${base.name} ${pickCrude(rng, TRASH_DECORATIONS.crudePost, TRASH_DECORATIONS.post)}`;
    } else if (tier === 1) {
      parts.material = rng.chance(0.35) ? pickCrude(rng, CRUDE_MATERIALS, MATERIALS) : null;
      name = parts.material ? `${parts.material} ${base.name}` : base.name;
    } else if (tier === 2) {
      if (rng.chance(0.5)) {
        parts.prefix = pickCrude(rng, CRUDE_PREFIXES, PREFIXES);
        name = `${parts.prefix.text} ${base.name}`;
      } else {
        parts.suffix = pickCrude(rng, CRUDE_SUFFIXES, SUFFIXES);
        name = `${base.name} ${parts.suffix.text}`;
      }
    } else if (tier === 3 || tier === 4) {
      // Cap names at three parts: prefix + base + suffix, with material
      // occasionally standing in for the prefix at epic.
      if (tier === 4 && rng.chance(0.35)) {
        parts.material = pickCrude(rng, CRUDE_MATERIALS, MATERIALS);
        parts.suffix = pickCrude(rng, CRUDE_SUFFIXES, SUFFIXES);
        name = `${parts.material} ${base.name} ${parts.suffix.text}`;
      } else {
        parts.prefix = pickCrude(rng, CRUDE_PREFIXES, PREFIXES);
        parts.suffix = pickCrude(rng, CRUDE_SUFFIXES, SUFFIXES);
        name = `${parts.prefix.text} ${base.name} ${parts.suffix.text}`;
      }
    } else {
      // Legendary & cursed: a proper name and an epithet.
      const proper = pickLegendaryName(rng);
      const epithet = pickCrude(rng, CRUDE_LEGENDARY_EPITHETS, LEGENDARY_EPITHETS).replaceAll('{base}', base.name);
      name = `${proper}, ${epithet}`;
    }

    return { name, ...parts };
  }

  function buildStats(rng, base, tier, parts) {
    const stats = [coreStat(base, rng, tier)];
    stats.push(fill(rng.pick(base.statHooks), rng, tier));
    const affixStat = parts.prefix?.stat ?? parts.suffix?.stat;
    if (affixStat) stats.push(fill(affixStat, rng, tier));
    if (stats.length < 4 && rng.chance(0.7)) stats.push(bonusStat(rng, tier));
    return stats;
  }

  function buildFlavor(rng, base, parts) {
    const hook = rng.pick(base.flavorHooks);
    let flavor = rng.pick(FLAVOR_FRAMES)
      .replaceAll('{hook}', hook)
      .replaceAll('{place}', pickCrude(rng, CRUDE_PLACES, PLACES));
    const affixFlavor = parts.prefix?.flavor ?? parts.suffix?.flavor;
    if (affixFlavor && rng.chance(0.6)) flavor += ` ${affixFlavor}`;
    return flavor;
  }

  // Junk & wondrous objects carry their whole joke with them; no affixes,
  // no core stat — just the object, exactly as unsettling as written.
  function generateObject(rng, rarity) {
    const pool = rarity.tier <= 1 ? JUNK_OBJECTS : WONDROUS_OBJECTS;
    const obj = pickCrude(rng, pool.filter((o) => o.crude), pool.filter((o) => !o.crude));
    return {
      name: obj.name,
      base: obj.name,
      type: 'object',
      rarity: { id: rarity.id, name: rarity.name, tier: rarity.tier },
      stats: obj.stats.map((s) => fill(s, rng, rarity.tier)),
      flavor: obj.flavor,
      systemLine: pickCrude(rng, CRUDE_SYSTEM_LINES[rarity.id], SYSTEM_LINES[rarity.id]),
    };
  }

  // opts: { boxTier?: BOX_TIERS entry, rarity?: rarity id to force, noObjects?: bool }
  function generateItem(rng, opts = {}) {
    const boxTier = opts.boxTier ?? null;
    const rarity = pickRarity(rng, boxTier, opts.rarity);

    if (!opts.noObjects && rng.chance(OBJECT_CHANCE[rarity.id] ?? 0)) {
      return generateObject(rng, rarity);
    }

    const tier = rarity.tier;
    // Same bias for the base item itself: the crude drawer comes up most
    // of the time, so the noun is usually as tasteless as the adjectives.
    const base = pickCrude(rng, CRUDE_BASE_ITEMS, PLAIN_BASE_ITEMS);
    const parts = buildName(rng, base, tier);
    const stats = buildStats(rng, base, tier, parts);

    if (rarity.id === 'cursed') {
      stats.push(`Curse: ${pickCrude(rng, CRUDE_CURSED_TWISTS, CURSED_TWISTS)}`);
    }

    return {
      name: parts.name,
      base: base.name,
      type: base.type,
      rarity: { id: rarity.id, name: rarity.name, tier },
      stats,
      flavor: buildFlavor(rng, base, parts),
      systemLine: pickCrude(rng, CRUDE_SYSTEM_LINES[rarity.id], SYSTEM_LINES[rarity.id]),
    };
  }

  // One full box opening: roll the box, then what falls out of it.
  // opts.boxTier here is a tier id string (or undefined for a natural roll).
  function openBox(rng, opts = {}) {
    const boxTier = pickBoxTier(rng, opts.boxTier);
    const item = generateItem(rng, { ...opts, boxTier });
    return { boxTier: { id: boxTier.id, name: boxTier.name }, item };
  }

  // Plain-text rendering, used by the share button and sample dumps.
  function itemToText(item, boxTier) {
    return [
      ...(boxTier ? [`<< ${boxTier.name.toUpperCase()} BOX >>`] : []),
      `[${item.rarity.name.toUpperCase()}] ${item.name}`,
      item.base === item.name
        ? `${item.rarity.name} ${item.type}`
        : `${item.rarity.name} ${item.base} (${item.type})`,
      ...item.stats.map((s) => `  * ${s}`),
      `"${item.flavor}"`,
      `The System: "${item.systemLine}"`,
    ].join('\n');
  }

  // A spoken version of the item for voice mode: reads the item out loud —
  // rarity + name, each stat, then the flavor blurb. Kept punctuation-clean so
  // the voice engine phrases it (unlike itemToText, which has UI markup like
  // [RARITY] and bullet stars). The System's line is appended by the caller so
  // it lands as the final punchline sentence.
  function itemToSpeech(item) {
    const asSentence = (s) => {
      const t = String(s).trim();
      return /[.!?…]$/.test(t) ? t : `${t}.`;
    };
    return [
      // Rarity stands alone so the performance engines put a real beat
      // between the verdict and the name. Joined into one sentence, every
      // engine runs them together and the reveal lands flat.
      asSentence(item.rarity.name),
      asSentence(item.name),
      ...item.stats.map(asSentence),
      asSentence(item.flavor),
    ].join(' ');
  }

  const LOOT = globalThis.LOOT;
  LOOT.generator = { pickBoxTier, pickRarity, generateItem, openBox, itemToText, itemToSpeech };
})();
