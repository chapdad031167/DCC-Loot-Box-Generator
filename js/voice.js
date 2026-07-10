// voice.js — The System, out loud. Browser-native Web Speech API
// (speechSynthesis): no keys, no audio assets, no network. OFF by default.
// Tuned low and slow, because omniscient things do not rush.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const supported = typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && 'SpeechSynthesisUtterance' in window;

  let enabled = false;
  let chosenVoice = null;

  // Prefer a flat-affect English voice; the slight synthetic edge is in
  // character. Voice lists load asynchronously in some browsers.
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    return voices.find((v) => v.lang?.startsWith('en') && /Daniel|George|Fred|UK English Male/i.test(v.name))
      ?? voices.find((v) => v.lang === 'en-GB')
      ?? voices.find((v) => v.lang?.startsWith('en'))
      ?? voices[0];
  }

  if (supported) {
    chosenVoice = pickVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      chosenVoice = chosenVoice ?? pickVoice();
    });
  }

  function speak(text) {
    if (!enabled || !supported || !text) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel(); // The System does not talk over itself. It interrupts itself.
      const utterance = new SpeechSynthesisUtterance(String(text));
      chosenVoice = chosenVoice ?? pickVoice();
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.pitch = 0.8;  // bored
      utterance.rate = 0.95;  // unhurried; it has eternity
      synth.speak(utterance);
    } catch {
      // A speech engine tantrum must never break the loot. Silence is canon anyway.
    }
  }

  function setEnabled(on) {
    enabled = Boolean(on) && supported;
    if (!enabled && supported) window.speechSynthesis.cancel();
    return enabled;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.voice = {
    speak, setEnabled,
    get enabled() { return enabled; },
    get supported() { return supported; },
  };
})();
