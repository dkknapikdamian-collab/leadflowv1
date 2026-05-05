const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

const repo = process.cwd();
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function chars() { return String.fromCharCode.apply(String, arguments); }
function assertContains(rel, text) {
  assert.ok(read(rel).includes(text), rel + ' missing ' + text);
  console.log('PASS ' + rel + ': contains ' + text);
}
function assertNoEncodingFragments(rel) {
  const body = read(rel);
  [chars(0x0139), chars(0x00c4), chars(0x0102), chars(0x00c5, 0x00bc), chars(0x00c3, 0x00b3)].forEach((fragment) => {
    assert.equal(body.includes(fragment), false, rel + ' contains forbidden encoding fragment');
  });
}

assertContains('src/components/ContextActionDialogs.tsx', 'STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION');
assertContains('src/components/ContextActionDialogs.tsx', 'data-context-action-dialog-host="true"');
assertContains('src/components/ContextActionDialogs.tsx', 'TaskCreateDialog');
assertContains('src/components/ContextActionDialogs.tsx', 'EventCreateDialog');
assertContains('src/components/ContextActionDialogs.tsx', 'ContextNoteDialog');
assertContains('src/components/ContextActionDialogs.tsx', "section === 'clients'");
assertContains('src/components/EventCreateDialog.tsx', 'STAGE85_EVENT_CREATE_DIALOG_SHARED');
assertContains('src/components/ContextNoteDialog.tsx', 'STAGE85_CONTEXT_NOTE_DIALOG_SHARED');
assertContains('src/components/TaskCreateDialog.tsx', 'STAGE85_TASK_CREATE_DIALOG_CONTEXT');
assertContains('src/components/TaskCreateDialog.tsx', 'context?.leadId');
assertContains('src/components/TaskCreateDialog.tsx', 'context?.caseId');
assertContains('src/components/TaskCreateDialog.tsx', 'context?.clientId');
assertContains('src/components/Layout.tsx', 'ContextActionDialogsHost');
assertContains('docs/release/STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION_2026-05-05.md', 'Stage85');
assertNoEncodingFragments('scripts/check-stage84-lead-detail-work-center.cjs');
assertNoEncodingFragments('tests/stage84-lead-detail-work-center.test.cjs');
console.log('PASS STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION');
