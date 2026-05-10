#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || `Found ${needle}`);
  else fail(scope, `${message || 'Missing required marker'} [needle=${JSON.stringify(needle)}]`);
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || `Matched ${regex}`);
  else fail(scope, `${message || 'Missing required regex'} [regex=${regex}]`);
}
function assertNotIncludes(scope, content, needle, message) {
  if (!content.includes(needle)) pass(scope, message || `Forbidden absent ${needle}`);
  else fail(scope, `${message || 'Forbidden marker present'} [needle=${JSON.stringify(needle)}]`);
}
function section(title) { console.log(`\n== ${title} ==`); }

const files = {
  apiPayments: 'api/payments.ts',
  apiCases: 'api/cases.ts',
  apiLeads: 'api/leads.ts',
  dataContract: 'src/lib/data-contract.ts',
  fallback: 'src/lib/supabase-fallback.ts',
  financeTypes: 'src/lib/finance/finance-types.ts',
  financeNormalize: 'src/lib/finance/finance-normalize.ts',
  migration: 'supabase/migrations/20260509_finance_contract_fin2.sql',
  doc: 'docs/finance/CLOSEFLOW_FINANCE_DB_API_CONTRACT_2026-05-09.md',
  check: 'scripts/check-closeflow-finance-db-api-contract.cjs',
};

const apiPayments = readRequired(files.apiPayments);
const apiCases = readRequired(files.apiCases);
const apiLeads = readRequired(files.apiLeads);
const dataContract = readRequired(files.dataContract);
const fallback = readRequired(files.fallback);
const financeTypes = readRequired(files.financeTypes);
const financeNormalize = readRequired(files.financeNormalize);
const migration = readRequired(files.migration);
const doc = readRequired(files.doc);
readRequired(files.check);

section('FIN-1 dependency still present');
for (const marker of [
  "COMMISSION_MODES = ['none', 'percent', 'fixed']",
  "COMMISSION_BASES = ['contract_value', 'paid_amount', 'custom']",
  "PAYMENT_TYPES = ['deposit', 'partial', 'final', 'commission', 'refund', 'other']",
  "PAYMENT_STATUSES = ['planned', 'due', 'paid', 'cancelled']",
]) {
  assertIncludes(files.financeTypes, financeTypes, marker, `FIN-1 type marker exists: ${marker}`);
}
for (const marker of ['normalizePaymentType', 'normalizePaymentStatus', 'normalizeCommissionMode', 'normalizeCommissionBase', 'normalizeCommissionStatus']) {
  assertIncludes(files.financeNormalize, financeNormalize, marker, `FIN-1 normalize helper exists: ${marker}`);
}

section('Payments API');
for (const marker of [
  'FIN-2_DATABASE_API_FINANCE_CONTRACT_V1',
  "from '../src/lib/finance/finance-normalize.js'",
  "from '../src/lib/finance/finance-calculations.js'",
  "normalizePaymentContract",
  "resolveRequestWorkspaceId",
  "assertWorkspaceWriteAccess",
  "requireScopedRow('payments'",
  "insertWithVariants(['payments']",
  "updateByIdScoped('payments'",
  "deleteByIdScoped('payments'",
  "withWorkspaceFilter(`payments?select=*",
  'workspace_id',
  'lead_id',
  'client_id',
  'case_id',
  'paid_at',
  'due_at',
]) {
  assertIncludes(files.apiPayments, apiPayments, marker, `Payments API contains: ${marker}`);
}
assertRegex(files.apiPayments, apiPayments, /req\.method === 'GET'[\s\S]*req\.method === 'POST'[\s\S]*req\.method === 'PATCH'[\s\S]*req\.method === 'DELETE'/, 'Payments API supports GET/POST/PATCH/DELETE');

section('Database migration');
for (const marker of [
  'FIN-2_DATABASE_API_FINANCE_CONTRACT_V1',
  'alter table if exists public.cases',
  'contract_value numeric',
  'commission_mode text',
  'commission_base text',
  'commission_rate numeric',
  'commission_amount numeric',
  'commission_status text',
  'paid_amount numeric',
  'remaining_amount numeric',
  'create table if not exists public.payments',
  'workspace_id uuid',
  'lead_id uuid',
  'client_id uuid',
  'case_id uuid',
  "type in ('deposit', 'partial', 'final', 'commission', 'refund', 'other')",
  "status in ('planned', 'due', 'paid', 'cancelled')",
  'alter table public.payments enable row level security',
]) {
  assertIncludes(files.migration, migration, marker, `Migration contains: ${marker}`);
}

section('Case API contract');
for (const marker of [
  'contract_value',
  'commission_mode',
  'commission_base',
  'commission_rate',
  'commission_amount',
  'commission_status',
  'paid_amount',
  'remaining_amount',
  'normalizeCommissionMode',
  'normalizeCommissionBase',
  'normalizeCommissionStatus',
]) {
  assertIncludes(files.apiCases, apiCases, marker, `cases.ts contains finance marker: ${marker}`);
}
for (const marker of ['contract_value', 'commission_mode', 'commission_base', 'commission_rate', 'commission_amount', 'commission_status']) {
  assertIncludes(files.apiLeads, apiLeads, marker, `leads.ts lead->case payload contains: ${marker}`);
}

section('Data contract and frontend API client');
for (const marker of [
  "from './finance/finance-normalize.js'",
  'contractValue',
  'commissionMode',
  'commissionBase',
  'commissionRate',
  'commissionAmount',
  'commissionStatus',
  'normalizePaymentType',
  'normalizePaymentStatus',
]) {
  assertIncludes(files.dataContract, dataContract, marker, `data-contract contains: ${marker}`);
}
for (const marker of [
  'type PaymentUpsertInput',
  'caseId?: string | null',
  'paidAt?: string | null',
  'dueAt?: string | null',
  "callApi<Record<string, unknown>[]>(`/api/payments",
  "createPaymentInSupabase",
  "updatePaymentInSupabase",
  "deletePaymentFromSupabase",
]) {
  assertIncludes(files.fallback, fallback, marker, `supabase-fallback contains: ${marker}`);
}
assertNotIncludes(files.fallback, fallback, 'api/payments.ts missing', 'No stale payments missing marker');

section('Documentation');
for (const marker of [
  'FIN-2',
  'Database/API finance contract',
  'contract_value',
  'commission_mode',
  'commission_base',
  'commission_rate',
  'commission_amount',
  'commission_status',
  'payments',
  'workspace_id',
  'FIN-3',
]) {
  assertIncludes(files.doc, doc, marker, `doc contains: ${marker}`);
}

section('Report');
for (const item of results) console.log(`${item.level} ${item.scope}: ${item.message}`);
const failed = results.filter((item) => item.level === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_FINANCE_DB_API_CONTRACT_FIN2');
  process.exit(1);
}
console.log('\nCLOSEFLOW_FINANCE_DB_API_CONTRACT_FIN2_OK');
