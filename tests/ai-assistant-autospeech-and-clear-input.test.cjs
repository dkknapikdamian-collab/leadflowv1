const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readIfExists(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function assertIncludes(source, needle, label) {
  assert.ok(source.includes(needle), label + ': missing ' + needle);
}

function assertNotIncludes(source, needle, label) {
  assert.ok(!source.includes(needle), label + ': forbidden ' + needle);
}

test('Today assistant uses compact save/search guidance and clears input after answer', () => {
  const source = read('src/components/TodayAiAssistant.tsx');
  const oldLongSaveHint = 'Je\u017Celi chcesz, \u017Ceby notatka albo kontakt trafi\u0142y do Szkic\u00F3w AI';
  const oldLongDraftHint = 'Leady, kontakty i niejasne notatki nadal trafiaj\u0105 do Szkic\u00F3w AI';

  assertIncludes(source, 'STAGE35_AI_ASSISTANT_COMPACT_UI', 'compact assistant marker');
  assertIncludes(source, 'data-stage35-ai-assistant-compact-ui', 'compact assistant wrapper');
  assertIncludes(source, 'Dodaj leada: Pan Marek, 516 439 989, Facebook', 'clear lead example');
  assertIncludes(source, 'Co mam dzi\u015B do zrobienia?', 'today plan example');
  assertIncludes(source, 'Zapisz zadanie jutro o 10 oddzwoni\u0107 do klienta', 'task example');
  assertIncludes(source, 'Max {AI_COMMAND_MAX_LENGTH} znak\u00F3w', 'short input limit copy');
  assertIncludes(source, 'Zapytaj asystenta', 'ask button');
  assertIncludes(source, 'Dyktuj', 'dictation button');
  assert.match(source, /setRawText\(['"]['"]\)/, 'assistant clears input after answer');

  assertNotIncludes(source, oldLongSaveHint, 'removed long save/search helper');
  assertNotIncludes(source, oldLongDraftHint, 'removed long draft helper');
  assertNotIncludes(source, 'SAVE_SEARCH_HINT', 'removed helper constant');
});

test('Today assistant and quick capture keep speech start support after opening', () => {
  const assistant = read('src/components/TodayAiAssistant.tsx');
  const quickCaptureSource = [
    'src/components/GlobalQuickActions.tsx',
    'src/components/QuickLeadCapture.tsx',
    'src/components/AiQuickCapture.tsx',
    'src/pages/Today.tsx',
  ].map(readIfExists).join('\n');

  assertIncludes(assistant, 'autoSpeechStartedRef', 'assistant auto speech guard');
  assertIncludes(assistant, 'pendingAutoAskTimerRef', 'assistant delayed auto ask guard');
  assertIncludes(assistant, 'getSpeechRecognitionConstructor', 'assistant speech recognition support');
  assert.ok(
    quickCaptureSource.includes('SpeechRecognition') ||
      quickCaptureSource.includes('speechSupported') ||
      quickCaptureSource.includes('autoSpeech') ||
      quickCaptureSource.includes('autoStart') ||
      assistant.includes('speechSupported'),
    'quick capture or assistant must keep speech support markers',
  );
});

test('autospeech test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assertIncludes(gate, 'tests/ai-assistant-autospeech-and-clear-input.test.cjs', 'quiet gate test');
});
