#!/usr/bin/env node
const fs = require('fs');
function read(p){ return fs.readFileSync(p, 'utf8'); }
function fail(message){ failures.push(message); }
function requireToken(text, token, label = token){ if (!text.includes(token)) fail('missing ' + label + ': ' + token); }
const failures = [];

const caseDetail = read('src/pages/CaseDetail.tsx');
const quickActions = read('src/components/CaseQuickActions.tsx');
const css = [
  read('src/styles/visual-stage13-case-detail-vnext.css'),
  read('src/styles/case-detail-stage228r9-shell-rail-lift.css')
].join('\n');
const combined = [caseDetail, quickActions, css].join('\n');

for (const token of ['Ă','Ĺ','Ä','Å','Â','�','ďż˝']) if (combined.includes(token)) fail('mojibake token present: ' + token);
for (const token of ['CREATE TABLE','ALTER TABLE','chart.js','recharts']) if (combined.includes(token)) fail('forbidden scope creep token present: ' + token);

requireToken(quickActions, 'STAGE231D0D_R5_CASE_QUICK_ACTIONS_NO_PAYMENT', 'R5 quick actions marker');
requireToken(css, 'STAGE231D0D_R5_SPACING_NOTES_QUICK_ACTIONS', 'R5 spacing marker');
requireToken(css, 'STAGE231D0D_R5_RIGHT_RAIL_MICRO_LIFT', 'R5 right rail lift marker');
requireToken(css, '--cf-case-detail-card-gap: 14px', 'shared card gap');
requireToken(css, '.case-service-notes-panel', 'notes panel css');
requireToken(css, 'margin-top: 0 !important', 'notes lifted without extra top gap');
requireToken(css, 'margin-top: -8px !important', 'right rail micro lift');

for (const token of ["key: 'payment'", "label: 'Wpłata prowizji'", 'CircleDollarSign', 'data-stage227e3-case-payment-action', 'data-stage228r7r8-case-commission-payment-action']) {
  if (quickActions.includes(token)) fail('quick actions still contains commission payment token: ' + token);
}

const railStart = caseDetail.indexOf('<aside className="case-detail-right-rail"');
const railEnd = railStart >= 0 ? caseDetail.indexOf('</aside>', railStart) : -1;
const rail = railStart >= 0 && railEnd >= 0 ? caseDetail.slice(railStart, railEnd) : '';

for (const token of ['data-case-settlement-rail-card="true"', 'data-case-quick-actions-rail="true"', 'Dodaj wpłatę prowizji', 'Dodaj koszt']) {
  requireToken(rail, token, 'rail ' + token);
}

if (failures.length) {
  console.error('STAGE231D0D-R5 guard: FAIL');
  for (const item of failures) console.error('- ' + item);
  process.exit(1);
}
console.log('STAGE231D0D-R5 spacing, notes lift and quick actions cleanup guard: PASS');
