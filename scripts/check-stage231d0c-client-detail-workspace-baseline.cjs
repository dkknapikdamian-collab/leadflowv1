#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = process.cwd();
function read(rel){ return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function fail(msg){ console.error('STAGE231D0C ClientDetail baseline guard: FAIL'); console.error('- ' + msg); process.exit(1); }
function req(label, text, token){ if (!text.includes(token)) fail(`${label} missing required token: ${token}`); }
function forbid(label, text, token){ if (text.includes(token)) fail(`${label} contains forbidden token: ${token}`); }
const detail = read('src/pages/ClientDetail.tsx');
const css = read('src/styles/visual-stage12-client-detail-vnext.css');
const ui = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const stageMarkerIndex = detail.indexOf('STAGE231D0C_CLIENT_DETAIL_WORKSPACE_BASELINE');
const stageDetailSlice = stageMarkerIndex >= 0 ? detail.slice(stageMarkerIndex, stageMarkerIndex + 4000) : '';
for (const token of ['Ă','Ä','Å','Â','�','ďż˝']) {
  if (stageDetailSlice.includes(token) || css.includes(token)) fail(`mojibake detected in new stage scope token=${token}`);
}
req('ClientDetail', detail, 'STAGE231D0C_CLIENT_DETAIL_WORKSPACE_BASELINE');
req('ClientDetail', detail, 'data-stage231d0c-client-detail-workspace-baseline="true"');
req('ClientDetail', detail, 'data-client-active-case-card="true"');
req('ClientDetail', detail, 'data-client-active-case-finance-row="true"');
req('ClientDetail', detail, 'getCaseNextAction(caseRecord, clientTasks, clientEvents)');
req('ClientDetail', detail, 'Prowizja');
req('ClientDetail', detail, 'Wpłacono');
req('ClientDetail', detail, 'Zostało');
req('ClientDetail', detail, 'data-client-overview-compact="true"');
req('ClientDetail', detail, 'data-client-notes-compact="true"');
req('ClientDetail', detail, 'clientVisibleNotesForRenderStage216L.slice(0, 3).map');
req('ClientDetail', detail, 'Dodaj notatkę');
req('ClientDetail', detail, 'Dyktuj notatkę');
req('ClientDetail', detail, "{ key: 'cases', label: 'Sprawy' }");
req('ClientDetail', detail, "{ key: 'summary', label: 'Podsumowanie' }");
req('ClientDetail', detail, "{ key: 'history', label: 'Historia' }");
const activeCardMarker = detail.indexOf('data-client-active-case-card="true"');
const activeCardEnd = activeCardMarker >= 0 ? detail.indexOf('</article>', activeCardMarker) : -1;
if (activeCardMarker < 0 || activeCardEnd < 0) fail('active compact case card is missing');
const activeCard = detail.slice(Math.max(0, activeCardMarker - 1400), activeCardEnd + '</article>'.length);
for (const forbidden of ['client-detail-case-smart-value', 'SPRAWA ZAMKNIĘTA', '>Sprawa<']) {
  if (activeCard.includes(forbidden)) fail(`active compact card contains forbidden heavy/label token: ${forbidden}`);
}
req('UI Dictionary', ui, 'ClientDetailWorkspace');
req('UI Dictionary', ui, 'ClientActiveCaseCard');
req('UI Dictionary', ui, 'ClientOverviewTile');
req('CSS', css, 'STAGE231D0C_CLIENT_DETAIL_WORKSPACE_BASELINE');
req('CSS', css, '.client-detail-vnext-page[data-stage231d0c-client-detail-workspace-baseline="true"]');
req('CSS', css, '.client-active-case-card[data-client-active-case-card="true"]');
req('CSS', css, '.client-active-case-finance-row[data-client-active-case-finance-row="true"]');
req('CSS', css, 'client-overview-compact');
req('CSS', css, 'data-client-notes-compact');
for (const banned of ['CREATE TABLE','ALTER TABLE','chart.js','recharts','case_costs','Koszty do zwrotu','Razem do pobrania']) {
  forbid('stage runtime', detail + '\n' + css, banned);
}
for (const badCss of ['width: 713px','height: 147px','border-radius: 23px','font-size: 13px bez uzasadnienia']) {
  forbid('CSS', css, badCss);
}
console.log('STAGE231D0C ClientDetail workspace baseline guard: PASS');
