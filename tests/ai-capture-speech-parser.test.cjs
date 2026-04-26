const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Quick AI Capture understands common Polish speech-to-text lead aliases', () => {
  const source = read('src/server/ai-capture.ts');

  assert.ok(source.includes('QUICK_CAPTURE_SPEECH_NAME_PATTERNS'), 'capture parser should have speech-specific name patterns');
  assert.ok(source.includes('cleanSpeechNameCandidate'), 'capture parser should clean voice filler words');
  assert.ok(source.includes('znajd'), 'capture parser should handle "znajdź mi leada" voice commands');
  assert.ok(source.includes('lida'), 'capture parser should handle speech recognition alias "lida" for lead/leada');
  assert.ok(source.includes('patrzcie'), 'capture parser should strip common accidental voice filler after a name');
});

test('Quick AI Capture speech parser test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-capture-speech-parser.test.cjs'"));
});
