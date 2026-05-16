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
  assert.ok(source.includes('Notatka \u017Ar\u00F3d\u0142owa'), 'raw dictated text field should remain visible before save');
  assert.ok(source.includes('Tekst \u017Ar\u00F3d\u0142owy zostaje widoczny'), 'raw dictated text must remain visible before final lead save');
  assert.ok(source.includes('Zapisz szkic'), 'raw note must be savable into AI drafts before conversion');
  assert.ok(source.includes('Zatwierd\u017A jako lead'), 'lead conversion must remain an explicit confirmation action');
  assert.ok(!source.includes('GEMINI_API_KEY'), 'ordinary capture UI must not expose provider keys');
});

test('Quick AI Capture is available from Today and Leads through the global quick actions toolbar', () => {
  const layout = read('src/components/Layout.tsx');
  const globalQuickActions = read('src/components/GlobalQuickActions.tsx');
  const today = read('src/pages/Today.tsx');
  const leads = read('src/pages/Leads.tsx');

  assert.ok(layout.includes('GlobalQuickActions'), 'Layout should render the shared global quick actions toolbar');
  assert.ok(globalQuickActions.includes("import QuickAiCapture from './QuickAiCapture'"), 'Global toolbar should import Quick AI Capture');
  assert.ok(globalQuickActions.includes('<QuickAiCapture />'), 'Global toolbar should render Quick AI Capture exactly once');
  assert.ok(globalQuickActions.includes('data-global-quick-actions-contract="v97"'), 'Global toolbar should expose the stable toolbar contract');
  assert.ok(globalQuickActions.includes('Szybki szkic'), 'Global toolbar should keep the quick capture action visible');

  assert.ok(today.includes('TODAY_GLOBAL_QUICK_ACTIONS_DEDUPED_V97'), 'Today should document that global quick actions are deduped');
  assert.ok(today.includes('import Layout'), 'Today should use Layout, which owns the global toolbar');
  assert.ok(!today.includes("../components/QuickAiCapture"), 'Today should not import Quick AI Capture directly');
  assert.ok(!today.includes('<QuickAiCapture'), 'Today should not render a duplicate Quick AI Capture widget');

  assert.ok(leads.includes('import Layout'), 'Leads should use Layout, which owns the global toolbar');
  assert.ok(!leads.includes("../components/QuickAiCapture"), 'Leads should not import Quick AI Capture directly');
  assert.ok(!leads.includes('<QuickAiCapture'), 'Leads should not render a duplicate Quick AI Capture widget');
});

test('Quick AI Capture voice test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-quick-capture-voice-and-today.test.cjs'"));
});
