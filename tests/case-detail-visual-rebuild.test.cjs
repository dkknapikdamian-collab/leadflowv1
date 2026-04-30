const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'CaseDetail.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage13-case-detail-vnext.css');

function fail(message) {
  console.error('FAIL case detail visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing CaseDetail.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage13-case-detail-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'CASE_DETAIL_VISUAL_REBUILD_STAGE13',
  'Sprawy /',
  'Klient:',
  'Postęp sprawy',
  'Najbliższa akcja',
  'Obsługa',
  'Ścieżka',
  'Checklisty',
  'Historia',
  'Dodaj brak',
  'Dodaj zadanie',
  'Dodaj wydarzenie',
  'Zrobione',
  'Klient w tle',
  'Otwórz klienta',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page copy: ${needle}`);
}

const tabRegexes = [
  /key:\s*'service'[\s\S]*label:\s*'Obsługa'/,
  /key:\s*'path'[\s\S]*label:\s*'Ścieżka'/,
  /key:\s*'checklists'[\s\S]*label:\s*'Checklisty'/,
  /key:\s*'history'[\s\S]*label:\s*'Historia'/,
];

for (const regex of tabRegexes) {
  if (!regex.test(page)) fail(`missing tab pattern: ${regex}`);
}

for (const technical of ['notification_runtime', 'browser_permission_denied', 'digest_job_failed']) {
  if (page.includes(technical)) fail(`technical label leaked: ${technical}`);
}

const rightRailSelectors = [
  '.case-detail-right-rail',
  '.case-detail-right-card',
  '.right-card.case-detail-right-card',
];

for (const selector of rightRailSelectors) {
  if (!css.includes(selector)) fail(`missing right rail selector: ${selector}`);
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
  .filter((block) => /case-detail-(right|rail|card|side|action)/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (scopedBlocks.includes(dark)) fail(`dark color in case detail right/side css: ${dark}`);
}

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS case detail visual rebuild');
