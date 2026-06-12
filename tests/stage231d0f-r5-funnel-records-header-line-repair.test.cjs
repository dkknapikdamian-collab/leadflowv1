const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

test('check-stage231d0f-r5-funnel-records-header-line-repair.cjs passes', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const guard = path.join(repoRoot, 'scripts', 'check-stage231d0f-r5-funnel-records-header-line-repair.cjs');

  assert.equal(fs.existsSync(guard), true, 'guard script must exist');

  const output = execFileSync(process.execPath, [guard], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  assert.match(output, /STAGE231D0F-R5 Funnel records header line repair guard: PASS/);
});
