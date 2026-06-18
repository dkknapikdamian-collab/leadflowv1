const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const start = source.indexOf('function buildWorkItems(');
const end = source.indexOf('function WorkKindIcon', start);
const buildBlock = source.slice(start, end);

test('STAGE232P buildWorkItems has no out-of-scope bridge variable', () => {
  assert.match(source, /STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX/);
  assert.doesNotMatch(buildBlock, /taskWithMissingBridgeStage232O/);
  assert.match(buildBlock, /getTaskNoteFollowUpPreviewStage231H_R1D2_R11\(task\)/);
});

test('STAGE232P keeps valid missing activity bridge in openTasks useMemo', () => {
  assert.match(source, /const taskWithMissingBridgeStage232O = enrichCaseTaskFromMissingActivityStage232O\(task, caseMissingActivityMetadataStage232O\);/);
  assert.match(source, /function enrichCaseTaskFromMissingActivityStage232O/);
  assert.match(source, /const caseMissingActivityMetadataStage232O = useMemo/);
});
