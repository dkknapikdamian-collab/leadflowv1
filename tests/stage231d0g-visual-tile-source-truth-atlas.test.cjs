const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

test('STAGE231D0G visual tile source truth atlas guard passes', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const guard = path.join(repoRoot, 'scripts', 'check-stage231d0g-visual-tile-source-truth-atlas.cjs');

  assert.equal(fs.existsSync(guard), true, 'guard script must exist');

  const output = execFileSync(process.execPath, [guard], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  assert.match(output, /STAGE231D0G Visual Tile Source Truth Atlas guard: PASS/);
});
