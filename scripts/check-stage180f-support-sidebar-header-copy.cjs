#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (code) => {
  console.error(`STAGE180F_SUPPORT_SIDEBAR_HEADER_COPY_GUARD_FAIL: ${code}`);
  process.exit(1);
};
const has = (content, needle, code) => { if (!content.includes(needle)) fail(code); };
const not = (content, needle, code) => { if (content.includes(needle)) fail(code); };

const support = read('src/pages/SupportCenter.tsx');
const layout = read('src/components/Layout.tsx');
const header = read('src/components/CloseFlowPageHeaderV2.tsx');

has(layout, "label: 'Zgłoszenia'", 'layout_sidebar_not_zgloszenia');
has(layout, "path: '/help'", 'layout_help_path_missing');
not(layout, "label: 'Pomoc', path: '/help'", 'layout_help_still_pomoc');

has(header, "kicker: 'ZGŁOSZENIA'", 'header_kicker_not_zgloszenia');
has(header, "title: 'Zgłoszenia'", 'header_title_not_zgloszenia');
not(header, "kicker: 'POMOC'", 'header_kicker_still_pomoc');
not(header, "title: 'Pomoc'", 'header_title_still_pomoc');

const expectedSupport = [
  'SUPPORT_REQUESTS_SIDEBAR_HEADER_COPY_FIX_STAGE180F',
  'Zgłoszenie / sugestia',
  'Problem z aplikacją',
  'Sugestia poprawki',
  'Pytanie / pomoc',
  'Brakuje danych po odświeżeniu',
  'Nie wiem, jak użyć funkcji',
  'Kliknij gotowy typ zgłoszenia albo wpisz własny temat.',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać dobry błąd?',
  'jeśli masz go pod ręką',
];
for (const value of expectedSupport) has(support, value, `missing_support_text:${value}`);

const forbiddenSupport = [
  'Wybierz typ sprawy i opisz temat',
  'zamiast rozrzucać błędy po czacie',
  'Nie wiem jak użyć funkcji',
  'Napisz gdzie byłeś',
  'Opisz co spowalnia pracę',
  'Opisz czego nie jesteś pewien',
];
for (const value of forbiddenSupport) not(support, value, `forbidden_support_text:${value}`);

const supportVisibleSlice = [support, header].join('\n');
const mojibakeMarkers = ['\u00C4', 'Å', '\u0139', '\u00C2', 'â', '\uFFFD'];
for (const marker of mojibakeMarkers) not(supportVisibleSlice, marker, `support_visible_mojibake:${marker}`);

console.log('STAGE180F_SUPPORT_SIDEBAR_HEADER_COPY_GUARD_PASS');
