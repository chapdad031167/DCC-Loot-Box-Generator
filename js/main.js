// main.js — entry point: wires the box button to the generator.

import { makeRng, seedFromQuery } from './rng.js';
import { openBox } from './generator.js';
import { showOpening, renderOpening } from './ui.js';

const rng = makeRng(seedFromQuery(window.location.search));

const openBtn = document.getElementById('open-box');
const reveal = document.getElementById('reveal');
const counterEl = document.getElementById('boxes-opened');

let boxesOpened = 0;

openBtn.addEventListener('click', () => {
  showOpening(reveal, openBox(rng));
  boxesOpened += 1;
  counterEl.textContent = `Boxes opened: ${boxesOpened}`;
});

// Phase 1 dev helper: dump a batch so the writing can be judged at a glance.
const sampleBtn = document.getElementById('sample-batch');
sampleBtn.addEventListener('click', () => {
  reveal.replaceChildren(...Array.from({ length: 20 }, () => renderOpening(openBox(rng))));
});
