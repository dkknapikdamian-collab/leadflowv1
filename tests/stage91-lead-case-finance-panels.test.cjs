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
  assert.match(leadDetail, /Potencjał:/);
  assert.match(leadDetail, /Wpłacono:/);
  assert.match(leadDetail, /Do zapłaty:/);
  assert.match(leadDetail, /Status płatności:/);
  assert.match(leadDetail, /Dodaj zaliczkę/);
  assert.match(leadDetail, /Płatność częściowa/);
  assert.match(leadDetail, /fetchPaymentsFromSupabase\(\{ leadId \}\)/);
  assert.match(leadDetail, /createPaymentInSupabase/);
});

test('Stage91 CaseDetail exposes settlement panel with finance actions', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  assert.match(caseDetail, /data-case-finance-panel/);
  assert.match(caseDetail, /Rozliczenie sprawy/);
  assert.match(caseDetail, /Wartość:/);
  assert.match(caseDetail, /Wpłacono:/);
  assert.match(caseDetail, /Pozostało:/);
  assert.match(caseDetail, /Dodaj zaliczkę/);
  assert.match(caseDetail, /Płatność częściowa/);
  assert.match(caseDetail, /Oznacz opłacone/);
  assert.match(caseDetail, /fetchPaymentsFromSupabase\(\{ caseId \}\)/);
});

test('Stage91 lead service handoff prefers payments as source of paid amount', () => {
  const leadsApi = read('api/leads.ts');
  assert.match(leadsApi, /sumLeadPaidPayments/);
  assert.match(leadsApi, /PAID_PAYMENT_STATUSES/);
  assert.match(leadsApi, /remaining_amount/);
});
