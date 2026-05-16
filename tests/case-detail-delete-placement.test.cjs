#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
function read(rel) {
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) throw new Error('Brak pliku: ' + rel);
  return fs.readFileSync(file, 'utf8');
}
function fail(msg) { console.error('FAIL case-detail-delete-placement: ' + msg); process.exit(1); }
const caseText = read('src/pages/CaseDetail.tsx');
const actionsText = read('src/components/entity-actions.tsx');
const cssText = read('src/styles/visual-stage13-case-detail-vnext.css');
if (caseText.includes('cf-case-detail-delete-shortcut')) fail('pozostal floating/top-level cf-case-detail-delete-shortcut');
if (!caseText.includes('data-case-detail-delete-action')) fail('brak data-case-detail-delete-action w CaseDetail.tsx');
if (!caseText.includes('EntityTrashButton')) fail('CaseDetail nie uzywa EntityTrashButton');
if (!/import\s+\{[^}]*EntityTrashButton[^}]*\}\s+from\s+['"]\.\.\/components\/entity-actions['"]/.test(caseText)) fail('brak importu EntityTrashButton z entity-actions');
if (!/export\s+function\s+EntityTrashButton\b/.test(actionsText) && !/export\s+const\s+EntityTrashButton\b/.test(actionsText)) fail('entity-actions.tsx nie eksportuje EntityTrashButton');
if (!cssText.includes('.cf-case-detail-delete-action')) fail('brak CSS dla cf-case-detail-delete-action');
if (!/title="Usu\u0144 spraw\u0119"/.test(caseText) && !/title='Usu\u0144 spraw\u0119'/.test(caseText)) fail('brak tooltip/title Usu\u0144 spraw\u0119');
if (/onClick=\{\s*deleteCaseWithRelations\s*\(/.test(caseText)) fail('delete action omija confirm dialog przez bezposredni deleteCaseWithRelations');
console.log('OK tests/case-detail-delete-placement.test.cjs');
console.log('deleteShortcutTokens=0');
console.log('deleteActionTokens=' + (caseText.match(/data-case-detail-delete-action/g) || []).length);
console.log('entityTrashButtonExport=present');
