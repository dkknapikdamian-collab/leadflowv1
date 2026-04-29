const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function must(file, needle, label) {
  const body = read(file);
  if (!body.includes(needle)) {
    throw new Error(`${file}: missing ${label || needle}`);
  }
  console.log(`OK: ${file} contains ${label || needle}`);
}

must('src/index.css', "visual-stage24-leads-html-dom-parity-hardfix.css", 'Stage24 import');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'VISUAL_STAGE24_LEADS_HTML_DOM_PARITY_HARDFIX', 'Stage24 marker');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'max-width: 1500px', 'HTML page width');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'LISTA SPRZEDAZOWA', 'single HTML kicker');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'grid-template-columns: repeat(5, minmax(0, 1fr))', 'HTML grid-5');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'data-stage32-leads-value-layout="true"', 'existing search/right rail kept');
must('src/styles/visual-stage24-leads-html-dom-parity-hardfix.css', 'white-space: normal', 'cut text fix');
must('src/pages/Leads.tsx', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1', 'existing Leads logic kept');
must('src/pages/Leads.tsx', 'handleArchiveLead', 'trash action kept');
must('src/pages/Leads.tsx', 'handleCreateLead', 'create lead action kept');
must('src/pages/Leads.tsx', 'leadSearchSuggestions', 'search suggestions kept');

console.log('OK: Visual Stage24 Leads HTML DOM parity hardfix guard passed.');