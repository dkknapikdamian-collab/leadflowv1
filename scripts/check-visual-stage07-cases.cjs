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

expectIncludes('src/components/Layout.tsx', 'VISUAL_STAGE_07_CASES_ROUTE_SCOPE', 'Stage 07 route scope marker');
expectIncludes('src/components/Layout.tsx', "const isCasesRoute = location.pathname === '/cases';", 'cases route detection');
expectIncludes('src/components/Layout.tsx', 'main-cases', 'main-cases scoped class');
expectIncludes('src/components/Layout.tsx', "data-visual-stage-cases={isCasesRoute ? '07-cases' : undefined}", 'cases visual data marker');

expectIncludes('src/styles/visual-stage07-cases.css', 'VISUAL_STAGE_07_CASES', 'Stage 07 CSS marker');
expectIncludes('src/styles/visual-stage07-cases.css', '.main-cases', 'scoped Cases selector');
expectIncludes('src/styles/visual-stage07-cases.css', 'grid-4', 'grid-4 pattern');
expectIncludes('src/styles/visual-stage07-cases.css', 'table-card', 'table-card pattern');
expectIncludes('src/styles/visual-stage07-cases.css', 'right-card', 'right-card pattern');
expectIncludes('src/styles/visual-stage07-cases.css', 'statusline', 'statusline pattern');
expectIncludes('src/styles/visual-stage07-cases.css', '@media (max-width: 760px)', 'mobile polish');
expectIncludes('src/index.css', '@import "./styles/visual-stage07-cases.css";', 'Stage 07 CSS import');

expectIncludes('src/pages/Cases.tsx', 'fetchCasesFromSupabase', 'case read flow remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchLeadsFromSupabase', 'lead context remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchTasksFromSupabase', 'task context remains present');
expectIncludes('src/pages/Cases.tsx', 'fetchEventsFromSupabase', 'event context remains present');
expectIncludes('src/pages/Cases.tsx', 'createCaseInSupabase', 'create case flow remains present');
expectIncludes('src/pages/Cases.tsx', 'deleteCaseWithRelations', 'delete case with relations remains present');
expectIncludes('src/pages/Cases.tsx', 'ConfirmDialog', 'delete confirmation remains present');
expectIncludes('src/pages/Cases.tsx', 'resolveCaseLifecycleV1', 'case lifecycle remains present');
expectIncludes('src/pages/Cases.tsx', 'StatShortcutCard', 'case metric filters remain present');
expectIncludes('src/pages/Cases.tsx', "type CaseView = 'all' | 'waiting' | 'blocked' | 'approval' | 'ready' | 'needs_next_step' | 'linked';", 'case filters contract remains present');
expectIncludes('src/pages/Cases.tsx', 'searchQuery', 'case search remains present');
expectIncludes('src/pages/Cases.tsx', 'isCreateCaseOpen', 'create modal remains present');
expectIncludes('src/pages/Cases.tsx', 'handleSelectClientSuggestion', 'client suggestions remain present');
const casesContent = read('src/pages/Cases.tsx');
if (casesContent.includes("to={`/cases/${record.id}`}") || casesContent.includes("to={`/case/${record.id}`}")) {
  console.log('OK: src/pages/Cases.tsx contains CaseDetail link remains present');
} else {
  throw new Error('src/pages/Cases.tsx: missing CaseDetail link remains present');
}
if (casesContent.includes("to={`/leads/${record.leadId}`}") || casesContent.includes("to={`/leads/${String(record.leadId)}`}") || casesContent.includes('Otwórz historię pozyskania')) {
  console.log('OK: src/pages/Cases.tsx contains source lead link remains present');
} else {
  throw new Error('src/pages/Cases.tsx: missing source lead link remains present');
}

console.log('OK: Visual Stage 07 Cases guard passed.');
