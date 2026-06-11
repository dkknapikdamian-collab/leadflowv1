const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');
const css = fs.readFileSync(cssPath, 'utf8');
const errors = [];
function requireText(token, message) { if (!css.includes(token)) errors.push(message); }

requireText('STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN', 'missing R9 marker');
requireText('--cf-client-detail-left-rail-top-offset: clamp(58px, 3.75vw, 72px);', 'missing stronger desktop left rail offset');
requireText('.client-detail-shell > .client-detail-left-rail', 'missing shell-child left rail selector');
requireText('padding-top: var(--cf-client-detail-left-rail-top-offset, 64px) !important;', 'missing desktop left rail padding override');
requireText('@media (max-width: 1179px)', 'missing tablet/mobile reset media query');
requireText('padding-top: 0 !important;', 'missing tablet/mobile offset reset');

const blockMatch = css.match(/\/\* STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN[\s\S]*?\n}\s*$/);
const block = blockMatch ? blockMatch[0] : '';
if (/transform\s*:\s*translateY\s*\(\s*-/.test(block)) errors.push('R9 must not use negative translateY');
if (/margin-top\s*:\s*-/.test(block)) errors.push('R9 must not use negative margin-top');
if (/position\s*:\s*absolute/.test(block)) errors.push('R9 must not use absolute positioning');

if (errors.length) {
  console.error('STAGE231D0C/R9 ClientDetail left rail visual align guard: FAIL');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('STAGE231D0C/R9 ClientDetail left rail visual align guard: PASS');
