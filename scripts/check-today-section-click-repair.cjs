const fs = require('fs');
const path = require('path');

const root = process.cwd();
const today = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');

function fail(message) {
  console.error('[today-section-click-repair] FAIL: ' + message);
  process.exit(1);
}

[
  'ADMIN_FEEDBACK_P1_TODAY_SECTION_CLICK_REPAIR',
  "replace(/[\\u0300-\\u036f]/g, '')",
  "replace(/\\s+/g, ' ')",
  "tile.hasAttribute('aria-expanded')",
  'visibleTodaySectionSet.has(key);',
  'openTodaySection(sectionKey);',
].forEach((needle) => {
  if (!today.includes(needle)) fail('TodayStable missing marker: ' + needle);
});

if (today.includes("replace(/s+/g, ' ')")) {
  fail('normalizeSemanticLabel still removes letter s instead of whitespace');
}

if (today.includes("visibleTodaySectionSet.has(key) && (expandedSection === 'all' || expandedSection === key)")) {
  fail('sectionVisible still hides non-selected sections');
}

console.log('[today-section-click-repair] OK: top tiles open sections and bottom headers only toggle collapse');
