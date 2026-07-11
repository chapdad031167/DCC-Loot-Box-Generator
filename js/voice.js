// voice.js — The System, out loud. Browser-native Web Speech API
// (speechSynthesis): no keys, no audio assets, no network. OFF by default.
//
// Browsers have no SSML, so emotion is faked the honest way: each line is
// split into sentences and performed chunk by chunk, with per-chunk pitch and
// rate, beats of silence between them, and a held pause before the punchline.
// The delivery reacts to the loot — trash gets an audible sigh, legendary
// gets mock game-show excitement, cursed slows down until it feels wrong.
//
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const supported = typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;

  let enabled = false;
  let chosenVoice = null;
  let session = 0; // bumping this cancels any performance in progress

  // How The System performs each mood. pitch/rate are the opening values;
  // drift shifts pitch per sentence; wobble alternates it (cursed only);
  // pause is the beat between sentences; punch* stage the final sentence.
  const DELIVERY = {
    trash:     { pitch: 0.75, rate: 0.85, drift: -0.05, wobble: 0,    pause: 350, punchPause: 500, punchPitch: -0.10, punchRate: -0.10 },
    common:    { pitch: 0.80, rate: 0.95, drift: 0,     wobble: 0,    pause: 220, punchPause: 320, punchPitch: -0.05, punchRate: 0 },
    uncommon:  { pitch: 0.85, rate: 1.00, drift: 0.02,  wobble: 0,    pause: 220, punchPause: 350, punchPitch: 0.08,  punchRate: 0 },
    rare:      { pitch: 0.90, rate: 1.00, drift: 0.04,  wobble: 0,    pause: 250, punchPause: 400, punchPitch: 0.10,  punchRate: 0.05 },
    epic:      { pitch: 0.95, rate: 1.05, drift: 0.05,  wobble: 0,    pause: 250, punchPause: 450, punchPitch: 0.12,  punchRate: 0.05 },
    legendary: { pitch: 1.00, rate: 1.05, drift: 0.06,  wobble: 0,    pause: 280, punchPause: 550, punchPitch: 0.18,  punchRate: 0.08 },
    cursed:    { pitch: 0.70, rate: 0.80, drift: 0,     wobble: 0.08, pause: 420, punchPause: 650, punchPitch: -0.15, punchRate: -0.15 },
  };

  // Prefer the liveliest voice the platform has: neural/natural voices first
  // (Edge "Online Natural", Siri-class, Google), flat legacy voices last.
  const VOICE_RANKING = [
    (v) => /natural|neural/i.test(v.name),
    (v) => /siri/i.test(v.name),
    (v) => /google (uk|us) english/i.test(v.name),
    (v) => /premium|enhanced/i.test(v.name),
    (v) => v.lang === 'en-GB',
    (v) => true,
  ];

  function pickVoice() {
    const all = window.speechSynthesis.getVoices();
    if (!all.length) return null;
    const english = all.filter((v) => v.lang?.startsWith('en'));
    const pool = english.length ? english : all;
    for (const preferred of VOICE_RANKING) {
      const hit = pool.find(preferred);
      if (hit) return hit;
    }
    return pool[0];
  }

  if (supported) {
    chosenVoice = pickVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      chosenVoice = chosenVoice ?? pickVoice();
    });
  }

  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  function splitSentences(text) {
    const matches = String(text).match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) || [String(text)];
    return matches.map((s) => s.trim()).filter(Boolean);
  }

  // Build the per-sentence performance plan for a mood.
  function buildPlan(text, moodId) {
    const mood = DELIVERY[moodId] ?? DELIVERY.common;
    const sentences = splitSentences(text);
    return sentences.map((sentence, i) => {
      const isPunchline = i === sentences.length - 1 && sentences.length > 1;
      const wobble = mood.wobble ? (i % 2 === 0 ? mood.wobble : -mood.wobble) : 0;
      return {
        text: sentence,
        pitch: clamp(mood.pitch + mood.drift * i + wobble + (isPunchline ? mood.punchPitch : 0), 0.1, 2),
        rate: clamp(mood.rate + (isPunchline ? mood.punchRate : 0), 0.5, 2),
        // Silence held BEFORE this sentence starts (comic timing lives here).
        prePause: i === 0 ? 0 : (isPunchline ? mood.punchPause : mood.pause),
      };
    });
  }

  function performPlan(plan, mySession) {
    const synth = window.speechSynthesis;
    let index = 0;

    const step = () => {
      if (mySession !== session || index >= plan.length) return;
      const { text, pitch, rate, prePause } = plan[index];
      index += 1;

      const start = () => {
        if (mySession !== session) return;
        const utterance = new SpeechSynthesisUtterance(text);
        chosenVoice = chosenVoice ?? pickVoice();
        if (chosenVoice) utterance.voice = chosenVoice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        // Advance on end; a generous watchdog covers engines whose onend
        // never fires (worst case: chunks queue back-to-back, no dead air).
        let advanced = false;
        const advance = () => {
          if (advanced || mySession !== session) return;
          advanced = true;
          step();
        };
        utterance.onend = advance;
        utterance.onerror = advance;
        setTimeout(advance, text.length * 90 + 2500);
        synth.speak(utterance);
      };

      if (prePause > 0) setTimeout(start, prePause);
      else start();
    };

    step();
  }

  // speak(text, mood): mood is a rarity id ('trash'…'cursed'); defaults to
  // 'common'. A new speak interrupts any performance already underway.
  // When cloud TTS (LOOT.tts) is enabled, the line goes there first; on any
  // cloud failure it falls back to the local Web Speech performance.
  function speak(text, mood = 'common') {
    if (!enabled || !text) return;
    try {
      session += 1; // The System does not talk over itself. It interrupts itself.
      if (supported) window.speechSynthesis.cancel();

      const tts = globalThis.LOOT?.tts;
      if (tts?.enabled) {
        tts.stop();
        const mySession = session;
        tts.play(String(text), mood).then((result) => {
          if (result.status === 'error' && mySession === session && supported) {
            performPlan(buildPlan(text, mood), session);
          }
        });
        return;
      }

      if (supported) performPlan(buildPlan(text, mood), session);
    } catch {
      // A speech engine tantrum must never break the loot. Silence is canon anyway.
    }
  }

  function setEnabled(on) {
    enabled = Boolean(on) && supported;
    if (!enabled) {
      session += 1;
      if (supported) window.speechSynthesis.cancel();
      globalThis.LOOT?.tts?.stop();
    }
    return enabled;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.voice = {
    speak, setEnabled,
    get enabled() { return enabled; },
    get supported() { return supported; },
  };
})();
