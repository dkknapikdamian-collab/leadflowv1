const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/stage216m-r5-client-right-rail-finance-colors-icons.css');
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

assert(adapters.includes("@import '../stage216m-r5-client-right-rail-finance-colors-icons.css';"), 'Stage216M-R5 CSS import missing');
assert(client.includes('data-stage216m-r4-client-finance-card="true"'), 'Client finance card must exist in right rail');
assert(css.includes('[data-stage216m-r4-client-finance-card="true"]'), 'R5 CSS must target finance card');
assert(css.includes('display: block !important'), 'R5 CSS must force finance card visible');
assert(css.includes('order: 3 !important'), 'R5 CSS must keep finance card in third right-rail position');
assert(css.includes('#2563eb'), 'R5 CSS must normalize icon blue');
assert(css.includes('client-detail-upcoming-actions-cta button'), 'R5 CSS must normalize quick action button colors');
assert(css.includes('stage216m-r5-client-right-rail-finance-visible'), 'R5 guard marker missing');

console.log('PASS stage216m-r5-client-right-rail-finance-colors-icons-contract');
