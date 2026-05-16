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

test('stage31 helper keeps top tile visual and interaction contract', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.match(source, /TOP_TILE_CLASS_NAME/);
  assert.match(source, /pilne teraz/);
  assert.match(source, /zaleg\u0142e zadania/);
  assert.match(source, /collapseOtherSections/);
  assert.match(source, /moveSectionToTop/);
});

test('stage31 helper CSS interpolation is not visibly broken', () => {
  const source = read('src/lib/stage31-today-tiles-interaction.ts');

  assert.ok(!source.includes('style.textContent =\n    .\\'));
  assert.ok(!source.includes('.\\ {'));
});
