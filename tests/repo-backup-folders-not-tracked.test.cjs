const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');

function isBackupPath(file) {
  const normalized = file.replace(/\\/g, '/');
  const first = normalized.split('/')[0] || '';
  return /^\.[^/]*_backup_[^/]*$/.test(first) || /^\.stage\d+[^/]*_backup_[^/]*$/.test(first);
}

test('repo does not track local stage backup folders', () => {
  const tracked = execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(isBackupPath);

  assert.deepEqual(tracked, []);
});

test('gitignore blocks local stage backup folders', () => {
  const gitignore = fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf8');
  assert.match(gitignore, /\.stage\*_backup_\*\//);
  assert.match(gitignore, /\.global_\*_backup_\*\//);
});
