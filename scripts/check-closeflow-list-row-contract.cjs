#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function fail(message) {
  console.error(`[closeflow-list-row-contract] FAIL: ${message}`);
  process.exit(1);
}

const app = read('src/App.tsx');
const css = read('src/styles/closeflow-list-row-tokens.css');

if (!app.includes("import './styles/closeflow-list-row-tokens.css';")) {
  fail('src/App.tsx must import the global list row contract.');
}

[
  'CLOSEFLOW_LIST_ROW_CONTRACT',
  '--cf-list-row-contact-text',
  '--cf-list-row-value-text',
  '--cf-list-row-client-text',
  '--cf-status-blue-text',
  '--cf-progress-fill',
  '.cf-list-row-contact',
  '.cf-list-row-value',
  '.cf-list-row-client',
  '.cf-status-pill',
  '.cf-progress-bar',
].forEach((needle) => {
  if (!css.includes(needle)) fail(`closeflow-list-row-tokens.css missing: ${needle}`);
});

const files = [
  'src/pages/Leads.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Clients.tsx',
];

const mojibakePatterns = [
  'Äą',
  'Ă„',
  'Ä‚',
  'Ă‚',
  'Ă˘â‚¬',
  'Ă˘â€',
  'ďż˝',
  'powiÄ',
  'potrĹ',
  'PrzenieĹ',
  'OdĹ',
  '`r`n',
];

for (const rel of files) {
  const content = read(rel);
  if (/(list-row-fix|list-row-v2|row-repair|row-fix|progress-repair)/.test(content)) {
    fail(`${rel} introduces a local list row repair system.`);
  }
  for (const pattern of mojibakePatterns) {
    if (content.includes(pattern)) fail(`${rel} contains mojibake marker: ${pattern}`);
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(content)) {
    fail(`${rel} contains control characters.`);
  }
}

const leads = read('src/pages/Leads.tsx');
if (!leads.includes('cf-list-row-contact')) fail('Leads must use cf-list-row-contact for phone/email contact.');
if (!leads.includes('cf-list-row-value')) fail('Leads must use cf-list-row-value for deal value.');
if (!leads.includes('cf-status-pill')) fail('Leads must use cf-status-pill for row status.');
if (/buildLeadCompactMeta[\s\S]{0,260}valueLabel/.test(leads)) {
  fail('Leads compact meta must not mix deal value next to contact.');
}

const cases = read('src/pages/Cases.tsx');
if (!cases.includes('cf-list-row-client')) fail('Cases must use cf-list-row-client for client data.');
if (!cases.includes('cf-status-pill')) fail('Cases must use cf-status-pill for status.');
if (!cases.includes('cf-progress-pill')) fail('Cases must use cf-progress-pill for progress label.');
if (!cases.includes('cf-progress-bar')) fail('Cases must use cf-progress-bar for progress visualization.');

const clients = read('src/pages/Clients.tsx');
if (!clients.includes('cf-list-row-contact')) fail('Clients must use cf-list-row-contact for contact data.');
if (!clients.includes('cf-list-row-value')) fail('Clients must use cf-list-row-value for value data.');
if (!clients.includes('cf-status-pill')) fail('Clients must use cf-status-pill for row status.');

console.log('[closeflow-list-row-contract] OK: list row/contact/value/progress contract is clean');
