const test = require('node:test');
const assert = require('assert');
const fs = require('fs');

function read(rel) {
  return fs.readFileSync(rel, 'utf8');
}

const FORBIDDEN_WRITE_PATTERNS = [
  /insertLeadToSupabase/,
  /insertTaskToSupabase/,
  /insertEventToSupabase/,
  /createLeadFromAiDraftApprovalInSupabase/,
  /insertWithVariants\(\['leads'\]/,
  /insertWithVariants\(\['work_items'\]/,
];

test('assistant query handler does not autowrite final records', () => {
  const src = read('src/server/assistant-query-handler.ts');
  for (const pattern of FORBIDDEN_WRITE_PATTERNS) {
    assert.doesNotMatch(src, pattern);
  }
  assert.match(src, /runAssistantQuery/);
});

test('ai assistant returns draft mode for write intent and no-autowrite copy', () => {
  const src = read('src/server/ai-assistant.ts');
  assert.match(src, /mode:\s*"draft"|"draft"/);
  assert.match(src, /zapisane finalnie/);
});
