// achievements.js — milestone definitions and unlock checks.
// Pure logic against store state; the toast rendering lives in ui.js.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  // ctx: { event: 'open' | 'share' | 'sound', opening? }
  const DEFINITIONS = [
    {
      id: 'first_box',
      title: 'Box One',
      desc: 'You opened a box. The dungeon marks the date. It celebrates anniversaries.',
      test: (s, ctx) => ctx.event === 'open' && s.boxesOpened >= 1,
    },
    {
      id: 'boxes_10',
      title: 'Repeat Customer',
      desc: 'Ten boxes. The System has upgraded you from "anomaly" to "pattern."',
      test: (s, ctx) => ctx.event === 'open' && s.boxesOpened >= 10,
    },
    {
      id: 'boxes_50',
      title: 'Bulk Purchaser',
      desc: 'Fifty boxes. The dungeon has assigned you a dedicated account manager. Do not meet him.',
      test: (s, ctx) => ctx.event === 'open' && s.boxesOpened >= 50,
    },
    {
      id: 'boxes_100',
      title: 'Seek Help. Or Another Box.',
      desc: 'One hundred boxes. Both options remain available. One of them is nearer.',
      test: (s, ctx) => ctx.event === 'open' && s.boxesOpened >= 100,
    },
    {
      id: 'trash_streak_5',
      title: 'The System Is Not Sorry',
      desc: 'Five trash drops in a row. Statistically impressive. Emotionally instructive.',
      test: (s, ctx) => ctx.event === 'open' && s.trashStreak >= 5,
    },
    {
      id: 'trash_20',
      title: 'Connoisseur of Garbage',
      desc: 'Twenty pieces of trash collected. The mimics have started leaving you reviews.',
      test: (s, ctx) => ctx.event === 'open' && (s.rarityCounts.trash || 0) >= 20,
    },
    {
      id: 'first_legendary',
      title: 'The 1.5% Club',
      desc: 'Your first legendary. Membership is nontransferable. Previous members would explain why, but.',
      test: (s, ctx) => ctx.event === 'open' && (s.rarityCounts.legendary || 0) >= 1,
    },
    {
      id: 'first_cursed',
      title: 'Read the Fine Print',
      desc: 'Your first cursed item. It is reading you back. Congratulations are, in a sense, in order.',
      test: (s, ctx) => ctx.event === 'open' && (s.rarityCounts.cursed || 0) >= 1,
    },
    {
      id: 'first_celestial_box',
      title: 'Management Has Noticed You',
      desc: 'A celestial box. Enjoy the attention. Attention, down here, is not a gift.',
      test: (s, ctx) => ctx.event === 'open' && (s.boxTierCounts.celestial || 0) >= 1,
    },
    {
      id: 'first_wondrous',
      title: 'It Followed You Home',
      desc: 'You found a wondrous object. It found you first. It was patient about it.',
      test: (s, ctx) => ctx.event === 'open'
        && ctx.opening?.item.type === 'object' && ctx.opening.item.rarity.tier >= 3,
    },
    {
      id: 'one_of_everything',
      title: 'One of Everything',
      desc: 'Every rarity collected. The set is complete. Completed sets begin to want things.',
      test: (s, ctx) => ctx.event === 'open'
        && ['trash', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'cursed']
          .every((r) => (s.rarityCounts[r] || 0) >= 1),
    },
    {
      id: 'first_share',
      title: 'Witness Me',
      desc: 'You shared your loot. The clipboard knows now. Clipboards talk.',
      test: (s, ctx) => ctx.event === 'share' && s.sharesUsed >= 1,
    },
    {
      id: 'sound_on',
      title: 'You Chose This',
      desc: 'You turned the sound on. Your consent has been recorded and notarized.',
      test: (s, ctx) => ctx.event === 'sound',
    },
    {
      id: 'voice_on',
      title: 'It Speaks',
      desc: 'You gave The System a voice. It always had one. Now it is out loud, and it is yours to live with.',
      test: (s, ctx) => ctx.event === 'voice',
    },
  ];

  // Returns the definitions newly unlocked by this event (already persisted).
  function check(store, ctx) {
    const fresh = [];
    for (const def of DEFINITIONS) {
      if (store.isUnlocked(def.id)) continue;
      if (def.test(store.state, ctx) && store.unlock(def.id)) fresh.push(def);
    }
    return fresh;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.achievements = { DEFINITIONS, check };
})();
