const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'src/lib/work-items/no-flicker-mutation.ts');
const guardPath = path.join(root, 'scripts/check-g15-r23e-no-flicker-mutation-detail-contract.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');

function occurrences(text, value) {
  return text.split(value).length - 1;
}

test('R23E focused guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23E/);
});

test('event alias points to the existing runtime event constant', () => {
  assert.equal(occurrences(source, "'closeflow:work-item-no-flicker-mutation'"), 1);
  assert.match(source, /export const CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT = CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION;/);
  assert.doesNotMatch(source, /CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT\s*=\s*['"]/);
});

test('shared detail contract includes existing runtime fields and upsert action', () => {
  assert.match(source, /CloseflowWorkItemNoFlickerAction = 'create' \| 'update' \| 'delete' \| 'upsert';/);
  for (const field of ['item', 'record', 'recordType', 'recordId', 'leadId', 'clientId', 'caseId', 'displayKind', 'businessKind']) {
    assert.match(source, new RegExp(`\\s${field}\\?:`));
  }
  assert.match(source, /export type WorkItemNoFlickerMutationDetail = CloseflowWorkItemNoFlickerMutation;/);
});

test('runtime dispatch, normalization and subscription stay on the original event', () => {
  assert.match(source, /id: normalizeWorkItemMutationId\(input\.id \|\| input\.record\),/);
  assert.match(source, /new CustomEvent<CloseflowWorkItemNoFlickerMutation>\(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION,/);
  assert.match(source, /window\.addEventListener\(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener\);/);
  assert.match(source, /window\.removeEventListener\(CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION, listener as EventListener\);/);
});
