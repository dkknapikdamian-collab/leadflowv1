const fs = require('fs');
const path = require('path');
const marker = 'STAGE54_CLIENT_CASES_COMPACT_FIT';
const forbidden = [
  'Klient jest rekordem zbiorczym',
  'Po wejściu w obsługę pracuj na konkretnej sprawie',
  'Po wejściu w obsluge pracuj na konkretnej sprawie',
];
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(label) { console.log('PASS ' + label); }
function fail(label) { console.error('FAIL ' + label); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label + ' -> ' + needle);
  pass(file + ': contains ' + label);
}
function notContains(file, needle, label) {
  const value = read(file);
  if (value.includes(needle)) fail(file + ': forbidden ' + label + ' -> ' + needle);
  pass(file + ': does not contain ' + label);
}
contains('src/pages/ClientDetail.tsx', marker, 'Stage54 marker');
for (const phrase of forbidden) notContains('src/pages/ClientDetail.tsx', phrase, 'removed client aggregate copy');
contains('src/styles/visual-stage12-client-detail-vnext.css', marker, 'Stage54 CSS marker');
contains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-case-row-wide', 'case row wide selector');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'grid-template-columns: minmax(150px, 1.15fr)', 'compact case row grid');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'font-size: 12px !important;', 'compact case title font');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'font-size: 11px !important;', 'compact case meta font');
contains('src/styles/visual-stage12-client-detail-vnext.css', '-webkit-line-clamp: 2;', 'two-line clamp');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'font-size: 10px !important;', 'compact case pill font');
contains('package.json', 'check:stage54-client-cases-compact-fit', 'package check script');
contains('package.json', 'test:stage54-client-cases-compact-fit', 'package test script');
contains('tests/stage54-client-cases-compact-fit.test.cjs', marker, 'Stage54 test marker');
contains('docs/release/STAGE54_CLIENT_CASES_COMPACT_FIT_2026-05-04.md', 'STAGE54', 'Stage54 release doc');
console.log('PASS ' + marker);
