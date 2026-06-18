const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE232O LeadDetail marks activity-bridged missing rows before rendering labels', () => {
  assert.match(lead, /activityBridgeMissingStage232O/);
  assert.match(lead, /stage232oMissingItem: true/);
  assert.match(lead, /displayKind: 'missing'/);
  assert.match(lead, /businessKind: 'missing_item'/);
  assert.match(lead, /getLeadTimelineKindLabelStage232N\(entry\)/);
});

test('STAGE232O ContextActionDialogs sends enriched missing record through saved event', () => {
  assert.match(context, /let createdMissingTaskRecordStage232O/);
  assert.match(context, /createdMissingTaskRecordStage232O = createdMissingTaskRecordStage232N/);
  assert.match(context, /await handleSaved\(createdMissingTaskRecordStage232O \|\| createdMissingTask \|\| undefined\);/);
});

test('STAGE232O CaseDetail can classify normalized task rows from missing_item_created activity', () => {
  assert.match(caseDetail, /function buildCaseMissingActivityMetadataStage232O/);
  assert.match(caseDetail, /function enrichCaseTaskFromMissingActivityStage232O/);
  assert.match(caseDetail, /const caseMissingActivityMetadataStage232O = useMemo/);
  assert.match(caseDetail, /taskWithMissingBridgeStage232O/);
  assert.match(caseDetail, /type: 'missing_item'/);
  assert.match(caseDetail, /status: metadata\.blocksProgress \? 'blocking_missing_item' : 'missing_item'/);
});
