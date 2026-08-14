// config.js — deployment settings. The one file you edit to change how a
// hosted copy of the game behaves. Safe to publish: nothing secret goes here.
// Classic script namespaced under LOOT so the app runs from file://.
(() => {
  const LOOT = (globalThis.LOOT ??= {});
  LOOT.config = {
    // URL of a deployed announcer proxy (see worker/README.md). When set,
    // visitors get AI announcer mode with NO API key of their own — the key
    // lives in the Worker, server-side. Leave empty for bring-your-own-key.
    //
    // NEVER put an Anthropic API key in this file. This file ships to every
    // visitor's browser; a key here is a key you have handed out.
    announcerProxy: '',
  };
})();
