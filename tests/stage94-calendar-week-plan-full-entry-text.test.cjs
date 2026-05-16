const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css'), 'utf8');
const quietGate = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

function extractFunction(name) {
  const marker = 'function ' + name + '(';
  const start = calendar.indexOf(marker);
  assert.notStrictEqual(start, -1, 'Missing function: ' + name);
  const bodyStart = calendar.indexOf(') {', start);
  assert.notStrictEqual(bodyStart, -1, 'Missing function body marker: ' + name);
  const open = calendar.indexOf('{', bodyStart);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let i = open; i < calendar.length; i += 1) {
    const ch = calendar[i];
    const next = calendar[i + 1];
    if (lineComment) { if (ch === '\n') lineComment = false; continue; }
    if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i += 1; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i += 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return calendar.slice(start, i + 1);
    }
  }
  throw new Error('Could not close function: ' + name);
}

const card = extractFunction('ScheduleEntryCard');

test('Stage94 week plan card uses full type/time/status labels', () => {
  assert.match(card, /data-cf-calendar-week-plan-entry-card="true"/);
  assert.match(card, /data-cf-entry-type-label="true"/);
  assert.match(card, /getCalendarEntryTypeLabel\(entry\)/);
  assert.match(card, /getCalendarEntryTimeLabel\(entry\)/);
  assert.match(card, /getCalendarEntryStatusLabel\(entry\)/);
  assert.doesNotMatch(card, /\bWyd\b\s*:/);
  assert.doesNotMatch(card, /\bZad\b\s*:/);
});

test('Stage94 week plan card exposes a visible full title', () => {
  assert.match(card, /data-cf-entry-title="true"/);
  assert.match(card, /const title = String\(entry\.title/);
  assert.match(card, />\s*\{title\}\s*<\/p>/);
});

test('Stage94 week plan card keeps full action labels and handlers', () => {
  for (const label of ['Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Usuń']) assert.ok(card.includes(label), 'Missing action label: ' + label);
  for (const handler of ['onEdit(entry)', 'onShiftHours(entry, 1)', 'onShift(entry, 1)', 'onShift(entry, 7)', 'onComplete(entry)', 'onDelete(entry)']) assert.ok(card.includes(handler), 'Missing action handler: ' + handler);
});

test('Stage94 week plan card shows relation or explicit no-relation text', () => {
  assert.match(card, /getCalendarEntryRelationLabel\(entry, caseTitle\)/);
  assert.ok(card.includes('Brak powiązania'));
  assert.ok(card.includes('Otwórz lead'));
  assert.ok(card.includes('Otwórz sprawę'));
});

test('Stage94 CSS is scoped to week plan and does not touch month grid', () => {
  const markerIndex = css.indexOf('CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4');
  assert.notStrictEqual(markerIndex, -1, 'Missing Stage94 V4 CSS marker');
  const block = css.slice(markerIndex);
  assert.match(block, /\.calendar-week-plan \.cf-calendar-week-plan-entry-card/);
  assert.doesNotMatch(block, /\.calendar-month-grid/);
  assert.doesNotMatch(block, /cf-calendar-month-text-row/);
});

test('Stage94 week plan guard is included in quiet release gate', () => {
  assert.ok(quietGate.includes('tests/stage94-calendar-week-plan-full-entry-text.test.cjs'));
});
