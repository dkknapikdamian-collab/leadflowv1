const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stripe BLIK checkout endpoint uses explicit result typing for Vercel API build', () => {
  const checkout = read('api/billing-checkout.ts');

  assert.match(checkout, /const result: any = await createStripeBlikCheckout/);
  assert.match(checkout, /result\.url/);
  assert.match(checkout, /result\.planId/);
  assert.match(checkout, /result\.accessDays/);
});
