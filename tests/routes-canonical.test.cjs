const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

test('route source-of-truth exposes canonical helpers and route statuses', () => {
  const routes = read('src/lib/routes.ts');

  for (const helper of [
    'todayPath',
    'leadsPath',
    'leadDetailPath',
    'clientsPath',
    'clientDetailPath',
    'casesPath',
    'caseDetailPath',
    'calendarPath',
    'funnelPath',
  ]) {
    assert.match(routes, new RegExp(`export function ${helper}\\(`));
  }

  assert.match(routes, /screen: 'Case Detail'[\s\S]*path: CLOSEFLOW_ROUTES\.caseDetail[\s\S]*status: 'canonical'/);
  assert.match(routes, /screen: 'Case Detail'[\s\S]*path: CLOSEFLOW_ROUTES\.legacyCaseDetail[\s\S]*status: 'alias'/);
  assert.match(routes, /screen: 'Dashboard'[\s\S]*status: 'legacy'/);
});

test('CaseDetail alias redirects and canonical route renders the page', () => {
  const app = read('src/App.tsx');

  assert.match(app, /<Route path=\{CLOSEFLOW_ROUTES\.caseDetail\} element=\{isLoggedIn \? <CaseDetail \/> : <Navigate to=\{loginPath\(\)\} \/>/);
  assert.match(app, /<Route path=\{CLOSEFLOW_ROUTES\.legacyCaseDetail\} element=\{isLoggedIn \? <LegacyCaseRedirect \/> : <Navigate to=\{loginPath\(\)\} \/>/);
  assert.match(app, /<Navigate to=\{caseDetailPath\(caseId\)\} replace \/>/);
  assert.doesNotMatch(app, /path="\/case\/:caseId" element=\{isLoggedIn \? <CaseDetail \/>/);
});

test('active lead handoff uses canonical case detail helper', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');

  assert.match(leadDetail, /import \{ caseDetailPath, leadsPath \} from '\.\.\/lib\/routes';/);
  assert.match(leadDetail, /navigate\(caseDetailPath\(startServiceSuccess\.caseId\)\);/);
  assert.doesNotMatch(leadDetail, /navigate\(`\/case\/\$\{startServiceSuccess\.caseId\}`\);/);
});

test('guard:routes:canonical passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-routes-canonical.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
