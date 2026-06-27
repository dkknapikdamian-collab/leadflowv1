const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

test('LF-UI-SOT-001 core CaseDetail alias is closed but full alias policy is not overclaimed', () => {
  const app = read('src/App.tsx');
  const routes = read('src/lib/routes.ts');
  const stageDoc = read('_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md');

  assert.match(routes, /path: CLOSEFLOW_ROUTES\.caseDetail, status: 'canonical'/);
  assert.match(routes, /path: CLOSEFLOW_ROUTES\.legacyCaseDetail, status: 'alias'/);
  assert.match(routes, /aliasFor: CLOSEFLOW_ROUTES\.caseDetail/);
  assert.match(app, /return <Navigate to=\{caseDetailPath\(caseId\)\} replace \/>;/);
  assert.match(app, /<Route path=\{CLOSEFLOW_ROUTES\.legacyCaseDetail\} element=\{isLoggedIn \? <LegacyCaseRedirect \/> : <Navigate to=\{loginPath\(\)\} \/>\} \/>/);
  assert.doesNotMatch(app, /path="\/case\/:caseId" element=\{isLoggedIn \? <CaseDetail \/>/);
  assert.match(stageDoc, /FULL_ALIAS_POLICY_PENDING/);
  assert.match(stageDoc, /Nie zamykac jako `ZAMKNIETE_FULL`/);
});

test('LF-UI-SOT-001 known alias exceptions are explicitly deferred to R2', () => {
  const app = read('src/App.tsx');
  const routes = read('src/lib/routes.ts');
  const runReport = read('_project/runs/LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE.md');

  assert.match(routes, /path: CLOSEFLOW_ROUTES\.today, status: 'alias', page: 'src\/pages\/TodayStable\.tsx'/);
  assert.match(routes, /path: CLOSEFLOW_ROUTES\.start, status: 'alias', page: 'src\/pages\/Login\.tsx'/);
  assert.match(routes, /path: CLOSEFLOW_ROUTES\.support, status: 'alias', page: 'src\/pages\/SupportCenter\.tsx'/);
  assert.match(app, /<Route path=\{CLOSEFLOW_ROUTES\.today\} element=\{isLoggedIn \? <Today \/> : <Navigate to=\{loginPath\(\)\} \/>\} \/>/);
  assert.match(app, /<Route path=\{CLOSEFLOW_ROUTES\.support\} element=\{isLoggedIn \? <SupportCenter \/> : <Navigate to=\{loginPath\(\)\} \/>\} \/>/);
  assert.match(runReport, /LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT/);
});

test('LF-UI-SOT-001 closeout guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
