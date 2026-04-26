const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('billing dry-run test checks real checkout call, not import position', () => {
  const testSource = read('tests/billing-stripe-diagnostics-dry-run.test.cjs');

  assert.match(testSource, /realCheckoutCallIndex/);
  assert.match(testSource, /const result: any = await createStripeBlikCheckout/);
  assert.doesNotMatch(testSource, /api\.indexOf\('createStripeBlikCheckout'\)/);
});
