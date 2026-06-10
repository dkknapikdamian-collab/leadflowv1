const fs = require('fs');

function fail(message) {
  console.error('STAGE231B0_R12_CASES_RECORD_SCOPE_RUNTIME_REPAIR FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function requireIncludes(text, token, label) {
  if (!text.includes(token)) fail(label + ': missing "' + token + '"');
}

const cases = read('src/pages/Cases.tsx');


requireIncludes(cases, 'STAGE231B0_R12_R7_FINAL_CASES_RUNTIME_CONTRACT_RESCUE', 'R12-R7 marker');
requireIncludes(cases, 'const activeCases = useMemo', 'activeCases useMemo');
requireIncludes(cases, '() => cases.filter((record) => !isClosedCaseStatus(record.status))', 'activeCases scoped filter');
requireIncludes(cases, 'const closedCases = useMemo', 'closedCases useMemo');
requireIncludes(cases, '() => cases.filter((record) => isClosedCaseStatus(record.status))', 'closedCases scoped filter');
requireIncludes(cases, 'renderClosedCaseBannerStage231B0R12', 'closed banner helper');
requireIncludes(cases, 'cf-case-closed-banner-stage231b0-r9', 'closed banner class');
requireIncludes(cases, 'SPRAWA ZAMKNIĘTA', 'closed banner label');
requireIncludes(cases, 'data-stage231b0-r9-closed-case-banner', 'closed banner data marker');
requireIncludes(cases, "searchParams.get('view')", 'URL view reader');
requireIncludes(cases, "caseView === 'all' ? cases :", 'all/open/closed model');
requireIncludes(cases, 'Otwarte sprawy', 'open shortcut');
requireIncludes(cases, 'Sprawy zamknięte', 'closed shortcut');
requireIncludes(cases, 'Wszystkie sprawy', 'all shortcut');

const activeCount = (cases.match(/const activeCases = useMemo/g) || []).length;
const closedCount = (cases.match(/const closedCases = useMemo/g) || []).length;
if (activeCount !== 1) fail('expected one activeCases useMemo, found ' + activeCount);
if (closedCount !== 1) fail('expected one closedCases useMemo, found ' + closedCount);

const unsafeClosedRecordCount = (cases.match(/closedRecordStage231B0R8/g) || []).length;
if (unsafeClosedRecordCount > 0) fail('closedRecordStage231B0R8 returned');

const unsafeRecordOptional = cases.includes('isClosedCaseStatus(record?.status)');
if (unsafeRecordOptional) fail('unsafe isClosedCaseStatus(record?.status) returned');

const allowedRecordStatusFilters = [
  '() => cases.filter((record) => !isClosedCaseStatus(record.status))',
  '() => cases.filter((record) => isClosedCaseStatus(record.status))',
];
const recordStatusOccurrences = (cases.match(/isClosedCaseStatus\(record\.status\)/g) || []).length;
if (recordStatusOccurrences !== allowedRecordStatusFilters.length) {
  fail('record.status is allowed only in active/closed filters; found occurrences=' + recordStatusOccurrences);
}



console.log('STAGE231B0_R12_CASES_RECORD_SCOPE_RUNTIME_REPAIR PASS');
