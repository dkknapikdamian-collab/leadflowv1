// VISUAL_STAGE18_LEADS_HTML_HARD_1TO1_GUARD
const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

function expect(file, needle, label) {
  const body = read(file);
  if (!body.includes(needle)) {
    throw new Error(`${file}: missing ${label || needle}`);
  }
  console.log(`OK: ${file} contains ${label || needle}`);
}

function expectAny(file, needles, label) {
  const body = read(file);
  if (!needles.some((needle) => body.includes(needle))) {
    throw new Error(`${file}: missing ${label || needles.join(' OR ')}`);
  }
  console.log(`OK: ${file} contains ${label || needles.join(' OR ')}`);
}

function reject(file, needle, label) {
  const body = read(file);
  if (body.includes(needle)) {
    throw new Error(`${file}: forbidden ${label || needle}`);
  }
  console.log(`OK: ${file} excludes ${label || needle}`);
}

reject('src/index.css', 'visual-stage18-leads-hard-1to1.css', 'inactive Stage18 global CSS import');
expect('src/pages/Leads.tsx', "../styles/closeflow-record-list-source-truth.css", 'current record-list CSS import');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual owner entrypoint');
expect('src/styles/closeflow-record-list-source-truth.css', 'main-leads-html', 'scoped Leads record-list adapter');
expect('src/styles/owners/closeflow-records-and-rails.css', 'main-leads-html .right-card', 'canonical Leads right-rail owner');
expect('src/styles/owners/closeflow-calendar.css', '.grid-5', 'canonical metric-grid owner');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD', 'retained Leads structure contract');
expect('src/pages/Leads.tsx', 'className="grid-5"', 'Leads metric grid structure');
expect('src/pages/Leads.tsx', 'className="layout-list"', 'Leads list structure');
expect('src/pages/Leads.tsx', 'className="table-card', 'Leads table structure');
expect('src/pages/Leads.tsx', 'lead-right-card', 'Leads right-rail structure');
expect('src/styles/owners/closeflow-responsive-adapters.css', '@media (max-width: 760px)', 'canonical mobile adapter');
expect('src/components/Layout.tsx', 'cf-html-shell', 'canonical HTML shell class');
expect('src/components/Layout.tsx', 'closeflow-visual-semantic01', 'canonical semantic shell class');
expect('docs/VISUAL_STAGE18_LEADS_HARD_1TO1_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expect('package.json', 'check:visual-stage18-leads-hard-1to1', 'package guard script');
console.log('OK: Visual Stage18 Leads guard reconciled with current Leads source truth.');
