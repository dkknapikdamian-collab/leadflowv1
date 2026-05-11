#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const STAGE = 'STAGE14A_CLIENT_DETAIL_NOTES_HISTORY';
const repoRoot = process.cwd();
const tsxPath = path.join(repoRoot, 'src/pages/ClientDetail.tsx');
const styleCandidates = [
  'src/styles/ClientDetail.css',
  'src/styles/visual-stage12-client-detail-vnext.css',
  'src/styles/client-detail.css',
].map((entry) => path.join(repoRoot, entry));

const errors = [];
const warnings = [];
function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
function assert(condition, message) {
  if (!condition) errors.push(message);
}
function warn(condition, message) {
  if (!condition) warnings.push(message);
}
function sectionAroundMarker(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return null;
  const sectionStart = source.lastIndexOf('<section', markerIndex);
  if (sectionStart < 0) return null;
  const sectionEnd = source.indexOf('</section>', markerIndex);
  if (sectionEnd < 0) return null;
  return source.slice(sectionStart, sectionEnd + '</section>'.length);
}
function firstIndex(source, needles) {
  const found = needles.map((needle) => source.indexOf(needle)).filter((index) => index >= 0);
  return found.length ? Math.min(...found) : -1;
}

if (!fs.existsSync(tsxPath)) {
  console.error(`${STAGE}_CHECK_FAIL: missing src/pages/ClientDetail.tsx`);
  process.exit(1);
}
const tsx = read(tsxPath);
const stylePath = styleCandidates.find((candidate) => fs.existsSync(candidate));
const css = stylePath ? read(stylePath) : '';

assert(tsx.includes(`${STAGE}_GUARD`), 'Brak guarda Stage14A w ClientDetail.tsx. Uruchom repair albo dodaj helpery ręcznie.');
assert(tsx.includes('getClientActivityBodyStage14A'), 'Brak getClientActivityBodyStage14A. Historia/notatki nadal nie mają jednego źródła treści.');
assert(tsx.includes('formatClientActivityTitleStage14A'), 'Brak formatClientActivityTitleStage14A. Typy aktywności nadal mogą wypływać jako client_note.');
assert(tsx.includes('formatClientActivityDateStage14A'), 'Brak formatClientActivityDateStage14A. Daty mogą dalej wpadać jako Brak daty.');
assert(!/useState<\s*ClientTab\s*>\(\s*['"]summary['"]\s*\)/.test(tsx), 'Domyślna zakładka klienta nadal jest summary zamiast cases.');
assert(!tsx.includes('Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami.'), 'W ClientDetail nadal istnieje generyczny opis Lekka oś ostatnich ruchów...');
assert(!tsx.includes('Roadmapa'), 'W ClientDetail nadal istnieje widoczny nagłówek Roadmapa. Ma być Ostatnie ruchy.');
assert(!/return\s+['"]Brak daty['"]/.test(tsx), 'Formatter w ClientDetail nadal zwraca Brak daty. UI ma nie pokazywać Brak daty jako głównej treści.');
assert(!/return title \|\| ['"]Aktywność klienta['"]/.test(tsx), 'activityLabel nadal używa Aktywność klienta jako głównego fallbacku.');

const sideActions = sectionAroundMarker(tsx, 'data-client-side-quick-actions');
if (sideActions) {
  assert(!sideActions.includes('Dodaj notatkę'), 'Boczne szybkie akcje nadal zawierają Dodaj notatkę. Usuń tylko tę akcję, nie kartę Krótka notatka.');
} else {
  warnings.push('Nie znaleziono sekcji data-client-side-quick-actions. Jeśli boczne szybkie akcje mają inny marker, sprawdź ręcznie brak Dodaj notatkę.');
}

const casesIndex = firstIndex(tsx, ["id: 'cases'", 'id: "cases"', "activeTab === 'cases'", 'activeTab === "cases"']);
const summaryIndex = firstIndex(tsx, ["id: 'summary'", 'id: "summary"', "activeTab === 'summary'", 'activeTab === "summary"']);
warn(casesIndex >= 0, 'Nie znalazłem śladu zakładki cases w ClientDetail. Sprawdź ręcznie, czy Sprawy są renderowane.');
warn(summaryIndex < 0 || casesIndex < 0 || casesIndex < summaryIndex, 'W kodzie summary występuje przed cases. Jeśli to kolejność renderu zakładek, trzeba ręcznie przesunąć Sprawy na początek.');

warn(tsx.includes('client-detail-note-list') || tsx.includes('data-client-notes-list'), 'Nie widzę client-detail-note-list/data-client-notes-list w JSX. Dodaj widoczną listę notatek pod kartą Krótka notatka.');
warn(tsx.includes('client-detail-note-row'), 'Nie widzę client-detail-note-row w JSX. Notatki mogą dalej nie mieć jednowierszowego skrótu z title.');
warn(tsx.includes('client-detail-recent-move-row') || tsx.includes('data-client-recent-moves-panel'), 'Nie widzę recent move row/panel markerów. Sprawdź ręcznie panel Ostatnie ruchy.');

assert(Boolean(stylePath), 'Nie znaleziono żadnego pliku CSS ClientDetail do sprawdzenia.');
assert(css.includes('client-detail-note-row p'), 'CSS nie zawiera reguły ellipsis dla .client-detail-note-row p.');
assert(css.includes('client-detail-activity-row p'), 'CSS nie zawiera reguły ellipsis dla .client-detail-activity-row p.');
assert(css.includes('client-detail-recent-move-row p'), 'CSS nie zawiera reguły ellipsis dla .client-detail-recent-move-row p.');
assert(css.includes('text-overflow: ellipsis'), 'CSS nie zawiera text-overflow: ellipsis dla skrótów aktywności.');
assert(css.includes('white-space: nowrap'), 'CSS nie zawiera white-space: nowrap dla skrótów aktywności.');

if (warnings.length) {
  console.log(`${STAGE}_CHECK_WARNINGS`);
  for (const warning of warnings) console.log(`WARN: ${warning}`);
}

if (errors.length) {
  console.error(`${STAGE}_CHECK_FAIL`);
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

console.log(`${STAGE}_CHECK_OK`);
if (stylePath) console.log(`Checked style: ${path.relative(repoRoot, stylePath).replace(/\\/g, '/')}`);
