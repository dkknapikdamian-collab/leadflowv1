const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'Settings.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage19-settings-vnext.css');

function fail(message) {
  console.error('FAIL settings visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing Settings.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage19-settings-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'SETTINGS_VISUAL_REBUILD_STAGE19',
  'USTAWIENIA',
  '<h1>Ustawienia</h1>',
  'Konto, workspace, powiadomienia i preferencje aplikacji.',
  'Konto',
  'Workspace',
  'Powiadomienia',
  'Preferencje aplikacji',
  'Dost\u0119p i bezpiecze\u0144stwo',
  'Dane',
  'Integracje',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page content: ${needle}`);
}

const rawStatusRenderPatterns = [
  /<[^>]*>\s*trial_active\s*<\/[^>]+>/,
  /<[^>]*>\s*paid_active\s*<\/[^>]+>/,
  /<[^>]*>\s*inactive\s*<\/[^>]+>/,
  /<[^>]*>\s*payment_failed\s*<\/[^>]+>/,
];

for (const pattern of rawStatusRenderPatterns) {
  if (pattern.test(page)) fail(`technical status rendered in JSX: ${pattern}`);
}

const requiredCss = [
  '.settings-right-rail',
  'background: transparent !important',
  'border: 0 !important',
  'box-shadow: none !important',
  'content: none !important',
  '.right-card.settings-right-card',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const rightRailBlocks = css
  .split('}')
  .filter((block) => /settings-right-(rail|card)|right-card\.settings-right-card/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (rightRailBlocks.includes(dark)) fail(`dark color in settings right rail css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS settings visual rebuild');
