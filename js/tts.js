// tts.js — optional cloud voice (ElevenLabs). OFF by default.
//
// SECURITY MODEL: same policy as the AI announcer key. The user's ElevenLabs
// API key lives in a closure variable in this file and is NEVER sent anywhere
// except https://api.elevenlabs.io. This module never touches storage; the
// key is memory-only unless the user opts into "Remember keys on this
// device" (persisted by main.js, trade-off spelled out in the panel).
//
// The mood (rarity) drives the performance two ways: ElevenLabs
// voice_settings (lower stability / higher style = more acted) AND, on the
// expressive eleven_v3 model, inline audio tags ([thrilled], [whispers],
// [sighs]…) injected into the text so the delivery actually inflects. If v3
// rejects a request, the same line retries once on eleven_multilingual_v2
// with the tags stripped; on total failure the caller (voice.js) falls back
// to the built-in Web Speech performance engine.
//
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const API_ROOT = 'https://api.elevenlabs.io';
  const API_BASE = `${API_ROOT}/v1/text-to-speech/`;
  // The System's chosen voice: "Callum", an ElevenLabs premade default voice
  // (gravelly, with an unsettling edge). Premade defaults work on the free
  // tier via the API — unlike shared Voice Library voices, which return HTTP
  // 402 for free accounts. To use any other voice, paste its ID into the
  // settings panel's voice-ID field to override this default.
  const DEFAULT_VOICE_ID = 'N2lVS1w4EtoT3dr4eOWO';
  const MODEL_PRIMARY = 'eleven_v3';             // expressive; understands audio tags
  const MODEL_FALLBACK = 'eleven_multilingual_v2'; // literal reader; tags stripped
  const TIMEOUT_MS = 20000; // v3 renders slower than v2
  // Playback pace (>1 = faster). The System talks a touch quick — it has a
  // lot of boxes to get through.
  const SPEED = 1.2;

  // Per-mood performance: `tags` open the line, `punch` lands before the
  // final sentence (usually The System's quip), and settings tune the model
  // (lower stability = more emotional variation; higher style = more acted).
  const MOODS = {
    trash:     { tags: '[disappointed][sighs]', punch: '[flat]',      stability: 0.35, style: 0.55 },
    common:    { tags: '[bored]',               punch: '[dismissive]', stability: 0.50, style: 0.30 },
    uncommon:  { tags: '[mildly impressed]',    punch: '[dry]',        stability: 0.45, style: 0.40 },
    rare:      { tags: '[pleasantly surprised]', punch: '[amused]',    stability: 0.40, style: 0.50 },
    epic:      { tags: '[excited]',             punch: '[delighted]',  stability: 0.35, style: 0.60 },
    legendary: { tags: '[thrilled][dramatic]',  punch: '[laughs]',     stability: 0.25, style: 0.80 },
    cursed:    { tags: '[ominous]',             punch: '[whispers]',   stability: 0.30, style: 0.70 },
  };

  const splitSentences = (text) =>
    (String(text).match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) || [String(text)])
      .map((s) => s.trim()).filter(Boolean);

  // Stage-direct the text for v3: mood tags up front, the punch tag held
  // for the final sentence so the quip gets its own delivery.
  function dress(text, mood) {
    const m = MOODS[mood] ?? MOODS.common;
    const sentences = splitSentences(text);
    if (sentences.length > 1) {
      sentences[sentences.length - 1] = `${m.punch} ${sentences[sentences.length - 1]}`;
    }
    return `${m.tags} ${sentences.join(' ')}`;
  }

  // v2 reads brackets out loud; remove every tag before the retry.
  const stripTags = (text) => String(text).replace(/\[[^\]]*\]\s*/g, '').trim();

  let apiKey = null;   // memory only — see security model above
  let voiceId = DEFAULT_VOICE_ID;
  let enabled = false;
  let currentAudio = null;
  let ticket = 0;      // bumping this abandons any fetch/playback in flight
  let lastError = '';  // human-readable reason the last cloud call fell back

  // The fallback to the browser voice is silent by design, which makes setup
  // failures (bad key, voice not in "My Voices", CORS) invisible. Surface the
  // reason so the settings panel can show it; production still degrades quietly.
  function reportError(msg) {
    lastError = msg;
    try {
      globalThis.document?.dispatchEvent(
        new CustomEvent('loot:tts-error', { detail: { message: msg } }),
      );
    } catch { /* no DOM (node/test) — lastError still holds it */ }
  }

  function configure({ key, voice, on }) {
    if (key !== undefined) apiKey = key ? String(key).trim() : null;
    if (voice !== undefined) voiceId = String(voice || '').trim() || DEFAULT_VOICE_ID;
    if (on !== undefined) enabled = Boolean(on) && Boolean(apiKey);
    if (!enabled) stop();
    else usage(); // fire-and-forget: paint the credits meter on enable
    return enabled;
  }

  // Quota visibility: ElevenLabs bills per character, and running dry looks
  // identical to any other failure (robot-voice fallback). Fetch the account's
  // character usage and broadcast it so the panel can show a live meter.
  // Best-effort only — failures are silent and change nothing.
  async function usage() {
    if (!apiKey) return null;
    try {
      const res = await fetch(`${API_ROOT}/v1/user/subscription`, {
        headers: { 'xi-api-key': apiKey },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (typeof data.character_count !== 'number' || typeof data.character_limit !== 'number') return null;
      const info = { used: data.character_count, limit: data.character_limit };
      try {
        globalThis.document?.dispatchEvent(new CustomEvent('loot:tts-usage', { detail: info }));
      } catch { /* no DOM */ }
      return info;
    } catch {
      return null;
    }
  }

  function stop() {
    ticket += 1;
    if (currentAudio) {
      try { currentAudio.pause(); } catch { /* already gone */ }
      currentAudio = null;
    }
  }

  // One synthesis attempt. Resolves { ok: true, blob } or { ok: false, why }.
  async function synthesize(model, text, mood) {
    const m = MOODS[mood] ?? MOODS.common;
    const res = await fetch(API_BASE + encodeURIComponent(voiceId), {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'content-type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: String(text),
        model_id: model,
        voice_settings: {
          stability: m.stability,
          style: m.style,
          similarity_boost: 0.75,
          use_speaker_boost: true,
          speed: SPEED,
        },
      }),
    });
    if (!res.ok) {
      // ElevenLabs errors carry a JSON body: { detail: "..." } or
      // { detail: { status, message } }. Pull the human-readable bit out.
      let why = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        const d = body?.detail;
        const msg = typeof d === 'string' ? d : (d?.message || d?.status);
        if (msg) why = `${why} — ${msg}`;
      } catch { /* body wasn't JSON; the status code stands alone */ }
      return { ok: false, why };
    }
    return { ok: true, blob: await res.blob() };
  }

  // Returns { status: 'skipped' | 'ok' | 'error' }. 'error' tells the caller
  // to fall back to the local Web Speech performance.
  async function play(text, mood = 'common') {
    if (!enabled || !apiKey || !text) return { status: 'skipped' };
    const myTicket = ++ticket;
    try {
      // Expressive model first; if the account or endpoint balks at v3,
      // retry the same line as a plain read on the workhorse model.
      let result = await synthesize(MODEL_PRIMARY, dress(text, mood), mood);
      if (!result.ok && myTicket === ticket) {
        result = await synthesize(MODEL_FALLBACK, stripTags(text), mood);
      }
      if (!result.ok) {
        reportError(`Cloud voice failed (${result.why}). Using the browser voice instead.`);
        usage(); // refresh the meter — quota exhaustion is the usual culprit
        return { status: 'error' };
      }
      usage(); // keep the credits meter current after each spend
      if (myTicket !== ticket) return { status: 'skipped' }; // superseded meanwhile

      const url = URL.createObjectURL(result.blob);
      const audio = new Audio(url);
      currentAudio = audio;
      const cleanup = () => {
        URL.revokeObjectURL(url);
        if (currentAudio === audio) currentAudio = null;
      };
      audio.addEventListener('ended', cleanup);
      audio.addEventListener('error', cleanup);
      await audio.play();
      lastError = '';
      return { status: 'ok' };
    } catch (e) {
      const why = e?.name === 'TimeoutError'
        ? 'request timed out'
        : 'network or CORS error (check the key and your connection)';
      reportError(`Cloud voice failed (${why}). Using the browser voice instead.`);
      return { status: 'error' };
    }
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.tts = {
    configure, play, stop, usage,
    DEFAULT_VOICE_ID,
    get enabled() { return enabled; },
    get hasKey() { return Boolean(apiKey); },
    get lastError() { return lastError; },
  };
})();
