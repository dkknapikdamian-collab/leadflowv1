const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function importBlocksFrom(source, moduleName) {
  const blocks = [];
  const text = String(source).replace(/\r\n/g, '\n');
  const re = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]\s*;/g;
  let match;
  while ((match = re.exec(text))) {
    if (match[1] === moduleName) blocks.push(match[0]);
  }
  return blocks;
}

function blockHasNamedImport(block, name) {
  const named = block.match(/\{([\s\S]*?)\}/);
  if (!named) return false;
  return named[1]
    .split(',')
    .map((part) => part.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/g, '').trim())
    .filter(Boolean)
    .map((part) => part.replace(/^type\s+/, '').trim())
    .map((part) => {
      const alias = part.match(/\s+as\s+(.+)$/);
      return (alias ? alias[1] : part).trim();
    })
    .includes(name);
}

test('Calendar imports router Link for relation navigation', () => {
  const source = read('src/pages/Calendar.tsx');
  const routerBlocks = importBlocksFrom(source, 'react-router-dom');
  assert.ok(routerBlocks.some((block) => blockHasNamedImport(block, 'Link')), 'Calendar.tsx must import Link from react-router-dom.');

  for (const moduleName of ['lucide-react', 'react', '../components/operator-rail']) {
    const badBlocks = importBlocksFrom(source, moduleName).filter((block) => blockHasNamedImport(block, 'Link'));
    assert.equal(badBlocks.length, 0, 'Calendar.tsx must not import Link from ' + moduleName + '.');
  }
});

test('Calendar entry card links to related lead and case', () => {
  const source = read('src/pages/Calendar.tsx');

  assert.ok(source.includes('/leads/${entry.raw.leadId}'));
  assert.ok(source.includes('/cases/${entry.raw.caseId}'));

  assert.ok(source.includes('Otw\u00F3rz lead'));
  assert.ok(source.includes('Otw\u00F3rz spraw\u0119'));
});

test('Calendar entry relation links documentation exists', () => {
  const doc = read('docs/CALENDAR_ENTRY_RELATION_LINKS_2026-04-24.md');

  assert.ok(doc.includes('leadId -> Otw\u00F3rz lead'));
  assert.ok(doc.includes('caseId -> Otw\u00F3rz spraw\u0119'));
  assert.match(doc, /centrum operacyjnym/);
});
