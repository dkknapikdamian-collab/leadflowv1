const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND';
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

assert.ok(lead.includes('STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND'), 'LeadDetail STAGE232O marker missing');
assert.ok(lead.includes('activityBridgeMissingStage232O'), 'LeadDetail helper must detect activity-bridged missing items');
assert.ok(lead.includes('stage232oMissingItem: true'), 'LeadDetail active missing entries must carry stage232o missing marker');
assert.ok(lead.includes("displayKind: 'missing'"), 'LeadDetail active missing entries must carry displayKind missing');
assert.ok(lead.includes("businessKind: 'missing_item'"), 'LeadDetail active missing entries must carry businessKind missing');

assert.ok(context.includes('STAGE232O_CONTEXT_ACTION_SAVED_RECORD_USES_MISSING_RECORD'), 'ContextActionDialogs STAGE232O marker missing');
assert.ok(context.includes('let createdMissingTaskRecordStage232O'), 'ContextActionDialogs enriched saved record variable missing');
assert.ok(context.includes('await handleSaved(createdMissingTaskRecordStage232O || createdMissingTask || undefined);'), 'ContextActionDialogs must pass enriched missing record to saved event');

assert.ok(caseDetail.includes('STAGE232O_CASE_DETAIL_MISSING_ACTIVITY_BRIDGE'), 'CaseDetail STAGE232O marker missing');
assert.ok(caseDetail.includes('function buildCaseMissingActivityMetadataStage232O'), 'CaseDetail missing activity metadata helper missing');
assert.ok(caseDetail.includes('function enrichCaseTaskFromMissingActivityStage232O'), 'CaseDetail missing task enrichment helper missing');
assert.ok(caseDetail.includes('const caseMissingActivityMetadataStage232O = useMemo('), 'CaseDetail missing activity metadata useMemo missing');
assert.ok(caseDetail.includes('taskWithMissingBridgeStage232O'), 'CaseDetail openTasks bridge variable missing');
assert.ok(caseDetail.includes("kind: isMissingStage232I1 ? 'missing' : 'task'"), 'CaseDetail buildWorkItems missing classification must remain');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232o-missing-item-activity-bridge-and-case-append' }, null, 2));
