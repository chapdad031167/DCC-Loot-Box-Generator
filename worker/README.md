# Shared AI announcer (optional)

Lets visitors use AI announcer mode **without their own Anthropic API key** —
they just open the site and it works. You pay for the usage, so read the cost
note at the bottom before pointing it at the world.

## Why a Worker instead of putting the key in the page

The game is a static site on a public repo. Anything in its JavaScript is
readable by anyone with DevTools — a key pasted into the client is a key you
have published, and Anthropic keys have no spend cap by default. This Worker
keeps the key server-side where the browser can never see it.

It is also **not** a general Claude proxy. The client sends only the item text;
the system prompt, model, and token cap live in the Worker and cannot be
overridden by a caller. Without that, anyone could point their own code at the
URL and use it as free general-purpose Claude on your card.

## Deploy

From this `worker/` directory:

```bash
# 1. Rate-limit storage (strongly recommended before sharing the link)
npx wrangler kv namespace create RATE_LIMIT_KV
#    → paste the printed id into wrangler.toml and uncomment that block

# 2. Ship it
npx wrangler deploy

# 3. Give it the key (stored encrypted, never in the repo)
npx wrangler secret put ANTHROPIC_API_KEY
```

Wrangler prints a URL like `https://loot-announcer.<you>.workers.dev`.

## Point the game at it

In [`js/config.js`](../js/config.js), set:

```js
announcerProxy: 'https://loot-announcer.<you>.workers.dev',
```

That's it. The AI panel switches to a no-key ENABLE button for everyone. Anyone
who *does* paste their own key still uses theirs instead, on their own bill.

## Lock it down

`ALLOWED_ORIGINS` at the top of `announcer-proxy.js` lists who may call it.
Update it to your real domain — browsers cannot forge `Origin`, so this stops
other websites embedding your proxy. It does **not** stop `curl`; the KV rate
limit is what covers that (default: 30 requests per IP per hour).

## Cost

Every visitor's boxes bill your Anthropic account. One announcement is roughly
400 input + 60 output tokens — on Sonnet that is a fraction of a cent, but a
few thousand box openings adds up, and a determined stranger with the URL can
open a lot of boxes. Guard rails to consider:

- Keep the KV rate limit on, and lower `RATE_LIMIT.requests` if needed
- Set a **monthly spend limit** on the Anthropic account itself — the only
  hard cap that cannot be bypassed by anything in this file
- Leave the proxy off entirely and let visitors use the 177 built-in
  punchlines, which cost nothing and are the default experience
