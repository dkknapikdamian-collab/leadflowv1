#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const dialogPath = path.join(root, 'src/components/finance/CaseFinanceEditorDialog.tsx');
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

for (const sourcePath of [dialogPath, normalizePath]) {
  if (!fs.existsSync(sourcePath)) fail(`missing source file: ${path.relative(root, sourcePath)}`);
}

const dialogSource = normalizeLineEndings(fs.readFileSync(dialogPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));
const oldImport = "import { normalizeCommissionMode, normalizeCurrency } from '../../lib/finance/finance-normalize';";
const newImport = "import { normalizeCommissionMode, normalizeCommissionStatus, normalizeCurrency } from '../../lib/finance/finance-normalize';";
const statusCall = "commissionStatus: normalizeCommissionStatus(summary.commissionStatus || 'not_set'),";
const statusExport = [
  'export function normalizeCommissionStatus(value: unknown): CommissionStatus {',
  "  return normalizeEnum(value, COMMISSION_STATUSES, 'not_set');",
  '}',
].join('\n');

if (occurrences(dialogSource, newImport) !== 1) fail('exact commission-status normalizer import is missing or duplicated');
if (dialogSource.includes(oldImport)) fail('old finance-normalize import remains');
if (occurrences(dialogSource, statusCall) !== 1) fail('existing normalizeCommissionStatus initialization call changed');
if (occurrences(normalizeSource, statusExport) !== 1) fail('canonical normalizeCommissionStatus export is missing or changed');

const restoredDialog = dialogSource.replace(newImport, oldImport);
const expectedR23FDialogBlob = 'a4c7e29e7ad27e4c7a9f36a63f2121402dfe614b';
if (gitBlobSha(restoredDialog) !== expectedR23FDialogBlob) {
  fail('CaseFinanceEditorDialog contains changes outside the single finance-normalize import');
}

console.log('PASS: R23G imports the existing normalizeCommissionStatus helper and preserves CaseFinanceEditorDialog byte-for-byte outside that import on LF and CRLF worktrees.');
