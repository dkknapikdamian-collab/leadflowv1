const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-18-leads-rescue-next-action.cjs';

test('A2-18 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-18/);
});

test('A2-18 keeps rescue rows on their existing row contract', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /rescue next-action title/);
});

test('A2-18 preserves ordinary lead-row next-action metadata', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /ordinary lead-row metadata/);
});
