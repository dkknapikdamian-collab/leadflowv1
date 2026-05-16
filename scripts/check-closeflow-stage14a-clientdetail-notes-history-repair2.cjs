#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const tsxPath = path.join(root, 'src/pages/ClientDetail.tsx');
const cssPaths = [
  path.join(root, 'src/styles/visual-stage12-client-detail-vnext.css'),
  path.join(root, 'src/styles/ClientDetail.css'),
  path.join(root, 'src/styles/client-detail.css'),
].filter(fs.existsSync);
const fail = [];
const warn = [];
function read(file) { return fs.readFileSync(file, 'utf8'); }
if (!fs.existsSync(tsxPath)) fail.push('Brak src/pages/ClientDetail.tsx');
const source = fs.existsSync(tsxPath) ? read(tsxPath) : '';
const css = cssPaths.map(read).join('\n');

if (!source.includes('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD')) {
  fail.push('Brak guarda STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD. Repair2 nie zosta\u0142 zastosowany.');
}
if (!/type\s+ClientTab\s*=\s*'cases'\s*\|\s*'summary'/.test(source)) {
  fail.push('ClientTab nadal nie zaczyna si\u0119 od cases. Sprawy maj\u0105 by\u0107 pierwsz\u0105 zak\u0142adk\u0105 w kontrakcie.');
}
if (/useState<ClientTab>\(\s*['"]summary['"]\s*\)/.test(source)) {
  fail.push('activeTab nadal startuje od summary. Domy\u015Blna zak\u0142adka ma by\u0107 cases.');
}

function findSection(markers) {
  for (const marker of markers) {
    const idx = source.indexOf(marker);
    if (idx < 0) continue;
    const sectionStart = source.lastIndexOf('<section', idx);
    const divStart = source.lastIndexOf('<div', idx);
    const start = Math.max(sectionStart, divStart);
    const sectionClose = source.indexOf('</section>', idx);
    const divClose = source.indexOf('</div>', idx);
    const closeCandidates = [sectionClose >= 0 ? sectionClose + '</section>'.length : -1, divClose >= 0 ? divClose + '</div>'.length : -1].filter(v => v >= 0 && v > idx);
    const end = closeCandidates.length ? Math.min(...closeCandidates) : -1;
    if (start >= 0 && end > start) return source.slice(start, end);
  }
  return '';
}
const quickActions = findSection(['data-client-side-quick-actions', 'client-detail-side-quick-actions-card']);
if (quickActions && /Dodaj notatk\u0119/.test(quickActions)) {
  fail.push('Boczne szybkie akcje nadal zawieraj\u0105 Dodaj notatk\u0119. Usu\u0144 tylko t\u0119 akcj\u0119, nie kart\u0119 Kr\u00F3tka notatka.');
}
if (!quickActions) {
  warn.push('Nie znaleziono sekcji data-client-side-quick-actions/client-detail-side-quick-actions-card. Je\u015Bli sekcja zmieni\u0142a nazw\u0119, sprawd\u017A r\u0119cznie boczne szybkie akcje.');
}

if (!source.includes('clientNotesStage14A')) {
  fail.push('Brak selektora clientNotesStage14A. Notatki klienta mog\u0105 dalej nie czyta\u0107 realnych aktywno\u015Bci.');
}
if (!source.includes('data-client-notes-list="true"')) {
  fail.push('Brak data-client-notes-list="true" pod kart\u0105 notatki.');
}
if (!source.includes('client-detail-note-row')) {
  fail.push('Brak client-detail-note-row w JSX. Notatki nie maj\u0105 jednowierszowego skr\u00F3tu z title.');
}
if (!/title=\{getClientActivityBodyStage14A\(note\)\}/.test(source)) {
  fail.push('Wiersz notatki nie ma title z pe\u0142n\u0105 tre\u015Bci\u0105 notatki.');
}

if (/Lekka o\u015B ostatnich ruch\u00F3w powi\u0105zanych z klientem, leadami i sprawami/.test(source)) {
  fail.push('Historia nadal zawiera generyczny opis "Lekka o\u015B...".');
}
if (/Roadmapa/.test(source)) {
  fail.push('ClientDetail nadal zawiera nag\u0142\u00F3wek Roadmapa. Ma by\u0107 Ostatnie ruchy.');
}
if (/return\s+title\s*\|\|\s*['"]Aktywno\u015B\u0107 klienta['"]/.test(source)) {
  fail.push('activityLabel nadal zwraca generyczne "Aktywno\u015B\u0107 klienta" jako g\u0142\u00F3wny fallback.');
}
if (/return\s+['"]Brak daty['"]/.test(source)) {
  fail.push('Formatter daty nadal zwraca "Brak daty" do UI. Ma zwraca\u0107 pusty tekst/fallback ukryty.');
}
if (!/\.client-detail-note-row\s+p[\s\S]*text-overflow:\s*ellipsis/.test(css)) {
  fail.push('CSS nie zawiera ellipsis dla .client-detail-note-row p.');
}

if (warn.length) {
  console.log('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_CHECK_WARNINGS');
  warn.forEach((item) => console.log(`WARN: ${item}`));
}
if (fail.length) {
  console.error('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_CHECK_FAIL');
  fail.forEach((item) => console.error(`FAIL: ${item}`));
  process.exit(1);
}
console.log('STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_CHECK_OK');
