const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

function rejectText(source, text) {
  assert.ok(!source.includes(text), 'Unexpected text: ' + text);
}

test('Billing checkout does not prefill workspace e-mail on Stripe page', () => {
  const source = read('src/pages/Billing.tsx');

  expectText(source, "customerEmail: '',");
  rejectText(source, "customerEmail: workspace?.dailyDigestRecipientEmail || ''");
});
