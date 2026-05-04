const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const marker = 'STAGE57_CASE_CREATE_ACTION_HUB';
function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

test('STAGE57_CASE_CREATE_ACTION_HUB wires three case create actions', () => {
  const tsx = read('src/pages/CaseDetail.tsx');
  assert.ok(tsx.includes(marker));
  assert.ok(tsx.includes('data-case-create-action="task"'));
  assert.ok(tsx.includes('data-case-create-action="event"'));
  assert.ok(tsx.includes('data-case-create-action="note"'));
  assert.ok(tsx.includes('setIsAddTaskOpen(true)'));
  assert.ok(tsx.includes('setIsAddEventOpen(true)'));
  assert.ok(tsx.includes('setIsAddNoteOpen(true)'));
});

test('STAGE57 created task/event records stay linked to case and client', () => {
  const tsx = read('src/pages/CaseDetail.tsx');
  assert.ok(tsx.includes('caseId,'));
  assert.ok(tsx.includes('clientId: caseData?.clientId || null'));
  assert.ok(tsx.includes('leadId: caseData?.leadId || null'));
  assert.ok(!tsx.includes('|| !newEvent.startAt)'));
});
