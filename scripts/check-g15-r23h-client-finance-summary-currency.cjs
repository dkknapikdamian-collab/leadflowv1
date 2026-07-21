#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const clientSummaryPath = path.join(root, 'src/lib/client-finance.ts');
const caseSourcePath = path.join(root, 'src/lib/finance/case-finance-source.ts');
const consumerPath = path.join(root, 'src/components/finance/FinanceMiniSummary.tsx');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

function occurrences(source, value) {
  return source.split(value).length - 1;
}

function gitBlobSha(source) {
  const body = Buffer.from(source, 'utf8');
  const header = Buffer.from(`blob ${body.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(body).digest('hex');
}

for (const sourcePath of [clientSummaryPath, caseSourcePath, consumerPath]) {
  if (!fs.existsSync(sourcePath)) fail(`missing source file: ${path.relative(root, sourcePath)}`);
}

const clientSource = normalizeLineEndings(fs.readFileSync(clientSummaryPath, 'utf8'));
const caseSource = normalizeLineEndings(fs.readFileSync(caseSourcePath, 'utf8'));
const consumerSource = normalizeLineEndings(fs.readFileSync(consumerPath, 'utf8'));

const oldClientImport = "import { getClientCasesFinanceSummary } from './finance/case-finance-source.js';\n";
const newClientImport = `${oldClientImport}import type { FinanceCurrency } from './finance/finance-types.js';\n`;
const oldClientType = [
  "  source: 'primary_case' | 'all_active_cases' | 'all_cases';",
  '  commissionAmount?: number;',
].join('\n');
const newClientType = [
  "  source: 'primary_case' | 'all_active_cases' | 'all_cases';",
  '  currency: FinanceCurrency;',
  '  commissionAmount?: number;',
].join('\n');

const oldCaseType = [
  "  source: 'primary_case' | 'all_active_cases' | 'all_cases';",
  '  commissionAmount: number;',
].join('\n');
const newCaseType = [
  "  source: 'primary_case' | 'all_active_cases' | 'all_cases';",
  '  currency: FinanceCurrency;',
  '  commissionAmount: number;',
].join('\n');
const oldCaseReturn = [
  '    source: selected.source,',
  '    commissionAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionAmount, 0)),',
].join('\n');
const newCaseReturn = [
  '    source: selected.source,',
  "    currency: caseSummaries[0]?.currency || 'PLN',",
  '    commissionAmount: roundMoney(caseSummaries.reduce((sum, summary) => sum + summary.commissionAmount, 0)),',
].join('\n');

if (occurrences(clientSource, newClientImport) !== 1) fail('ClientFinanceSummary FinanceCurrency import is missing or duplicated');
if (occurrences(clientSource, newClientType) !== 1) fail('ClientFinanceSummary required currency contract is missing or duplicated');
if (occurrences(caseSource, newCaseType) !== 1) fail('ClientCasesFinanceSummary required currency contract is missing or duplicated');
if (occurrences(caseSource, newCaseReturn) !== 1) fail('client-cases summary currency return is missing or duplicated');
if (occurrences(consumerSource, 'totals.currency') !== 2) fail('FinanceMiniSummary totals.currency consumer changed');

const restoredClient = clientSource
  .replace(newClientImport, oldClientImport)
  .replace(newClientType, oldClientType);
const restoredCaseSource = caseSource
  .replace(newCaseType, oldCaseType)
  .replace(newCaseReturn, oldCaseReturn);

const expectedR23GClientBlob = 'a7f0409fffe59b0ee3f36b91188587df54864e08';
const expectedR23GCaseSourceBlob = 'd647ff76e1be8314bc0f37e00435ed56f8278068';
const expectedR23GConsumerBlob = 'd28a9081bca55aef899afaab1e665ba3e2d16a71';

if (gitBlobSha(restoredClient) !== expectedR23GClientBlob) {
  fail('client-finance.ts contains changes outside the FinanceCurrency import and required currency field');
}
if (gitBlobSha(restoredCaseSource) !== expectedR23GCaseSourceBlob) {
  fail('case-finance-source.ts contains changes outside the aggregate currency type and return field');
}
if (gitBlobSha(consumerSource) !== expectedR23GConsumerBlob) {
  fail('FinanceMiniSummary.tsx changed even though R23H is a source-contract repair');
}

console.log('PASS: R23H exposes the selected client-case aggregate currency and preserves both finance sources byte-for-byte outside the exact contract additions.');
