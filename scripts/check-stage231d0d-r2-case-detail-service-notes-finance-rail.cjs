const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = process.cwd();
const stage = 'STAGE231D0D_R2_CASE_DETAIL_SERVICE_NOTES_FINANCE_RAIL';
const errors = [];

function read(rel) {
  try { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
  catch (error) { errors.push(`missing file: ${rel}`); return ''; }
}
function requireToken(text, token, label) {
  if (!text.includes(token)) errors.push(`missing ${label}: ${token}`);
}
function forbidToken(text, token, label) {
  if (text.includes(token)) errors.push(`forbidden ${label}: ${token}`);
}
function indexOrder(text, first, second, label) {
  const a = text.indexOf(first);
  const b = text.indexOf(second);
  if (a === -1) errors.push(`order missing first ${label}: ${first}`);
  if (b === -1) errors.push(`order missing second ${label}: ${second}`);
  if (a !== -1 && b !== -1 && a > b) errors.push(`wrong order ${label}: ${first} must be before ${second}`);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/visual-stage13-case-detail-vnext.css');
const dict = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const combined = [caseDetail, css, dict].join('\n');

requireToken(caseDetail, stage, 'stage marker');
requireToken(caseDetail, 'data-case-service-tab="true"', 'CaseServiceTab marker');
requireToken(caseDetail, 'data-case-notes-panel="true"', 'CaseNotesPanel marker');
requireToken(caseDetail, 'data-case-notes-preview-limit="5"', 'notes preview limit marker');
requireToken(caseDetail, 'caseNoteItems.slice(0, 5).map', 'notes preview slice(0, 5)');
requireToken(caseDetail, 'data-case-all-notes-button="true"', 'all notes button');
requireToken(caseDetail, 'data-case-all-notes-modal="true"', 'CaseAllNotesModal marker');
requireToken(caseDetail, 'data-cf-vst-dialog="true"', 'shared VST dialog marker');
requireToken(caseDetail, 'DialogContent', 'DialogContent');
requireToken(caseDetail, 'DialogHeader', 'DialogHeader');
requireToken(caseDetail, 'DialogTitle', 'DialogTitle');
requireToken(caseDetail, 'DialogFooter', 'DialogFooter');
requireToken(caseDetail, 'Wszystkie notatki sprawy', 'all notes modal title');
requireToken(caseDetail, 'Wszystkie notatki', 'all notes action');
requireToken(caseDetail, 'Dyktuj notatkę', 'dictate note action');
requireToken(caseDetail, 'Dodaj notatkę', 'add note action');

requireToken(caseDetail, 'data-case-settlement-rail-card="true"', 'CaseSettlementRailCard marker');
requireToken(caseDetail, 'data-case-quick-actions-rail="true"', 'CaseQuickActionsRail marker');
requireToken(caseDetail, 'data-case-context-rail-card="true"', 'CaseContextRailCard marker');
indexOrder(caseDetail, 'data-case-settlement-rail-card="true"', 'data-case-quick-actions-rail="true"', 'right rail settlement before quick actions');
indexOrder(caseDetail, 'data-case-quick-actions-rail="true"', 'data-case-context-rail-card="true"', 'right rail quick actions before context');

for (const token of [
  'Rozliczenie sprawy',
  'Prowizja należna',
  'Wpłacono prowizji',
  'Do zapłaty prowizji',
  'Koszty',
  'Razem do pobrania',
  'Dodaj koszt',
  'Dodaj wpłatę prowizji',
]) requireToken(caseDetail, token, `settlement text ${token}`);

for (const token of ['Najbliższe działania', 'Braki i blokady', 'Wszystkie aktywne']) {
  requireToken(caseDetail, token, `service group ${token}`);
}

for (const token of ['cost-warning', 'case-cost', 'finance-positive', 'case-total-to-collect']) {
  requireToken(combined, token, `semantic finance/cost class ${token}`);
}

for (const token of [
  'CaseDetailWorkspace',
  'CaseServiceTab',
  'CaseNotesPanel',
  'CaseAllNotesModal',
  'CaseSettlementRailCard',
  'CaseQuickActionsRail',
  'CaseContextRailCard',
]) requireToken(dict, token, `UI Dictionary ${token}`);

if ((caseDetail.match(/<h2>Co robimy teraz\?<\/h2>/g) || []).length > 0) {
  errors.push('visible legacy h2 Co robimy teraz? still exists');
}
if ((caseDetail.match(/<h2>Notatki sprawy<\/h2>/g) || []).length !== 1) {
  errors.push('expected exactly one visible h2 Notatki sprawy');
}
if (!caseDetail.includes('data-stage231d0d-r2-legacy-stage220a10-removed="true"')) {
  errors.push('legacy Stage220A10 duplicate block removal marker missing');
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  forbidToken(combined, token, 'forbidden scope expansion');
}

const mojibake = ['\u0102', '\u0139', '\u00c4', '\u00c5', '\u00c2', '\ufffd', 'ďż˝'];
for (const token of mojibake) {
  if (combined.includes(token)) errors.push(`mojibake detected: ${token}`);
}

const d0cGuard = path.join(repo, 'scripts', 'check-stage231d0c-client-detail-workspace-baseline.cjs');
if (fs.existsSync(d0cGuard)) {
  const result = spawnSync(process.execPath, [d0cGuard], { cwd: repo, encoding: 'utf8', shell: false });
  if (result.status !== 0) errors.push(`D0C baseline regression failed:\n${result.stdout}\n${result.stderr}`);
}

if (errors.length) {
  console.error('STAGE231D0D-R2 guard: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('STAGE231D0D-R2 CaseDetail service notes and finance rail guard: PASS');
