#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    fail(relativePath, 'Missing file');
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function pass(scope, message) {
  results.push({ level: 'PASS', scope, message });
}

function fail(scope, message) {
  results.push({ level: 'FAIL', scope, message });
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing regex: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const files = {
  doc: 'docs/finance/CLOSEFLOW_FINANCE_MODEL_AUDIT_2026-05-09.md',
  script: 'scripts/check-closeflow-finance-model-audit.cjs',
  relationValue: 'src/lib/relation-value.ts',
  supabaseFallback: 'src/lib/supabase-fallback.ts',
  dataContract: 'src/lib/data-contract.ts',
  leadsApi: 'api/leads.ts',
  clientsApi: 'api/clients.ts',
  casesApi: 'api/cases.ts',
  systemApi: 'api/system.ts',
  paymentsApi: 'api/payments.ts',
  leadsPage: 'src/pages/Leads.tsx',
  clientsPage: 'src/pages/Clients.tsx',
  casesPage: 'src/pages/Cases.tsx',
  leadDetail: 'src/pages/LeadDetail.tsx',
  clientDetail: 'src/pages/ClientDetail.tsx',
  caseDetail: 'src/pages/CaseDetail.tsx',
};

const doc = readRequired(files.doc);
readRequired(files.script);
const relationValue = readRequired(files.relationValue);
const fallback = readRequired(files.supabaseFallback);
const dataContract = readRequired(files.dataContract);
const leadsApi = readRequired(files.leadsApi);
const clientsApi = readRequired(files.clientsApi);
const casesApi = readRequired(files.casesApi);
readRequired(files.systemApi);
readRequired(files.leadsPage);
readRequired(files.clientsPage);
readRequired(files.casesPage);
readRequired(files.leadDetail);
readRequired(files.clientDetail);
const caseDetail = readRequired(files.caseDetail);

section('FIN-0 audit document contract');
for (const marker of [
  'FIN-0 — Finance model audit',
  'istnieje',
  'częściowo istnieje',
  'brakuje',
  'nie ruszać',
  'api/payments.ts',
  'src/lib/relation-value.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/data-contract.ts',
  'api/leads.ts',
  'api/clients.ts',
  'api/cases.ts',
  'src/pages/CaseDetail.tsx',
  'FIN-1 — Payments backend contract',
]) {
  assertIncludes(files.doc, doc, marker, 'Audit doc contains: ' + marker);
}

section('Relation value model');
assertIncludes(files.relationValue, relationValue, 'VALUE_KEYS', 'Relation value key list exists');
assertIncludes(files.relationValue, relationValue, 'getRelationValue', 'Relation value parser exists');
assertIncludes(files.relationValue, relationValue, 'buildRelationValueEntries', 'Relation value entries builder exists');
assertIncludes(files.relationValue, relationValue, 'buildRelationFunnelValue', 'Relation funnel value exists');
assertIncludes(files.relationValue, relationValue, 'RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS', 'Relation funnel rule is documented in code');
for (const marker of ['dealValue', 'expected_revenue', 'clientValue', 'contractValue', 'amount', 'price']) {
  assertIncludes(files.relationValue, relationValue, marker, 'Relation value supports: ' + marker);
}

section('Data contract finance fields');
for (const marker of [
  'NormalizedPaymentRecord',
  'normalizePaymentContract',
  'dealValue',
  'expectedRevenue',
  'paidAmount',
  'remainingAmount',
  'currency',
]) {
  assertIncludes(files.dataContract, dataContract, marker, 'Data contract contains: ' + marker);
}

section('Lead finance traces');
for (const marker of [
  'BILLING_STATUSES',
  'BILLING_MODELS',
  'partial_payments',
  'normalizePartialPayments',
  'sumLeadPaidPayments',
  'expected_revenue',
  'paid_amount',
  'remaining_amount',
  'commission_pending',
  'commission_due',
]) {
  assertIncludes(files.leadsApi, leadsApi, marker, 'Leads API contains: ' + marker);
}

section('Case finance traces');
for (const marker of [
  'BILLING_STATUSES',
  'BILLING_MODELS',
  'expected_revenue',
  'paid_amount',
  'remaining_amount',
  'currency',
  'billing_status',
  'billing_model_snapshot',
]) {
  assertIncludes(files.casesApi, casesApi, marker, 'Cases API contains: ' + marker);
}

section('Client finance state');
assertIncludes(files.clientsApi, clientsApi, 'normalizeClientContract', 'Clients API normalizes client contract');
assertIncludes(files.clientsApi, clientsApi, 'clientValue', 'Clients API has only finance comment / trace, not full finance model');
assertIncludes(files.doc, doc, 'Wartość klienta', 'Audit doc explicitly covers client value');

section('Payments frontend and endpoint gap');
for (const marker of [
  'PaymentUpsertInput',
  'fetchPaymentsFromSupabase',
  'createPaymentInSupabase',
  'updatePaymentInSupabase',
  'deletePaymentFromSupabase',
  '/api/payments',
  'normalizePaymentListContract',
]) {
  assertIncludes(files.supabaseFallback, fallback, marker, 'Supabase fallback contains: ' + marker);
}

if (fileExists(files.paymentsApi)) {
  pass(files.paymentsApi, 'api/payments.ts exists; FIN-0 should be re-read before FIN-1');
} else {
  pass(files.paymentsApi, 'api/payments.ts is missing as documented by FIN-0');
  assertIncludes(files.doc, doc, 'api/payments.ts\n\nnie jest potwierdzony jako istniejący', 'Audit doc documents missing payments endpoint');
}

section('Case detail finance UI traces');
for (const marker of [
  'fetchPaymentsFromSupabase',
  'createPaymentInSupabase',
  'CasePaymentRecord',
  'getCaseFinanceSummary',
  'getCaseExpectedRevenue',
  'billingStatusLabel',
]) {
  assertIncludes(files.caseDetail, caseDetail, marker, 'CaseDetail contains: ' + marker);
}

section('Migration awareness');
const migrationsDir = path.join(root, 'supabase', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  pass('supabase/migrations', 'Migrations directory is not present in this checkout; audit marks payments migration as do potwierdzenia');
} else {
  const migrationFiles = fs.readdirSync(migrationsDir).filter((name) => name.endsWith('.sql'));
  const migrationText = migrationFiles.map((name) => {
    try { return fs.readFileSync(path.join(migrationsDir, name), 'utf8'); }
    catch { return ''; }
  }).join('\n');
  if (/create\s+table[\s\S]{0,80}payments|payments\s*\(/i.test(migrationText)) {
    pass('supabase/migrations', 'payments table appears in migrations');
  } else {
    pass('supabase/migrations', 'payments table not found in migrations scan; audit marks migration as do potwierdzenia');
  }
}
assertIncludes(files.doc, doc, 'Migracja tabeli `payments`', 'Audit doc covers payments migration status');

section('No implementation drift in FIN-0');
assertRegex(files.doc, doc, /FIN-0 nie może zmieniać działania aplikacji[\s\S]*Nie ruszać:/, 'Audit explicitly forbids implementation changes in FIN-0');
assertIncludes(files.doc, doc, 'Ten etap ma tylko udokumentować stan i dodać guard audytu.', 'Audit is documentation/guard only');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0 guard failed.');
  process.exit(1);
}
console.log('\nCLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0_OK');
