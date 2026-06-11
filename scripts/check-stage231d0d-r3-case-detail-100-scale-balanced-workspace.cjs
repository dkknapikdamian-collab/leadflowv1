#!/usr/bin/env node
const fs = require('fs');
function read(p){ return fs.readFileSync(p, 'utf8'); }
function requireToken(text, token, label = token){ if (!text.includes(token)) failures.push('missing ' + label + ': ' + token); }
const failures = [];
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/visual-stage13-case-detail-vnext.css');
const ui = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const combined = caseDetail + '
' + css + '
' + ui;
for (const token of ['Ă','Ĺ','Ä','Å','Â','�','ďż˝']) if (combined.includes(token)) failures.push('mojibake token present: ' + token);
for (const token of ['CREATE TABLE','ALTER TABLE','chart.js','recharts']) if (combined.includes(token)) failures.push('forbidden scope creep token present: ' + token);
requireToken(caseDetail, 'STAGE231D0D_R3_CASE_DETAIL_100_SCALE_BALANCED_WORKSPACE', 'R3 marker');
requireToken(caseDetail, 'data-case-service-workspace-grid="true"', 'workspace grid marker');
requireToken(caseDetail, 'data-case-service-actions-panel="true"', 'actions panel marker');
requireToken(caseDetail, 'data-case-service-notes-panel="true"', 'notes panel marker');
for (const token of ['caseNoteItems.slice(0, 3)','Wszystkie notatki','Dyktuj notatkę','Dodaj notatkę','data-case-all-notes-modal="true"']) requireToken(caseDetail, token, token);
const railStart = caseDetail.indexOf('<aside className="case-detail-right-rail"');
const railEnd = railStart >= 0 ? caseDetail.indexOf('</aside>', railStart) : -1;
const rail = railStart >= 0 && railEnd >= 0 ? caseDetail.slice(railStart, railEnd) : '';
const settlementIndex = rail.indexOf('data-case-settlement-rail-card="true"');
const quickIndex = rail.indexOf('data-case-quick-actions-rail="true"');
if (settlementIndex < 0) failures.push('missing settlement rail');
if (quickIndex < 0) failures.push('missing quick actions rail');
if (settlementIndex >= 0 && quickIndex >= 0 && settlementIndex > quickIndex) failures.push('wrong rail order');
for (const token of ['Prowizja należna','Wpłacono prowizji','Do zapłaty prowizji','Koszty do zwrotu','Razem do pobrania']) requireToken(rail, token, 'settlement ' + token);
for (const token of ['case-service-workspace-grid','grid-template-columns','@media']) requireToken(css, token, 'CSS ' + token);
for (const token of ['CaseServiceWorkspaceGrid','CaseNotesPanelCompact','CaseSettlementRailCardCompact']) requireToken(ui, token, 'UI dictionary ' + token);
if (failures.length) {
  console.error('STAGE231D0D-R3 guard: FAIL');
  for (const item of failures) console.error('- ' + item);
  process.exit(1);
}
console.log('STAGE231D0D-R3 CaseDetail 100% scale balanced workspace guard: PASS (R4-compatible regression)');
