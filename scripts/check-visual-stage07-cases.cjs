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

function rejectIncludes(file, text, label) {
  const content = read(file);
  if (content.includes(text)) throw new Error(`${file}: forbidden ${label || text}`);
  console.log(`OK: ${file} excludes ${label || text}`);
}

expectIncludes('src/components/Layout.tsx', 'VISUAL_STAGE_07_CASES_ROUTE_SCOPE', 'Stage07 route scope marker');
expectIncludes('src/components/Layout.tsx', "const isCasesRoute = location.pathname === '/cases';", 'cases route detection');
expectIncludes('src/components/Layout.tsx', 'main-cases', 'main-cases scoped class');
expectIncludes('src/components/Layout.tsx', "data-visual-stage-cases={isCasesRoute ? '07-cases' : undefined}", 'cases visual data marker');

rejectIncludes('src/index.css', 'visual-stage07-cases.css', 'inactive Stage07 Cases CSS import');
expectIncludes('src/pages/Cases.tsx', "../styles/closeflow-page-header-runtime.css", 'current Cases page header adapter');
expectIncludes('src/pages/Cases.tsx', "../styles/closeflow-record-list-source-truth.css", 'current Cases record-list CSS import');
expectIncludes('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expectIncludes('src/styles/owners/closeflow-page-adapters.css', '.main-cases', 'canonical Cases page adapter');
expectIncludes('src/styles/closeflow-record-list-source-truth.css', 'table-card', 'scoped Cases record-list adapter');
expectIncludes('src/styles/owners/closeflow-responsive-adapters.css', '@media (max-width: 760px)', 'canonical mobile adapter');

expectIncludes('src/pages/Cases.tsx', 'fetchCasesFromSupabase', 'case read flow remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchLeadsFromSupabase', 'lead context remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchTasksFromSupabase', 'task context remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchEventsFromSupabase', 'event context remains present');
expectIncludes('src/pages/Cases.tsx', 'createCaseInSupabase', 'create case flow remains present');
expectIncludes('src/pages/Cases.tsx', 'deleteCaseWithRelations', 'delete case with relations remains present');
expectIncludes('src/pages/Cases.tsx', 'ConfirmDialog', 'delete confirmation remains present');
expectIncludes('src/pages/Cases.tsx', 'resolveCaseLifecycleV1', 'case lifecycle remains present');
expectIncludes('src/pages/Cases.tsx', 'StatShortcutCard', 'case metric filters remain present');
for (const view of ["'open'", "'closed'", "'all'", "'waiting'", "'blocked'", "'approval'", "'ready'", "'needs_next_step'", "'linked'"]) {
  expectIncludes('src/pages/Cases.tsx', view, `current CaseView token ${view}`);
}
expectIncludes('src/pages/Cases.tsx', "route: '/cases?view=closed'", 'closed Cases route contract');
expectIncludes('src/pages/Cases.tsx', "caseView === 'linked' && Boolean(record.leadId)", 'source lead relation filter remains present');
expectIncludes('src/pages/Cases.tsx', "import { caseDetailPath } from '../lib/routes';", 'shared CaseDetail route helper import');
expectIncludes('src/pages/Cases.tsx', 'to={caseDetailPath(record.id)}', 'CaseDetail links use shared route helper');
expectIncludes('src/pages/Cases.tsx', 'searchQuery', 'case search remains present');
expectIncludes('src/pages/Cases.tsx', 'isCreateCaseOpen', 'create modal remains present');
expectIncludes('src/pages/Cases.tsx', 'handleSelectClientSuggestion', 'client suggestions remain present');

console.log('OK: Visual Stage07 Cases guard reconciled with current Cases source truth.');
