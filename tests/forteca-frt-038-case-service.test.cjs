const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-038 is active or accepted Case Service contract with canonical tabs', () => {
  const workflow = JSON.parse(read('_project/WORKFLOW_STATE.json'));
  const contract = read('_project/contracts/forteca-clean/FRT-038_CASE_SERVICE.md');
  const detail = read('src/pages/CaseDetail.tsx');

  const stageIsActive = workflow.current_stage === 'FRT-038' && workflow.current_status === 'ACTIVE';
  const stageIsAccepted = workflow.forteca_program?.accepted_receipts?.includes('FRT-038') && workflow.forteca_program?.stage_038_status === 'PASS';
  assert.ok(stageIsActive || stageIsAccepted, 'FRT-038 must be active or recorded as accepted by the workflow');
  assert.match(contract, stageIsAccepted ? /^CONTRACT_STATUS: LOCKED$/m : /^CONTRACT_STATUS: ACTIVE$/m);
  assert.match(contract, /^STAGE_ID: FRT-038$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases\/:caseId$/m);
  assert.match(contract, /^TARGET_STATE: Case Detail — tab Obsługa$/m);
  assert.match(contract, /CURRENT_RUNTIME_OWNERS: src\/pages\/CaseDetail\.tsx/);
  assert.match(detail, /data-case-service-workspace-grid="true"/);
  assert.match(detail, /data-stage231d0d-r6-tabs-inside-left-column="true"/);
    assert.match(detail, /data-stage220a10-tab=\{tab\.key\}/);
    assert.match(detail, /key: 'service' as CaseDetailTab/);
    assert.match(detail, /key: 'checklists' as CaseDetailTab/);
    assert.match(detail, /key: 'history' as CaseDetailTab/);
});

test('Case Service overview is a read model of the existing case sources and actions', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const serviceStart = detail.indexOf('data-case-service-overview="true"');
  const serviceEnd = detail.indexOf('data-case-service-actions-panel="true"', serviceStart);
  assert.ok(serviceStart >= 0, 'service overview marker must exist');
  assert.ok(serviceEnd > serviceStart, 'service actions must follow the overview');
  const overview = detail.slice(serviceStart, serviceEnd);

  for (const token of [
    'data-case-service-summary-card="true"',
    'data-case-service-key-information="true"',
    'data-case-service-next-action-card="true"',
    'data-case-service-contacts="true"',
    'caseData',
    'effectiveStatus',
    'sourceLeadLabel',
    'lastActivityAt',
    'nextAction',
    'items.length',
    'workItems.length',
    'caseHistoryItems.length',
    'caseServiceClientEmail',
    'caseServiceClientPhone',
    'handleCaseServiceNextAction',
  ]) {
    assert.ok(overview.includes(token), `service overview must use ${token}`);
  }

  assert.doesNotMatch(overview, /localStorage|sessionStorage|mock|fixture|Forteca|Vercel/i);
  assert.match(detail, /const caseFinanceSourceStage220A26 = useMemo/);
  assert.match(detail, /const workItems = useMemo/);
  assert.match(detail, /const caseHistoryItems = useMemo/);
  assert.match(detail, /const caseNoteItems = useMemo/);
  assert.match(detail, /await refreshCaseData\(\)/);
  for (const handler of ['openCaseTaskDialog', 'openCaseEventDialog', 'openCaseNoteDialog', 'CaseQuickActions']) {
    assert.ok(detail.includes(handler), `existing contextual action ${handler} must remain available`);
  }
});

test('Case Service responsive composition stays in the registered detail/rail owner', () => {
  const css = read('src/styles/owners/closeflow-rails-and-detail.css');
  const start = css.indexOf('/* FRT-038_CASE_SERVICE_READ_MODEL:');
  const end = css.indexOf('/* FRT-010', start);
  assert.ok(start >= 0, 'FRT-038 owner block must exist');
  assert.ok(end > start, 'FRT-038 owner block must be bounded');
  const ownerBlock = css.slice(start, end);

  for (const token of [
    '.case-detail-vnext-page .case-detail-shell',
    '.case-service-workspace-grid',
    '.case-service-overview',
    '.case-service-overview-card',
    '.case-service-facts',
    '.case-service-contact-list',
    '@media (max-width: 900px)',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-shadow-card',
    '--cf-vst-color-primary',
    '--cf-vst-radius-card',
  ]) {
    assert.ok(ownerBlock.includes(token), `registered detail owner must define ${token}`);
  }

  assert.doesNotMatch(ownerBlock, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(ownerBlock, /\b(?:rgba?|hsla?)\s*\(/i);
  assert.doesNotMatch(ownerBlock, /!important/);
});
