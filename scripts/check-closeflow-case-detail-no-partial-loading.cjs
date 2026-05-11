#!/usr/bin/env node
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_2026_05_11 */
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_SYNTAX_FIX_2026_05_11 */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');
const removedUnsafeMarker = 'CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11';

function fail(message) {
  console.error('✖ ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

assert(fs.existsSync(caseDetailPath), 'Brak src/pages/CaseDetail.tsx');
const source = fs.readFileSync(caseDetailPath, 'utf8');

assert(source.includes('function CaseDetailLoadingState'), 'Brak komponentu CaseDetailLoadingState');
assert(source.includes('data-case-detail-loading="true"'), 'Loader nie ma data-case-detail-loading="true"');
assert(!source.includes(removedUnsafeMarker), 'Usunięty marker starego guarda nie może wrócić poza scope komponentu');
assert(/const\s*\[\s*loading\s*,\s*setLoading\s*\]\s*=\s*useState\(true\)/.test(source), 'Brak lokalnego stanu const [loading, setLoading] = useState(true) w CaseDetail');

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
  assert(!helperBlock.includes(forbidden), 'Loader nie może zawierać danych/paneli biznesowych: ' + forbidden);
}

const finalReturnIndex = source.lastIndexOf('\n  return (');
assert(finalReturnIndex > mainStart, 'Nie znaleziono głównego return JSX w CaseDetail');

const loadingIfMatches = Array.from(source.matchAll(/\bif\s*\(\s*loading\s*\)/g));
assert(loadingIfMatches.length > 0, 'Brak warunku if (loading) w CaseDetail');

for (const match of loadingIfMatches) {
  const index = match.index || 0;
  assert(index > mainStart, 'if (loading) nie może być poza komponentem CaseDetail');
  assert(index < finalReturnIndex, 'if (loading) musi być przed głównym return JSX CaseDetail');
  const loadingBlock = source.slice(index, Math.min(source.length, index + 1800));
  assert(
    loadingBlock.includes('<CaseDetailLoadingState') ||
      loadingBlock.includes('case-detail-loading') ||
      loadingBlock.includes('case-detail-loading-card') ||
      loadingBlock.includes('Ładowanie sprawy') ||
      loadingBlock.includes('Ladowanie sprawy'),
    'Guard loadingu musi zwracać bezpieczny loader albo neutralny loading state'
  );
  for (const forbidden of forbiddenInLoader) {
    assert(!loadingBlock.includes(forbidden), 'Guard loadingu nie może renderować paneli biznesowych: ' + forbidden);
  }
}

const afterFinalReturn = source.slice(finalReturnIndex);
assert(!/\bif\s*\(\s*loading\s*\)/.test(afterFinalReturn), 'Po głównym return nie może istnieć drugie if (loading), bo wypada poza scope i powoduje runtime crash');

const finalRenderBlock = source.slice(finalReturnIndex, Math.min(source.length, finalReturnIndex + 900));
assert(!finalRenderBlock.includes('Ładowanie sprawy...'), 'Tekst loadingu nie powinien siedzieć w głównym renderze sprawy zaraz obok paneli');

assert(fs.existsSync(packagePath), 'Brak package.json');
const pkgRaw = fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(pkgRaw);
assert(pkg.scripts && pkg.scripts['check:case-detail-no-partial-loading'], 'Brak package script check:case-detail-no-partial-loading');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet musi zachować kontrakt quiet gate');

const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
assert(quietGate.includes('case detail no partial loading'), 'Quiet release gate musi uruchamiać case detail no partial loading check');

console.log('✔ CaseDetail nie renderuje częściowych paneli podczas loadingu');
