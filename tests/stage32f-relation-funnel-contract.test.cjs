const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const leads = fs.readFileSync(path.join(root, 'src/pages/Leads.tsx'), 'utf8');
const relationTest = fs.readFileSync(path.join(root, 'tests/relation-funnel-value.test.cjs'), 'utf8');
const quietGate = fs.readFileSync(path.join(root, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');
const fullGate = fs.readFileSync(path.join(root, 'scripts/closeflow-release-check.cjs'), 'utf8');

test('Stage32f keeps compact relation rail while relation funnel contract stays valid', () => {
  assert.ok(leads.includes('Lejek razem: {formatRelationValue(relationFunnelValue)}'));
  assert.ok(leads.includes('Najcenniejsze'));
  assert.ok(!leads.includes('Suma lejka liczona z aktywnych lead\u00F3w i klient\u00F3w'));
  assert.ok(relationTest.includes('STAGE32F_RELATION_FUNNEL_CONTRACT'));
});

test('Stage32f relation funnel test is still included in release gates', () => {
  assert.ok(quietGate.includes('tests/relation-funnel-value.test.cjs'));
  assert.ok(fullGate.includes('tests/relation-funnel-value.test.cjs'));
  assert.ok(quietGate.includes('tests/stage32f-relation-funnel-contract.test.cjs'));
  assert.ok(fullGate.includes('tests/stage32f-relation-funnel-contract.test.cjs'));
});
