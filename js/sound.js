// sound.js — optional cheesy fanfares, generated with WebAudio oscillators.
// No audio assets. OFF by default; the dungeon prefers you unsettled by silence.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  let ctx = null;
  let enabled = false;

  function audioCtx() {
    // Lazy: AudioContext may only start after a user gesture.
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // One note: frequency (Hz), start offset (s), duration (s), wave, detune (cents).
  function note(ac, when, { f, d = 0.16, wave = 'square', detune = 0, gain = 0.12 }) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = wave;
    osc.frequency.value = f;
    osc.detune.value = detune;
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(gain, when + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + d);
    osc.connect(amp).connect(ac.destination);
    osc.start(when);
    osc.stop(when + d + 0.05);
  }

  // Fanfares by rarity. Trash gets the descending shrug it deserves.
  const TUNES = {
    trash: [
      { f: 220, d: 0.22 }, { f: 185, d: 0.22 }, { f: 147, d: 0.45, wave: 'sawtooth' },
    ],
    common: [{ f: 330, d: 0.12 }, { f: 330, d: 0.12 }],
    uncommon: [{ f: 392, d: 0.12 }, { f: 494, d: 0.2 }],
    rare: [{ f: 392, d: 0.11 }, { f: 494, d: 0.11 }, { f: 587, d: 0.28 }],
    epic: [{ f: 392, d: 0.1 }, { f: 494, d: 0.1 }, { f: 587, d: 0.1 }, { f: 784, d: 0.32 }],
    legendary: [
      { f: 523, d: 0.12 }, { f: 659, d: 0.12 }, { f: 784, d: 0.12 },
      { f: 1047, d: 0.5, wave: 'triangle', gain: 0.16 }, { f: 784, d: 0.5, detune: 4 },
    ],
    cursed: [
      { f: 440, d: 0.5, wave: 'sawtooth' }, { f: 466, d: 0.5, wave: 'sawtooth', detune: -18 },
      { f: 233, d: 0.7, wave: 'sawtooth', gain: 0.09 },
    ],
  };

  function playFor(rarityId) {
    if (!enabled) return;
    try {
      const ac = audioCtx();
      const t0 = ac.currentTime + 0.02;
      let offset = 0;
      for (const n of TUNES[rarityId] ?? TUNES.common) {
        note(ac, t0 + offset, n);
        // Cursed notes overlap into a diminished smear; everything else is a run.
        offset += rarityId === 'cursed' ? 0.05 : n.d * 0.85;
      }
    } catch {
      // No audio? The silence was the authentic experience anyway.
    }
  }

  function setEnabled(on) {
    enabled = Boolean(on);
    if (enabled) audioCtx();
    return enabled;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.sound = { playFor, setEnabled, get enabled() { return enabled; } };
})();
