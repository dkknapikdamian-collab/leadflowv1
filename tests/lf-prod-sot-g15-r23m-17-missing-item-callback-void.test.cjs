const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-17-missing-item-callback-void.cjs';

test('A2-17 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-17/);
});

test('A2-17 removes toast identifier leakage from all four callbacks', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /void-return contracts/);
});

test('A2-17 keeps missing-item authorization and mutation paths', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /auth and mutations/);
});
