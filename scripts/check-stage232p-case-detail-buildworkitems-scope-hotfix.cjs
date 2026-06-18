const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX';
const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const start = source.indexOf('function buildWorkItems(');
assert.ok(start >= 0, 'buildWorkItems missing');
const end = source.indexOf('function WorkKindIcon', start);
assert.ok(end > start, 'buildWorkItems end anchor missing');
const buildBlock = source.slice(start, end);

assert.ok(source.includes(stage), 'STAGE232P marker missing');
assert.ok(!buildBlock.includes('taskWithMissingBridgeStage232O'), 'buildWorkItems must not reference taskWithMissingBridgeStage232O outside useMemo scope');
assert.ok(buildBlock.includes('getTaskNoteFollowUpPreviewStage231H_R1D2_R11(task)'), 'buildWorkItems must call note follow-up preview helper with local task');
assert.ok(source.includes('const taskWithMissingBridgeStage232O = enrichCaseTaskFromMissingActivityStage232O(task, caseMissingActivityMetadataStage232O);'), 'valid bridge variable in useMemo must remain');
assert.ok(source.includes('function enrichCaseTaskFromMissingActivityStage232O'), 'STAGE232O case missing bridge helper must remain');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232p-case-detail-buildworkitems-scope-hotfix' }, null, 2));
