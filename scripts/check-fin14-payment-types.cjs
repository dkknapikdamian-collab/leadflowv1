const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];
function read(p) { const full = path.join(root, p); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function assert(cond, msg) { if (!cond) errors.push(msg); }

const dialog = read('src/components/finance/CaseFinancePaymentDialog.tsx');
assert(dialog.includes('CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG'), 'brak CaseFinancePaymentDialog FIN-14');
assert(dialog.includes("defaultType: PaymentType"), 'CaseFinancePaymentDialog nie ma defaultType');
assert(dialog.includes('caseId') && dialog.includes('clientId') && dialog.includes('leadId'), 'CaseFinancePaymentDialog nie buduje pe\u0142nego payloadu case/client/lead');
assert(dialog.includes("<option value=\"deposit\">"), 'modal p\u0142atno\u015Bci nie obs\u0142uguje deposit');
assert(dialog.includes("<option value=\"partial\">"), 'modal p\u0142atno\u015Bci nie obs\u0142uguje partial');
assert(dialog.includes("<option value=\"commission\">"), 'modal p\u0142atno\u015Bci nie obs\u0142uguje commission');

const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
assert(buttons.includes('Dodaj zaliczk\u0119'), 'brak przycisku Dodaj zaliczk\u0119');
assert(buttons.includes('Dodaj wp\u0142at\u0119'), 'brak przycisku Dodaj wp\u0142at\u0119');
assert(buttons.includes('Dodaj p\u0142atno\u015B\u0107 prowizji'), 'brak przycisku Dodaj p\u0142atno\u015B\u0107 prowizji');
assert(buttons.includes('onAddDepositPayment'), 'brak handlera onAddDepositPayment');

const labels = read('src/lib/finance/finance-payment-labels.ts');
assert(labels.includes("deposit: 'Zaliczka'"), 'deposit musi mie\u0107 etykiet\u0119 Zaliczka');
assert(labels.includes("partial: 'Wp\u0142ata klienta'"), 'partial musi mie\u0107 etykiet\u0119 Wp\u0142ata klienta');
assert(labels.includes("commission: 'Prowizja'"), 'commission musi mie\u0107 etykiet\u0119 Prowizja');

const paymentList = read('src/components/finance/PaymentList.tsx');
assert(paymentList.includes('getPaymentTypeLabel(payment.type)'), 'PaymentList musi u\u017Cywa\u0107 wsp\u00F3lnych etykiet typ\u00F3w p\u0142atno\u015Bci');

const settlement = read('src/components/finance/CaseSettlementPanel.tsx');
assert(settlement.includes('CaseFinancePaymentDialog'), 'CaseSettlementPanel nie u\u017Cywa wsp\u00F3lnego modala p\u0142atno\u015Bci');
assert(settlement.includes("setPaymentDialogType('deposit')"), 'CaseSettlementPanel nie mapuje Dodaj zaliczk\u0119 -> deposit');
assert(settlement.includes("setPaymentDialogType('partial')"), 'CaseSettlementPanel nie mapuje Dodaj wp\u0142at\u0119 -> partial');
assert(settlement.includes("setPaymentDialogType('commission')"), 'CaseSettlementPanel nie mapuje Dodaj p\u0142atno\u015B\u0107 prowizji -> commission');
assert(!settlement.includes('<PaymentDialog'), 'CaseSettlementPanel nadal renderuje stary PaymentDialog');

const clientFinance = read('src/components/finance/FinanceMiniSummary.tsx');
assert(clientFinance.includes('CaseFinancePaymentDialog'), 'finanse klienta nie u\u017Cywaj\u0105 wsp\u00F3lnego modala p\u0142atno\u015Bci');
assert(clientFinance.includes("setPaymentType('deposit')"), 'klient nie mapuje zaliczki na deposit');
assert(clientFinance.includes("setPaymentType('partial')"), 'klient nie mapuje wp\u0142aty na partial');
assert(clientFinance.includes("setPaymentType('commission')"), 'klient nie mapuje prowizji na commission');
assert(clientFinance.includes('caseId: payment.caseId'), 'payload p\u0142atno\u015Bci z klienta musi zawiera\u0107 caseId');
assert(!/\.reduce\s*\(/.test(clientFinance), 'FinanceMiniSummary nie mo\u017Ce \u0142ama\u0107 FIN-10 lokalnym reduce');

const source = read('src/lib/finance/case-finance-source.ts');
assert(source.includes("paymentType(payment) !== 'commission'"), 'clientPaidAmount musi wyklucza\u0107 commission');
assert(source.includes("paymentType(payment) === 'commission'"), 'commissionPaidAmount musi liczy\u0107 tylko commission');

const pwa = read('public/service-worker.js');
if (pwa) {
  assert(pwa.includes("url.pathname.startsWith('/api/')"), 'service worker musi jawnie omija\u0107 /api/');
  assert(pwa.includes("url.pathname.startsWith('/supabase/')"), 'service worker musi jawnie omija\u0107 /supabase/');
}

if (errors.length) {
  console.error('FIN-14 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-14 check passed: deposit/partial/commission s\u0105 rozdzielone i u\u017Cywaj\u0105 jednego modala p\u0142atno\u015Bci.');
