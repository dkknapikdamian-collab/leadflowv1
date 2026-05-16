const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'Billing.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage16-billing-vnext.css');

function fail(message) {
  console.error('FAIL billing visual rebuild:', message);
  process.exit(1);
}

if (!fs.existsSync(pagePath)) fail('missing Billing.tsx');
if (!fs.existsSync(cssPath)) fail('missing visual-stage16-billing-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredPage = [
  'BILLING_VISUAL_REBUILD_STAGE16',
  'ROZLICZENIA',
  '<h1>Rozliczenia</h1>',
  'Plan, dost\u0119p i status subskrypcji w jednym miejscu.',
  'Trial aktywny',
  'Dost\u0119p aktywny',
  'Trial wygas\u0142',
  'Brak aktywnego dost\u0119pu',
  'Status dost\u0119pu',
  'Obecny pakiet',
  'Co jest dost\u0119pne teraz',
  'Twoje dane zostaj\u0105',
  'Free',
  'Basic',
  'Pro',
  'AI',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing page content: ${needle}`);
}

const rawStatusRenderPatterns = [
  /<[^>]*>\s*trial_active\s*<\/[^>]+>/,
  /<[^>]*>\s*paid_active\s*<\/[^>]+>/,
  /<[^>]*>\s*inactive\s*<\/[^>]+>/,
];

for (const pattern of rawStatusRenderPatterns) {
  if (pattern.test(page)) fail(`technical status rendered in JSX: ${pattern}`);
}

const requiredCss = [
  '.billing-right-rail',
  'background: transparent !important',
  'border: 0 !important',
  'box-shadow: none !important',
  'content: none !important',
  '.right-card.billing-right-card',
  'background: rgba(255, 255, 255, 0.92) !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of requiredCss) {
  if (!css.includes(needle)) fail(`missing css rule: ${needle}`);
}

const rightRailBlocks = css
  .split('}')
  .filter((block) => /billing-right-(rail|card)|right-card\.billing-right-card/.test(block))
  .join('}\n')
  .toLowerCase();

for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
  if (rightRailBlocks.includes(dark)) fail(`dark color in billing right rail css: ${dark}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (page.includes(mojibake) || css.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS billing visual rebuild');
