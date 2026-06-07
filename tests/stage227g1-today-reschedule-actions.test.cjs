const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('Stage227G1 adds +1D/+3D/+1W reschedule actions to Today work item cards', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.match(today, /TODAY_RESCHEDULE_OPTIONS_STAGE227G1/);
  assert.match(today, /\{ days: 1, label: '\+1D' \}/);
  assert.match(today, /\{ days: 3, label: '\+3D' \}/);
  assert.match(today, /\{ days: 7, label: '\+1W' \}/);
  assert.match(today, /shiftActions=\{buildTodayRescheduleActionsStage227G1\('task', task\)\}/);
  assert.match(today, /shiftActions=\{buildTodayRescheduleActionsStage227G1\('event', event\)\}/);
});

test('Stage227G1 persists Today reschedules through existing task/event update paths', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.match(today, /handleShiftTodayWorkItemStage227G1/);
  assert.match(today, /updateTaskInSupabase\(\{/);
  assert.match(today, /updateEventInSupabase\(\{/);
  assert.match(today, /scheduledAt: nextStartAt/);
  assert.match(today, /startAt: nextStartAt/);
  assert.match(today, /closeflow:data-mutated/);
});

test('Stage227G1 removes reason copy from next 7 days and reuses Calendar action visual source', () => {
  const today = read('src/pages/TodayStable.tsx');
  const card = read('src/components/work-item-card.tsx');
  assert.doesNotMatch(today, /Powód: zaplanowane zadanie w najbliższych dniach/);
  assert.doesNotMatch(today, /Powód: wydarzenie w najbliższych 7 dniach/);
  assert.match(card, /cf-vst-button cf-selected-day-v9-action cf-work-item-card-shift/);
  assert.match(card, /data-stage227g1-today-calendar-action-source/);
});
