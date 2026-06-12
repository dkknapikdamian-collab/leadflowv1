#!/usr/bin/env node
const fs = require('fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { failures.push(message); }
function requireToken(text, token, label = token) {
  if (!text.includes(token)) fail(`missing ${label}: ${token}`);
}
const failures = [];
const caseDetail = read('src/pages/CaseDetail.tsx');
const quickActions = read('src/components/CaseQuickActions.tsx');
const css = [
  read('src/styles/visual-stage13-case-detail-vnext.css'),
  read('src/styles/case-detail-stage228r9-shell-rail-lift.css')
].join('\n');
const runtimeOnly = [caseDetail, quickActions, css].join('\n');
for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  if (runtimeOnly.includes(token)) fail(`forbidden scope creep token present: ${token}`);
}
requireToken(caseDetail, 'data-stage231d0d-r6-true-service-grid-geometry="true"', 'R6 service grid marker');
requireToken(caseDetail, 'data-stage231d0d-r6-tabs-inside-left-column="true"', 'tabs inside left column marker');
requireToken(caseDetail, 'data-case-service-left-column="true"', 'left column marker');
requireToken(caseDetail, 'data-case-service-actions-panel="true"', 'actions panel marker');
requireToken(css, 'STAGE231D0D_R8_TABS_CARD_STRETCHED_ABOVE_ACTIONS', 'R8 tabs card marker');
requireToken(css, 'STAGE231D0D_R8_RIGHT_RAIL_ALIGN_TO_CASE_HEADER', 'R8 right rail marker');
requireToken(css, '.case-service-left-column > .case-detail-stage228r10d-tabs-card[data-stage231d0d-r6-tabs-inside-left-column="true"]', 'stretched tabs selector');
for (const token of [
  'width: 100% !important',
  'max-width: none !important',
  'min-height: 72px !important',
  'padding: 16px 18px !important',
  'border-radius: 24px !important',
  'background: rgba(255, 255, 255, 0.94) !important',
  'gap: var(--cf-case-detail-card-gap, 14px) !important',
  'margin-top: -96px !important'
]) requireToken(css, token, `CSS ${token}`);
for (const token of ["key: 'payment'", "label: 'WpĹ‚ata prowizji'", 'CircleDollarSign', 'data-stage227e3-case-payment-action', 'data-stage228r7r8-case-commission-payment-action']) {
  if (quickActions.includes(token)) fail(`quick actions still contains commission payment token: ${token}`);
}
if (failures.length) {
  console.error('STAGE231D0D-R8 tabs card and right rail axis guard: FAIL');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}
console.log('STAGE231D0D-R8 tabs card and right rail axis guard: PASS');
