const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('buildWorkItems does not convert activities into work item cards', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_FINAL_2026_05_13'));
  assert.ok(source.includes('function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])'));
  assert.ok(source.includes('return [...taskItems, ...eventItems, ...missingItems].sort'));

  assert.equal(source.includes('const noteItems: WorkItem[] = activities.slice(0, 6)'), false);
  assert.equal(source.includes('...noteItems'), false);
  assert.equal(source.includes('buildWorkItems(openTasks, plannedEvents, items, activities)'), false);
});

test('activities still have compact history rendering', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('<article className="case-history-row"'));
  assert.ok(source.includes('<article key={activity.id} className="case-detail-history-row"'));
  assert.ok(source.includes('activities.map((activity) => ('));
});

test('final no-activity-notes test is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-no-activity-notes-final-2026-05-13.test.cjs'"));
});
