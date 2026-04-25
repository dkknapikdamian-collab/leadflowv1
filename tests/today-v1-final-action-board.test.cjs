const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today V1 final helper exposes priority reasons and quick snooze options', () => {
  const source = read('src/lib/today-v1-final.ts');

  assert.match(source, /TODAY_QUICK_SNOOZE_OPTIONS/);
  assert.match(source, /resolveTodaySnoozeAt/);
  assert.match(source, /getTodayEntryPriorityReasons/);
  assert.match(source, /buildTodayV1Digest/);
  assert.match(source, /Odłóż 2h/);
  assert.match(source, /Jutro 9:00/);
  assert.match(source, /Za 3 dni/);
});

test('Today screen wires quick snooze and priority reason UI', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /TodayEntryPriorityReasons/);
  assert.match(source, /TodayEntrySnoozeBar/);
  assert.match(source, /handleSnoozeTodayTask/);
  assert.match(source, /handleSnoozeTodayEvent/);
  assert.match(source, /today_task_snoozed/);
  assert.match(source, /today_event_snoozed/);
  assert.match(source, /resolveTodaySnoozeAt/);
});

test('Today quick snooze keeps task and event updates relation-safe', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /leadId: entry\.raw\?\.leadId \?\? null/);
  assert.match(source, /caseId: entry\.raw\?\.caseId \?\? null/);
  assert.match(source, /status: 'todo'/);
  assert.match(source, /status: 'scheduled'/);
});

test('Activity recognizes Today snooze activity labels', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /today_task_snoozed/);
  assert.match(source, /today_event_snoozed/);
  assert.match(source, /odłożył zadanie z Dziś/);
  assert.match(source, /odłożył wydarzenie z Dziś/);
});

test('Today V1 final documentation exists', () => {
  const doc = read('docs/TODAY_V1_FINAL_ACTION_BOARD_2026-04-24.md');

  assert.match(doc, /Today V1 final action board/);
  assert.match(doc, /today_task_snoozed/);
  assert.match(doc, /Odłóż 2h/);
});
