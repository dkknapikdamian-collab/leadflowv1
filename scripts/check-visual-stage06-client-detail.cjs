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

expectIncludes('src/components/Layout.tsx', 'VISUAL_STAGE_06_CLIENT_DETAIL_ROUTE_SCOPE', 'Stage 06 route scope marker');
expectIncludes('src/components/Layout.tsx', "const isClientDetailRoute = /^\\/clients\\/[^/]+$/.test(location.pathname);", 'client detail route detection');
expectIncludes('src/components/Layout.tsx', 'main-client-detail', 'main-client-detail scoped class');
expectIncludes('src/components/Layout.tsx', "data-visual-stage-client-detail={isClientDetailRoute ? '06-client-detail' : undefined}", 'client detail visual data marker');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'VISUAL_STAGE_06_CLIENT_DETAIL', 'Stage 06 CSS marker');
expectIncludes('src/styles/visual-stage06-client-detail.css', '.main-client-detail', 'scoped ClientDetail selector');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'layout-detail', 'layout-detail pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'person-card', 'person-card pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'hero-grid', 'hero-grid pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', 'right-card', 'right-card pattern');
expectIncludes('src/styles/visual-stage06-client-detail.css', '@media (max-width: 760px)', 'mobile polish');
expectIncludes('src/index.css', '@import "./styles/visual-stage06-client-detail.css";', 'Stage 06 CSS import');
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
expectIncludes('src/pages/ClientDetail.tsx', 'openNewLeadForExistingClient', 'new lead action remains present');
expectIncludes('src/pages/ClientDetail.tsx', 'setActiveTab', 'tabs remain present');
expectRegex('src/pages/ClientDetail.tsx', /buildClientNextAction|nextAction/, 'next action logic remains present');
console.log('OK: Visual Stage 06 ClientDetail guard passed.');
