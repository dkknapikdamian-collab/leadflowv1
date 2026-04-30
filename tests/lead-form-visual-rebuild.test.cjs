const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'Leads.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage20-lead-form-vnext.css');

function fail(message) {
  console.error('FAIL lead form visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing Leads.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage20-lead-form-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'LEAD_FORM_VISUAL_REBUILD_STAGE20',
  'SZYBKIE DODANIE LEADA',
  'Nazwa / kontakt',
  'Telefon',
  'E-mail',
  'Źródło',
  'Temat / potrzeba',
  'Wartość',
  'Notatka',
  'Zapisz leada',
  'Anuluj',
  'Podaj nazwę albo kontakt.',
  'Podaj telefon, e-mail albo opis potrzeby.',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page content: ${needle}`);
}

const requiredCss = [
  '.lead-form-vnext-content',
  'background: rgba(255, 255, 255, 0.96) !important',
  'border: 1px solid #e4e7ec !important',
  'border-radius: 28px !important',
  'content: none !important',
  '.lead-form-section',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const leadFormBlocks = css
  .split('}')
  .filter((block) => /lead-form/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (leadFormBlocks.includes(dark)) fail(`dark color in lead form css: ${dark}`);
}

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS lead form visual rebuild');
