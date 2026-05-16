#!/usr/bin/env node
/* CLOSEFLOW_ETAP3_CLIENTS_WIDE_LAYOUT_GUARD */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const files = {
  clients: path.join(repo, 'src', 'pages', 'Clients.tsx'),
  css: path.join(repo, 'src', 'styles', 'clients-next-action-layout.css'),
  packageJson: path.join(repo, 'package.json'),
};

function fail(message) {
  console.error(`\u2716 ${message}`);
  process.exitCode = 1;
}

function read(file) {
  if (!fs.existsSync(file)) {
    fail(`Missing file: ${path.relative(repo, file)}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

const clients = read(files.clients);
const css = read(files.css);
const pkgRaw = read(files.packageJson);
let pkg = {};
try { pkg = JSON.parse(pkgRaw); } catch (error) { fail(`package.json is not valid JSON: ${error.message}`); }

const marker = 'CLOSEFLOW_ETAP3_CLIENTS_WIDE_LAYOUT';

if (!clients.includes('data-clients-wide-layout="true"')) fail('Clients.tsx must mark /clients layout-list with data-clients-wide-layout="true".');
if (!clients.includes('layout-list w-full max-w-none')) fail('Clients.tsx layout-list must use w-full max-w-none.');
if (!clients.includes('table-card w-full max-w-none')) fail('Clients.tsx table-card must use w-full max-w-none at least once.');
if (!clients.includes('data-client-card-wide-layout="true"')) fail('Clients.tsx client card must mark data-client-card-wide-layout="true".');
if (!/group\/client-card[^"}]*w-full/.test(clients)) fail('Client card class must include w-full next to group/client-card.');

const requiredCss = [
  marker,
  '.main-clients-html .layout-list',
  '.main-clients-html .layout-list > .stack',
  '.main-clients-html .table-card',
  'group\\/client-card',
  '[class*="group/client-card"]',
  'grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(260px, 360px)',
  '@media (max-width: 900px)',
  '@media (max-width: 520px)',
  '.cf-client-card-grid',
];
for (const item of requiredCss) {
  if (!css.includes(item)) fail(`CSS contract missing: ${item}`);
}

const scoped = css.slice(Math.max(0, css.indexOf(marker)));
if (/transform\s*:\s*scale\s*\(/i.test(scoped)) fail('Do not fix client card width with transform: scale().');
if (/width\s*:\s*1[12]\d{2}px/i.test(scoped) || /max-width\s*:\s*1[12]\d{2}px/i.test(scoped)) fail('Do not use fixed desktop width like 1100px/1200px for client cards.');
if (!/width\s*:\s*100%\s*!important/.test(scoped)) fail('Wide layout CSS must force width: 100% for scoped /clients containers.');
if (!/max-width\s*:\s*none\s*!important/.test(scoped)) fail('Wide layout CSS must remove max-width for scoped /clients containers.');

if (pkg?.scripts?.['check:etap3-clients-wide-layout'] !== 'node scripts/check-closeflow-etap3-clients-wide-layout.cjs') {
  fail('package.json missing check:etap3-clients-wide-layout script.');
}

if (process.exitCode) process.exit(process.exitCode);
console.log('\u2714 ETAP 3 clients wide layout guard passed');
