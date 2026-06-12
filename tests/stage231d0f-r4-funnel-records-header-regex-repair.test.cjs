const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

test('check-stage231d0f-r4-funnel-records-header-regex-repair.cjs passes', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const guard = path.join(repoRoot, 'scripts', 'check-stage231d0f-r4-funnel-records-header-regex-repair.cjs');

  assert.equal(fs.existsSync(guard), true, 'guard script must exist');

  const output = execFileSync(process.execPath, [guard], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  assert.match(output, /STAGE231D0F-R4 Funnel records header regex repair guard: PASS/);
});
