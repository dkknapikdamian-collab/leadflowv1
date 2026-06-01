const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r1-client-detail-lead-grid-lock.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(adapters.includes("@import '../stage216m-r1-client-detail-lead-grid-lock.css';"), 'missing Stage216M-R1 import');
assert(adapters.indexOf("stage216m-r1-client-detail-lead-grid-lock.css") > adapters.indexOf("stage216m-client-detail-lead-dimensions-sync.css"), 'Stage216M-R1 import must be after Stage216M');
assert(css.includes('max-width: 1480px !important'), 'ClientDetail must use LeadDetail max width');
assert(css.includes('grid-template-columns: 300px minmax(0, 1fr) 310px !important'), 'ClientDetail shell must use LeadDetail grid');
assert(css.includes('gap: 22px !important'), 'ClientDetail shell must use LeadDetail gap');
assert(css.includes('width: auto !important') && css.includes('max-width: none !important'), 'Stage216M fixed column widths must be neutralized');
assert(!css.includes('--stage216m-page-max: 1108px'), 'R1 must not reintroduce Stage216M fixed 1108px page');
console.log('PASS stage216m-r1-client-detail-lead-grid-lock-contract');
