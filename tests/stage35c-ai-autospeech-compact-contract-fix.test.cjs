const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stage35c repairs autospeech test contract after compact assistant UI', () => {
  const autospeechTest = read('tests/ai-assistant-autospeech-and-clear-input.test.cjs');
  const assistant = read('src/components/TodayAiAssistant.tsx');
  const removedLongHint = 'Jeżeli chcesz, żeby notatka albo kontakt trafiły do Szkiców AI';

  assert.ok(autospeechTest.includes('compact save/search guidance'));
  assert.ok(autospeechTest.includes('STAGE35_AI_ASSISTANT_COMPACT_UI'));
  assert.ok(assistant.includes('Dodaj leada: Pan Marek, 516 439 989, Facebook'));
  assert.equal(assistant.includes(removedLongHint), false);
  assert.equal(assistant.includes('SAVE_SEARCH_HINT'), false);
});

test('Stage35c test is included in release gates', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.ok(quietGate.includes('tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs'));
  assert.ok(fullGate.includes('tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs'));
});
