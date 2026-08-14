const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/lib/supabase-fallback.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-06-payment-archive-filter.cjs';
const baseSha = '8dfa7387';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-06 guard passes for the payment archive filter removal', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-06/);
});

test('A2-06 removes exactly the unsupported payment archive branch', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  const staleBranch = "      if (!params?.includeArchived && String((row as any).status || '').toLowerCase() === 'archived') return false;\n";
  assert.equal(current, base.replace(staleBranch, ''));
  const paymentStart = current.indexOf('export async function fetchPaymentsFromSupabase');
  const paymentEnd = current.indexOf('\nexport async function createPaymentInSupabase', paymentStart);
  assert.ok(paymentStart >= 0 && paymentEnd > paymentStart);
  assert.equal(current.slice(paymentStart, paymentEnd).includes('params?.includeArchived'), false);
});

test('A2-06 preserves supported payment filters and API contract', () => {
  const current = read(sourcePath);
  for (const token of ['params?.leadId', 'params?.caseId', 'params?.clientId', 'params?.status', 'normalizePaymentListContract']) {
    assert.match(current, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(current, /\/api\/payments\?includeArchived/);
});
