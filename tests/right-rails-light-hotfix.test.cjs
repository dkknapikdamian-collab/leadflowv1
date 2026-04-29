const fs = require('node:fs');
const path = require('node:path');

function fail(message) {
  console.error('FAIL right rails light hotfix:', message);
  process.exit(1);
}

function checkFile(relPath, required) {
  const filePath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(filePath)) fail(`missing ${relPath}`);
  const css = fs.readFileSync(filePath, 'utf8');
  const start = 'STAGE10A_RIGHT_RAIL_LIGHT_HOTFIX_START';
  const end = 'STAGE10A_RIGHT_RAIL_LIGHT_HOTFIX_END';
  const startIndex = css.indexOf(start);
  const endIndex = css.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) fail(`missing hotfix block in ${relPath}`);
  const block = css.slice(startIndex, endIndex);
  for (const needle of required) {
    if (!block.includes(needle)) fail(`missing rule in ${relPath}: ${needle}`);
  }
  for (const dark of ['#000', '#020617', '#0b1220', '#101828']) {
    if (block.toLowerCase().includes(dark)) fail(`dark color in hotfix block ${relPath}: ${dark}`);
  }
}

checkFile('src/styles/visual-stage9-ai-drafts-vnext.css', [
  '.ai-drafts-vnext-page .ai-drafts-right-rail',
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  'content: none !important',
  '.ai-drafts-vnext-page .right-card.ai-drafts-right-card',
  'background: #ffffff !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
]);

checkFile('src/styles/visual-stage10-notifications-vnext.css', [
  '.notifications-vnext-page .notifications-right-rail',
  'background: transparent !important',
  'background-image: none !important',
  'box-shadow: none !important',
  'content: none !important',
  '.notifications-vnext-page .right-card.notifications-right-card',
  'background: #ffffff !important',
  'border: 1px solid #e4e7ec !important',
  '0 8px 22px rgba(16, 24, 40, 0.05)',
]);

console.log('PASS right rails light hotfix');
