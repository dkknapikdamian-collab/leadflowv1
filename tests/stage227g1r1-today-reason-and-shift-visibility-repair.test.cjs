const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');
const workItem = fs.readFileSync('src/components/work-item-card.tsx', 'utf8');
const css = fs.readFileSync('src/styles/work-item-card.css', 'utf8');

test('Stage227G1R1 removes Powod/Powód helper copy from Today runtime', () => {
  assert.match(today, /STAGE227G1R1_TODAY_REASON_COPY_FINAL_REMOVAL/);
  assert.doesNotMatch(today, /Powód:/);
  assert.doesNotMatch(today, /Powod:/);
  assert.doesNotMatch(today, /zaplanowane zadanie w najbliższych dniach/);
  assert.doesNotMatch(today, /wydarzenie w najbliższych 7 dniach/);
});

test('Stage227G1R1 keeps reschedule actions visible for today and upcoming task/event cards', () => {
  assert.match(today, /buildTodayRescheduleActionsStage227G1/);
  assert.match(today, /shiftActions=/);
  assert.match(today, /'task'/);
  assert.match(today, /'event'/);
  assert.match(today, /operatorTasks/);
  assert.match(today, /todayEvents/);
  assert.match(today, /upcomingRows/);

  const shiftActionUses = (today.match(/shiftActions=/g) || []).length;
  assert.ok(shiftActionUses >= 3, `Expected at least 3 WorkItemCard shiftActions uses, got ${shiftActionUses}`);

  assert.match(workItem, /data-stage227g1-today-reschedule-action/);
  assert.match(workItem, /shiftActions/);
  assert.match(css, /STAGE227G1R1_TODAY_SHIFT_VISIBILITY_REPAIR/);
  assert.match(css, /cf-work-item-card-shift/);
});