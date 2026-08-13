// announcer-proxy.js — a Cloudflare Worker that lets visitors use AI announcer
// mode without their own Anthropic API key.
//
// WHY THIS EXISTS: the game is a static page on a public repo, so anything in
// its JavaScript is readable by anyone. An API key pasted into the client is a
// key you have published. This Worker keeps the key server-side, where the
// browser can never see it, and exposes exactly one narrow capability instead.
//
// IT IS DELIBERATELY NOT A GENERAL CLAUDE PROXY. The client sends only the
// item text; the system prompt, the model, and the token cap all live here and
// cannot be overridden from outside. Otherwise anyone could point their own
// code at this URL and use it as free general-purpose Claude on your bill.
//
// DEPLOY (see worker/README.md for the click-by-click version):
//   npx wrangler deploy
//   npx wrangler secret put ANTHROPIC_API_KEY
//
// Then set `announcerProxy` in js/config.js to the deployed URL.

// Only these origins may call the Worker. A browser cannot forge Origin, so
// this stops the URL being used from other sites — it does not stop curl, which
// is what the rate limit below is for.
const ALLOWED_ORIGINS = [
  'https://loot.chapdad.com',
  'https://chapdad031167.github.io',
  'http://127.0.0.1:8787', // local testing
];

const MODEL = 'claude-sonnet-4-5';
const MAX_TOKENS = 200;
const MAX_INPUT_CHARS = 2000; // an item card is ~400; this is generous
const RATE_LIMIT = { requests: 30, windowSeconds: 60 * 60 }; // per IP per hour

const SYSTEM_PROMPT = [
  'You are "The System": the foul-mouthed, omniscient, darkly funny',
  'game-show-host AI of a satirical dungeon-crawler loot box game. A player',
  'just opened a loot box. Write ONE announcement of 1-3 sentences reacting',
  'to the item they received. Voice: crude, profane, gleefully insulting,',
  "fourth-wall-breaking — a cosmic entity doing crowd-work at the player's",
  'expense and loving every second of their suffering. Swear freely when it',
  'makes the joke land harder; vulgar and crass is the register, specific and',
  'punchy beats generic shock. Roast the player, the item, or both. Lean into',
  "filth: bodily functions, booze, sweat, smutty innuendo, and the item's",
  'least dignified implications are all fair game, the cruder the better.',
  'Hard limits: no slurs or hate speech, no sexual content that is explicit',
  'rather than suggestive, nothing sexual involving minors, and nothing about',
  'real people or groups. Do not use quotation marks around your answer.',
  'Do not explain the joke. Respond with the announcement text only.',
].join(' ');

function corsHeaders(origin) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });

// Fixed-window limiter backed by KV. If no KV namespace is bound the Worker
// still runs, but UNMETERED — bind one before sharing the link widely.
async function overRateLimit(env, ip) {
  if (!env.RATE_LIMIT_KV) return false;
  const key = `rl:${ip}:${Math.floor(Date.now() / 1000 / RATE_LIMIT.windowSeconds)}`;
  const used = Number((await env.RATE_LIMIT_KV.get(key)) || 0);
  if (used >= RATE_LIMIT.requests) return true;
  await env.RATE_LIMIT_KV.put(key, String(used + 1), {
    expirationTtl: RATE_LIMIT.windowSeconds * 2,
  });
  return false;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allowed) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405, allowed);
    }
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: 'origin not allowed' }, 403, allowed);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'proxy is not configured with a key' }, 500, allowed);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await overRateLimit(env, ip)) {
      return json({ error: 'rate limited — try again later' }, 429, allowed);
    }

    let itemText = '';
    try {
      const body = await request.json();
      itemText = String(body?.item ?? '').slice(0, MAX_INPUT_CHARS);
    } catch {
      return json({ error: 'bad JSON' }, 400, allowed);
    }
    if (!itemText.trim()) return json({ error: 'no item text' }, 400, allowed);

    try {
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `The player received:\n\n${itemText}` }],
        }),
      });
      if (!upstream.ok) {
        // Never surface upstream detail: it can echo account information.
        return json({ error: `upstream ${upstream.status}` }, 502, allowed);
      }
      const data = await upstream.json();
      if (data.stop_reason === 'refusal') return json({ error: 'refusal' }, 502, allowed);
      const text = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join(' ')
        .trim();
      if (!text) return json({ error: 'empty response' }, 502, allowed);
      return json({ text }, 200, allowed);
    } catch {
      return json({ error: 'upstream unreachable' }, 502, allowed);
    }
  },
};
