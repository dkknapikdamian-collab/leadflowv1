const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE232L CaseDetail task delete uses existing linked-note helper', () => {
  assert.match(caseDetail, /STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP/);
  assert.match(caseDetail, /function findCaseNoteForFollowUpTaskStage231H_R1D2_R15C\(task: TaskRecord\)/);
  assert.match(caseDetail, /const linkedNoteStage231H_R1D2_R15C = findCaseNoteForFollowUpTaskStage231H_R1D2_R15C\(task\);/);
  assert.doesNotMatch(caseDetail, /getLinkedNoteForTaskStage231H_R1D2_R15C\(/);
});

test('STAGE232L task, event and missing delete branches remain present in CaseDetail', () => {
  assert.match(caseDetail, /if \(target\.kind === 'task'\)/);
  assert.match(caseDetail, /await deleteTaskFromSupabase\(task\.id\);/);
  assert.match(caseDetail, /else if \(target\.kind === 'event'\)/);
  assert.match(caseDetail, /await deleteEventFromSupabase\(event\.id\);/);
  assert.match(caseDetail, /else if \(target\.kind === 'missing'\)/);
});
