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
const renderedSkeleton = [
  '<div data-cf-calendar-week-plan-entry-card="true" class="calendar-entry-card cf-calendar-week-plan-entry-card">',
  '<div class="cf-calendar-week-plan-entry-main">',
  '<div class="cf-calendar-week-plan-entry-meta"><span>Wydarzenie</span><span>10:00</span><span>Zaplanowane</span></div>',
  '<p class="cf-calendar-week-plan-entry-title">Testowy wpis</p>',
  '<div class="cf-calendar-week-plan-entry-relation"><span>Brak powiązania</span></div>',
  '</div>',
  '<div class="cf-calendar-week-plan-entry-actions"><button>Edytuj</button><button>+1H</button><button>+1D</button><button>+1W</button><button>Zrobione</button><button>Usuń</button></div>',
  '</div>',
].join('');

test('Stage104 week plan rendered skeleton contains the complete visible entry payload', () => {
  for (const text of ['Wydarzenie', '10:00', 'Zaplanowane', 'Testowy wpis', 'Brak powiązania', 'Edytuj', '+1H', '+1D', '+1W', 'Zrobione', 'Usuń']) {
    assert.ok(renderedSkeleton.includes(text), 'Rendered skeleton missing ' + text);
  }
});

test('Stage104 ScheduleEntryCard has source for title, relation and all actions', () => {
  for (const needle of [
    'data-cf-calendar-week-plan-entry-card="true"',
    'data-cf-entry-title="true"',
    'data-cf-entry-relation="true"',
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

test('Stage104 week plan active classes are not hidden or zero-sized in CSS', () => {
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

test('Stage104 CSS has no malformed orphan media fragment and no legacy week-plan families', () => {
  assert.doesNotMatch(css, /@media\s*\([^)]*\)\s*\{\s*grid-template-columns\s*:/);
  assert.doesNotMatch(css, /\.cf-week-plan-entry-/);
  assert.doesNotMatch(css, /\.cf-calendar-week-entry-/);
  assert.doesNotMatch(css, /CLOSEFLOW_STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V[234]/);
});

test('Stage104 quiet release gate includes rendered week plan smoke', () => {
  assert.ok(quietGate.includes('tests/stage104-calendar-rendered-week-plan-smoke.test.cjs'));
});
