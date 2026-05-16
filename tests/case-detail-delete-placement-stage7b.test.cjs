#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casePath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
const entityPath = path.join(repo, 'src', 'components', 'entity-actions.tsx');

function fail(msg) {
  console.error('FAIL case-detail-delete-placement-stage7b: ' + msg);
  process.exit(1);
}

if (!fs.existsSync(casePath)) fail('brak src/pages/CaseDetail.tsx');
const src = fs.readFileSync(casePath, 'utf8');
const entity = fs.existsSync(entityPath) ? fs.readFileSync(entityPath, 'utf8') : '';

const emptyTernary = /\{caseData\?\.id\s*\?\s*\(\s*\r?\n\s*\)\s*:\s*null\}/.test(src);
const deleteShortcutTokens = (src.match(/cf-case-detail-delete-shortcut/g) || []).length;
const deleteActionTokens = (src.match(/data-case-detail-delete-action/g) || []).length;
const confirmHandlerTokens = (src.match(/setDeleteCaseOpen\(true\)/g) || []).length;
const entityTrashButtonExport = /export\s+function\s+EntityTrashButton|export\s+const\s+EntityTrashButton/.test(entity);

if (emptyTernary) fail('pozosta\u0142 pusty JSX ternary `{caseData?.id ? ( ) : null}`');
if (deleteShortcutTokens !== 0) fail(`pozosta\u0142 cf-case-detail-delete-shortcut: ${deleteShortcutTokens}`);
if (deleteActionTokens !== 1) fail(`oczekiwano jednego data-case-detail-delete-action, jest: ${deleteActionTokens}`);
if (confirmHandlerTokens < 1) fail('brak setDeleteCaseOpen(true), confirm dialog mo\u017Ce by\u0107 omini\u0119ty');
if (!entityTrashButtonExport) fail('brak eksportu EntityTrashButton w entity-actions.tsx');

console.log('OK tests/case-detail-delete-placement-stage7b.test.cjs');
console.log(`emptyTernary=false`);
console.log(`deleteShortcutTokens=${deleteShortcutTokens}`);
console.log(`deleteActionTokens=${deleteActionTokens}`);
console.log(`confirmHandlerTokens=${confirmHandlerTokens}`);
console.log(`entityTrashButtonExport=present`);
