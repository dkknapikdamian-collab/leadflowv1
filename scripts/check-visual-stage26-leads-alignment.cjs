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

const index = 'src/index.css';
const leads = 'src/pages/Leads.tsx';
const css = 'src/styles/visual-stage26-leads-visual-alignment-fix.css';

assertContains(index, 'visual-stage26-leads-visual-alignment-fix.css', 'Stage26 CSS import');
assertContains(css, 'VISUAL_STAGE26_LEADS_VISUAL_ALIGNMENT_FIX', 'Stage26 marker');
assertContains(css, 'width: min(1500px, calc(100vw - 340px))', 'HTML width alignment');
assertContains(css, 'grid-template-columns: minmax(0, 1fr) 315px', 'HTML right rail width');
assertContains(css, 'content: none !important', 'black corner pseudo cleanup');
assertContains(css, '.quick-list a strong', 'right rail text contrast fix');
assertContains(leads, 'data-visual-stage25-leads-full-jsx="true"', 'Stage25 JSX root kept');
assertContains(leads, 'data-stage26-leads-head-ai="true"', 'page head AI action added');

const files = [index, leads, css];
const mojibakePatterns = ['Ä', 'Ĺ', 'Å', 'Ă', 'Â', 'â€', '�'];
for (const file of files) {
  const content = read(file);
  for (const pattern of mojibakePatterns) {
    if (content.includes(pattern)) {
      throw new Error(`${file}: mojibake pattern detected: ${pattern}`);
    }
  }
}

console.log('OK: Visual Stage26 Leads alignment guard passed.');
