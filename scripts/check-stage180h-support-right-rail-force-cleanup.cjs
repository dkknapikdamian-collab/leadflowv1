const fs = require('fs');
const path = require('path');

const repoPath = process.cwd();
const supportPath = path.join(repoPath, 'src', 'pages', 'SupportCenter.tsx');
const cssPath = path.join(repoPath, 'src', 'styles', 'visual-stage17-support-vnext.css');

function fail(message) {
  console.error(`STAGE180H_SUPPORT_RIGHT_RAIL_FORCE_CLEANUP_GUARD_FAIL: ${message}`);
  process.exit(1);
}

const support = fs.readFileSync(supportPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const forbiddenInSupport = [
  'support-right-rail',
  'support-right-card',
  'Sugerowane zgłoszenia',
  'Pomoc operacyjna',
  'Co zgłaszać jako problem?',
  'Co zgłaszać jako sugestię?',
  'Jak opisać dobry błąd?',
  'Jak opisać temat',
  'Kliknij gotowy typ zgłoszenia albo wpisz własny temat.',
  'Lista zgłoszeń z aktualnym statusem, kategorią i możliwością odpowiedzi.',
  'Lista zgłoszeń z aktualnym statusem i możliwością odpowiedzi.',
];

for (const forbidden of forbiddenInSupport) {
  if (support.includes(forbidden)) {
    fail(`SupportCenter.tsx still contains forbidden visible support copy/class: ${forbidden}`);
  }
}

const requiredInSupport = [
  'Zgłoszenie / sugestia',
  'Problem z aplikacją',
  'Sugestia poprawki',
  'Pytanie / pomoc',
  'Wszystkie zgłoszenia',
  'SUPPORT_RIGHT_RAIL_REMOVED_STAGE180H',
];

for (const required of requiredInSupport) {
  if (!support.includes(required)) {
    fail(`SupportCenter.tsx is missing required support page text/marker: ${required}`);
  }
}

if (!css.includes('STAGE180H_SUPPORT_RIGHT_RAIL_REMOVED')) {
  fail('CSS is missing STAGE180H support shell width marker.');
}

if (!/\.support-shell\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important;[\s\S]*?\}/m.test(css)) {
  fail('CSS does not force support shell to one column after right rail removal.');
}

console.log('STAGE180H_SUPPORT_RIGHT_RAIL_FORCE_CLEANUP_GUARD_PASS');
