const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

test('files using React namespace import React as runtime value', () => {
  const bad = [];
  for (const file of walk(srcDir)) {
    const text = fs.readFileSync(file, 'utf8');
    if (!/\bReact\./.test(text)) continue;

    const hasNamespaceImport = /import\s+\*\s+as\s+React\s+from\s+['"]react['"]/.test(text);
    const hasDefaultImport = /import\s+React(?:\s*,|\s+from)/.test(text);

    if (!hasNamespaceImport && !hasDefaultImport) {
      bad.push(path.relative(root, file));
    }
  }

  assert.deepEqual(bad, []);
});
