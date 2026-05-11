#!/usr/bin/env node
/* CLOSEFLOW_TODAY_HEADER_ACTIONS_STACK_FIX_CHECK_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();

function fail(message) {
  console.error('✖ ' + message);
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

assert(app.includes("import('./pages/TodayStable')"), 'Aktywny ekran / oraz /today musi iść przez TodayStable');
assert(todayStable.includes('ADMIN_FEEDBACK_P1_TODAY_HEADER_ACTION_STACK_FIX'), 'Brak markera feedbackowego Today header actions stack');
assert(todayStable.includes('function normalizeAdminFeedbackP1TodayHeaderActions'), 'Brak normalizatora układu nagłówka Today');
assert(todayStable.includes('normalizeAdminFeedbackP1TodayHeaderActions();'), 'Brak useEffect wywołującego normalizator nagłówka Today');
assert(todayStable.includes('cf-section-head-actions'), 'TodayStable musi oznaczać prawą kolumnę cf-section-head-actions');
assert(todayStable.includes('cf-section-head-action-stack'), 'TodayStable musi oznaczać stos przycisków cf-section-head-action-stack');
assert(todayStable.includes('cf-section-head-last-read'), 'TodayStable musi oznaczać Ostatni odczyt jako cf-section-head-last-read');
assert(todayStable.includes('appendChild(viewButton)'), 'Widok musi zostać dołączony do tej samej grupy co Odśwież dane');
assert(todayStable.includes('insertBefore(viewButton, refreshButton.nextSibling)'), 'Widok musi być ustawiony bezpośrednio pod/po Odśwież dane');

assert(css.includes('ADMIN_FEEDBACK_P1_TODAY_HEADER_ACTION_STACK_FIX_CSS'), 'Brak CSS dla Today header actions stack');
assert(css.includes('[data-p0-today-stable-rebuild="true"] .cf-section-head-actions'), 'CSS musi być scopeowany do aktywnego TodayStable');
assert(css.includes('flex-direction: column'), 'Prawa kolumna nagłówka musi być kolumną');
assert(css.includes('align-items: flex-end'), 'Desktop musi wyrównywać akcje do prawej krawędzi');
assert(css.includes('@media (max-width: 640px)'), 'Brak reguły mobile dla stosu akcji');
assert(css.includes('width: 100%'), 'Mobile musi pozwolić przyciskom wejść na pełną szerokość');

assert(pkg.scripts && pkg.scripts['check:today-header-actions-stack'] === 'node scripts/check-closeflow-today-header-actions-stack.cjs', 'Brak package script check:today-header-actions-stack');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'Nie wolno zmieniać kontraktu verify:closeflow:quiet');
assert(quietGate.includes("today header actions stack"), 'Quiet release gate musi uruchamiać today header actions stack check');

console.log('✔ Today header actions stack: Ostatni odczyt / Odśwież dane / Widok ma prawą kolumnę i guard');
