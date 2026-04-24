const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today imports runtime priority reasons helper', () => {
  const source = read('src/pages/Today.tsx');

  assert.ok(source.includes('getTodayEntryPriorityReasons'));
  assert.match(source, /from ['"]\.\.\/lib\/today-v1-final['"]/);
});

test('Today priority reasons helper is exported from final helper module', () => {
  const source = read('src/lib/today-v1-final.ts');

  assert.match(source, /export\s+(function|const)\s+getTodayEntryPriorityReasons\b/);
});

test('Today priority reasons runtime fix documentation exists', () => {
  const doc = read('docs/TODAY_PRIORITY_REASONS_RUNTIME_FIX_2026-04-24.md');

  assert.ok(doc.includes('ReferenceError: getTodayEntryPriorityReasons is not defined'));
  assert.ok(doc.includes('Today.tsx importuje getTodayEntryPriorityReasons'));
});
