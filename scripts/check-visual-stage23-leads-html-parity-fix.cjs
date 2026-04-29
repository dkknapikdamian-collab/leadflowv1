// VISUAL_STAGE23_LEADS_HTML_PARITY_FIX_GUARD
const fs = require('fs');
const path = require('path');

function read(file) {
  const target = path.join(process.cwd(), file);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(target, 'utf8');
}

function expect(file, needle, label) {
  const body = read(file);
  if (!body.includes(needle)) throw new Error(`${file}: missing ${label || needle}`);
  console.log(`OK: ${file} contains ${label || needle}`);
}

function expectNo(file, needle, label) {
  const body = read(file);
  if (body.includes(needle)) throw new Error(`${file}: forbidden ${label || needle}`);
  console.log(`OK: ${file} does not contain ${label || needle}`);
}

expect('src/index.css', 'visual-stage23-leads-html-parity-fix.css', 'Stage23 CSS import');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', 'VISUAL_STAGE23_LEADS_HTML_PARITY_FIX_CSS', 'Stage23 CSS marker');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', 'grid-template-columns: repeat(5, minmax(0, 1fr))', 'HTML grid-5 metric lock');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', "[data-stage32-leads-value-layout='true']", 'existing search and value layout preserved');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', "[data-stage32-leads-value-rail='true']", 'right rail preserved');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', "[data-shell-content='true'] > div > .space-y-3", 'lead list area lock');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', 'white-space: normal', 'truncated lead text fix');
expect('src/styles/visual-stage23-leads-html-parity-fix.css', '@media (max-width: 760px)', 'mobile breakpoint');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1', 'existing Leads hard 1to1 screen kept');
expect('src/pages/Leads.tsx', 'toggleTrashView', 'trash action preserved');
expect('src/pages/Leads.tsx', 'handleCreateLead', 'create lead action preserved');
expect('src/pages/Leads.tsx', 'leadSearchSuggestions', 'search suggestions preserved');
expect('docs/VISUAL_STAGE23_LEADS_HTML_PARITY_FIX_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expect('docs/VISUAL_STAGE23_LEADS_HTML_PARITY_FIX_2026-04-29.md', 'Nie zmieniono', 'do-not-change confirmation');
expectNo('src/styles/visual-stage23-leads-html-parity-fix.css', 'TODO_FAKE_ACTION', 'fake actions marker');
console.log('OK: Visual Stage23 Leads HTML parity fix guard passed.');
