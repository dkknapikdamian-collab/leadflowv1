const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectIncludes(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

test('Stage29d renders Szkice as one compact bottom tile, not a large preview section', () => {
  const today = read('src/pages/Today.tsx');

  expectIncludes(today, 'TODAY_AI_DRAFTS_TILE_STAGE29D_COMPACT_BOTTOM');
  expectIncludes(today, 'data-today-ai-drafts-compact-tile="true"');
  expectIncludes(today, 'data-today-ai-drafts-stage29d-bottom="true"');
  expectIncludes(today, 'Szkice do zatwierdzenia');
  expectIncludes(today, 'Brak szkic\u00F3w oczekuj\u0105cych');
  expectIncludes(today, 'Otw\u00F3rz Szkice AI');
  assert.equal(today.includes('data-today-ai-drafts-preview-list="true"'), false);
  assert.equal(today.includes('pendingTodayAiDrafts.slice(0, 3)'), false);
});

test('Stage29d keeps old Today collapsible tile mechanics intact', () => {
  const today = read('src/pages/Today.tsx');

  expectIncludes(today, 'function TileCard({');
  expectIncludes(today, 'data-today-tile-card="true"');
  expectIncludes(today, 'data-today-tile-header="true"');
  expectIncludes(today, 'aria-expanded={!collapsed}');
  expectIncludes(today, 'expandTodayShortcutSection(section)');
});

test('Stage29d is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  expectIncludes(gate, 'tests/stage29d-today-ai-drafts-compact-tile.test.cjs');
});
