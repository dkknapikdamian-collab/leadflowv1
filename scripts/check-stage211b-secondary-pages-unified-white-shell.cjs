const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const emergencyPath = path.join(repo, 'src/styles/emergency/emergency-hotfixes.css');
const css = fs.readFileSync(emergencyPath, 'utf8');

const required = [
  'STAGE211B_SECONDARY_PAGES_UNIFIED_WHITE_SHELL',
  '.activity-vnext-page',
  '.ai-drafts-vnext-page',
  '.notifications-vnext-page',
  '.billing-vnext-page',
  '.support-vnext-page',
  '.settings-vnext-page',
  "body:has(:is(",
  "[data-shell-main='true']",
  "[data-shell-content='true']",
  '.view.active',
  'background: #ffffff !important',
  'background-image: none !important',
];

const missing = required.filter((item) => !css.includes(item));
if (missing.length) {
  console.error('STAGE211B_SECONDARY_PAGES_UNIFIED_WHITE_SHELL_GUARD_FAIL: missing ' + missing.join(', '));
  process.exit(1);
}

// Guard against reintroducing the old gradient as the final source of truth in the new block.
const blockStart = css.indexOf('STAGE211B_SECONDARY_PAGES_UNIFIED_WHITE_SHELL');
const block = blockStart >= 0 ? css.slice(blockStart) : '';
if (/radial-gradient|linear-gradient\(180deg,\s*#f4f6f8/.test(block)) {
  console.error('STAGE211B_SECONDARY_PAGES_UNIFIED_WHITE_SHELL_GUARD_FAIL: old gradient found inside Stage211B block');
  process.exit(1);
}

console.log('STAGE211B_SECONDARY_PAGES_UNIFIED_WHITE_SHELL_GUARD_PASS');
