#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function has(rel, needle, label) { assert(read(rel).includes(needle), `${label} missing: ${needle}`); }

const requiredFiles = [
  'src/lib/relation-value.ts',
  'src/lib/data-contract.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/finance/finance-types.ts',
  'src/lib/finance/finance-calculations.ts',
  'src/lib/finance/finance-normalize.ts',
  'docs/finance/CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_2026-05-09.md',
  'scripts/check-closeflow-finance-domain-contract.cjs',
  'package.json',
];

for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

const typeFile = read('src/lib/finance/finance-types.ts');
const calcFile = read('src/lib/finance/finance-calculations.ts');
const normalizeFile = read('src/lib/finance/finance-normalize.ts');
const panelFile = exists('src/components/finance/CaseSettlementPanel.tsx') ? read('src/components/finance/CaseSettlementPanel.tsx') : '';
const docs = read('docs/finance/CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

has('src/lib/finance/finance-types.ts', 'CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1', 'finance contract marker');

for (const typeName of ['CommissionMode', 'CommissionBase', 'CommissionStatus', 'PaymentType', 'PaymentStatus', 'FinanceSnapshot']) {
  assert(typeFile.includes(`type ${typeName}`) || typeFile.includes(`export type ${typeName}`), 'finance type missing: ' + typeName);
}

for (const value of [
  'none', 'percent', 'fixed',
  'contract_value', 'paid_amount', 'custom',
  'not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue',
  'deposit', 'partial', 'final', 'commission', 'refund', 'other',
  'planned', 'cancelled',
]) {
  assert(typeFile.includes(`'${value}'`) || typeFile.includes(`"${value}"`), 'finance enum value missing: ' + value);
}

for (const fn of [
  'calculateCommissionAmount',
  'calculatePaidAmount',
  'calculateRemainingAmount',
  'calculateCommissionPaidAmount',
  'buildFinanceSnapshot',
]) {
  assert(calcFile.includes(`export function ${fn}`), 'finance calculation function missing: ' + fn);
  assert(docs.includes(fn), 'docs missing function: ' + fn);
}

for (const compatFn of [
  'clampFinanceAmount',
  'normalizeCommissionPercent',
  'buildFinanceSummary',
]) {
  assert(calcFile.includes(`export function ${compatFn}`), 'FIN-1 compatibility export missing from finance-calculations: ' + compatFn);
}

for (const fn of [
  'normalizeCommissionMode',
  'normalizeCommissionBase',
  'normalizeCommissionStatus',
  'normalizePaymentType',
  'normalizePaymentStatus',
  'normalizeFinancePayment',
  'normalizeCommissionConfig',
]) {
  assert(normalizeFile.includes(`export function ${fn}`), 'finance normalize function missing: ' + fn);
}

for (const typeName of ['FinancePayment', 'FinanceSummary', 'FinanceCommissionConfig']) {
  assert(typeFile.includes(`export type ${typeName}`), 'FIN-1 compatibility type missing: ' + typeName);
}

if (panelFile) {
  for (const importedName of ['buildFinanceSummary', 'clampFinanceAmount', 'normalizeCommissionPercent', 'normalizeCommissionConfig', 'FinancePayment']) {
    assert(panelFile.includes(importedName), 'CaseSettlementPanel compatibility surface no longer detected: ' + importedName);
  }
}

for (const forbidden of [
  'src/pages/',
  'from "react"',
  "from 'react'",
  'supabase.from(',
  'create table',
  'alter table',
]) {
  assert(!typeFile.toLowerCase().includes(forbidden.toLowerCase()), 'forbidden runtime/UI/DB concern in finance-types: ' + forbidden);
  assert(!calcFile.toLowerCase().includes(forbidden.toLowerCase()), 'forbidden runtime/UI/DB concern in finance-calculations: ' + forbidden);
  assert(!normalizeFile.toLowerCase().includes(forbidden.toLowerCase()), 'forbidden runtime/UI/DB concern in finance-normalize: ' + forbidden);
}

for (const docNeedle of [
  'bez UI',
  'bez migracji DB',
  'Nie tworzy\u0107 panelu finans\u00F3w',
  'Nie tworzy\u0107 migracji DB',
  'jeden model',
  'Lead, Client i Case',
]) {
  assert(docs.includes(docNeedle), 'docs missing required statement: ' + docNeedle);
}

assert(pkg.scripts && pkg.scripts['check:closeflow-finance-domain-contract'] === 'node scripts/check-closeflow-finance-domain-contract.cjs', 'package.json missing check:closeflow-finance-domain-contract');

console.log('CLOSEFLOW_FINANCE_DOMAIN_CONTRACT_FIN1_CHECK_OK');
console.log('finance_types=5');
console.log('finance_functions=5');
console.log('compat_exports=5');
console.log('ui_runtime_migration=false');
console.log('db_migration=false');
