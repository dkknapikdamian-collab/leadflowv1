#!/usr/bin/env node
const fs = require('fs');
function read(p){ return fs.readFileSync(p, 'utf8'); }
function fail(message){ failures.push(message); }
function requireToken(text, token, label = token){ if (!text.includes(token)) fail('missing ' + label + ': ' + token); }
const failures = [];
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = [
  read('src/styles/visual-stage13-case-detail-vnext.css'),
  read('src/styles/closeflow-case-detail-stage217-operation-workspace.css'),
  read('src/styles/closeflow-case-detail-stage220a10-tabs-layout-repair.css'),
  read('src/styles/case-detail-stage228r9-shell-rail-lift.css')
].join('\n');
const ui = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const combined = [caseDetail, css, ui].join('\n');
for (const token of ['Ă','Ĺ','Ä','Å','Â','�','ďż˝']) if (combined.includes(token)) fail('mojibake token present: ' + token);
for (const token of ['CREATE TABLE','ALTER TABLE','chart.js','recharts']) if (combined.includes(token)) fail('forbidden scope creep token present: ' + token);
requireToken(caseDetail, 'STAGE231D0D_R4_CASE_DETAIL_LEAN_SERVICE_WORKSPACE', 'R4 marker');
requireToken(caseDetail, 'data-case-service-tabs-column="true"', 'tabs column marker');
requireToken(caseDetail, 'data-case-service-actions-panel="true"', 'actions panel marker');
requireToken(caseDetail, 'data-case-service-notes-panel="true"', 'notes panel marker');
for (const token of ['case-service-workspace-grid','case-service-left-column','case-service-notes-panel','grid-template-columns']) requireToken(css, token, 'CSS ' + token);
for (const token of ['caseNoteItems.slice(0, 3)','Wszystkie notatki','Dyktuj notatkę','Dodaj notatkę','data-case-all-notes-modal="true"']) requireToken(caseDetail, token, 'notes ' + token);
const railStart = caseDetail.indexOf('<aside className="case-detail-right-rail"');
const railEnd = railStart >= 0 ? caseDetail.indexOf('</aside>', railStart) : -1;
if (railStart < 0 || railEnd < 0) fail('cannot locate right rail');
const rail = railStart >= 0 && railEnd >= 0 ? caseDetail.slice(railStart, railEnd) : '';
const settlementIndex = rail.indexOf('data-case-settlement-rail-card="true"');
const quickIndex = rail.indexOf('data-case-quick-actions-rail="true"');
if (settlementIndex < 0) fail('missing settlement in right rail');
if (quickIndex < 0) fail('missing quick actions in right rail');
if (settlementIndex >= 0 && quickIndex >= 0 && !(settlementIndex < quickIndex)) fail('wrong right rail order: settlement must be before quick actions');
for (const token of ['Prowizja należna','Wpłacono prowizji','Do zapłaty prowizji','Koszty do zwrotu','Razem do pobrania','Dodaj koszt','Dodaj wpłatę prowizji']) requireToken(rail, token, 'settlement rail ' + token);
for (const token of ['data-case-context-rail-card="true"','Dane sprawy i klienta','data-case-settlement-payment-summary="true"','data-case-settlement-cost-summary="true"','Otwórz historię','Otwórz koszty','Brak kosztów przypiętych']) {
  if (rail.includes(token)) fail('right rail still renders forbidden token: ' + token);
}
for (const token of ['CaseServiceWorkspaceGridR4','CaseSettlementRailCardLean','CaseContextRailCard']) requireToken(ui, token, 'UI dictionary ' + token);
if (ui.includes('## CaseContextRailCard') && !ui.includes('Deprecated in main rail')) fail('CaseContextRailCard dictionary entry must mark main rail deprecation');
if (failures.length) {
  console.error('STAGE231D0D-R4 guard: FAIL');
  for (const item of failures) console.error('- ' + item);
  process.exit(1);
}
console.log('STAGE231D0D-R4 CaseDetail lean service workspace guard: PASS (R5-compatible regression)');
