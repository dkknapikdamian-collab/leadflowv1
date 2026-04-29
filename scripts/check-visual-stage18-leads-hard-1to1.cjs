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

expect('src/index.css', 'visual-stage18-leads-hard-1to1.css', 'Stage18 CSS import');
expect('src/styles/visual-stage18-leads-hard-1to1.css', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1_CSS', 'Stage18 CSS marker');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '--cf18-sidebar: #101828', 'HTML sidebar color token');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '.main-leads header h1::before', 'Leads HTML kicker selector');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '.main-leads .grid-5', 'Leads HTML metric grid selector');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '.main-leads .layout-list', 'Leads HTML layout-list selector');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '.main-leads .table-card', 'Leads HTML table-card selector');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '.main-leads .right-card', 'Leads HTML right-card selector');
expect('src/styles/visual-stage18-leads-hard-1to1.css', '@media (max-width: 760px)', 'mobile breakpoint');
expectAny('src/components/Layout.tsx', ['cf-html-shell', 'VISUAL_STAGE18_CF_HTML_SHELL_COMPAT'], 'HTML shell class/compat marker');
expectAny('src/components/Layout.tsx', ['closeflow-visual-stage01', 'VISUAL_STAGE18_STAGE01_COMPAT'], 'Stage01 visual shell compatibility');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1', 'Leads stage marker');
expect('docs/VISUAL_STAGE18_LEADS_HARD_1TO1_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expect('package.json', 'check:visual-stage18-leads-hard-1to1', 'package guard script');
console.log('OK: Visual Stage18 Leads hard 1:1 guard passed.');
