const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('AI draft inbox stores dictated notes before lead conversion', () => {
  const lib = read('src/lib/ai-drafts.ts');
  assert.ok(lib.includes('saveAiLeadDraft'));
  assert.ok(lib.includes('markAiLeadDraftConverted'));
  assert.ok(lib.includes('closeflow:ai-lead-drafts:v1'));

  const page = read('src/pages/AiDrafts.tsx');
  assert.ok(page.includes('Szkice AI'));
  assert.ok(page.includes('Przejrzyj i zatwierd\u017A'));
  assert.ok(page.includes('markAiLeadDraftConverted'));
});

test('Quick AI Capture saves notes as drafts and requires explicit lead confirmation', () => {
  const source = read('src/components/QuickAiCapture.tsx');
  assert.ok(source.includes('saveAiLeadDraft'));
  assert.ok(source.includes('Zapisz szkic'));
  assert.ok(source.includes('Zatwierd\u017A jako lead'));
  assert.ok(!source.includes('Zapisz po sprawdzeniu'));
});

test('Today assistant can save lead-capture commands into AI drafts', () => {
  const source = read('src/components/TodayAiAssistant.tsx');
  assert.ok(source.includes('saveAiLeadDraft'));
  assert.ok(source.includes('Zapisz w szkicach AI'));
  assert.ok(source.includes('Otw\u00F3rz w Szybkim szkicu'));
});

test('Global quick actions are available from protected app layout', () => {
  const layout = read('src/components/Layout.tsx');
  const global = read('src/components/GlobalQuickActions.tsx');
  const app = read('src/App.tsx');

  assert.ok(layout.includes('GlobalQuickActions'), 'Layout must import/render GlobalQuickActions');
  assert.ok(layout.includes('<GlobalQuickActions'), 'Layout must render the global action bar');
  assert.ok(layout.includes('Inbox szkic\u00F3w'));
  assert.ok(app.includes('AiDrafts'));
  assert.ok(app.includes('path="/ai-drafts"'));
  assert.ok(global.includes('TodayAiAssistant'));
  assert.ok(global.includes('QuickAiCapture'));
  assert.ok(global.includes('to="/leads?quick=lead"'));
  assert.ok(global.includes('data-global-task-direct-modal-trigger="true"'));
  assert.ok(global.includes('to="/calendar?quick=event"'));
  assert.ok(global.includes('data-global-quick-actions'));
});

test('AI draft inbox test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/ai-draft-inbox-flow.test.cjs'));
});
