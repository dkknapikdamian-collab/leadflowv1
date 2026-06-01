const fs = require('fs');
const path = require('path');

const root = process.cwd();
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(root, 'src/styles/stage216m-r6-r1-client-data-card-polish.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const lead = fs.readFileSync(leadPath, 'utf8');
const client = fs.readFileSync(clientPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(!lead.includes('Status, źródło, kontakt, wartość i ostatnia aktywność w jednym miejscu.'), 'Lead data card intro copy must be removed');
assert(!client.includes('Status, źródło, kontakt, wartość i ostatni kontakt w jednym miejscu.'), 'Client data card intro copy must be removed');
assert(client.includes('data-stage216m-r6-client-data-card-marker="true"'), 'R6 TSX marker must be present on ClientDetail main');
assert(client.includes('data-stage216m-r6-r1-client-data-card-polish-marker="true"'), 'R6-R1 TSX marker must be present on ClientDetail main');
assert(adapters.includes("@import '../stage216m-r6-r1-client-data-card-polish.css';"), 'R6-R1 CSS import missing');
assert(css.includes('[data-stage216m-r6-client-data-edit-action="true"]'), 'R6-R1 CSS must target client edit action');
assert(css.includes('height: 32px !important'), 'Client edit action height must be locked');
assert(css.includes('display: none !important'), 'Intro copy must be hidden as CSS fallback');

console.log('PASS stage216m-r6-r1-client-data-card-polish-contract');
