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

test('stage31 v6 helper forces number visibility and full tile root styling', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.match(source, /STAGE31_TODAY_TILES_VISUAL_FIX_V6/);
  assert.match(source, /TOP_TILE_NUMBER_CLASS_NAME/);
  assert.match(source, /findVisualTileRoot/);
  assert.match(source, /opacity:\s*1\s*!important/);
  assert.match(source, /-webkit-text-fill-color:\s*rgb\(15 23 42\)\s*!important/);
  assert.match(source, /markNumberLikeChildren/);
});

test('stage31 helper maps Pilne teraz to overdue tasks section first', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.match(source, /pilne teraz/);
  assert.match(source, /zaległe zadania/);
  assert.match(source, /collapseOtherSections/);
  assert.match(source, /moveSectionToTop/);
});

test('stage31 helper CSS interpolation is intact', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.ok(source.includes('.${TOP_TILE_CLASS_NAME} {'));
  assert.ok(source.includes('.${TOP_TILE_ACTIVE_CLASS_NAME} {'));
  assert.ok(!source.includes('style.textContent =\n    .\\'));
  assert.ok(!source.includes('.\\ {'));
});
