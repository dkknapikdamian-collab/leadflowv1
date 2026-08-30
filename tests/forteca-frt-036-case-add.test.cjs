const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-036 remains the accepted Case Add contract with one real source path', () => {
  const workflow = JSON.parse(read('_project/WORKFLOW_STATE.json'));
  const contract = read('_project/contracts/forteca-clean/FRT-036_CASE_ADD.md');
  const cases = read('src/pages/Cases.tsx');
  const api = read('api/cases.ts');

  assert.ok(workflow.forteca_program?.accepted_receipts?.includes('FRT-036'));
  assert.equal(workflow.forteca_program?.stage_036_status, 'PASS');
  assert.match(contract, /^STAGE_ID: FRT-036$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases$/m);
  assert.match(contract, /^TARGET_STATE: Add Case modal$/m);
  assert.match(cases, /createCaseInSupabase\(/);
  assert.match(cases, /readCreatedCaseId\(createdCase\)/);
  assert.match(api, /insertCaseWithSchemaFallback/);
  assert.match(api, /workspace_id: finalWorkspaceId/);
});

test('Case Add keeps relation, validation, refresh and error ownership in the existing flow', () => {
  const cases = read('src/pages/Cases.tsx');

  for (const snippet of [
    'clientId: newCase.clientId || null',
    'if (!newCase.title.trim()) return toast.error(\'Podaj tytuł sprawy.\')',
    'if (!newCase.clientId && !newCase.clientName.trim()) return toast.error(\'Wybierz klienta albo utwórz nowego.\')',
    'await refreshCases()',
    'getCreateCaseErrorMessage(error)',
    'data-case-add-modal="true"',
    'id="case-create-title"',
    'id="case-create-client"',
    'id="case-create-status"',
    'disabled={createCasePending}',
    'if (createCasePending) return;',
  ]) {
    assert.ok(cases.includes(snippet), `Cases.tsx must keep ${snippet}`);
  }

  assert.match(cases, /push\(record\.clientId, record\.clientName/);
  assert.match(cases, /push\(client\?\.id, client\?\.name/);
  assert.match(cases, /CASE_STATUS_OPTIONS[\s\S]*CASE_CREATE_STATUS_VALUES/);
  assert.doesNotMatch(cases, /toast\.error\(error\.message\)/);
});

test('Case Add uses the canonical status and response-id sources', () => {
  const cases = read('src/pages/Cases.tsx');
  const status = read('src/lib/source-of-truth/case-options.ts');
  const idSource = read('src/lib/cases/read-created-case-id.ts');
  const starter = read('src/lib/cases/create-client-case.ts');

  assert.match(cases, /CASE_STATUS_OPTIONS/);
  assert.match(status, /export const CASE_STATUS_OPTIONS/);
  assert.match(idSource, /row\.caseId[\s\S]*row\.case_id/);
  assert.match(starter, /readCreatedCaseId\(createdCase\)/);
  assert.match(starter, /export \{ readCreatedCaseId \} from '\.\/read-created-case-id'/);
});

test('Case Add calm-light composition remains under the registered dialog/form owner', () => {
  const cases = read('src/pages/Cases.tsx');
  const dialogs = read('src/styles/owners/closeflow-dialogs.css');

  assert.match(cases, /<DialogContent className="client-case-form-content case-form-stage23-content" data-case-add-modal="true"/);
  assert.match(dialogs, /\/\* FRT-036: the generic Cases add modal composes the registered modal\/form/);
  assert.match(dialogs, /\[data-closeflow-modal-visual-system="true"\]\.client-case-form-content\[data-case-add-modal="true"\]/);
  for (const token of [
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-radius-panel',
    '--cf-vst-shadow-modal',
    '--cf-vst-input-focus-ring',
  ]) assert.ok(dialogs.includes(token), `canonical dialog owner must use ${token}`);

  assert.doesNotMatch(dialogs.slice(dialogs.lastIndexOf('/* FRT-036:')), /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(dialogs.slice(dialogs.lastIndexOf('/* FRT-036:')), /\b(?:rgba?|hsla?)\s*\(/i);
});
