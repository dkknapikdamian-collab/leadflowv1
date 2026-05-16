const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Stage91 LeadDetail exposes finance panel with payment actions', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');
  assert.match(leadDetail, /data-lead-finance-panel/);
  assert.match(leadDetail, /Finanse leada/);
  assert.match(leadDetail, /Potencja\u0142:/);
  assert.match(leadDetail, /Wp\u0142acono:/);
  assert.match(leadDetail, /Do zap\u0142aty:/);
  assert.match(leadDetail, /Status p\u0142atno\u015Bci:/);
  assert.match(leadDetail, /Dodaj zaliczk\u0119/);
  assert.match(leadDetail, /P\u0142atno\u015B\u0107 cz\u0119\u015Bciowa/);
  assert.match(leadDetail, /fetchPaymentsFromSupabase\(\{ leadId \}\)/);
  assert.match(leadDetail, /createPaymentInSupabase/);
});

test('Stage91 CaseDetail exposes settlement panel with finance actions', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  assert.match(caseDetail, /data-case-finance-panel/);
  assert.match(caseDetail, /Rozliczenie sprawy/);
  assert.match(caseDetail, /Warto\u015B\u0107:/);
  assert.match(caseDetail, /Wp\u0142acono:/);
  assert.match(caseDetail, /Pozosta\u0142o:/);
  assert.match(caseDetail, /Dodaj zaliczk\u0119/);
  assert.match(caseDetail, /P\u0142atno\u015B\u0107 cz\u0119\u015Bciowa/);
  assert.match(caseDetail, /Oznacz op\u0142acone/);
  assert.match(caseDetail, /fetchPaymentsFromSupabase\(\{ caseId \}\)/);
});

test('Stage91 lead service handoff prefers payments as source of paid amount', () => {
  const leadsApi = read('api/leads.ts');
  assert.match(leadsApi, /sumLeadPaidPayments/);
  assert.match(leadsApi, /PAID_PAYMENT_STATUSES/);
  assert.match(leadsApi, /remaining_amount/);
});
