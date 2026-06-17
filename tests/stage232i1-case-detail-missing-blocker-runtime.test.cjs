const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const dialogs = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');
test('I1 creates case Braki as missing_item task/work item with caseId', () => {
  assert.match(dialogs, /type: 'missing_item'/);
  assert.match(dialogs, /caseId: caseId \|\| null/);
  assert.match(dialogs, /sourceEntityType: request\.recordType/);
  assert.match(dialogs, /persistenceTarget: 'task_activity_missing_item'/);
});
test('I1 uses explicit context-action blocker button in CaseDetail', () => {
  assert.match(caseDetail, /data-stage232i1-case-missing-action="true"/);
  assert.match(caseDetail, /data-context-action-kind="blocker"/);
  assert.match(caseDetail, /data-context-record-type="case"/);
});
test('I1 resolves, filters done missing tasks, and deletes from active task source', () => {
  assert.match(caseDetail, /data-stage232i1-resolve-case-missing="true"/);
  assert.match(caseDetail, /isStage232I1ResolvedCaseMissingTask/);
  assert.match(caseDetail, /missing_item_resolved/);
  assert.match(caseDetail, /missing_item_deleted/);
});
test('I1 keeps case_items legacy only', () => {
  assert.match(caseDetail, /legacy checklist\/case_items compatibility only/);
  assert.doesNotMatch(dialogs, /if \(request\.recordType === 'case'\) \{[\s\S]*?insertCaseItemToSupabase/);
});
test('I1 does not add SQL or ClientDetail\/Owner Control runtime', () => {
  assert.doesNotMatch(caseDetail + dialogs, /CREATE TABLE|ALTER TABLE|CREATE POLICY|DROP TABLE/i);
  assert.doesNotMatch(caseDetail, /directClientMissingItems|caseMissingItems/);
  assert.doesNotMatch(caseDetail, /ownerControl.*caseMissing/i);
});
