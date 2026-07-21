#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const typesPath = path.join(root, 'src/lib/finance/finance-types.ts');
const normalizePath = path.join(root, 'src/lib/finance/finance-normalize.ts');
const snapshotPath = path.join(root, 'src/components/finance/FinanceSnapshot.tsx');
const formPath = path.join(root, 'src/components/finance/PaymentFormDialog.tsx');

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

for (const sourcePath of [typesPath, normalizePath, snapshotPath, formPath]) {
  if (!fs.existsSync(sourcePath)) fail(`missing source file: ${path.relative(root, sourcePath)}`);
}

const typesSource = normalizeLineEndings(fs.readFileSync(typesPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));
const snapshotSource = normalizeLineEndings(fs.readFileSync(snapshotPath, 'utf8'));
const formSource = normalizeLineEndings(fs.readFileSync(formPath, 'utf8'));

const relationBlock = `export type FinanceRelationRef = {\n  workspaceId: string;\n  leadId: string | null;\n  clientId: string | null;\n  caseId: string | null;\n};\n\n`;
const rawRelationFields = `  workspace_id?: string | null;\n  lead_id?: string | null;\n  client_id?: string | null;\n  case_id?: string | null;\n`;
const rawAuditFields = `  createdAt?: string | null;\n  created_at?: string | null;\n  updatedAt?: string | null;\n  updated_at?: string | null;\n`;
const normalizedAuditFields = `  createdAt?: string | null;\n  updatedAt?: string | null;\n`;

if (occurrences(typesSource, relationBlock) !== 1) fail('FinanceRelationRef contract is missing or duplicated');
if (occurrences(typesSource, 'export type FinancePaymentLike = Partial<FinanceRelationRef> & {') !== 1) fail('FinancePaymentLike does not extend partial relations exactly once');
if (occurrences(typesSource, 'export type NormalizedFinancePayment = Partial<FinanceRelationRef> & {') !== 1) fail('NormalizedFinancePayment does not expose optional relation metadata exactly once');
if (occurrences(typesSource, rawRelationFields) !== 1) fail('raw snake_case relation aliases are missing or duplicated');
if (occurrences(typesSource, rawAuditFields) !== 1) fail('raw audit timestamp aliases are missing or duplicated');
if (occurrences(typesSource, normalizedAuditFields) !== 1) fail('normalized audit timestamps are missing or duplicated');

const newPaymentSignature = `export function normalizeFinancePayment(\n  payment: FinancePaymentLike | Record<string, unknown> | null | undefined,\n  fallbackCurrency = 'PLN',\n): NormalizedFinancePayment {\n  const row = (payment || {}) as FinancePaymentLike & Record<string, unknown>;`;
const newPaymentsSignature = `export function normalizeFinancePayments(\n  payments: Array<FinancePaymentLike | Record<string, unknown>> | null | undefined,\n  fallbackCurrency = 'PLN',\n): NormalizedFinancePayment[] {`;

if (occurrences(normalizeSource, newPaymentSignature) !== 1) fail('single-payment raw-record normalization boundary is missing or duplicated');
if (occurrences(normalizeSource, newPaymentsSignature) !== 1) fail('payment-list raw-record normalization boundary is missing or duplicated');

const restoredTypes = typesSource
  .replace(relationBlock, '')
  .replace('export type FinancePaymentLike = Partial<FinanceRelationRef> & {', 'export type FinancePaymentLike = {')
  .replace(rawRelationFields, '')
  .replace(rawAuditFields, '')
  .replace('export type NormalizedFinancePayment = Partial<FinanceRelationRef> & {', 'export type NormalizedFinancePayment = {')
  .replace(normalizedAuditFields, '');

const restoredNormalize = normalizeSource
  .replace(
    newPaymentSignature,
    `export function normalizeFinancePayment(payment: FinancePaymentLike | null | undefined, fallbackCurrency = 'PLN'): NormalizedFinancePayment {\n  const row = payment || {};`,
  )
  .replace(
    newPaymentsSignature,
    `export function normalizeFinancePayments(payments: FinancePaymentLike[] | null | undefined, fallbackCurrency = 'PLN'): NormalizedFinancePayment[] {`,
  );

if (gitBlobSha(restoredTypes) !== 'e1173d404979a27ebf8edf63f3cfcc11a4e17c4d') {
  fail('finance-types.ts contains changes outside the exact payment record contract additions');
}
if (gitBlobSha(restoredNormalize) !== '81dd9ccfc814489d053c5d2995eb068cb7ad1ac2') {
  fail('finance-normalize.ts contains changes outside the exact raw-record type boundary repair');
}
if (gitBlobSha(snapshotSource) !== 'ca35334d09c74d156a24f390537acb2a2c8cac6b') {
  fail('FinanceSnapshot.tsx changed even though R23J repairs the shared payment contract');
}
if (gitBlobSha(formSource) !== '962af47dc45aa4f94327e322ed78636774ecd6e4') {
  fail('PaymentFormDialog.tsx changed even though its existing FinanceRelationRef usage is canonical evidence');
}

console.log('PASS: R23J defines the shared finance payment relation record contract, accepts raw records at the normalization boundary, and preserves finance consumers byte-for-byte.');
