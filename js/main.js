// main.js — entry point: wires the box button to the generator and reveal.
// URL params: ?seed=123 (reproducible), ?box=gold / ?rarity=cursed (force,
// for testing/screenshots), ?dev=1 (batch sample button).
// Classic script (loaded last) so the app runs from file://.
(() => {
  const { makeRng, seedFromQuery } = globalThis.LOOT.rng;
  const { openBox } = globalThis.LOOT.generator;
  const { playReveal, renderOpening } = globalThis.LOOT.ui;

  const params = new URLSearchParams(window.location.search);
  const rng = makeRng(seedFromQuery(window.location.search));
  const forced = {
    boxTier: params.get('box') || undefined,
    rarity: params.get('rarity') || undefined,
  };

  const openBtn = document.getElementById('open-box');
  const stage = document.getElementById('stage');
  const counterEl = document.getElementById('boxes-opened');

  let boxesOpened = 0;
  let revealing = false;

  openBtn.addEventListener('click', async () => {
    if (revealing) return;
    revealing = true;
    openBtn.disabled = true;
    try {
      await playReveal(stage, openBox(rng, forced));
      boxesOpened += 1;
      counterEl.textContent = `Boxes opened: ${boxesOpened}`;
    } finally {
      revealing = false;
      openBtn.disabled = false;
      openBtn.focus();
    }
  });

  // Dev helper (?dev=1): dump a batch so the writing can be judged at a glance.
  const sampleBtn = document.getElementById('sample-batch');
  if (params.get('dev')) sampleBtn.hidden = false;
  sampleBtn.addEventListener('click', () => {
    stage.replaceChildren(...Array.from({ length: 20 }, () => renderOpening(openBox(rng, forced))));
  });
})();
