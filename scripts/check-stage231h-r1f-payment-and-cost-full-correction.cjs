
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const caseFile = path.join(root, 'src/pages/CaseDetail.tsx');
const fallbackFile = path.join(root, 'src/lib/supabase-fallback.ts');
const runFile = path.join(root, '_project/runs/STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION.md');
const obsidianFile = path.join(root, '_project/obsidian_updates/2026-06-14_STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION.md');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function assert(condition, message) {
  if (!condition) {
    console.error('STAGE231H_R1F FAIL: ' + message);
    process.exit(1);
  }
}

const source = read(caseFile);
const fallback = read(fallbackFile);
const run = read(runFile);
const obsidian = read(obsidianFile);

assert(source.includes('STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION'), 'CaseDetail missing R1F marker');
assert(fallback.includes('export async function updatePaymentInSupabase'), 'supabase fallback missing updatePaymentInSupabase');
assert(source.includes('updatePaymentInSupabase,'), 'CaseDetail does not import updatePaymentInSupabase');
assert(source.includes("return type !== 'refund' && getPaymentAmount(payment) > 0;"), 'commission payments are still blocked from correction');
assert(source.includes("setPaymentCorrectionFormStage220A27({\n      amount: fin11MoneyInput(amount),\n      paidAt: fin11DateTimeLocal(getCasePaymentDateStage220A27(payment) || new Date().toISOString()),\n      reason: String(payment.note || ''),\n    });") || source.includes("reason: String(payment.note ||"), 'payment correction does not preload original date and note');
assert(source.includes('updatePaymentInSupabase(payload as any)'), 'payment correction does not update the existing payment');
assert(!source.includes("type: 'refund',\\n        status: 'paid',\\n        amount,"), 'payment correction still creates refund-only record');
assert(source.includes('<DialogTitle>Korekta wpłaty prowizji</DialogTitle>'), 'payment correction title not updated');
assert(source.includes('<span>Kwota wpłaty</span>'), 'payment correction amount label not updated');
assert(source.includes('<span>Data wpłaty</span>'), 'payment correction date label not updated');
assert(source.includes('<span>Opis / dopisek do wpłaty</span>'), 'payment correction note label not updated');
assert(source.includes('data-stage231h-r1f-payment-correction-amount="true"'), 'payment correction amount marker missing');
assert(source.includes('data-stage231h-r1f-payment-correction-date="true"'), 'payment correction date marker missing');
assert(source.includes('data-stage231h-r1f-payment-correction-note="true"'), 'payment correction note marker missing');
assert(!source.includes('!paymentCorrectionFormStage220A27.reason.trim()'), 'payment correction still requires note/reason before save');

assert(source.includes("kind: 'other', amount: '', reimbursableAmount: '', reimbursedAmount: '', status: 'incurred', incurredAt: '', note: ''"), 'cost correction form state missing kind/incurredAt');
assert(source.includes('data-stage231h-r1f-cost-correction-kind="true"'), 'cost correction kind field missing');
assert(source.includes('data-stage231h-r1f-cost-correction-date="true"'), 'cost correction date field missing');
assert(source.includes('const kind = String(caseCostCorrectionFormStage231H_R1C.kind'), 'cost correction does not derive kind from form');
assert(source.includes('const incurredAt = fin11IsoFromLocal(caseCostCorrectionFormStage231H_R1C.incurredAt'), 'cost correction does not derive incurredAt from form');
assert(source.includes('kind,\\n        status,') || source.includes('kind,\n        status,'), 'cost correction payload does not save kind');
assert(source.includes('incurredAt,'), 'cost correction payload does not save incurredAt');

assert(run.includes('STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION'), 'R1F run report missing');
assert(run.includes('updatePaymentInSupabase'), 'R1F run report missing payment update decision');
assert(run.includes('cost kind/date/status/note'), 'R1F run report missing cost full correction scope');
assert(obsidian.includes('STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION'), 'R1F Obsidian payload missing');
assert(obsidian.includes('SQL nie ruszany'), 'R1F Obsidian payload must state SQL untouched');

console.log('STAGE231H_STAGE231H_R1F R2 PASS: payment and cost full correction is guarded.');
