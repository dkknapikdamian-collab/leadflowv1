const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-016';
const NEXT_STAGE = `CZ2-${String(17).padStart(3, '0')}`;
const ALIAS = 'verify:lf-ui-sot-cz2-016-visual-smoke';
const errors = [];
const warnings = [];
const MOJIBAKE_PATTERN = /\u00c5|\u00c4|\u0102|\u00e2\u20ac|\uFFFD/;

function filePath(rel) {
  return path.join(ROOT, rel);
}

function exists(rel) {
  return fs.existsSync(filePath(rel));
}

function read(rel) {
  if (!exists(rel)) {
    errors.push(`Missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(filePath(rel), 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    errors.push(`${rel} is not valid JSON: ${error.message}`);
    return {};
  }
}

function mustInclude(file, token, message) {
  if (!read(file).includes(token)) errors.push(message || `${file} missing ${token}`);
}

function mustExist(file) {
  if (!exists(file)) errors.push(`Missing file: ${file}`);
}

function assertNoMojibake(file) {
  const source = read(file);
  if (MOJIBAKE_PATTERN.test(source)) errors.push(`Mojibake marker found in ${file}`);
}

const manifestPath = '_project/lf-ui-sot-cz2-016-visual-smoke-manifest.json';
const requiredRoutes = ['/today', '/leads', '/clients', '/cases', '/tasks', '/calendar', '/billing', '/response-templates'];
const requiredDetailRoutes = ['/leads/:id', '/clients/:id', '/cases/:id'];
const requiredChecks = [
  'layout-shell-present',
  'sidebar-present',
  'page-header-present',
  'no-mojibake',
  'no-runtime-crash-marker',
  'cards-render',
  'icons-render-through-sot',
  'forms-render-through-sot-where-migrated',
  'filters-render-through-sot-where-migrated',
  'layout-sot-marker-present-where-migrated',
];

const appRouteTokens = [
  'CLOSEFLOW_ROUTES.today',
  'CLOSEFLOW_ROUTES.leads',
  'CLOSEFLOW_ROUTES.clients',
  'CLOSEFLOW_ROUTES.cases',
  'CLOSEFLOW_ROUTES.tasks',
  'CLOSEFLOW_ROUTES.calendar',
  'CLOSEFLOW_ROUTES.billing',
  'CLOSEFLOW_ROUTES.responseTemplates',
  'CLOSEFLOW_ROUTES.leadDetail',
  'CLOSEFLOW_ROUTES.clientDetail',
  'CLOSEFLOW_ROUTES.caseDetail',
];

const routeConstTokens = [
  "today: '/today'",
  "leads: '/leads'",
  "clients: '/clients'",
  "cases: '/cases'",
  "tasks: '/tasks'",
  "calendar: '/calendar'",
  "billing: '/billing'",
  "responseTemplates: '/response-templates'",
  "leadDetail: '/leads/:leadId'",
  "clientDetail: '/clients/:clientId'",
  "caseDetail: '/cases/:caseId'",
];

const sotFiles = [
  'src/components/layout/app-shell.tsx',
  'src/components/layout/page-shell.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/layout/content-rail-layout.tsx',
  'src/components/layout/sidebar-nav.tsx',
  'src/components/ui/search-field.tsx',
  'src/components/ui/filter-select.tsx',
  'src/components/ui/sort-select.tsx',
  'src/components/ui/filter-chip-group.tsx',
  'src/components/ui/filter-toolbar.tsx',
  'src/components/ui/form-field.tsx',
  'src/components/ui/form-section.tsx',
  'src/components/ui/select-field.tsx',
  'src/components/ui/textarea-field.tsx',
  'src/components/ui/metric-card.tsx',
  'src/components/ui/list-card.tsx',
  'src/components/ui/empty-state-card.tsx',
  'src/components/ui/detail-panel.tsx',
  'src/components/ui/icon.tsx',
  'src/components/ui/icon-button.tsx',
  'src/lib/source-of-truth/icon-registry.ts',
];

const smokePages = [
  'src/pages/TodayStable.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Billing.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/ResponseTemplates.tsx',
];

const manifest = readJson(manifestPath);
if (manifest.stage !== STAGE) errors.push(`${manifestPath} must declare stage ${STAGE}`);
if (manifest.type !== 'visual-smoke') errors.push(`${manifestPath} must declare type visual-smoke`);
for (const route of requiredRoutes) if (!manifest.routes?.includes(route)) errors.push(`${manifestPath} missing route ${route}`);
for (const route of requiredDetailRoutes) if (!manifest.detailRoutes?.includes(route)) errors.push(`${manifestPath} missing detail route ${route}`);
for (const check of requiredChecks) if (!manifest.checks?.includes(check)) errors.push(`${manifestPath} missing check ${check}`);

for (const file of [...sotFiles, ...smokePages]) mustExist(file);
for (const token of appRouteTokens) mustInclude('src/App.tsx', token, `App.tsx missing active route token ${token}`);
for (const token of routeConstTokens) mustInclude('src/lib/routes.ts', token, `routes.ts missing route token ${token}`);

mustInclude('src/components/Layout.tsx', 'className="app closeflow-visual-stage01 cf-html-shell"', 'Layout.tsx must render CloseFlow app shell');
mustInclude('src/components/Layout.tsx', 'data-shell-sidebar="true"', 'Layout.tsx must render shell sidebar');
mustInclude('src/components/Layout.tsx', 'data-shell-main="true"', 'Layout.tsx must render shell main');
mustInclude('src/components/Layout.tsx', 'data-shell-content="true"', 'Layout.tsx must render shell content wrapper');

mustInclude('src/pages/ResponseTemplates.tsx', "import Layout from '../components/Layout'", 'ResponseTemplates must keep Layout wrapper');
mustInclude('src/pages/ResponseTemplates.tsx', '<Layout>', 'ResponseTemplates must render Layout wrapper');
mustInclude('src/pages/ResponseTemplates.tsx', "import { PageShell } from '../components/layout/page-shell'", 'ResponseTemplates must import PageShell');
mustInclude('src/pages/ResponseTemplates.tsx', '<PageShell', 'ResponseTemplates must render PageShell');
mustInclude('src/pages/ResponseTemplates.tsx', 'data-cf-layout-scoped-migration', 'ResponseTemplates must keep scoped layout migration marker');

const packageJson = read('package.json');
const packageAliasRegistered = packageJson.includes(ALIAS) && packageJson.includes('node scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs');
if (!packageAliasRegistered) warnings.push(`package alias pending: ${ALIAS}`);

for (const file of [manifestPath, 'scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs', 'tests/lf-ui-sot-cz2-016-visual-smoke.test.cjs']) {
  const source = read(file);
  if (source.includes(NEXT_STAGE)) errors.push(`${file} must not contain next-stage marker`);
}

for (const file of [manifestPath, 'src/App.tsx', 'src/lib/routes.ts', 'src/components/Layout.tsx', 'src/pages/ResponseTemplates.tsx', 'scripts/guards/verify-lf-ui-sot-cz2-016-visual-smoke.cjs', 'tests/lf-ui-sot-cz2-016-visual-smoke.test.cjs', ...sotFiles, ...smokePages]) {
  assertNoMojibake(file);
}

console.log(JSON.stringify({
  ok: errors.length === 0,
  stage: STAGE,
  decision: 'VISUAL_SMOKE_ONLY / NO_REDESIGN',
  manifest: manifestPath,
  packageAliasRegistered,
  routes: requiredRoutes,
  detailRoutes: requiredDetailRoutes,
  sotFiles,
  smokePages,
  warnings,
  errors,
}, null, 2));

if (errors.length) process.exit(1);
