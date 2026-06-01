const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r6-r2-client-data-card-button-size.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');

const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');
const client = fs.readFileSync(clientPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(adapters.includes("@import '../stage216m-r6-r2-client-data-card-button-size.css';"), 'Stage216M-R6-R2 CSS import missing');
assert(client.includes('data-stage216m-r6-client-data-card="true"'), 'Client data card marker missing');
assert(client.includes('data-stage216m-r6-client-data-edit-action="true"'), 'Client data edit action marker missing');
assert(css.includes('background: #2563eb !important'), 'Edit data button must be blue');
assert(css.includes('grid-template-columns: minmax(0, 1fr) auto !important'), 'Data card head must use title/action grid');
assert(css.includes('height: 34px !important'), 'Edit data button height contract missing');
assert(css.includes('min-height: 50px !important'), 'Client data row height must be locked');
assert(css.includes('stage216m-r6-r2-client-data-card-button-size'), 'R6-R2 guard marker missing');

console.log('PASS stage216m-r6-r2-client-data-card-button-size-contract');
