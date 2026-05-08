#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function fail(message) {
  console.error(`[closeflow-page-header-copy-contract] FAIL: ${message}`);
  process.exit(1);
}

const app = read('src/App.tsx');
const headerCss = read('src/styles/closeflow-page-header.css');

if (!app.includes("import './styles/closeflow-page-header.css';")) {
  fail('src/App.tsx must import the global page header contract.');
}

[
  'CLOSEFLOW_PAGE_HEADER_CONTRACT',
  '.page-head',
  '.ai-drafts-page-header',
  '.cf-section-head',
  '--cf-page-head-title',
  '--cf-page-head-muted',
].forEach((needle) => {
  if (!headerCss.includes(needle)) fail(`closeflow-page-header.css missing: ${needle}`);
});

const targetFiles = [
  'src/pages/Leads.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/TodayStable.tsx',
  'src/pages/Templates.tsx',
  'src/App.tsx',
  'src/styles/closeflow-page-header.css',
];

const mojibakePatterns = [
  'Äą',
  'Ă„',
  'Ä‚',
  'Ă‚',
  'Ă˘â‚¬',
  'Ă˘â€',
  'ďż˝',
  'wartoĹ',
  'dziĹ',
  'pĹ',
  'obsĹ',
  'obowiÄ',
  'powiÄ',
  'potrĹ',
  'PrzenieĹ',
  'OdĹ',
  '`r`n',
];

for (const rel of targetFiles) {
  const content = read(rel);
  for (const pattern of mojibakePatterns) {
    if (content.includes(pattern)) fail(`${rel} contains mojibake/control marker: ${pattern}`);
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(content)) {
    fail(`${rel} contains control characters.`);
  }
}

const forbiddenHeaderSystems = /(page-head-v2|header-fix|header-repair|page-header-repair)/;
for (const rel of targetFiles) {
  if (forbiddenHeaderSystems.test(read(rel))) {
    fail(`${rel} introduces a local page header repair system.`);
  }
}

if (!read('src/pages/Leads.tsx').includes('className="page-head"')) {
  fail('Leads page must keep using the global page-head class.');
}
if (!read('src/pages/AiDrafts.tsx').includes('className="ai-drafts-page-header"')) {
  fail('AiDrafts must keep using the global ai-drafts page header selector.');
}
if (!read('src/pages/TodayStable.tsx').includes('cf-section-head')) {
  fail('Today stable section header must opt into the shared section header contract.');
}

console.log('[closeflow-page-header-copy-contract] OK: page header and copy contract is clean');
