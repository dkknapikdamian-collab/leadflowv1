const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage21 keeps Billing labels compatible with old and new Stripe BLIK contracts', () => {
  const billing = read('src/pages/Billing.tsx');
  assert.match(billing, /P\u0142atno\u015B\u0107 kart\u0105 lub BLIK/);
  assert.match(billing, /BLIK przez Stripe/);
  assert.match(billing, /Stripe\/BLIK/);
  assert.doesNotMatch(billing, /wiec caly workflow dziala bez blokad/);
  assert.doesNotMatch(billing, /Jak dzia\u0142a V1/);
});

test('Stage21 docs keep Polish encoding clean', () => {
  const doc = read('docs/STAGE21_BILLING_LABEL_COMPAT_2026-04-28.md');
  for (const marker of ['\u00c4', '\u00c5', '\ufffd']) {
    assert.equal(doc.includes(marker), false, `Possible mojibake detected: ${marker}`);
  }
});
