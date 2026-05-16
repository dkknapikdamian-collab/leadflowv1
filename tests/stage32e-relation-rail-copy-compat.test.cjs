const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stage32e keeps right rail compact and removes old long relation copy', () => {
  const leads = read('src/pages/Leads.tsx');

  assert.ok(leads.includes('STAGE32_VALUABLE_RELATIONS_RIGHT_RAIL'));
  assert.ok(leads.includes('data-stage32-leads-value-rail="true"'));
  assert.ok(leads.includes('Lejek razem: {formatRelationValue(relationFunnelValue)}'));
  assert.equal(leads.includes('Suma lejka liczona z aktywnych lead\u00F3w i klient\u00F3w'), false);
  assert.equal(leads.includes('Suma lejka liczona z aktywnych leadow i klientow'), false);
  assert.equal(leads.includes('md:grid-cols-2 xl:grid-cols-3'), false);
});

test('Stage32e test is included in release gates', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.ok(quietGate.includes('tests/stage32e-relation-rail-copy-compat.test.cjs'));
  assert.ok(fullGate.includes('tests/stage32e-relation-rail-copy-compat.test.cjs'));
});
