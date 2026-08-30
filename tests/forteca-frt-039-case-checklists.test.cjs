const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-039 is active or accepted Case Checklists contract with canonical tabs', () => {
  const workflow = JSON.parse(read('_project/WORKFLOW_STATE.json'));
  const contract = read('_project/contracts/forteca-clean/FRT-039_CASE_CHECKLISTS.md');
  const detail = read('src/pages/CaseDetail.tsx');

  const stageIsActive = workflow.current_stage === 'FRT-039' && workflow.current_status === 'ACTIVE';
  const stageIsAccepted = workflow.forteca_program?.accepted_receipts?.includes('FRT-039') && workflow.forteca_program?.stage_039_status === 'PASS';
  assert.ok(stageIsActive || stageIsAccepted, 'FRT-039 must be active or recorded as accepted by the workflow');
  assert.match(contract, stageIsAccepted ? /^CONTRACT_STATUS: LOCKED$/m : /^CONTRACT_STATUS: ACTIVE$/m);
  assert.match(contract, /^STAGE_ID: FRT-039$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases\/:caseId$/m);
  assert.match(contract, /^TARGET_STATE: Case Detail — tab Checklisty$/m);
  assert.match(contract, /CURRENT_RUNTIME_OWNERS: src\/pages\/CaseDetail\.tsx Checklisty tab/);
  assert.match(detail, /data-case-checklist-workspace="true"/);
  assert.match(detail, /data-stage220a10-tab=\{tab\.key\}/);
  assert.match(detail, /key: 'service' as CaseDetailTab/);
  assert.match(detail, /key: 'checklists' as CaseDetailTab/);
  assert.match(detail, /key: 'history' as CaseDetailTab/);
});

test('Checklist workspace is a real case_items read model with progress and grouped rows', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const checklistStart = detail.indexOf('data-case-checklist-workspace="true"');
  const checklistEnd = detail.indexOf('data-stage220a10-tab-panel="history"', checklistStart);
  assert.ok(checklistStart >= 0, 'Checklist workspace marker must exist');
  assert.ok(checklistEnd > checklistStart, 'Checklist workspace must end before the history panel');
  const workspace = detail.slice(checklistStart, checklistEnd);

  for (const token of [
    'data-case-checklist-summary="true"',
    'data-case-checklist-summary-card="completion"',
    'data-case-checklist-summary-card="blockers"',
    'data-case-checklist-summary-card="next-action"',
    'data-case-checklist-list="true"',
    'data-case-checklist-group={group.key}',
    'data-case-checklist-item="true"',
    'checklistSummary.completionPercent',
    'checklistSummary.completeCount',
    'checklistSummary.overdueCount',
    'blockers',
    'nextAction',
    'handleCaseChecklistNextAction',
    'handleItemStatusChange',
  ]) {
    assert.ok(workspace.includes(token), `Checklist workspace must use ${token}`);
  }

  assert.doesNotMatch(workspace, /localStorage|sessionStorage|mock|fixture|Forteca|Vercel/i);
  assert.match(detail, /fetchCaseItemsFromSupabase\(/);
  assert.match(detail, /const checklistSummary = useMemo/);
  assert.match(detail, /function buildCaseChecklistGroups/);
  assert.match(detail, /function isCaseChecklistItemOverdue/);
});

test('Checklist actions preserve the existing scoped mutation and canonical status owners', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const api = read('api/case-items.ts');
  const caseOptions = read('src/lib/source-of-truth/case-options.ts');

  for (const snippet of [
    'data-case-checklist-add-item="true"',
    'data-case-checklist-action="missing"',
    'data-case-checklist-action="uploaded"',
    'data-case-checklist-action="accepted"',
    'data-case-checklist-action="rejected"',
    'insertCaseItemToSupabase({',
    'updateCaseItemInSupabase({ id: item.id, caseId, status,',
    'await refreshCaseData()',
    'recordActivity',
    'guardCaseDetailWriteAccess',
  ]) {
    assert.ok(detail.includes(snippet), `CaseDetail.tsx must keep ${snippet}`);
  }

  assert.match(api, /caseId/);
  assert.match(api, /requireCaseItemInCase/);
  assert.match(api, /requireOperatorCaseAccess/);
  assert.match(api, /workspace/);
  assert.match(caseOptions, /export const CASE_ITEM_STATUS_LABELS/);
  assert.match(caseOptions, /export function getCaseItemStatusLabel/);
  assert.doesNotMatch(detail, /const CASE_ITEM_STATUS_LABELS/);
});

test('Checklist calm-light composition remains under the registered detail/rail owner', () => {
  const css = read('src/styles/owners/closeflow-rails-and-detail.css');
  const start = css.indexOf('/* FRT-039_CASE_CHECKLISTS_OWNER:');
  assert.ok(start >= 0, 'FRT-039 owner block must exist');
  const ownerBlock = css.slice(start);

  for (const token of [
    '.case-checklist-summary-grid',
    '.case-checklist-content-grid',
    '.case-checklist-item',
    '.case-checklist-stat-list',
    '.case-checklist-action',
    '@media (max-width: 900px)',
    '@media (max-width: 600px)',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-shadow-card',
    '--cf-vst-color-primary',
    '--cf-vst-color-delete',
    '--cf-vst-radius-card',
  ]) {
    assert.ok(ownerBlock.includes(token), `registered detail owner must define ${token}`);
  }

  assert.doesNotMatch(ownerBlock, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(ownerBlock, /\b(?:rgba?|hsla?)\s*\(/i);
  assert.doesNotMatch(ownerBlock, /!important/);
});
