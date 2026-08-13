# LOOT CRAWL

A satirical dungeon-crawler loot box generator. You click the ominous button,
a crate materializes, rumbles, bursts, and The System — a bored, omniscient,
darkly amused game-show host — hands you something like:

> **[CURSED] Doomhinge, Auditor of Souls** (Cursed Cloak)
> ▸ Armor: +9
> ▸ Curse: Grants flight. Landing sold separately.
> *"Found in a goblin timeshare, which explains a lot."*
> SYSTEM> "Congratulations! Do read the fine print. Oh, there is none. The fine print reads you."

**Live demo:** https://chapdad031167.github.io/DCC-Loot-Box-Generator/

**Screenshot:** _[add a screenshot here]_

## Features

- **Box tiers** — every opening rolls a box first: Bronze → Silver → Gold →
  Platinum → Legendary → Celestial, each with its own loot-rarity odds
- **Seven rarities** — Trash (~17%) through Legendary (~5.4%) and Cursed (~1.1%),
  with escalating visual treatment: matte disappointment, pulsing glow,
  legendary shimmer, cursed glitch flicker
- **Random objects** — low tiers cough up absurd junk (A Jar of Sighs, A Rock
  That Looks a Little Like a Face); high tiers occasionally drop wondrous
  objects that are genuinely powerful and quietly unsettling
- **Reveal spectacle** — the crate detonates into rarity-colored particles;
  legendary adds a golden screen flash, cursed flashes red and shakes the
  whole page, celestial goes full rainbow. Revealed cards tilt in 3D under
  the pointer with a holographic glare. All of it stands down under
  `prefers-reduced-motion`
- **Mercy Protocol** — the pity system real loot boxes hide, made loudly
  visible: a meter fills as you pull sub-rare junk, and at 10 The System is
  legally obligated to dispense a rare-or-better. Under protest
- **System Report** — a luck dashboard: your actual pull rates per rarity
  charted against the mathematically expected odds (the tick mark is what
  the house owes you), a computed luck rating with escalating verdicts, your
  longest trash streak, and your rarest acquisition
- **Achievements** — toast popups for milestones, including *The System Is Not
  Sorry* (5 trash in a row) and *Seek Help. Or Another Box.* (100 boxes)
- **Collection log** — everything found in this browser, rarity filters,
  click-to-inspect, persisted in localStorage
- **Share** — one click copies a formatted text block of any item
- **Sound** — optional synthesized sound design (no audio files): the crate
  growls while it rumbles and detonates with a boom, then each rarity gets
  its own fanfare — layered brass with echo for legendary, a heartbeat drone
  for cursed, an audible floor-thud for trash. Off by default
- **Voice** — optional; The System reads the whole box aloud, off by default.
  Three engines, best first: a **free neural voice** (Kokoro-82M, running
  locally in your browser — no key, no quota), an optional ElevenLabs cloud
  voice, and the browser's built-in Web Speech as the always-there fallback
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

**Content rating note:** unlike the built-in snark lines (which stay PG-13),
the AI announcer is prompted to be crude and profane — R-rated insult comedy
aimed at the player and their loot. Hard limits are baked into the prompt: no
slurs, no hate speech, no explicit sexual content. If you'd rather have the
tamer register, edit `SYSTEM_PROMPT` in `js/announcer.js`.

**How your key is handled — the whole policy:**

- By default the key is stored in a JavaScript variable **in memory only** —
  never written to localStorage, sessionStorage, or cookies — and reloading
  the page forgets it
- It is **never** sent anywhere except `https://api.anthropic.com`
- **Optional:** tick *Remember keys on this device* in the settings panel to
  persist your keys in this browser's localStorage so AI and cloud voice
  restore themselves after a reload. That's a convenience trade-off: anyone
  with access to the browser profile could read a remembered key, so only
  use it on a device you trust. Untick the box (or disable the mode) to
  forget the key again

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

### Neural voice — free, in your browser (off by default)

