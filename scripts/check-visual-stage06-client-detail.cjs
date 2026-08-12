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
expectIncludes('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expectIncludes('src/styles/owners/closeflow-client-detail.css', 'client-detail-right-card', 'canonical ClientDetail adapter');
expectIncludes('src/styles/owners/closeflow-page-adapters.css', 'main-client-detail', 'canonical ClientDetail page scope');
expectIncludes('src/styles/owners/closeflow-responsive-adapters.css', '@media (max-width: 760px)', 'canonical mobile adapter');

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
