# LOOT CRAWL

A satirical dungeon-crawler loot box generator. You click the ominous button,
a crate materializes, rumbles, bursts, and The System — a bored, omniscient,
darkly amused game-show host — hands you something like:

> **[CURSED] Doomhinge, Auditor of Souls** (Cursed Cloak)
> ▸ Armor: +9
> ▸ Curse: Grants flight. Landing sold separately.
> *"Found in a goblin timeshare, which explains a lot."*
> SYSTEM> "Congratulations! Do read the fine print. Oh, there is none. The fine print reads you."

**Live demo:** _[add your GitHub Pages link here]_

**Screenshot:** _[add a screenshot here]_

## Features

- **Box tiers** — every opening rolls a box first: Bronze → Silver → Gold →
  Platinum → Legendary → Celestial, each with its own loot-rarity odds
- **Seven rarities** — Trash (40%) through Legendary (1.5%) and Cursed (0.5%),
  with escalating visual treatment: matte disappointment, pulsing glow,
  legendary shimmer, cursed glitch flicker
- **Random objects** — low tiers cough up absurd junk (A Jar of Sighs, A Rock
  That Looks a Little Like a Face); high tiers occasionally drop wondrous
  objects that are genuinely powerful and quietly unsettling
- **Achievements** — toast popups for milestones, including *The System Is Not
  Sorry* (5 trash in a row) and *Seek Help. Or Another Box.* (100 boxes)
- **Collection log** — everything found in this browser, rarity filters,
  click-to-inspect, persisted in localStorage
- **Share** — one click copies a formatted text block of any item
- **Sound** — optional WebAudio-generated fanfares (no audio files), off by default
- **Voice** — optional; The System reads its commentary aloud via the
  browser-built-in Web Speech API (no keys, no assets, off by default,
  tuned low and slow for maximum bored omniscience)
- **AI announcer mode** — optional; bring your own Anthropic API key and The
  System improvises a unique announcement for every box — with voice mode on,
  it speaks the AI line too

## Running it

No build step, no dependencies, no server required:

1. Clone or download this repository
2. Open `index.html` in a browser

That's it. It also deploys cleanly to any static host.

Handy URL parameters:

| Param | Effect |
|---|---|
| `?seed=123` | Reproducible loot sequence (seeded RNG) |
| `?box=celestial` | Force every box to a tier (`bronze`…`celestial`) |
| `?rarity=cursed` | Force every item to a rarity (`trash`…`cursed`) |
| `?dev=1` | Show the 20-sample batch button |

## How the generation works

All content lives in `js/tables.js` (~300 table rows, ~580 written lines,
over a billion combinations). The trick that keeps output from feeling like
madlibs: **every base item and object carries its own bespoke jokes** (stat
hooks and flavor hooks written specifically for it), so each generated item
contains at least one line that was written for exactly that thing.

```
                 ┌──────────────────────────────────────────────┐
                 │                  tables.js                    │
                 │  BOX_TIERS   RARITIES    BASE_ITEMS (hooks)   │
                 │  PREFIXES    SUFFIXES    MATERIALS            │
                 │  JUNK_OBJECTS  WONDROUS_OBJECTS               │
                 │  LEGENDARY_NAMES/EPITHETS  CURSED_TWISTS      │
                 │  FLAVOR_FRAMES  PLACES   SYSTEM_LINES         │
                 └──────────────┬───────────────────────────────┘
                                │ (content only, no logic)
        rng.js ────────────────▼───────────────────────────────
   seeded mulberry32 ──► generator.js
   (?seed=123)            │ 1. roll BOX TIER  (weighted)
                          │ 2. roll RARITY    (tier's own weight table)
                          │ 3. junk/wondrous OBJECT?  ──► bespoke stats+flavor
                          │    otherwise EQUIPMENT:
                          │ 4. name = [prefix|material] base [suffix]
                          │    (trash: decorations; legendary/cursed:
                          │     proper name + epithet)
                          │ 5. stats = core-by-type + item hook
                          │            + affix bonus [+ cursed twist]
                          │ 6. flavor = frame(hook, place) [+ affix flavor]
                          ▼
                    item object ──► ui.js (reveal, cards, toasts, collection)
                          │              ▲
                          │              │
                    store.js         announcer.js (optional AI line)
              (localStorage persist)     achievements.js  sound.js
```

Rarity scales everything: name complexity (trash gets "Chewed"; legendary gets
"Gretchen, Devourer of Warranties"), stat magnitudes (the `{X}` placeholders),
and the visual treatment.

### Why classic scripts instead of ES modules

