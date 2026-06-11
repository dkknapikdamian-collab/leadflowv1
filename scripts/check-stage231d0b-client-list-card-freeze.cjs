const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function fail(message) {
  errors.push(message);
}

const errors = [];

const files = {
  clients: 'src/pages/Clients.tsx',
  css: 'src/styles/closeflow-record-list-source-truth.css',
  legacyCss: 'src/styles/clients-next-action-layout.css',
  dictionary: '_project/UI_DICTIONARY_STAGE231D0A.md',
  test: 'tests/stage231d0b-client-list-card-freeze.test.cjs',
  runReport: '_project/runs/2026-06-10_STAGE231D0B_R9_CLIENT_LIST_CARD_POLISH_SOURCE_TRUTH.md',
};

const clients = read(files.clients);
const css = read(files.css);
const legacyCss = exists(files.legacyCss) ? read(files.legacyCss) : '';
const dictionary = exists(files.dictionary) ? read(files.dictionary) : '';
const testFile = exists(files.test) ? read(files.test) : '';
const runReport = exists(files.runReport) ? read(files.runReport) : '';

function requireIncludes(name, text, token) {
  if (!text.includes(token)) fail(name + ' is missing required token: ' + token);
}

function forbidIncludes(name, text, token) {
  if (text.includes(token)) fail(name + ' contains forbidden token: ' + token);
}

function makeEncodingDriftTokens() {
  const single = [0x0102, 0x0139, 0x00c4, 0x00c5, 0x00c2, 0xfffd].map((code) => String.fromCodePoint(code));
  const triplet = String.fromCodePoint(0x010f) + String.fromCodePoint(0x017c) + String.fromCodePoint(0x02dd);
  return [...single, triplet];
}

const encodingTargets = [
  files.clients,
  files.css,
  files.legacyCss,
  files.dictionary,
  files.test,
  files.runReport,
  'scripts/check-stage231d0b-client-list-card-freeze.cjs',
].filter(exists);

for (const rel of encodingTargets) {
  const content = read(rel);
  for (const token of makeEncodingDriftTokens()) {
    if (content.includes(token)) fail('Encoding drift detected in ' + rel + ' tokenCode=' + Array.from(token).map((char) => char.codePointAt(0).toString(16)).join('-'));
  }
}

forbidIncludes('Clients.tsx', clients, 'Leady:');
forbidIncludes('Clients.tsx', clients, 'Aktywna sprawa');
requireIncludes('Clients.tsx', clients, 'Sprawy:');
requireIncludes('Clients.tsx', clients, 'Aktywna prowizja');
requireIncludes('Clients.tsx', clients, 'Zarobione łącznie');
requireIncludes('Clients.tsx', clients, 'client-list-card-row-primary');
requireIncludes('Clients.tsx', clients, 'client-list-card-row-secondary');
requireIncludes('Clients.tsx', clients, 'client-list-card-phone');
requireIncludes('Clients.tsx', clients, 'client-list-card-email');

/* STAGE231D0B_R10_GUARD_START */
requireIncludes('Clients.tsx', clients, 'data-stage231d0b-r10-client-card-alignment="true"');
requireIncludes('Clients.tsx', clients, "title={client.name || 'Klient'}");
requireIncludes('Clients.tsx', clients, "title={client.phone || 'Brak telefonu'}");
requireIncludes('Clients.tsx', clients, "title={client.email || 'Brak e-maila'}");
requireIncludes('Clients.tsx', clients, "title={client.company || 'Bez firmy'}");
requireIncludes('Clients.tsx', clients, 'title={nearestActionLabel}');
requireIncludes('Clients.tsx', clients, "title={'Aktywna prowizja: ' + formatClientMoney(clientFinance.activeCommission)}");
requireIncludes('Clients.tsx', clients, "title={'Zarobione łącznie: ' + formatClientMoney(clientFinance.lifetimeEarned)}");
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10_CLIENT_CARD_ALIGNMENT_ELLIPSIS_TOOLTIP');
requireIncludes('CSS source truth', css, 'data-stage231d0b-r10-client-card-alignment="true"');
requireIncludes('CSS source truth', css, 'grid-column: 4');
requireIncludes('CSS source truth', css, 'text-overflow: ellipsis');
/* STAGE231D0B_R10_GUARD_END */

/* STAGE231D0B_R10_R7_FINANCE_ALIGN_GUARD_START */
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10-R7_FINANCE_CHIP_START_ALIGN');
requireIncludes('CSS source truth', css, 'justify-items: start');
requireIncludes('CSS source truth', css, 'place-self: center start');
requireIncludes('CSS source truth', css, 'margin-inline-start: 0');
/* STAGE231D0B_R10_R7_FINANCE_ALIGN_GUARD_END */


/* STAGE231D0B_R10_R8_FINANCE_ALIGN_GUARD_START */
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10-R8_FINANCE_CHIP_END_ALIGN');
requireIncludes('CSS source truth', css, 'place-self: center end');
requireIncludes('CSS source truth', css, 'justify-self: end');
requireIncludes('CSS source truth', css, 'margin-inline-start: auto');
requireIncludes('CSS source truth', css, 'margin-inline-end: 0');
/* STAGE231D0B_R10_R8_FINANCE_ALIGN_GUARD_END */


/* STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN_GUARD_START */
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10-R9_FINANCE_TEXT_START_ALIGN');
requireIncludes('CSS source truth', css, 'finance text must start on one shared left axis');
requireIncludes('CSS source truth', css, 'R8 right-edge alignment is deprecated');
requireIncludes('CSS source truth', css, 'place-self: center start');
requireIncludes('CSS source truth', css, 'justify-self: start');
requireIncludes('CSS source truth', css, 'margin-inline-start: 0');
requireIncludes('CSS source truth', css, 'margin-inline-end: auto');
/* STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN_GUARD_END */


/* STAGE231D0B_R10_R10_SINGLE_GRID_GUARD_START */
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10-R10_SINGLE_GRID_ALIGNMENT');
const stage231d0bR10R10BlockIndex = css.indexOf('STAGE231D0B-R10-R10_SINGLE_GRID_ALIGNMENT');
const stage231d0bR10R10Block = stage231d0bR10R10BlockIndex >= 0 ? css.slice(stage231d0bR10R10BlockIndex) : '';
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'display: contents');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'grid-template-rows: auto auto');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, '.cf-client-active-commission');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, '.cf-client-lifetime-earned');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'grid-column: 4');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'grid-row: 1');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'grid-row: 2');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'place-self: center start');
requireIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'margin-inline-start: 0');
forbidIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'place-self: center end');
forbidIncludes('R10/R10 final CSS block', stage231d0bR10R10Block, 'justify-self: end');
/* STAGE231D0B_R10_R10_SINGLE_GRID_GUARD_END */


/* STAGE231D0B_R10_R11_FIXED_COLUMN_AXIS_GUARD_START */
requireIncludes('CSS source truth', css, 'STAGE231D0B-R10-R11_FIXED_COLUMN_AXIS');
const stage231d0bR10R11BlockIndex = css.indexOf('STAGE231D0B-R10-R11_FIXED_COLUMN_AXIS');
const stage231d0bR10R11Block = stage231d0bR10R11BlockIndex >= 0 ? css.slice(stage231d0bR10R11BlockIndex) : '';
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, '--cf-client-card-name-col');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, '--cf-client-card-phone-col');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, '--cf-client-card-email-col');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, '--cf-client-card-finance-col');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, 'grid-template-columns: var(--cf-client-card-name-col) var(--cf-client-card-phone-col) var(--cf-client-card-email-col) var(--cf-client-card-finance-col) var(--cf-client-card-status-col)');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, 'display: contents');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, 'grid-column: 4');
requireIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, 'place-self: center start');
forbidIncludes('R10/R11 fixed-axis CSS block', stage231d0bR10R11Block, 'grid-template-columns: minmax(9.5rem, 1.15fr) minmax(6.7rem, 0.58fr) minmax(9.5rem, 0.9fr) minmax(9rem, max-content)');
/* STAGE231D0B_R10_R11_FIXED_COLUMN_AXIS_GUARD_END */

requireIncludes('CSS source truth', css, 'STAGE231D0B-R9_CLIENT_LIST_CARD_POLISH_SOURCE_TRUTH');
requireIncludes('CSS source truth', css, 'cf-client-active-commission');
requireIncludes('CSS source truth', css, 'cf-client-lifetime-earned');
requireIncludes('CSS source truth', css, 'width: fit-content');
requireIncludes('CSS source truth', css, 'max-width: max-content');

const unscopedSelectors = [
  'client-list-card-row-primary',
  'client-list-card-row-secondary',
  'client-list-card-phone',
  'client-list-card-active-commission',
  'client-list-card-earned',
];

for (const selector of unscopedSelectors) {
  const lines = css.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('.' + selector)) {
      fail('CSS source truth has unscoped selector .' + selector + ' at line ' + (index + 1));
    }
  }
}

const longBarPatterns = [
  /\.cf-client-active-commission[\s\S]{0,260}\bwidth\s*:\s*100%/,
  /\.cf-client-lifetime-earned[\s\S]{0,260}\bwidth\s*:\s*100%/,
  /\.client-list-card-active-commission[\s\S]{0,260}\bwidth\s*:\s*100%/,
  /\.client-list-card-earned[\s\S]{0,260}\bwidth\s*:\s*100%/,
];
for (const pattern of longBarPatterns) {
  if (pattern.test(css)) fail('Financial metric CSS looks like a full-width bar instead of a compact chip.');
}

if (/\.client-row\s*\{[\s\S]{0,260}grid-template-areas/.test(legacyCss) && !legacyCss.includes(':not(.cf-client-row-two-line)')) {
  fail('clients-next-action-layout.css legacy .client-row grid is not narrowed away from .cf-client-row-two-line');
}
if (/\.cf-client-row-two-line\s*\{[\s\S]{0,260}grid-template-areas/.test(legacyCss)) {
  fail('clients-next-action-layout.css must not define grid-template-areas for .cf-client-row-two-line');
}

requireIncludes('UI Dictionary', dictionary, 'ClientListCard');
requireIncludes('UI Dictionary', dictionary, 'LeadListCard');
requireIncludes('UI Dictionary', dictionary, 'lead-opportunity-row');

if (!exists(files.test)) fail('Missing file test: ' + files.test);
if (exists(files.test)) {
  requireIncludes('Stage test', testFile, 'node:test');
  requireIncludes('Stage test', testFile, 'check-stage231d0b-client-list-card-freeze.cjs');
}

if (!runReport.includes('CSS SOURCE OF TRUTH MAP')) fail('Run report is missing CSS SOURCE OF TRUTH MAP');
if (!runReport.includes('LEADLISTCARD MAPPING')) fail('Run report is missing LEADLISTCARD MAPPING');

if (errors.length > 0) {
  console.error('STAGE231D0B client list card freeze guard: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('STAGE231D0B client list card freeze guard: PASS');
