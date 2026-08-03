// sound.js — synthesized sound design, no audio assets. OFF by default; the
// dungeon prefers you unsettled by silence.
//
// Everything is built live from WebAudio primitives: layered detuned
// oscillators for the brassy fanfares, filtered white noise for risers and
// impacts, a feedback delay for the legendary echo, and a sub-sine thump for
// things hitting the floor. The reveal itself is scored too — playRumble()
// during the crate shake, playBurst() at the detonation — with the rarity
// fanfare landing after the card does.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  let ctx = null;
  let enabled = false;
  let noiseBuf = null;

  function audioCtx() {
    // Lazy: AudioContext may only start after a user gesture.
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noiseBuffer(ac) {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 1.2), ac.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }

  // One voice: oscillator with envelope, optional pitch glide (fEnd),
  // lowpass (lp), and a feedback-delay echo send (echo 0..~0.35).
  function tone(ac, when, { f, fEnd = null, d = 0.18, wave = 'square', detune = 0, gain = 0.12, lp = null, echo = 0 }) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(Math.max(f, 1), when);
    if (fEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(fEnd, 1), when + d);
    osc.detune.value = detune;
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(gain, when + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + d);
    let tail = amp;
    osc.connect(amp);
    if (lp) {
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = lp;
      amp.connect(filter);
      tail = filter;
    }
    tail.connect(ac.destination);
    if (echo > 0) {
      const delay = ac.createDelay(1);
      delay.delayTime.value = 0.16;
      const feedback = ac.createGain();
      feedback.gain.value = echo;
      const wet = ac.createGain();
      wet.gain.value = 0.5;
      tail.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(wet).connect(ac.destination);
    }
    osc.start(when);
    osc.stop(when + d + 1.2); // headroom so the echo tail isn't clipped
  }

  // Sub-sine drop: the sound of something hitting dungeon flagstone.
  function thump(ac, when, { f = 70, d = 0.25, gain = 0.3 } = {}) {
    tone(ac, when, { f, fEnd: f * 0.4, d, wave: 'sine', gain });
  }

  // Filtered noise sweep: risers (lpFrom < lpTo) and impacts (reverse).
  function hiss(ac, when, { d = 0.3, gain = 0.2, lpFrom = 6000, lpTo = 400 } = {}) {
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac);
    const amp = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(lpFrom, 30), when);
    filter.frequency.exponentialRampToValueAtTime(Math.max(lpTo, 30), when + d);
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(gain, when + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + d);
    src.connect(filter).connect(amp).connect(ac.destination);
    src.start(when);
    src.stop(when + d + 0.05);
  }

  // Three detuned saws through a lowpass = cheap brass section.
  function brass(ac, when, f, d, gain = 0.06, echo = 0) {
    for (const detune of [-9, 0, 9]) {
      tone(ac, when, { f, d, wave: 'sawtooth', detune, gain, lp: 2400, echo: detune === 0 ? echo : 0 });
    }
  }

  // ── Rarity fanfares ───────────────────────────────────────────────────
  const FANFARES = {
    trash(ac, t) {
      // A descending shrug, then the item audibly hits the floor.
      tone(ac, t, { f: 220, fEnd: 180, d: 0.3, wave: 'triangle', gain: 0.14 });
      tone(ac, t + 0.28, { f: 180, fEnd: 150, d: 0.3, wave: 'triangle', gain: 0.13 });
      tone(ac, t + 0.56, { f: 150, fEnd: 92, d: 0.6, wave: 'triangle', gain: 0.12 });
      thump(ac, t + 1.05, { f: 65, gain: 0.26 });
    },
    common(ac, t) {
      tone(ac, t, { f: 392, d: 0.09, wave: 'triangle', gain: 0.12 });
      tone(ac, t + 0.1, { f: 523, d: 0.16, wave: 'triangle', gain: 0.12 });
    },
    uncommon(ac, t) {
      [392, 494, 587].forEach((f, i) =>
        tone(ac, t + i * 0.09, { f, d: 0.13, wave: 'triangle', gain: 0.12, echo: i === 2 ? 0.2 : 0 }));
    },
    rare(ac, t) {
      [392, 494, 587, 784].forEach((f, i) =>
        tone(ac, t + i * 0.09, { f, d: 0.14, wave: 'triangle', gain: 0.12, echo: i === 3 ? 0.25 : 0 }));
      tone(ac, t + 0.45, { f: 1568, d: 0.4, wave: 'sine', gain: 0.05 }); // sparkle
    },
    epic(ac, t) {
      hiss(ac, t, { d: 0.35, gain: 0.1, lpFrom: 500, lpTo: 6000 }); // riser
      [392, 494, 587, 784].forEach((f, i) =>
        brass(ac, t + 0.1 + i * 0.1, f, 0.16, 0.05, i === 3 ? 0.25 : 0));
      tone(ac, t + 0.55, { f: 1175, d: 0.5, wave: 'sine', gain: 0.06 });
    },
    legendary(ac, t) {
      hiss(ac, t, { d: 0.4, gain: 0.12, lpFrom: 400, lpTo: 8000 }); // big riser
      brass(ac, t + 0.12, 523, 0.16, 0.06);
      brass(ac, t + 0.3, 659, 0.16, 0.06);
      brass(ac, t + 0.48, 784, 0.2, 0.06);
      brass(ac, t + 0.72, 1047, 0.6, 0.07, 0.3); // held top note with echo
      thump(ac, t + 0.72, { f: 90, d: 0.4, gain: 0.2 });
      // Shimmer arpeggio over the held chord.
      [1568, 1976, 2349, 3136].forEach((f, i) =>
        tone(ac, t + 0.8 + i * 0.09, { f, d: 0.3, wave: 'sine', gain: 0.035 }));
    },
    cursed(ac, t) {
      // Detuned cluster sliding down into a heartbeat.
      for (const detune of [-25, 0, 30]) {
        tone(ac, t, { f: 300, fEnd: 120, d: 1.1, wave: 'sawtooth', detune, gain: 0.05, lp: 1200 });
      }
      hiss(ac, t + 0.1, { d: 1.0, gain: 0.04, lpFrom: 900, lpTo: 200 }); // whisper bed
      thump(ac, t + 0.55, { f: 55, d: 0.18, gain: 0.3 });
      thump(ac, t + 0.8, { f: 50, d: 0.3, gain: 0.35 });
    },
  };

  function playFor(rarityId) {
    if (!enabled) return;
    try {
      const ac = audioCtx();
      (FANFARES[rarityId] ?? FANFARES.common)(ac, ac.currentTime + 0.02);
    } catch {
      // No audio? The silence was the authentic experience anyway.
    }
  }

  // ── Reveal foley (called by ui.playReveal) ────────────────────────────
  function playRumble() {
    if (!enabled) return;
    try {
      const ac = audioCtx();
      const t = ac.currentTime + 0.02;
      hiss(ac, t, { d: 0.9, gain: 0.16, lpFrom: 60, lpTo: 220 }); // building growl
      tone(ac, t, { f: 40, fEnd: 55, d: 0.9, wave: 'sine', gain: 0.14 });
    } catch { /* silence is canon */ }
  }

  function playBurst() {
    if (!enabled) return;
    try {
      const ac = audioCtx();
      const t = ac.currentTime + 0.02;
      hiss(ac, t, { d: 0.32, gain: 0.24, lpFrom: 7000, lpTo: 500 }); // the crack
      thump(ac, t, { f: 110, d: 0.35, gain: 0.34 });                 // the boom
    } catch { /* silence is canon */ }
  }

  function setEnabled(on) {
    enabled = Boolean(on);
    if (enabled) audioCtx();
    return enabled;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.sound = { playFor, playRumble, playBurst, setEnabled, get enabled() { return enabled; } };
})();
