// main.js — entry point: wires the generator, store, achievements, sound, UI.
// URL params: ?seed=123 (reproducible), ?box=gold / ?rarity=cursed (force,
// for testing/screenshots), ?dev=1 (batch sample button).
// Classic script (loaded last) so the app runs from file://.
(() => {
  const { makeRng, seedFromQuery } = globalThis.LOOT.rng;
  const { openBox, itemToText, itemToSpeech } = globalThis.LOOT.generator;
  const { playReveal, renderOpening, renderItemCard, renderCollection, toastAll } = globalThis.LOOT.ui;
  const store = globalThis.LOOT.store;
  const achievements = globalThis.LOOT.achievements;
  const report = globalThis.LOOT.report;
  const sound = globalThis.LOOT.sound;
  const voice = globalThis.LOOT.voice;
  const tts = globalThis.LOOT.tts;
  const announcer = globalThis.LOOT.announcer;

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

  function refreshReport() {
    report.render(document.getElementById('report'), store.state);
  }

  // ── Mercy Protocol ────────────────────────────────────────────────────
  // The pity system real loot boxes hide, made loudly visible. After
  // MERCY_AT consecutive sub-rare drops, the next box is guaranteed rare or
  // better — dispensed under protest. URL-forced rarity (?rarity=) wins.
  const MERCY_AT = 10;
  const mercyEl = document.getElementById('mercy');

  function paintMercy(engaged) {
    const streak = store.state.subRareStreak || 0;
    mercyEl.classList.toggle('engaged', Boolean(engaged));
    if (engaged) {
      mercyEl.hidden = false;
      mercyEl.textContent = 'MERCY PROTOCOL ENGAGED — minimum joy dispensed under protest.';
    } else if (streak >= 3) {
      mercyEl.hidden = false;
      mercyEl.textContent =
        `MERCY PROTOCOL: ${streak}/${MERCY_AT}${streak >= 7 ? ' — dissatisfaction has been logged' : ''}`;
    } else {
      mercyEl.hidden = true;
    }
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
      let mercy = false;
      const roll = { ...forced };
      if (!forced.rarity && (store.state.subRareStreak || 0) >= MERCY_AT) {
        mercy = true;
        roll.rarity = rng.weighted([
          { id: 'rare', weight: 70 }, { id: 'epic', weight: 25 }, { id: 'legendary', weight: 5 },
        ]).id;
      }
      const opening = openBox(rng, roll);
      await playReveal(stage, opening);
      sound.playFor(opening.item.rarity.id);
      store.recordOpening(opening);
      refreshCounter();
      refreshCollection();
      refreshReport();
      paintMercy(mercy);
      toastAll(achievements.check(store, { event: 'open', opening, mercy }));
      announceItem(opening.item);
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
    refreshReport();
    paintMercy(false);
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

  // ── Voice toggle (Web Speech API; OFF by default) ─────────────────────
  const voiceBtn = document.getElementById('voice-toggle');

  function paintVoiceBtn() {
    voiceBtn.textContent = voice.enabled ? 'VOICE: ON' : 'VOICE: OFF';
    voiceBtn.setAttribute('aria-pressed', String(voice.enabled));
  }

  if (!voice.supported) {
    voiceBtn.hidden = true;
  } else {
    voiceBtn.addEventListener('click', () => {
      voice.setEnabled(!voice.enabled);
      store.setSetting('voice', voice.enabled);
      paintVoiceBtn();
      if (voice.enabled) {
        voice.speak('Voice mode enabled. I hope you know what you have done.', 'cursed');
        toastAll(achievements.check(store, { event: 'voice' }));
      }
    });
    if (store.getSetting('voice')) voice.setEnabled(true);
    paintVoiceBtn();
  }

  // ── AI announcer mode (off by default; key lives in memory only) ─────
  const aiToggle = document.getElementById('ai-toggle');
  const aiPanel = document.getElementById('ai-panel');
  const aiEnable = document.getElementById('ai-enable');
  const apiKeyInput = document.getElementById('api-key');
  const aiStatus = document.getElementById('ai-status');

  function paintAiButtons() {
    aiToggle.textContent = announcer.enabled ? 'AI: ON' : 'AI: OFF';
    aiEnable.textContent = announcer.enabled ? 'DISABLE' : 'ENABLE';
  }

  aiToggle.addEventListener('click', () => {
    aiPanel.hidden = !aiPanel.hidden;
    aiToggle.setAttribute('aria-expanded', String(!aiPanel.hidden));
    if (!aiPanel.hidden) apiKeyInput.focus();
  });

  aiEnable.addEventListener('click', () => {
    if (announcer.enabled) {
      announcer.configure({ key: null, on: false });
      apiKeyInput.value = '';
      dropKeys('anthropic');
      aiStatus.textContent = 'AI announcer off. Key forgotten. The System reverts to its greatest hits.';
    } else {
      const key = apiKeyInput.value.trim();
      if (!key) {
        aiStatus.textContent = 'No key, no live snark. Paste an Anthropic API key first.';
        return;
      }
      announcer.configure({ key, on: true });
      saveKeys({ anthropic: key });
      aiStatus.textContent = 'AI announcer on. The System is now improvising. It was always improvising; now it is billing you for it.';
    }
    paintAiButtons();
  });

  // After a reveal, swap the static snark for a live line when it arrives.
  // On any API failure, keep the static line and add the "offline snark" badge.
  // Voice mode speaks whichever line ends up on the card.
  // Voice reads the whole box aloud — item, stats, blurb — then the closing
  // line (the AI's when it arrives, otherwise the built-in snark), so the
  // System's quip lands as the final beat.
  function announceItem(item) {
    const mood = item.rarity.id; // the delivery reacts to the loot
    const readout = itemToSpeech(item);
    if (!announcer.enabled) {
      voice.speak(`${readout} ${item.systemLine}`, mood);
      return;
    }
    const lineEl = stage.querySelector('.system-line');
    if (!lineEl) return;
    announcer.announce(itemToText(item)).then((result) => {
      if (!stage.contains(lineEl)) return; // card already replaced; drop it
      if (result.status === 'ok') {
        lineEl.textContent = `“${result.text}”`;
        lineEl.classList.add('ai-line');
        voice.speak(`${readout} ${result.text}`, mood);
      } else if (result.status === 'error') {
        lineEl.classList.add('offline');
        voice.speak(`${readout} ${item.systemLine}`, mood);
      }
    });
  }

  paintAiButtons();

  // ── Cloud voice / ElevenLabs (off by default; key in memory only) ─────
  const ttsKeyInput = document.getElementById('tts-key');
  const ttsVoiceInput = document.getElementById('tts-voice-id');
  const ttsEnable = document.getElementById('tts-enable');
  const ttsStatus = document.getElementById('tts-status');

  // Cloud voice fails silently by design (it falls back to the browser voice),
  // which hides setup problems. When it does fall back, show why in the panel.
  document.addEventListener('loot:tts-error', (e) => {
    if (tts.enabled) ttsStatus.textContent = e.detail.message;
  });

  ttsEnable.addEventListener('click', () => {
    if (tts.enabled) {
      tts.configure({ key: null, on: false });
      ttsKeyInput.value = '';
      ttsEnable.textContent = 'ENABLE';
      dropKeys('eleven', 'voiceId');
      ttsStatus.textContent = 'Cloud voice off. Key forgotten. The browser voice resumes its duties, uninsulted.';
      return;
    }
    const key = ttsKeyInput.value.trim();
    if (!key) {
      ttsStatus.textContent = 'No key, no golden throat. Paste an ElevenLabs API key first.';
      return;
    }
    tts.configure({ key, voice: ttsVoiceInput.value, on: true });
    saveKeys({ eleven: key, voiceId: ttsVoiceInput.value.trim() || null });
    ttsEnable.textContent = 'DISABLE';
    // Cloud voice is pointless with voice mode off — switch it on too.
    if (!voice.enabled && voice.supported) {
      voice.setEnabled(true);
      store.setSetting('voice', true);
      paintVoiceBtn();
      toastAll(achievements.check(store, { event: 'voice' }));
    }
    ttsStatus.textContent = 'Cloud voice on. The System has hired professional vocal cords. It is billing you for them.';
    voice.speak('Cloud voice enabled. Yes. This is what I actually sound like.', 'legendary');
  });

  // ── Remember keys (opt-in; default stays memory-only) ─────────────────
  // With the checkbox ticked, API keys persist in localStorage (via the
  // store's settings) and AI / cloud voice restore themselves on load. This
  // is a deliberate, opt-in trade of security for convenience: the panel
  // says exactly who can read a remembered key. Disabling a mode, or
  // unticking the box, forgets.
  const rememberEl = document.getElementById('remember-keys');

  function saveKeys(patch) {
    if (!rememberEl.checked) return;
    const next = { ...(store.getSetting('keys') || {}), ...patch };
    for (const k of Object.keys(next)) if (next[k] == null) delete next[k];
    store.setSetting('keys', Object.keys(next).length ? next : null);
  }

  function dropKeys(...names) {
    const next = { ...(store.getSetting('keys') || {}) };
    for (const n of names) delete next[n];
    store.setSetting('keys', Object.keys(next).length ? next : null);
  }

  rememberEl.addEventListener('change', () => {
    if (!rememberEl.checked) {
      store.setSetting('keys', null);
      return;
    }
    // Persist whatever is currently enabled, straight from the inputs.
    if (announcer.enabled && apiKeyInput.value.trim()) {
      saveKeys({ anthropic: apiKeyInput.value.trim() });
    }
    if (tts.enabled && ttsKeyInput.value.trim()) {
      saveKeys({ eleven: ttsKeyInput.value.trim(), voiceId: ttsVoiceInput.value.trim() || null });
    }
  });

  // Restore on load: quiet — no greeting line, no achievement replays.
  (function restoreKeys() {
    const saved = store.getSetting('keys');
    if (!saved) return;
    rememberEl.checked = true;
    if (saved.anthropic) {
      apiKeyInput.value = saved.anthropic;
      announcer.configure({ key: saved.anthropic, on: true });
      aiStatus.textContent = 'AI announcer restored from this device. The System never forgot. It was told not to.';
      paintAiButtons();
    }
    if (saved.eleven) {
      ttsKeyInput.value = saved.eleven;
      if (saved.voiceId) ttsVoiceInput.value = saved.voiceId;
      tts.configure({ key: saved.eleven, voice: saved.voiceId, on: true });
      ttsEnable.textContent = 'DISABLE';
      ttsStatus.textContent = 'Cloud voice restored from this device. The professional vocal cords kept the retainer.';
      if (!voice.enabled && voice.supported) {
        voice.setEnabled(true);
        store.setSetting('voice', true);
        paintVoiceBtn();
      }
    }
  })();

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
  refreshReport();
  paintMercy(false); // streak persists across sessions; show where it stands
})();
