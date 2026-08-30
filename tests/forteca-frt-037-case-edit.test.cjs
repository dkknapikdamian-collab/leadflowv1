const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-037 is the active Case Edit contract with one real source path', () => {
  const workflow = JSON.parse(read('_project/WORKFLOW_STATE.json'));
  const contract = read('_project/contracts/forteca-clean/FRT-037_CASE_EDIT.md');
  const detail = read('src/pages/CaseDetail.tsx');

  assert.equal(workflow.current_stage, 'FRT-037');
  assert.equal(workflow.current_status, 'ACTIVE');
  assert.match(contract, /^STAGE_ID: FRT-037$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases\/:caseId$/m);
  assert.match(contract, /^TARGET_STATE: Edit Case modal$/m);
  assert.match(contract, /CURRENT_RUNTIME_OWNERS: src\/pages\/CaseDetail\.tsx edit dialog/);
  assert.match(detail, /data-case-detail-edit-action="true"/);
  assert.match(detail, /data-case-edit-modal="true"/);
  assert.match(detail, /Edytuj sprawę/);
  const currentEditSource = detail.slice(detail.indexOf('/* FRT-037_CASE_EDIT_STATE'));
  assert.doesNotMatch(currentEditSource, /Forteca|Vercel/);
});

test('Case Edit preserves supported fields, relation, refresh and canonical status/error ownership', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const cases = read('src/pages/Cases.tsx');
  const api = read('api/cases.ts');
  const fallback = read('src/lib/supabase-fallback.ts');
  const errors = read('src/lib/cases/case-error-copy.ts');

  for (const snippet of [
    'id="case-edit-title"',
    'id="case-edit-client"',
    'id="case-edit-status"',
    'id="case-edit-value"',
    'id="case-edit-currency"',
    'Zapisz zmiany',
    'await updateCaseInSupabase(payload)',
    'await refreshCaseData()',
    "recordActivity('case_updated'",
    'fetchClientsFromSupabase()',
    'CASE_STATUS_OPTIONS',
    "getCaseMutationErrorMessage(error, 'update')",
  ]) {
    assert.ok(detail.includes(snippet), `CaseDetail.tsx must keep ${snippet}`);
  }

  assert.match(detail, /payload\.clientId = nextClientId \|\| null/);
  assert.match(api, /if \(body\.title !== undefined\)/);
  assert.match(api, /if \(body\.clientId !== undefined\)/);
  assert.match(api, /const existingCase = await requireScopedRow\('cases', String\(body\.id\), workspaceId, 'CASE_NOT_FOUND'\)/);
  assert.match(api, /let caseValueChanged = false/);
  assert.match(api, /caseValueChanged = true/);
  assert.match(api, /payload\.remaining_amount = Math\.max\(0, nextContractValue - existingPaidAmount\)/);
  assert.match(api, /body\.remainingAmount !== undefined \|\| body\.remaining_amount !== undefined/);
  assert.match(fallback, /export async function updateCaseInSupabase/);
  assert.match(cases, /getCaseMutationErrorMessage\(error, 'create'\)/);
  assert.match(errors, /operation === 'create'/);
  assert.doesNotMatch(detail, /toast\.error\(error\.message\)/);
});

test('Case Edit calm-light composition remains under the registered dialog/form owner', () => {
  const dialogs = read('src/styles/owners/closeflow-dialogs.css');
  const frt037Css = dialogs.slice(dialogs.lastIndexOf('/* FRT-037:'));

  assert.match(frt037Css, /data-case-edit-modal/);
  for (const token of [
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-radius-panel',
    '--cf-vst-shadow-modal',
    '--cf-vst-input-focus-ring',
  ]) assert.ok(frt037Css.includes(token), `canonical dialog owner must use ${token}`);

  assert.doesNotMatch(frt037Css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(frt037Css, /\b(?:rgba?|hsla?)\s*\(/i);
});
