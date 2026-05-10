#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: rel, message: 'Missing file' });
    return '';
  }
  const text = fs.readFileSync(full, 'utf8');
  results.push({ level: 'PASS', scope: rel, message: 'File exists' });
  return text;
}

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }
function includes(scope, text, needle, message) {
  if (text.includes(needle)) pass(scope, message || `Found ${needle}`);
  else fail(scope, `${message || 'Missing'} [needle=${JSON.stringify(needle)}]`);
}
function notIncludes(scope, text, needle, message) {
  if (!text.includes(needle)) pass(scope, message || `Absent ${needle}`);
  else fail(scope, `${message || 'Forbidden'} [needle=${JSON.stringify(needle)}]`);
}
function regex(scope, text, pattern, message) {
  if (pattern.test(text)) pass(scope, message || `Matched ${pattern}`);
  else fail(scope, `${message || 'Missing pattern'} [pattern=${pattern}]`);
}
function section(title) { console.log(`\n== ${title} ==`); }

const files = {
  snapshot: 'src/components/finance/FinanceSnapshot.tsx',
  mini: 'src/components/finance/FinanceMiniSummary.tsx',
  list: 'src/components/finance/PaymentList.tsx',
  paymentDialog: 'src/components/finance/PaymentFormDialog.tsx',
  commissionDialog: 'src/components/finance/CommissionFormDialog.tsx',
  css: 'src/styles/finance/closeflow-finance.css',
  doc: 'docs/finance/CLOSEFLOW_FINANCE_COMPONENTS_2026-05-09.md',
  check: 'scripts/check-closeflow-finance-components.cjs',
};

const snapshot = readRequired(files.snapshot);
const mini = readRequired(files.mini);
const list = readRequired(files.list);
const paymentDialog = readRequired(files.paymentDialog);
const commissionDialog = readRequired(files.commissionDialog);
const css = readRequired(files.css);
const doc = readRequired(files.doc);

section('FIN-3 markers');
for (const [scope, text] of [
  [files.snapshot, snapshot],
  [files.css, css],
  [files.doc, doc],
]) {
  includes(scope, text, 'FIN-3_CLOSEFLOW_FINANCE_COMPONENTS_V1', 'FIN-3 marker exists');
}

section('Component files');
includes(files.snapshot, snapshot, 'export function FinanceSnapshot', 'FinanceSnapshot exported');
includes(files.mini, mini, 'export function FinanceMiniSummary', 'FinanceMiniSummary exported');
includes(files.list, list, 'export function PaymentList', 'PaymentList exported');
includes(files.paymentDialog, paymentDialog, 'export function PaymentFormDialog', 'PaymentFormDialog exported');
includes(files.commissionDialog, commissionDialog, 'export function CommissionFormDialog', 'CommissionFormDialog exported');

section('FIN-1 domain contract usage');
includes(files.snapshot, snapshot, "from '../../lib/finance/finance-types'", 'Snapshot imports finance types');
includes(files.snapshot, snapshot, "from '../../lib/finance/finance-calculations'", 'Snapshot imports finance calculations');
includes(files.snapshot, snapshot, "from '../../lib/finance/finance-normalize'", 'Snapshot imports finance normalizers');
includes(files.paymentDialog, paymentDialog, 'PaymentType', 'Payment dialog uses PaymentType');
includes(files.paymentDialog, paymentDialog, 'PaymentStatus', 'Payment dialog uses PaymentStatus');
includes(files.commissionDialog, commissionDialog, 'CommissionMode', 'Commission dialog uses CommissionMode');
includes(files.commissionDialog, commissionDialog, 'CommissionBase', 'Commission dialog uses CommissionBase');
includes(files.commissionDialog, commissionDialog, 'CommissionStatus', 'Commission dialog uses CommissionStatus');

section('Minimum UI surface');
for (const needle of ['Rozliczenie', 'Wartość', 'Prowizja', 'Wpłacono', 'Pozostało', 'Status prowizji']) {
  includes(files.mini, mini, needle, `Mini summary contains ${needle}`);
}
includes(files.snapshot, snapshot, 'Dodaj wpłatę', 'Snapshot has Add payment action');
includes(files.snapshot, snapshot, 'Edytuj prowizję', 'Snapshot has Edit commission action');
includes(files.paymentDialog, paymentDialog, 'Dodaj wpłatę', 'Payment dialog title exists');
includes(files.paymentDialog, paymentDialog, 'Zapisz wpłatę', 'Payment dialog submit exists');
includes(files.commissionDialog, commissionDialog, 'Edytuj prowizję', 'Commission dialog title exists');
includes(files.commissionDialog, commissionDialog, 'Zapisz prowizję', 'Commission dialog submit exists');

section('No direct persistence from FIN-3 components');
for (const [scope, text] of [
  [files.snapshot, snapshot],
  [files.paymentDialog, paymentDialog],
  [files.commissionDialog, commissionDialog],
]) {
  notIncludes(scope, text, 'createPaymentInSupabase', 'No direct payment API call in UI component');
  notIncludes(scope, text, 'updateCaseInSupabase', 'No direct case API call in UI component');
  notIncludes(scope, text, 'fetch(', 'No raw fetch in finance component');
  notIncludes(scope, text, 'window.location.reload', 'No full reload in finance component');
}
includes(files.snapshot, snapshot, 'onAddPayment', 'Snapshot delegates payment save to callback');
includes(files.snapshot, snapshot, 'onEditCommission', 'Snapshot delegates commission save to callback');

section('Styling contract');
for (const needle of [
  '.cf-finance-snapshot',
  '.cf-finance-mini-summary',
  '.cf-finance-actions',
  '.cf-finance-payment-list',
  '.cf-finance-dialog',
  '.cf-finance-form',
  '@media (max-width: 720px)',
]) {
  includes(files.css, css, needle, `CSS contains ${needle}`);
}
includes(files.snapshot, snapshot, "../../styles/finance/closeflow-finance.css", 'Snapshot imports finance CSS');

section('Dialog behavior');
regex(files.paymentDialog, paymentDialog, /onSubmit\?\.\(value\)/, 'Payment dialog uses onSubmit callback');
regex(files.commissionDialog, commissionDialog, /onSubmit\?\.\(value\)/, 'Commission dialog uses onSubmit callback');
includes(files.snapshot, snapshot, 'readonly', 'Snapshot supports readonly mode');
includes(files.snapshot, snapshot, '!readonly', 'Readonly hides actions');

section('Documentation');
for (const needle of [
  'FinanceSnapshot',
  'FinanceMiniSummary',
  'PaymentList',
  'PaymentFormDialog',
  'CommissionFormDialog',
  'Nie podłącza jeszcze komponentów do `CaseDetail`',
  'FIN-4 powinien być dopiero etapem integracyjnym',
]) {
  includes(files.doc, doc, needle, `Doc contains ${needle}`);
}

section('Report');
for (const item of results) console.log(`${item.level} ${item.scope}: ${item.message}`);
const failed = results.filter((item) => item.level === 'FAIL');
console.log(`\nSummary: ${results.length - failed.length} pass, ${failed.length} fail.`);
if (failed.length) {
  console.error('\nFAIL CLOSEFLOW_FINANCE_COMPONENTS_FIN3_FAILED');
  process.exit(1);
}
console.log('\nCLOSEFLOW_FINANCE_COMPONENTS_FIN3_OK');
