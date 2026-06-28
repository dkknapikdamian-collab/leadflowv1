#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const SOT006_STAGE = 'LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP';
const CSS_IMPORT_BASELINE = 45;
const DISABLED_LEGACY_CSS_IMPORT_BASELINE = 1;
const APP_STYLES_IMPORT_MAX_BASELINE = 45;
const SEARCH_OWNER_GUARD = 'Search cleanup blocked until search owner is confirmed';
const DEV_PREVIEW_NOT_PRODUCTION_SOT = 'DEV_PREVIEW_NOT_PRODUCTION_SOT';
const NO_HOTFIX_DELETE_GUARD = 'NO_HOTFIX_DELETE_GUARD';
const DENSITY_RUNTIME_GUARD = 'DENSITY_RUNTIME_GUARD';
const MODAL_OWNER_GUARD = 'MODAL_OWNER_GUARD';
const RIGHT_RAIL_OWNER_GUARD = 'RIGHT_RAIL_OWNER_GUARD';

const route = (route, routeStatus, pageOwner, layoutOwner, visualOwnerStatus, cssOwnerStatus, smokeRequired = true) => ({
  route,
  routeStatus,
  pageOwner,
  layoutOwner,
  visualOwnerStatus,
  cssOwnerStatus,
  smokeRequired,
});

const ROUTE_OWNER_DICTIONARY = [
  route('/', 'canonical', 'src/pages/TodayStable.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/today', 'alias', 'src/pages/TodayStable.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/dashboard', 'legacy', 'src/pages/Dashboard.tsx', 'unknown', 'LEGACY_NOT_ACTIVE_PRODUCTION_SOT', 'DO_NOT_TOUCH_YET'),
  route('/leads', 'canonical', 'src/pages/Leads.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/leads/:leadId', 'canonical', 'src/pages/LeadDetail.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/clients', 'canonical', 'src/pages/Clients.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/clients/:clientId', 'canonical', 'src/pages/ClientDetail.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/cases', 'canonical', 'src/pages/Cases.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/cases/:caseId', 'canonical', 'src/pages/CaseDetail.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/case/:caseId', 'alias', 'LegacyCaseRedirect', 'src/components/Layout.tsx', 'REDIRECT_ONLY', 'DO_NOT_TOUCH_YET'),
  route('/funnel', 'canonical', 'src/pages/SalesFunnel.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/dev/funnel', 'dev', 'src/pages/SalesFunnel.tsx', 'src/components/Layout.tsx', DEV_PREVIEW_NOT_PRODUCTION_SOT, 'DO_NOT_TOUCH_YET'),
  route('/tasks', 'canonical', 'src/pages/TasksStable.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/calendar', 'canonical', 'src/pages/Calendar.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/templates', 'canonical', 'src/pages/Templates.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/case-templates', 'alias', 'Navigate -> /templates', 'src/components/Layout.tsx', 'REDIRECT_ONLY', 'DO_NOT_TOUCH_YET'),
  route('/response-templates', 'canonical', 'src/pages/ResponseTemplates.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/activity', 'canonical', 'src/pages/Activity.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/billing', 'canonical', 'src/pages/Billing.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/help', 'canonical', 'src/pages/SupportCenter.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/support', 'alias', 'src/pages/SupportCenter.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/settings', 'canonical', 'src/pages/Settings.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/settings/ai', 'canonical', 'src/pages/AdminAiSettings.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/ai-drafts', 'canonical', 'src/pages/AiDrafts.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/notifications', 'canonical', 'src/pages/NotificationsCenter.tsx', 'src/components/Layout.tsx', 'ACTIVE_OWNER', 'ACTIVE_OWNER'),
  route('/login', 'public', 'src/pages/Login.tsx', 'none', 'PUBLIC_AUTH_OWNER', 'DO_NOT_TOUCH_YET'),
  route('/start', 'public', 'src/pages/Login.tsx', 'none', 'PUBLIC_AUTH_OWNER', 'DO_NOT_TOUCH_YET'),
  route('/portal/:caseId/:token', 'public', 'src/pages/ClientPortal.tsx', 'none', 'PUBLIC_PORTAL_OWNER', 'DO_NOT_TOUCH_YET'),
  route('/privacy', 'public', 'src/pages/LegalPrivacy.tsx', 'none', 'LEGAL_OWNER', 'DO_NOT_TOUCH_YET'),
  route('/terms', 'public', 'src/pages/LegalTerms.tsx', 'none', 'LEGAL_OWNER', 'DO_NOT_TOUCH_YET'),
  route('/ui-preview-vnext', 'dev', 'src/pages/UiPreviewVNext.tsx', 'unknown', DEV_PREVIEW_NOT_PRODUCTION_SOT, 'DO_NOT_TOUCH_YET'),
  route('/ui-preview-vnext-full', 'dev', 'src/pages/UiPreviewVNextFull.tsx', 'unknown', DEV_PREVIEW_NOT_PRODUCTION_SOT, 'DO_NOT_TOUCH_YET'),
];

