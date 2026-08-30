const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const clientDialogPath = path.join(root, 'src', 'components', 'ClientCreateDialog.tsx');
const casesPath = path.join(root, 'src', 'pages', 'Cases.tsx');
const cssPath = path.join(root, 'src', 'styles', 'owners', 'closeflow-dialogs.css');

function fail(message) {
  console.error('FAIL client case forms visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(clientDialogPath)) fail('missing ClientCreateDialog.tsx');
if (!fs.existsSync(casesPath)) fail('missing Cases.tsx');
if (!fs.existsSync(cssPath)) fail('missing canonical closeflow-dialogs.css');

const clients = fs.readFileSync(clientDialogPath, 'utf8');
const cases = fs.readFileSync(casesPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const frt036CssStart = css.lastIndexOf('/* FRT-036:');
if (frt036CssStart < 0) fail('missing FRT-036 Cases modal composition in canonical dialog owner');
const frt036Css = css.slice(frt036CssStart);
const combined = `${clients}\n${cases}`;

const requiredClient = [
  'data-forteca-frt-029-root="true"',
  'Imi\u0119 i nazwisko / nazwa firmy',
  'Telefon',
  'E-mail',
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
  '[data-closeflow-modal-visual-system="true"].client-case-form-content[data-case-add-modal="true"]',
  'background: var(--cf-vst-surface-card-solid) !important',
  'border: 1px solid var(--cf-vst-surface-border) !important',
  'border-radius: var(--cf-vst-radius-panel) !important',
  '.client-case-form-footer',
];

for (const needle of requiredCss) {
  if (!frt036Css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const formBlocks = frt036Css
  .split('}')
  .filter((block) => /client-case-form|client-detail-edit|case-detail-form/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (formBlocks.includes(dark)) fail(`dark color in client/case form css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (combined.includes(mojibake) || frt036Css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS client case forms visual rebuild');
