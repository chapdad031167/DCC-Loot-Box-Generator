// ui.js — DOM rendering: item cards, reveal sequence, toasts, collection log.
// No generation logic here. Cross-module actions (share, inspect) bubble up
// as CustomEvents so main.js owns the wiring.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function renderItemCard(item, { share = true } = {}) {
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

    if (share) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'share-btn';
      btn.textContent = '[ COPY LOOT ]';
      btn.setAttribute('aria-label', `Copy ${item.name} to clipboard`);
      btn.addEventListener('click', () => {
        card.dispatchEvent(new CustomEvent('loot:share', { bubbles: true, detail: { item, button: btn } }));
      });
      card.append(btn);
    }
    return card;
  }

  function renderBanner(boxTier) {
    const banner = document.createElement('p');
    banner.className = `box-banner tier-${boxTier.id}`;
    banner.textContent = `<< ${boxTier.name.toUpperCase()}-TIER BOX >>`;
    return banner;
  }

  function renderOpening(opening, opts) {
    const wrap = document.createElement('div');
    wrap.className = 'opening';
    wrap.append(renderBanner(opening.boxTier), renderItemCard(opening.item, opts));
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

  // ── Achievement toasts ────────────────────────────────────────────────
  function toast(def) {
    const host = document.getElementById('toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <p class="toast-kicker">ACHIEVEMENT UNLOCKED</p>
      <p class="toast-title">${escapeHtml(def.title)}</p>
      <p class="toast-desc">${escapeHtml(def.desc)}</p>
    `;
    host.append(el);
    setTimeout(() => el.classList.add('gone'), 5600);
    setTimeout(() => el.remove(), 6200);
  }

  function toastAll(defs) {
    // Stagger so simultaneous unlocks read as separate events.
    defs.forEach((def, i) => setTimeout(() => toast(def), i * 700));
  }

  // ── Collection log ────────────────────────────────────────────────────
  function renderCollection(container, entries, filter) {
    const visible = filter === 'all'
      ? entries
      : entries.filter((e) => e.item.rarity.id === filter);

    if (visible.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'collection-empty';
      empty.textContent = filter === 'all'
        ? 'Nothing yet. The boxes are waiting. They are very good at waiting.'
        : 'None of those yet. The System admires your optimism and has filed it as evidence.';
      container.replaceChildren(empty);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'collection-grid';
    visible.forEach((entry) => {
      const idx = entries.indexOf(entry);
      const mini = document.createElement('button');
      mini.type = 'button';
      mini.className = `mini-card rarity-${entry.item.rarity.id}`;
      mini.setAttribute('aria-label', `Inspect ${entry.item.name}`);
      mini.innerHTML = `
        <span class="mini-rarity">${escapeHtml(entry.item.rarity.name)}</span>
        <span class="mini-name">${escapeHtml(entry.item.name)}</span>
      `;
      mini.addEventListener('click', () => {
        mini.dispatchEvent(new CustomEvent('loot:inspect', { bubbles: true, detail: { index: idx } }));
      });
      grid.append(mini);
    });
    container.replaceChildren(grid);
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.ui = { renderItemCard, renderBanner, renderOpening, playReveal, toast, toastAll, renderCollection };
})();
