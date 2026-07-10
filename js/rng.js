// rng.js — seeded random number generation (mulberry32).
// Pass ?seed=123 in the URL for reproducible loot; otherwise seeded from entropy.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeRng(seed) {
    const s = Number.isFinite(seed) ? seed : (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    const random = mulberry32(s);
    return {
      seed: s,
      random,
      // True with probability p
      chance(p) {
        return random() < p;
      },
      // Integer in [min, max] inclusive
      int(min, max) {
        return min + Math.floor(random() * (max - min + 1));
      },
      pick(arr) {
        return arr[Math.floor(random() * arr.length)];
      },
      // Pick from [{weight, ...}] proportionally to weight
      weighted(arr) {
        const total = arr.reduce((sum, e) => sum + e.weight, 0);
        let roll = random() * total;
        for (const entry of arr) {
          roll -= entry.weight;
          if (roll <= 0) return entry;
        }
        return arr[arr.length - 1];
      },
    };
  }

  // Reads ?seed= from a query string ("?seed=123"); returns undefined if absent/invalid.
  function seedFromQuery(search) {
    const raw = new URLSearchParams(search).get('seed');
    if (raw === null) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n >>> 0 : undefined;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.rng = { mulberry32, makeRng, seedFromQuery };
})();
