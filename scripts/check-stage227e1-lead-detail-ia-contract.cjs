const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const packagePath = path.join(repoRoot, 'package.json');
const leadDetailPath = path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx');
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const contractPath = path.join(repoRoot, 'docs', 'stages', 'STAGE227E1_LEAD_DETAIL_IA_CONTRACT.md');
const guardPath = path.join(repoRoot, 'scripts', 'check-stage227e1-lead-detail-ia-contract.cjs');
const testPath = path.join(repoRoot, 'tests', 'stage227e1-lead-detail-ia-contract.test.cjs');

function fail(message) {
  console.error(`FAIL STAGE227E1_LEAD_DETAIL_IA_CONTRACT: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function readRequired(filePath, label) {
  if (!fs.existsSync(filePath)) fail(`missing ${label}: ${path.relative(repoRoot, filePath)}`);
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

const pkg = JSON.parse(readRequired(packagePath, 'package.json'));
const leadDetail = readRequired(leadDetailPath, 'LeadDetail source');
const caseDetail = readRequired(caseDetailPath, 'CaseDetail source');
const contract = readRequired(contractPath, 'Stage227E1 contract');
readRequired(guardPath, 'Stage227E1 guard');
readRequired(testPath, 'Stage227E1 test');

const scripts = pkg.scripts || {};
if (scripts['check:stage227e1-lead-detail-ia-contract'] !== 'node scripts/check-stage227e1-lead-detail-ia-contract.cjs') {
  fail('package.json missing exact check:stage227e1-lead-detail-ia-contract script');
}
pass('package.json contains Stage227E1 check script');

if (scripts['test:stage227e1-lead-detail-ia-contract'] !== 'node --test tests/stage227e1-lead-detail-ia-contract.test.cjs') {
  fail('package.json missing exact test:stage227e1-lead-detail-ia-contract script');
}
pass('package.json contains Stage227E1 test script');

const contractFragments = [
  'STAGE227E1_LEAD_DETAIL_IA_CONTRACT',
  'NO_RUNTIME_REBUILD_STAGE227E1',
  'Header',
  'Quick Actions',
  'Decision Cards',
  'Sales Signal',
  'Work Action Center',
  'Notes',
  'Source/History',
  'Następny krok',
  'Cisza / ryzyko',
  'Potencjał',
  'Sygnał sprzedażowy',
  'Dodaj brak',
  'Dodaj brak` zostaje',
  'actionButtonClass',
  'getCloseFlowActionVisualClass',
  'visual source of truth',
  'CaseDetail',
  'LeadDetail',
  'Stage227E2 jest zablokowany',
  'osobne style typu `lead-quick-button-blue-new`',
  'nie tworzyć osobnego bytu „obserwacje”',
];

for (const fragment of contractFragments) {
  if (!contract.includes(fragment)) fail(`contract missing fragment: ${fragment}`);
  pass(`contract contains: ${fragment}`);
}

const orderedSections = [
  '1. Header',
  '2. Quick Actions',
  '3. Decision Cards',
  '4. Sales Signal',
  '5. Work Action Center',
  '6. Notes',
  '7. Source/History',
];
let previousIndex = -1;
for (const section of orderedSections) {
  const index = contract.indexOf(section);
  if (index === -1) fail(`contract missing ordered section: ${section}`);
  if (index <= previousIndex) fail(`contract section order is broken at: ${section}`);
  previousIndex = index;
}
pass('contract keeps target LeadDetail section order');

const sharedActionFragments = [
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

for (const fragment of sharedActionFragments) {
  if (!leadDetail.includes(fragment)) fail(`LeadDetail is not wired to shared action/VST fragment: ${fragment}`);
  if (!caseDetail.includes(fragment)) fail(`CaseDetail is not wired to shared action/VST fragment: ${fragment}`);
}
pass('LeadDetail and CaseDetail share action visual source fragments');

const leadDetailRequired = [
  'CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD',
  'STAGE228B_R14_LEAD_ACTION_CENTER_VST',
  'STAGE228D_LEAD_DETAIL_REAL_FIX',
  'Działania leada',
  'Braki i blokady',
];

for (const fragment of leadDetailRequired) {
  if (!leadDetail.includes(fragment)) fail(`LeadDetail missing current prerequisite marker/copy: ${fragment}`);
}
pass('LeadDetail has current action center prerequisite markers');

const caseDetailRequired = [
  'CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE',
  'CaseQuickActions',
  'case-detail-work-row',
  'STAGE220A17_CASE_DETAIL_VST_WIRING',
];

for (const fragment of caseDetailRequired) {
  if (!caseDetail.includes(fragment)) fail(`CaseDetail missing visual source prerequisite marker: ${fragment}`);
}
pass('CaseDetail has visual source prerequisite markers');

const forbiddenContractPatterns = [
  /lead-quick-button-blue-new[^`]/,
  /lead-special-action-box[^`]/,
  /lead-custom-card[^`]/,
];

for (const pattern of forbiddenContractPatterns) {
  if (pattern.test(leadDetail)) fail(`LeadDetail contains forbidden new isolated style pattern: ${pattern}`);
}
pass('LeadDetail does not contain forbidden isolated lead-only action styles');

console.log('PASS STAGE227E1_LEAD_DETAIL_IA_CONTRACT');
