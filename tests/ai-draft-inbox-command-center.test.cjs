const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('AI draft inbox is a real command center before lead creation', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.ok(page.includes('Centrum szkic\u00F3w'));
  assert.ok(page.includes('Notatka g\u0142osowa najpierw trafia tutaj'));
  assert.ok(page.includes('Lead powstaje dopiero po klikni\u0119ciu'));
  assert.ok(page.includes('data-ai-draft-command-center'));
  assert.ok(page.includes('data-ai-draft-stats'));
  assert.ok(page.includes('data-ai-drafts-tab'));
});

test('AI draft inbox allows safe review actions without auto-creating leads', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.ok(page.includes('updateAiLeadDraft'));
  assert.ok(page.includes('Edytuj notatk\u0119'));
  assert.ok(page.includes('Zapisz zmiany'));
  assert.ok(page.includes('Kopiuj tre\u015B\u0107'));
  assert.ok(page.includes('Przejrzyj i zatwierd\u017A'));
  assert.ok(page.includes('markAiLeadDraftConverted'));
  assert.ok(!page.includes('insertLeadToSupabase'));
});

test('Global quick actions link to AI drafts from every protected screen', () => {
  const global = read('src/components/GlobalQuickActions.tsx');

  assert.ok(global.includes('to="/ai-drafts"'));
  assert.ok(global.includes('Inbox szkic\u00F3w'));
  assert.ok(global.includes('aria-label="Otw\u00F3rz Inbox szkic\u00F3w"'));
  assert.ok(global.includes('data-global-quick-action="ai-drafts"'));
  assert.ok(global.includes('TodayAiAssistant'));
  assert.ok(global.includes('QuickAiCapture'));
  assert.ok(global.includes('<GlobalAiAssistant />'));
});

test('AI draft command center test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/ai-draft-inbox-command-center.test.cjs'));
});
