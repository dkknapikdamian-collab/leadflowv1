const fs = require('node:fs');

function fail(lines) {
  console.error('STAGE231D0C/R11 ClientDetail left rail axis lock guard: FAIL');
  for (const line of lines) console.error(`- ${line}`);
  process.exit(1);
}

const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
const errors = [];

const required = [
  'STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK',
  '@media (min-width: 1181px)',
  '.client-detail-shell > .client-detail-left-rail',
  '--cf-client-detail-left-rail-top-offset: clamp(88px, 5vw, 104px) !important;',
  'padding-top: var(--cf-client-detail-left-rail-top-offset) !important;',
  '@media (max-width: 1180px)',
  '--cf-client-detail-left-rail-top-offset: 0px !important;',
  'padding-top: 0 !important;'
];

for (const token of required) {
  if (!css.includes(token)) errors.push(`missing CSS token: ${token}`);
}

const markerIndex = css.lastIndexOf('STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK');
const r9Index = css.lastIndexOf('STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN');
const r7Index = css.lastIndexOf('STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING');
if (markerIndex < 0) errors.push('R11 marker not found');
if (r9Index >= 0 && markerIndex <= r9Index) errors.push('R11 override must be after R9 block');
if (r7Index >= 0 && markerIndex <= r7Index) errors.push('R11 override must be after R7 block');

const forbiddenRuntimeTokens = [
  'from(',
  'supabase',
  'google',
  'calendar',
  'cost',
  'chart'
];
const block = css.slice(Math.max(0, markerIndex), markerIndex + 1200);
for (const token of forbiddenRuntimeTokens) {
  if (block.includes(token)) errors.push(`R11 CSS block must not contain runtime token: ${token}`);
}

const docs = [
  '_project/03_CURRENT_STAGE.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/13_TEST_HISTORY.md'
];
for (const file of docs) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes('STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK')) {
    errors.push(`missing R11 marker in ${file}`);
  }
}

if (errors.length) fail(errors);
console.log('STAGE231D0C/R11 ClientDetail left rail axis lock guard: PASS');
