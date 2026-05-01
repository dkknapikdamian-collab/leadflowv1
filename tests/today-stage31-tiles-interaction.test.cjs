const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = process.env.REPO_UNDER_TEST || process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

test('Today imports and installs stage31 tiles interaction helper', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /installTodayStage31TilesInteraction/);
  assert.match(source, /return\s+installTodayStage31TilesInteraction\(\)/);
});

test('stage31 helper maps Pilne teraz to overdue tasks section first', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.match(source, /pilne teraz/);
  assert.match(source, /zaległe zadania/);
  assert.match(source, /collapseOtherSections/);
  assert.match(source, /moveSectionToTop/);
  assert.match(source, /TOP_TILE_CLASS_NAME/);
});

test('stage31 helper CSS interpolation is intact', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.match(source, /\.\$\{TOP_TILE_CLASS_NAME\}/);
  assert.match(source, /\.\$\{TOP_TILE_ACTIVE_CLASS_NAME\}/);
  assert.doesNotMatch(source, /style\.textContent\s*=\s*\.\\/);
});
