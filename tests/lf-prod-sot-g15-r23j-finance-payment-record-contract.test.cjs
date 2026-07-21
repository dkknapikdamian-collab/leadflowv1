const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const typesPath = path.join(root, 'src/lib/finance/finance-types.ts');
const normalizePath = path.join(root, 'src/lib/finance/finance-normalize.ts');
const snapshotPath = path.join(root, 'src/components/finance/FinanceSnapshot.tsx');
const formPath = path.join(root, 'src/components/finance/PaymentFormDialog.tsx');
const guardPath = path.join(root, 'scripts/check-g15-r23j-finance-payment-record-contract.cjs');

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

const typesSource = normalizeLineEndings(fs.readFileSync(typesPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));
const snapshotSource = normalizeLineEndings(fs.readFileSync(snapshotPath, 'utf8'));
const formSource = normalizeLineEndings(fs.readFileSync(formPath, 'utf8'));

test('R23J focused scope guard passes on LF and CRLF worktrees', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23J/);
});

test('finance types expose the relation contract already consumed by the payment form', () => {
  assert.match(
    typesSource,
    /export type FinanceRelationRef = \{\n  workspaceId: string;\n  leadId: string \| null;\n  clientId: string \| null;\n  caseId: string \| null;\n\};/,
  );
  assert.match(formSource, /export type PaymentFormValue = FinanceRelationRef & \{/);
});

test('raw and normalized payment contracts admit relation and audit metadata without making it mandatory', () => {
  assert.match(typesSource, /export type FinancePaymentLike = Partial<FinanceRelationRef> & \{/);
  assert.match(typesSource, /export type NormalizedFinancePayment = Partial<FinanceRelationRef> & \{/);
  assert.match(typesSource, /workspace_id\?: string \| null;/);
  assert.match(typesSource, /createdAt\?: string \| null;/);
  assert.match(typesSource, /updated_at\?: string \| null;/);
});

test('normalization accepts raw records while preserving the existing runtime object shape', () => {
  assert.match(
    normalizeSource,
    /payment: FinancePaymentLike \| Record<string, unknown> \| null \| undefined,/,
  );
  assert.match(
    normalizeSource,
    /payments: Array<FinancePaymentLike \| Record<string, unknown>> \| null \| undefined,/,
  );
  assert.match(
    normalizeSource,
    /const row = \(payment \|\| \{\}\) as FinancePaymentLike & Record<string, unknown>;/,
  );
  assert.doesNotMatch(normalizeSource, /workspaceId:/);
  assert.doesNotMatch(normalizeSource, /createdAt:/);
});

test('existing FinanceSnapshot fallback and raw-record normalization call remain unchanged', () => {
  assert.match(snapshotSource, /workspaceId: pickText\(record, \['workspaceId', 'workspace_id'\]\),/);
  assert.match(snapshotSource, /createdAt: null,\n    updatedAt: null,/);
  assert.match(snapshotSource, /normalizeFinancePayments\(payments as Record<string, unknown>\[\]\)/);
});
