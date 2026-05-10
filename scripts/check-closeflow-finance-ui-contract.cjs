const fs = require('fs');

const checks = [];
function pass(label) { checks.push({ ok: true, label }); console.log('PASS ' + label); }
function fail(label) { checks.push({ ok: false, label }); console.error('FAIL ' + label); }
function read(rel) {
  if (!fs.existsSync(rel)) { fail(rel + ': exists'); return ''; }
  pass(rel + ': exists');
  return fs.readFileSync(rel, 'utf8');
}
function must(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail(label + ' [needle=' + needle + ']');
}
function mustNot(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail(label + ' [forbidden=' + needle + ']');
}

const files = {
  snapshot: 'src/components/finance/FinanceSnapshot.tsx',
  mini: 'src/components/finance/FinanceMiniSummary.tsx',
  payments: 'src/components/finance/PaymentList.tsx',
  paymentForm: 'src/components/finance/PaymentFormDialog.tsx',
  commissionForm: 'src/components/finance/CommissionFormDialog.tsx',
  settlement: 'src/components/finance/CaseSettlementPanel.tsx',
  css: 'src/styles/finance/closeflow-finance.css',
  surface: 'src/components/ui-system/SurfaceCard.tsx',
  pill: 'src/components/ui-system/StatusPill.tsx',
  footer: 'src/components/ui-system/FormFooter.tsx',
  index: 'src/components/ui-system/index.ts',
};

const content = {};
for (const [key, rel] of Object.entries(files)) content[key] = read(rel);

must(content.index, 'SurfaceCard', 'ui-system index exports/references SurfaceCard');
must(content.index, 'StatusPill', 'ui-system index exports/references StatusPill');
must(content.index, 'FormFooter', 'ui-system index exports/references FormFooter');

must(content.snapshot, 'SurfaceCard', 'FinanceSnapshot uses SurfaceCard');
must(content.mini, 'SurfaceCard', 'FinanceMiniSummary uses SurfaceCard');
must(content.mini, 'StatusPill', 'FinanceMiniSummary uses StatusPill');
must(content.mini, 'getCommissionStatusTone', 'FinanceMiniSummary has commission tone mapper');
must(content.payments, 'StatusPill', 'PaymentList uses StatusPill');
must(content.payments, 'getPaymentStatusTone', 'PaymentList has payment status tone mapper');
must(content.paymentForm, 'FormFooter', 'PaymentFormDialog uses FormFooter');
must(content.commissionForm, 'FormFooter', 'CommissionFormDialog uses FormFooter');
must(content.settlement, 'SurfaceCard', 'CaseSettlementPanel uses SurfaceCard');
must(content.settlement, 'FormFooter', 'CaseSettlementPanel uses FormFooter');

for (const [key, text] of Object.entries({
  paymentForm: content.paymentForm,
  commissionForm: content.commissionForm,
  settlement: content.settlement,
})) {
  mustNot(text, 'DialogFooter', key + ' does not use DialogFooter');
}

must(content.settlement, 'PaymentList', 'CaseSettlementPanel renders PaymentList');
must(content.settlement, 'data-fin5-case-settlement-panel', 'CaseSettlementPanel keeps FIN-5 marker');
must(content.settlement, 'data-fin8-finance-visual-integration', 'CaseSettlementPanel keeps FIN-8 marker');
must(content.settlement, 'data-fin9-finance-duplicate-safety', 'CaseSettlementPanel keeps FIN-9 marker');

const css = content.css;
must(css, 'FIN-7_CLIENT_FINANCE_SUMMARY_STYLE', 'finance CSS keeps FIN-7 marker');
must(css, 'FIN-8_FINANCE_VISUAL_INTEGRATION', 'finance CSS keeps FIN-8 marker');
must(css, 'FIN-9_FINANCE_DUPLICATE_SAFETY_STYLE', 'finance CSS keeps FIN-9 marker');
must(css, '.cf-finance-duplicate-warning', 'finance CSS contains duplicate warning style');
must(css, 'var(--', 'finance CSS uses design tokens');
if (/(#[0-9a-fA-F]{3,8}\b|rgba?\s*\()/g.test(css)) fail('finance CSS has no raw rgb/rgba/hex colors');
else pass('finance CSS has no raw rgb/rgba/hex colors');

const financeSources = [
  content.snapshot,
  content.mini,
  content.payments,
  content.paymentForm,
  content.commissionForm,
  content.settlement,
  content.css,
].join('\n');
for (const token of ['finance-card-v2', 'commission-fix', 'payment-hotfix']) {
  mustNot(financeSources, token, 'forbidden finance visual drift token absent: ' + token);
}

const failed = checks.filter((item) => !item.ok);
console.log('\nSummary: ' + (checks.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('FAIL CLOSEFLOW_FINANCE_UI_CONTRACT_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FINANCE_UI_CONTRACT_OK');
