const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = 'ddab9c5d';
const sourcePath = 'src/pages/CaseDetail.tsx';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));
const staleCall = 'getTaskNoteFollowUpPreviewStage231H_R1D2_R11(taskWithMissingBridgeStage232O)';
const correctCall = 'getTaskNoteFollowUpPreviewStage231H_R1D2_R11(task)';

const staleIndex = base.lastIndexOf(staleCall);
assert(staleIndex >= 0, 'base must contain the out-of-scope preview call');
assert(current.includes(correctCall), 'current source must use the local task argument');
const expected = base.slice(0, staleIndex) + correctCall + base.slice(staleIndex + staleCall.length);
assert(current === expected, 'current source must equal base with only the local preview argument repaired');

const helperStart = current.indexOf('function findCaseNoteForFollowUpTaskStage231H_R1D2_R15C');
const helperEnd = current.indexOf('\n\n          async function handleDeleteCaseNoteStage231H_R1D2_R6', helperStart);
assert(helperStart >= 0 && helperEnd > helperStart, 'note follow-up helper boundary must be stable');
const helperBlock = current.slice(helperStart, helperEnd);
assert(!helperBlock.includes('taskWithMissingBridgeStage232O'), 'helper must not reference the memo-local bridge variable');
assert(helperBlock.includes(correctCall), 'helper must call preview extraction with its local task');
assert(current.includes('const taskWithMissingBridgeStage232O = enrichCaseTaskFromMissingActivityStage232O(task, caseMissingActivityMetadataStage232O);'), 'openTasks bridge must remain in its existing memo scope');

console.log('PASS: A2-08 uses the local note follow-up task without widening the missing-activity bridge scope.');
