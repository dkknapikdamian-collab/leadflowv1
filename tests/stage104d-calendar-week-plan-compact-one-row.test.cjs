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

function joinedBlocks(selectorFragment) {
  const blocks = cssBlocksFor(selectorFragment);
  assert.ok(blocks.length > 0, 'Missing CSS block for ' + selectorFragment);
  return blocks.join('\n');
}

const card = extractFunction(calendar, 'ScheduleEntryCard');

test('Stage104D freezes full week-plan card DOM without legacy card CSS', () => {
  assert.ok(card.includes('data-cf-calendar-week-plan-entry-card="true"'));
  assert.ok(card.includes('cf-calendar-week-plan-entry-card'));
  assert.ok(card.includes('cf-calendar-week-plan-entry-title'));
  assert.ok(card.includes('cf-calendar-week-plan-entry-relation'));
  assert.ok(card.includes('cf-calendar-week-plan-entry-actions'));
  assert.doesNotMatch(card, /calendar-entry-card\s+cf-calendar-week-plan-entry-card/);
  assert.doesNotMatch(calendar, /style=\{\{\s*display:\s*['"]contents['"]\s*\}\}/);
});

test('Stage104D root card is compact but still anti-collapse protected', () => {
  const root = joinedBlocks('[data-cf-calendar-week-plan-entry-card="true"]');
  assert.ok(css.includes('STAGE104D_CALENDAR_WEEK_PLAN_COMPACT_ONE_ROW'));
  assert.match(root, /display\s*:\s*grid\s*!important/i);
  assert.match(root, /grid-template-columns\s*:\s*minmax\(0,\s*1fr\)\s*auto\s*!important/i);
  assert.match(root, /align-items\s*:\s*center\s*!important/i);
  assert.match(root, /width\s*:\s*100%\s*!important/i);
  assert.match(root, /max-width\s*:\s*none\s*!important/i);
  assert.match(root, /min-height\s*:\s*50px\s*!important/i);
  assert.match(root, /overflow\s*:\s*visible\s*!important/i);
  assert.match(root, /visibility\s*:\s*visible\s*!important/i);
  assert.doesNotMatch(root, /min-height\s*:\s*92px/i);
});

test('Stage104D copy area is one desktop row with ellipsis', () => {
  const main = joinedBlocks('.cf-calendar-week-plan-entry-main');
  const title = joinedBlocks('.cf-calendar-week-plan-entry-title');
  const relation = joinedBlocks('.cf-calendar-week-plan-entry-relation');
  assert.match(main, /display\s*:\s*flex\s*!important/i);
  assert.match(main, /align-items\s*:\s*center\s*!important/i);
  assert.match(main, /white-space\s*:\s*nowrap\s*!important/i);
  assert.match(main, /overflow\s*:\s*hidden\s*!important/i);
  assert.match(title, /white-space\s*:\s*nowrap\s*!important/i);
  assert.match(title, /overflow\s*:\s*hidden\s*!important/i);
  assert.match(title, /text-overflow\s*:\s*ellipsis\s*!important/i);
  assert.match(relation, /white-space\s*:\s*nowrap\s*!important/i);
  assert.match(relation, /overflow\s*:\s*hidden\s*!important/i);
  assert.match(relation, /text-overflow\s*:\s*ellipsis\s*!important/i);
});

test('Stage104D actions stay in one row on desktop', () => {
  const actions = joinedBlocks('.cf-calendar-week-plan-entry-actions');
  assert.match(actions, /display\s*:\s*flex\s*!important/i);
  assert.match(actions, /flex-wrap\s*:\s*nowrap\s*!important/i);
  assert.match(actions, /justify-content\s*:\s*flex-end\s*!important/i);
});

test('Stage104D keeps quiet release gate coverage', () => {
  assert.ok(quietGate.includes('tests/stage104d-calendar-week-plan-compact-one-row.test.cjs'));
});