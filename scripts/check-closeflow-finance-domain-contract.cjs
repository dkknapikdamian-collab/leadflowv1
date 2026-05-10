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
  else fail(scope, `${message || 'Missing'} [needle=${JSON.stringify(needle)}]`);
}
function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || `Matched ${regex}`);
  else fail(scope, `${message || 'Missing regex'} [regex=${regex}]`);
}
function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || `Forbidden absent ${regex}`);
  else fail(scope, `${message || 'Forbidden present'} [regex=${regex}]`);
}
function section(title) { console.log(`\n== ${title} ==`); }

const files = {
  types: 'src/lib/finance/finance-types.ts',
  calculations: 'src/lib/finance/finance-calculations.ts',
  normalize: 'src/lib/finance/finance-normalize.ts',
  doc: 'docs/finance/CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_2026-05-09.md',
};

const types = readRequired(files.types);
const calculations = readRequired(files.calculations);
const normalize = readRequired(files.normalize);
const doc = readRequired(files.doc);

section('FIN-1 files');
for (const file of Object.values(files)) {
  if (fs.existsSync(path.join(root, file))) pass(file, 'exists');
}

section('Finance type contract');
for (const marker of [
  "CLOSEFLOW_FINANCE_DOMAIN_CONTRACT = 'FIN-1_CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_V1'",
  "COMMISSION_MODES = ['none', 'percent', 'fixed'] as const",
  "export type CommissionMode = typeof COMMISSION_MODES[number]",
  "COMMISSION_BASES = ['contract_value', 'paid_amount', 'custom'] as const",
  "export type CommissionBase = typeof COMMISSION_BASES[number]",
  "'not_set'",
  "'expected'",
  "'due'",
  "'partially_paid'",
  "'paid'",
  "'overdue'",
  "PAYMENT_TYPES = ['deposit', 'partial', 'final', 'commission', 'refund', 'other'] as const",
  "export type PaymentType = typeof PAYMENT_TYPES[number]",
  "PAYMENT_STATUSES = ['planned', 'due', 'paid', 'cancelled'] as const",
  "export type PaymentStatus = typeof PAYMENT_STATUSES[number]",
  'export type FinancePayment',
  'export type CommissionConfig',
  'export type FinanceSummary',
]) {
  assertIncludes(files.types, types, marker, `Type contract contains ${marker}`);
}

section('Finance calculations');
for (const marker of [
  'export function normalizeFinanceNumber',
  'export function calculatePaidAmount',
  'export function calculatePlannedAmount',
  'export function calculateDueAmount',
  'export function calculateRefundedAmount',
  'export function calculatePaidCommissionAmount',
  'export function calculateContractValue',
  'export function calculateRemainingAmount',
  'export function calculateCommissionBaseAmount',
  'export function calculateCommissionAmount',
  'export function resolveCommissionStatus',
  'export function buildFinanceSummary',
  "payment.type === 'commission'",
  "payment.type === 'refund'",
  "config.mode === 'none'",
  "config.mode === 'fixed'",
  "config.base === 'paid_amount'",
  "config.base === 'custom'",
]) {
  assertIncludes(files.calculations, calculations, marker, `Calculation contract contains ${marker}`);
}
assertRegex(files.calculations, calculations, /remainingAmount:\s*calculateRemainingAmount\(contractValue,\s*paidAmount\)/, 'Summary computes remaining amount from contract value and paid amount');

section('Finance normalization');
for (const marker of [
  'export function normalizeCurrency',
  'export function normalizePaymentType',
  'export function normalizePaymentStatus',
  'export function normalizeCommissionMode',
  'export function normalizeCommissionBase',
  'export function normalizeCommissionStatus',
  'export function normalizeFinancePayment',
  'export function normalizeFinancePayments',
  'export function normalizeCommissionConfig',
  "normalized === 'pending' || normalized === 'awaiting_payment'",
  "normalized === 'done' || normalized === 'completed' || normalized === 'settled'",
  "normalized === 'canceled'",
]) {
  assertIncludes(files.normalize, normalize, marker, `Normalize contract contains ${marker}`);
}

section('Boundaries');
const financeSources = [
  [files.types, types],
  [files.calculations, calculations],
  [files.normalize, normalize],
];
for (const [scope, content] of financeSources) {
  assertNotRegex(scope, content, /from ['\"]\.\.\/\.\.\/pages|from ['\"]\.\.\/pages|from ['\"].*api\//, 'Finance domain does not import pages/api');
  assertNotRegex(scope, content, /fetch\s*\(/, 'Finance domain does not call fetch');
  assertNotRegex(scope, content, /window\./, 'Finance domain does not touch browser globals');
  assertNotRegex(scope, content, /localStorage|sessionStorage/, 'Finance domain does not touch storage');
  assertNotRegex(scope, content, /supabase/i, 'Finance domain does not depend on Supabase');
}

section('Documentation');
for (const marker of [
  'CloseFlow — FIN-1 Finance domain contract',
  'CommissionMode',
  'CommissionBase',
  'CommissionStatus',
  'PaymentType',
  'PaymentStatus',
  'Istnieje',
  'Częściowo istnieje',
  'Brakuje',
  'Nie ruszać w FIN-1',
  'nie tworzyć `/api/payments.ts`',
  'nie zmieniać migracji Supabase',
  'FIN-2 — Payments backend contract',
]) {
  assertIncludes(files.doc, doc, marker, `Doc contains ${marker}`);
}

section('Report');
for (const item of results) console.log(`${item.level} ${item.scope}: ${item.message}`);
const failed = results.filter((item) => item.level === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1_FAILED');
  process.exit(1);
}
console.log('\nCLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1_OK');
