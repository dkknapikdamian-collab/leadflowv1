const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r10-r4-client-center-tabs-and-intro-lock.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');

const failures = [];
function read(file) {
  if (!fs.existsSync(file)) {
    failures.push(`Missing file: ${path.relative(root, file)}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

const css = read(cssPath);
const adapters = read(adaptersPath);
const lead = read(leadPath);

[
  'STAGE216M_R10_R4_CLIENT_CENTER_TABS_AND_INTRO_LOCK',
  '.client-detail-vnext-page .client-detail-tabs',
  'order: var(--stage216m-r10-r4-client-tabs-order)',
  '.client-detail-vnext-page .client-detail-tab-panel',
  '.client-detail-vnext-page .client-detail-notes-center-section',
  'button[data-client-tab-history].client-detail-tab-active',
  '.lead-detail-left-card-intro',
].forEach((token) => {
  if (!css.includes(token)) failures.push(`CSS token missing: ${token}`);
});

if (!adapters.includes("@import '../stage216m-r10-r4-client-center-tabs-and-intro-lock.css';")) {
  failures.push('page-adapters.css missing R10-R4 import');
}

if (lead.includes('lead-detail-left-card-intro')) {
  failures.push('LeadDetail still contains lead-detail-left-card-intro paragraph');
}

if (lead.includes('Ostatnie 5 zdarzeń powiązanych z tym leadem') || lead.includes('Ostatnie 5 zdarzen powiazanych z tym leadem')) {
  failures.push('LeadDetail still contains activity intro copy');
}

if (failures.length) {
  console.error('FAIL stage216m-r10-r4-client-center-tabs-and-intro-lock-contract');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PASS stage216m-r10-r4-client-center-tabs-and-intro-lock-contract');
