const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  calendarRenderSmokeEntry,
  renderSelectedDayEntryHtml,
} = require('./fixtures/calendar-entry-fixtures.cjs');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const runtimeErrorMarkers = [
  'ReferenceError',
  'APP_ROUTE_RENDER_FAILED',
  'Missing lazy page export',
  'Cannot access',
];
const mojibakeMarkers = ['Ä', 'Å', 'Ã', 'Â', 'â€™', 'â€œ', 'â€', '�'];

function assertContainsAll(text, values, label) {
  for (const value of values) {
    assert.ok(text.includes(value), `${label} missing: ${value}`);
  }
}

function cssBlocksForSelector(css, selectorFragment) {
  const blocks = [];
  let cursor = 0;
  while (true) {
    const marker = css.indexOf(selectorFragment, cursor);
    if (marker === -1) return blocks;
    const blockStart = css.indexOf('{', marker);
    if (blockStart === -1) {
      cursor = marker + selectorFragment.length;
      continue;
    }
    const blockEnd = css.indexOf('}', blockStart);
    if (blockEnd === -1) {
      cursor = blockStart + 1;
      continue;
    }
    blocks.push(css.slice(marker, blockEnd + 1));
    cursor = blockEnd + 1;
  }
}

function assertSelectorVisible(css, selectorFragment) {
  const blocks = cssBlocksForSelector(css, selectorFragment);
  assert.ok(blocks.length > 0, `missing CSS selector block: ${selectorFragment}`);
  for (const block of blocks) {
    assert.doesNotMatch(block, /display\s*:\s*none/i, `${selectorFragment} must not use display:none`);
    assert.doesNotMatch(block, /visibility\s*:\s*hidden/i, `${selectorFragment} must not use visibility:hidden`);
    assert.doesNotMatch(block, /font-size\s*:\s*0\b/i, `${selectorFragment} must not use font-size:0`);
  }
}

test('Stage108 calendar selected-day fixture renders visible user content', () => {
  const html = renderSelectedDayEntryHtml();
  assert.ok(html.trim().length > 0, 'rendered HTML must not be empty');
  assertContainsAll(html, [
    'data-cf-calendar-selected-day-entry-v9="true"',
    calendarRenderSmokeEntry.title,
    calendarRenderSmokeEntry.time,
    calendarRenderSmokeEntry.typeLabel,
    calendarRenderSmokeEntry.statusLabel,
    calendarRenderSmokeEntry.relationLabel,
  ], 'rendered selected-day entry');
  assert.ok(!html.includes('>Wyd<'), 'type label must be full name, not short Wyd');
  assertContainsAll(html, calendarRenderSmokeEntry.actions, 'rendered selected-day actions');
});

test('Stage108 calendar smoke fixture is non-empty and complete', () => {
  assert.equal(calendarRenderSmokeEntry.title, 'Akt jaskiniowiec');
  assert.equal(calendarRenderSmokeEntry.time, '10:29');
  assert.equal(calendarRenderSmokeEntry.typeLabel, 'Wydarzenie');
  assert.equal(calendarRenderSmokeEntry.statusLabel, 'Zaplanowane');
  assert.equal(calendarRenderSmokeEntry.relationLabel, 'Brak powiązania');
  assert.deepEqual(calendarRenderSmokeEntry.actions, ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Usuń']);
});

test('Stage108 selected-day CSS keeps critical rendered slots visible', () => {
  const css = read('src/styles/closeflow-calendar-selected-day-new-tile-v9.css');
  assert.ok(!css.includes('[data-cf-calendar-selected-day-entry-v9="true"]::after,'), 'V9 selected-day orphan after selector must be removed');
  assertSelectorVisible(css, '.cf-selected-day-v9-entry-title');
  assertSelectorVisible(css, '.cf-selected-day-v9-meta');
  assertSelectorVisible(css, '.cf-selected-day-v9-type');
  assertSelectorVisible(css, '.cf-selected-day-v9-time');
  assertSelectorVisible(css, '.cf-selected-day-v9-status');
  assertSelectorVisible(css, '.cf-selected-day-v9-relation');
  assertSelectorVisible(css, '.cf-selected-day-v9-actions');
  assertSelectorVisible(css, '.cf-selected-day-v9-action');
  assert.match(css, /\[data-cf-calendar-selected-day="true"\]\s*\{\s*display:\s*none\s*!important;/, 'legacy selected-day panel can stay hidden');
});

test('Stage108 render smoke keeps runtime error markers out of rendered output', () => {
  const html = renderSelectedDayEntryHtml();
  for (const marker of runtimeErrorMarkers) {
    assert.ok(!html.includes(marker), `rendered HTML must not contain runtime marker: ${marker}`);
  }
  for (const marker of mojibakeMarkers) {
    assert.ok(!html.includes(marker), `rendered HTML must not contain mojibake marker: ${marker}`);
  }
});

test('Stage108 render smoke is wired into quiet gate exactly once', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const needle = 'tests/stage108-calendar-render-contract-smoke.test.cjs';
  const count = quiet.split(needle).length - 1;
  assert.equal(count, 1, 'Stage108 render smoke must be listed once in quiet gate');
});
