const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r6-r3-client-data-card-visual-lock.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(adapters.includes("@import '../stage216m-r6-r3-client-data-card-visual-lock.css';"), 'Stage216M-R6-R3 CSS import missing');
assert(css.includes('lead-detail-data-panel-card .lead-detail-section-head > button'), 'Lead data card edit button must be targeted');
assert(css.includes('[data-stage216m-r6-client-data-edit-action="true"]'), 'Client data edit action marker must be targeted');
assert(css.includes('background: #2563eb !important') || css.includes('background-color: #2563eb !important'), 'Edit buttons must be blue');
assert(css.includes('width: 300px !important'), 'Client data card width must be locked to LeadDetail left rail width');
assert(css.includes('grid-template-columns: 300px minmax(0, 1fr) 310px !important'), 'Client shell must keep LeadDetail grid columns');
assert(css.includes('display: none !important'), 'Data card helper descriptions must stay hidden');
assert(css.includes('stage216m-r6-r3-client-data-card-visual-lock'), 'R6-R3 marker missing');

console.log('PASS stage216m-r6-r3-client-data-card-visual-lock-contract');
