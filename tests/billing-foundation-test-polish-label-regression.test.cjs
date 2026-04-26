const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stripe BLIK foundation test expects corrected Polish checkout label', () => {
  const foundationTest = read('tests/billing-stripe-blik-foundation.test.cjs');
  const billing = read('src/pages/Billing.tsx');

  assert.match(foundationTest, /Przejdź do płatności/);
  assert.doesNotMatch(foundationTest, /Przejdz do platnosci/);

  assert.match(billing, /Przejdź do płatności/);
  assert.doesNotMatch(billing, /Przejdz do platnosci/);
});
