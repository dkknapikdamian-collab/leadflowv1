const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('Stage20C repairs Stage14 verify alias exactly as Stage14 test expects', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts['verify:stage14-action-route-parity'].includes('check:stage14-context-action-route-parity-v1'));
  assert.ok(pkg.scripts['verify:stage14-action-route-parity'].includes('test:stage14-context-action-route-parity-v1'));
});

test('Stage20C keeps Stage15 verify chain dependent on Stage14 alias', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(pkg.scripts['verify:stage15-context-action-contract'].includes('verify:stage14-action-route-parity'));
});

test('Stage20C release doc documents the package script repair', () => {
  const doc = read('docs/release/STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1_2026-05-06.md');
  assert.match(doc, /STAGE20C_CONTEXT_ACTION_VERIFY_CHAIN_STAGE14_REPAIR_V1/);
  assert.match(doc, /verify:stage14-action-route-parity/);
});
