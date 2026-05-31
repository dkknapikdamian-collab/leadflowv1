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

mustInclude('src/App.tsx', "import './styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-main-search-surface-and-text-normalization-stage174.css")) {
  if (app.indexOf("closeflow-extend-main-search-source-truth-secondary-pages-stage175.css") < app.indexOf("closeflow-main-search-surface-and-text-normalization-stage174.css")) {
    throw new Error('Stage175 CSS import must be after Stage174 CSS import.');
  }
}

const requiredPages = [
  'src/pages/TasksStable.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/SupportCenter.tsx',
];

for (const rel of requiredPages) {
  mustInclude(rel, 'cf-main-search');
  mustInclude(rel, 'data-cf-main-search-source="stage173"');
  mustInclude(rel, 'data-cf-main-search-stage175="true"');
}

mustNotInclude('src/pages/TasksStable.tsx', 'className="pl-9"');
mustNotInclude('src/pages/Templates.tsx', 'pl-10 text-slate-900');
mustNotInclude('src/pages/ResponseTemplates.tsx', 'className="pl-10"');

const css = 'src/styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css';
[
  'CLOSEFLOW_STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES',
  '--closeflow-stage175-extend-main-search-source-truth-secondary-pages: "active"',
  '--cf175-main-search-height: var(--cf174-main-search-height, 42px)',
  '.cf-main-search[data-cf-main-search-stage175="true"]',
  '.activity-search-box.cf-main-search',
  '.ai-drafts-search-box.cf-main-search',
  '.notifications-search-box.cf-main-search',
  '.support-search-field.cf-main-search',
  'display: none !important',
  'padding: 0 var(--cf175-main-search-padding-x) !important',
].forEach((marker) => mustInclude(css, marker));

[
  'scripts/apply-stage175-extend-main-search-source-truth-secondary-pages.cjs',
  'scripts/check-stage175-extend-main-search-source-truth-secondary-pages.cjs',
  'docs/ui/CLOSEFLOW_STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES.md',
  'docs/ui/CLOSEFLOW_STAGE175_RUNTIME_SECONDARY_SEARCH_AUDIT.js',
  '_project/STAGE175_EXTEND_MAIN_SEARCH_SOURCE_TRUTH_SECONDARY_PAGES_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage175 extend main search source truth secondary pages.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage175 file: ${rel}`);
});

console.log('OK: Stage175 secondary pages main search source truth guard passed.');
