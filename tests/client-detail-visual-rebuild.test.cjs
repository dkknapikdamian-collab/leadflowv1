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
  'Otwórz główną sprawę',
  'Nowa sprawa dla klienta',
  'Telefon',
  'E-mail',
  'Sprawy',
  'Historia',
  'Podsumowanie',
  'Historia pozyskania',
  'Otwórz sprawę',
  'Edytuj dane klienta',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page copy: ${needle}`);
}

const tabRegexes = [
  /key:\s*'summary'[\s\S]*label:\s*'Podsumowanie'/,
  /key:\s*'cases'[\s\S]*label:\s*'Sprawy'/,
  /key:\s*'history'[\s\S]*label:\s*'Historia'/,
];

for (const regex of tabRegexes) {
  if (!regex.test(page)) fail(`missing tab pattern: ${regex}`);
}

if (/bg-yellow|yellow-|pusty alert|alert-warning/i.test(page)) {
  fail('page contains possible empty yellow alert implementation');
}

const sideSelectors = [
  '.client-detail-left-rail',
  '.client-detail-right-rail',
  '.client-detail-side-card',
  '.client-detail-right-card',
  '.right-card.client-detail-right-card',
];

for (const selector of sideSelectors) {
  if (!css.includes(selector)) fail(`missing side/right selector: ${selector}`);
}

const requiredCss = [
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  'content: none !important',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const scopedBlocks = css
  .split('}')
  .filter((block) => /client-detail-(left|right|side|rail|card)/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (scopedBlocks.includes(dark)) fail(`dark color in client detail side/right/card css: ${dark}`);
}

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS client detail visual rebuild');
