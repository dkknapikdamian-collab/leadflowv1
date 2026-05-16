const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('Stage03 AI draft approval helper exists', () => {
  const helper = read('src/lib/ai-draft-approval.ts');

  assert.match(helper, /AI_DRAFT_APPROVAL_TO_FINAL_RECORD_STAGE03/);
  assert.match(helper, /AiDraftApprovalType/);
  assert.match(helper, /lead/);
  assert.match(helper, /task/);
  assert.match(helper, /event/);
  assert.match(helper, /note/);
});

test('AiDrafts can approve drafts into final records manually through safe helper aliases', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.match(page, /AI_DRAFT_APPROVAL_TO_FINAL_RECORD_STAGE03/);
  assert.match(page, /Przejrzyj i zatwierd\u017A/);
  assert.match(page, /Zatwierd\u017A szkic jako finalny rekord/);
  assert.match(page, /createLeadFromAiDraftApprovalInSupabase/);
  assert.match(page, /insertTaskToSupabase/);
  assert.match(page, /insertEventToSupabase/);
  assert.match(page, /insertActivityToSupabase/);
  assert.match(page, /markAiLeadDraftConvertedAsync/);
  assert.doesNotMatch(page, /insertLeadToSupabase/);
});

test('AI draft approval keeps manual confirmation rule', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.match(page, /Utw\u00F3rz rekord/);
  assert.match(page, /approvalSaving/);
  assert.match(page, /handleApproveDraftToRecord/);
  assert.doesNotMatch(page, /useEffect\([^)]*handleApproveDraftToRecord/s);
});
