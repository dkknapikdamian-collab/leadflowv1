const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];
function read(p) { const full = path.join(root, p); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function assert(cond, msg) { if (!cond) errors.push(msg); }

const dialog = read('src/components/finance/CaseFinancePaymentDialog.tsx');
assert(dialog.includes('CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG'), 'brak CaseFinancePaymentDialog FIN-14');
assert(dialog.includes("defaultType: PaymentType"), 'CaseFinancePaymentDialog nie ma defaultType');
assert(dialog.includes('caseId') && dialog.includes('clientId') && dialog.includes('leadId'), 'CaseFinancePaymentDialog nie buduje pełnego payloadu case/client/lead');
assert(dialog.includes("<option value=\"deposit\">"), 'modal płatności nie obsługuje deposit');
assert(dialog.includes("<option value=\"partial\">"), 'modal płatności nie obsługuje partial');
assert(dialog.includes("<option value=\"commission\">"), 'modal płatności nie obsługuje commission');

const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
assert(buttons.includes('Dodaj zaliczkę'), 'brak przycisku Dodaj zaliczkę');
assert(buttons.includes('Dodaj wpłatę'), 'brak przycisku Dodaj wpłatę');
assert(buttons.includes('Dodaj płatność prowizji'), 'brak przycisku Dodaj płatność prowizji');
assert(buttons.includes('onAddDepositPayment'), 'brak handlera onAddDepositPayment');

const labels = read('src/lib/finance/finance-payment-labels.ts');
assert(labels.includes("deposit: 'Zaliczka'"), 'deposit musi mieć etykietę Zaliczka');
assert(labels.includes("partial: 'Wpłata klienta'"), 'partial musi mieć etykietę Wpłata klienta');
assert(labels.includes("commission: 'Prowizja'"), 'commission musi mieć etykietę Prowizja');

const paymentList = read('src/components/finance/PaymentList.tsx');
assert(paymentList.includes('getPaymentTypeLabel(payment.type)'), 'PaymentList musi używać wspólnych etykiet typów płatności');

const settlement = read('src/components/finance/CaseSettlementPanel.tsx');
assert(settlement.includes('CaseFinancePaymentDialog'), 'CaseSettlementPanel nie używa wspólnego modala płatności');
assert(settlement.includes("setPaymentDialogType('deposit')"), 'CaseSettlementPanel nie mapuje Dodaj zaliczkę -> deposit');
assert(settlement.includes("setPaymentDialogType('partial')"), 'CaseSettlementPanel nie mapuje Dodaj wpłatę -> partial');
assert(settlement.includes("setPaymentDialogType('commission')"), 'CaseSettlementPanel nie mapuje Dodaj płatność prowizji -> commission');
assert(!settlement.includes('<PaymentDialog'), 'CaseSettlementPanel nadal renderuje stary PaymentDialog');

const clientFinance = read('src/components/finance/FinanceMiniSummary.tsx');
assert(clientFinance.includes('CaseFinancePaymentDialog'), 'finanse klienta nie używają wspólnego modala płatności');
assert(clientFinance.includes("setPaymentType('deposit')"), 'klient nie mapuje zaliczki na deposit');
assert(clientFinance.includes("setPaymentType('partial')"), 'klient nie mapuje wpłaty na partial');
assert(clientFinance.includes("setPaymentType('commission')"), 'klient nie mapuje prowizji na commission');
assert(clientFinance.includes('caseId: payment.caseId'), 'payload płatności z klienta musi zawierać caseId');
assert(!/\.reduce\s*\(/.test(clientFinance), 'FinanceMiniSummary nie może łamać FIN-10 lokalnym reduce');

const source = read('src/lib/finance/case-finance-source.ts');
assert(source.includes("paymentType(payment) !== 'commission'"), 'clientPaidAmount musi wykluczać commission');
assert(source.includes("paymentType(payment) === 'commission'"), 'commissionPaidAmount musi liczyć tylko commission');

const pwa = read('public/service-worker.js');
if (pwa) {
  assert(pwa.includes("url.pathname.startsWith('/api/')"), 'service worker musi jawnie omijać /api/');
  assert(pwa.includes("url.pathname.startsWith('/supabase/')"), 'service worker musi jawnie omijać /supabase/');
}

if (errors.length) {
  console.error('FIN-14 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-14 check passed: deposit/partial/commission są rozdzielone i używają jednego modala płatności.');
