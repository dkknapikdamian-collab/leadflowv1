const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function getSnoozeBarBlock(today) {
  const start = today.indexOf('function TodayEntrySnoozeBar({');
  const end = today.indexOf('export default function Today()', start);

  assert.notEqual(start, -1, 'TodayEntrySnoozeBar must exist');
  assert.notEqual(end, -1, 'Today component must exist after TodayEntrySnoozeBar');

  return today.slice(start, end);
}

test('Today quick snooze options are defined before render usage', () => {
  const today = read('src/pages/Today.tsx');

  const definitionIndex = today.indexOf('const TODAY_QUICK_SNOOZE_OPTIONS = [');
  const usageIndex = today.indexOf('TODAY_QUICK_SNOOZE_OPTIONS.map');

  assert.notEqual(definitionIndex, -1, 'TODAY_QUICK_SNOOZE_OPTIONS must be defined');
  assert.notEqual(usageIndex, -1, 'TodayEntrySnoozeBar must render quick snooze options');
  assert.ok(definitionIndex < usageIndex, 'TODAY_QUICK_SNOOZE_OPTIONS must be defined before it is used');

  assert.match(today, /key:\s*'1h'/);
  assert.match(today, /key:\s*'tomorrow'/);
  assert.match(today, /key:\s*'2d'/);
  assert.match(today, /key:\s*'next_week'/);
});

test('Today quick snooze bar has valid label copy', () => {
  const today = read('src/pages/Today.tsx');
  const block = getSnoozeBarBlock(today);

  assert.match(block, /Szybko od\u0142\u00f3\u017c:/);
  assert.doesNotMatch(block, /Szybko od\u0139|Szybko od\u00c5|\u0102\u0142|\u0139\u013d/);
});

test('release gates include Today quick snooze regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/today-quick-snooze-options\.test\.cjs/);
  assert.match(fullGate, /tests\/today-quick-snooze-options\.test\.cjs/);
});
