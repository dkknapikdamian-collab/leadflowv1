const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('Stage90 client detail exposes one simple finance summary card', () => {
  const clientDetail = read('src/pages/ClientDetail.tsx');
  assert.match(clientDetail, /client-detail-finance-card/);
  assert.match(clientDetail, /Finanse klienta/);
  assert.match(clientDetail, /Możliwy przychód/);
  assert.match(clientDetail, /Wpłacono/);
  assert.match(clientDetail, /Pozostało/);
  assert.match(clientDetail, /isPaidPaymentStatus/);
  assert.match(clientDetail, /potentialTotal/);
  assert.match(clientDetail, /remainingTotal/);
});

test('Stage90 case detail presents financial snapshot in the same model', () => {
  const caseDetail = read('src/pages/CaseDetail.tsx');
  assert.match(caseDetail, /Finanse sprawy/);
  assert.match(caseDetail, /Wartość:/);
  assert.match(caseDetail, /Wpłacono:/);
  assert.match(caseDetail, /Pozostało:/);
  assert.match(caseDetail, /expectedRevenue\?: number/);
  assert.match(caseDetail, /remainingAmount\?: number/);
});

test('Stage90 cases API supports remaining_amount as schema-compatible financial field', () => {
  const casesApi = read('api/cases.ts');
  assert.match(casesApi, /remaining_amount/);
  assert.match(casesApi, /OPTIONAL_CASE_COLUMNS/);
});
