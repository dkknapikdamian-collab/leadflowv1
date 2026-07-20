const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8').replace(/^\uFEFF/, '');
}

function expectIncludes(file, text, label) {
  const content = read(file);
  if (!content.includes(text)) throw new Error(`${file}: missing ${label || text}`);
  console.log(`OK: ${file} contains ${label || text}`);
}

function expectRegex(file, regex, label) {
  const content = read(file);
  if (!regex.test(content)) throw new Error(`${file}: missing ${label || regex}`);
  console.log(`OK: ${file} contains ${label || regex}`);
}

function rejectIncludes(file, text, label) {
  const content = read(file);
  if (content.includes(text)) throw new Error(`${file}: forbidden ${label || text}`);
  console.log(`OK: ${file} excludes ${label || text}`);
}

expectIncludes('src/components/Layout.tsx', 'VISUAL_STAGE_06_CLIENT_DETAIL_ROUTE_SCOPE', 'Stage06 route scope marker');
expectIncludes('src/components/Layout.tsx', "const isClientDetailRoute = /^\\/clients\\/[^/]+$/.test(location.pathname);", 'client detail route detection');
expectIncludes('src/components/Layout.tsx', 'main-client-detail', 'main-client-detail scoped class');
expectIncludes('src/components/Layout.tsx', "data-visual-stage-client-detail={isClientDetailRoute ? '06-client-detail' : undefined}", 'client detail visual data marker');

rejectIncludes('src/index.css', 'visual-stage06-client-detail.css', 'inactive Stage06 ClientDetail CSS import');
expectIncludes('src/pages/ClientDetail.tsx', "../styles/visual-stage12-client-detail-vnext.css", 'current Stage12 ClientDetail visual import');
expectIncludes('src/pages/ClientDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Stage211C canvas import');
expectIncludes('src/pages/ClientDetail.tsx', 'STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP', 'current Client workspace cleanup marker');
expectIncludes('src/pages/ClientDetail.tsx', 'STAGE231B0_R15_R2_CLIENT_DETAIL_SHARED_CANVAS_WIDTH_TRIAL', 'current shared canvas marker');
expectIncludes('src/pages/ClientDetail.tsx', 'STAGE216L_CLIENT_DETAIL_LEAD_LAYOUT_SOURCE', 'current ClientDetail layout source marker');
expectIncludes('src/pages/ClientDetail.tsx', 'STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL', 'current shared missing manager source marker');

expectIncludes('src/styles/visual-stage06-client-detail.css', 'VISUAL_STAGE_06_CLIENT_DETAIL', 'Stage06 reference CSS marker');
expectIncludes('src/styles/visual-stage06-client-detail.css', '.main-client-detail', 'historical scoped ClientDetail selector');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'layout-detail', 'historical layout-detail pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'person-card', 'historical person-card pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'hero-grid', 'historical hero-grid pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'right-card', 'historical right-card pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', '@media (max-width: 760px)', 'historical mobile polish');

expectIncludes('src/pages/ClientDetail.tsx', 'fetchClientByIdFromSupabase', 'client fetch remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchLeadsFromSupabase', 'linked leads remain present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchCasesFromSupabase', 'linked cases remain present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchPaymentsFromSupabase', 'linked payments remain present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchTasksFromSupabase', 'client tasks remain present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchEventsFromSupabase', 'client events remain present');
expectIncludes('src/pages/ClientDetail.tsx', 'fetchActivitiesFromSupabase', 'client activity remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'updateClientInSupabase', 'client edit/save remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'updateLeadInSupabase', 'client to lead sync remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'ClientMultiContactField', 'multi contact field remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'copyValue', 'copy contact action remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'openNewCase', 'new case action remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT', 'no lead cockpit contract remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'no new/open lead shortcut from ClientDetail', 'no new/open lead shortcut source truth');
expectIncludes('src/pages/ClientDetail.tsx', 'openMainCase', 'main case navigation remains present');
rejectIncludes('src/pages/ClientDetail.tsx', 'openNewLeadForExistingClient', 'obsolete new lead shortcut');
expectIncludes('src/pages/ClientDetail.tsx', 'setActiveTab', 'tabs remain present');
expectRegex('src/pages/ClientDetail.tsx', /buildClientNextAction|clientNextAction|nextAction/, 'next action logic remains present');
console.log('OK: Visual Stage06 ClientDetail guard reconciled with current ClientDetail source truth.');
