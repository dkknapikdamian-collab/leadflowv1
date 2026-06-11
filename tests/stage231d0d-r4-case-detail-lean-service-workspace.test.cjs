const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('STAGE231D0D-R4 CaseDetail lean service workspace guard passes', () => {
  const guard = path.join(process.cwd(), 'scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs');
  const result = spawnSync(process.execPath, [guard], { cwd: process.cwd(), encoding: 'utf8', shell: false });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
