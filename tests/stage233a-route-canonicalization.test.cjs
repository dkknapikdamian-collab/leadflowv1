const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const app = fs.readFileSync('src/App.tsx', 'utf8');
const cases = fs.readFileSync('src/pages/Cases.tsx', 'utf8');
const routes = fs.readFileSync('src/lib/routes.ts', 'utf8');
const runtimeTruth = fs.readFileSync('src/lib/closeflow-runtime-source-truth.ts', 'utf8');

test('STAGE233A keeps CaseDetail canonical route under /cases/:caseId', () => {
  assert.match(app, /<Route path="\/cases\/:caseId" element=\{isLoggedIn \? <CaseDetail \/> : <Navigate to="\/login" \/>\} \/>/);
  assert.match(routes, /export function caseDetailPath\(caseId: string\)/);
  assert.match(routes, /`\/cases\/\$\{encodeURIComponent/);
  assert.match(runtimeTruth, /CASE_DETAIL_CANONICAL_ROUTE_PREFIX = '\/cases'/);
});

test('STAGE233A leaves /case/:caseId only as replace redirect', () => {
  assert.match(app, /function LegacyCaseRedirect\(\)/);
  assert.match(app, /<Navigate to=\{caseDetailPath\(caseId\)\} replace \/>/);
  assert.match(app, /<Route path="\/case\/:caseId" element=\{isLoggedIn \? <LegacyCaseRedirect \/> : <Navigate to="\/login" \/>\} \/>/);
  assert.doesNotMatch(app, /<Route path="\/case\/:caseId" element=\{isLoggedIn \? <CaseDetail \/>/);
  assert.match(runtimeTruth, /CASE_DETAIL_LEGACY_ROUTE_PREFIX = '\/case'/);
});

test('STAGE233A stops Cases.tsx from producing legacy /case links', () => {
  assert.match(cases, /import \{ caseDetailPath \} from '\.\.\/lib\/routes';/);
  assert.doesNotMatch(cases, /`\/case\/\$\{record\.id\}`/);
  assert.ok((cases.match(/caseDetailPath\(record\.id\)/g) || []).length >= 3);
});

test('STAGE233A guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage233a-route-canonicalization.cjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
