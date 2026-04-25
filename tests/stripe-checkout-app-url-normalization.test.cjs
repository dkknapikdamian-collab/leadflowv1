const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stripe checkout app URL always gets explicit http or https scheme', () => {
  const helper = read('src/server/_stripe.ts');

  assert.match(helper, /export function normalizeAppUrl\(value: unknown/);
  assert.match(helper, /\^https\?:\\\/\\\//);
  assert.ok(helper.includes('return `https://${cleaned}`;'));
  assert.ok(helper.includes('return `http://${cleaned}`;'));
  assert.ok(helper.includes('return normalizeAppUrl(configured);'));
  assert.ok(helper.includes('return normalizeAppUrl(host);'));
});

test('Stripe checkout still builds success and cancel URLs from normalized app URL', () => {
  const helper = read('src/server/_stripe.ts');

  assert.ok(helper.includes("params.set('success_url', `${appUrl}/billing?checkout=success`);"));
  assert.ok(helper.includes("params.set('cancel_url', `${appUrl}/billing?checkout=cancelled`);"));
  assert.doesNotMatch(helper, /if \(configured\) return configured\.replace/);
});
