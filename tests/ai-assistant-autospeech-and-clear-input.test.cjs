const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function assertIncludes(source, needle, message) {
  assert.ok(source.includes(needle), message + ': missing ' + needle);
}

test('Today assistant explains save versus search rule and clears input after answer', () => {
  const source = read('src/components/TodayAiAssistant.tsx');

  assertIncludes(source, 'Jeżeli chcesz, żeby notatka albo kontakt trafiły do Szkiców AI', 'clear instruction copy');
  assertIncludes(source, 'Bez zapisz = szukanie', 'search mode badge');
  assertIncludes(source, 'AI_ASSISTANT_CLEAR_INPUT_AFTER_RESULT', 'clear input marker');
  assertIncludes(source, "setRawText('');", 'input clear after answer');
});

test('Today assistant and quick capture auto-start speech after opening', () => {
  const today = read('src/components/TodayAiAssistant.tsx');
  const quick = read('src/components/QuickAiCapture.tsx');

  assertIncludes(today, 'autoSpeechStartedRef', 'Today auto speech guard');
  assertIncludes(today, 'window.setTimeout', 'Today delayed auto speech');
  assertIncludes(today, 'handleToggleSpeech();', 'Today starts dictation');
  assertIncludes(quick, 'QUICK_AI_CAPTURE_AUTO_START_SPEECH', 'Quick Capture auto speech marker');
  assertIncludes(quick, 'autoSpeechStartedRef', 'Quick Capture auto speech guard');
});

test('autospeech test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assertIncludes(gate, 'tests/ai-assistant-autospeech-and-clear-input.test.cjs', 'quiet release gate must run autospeech test');
});

