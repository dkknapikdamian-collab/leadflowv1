const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');
const marker = 'STAGE231D0C_R12_CLIENT_DETAIL_LEFT_RAIL_MEASURED_AXIS_FIX';
const errors = [];

function requireToken(content, token, label) {
  if (!content.includes(token)) errors.push(`missing ${label}: ${token}`);
}

if (!fs.existsSync(cssPath)) {
  errors.push('missing CSS file');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  requireToken(css, marker, 'R12 marker');
  requireToken(css, '@media (min-width: 1180px)', 'desktop media query');
  requireToken(css, '@media (max-width: 1179px)', 'mobile reset media query');
  requireToken(css, '.client-detail-shell > .client-detail-left-rail', 'direct rail selector');
  requireToken(css, '--cf-client-detail-left-rail-measured-axis-margin: -9px;', 'measured desktop margin');
  requireToken(css, 'margin-top: var(--cf-client-detail-left-rail-measured-axis-margin) !important;', 'desktop margin override');
  requireToken(css, '--cf-client-detail-left-rail-measured-axis-margin: 0px;', 'mobile reset var');
  requireToken(css, 'margin-top: 0 !important;', 'mobile margin reset');
  requireToken(css, 'padding-top: 0 !important;', 'padding reset');
  requireToken(css, 'transform: none !important;', 'transform reset');

  const markerCount = (css.match(new RegExp(marker, 'g')) || []).length;
  if (markerCount !== 1) errors.push(`expected one ${marker}, found ${markerCount}`);

  const markerIndex = css.indexOf(marker);
  const r9Index = css.indexOf('STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN');
  const r7Index = css.indexOf('STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING');
  if (r9Index >= 0 && markerIndex < r9Index) errors.push('R12 block must appear after R9 block');
  if (r7Index >= 0 && markerIndex < r7Index) errors.push('R12 block must appear after R7 block');

  if (/2009px/.test(css)) errors.push('CSS must not contain debug margin 2009px');
}

if (errors.length) {
  console.error('STAGE231D0C/R12 measured axis guard: FAIL');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('STAGE231D0C/R12 measured axis guard: PASS');
