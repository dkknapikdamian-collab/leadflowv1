const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];
function read(p) { const full = path.join(root, p); return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : ''; }
function assert(cond, msg) { if (!cond) errors.push(msg); }

const dialog = read('src/components/finance/CaseFinancePaymentDialog.tsx');
assert(dialog.includes('CLOSEFLOW_FIN14_CASE_FINANCE_PAYMENT_DIALOG'), 'brak wspólnego modala płatności FIN-14');
assert(dialog.includes("defaultType: 'deposit' | 'partial' | 'commission'"), 'modal płatności nie obsługuje deposit/partial/commission defaultType');
assert(dialog.includes('caseId: caseId || null'), 'modal nie przekazuje caseId w payloadzie');
assert(dialog.includes('clientId,'), 'modal nie przekazuje clientId w payloadzie');
assert(dialog.includes('leadId,'), 'modal nie przekazuje leadId w payloadzie');
assert(dialog.includes('type: normalizePaymentType(type)'), 'modal nie zapisuje wybranego typu płatności');
assert(dialog.includes('amount: parsedAmount'), 'modal nie normalizuje kwoty do number');

const buttons = read('src/components/finance/CaseFinanceActionButtons.tsx');
assert(buttons.includes('Dodaj zaliczkę'), 'brak przycisku Dodaj zaliczkę');
assert(buttons.includes('Dodaj wpłatę'), 'brak przycisku Dodaj wpłatę');
assert(buttons.includes('Dodaj płatność prowizji'), 'brak przycisku Dodaj płatność prowizji');
assert(buttons.includes('onAddDepositPayment'), 'brak handlera onAddDepositPayment');
assert(buttons.includes('data-fin14-payment-type-action-buttons'), 'brak markera FIN-14 na przyciskach');

const list = read('src/components/finance/PaymentList.tsx');
assert(list.includes('Wpłata klienta'), 'lista płatności nie pokazuje typu partial jako Wpłata klienta');
assert(list.includes('Zaliczka'), 'lista płatności nie pokazuje deposit jako Zaliczka');
assert(list.includes('Prowizja'), 'lista płatności nie pokazuje commission jako Prowizja');
assert(list.includes('data-fin14-payment-row-type'), 'lista płatności nie ma markeru typu płatności');

const settlement = read('src/components/finance/CaseSettlementPanel.tsx');
assert(settlement.includes('CaseFinancePaymentDialog'), 'CaseSettlementPanel nie używa wspólnego modala płatności');
assert(settlement.includes("setPaymentDialogType('deposit')"), 'CaseSettlementPanel nie mapuje Dodaj zaliczkę -> deposit');
assert(settlement.includes("setPaymentDialogType('partial')"), 'CaseSettlementPanel nie mapuje Dodaj wpłatę -> partial');
assert(settlement.includes("setPaymentDialogType('commission')"), 'CaseSettlementPanel nie mapuje Dodaj płatność prowizji -> commission');
assert(settlement.includes('defaultType={paymentDialogType || \'partial\'}'), 'CaseSettlementPanel nie przekazuje defaultType do modala płatności');
assert(settlement.includes('onAddDepositPayment'), 'CaseSettlementPanel nie renderuje przycisku Dodaj zaliczkę');
assert(!settlement.includes('commissionPaymentOpen'), 'CaseSettlementPanel nadal ma osobny stan commissionPaymentOpen zamiast jednego modala płatności');

const mini = read('src/components/finance/FinanceMiniSummary.tsx');
assert(mini.includes('CaseFinancePaymentDialog'), 'Client finance nie używa wspólnego modala płatności');
assert(mini.includes("setPaymentType('deposit')"), 'Client finance nie mapuje zaliczki na deposit');
assert(mini.includes("setPaymentType('partial')"), 'Client finance nie mapuje wpłaty na partial');
assert(mini.includes("setPaymentType('commission')"), 'Client finance nie mapuje prowizji na commission');
assert(mini.includes('type: payment.type'), 'Client finance nie zapisuje wybranego typu płatności');
assert(mini.includes('caseId: payment.caseId'), 'Client finance nie wymusza caseId w payloadzie');
assert(!/\.reduce\s*\(/.test(mini), 'FinanceMiniSummary nadal ma lokalne .reduce i łamie FIN-10');

const source = read('src/lib/finance/case-finance-source.ts');
assert(source.includes("paymentType(payment) !== 'commission'"), 'case finance source musi wykluczać commission z wpłat klienta');
assert(source.includes("paymentType(payment) === 'commission'"), 'case finance source musi osobno liczyć płatności prowizji');

const worker = read('public/service-worker.js');
assert(worker.includes("url.pathname.startsWith('/api/')"), 'service worker nie spełnia guardu PWA dla /api/');
assert(worker.includes("url.pathname.startsWith('/supabase/')"), 'service worker nie spełnia guardu PWA dla /supabase/');

const pkg = read('package.json');
assert(pkg.includes('check:fin14'), 'package.json nie ma check:fin14');
assert(pkg.includes('test:fin14'), 'package.json nie ma test:fin14');

if (errors.length) {
  console.error('FIN-14 check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('FIN-14 check passed: typy płatności deposit/partial/commission są rozdzielone i liczone poprawnie.');
