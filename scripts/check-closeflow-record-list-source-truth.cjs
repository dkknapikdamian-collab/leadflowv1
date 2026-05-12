const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/styles/closeflow-record-list-source-truth.css',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const leads = fs.readFileSync(path.join(root, 'src/pages/Leads.tsx'), 'utf8');
const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-record-list-source-truth.css'), 'utf8');

const importLine = "import '../styles/closeflow-record-list-source-truth.css';";
if (!leads.includes(importLine)) {
  throw new Error('Leads.tsx does not import closeflow-record-list-source-truth.css');
}
if (!clients.includes(importLine)) {
  throw new Error('Clients.tsx does not import closeflow-record-list-source-truth.css');
}

const markers = [
  'CLOSEFLOW_RECORD_LIST_SOURCE_TRUTH_2026_05_12',
  '.main-leads-html',
  '.main-clients-html',
  '.lead-action-cell',
  '.cf-client-next-action-inline',
  'grid-template-columns',
];

for (const marker of markers) {
  if (!css.includes(marker)) {
    throw new Error(`CSS source truth missing marker: ${marker}`);
  }
}

const clientLayout = fs.existsSync(path.join(root, 'src/styles/clients-next-action-layout.css'))
  ? fs.readFileSync(path.join(root, 'src/styles/clients-next-action-layout.css'), 'utf8')
  : '';

if (clientLayout && !clientLayout.includes('CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW')) {
  throw new Error('Expected existing clients inline row contract marker was not found. Check old client layout file before applying this visual source truth.');
}

console.log('OK closeflow-record-list-source-truth: shared Leads/Clients compact row contract is wired.');
