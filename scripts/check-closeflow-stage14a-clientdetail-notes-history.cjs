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

assert(tsx.includes(`${STAGE}_GUARD`), 'Brak guarda Stage14A w ClientDetail.tsx. Uruchom repair albo dodaj helpery r\u0119cznie.');
assert(tsx.includes('getClientActivityBodyStage14A'), 'Brak getClientActivityBodyStage14A. Historia/notatki nadal nie maj\u0105 jednego \u017Ar\u00F3d\u0142a tre\u015Bci.');
assert(tsx.includes('formatClientActivityTitleStage14A'), 'Brak formatClientActivityTitleStage14A. Typy aktywno\u015Bci nadal mog\u0105 wyp\u0142ywa\u0107 jako client_note.');
assert(tsx.includes('formatClientActivityDateStage14A'), 'Brak formatClientActivityDateStage14A. Daty mog\u0105 dalej wpada\u0107 jako Brak daty.');
assert(!/useState<\s*ClientTab\s*>\(\s*['"]summary['"]\s*\)/.test(tsx), 'Domy\u015Blna zak\u0142adka klienta nadal jest summary zamiast cases.');
assert(!tsx.includes('Lekka o\u015B ostatnich ruch\u00F3w powi\u0105zanych z klientem, leadami i sprawami.'), 'W ClientDetail nadal istnieje generyczny opis Lekka o\u015B ostatnich ruch\u00F3w...');
assert(!tsx.includes('Roadmapa'), 'W ClientDetail nadal istnieje widoczny nag\u0142\u00F3wek Roadmapa. Ma by\u0107 Ostatnie ruchy.');
assert(!/return\s+['"]Brak daty['"]/.test(tsx), 'Formatter w ClientDetail nadal zwraca Brak daty. UI ma nie pokazywa\u0107 Brak daty jako g\u0142\u00F3wnej tre\u015Bci.');
assert(!/return title \|\| ['"]Aktywno\u015B\u0107 klienta['"]/.test(tsx), 'activityLabel nadal u\u017Cywa Aktywno\u015B\u0107 klienta jako g\u0142\u00F3wnego fallbacku.');

const sideActions = sectionAroundMarker(tsx, 'data-client-side-quick-actions');
if (sideActions) {
  assert(!sideActions.includes('Dodaj notatk\u0119'), 'Boczne szybkie akcje nadal zawieraj\u0105 Dodaj notatk\u0119. Usu\u0144 tylko t\u0119 akcj\u0119, nie kart\u0119 Kr\u00F3tka notatka.');
} else {
  warnings.push('Nie znaleziono sekcji data-client-side-quick-actions. Je\u015Bli boczne szybkie akcje maj\u0105 inny marker, sprawd\u017A r\u0119cznie brak Dodaj notatk\u0119.');
}

const casesIndex = firstIndex(tsx, ["id: 'cases'", 'id: "cases"', "activeTab === 'cases'", 'activeTab === "cases"']);
const summaryIndex = firstIndex(tsx, ["id: 'summary'", 'id: "summary"', "activeTab === 'summary'", 'activeTab === "summary"']);
warn(casesIndex >= 0, 'Nie znalaz\u0142em \u015Bladu zak\u0142adki cases w ClientDetail. Sprawd\u017A r\u0119cznie, czy Sprawy s\u0105 renderowane.');
warn(summaryIndex < 0 || casesIndex < 0 || casesIndex < summaryIndex, 'W kodzie summary wyst\u0119puje przed cases. Je\u015Bli to kolejno\u015B\u0107 renderu zak\u0142adek, trzeba r\u0119cznie przesun\u0105\u0107 Sprawy na pocz\u0105tek.');

warn(tsx.includes('client-detail-note-list') || tsx.includes('data-client-notes-list'), 'Nie widz\u0119 client-detail-note-list/data-client-notes-list w JSX. Dodaj widoczn\u0105 list\u0119 notatek pod kart\u0105 Kr\u00F3tka notatka.');
warn(tsx.includes('client-detail-note-row'), 'Nie widz\u0119 client-detail-note-row w JSX. Notatki mog\u0105 dalej nie mie\u0107 jednowierszowego skr\u00F3tu z title.');
warn(tsx.includes('client-detail-recent-move-row') || tsx.includes('data-client-recent-moves-panel'), 'Nie widz\u0119 recent move row/panel marker\u00F3w. Sprawd\u017A r\u0119cznie panel Ostatnie ruchy.');

assert(Boolean(stylePath), 'Nie znaleziono \u017Cadnego pliku CSS ClientDetail do sprawdzenia.');
assert(css.includes('client-detail-note-row p'), 'CSS nie zawiera regu\u0142y ellipsis dla .client-detail-note-row p.');
assert(css.includes('client-detail-activity-row p'), 'CSS nie zawiera regu\u0142y ellipsis dla .client-detail-activity-row p.');
assert(css.includes('client-detail-recent-move-row p'), 'CSS nie zawiera regu\u0142y ellipsis dla .client-detail-recent-move-row p.');
assert(css.includes('text-overflow: ellipsis'), 'CSS nie zawiera text-overflow: ellipsis dla skr\u00F3t\u00F3w aktywno\u015Bci.');
assert(css.includes('white-space: nowrap'), 'CSS nie zawiera white-space: nowrap dla skr\u00F3t\u00F3w aktywno\u015Bci.');

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
