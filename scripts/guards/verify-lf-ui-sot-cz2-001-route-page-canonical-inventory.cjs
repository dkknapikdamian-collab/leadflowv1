#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const STAGE = 'LF-UI-SOT-CZ2-001';

const ALLOWED_UNROUTED_STATUSES = new Set([
  'LEGACY_CANDIDATE',
  'UNROUTED_ALLOWED',
  'BACKLOG_CANDIDATE',
  'DECISION_PENDING',
  'DEV_PREVIEW_LEGACY',
]);

const PAGE_FILE_REGISTRY = {
  'src/pages/TodayStable.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/', '/today'], note: 'Active Today screen; legacy Today.tsx is not active.' },
  'src/pages/Leads.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/leads'] },
  'src/pages/LeadDetail.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/leads/:leadId'] },
  'src/pages/TasksStable.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/tasks'], note: 'Active Tasks screen; legacy Tasks.tsx is not active.' },
  'src/pages/Calendar.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/calendar'] },
  'src/pages/Cases.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/cases'] },
  'src/pages/CaseDetail.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/cases/:caseId'] },
  'LegacyCaseRedirect': { status: 'ACTIVE_ALIAS_REDIRECT', routes: ['/case/:caseId'], aliasFor: '/cases/:caseId' },
  'Navigate': { status: 'ACTIVE_ALIAS_REDIRECT', routes: ['/case-templates'], aliasFor: '/templates', note: 'Technical redirect route.' },
  'src/pages/Clients.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/clients'] },
  'src/pages/ClientDetail.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/clients/:clientId'] },
  'src/pages/Activity.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/activity'] },
  'src/pages/Billing.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/billing'] },
  'src/pages/Settings.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/settings'] },
  'src/pages/Login.tsx': { status: 'ACTIVE_PUBLIC_AUTH', routes: ['/login', '/start'] },
  'src/pages/ClientPortal.tsx': { status: 'ACTIVE_PUBLIC_PORTAL', routes: ['/portal/:caseId/:token'] },
  'src/pages/LegalPrivacy.tsx': { status: 'ACTIVE_PUBLIC_LEGAL', routes: ['/privacy'] },
  'src/pages/LegalTerms.tsx': { status: 'ACTIVE_PUBLIC_LEGAL', routes: ['/terms'] },
  'src/pages/SalesFunnel.tsx': { status: 'ACTIVE_CANONICAL_WITH_DEV_ALIAS', routes: ['/funnel', '/dev/funnel'] },
  'src/pages/Templates.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/templates', '/case-templates'], note: '/case-templates redirects to /templates.' },
  'src/pages/ResponseTemplates.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/response-templates'] },
  'src/pages/AiDrafts.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/ai-drafts'] },
  'src/pages/NotificationsCenter.tsx': { status: 'ACTIVE_CANONICAL', routes: ['/notifications'] },
  'src/pages/SupportCenter.tsx': { status: 'ACTIVE_CANONICAL_WITH_ALIAS', routes: ['/help', '/support'] },
  'src/pages/AdminAiSettings.tsx': { status: 'ACTIVE_ADMIN_ONLY', routes: ['/settings/ai'] },
  'src/pages/UiPreviewVNext.tsx': { status: 'DEV_PREVIEW_LEGACY', routes: ['/ui-preview-vnext'] },
  'src/pages/UiPreviewVNextFull.tsx': { status: 'DEV_PREVIEW_LEGACY', routes: ['/ui-preview-vnext-full'] },
  'src/pages/Today.tsx': { status: 'LEGACY_CANDIDATE', routes: [], note: 'Inactive legacy Today; active route uses TodayStable.tsx.' },
  'src/pages/Tasks.tsx': { status: 'LEGACY_CANDIDATE', routes: [], note: 'Inactive legacy Tasks; active route uses TasksStable.tsx.' },
  'src/pages/Dashboard.tsx': { status: 'LEGACY_CANDIDATE', routes: [], note: 'Dashboard is in route registry as legacy but not active in App.tsx.' },
  'src/pages/PublicLanding.tsx': { status: 'DECISION_PENDING', routes: [], note: 'Imported in App.tsx but no active Route found in current route table.' },
};

function read(filePath) {
  return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
}

function exists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function listPageFiles() {
  return fs.readdirSync(path.join(process.cwd(), 'src/pages'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => `src/pages/${entry.name}`)
    .sort();
}

function parseRoutesConst(source) {
  const block = source.match(/export const CLOSEFLOW_ROUTES = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error('CLOSEFLOW_ROUTES block missing');
  const map = new Map();
  for (const match of block[1].matchAll(/([A-Za-z0-9_]+):\s*'([^']+)'/g)) {
    map.set(match[1], match[2]);
  }
  return map;
}

function parseRouteMap(source, routeConst) {
  const entries = [];
  const block = source.match(/export const CLOSEFLOW_ROUTE_MAP:[\s\S]*?= \[([\s\S]*?)\];/);
  if (!block) throw new Error('CLOSEFLOW_ROUTE_MAP block missing');
  for (const match of block[1].matchAll(/\{([^{}]*?path:\s*CLOSEFLOW_ROUTES\.([A-Za-z0-9_]+)[^{}]*?)\}/g)) {
    const body = match[1];
    const routeKey = match[2];
    entries.push({
      routeKey,
      path: routeConst.get(routeKey),
      status: (body.match(/status:\s*'([^']+)'/) || [])[1] || 'unknown',
      page: (body.match(/page:\s*'([^']+)'/) || [])[1] || 'unknown',
    });
  }
  return entries;
}

function parseBindings(app) {
  const bindings = new Map();
  for (const match of app.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*lazyPage\(\(\)\s*=>\s*import\('\.\/pages\/([^']+)'\)/g)) {
    bindings.set(match[1], `src/pages/${match[2]}.tsx`);
  }
  for (const match of app.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+'\.\/pages\/([^']+)'/g)) {
    bindings.set(match[1], `src/pages/${match[2]}.tsx`);
  }
  for (const match of app.matchAll(/const\s+([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+);/g)) {
    if (bindings.has(match[2])) bindings.set(match[1], bindings.get(match[2]));
  }
  bindings.set('LegacyCaseRedirect', 'LegacyCaseRedirect');
  bindings.set('Navigate', 'Navigate');
  return bindings;
}

