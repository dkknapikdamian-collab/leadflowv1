const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-21-pwa-chunk-event-type.cjs';

test('A2-21 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-21/);
});

test('A2-21 preserves Vite payload and DOM target contracts', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /Vite payload typing/);
});

test('A2-21 preserves one-shot and deferred reload safety', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /chunk guard/);
});
