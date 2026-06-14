
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('STAGE231H_R1F payment correction edits original payment, not refund-only', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION/);
  assert.match(source, /updatePaymentInSupabase\(payload as any\)/);
  assert.match(source, /<DialogTitle>Korekta wpłaty prowizji<\/DialogTitle>/);
  assert.match(source, /<span>Kwota wpłaty<\/span>/);
  assert.match(source, /<span>Data wpłaty<\/span>/);
  assert.match(source, /<span>Opis \/ dopisek do wpłaty<\/span>/);
  assert.doesNotMatch(source, /!paymentCorrectionFormStage220A27\.reason\.trim\(\)/);
  assert.match(source, /return type !== 'refund' && getPaymentAmount\(payment\) > 0;/);
});

test('STAGE231H_R1F cost correction edits full cost fields', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.match(source, /data-stage231h-r1f-cost-correction-kind="true"/);
  assert.match(source, /data-stage231h-r1f-cost-correction-date="true"/);
  assert.match(source, /const kind = String\(caseCostCorrectionFormStage231H_R1C\.kind/);
  assert.match(source, /const incurredAt = fin11IsoFromLocal\(caseCostCorrectionFormStage231H_R1C\.incurredAt/);
  assert.match(source, /payload: \{ title: 'Skorygowano koszt sprawy', costId, kind, amount/);
});

test('STAGE231H_R1F guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
