const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const paymentsApi = fs.readFileSync(path.join(repoRoot, 'src/server/payments.ts'), 'utf8');

test('payment API maps fully_paid input to DB-safe paid instead of planned', () => {
  assert.ok(
    paymentsApi.includes('function normalizePaymentStatusForWriteStage232KR3C(statusValue: unknown, paidAtValue: unknown)'),
    'R3C status helper signature must remain present'
  );
  assert.ok(paymentsApi.includes("'fully_paid'"), 'helper must accept fully_paid input');
  assert.ok(
    paymentsApi.includes("if (paidLikeStatuses.has(normalized)) return 'paid';"),
    'paid-like inputs must map to DB-safe paid'
  );
  assert.ok(
    paymentsApi.includes('status: normalizePaymentStatusForWriteStage232KR3C(body.status, body.paidAt),'),
    'POST must use the R3C helper'
  );
  assert.equal(
    paymentsApi.includes("status: normalizeEnum(body.status, PAYMENT_STATUSES, 'planned'),"),
    false,
    'POST must not fallback fully_paid to planned through normalizeEnum'
  );
});

test('payment API PATCH maps paid-like status through the same helper', () => {
  assert.ok(
    paymentsApi.includes('payload.status = normalizePaymentStatusForWriteStage232KR3C(body.status, body.paidAt)'),
    'PATCH must use the R3C helper'
  );
  assert.equal(
    paymentsApi.includes("if (body.status !== undefined) payload.status = normalizeEnum(body.status, PAYMENT_STATUSES, 'planned');"),
    false,
    'PATCH must not fallback fully_paid to planned through normalizeEnum'
  );
});

test('paidAt fallback stores paid and planned stays available for future scheduled payments', () => {
  assert.ok(
    paymentsApi.includes("return toIso(paidAtValue) ? 'paid' : 'planned';"),
    'paidAt fallback must store DB-safe paid instead of planned'
  );
  assert.ok(
    paymentsApi.includes("const PAYMENT_STATUSES = new Set(['planned', 'due', 'paid', 'cancelled'])"),
    'DB-safe payment status domain must remain planned/due/paid/cancelled'
  );
});
