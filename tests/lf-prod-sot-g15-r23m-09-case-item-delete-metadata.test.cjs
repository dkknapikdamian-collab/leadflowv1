const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/CaseDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-09-case-item-delete-metadata.cjs';
const baseSha = '94a00369';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-09 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-09/);
});

test('A2-09 removes only unsupported case-item payload blocks', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  const unsupportedBlock = `        payload: {\n          stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method',\n          deletedAt: new Date().toISOString(),\n          source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED',\n        },\n`;
  const baseActivity = "await recordActivity('item_deleted', { itemId: item.id, title: item.title, legacyCaseItems: true, source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED' });";
  const auditedActivity = "await recordActivity('item_deleted', { itemId: item.id, title: item.title, legacyCaseItems: true, stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method', source: 'STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED' });";
  assert.equal(current, base.replaceAll(unsupportedBlock, '').replaceAll(baseActivity, auditedActivity));
});

test('A2-09 preserves audit marker and canonical item update path', () => {
  const current = read(sourcePath);
  const marker = /stage232kDeleteMode: 'legacy_case_item_reject_no_delete_method'/g;
  assert.ok((current.match(marker) || []).length >= 2);
  assert.match(current, /recordActivity\('item_deleted'/);
  assert.match(current, /updateCaseItemInSupabase\(\{/);
  const legacyUpdateCalls = [...current.matchAll(/updateCaseItemInSupabase\(\{([\s\S]*?)\}\);/g)]
    .map((match) => match[1])
    .filter((body) => body.includes("status: 'rejected'"));
  assert.equal(legacyUpdateCalls.length, 2);
  for (const body of legacyUpdateCalls) assert.doesNotMatch(body, /payload:/);
});
