#!/usr/bin/env node
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_2026_05_11 */
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const marker = 'CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11';

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(fs.existsSync(caseDetailPath), 'Brak src/pages/CaseDetail.tsx');
const source = fs.readFileSync(caseDetailPath, 'utf8');

assert(source.includes('function CaseDetailLoadingState'), 'Brak komponentu CaseDetailLoadingState');
assert(source.includes(marker), `Brak markera ${marker}`);
assert(source.includes('return <CaseDetailLoadingState />'), 'Guard loadingu nie zwraca CaseDetailLoadingState');
assert(source.includes('data-case-detail-loading="true"'), 'Loader nie ma data-case-detail-loading="true"');

const helperStart = source.indexOf('function CaseDetailLoadingState');
const mainStart = source.indexOf('export default function CaseDetail');
assert(helperStart >= 0 && mainStart > helperStart, 'CaseDetailLoadingState musi być przed głównym komponentem CaseDetail');
const helperBlock = source.slice(helperStart, mainStart);

const forbiddenInLoader = [
  'CaseSettlementPanel',
  'FIN-5',
  'Dodaj wpłatę',
  'Dodaj płatność prowizji',
  'Edytuj prowizję',
  'Brak zapisanych płatności',
  'WARTOŚĆ TRANSAKCJI',
  'PROWIZJA',
  '0 PLN',
];

for (const forbidden of forbiddenInLoader) {
  assert(!helperBlock.includes(forbidden), `Loader nie może zawierać danych/paneli biznesowych: ${forbidden}`);
}

const guardIndex = source.indexOf(marker);
const finalReturnIndex = source.lastIndexOf('\n  return (');
assert(finalReturnIndex > 0, 'Nie znaleziono głównego return JSX w CaseDetail');
assert(guardIndex < finalReturnIndex, 'Guard musi być przed głównym return JSX CaseDetail');

const guardWindow = source.slice(Math.max(0, guardIndex - 240), Math.min(source.length, guardIndex + 520));
assert(/if\s*\([^)]*(loading|Loading)[^)]*\)\s*\{\s*return\s+<CaseDetailLoadingState\s*\/?>/s.test(guardWindow), 'Guard musi zależeć od zmiennej loading/isLoading/caseLoading i zwracać loader');

const finalRenderBlock = source.slice(finalReturnIndex, Math.min(source.length, finalReturnIndex + 600));
assert(!finalRenderBlock.includes('Ładowanie sprawy...'), 'Tekst loadingu nie powinien siedzieć w głównym renderze sprawy zaraz obok paneli');

assert(fs.existsSync(packagePath), 'Brak package.json');
const pkgRaw = fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(pkgRaw);
assert(pkg.scripts && pkg.scripts['check:case-detail-no-partial-loading'], 'Brak package script check:case-detail-no-partial-loading');

console.log('✔ CaseDetail nie renderuje częściowych paneli podczas loadingu');
