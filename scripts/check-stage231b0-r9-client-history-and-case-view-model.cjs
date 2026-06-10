#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const R9 = 'STAGE231B0_R9_CLIENT_HISTORY_AND_CASE_VIEW_MODEL';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error(R9 + ' FAIL: ' + message);
  process.exit(1);
}

function requireIncludes(text, token, label) {
  if (!text.includes(token)) fail(label + ': missing "' + token + '"');
}

function segment(text, start, end, label) {
  const a = text.indexOf(start);
  if (a < 0) fail(label + ': segment start missing: ' + start);
  const b = text.indexOf(end, a + start.length);
  if (b < 0) fail(label + ': segment end missing after ' + start + ': ' + end);
  return text.slice(a, b);
}

function segmentUntilAny(text, start, endNeedles, label) {
  const a = text.indexOf(start);
  if (a < 0) fail(label + ': segment start missing: ' + start);
  const b = endNeedles
    .map((needle) => text.indexOf(needle, a + start.length))
    .filter((idx) => idx >= 0)
    .sort((x, y) => x - y)[0];
  if (b === undefined) return text.slice(a);
  return text.slice(a, b);
}
// R9_R6_RIGHT_RAIL_SURFACE_ROBUST

const cases = read('src/pages/Cases.tsx');
const client = read('src/pages/ClientDetail.tsx');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');

requireIncludes(cases, R9, 'Cases marker');
requireIncludes(client, R9, 'ClientDetail marker');
requireIncludes(clientCss, R9, 'ClientDetail CSS marker');
requireIncludes(caseCss, R9, 'CaseDetail CSS marker');

requireIncludes(cases, "| 'open'", 'CaseView open');
requireIncludes(cases, "| 'closed'", 'CaseView closed');
requireIncludes(cases, "| 'all'", 'CaseView all');
requireIncludes(cases, "useState<CaseView>('open')", 'Cases default view');
requireIncludes(cases, "caseView === 'closed' ? closedCases :", 'Cases source closed');
requireIncludes(cases, "caseView === 'all' ? cases :", 'Cases source all');
requireIncludes(cases, 'activeCases', 'Cases source open active');
requireIncludes(cases, "setCaseViewStage231B0R9('open')", 'Cases open setter');
requireIncludes(cases, "setSearchParams({ view })", 'Cases URL setter');
if (!(cases.includes("searchParams.get('view')") || cases.includes('searchParams.get("view")'))) {
  fail('Cases URL reader missing searchParams.get view model');
}
requireIncludes(cases, 'Otwarte sprawy', 'Cases right rail open');
requireIncludes(cases, 'Sprawy zamknięte', 'Cases right rail closed');
requireIncludes(cases, 'Wszystkie sprawy', 'Cases right rail all');
requireIncludes(cases, 'Otwarte sprawy', 'Cases R9 direct right rail open label');
requireIncludes(cases, 'Sprawy zamknięte', 'Cases R9 direct right rail closed label');
requireIncludes(cases, 'Wszystkie sprawy', 'Cases R9 direct right rail all label');
// R9_R6_DIRECT_RIGHT_RAIL_LABEL_CHECKS
requireIncludes(cases, 'SPRAWA ZAMKNIĘTA', 'Cases closed banner');
requireIncludes(cases, 'cf-case-closed-banner-stage231b0-r9', 'Cases closed banner class');
requireIncludes(cases, 'data-stage231b0-r9-closed-case-banner', 'Cases closed banner data marker');

const activeCasesTab = segment(client, "activeTab === 'cases'", "activeTab === 'history'", 'ClientDetail cases tab');
requireIncludes(activeCasesTab, 'Sprawy aktywne', 'ClientDetail active cases tab');
requireIncludes(activeCasesTab, 'activeClientCases.map', 'ClientDetail active cases source');
if (activeCasesTab.includes('Sprawy zamknięte')) fail('ClientDetail cases tab must not render closed cases section');
if (activeCasesTab.includes('closedClientCases.map')) fail('ClientDetail cases tab must not render closedClientCases');

const historyTab = segment(client, "activeTab === 'history'", 'client-detail-right-rail', 'ClientDetail history tab');
const clientClosedCardRendererStage231B0R9 = segment(client, 'renderClientCaseSmartCardStage231B0R8', '// STAGE117B: no new/open lead shortcut from ClientDetail', 'ClientDetail closed card renderer');
requireIncludes(historyTab, 'Sprawy zamknięte', 'ClientDetail history closed section');
requireIncludes(historyTab, 'closedClientCases.map', 'ClientDetail history uses closedClientCases');
requireIncludes(historyTab, 'SPRAWA ZAMKNIĘTA', 'ClientDetail history closed label');
requireIncludes(clientClosedCardRendererStage231B0R9, 'SPRAWA ZAMKNIĘTA', 'ClientDetail renderer closed label');
// R9_R5_RENDERER_CLOSED_LABEL
if (!(historyTab.includes('Otwórz') || clientClosedCardRendererStage231B0R9.includes('Otwórz'))) {
  fail('ClientDetail history closed cards must expose Otwórz action through history or renderer');
}
if (!(historyTab.includes('Przywróć sprawę') || clientClosedCardRendererStage231B0R9.includes('Przywróć sprawę'))) {
  fail('ClientDetail history closed cards must expose Przywróć sprawę action through history or renderer');
}
// R9_R5_RENDERER_AWARE_HISTORY_ACTIONS

requireIncludes(client, 'const activeClientCases = activeCases', 'ClientDetail active source');
requireIncludes(client, 'const closedClientCases = closedCases', 'ClientDetail closed source');
requireIncludes(client, 'const mainCase = activeCases[0] || null', 'ClientDetail mainCase active only');
requireIncludes(client, "mode: 'all_cases'", 'ClientDetail finance all cases');
if (client.includes('const mainCase = activeCases[0] || cases[0] || null')) fail('ClientDetail mainCase must not fall back to closed/raw cases');

const shellBlock = segment(clientCss, '.client-detail-shell', '.client-detail-left-rail', 'ClientDetail shell CSS');
if (shellBlock.includes('max-width: 1480px')) fail('client-detail-shell must not keep max-width 1480px');
requireIncludes(clientCss, '1760px', 'ClientDetail wider limit');
requireIncludes(clientCss, '@media (max-width: 1280px)', 'ClientDetail medium breakpoint');
requireIncludes(clientCss, '@media (max-width: 920px)', 'ClientDetail mobile breakpoint');

const r9Surfaces = [
  segment(cases, 'type CaseView', 'function normalizeClientText', 'Cases R9 type surface'),
  segment(cases, 'const activeCases = useMemo', 'const leadsById = useMemo', 'Cases R9 source/stat surface'),
  segment(cases, 'const filteredCases = useMemo', 'async function handleDeleteCase', 'Cases R9 filter/setter surface'),
  segmentUntilAny(cases, 'data-stage228g-cases-shortcuts-source-truth', ['</SimpleFiltersCard>', '/>', '</aside>', '<main', 'filteredCases.map'], 'Cases R9 right rail surface'),
  activeCasesTab,
  historyTab,
  segment(client, 'renderClientCaseSmartCardStage231B0R8', '// STAGE117B: no new/open lead shortcut from ClientDetail', 'ClientDetail R9 card render surface'),
].join('\n');

for (const forbidden of ['commissionAmount: 0', 'commissionPaidAmount: 0', 'payments = []', 'deletePayment', 'localStorage']) {
  if (r9Surfaces.includes(forbidden)) {
    fail('forbidden token in R9 mutation surface: ' + forbidden);
  }
}

console.log(R9 + ' PASS');
