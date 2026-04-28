const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('Stage04 shows AI drafts in Today', () => {
  const source = read('src/pages/Today.tsx');

  assert.match(source, /AI_DRAFTS_IN_TODAY_STAGE04/);
  assert.match(source, /getAiLeadDraftsAsync/);
  assert.match(source, /Szkice AI/);
  assert.match(source, /ai-drafts/);
});

test('Stage04 keeps AI drafts review-only from Today', () => {
  const source = read('src/pages/Today.tsx');

  assert.doesNotMatch(source, /createLeadFromAiDraftApprovalInSupabase/);
  assert.doesNotMatch(source, /markAiLeadDraftConverted/);
  assert.doesNotMatch(source, /ai_draft_converted/);
  assert.match(source, /Przejrzyj/);
});

test('Stage04 allows existing Today quick lead creation outside AI draft review', () => {
  const source = read('src/pages/Today.tsx');

  // Today may still contain existing quick lead creation. Stage04 only forbids final writes from the AI draft review block.
  assert.match(source, /insertLeadToSupabase/);
});
