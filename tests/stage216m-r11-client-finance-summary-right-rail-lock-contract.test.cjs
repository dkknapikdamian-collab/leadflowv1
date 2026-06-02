#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r11-client-finance-summary-right-rail-lock.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
let failed = false;
function fail(message) {
  console.error(`FAIL stage216m-r11-client-finance-summary-right-rail-lock-contract: ${message}`);
  failed = true;
}
function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (error) { fail(`Missing file: ${path.relative(root, file)}`); return ''; }
}
const css = read(cssPath);
const adapters = read(adaptersPath);
const client = read(clientPath);
[
  'STAGE216M_R11_CLIENT_FINANCE_SUMMARY_RIGHT_RAIL_LOCK',
  "[data-client-finance-summary='true'][data-stage216m-r4-client-finance-card='true']",
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  '.client-detail-top-cards-side',
  '--stage216m-r11-client-finance-summary-right-rail-lock'
].forEach((token) => { if (!css.includes(token)) fail(`CSS token missing: ${token}`); });
if (!adapters.includes("stage216m-r11-client-finance-summary-right-rail-lock.css")) fail('page-adapters import missing');
[
  'data-stage216m-r4-client-finance-card="true"',
  'Finanse klienta',
  'client-detail-finance-metrics',
  'Najbliższa zaplanowana akcja'
].forEach((token) => { if (!client.includes(token)) fail(`ClientDetail token missing: ${token}`); });
if (failed) process.exit(1);
console.log('PASS stage216m-r11-client-finance-summary-right-rail-lock-contract');
