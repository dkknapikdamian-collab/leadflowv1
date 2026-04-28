const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage18 keeps Billing compatible with old Stripe BLIK contract and new short copy', () => {
  const billing = read('src/pages/Billing.tsx');
  assert.equal(billing.includes('BLIK przez Stripe'), true);
  assert.equal(billing.includes('Stripe/BLIK'), true);
  assert.equal(billing.includes('wiec caly workflow dziala bez blokad'), false);
  assert.equal(billing.includes('Jak działa V1'), false);
});

test('Stage18 keeps Stage16 test contract parse-safe', () => {
  const stage16 = read('tests/supabase-first-readiness-stage16.test.cjs');
  assert.equal(stage16.includes('/firebase\\/firestore/'), false);
  assert.equal(stage16.includes('/firebase\/firestore/'), false);
  assert.equal(stage16.includes('firebase/auth'), true);
});
