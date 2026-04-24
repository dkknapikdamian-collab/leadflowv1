const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today exposes reusable relation links helper', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /function TodayEntryRelationLinks/);
  assert.match(source, /to=\{`\/leads\/\$\{leadId\}`\}/);
  assert.match(source, /to=\{`\/cases\/\$\{caseId\}`\}/);
  assert.match(source, /Otwórz lead/);
  assert.match(source, /Otwórz sprawę/);
});

test('Today renders relation links in at least two entry sections', () => {
  const source = read('src/pages/Today.tsx');
  const matches = source.match(/<TodayEntryRelationLinks entry=\{entry\} \/>/g) || [];

  assert.ok(matches.length >= 2, 'Linki relacyjne powinny być dostępne dla zadań i wydarzeń.');
});

test('Today entry relation links documentation exists', () => {
  const doc = read('docs/TODAY_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.match(doc, /leadId -> Otwórz lead/);
  assert.match(doc, /caseId -> Otwórz sprawę/);
  assert.match(doc, /pulpitem operacyjnym/);
});
