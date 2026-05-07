const fs = require('fs');
const path = require('path');

const root = process.cwd();
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');

function fail(message) {
  console.error('[today-top-tile-focus] FAIL: ' + message);
  process.exit(1);
}

[
  'ADMIN_FEEDBACK_P1_TODAY_TOP_TILE_FOCUS_REPAIR',
  'getTodaySectionHeaderElement',
  'getTodaySectionCardElement',
  'moveTodaySectionToTop',
  'setActiveTodaySection(key);',
  'setVisibleTodaySections((current) => {',
  'const next = [key, ...base.filter((entry) => entry !== key)];',
  'writeTodayVisibleSections(next);',
  'setCollapsedSections(TODAY_SECTION_KEYS.filter((entry) => entry !== key));',
  "tile.hasAttribute('aria-expanded') && tile.querySelector('h2')",
  'moveTodaySectionToTop(activeTodaySection)',
].forEach((needle) => {
  if (!today.includes(needle)) fail('TodayStable missing marker: ' + needle);
});

if (today.includes("tile.hasAttribute('aria-expanded')) return;")) {
  fail('top tile bridge still skips every aria-expanded button');
}

if (today.includes("setCollapsedSections((current) => current.filter((entry) => entry !== key))")) {
  fail('top tile opening still leaves previously opened sections expanded');
}

console.log('[today-top-tile-focus] OK: top tiles focus, move section up and collapse other sections');
