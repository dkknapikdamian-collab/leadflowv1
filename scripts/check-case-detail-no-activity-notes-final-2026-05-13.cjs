const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');
const quiet = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-no-activity-notes-final:', message);
  process.exit(1);
}

const required = [
  'CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_FINAL_2026_05_13',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[])',
  'return [...taskItems, ...eventItems, ...missingItems].sort',
  'buildWorkItems(openTasks, plannedEvents, items)',
  '<article className="case-history-row"',
  '<article key={activity.id} className="case-detail-history-row"',
];

for (const token of required) {
  if (!source.includes(token)) fail('Brak tokenu: ' + token);
}

const forbidden = [
  'const noteItems: WorkItem[] = activities.slice(0, 6)',
  '...noteItems',
  'buildWorkItems(openTasks, plannedEvents, items, activities)',
  'function buildWorkItems(tasks: TaskRecord[], events: EventRecord[], items: CaseItem[], activities: CaseActivity[])',
];

for (const token of forbidden) {
  if (source.includes(token)) fail('Zabroniony przeciek activities do workItems: ' + token);
}

if (!quiet.includes("'tests/case-detail-no-activity-notes-final-2026-05-13.test.cjs'")) {
  fail('Quiet gate nie zawiera finalnego testu no activity notes.');
}

if (quiet.includes("',\\n  '") || quiet.includes("',\\r\\n  '")) {
  fail('Quiet gate zawiera literalny backslash+n.');
}

console.log('OK check:case-detail-no-activity-notes-final');
