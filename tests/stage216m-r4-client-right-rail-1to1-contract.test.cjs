const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const adapters = fs.readFileSync('src/styles/page-adapters/page-adapters.css', 'utf8');
const css = fs.readFileSync('src/styles/stage216m-r4-client-right-rail-1to1.css', 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL ${message}`);
    process.exit(1);
  }
}

assert(client.includes('data-stage216m-r4-client-right-rail="true"'), 'ClientDetail right rail marker missing');
assert(client.includes('clientRightRailActionsStage216M4'), 'Client right rail actions source missing');
assert(client.includes('<h2>Najbliższe działania</h2>'), 'Client right rail upcoming actions card missing');
assert(client.includes('<h2>Główna sprawa</h2>'), 'Client main case right card missing');
assert(client.includes('<h2>Finanse klienta</h2>'), 'Client finance right card missing');
assert(!client.includes('<h2>Szybkie akcje</h2>'), 'Old Szybkie akcje card should not remain as right-rail card');
assert(client.includes("recordType: 'client'"), 'Client context actions must stay scoped to client');
assert(client.includes("caseId: mainCase?.id ? String(mainCase.id) : null"), 'Client right rail actions should connect to main case when present');
assert(adapters.includes("@import '../stage216m-r4-client-right-rail-1to1.css';"), 'Stage216M-R4 CSS import missing');
assert(css.includes('[data-stage216m-r4-client-right-rail="true"]'), 'Stage216M-R4 CSS marker missing');

console.log('PASS stage216m-r4-client-right-rail-1to1-contract');
