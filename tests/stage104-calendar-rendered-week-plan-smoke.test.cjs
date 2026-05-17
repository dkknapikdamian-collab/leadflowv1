const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(repoRoot, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css'), 'utf8');
const quietGate = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

function extractFunction(source, name) {
  const marker = 'function ' + name + '(';
  const start = source.indexOf(marker);
  assert.notStrictEqual(start, -1, 'Missing function: ' + name);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error('Could not close function: ' + name);
}

function cssBlocksFor(selectorFragment) {
  const blocks = [];
  let index = 0;
  while ((index = css.indexOf(selectorFragment, index)) !== -1) {
    const open = css.indexOf('{', index);
    if (open === -1) break;
    let depth = 0;
    for (let i = open; i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          blocks.push(css.slice(index, i + 1));
          index = i + 1;
          break;
        }
      }
    }
  }
  return blocks;
}

function assertNotHidden(selectorFragment) {
  const blocks = cssBlocksFor(selectorFragment);
  assert.ok(blocks.length > 0, 'Missing CSS block for ' + selectorFragment);
  const joined = blocks.join('\n');
  assert.doesNotMatch(joined, /display\s*:\s*none\b/i, selectorFragment + ' must not be display:none');
  assert.doesNotMatch(joined, /visibility\s*:\s*hidden\b/i, selectorFragment + ' must not be visibility:hidden');
  assert.doesNotMatch(joined, /font-size\s*:\s*0\b/i, selectorFragment + ' must not have zero font-size');
  assert.doesNotMatch(joined, /opacity\s*:\s*0(?!\.)\s*(?:!important)?[;}]/i, selectorFragment + ' must not be fully transparent');
  assert.doesNotMatch(joined, /(?:^|[;\s])height\s*:\s*0(?!\.)\s*(?:!important)?[;}]/i, selectorFragment + ' must not have zero height');
  assert.doesNotMatch(joined, /max-height\s*:\s*0(?!\.)\s*(?:!important)?[;}]/i, selectorFragment + ' must not have zero max-height');
}

const card = extractFunction(calendar, 'ScheduleEntryCard');

test('Stage104C ScheduleEntryCard is isolated from legacy global card CSS', () => {
  assert.ok(card.includes('data-cf-calendar-week-plan-entry-card="true"'));
  assert.ok(card.includes('cf-calendar-week-plan-entry-card'));
  assert.doesNotMatch(card, /className=\{['"]calendar-entry-card\b/);
  assert.doesNotMatch(card, /calendar-entry-card cf-calendar-week-plan-entry-card/);
});

test('Stage104C week plan map renders ScheduleEntryCard directly, without display contents wrapper', () => {
  assert.ok(calendar.includes('dayEntries.map((entry) => ('));
  assert.ok(calendar.includes('<ScheduleEntryCard'));
  assert.ok(calendar.includes('key={`week:${day.toISOString()}:${entry.id}`}'));
  assert.doesNotMatch(calendar, /style=\{\{\s*display:\s*['"]contents['"]\s*\}\}/);
});

test('Stage104C ScheduleEntryCard has visible title, relation and all actions', () => {
  for (const needle of [
    'cf-calendar-week-plan-entry-main',
    'cf-calendar-week-plan-entry-meta',
    'cf-calendar-week-plan-entry-title',
    'data-cf-entry-title="true"',
    'cf-calendar-week-plan-entry-relation',
    'data-cf-entry-relation="true"',
    'cf-calendar-week-plan-entry-actions',
    'Brak powiązania',
    'Edytuj',
    '+1H',
    '+1D',
    '+1W',
    'Zrobione',
    'Usuń',
  ]) {
    assert.ok(card.includes(needle), 'ScheduleEntryCard missing ' + needle);
  }
});

test('Stage104C week plan active classes are not hidden or zero-sized in CSS', () => {
  for (const selector of [
    '[data-cf-calendar-week-plan-entry-card="true"]',
    '.cf-calendar-week-plan-entry-main',
    '.cf-calendar-week-plan-entry-meta',
    '.cf-calendar-week-plan-entry-title',
    '.cf-calendar-week-plan-entry-relation',
    '.cf-calendar-week-plan-entry-actions',
    '.cf-calendar-week-plan-action',
  ]) {
    assertNotHidden(selector);
  }
});

test('Stage104D CSS has compact anti-collapse contract for week plan cards', () => {
  const blocks = cssBlocksFor('[data-cf-calendar-week-plan-entry-card="true"]');
  const joined = blocks.join('\n');
  assert.match(joined, /width\s*:\s*100%\s*!important/i);
  assert.match(joined, /max-width\s*:\s*none\s*!important/i);
  assert.match(joined, /min-height\s*:\s*50px\s*!important/i);
  assert.match(joined, /overflow\s*:\s*visible\s*!important/i);
  assert.match(joined, /visibility\s*:\s*visible\s*!important/i);
});

test('Stage104C CSS has no malformed orphan media fragment and no legacy week-plan families', () => {
  assert.doesNotMatch(css, /@media\s*\([^)]*\)\s*\{\s*grid-template-columns\s*:/);
  assert.doesNotMatch(css, /\.cf-week-plan-entry-/);
  assert.doesNotMatch(css, /\.cf-calendar-week-entry-/);
  assert.doesNotMatch(css, /CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V[234]/);
});

test('Stage104C quiet release gate includes rendered week plan smoke', () => {
  assert.ok(quietGate.includes('tests/stage104-calendar-rendered-week-plan-smoke.test.cjs'));
});
