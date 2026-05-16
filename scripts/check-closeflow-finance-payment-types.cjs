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

const labels = read('src/lib/finance/finance-payment-labels.ts');
must(labels, 'FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_V1', 'payment labels contract marker');
const requiredTypes = [
  ['deposit', 'Zaliczka'],
  ['partial', 'Cz\u0119\u015Bciowa wp\u0142ata'],
  ['final', 'Ko\u0144cowa wp\u0142ata'],
  ['commission', 'Prowizja'],
  ['refund', 'Zwrot'],
  ['other', 'Inne'],
];
for (const [value, label] of requiredTypes) {
  must(labels, value, 'payment type value exists: ' + value);
  must(labels, label, 'payment type label exists: ' + label);
}
for (const [value, label] of [
  ['planned', 'Planowana'],
  ['due', 'Nale\u017Cna'],
  ['paid', 'Zap\u0142acona'],
  ['cancelled', 'Anulowana'],
]) {
  must(labels, value, 'payment status value exists: ' + value);
  must(labels, label, 'payment status label exists: ' + label);
}
for (const exportedName of ['PAYMENT_TYPE_OPTIONS', 'PAYMENT_STATUS_OPTIONS', 'getPaymentTypeLabel', 'getPaymentStatusLabel']) {
  must(labels, exportedName, 'payment labels exports ' + exportedName);
}

const paymentList = read('src/components/finance/PaymentList.tsx');
must(paymentList, 'getPaymentTypeLabel', 'PaymentList renders shared type label');
must(paymentList, 'getPaymentStatusLabel', 'PaymentList renders shared status label');
must(paymentList, 'StatusPill', 'PaymentList renders status with StatusPill');
must(paymentList, 'getPaymentStatusTone', 'PaymentList maps status tone');
for (const oldLabel of ['Wp\u0142ata cz\u0119\u015Bciowa', 'Wp\u0142ata ko\u0144cowa', 'Inna wp\u0142ata']) {
  mustNot(paymentList, oldLabel, 'PaymentList does not use old label: ' + oldLabel);
}

const paymentForm = read('src/components/finance/PaymentFormDialog.tsx');
must(paymentForm, 'PAYMENT_TYPE_OPTIONS', 'PaymentFormDialog uses payment type options');
must(paymentForm, 'PAYMENT_STATUS_OPTIONS', 'PaymentFormDialog uses payment status options');
must(paymentForm, 'normalizePaymentType', 'PaymentFormDialog normalizes payment type');
must(paymentForm, 'normalizePaymentStatus', 'PaymentFormDialog normalizes payment status');
must(paymentForm, 'FormFooter', 'PaymentFormDialog uses FormFooter');

const settlement = read('src/components/finance/CaseSettlementPanel.tsx');
must(settlement, 'PAYMENT_TYPE_OPTIONS', 'CaseSettlementPanel dialog uses shared type options');
must(settlement, 'PAYMENT_STATUS_OPTIONS', 'CaseSettlementPanel dialog uses shared status options');
must(settlement, 'PaymentList', 'CaseSettlementPanel renders payment list');
must(settlement, 'type="partial"', 'CaseSettlementPanel supports partial payment marker');
must(settlement, 'type="commission"', 'CaseSettlementPanel supports commission payment marker');

const api = read('api/payments.ts');
must(api, 'FIN-6_PAYMENTS_LIST_AND_PAYMENT_TYPES_API_PARITY_V1', 'api/payments FIN-6 parity marker');
must(api, 'normalizePaymentType', 'api/payments normalizes payment type');
must(api, 'normalizePaymentStatus', 'api/payments normalizes payment status');

const server = read('src/server/payments.ts');
for (const value of ['deposit', 'partial', 'final', 'commission', 'refund', 'other', 'planned', 'due', 'paid', 'cancelled']) {
  must(server, value, 'server payments supports ' + value);
}
mustNot(server, 'recurring', 'server payments rejects old recurring type source');
mustNot(server, 'manual', 'server payments rejects old manual type source');

const failed = checks.filter((item) => !item.ok);
console.log('\nSummary: ' + (checks.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('FAIL CLOSEFLOW_FINANCE_PAYMENT_TYPES_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FINANCE_PAYMENT_TYPES_OK');
