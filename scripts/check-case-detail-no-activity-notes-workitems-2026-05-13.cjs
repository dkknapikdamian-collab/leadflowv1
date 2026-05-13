const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');
const quiet = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-no-activity-notes-workitems:', message);
  process.exit(1);
}

for (const token of [
  'CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])',
  'buildWorkItems(openTasks, plannedEvents, items)',
  '<article className="case-history-row"',
  '<article key={activity.id} className="case-detail-history-row"',
]) {
  if (!source.includes(token)) fail('Brak tokenu: ' + token);
}

for (const forbidden of [
  'const noteItems: WorkItem[] = activities.slice(0, 6)',
  '...noteItems',
  'buildWorkItems(openTasks, plannedEvents, items, activities)',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[])',
]) {
  if (source.includes(forbidden)) fail('Zabroniony przeciek aktywnosci do workItems: ' + forbidden);
}

if (!quiet.includes("'tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs'")) {
  fail('Quiet gate nie zawiera testu no activity notes workitems.');
}

console.log('OK check:case-detail-no-activity-notes-workitems');
