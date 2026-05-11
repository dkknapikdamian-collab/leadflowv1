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
  fail.push('Brak guarda STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD. Repair2 nie został zastosowany.');
}
if (!/type\s+ClientTab\s*=\s*'cases'\s*\|\s*'summary'/.test(source)) {
  fail.push('ClientTab nadal nie zaczyna się od cases. Sprawy mają być pierwszą zakładką w kontrakcie.');
}
if (/useState<ClientTab>\(\s*['"]summary['"]\s*\)/.test(source)) {
  fail.push('activeTab nadal startuje od summary. Domyślna zakładka ma być cases.');
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
if (quickActions && /Dodaj notatkę/.test(quickActions)) {
  fail.push('Boczne szybkie akcje nadal zawierają Dodaj notatkę. Usuń tylko tę akcję, nie kartę Krótka notatka.');
}
if (!quickActions) {
  warn.push('Nie znaleziono sekcji data-client-side-quick-actions/client-detail-side-quick-actions-card. Jeśli sekcja zmieniła nazwę, sprawdź ręcznie boczne szybkie akcje.');
}

if (!source.includes('clientNotesStage14A')) {
  fail.push('Brak selektora clientNotesStage14A. Notatki klienta mogą dalej nie czytać realnych aktywności.');
}
if (!source.includes('data-client-notes-list="true"')) {
  fail.push('Brak data-client-notes-list="true" pod kartą notatki.');
}
if (!source.includes('client-detail-note-row')) {
  fail.push('Brak client-detail-note-row w JSX. Notatki nie mają jednowierszowego skrótu z title.');
}
if (!/title=\{getClientActivityBodyStage14A\(note\)\}/.test(source)) {
  fail.push('Wiersz notatki nie ma title z pełną treścią notatki.');
}

if (/Lekka oś ostatnich ruchów powiązanych z klientem, leadami i sprawami/.test(source)) {
  fail.push('Historia nadal zawiera generyczny opis "Lekka oś...".');
}
if (/Roadmapa/.test(source)) {
  fail.push('ClientDetail nadal zawiera nagłówek Roadmapa. Ma być Ostatnie ruchy.');
}
if (/return\s+title\s*\|\|\s*['"]Aktywność klienta['"]/.test(source)) {
  fail.push('activityLabel nadal zwraca generyczne "Aktywność klienta" jako główny fallback.');
}
if (/return\s+['"]Brak daty['"]/.test(source)) {
  fail.push('Formatter daty nadal zwraca "Brak daty" do UI. Ma zwracać pusty tekst/fallback ukryty.');
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
