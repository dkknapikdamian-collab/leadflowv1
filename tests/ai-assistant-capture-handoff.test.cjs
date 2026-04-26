const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today assistant can hand a lead-capture command to Quick AI Capture without auto-saving', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.resolve(__dirname, '..');
  const assistant = fs.readFileSync(path.join(root, 'src/components/TodayAiAssistant.tsx'), 'utf8');
  const globalQuickActions = fs.readFileSync(path.join(root, 'src/components/GlobalQuickActions.tsx'), 'utf8');

  assert.ok(assistant.includes('onCaptureRequest'), 'assistant keeps capture handoff prop');
  assert.ok(assistant.includes('saveAiLeadDraft'), 'assistant can still save obvious lead commands into AI drafts');
  assert.ok(globalQuickActions.includes('GlobalAiAssistant') || globalQuickActions.includes('TodayAiAssistant'), 'global quick actions expose AI assistant');
  assert.ok(assistant.includes('AI_DIRECT_WRITE_MODE_STATE'), 'assistant exposes direct write safety gate state');
  assert.ok(assistant.includes('direct_task_event'), 'assistant must require explicit direct write mode');
  assert.ok(assistant.includes('parseAiDirectWriteCommand'), 'assistant must parse direct write only through guard');
  assert.ok(assistant.includes('insertTaskToSupabase'), 'assistant may write tasks only behind explicit safety gate');
  assert.ok(assistant.includes('insertEventToSupabase'), 'assistant may write events only behind explicit safety gate');
  assert.ok(!assistant.includes('insertLeadToSupabase'), 'assistant must not create final leads directly');
});
test('Today assistant saves obvious lead commands into AI drafts without model usage', () => {
  const assistant = read('src/components/TodayAiAssistant.tsx');

  assert.ok(assistant.includes('CLIENT_LEAD_CAPTURE_PATTERNS'), 'assistant should have a local lead-capture guard');
  assert.ok(assistant.includes('isClientLeadCaptureCommand(command)'), 'assistant should detect lead capture before model call');
  assert.ok(assistant.includes("saveAiLeadDraft({ rawText: command, source: 'today_assistant' })"), 'assistant should save captured lead notes to AI drafts');
  assert.ok(assistant.includes('buildClientLeadCaptureDraftAnswer(command)'), 'assistant should show clear draft result');
  assert.ok(assistant.includes('Szkic leada zapisany w Szkicach AI'), 'assistant should confirm where the dictated note went');
  assert.ok(assistant.includes("href: '/ai-drafts'"), 'assistant should link the user to AI Drafts');
  assert.ok(assistant.includes('client_lead_capture_guard'), 'lead capture should use the local guard provider');
  assert.ok(assistant.includes('disabled={loading}'), 'assistant button must allow no-model lead draft saving even after AI limit is used');
  assert.ok(!assistant.includes('disabled={loading || !usage.canUse}'), 'AI limit must not block local lead draft saving');

  const localSaveIndex = assistant.indexOf("saveAiLeadDraft({ rawText: command, source: 'today_assistant' })");
  const modelCallIndex = assistant.indexOf('const result = await askTodayAiAssistant');
  assert.ok(localSaveIndex > -1, 'local draft save must exist');
  assert.ok(modelCallIndex > -1, 'model call must still exist for in-scope questions');
  assert.ok(localSaveIndex < modelCallIndex, 'lead capture must be handled before any remote model call');
});

test('AI assistant capture handoff test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-capture-handoff.test.cjs'"));
});
