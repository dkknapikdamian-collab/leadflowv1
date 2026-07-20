const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const wrappers = [
  'scripts/check-visual-stage16-today-html-reset.cjs',
  'scripts/check-visual-html-theme-v14.cjs',
  'scripts/check-visual-stage08-case-detail.cjs',
  'scripts/check-visual-stage07-cases.cjs',
  'scripts/check-visual-stage06-client-detail.cjs',
  'scripts/check-visual-stage04-lead-detail.cjs',
  'scripts/check-visual-stage03-leads.cjs',
  'scripts/check-visual-stage02-today.cjs',
  'scripts/check-visual-stage01-shell.cjs',
];

test('all reconciled historical visual wrappers pass against current source truth', () => {
  for (const relativePath of wrappers) {
    const result = spawnSync(process.execPath, [path.join(root, relativePath)], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });

    assert.equal(result.status, 0, `${relativePath}\n${result.stdout}\n${result.stderr}`);
  }
});
