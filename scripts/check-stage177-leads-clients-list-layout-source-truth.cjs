const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-leads-clients-list-layout-source-truth-stage177.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-extend-main-search-source-truth-secondary-pages-stage175.css")) {
  if (app.indexOf("closeflow-leads-clients-list-layout-source-truth-stage177.css") < app.indexOf("closeflow-extend-main-search-source-truth-secondary-pages-stage175.css")) {
    throw new Error('Stage177 CSS import must be after Stage175 CSS import.');
  }
}

[
  'className="layout-list w-full max-w-none"',
  'data-stage177-leads-clients-layout-source="true"',
  'className="table-card lead-table-card w-full max-w-none"',
  'data-lead-card-wide-layout="true"',
  'cf-lead-row-inline',
  'data-stage177-leads-rail-source="clients-aligned"',
].forEach((marker) => mustInclude('src/pages/Leads.tsx', marker));

const css = 'src/styles/closeflow-leads-clients-list-layout-source-truth-stage177.css';
[
  'CLOSEFLOW_STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH',
  '--closeflow-stage177-leads-clients-list-layout-source-truth: "active"',
  '--cf177-record-rail-width: 320px',
  '.main-leads-html, .main-clients-html',
  '.layout-list:has(:is(.lead-right-rail, .clients-right-rail))',
  'grid-template-columns: minmax(0, 1fr) minmax(var(--cf177-record-rail-width), var(--cf177-record-rail-width)) !important',
  '.lead-table-card .lead-row',
  '.client-row.cf-client-row-inline',
  '.operator-simple-filters-card',
  '.operator-top-value-card',
].forEach((marker) => mustInclude(css, marker));

[
  'scripts/apply-stage177-leads-clients-list-layout-source-truth.cjs',
  'scripts/check-stage177-leads-clients-list-layout-source-truth.cjs',
  'docs/ui/CLOSEFLOW_STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE177_RUNTIME_LEADS_CLIENTS_LAYOUT_AUDIT.js',
  '_project/STAGE177_LEADS_CLIENTS_LIST_LAYOUT_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage177 leads clients list layout source truth.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage177 file: ${rel}`);
});

console.log('OK: Stage177 leads/clients list layout source truth guard passed.');
