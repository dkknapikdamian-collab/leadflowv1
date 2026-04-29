const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'ClientDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage12-client-detail-vnext.css');

function fail(message) {
  console.error('FAIL client detail visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing ClientDetail.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage12-client-detail-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'CLIENT_DETAIL_VISUAL_REBUILD_STAGE12',
  'KARTOTEKA KLIENTA',
  'Klienci /',
  'Zapytaj AI',
  '+ Nowa sprawa',
  'Otwórz główną sprawę',
  'Telefon',
  'E-mail',
  'Sprawy',
  'Kontakt',
  'Historia',
  'Relacje klienta',
  'Historia pozyskania',
  'Szybkie akcje',
  'Krótka notatka',
  'Dodaj notatkę',
  'Edytuj dane kontaktowe',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page copy: ${needle}`);
}

const tabRegexes = [
  /key:\s*'summary'[\s\S]*label:\s*'Podsumowanie'/,
  /key:\s*'cases'[\s\S]*label:\s*'Sprawy'/,
  /key:\s*'contact'[\s\S]*label:\s*'Kontakt'/,
  /key:\s*'history'[\s\S]*label:\s*'Historia'/,
];

for (const regex of tabRegexes) {
  if (!regex.test(page)) fail(`missing tab pattern: ${regex}`);
}

const requiredCss = [
  '.client-detail-left-rail',
  '.client-detail-right-rail',
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  'content: none !important',
  'border: 1px solid #e4e7ec',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
  '.client-detail-hero-card',
  'linear-gradient(135deg, #0b1220',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const railBlocks = css
  .split('}')
  .filter((block) => /client-detail-(left-rail|right-rail|side-card|right-card)/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#101828']) {
  if (railBlocks.includes(dark)) fail(`dark color in client detail rails/cards css: ${dark}`);
}

if (/[ÃÂÄĹ]/.test(page) || /[ÃÂÄĹ]/.test(css)) {
  fail('possible mojibake characters detected in page or css');
}

console.log('PASS client detail visual rebuild');

