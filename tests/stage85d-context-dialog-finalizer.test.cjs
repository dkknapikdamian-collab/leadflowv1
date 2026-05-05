const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(repo, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(repo, file));

test('Stage85D finalizes context action dialog regex and relation contract', () => {
  const taskDialog = read('src/components/TaskCreateDialog.tsx');
  assert.ok(taskDialog.includes('export type TaskCreateDialogContext'));
  assert.ok(taskDialog.includes('leadId: context?.leadId || undefined'));
  assert.ok(taskDialog.includes('caseId: context?.caseId || undefined'));
  assert.ok(taskDialog.includes('clientId: context?.clientId || undefined'));
  assert.ok(taskDialog.includes('data-stage85-context-relation="true"'));

  const candidates = [
    'tests/stage85-context-action-dialog-unification.test.cjs',
    'scripts/check-stage85-context-action-dialog-unification.cjs',
  ].filter(exists);

  assert.ok(candidates.length >= 1, 'Stage85 guard/test files should exist');
  for (const file of candidates) {
    const body = read(file);
    assert.ok(!body.includes('/leadId: context?.leadId/'), file + ' should not use unsafe optional-chain regex');
    assert.ok(!body.includes('/caseId: context?.caseId/'), file + ' should not use unsafe optional-chain regex');
    assert.ok(!body.includes('/clientId: context?.clientId/'), file + ' should not use unsafe optional-chain regex');
  }
});
