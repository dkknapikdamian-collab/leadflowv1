#!/usr/bin/env node
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_2026_05_11 */
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_FINAL_FIX_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');
const removedUnsafeMarker = 'CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11';

function fail(message) {
  console.error('✖ ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

assert(fs.existsSync(caseDetailPath), 'Brak src/pages/CaseDetail.tsx');
const source = readFile(caseDetailPath);

const helperStart = source.indexOf('function CaseDetailLoadingState');
const mainStart = source.indexOf('export default function CaseDetail');
assert(helperStart >= 0, 'Brak komponentu CaseDetailLoadingState');
assert(mainStart > helperStart, 'CaseDetailLoadingState musi być przed głównym komponentem CaseDetail');
assert(source.includes('data-case-detail-loading="true"'), 'Loader nie ma data-case-detail-loading="true"');
assert(!source.includes(removedUnsafeMarker), 'Usunięty marker starego guarda nie może wrócić poza scope komponentu');

const mainSource = source.slice(mainStart);
assert(/const\s*\[\s*loading\s*,\s*setLoading\s*\]\s*=\s*useState\(true\)/.test(mainSource), 'Brak lokalnego stanu const [loading, setLoading] = useState(true) w CaseDetail');

const helperBlock = source.slice(helperStart, mainStart);
const forbiddenBusinessUi = [
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

for (const forbidden of forbiddenBusinessUi) {
  assert(!helperBlock.includes(forbidden), 'CaseDetailLoadingState nie może zawierać danych/paneli biznesowych: ' + forbidden);
}

const finalReturnIndex = source.lastIndexOf('\n  return (');
assert(finalReturnIndex > mainStart, 'Nie znaleziono głównego return JSX w CaseDetail');

const loadingIfMatches = Array.from(source.matchAll(/\bif\s*\(\s*loading\s*\)/g));
assert(loadingIfMatches.length > 0, 'Brak warunku if (loading) w CaseDetail');

for (const match of loadingIfMatches) {
  const index = match.index || 0;
  assert(index > mainStart, 'if (loading) nie może być poza komponentem CaseDetail');
  assert(index < finalReturnIndex, 'if (loading) musi być przed głównym return JSX CaseDetail');
}

const firstLoadingIndex = loadingIfMatches[0].index || 0;
const loadingToMainReturn = source.slice(firstLoadingIndex, finalReturnIndex);
assert(
  loadingToMainReturn.includes('<CaseDetailLoadingState') ||
    loadingToMainReturn.includes('case-detail-loading') ||
    loadingToMainReturn.includes('case-detail-loading-card') ||
    loadingToMainReturn.includes('Ładowanie sprawy') ||
    loadingToMainReturn.includes('Ladowanie sprawy'),
  'Guard loadingu musi zwracać bezpieczny loader albo neutralny loading state'
);

const afterFinalReturn = source.slice(finalReturnIndex);
assert(!/\bif\s*\(\s*loading\s*\)/.test(afterFinalReturn), 'Po głównym return nie może istnieć drugie if (loading), bo wypada poza scope i powoduje runtime crash');
assert(!afterFinalReturn.includes('CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11'), 'Stary marker nie może istnieć po głównym return');

const finalRenderBlock = source.slice(finalReturnIndex, Math.min(source.length, finalReturnIndex + 900));
assert(!finalRenderBlock.includes('Ładowanie sprawy...'), 'Tekst loadingu nie powinien siedzieć w głównym renderze sprawy zaraz obok paneli');

assert(fs.existsSync(packagePath), 'Brak package.json');
const pkg = JSON.parse(readFile(packagePath));
assert(pkg.scripts && pkg.scripts['check:case-detail-no-partial-loading'], 'Brak package script check:case-detail-no-partial-loading');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet musi zachować kontrakt quiet gate');

assert(fs.existsSync(quietGatePath), 'Brak scripts/closeflow-release-check-quiet.cjs');
const quietGate = readFile(quietGatePath);
assert(quietGate.includes('case detail no partial loading'), 'Quiet release gate musi uruchamiać case detail no partial loading check');

console.log('✔ CaseDetail nie renderuje częściowych paneli podczas loadingu');
