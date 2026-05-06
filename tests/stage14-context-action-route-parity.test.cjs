const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function assertIncludes(rel, text) {
  assert.ok(read(rel).includes(text), rel + ' should include: ' + text);
}
function assertNotIncludes(rel, text) {
  assert.equal(read(rel).includes(text), false, rel + ' should not include: ' + text);
}

test('Stage14 keeps one shared host for task, event and note context actions', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /ContextActionKind = 'task' \| 'event' \| 'note'/);
  assert.ok(host.includes('TaskCreateDialog'));
  assert.ok(host.includes('EventCreateDialog'));
  assert.ok(host.includes('ContextNoteDialog'));
  assert.ok(host.includes('openContextQuickAction'));
  assert.ok(host.includes('data-context-action-dialog-host="true"'));
});

test('Stage14 detail pages route quick task/event/note actions through the shared context dispatcher', () => {
  for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
    assertIncludes(rel, 'openContextQuickAction');
    assertIncludes(rel, 'ContextActionKind');
    assertNotIncludes(rel, "from '../components/TaskCreateDialog'");
    assertNotIncludes(rel, "from '../components/EventCreateDialog'");
  }
  assertIncludes('src/pages/LeadDetail.tsx', "recordType: 'lead'");
  assertIncludes('src/pages/ClientDetail.tsx', "recordType: 'client'");
  assertIncludes('src/pages/CaseDetail.tsx', "recordType: 'case'");
});

test('Stage14 task and event dialogs write the same relation payload shape', () => {
  for (const rel of ['src/components/TaskCreateDialog.tsx', 'src/components/EventCreateDialog.tsx']) {
    assertIncludes(rel, 'leadId: context?.leadId');
    assertIncludes(rel, 'caseId: context?.caseId');
    assertIncludes(rel, 'clientId: context?.clientId');
    assertIncludes(rel, 'workspaceId,');
  }
  assertIncludes('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
  assertIncludes('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');
  assertIncludes('src/components/EventCreateDialog.tsx', 'scheduledAt: form.startAt');
});

test('Stage14 package scripts and release note exist', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage14-context-action-route-parity-v1'], 'node scripts/check-stage14-context-action-route-parity.cjs');
  assert.equal(pkg.scripts['test:stage14-context-action-route-parity-v1'], 'node --test tests/stage14-context-action-route-parity.test.cjs');
  assert.ok(pkg.scripts['verify:stage14-action-route-parity'].includes('check:stage14-context-action-route-parity-v1'));
  const doc = read('docs/release/STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1_2026-05-06.md');
  assert.match(doc, /STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1/);
  assert.match(doc, /same action opens the same shared dialog/);
});
