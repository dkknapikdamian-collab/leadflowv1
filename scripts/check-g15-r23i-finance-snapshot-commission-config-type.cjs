#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const snapshotPath = path.join(root, 'src/components/finance/FinanceSnapshot.tsx');
const typesPath = path.join(root, 'src/lib/finance/finance-types.ts');
const normalizePath = path.join(root, 'src/lib/finance/finance-normalize.ts');

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

for (const sourcePath of [snapshotPath, typesPath, normalizePath]) {
  if (!fs.existsSync(sourcePath)) fail(`missing source file: ${path.relative(root, sourcePath)}`);
}

const snapshotSource = normalizeLineEndings(fs.readFileSync(snapshotPath, 'utf8'));
const typesSource = normalizeLineEndings(fs.readFileSync(typesPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));

const oldImport = "import type { CommissionConfig, CommissionMode, CommissionStatus, FinancePayment, FinanceSummary } from '../../lib/finance/finance-types';";
const newImport = "import type { FinanceCommissionConfig, CommissionMode, CommissionStatus, FinancePayment, FinanceSummary } from '../../lib/finance/finance-types';";
const oldBuilder = 'function buildCommissionConfigFromRecord(record: FinanceRecord | null | undefined, currency: string): CommissionConfig {';
const newBuilder = 'function buildCommissionConfigFromRecord(record: FinanceRecord | null | undefined, currency: string): FinanceCommissionConfig {';
const oldSummary = 'function buildSummary(record: FinanceRecord | null | undefined, payments: FinancePayment[], commission: CommissionConfig): FinanceSummary {';
const newSummary = 'function buildSummary(record: FinanceRecord | null | undefined, payments: FinancePayment[], commission: FinanceCommissionConfig): FinanceSummary {';

if (occurrences(snapshotSource, newImport) !== 1) fail('canonical FinanceCommissionConfig import is missing or duplicated');
if (occurrences(snapshotSource, newBuilder) !== 1) fail('commission builder does not return FinanceCommissionConfig exactly once');
if (occurrences(snapshotSource, newSummary) !== 1) fail('summary builder does not accept FinanceCommissionConfig exactly once');
if (snapshotSource.includes(oldImport) || snapshotSource.includes(oldBuilder) || snapshotSource.includes(oldSummary)) {
  fail('legacy missing CommissionConfig type remains in FinanceSnapshot');
}
if (occurrences(snapshotSource, 'FinanceCommissionConfig') !== 3) {
  fail('FinanceSnapshot must contain exactly three FinanceCommissionConfig references');
}

const restoredSnapshot = snapshotSource
  .replace(newImport, oldImport)
  .replace(newBuilder, oldBuilder)
  .replace(newSummary, oldSummary);

const expectedR23HSnapshotBlob = '8443510f5f10c2a478591fa3d5b1fa18dd373366';
const expectedR23HTypesBlob = 'e1173d404979a27ebf8edf63f3cfcc11a4e17c4d';
const expectedR23HNormalizeBlob = '81dd9ccfc814489d053c5d2995eb068cb7ad1ac2';

if (gitBlobSha(restoredSnapshot) !== expectedR23HSnapshotBlob) {
  fail('FinanceSnapshot.tsx contains changes outside the exact canonical type rename');
}
if (gitBlobSha(typesSource) !== expectedR23HTypesBlob) {
  fail('finance-types.ts changed even though R23I is a consumer type repair');
}
if (gitBlobSha(normalizeSource) !== expectedR23HNormalizeBlob) {
  fail('finance-normalize.ts changed even though R23I must preserve normalization runtime');
}

if (!typesSource.includes('export type FinanceCommissionConfig = {')) {
  fail('canonical FinanceCommissionConfig export is missing');
}
if (!normalizeSource.includes('export function normalizeCommissionConfig(value: Record<string, unknown> | null | undefined): FinanceCommissionConfig {')) {
  fail('normalizeCommissionConfig return contract changed');
}

console.log('PASS: R23I uses the canonical FinanceCommissionConfig type in FinanceSnapshot and preserves finance types and normalization runtime byte-for-byte.');
