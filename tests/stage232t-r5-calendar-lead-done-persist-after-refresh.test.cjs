const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function read(file) { return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''); }
test('lead done has durable work item source before next action clear', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /ensureCompletedLeadCalendarActionStage232T_R5/);
  assert.match(calendar, /insertTaskToSupabase\(\{/);
  assert.match(calendar, /updateTaskInSupabase\(\{/);
  assert.match(calendar, /status: 'done'/);
  assert.match(calendar, /durableLeadActionStage232T_R5[\s\S]{0,400}await updateLeadInSupabase\(\{[\s\S]{0,260}nextActionAt: null/);
});
test('durable completed lead task is idempotent by lead, moment and title', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /findCompletedLeadCalendarActionTaskIdStage232T_R5/);
  assert.match(calendar, /leadId, normalizeLeadDoneMomentKeyStage232T_R5\(scheduledAt\), title\.trim\(\)\.toLowerCase\(\)/);
  assert.match(calendar, /tasks\.find/);
});
test('task route keeps R5 completed lead action visible after refresh', () => {
  const taskRoute = read('src/server/task-route-stage124f.ts');
  assert.match(taskRoute, /shouldKeepCompletedLeadCalendarActionVisibleStage232T_R5/);
  assert.match(taskRoute, /calendar_lead_done_persist_after_refresh/);
  assert.match(taskRoute, /payload\.show_in_calendar = true/);
  assert.match(taskRoute, /payload\.show_in_tasks = true/);
});
test('lead is not deleted and active next action is still cleared', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.doesNotMatch(calendar, /deleteLeadFromSupabase/);
  assert.match(calendar, /nextActionAt: null/);
  assert.match(calendar, /nextActionTitle: ''/);
  assert.match(calendar, /nextActionItemId: null/);
});
test('R5 avoids local or DOM plaster markers', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.doesNotMatch(calendar, /STAGE232T_R5_LOCALSTORAGE_FINAL_SOURCE/);
  assert.doesNotMatch(calendar, /STAGE232T_R5_SESSIONSTORAGE_FINAL_SOURCE/);
  assert.doesNotMatch(calendar, /STAGE232T_R5_DOM_RECREATE_COMPLETED_LEAD/);
});
