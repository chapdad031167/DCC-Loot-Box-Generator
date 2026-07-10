// main.js — entry point: wires the generator, store, achievements, sound, UI.
// URL params: ?seed=123 (reproducible), ?box=gold / ?rarity=cursed (force,
// for testing/screenshots), ?dev=1 (batch sample button).
// Classic script (loaded last) so the app runs from file://.
(() => {
  const { makeRng, seedFromQuery } = globalThis.LOOT.rng;
  const { openBox, itemToText } = globalThis.LOOT.generator;
  const { playReveal, renderOpening, renderItemCard, renderCollection, toastAll } = globalThis.LOOT.ui;
  const store = globalThis.LOOT.store;
  const achievements = globalThis.LOOT.achievements;
  const sound = globalThis.LOOT.sound;

  const params = new URLSearchParams(window.location.search);
  const rng = makeRng(seedFromQuery(window.location.search));
  const forced = {
    boxTier: params.get('box') || undefined,
    rarity: params.get('rarity') || undefined,
  };

  const openBtn = document.getElementById('open-box');
  const stage = document.getElementById('stage');
  const counterEl = document.getElementById('boxes-opened');
  const soundBtn = document.getElementById('sound-toggle');
  const collectionEl = document.getElementById('collection');
  const collectionMeta = document.getElementById('collection-meta');
  const filterBar = document.getElementById('rarity-filters');
  const purgeBtn = document.getElementById('purge-log');

  let filter = 'all';
  let revealing = false;

  function refreshCounter() {
    counterEl.textContent = `Boxes opened: ${store.state.boxesOpened}`;
  }

  function refreshCollection() {
    renderCollection(collectionEl, store.state.items, filter);
    const kept = store.state.items.length;
    const total = store.state.boxesOpened;
    collectionMeta.textContent = total > kept
      ? `${kept} items on record (${total} boxes opened; the archive keeps the rest, in the pit)`
      : `${kept} item${kept === 1 ? '' : 's'} on record`;
  }

  // ── Opening a box ─────────────────────────────────────────────────────
  openBtn.addEventListener('click', async () => {
    if (revealing) return;
    revealing = true;
    openBtn.disabled = true;
    try {
      const opening = openBox(rng, forced);
      await playReveal(stage, opening);
      sound.playFor(opening.item.rarity.id);
      store.recordOpening(opening);
      refreshCounter();
      refreshCollection();
      toastAll(achievements.check(store, { event: 'open', opening }));
    } finally {
      revealing = false;
      openBtn.disabled = false;
      openBtn.focus();
    }
  });

  // ── Share ─────────────────────────────────────────────────────────────
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // file:// or permission-less fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* the void declines */ }
      ta.remove();
      return ok;
    }
  }

  document.addEventListener('loot:share', async (e) => {
    const { item, button } = e.detail;
    const ok = await copyText(itemToText(item));
    button.textContent = ok ? '[ COPIED ]' : '[ CLIPBOARD DECLINED ]';
    setTimeout(() => { button.textContent = '[ COPY LOOT ]'; }, 1800);
    if (ok) {
      store.recordShare();
      toastAll(achievements.check(store, { event: 'share' }));
    }
  });

  // ── Collection interactions ───────────────────────────────────────────
  document.addEventListener('loot:inspect', (e) => {
    const entry = store.state.items[e.detail.index];
    if (!entry) return;
    stage.replaceChildren(renderOpening(entry, { share: true }));
    stage.querySelector('.item-card').focus();
  });

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    filter = btn.dataset.filter;
    for (const b of filterBar.querySelectorAll('button[data-filter]')) {
      b.setAttribute('aria-pressed', String(b === btn));
    }
    refreshCollection();
  });

  purgeBtn.addEventListener('click', () => {
    const n = store.state.items.length;
    if (n === 0) return;
    if (!window.confirm(`Purge ${n} item(s) and all progress? The System will pretend to be surprised.`)) return;
    store.purge();
    refreshCounter();
    refreshCollection();
    stage.replaceChildren();
  });

  // ── Sound toggle (OFF by default) ─────────────────────────────────────
  function paintSoundBtn() {
    soundBtn.textContent = sound.enabled ? 'SOUND: ON' : 'SOUND: OFF';
    soundBtn.setAttribute('aria-pressed', String(sound.enabled));
  }

  soundBtn.addEventListener('click', () => {
    sound.setEnabled(!sound.enabled);
    store.setSetting('sound', sound.enabled);
    paintSoundBtn();
    if (sound.enabled) {
      sound.playFor('uncommon'); // a taste of what was chosen
      toastAll(achievements.check(store, { event: 'sound' }));
    }
  });

  if (store.getSetting('sound')) sound.setEnabled(true);
  paintSoundBtn();

  // ── Dev helper (?dev=1): batch sample view ────────────────────────────
  const sampleBtn = document.getElementById('sample-batch');
  if (params.get('dev')) sampleBtn.hidden = false;
  sampleBtn.addEventListener('click', () => {
    stage.replaceChildren(
      ...Array.from({ length: 20 }, () => renderOpening(openBox(rng, forced), { share: false })),
    );
  });

  refreshCounter();
  refreshCollection();
})();
