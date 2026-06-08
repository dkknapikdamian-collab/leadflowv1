const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R7R8_CASE_QUICK_ACTIONS_CARD_VST_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const quickActionsBar = read('src/components/detail/QuickActionsBar.tsx');
const caseQuickActions = read('src/components/CaseQuickActions.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-shared-quick-actions-bar-stage227e3.css');
const pkg = JSON.parse(read('package.json'));

[
  "import '../../styles/closeflow-shared-quick-actions-bar-stage227e3.css';",
  'STAGE228R7_R8_QUICK_ACTIONS_CARD_SOURCE_TRUTH',
  'data-stage228r7r8-quick-actions-card-vst="true"',
  'cf-shared-quick-actions-bar--',
  'variant',
  'cf-shared-quick-actions-bar__button',
].forEach((token) => requireText(quickActionsBar, token, 'QuickActionsBar'));

[
  'STAGE228R7_R8_CASE_QUICK_ACTIONS_CARD_SOURCE_TRUTH',
  'QuickActionsBar',
  'variant="rail"',
  "label: 'Wpłata prowizji'",
  "'data-stage228r7r8-case-commission-payment-action': 'true'",
].forEach((token) => requireText(caseQuickActions, token, 'CaseQuickActions'));

[
  "label: 'Wpłata',",
].forEach((token) => forbidText(caseQuickActions, token, 'CaseQuickActions stale payment label'));

[
  'STAGE228R7_R8_CASE_QUICK_ACTIONS_OPEN_COMMISSION_PAYMENT',
  "onAddPayment={() => openCaseFinancePaymentModal('commission')}",
].forEach((token) => requireText(caseDetail, token, 'CaseDetail quick action wiring'));

[
  'onAddPayment={() => setIsCasePaymentOpen(true)}',
].forEach((token) => forbidText(caseDetail, token, 'CaseDetail stale legacy payment wiring'));

[
  'STAGE228R7_R8_QUICK_ACTIONS_CARD_SOURCE_TRUTH',
  '.cf-shared-quick-actions-bar--rail',
  '.cf-shared-quick-actions-bar--rail .cf-shared-quick-actions-bar__grid',
  'grid-template-columns: 1fr;',
  '.cf-shared-quick-actions-bar--rail .cf-shared-quick-actions-bar__button',
  'display: flex;',
  'width: 100%;',
  'min-height: 44px;',
  'border-radius: 16px;',
].forEach((token) => requireText(css, token, 'QuickActions CSS'));

if (pkg.scripts['check:stage228r7r8-case-quick-actions-card-vst'] !== 'node scripts/check-stage228r7r8-case-quick-actions-card-vst.cjs') {
  fail('package.json missing check:stage228r7r8-case-quick-actions-card-vst script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r7r8-case-quick-actions-card-vst.cjs')) {
  fail('package.json prebuild missing Stage228R7R8 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R7_R8_CASE_QUICK_ACTIONS_CARD_VST',
  repair: 'R8R3 guard escape fix',
  contract: 'case quick actions use shared rail card visual source and commission payment action'
}, null, 2));
