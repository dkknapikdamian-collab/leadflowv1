const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('Stage231D0C/R12 measured axis guard passes', () => {
  const script = path.join(process.cwd(), 'scripts/check-stage231d0c-r12-client-detail-left-rail-measured-axis-fix.cjs');
  const result = spawnSync(process.execPath, [script], { cwd: process.cwd(), encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
