#!/usr/bin/env node
const fs = require('node:fs');
const assert = require('node:assert/strict');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function must(source, token, label) {
  assert.ok(source.includes(token), `${label} missing: ${token}`);
}

function mustNot(source, token, label) {
  assert.equal(source.includes(token), false, `${label} must not contain: ${token}`);
}

const app = read('src/App.tsx');
const routes = read('src/lib/routes.ts');
const stageDoc = read('_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md');
const runReport = read('_project/runs/LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE.md');

must(routes, "path: CLOSEFLOW_ROUTES.caseDetail, status: 'canonical'", 'canonical CaseDetail route map');
must(routes, "path: CLOSEFLOW_ROUTES.legacyCaseDetail, status: 'alias'", 'legacy CaseDetail alias route map');
must(routes, "aliasFor: CLOSEFLOW_ROUTES.caseDetail", 'legacy CaseDetail alias target');
must(routes, 'export function caseDetailPath(caseId: string)', 'caseDetailPath helper');

must(app, "import { CLOSEFLOW_ROUTES, caseDetailPath, loginPath, templatesPath, todayPath } from './lib/routes';", 'App route SOT import');
must(app, 'function LegacyCaseRedirect()', 'LegacyCaseRedirect component');
must(app, 'return <Navigate to={caseDetailPath(caseId)} replace />;', 'legacy /case redirect replace');
must(app, '<Route path={CLOSEFLOW_ROUTES.caseDetail} element={isLoggedIn ? <CaseDetail /> : <Navigate to={loginPath()} />} />', 'canonical CaseDetail route');
must(app, '<Route path={CLOSEFLOW_ROUTES.legacyCaseDetail} element={isLoggedIn ? <LegacyCaseRedirect /> : <Navigate to={loginPath()} />} />', 'legacy CaseDetail route uses redirect component');
mustNot(app, 'path="/case/:caseId" element={isLoggedIn ? <CaseDetail />', 'legacy /case direct CaseDetail render');

must(stageDoc, 'TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING', 'LF-UI-SOT-001 honest closeout status');
must(stageDoc, 'LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT', 'follow-up alias policy stage');
must(stageDoc, 'Nie zamykac jako `ZAMKNIETE_FULL`', 'no full closeout overclaim');

must(runReport, 'Status: TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING', 'run report status');
must(runReport, 'Manual smoke Damiana', 'manual smoke checklist');
must(runReport, 'LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT', 'run report follow-up alias policy stage');
must(runReport, 'LOCAL_COMMANDS_PENDING', 'local command pending marker');

// These alias routes are intentionally not treated as full redirect-only PASS in this stage.
must(routes, "path: CLOSEFLOW_ROUTES.today, status: 'alias', page: 'src/pages/TodayStable.tsx'", '/today alias is documented as non-redirect-only pending policy');
must(routes, "path: CLOSEFLOW_ROUTES.start, status: 'alias', page: 'src/pages/Login.tsx'", '/start alias is documented as non-redirect-only pending policy');
must(routes, "path: CLOSEFLOW_ROUTES.support, status: 'alias', page: 'src/pages/SupportCenter.tsx'", '/support alias is documented as non-redirect-only pending policy');
must(app, '<Route path={CLOSEFLOW_ROUTES.today} element={isLoggedIn ? <Today /> : <Navigate to={loginPath()} />} />', '/today still renders Today and must remain FULL_ALIAS_POLICY_PENDING');
must(app, '<Route path={CLOSEFLOW_ROUTES.support} element={isLoggedIn ? <SupportCenter /> : <Navigate to={loginPath()} />} />', '/support still renders SupportCenter and must remain FULL_ALIAS_POLICY_PENDING');

console.log(JSON.stringify({
  ok: true,
  guard: 'LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE',
  coreCaseAlias: '/case/:caseId -> replace redirect to /cases/:caseId',
  status: 'TECH_DONE_WITH_MANUAL_SMOKE_AND_FULL_ALIAS_POLICY_PENDING',
  followUp: 'LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT'
}, null, 2));