The best-sounding option that costs nothing. In the settings panel (the **AI**
button), **NEURAL VOICE** runs
[Kokoro-82M](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX) —
an open-weight (Apache-licensed) neural TTS — **entirely inside your browser**
via [kokoro-js](https://www.npmjs.com/package/kokoro-js). No API key, no
account, no quota, no per-character billing, and your text never leaves the
machine.

Like the browser voice, it **performs** rather than reads. One `generate()`
call over a whole paragraph comes out flat, so each line is split into
sentences and rendered as separate clips, then played back with real silence
between them — per-sentence tempo (the model's own speaking rate), a pitch
bend (playback rate with pitch preservation off), tempo drift across the
line, a wobble for cursed, and a held beat before the punchline. Generation
is pipelined against playback, so only the first sentence costs any wait.

A **voice picker** lists all 28 Kokoro voices, grouped by gender and accent
and labelled with the model card's quality grade, with an **AUDITION**
button; the choice persists. Default is `am_fenrir` — one of the
best-graded male voices, and the name fits the job.

Voices differ a lot in natural pace, so a **PACE** slider (0.8×–1.6×,
default 1.15×) scales the whole performance; pauses tighten as it rises so a
brisk read never sits in dead air. Moving it auditions the new pace, and the
setting persists.

The first enable downloads ~90 MB of model weights, with a progress readout in
the panel; your browser caches them, so every later session is instant and
works offline. It uses WebGPU when available and falls back to WebAssembly.

This is the only part of the app with a third-party dependency, and it is
strictly opt-in: the library is loaded by a dynamic `import()` that fires
**only** when you enable it. Leave it off and nothing is fetched and nothing
changes. Because module imports need a real origin, this feature requires the
hosted page — it can't work from a `file://` copy, and says so if you try.

### Cloud voice (optional upgrade, off by default)

For a genuinely *acted* voice, the settings panel (the **AI** button) has a
**Cloud Voice** section: paste an [ElevenLabs](https://elevenlabs.io) API key
and The System's lines are synthesized by ElevenLabs instead of the browser.
Lines are rendered on the expressive **Eleven v3** model, and the rarity
drives the performance twice over: it maps to voice settings (stability /
style) *and* injects v3 audio tags into the text — legendary opens
`[thrilled][dramatic]` and lands its punchline with a `[laughs]`, cursed
goes `[ominous]` and *whispers* the final line, trash gets the
`[disappointed][sighs]` it deserves. If v3 isn't available on your account,
the same line automatically retries as a plain read on
`eleven_multilingual_v2`. A voice ID field lets you pick any voice from your
Voice Lab; leave it blank for the default.

Key policy, same as the AI announcer: memory-only by default (forgotten on
reload), never sent anywhere except `api.elevenlabs.io`, and persisted to
localStorage only if you opt into *Remember keys on this device*.

**Engines fall through, best first:** cloud voice → free neural voice →
browser voice. So if the cloud fails for any reason (bad key, exhausted
quota, no network) and the neural voice is on, it picks up the line instead
of dropping to the robot — and the panel shows why the cloud bailed.

Cost note: ElevenLabs bills per character (the free tier includes ~10k
characters/month), and the full item readout costs several times more per
box than a single line — a heavy session can drain a free month in a few
dozen boxes. Two tools in the panel help: a live **credits meter** shows
your month's usage after every request, and a **Punchline only** checkbox
makes the cloud voice speak just The System's line (the browser voice is
free either way). The System accepts no liability. The System never has.

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Repository **Settings → Pages**
3. Under **Build and deployment**, set Source to **Deploy from a branch**,
   pick `main` and `/ (root)`, and save
4. Your site appears at `https://<username>.github.io/<repo-name>/` within a
   minute or two

No workflow file or build configuration is needed — it's all static files.
(A `.nojekyll` file is included so Pages serves everything as-is.)

### Serving it from your own domain

Pages will host it on a subdomain of a domain you own, free, with automatic
HTTPS, and it keeps redeploying itself on every push. **Do the DNS record
first** — setting the custom domain before DNS resolves takes the site
offline until it propagates.

1. At your DNS provider, add a `CNAME` record: name `loot` (or whatever
   subdomain you want), value `<username>.github.io` — note the trailing
   `github.io`, *not* the repository name
2. Wait for it to resolve (usually minutes; allow up to 24 hours)
3. Repo **Settings → Pages → Custom domain**, enter `loot.example.com`, save.
   GitHub commits a `CNAME` file to the repo for you
4. Once the certificate is issued, tick **Enforce HTTPS**

For an apex domain (`example.com` with no subdomain) use four `A` records
instead, pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`
and `185.199.111.153`.

Because every path in the app is relative, it also works from a plain
subdirectory on ordinary web hosting — download the repo and drop the files
into, say, `public_html/loot/`. You just lose the automatic redeploys.

## Disclaimer

A fan-made parody generator inspired by the LitRPG genre. Not affiliated with
any book series. All item names, flavor text, and The System's commentary are
original writing.
