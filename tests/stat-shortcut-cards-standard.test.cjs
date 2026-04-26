const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('shared stat shortcut card defines the Tasks-style visual standard', () => {
  const source = read('src/components/StatShortcutCard.tsx');

  assert.match(source, /min-h-\[82px\]/);
  assert.match(source, /rounded-2xl/);
  assert.match(source, /uppercase tracking-wider/);
  assert.match(source, /hover:shadow-md/);
  assert.ok(source.includes('ring-2 ring-primary/40 shadow-md'));
  assert.match(source, /key\?: string \| number/);
  assert.match(source, /to\?: string/);
  assert.match(source, /onClick\?: \(\) => void/);
});

test('Tasks, Leads and Cases use the same shared clickable stat card component', () => {
  for (const file of ['src/pages/Tasks.tsx', 'src/pages/Leads.tsx', 'src/pages/Cases.tsx']) {
    const source = read(file);
    assert.match(source, /StatShortcutCard/);
    assert.match(source, /onClick=/);
    assert.doesNotMatch(source, /createSummaryCardClass/);
    assert.doesNotMatch(source, /createSummaryCardContentClass/);
    assert.doesNotMatch(source, /createStatCardClass/);
  }
});

test('top stat tiles keep their target filters wired', () => {
  const tasks = read('src/pages/Tasks.tsx');
  const leads = read('src/pages/Leads.tsx');
  const cases = read('src/pages/Cases.tsx');

  assert.match(tasks, /activateScope\(stat\.id\)/);
  assert.match(leads, /toggleQuickFilter\('active'\)/);
  assert.match(leads, /toggleValueSorting/);
  assert.match(cases, /toggleCaseView\('blocked'\)/);
  assert.match(cases, /toggleCaseView\('needs_next_step'\)/);
});
