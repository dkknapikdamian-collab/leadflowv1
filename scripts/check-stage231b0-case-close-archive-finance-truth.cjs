#!/usr/bin/env node
const fs = require('fs');

const stage = 'STAGE231B0_CASE_CLOSE_ARCHIVE_FINANCE_TRUTH';

function fail(message) {
  console.error(stage + ' FAIL: ' + message);
  process.exit(1);
}

function requireIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(label + ': missing "' + needle + '"');
}

function read(path) {
  if (!fs.existsSync(path)) fail('missing file: ' + path);
  return fs.readFileSync(path, 'utf8');
}

const caseDetail = read('src/pages/CaseDetail.tsx');
requireIncludes(caseDetail, stage, 'stage marker');
requireIncludes(caseDetail, 'Zamknij sprawę', 'close label');
requireIncludes(caseDetail, 'Sprawa zamknięta', 'closed label');
requireIncludes(caseDetail, 'Sprawa zostanie zamknięta. Historia i rozliczenia zostaną zachowane.', 'confirm copy');
requireIncludes(caseDetail, 'handleConfirmCloseCaseRecord', 'close handler');
requireIncludes(caseDetail, 'updateCaseInSupabase', 'case update helper');
requireIncludes(caseDetail, 'status: \'completed\'', 'completed status update');
requireIncludes(caseDetail, 'case_lifecycle_completed', 'close activity event type');
requireIncludes(caseDetail, 'financePreserved: true', 'finance preservation marker');
requireIncludes(caseDetail, 'historyPreserved: true', 'history preservation marker');
requireIncludes(caseDetail, 'data-stage231b0-close-case-button="true"', 'close button marker');
requireIncludes(caseDetail, 'data-stage231b0-emergency-delete-case-button="true"', 'emergency delete marker');
requireIncludes(caseDetail, 'deleteCaseWithRelations', 'emergency delete still available');
requireIncludes(caseDetail, 'CaseSettlementSection', 'case settlement section import/render');

const handlerStart = caseDetail.indexOf('const handleConfirmCloseCaseRecord');
if (handlerStart < 0) fail('close handler body not found');
const handlerEnd = caseDetail.indexOf('const refreshStatusAfterMutation', handlerStart);
if (handlerEnd < 0) fail('close handler end anchor not found');
const closeBody = caseDetail.slice(handlerStart, handlerEnd);

for (const forbidden of [
  'deleteCaseWithRelations',
  'deletePayment',
  'commissionPaidAmount: 0',
  'commissionAmount: 0',
  'paidAmount: 0',
  'payments = []',
]) {
  if (closeBody.includes(forbidden)) fail('close flow contains forbidden token: ' + forbidden);
}

if (closeBody.includes('confirmTone="destructive"')) fail('close confirm must not be destructive');

read('src/components/finance/CaseSettlementSection.tsx');
if (fs.existsSync('src/components/finance/CaseSettlementPanel.tsx')) read('src/components/finance/CaseSettlementPanel.tsx');

console.log(stage + ' PASS');
