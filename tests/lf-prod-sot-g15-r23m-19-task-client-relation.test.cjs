const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-19-task-client-relation.cjs';

test('A2-19 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-19/);
});

test('A2-19 keeps client relation through reset and new-task picker', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /state, reset and picker dependencies/);
});

test('A2-19 keeps the task save client relation path', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /coherent/);
});
