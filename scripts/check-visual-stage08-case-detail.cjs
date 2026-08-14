const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, text, label = text) {
  const body = read(file);
  if (!body.includes(text)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function expectAny(file, options, label) {
  const body = read(file);
  if (!options.some((item) => body.includes(item))) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, text, label = text) {
  const body = read(file);
  if (body.includes(text)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

expect('src/components/Layout.tsx', 'VISUAL_STAGE_08_CASE_DETAIL_ROUTE_SCOPE', 'Stage08 route scope marker');
expect('src/components/Layout.tsx', 'isCaseDetailRoute', 'case detail route detection');
expect('src/components/Layout.tsx', 'main-case-detail', 'main-case-detail scoped class');
expect('src/components/Layout.tsx', 'data-visual-stage-case-detail', 'case detail visual data marker');

reject('src/index.css', 'visual-stage08-case-detail.css', 'inactive Stage08 CaseDetail CSS import');
expect('src/pages/CaseDetail.tsx', "../styles/closeflow-case-history-visual-source-truth.css", 'current case history CSS import');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expect('src/pages/CaseDetail.tsx', "../styles/closeflow-case-detail-tabs.css", 'current CaseDetail tabs adapter');
expect('src/pages/CaseDetail.tsx', "../styles/closeflow-case-detail-shell-rail.css", 'current CaseDetail shell adapter');
expect('src/styles/owners/closeflow-page-adapters.css', '.main-case-detail', 'canonical CaseDetail page adapter');
expect('src/styles/owners/closeflow-page-adapters.css', '.layout-detail', 'canonical CaseDetail layout adapter');
expect('src/styles/owners/closeflow-page-adapters.css', '.right-card', 'canonical CaseDetail rail adapter');

expect('src/pages/CaseDetail.tsx', 'fetchCaseByIdFromSupabase', 'case fetch remains present');
expect('src/pages/CaseDetail.tsx', 'fetchCaseItemsFromSupabase', 'case checklist/items remain present');
expect('src/pages/CaseDetail.tsx', 'fetchActivitiesFromSupabase', 'case activity remains present');
expect('src/pages/CaseDetail.tsx', 'fetchTasksFromSupabase', 'case tasks remain present');
expect('src/pages/CaseDetail.tsx', 'fetchEventsFromSupabase', 'case events remain present');
expect('src/pages/CaseDetail.tsx', 'insertCaseItemToSupabase', 'add missing item flow remains present');
expect('src/pages/CaseDetail.tsx', 'updateCaseItemInSupabase', 'case item status/update remains present');
expect('src/pages/CaseDetail.tsx', 'deleteCaseItemFromSupabase', 'case item delete remains present');
expect('src/pages/CaseDetail.tsx', "openCaseContextAction('task')", 'shared task creation flow remains present');
expect('src/pages/CaseDetail.tsx', "openCaseContextAction('event')", 'shared event creation flow remains present');
expect('src/pages/CaseDetail.tsx', "openCaseContextAction('note')", 'shared note creation flow remains present');
expect('src/pages/CaseDetail.tsx', 'openContextQuickAction({', 'shared context action launcher remains present');
expect('src/pages/CaseDetail.tsx', "window.addEventListener('closeflow:context-action-saved'", 'shared action save refresh listener remains present');
expect('src/pages/CaseDetail.tsx', 'insertActivityToSupabase', 'activity/note flow remains present');
expect('src/pages/CaseDetail.tsx', 'createClientPortalTokenInSupabase', 'client portal token flow remains present');
expect('src/pages/CaseDetail.tsx', 'buildPortalUrl', 'client portal url flow remains present');
expect('src/pages/CaseDetail.tsx', 'resolveCaseLifecycleV1', 'case lifecycle remains present');
expect('src/pages/CaseDetail.tsx', 'CaseDetailV1CommandCenter', 'case command center remains present');
expect('src/pages/CaseDetail.tsx', 'setCaseLifecycleStatusV1', 'case lifecycle actions remain present');
expect('src/pages/CaseDetail.tsx', 'TabsTrigger', 'case detail tabs remain present');
expectAny('src/pages/CaseDetail.tsx', ['isAddItemOpen', 'setIsAddItemOpen'], 'add item modal remains present');

console.log('OK: Visual Stage08 CaseDetail guard reconciled with current CaseDetail source truth.');
