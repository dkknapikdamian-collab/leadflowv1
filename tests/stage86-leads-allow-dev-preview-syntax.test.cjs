const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(__dirname, '..');

function read(file) {
  let value = fs.readFileSync(file, 'utf8');
  if (value.charCodeAt(0) === 0xfeff) value = value.slice(1);
  return value;
}

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

test('Leads.tsx keeps allowDevPreview assignment before workspace gate', () => {
  const file = path.join(repo, 'src', 'pages', 'Leads.tsx');
  const source = read(file);
  assert.match(
    source,
    /const\s+allowDevPreview\s*=\s*import\.meta\.env\.DEV\s*&&\s*!isSupabaseConfigured\(\);/,
    'Leads.tsx must keep full allowDevPreview assignment.'
  );
  assert.doesNotMatch(
    source,
    /const\s+allowDevPreview\s*=\s*(?:\r?\n\s*)if\s*\(/,
    'Leads.tsx must not leave allowDevPreview as dangling assignment before if.'
  );
});

test('source files do not contain dangling variable assignment before statement keyword', () => {
  const failures = [];
  const pattern = /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(?:\r?\n\s*)\b(if|for|while|switch|catch|finally|try|return|throw|const|let|var|function|class|import|export)\b/g;

  for (const file of walk(path.join(repo, 'src'))) {
    const source = read(file);
    for (const match of source.matchAll(pattern)) {
      failures.push(path.relative(repo, file) + ' :: ' + match[1]);
    }
  }

  assert.deepStrictEqual(failures, []);
});
