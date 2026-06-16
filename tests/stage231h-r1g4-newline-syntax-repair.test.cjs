const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

test('STAGE231H_R1G4 keeps escaped newline helper source', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'src', 'pages', 'CaseDetail.tsx'), 'utf8');
  assert.match(source, /replace\(\/\\r\\n\/g, '\\n'\)\.trim\(\)/);
  assert.match(source, /withoutPrefix\.split\('\\n'\)/);
  assert.match(source, /rest\.join\('\\n'\)\.trim\(\)/);
});

test('STAGE231H_R1G4 guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage231h-r1g4-newline-syntax-repair.cjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
