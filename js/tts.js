// tts.js — optional cloud voice (ElevenLabs). OFF by default.
//
// SECURITY MODEL: same policy as the AI announcer key. The user's ElevenLabs
// API key lives in a closure variable in this file only. It is NEVER written
// to localStorage, sessionStorage, or cookies, and NEVER sent anywhere except
// https://api.elevenlabs.io. Reloading the page forgets it.
//
// The mood (rarity) maps to ElevenLabs voice_settings: lower stability and
// higher style = more expressive, acted delivery. On any failure the caller
// (voice.js) falls back to the built-in Web Speech performance engine.
//
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const API_BASE = 'https://api.elevenlabs.io/v1/text-to-speech/';
  // The System's chosen voice: "Callum", an ElevenLabs premade default voice
  // (gravelly, with an unsettling edge). Premade defaults work on the free
  // tier via the API — unlike shared Voice Library voices, which return HTTP
  // 402 for free accounts. To use any other voice, paste its ID into the
  // settings panel's voice-ID field to override this default.
  const DEFAULT_VOICE_ID = 'N2lVS1w4EtoT3dr4eOWO';
  const MODEL_ID = 'eleven_multilingual_v2';
  const TIMEOUT_MS = 15000;

  // stability: lower = more emotional variation; style: higher = more acted.
  const MOOD_SETTINGS = {
    trash:     { stability: 0.35, style: 0.55 },
    common:    { stability: 0.50, style: 0.30 },
    uncommon:  { stability: 0.45, style: 0.40 },
    rare:      { stability: 0.40, style: 0.50 },
    epic:      { stability: 0.35, style: 0.60 },
    legendary: { stability: 0.25, style: 0.80 },
    cursed:    { stability: 0.30, style: 0.70 },
  };

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
    return enabled;
  }

  function stop() {
    ticket += 1;
    if (currentAudio) {
      try { currentAudio.pause(); } catch { /* already gone */ }
      currentAudio = null;
    }
  }

  // Returns { status: 'skipped' | 'ok' | 'error' }. 'error' tells the caller
  // to fall back to the local Web Speech performance.
  async function play(text, mood = 'common') {
    if (!enabled || !apiKey || !text) return { status: 'skipped' };
    const myTicket = ++ticket;
    try {
      const res = await fetch(API_BASE + encodeURIComponent(voiceId), {
        method: 'POST',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          'content-type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: String(text),
          model_id: MODEL_ID,
          voice_settings: {
            ...(MOOD_SETTINGS[mood] ?? MOOD_SETTINGS.common),
            similarity_boost: 0.75,
            use_speaker_boost: true,
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
        reportError(`Cloud voice failed (${why}). Using the browser voice instead.`);
        return { status: 'error' };
      }
      const blob = await res.blob();
      if (myTicket !== ticket) return { status: 'skipped' }; // superseded meanwhile

      const url = URL.createObjectURL(blob);
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
    configure, play, stop,
    DEFAULT_VOICE_ID,
    get enabled() { return enabled; },
    get hasKey() { return Boolean(apiKey); },
    get lastError() { return lastError; },
  };
})();
