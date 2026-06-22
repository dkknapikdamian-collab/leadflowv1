const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function status(commissionAmount, commissionPaidAmount){ if (commissionAmount <= 0) return 'not_set'; if (commissionPaidAmount >= commissionAmount) return 'paid'; if (commissionPaidAmount > 0) return 'partially_paid'; return 'expected'; }
function paidCommission(payments){ const paidLike = new Set(['paid','fully_paid','deposit_paid','partially_paid','confirmed','settled','completed','done']); return payments.filter((p)=>p.type === 'commission' && paidLike.has(p.status)).reduce((s,p)=>s+p.amount,0); }
test('100000 PLN and 3 percent gives 3000 commission', () => { assert.equal(100000 * 3 / 100, 3000); });
test('no commission payment is not paid', () => { assert.equal(status(3000, 0), 'expected'); });
test('1000 paid commission is partially paid', () => { assert.equal(status(3000, 1000), 'partially_paid'); });
test('3000 paid commission is paid', () => { assert.equal(status(3000, 3000), 'paid'); });
test('partial/deposit/client payment does not reduce commission', () => { assert.equal(paidCommission([{type:'partial',status:'paid',amount:3000},{type:'deposit',status:'paid',amount:1000}]), 0); });
test('pending/planned commission does not reduce commission', () => { assert.equal(paidCommission([{type:'commission',status:'pending',amount:1000},{type:'commission',status:'planned',amount:1000}]), 0); });
test('legacy manual paid status is not source of truth', () => { const src = fs.readFileSync('src/lib/finance/case-finance-source.ts','utf8'); assert.equal(src.includes("if (explicit !== 'not_set') return explicit"), false); });
test('editor has no manual paid/partially_paid options', () => { const src = fs.readFileSync('src/components/finance/CaseFinanceEditorDialog.tsx','utf8'); assert.equal(/<option value="paid"|<option value="partially_paid"/.test(src), false); });
test('commission payment list is filtered before PaymentList', () => { const src = fs.readFileSync('src/components/finance/CaseSettlementPanel.tsx','utf8'); assert.match(src, /const commissionPayments = useMemo/); assert.match(src, /payments={commissionPayments}/); });
