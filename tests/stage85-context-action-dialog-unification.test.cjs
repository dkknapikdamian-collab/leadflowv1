const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function chars() { return String.fromCharCode.apply(String, arguments); }
const badFragments = [chars(0x0139), chars(0x00c4), chars(0x0102), chars(0x00c5, 0x00bc), chars(0x00c3, 0x00b3)];

test('Stage85 adds one shared context action host for detail screens', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION/);
  assert.match(host, /buildContextFromPath/);
  assert.match(host, /recordType: 'lead'/);
  assert.match(host, /recordType: 'client'/);
  assert.match(host, /recordType: 'case'/);
  assert.match(host, /TaskCreateDialog/);
  assert.match(host, /EventCreateDialog/);
  assert.match(host, /ContextNoteDialog/);
});

test('Stage85 task dialog accepts relation context instead of local simplified forms', () => {
  const taskDialog = read('src/components/TaskCreateDialog.tsx');
  assert.match(taskDialog, /TaskCreateDialogContext/);
  assert.ok(taskDialog.includes('leadId: context?.leadId || undefined'));
  assert.ok(taskDialog.includes('caseId: context?.caseId || undefined'));
  assert.ok(taskDialog.includes('clientId: context?.clientId || undefined'));
  assert.match(taskDialog, /Powi\u0105zanie:/);
});

test('Stage85 guards do not store mojibake literals', () => {
  ['scripts/check-stage84-lead-detail-work-center.cjs', 'tests/stage84-lead-detail-work-center.test.cjs'].forEach((rel) => {
    const body = read(rel);
    badFragments.forEach((fragment) => assert.equal(body.includes(fragment), false, rel));
  });
});
