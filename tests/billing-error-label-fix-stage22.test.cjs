const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const billingPath = path.join(root, 'src', 'pages', 'Billing.tsx');
const docPath = path.join(root, 'docs', 'STAGE22_BILLING_ERROR_LABEL_FIX_2026-04-28.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

test('Stage22 keeps Billing compatible with UI and release gate payment labels', () => {
  const page = read(billingPath);
  assert.match(page, /Płatność kartą lub BLIK/);
  assert.match(page, /Stripe\/BLIK/);
  assert.match(page, /Błąd uruchamiania płatności Stripe\/BLIK/);
  assert.doesNotMatch(page, /Błąd uruchamiania płatności Stripe BLIK/);
});

test('Stage22 docs exist and keep encoding clean', () => {
  const doc = read(docPath);
  assert.match(doc, /Stage 22/);
  assert.doesNotMatch(doc, /\u00c4|\u00c5|\ufffd/);
});
