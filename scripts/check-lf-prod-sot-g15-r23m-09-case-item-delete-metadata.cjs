const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '94a00369';
const sourcePath = 'src/pages/CaseDetail.tsx';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));

const unsupportedBlock = `        payload: {
          stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method',
          deletedAt: new Date().toISOString(),
          source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED',
        },
`;
const supportedActivityMarker = "stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method'";
const baseActivity = "await recordActivity('item_deleted', { itemId: item.id, title: item.title, legacyCaseItems: true, source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED' });";
const auditedActivity = "await recordActivity('item_deleted', { itemId: item.id, title: item.title, legacyCaseItems: true, stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method', source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED' });";

assert((base.match(new RegExp(unsupportedBlock.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length === 2, 'base must contain both unsupported case-item payload blocks');
assert(!current.includes(unsupportedBlock), 'current source must remove unsupported case-item payload blocks');
const expected = base.replaceAll(unsupportedBlock, '').replaceAll(baseActivity, auditedActivity);
assert(current === expected, 'current source must equal base with only unsupported item payloads moved to activity audit metadata');
assert((current.match(new RegExp(supportedActivityMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length >= 2, 'activity audit payload must retain both delete-mode markers');
assert(current.includes("recordActivity('item_deleted'"), 'legacy item delete must keep the activity audit event');
assert(current.includes('updateCaseItemInSupabase({'), 'legacy item delete must keep the item PATCH path');

console.log('PASS: A2-09 keeps case-item PATCH canonical and moves delete metadata to the activity audit contract.');
