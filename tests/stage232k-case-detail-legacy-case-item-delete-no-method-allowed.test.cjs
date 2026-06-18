const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('STAGE232K legacy case_items trash uses PATCH/update, not DELETE', () => {
  assert.match(caseDetail, /STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED/);
  assert.match(caseDetail, /updateCaseItemInSupabase\(\{/);
  assert.match(caseDetail, /status: 'rejected'/);
  assert.match(caseDetail, /stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method'/);
  assert.doesNotMatch(caseDetail, /await\s+deleteCaseItemFromSupabase\(item\.id\);/);
});

test('STAGE232K keeps CaseDetail work row trash and legacy label', () => {
  assert.match(caseDetail, /data-stage220a8-delete-work-item="true"/);
  assert.match(caseDetail, /legacy case_items\/checklist/);
});
