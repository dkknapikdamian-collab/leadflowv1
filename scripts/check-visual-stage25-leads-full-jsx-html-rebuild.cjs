const fs = require('fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assertContains(file, needle, label) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`${file} missing ${label}: ${needle}`);
  }
  console.log(`OK: ${file} contains ${label}`);
}

function assertNotContains(file, needle, label) {
  const content = read(file);
  if (content.includes(needle)) {
    throw new Error(`${file} contains forbidden ${label}: ${needle}`);
  }
  console.log(`OK: ${file} does not contain ${label}`);
}

const leads = 'src/pages/Leads.tsx';
const index = 'src/index.css';
const css = 'src/styles/visual-stage25-leads-full-jsx-html-rebuild.css';
const docs = 'docs/VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD_MAPPING_2026-04-29.md';

assertContains(leads, 'VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD', 'Stage25 marker');
assertContains(leads, 'data-visual-stage25-leads-full-jsx="true"', 'Stage25 DOM marker');
assertContains(leads, 'className="page-head"', 'page-head class');
assertContains(leads, 'className="grid-5"', 'grid-5 class');
assertContains(leads, 'className="layout-list"', 'layout-list class');
assertContains(leads, 'className="table-card"', 'table-card class');
assertContains(leads, 'className="row lead-row"', 'row lead-row class');
assertContains(leads, 'className="right-card"', 'right-card class');
assertContains(leads, 'className="quick-list"', 'quick-list class');

assertContains(leads, 'handleCreateLead', 'create lead handler kept');
assertContains(leads, 'handleArchiveLead', 'archive lead handler kept');
assertContains(leads, 'handleRestoreLead', 'restore lead handler kept');
assertContains(leads, 'insertLeadToSupabase', 'insert Supabase kept');
assertContains(leads, 'updateLeadInSupabase', 'update Supabase kept');
assertContains(leads, 'leadSearchSuggestions', 'search suggestions kept');
assertContains(leads, 'setIsNewLeadOpen', 'new lead dialog kept');

assertContains(index, "visual-stage25-leads-full-jsx-html-rebuild.css", 'Stage25 CSS import');
assertNotContains(index, "visual-stage22-leads-final-lock.css", 'old Stage22 Leads import');
assertNotContains(index, "visual-stage23-leads-html-parity-fix.css", 'old Stage23 Leads import');
assertNotContains(index, "visual-stage24-leads-html-dom-parity-hardfix.css", 'old Stage24 Leads import');

assertContains(css, 'VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD', 'Stage25 CSS marker');
assertContains(css, '.cf-html-view.main-leads-html .page-head', 'scoped page-head CSS');
assertContains(css, '.cf-html-view.main-leads-html .grid-5', 'scoped grid-5 CSS');
assertContains(css, '.cf-html-view.main-leads-html .row', 'scoped row CSS');

assertContains(docs, '| Funkcja obecna w repo | Gdzie jest teraz | Gdzie będzie w HTML UI | Czy zachowana | Uwagi |', 'mapping table header');
assertContains(docs, 'handleCreateLead', 'mapping includes create handler');
assertContains(docs, 'handleArchiveLead', 'mapping includes archive handler');
assertContains(docs, 'handleRestoreLead', 'mapping includes restore handler');

const mojibakePatterns = ['Ä', 'Ĺ', 'Å', 'Ă', 'Â', 'â€', '�'];
for (const file of [leads, index, css, docs]) {
  const content = read(file);
  for (const pattern of mojibakePatterns) {
    if (content.includes(pattern)) {
      throw new Error(`${file}: mojibake pattern detected: ${pattern}`);
    }
  }
}
console.log('OK: Visual Stage25 Leads full JSX HTML rebuild guard passed.');
