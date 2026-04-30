const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'Calendar.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage22-event-form-vnext.css');

function fail(message) {
  console.error('FAIL event form visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing Calendar.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage22-event-form-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'EVENT_FORM_VISUAL_REBUILD_STAGE22',
  'Nowe wydarzenie',
  'Edytuj wydarzenie',
  'Tytuł',
  'Data',
  'Start',
  'Koniec',
  'Powiązanie',
  'Zapisz wydarzenie',
  'Podaj tytuł wydarzenia.',
  'Wybierz poprawną datę.',
  'Godzina zakończenia nie może być przed startem.',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing event form content: ${needle}`);
}

const requiredCss = [
  '.event-form-vnext-content',
  'background: rgba(255, 255, 255, 0.96) !important',
  'border: 1px solid #e4e7ec !important',
  'border-radius: 28px !important',
  'content: none !important',
  '.event-form-footer',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const eventFormBlocks = css
  .split('}')
  .filter((block) => /event-form|event-action|calendar-event-action/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (eventFormBlocks.includes(dark)) fail(`dark color in event form css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS event form visual rebuild');
