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

expect('src/components/Layout.tsx', 'VISUAL_STAGE_08_CASE_DETAIL_ROUTE_SCOPE', 'Stage 08 route scope marker');
expect('src/components/Layout.tsx', 'isCaseDetailRoute', 'case detail route detection');
expect('src/components/Layout.tsx', 'main-case-detail', 'main-case-detail scoped class');
expect('src/components/Layout.tsx', 'data-visual-stage-case-detail', 'case detail visual data marker');

expect('src/styles/visual-stage08-case-detail.css', 'VISUAL_STAGE_08_CASE_DETAIL_CSS', 'Stage 08 CSS marker');
expect('src/styles/visual-stage08-case-detail.css', '.main-case-detail', 'scoped CaseDetail selector');
expect('src/styles/visual-stage08-case-detail.css', 'layout-detail', 'layout-detail pattern');
expect('src/styles/visual-stage08-case-detail.css', 'person-card', 'person-card pattern');
expect('src/styles/visual-stage08-case-detail.css', 'hero.light', 'hero light pattern');
expect('src/styles/visual-stage08-case-detail.css', 'right-card', 'right-card pattern');
expect('src/styles/visual-stage08-case-detail.css', '@media (max-width: 760px)', 'mobile polish');
expect('src/index.css', '@import "./styles/visual-stage08-case-detail.css";', 'Stage 08 CSS import');

expect('src/pages/CaseDetail.tsx', 'fetchCaseByIdFromSupabase', 'case fetch remains present');
expect('src/pages/CaseDetail.tsx', 'fetchCaseItemsFromSupabase', 'case checklist/items remain present');
expect('src/pages/CaseDetail.tsx', 'fetchActivitiesFromSupabase', 'case activity remains present');
expect('src/pages/CaseDetail.tsx', 'fetchTasksFromSupabase', 'case tasks remain present');
expect('src/pages/CaseDetail.tsx', 'fetchEventsFromSupabase', 'case events remain present');
expect('src/pages/CaseDetail.tsx', 'insertCaseItemToSupabase', 'add missing item flow remains present');
expect('src/pages/CaseDetail.tsx', 'updateCaseItemInSupabase', 'case item status/update remains present');
expect('src/pages/CaseDetail.tsx', 'deleteCaseItemFromSupabase', 'case item delete remains present');
expect('src/pages/CaseDetail.tsx', 'insertTaskToSupabase', 'add task flow remains present');
expect('src/pages/CaseDetail.tsx', 'insertEventToSupabase', 'add event flow remains present');
expect('src/pages/CaseDetail.tsx', 'insertActivityToSupabase', 'activity/note flow remains present');
expect('src/pages/CaseDetail.tsx', 'createClientPortalTokenInSupabase', 'client portal token flow remains present');
expect('src/pages/CaseDetail.tsx', 'buildPortalUrl', 'client portal url flow remains present');
expect('src/pages/CaseDetail.tsx', 'resolveCaseLifecycleV1', 'case lifecycle remains present');
expect('src/pages/CaseDetail.tsx', 'CaseDetailV1CommandCenter', 'case command center remains present');
expect('src/pages/CaseDetail.tsx', 'setCaseLifecycleStatusV1', 'case lifecycle actions remain present');
expect('src/pages/CaseDetail.tsx', 'TabsTrigger', 'case detail tabs remain present');
expectAny('src/pages/CaseDetail.tsx', ['isAddItemOpen', 'setIsAddItemOpen'], 'add item modal remains present');
expectAny('src/pages/CaseDetail.tsx', ['isAddTaskOpen', 'setIsAddTaskOpen'], 'add task modal remains present');
expectAny('src/pages/CaseDetail.tsx', ['isAddEventOpen', 'setIsAddEventOpen'], 'add event modal remains present');
expectAny('src/pages/CaseDetail.tsx', ['isAddNoteOpen', 'setIsAddNoteOpen'], 'add note modal remains present');

console.log('OK: Visual Stage 08 CaseDetail guard passed.');
