const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Stage32g keeps relation funnel value test in both release gates', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.ok(quietGate.includes('tests/relation-funnel-value.test.cjs'));
  assert.ok(fullGate.includes('tests/relation-funnel-value.test.cjs'));
  assert.ok(quietGate.includes('tests/stage32f-relation-funnel-contract.test.cjs'));
  assert.ok(fullGate.includes('tests/stage32f-relation-funnel-contract.test.cjs'));
});

test('Stage32g compact relation rail contract stays separate from old long copy', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.ok(leads.includes('Lejek razem: {formatRelationValue(relationFunnelValue)}'));
  assert.ok(leads.includes('Najcenniejsze'));
  assert.equal(leads.includes('Suma lejka liczona z aktywnych leadów i klientów'), false);
});
