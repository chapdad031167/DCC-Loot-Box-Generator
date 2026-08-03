// fx.js — reveal spectacle: particle bursts, screen flash, cursed quake, and
// holographic pointer-tilt on revealed cards. Pure decoration: every entry
// point no-ops under prefers-reduced-motion and swallows failures, because
// the loot must never depend on the fireworks.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Canvas can't read CSS custom properties per-particle; mirror the palette
  // from style.css (--c-*). Keep the two in sync if the rarity colors change.
  const COLORS = {
    trash: '#8a7a62', common: '#a9b4a9', uncommon: '#3dff7a', rare: '#4aa8ff',
    epic: '#b45eff', legendary: '#ffb837', cursed: '#ff3355',
  };
  const COUNT = { trash: 9, common: 20, uncommon: 30, rare: 45, epic: 65, legendary: 95, cursed: 75 };

  // ── Particle burst ────────────────────────────────────────────────────
  // One throwaway canvas per burst, removed when the last particle dies.
  // Trash doesn't burst so much as leak.
  function burst({ x, y, rarity = 'common', tier = null }) {
    if (reduced()) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.className = 'fx-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.append(canvas);
      const ctx = canvas.getContext('2d');
      const celestial = tier === 'celestial';
      const color = COLORS[rarity] ?? COLORS.common;
      const sad = rarity === 'trash';
      const n = COUNT[rarity] ?? 20;

      const parts = Array.from({ length: n }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = sad ? Math.random() * 0.8 : 2 + Math.random() * 7;
        return {
          x, y,
          vx: Math.cos(angle) * speed,
          vy: sad ? 0.5 + Math.random() * 1.2 : Math.sin(angle) * speed - 2.2,
          life: (sad ? 50 : 55) + Math.random() * 40,
          size: 2 + Math.random() * 3,
          // A few glyph particles keep it terminal-flavored.
          glyph: !sad && Math.random() < 0.22 ? (Math.random() < 0.5 ? '+' : '✦') : null,
          color: celestial ? `hsl(${(i * 47) % 360} 90% 65%)` : color,
        };
      });

      const step = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        for (const p of parts) {
          if (p.life <= 0) continue;
          alive += 1;
          p.life -= 1;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy = p.vy * 0.985 + (sad ? 0.03 : 0.16); // gravity; trash just droops
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
          ctx.fillStyle = p.color;
          if (p.glyph) {
            ctx.font = `${Math.round(p.size * 4)}px monospace`;
            ctx.fillText(p.glyph, p.x, p.y);
          } else {
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        }
        if (alive > 0) requestAnimationFrame(step);
        else canvas.remove();
      };
      requestAnimationFrame(step);
    } catch { /* decorative only */ }
  }

  // ── Screen flash + cursed quake ───────────────────────────────────────
  // Legendary gets a golden flash; cursed gets a red one plus a full-page
  // shudder, because a cursed drop should be felt in the furniture.
  function flash(rarity) {
    if (reduced()) return;
    if (rarity !== 'legendary' && rarity !== 'cursed') return;
    try {
      const el = document.createElement('div');
      el.className = 'screen-flash';
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('--flash', COLORS[rarity]);
      el.addEventListener('animationend', () => el.remove());
      document.body.append(el);
      setTimeout(() => el.remove(), 900); // in case animations are disabled
      if (rarity === 'cursed') {
        document.body.classList.add('cursed-quake');
        setTimeout(() => document.body.classList.remove('cursed-quake'), 600);
      }
    } catch { /* decorative only */ }
  }

  // ── Holographic tilt ──────────────────────────────────────────────────
  // Wraps a card so pointer position drives a 3D tilt + a moving glare
  // sheen. The wrapper takes the transform, so the card's own entry
  // animations (card-in, shimmer, flicker) are untouched. Pointer-fine
  // devices only — touch scrolling must not fight a tilt.
  function wrapTilt(card) {
    if (reduced() || !finePointer()) return card;
    const wrap = document.createElement('div');
    wrap.className = 'tilt-wrap';
    wrap.append(card);
    const glare = document.createElement('div');
    glare.className = 'glare';
    glare.setAttribute('aria-hidden', 'true');
    card.append(glare);

    const MAX_DEG = 7;
    wrap.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      wrap.style.setProperty('--ty', `${((px - 0.5) * 2 * MAX_DEG).toFixed(2)}deg`);
      wrap.style.setProperty('--tx', `${((0.5 - py) * 2 * MAX_DEG).toFixed(2)}deg`);
      glare.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      glare.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      glare.style.setProperty('--glow', '1');
    });
    wrap.addEventListener('pointerleave', () => {
      wrap.style.setProperty('--ty', '0deg');
      wrap.style.setProperty('--tx', '0deg');
      glare.style.setProperty('--glow', '0');
    });
    return wrap;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.fx = { burst, flash, wrapTilt };
})();
