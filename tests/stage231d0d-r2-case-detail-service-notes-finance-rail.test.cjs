const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('STAGE231D0D-R2 CaseDetail service notes and finance rail guard passes', () => {
  const repo = process.cwd();
  const guardPath = path.join(repo, 'scripts', 'check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs');
  const result = spawnSync(process.execPath, [guardPath], {
    cwd: repo,
    encoding: 'utf8',
    shell: false,
  });
  assert.equal(result.status, 0, [result.stdout || '', result.stderr || ''].join('\n'));
});
