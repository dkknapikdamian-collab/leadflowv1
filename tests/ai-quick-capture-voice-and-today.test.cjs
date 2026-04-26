const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractQuickCaptureBlock(source) {
  const match = source.match(/<QuickAiCapture[\s\S]*?\/>/);
  return match ? match[0] : '';
}

test('Quick AI Capture supports browser voice input without exposing AI settings to the user', () => {
  const source = read('src/components/QuickAiCapture.tsx');

  assert.ok(source.includes('SpeechRecognition'), 'component should use browser SpeechRecognition when available');
  assert.ok(source.includes('webkitSpeechRecognition'), 'component should support Chromium webkitSpeechRecognition');
  assert.ok(source.includes('Dyktuj'), 'component should expose a simple voice button');
  assert.ok(source.includes('Zatrzymaj dyktowanie'), 'component should allow stopping voice capture');
  assert.ok(source.includes('Tekst źródłowy zostaje widoczny'), 'raw dictated text must remain visible before save');
  assert.ok(source.includes('Zapisz szkic'), 'raw note must be savable into AI drafts before conversion');
  assert.ok(source.includes('Zatwierdź jako lead'), 'lead conversion must remain an explicit confirmation action');
  assert.ok(!source.includes('GEMINI_API_KEY'), 'ordinary capture UI must not expose provider keys');
});

test('Quick AI Capture is available from Today and Leads intake surfaces', () => {
  const today = read('src/pages/Today.tsx');
  const leads = read('src/pages/Leads.tsx');
  const todayQuickCapture = extractQuickCaptureBlock(today);

  assert.ok(today.includes("../components/QuickAiCapture"), 'Today should import Quick AI Capture');
  assert.ok(todayQuickCapture.includes('QuickAiCapture'), 'Today should render Quick AI Capture');
  assert.ok(
    /onSaved=\{\(\) => void refreshSupabaseBundle\(\)\}/.test(todayQuickCapture)
      || /onSaved=\{refreshSupabaseBundle\}/.test(todayQuickCapture),
    'Today should refresh its daily bundle after capture save',
  );
  assert.ok(
    todayQuickCapture.includes('initialRawText={quickCaptureSeed}')
      || todayQuickCapture.includes('seedText={quickCaptureSeed}')
      || todayQuickCapture.includes('initialText={quickCaptureSeed}'),
    'Today should pass assistant capture text into Quick AI Capture',
  );
  assert.ok(
    todayQuickCapture.includes('openSignal={quickCaptureOpenSignal}')
      || todayQuickCapture.includes('autoOpenSignal={quickCaptureOpenSignal}'),
    'Today should open Quick AI Capture from assistant handoff signal',
  );
  assert.ok(leads.includes('<QuickAiCapture onSaved={() => void loadLeads()} />'), 'Leads should refresh lead list after capture save');
});

test('Quick AI Capture voice test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-quick-capture-voice-and-today.test.cjs'"));
});
