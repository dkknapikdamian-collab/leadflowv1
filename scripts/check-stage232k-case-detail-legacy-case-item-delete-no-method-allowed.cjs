const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED';
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

assert.ok(caseDetail.includes(stage), 'STAGE232K marker missing');
assert.ok(caseDetail.includes("stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method'"), 'stage232k payload marker missing');
assert.ok(caseDetail.includes("status: 'rejected'"), 'legacy delete must reject item through update path');
assert.ok(caseDetail.includes('updateCaseItemInSupabase({'), 'legacy delete must use updateCaseItemInSupabase');
assert.ok(!/await\s+deleteCaseItemFromSupabase\(item\.id\);/.test(caseDetail), 'legacy active trash must not call DELETE /api/case-items');
assert.ok(caseDetail.includes('legacy case_items/checklist'), 'legacy case_items/checklist label missing');
assert.ok(caseDetail.includes('data-stage220a8-delete-work-item="true"'), 'row trash marker missing');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232k-case-detail-legacy-case-item-delete-no-method-allowed' }, null, 2));
