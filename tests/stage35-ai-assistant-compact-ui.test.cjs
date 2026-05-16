const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function assertIncludes(source, needle, label) {
  assert.ok(source.includes(needle), label + ': missing ' + needle);
}

function assertNotIncludes(source, needle, label) {
  assert.ok(!source.includes(needle), label + ': forbidden ' + needle);
}

test('Stage35 keeps AI assistant panel compact and useful', () => {
  const source = read('src/components/TodayAiAssistant.tsx');

  assertIncludes(source, 'STAGE35_AI_ASSISTANT_COMPACT_UI', 'stage marker');
  assertIncludes(source, 'data-stage35-ai-assistant-compact-ui', 'compact container');
  assertIncludes(source, 'data-stage35-ai-mode-switch', 'compact mode switch');
  assertIncludes(source, 'data-stage35-ai-assistant-actions', 'compact action row');
  assertIncludes(source, 'Dodaj leada: Pan Marek, 516 439 989, Facebook', 'new lead example');
  assertIncludes(source, 'Co mam dzi\u015B do zrobienia?', 'today example');
  assertIncludes(source, 'Zapisz zadanie jutro o 10 oddzwoni\u0107 do klienta', 'task example');
  assertIncludes(source, 'Zapytaj asystenta', 'ask button');
  assertIncludes(source, 'Dyktuj', 'dictation button');
  assertIncludes(source, 'Max {AI_COMMAND_MAX_LENGTH} znak\u00F3w', 'short limit hint');
});

test('Stage35 removes noisy assistant helper copy and old examples', () => {
  const source = read('src/components/TodayAiAssistant.tsx');

  assertNotIncludes(source, 'Dorota Ko\u0142odziej', 'old person example');
  assertNotIncludes(source, 'Mam leada Warszawa', 'old vague lead example');
  assertNotIncludes(source, 'SAVE_SEARCH_HINT', 'long save/search helper constant');
  assertNotIncludes(source, 'Leady, kontakty i niejasne notatki nadal trafiaj\u0105 do Szkic\u00F3w AI', 'long safety helper');
  assertNotIncludes(source, 'Je\u017Celi chcesz, \u017Ceby notatka albo kontakt trafi\u0142y do Szkic\u00F3w AI', 'long save helper');
  assertNotIncludes(source, 'Bez autopilota', 'diagnostic badge');
  assertNotIncludes(source, 'Tylko CloseFlow', 'diagnostic badge');
  assertNotIncludes(source, 'Parser: {answer.provider}', 'technical answer badge');
});

test('Stage35 keeps direct-write logic intact', () => {
  const source = read('src/components/TodayAiAssistant.tsx');

  assertIncludes(source, 'parseAiDirectWriteCommand(command)', 'direct write parser');
  assertIncludes(source, "directWriteMode === 'direct_task_event'", 'direct write mode gate');
  assertIncludes(source, 'createLeadFromAiDraftApprovalInSupabase', 'lead direct write safe alias');
  assertIncludes(source, 'insertTaskToSupabase', 'task direct write');
  assertIncludes(source, 'insertEventToSupabase', 'event direct write');
  assertIncludes(source, "saveAiLeadDraft({ rawText: command, source: 'today_assistant' })", 'draft fallback');
});

test('Stage35 compact AI assistant test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assertIncludes(gate, 'tests/stage35-ai-assistant-compact-ui.test.cjs', 'quiet gate test');
});
