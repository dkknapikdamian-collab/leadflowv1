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
requireToken(caseDetail, 'STAGE231D0D_R2_CASE_DETAIL_SERVICE_NOTES_FINANCE_RAIL', 'R2 marker');
requireToken(caseDetail, 'data-case-settlement-rail-card="true"', 'settlement rail');
requireToken(caseDetail, 'data-case-quick-actions-rail="true"', 'quick actions rail');
for (const token of ['Notatki sprawy','Wszystkie notatki','Dyktuj notatkę','Dodaj notatkę','data-case-all-notes-modal="true"']) requireToken(caseDetail, token, token);
const railStart = caseDetail.indexOf('<aside className="case-detail-right-rail"');
const railEnd = railStart >= 0 ? caseDetail.indexOf('</aside>', railStart) : -1;
const rail = railStart >= 0 && railEnd >= 0 ? caseDetail.slice(railStart, railEnd) : '';
if (rail.indexOf('data-case-settlement-rail-card="true"') > rail.indexOf('data-case-quick-actions-rail="true"')) failures.push('wrong rail order');
for (const token of ['Prowizja należna','Wpłacono prowizji','Do zapłaty prowizji','Koszty do zwrotu','Razem do pobrania','Dodaj koszt','Dodaj wpłatę prowizji']) requireToken(rail, token, token);
for (const token of ['CaseDetailWorkspace','CaseServiceTab','CaseNotesPanel','CaseAllNotesModal','CaseSettlementRailCard']) requireToken(ui, token, 'UI dictionary ' + token);
if (failures.length) {
  console.error('STAGE231D0D-R2 guard: FAIL');
  for (const item of failures) console.error('- ' + item);
  process.exit(1);
}
console.log('STAGE231D0D-R2 CaseDetail service notes and finance rail guard: PASS (R4-compatible regression)');
