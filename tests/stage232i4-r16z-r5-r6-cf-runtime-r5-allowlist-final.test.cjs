const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const closeGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs'), 'utf8');
const cfGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');
const clientOpTest = fs.readFileSync(path.join(repoRoot, 'tests/client-detail-v1-operational-center.test.cjs'), 'utf8');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));

test('R16Z_R5_R6 close guard and CF runtime both allow R5_R5 repair files', () => {
  assert.match(closeGuard, /STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST/);
  assert.match(closeGuard, /tests\/client-detail-v1-operational-center\.test\.cjs/);
  assert.match(cfGuard, /tests\/client-detail-v1-operational-center\.test\.cjs/);
});

test('R16Z_R5_R6 close guard and CF runtime both allow R6 files', () => {
  assert.match(closeGuard, /STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST/);
  assert.match(closeGuard, /scripts\/check-stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final\.cjs/);
  assert.match(cfGuard, /tests\/stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final\.test\.cjs/);
});

test('R16Z_R5_R6 preserves client operational test compatibility and manager encoding', () => {
  assert.match(clientOpTest, /leadSourceIdStage232I4R14/);
  assert.match(clientOpTest, /caseSourceIdStage232I4R14/);
  assert.doesNotMatch(clientOpTest, /relationIds\.leadIds\.has\(String\(task\.leadId/);
  assert.notEqual(managerBuffer[0], 0xef);
  assert.notEqual(managerBuffer[1], 0xbb);
  assert.notEqual(managerBuffer[2], 0xbf);
});