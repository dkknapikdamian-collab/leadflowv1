// VISUAL_STAGE22_LEADS_FINAL_LOCK_GUARD_2026_04_29
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

const filesToScan = [
  'src/index.css',
  'src/styles/visual-stage22-leads-final-lock.css',
  'scripts/check-visual-stage22-leads-final-lock.cjs',
  'docs/VISUAL_STAGE22_LEADS_FINAL_LOCK_2026-04-29.md',
];

const badPatterns = [
  '\u0139',
  '\u00c4',
  '\u0102',
  '\u00e2\u20ac',
  '\u00c5\u00bc',
  '\u00c5\u00ba',
  '\u00c5\u201a',
  '\u00c5\u201e',
  '\u00c5\u203a',
  '\u00c3\u00b3',
];

expect('src/index.css', 'visual-stage22-leads-final-lock.css', 'Stage22 CSS import');
expect('src/styles/visual-stage22-leads-final-lock.css', 'VISUAL_STAGE22_LEADS_FINAL_LOCK_CSS_2026_04_29', 'Stage22 CSS marker');
expect('src/styles/visual-stage22-leads-final-lock.css', '--cf22-sidebar: #101828', 'HTML sidebar token');
expect('src/styles/visual-stage22-leads-final-lock.css', '--cf22-blue: #2563eb', 'HTML blue token');
expect('src/styles/visual-stage22-leads-final-lock.css', 'grid-template-columns: repeat(5, minmax(0, 1fr))', 'grid-5 metric lock');
expect('src/styles/visual-stage22-leads-final-lock.css', '[data-stage32-leads-value-layout="true"]', 'existing value layout preserved');
expect('src/styles/visual-stage22-leads-final-lock.css', 'input[list="lead-search-suggestions-stage31"]', 'existing search preserved');
expect('src/styles/visual-stage22-leads-final-lock.css', '[data-stage32-leads-value-rail="true"]', 'right rail preserved');
expect('src/styles/visual-stage22-leads-final-lock.css', '@media (max-width: 760px)', 'mobile breakpoint');
expect('src/pages/Leads.tsx', 'VISUAL_STAGE18_LEADS_HTML_HARD_1TO1', 'existing Leads hard 1to1 marker');
expect('src/pages/Leads.tsx', 'toggleTrashView', 'trash action preserved');
expect('src/pages/Leads.tsx', 'handleCreateLead', 'create lead action preserved');
expect('src/pages/Leads.tsx', 'lead-search-suggestions-stage31', 'search suggestions preserved');
expectAny('src/components/Layout.tsx', ['main-leads', 'data-current-section={currentSection}'], 'Leads route shell support');
expect('docs/VISUAL_STAGE22_LEADS_FINAL_LOCK_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expect('docs/VISUAL_STAGE22_LEADS_FINAL_LOCK_2026-04-29.md', 'Nie zmieniono logiki', 'do-not-change confirmation');

for (const file of filesToScan) {
  const body = read(file);
  for (const pattern of badPatterns) {
    if (body.includes(pattern)) {
      throw new Error(`${file}: mojibake pattern detected`);
    }
  }
}

console.log('OK: Visual Stage22 Leads final lock guard passed.');
