#!/usr/bin/env node
const fs = require('node:fs');
const assert = require('node:assert/strict');

const stage = 'STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE';

const app = fs.readFileSync('src/App.tsx', 'utf8');
const cases = fs.readFileSync('src/pages/Cases.tsx', 'utf8');
const routes = fs.readFileSync('src/lib/routes.ts', 'utf8');
const runtimeTruth = fs.readFileSync('src/lib/closeflow-runtime-source-truth.ts', 'utf8');
const cfRuntimeGuard = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), `${label} missing: ${token}`);
}

function mustNot(source, token, label) {
  assert.equal(source.includes(token), false, `${label} still present: ${token}`);
}

must(routes, 'export function caseDetailPath', 'case detail route helper');
must(routes, 'return `/cases/${encodeURIComponent', 'case detail route helper canonical /cases');

must(app, 'function LegacyCaseRedirect()', 'legacy case redirect component');
must(app, 'useParams', 'legacy case redirect params');
must(app, 'return <Navigate to={caseDetailPath(caseId)} replace />;', 'legacy case redirect replace behavior');
must(app, '<Route path="/cases/:caseId" element={isLoggedIn ? <CaseDetail /> : <Navigate to="/login" />} />', 'canonical CaseDetail route');
must(app, '<Route path="/case/:caseId" element={isLoggedIn ? <LegacyCaseRedirect /> : <Navigate to="/login" />} />', 'legacy case route redirect');
mustNot(app, '<Route path="/case/:caseId" element={isLoggedIn ? <CaseDetail />', 'legacy route direct CaseDetail render');

must(cases, "import { caseDetailPath } from '../lib/routes';", 'Cases route helper import');
mustNot(cases, '`/case/${record.id}`', 'Cases legacy case link');
assert.equal((cases.match(/caseDetailPath\(record\.id\)/g) || []).length >= 3, true, 'Cases must use caseDetailPath for title, open icon, and risk rail links');

must(runtimeTruth, "CASE_DETAIL_CANONICAL_ROUTE_PREFIX = '/cases'", 'runtime canonical CaseDetail prefix');
must(runtimeTruth, "CASE_DETAIL_LEGACY_ROUTE_PREFIX = '/case'", 'runtime legacy CaseDetail prefix');
must(cfRuntimeGuard, 'CF_RUNTIME_00_STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE_SCOPE_COMPAT', 'CF runtime STAGE233A marker');
must(cfRuntimeGuard, 'scripts/check-stage233a-route-canonicalization.cjs', 'CF runtime STAGE233A guard allowlist');
must(cfRuntimeGuard, 'tests/stage233a-route-canonicalization.test.cjs', 'CF runtime STAGE233A test allowlist');

assert.ok(fs.existsSync('_project/runs/STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE.md'), 'STAGE233A run report missing');
assert.equal(fs.existsSync('supabase/migrations/STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE.sql'), false, 'STAGE233A R1 must not add SQL');

console.log(JSON.stringify({
  ok: true,
  stage,
  canonical: '/cases/:caseId',
  legacyRedirect: '/case/:caseId -> /cases/:caseId',
}, null, 2));
