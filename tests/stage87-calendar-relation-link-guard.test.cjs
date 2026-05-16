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

test('stage87 Calendar relation link guard is semantic, not exact import-format based', () => {
  const source = read('src/pages/Calendar.tsx');
  assert.ok(
    importBlocksFrom(source, 'react-router-dom').some((block) => blockHasNamedImport(block, 'Link')),
    'Calendar.tsx must import Link from react-router-dom.'
  );
  assert.equal(
    importBlocksFrom(source, 'lucide-react').some((block) => blockHasNamedImport(block, 'Link')),
    false,
    'Calendar.tsx must not import Link from lucide-react.'
  );
  assert.equal(
    importBlocksFrom(source, 'react').some((block) => blockHasNamedImport(block, 'Link')),
    false,
    'Calendar.tsx must not import Link from react.'
  );

  const legacyTest = read('tests/calendar-entry-relation-links.test.cjs');
  assert.equal(
    legacyTest.includes("/import \\{ Link \\} from 'react-router-dom'/"),
    false,
    'calendar relation test must not require one exact import line format.'
  );
});
