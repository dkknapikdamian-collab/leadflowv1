#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const paymentsApi = fs.readFileSync(path.join(repoRoot, 'src/server/payments.ts'), 'utf8');
const runtimeGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');

const checks = [];
function pass(message) { checks.push({ ok: true, message }); }
function fail(message) { checks.push({ ok: false, message }); }
function expect(condition, message) { condition ? pass(message) : fail(message); }

expect(paymentsApi.includes('STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX'), 'payments API has R3C marker');
expect(paymentsApi.includes('function normalizePaymentStatusForWriteStage232KR3C'), 'payments API has DB-safe write status helper');
expect(paymentsApi.includes("'fully_paid'"), 'helper accepts fully_paid input');
expect(paymentsApi.includes("'partially_paid'"), 'helper accepts partially_paid input');
expect(paymentsApi.includes("'deposit_paid'"), 'helper accepts deposit_paid input');
expect(paymentsApi.includes("if (paidLikeStatuses.has(normalized)) return 'paid';"), 'paid-like inputs map to DB-safe paid');
expect(paymentsApi.includes("return toIso(paidAtValue) ? 'paid' : 'planned';"), 'paidAt fallback maps to paid, not planned');
expect(paymentsApi.includes('status: normalizePaymentStatusForWriteStage232KR3C(body.status, body.paidAt),'), 'POST uses R3C helper');
expect(paymentsApi.includes('payload.status = normalizePaymentStatusForWriteStage232KR3C(body.status, body.paidAt)'), 'PATCH uses R3C helper');
expect(!paymentsApi.includes("status: normalizeEnum(body.status, PAYMENT_STATUSES, 'planned'),"), 'POST no longer falls back fully_paid to planned');
expect(!paymentsApi.includes("if (body.status !== undefined) payload.status = normalizeEnum(body.status, PAYMENT_STATUSES, 'planned');"), 'PATCH no longer falls back fully_paid to planned');
expect(runtimeGuard.includes('src/server/payments.ts'), 'CF runtime allowlist contains src/server/payments.ts');
expect(runtimeGuard.includes('scripts/check-stage232k-r3c-payment-api-status-db-safe-paid.cjs'), 'CF runtime allowlist contains R3C guard');
expect(runtimeGuard.includes('tests/stage232k-r3c-payment-api-status-db-safe-paid.test.cjs'), 'CF runtime allowlist contains R3C test');

let changed = '';
try {
  changed = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' });
} catch (error) {
  fail('git diff failed: ' + error.message);
}
const forbidden = changed.split(/\r?\n/).filter(Boolean).filter((file) =>
  file.includes('MissingItems') ||
  file.includes('OwnerControl') ||
  file.includes('Calendar') ||
  file.includes('billing') ||
  file.includes('node-red') ||
  file.includes('kabelki') ||
  file.endsWith('.sql')
);
expect(forbidden.length === 0, 'no forbidden scope changes' + (forbidden.length ? ': ' + forbidden.join(', ') : ''));

for (const check of checks) console.log((check.ok ? 'PASS' : 'FAIL') + ': ' + check.message);
const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error('STAGE232K_R3C guard failed: ' + failed.length);
  process.exit(1);
}
console.log('STAGE232K_R3C guard passed.');
