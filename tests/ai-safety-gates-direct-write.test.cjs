const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8'); }

test('AI safety gates allow direct clear records only behind explicit mode', () => {
  const today = read('src/components/TodayAiAssistant.tsx');
  const guard = read('src/lib/ai-direct-write-guard.ts');
  assert.match(today, /Bramki bezpiecze\u0144stwa AI/);
  assert.match(today, /Wszystko przez Szkice AI/);
  assert.match(today, /Jasne rekordy od razu/);
  assert.match(today, /insertTaskToSupabase/);
  assert.match(today, /insertEventToSupabase/);
  assert.match(today, /createLeadFromAiDraftApprovalInSupabase/);
  assert.doesNotMatch(today, /insertLeadToSupabase/);
  assert.match(today, /AI_DIRECT_WRITE_FALLBACK_TO_DRAFT/);
  assert.match(guard, /AI_DIRECT_TASK_EVENT_GATE/);
  assert.match(guard, /AI_DIRECT_WRITE_RESPECTS_MODE_STAGE28/);
  assert.match(guard, /AiDirectWriteKind = 'lead' \| 'task' \| 'event'/);
  assert.match(guard, /parseLeadDirectWriteCommand/);
});

test('AI safety gate test is included in quiet release gate', () => {
  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(releaseGate, /ai-safety-gates-direct-write\.test\.cjs/);
});
