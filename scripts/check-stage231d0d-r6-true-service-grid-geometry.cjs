#!/usr/bin/env node
const fs = require('fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { failures.push(message); }
function requireToken(text, token, label = token) { if (!text.includes(token)) fail(`missing ${label}: ${token}`); }
const failures = [];
const caseDetail = read('src/pages/CaseDetail.tsx');
const quickActions = read('src/components/CaseQuickActions.tsx');
const css = [read('src/styles/visual-stage13-case-detail-vnext.css'), read('src/styles/case-detail-stage228r9-shell-rail-lift.css')].join('\n');
const combined = [caseDetail, quickActions, css].join('\n');
for (const token of ['Ä‚', 'Äą', 'Ă„', 'Ă…', 'Ă‚', 'ďż˝', 'ÄŹĹĽËť']) if (combined.includes(token)) fail(`mojibake token present: ${token}`);
for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) if (combined.includes(token)) fail(`forbidden scope creep token present: ${token}`);
requireToken(caseDetail, 'STAGE231D0D_R6_TRUE_SERVICE_GRID_GEOMETRY', 'R6 marker');
requireToken(caseDetail, "activeTab !== 'service'", 'top tabs hidden while service tab is active');
requireToken(caseDetail, 'data-stage231d0d-r6-tabs-inside-left-column="true"', 'tabs inside left column marker');
requireToken(caseDetail, 'data-stage231d0d-r6-true-service-grid-geometry="true"', 'true service grid marker');
requireToken(caseDetail, 'data-case-service-left-column="true"', 'left column marker');
requireToken(caseDetail, 'data-case-service-actions-panel="true"', 'actions panel marker');
requireToken(caseDetail, 'data-case-service-notes-panel="true"', 'notes panel marker');
const gridIndex = caseDetail.indexOf('data-stage231d0d-r6-true-service-grid-geometry="true"');
const leftIndex = caseDetail.indexOf('data-case-service-left-column="true"', gridIndex);
const tabsInsideIndex = caseDetail.indexOf('data-stage231d0d-r6-tabs-inside-left-column="true"', gridIndex);
const actionsIndex = caseDetail.indexOf('data-case-service-actions-panel="true"', gridIndex);
const notesIndex = caseDetail.indexOf('data-case-service-notes-panel="true"', gridIndex);
if (!(gridIndex >= 0 && leftIndex > gridIndex && tabsInsideIndex > leftIndex && actionsIndex > tabsInsideIndex && notesIndex > actionsIndex)) {
  fail(`wrong R6 structure order: grid=${gridIndex}, left=${leftIndex}, tabs=${tabsInsideIndex}, actions=${actionsIndex}, notes=${notesIndex}`);
}
for (const token of ['STAGE231D0D_R6_TRUE_SERVICE_GRID_GEOMETRY_CSS', '.case-service-left-column', 'grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.9fr)', 'gap: var(--cf-case-detail-card-gap, 14px)', 'STAGE231D0D_R6_RIGHT_RAIL_ALIGN_TO_TRUE_GRID', 'margin-top: 0 !important']) requireToken(css, token, `CSS ${token}`);
for (const token of ["key: 'payment'", "label: 'WpĹ‚ata prowizji'", 'CircleDollarSign', 'data-stage227e3-case-payment-action', 'data-stage228r7r8-case-commission-payment-action']) if (quickActions.includes(token)) fail(`quick actions still contains commission payment token: ${token}`);
const railStart = caseDetail.indexOf('<aside className="case-detail-right-rail"');
const railEnd = railStart >= 0 ? caseDetail.indexOf('</aside>', railStart) : -1;
const rail = railStart >= 0 && railEnd >= 0 ? caseDetail.slice(railStart, railEnd) : '';
for (const token of ['data-case-settlement-rail-card="true"', 'data-case-quick-actions-rail="true"', 'Dodaj wpłatę prowizji', 'Dodaj koszt']) requireToken(rail, token, `rail ${token}`);
if (failures.length) {
  console.error('STAGE231D0D-R6 true service grid geometry guard: FAIL');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}
console.log('STAGE231D0D-R6 true service grid geometry guard: PASS');
