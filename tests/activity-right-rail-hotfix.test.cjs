const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const cssPath = path.join(root, 'src', 'styles', 'visual-stage8-activity-vnext.css');

function fail(message) {
  console.error('FAIL activity right rail hotfix:', message);
  process.exit(1);
}

if (!fs.existsSync(cssPath)) {
  fail('missing visual-stage8-activity-vnext.css');
}

const css = fs.readFileSync(cssPath, 'utf8');
const start = 'STAGE8A_ACTIVITY_RIGHT_RAIL_LIGHT_HOTFIX_START';
const end = 'STAGE8A_ACTIVITY_RIGHT_RAIL_LIGHT_HOTFIX_END';
const startIndex = css.indexOf(start);
const endIndex = css.indexOf(end);

if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
  fail('missing hotfix marker block');
}

const secondStart = css.indexOf(start, startIndex + start.length);
if (secondStart !== -1) {
  fail('duplicate hotfix marker block');
}

const block = css.slice(startIndex, endIndex);

const required = [
  '.activity-vnext-page .activity-right-rail',
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  '.activity-vnext-page .activity-right-rail::before',
  '.activity-vnext-page .activity-right-rail::after',
  'content: none !important',
  '.activity-vnext-page .activity-right-rail > .right-card.activity-right-card',
  'background: #ffffff !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
];

for (const needle of required) {
  if (!block.includes(needle)) {
    fail(`missing rule: ${needle}`);
  }
}

const forbiddenDarkInBlock = ['#000', '#020617', '#0b1220', '#101828'];
for (const dark of forbiddenDarkInBlock) {
  if (block.toLowerCase().includes(dark)) {
    fail(`dark color in hotfix block: ${dark}`);
  }
}

console.log('PASS activity right rail hotfix');
