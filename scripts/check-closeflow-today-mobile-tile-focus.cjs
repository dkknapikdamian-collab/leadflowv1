#!/usr/bin/env node
/* CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const todayPath = path.join(repoRoot, 'src/pages/TodayStable.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function fail(message) {
  console.error('✖ ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

assert(fs.existsSync(todayPath), 'Brak src/pages/TodayStable.tsx');
const source = fs.readFileSync(todayPath, 'utf8');

assert(source.includes('CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026_05_11'), 'Brak markera etapu Today mobile tile focus');
assert(source.includes('TODAY_SECTION_DOM_IDS'), 'Brak mapy DOM id sekcji Today');
assert(source.includes("today-section-leads-without-next-action"), 'Brak id today-section-leads-without-next-action');
assert(source.includes('getTodaySectionKeyFromMetricTile'), 'Brak mapowania kafelka na sekcję');
assert(source.includes('syncTodayMetricTileFocusA11y'), 'Brak synchronizacji aria-controls/aria-expanded kafelków');
assert(source.includes("button[data-cf-semantic-label]"), 'Klik kafelka musi łapać button[data-cf-semantic-label]');
assert(source.includes('aria-controls'), 'Kafelki muszą dostać aria-controls');
assert(source.includes('aria-expanded'), 'Kafelki muszą dostać aria-expanded');
assert(source.includes('data.cfTodayMetricTileTarget'), 'Kafelki muszą dostać data-cf-today-metric-tile-target');
assert(source.includes('focusTodaySectionFromMetricTile'), 'Brak helpera focusTodaySectionFromMetricTile');
assert(source.includes('setActiveTodaySection(sectionKey)'), 'Klik kafelka musi ustawiać aktywną sekcję');
assert(source.includes('setExpandedSection(sectionKey)'), 'Klik kafelka musi ustawiać expandedSection');
assert(source.includes('setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))'), 'Klik kafelka musi rozwinąć sekcję przez zdjęcie jej z collapsedSections');
assert(source.includes('moveTodaySectionToTop(sectionKey)'), 'Klik kafelka musi przenieść sekcję wyżej');
assert(source.includes('scrollToTodaySection(sectionKey)'), 'Klik kafelka musi przewinąć do sekcji');

const scrollGateMatch = source.match(/function shouldFb4ScrollTodaySection\(\) \{([\s\S]*?)\n\}/);
assert(scrollGateMatch, 'Brak shouldFb4ScrollTodaySection');
const scrollGateBody = scrollGateMatch[1];
assert(scrollGateBody.includes("return typeof window !== 'undefined';"), 'Mobile scroll nie może być blokowany przez breakpoint');
assert(!scrollGateBody.includes('min-width'), 'shouldFb4ScrollTodaySection nie może blokować mobile przez min-width');
assert(!scrollGateBody.includes('768'), 'shouldFb4ScrollTodaySection nie może blokować mobile przez 768px');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, ''));
assert(pkg.scripts && pkg.scripts['check:today-mobile-tile-focus'], 'Brak package script check:today-mobile-tile-focus');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet musi zachować kontrakt');

const quietGate = fs.readFileSync(quietGatePath, 'utf8');
assert(quietGate.includes('today mobile tile focus'), 'Quiet release gate musi odpalać today mobile tile focus check');
assert(quietGate.includes('scripts/check-closeflow-today-mobile-tile-focus.cjs'), 'Quiet release gate musi wskazywać check-closeflow-today-mobile-tile-focus.cjs');

console.log('✔ Today mobile: kafelki rozwijają i przewijają do właściwej sekcji');
