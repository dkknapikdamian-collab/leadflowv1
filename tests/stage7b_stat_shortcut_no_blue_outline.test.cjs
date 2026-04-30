const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const filePath = path.join(root, 'src/components/StatShortcutCard.tsx');
const source = fs.readFileSync(filePath, 'utf8');

const { markerChars: mojibake } = require('../scripts/mojibake-markers.cjs');

test('StatShortcutCard nie daje aktywnej karcie niebieskiego obramowania', () => {
  assert.doesNotMatch(source, /active\s*\?\s*'[^']*\bring-2\b[^']*ring-primary\/40[^']*'/);
  assert.doesNotMatch(source, /active\s*\?\s*'[^']*\bring-primary\/40[^']*'/);
  assert.match(source, /active\s*\?\s*'shadow-md'\s*:\s*'hover:shadow-md'/);
});

test('StatShortcutCard nie pokazuje focus ringa jako niebieskiej ramki', () => {
  assert.match(source, /outline-none/);
  assert.match(source, /focus-visible:outline-none/);
  assert.match(source, /focus-visible:ring-0/);
});

test('Stage 7B nie wprowadza mojibake', () => {
  for (const bad of mojibake) {
    assert.ok(!source.includes(bad), `StatShortcutCard.tsx zawiera podejrzany znak: ${bad}`);
  }
});
