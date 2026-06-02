const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r7-entity-data-card-source-truth.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');
const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(adapters.includes("@import '../stage216m-r7-entity-data-card-source-truth.css';"), 'R7 CSS import missing');
assert(css.includes('--cf-entity-data-card-width: 300px'), 'R7 must define shared card width');
assert(css.includes('--cf-entity-data-card-row-height: 52px'), 'R7 must define shared row height');
assert(css.includes('.lead-detail-vnext-page .lead-detail-data-panel-card'), 'R7 must target LeadDetail data card');
assert(css.includes('[data-stage216m-r6-client-data-card="true"]'), 'R7 must target ClientDetail data card');
assert(css.includes('grid-template-rows: repeat(7, var(--cf-entity-data-card-row-height))'), 'R7 must lock both data lists to seven rows');
assert(css.includes('background: var(--cf-entity-data-action-blue) !important'), 'R7 must make edit buttons blue');
assert(css.includes('stage216m-r7-entity-data-card-source-truth'), 'R7 guard marker missing');

console.log('PASS stage216m-r7-entity-data-card-source-truth-contract');