Browsers block ES-module imports on the `file://` protocol (opaque-origin
CORS), and "double-click `index.html` and it works" is a core requirement. So
the modules are classic scripts namespaced under a single `LOOT` global,
loaded in dependency order. The separation of concerns is unchanged —
`tables` / `rng` / `generator` / `store` / `achievements` / `sound` /
`announcer` / `ui` / `main` — and Node or the test page can still load each
file independently.

## Tests

Open `tests.html` in a browser. It asserts:

- rarity distribution over 10,000 rolls stays within tolerance of the weights
- box-tier distribution over 10,000 rolls
- 1,000 openings generate without crashing, with no unfilled placeholders
- the same seed produces the same loot sequence
- cursed items always carry a monkey's-paw twist
- localStorage round-trip: record → reload → verify → purge (your real
  collection is backed up and restored around the test)
- achievements fire once and only once
- the content tables hold 200+ entries

## AI announcer mode (optional, off by default)

Click **AI: OFF** in the header, paste an Anthropic API key, and enable. After
each box, the app calls the Anthropic Messages API (`claude-sonnet-4-6`,
`max_tokens: 200`) with the generated item as context, and The System writes a
unique 1–3 sentence announcement live.

**How your key is handled — the whole policy:**

- The key is stored in a JavaScript variable **in memory only**
- It is **never** written to localStorage, sessionStorage, or cookies
- It is **never** sent anywhere except `https://api.anthropic.com`
- Reloading the page forgets it

Safety and robustness:

- On *any* API error (bad key, rate limit, network, refusal) the app falls
  back silently to the built-in snark lines, with a small `[offline snark]`
  badge so you know the line was canned
- Requests are queued single-file — mashing OPEN BOX cannot spam the API;
  superseded requests are dropped before they're sent

Cost note: each announcement is one small API call (a few hundred tokens).
Use a key with a spending limit if you're going to open a truly deranged
number of boxes. The System believes in you, statistically alone.

## Voice mode (optional, off by default)

Click **VOICE: OFF** in the header and The System reads its line aloud after
every reveal, using the browser's built-in Web Speech API — no API key, no
audio files, no network. It speaks whichever line is on the card: the built-in
snark normally, or the live AI announcement when AI mode is on.

The delivery is a **performance, not a reading**. Browsers don't support
SSML, so each line is split into sentences and performed beat by beat, with
per-sentence pitch and rate, pauses between sentences, and a held pause
before the punchline — and the mood reacts to the loot:

| Rarity | Delivery |
|---|---|
| Trash | slow, pitch sinking through the line — an audible sigh |
| Rare / Epic | brightening pitch, quickening pace |
| Legendary | mock game-show excitement; the punchline gets a held beat and a lift |
| Cursed | slowed way down, pitch wobbling between sentences — quietly wrong |

Voice quality varies by platform — the picker prefers the liveliest voice
installed (Edge's neural voices, Siri-class voices, Google voices) before
falling back to the flat legacy ones. A slightly synthetic deadpan is
considered in character. The toggle hides itself on browsers without speech
support, and the preference persists.

### Cloud voice (optional upgrade, off by default)

For a genuinely *acted* voice, the settings panel (the **AI** button) has a
**Cloud Voice** section: paste an [ElevenLabs](https://elevenlabs.io) API key
and The System's lines are synthesized by ElevenLabs instead of the browser.
The rarity still drives the emotion — the mood maps to ElevenLabs voice
settings, so legendary comes out theatrical and cursed comes out unstable in
the way that was intended. A voice ID field lets you pick any voice from your
Voice Lab; leave it blank for the default.

Key policy, same as the AI announcer: the key lives in a JavaScript variable
**in memory only** — never localStorage, never cookies, never sent anywhere
except `api.elevenlabs.io`, forgotten on reload. On any cloud failure (bad
key, quota, network) the browser voice takes over silently.

Cost note: ElevenLabs bills per character (the free tier includes ~10k
characters/month). System lines are short, but a truly deranged number of
boxes adds up. The System accepts no liability. The System never has.

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Repository **Settings → Pages**
3. Under **Build and deployment**, set Source to **Deploy from a branch**,
   pick `main` and `/ (root)`, and save
4. Your site appears at `https://<username>.github.io/<repo-name>/` within a
   minute or two

No workflow file or build configuration is needed — it's all static files.
(A `.nojekyll` file is included so Pages serves everything as-is.)

## Disclaimer

A fan-made parody generator inspired by the LitRPG genre. Not affiliated with
any book series. All item names, flavor text, and The System's commentary are
original writing.
