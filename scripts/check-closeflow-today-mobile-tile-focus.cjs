#!/usr/bin/env node
/* CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026_05_11 */
/* CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_CHECK_FIX_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const todayPath = path.join(repoRoot, 'src/pages/TodayStable.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function fail(message) {
  console.error('\u2716 ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(fs.existsSync(todayPath), 'Brak src/pages/TodayStable.tsx');
const source = fs.readFileSync(todayPath, 'utf8');

assert(source.includes('CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026_05_11'), 'Brak markera etapu Today mobile tile focus');
assert(source.includes('TODAY_SECTION_DOM_IDS'), 'Brak mapy DOM id sekcji Today');
assert(source.includes("today-section-leads-without-next-action"), 'Brak id today-section-leads-without-next-action');
assert(source.includes('getTodaySectionKeyFromMetricTile'), 'Brak mapowania kafelka na sekcj\u0119');
assert(source.includes('syncTodayMetricTileFocusA11y'), 'Brak synchronizacji aria-controls/aria-expanded kafelk\u00F3w');
assert(source.includes("button[data-cf-semantic-label]"), 'Klik kafelka musi \u0142apa\u0107 button[data-cf-semantic-label]');
assert(source.includes('aria-controls'), 'Kafelki musz\u0105 dosta\u0107 aria-controls');
assert(source.includes('aria-expanded'), 'Kafelki musz\u0105 dosta\u0107 aria-expanded');

const hasMetricTargetAssignment =
  source.includes('dataset.cfTodayMetricTileTarget') ||
  source.includes('setAttribute(\'data-cf-today-metric-tile-target\'') ||
  source.includes('setAttribute("data-cf-today-metric-tile-target"') ||
  source.includes('data-cf-today-metric-tile-target');
assert(hasMetricTargetAssignment, 'Kafelki musz\u0105 dosta\u0107 data-cf-today-metric-tile-target przez dataset albo setAttribute');

assert(source.includes('focusTodaySectionFromMetricTile'), 'Brak helpera focusTodaySectionFromMetricTile');
assert(source.includes('setActiveTodaySection(sectionKey)'), 'Klik kafelka musi ustawia\u0107 aktywn\u0105 sekcj\u0119');
assert(source.includes('setExpandedSection(sectionKey)'), 'Klik kafelka musi ustawia\u0107 expandedSection');
assert(source.includes('setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))'), 'Klik kafelka musi rozwin\u0105\u0107 sekcj\u0119 przez zdj\u0119cie jej z collapsedSections');
assert(source.includes('moveTodaySectionToTop(sectionKey)'), 'Klik kafelka musi przenie\u015B\u0107 sekcj\u0119 wy\u017Cej');
assert(source.includes('scrollToTodaySection(sectionKey)'), 'Klik kafelka musi przewin\u0105\u0107 do sekcji');

const scrollGateMatch = source.match(/function shouldFb4ScrollTodaySection\(\) \{([\s\S]*?)\n\}/);
assert(scrollGateMatch, 'Brak shouldFb4ScrollTodaySection');
const scrollGateBody = scrollGateMatch[1];
assert(scrollGateBody.includes("return typeof window !== 'undefined';"), 'Mobile scroll nie mo\u017Ce by\u0107 blokowany przez breakpoint');
assert(!scrollGateBody.includes('min-width'), 'shouldFb4ScrollTodaySection nie mo\u017Ce blokowa\u0107 mobile przez min-width');
assert(!scrollGateBody.includes('768'), 'shouldFb4ScrollTodaySection nie mo\u017Ce blokowa\u0107 mobile przez 768px');

assert(fs.existsSync(packagePath), 'Brak package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, ''));
assert(pkg.scripts && pkg.scripts['check:today-mobile-tile-focus'], 'Brak package script check:today-mobile-tile-focus');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet musi zachowa\u0107 kontrakt');

assert(fs.existsSync(quietGatePath), 'Brak scripts/closeflow-release-check-quiet.cjs');
const quietGate = fs.readFileSync(quietGatePath, 'utf8');
assert(quietGate.includes('today mobile tile focus'), 'Quiet release gate musi odpala\u0107 today mobile tile focus check');
assert(quietGate.includes('scripts/check-closeflow-today-mobile-tile-focus.cjs'), 'Quiet release gate musi wskazywa\u0107 check-closeflow-today-mobile-tile-focus.cjs');

console.log('\u2714 Today mobile: kafelki rozwijaj\u0105 i przewijaj\u0105 do w\u0142a\u015Bciwej sekcji');
