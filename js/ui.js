// ui.js — DOM rendering. Phase 1: deliberately minimal, just proving the engine.

export function renderItemCard(item) {
  const card = document.createElement('article');
  card.className = `item-card rarity-${item.rarity.id}`;
  card.setAttribute('tabindex', '-1');

  const statsHtml = item.stats.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  card.innerHTML = `
    <p class="rarity-tag">${escapeHtml(item.rarity.name)}</p>
    <h2 class="item-name">${escapeHtml(item.name)}</h2>
    <p class="item-sub">${escapeHtml(item.base === item.name ? `${item.rarity.name} ${item.type}` : `${item.rarity.name} ${item.base} — ${item.type}`)}</p>
    <ul class="item-stats">${statsHtml}</ul>
    <p class="item-flavor">${escapeHtml(item.flavor)}</p>
    <p class="system-line">The System: &ldquo;${escapeHtml(item.systemLine)}&rdquo;</p>
  `;
  return card;
}

// A full opening: box tier banner + the item that fell out of it.
export function renderOpening({ boxTier, item }) {
  const wrap = document.createElement('div');
  wrap.className = `opening box-${boxTier.id}`;
  const banner = document.createElement('p');
  banner.className = 'box-banner';
  banner.textContent = `<< ${boxTier.name.toUpperCase()} BOX >>`;
  wrap.append(banner, renderItemCard(item));
  return wrap;
}

export function showOpening(container, opening) {
  container.replaceChildren(renderOpening(opening));
  container.querySelector('.item-card').focus();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
