const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');

test('STAGE232A R6/R8 active Braki still use linkedTasks/workItems, not history/activity as active source', () => {
  assert.match(
    lead,
    /linkedTasks\s*\n\s*\.filter\(\(entry: any\) => isActiveMissingItemTaskStage232AR(?:6|8)\(entry(?:,\s*leadMissingActivityMetadataStage232AR8)?\)\)/
  );
  assert.match(lead, /const activeMissingItemEntriesStage232AR6 = activeMissingItemEntriesStage232AR8;/);
  assert.doesNotMatch(lead, /const activeMissingItemEntriesStage232AR6 = useMemo\(\s*\(\) => activities\.filter/);
});

test('STAGE232A R6/R8 Blokady are explicit subset, not every Brak', () => {
  assert.match(
    lead,
    /activeMissingItemEntriesStage232AR8\.filter\(\(entry: any\) => isLeadBlockerTaskStage232AR8\(entry\.raw \|\| entry, leadMissingActivityMetadataStage232AR8\)\)/
  );
  assert.doesNotMatch(lead, /const leadBlockerEntries = activeMissingItemEntriesStage232AR8;/);
});

test('STAGE232A R6/R8 modal task persists metadata for hard refresh/no-flicker', () => {
  assert.match(context, /missingKind/);
  assert.match(context, /blocksProgress/);
  assert.match(context, /blockScope/);
  assert.match(context, /taskId: \(createdMissingTask as any\)\?\.id \|\| null/);
});
