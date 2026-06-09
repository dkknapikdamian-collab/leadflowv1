const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

test('Stage240R2 AI Opportunity Finder roadmap guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage240r2-ai-opportunity-finder-roadmap.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
