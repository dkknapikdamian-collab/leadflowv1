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
  assert.match(source, /Otw\u00F3rz lead/);
  assert.match(source, /Otw\u00F3rz spraw\u0119/);
});

test('Today renders relation links in at least two entry sections', () => {
  const source = read('src/pages/Today.tsx');
  const matches = source.match(/<TodayEntryRelationLinks entry=\{entry\} \/>/g) || [];

  assert.ok(matches.length >= 2, 'Linki relacyjne powinny by\u0107 dost\u0119pne dla zada\u0144 i wydarze\u0144.');
});

test('Today entry relation links documentation exists', () => {
  const doc = read('docs/TODAY_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.match(doc, /leadId -> Otw\u00F3rz lead/);
  assert.match(doc, /caseId -> Otw\u00F3rz spraw\u0119/);
  assert.match(doc, /pulpitem operacyjnym/);
});
