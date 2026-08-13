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
  // split into sentences, each rendered as its own clip and separated by real
  // silence — and the timing is ALL the performance is allowed to touch.
  //
  // Tempo is deliberately NOT varied per mood. Earlier versions nudged the
  // model's speed up for the high tiers and bent playbackRate for pitch, and
  // the two compounded with the pace slider: legendary landed near 1.3x with
  // resampling on top, which is exactly where Kokoro starts to sound chewed.
  // Speed is now whatever the listener set on the pace slider, full stop, and
  // playback runs at 1.0 so no clip is ever resampled. Pauses cost nothing in
  // quality, so that is where the mood lives: cursed drags between sentences,
  // legendary holds a long beat before the punchline, trash trudges.
  const DELIVERY = {
    trash:     { pause: 340, punchPause: 520 },
    common:    { pause: 220, punchPause: 320 },
    uncommon:  { pause: 220, punchPause: 360 },
    rare:      { pause: 240, punchPause: 400 },
    epic:      { pause: 240, punchPause: 450 },
    legendary: { pause: 260, punchPause: 560 },
    cursed:    { pause: 420, punchPause: 680 },
  };

  // Voices differ a lot in natural pace (Emma reads noticeably slower than
  // Fenrir), so the listener sets the tempo outright. Pauses shrink as speed
  // rises, or a brisk read still sits in dead air.
  const SPEED_RANGE = [0.8, 1.6];
  const DEFAULT_SPEED = 1.15;
  let speedScale = DEFAULT_SPEED;

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
      return {
        text: sentence,
        // One speed for every clip: exactly what the pace slider says.
        speed: clamp(speedScale, SPEED_RANGE[0], SPEED_RANGE[1]),
        // Silence held BEFORE this clip. Comic timing lives here, and it
        // tightens with speed so a fast read doesn't sit in dead air.
        prePause: i === 0 ? 0 : Math.round((isPunch ? mood.punchPause : mood.pause) / speedScale),
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
  // Play one clip through to its end. Playback rate is left at 1.0 on
  // purpose — resampling the model's output is what made the fast tiers
  // sound chewed. Tempo belongs to the model (via the pace slider), not here.
  function playClip(rawAudio) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(rawAudio.toBlob());
      const el = new Audio(url);
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
        await playClip(clip);
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

  function setSpeed(value) {
    const n = Number(value);
    speedScale = Number.isFinite(n) ? clamp(n, SPEED_RANGE[0], SPEED_RANGE[1]) : DEFAULT_SPEED;
    return speedScale;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.localtts = {
    configure, play, stop, setVoice, setSpeed,
    DEFAULT_VOICE, VOICES, DEFAULT_SPEED, SPEED_RANGE,
    get voice() { return voiceId; },
    get speed() { return speedScale; },
    get enabled() { return enabled; },
    get ready() { return Boolean(engine); },
    get lastError() { return loadError; },
  };
})();
