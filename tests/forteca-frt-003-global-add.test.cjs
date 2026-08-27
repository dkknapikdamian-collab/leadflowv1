const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const stripComments = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

test('FRT-003 global Add menu exposes only real creation flows', () => {
  const global = stripComments(read('src/components/GlobalQuickActions.tsx'));
  const cases = read('src/pages/Cases.tsx');

  assert.match(global, /data-global-add-trigger="true"/);
  assert.match(global, /data-global-add-menu="true"/);
  assert.match(global, /data-global-quick-action="lead"/);
  assert.match(global, /data-global-quick-action="client"/);
  assert.match(global, /data-global-quick-action="case"/);
  assert.match(global, /to="\/cases\?quick=case"/);
  assert.match(global, /Sprawa/);
  assert.match(cases, /searchParams\.get\('quick'\) !== 'case'/);
  assert.match(cases, /setIsCreateCaseOpen\(true\)/);
  assert.match(cases, /nextParams\.delete\('quick'\)/);

  for (const unsupportedLabel of ['Spotkanie', 'Notatka', 'Brak / blokada', 'Płatność']) {
    const escapedLabel = unsupportedLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.doesNotMatch(global, new RegExp(`>\\s*${escapedLabel}\\s*<`));
  }
});
test('FRT-003 Add menu restores trigger focus on Escape and closes outside', () => {
  const global = read('src/components/GlobalQuickActions.tsx');

  assert.match(global, /const addTriggerRef = useRef<HTMLButtonElement/);
  assert.match(global, /window\.requestAnimationFrame\(\(\) => addTriggerRef\.current\?\.focus\(\)\)/);
  assert.match(global, /if \(event\.key === 'Escape'\) closeAddMenu\(\)/);
  assert.match(global, /if \(target && !addMenuRef\.current\?\.contains\(target\)\) setIsAddMenuOpen\(false\)/);
});
