const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today assistant can hand a lead-capture command to Quick AI Capture without auto-saving', () => {
  const today = read('src/pages/Today.tsx');
  const assistant = read('src/components/TodayAiAssistant.tsx');
  const capture = read('src/components/QuickAiCapture.tsx');

  assert.ok(today.includes('quickCaptureSeed'), 'Today should store the assistant capture text');
  assert.ok(today.includes('quickCaptureOpenSignal'), 'Today should trigger QuickAiCapture opening');
  assert.ok(today.includes('openQuickCaptureFromAssistant'), 'Today should expose a handoff callback');
  assert.ok(today.includes('initialText={quickCaptureSeed}'), 'QuickAiCapture should receive the assistant text');
  assert.ok(today.includes('onCaptureRequest={openQuickCaptureFromAssistant}'), 'TodayAiAssistant should call the handoff callback');

  assert.ok(assistant.includes('data-ai-assistant-open-capture="true"'), 'assistant should show a clear handoff button');
  assert.ok(assistant.includes('Otwórz w Szybkim szkicu'), 'assistant should use clear Polish copy');
  assert.ok(assistant.includes('handleTransferCapture'), 'assistant should explicitly transfer lead capture text');
  assert.ok(!assistant.includes('insertLeadToSupabase'), 'assistant must not save leads directly');
  assert.ok(!assistant.includes('insertTaskToSupabase'), 'assistant must not save tasks directly');

  assert.ok(capture.includes('initialText?: string'), 'QuickAiCapture should accept seeded text');
  assert.ok(capture.includes('openSignal?: number'), 'QuickAiCapture should accept an open trigger');
  assert.ok(capture.includes('setOpen(true);'), 'QuickAiCapture should open only when explicitly triggered');
});

test('AI assistant capture handoff test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/ai-assistant-capture-handoff.test.cjs'"));
});
