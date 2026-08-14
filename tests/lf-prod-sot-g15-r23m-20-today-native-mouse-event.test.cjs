const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-20-today-native-mouse-event.cjs';

test('A2-20 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-20/);
});

test('A2-20 preserves native event propagation control', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /propagation\/cleanup/);
});

test('A2-20 preserves listener registration and cleanup on both surfaces', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /DOM MouseEvent typing/);
});
