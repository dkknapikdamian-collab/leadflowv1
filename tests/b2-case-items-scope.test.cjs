const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('node:fs').readFileSync('api/case-items.ts', 'utf8');
const storageUpload = require('node:fs').readFileSync('api/storage-upload.ts', 'utf8');
const portalUpload = require('node:fs').readFileSync('src/server/portal-upload.ts', 'utf8');
const records = require('node:fs').readFileSync('src/server/records.ts', 'utf8');
const scope = require('node:fs').readFileSync('src/server/case-item-scope.ts', 'utf8');

test('B2 direct case-items API uses the canonical case parent scope and supports scoped delete', () => {
  assert.match(api, /requireOperatorCaseAccess\(req, caseId\)/);
  assert.match(api, /req\.method === 'DELETE'/);
  assert.match(scope, /case_items\?select=\*&id=eq\./);
  assert.match(api, /requireScopedRow\('cases'/);
  assert.match(storageUpload, /uploadPortalFileWithPolicy/);
  assert.match(portalUpload, /requireCaseItemInCase\(normalizedItemId, normalizedCaseId\)/);
  assert.match(storageUpload, /message === 'CASE_ITEM_NOT_FOUND'/);
});

test('B2 compatibility records route validates case scope for every mutation', () => {
  assert.match(records, /requireScopedRow\('cases', String\(body\.caseId\), workspaceId/);
  assert.match(records, /requireScopedRow\('cases', currentCaseId, workspaceId/);
  assert.match(records, /deleteCaseItemInCase\(id, currentCaseId\)/);
});
