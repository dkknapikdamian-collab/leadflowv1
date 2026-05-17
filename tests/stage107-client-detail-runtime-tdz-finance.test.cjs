const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');

test('ClientDetail declares finance summary before client finance reads it', () => {
  const summaryPos = src.indexOf('  const clientFinanceSummary = useMemo(() => {');
  const financePos = src.indexOf('  const clientFinance = useMemo(() => {');
  assert.ok(summaryPos >= 0, 'clientFinanceSummary useMemo missing');
  assert.ok(financePos > summaryPos, 'clientFinance must be after clientFinanceSummary to avoid TDZ runtime crash');
});

test('ClientDetail uses the canonical object input for getClientCasesFinanceSummary', () => {
  assert.equal(src.includes('getClientCasesFinanceSummary(cases ?? [], payments ?? [])'), false);
  assert.match(src, /getClientCasesFinanceSummary({ client, cases: cases ?? [], payments: payments ?? [] })/);
});

test('ClientTopTiles gets finance summary through props instead of reading an outer variable', () => {
  assert.match(src, /financeSummary: ClientFinanceSummaryForTopTiles;/);
  assert.match(src, /function ClientTopTiles({ clientId, leads, cases, payments, tasks, events, financeSummary, onOpenCases }: ClientTopTilesProps)/);
  assert.match(src, /financeSummary={clientFinanceSummary}/);
  assert.equal(src.includes('const paidTotal = clientFinanceSummary.paymentsTotal'), false);
  assert.equal(src.includes('const declaredTotal = clientFinanceSummary.commissionDueTotal'), false);
});
