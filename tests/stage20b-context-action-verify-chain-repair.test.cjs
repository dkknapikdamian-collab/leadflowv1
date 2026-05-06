const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage20B registers the exact Stage14 alias expected by Stage15 tests', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts['verify:stage14-action-route-parity']);
  assert.ok(pkg.scripts['verify:stage15-context-action-contract'].includes('verify:stage14-action-route-parity'));
});

test('Stage20B keeps Stage15 route contract test compatible', () => {
  const src = read('tests/stage15-context-action-explicit-trigger-contract.test.cjs');
  assert.ok(src.includes("verify:stage14-action-route-parity"));
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage15-context-action-explicit-trigger-contract-v1'], 'node scripts/check-stage15-context-action-explicit-trigger-contract.cjs');
  assert.equal(pkg.scripts['test:stage15-context-action-explicit-trigger-contract-v1'], 'node --test tests/stage15-context-action-explicit-trigger-contract.test.cjs');
});

test('Stage20B release doc exists', () => {
  const doc = read('docs/release/STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1_2026-05-06.md');
  assert.match(doc, /STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1/);
  assert.match(doc, /verify:stage14-action-route-parity/);
});
