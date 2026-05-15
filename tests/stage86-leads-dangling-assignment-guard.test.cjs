const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(__dirname, '..');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(full)) out.push(full);
  }
  return out;
}

function findDanglingAssignments(source, relativeFile) {
  const failures = [];
  const lines = source.split(/\r?\n/);
  const controlStarters = /^(if|for|while|switch|try|catch|return|throw|else|do)\b/;
  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    if (!/^\s*(const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*$/.test(line)) continue;
    let j = i + 1;
    while (j < lines.length && /^\s*$/.test(lines[j])) j += 1;
    if (j >= lines.length) continue;
    const next = lines[j].trim();
    if (controlStarters.test(next)) {
      failures.push(relativeFile + ':' + (i + 1) + ' dangling assignment before "' + next.slice(0, 40) + '"');
    }
  }
  return failures;
}

test('source files do not contain dangling assignments before control statements', () => {
  const failures = [];
  for (const file of walk(path.join(repo, 'src'))) {
    const relative = path.relative(repo, file);
    const source = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    failures.push(...findDanglingAssignments(source, relative));
  }
  assert.deepEqual(failures, []);
});
