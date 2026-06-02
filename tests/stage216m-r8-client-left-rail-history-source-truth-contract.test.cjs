const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assert(condition, message) { if (!condition) { console.error(`FAIL ${message}`); process.exit(1); } }

const css = read('src/styles/stage216m-r8-client-left-rail-history-source-truth.css');
const adapters = read('src/styles/page-adapters/page-adapters.css');
const client = read('src/pages/ClientDetail.tsx');

assert(adapters.includes("@import '../stage216m-r8-client-left-rail-history-source-truth.css';"), 'R8 CSS import missing');
assert(css.includes('--cf-entity-left-rail-client-nudge-y: -18px'), 'Client left rail nudge missing');
assert(css.includes('.lead-detail-vnext-page .lead-detail-left-activity-history-card'), 'Lead history card selector missing');
assert(css.includes('[data-stage216m-r8-client-activity-history-source="true"]'), 'Client history source selector missing');
assert(css.includes('--cf-entity-history-purple'), 'Purple history variable missing');
assert(client.includes('data-stage216m-r8-left-rail-history-source-truth-marker="true"'), 'Client page R8 marker missing');
assert(client.includes('data-stage216m-r8-client-activity-history-source="true"'), 'Client history card marker missing');
assert(client.includes('<Clock className="h-4 w-4" />'), 'Clock icon missing on client history');
assert(client.includes('<h2>Historia aktywności</h2>'), 'Client history title missing');
assert(!client.includes('<h2>Ostatnie ruchy</h2>'), 'Old Ostatnie ruchy title still present');
assert(client.includes('Ostatnie 5 zdarzeń powiązanych z tym klientem.'), 'Client history intro missing');
console.log('PASS stage216m-r8-client-left-rail-history-source-truth-contract');
