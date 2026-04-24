const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function getLucideImportNames(source) {
  const match = source.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/);
  assert.ok(match, 'Missing lucide-react import block.');
  return match[1].split(',').map((item) => item.trim()).filter(Boolean);
}

test('Cases imports FileText when the icon is used', () => {
  const source = read('src/pages/Cases.tsx');

  assert.ok(source.includes('FileText'), 'Cases.tsx should still expose the FileText icon usage.');
  assert.ok(getLucideImportNames(source).includes('FileText'), 'FileText must be imported from lucide-react.');
});

test('Cases FileText runtime fix documentation exists', () => {
  const doc = read('docs/CASES_FILETEXT_RUNTIME_FIX_2026-04-24.md');

  assert.ok(doc.includes('ReferenceError: FileText is not defined'));
  assert.ok(doc.includes('cases-filetext-runtime.test.cjs'));
});
