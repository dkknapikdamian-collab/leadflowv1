const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('global quick actions are sticky and usable on mobile', () => {
  const source = read('src/components/GlobalQuickActions.tsx');
  assert.match(source, /data-global-quick-actions/);
  assert.match(source, /sticky top-16/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /Asystent AI|TodayAiAssistant/);
  assert.match(source, /Szybki szkic|QuickAiCapture/);
  assert.match(source, /Lead/);
  assert.match(source, /Zadanie/);
  assert.match(source, /Wydarzenie/);
});

test('protected layout renders global quick actions from one central place', () => {
  const layout = read('src/components/Layout.tsx');
  assert.match(layout, /GlobalQuickActions/);
  const renderCount = (layout.match(/<GlobalQuickActions \/>/g) || []).length;
  assert.equal(renderCount, 1);
});

test('AI draft inbox has no escaped template literal artifacts', () => {
  const source = read('src/pages/AiDrafts.tsx');
  assert.equal(source.includes('\\`'), false);
  assert.equal(source.includes('\\${'), false);
});

test('global quick actions sticky test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(gate, /tests\/global-quick-actions-sticky-single-source\.test\.cjs/);
});
