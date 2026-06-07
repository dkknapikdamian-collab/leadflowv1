const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const packagePath = path.join(repoRoot, 'package.json');
const leadDetailPath = path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx');
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const contractPath = path.join(repoRoot, 'docs', 'stages', 'STAGE227E1_LEAD_DETAIL_IA_CONTRACT.md');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

test('Stage227E1 contract file exists and locks the exact LeadDetail IA sections', () => {
  const contract = read(contractPath);
  const required = [
    'STAGE227E1_LEAD_DETAIL_IA_CONTRACT',
    'NO_RUNTIME_REBUILD_STAGE227E1',
    '1. Header',
    '2. Quick Actions',
    '3. Decision Cards',
    '4. Sales Signal',
    '5. Work Action Center',
    '6. Notes',
    '7. Source/History',
    'Stage227E2 jest zablokowany',
  ];

  for (const fragment of required) assert.ok(contract.includes(fragment), `missing: ${fragment}`);

  const order = required.slice(2, 9).map((fragment) => contract.indexOf(fragment));
  for (let index = 1; index < order.length; index += 1) {
    assert.ok(order[index] > order[index - 1], `section order broken before ${required[index + 2]}`);
  }
});

test('Stage227E1 keeps LeadDetail as sales card, not CaseDetail copy', () => {
  const contract = read(contractPath);
  assert.match(contract, /LeadDetail ma zostać przebudowany jako karta sprzedażowa, nie jako kopia sprawy/);
  assert.match(contract, /Sygnał sprzedażowy/);
  assert.match(contract, /Następny krok/);
  assert.match(contract, /Cisza \/ ryzyko/);
  assert.match(contract, /Potencjał/);
  assert.match(contract, /Dodaj brak` zostaje/);
  assert.match(contract, /nie tworzyć osobnego bytu „obserwacje”/);
});

test('Stage227E1 package scripts are registered', () => {
  const pkg = JSON.parse(read(packagePath));
  assert.equal(pkg.scripts['check:stage227e1-lead-detail-ia-contract'], 'node scripts/check-stage227e1-lead-detail-ia-contract.cjs');
  assert.equal(pkg.scripts['test:stage227e1-lead-detail-ia-contract'], 'node --test tests/stage227e1-lead-detail-ia-contract.test.cjs');
});

test('Stage227E1 verifies shared action visual source between LeadDetail and CaseDetail', () => {
  const leadDetail = read(leadDetailPath);
  const caseDetail = read(caseDetailPath);

  const sharedFragments = [
    'actionButtonClass',
    'getCloseFlowActionKindClass',
    'getCloseFlowActionVisualClass',
    'getCloseFlowActionVisualDataKind',
    'inferCloseFlowActionVisualKind',
    'cf-entity-action-cluster',
    'cf-panel-header-actions',
    'cf-panel-action-row',
    'cf-danger-action-zone',
    'cf-inline-secondary-action',
  ];

  for (const fragment of sharedFragments) {
    assert.ok(leadDetail.includes(fragment), `LeadDetail missing shared fragment: ${fragment}`);
    assert.ok(caseDetail.includes(fragment), `CaseDetail missing shared fragment: ${fragment}`);
  }

  assert.ok(leadDetail.includes('CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD'));
  assert.ok(caseDetail.includes('CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE'));
  assert.ok(leadDetail.includes('STAGE228B_R14_LEAD_ACTION_CENTER_VST'));
  assert.ok(leadDetail.includes('STAGE228D_LEAD_DETAIL_REAL_FIX'));
  assert.ok(caseDetail.includes('STAGE220A17_CASE_DETAIL_VST_WIRING'));
});

test('Stage227E1 rejects isolated lead-only visual action class names in LeadDetail', () => {
  const leadDetail = read(leadDetailPath);
  assert.doesNotMatch(leadDetail, /lead-quick-button-blue-new/);
  assert.doesNotMatch(leadDetail, /lead-special-action-box/);
  assert.doesNotMatch(leadDetail, /lead-custom-card/);
});
