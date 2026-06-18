const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE';
const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

assert.ok(text.includes(stage), 'STAGE232M marker missing');
assert.ok(text.includes('inactiveStatusesStage232M'), 'inactive status list missing');
for (const status of ['done', 'completed', 'accepted', 'deleted', 'rejected', 'resolved', 'archived', 'cancelled', 'canceled']) {
  assert.ok(text.includes("'" + status + "'"), 'inactive status missing: ' + status);
}
assert.ok(/inactiveStatusesStage232M\.includes\(status\)/.test(text), 'resolved missing helper must use inactive status list');
assert.ok(text.includes("source: 'STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE'"), 'delete payload source missing');
assert.ok(text.includes("setTasks((previous) => previous.map((entry) => String(entry.id) === String(task.id)"), 'local setTasks closure missing');
assert.ok(text.includes("await updateTaskInSupabase({\n            id: task.id,\n            status: 'deleted'"), 'missing_item branch must update task status deleted explicitly');
assert.ok(text.includes("eventType === 'missing_item_deleted'") || text.includes("recordActivity('missing_item_deleted'"), 'missing item deleted activity missing');
assert.ok(text.includes("await deleteTaskFromSupabase(task.id);"), 'normal task delete branch must remain available');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232m-case-detail-missing-item-filter-delete-closure' }, null, 2));