function parseAppRoutes(app, routeConst, bindings) {
  const routes = [];
  for (const match of app.matchAll(/<Route\s+path=\{CLOSEFLOW_ROUTES\.([A-Za-z0-9_]+)\}\s+element=\{([\s\S]*?)\}\s*\/\>/g)) {
    const routeKey = match[1];
    const element = match[2];
    const componentMatch = element.match(/<([A-Z][A-Za-z0-9_]*)\b/);
    if (!componentMatch) throw new Error(`Cannot detect component for route ${routeKey}`);
    const component = componentMatch[1];
    routes.push({ routeKey, path: routeConst.get(routeKey), component, page: bindings.get(component) || `UNKNOWN:${component}` });
  }
  return routes.sort((a, b) => String(a.path).localeCompare(String(b.path)));
}

function registryForRoute(routePath) {
  return Object.entries(PAGE_FILE_REGISTRY).find(([, value]) => value.routes.includes(routePath));
}

const errors = [];
const app = read('src/App.tsx');
const routesSource = read('src/lib/routes.ts');
const routeConst = parseRoutesConst(routesSource);
const routeMap = parseRouteMap(routesSource, routeConst);
const bindings = parseBindings(app);
const appRoutes = parseAppRoutes(app, routeConst, bindings);
const appRoutePaths = new Set(appRoutes.map((route) => route.path));
const pageFiles = listPageFiles();

for (const file of ['src/App.tsx', 'src/lib/routes.ts', 'src/components/Layout.tsx']) {
  if (!exists(file)) errors.push(`missing required file: ${file}`);
}

for (const pageFile of pageFiles) {
  if (!PAGE_FILE_REGISTRY[pageFile]) errors.push(`page file missing registry status: ${pageFile}`);
}

for (const [registryFile, meta] of Object.entries(PAGE_FILE_REGISTRY)) {
  if (registryFile.startsWith('src/pages/') && !exists(registryFile)) errors.push(`registry points to missing page file: ${registryFile}`);
  if (!meta.routes.length && !ALLOWED_UNROUTED_STATUSES.has(meta.status)) errors.push(`unrouted page has non-allowlisted status: ${registryFile} ${meta.status}`);
}

for (const route of appRoutes) {
  if (!route.path) errors.push(`App route uses missing CLOSEFLOW_ROUTES key: ${route.routeKey}`);
  const directRegistry = PAGE_FILE_REGISTRY[route.page];
  const routeRegistry = registryForRoute(route.path)?.[1];
  if (!directRegistry && !routeRegistry) errors.push(`active route has no registry entry: ${route.path} -> ${route.page}`);
  if (route.page.startsWith('src/pages/') && !exists(route.page)) errors.push(`active route points to missing page file: ${route.path} -> ${route.page}`);
}

for (const routeDef of routeMap) {
  if (appRoutePaths.has(routeDef.path)) continue;
  const mapped = PAGE_FILE_REGISTRY[routeDef.page];
  const allowed = routeDef.status === 'legacy' || routeDef.status === 'unknown' || (mapped && ALLOWED_UNROUTED_STATUSES.has(mapped.status));
  if (!allowed) errors.push(`routes.ts route is not active in App.tsx and is not allowlisted: ${routeDef.path} -> ${routeDef.page}`);
}

for (const [file, meta] of Object.entries(PAGE_FILE_REGISTRY)) {
  for (const routePath of meta.routes) {
    if (!appRoutePaths.has(routePath)) errors.push(`registry route missing from App.tsx: ${file} -> ${routePath}`);
  }
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: STAGE, errors }, null, 2));
  throw new Error(`${STAGE} failed`);
}

const registryEntries = Object.entries(PAGE_FILE_REGISTRY).map(([file, meta]) => ({ file, ...meta }));
const activeRoutes = appRoutes.map((route) => {
  const registry = PAGE_FILE_REGISTRY[route.page] || registryForRoute(route.path)?.[1] || {};
  return { route: route.path, routeKey: route.routeKey, component: route.component, page: route.page, status: registry.status || 'UNKNOWN', aliasFor: registry.aliasFor };
});

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  activeRoutes,
  pageFiles: registryEntries.filter((entry) => entry.file.startsWith('src/pages/')).sort((a, b) => a.file.localeCompare(b.file)),
  legacyCandidates: registryEntries.filter((entry) => ['LEGACY_CANDIDATE', 'DEV_PREVIEW_LEGACY'].includes(entry.status)),
  decisionPending: registryEntries.filter((entry) => entry.status === 'DECISION_PENDING'),
  routeMapEntries: routeMap.length,
  appRouteEntries: appRoutes.length,
  runtimeTouched: false,
  cssTouched: false,
}, null, 2));
