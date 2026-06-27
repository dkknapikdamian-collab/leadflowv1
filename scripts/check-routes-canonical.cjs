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
  assert.equal(source.includes(token), false, `${label} still present: ${token}`);
}

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

const app = read('src/App.tsx');
const routes = read('src/lib/routes.ts');
const leadDetail = read('src/pages/LeadDetail.tsx');
const cases = read('src/pages/Cases.tsx');
const reminders = read('src/lib/reminders.ts');
const ownerMissing = read('src/lib/owner-control/owner-control-missing-blockers.ts');
const ownerBaseline = read('src/lib/owner-control/owner-control-baseline.ts');

const requiredHelpers = [
  'todayPath',
  'leadsPath',
  'leadDetailPath',
  'clientsPath',
  'clientDetailPath',
  'casesPath',
  'caseDetailPath',
  'calendarPath',
  'funnelPath',
];

for (const helper of requiredHelpers) {
  must(routes, `export function ${helper}(`, `route helper ${helper}`);
}

const requiredScreens = [
  'Today',
  'Dashboard',
  'Leads',
  'Lead Detail',
  'Clients',
  'Client Detail',
  'Cases',
  'Case Detail',
  'Funnel',
  'Calendar',
  'Tasks',
  'Settings',
  'Billing',
  'Activity',
  'Templates',
  'Login',
  'Client Portal',
];

for (const screen of requiredScreens) {
  must(routes, `screen: '${screen}'`, `route map screen ${screen}`);
}

must(routes, "status: 'canonical'", 'canonical route statuses');
must(routes, "status: 'alias'", 'alias route statuses');
must(routes, "status: 'legacy'", 'legacy route statuses');

const canonicalCaseRoute = '<Route path={CLOSEFLOW_ROUTES.caseDetail} element={isLoggedIn ? <CaseDetail /> : <Navigate to={loginPath()} />} />';
const legacyCaseRoute = '<Route path={CLOSEFLOW_ROUTES.legacyCaseDetail} element={isLoggedIn ? <LegacyCaseRedirect /> : <Navigate to={loginPath()} />} />';
must(app, "import { CLOSEFLOW_ROUTES, caseDetailPath, loginPath, templatesPath, todayPath } from './lib/routes';", 'App route SOT import');
must(app, 'function LegacyCaseRedirect()', 'legacy case redirect component');
must(app, 'return <Navigate to={caseDetailPath(caseId)} replace />;', 'legacy case redirect replace behavior');
must(app, canonicalCaseRoute, 'canonical CaseDetail route');
must(app, legacyCaseRoute, 'legacy CaseDetail alias route');
mustNot(app, 'path="/case/:caseId" element={isLoggedIn ? <CaseDetail />', 'legacy route direct CaseDetail render');

const routeComponentChecks = [
  ['Today', 'CLOSEFLOW_ROUTES.root', '<Today />'],
  ['Leads', 'CLOSEFLOW_ROUTES.leads', '<Leads />'],
  ['Lead Detail', 'CLOSEFLOW_ROUTES.leadDetail', '<LeadDetail />'],
  ['Clients', 'CLOSEFLOW_ROUTES.clients', '<Clients />'],
  ['Client Detail', 'CLOSEFLOW_ROUTES.clientDetail', '<ClientDetail />'],
  ['Cases', 'CLOSEFLOW_ROUTES.cases', '<Cases />'],
  ['Case Detail', 'CLOSEFLOW_ROUTES.caseDetail', '<CaseDetail />'],
  ['Funnel', 'CLOSEFLOW_ROUTES.funnel', '<SalesFunnel />'],
  ['Calendar', 'CLOSEFLOW_ROUTES.calendar', '<Calendar />'],
  ['Tasks', 'CLOSEFLOW_ROUTES.tasks', '<Tasks />'],
  ['Settings', 'CLOSEFLOW_ROUTES.settings', '<Settings />'],
  ['Billing', 'CLOSEFLOW_ROUTES.billing', '<Billing />'],
  ['Activity', 'CLOSEFLOW_ROUTES.activity', '<Activity />'],
  ['Templates', 'CLOSEFLOW_ROUTES.templates', '<Templates />'],
  ['Login', 'CLOSEFLOW_ROUTES.login', '<Login />'],
  ['Client Portal', 'CLOSEFLOW_ROUTES.clientPortal', '<ClientPortal />'],
];

for (const [screen, routeConst, component] of routeComponentChecks) {
  assert.equal(count(app, new RegExp(`<Route path=\\{${routeConst.replace('.', '\\.')}\\}[^\\n]+${component.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)), 1, `${screen} must have one canonical component route`);
}

must(cases, "import { caseDetailPath } from '../lib/routes';", 'Cases caseDetailPath import');
assert.ok(count(cases, /caseDetailPath\(record\.id\)/g) >= 3, 'Cases must use caseDetailPath for case row links');
must(leadDetail, "import { caseDetailPath, leadsPath } from '../lib/routes';", 'LeadDetail route helper import');
must(leadDetail, 'navigate(caseDetailPath(startServiceSuccess.caseId));', 'LeadDetail start-service canonical redirect');
mustNot(leadDetail, 'navigate(`/case/${startServiceSuccess.caseId}`);', 'LeadDetail legacy start-service redirect');
mustNot(leadDetail, 'navigate(`/cases/${startServiceSuccess.caseId}`);', 'LeadDetail manual start-service redirect');

for (const [source, label] of [
  [reminders, 'reminders'],
  [ownerMissing, 'owner missing blockers'],
  [ownerBaseline, 'owner control baseline'],
]) {
  must(source, 'caseDetailPath', `${label} case detail helper`);
  mustNot(source, '`/case/${', `${label} legacy /case template`);
  mustNot(source, "'/case/'", `${label} legacy /case concat`);
  mustNot(source, '"/case/"', `${label} legacy /case concat`);
}

const manualLegacyCaseRuntimeMatches = [];
for (const file of [
  'src/App.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Cases.tsx',
  'src/lib/reminders.ts',
  'src/lib/owner-control/owner-control-missing-blockers.ts',
  'src/lib/owner-control/owner-control-baseline.ts',
]) {
  const source = read(file);
  const matches = source.match(/[`'"]\/case\/\$\{|[`'"]\/case\/|\/case\/\$\{/g) || [];
  if (matches.length) manualLegacyCaseRuntimeMatches.push(`${file}: ${matches.join(', ')}`);
}
assert.deepEqual(manualLegacyCaseRuntimeMatches, [], 'active runtime code must not manually build /case/ links');

console.log(JSON.stringify({
  ok: true,
  guard: 'guard:routes:canonical',
  canonicalCaseDetail: '/cases/:caseId',
  legacyAlias: '/case/:caseId -> replace redirect',
  screensChecked: requiredScreens.length,
}, null, 2));
