const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assertHas(source, snippet, label) {
  assert.ok(
    source.includes(snippet),
    `Missing Stage28 contract snippet: ${label}`,
  );
}

test('Stage28 direct write mode can create clear leads, tasks and events', () => {
  const guard = read('src/lib/ai-direct-write-guard.ts');
  const assistant = read('src/components/TodayAiAssistant.tsx');

  assertHas(guard, "export type AiDirectWriteKind = 'lead' | 'task' | 'event';", 'lead task event command kind');
  assertHas(guard, 'export type AiDirectWriteLeadData', 'lead direct write data type');
  assertHas(guard, 'parseLeadDirectWriteCommand', 'lead parser function');
  assertHas(guard, 'LEAD_WORDS.test(normalized)', 'lead branch in parser');
  assertHas(guard, 'TASK_ACTION_WORDS', 'natural task action words');
  assertHas(guard, 'AI_DIRECT_WRITE_RESPECTS_MODE_STAGE28', 'Stage28 parser marker');

  assertHas(assistant, 'createLeadFromAiDraftApprovalInSupabase', 'safe lead creation alias');
  assertHas(assistant, 'insertTaskToSupabase', 'direct task creation');
  assertHas(assistant, 'insertEventToSupabase', 'direct event creation');
  assertHas(assistant, 'AI_DIRECT_WRITE_MODE_STATE', 'explicit direct write mode state');
  assertHas(assistant, 'direct_task_event', 'explicit direct write mode value');
});

test('Stage28 keeps unclear commands in draft fallback path', () => {
  const guard = read('src/lib/ai-direct-write-guard.ts');
  const assistant = read('src/components/TodayAiAssistant.tsx');

  assertHas(guard, 'if (!name && !phone && !email) return null;', 'unclear lead guard');
  assertHas(guard, 'if (!kind) return null;', 'unknown record kind guard');
  assertHas(guard, 'if (!date || !time) return null;', 'task and event require date and time');
  assertHas(assistant, 'saveAiLeadDraft', 'draft fallback function');
  assertHas(assistant, "source: 'today_assistant'", 'assistant draft source');
  assertHas(assistant, 'AI_DIRECT_WRITE_FALLBACK_TO_DRAFT', 'direct write fallback marker');
});

test('Stage28 test is included in quiet release gate', () => {
  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');
  assertHas(releaseGate, 'tests/ai-direct-write-respects-mode-stage28.test.cjs', 'quiet release gate entry');
});
