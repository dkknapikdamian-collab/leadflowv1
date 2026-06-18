const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE232N LeadDetail renders missing_item as Brak or Blokada', () => {
  assert.match(lead, /STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION/);
  assert.match(lead, /function getLeadTimelineKindLabelStage232N\(entry: any\)/);
  assert.match(lead, /function getLeadTimelineStatusLabelStage232N\(entry: any\)/);
  assert.match(lead, /isBlockingMissingItemTimelineEntryStage232N\(entry\) \? 'Blokada' : 'Brak'/);
  assert.doesNotMatch(lead, /<small>\{entry\.kind === 'task' \? 'Zadanie' : 'Wydarzenie'\}<\/small>/);
  assert.doesNotMatch(lead, /<small>\{entry\.kind === 'task' \? 'Zadanie' : 'Wydarzenie'\} • \{entry\.statusLabel\}<\/small>/);
});

test('STAGE232N ContextActionDialogs preserves missing display kind in no-flicker mutation', () => {
  assert.match(context, /STAGE232N_CONTEXT_ACTION_MISSING_NO_FLICKER_DISPLAY_KIND/);
  assert.match(context, /createdMissingTaskRecordStage232N/);
  assert.match(context, /displayKind: 'missing'/);
  assert.match(context, /businessKind: 'missing_item'/);
  assert.match(context, /record: createdMissingTaskRecordStage232N/);
});

test('STAGE232N CaseDetail keeps task-based missing_item classified as missing', () => {
  assert.match(caseDetail, /kind: isMissingStage232I1 \? 'missing' : 'task'/);
  assert.match(caseDetail, /inactiveStatusesStage232M/);
});
