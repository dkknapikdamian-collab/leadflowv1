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

test('Stage29 Today shows a pending AI drafts tile and preview list', () => {
  const today = read('src/pages/Today.tsx');

  expectIncludes(today, 'TODAY_AI_DRAFTS_TILE_STAGE29');
  expectIncludes(today, 'data-today-ai-drafts-tile="true"');
  expectIncludes(today, 'Szkice do zatwierdzenia');
  expectIncludes(today, 'data-today-ai-drafts-pending-count="true"');
  expectIncludes(today, 'data-today-ai-drafts-preview-list="true"');
  expectIncludes(today, 'pendingTodayAiDrafts.slice(0, 3)');
  expectIncludes(today, "openTodayTopTileShortcut('ai_drafts')");
  expectIncludes(today, 'Szkice AI');
});

test('Stage29 Today counts only drafts still waiting for approval', () => {
  const today = read('src/pages/Today.tsx');

  expectIncludes(today, 'function getPendingTodayAiDrafts');
  expectIncludes(today, "draft.status === 'draft'");
  expectIncludes(today, "String(draft.rawText || '').trim()");
  expectIncludes(today, 'getAiLeadDraftsAsync()');
  expectIncludes(today, 'setTodayAiDrafts(Array.isArray(drafts) ? drafts : [])');
});

test('Stage29 AI drafts shortcut routes to the drafts inbox and is covered by quiet gate', () => {
  const today = read('src/pages/Today.tsx');
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

  expectIncludes(today, "if (target === 'ai_drafts') {");
  expectIncludes(today, "window.location.assign('/ai-drafts')");
  expectIncludes(today, "if (target === 'ai_drafts') return 'today-section-ai-drafts';");
  expectIncludes(today, "if (target === 'ai_drafts') return 'szkice-ai';");
  expectIncludes(quietGate, 'tests/today-ai-drafts-tile-stage29.test.cjs');
});
