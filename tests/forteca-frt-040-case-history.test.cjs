const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-040 is active or accepted Case History contract on the canonical detail route', () => {
  const workflow = JSON.parse(read('_project/WORKFLOW_STATE.json'));
  const contract = read('_project/contracts/forteca-clean/FRT-040_CASE_HISTORY.md');
  const detail = read('src/pages/CaseDetail.tsx');

  const stageIsActive = workflow.current_stage === 'FRT-040' && workflow.current_status === 'ACTIVE';
  const stageIsAccepted = workflow.forteca_program?.accepted_receipts?.includes('FRT-040') && workflow.forteca_program?.stage_040_status === 'PASS';
  assert.ok(stageIsActive || stageIsAccepted, 'FRT-040 must be active or recorded as accepted by the workflow');
  assert.match(contract, stageIsAccepted ? /^CONTRACT_STATUS: LOCKED$/m : /^CONTRACT_STATUS: ACTIVE$/m);
  assert.match(contract, /^STAGE_ID: FRT-040$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases\/:caseId$/m);
  assert.match(contract, /^TARGET_STATE: Case Detail — tab Historia$/m);
  assert.match(contract, /CURRENT_RUNTIME_OWNERS: src\/pages\/CaseDetail\.tsx Historia tab/);
  assert.match(detail, /data-case-history-workspace="true"/);
  assert.match(detail, /data-stage220a10-tab=\{tab\.key\}/);
  assert.match(detail, /key: 'service' as CaseDetailTab/);
  assert.match(detail, /key: 'checklists' as CaseDetailTab/);
  assert.match(detail, /key: 'history' as CaseDetailTab/);
});

test('History is a real ordered projection with semantic actors, source labels and safe related references', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const historyStart = detail.indexOf('data-case-history-workspace="true"');
  const historyEnd = detail.indexOf('data-stage231d0d-r2-case-detail-service-notes-finance-rail', historyStart);
  assert.ok(historyStart >= 0, 'History workspace marker must exist');
  assert.ok(historyEnd > historyStart, 'History workspace must end before the external case rail');
  const workspace = detail.slice(historyStart, historyEnd);

  for (const token of [
    'data-case-history-summary="true"',
    'data-case-history-filters="true"',
    'data-case-history-filter="date-range"',
    'data-case-history-filter="kind"',
    'data-case-history-filter="actor"',
    'data-case-history-clear-filters="true"',
    'data-case-history-list="true"',
    'data-case-history-row="true"',
    'data-case-history-row-actor="true"',
    'data-case-history-row-source="true"',
    'data-case-history-stats-rail="true"',
    'data-case-history-last-event="true"',
    'data-case-history-last-event-link="true"',
    'filteredCaseHistoryItemsStage040',
    'caseHistoryStatsStage040',
  ]) {
    assert.ok(workspace.includes(token), `History workspace must use ${token}`);
  }

  assert.match(detail, /fetchActivitiesFromSupabase\(\{\s*caseId\s*,\s*limit\s*:\s*80\s*\}\)/);
  assert.match(detail, /buildCaseHistoryItemsStage14D\(/);
  assert.match(detail, /normalizeCaseHistoryActorTypeStage040/);
  assert.match(detail, /getCaseHistoryRelatedRecordStage040/);
  assert.doesNotMatch(workspace, /localStorage|sessionStorage|mock|fixture|Forteca|Vercel/i);
});

test('History semantic mapping keeps technical payload private and avoids generic activity fallback', () => {
  const detail = read('src/pages/CaseDetail.tsx');
  const start = detail.indexOf('function getCaseActivityHistoryItemStage14D');
  const end = detail.indexOf('function getCaseNoteHistoryItemStage217', start);
  assert.ok(start >= 0 && end > start, 'History activity mapper must exist');
  const mapper = detail.slice(start, end);

  for (const token of [
    "'Zamknięto sprawę'",
    "'Zaktualizowano sprawę'",
    "'Dodano zadanie'",
    "'Dodano wydarzenie'",
    "'Dodano wpłatę'",
    "'Dodano blokadę'",
    "title: 'Aktywność sprawy'",
    "relatedRecordId: related.id",
    "sourceType: 'activity'",
  ]) {
    assert.ok(mapper.includes(token), `semantic mapper must include ${token}`);
  }

  assert.doesNotMatch(mapper, /return body \? \{[^}]*title: 'Ruch w sprawie'/s);
  assert.doesNotMatch(mapper, /JSON\.stringify/);
});

test('History calm-light composition stays under the registered detail owner', () => {
  const css = read('src/styles/owners/closeflow-rails-and-detail.css');
  const start = css.indexOf('/* FRT-040_CASE_HISTORY_OWNER:');
  assert.ok(start >= 0, 'FRT-040 owner block must exist');
  const ownerBlock = css.slice(start);

  for (const token of [
    '.case-history-workspace',
    '.case-history-summary-grid',
    '.case-history-toolbar',
    '.case-history-timeline-row',
    '.case-history-stats-rail',
    '.case-history-last-event',
    '@media (max-width: 1000px)',
    '@media (max-width: 700px)',
    '@media (max-width: 520px)',
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
