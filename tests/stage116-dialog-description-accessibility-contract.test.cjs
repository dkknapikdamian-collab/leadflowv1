const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const targetFiles = [
  'src/pages/CaseDetail.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Templates.tsx',
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function getDialogContentBlocks(source) {
  const blocks = [];
  const openPattern = /<DialogContent\b[^>]*>/g;
  let match;
  while ((match = openPattern.exec(source)) !== null) {
    const openStart = match.index;
    const openTag = match[0];
    const closeStart = source.indexOf('</DialogContent>', openPattern.lastIndex);
    assert.notEqual(closeStart, -1, 'DialogContent has no closing tag');
    const closeEnd = closeStart + '</DialogContent>'.length;
    blocks.push({ openTag, block: source.slice(openStart, closeEnd), openStart });
    openPattern.lastIndex = closeEnd;
  }
  return blocks;
}

test('Stage116 target pages import DialogDescription when they render DialogContent', () => {
  for (const relativePath of targetFiles) {
    const source = read(relativePath);
    if (!source.includes('<DialogContent')) continue;

    assert.match(
      source,
      /import\s*\{[\s\S]*\bDialogDescription\b[\s\S]*\}\s*from\s*['"]\.\.\/components\/ui\/dialog['"]/,
      `${relativePath} renders DialogContent but does not import DialogDescription`,
    );
  }
});

test('Stage116 every target DialogContent has DialogDescription or explicit aria-describedby escape', () => {
  for (const relativePath of targetFiles) {
    const source = read(relativePath);
    const blocks = getDialogContentBlocks(source);
    assert.ok(blocks.length > 0, `${relativePath} should be covered by Stage116 dialog scan`);

    for (const { openTag, block, openStart } of blocks) {
      const hasDescription = /<DialogDescription\b/.test(block);
      const hasExplicitEscape = /aria-describedby\s*=\s*\{undefined\}/.test(openTag);
      assert.ok(
        hasDescription || hasExplicitEscape,
        `${relativePath} DialogContent at index ${openStart} is missing DialogDescription or aria-describedby={undefined}`,
      );
    }
  }
});

test('Stage116 Calendar edit modal is explicitly covered', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /<DialogDescription\b[^>]*>[\s\S]*kalendarz[\s\S]*<\/DialogDescription>/i);
});

test('Stage116 CaseDetail, LeadDetail and Templates dialogs are explicitly covered', () => {
  for (const relativePath of ['src/pages/CaseDetail.tsx', 'src/pages/LeadDetail.tsx', 'src/pages/Templates.tsx']) {
    const source = read(relativePath);
    assert.match(source, /<DialogDescription\b[^>]*>[\s\S]*<\/DialogDescription>/, `${relativePath} has no DialogDescription`);
  }
});
