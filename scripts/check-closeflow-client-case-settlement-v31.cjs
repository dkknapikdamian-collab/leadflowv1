const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}
function fail(message) {
  console.error('CLOSEFLOW_CLIENT_CASE_SETTLEMENT_V31_FAIL: ' + message);
  process.exit(1);
}

const guard = read('scripts/check-closeflow-supabase-fallback-named-exports-v1.cjs');
if (!guard.includes('function collectImportDeclarations(text)')) fail('supabase-fallback guard does not use bounded import declarations');
if (!guard.includes('function stripImportComments(block)')) fail('supabase-fallback guard does not strip import comments');
if (guard.includes('.replace(/(^|')) fail('supabase-fallback guard still contains malformed multiline regex fragment');
if (!guard.includes('createCaseTemplateInSupabase imported by')) fail('supabase-fallback guard missing import-comment false-positive sentinel');

const leadDetail = read('src/pages/LeadDetail.tsx');
if (!leadDetail.includes('updateCaseInSupabase')) fail('LeadDetail missing updateCaseInSupabase import/use after V30');
if (!leadDetail.includes('leadFinancePanel')) fail('LeadDetail missing dynamic finance panel');
if (!leadDetail.includes('remaining')) fail('LeadDetail missing remaining settlement calculation');

const clients = read('src/pages/Clients.tsx');
if (!clients.includes('STAGE35_REAL_CLIENT_VALUE')) fail('Clients missing real client value marker');
if (clients.includes('const finalValue = paymentValue > 0')) fail('Clients still prioritizes payment value as relation value');

const caseDetail = read('src/pages/CaseDetail.tsx');
if (!caseDetail.includes('function getCaseExpectedRevenue')) fail('CaseDetail missing expected revenue resolver');
if (!caseDetail.includes('remainingAmount')) fail('CaseDetail missing remainingAmount support');

console.log('CLOSEFLOW_CLIENT_CASE_SETTLEMENT_V31_CHECK_OK');
