const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Quick AI Capture supports browser voice input without exposing AI settings to the user', () => {
  const source = read('src/components/QuickAiCapture.tsx');

  assert.ok(source.includes('SpeechRecognition'), 'component should use browser SpeechRecognition when available');
  assert.ok(source.includes('webkitSpeechRecognition'), 'component should support Chromium webkitSpeechRecognition');
  assert.ok(source.includes('Dyktuj'), 'component should expose a simple voice button');
  assert.ok(source.includes('Zatrzymaj dyktowanie'), 'component should allow stopping voice capture');
  assert.ok(source.includes('Tekst źródłowy zostaje widoczny'), 'raw dictated text must remain visible before save');
  assert.ok(source.includes('Zapisz po sprawdzeniu'), 'save must remain a confirmation action');
  assert.ok(!source.includes('GEMINI_API_KEY'), 'ordinary capture UI must not expose provider keys');
});

test('Quick AI Capture is available from Today and Leads intake surfaces', () => {
  const today = read('src/pages/Today.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.ok(today.includes("../components/QuickAiCapture"), 'Today should import Quick AI Capture');
  assert.ok(today.includes('<QuickAiCapture onSaved={() => void refreshSupabaseBundle()} />'), 'Today should refresh its daily bundle after capture save');
  assert.ok(leads.includes('<QuickAiCapture onSaved={() => void loadLeads()} />'), 'Leads should refresh lead list after capture save');
});

test('Quick AI Capture voice test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-quick-capture-voice-and-today.test.cjs'"));
});
