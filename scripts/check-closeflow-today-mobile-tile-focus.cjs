#!/usr/bin/env node
/* CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_FIX_2026_05_11 */
/* CLOSEFLOW_TODAY_MOBILE_TILE_FOCUS_CHECK_FIX_2026_05_11 */
/* STAGE223_R2AF_TODAY_MOBILE_FOCUS_NO_SCROLL_CONTRACT_REPAIR */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const todayPath = path.join(repoRoot, 'src/pages/TodayStable.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');
const noScrollGuardPath = path.join(repoRoot, 'scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs');

function fail(message) {
  console.error('✖ ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function extractBlockFrom(sourceText, startNeedle) {
  const start = sourceText.indexOf(startNeedle);
  if (start === -1) return '';
  const open = sourceText.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < sourceText.length; i += 1) {
    const ch = sourceText[i];

    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return sourceText.slice(start, i + 1);
    }
  }
  return '';
}

function extractStatement(sourceText, startNeedle) {
  const start = sourceText.indexOf(startNeedle);
  if (start === -1) return '';

  let curly = 0;
  let paren = 0;
  let square = 0;
  let quote = null;
  let escaped = false;

  for (let i = start; i < sourceText.length; i += 1) {
    const ch = sourceText[i];

    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') curly += 1;
    if (ch === '}') curly -= 1;
    if (ch === '(') paren += 1;
    if (ch === ')') paren -= 1;
    if (ch === '[') square += 1;
    if (ch === ']') square -= 1;

    if (ch === ';' && curly === 0 && paren === 0 && square === 0) return sourceText.slice(start, i + 1);
  }

  return '';
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

const hasMetricTargetAssignment =
  source.includes('dataset.cfTodayMetricTileTarget') ||
  source.includes('setAttribute(\'data-cf-today-metric-tile-target\'') ||
  source.includes('setAttribute("data-cf-today-metric-tile-target"') ||
  source.includes('data-cf-today-metric-tile-target');
assert(hasMetricTargetAssignment, 'Kafelki muszą dostać data-cf-today-metric-tile-target przez dataset, setAttribute albo JSX');

assert(source.includes('focusTodaySectionFromMetricTile'), 'Brak helpera focusTodaySectionFromMetricTile');
assert(source.includes('setActiveTodaySection(sectionKey)'), 'Klik kafelka musi ustawiać aktywną sekcję');
assert(source.includes('setExpandedSection(sectionKey)'), 'Klik kafelka musi ustawiać expandedSection');
assert(
  source.includes('setCollapsedSections(TODAY_SECTION_KEYS.filter((entry) => entry !== sectionKey))') ||
  source.includes('setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))'),
  'Klik kafelka musi rozwinąć sekcję przez zdjęcie jej z collapsedSections'
);

// R2AD changed the product decision: no automatic scroll/reorder.
// This historical guard now validates focus/expand accessibility without requiring scroll trap behavior.
assert(source.includes('STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP'), 'Brak markera R2AD no-scroll trap');
assert(source.includes('data-cf-today-no-scroll-trap="true"'), 'Top metric tiles muszą mieć marker no-scroll trap');
assert(source.includes('event.currentTarget.blur()'), 'Klik top kafelka musi zdejmować focus z buttona');
assert(source.includes("if (tile.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;"), 'Root metric bridge musi ignorować top metric tiles');
assert(source.includes("if (clickable?.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;"), 'Capture bridge musi ignorować top metric tiles');
assert(source.includes("if (clickable?.hasAttribute('aria-expanded') && clickable.querySelector('h2')) return;"), 'Capture bridge nie może przejmować dolnych nagłówków sekcji');

const moveHelper = extractBlockFrom(source, 'function moveTodaySectionToTop');
assert(moveHelper, 'Brak moveTodaySectionToTop');
assert(!/insertBefore\s*\(/.test(moveHelper), 'moveTodaySectionToTop nie może przestawiać DOM po R2AD');

const scrollHelper = extractBlockFrom(source, 'function scrollToTodaySection');
assert(scrollHelper, 'Brak scrollToTodaySection');
assert(!/scrollIntoView\s*\(/.test(scrollHelper), 'scrollToTodaySection nie może wywoływać scrollIntoView po R2AD');

const focusHelper = extractStatement(source, 'const focusTodaySectionFromMetricTile =');
assert(focusHelper, 'Brak focusTodaySectionFromMetricTile');
assert(!/setTimeout\s*\(/.test(focusHelper), 'focusTodaySectionFromMetricTile nie może używać timeout/scroll trap');
assert(!/moveTodaySectionToTop\s*\(/.test(focusHelper), 'focusTodaySectionFromMetricTile nie może przenosić sekcji w DOM');
assert(!/scrollToTodaySection\s*\(/.test(focusHelper), 'focusTodaySectionFromMetricTile nie może scrollować do sekcji');

const scrollGateMatch = source.match(/function shouldFb4ScrollTodaySection\(\) \{([\s\S]*?)\n\}/);
assert(scrollGateMatch, 'Brak shouldFb4ScrollTodaySection');
const scrollGateBody = scrollGateMatch[1];
assert(scrollGateBody.includes("return typeof window !== 'undefined';"), 'Mobile scroll nie może być blokowany przez breakpoint');
assert(!scrollGateBody.includes('min-width'), 'shouldFb4ScrollTodaySection nie może blokować mobile przez min-width');
assert(!scrollGateBody.includes('768'), 'shouldFb4ScrollTodaySection nie może blokować mobile przez 768px');

assert(fs.existsSync(packagePath), 'Brak package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, ''));
assert(pkg.scripts && pkg.scripts['check:today-mobile-tile-focus'], 'Brak package script check:today-mobile-tile-focus');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet musi zachować kontrakt');

assert(fs.existsSync(quietGatePath), 'Brak scripts/closeflow-release-check-quiet.cjs');
const quietGate = fs.readFileSync(quietGatePath, 'utf8');
assert(quietGate.includes('today mobile tile focus'), 'Quiet release gate musi odpalać today mobile tile focus check');
assert(quietGate.includes('scripts/check-closeflow-today-mobile-tile-focus.cjs'), 'Quiet release gate musi wskazywać check-closeflow-today-mobile-tile-focus.cjs');
assert(quietGate.includes('today tile no-scroll trap'), 'Quiet release gate musi odpalać R2AD no-scroll guard');
assert(quietGate.includes('scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs'), 'Quiet release gate musi wskazywać R2AD no-scroll guard');

assert(fs.existsSync(noScrollGuardPath), 'Brak scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs');

console.log('✔ Today mobile: kafelki rozwijają sekcję bez scroll trap i bez reordera DOM');
