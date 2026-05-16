#!/usr/bin/env node
/* CLOSEFLOW_TODAY_HEADER_ACTIONS_STACK_FIX_CHECK_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();

function fail(message) {
  console.error('\u2716 ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  assert(fs.existsSync(fullPath), 'Brak pliku: ' + relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

const app = read('src/App.tsx');
const todayStable = read('src/pages/TodayStable.tsx');
const css = read('src/styles/closeflow-action-tokens.css');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));

assert(app.includes("import('./pages/TodayStable')"), 'Aktywny ekran / oraz /today musi i\u015B\u0107 przez TodayStable');
assert(todayStable.includes('ADMIN_FEEDBACK_P1_TODAY_HEADER_ACTION_STACK_FIX'), 'Brak markera feedbackowego Today header actions stack');
assert(todayStable.includes('function normalizeAdminFeedbackP1TodayHeaderActions'), 'Brak normalizatora uk\u0142adu nag\u0142\u00F3wka Today');
assert(todayStable.includes('normalizeAdminFeedbackP1TodayHeaderActions();'), 'Brak useEffect wywo\u0142uj\u0105cego normalizator nag\u0142\u00F3wka Today');
assert(todayStable.includes('cf-section-head-actions'), 'TodayStable musi oznacza\u0107 praw\u0105 kolumn\u0119 cf-section-head-actions');
assert(todayStable.includes('cf-section-head-action-stack'), 'TodayStable musi oznacza\u0107 stos przycisk\u00F3w cf-section-head-action-stack');
assert(todayStable.includes('cf-section-head-last-read'), 'TodayStable musi oznacza\u0107 Ostatni odczyt jako cf-section-head-last-read');
assert(todayStable.includes('appendChild(viewButton)'), 'Widok musi zosta\u0107 do\u0142\u0105czony do tej samej grupy co Od\u015Bwie\u017C dane');
assert(todayStable.includes('insertBefore(viewButton, refreshButton.nextSibling)'), 'Widok musi by\u0107 ustawiony bezpo\u015Brednio pod/po Od\u015Bwie\u017C dane');

assert(css.includes('ADMIN_FEEDBACK_P1_TODAY_HEADER_ACTION_STACK_FIX_CSS'), 'Brak CSS dla Today header actions stack');
assert(css.includes('[data-p0-today-stable-rebuild="true"] .cf-section-head-actions'), 'CSS musi by\u0107 scopeowany do aktywnego TodayStable');
assert(css.includes('flex-direction: column'), 'Prawa kolumna nag\u0142\u00F3wka musi by\u0107 kolumn\u0105');
assert(css.includes('align-items: flex-end'), 'Desktop musi wyr\u00F3wnywa\u0107 akcje do prawej kraw\u0119dzi');
assert(css.includes('@media (max-width: 640px)'), 'Brak regu\u0142y mobile dla stosu akcji');
assert(css.includes('width: 100%'), 'Mobile musi pozwoli\u0107 przyciskom wej\u015B\u0107 na pe\u0142n\u0105 szeroko\u015B\u0107');

assert(pkg.scripts && pkg.scripts['check:today-header-actions-stack'] === 'node scripts/check-closeflow-today-header-actions-stack.cjs', 'Brak package script check:today-header-actions-stack');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'Nie wolno zmienia\u0107 kontraktu verify:closeflow:quiet');
assert(quietGate.includes("today header actions stack"), 'Quiet release gate musi uruchamia\u0107 today header actions stack check');

console.log('\u2714 Today header actions stack: Ostatni odczyt / Od\u015Bwie\u017C dane / Widok ma praw\u0105 kolumn\u0119 i guard');
