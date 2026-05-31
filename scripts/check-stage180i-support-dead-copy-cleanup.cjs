const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const supportPath = path.join(root, 'src', 'pages', 'SupportCenter.tsx');
const stylePath = path.join(root, 'src', 'styles', 'visual-stage17-support-vnext.css');

function fail(message) {
  console.error(`STAGE180I_SUPPORT_DEAD_COPY_CLEANUP_GUARD_FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(supportPath)) fail('SupportCenter.tsx not found');
const support = fs.readFileSync(supportPath, 'utf8');
const css = fs.existsSync(stylePath) ? fs.readFileSync(stylePath, 'utf8') : '';

const forbidden = [
  'support-right-rail',
  'Sugerowane zgłoszenia',
  'Kliknij gotowy typ zgłoszenia albo wpisz własny temat.',
  'Nie trzeba zgadywać kategorii. Kliknij gotowy typ i dopisz szczegóły.',
  'Nie działa przycisk albo zapis',
  'Brakuje danych po odświeżeniu',
  'Sugeruję zmianę w aplikacji',
  'Nie wiem jak użyć funkcji',
  'Nie wiem, jak użyć funkcji',
  'Pomoc operacyjna',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać dobry błąd?',
  'Lista zgłoszeń z aktualnym statusem, kategorią i możliwością odpowiedzi.',
  'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.',
  'Błędy zapisu, puste widoki',
  'Pomysły na skróty',
  'Podaj widok, kroki',
  'Podaj zakładkę, w której problem występuje.'
];
for (const value of forbidden) {
  if (support.includes(value)) fail(`SupportCenter.tsx still contains forbidden copy/class: ${value}`);
}

const required = [
  'Zgłoszenie / sugestia',
  'Problem z aplikacją',
  'Sugestia poprawki',
  'Pytanie / pomoc',
  'Wszystkie zgłoszenia',
  'support-shell',
  'support-main-column'
];
for (const value of required) {
  if (!support.includes(value)) fail(`SupportCenter.tsx missing required copy/layout token: ${value}`);
}

if (!css.includes('STAGE180I_SUPPORT_SINGLE_COLUMN_AFTER_RIGHT_RAIL_REMOVAL')) {
  fail('support CSS missing single-column marker after right rail removal');
}
if (!/\.support-shell\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/.test(css)) {
  fail('support CSS does not force one-column support-shell layout');
}

console.log('STAGE180I_SUPPORT_DEAD_COPY_CLEANUP_GUARD_PASS');
