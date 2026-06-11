const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = process.cwd();
const stage = 'STAGE231D0D_R3_CASE_DETAIL_100_SCALE_BALANCED_WORKSPACE';
const errors = [];

function read(rel) {
  try { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
  catch { errors.push(`missing file: ${rel}`); return ''; }
}
function requireToken(text, token, label) { if (!text.includes(token)) errors.push(`missing ${label}: ${token}`); }
function forbidToken(text, token, label) { if (text.includes(token)) errors.push(`forbidden ${label}: ${token}`); }
function indexOrder(text, first, second, label) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  if (a === -1) errors.push(`order missing first ${label}: ${first}`);
  if (b === -1) errors.push(`order missing second ${label}: ${second}`);
  if (a !== -1 && b !== -1 && a > b) errors.push(`wrong order ${label}: ${first} must be before ${second}`);
}
function between(text, startToken, endToken) {
  const start = text.indexOf(startToken);
  const end = text.indexOf(endToken, start + startToken.length);
  if (start === -1 || end === -1) return '';
  return text.slice(start, end);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/visual-stage13-case-detail-vnext.css');
const dict = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const combined = [caseDetail, css, dict].join('\n');

requireToken(caseDetail, stage, 'stage marker');

for (const token of [
  'data-case-service-workspace-grid="true"',
  'data-case-service-actions-panel="true"',
  'data-case-service-notes-panel="true"',
]) requireToken(caseDetail, token, `service workspace marker ${token}`);
indexOrder(caseDetail, 'data-case-service-actions-panel="true"', 'data-case-service-notes-panel="true"', 'actions before notes panel');

requireToken(caseDetail, 'data-case-notes-preview-limit="3"', 'notes preview limit 3');
requireToken(caseDetail, 'caseNoteItems.slice(0, 3).map', 'notes preview slice(0, 3)');
requireToken(caseDetail, 'Wszystkie notatki', 'all notes action');
requireToken(caseDetail, 'Dyktuj notatkę', 'dictate note action');
requireToken(caseDetail, 'Dodaj notatkę', 'add note action');
requireToken(caseDetail, 'data-case-all-notes-modal="true"', 'all notes modal');

requireToken(caseDetail, 'data-case-settlement-rail-card="true"', 'settlement rail marker');
requireToken(caseDetail, 'data-case-settlement-compact="true"', 'compact settlement marker');
requireToken(caseDetail, 'data-case-settlement-payment-summary="true"', 'compact payment summary');
requireToken(caseDetail, 'data-case-settlement-cost-summary="true"', 'compact cost summary');
for (const token of ['Prowizja należna', 'Wpłacono prowizji', 'Do zapłaty prowizji', 'Koszty do zwrotu', 'Razem do pobrania']) {
  requireToken(caseDetail, token, `compact settlement text ${token}`);
}

indexOrder(caseDetail, 'data-case-settlement-rail-card="true"', 'data-case-quick-actions-rail="true"', 'right rail settlement before quick actions');
indexOrder(caseDetail, 'data-case-quick-actions-rail="true"', 'data-case-context-rail-card="true"', 'right rail quick actions before context');

const rail = between(caseDetail, '<aside className="case-detail-right-rail"', '</aside>');
if (!rail) errors.push('could not extract right rail');
for (const token of [
  'case-finance-payment-history-stage220a27__list',
  'case-detail-costs-card-stage231d2',
  'case-detail-light-empty">Brak kosztów przypiętych do tej sprawy',
]) {
  if (rail.includes(token)) errors.push(`right rail overload still visible: ${token}`);
}

for (const token of ['case-service-workspace-grid', 'grid-template-columns', '@media']) requireToken(css, token, `CSS ${token}`);
for (const token of ['CaseServiceWorkspaceGrid', 'CaseSettlementRailCardCompact', 'CaseNotesPanelCompact']) requireToken(dict, token, `UI Dictionary ${token}`);
for (const token of ['finance-positive', 'case-cost', 'cost-warning', 'case-total-to-collect']) requireToken(combined, token, `semantic class ${token}`);

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) forbidToken(combined, token, 'forbidden scope expansion');
const mojibake = ['\u0102', '\u0139', '\u00c4', '\u00c5', '\u00c2', '\ufffd', 'ďż˝'];
for (const token of mojibake) if (combined.includes(token)) errors.push(`mojibake detected: ${token}`);

const r2Guard = path.join(repo, 'scripts', 'check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs');
if (fs.existsSync(r2Guard)) {
  const result = spawnSync(process.execPath, [r2Guard], { cwd: repo, encoding: 'utf8', shell: false });
  if (result.status !== 0) errors.push(`D0D/R2 regression failed:\n${result.stdout}\n${result.stderr}`);
}

if (errors.length) {
  console.error('STAGE231D0D-R3 guard: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('STAGE231D0D-R3 CaseDetail 100% scale balanced workspace guard: PASS');
