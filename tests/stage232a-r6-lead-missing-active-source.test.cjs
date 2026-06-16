const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('STAGE232A R6 active Braki use linkedTasks/workItems, not history/activity', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const selectorStart = lead.indexOf('const activeMissingItemEntriesStage232AR6');
  const selectorEnd = lead.indexOf('const leadNextActionEntries', selectorStart);
  assert.ok(selectorStart > -1, 'missing activeMissingItemEntriesStage232AR6');
  assert.ok(selectorEnd > selectorStart, 'missing leadNextActionEntries after selector');
  const selector = lead.slice(selectorStart, selectorEnd);

  assert.match(selector, /linkedTasks\.filter\(\(entry: any\) => isActiveMissingItemTaskStage232AR6\(entry\)\)/);
  assert.doesNotMatch(selector, /activities\./);
  assert.doesNotMatch(selector, /timeline\.filter/);
  assert.doesNotMatch(selector, /title\.includes\('brak'\)/);
  assert.doesNotMatch(selector, /title\.includes\('missing'\)/);
});

test('STAGE232A R6 Blokady are explicit subset, not every Brak', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  assert.match(lead, /const leadBlockerEntries = useMemo\(/);
  assert.match(lead, /activeMissingItemEntriesStage232AR6\.filter\(\(entry: any\) => isLeadBlockerTaskStage232AR6\(entry\)\)/);
  assert.match(lead, /metadata\.blocksProgress === true \|\| metadata\.status\.includes\('block'\)/);
  assert.doesNotMatch(lead, /const leadBlockerEntries = activeMissingItemEntriesStage228R19R2;/);
});

test('STAGE232A R6 modal task persists metadata for hard refresh/no-flicker', () => {
  const context = read('src/components/ContextActionDialogs.tsx');
  assert.match(context, /let createdMissingTask: Record<string, unknown> \| null = null;/);
  assert.match(context, /status: draft\.blocksProgress \? 'blocking_missing_item' : 'missing_item'/);
  assert.match(context, /missingKind: draft\.missingKind/);
  assert.match(context, /blocksProgress: draft\.blocksProgress/);
  assert.match(context, /blockScope: draft\.blockScope \|\| null/);
  assert.match(context, /source: 'stage232a_r6_lead_missing_blocker_active_source_truth'/);
  assert.match(context, /await handleSaved\(createdMissingTask \|\| undefined\);/);
});
