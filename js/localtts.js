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

  // Kokoro takes no emotion tags, so the mood rides on pace: legendary gets
  // showman urgency, cursed drags, trash trudges. The written line is doing
  // most of the acting anyway.
  const MOOD_SPEED = {
    trash: 0.92, common: 1.0, uncommon: 1.03, rare: 1.05,
    epic: 1.08, legendary: 1.1, cursed: 0.85,
  };

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
      const audio = await engine.generate(String(text), {
        voice: voiceId,
        speed: MOOD_SPEED[mood] ?? 1,
      });
      if (myTicket !== ticket) return { status: 'skipped' };

      const url = URL.createObjectURL(audio.toBlob());
      const el = new Audio(url);
      currentAudio = el;
      const cleanup = () => {
        URL.revokeObjectURL(url);
        if (currentAudio === el) currentAudio = null;
      };
      el.addEventListener('ended', cleanup);
      el.addEventListener('error', cleanup);
      await el.play();
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
    DEFAULT_VOICE,
    get enabled() { return enabled; },
    get ready() { return Boolean(engine); },
    get lastError() { return loadError; },
  };
})();
