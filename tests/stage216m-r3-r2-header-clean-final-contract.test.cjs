const fs = require('fs');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { console.error(`FAIL ${message}`); process.exit(1); }
function pass(message) { console.log(`PASS ${message}`); }

const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const adapters = read('src/styles/page-adapters/page-adapters.css');

function between(content, start, end, label) {
  const s = content.indexOf(start);
  if (s < 0) fail(`${label}: start marker missing`);
  const e = content.indexOf(end, s);
  if (e < 0) fail(`${label}: end marker missing`);
  return content.slice(s, e);
}

const leadHeader = between(lead, '<header className="lead-detail-header">', '</header>', 'Lead header');
const leadActions = between(lead, 'data-stage216m-r3-r2-lead-header-actions="true"', '</div>', 'Lead header actions');
if (!leadHeader.includes('Zapytaj AI')) fail('Lead header must contain Zapytaj AI');
if (leadActions.includes('Edytuj')) fail('Lead header actions must not contain Edytuj');
if (!leadActions.includes('Rozpocznij obsługę')) fail('Lead header must keep Rozpocznij obsługę');
if (!leadActions.includes('Otwórz sprawę')) fail('Lead header must keep Otwórz sprawę path');

const clientHeader = between(client, '<header className="client-detail-header">', '</header>', 'Client header');
const clientActions = between(client, 'data-stage216m-r3-r2-client-header-actions="true"', '</div>', 'Client header actions');
if (clientHeader.includes('client-detail-header-meta')) fail('Client header meta must be removed');
if (clientActions.includes('Edytuj')) fail('Client header actions must not contain edit action');
if (clientActions.includes('Nowa sprawa dla klienta')) fail('Client header must not contain new case action');
if (!clientActions.includes('Zapytaj AI')) fail('Client header must contain Zapytaj AI');
if (!clientActions.includes('Otwórz główną sprawę')) fail('Client header must keep main case action');
if (!adapters.includes("@import '../stage216m-r3-r2-header-clean-final.css';")) fail('CSS import missing');

pass('stage216m-r3-r2-header-clean-final-contract');
