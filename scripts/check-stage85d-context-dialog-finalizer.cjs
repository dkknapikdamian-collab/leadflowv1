const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const repo = process.cwd();
const read = (file) => fs.readFileSync(path.join(repo, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(repo, file));

const taskDialog = read('src/components/TaskCreateDialog.tsx');
[
  'export type TaskCreateDialogContext',
  'context?: TaskCreateDialogContext',
  'leadId: context?.leadId || undefined',
  'caseId: context?.caseId || undefined',
  'clientId: context?.clientId || undefined',
  'data-stage85-context-relation="true"',
].forEach((text) => assert.ok(taskDialog.includes(text), 'TaskCreateDialog missing ' + text));

if (exists('src/components/ContextActionDialogs.tsx')) {
  const contextDialogs = read('src/components/ContextActionDialogs.tsx');
  assert.ok(contextDialogs.includes('STAGE85_CONTEXT_ACTION_DIALOG_UNIFICATION'), 'ContextActionDialogs should keep Stage85 marker');
  assert.ok(contextDialogs.includes('TaskCreateDialog'), 'ContextActionDialogs should reuse TaskCreateDialog');
}

const files = [
  'tests/stage85-context-action-dialog-unification.test.cjs',
  'scripts/check-stage85-context-action-dialog-unification.cjs',
  'tests/stage86-context-action-dialog-guard.test.cjs',
  'scripts/check-stage86-context-action-dialog-guard.cjs',
].filter(exists);

for (const file of files) {
  const body = read(file);
  [
    '/leadId: context?.leadId/',
    '/caseId: context?.caseId/',
    '/clientId: context?.clientId/',
    '/recordLabel: context?.recordLabel/',
  ].forEach((bad) => assert.ok(!body.includes(bad), file + ' contains unsafe optional-chain regex literal: ' + bad));
}

console.log('PASS STAGE85D_CONTEXT_DIALOG_FINALIZER');
