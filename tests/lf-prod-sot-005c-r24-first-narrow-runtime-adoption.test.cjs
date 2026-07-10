const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function compatDateKey(raw) {
  return String(raw || '').slice(0, 10);
}

function getFunctionBody(source, name) {
  const needle = 'function ' + name;
  const start = source.indexOf(needle);
  assert.notEqual(start, -1, 'Function not found: ' + name);

  const braceStart = source.indexOf('{', start);
  assert.notEqual(braceStart, -1, 'Opening brace not found: ' + name);

  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, i);
  }

  throw new Error('Closing brace not found: ' + name);
}

test('R24 guard passes', () => {
  execFileSync(process.execPath, ['scripts/guards/verify-lf-prod-sot-005c-r24-first-narrow-runtime-adoption.cjs'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('R24 rewires exactly getTaskDateKey to the facade compat helper', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const dateKey = getFunctionBody(tasks, 'getTaskDateKey');

  assert.ok(tasks.includes('getTaskStableGroupDateKeyCompat'));
  assert.ok(dateKey.includes('return getTaskStableGroupDateKeyCompat(getTaskMomentRaw(task));'));
  assert.equal(dateKey.includes('slice(0, 10)'), false);
  assert.equal((tasks.match(/getTaskStableGroupDateKeyCompat\(/g) || []).length, 1);
});

test('R24 does not adopt other stable group compat helpers yet', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  for (const forbidden of [
    'isTaskStableGroupClosedCompat',
    'isTaskStableGroupOverdueCompat',
    'getTaskStableGroupIdCompat',
  ]) {
    assert.equal(tasks.includes(forbidden), false, forbidden);
  }
});

test('R24 preserves TasksStable grouping shape and local status helpers', () => {
  const tasks = read('src/pages/TasksStable.tsx');

  for (const helper of [
    'isTaskDone',
    'isTaskToday',
    'isTaskOverdue',
    'getTaskGroupId',
    'buildTaskGroups',
  ]) {
    assert.ok(tasks.includes('function ' + helper), helper);
  }

  const buildGroups = getFunctionBody(tasks, 'buildTaskGroups');
  assert.ok(buildGroups.includes('byId.get(getTaskGroupId(task))?.tasks.push(task);'));
});

test('R24 selected helper preserves current local date-key behavior', () => {
  const cases = [
    ['', ''],
    [null, ''],
    ['2026-07-09', '2026-07-09'],
    ['2026-07-09T14:30:00.000Z', '2026-07-09'],
    ['not-a-date-like-value', 'not-a-date'],
    ['2026-7-9', '2026-7-9'],
  ];

  for (const [raw, expected] of cases) {
    assert.equal(compatDateKey(raw), expected);
  }
});
