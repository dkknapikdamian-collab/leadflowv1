const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const casesPath = path.join(root, 'src', 'pages', 'Cases.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage23-client-case-forms-vnext.css');

function fail(message) {
  console.error('FAIL client case forms visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(clientsPath)) fail('missing Clients.tsx');
if (!fs.existsSync(casesPath)) fail('missing Cases.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage23-client-case-forms-vnext.css');

const clients = fs.readFileSync(clientsPath, 'utf8');
const cases = fs.readFileSync(casesPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const combined = `${clients}\n${cases}`;

const requiredClient = [
  'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS',
  'Imi\u0119 / nazwa',
  'Telefon',
  'E-mail',
  'Firma',
  'Notatka',
  'Zapisz klienta',
  'Podaj nazw\u0119 klienta.',
];

for (const needle of requiredClient) {
  if (!clients.includes(needle)) fail(`missing client form content: ${needle}`);
}

const requiredCase = [
  'CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CASES',
  'Tytu\u0142 sprawy',
  'Klient',
  'Status',
  'Opis',
  'Powi\u0105zany lead',
  'Zapisz spraw\u0119',
  'Sprawa b\u0119dzie przypi\u0119ta do tego klienta',
  'Wybierz klienta albo utw\u00F3rz nowego.',
  'useSearchParams',
  'clientId: newCase.clientId || null',
];

for (const needle of requiredCase) {
  if (!cases.includes(needle)) fail(`missing case form content: ${needle}`);
}

if (combined.includes('zamkni\u0119ty sprzeda\u017Cowo')) fail('forbidden copy found: zamkni\u0119ty sprzeda\u017Cowo');

const requiredCss = [
  '.client-case-form-content',
  'background: rgba(255, 255, 255, 0.96) !important',
  'border: 1px solid #e4e7ec !important',
  'border-radius: 28px !important',
  'content: none !important',
  '.client-case-form-footer',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const formBlocks = css
  .split('}')
  .filter((block) => /client-case-form|client-detail-edit|case-detail-form/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (formBlocks.includes(dark)) fail(`dark color in client/case form css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (combined.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS client case forms visual rebuild');
