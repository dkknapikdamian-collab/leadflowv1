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

  assert.match(source, /import \{ Link \} from 'react-router-dom'/);
});

test('Calendar entry card links to related lead and case', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.match(source, /to=\{`\/leads\/\$\{entry\.raw\.leadId\}`\}/);
  assert.match(source, /to=\{`\/cases\/\$\{entry\.raw\.caseId\}`\}/);
  assert.match(source, /Otwórz lead/);
  assert.match(source, /Otwórz sprawę/);
});

test('Calendar entry relation links documentation exists', () => {
  const doc = read('docs/CALENDAR_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.match(doc, /leadId -> Otwórz lead/);
  assert.match(doc, /caseId -> Otwórz sprawę/);
  assert.match(doc, /centrum operacyjnym/);
});
