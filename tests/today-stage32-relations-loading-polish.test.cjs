const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = process.env.REPO_UNDER_TEST || process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

test('Today imports and installs stage32 relations/loading polish helper', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /installTodayStage32RelationsLoadingPolish/);
  assert.match(source, /return\s+installTodayStage32RelationsLoadingPolish\(\)/);
});

test('stage32 helper targets valuable relations and aligns type badges', () => {
  const source = read('src/lib/stage32-today-relations-loading-polish.ts');

  assert.match(source, /Najcenniejsze/i);
  assert.match(source, /data-stage32-valuable-relations-card/);
  assert.match(source, /data-stage32-relation-type/);
  assert.match(source, /Lead/);
  assert.match(source, /Klient/);
  assert.match(source, /Sprawa/);
});

test('stage32 helper adds loading shell for Today summary', () => {
  const source = read('src/lib/stage32-today-relations-loading-polish.ts');

  assert.match(source, /\u0141aduj\u0119 dzisiejszy plan/);
  assert.match(source, /data-stage32-today-summary-loading/);
  assert.match(source, /hasLoadedTopTiles/);
});

test('stage32 helper does not contain broken css interpolation markers', () => {
  const source = read('src/lib/stage32-today-relations-loading-polish.ts');

  assert.ok(source.includes('[data-stage32-valuable-relations-card="true"]'));
  assert.ok(!source.includes('style.textContent =\n    .\\'));
  assert.ok(!source.includes('.\\ {'));
});
