const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const indexCss = read('src/index.css');
const css = read('src/styles/eliteflow-admin-feedback-p1-hotfix.css');
const leadDetail = read('src/pages/LeadDetail.tsx');
const leads = read('src/pages/Leads.tsx');
const today = read('src/pages/TodayStable.tsx');

function fail(message) {
  console.error('[admin-feedback-p1-hotfix] FAIL: ' + message);
  process.exit(1);
}

const importLine = "@import './styles/eliteflow-admin-feedback-p1-hotfix.css';";
if (!indexCss.includes(importLine)) fail('missing admin feedback css import');
const semanticImportLine = "@import './styles/eliteflow-semantic-badges-and-today-sections.css';";
if (indexCss.includes(semanticImportLine)) {
  if (indexCss.indexOf(importLine) > indexCss.indexOf(semanticImportLine)) {
    fail('admin feedback css import must load before semantic follow-up import');
  }
} else if (!indexCss.trim().endsWith(importLine)) {
  fail('admin feedback css import must be last when semantic follow-up import is absent');
}

[
  'ELITEFLOW_ADMIN_FEEDBACK_P1_HOTFIX_2026_05_07',
  '.sidebar[data-shell-sidebar="true"] .sidebar-footer',
  'grid-template-rows: auto minmax(0, 1fr) auto !important',
  '.cf-html-view.main-leads-html .search > span',
  'textarea#lead-detail-note-box',
  '.cf-html-view.main-leads-html .grid-5',
].forEach((needle) => {
  if (!css.includes(needle)) fail('css missing marker: ' + needle);
});

[
  'ADMIN_FEEDBACK_P1_NOTE_TRANSCRIPT_DEDUPE',
  'leadPrimaryNoteText',
  'note_added',
].forEach((needle) => {
  if (!leadDetail.includes(needle)) fail('LeadDetail missing marker: ' + needle);
});

if (leads.includes('<span>?</span>')) fail('Leads still renders visible question mark search artifact');
if (today.includes('waiting za')) fail('Today still contains English waiting copy');

console.log('[admin-feedback-p1-hotfix] OK');
