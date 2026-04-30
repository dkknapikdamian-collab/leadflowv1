const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'SupportCenter.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage17-support-vnext.css');

function fail(message) {
  console.error('FAIL support visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing SupportCenter.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage17-support-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'SUPPORT_VISUAL_REBUILD_STAGE17',
  'POMOC',
  '<h1>Pomoc</h1>',
  'Zgłoszenia, odpowiedzi i kontakt w jednym miejscu.',
  'Wyślij zgłoszenie',
  '<Label>Temat</Label>',
  '<Label>Opis</Label>',
  'Najczęstsze pytania',
  'Status zgłoszeń',
  'Nowe',
  'W trakcie',
  'Odpowiedziano',
  'Zamknięte',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page content: ${needle}`);
}

const rawStatusRenderPatterns = [
  /<[^>]*>\s*new\s*<\/[^>]+>/,
  /<[^>]*>\s*in_progress\s*<\/[^>]+>/,
  /<[^>]*>\s*answered\s*<\/[^>]+>/,
  /<[^>]*>\s*closed\s*<\/[^>]+>/,
];

for (const pattern of rawStatusRenderPatterns) {
  if (pattern.test(page)) fail(`technical status rendered in JSX: ${pattern}`);
}

const requiredCss = [
  '.support-right-rail',
  'background: transparent !important',
  'border: 0 !important',
  'box-shadow: none !important',
  'content: none !important',
  '.right-card.support-right-card',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const rightRailBlocks = css
  .split('}')
  .filter((block) => /support-right-(rail|card)|right-card\.support-right-card/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (rightRailBlocks.includes(dark)) fail(`dark color in support right rail css: ${dark}`);
}

for (const mojibake of ['BĹ‚Ä…d', 'OtwĂłrz', 'Å¹rĂłdło', 'CyklicznoĹ›Ä‡']) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS support visual rebuild');
