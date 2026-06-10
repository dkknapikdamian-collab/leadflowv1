#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const R8 = 'STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error(R8 + ' FAIL: ' + message); process.exit(1); }
function requireIncludes(text, token, label) { if (!text.includes(token)) fail(label + ': missing "' + token + '"'); }
function segment(text, start, end, label) {
  const a = text.indexOf(start);
  if (a < 0) fail(label + ': segment start missing: ' + start);
  const b = text.indexOf(end, a + start.length);
  if (b < 0) fail(label + ': segment end missing after ' + start + ': ' + end);
  return text.slice(a, b);
}
const caseDetail = read('src/pages/CaseDetail.tsx');
const cases = read('src/pages/Cases.tsx');
const client = read('src/pages/ClientDetail.tsx');
const libCases = read('src/lib/cases.ts');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
requireIncludes(caseDetail, R8, 'CaseDetail');
requireIncludes(cases, R8, 'Cases');
requireIncludes(client, R8, 'ClientDetail');
requireIncludes(libCases, 'CLOSED_CASE_STATUSES', 'cases lib');
requireIncludes(libCases, 'isClosedCaseStatus', 'cases lib');
const header = segment(caseDetail, '<header className="case-detail-header', '</header>', 'CaseDetail header');
const copyIndex = header.indexOf('case-detail-header-copy');
const actionsIndex = header.indexOf('case-detail-header-actions-stage231b0');
if (copyIndex < 0 || actionsIndex < 0 || copyIndex > actionsIndex) fail('CaseDetail header: copy must be before actions');
const closeButton = segment(header, 'data-stage231b0-r8-close-case-button="true"', 'Zamknij sprawę', 'CaseDetail close button');
if (closeButton.includes('CaseDetailTrashButton')) fail('CaseDetail close button must not use CaseDetailTrashButton');
const closeFlow = segment(caseDetail, 'const handleConfirmCloseCaseRecord', 'const handleConfirmReopenCaseRecord', 'CaseDetail close flow');
if (closeFlow.includes('deleteCaseWithRelations')) fail('CaseDetail close flow must not delete');
requireIncludes(closeFlow, "status: 'completed'", 'CaseDetail close flow');
requireIncludes(closeFlow, 'case_lifecycle_completed', 'CaseDetail close flow');
requireIncludes(closeFlow, 'financePreserved: true', 'CaseDetail close flow');
requireIncludes(closeFlow, 'historyPreserved: true', 'CaseDetail close flow');
const restoreFlow = segment(caseDetail, 'handleConfirmRestoreCaseRecord', 'async function handleConfirmDeleteCaseRecord', 'CaseDetail restore flow');
if (restoreFlow.includes('deleteCaseWithRelations')) fail('CaseDetail restore flow must not delete');
requireIncludes(restoreFlow, "status: 'in_progress'", 'CaseDetail restore flow');
requireIncludes(restoreFlow, 'case_lifecycle_reopened', 'CaseDetail restore flow');
requireIncludes(restoreFlow, 'financePreserved: true', 'CaseDetail restore flow');
requireIncludes(restoreFlow, 'historyPreserved: true', 'CaseDetail restore flow');
requireIncludes(cases, "| 'closed'", 'Cases');
requireIncludes(cases, 'const activeCases = useMemo', 'Cases');
requireIncludes(cases, 'const closedCases = useMemo', 'Cases');
requireIncludes(cases, '!isClosedCaseStatus(record.status)', 'Cases');
requireIncludes(cases, 'isClosedCaseStatus(record.status)', 'Cases');
requireIncludes(cases, 'total: activeCases.length', 'Cases stats');
requireIncludes(cases, 'closed: closedCases.length', 'Cases stats');
if (!(
  cases.includes("const sourceCases = caseView === 'closed' ? closedCases : activeCases") ||
  (
    cases.includes('const sourceCases =') &&
    cases.includes("caseView === 'closed' ? closedCases :") &&
    cases.includes("caseView === 'all' ? cases :") &&
    cases.includes('activeCases;')
  )
)) {
  fail('Cases filtered source missing R8/R9 active/closed/all source model');
}
// R9_R2_COMPAT_SOURCE_CASES_MODEL
if (!(cases.includes("setSearchParams({ view: 'closed' })") || cases.includes("setSearchParams({ view })"))) {
  fail('Cases closed URL missing R8/R9 setSearchParams model');
}
// R9_R2_COMPAT_URL_SETTER
requireIncludes(cases, "label: 'Sprawy zamknięte'", 'Cases right rail');
requireIncludes(cases, "value: stats.closed", 'Cases right rail');
requireIncludes(cases, 'Brak zamkniętych spraw', 'Cases closed empty state');
if (!(cases.includes("searchParams.get('view')") || cases.includes('searchParams.get("view")'))) {
  fail('Cases URL reader missing searchParams.get view model');
}
// R9_R2_COMPAT_URL_READER

