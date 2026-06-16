const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('STAGE232A R8 LeadDetail routes active Braki via linkedTasks ids but renders timeline rows', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  assert.match(lead, /activeMissingTaskIdsStage232AR8/);
  assert.match(lead, /linkedTasks\s*\n\s*\.filter\(\(entry: any\) => isActiveMissingItemTaskStage232AR8\(entry, leadMissingActivityMetadataStage232AR8\)\)/);
  assert.match(lead, /timeline\.filter\(\(entry\) => entry\.kind === 'task' && activeMissingTaskIdsStage232AR8\.has/);
});

test('STAGE232A R8/R9 next actions exclude Brak task ids and Braki group counts all missing', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  assert.match(lead, /!activeMissingTaskIdsStage232AR8\.has\(String\(entry\.raw\?\.id \|\| ''\)\.trim\(\)\)/);
  assert.match(lead, /count: activeMissingItemEntriesStage228R19R2\.length/);
  assert.match(lead, /items: activeMissingItemEntriesStage228R19R2\.slice\(0, 5\)/);
});

test('STAGE232A R8/R9 activity/task bridges preserve blocker identity and row actions stay on list', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const context = read('src/components/ContextActionDialogs.tsx');
  const contract = read('src/lib/data-contract.ts');
  const taskRoute = read('src/server/task-route-stage124f.ts');

  const hasR8InlineMissingActions = lead.includes("group.key === 'blockers' || isMissingItemTimelineEntry(entry)");
  const hasR9MissingOnlyBranch = lead.includes("data-stage232a-r9-row-actions={group.key === 'blockers' ? 'missing-only' : 'default'}")
    && lead.includes("group.key === 'blockers' ? (");
  assert.ok(hasR8InlineMissingActions || hasR9MissingOnlyBranch);

  assert.match(context, /taskId: \(createdMissingTask as any\)\?\.id \|\| null/);
  assert.match(context, /status: draft\.blocksProgress \? 'blocking_missing_item' : 'missing_item'/);
  assert.match(contract, /rawTaskStatusStage232AR8\.includes\('missing'\) \|\| rawTaskStatusStage232AR8\.includes\('block'\)/);
  assert.match(taskRoute, /rawStatusStage232AR8\.includes\('missing'\) \|\| rawStatusStage232AR8\.includes\('block'\)/);
});
