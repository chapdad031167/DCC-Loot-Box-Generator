// report.js — the SYSTEM REPORT: your numbers, judged. Renders a rarity
// histogram (your actual pulls vs. the mathematically expected odds), a luck
// verdict, and a few stats The System insists are "for your file."
// Pure DOM-from-state; no generation logic, no storage writes.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const { BOX_TIERS, RARITIES } = globalThis.LOOT.tables;

  // Overall probability of each rarity across a random opening: sum over box
  // tiers of P(tier) × P(rarity | tier). This is the honest house edge.
  function expectedShares() {
    const tierTotal = BOX_TIERS.reduce((a, t) => a + t.weight, 0);
    const shares = Object.fromEntries(RARITIES.map((r) => [r.id, 0]));
    for (const t of BOX_TIERS) {
      const w = t.rarityWeights ?? {};
      const rarityTotal = RARITIES.reduce((a, r) => a + (w[r.id] ?? r.weight), 0);
      for (const r of RARITIES) {
        shares[r.id] += (t.weight / tierTotal) * ((w[r.id] ?? r.weight) / rarityTotal);
      }
    }
    return shares;
  }

  function verdict(opens, ratio) {
    if (opens === 0) return 'NO DATA. The System cannot judge you yet. It is judging you anyway.';
    if (opens < 10) return `SAMPLE SIZE: pathetic. Verdict withheld until 10 boxes (${opens}/10).`;
    const x = `${ratio.toFixed(2)}× expected`;
    if (ratio < 0.5) return `LUCK RATING: ${x}. Actuarially cursed. Your complaints have been pre-filed and pre-denied.`;
    if (ratio < 0.85) return `LUCK RATING: ${x}. Below regulation. The System recommends lowering your standards to meet supply.`;
    if (ratio <= 1.15) return `LUCK RATING: ${x}. Within parameters. The System finds your mediocrity soothing.`;
    if (ratio <= 1.6) return `LUCK RATING: ${x}. Above expectation. Enjoy it quietly; audits are retroactive.`;
    return `LUCK RATING: ${x}. Statistically indecent. The auditors have been dispatched. Bring the trinket.`;
  }

  function render(container, state) {
    if (!container) return;
    const opens = state.boxesOpened || 0;
    const exp = expectedShares();
    const frag = document.createDocumentFragment();

    const grid = document.createElement('div');
    grid.className = 'report-grid';
    for (const r of RARITIES) {
      const count = state.rarityCounts[r.id] || 0;
      const actual = opens ? (count / opens) * 100 : 0;
      const expected = exp[r.id] * 100;
      const row = document.createElement('div');
      row.className = `report-row rarity-${r.id}`;
      const bar = Math.min(actual, 100).toFixed(2);
      const mark = Math.min(expected, 100).toFixed(2);
      row.innerHTML = `
        <span class="report-label">${r.name}</span>
        <span class="report-bar" aria-hidden="true">
          <span class="report-fill" style="width:${bar}%"></span>
          <span class="report-exp" style="left:${mark}%"></span>
        </span>
        <span class="report-nums">${count} · ${actual.toFixed(1)}%
          <span class="report-expnum">(exp ${expected.toFixed(1)}%)</span></span>
      `;
      grid.append(row);
    }
    frag.append(grid);

    // Luck = your share of rare-or-better vs. what the odds owe you.
    const rarePlus = RARITIES.filter((r) => r.tier >= 3);
    const rarePlusActual = rarePlus.reduce((a, r) => a + (state.rarityCounts[r.id] || 0), 0);
    const rarePlusExpected = rarePlus.reduce((a, r) => a + exp[r.id], 0);
    const ratio = opens ? (rarePlusActual / opens) / rarePlusExpected : 0;

    const v = document.createElement('p');
    v.className = 'report-verdict';
    v.textContent = verdict(opens, ratio);
    frag.append(v);

    if (opens > 0) {
      const streak = state.maxTrashStreak || 0;
      const best = (state.items || []).reduce(
        (a, e) => (e.item.rarity.tier > (a?.item.rarity.tier ?? -1) ? e : a), null);
      const facts = document.createElement('p');
      facts.className = 'report-facts';
      facts.textContent = [
        `Longest trash streak: ${streak}${streak >= 5 ? ' (the mimics applauded)' : ''}`,
        best ? `Rarest acquisition: ${best.item.name} [${best.item.rarity.name}]` : null,
      ].filter(Boolean).join(' · ');
      frag.append(facts);
    }

    container.replaceChildren(frag);
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.report = { render, expectedShares };
})();
