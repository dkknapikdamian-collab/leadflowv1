const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const clientDetail = fs.readFileSync(path.join(repoRoot, 'src/pages/ClientDetail.tsx'), 'utf8');
const clientOpTest = fs.readFileSync(path.join(repoRoot, 'tests/client-detail-v1-operational-center.test.cjs'), 'utf8');
const closeGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs'), 'utf8');
const cfGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');

test('ClientDetail relation filtering uses normalized task relation sources', () => {
  assert.match(clientDetail, /const leadSourceIdStage232I4R14/);
  assert.match(clientDetail, /relationIds\.leadIds\.has\(leadSourceIdStage232I4R14\)/);
  assert.match(clientDetail, /const caseSourceIdStage232I4R14/);
  assert.match(clientDetail, /relationIds\.caseIds\.has\(caseSourceIdStage232I4R14\)/);
});

test('ClientDetail operational center test is compatible with current relation filter', () => {
  assert.match(clientOpTest, /leadSourceIdStage232I4R14/);
  assert.match(clientOpTest, /caseSourceIdStage232I4R14/);
  assert.doesNotMatch(clientOpTest, /relationIds\.leadIds\.has\(String\(task\.leadId/);
});

test('ClientDetail event and activity relation guards stay covered', () => {
  assert.match(clientOpTest, /relationIds\.leadIds\.has\(String\(event\.leadId \|\| ''\)\)/);
  assert.match(clientOpTest, /relationIds\.caseIds\.has\(String\(event\.caseId \|\| ''\)\)/);
  assert.match(clientOpTest, /relationIds\.leadIds\.has\(String\(activity\.leadId \|\| ''\)\)/);
  assert.match(clientOpTest, /relationIds\.caseIds\.has\(String\(activity\.caseId \|\| ''\)\)/);
});

test('R16Z_R5 and CF runtime scopes allow this compatibility repair', () => {
  assert.match(closeGuard, /STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST/);
  assert.match(closeGuard, /tests\/client-detail-v1-operational-center\.test\.cjs/);
  assert.match(cfGuard, /tests\/client-detail-v1-operational-center\.test\.cjs/);
});