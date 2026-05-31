const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) throw new Error(`${rel} must not contain marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-main-search-surface-and-text-normalization-stage174.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-main-search-source-truth-stage173.css")) {
  if (app.indexOf("closeflow-main-search-surface-and-text-normalization-stage174.css") < app.indexOf("closeflow-main-search-source-truth-stage173.css")) {
    throw new Error('Stage174 CSS import must be after Stage173 CSS import.');
  }
}

const css = 'src/styles/closeflow-main-search-surface-and-text-normalization-stage174.css';
[
  'CLOSEFLOW_STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION',
  '--closeflow-stage174-main-search-surface-and-text-normalization: "active"',
  '--cf174-main-search-font-weight: 600',
  'background: transparent !important',
  'box-shadow: none !important',
  'display: none !important',
  'padding: 0 var(--cf174-main-search-padding-x) !important',
  '.layout-list > .stack > .cf-main-search',
  'width: 100% !important',
].forEach((marker) => mustInclude(css, marker));

mustInclude('src/pages/Cases.tsx', 'Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...');
mustNotInclude('src/pages/Cases.tsx', 'Szukaj sprawy, klienta, telefonu, maila albo statusu...');
mustNotInclude('src/pages/Cases.tsx', 'Szukaj sprawy, klienta, telefonu, e-maila albo statusu...');
mustNotInclude('src/pages/Cases.tsx', 'Szukaj sprawy, klienta, telefonu, e-mailu albo statusu...');

[
  'scripts/apply-stage174-main-search-surface-and-text-normalization.cjs',
  'scripts/check-stage174-main-search-surface-and-text-normalization.cjs',
  'docs/ui/CLOSEFLOW_STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION.md',
  'docs/ui/CLOSEFLOW_STAGE174_RUNTIME_MAIN_SEARCH_AUDIT.js',
  '_project/STAGE174_MAIN_SEARCH_SURFACE_AND_TEXT_NORMALIZATION_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage174 main search surface and text normalization.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage174 file: ${rel}`);
});

console.log('OK: Stage174 main search surface and text normalization guard passed.');
