const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

test('Stage231D0C LeadListCard client-aligned guard passes', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['scripts/check-stage231d0c-lead-list-card-client-align.cjs'], {
      stdio: 'pipe',
      encoding: 'utf8',
    });
  });
});