const css = (status, ownerArea, smokeRequired = true) => ({ status, ownerArea, smokeRequired });
const CSS_OWNER_DICTIONARY = new Map([
  ['src/styles/closeflow-visual-source-truth.css', css('ACTIVE_OWNER', 'app shell/layout')],
  ['src/styles/closeflow-action-tokens.css', css('TOKEN_OWNER', 'buttons/actions')],
  ['src/styles/closeflow-action-clusters.css', css('ACTIVE_OWNER', 'buttons/actions')],
  ['src/styles/closeflow-form-actions.css', css('ACTIVE_OWNER', 'buttons/actions')],
  ['src/styles/closeflow-card-readability.css', css('ACTIVE_OWNER', 'cards/metrics')],
  ['src/styles/closeflow-surface-tokens.css', css('TOKEN_OWNER', 'surfaces/cards')],
  ['src/styles/closeflow-modal-visual-system.css', css('ACTIVE_OWNER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-metric-tiles.css', css('ACTIVE_OWNER', 'cards/metrics')],
  ['src/styles/closeflow-page-header.css', css('ACTIVE_OWNER', 'page header')],
  ['src/styles/closeflow-list-row-tokens.css', css('TOKEN_OWNER', 'lists/rows')],
  ['src/styles/closeflow-alert-severity.css', css('TOKEN_OWNER', 'alerts/badges')],
  ['src/styles/finance/closeflow-finance.css', css('ACTIVE_OWNER', 'finance/modal')],
  ['src/styles/closeflow-right-rail-source-truth.css', css('ACTIVE_OWNER', 'right rail')],
  ['src/styles/closeflow-command-actions-source-truth.css', css('ACTIVE_OWNER', 'buttons/actions')],
  ['src/styles/closeflow-page-header-copy-source-truth.css', css('HOTFIX_TO_MERGE_LATER', 'page header')],
  ['src/styles/closeflow-page-header-action-semantics-packet1.css', css('HOTFIX_TO_MERGE_LATER', 'page header')],
  ['src/styles/closeflow-search-source-truth-stage134.css', css('DO_POTWIERDZENIA', 'search')],
  ['src/styles/closeflow-right-rail-heading-source-truth-stage135.css', css('HOTFIX_TO_MERGE_LATER', 'right rail')],
  ['src/styles/closeflow-clean-desktop-app-shell-canvas-stage149.css', css('HOTFIX_TO_MERGE_LATER', 'app shell/layout')],
  ['src/styles/closeflow-panel-typography-and-width-source-truth-stage150.css', css('DO_NOT_TOUCH_YET', 'panels')],
  ['src/styles/closeflow-compact-cards-source-truth-stage151.css', css('HOTFIX_TO_MERGE_LATER', 'cards/metrics')],
  ['src/styles/closeflow-dense-cards-80-percent-target-stage152.css', css('HOTFIX_TO_MERGE_LATER', 'cards/density')],
  ['src/styles/closeflow-real-density-tokens-no-zoom-stage156.css', css('DO_NOT_TOUCH_YET', 'density/runtime')],
  ['src/styles/closeflow-overlay-portal-density-stage158.css', css('HOTFIX_TO_MERGE_LATER', 'modal/density')],
  ['src/styles/closeflow-overlay-real-density-and-footer-stage159.css', css('HOTFIX_TO_MERGE_LATER', 'modal/density')],
  ['src/styles/closeflow-modal-center-and-compact-all-stage160.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-cf-modal-surface-center-fix-stage161.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-topic-contact-picker-readable-stage169.css', css('HOTFIX_TO_MERGE_LATER', 'modal/dialog/overlay')],
  ['src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css', css('HOTFIX_TO_MERGE_LATER', 'modal/task dialog')],
  ['src/styles/closeflow-remove-modal-helper-copy-stage171.css', css('DELETE_AFTER_GUARD', 'modal/dialog/overlay')],
  ['src/styles/closeflow-global-client-create-dialog-stage172.css', css('HOTFIX_TO_MERGE_LATER', 'modal/client create')],
  ['src/styles/closeflow-main-search-source-truth-stage173.css', css('DO_POTWIERDZENIA', 'search')],
  ['src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css', css('DO_POTWIERDZENIA', 'search')],
  ['src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css', css('DO_POTWIERDZENIA', 'search')],
  ['src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css', css('HOTFIX_TO_MERGE_LATER', 'lists/rows')],
  ['src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css', css('HOTFIX_TO_MERGE_LATER', 'right rail/tasks')],
  ['src/styles/closeflow-secondary-pages-full-width-stage181ad.css', css('DO_NOT_TOUCH_YET', 'secondary pages')],
  ['src/styles/closeflow-app-viewport-scale-75-stage201.css', css('DO_NOT_TOUCH_YET', 'density/runtime')],
  ['src/styles/closeflow-ops-badges-and-icons-stretch-stage204.css', css('DO_NOT_TOUCH_YET', 'ops badges/icons')],
  ['src/styles/stage231h-r1e-case-finance-correction-modal-final.css', css('HOTFIX_TO_MERGE_LATER', 'finance/modal')],
]);

const ALLOWED_CSS_OWNER_STATUS = new Set(['ACTIVE_OWNER', 'TOKEN_OWNER', 'HOTFIX_TO_MERGE_LATER', 'DELETE_AFTER_GUARD', 'DO_NOT_TOUCH_YET', 'DO_POTWIERDZENIA']);
const SEARCH_LAYERS = [
  'src/styles/closeflow-search-source-truth-stage134.css',
  'src/styles/closeflow-main-search-source-truth-stage173.css',
  'src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css',
  'src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css',
];
const MODAL_LAYERS = [
  'src/styles/closeflow-modal-visual-system.css',
  'src/styles/closeflow-overlay-portal-density-stage158.css',
  'src/styles/closeflow-overlay-real-density-and-footer-stage159.css',
  'src/styles/closeflow-modal-center-and-compact-all-stage160.css',
  'src/styles/closeflow-cf-modal-surface-center-fix-stage161.css',
  'src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css',
  'src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css',
  'src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css',
  'src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css',
  'src/styles/closeflow-modal-footer-in-flow-no-overlay-stage166.css',
  'src/styles/closeflow-topic-contact-picker-readable-stage169.css',
  'src/styles/closeflow-task-dialog-relation-and-field-readability-stage170.css',
  'src/styles/closeflow-remove-modal-helper-copy-stage171.css',
  'src/styles/closeflow-global-client-create-dialog-stage172.css',
];
const RIGHT_RAIL_LAYERS = [
  'src/styles/closeflow-right-rail-source-truth.css',
  'src/styles/closeflow-right-rail-heading-source-truth-stage135.css',
  'src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css',
];
const DENSITY_LAYERS = [
  'src/styles/closeflow-real-density-tokens-no-zoom-stage156.css',
  'src/styles/closeflow-overlay-portal-density-stage158.css',
  'src/styles/closeflow-overlay-real-density-and-footer-stage159.css',
  'src/styles/closeflow-app-viewport-scale-75-stage201.css',
];

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}
function normalizeCssImport(importPath) {
  if (importPath.startsWith('./')) return `src/${importPath.slice(2)}`;
  return importPath.replace(/^\.\.\//, 'src/');
}
function extractActiveCssImports(appSource) {
  return Array.from(appSource.matchAll(/^import\s+['"]([^'"]+\.css)['"];\s*$/gm)).map((match) => normalizeCssImport(match[1]));
}
function extractDisabledLegacyCssImports(appSource) {
  return Array.from(appSource.matchAll(/disabled legacy[^\n]*import\s+['"]([^'"]+\.css)['"]/gi)).map((match) => normalizeCssImport(match[1]));
}
function extractRoutePaths(routeSource) {
  const objectMatch = routeSource.match(/export\s+const\s+CLOSEFLOW_ROUTES\s*=\s*{([\s\S]*?)}\s+as\s+const;/m);
  if (!objectMatch) return [];
  return Array.from(objectMatch[1].matchAll(/\w+:\s*['"]([^'"]+)['"]/g)).map((match) => match[1]);
}
function extractAppStylesImportMax(scriptSource) {
  const mapMatch = scriptSource.match(/APP_STYLES_IMPORT_MAX\s*=\s*new\s+Map\s*\(\s*\[\s*\[\s*['"]src\/App\.tsx['"]\s*,\s*(\d+)\s*\]/m);
  return mapMatch ? Number(mapMatch[1]) : NaN;
}
function fail(failures, message) {
  failures.push(`${SOT006_STAGE} FAIL: ${message}`);
}

function runChecks() {
  const failures = [];
  const appSource = readRepoFile('src/App.tsx');
  const routeSource = readRepoFile('src/lib/routes.ts');
  const patchGuardSource = readRepoFile('scripts/check-ui-patch-layers.cjs');
  const layoutSource = readRepoFile('src/components/Layout.tsx');
  const activeCssImports = extractActiveCssImports(appSource);
  const disabledLegacyCssImports = extractDisabledLegacyCssImports(appSource);
  const routePaths = extractRoutePaths(routeSource);
  const appStylesImportMax = extractAppStylesImportMax(patchGuardSource);

  if (activeCssImports.length !== CSS_IMPORT_BASELINE) fail(failures, `Active App.tsx CSS import count changed from ${CSS_IMPORT_BASELINE} to ${activeCssImports.length}`);
  if (disabledLegacyCssImports.length !== DISABLED_LEGACY_CSS_IMPORT_BASELINE) fail(failures, `Disabled legacy CSS import count changed from ${DISABLED_LEGACY_CSS_IMPORT_BASELINE} to ${disabledLegacyCssImports.length}`);
  if (appStylesImportMax !== APP_STYLES_IMPORT_MAX_BASELINE) fail(failures, `APP_STYLES_IMPORT_MAX changed from ${APP_STYLES_IMPORT_MAX_BASELINE} to ${appStylesImportMax}`);

  for (const cssImport of activeCssImports) {
    const owner = CSS_OWNER_DICTIONARY.get(cssImport);
    if (!owner) { fail(failures, `Missing CSS owner status for ${cssImport}`); continue; }
    if (!ALLOWED_CSS_OWNER_STATUS.has(owner.status)) fail(failures, `Invalid CSS owner status for ${cssImport}: ${owner.status}`);
    if (!owner.smokeRequired) fail(failures, `Missing smokeRequired for CSS owner ${cssImport}`);
    const isStageOrHotfix = /(?:stage\d+|hotfix|fix|packet\d+)/i.test(cssImport);
    const allowedHotfixStatus = ['HOTFIX_TO_MERGE_LATER', 'DELETE_AFTER_GUARD', 'DO_NOT_TOUCH_YET', 'DO_POTWIERDZENIA'].includes(owner.status);
    if (isStageOrHotfix && !allowedHotfixStatus) fail(failures, `${NO_HOTFIX_DELETE_GUARD}: hotfix/stage CSS cannot be ACTIVE_OWNER without merge/delete guard: ${cssImport}`);
  }
  for (const cssOwner of CSS_OWNER_DICTIONARY.keys()) {
    if (!activeCssImports.includes(cssOwner)) fail(failures, `CSS owner dictionary has stale/non-active App.tsx import: ${cssOwner}`);
  }
  for (const routeOwner of ROUTE_OWNER_DICTIONARY) {
    if (!routePaths.includes(routeOwner.route)) fail(failures, `Missing route in src/lib/routes.ts for ${routeOwner.route}`);
    if (!routeOwner.pageOwner || !routeOwner.layoutOwner || !routeOwner.visualOwnerStatus || !routeOwner.cssOwnerStatus) fail(failures, `Missing route owner field for ${routeOwner.route}`);
    if (!['dev', 'public', 'legacy'].includes(routeOwner.routeStatus) && !routeOwner.smokeRequired) fail(failures, `Production route missing smokeRequired for ${routeOwner.route}`);
  }
  for (const routePath of routePaths) {
    if (!ROUTE_OWNER_DICTIONARY.some((entry) => entry.route === routePath)) fail(failures, `Missing route owner for ${routePath}`);
  }
  for (const layer of SEARCH_LAYERS) {
    const owner = CSS_OWNER_DICTIONARY.get(layer);
    if (!owner || owner.status !== 'DO_POTWIERDZENIA') fail(failures, `${SEARCH_OWNER_GUARD}: ${layer}`);
  }
  for (const routePath of ['/ui-preview-vnext', '/ui-preview-vnext-full']) {
    const owner = ROUTE_OWNER_DICTIONARY.find((entry) => entry.route === routePath);
    if (!owner || owner.visualOwnerStatus !== DEV_PREVIEW_NOT_PRODUCTION_SOT) fail(failures, `DEV preview cannot be production source-of-truth: ${routePath}`);
  }
  for (const layer of MODAL_LAYERS) {
    const owner = CSS_OWNER_DICTIONARY.get(layer);
    if (!owner || !owner.smokeRequired || !/modal|dialog|client create|task dialog/.test(owner.ownerArea)) fail(failures, `${MODAL_OWNER_GUARD}: missing modal owner/smoke for ${layer}`);
  }
  for (const layer of RIGHT_RAIL_LAYERS) {
    const owner = CSS_OWNER_DICTIONARY.get(layer);
    if (!owner || !owner.smokeRequired || !/right rail/.test(owner.ownerArea)) fail(failures, `${RIGHT_RAIL_OWNER_GUARD}: missing right rail owner/smoke for ${layer}`);
  }
  for (const layer of DENSITY_LAYERS) {
    const owner = CSS_OWNER_DICTIONARY.get(layer);
    if (!owner || !owner.smokeRequired || !/density|runtime|modal/.test(owner.ownerArea)) fail(failures, `${DENSITY_RUNTIME_GUARD}: missing density/runtime owner/smoke for ${layer}`);
  }
  if (!layoutSource.includes('STAGE209_CENTER_SCROLL_RUNTIME_ENFORCER_START') || !layoutSource.includes("transform: 'scale(var(--cf-stage201-app-scale")) {
    fail(failures, `${DENSITY_RUNTIME_GUARD}: Layout.tsx runtime scroll/scale contract not detected`);
  }
  return {
    ok: failures.length === 0,
    failures,
    summary: {
      activeCssImports: activeCssImports.length,
      disabledLegacyCssImports: disabledLegacyCssImports.length,
      appStylesImportMax,
      routeOwners: ROUTE_OWNER_DICTIONARY.length,
      cssOwners: CSS_OWNER_DICTIONARY.size,
      searchLayersBlocked: SEARCH_LAYERS.length,
      modalLayersGuarded: MODAL_LAYERS.length,
      rightRailLayersGuarded: RIGHT_RAIL_LAYERS.length,
      densityLayersGuarded: DENSITY_LAYERS.length,
    },
  };
}

if (require.main === module) {
  const result = runChecks();
  if (!result.ok) {
    console.error(`${SOT006_STAGE}: FAIL`);
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`${SOT006_STAGE}: PASS`);
  console.log(JSON.stringify(result.summary, null, 2));
}

module.exports = {
  SOT006_STAGE,
  CSS_IMPORT_BASELINE,
  DISABLED_LEGACY_CSS_IMPORT_BASELINE,
  APP_STYLES_IMPORT_MAX_BASELINE,
  ROUTE_OWNER_DICTIONARY,
  CSS_OWNER_DICTIONARY,
  SEARCH_OWNER_GUARD,
  DEV_PREVIEW_NOT_PRODUCTION_SOT,
  NO_HOTFIX_DELETE_GUARD,
  DENSITY_RUNTIME_GUARD,
  MODAL_OWNER_GUARD,
  RIGHT_RAIL_OWNER_GUARD,
  runChecks,
};
