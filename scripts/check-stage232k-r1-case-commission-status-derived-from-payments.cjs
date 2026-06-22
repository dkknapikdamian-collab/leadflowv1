#!/usr/bin/env node
const fs = require('node:fs');
const cp = require('node:child_process');
function read(p){ return fs.readFileSync(p,'utf8'); }
function ok(name, cond){ if(!cond){ console.error('FAIL:', name); process.exitCode = 1; } else { console.log('PASS:', name); } }
const finance = read('src/lib/finance/case-finance-source.ts');
const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
const panel = read('src/components/finance/CaseSettlementPanel.tsx');
const paymentList = read('src/components/finance/PaymentList.tsx');
ok('marker in finance source', finance.includes('STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS'));
ok('deriveCommissionStatus no manual explicit status priority', !/const explicit = normalizeCommissionStatus|if (explicit !== 'not_set') return explicit/.test(finance));
ok('paid status derives from commissionPaidAmount >= commissionAmount', /commissionPaidAmount >= commissionAmount[sS]*return 'paid'/.test(finance));
ok('partial status derives from commissionPaidAmount > 0', /commissionPaidAmount > 0[sS]*return 'partially_paid'/.test(finance));
ok('commission paid amount filters only commission paid-like payments', /paymentType(payment) === 'commission' && isPaidLike(payment)/.test(finance));
ok('buildCaseFinancePatch does not persist manual commissionStatus input', !/commissionStatus:s*normalizeCommissionStatus(input.commissionStatus)/.test(finance));
ok('editor has readonly derived status', editor.includes('data-stage232k-r1-commission-status-readonly'));
ok('editor has no manual status select options', !/<option value="paid"|<option value="partially_paid"/.test(editor));
ok('settlement panel creates commissionPayments filter', /const commissionPayments = useMemo/.test(panel) && /normalizePaymentType(payment.type) === 'commission'/.test(panel));
ok('commission list uses commissionPayments', /title="Lista wpłat prowizji"[sS]*payments={commissionPayments}/.test(panel));
ok('remaining label precise', panel.includes('Pozostało prowizji do zapłaty') && editor.includes('Pozostało prowizji do zapłaty'));
ok('PaymentList marker present', paymentList.includes('STAGE232K_R1_PAYMENT_LIST_RECEIVES_FILTERED_COMMISSION_PAYMENTS'));
const changed = cp.execSync('git diff --name-only HEAD', {encoding:'utf8'}).split(/?
/).filter(Boolean);
const forbidden = changed.filter((p) => /sql|supabase|MissingItemsManagerDialog|OwnerControl|owner-control|calendar|billing|trial/i.test(p));
ok('no SQL/MissingItems/OwnerControl/Calendar/Billing scope changes', forbidden.length === 0);
if (process.exitCode) process.exit(process.exitCode);
console.log('STAGE232K_R1 guard passed.');
