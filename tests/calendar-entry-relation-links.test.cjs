const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Calendar imports router Link for relation navigation', () => {
  const source = read('src/pages/Calendar.tsx');
  assert.match(source, /import\s+\{[^}]*\bLink\b[^}]*\}\s+from\s+['"]react-router-dom['"]/);
});

test('Calendar entry card links to related lead and case', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.ok(source.includes('/leads/${entry.raw.leadId}'));
  assert.ok(source.includes('/cases/${entry.raw.caseId}'));

  assert.ok(source.includes('Otwórz lead'));
  assert.ok(source.includes('Otwórz sprawę'));
});

test('Calendar entry relation links documentation exists', () => {
  const doc = read('docs/CALENDAR_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.ok(doc.includes('leadId -> Otwórz lead'));
  assert.ok(doc.includes('caseId -> Otwórz sprawę'));
  assert.match(doc, /centrum operacyjnym/);
});
