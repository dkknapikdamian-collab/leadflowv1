const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

test('stage70 right rail source truth guard passes', () => {
  const output = execFileSync(process.execPath, ['scripts/check-stage70-right-rail-source-truth.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  assert.match(output, /Stage70 right rail source truth guard passed/);
});
