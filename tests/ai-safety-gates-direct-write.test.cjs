const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8'); }

test('AI safety gates allow direct task and event writes only behind explicit mode', () => {
  const today = read('src/components/TodayAiAssistant.tsx');
  const guard = read('src/lib/ai-direct-write-guard.ts');
  assert.match(today, /Bramki bezpieczeństwa AI/);
  assert.match(today, /Wszystko przez Szkice AI/);
  assert.match(today, /Zadania i wydarzenia od razu/);
  assert.match(today, /insertTaskToSupabase/);
  assert.match(today, /insertEventToSupabase/);
  assert.match(today, /AI_DIRECT_WRITE_FALLBACK_TO_DRAFT/);
  assert.match(guard, /AI_DIRECT_TASK_EVENT_GATE/);
  assert.match(guard, /return null;/);
});

test('AI safety gate test is included in quiet release gate', () => {
  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(releaseGate, /ai-safety-gates-direct-write\.test\.cjs/);
});
