#!/usr/bin/env node
const fs = require('fs');
const cp = require('child_process');

const STAGE = 'STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION';

function read(path) {
  if (!fs.existsSync(path)) fail(`missing file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}
function fail(message) {
  console.error(`${STAGE} FAIL: ${message}`);
  process.exit(1);
}
function assertIncludes(label, text, token) {
  if (!text.includes(token)) fail(`${label}: missing "${token}"`);
}
function assertNotIncludes(label, text, token) {
  if (text.includes(token)) fail(`${label}: forbidden "${token}"`);
}
function segmentBetween(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  if (start === -1) fail(`segment start missing: ${startToken}`);
  const end = text.indexOf(endToken, start + startToken.length);
  if (end === -1) fail(`segment end missing after ${startToken}: ${endToken}`);
  return text.slice(start, end);
}

const libCases = read('src/lib/cases.ts');
const caseDetail = read('src/pages/CaseDetail.tsx');
const casesPage = read('src/pages/Cases.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');

for (const [label, text] of [
  ['src/lib/cases.ts', libCases],
  ['src/pages/CaseDetail.tsx', caseDetail],
  ['src/pages/Cases.tsx', casesPage],
  ['src/pages/ClientDetail.tsx', clientDetail],
]) {
  assertIncludes(label, text, STAGE);
}

assertIncludes('src/lib/cases.ts', libCases, 'export function isClosedCaseStatus');
assertIncludes('src/lib/cases.ts', libCases, 'export function getCaseStatusLabel');
assertIncludes('src/lib/cases.ts', libCases, "'completed'");
assertIncludes('src/lib/cases.ts', libCases, "'closed'");
assertIncludes('src/lib/cases.ts', libCases, "'archived'");
assertIncludes('src/lib/cases.ts', libCases, 'Zamknięta');

assertIncludes('CaseDetail', caseDetail, 'Zamknij sprawę');
assertIncludes('CaseDetail', caseDetail, 'Przywróć sprawę');
assertIncludes('CaseDetail', caseDetail, 'Usuń sprawę');
assertIncludes('CaseDetail', caseDetail, 'case_lifecycle_completed');
assertIncludes('CaseDetail', caseDetail, 'case_lifecycle_reopened');
assertIncludes('CaseDetail', caseDetail, 'handleConfirmReopenCaseRecord');
assertIncludes('CaseDetail', caseDetail, 'isClosedCaseStatus(caseData?.status)');
assertIncludes('CaseDetail', caseDetail, 'Sprawa wróci do aktywnych. Historia i rozliczenia zostaną zachowane.');

const closeSegment = segmentBetween(caseDetail, 'const handleConfirmCloseCaseRecord', 'const handleConfirmReopenCaseRecord');
assertNotIncludes('CaseDetail close flow', closeSegment, 'deleteCaseWithRelations');
assertNotIncludes('CaseDetail close flow', closeSegment, 'commissionAmount: 0');
assertNotIncludes('CaseDetail close flow', closeSegment, 'commissionPaidAmount: 0');
assertNotIncludes('CaseDetail close flow', closeSegment, 'paidAmount: 0');
assertNotIncludes('CaseDetail close flow', closeSegment, 'payments = []');

const reopenSegment = segmentBetween(caseDetail, 'const handleConfirmReopenCaseRecord', 'const refreshStatusAfterMutation');
assertNotIncludes('CaseDetail reopen flow', reopenSegment, 'deleteCaseWithRelations');
assertNotIncludes('CaseDetail reopen flow', reopenSegment, 'commissionAmount: 0');
assertNotIncludes('CaseDetail reopen flow', reopenSegment, 'commissionPaidAmount: 0');
assertNotIncludes('CaseDetail reopen flow', reopenSegment, 'paidAmount: 0');
assertNotIncludes('CaseDetail reopen flow', reopenSegment, 'payments = []');

assertIncludes('Cases', casesPage, "| 'closed'");
assertIncludes('Cases', casesPage, 'Sprawy zamknięte');
assertIncludes('Cases', casesPage, '/cases?view=closed');
assertIncludes('Cases', casesPage, 'isClosedCaseStatus(record.status)');
assertIncludes('Cases', casesPage, "caseView === 'closed'");
assertIncludes('Cases', casesPage, "caseView === 'all' && !isClosedCase");

assertIncludes('ClientDetail', clientDetail, 'Sprawy aktywne');
assertIncludes('ClientDetail', clientDetail, 'Sprawy zamknięte');
assertIncludes('ClientDetail', clientDetail, 'Przywróć sprawę');
assertIncludes('ClientDetail', clientDetail, 'handleRestoreClientCaseStage231B0R7');
assertIncludes('ClientDetail', clientDetail, 'case_lifecycle_reopened');
assertIncludes('ClientDetail', clientDetail, "mode: 'all_cases'");
assertIncludes('ClientDetail', clientDetail, 'closedClientCasesStage231B0R7');
assertIncludes('ClientDetail', clientDetail, 'activeClientCasesStage231B0R7');

assertIncludes('case CSS', caseCss, 'cf-case-detail-close-action-stage231b0-r7');
assertIncludes('client CSS', clientCss, 'client-detail-case-smart-card-closed-stage231b0-r7');

const stagedForbidden = ['_LOCAL_CHECKS', '2026-06-09_STAGE230C'];
let staged = '';
try {
  staged = cp.execSync('git diff --cached --name-only', { encoding: 'utf8' });
} catch {}
for (const token of stagedForbidden) {
  if (staged.includes(token)) fail(`forbidden staged artifact: ${token}`);
}

console.log(`${STAGE} PASS`);
