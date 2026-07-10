// store.js — collection & stats persistence. Memory-first, mirrored to
// localStorage so the collection survives the browser (unlike its owners).
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const KEY = 'lootcrawl.v1';
  const MAX_ITEMS = 500; // the System archives the overflow; the archive is a pit

  // In-memory fallback lets Node tests and storage-less browsers still run.
  const memoryStore = new Map();
  const backend = (() => {
    try {
      const ls = globalThis.localStorage;
      ls.setItem(`${KEY}.probe`, '1');
      ls.removeItem(`${KEY}.probe`);
      return ls;
    } catch {
      return {
        getItem: (k) => memoryStore.get(k) ?? null,
        setItem: (k, v) => memoryStore.set(k, String(v)),
        removeItem: (k) => memoryStore.delete(k),
      };
    }
  })();

  function blankState() {
    return {
      version: 1,
      boxesOpened: 0,
      rarityCounts: {},
      boxTierCounts: {},
      trashStreak: 0,
      sharesUsed: 0,
      unlocked: [],
      settings: {},
      items: [], // newest first: { item, boxTier, ts }
    };
  }

  let state = load();

  function load() {
    try {
      const raw = backend.getItem(KEY);
      if (!raw) return blankState();
      const parsed = JSON.parse(raw);
      if (parsed?.version !== 1) return blankState();
      return { ...blankState(), ...parsed };
    } catch {
      return blankState();
    }
  }

  function save() {
    try {
      backend.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: keep playing from memory. The System shrugs.
    }
  }

  function recordOpening(opening, ts) {
    const { item, boxTier } = opening;
    state.boxesOpened += 1;
    state.rarityCounts[item.rarity.id] = (state.rarityCounts[item.rarity.id] || 0) + 1;
    state.boxTierCounts[boxTier.id] = (state.boxTierCounts[boxTier.id] || 0) + 1;
    state.trashStreak = item.rarity.id === 'trash' ? state.trashStreak + 1 : 0;
    state.items.unshift({ item, boxTier, ts: ts ?? Date.now() });
    if (state.items.length > MAX_ITEMS) state.items.length = MAX_ITEMS;
    save();
  }

  function recordShare() {
    state.sharesUsed += 1;
    save();
  }

  function unlock(id) {
    if (state.unlocked.includes(id)) return false;
    state.unlocked.push(id);
    save();
    return true;
  }

  function isUnlocked(id) {
    return state.unlocked.includes(id);
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    save();
  }

  function getSetting(key) {
    return state.settings[key];
  }

  function purge() {
    state = blankState();
    backend.removeItem(KEY);
  }

  // Force a re-read from storage (used by tests to prove the round-trip).
  function reload() {
    state = load();
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.store = {
    get state() { return state; },
    recordOpening, recordShare, unlock, isUnlocked,
    setSetting, getSetting, purge, reload, save,
  };
})();
