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

test('AiDrafts delegates manually confirmed final-record creation to the server SOT', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.match(page, /AI_DRAFT_CONFIRM_RECORDS_STAGE25_PAGE/);
  assert.match(page, /Przejrzyj i zatwierd\u017A/);
  assert.match(page, /confirmAiDraftInSupabase/);
  assert.match(page, /data-ai-draft-real-record-create="true"/);
  assert.doesNotMatch(page, /createLeadFromAiDraftApprovalInSupabase|insertTaskToSupabase|insertEventToSupabase|insertActivityToSupabase/);
});

test('AI draft approval keeps manual confirmation rule', () => {
  const page = read('src/pages/AiDrafts.tsx');

  assert.match(page, /ZatwierdĹş i zapisz|Zatwierdź i zapisz/);
  assert.match(page, /approvalSaving/);
  assert.match(page, /handleApproveDraftToRecord/);
  assert.doesNotMatch(page, /useEffect\([^)]*handleApproveDraftToRecord/s);
});
