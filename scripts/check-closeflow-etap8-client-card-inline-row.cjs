#!/usr/bin/env node
/* CLOSEFLOW_ETAP8_REPAIR3_CLIENT_CARD_INLINE_ROW_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = (message) => {
  console.error(`\u2718 ETAP8 repair3 client inline guard failed: ${message}`);
  process.exit(1);
};
const ok = (message) => console.log(`\u2714 ${message}`);

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail(`Missing ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/clients-next-action-layout.css');
const pkg = JSON.parse(read('package.json'));

const requiredClientTokens = [
  'data-client-card-wide-layout="true"',
  'relative group/client-card w-full',
  'cf-client-row-inline',
  'cf-client-main-cell',
  'cf-client-cases-cell',
  'cf-client-next-action-panel',
  'cf-client-next-action-inline',
  'cf-client-row-actions',
];
for (const token of requiredClientTokens) {
  if (!clients.includes(token)) fail(`Clients.tsx missing token: ${token}`);
}

if (!/className=["'`][^"'`]*\brow\b[^"'`]*\bclient-row\b[^"'`]*\bcf-client-row-inline\b/.test(clients)) {
  fail('cf-client-row-inline must be on the main .row.client-row element');
}
if (!/className=["'`][^"'`]*\blead-main-cell\b[^"'`]*\bcf-client-main-cell\b/.test(clients)) {
  fail('cf-client-main-cell must be on the client main data cell');
}
if (!/className=["'`][^"'`]*\blead-value-cell\b[^"'`]*\bcf-client-cases-cell\b/.test(clients)) {
  fail('cf-client-cases-cell must be on the cases/value/status cell');
}
if (!/className=["'`][^"'`]*\bcf-client-next-action-panel\b[^"'`]*\bcf-client-next-action-inline\b/.test(clients)) {
  fail('cf-client-next-action-inline must be on the nearest action panel, while keeping cf-client-next-action-panel');
}
if (!/className=["'`][^"'`]*(?:\blead-actions\b|\bclient-card-action-buttons\b)[^"'`]*\bcf-client-row-actions\b/.test(clients)) {
  fail('cf-client-row-actions must be on the client card action buttons container');
}

const marker = 'CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW';
const markerIndex = css.indexOf(marker);
if (markerIndex < 0) fail('clients-next-action-layout.css missing CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW block');
const markerBlock = css.slice(markerIndex, markerIndex + 5000);

const requiredCssTokens = [
  '.main-clients-html .client-row.cf-client-row-inline',
  'display: grid',
  'grid-template-columns',
  'minmax(280px, 1.5fr)',
  'minmax(260px, 0.95fr)',
  '.main-clients-html .cf-client-main-cell',
  '.main-clients-html .cf-client-cases-cell',
  '.main-clients-html .cf-client-next-action-inline',
  '.main-clients-html .cf-client-row-actions',
  '@media (max-width: 75rem)',
  '@media (max-width: 47.5rem)',
  'grid-column: 2 / -1',
];
for (const token of requiredCssTokens) {
  if (!markerBlock.includes(token)) fail(`ETAP8 CSS block missing token: ${token}`);
}

if (/\b(?:1100|1200)px\b/i.test(css)) {
  fail('clients-next-action-layout.css must not contain forbidden fixed-width literals 1100px/1200px; use rem breakpoint values');
}
if (/position\s*:\s*absolute/i.test(markerBlock)) {
  fail('Do not use position:absolute for ETAP8 client inline layout');
}
if (/style=\{\{[\s\S]{0,220}position\s*:\s*["']absolute["']/.test(clients)) {
  fail('Do not use inline position:absolute for client card layout');
}
if (!pkg.scripts || pkg.scripts['check:etap8-client-card-inline-row'] !== 'node scripts/check-closeflow-etap8-client-card-inline-row.cjs') {
  fail('package.json must contain script check:etap8-client-card-inline-row');
}
for (const existing of ['check:etap3-clients-wide-layout', 'check:etap4-client-next-action-accent', 'check:closeflow-admin-feedback-2026-05-11']) {
  if (!pkg.scripts || !pkg.scripts[existing]) fail(`Existing guard script removed or missing: ${existing}`);
}

ok('ETAP8 repair3 inline client row contract is present and compatible with ETAP3/ETAP4 guards.');
