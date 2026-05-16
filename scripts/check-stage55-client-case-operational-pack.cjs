const fs = require('fs');
const path = require('path');
const marker = 'STAGE55_CLIENT_CASE_OPERATIONAL_PACK';
const forbidden = [
  'Klient jest rekordem zbiorczym',
  'Po wej\u015Bciu w obs\u0142ug\u0119 pracuj na konkretnej sprawie',
  'Klient jako centrum relacji',
  '\u015Acie\u017Cka klienta: Lead \u2192 Klient \u2192 Sprawa \u2192 Rozliczenia',
];
function read(file) { return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exit(1); }
function contains(file, needle, label) {
  const value = read(file);
  if (!value.includes(needle)) fail(file + ': missing ' + label);
  pass(file + ': contains ' + label);
}
function notContains(file, needle, label) {
  const value = read(file);
  if (value.includes(needle)) fail(file + ': forbidden ' + label);
  pass(file + ': does not contain ' + label);
}
contains('src/pages/ClientDetail.tsx', marker, 'Stage55 TSX marker');
for (const phrase of forbidden) notContains('src/pages/ClientDetail.tsx', phrase, phrase);
contains('src/styles/visual-stage12-client-detail-vnext.css', marker, 'Stage55 CSS marker');
contains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-vnext-page .client-detail-case-row,', 'case row compact selector');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'grid-template-columns: minmax(0, 1.15fr)', 'compact desktop grid');
contains('src/styles/visual-stage12-client-detail-vnext.css', '-webkit-line-clamp: 2 !important;', 'two line clamp');
contains('src/styles/visual-stage12-client-detail-vnext.css', 'font-size: 10.5px !important;', 'compact meta font');
contains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-header-lead:empty', 'empty header copy hidden');
contains('package.json', 'check:stage55-client-case-operational-pack', 'Stage55 check script');
contains('package.json', 'verify:client-detail-operational-ui', 'client operational verify script');
contains('tests/stage55-client-case-operational-pack.test.cjs', marker, 'Stage55 test marker');
contains('docs/release/STAGE55_CLIENT_CASE_OPERATIONAL_PACK_2026-05-04.md', marker, 'Stage55 release marker');
console.log('PASS ' + marker);
