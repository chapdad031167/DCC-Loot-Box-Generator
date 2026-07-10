// ui.js — DOM rendering. Phase 1: deliberately minimal, just proving the engine.

export function renderItemCard(item) {
  const card = document.createElement('article');
  card.className = `item-card rarity-${item.rarity.id}`;
  card.setAttribute('tabindex', '-1');

  const statsHtml = item.stats.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  card.innerHTML = `
    <p class="rarity-tag">${escapeHtml(item.rarity.name)}</p>
    <h2 class="item-name">${escapeHtml(item.name)}</h2>
    <p class="item-sub">${escapeHtml(item.rarity.name)} ${escapeHtml(item.base)} &mdash; ${escapeHtml(item.type)}</p>
    <ul class="item-stats">${statsHtml}</ul>
    <p class="item-flavor">${escapeHtml(item.flavor)}</p>
    <p class="system-line">The System: &ldquo;${escapeHtml(item.systemLine)}&rdquo;</p>
  `;
  return card;
}

export function showItem(container, item) {
  container.replaceChildren(renderItemCard(item));
  container.firstChild.focus();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