const toggleCountStage231B0R9 = cases.split('const toggleCaseView = (view: CaseView) => {').length - 1;
if (toggleCountStage231B0R9 !== 1) {
  fail('Cases must contain exactly one toggleCaseView declaration after R9_DUPLICATE_TOGGLE_BUILD_REPAIR, found ' + toggleCountStage231B0R9);
}
if (cases.includes("setCaseView((prev) => (prev === view ? 'all' : view))")) {
  fail('Cases legacy setCaseView((prev) toggle must not remain after R9_DUPLICATE_TOGGLE_BUILD_REPAIR');
}
requireIncludes(cases, 'const setCaseViewStage231B0R8 = (view: CaseView) => {', 'Cases R8 URL-aware case view setter');

const filteredSegment = segment(cases, 'const filteredCases = useMemo', 'const setCaseViewStage231B0R8', 'Cases filtered segment');
if (filteredSegment.includes('return cases.filter')) fail('Cases filteredCases must not return cases.filter directly');
requireIncludes(client, 'const clientRelatedCasesStage231B0R8 = useMemo', 'ClientDetail');
requireIncludes(client, 'const activeClientCases = activeCases', 'ClientDetail');
requireIncludes(client, 'const closedClientCases = closedCases', 'ClientDetail');
requireIncludes(client, 'activeClientCases.map', 'ClientDetail active render');
requireIncludes(client, 'closedClientCases.map', 'ClientDetail closed render');
requireIncludes(client, 'Sprawy zamknięte', 'ClientDetail closed section');
requireIncludes(client, 'Przywróć sprawę', 'ClientDetail restore button');
requireIncludes(client, 'handleRestoreClientCaseStage231B0R8', 'ClientDetail restore handler');
requireIncludes(client, 'updateCaseInSupabase', 'ClientDetail restore handler');
requireIncludes(client, 'case_lifecycle_reopened', 'ClientDetail restore activity');
requireIncludes(client, "mode: 'all_cases'", 'ClientDetail finance all cases');
requireIncludes(client, 'financePreserved: true', 'ClientDetail restore activity');
requireIncludes(client, 'historyPreserved: true', 'ClientDetail restore activity');
requireIncludes(client, 'const mainCase = activeCases[0] || null', 'ClientDetail main case');
if (client.includes('const mainCase = activeCases[0] || cases[0] || null')) fail('ClientDetail mainCase must not fall back to cases[0]');
const clientCasesTab = segment(client, "activeTab === 'cases'", "activeTab === 'history'", 'ClientDetail cases tab');
if (clientCasesTab.includes('cases.filter((caseRecord')) fail('ClientDetail active cases tab must not render raw cases.filter');
requireIncludes(caseCss, 'case-detail-header-actions-stage231b0', 'case CSS');
requireIncludes(caseCss, 'margin-left: auto', 'case CSS');
requireIncludes(caseCss, 'cf-case-detail-close-positive-stage231b0-r8', 'case CSS');
requireIncludes(caseCss, 'cf-case-detail-restore-action-stage231b0-r8', 'case CSS');
requireIncludes(clientCss, 'client-detail-closed-cases-stage231b0-r8', 'client CSS');
requireIncludes(clientCss, 'client-detail-case-smart-card-closed-stage231b0-r8', 'client CSS');
requireIncludes(clientCss, 'client-detail-case-restore-action-stage231b0-r8', 'client CSS');
const r8MutationSurfaces = [
  segment(caseDetail, '<header className="case-detail-header', '</header>', 'CaseDetail R8 header surface'),
  segment(caseDetail, 'const handleConfirmCloseCaseRecord', 'const handleConfirmReopenCaseRecord', 'CaseDetail R8 close surface'),
  segment(caseDetail, 'handleConfirmRestoreCaseRecord', 'async function handleConfirmDeleteCaseRecord', 'CaseDetail R8 restore surface'),
  segment(cases, 'const activeCases = useMemo', 'const leadsById = useMemo', 'Cases R8 stats/source surface'),
  segment(cases, 'const filteredCases = useMemo', 'const setCaseViewStage231B0R8', 'Cases R8 filtered surface'),
  segment(client, 'const clientRelatedCasesStage231B0R8 = useMemo', 'const waitingCaseCount = useMemo', 'ClientDetail R8 relation surface'),
  segment(client, 'handleRestoreClientCaseStage231B0R8', 'STAGE117B: no new/open lead shortcut from ClientDetail', 'ClientDetail R8 restore/render surface'),
  segment(client, "activeTab === 'cases'", "activeTab === 'history'", 'ClientDetail R8 cases tab surface'),
].join('\n');

for (const forbidden of ['commissionAmount: 0', 'commissionPaidAmount: 0', 'payments = []', 'deletePayment', 'localStorage']) {
  if (r8MutationSurfaces.includes(forbidden)) {
    fail('forbidden finance/delete token present in R8 mutation surface: ' + forbidden);
  }
}

console.log(R8 + ' PASS');
