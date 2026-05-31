const fs = require('fs');
const path = require('path');

const root = process.cwd();
const supportPath = path.join(root, 'src', 'pages', 'SupportCenter.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage17-support-vnext.css');

function fail(message) {
  console.error(`STAGE180J_SUPPORT_LIST_COPY_FINAL_CLEANUP_GUARD_FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(supportPath)) fail('missing SupportCenter.tsx');
if (!fs.existsSync(cssPath)) fail('missing support css');

const support = fs.readFileSync(supportPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const forbidden = [
  'Lista zgłoszeń z aktualnym statusem, kategorią i możliwością odpowiedzi.',
  'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.',
  'Sugerowane zgłoszenia',
  'Kliknij gotowy typ zgłoszenia albo wpisz własny temat.',
  'Nie działa przycisk albo zapis',
  'Brakuje danych po odświeżeniu',
  'Sugeruję zmianę w aplikacji',
  'Nie wiem, jak użyć funkcji',
  'Nie wiem jak użyć funkcji',
  'Pomoc operacyjna',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać temat',
  'Jak opisać dobry błąd?',
  'Błędy zapisu, puste widoki',
  'Pomysły na skróty',
  'Podaj zakładkę',
  'Dopisz oczekiwany efekt',
];
for (const needle of forbidden) {
  if (support.includes(needle)) fail(`SupportCenter.tsx still contains forbidden copy: ${needle}`);
}

const forbiddenClassInTsx = ['support-right-rail', 'support-right-card'];
for (const needle of forbiddenClassInTsx) {
  if (support.includes(needle)) fail(`SupportCenter.tsx still contains removed right rail class: ${needle}`);
}

const required = [
  'Zgłoszenie / sugestia',
  'Problem z aplikacją',
  'Sugestia poprawki',
  'Pytanie / pomoc',
  'Wszystkie zgłoszenia',
  'Wyślij zgłoszenie',
];
for (const needle of required) {
  if (!support.includes(needle)) fail(`SupportCenter.tsx missing required visible support flow copy: ${needle}`);
}

if (!css.includes('STAGE180J_SUPPORT_SINGLE_COLUMN')) fail('css missing Stage180J marker');
if (!css.includes('grid-template-columns: minmax(0, 1fr) !important')) fail('css missing single-column support shell contract');
if (!css.includes('.support-right-rail') || !css.includes('display: none !important')) fail('css missing fallback hide for removed support right rail');

console.log('STAGE180J_SUPPORT_LIST_COPY_FINAL_CLEANUP_GUARD_PASS');
