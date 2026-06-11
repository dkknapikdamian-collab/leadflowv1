const fs = require('fs');

const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
const marker = 'STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING';
const errors = [];

function requireToken(token) {
  if (!css.includes(token)) errors.push('missing token: ' + token);
}

requireToken(marker);
requireToken('data-stage231d0c-client-detail-workspace-baseline="true"');
requireToken('--cf-client-detail-rail-card-gap: 22px');
requireToken('--cf-client-detail-left-rail-top-offset: clamp(26px, 2vw, 34px)');
requireToken('.client-detail-left-rail');
requireToken('.client-detail-right-rail');
requireToken('padding-top: var(--cf-client-detail-left-rail-top-offset, clamp(26px, 2vw, 34px)) !important;');
requireToken('gap: var(--cf-client-detail-rail-card-gap) !important;');
requireToken('margin-top: 0 !important;');
requireToken('@media (max-width: 1279px)');

const blockStart = css.indexOf(marker);
const block = blockStart === -1 ? '' : css.slice(blockStart);
if (/transform\s*:\s*translateY\s*\(\s*-/.test(block)) {
  errors.push('R7 must not use negative translateY for rail alignment');
}
if (/margin-top\s*:\s*-/.test(block)) {
  errors.push('R7 must not use negative margin-top for rail alignment');
}
if (/client-detail-top-tiles[\s\S]{0,160}display\s*:\s*none/i.test(block)) {
  errors.push('R7 must not hide accepted top overview tiles');
}

if (errors.length) {
  console.error('STAGE231D0C/R7 ClientDetail left rail spacing guard: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('STAGE231D0C/R7 ClientDetail left rail spacing guard: PASS');
