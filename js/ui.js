// ui.js — DOM rendering and the reveal sequence. No generation logic here.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function renderItemCard(item) {
    const card = document.createElement('article');
    card.className = `item-card rarity-${item.rarity.id}`;
    card.setAttribute('tabindex', '-1');

    const sub = item.base === item.name
      ? `${item.rarity.name} ${item.type}`
      : `${item.rarity.name} ${item.base} — ${item.type}`;
    const statsHtml = item.stats.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
    card.innerHTML = `
      <p class="rarity-tag">${escapeHtml(item.rarity.name)}</p>
      <h2 class="item-name">${escapeHtml(item.name)}</h2>
      <p class="item-sub">${escapeHtml(sub)}</p>
      <ul class="item-stats">${statsHtml}</ul>
      <p class="item-flavor">${escapeHtml(item.flavor)}</p>
      <p class="system-line">&ldquo;${escapeHtml(item.systemLine)}&rdquo;</p>
    `;
    return card;
  }

  function renderBanner(boxTier) {
    const banner = document.createElement('p');
    banner.className = `box-banner tier-${boxTier.id}`;
    banner.textContent = `<< ${boxTier.name.toUpperCase()}-TIER BOX >>`;
    return banner;
  }

  function renderOpening(opening) {
    const wrap = document.createElement('div');
    wrap.className = 'opening';
    wrap.append(renderBanner(opening.boxTier), renderItemCard(opening.item));
    return wrap;
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // The dramatic bit: crate materializes -> rumbles -> bursts -> card lands.
  // Resolves when the card is on screen. CSS owns the visuals; this owns timing.
  async function playReveal(stage, opening) {
    if (reducedMotion()) {
      stage.replaceChildren(renderOpening(opening));
      stage.querySelector('.item-card').focus();
      return;
    }

    const box = document.createElement('div');
    box.className = `loot-box tier-${opening.boxTier.id}`;
    box.setAttribute('aria-hidden', 'true');
    stage.replaceChildren(renderBanner(opening.boxTier), box);

    await wait(450);
    box.classList.add('rumble');
    await wait(900);
    box.classList.add('burst');
    await wait(330);

    stage.replaceChildren(renderOpening(opening));
    stage.querySelector('.item-card').focus();
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.ui = { renderItemCard, renderBanner, renderOpening, playReveal };
})();
