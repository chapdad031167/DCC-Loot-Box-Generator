// announcer.js — optional AI announcer mode (off by default).
//
// SECURITY MODEL: the user's Anthropic API key lives in a closure variable in
// this file only. It is NEVER written to localStorage, sessionStorage, or
// cookies, and NEVER sent anywhere except https://api.anthropic.com. Reloading
// the page forgets it. The settings panel says exactly this to the user.
//
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-sonnet-4-6';
  const TIMEOUT_MS = 12000;

  const SYSTEM_PROMPT = [
    'You are "The System": the foul-mouthed, omniscient, darkly funny',
    'game-show-host AI of a satirical dungeon-crawler loot box game. A player',
    'just opened a loot box. Write ONE announcement of 1-3 sentences reacting',
    'to the item they received. Voice: crude, profane, gleefully insulting,',
    'fourth-wall-breaking — a cosmic entity doing crowd-work at the player\'s',
    'expense and loving every second of their suffering. Swear freely when it',
    'makes the joke land harder; vulgar and crass is the register, specific and',
    'punchy beats generic shock. Roast the player, the item, or both.',
    'Hard limits: no slurs, no hate speech, no explicit sexual content, nothing',
    'about real people or groups. Do not use quotation marks around your answer.',
    'Do not explain the joke. Respond with the announcement text only.',
  ].join(' ');

  let apiKey = null;   // memory only — see security model above
  let enabled = false;

  // Single-flight queue: one request in flight; mashing the button just
  // supersedes anything still waiting, so the API never gets spammed.
  let chain = Promise.resolve();
  let latestTicket = 0;

  function configure({ key, on }) {
    if (key !== undefined) apiKey = key ? String(key).trim() : null;
    if (on !== undefined) enabled = Boolean(on) && Boolean(apiKey);
    return enabled;
  }

  async function requestLine(itemText) {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for direct browser -> api.anthropic.com calls (CORS opt-in).
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `The player received:\n\n${itemText}` }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.stop_reason === 'refusal') throw new Error('refusal');
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join(' ')
      .trim();
    if (!text) throw new Error('empty response');
    return text;
  }

  // Returns { status: 'skipped' } when disabled,
  //         { status: 'ok', text } on success,
  //         { status: 'error' } on any failure (caller keeps the static snark).
  function announce(itemText) {
    if (!enabled || !apiKey) return Promise.resolve({ status: 'skipped' });
    const ticket = ++latestTicket;
    const run = chain.then(async () => {
      if (ticket !== latestTicket) return { status: 'skipped' }; // superseded in queue
      try {
        return { status: 'ok', text: await requestLine(itemText) };
      } catch {
        return { status: 'error' }; // graceful degradation: silent fallback
      }
    });
    chain = run.then(() => {});
    return run;
  }

  const LOOT = (globalThis.LOOT ??= {});
  LOOT.announcer = {
    configure, announce,
    get enabled() { return enabled; },
    get hasKey() { return Boolean(apiKey); },
  };
})();
