const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/CaseDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-08-case-detail-note-followup-scope.cjs';
const baseSha = 'ddab9c5d';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-08 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-08/);
});

test('A2-08 changes only the out-of-scope preview argument', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  const staleCall = 'getTaskNoteFollowUpPreviewStage231H_R1D2_R11(taskWithMissingBridgeStage232O)';
  const correctCall = 'getTaskNoteFollowUpPreviewStage231H_R1D2_R11(task)';
  const staleIndex = base.lastIndexOf(staleCall);
  assert.ok(staleIndex >= 0);
  const expected = base.slice(0, staleIndex) + correctCall + base.slice(staleIndex + staleCall.length);
  assert.equal(current, expected);
});

test('A2-08 keeps the bridge memo-local and the helper task-local', () => {
  const current = read(sourcePath);
  const helperStart = current.indexOf('function findCaseNoteForFollowUpTaskStage231H_R1D2_R15C');
  const helperEnd = current.indexOf('\n\n          async function handleDeleteCaseNoteStage231H_R1D2_R6', helperStart);
  const helperBlock = current.slice(helperStart, helperEnd);
  assert.doesNotMatch(helperBlock, /taskWithMissingBridgeStage232O/);
  assert.match(helperBlock, /getTaskNoteFollowUpPreviewStage231H_R1D2_R11\(task\)/);
  assert.match(current, /const taskWithMissingBridgeStage232O = enrichCaseTaskFromMissingActivityStage232O\(task, caseMissingActivityMetadataStage232O\);/);
});
