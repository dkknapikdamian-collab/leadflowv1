const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const text = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE232M CaseDetail missing_item inactive filter covers delete/reject/resolve statuses', () => {
  assert.match(text, /STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE/);
  assert.match(text, /inactiveStatusesStage232M = \['done', 'completed', 'accepted', 'deleted', 'rejected', 'resolved', 'archived', 'cancelled', 'canceled'\]/);
  assert.match(text, /inactiveStatusesStage232M\.includes\(status\)/);
});

test('STAGE232M missing branch writes deleted status and locally closes row', () => {
  assert.match(text, /if \(isStage232I1CaseMissingTaskSource\(target\.source\)\)/);
  assert.match(text, /await updateTaskInSupabase\(\{\n\s+id: task\.id,\n\s+status: 'deleted'/);
  assert.match(text, /kind: 'missing_item'/);
  assert.match(text, /type: 'missing_item'/);
  assert.match(text, /status: 'deleted'/);
  assert.match(text, /setTasks\(\(previous\) => previous\.map\(\(entry\) => String\(entry\.id\) === String\(task\.id\)/);
});

test('STAGE232M keeps normal task delete branch separate', () => {
  assert.match(text, /if \(target\.kind === 'task'\)/);
  assert.match(text, /await deleteTaskFromSupabase\(task\.id\);/);
  assert.match(text, /else if \(target\.kind === 'missing'\)/);
});
