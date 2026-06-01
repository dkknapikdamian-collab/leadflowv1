const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientPath = path.join(root, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(root, 'src/styles/stage216m-r6-client-data-card-1to1.css');
const adaptersPath = path.join(root, 'src/styles/page-adapters/page-adapters.css');

const client = fs.readFileSync(clientPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const adapters = fs.readFileSync(adaptersPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(adapters.includes("@import '../stage216m-r6-client-data-card-1to1.css';"), 'Stage216M-R6 CSS import missing');
assert(client.includes('STAGE216M_R6_CLIENT_DATA_CARD_1TO1'), 'Stage216M-R6 TSX marker missing');
assert(client.includes('data-stage216m-r6-client-data-card="true"'), 'Client data card marker missing');
assert(client.includes('data-stage216m-r6-client-data-edit-action="true"'), 'Client data edit action must live in data card head');
assert(client.includes('data-stage216m-r6-client-data-panel-list="true"'), 'Client data panel list missing');
assert(client.includes('<small>Status relacji</small>'), 'Client data row Status relacji missing');
assert(client.includes('<small>Źródło</small>'), 'Client data row Zrodlo missing');
assert(client.includes('<small>Wartość</small>'), 'Client data row Wartosc missing');
assert(client.includes("copyValue('Telefon'"), 'Client phone copy action missing');
assert(client.includes("copyValue('E-mail'"), 'Client email copy action missing');
assert(!client.includes('<EntityContactInfoList\n                  phone={client.phone}'), 'Old EntityContactInfoList render must not remain in data card');
assert(css.includes('[data-stage216m-r6-client-data-card="true"]'), 'R6 CSS must target data card');
assert(css.includes('border-radius: 28px'), 'R6 CSS must keep LeadDetail card radius');
assert(css.includes('client-detail-data-panel-row-copy button'), 'R6 CSS must style copy buttons like lead data card');
assert(css.includes('stage216m-r6-client-data-card-1to1'), 'R6 guard marker missing');

console.log('PASS stage216m-r6-client-data-card-1to1-contract');
