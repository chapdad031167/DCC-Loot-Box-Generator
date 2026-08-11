// localtts.js — free neural voice, running entirely in your browser.
//
// Kokoro-82M (Apache-licensed) via kokoro-js: a real neural TTS with no API
// key, no account, no quota, and no per-character billing. The model weights
// download once (~90MB, then browser-cached) and every line after that is
// synthesized locally — your text never leaves the machine.
//
// DEPENDENCY POLICY: the rest of this app is zero-dependency and runs from
// file://. That stays true. The library is a dynamic import() fired ONLY when
// the user opts in, so nobody who leaves this off pays for it — no download,
// no CDN contact, no behavior change. It needs a real origin (http/https),
// which file:// is not; loadError says so plainly rather than hanging.
//
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const LIB_URL = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js';
  const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
  // Best-graded American male in the Kokoro voice set, and the name fits the
  // job. Override with any id from tts voice list (am_michael, bm_george…).
  const DEFAULT_VOICE = 'am_fenrir';

  // Every Kokoro voice, with the model card's overall grade so the picker can
  // be honest about which ones are actually good.
  const VOICES = [
    { id: 'am_fenrir', name: 'Fenrir', lang: 'US', gender: 'M', grade: 'C+' },
    { id: 'am_michael', name: 'Michael', lang: 'US', gender: 'M', grade: 'C+' },
    { id: 'am_puck', name: 'Puck', lang: 'US', gender: 'M', grade: 'C+' },
    { id: 'bm_george', name: 'George', lang: 'UK', gender: 'M', grade: 'C' },
    { id: 'bm_fable', name: 'Fable', lang: 'UK', gender: 'M', grade: 'C' },
    { id: 'bm_lewis', name: 'Lewis', lang: 'UK', gender: 'M', grade: 'D+' },
    { id: 'am_echo', name: 'Echo', lang: 'US', gender: 'M', grade: 'D' },
    { id: 'am_eric', name: 'Eric', lang: 'US', gender: 'M', grade: 'D' },
    { id: 'am_liam', name: 'Liam', lang: 'US', gender: 'M', grade: 'D' },
    { id: 'am_onyx', name: 'Onyx', lang: 'US', gender: 'M', grade: 'D' },
    { id: 'bm_daniel', name: 'Daniel', lang: 'UK', gender: 'M', grade: 'D' },
    { id: 'am_santa', name: 'Santa', lang: 'US', gender: 'M', grade: 'D-' },
    { id: 'am_adam', name: 'Adam', lang: 'US', gender: 'M', grade: 'F+' },
    { id: 'af_heart', name: 'Heart', lang: 'US', gender: 'F', grade: 'A' },
    { id: 'af_bella', name: 'Bella', lang: 'US', gender: 'F', grade: 'A-' },
    { id: 'af_nicole', name: 'Nicole', lang: 'US', gender: 'F', grade: 'B-' },
    { id: 'bf_emma', name: 'Emma', lang: 'UK', gender: 'F', grade: 'B-' },
    { id: 'af_aoede', name: 'Aoede', lang: 'US', gender: 'F', grade: 'C+' },
    { id: 'af_kore', name: 'Kore', lang: 'US', gender: 'F', grade: 'C+' },
    { id: 'af_sarah', name: 'Sarah', lang: 'US', gender: 'F', grade: 'C+' },
    { id: 'af_alloy', name: 'Alloy', lang: 'US', gender: 'F', grade: 'C' },
    { id: 'af_nova', name: 'Nova', lang: 'US', gender: 'F', grade: 'C' },
    { id: 'bf_isabella', name: 'Isabella', lang: 'UK', gender: 'F', grade: 'C' },
    { id: 'af_sky', name: 'Sky', lang: 'US', gender: 'F', grade: 'C-' },
    { id: 'af_jessica', name: 'Jessica', lang: 'US', gender: 'F', grade: 'D' },
    { id: 'af_river', name: 'River', lang: 'US', gender: 'F', grade: 'D' },
    { id: 'bf_alice', name: 'Alice', lang: 'UK', gender: 'F', grade: 'D' },
    { id: 'bf_lily', name: 'Lily', lang: 'UK', gender: 'F', grade: 'D' },
  ];

  // ── Performance ───────────────────────────────────────────────────────
  // Kokoro takes no emotion tags, and one generate() call over a whole
  // paragraph comes out as exactly what it is: one flat read. So the line is
  // performed the same way voice.js performs Web Speech — split into
  // sentences, each its own clip, each with its own tempo, separated by real
  // silence. Two knobs, because they do different things:
  //   speed — the model's own speaking rate. Changes pace, not pitch.
  //   rate  — playbackRate with pitch preservation OFF, so it bends pitch
  //           and tempo together. Kept subtle; past ~±8% it turns cartoonish.
  // drift moves tempo across the line, wobble alternates it (cursed), and the
  // punch* values stage the final sentence — the held beat before the joke.
  const DELIVERY = {
    trash:     { speed: 0.90, rate: 0.97, drift: -0.015, wobble: 0,    pause: 340, punchPause: 520, punchSpeed: -0.06, punchRate: -0.03 },
    common:    { speed: 1.00, rate: 1.00, drift: 0,      wobble: 0,    pause: 220, punchPause: 320, punchSpeed: -0.03, punchRate: 0 },
    uncommon:  { speed: 1.02, rate: 1.00, drift: 0.01,   wobble: 0,    pause: 220, punchPause: 360, punchSpeed: 0.02,  punchRate: 0.01 },
    rare:      { speed: 1.05, rate: 1.01, drift: 0.015,  wobble: 0,    pause: 240, punchPause: 400, punchSpeed: 0.03,  punchRate: 0.02 },
    epic:      { speed: 1.08, rate: 1.02, drift: 0.02,   wobble: 0,    pause: 240, punchPause: 450, punchSpeed: 0.04,  punchRate: 0.03 },
    legendary: { speed: 1.10, rate: 1.03, drift: 0.025,  wobble: 0,    pause: 260, punchPause: 560, punchSpeed: 0.06,  punchRate: 0.04 },
    cursed:    { speed: 0.82, rate: 0.94, drift: -0.01,  wobble: 0.02, pause: 420, punchPause: 680, punchSpeed: -0.08, punchRate: -0.04 },
  };

  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const splitSentences = (text) =>
    (String(text).match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) || [String(text)])
      .map((s) => s.trim()).filter(Boolean);

  function buildPlan(text, moodId) {
    const mood = DELIVERY[moodId] ?? DELIVERY.common;
    const sentences = splitSentences(text);
    return sentences.map((sentence, i) => {
      const isPunch = i === sentences.length - 1 && sentences.length > 1;
      const wobble = mood.wobble ? (i % 2 === 0 ? mood.wobble : -mood.wobble) : 0;
      return {
        text: sentence,
        speed: clamp(mood.speed + mood.drift * i + (isPunch ? mood.punchSpeed : 0), 0.5, 1.5),
        rate: clamp(mood.rate + wobble + (isPunch ? mood.punchRate : 0), 0.85, 1.15),
        // Silence held BEFORE this clip. Comic timing lives here.
        prePause: i === 0 ? 0 : (isPunch ? mood.punchPause : mood.pause),
      };
    });
  }

  let enabled = false;
  let engine = null;        // the loaded KokoroTTS instance
  let loading = null;       // in-flight load promise (dedupes concurrent enables)
  let loadError = '';
  let voiceId = DEFAULT_VOICE;
  let currentAudio = null;
  let ticket = 0;           // bumping this abandons any synthesis in flight

  function announce(stage, detail = {}) {
    try {
      globalThis.document?.dispatchEvent(
        new CustomEvent('loot:localtts-status', { detail: { stage, ...detail } }),
      );
    } catch { /* no DOM (node/test) */ }
  }

  // Progress arrives per-file; report the largest active download so the UI
  // shows one honest number instead of flickering between shards.
  function progressReporter() {
    const files = new Map();
    return (item) => {
      if (item?.status === 'progress' && typeof item.progress === 'number') {
        files.set(item.file, item.progress);
        announce('downloading', { percent: Math.max(...files.values()) });
      } else if (item?.status === 'done' && item.file) {
        files.delete(item.file);
      }
    };
  }

  // WebGPU is dramatically faster but not everywhere; fall back to WASM (q8,
  // smaller and CPU-friendlier). Either way the model is cached after the
  // first successful load.
  async function loadEngine() {
    const { KokoroTTS } = await import(/* @vite-ignore */ LIB_URL);
    const attempts = navigator.gpu
      ? [{ device: 'webgpu', dtype: 'fp32' }, { device: 'wasm', dtype: 'q8' }]
      : [{ device: 'wasm', dtype: 'q8' }];
    let lastErr = null;
    for (const opts of attempts) {
      try {
        announce('loading', { device: opts.device });
        return await KokoroTTS.from_pretrained(MODEL_ID, {
          ...opts,
          progress_callback: progressReporter(),
        });
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr ?? new Error('no usable backend');
  }

  // Kicks off (or joins) the load. Resolves true once the voice can speak.
  function ensureLoaded() {
    if (engine) return Promise.resolve(true);
    if (!loading) {
      loading = loadEngine()
        .then((e) => {
          engine = e;
          loadError = '';
          announce('ready');
          return true;
        })
        .catch((e) => {
          loadError = String(e?.message || e);
          // The overwhelmingly common cause is running from file:// (module
          // imports are blocked there) or being offline for the first load.
          if (globalThis.location?.protocol === 'file:') {
            loadError = 'the local neural voice needs a web server — open the hosted page instead of the file';
          }
          announce('error', { message: loadError });
          engine = null;
          return false;
        })
        .finally(() => { loading = null; });
    }
    return loading;
  }

  function configure({ on }) {
    if (on !== undefined) enabled = Boolean(on);
    if (!enabled) stop();
    else ensureLoaded(); // warm up now so the first box isn't the slow one
    return enabled;
  }

  function stop() {
    ticket += 1;
    if (currentAudio) {
      try { currentAudio.pause(); } catch { /* already gone */ }
      currentAudio = null;
    }
  }

  // Play one clip through to its end, pitch-bent by `rate`. Resolves when the
  // audio finishes so the next clip can be timed against it.
  function playClip(rawAudio, rate) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(rawAudio.toBlob());
      const el = new Audio(url);
      // Pitch preservation OFF is the whole point: it lets playbackRate bend
      // pitch, which is the only pitch control this model gives us.
      el.preservesPitch = false;
      el.mozPreservesPitch = false;
      el.webkitPreservesPitch = false;
      el.playbackRate = rate;
      currentAudio = el;
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(url);
        if (currentAudio === el) currentAudio = null;
        resolve();
      };
      el.addEventListener('ended', done);
      el.addEventListener('error', done);
      el.play().catch(done);
    });
  }

  // Returns { status: 'skipped' | 'ok' | 'error' }, matching tts.js so
  // voice.js can treat the engines interchangeably. 'error' means the caller
  // should fall back to the Web Speech performance.
  async function play(text, mood = 'common') {
    if (!enabled || !text) return { status: 'skipped' };
    const myTicket = ++ticket;
    try {
      if (!engine && !(await ensureLoaded())) return { status: 'error' };
      if (myTicket !== ticket) return { status: 'skipped' }; // superseded while loading

      announce('speaking');
      const plan = buildPlan(text, mood);

      // Generation is serialized (one model) but overlaps playback: chaining
      // each generate() onto the previous starts clip N+1 rendering while
      // clip N is still being heard, so only the first clip costs latency.
      let chain = Promise.resolve();
      const clips = plan.map((step) => {
        chain = chain.then(() =>
          (myTicket === ticket
            ? engine.generate(step.text, { voice: voiceId, speed: step.speed })
            : null));
        return chain;
      });

      for (let i = 0; i < plan.length; i++) {
        const clip = await clips[i];
        if (myTicket !== ticket) return { status: 'skipped' };
        if (!clip) continue;
        if (plan[i].prePause) {
          await wait(plan[i].prePause);
          if (myTicket !== ticket) return { status: 'skipped' };
        }
        await playClip(clip, plan[i].rate);
        if (myTicket !== ticket) return { status: 'skipped' };
      }
      announce('ready');
      return { status: 'ok' };
    } catch (e) {
      loadError = String(e?.message || e);
      announce('error', { message: loadError });
      return { status: 'error' };
    }
  }

  function setVoice(id) {
    voiceId = String(id || '').trim() || DEFAULT_VOICE;
    return voiceId;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.localtts = {
    configure, play, stop, setVoice,
    DEFAULT_VOICE, VOICES,
    get voice() { return voiceId; },
    get enabled() { return enabled; },
    get ready() { return Boolean(engine); },
    get lastError() { return loadError; },
  };
})();
