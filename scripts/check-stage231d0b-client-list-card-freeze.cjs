const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const checkedFiles = [
  'src/pages/Clients.tsx',
  'src/styles/closeflow-record-list-source-truth.css',
  '_project/UI_DICTIONARY_STAGE231D0A.md',
  'scripts/check-stage231d0b-client-list-card-freeze.cjs',
];

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/closeflow-record-list-source-truth.css');
const dict = read('_project/UI_DICTIONARY_STAGE231D0A.md');

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

check(!clients.includes('Aktywna sprawa'), 'ClientListCard must not render badge/copy: Aktywna sprawa');
check(!clients.includes('Leady:'), 'ClientListCard must not render leads count label: Leady:');
check(clients.includes('Sprawy:'), 'ClientListCard must render Sprawy: count');
check(clients.includes('Aktywna prowizja') || clients.includes('Prowizja aktywna'), 'ClientListCard must render active commission label');
check(clients.includes('Zarobione łącznie'), 'ClientListCard must render lifetime earned label');
check(clients.includes('data-client-list-phone') || clients.includes('client-list-card-phone'), 'ClientListCard phone must have a dedicated slot/marker');
check(clients.includes('data-client-list-email') || clients.includes('client-list-card-email'), 'ClientListCard email must have a dedicated slot/marker');
check(clients.includes('client-list-card-row-primary'), 'ClientListCard must have primary row class');
check(clients.includes('client-list-card-row-secondary'), 'ClientListCard must have secondary row class');
check(clients.includes("../styles/closeflow-record-list-source-truth.css"), 'Clients page must keep closeflow-record-list-source-truth.css source of truth import');
check(clients.includes('getClientCasesFinanceSummary'), 'Clients page must use client finance source summary, not ad-hoc value labels');
check(clients.includes("mode: 'all_active_cases'") && clients.includes("mode: 'all_cases'"), 'ClientListCard finance must distinguish active cases and all cases');
check(clients.includes('commissionPaidAmount'), 'Zarobione łącznie must be based on paid commission amount');
check(css.includes('STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE'), 'record-list CSS must include Stage231D0B source-of-truth block');
check(css.includes('cf-client-row-two-line'), 'record-list CSS must style two-line client row');
check(dict.includes('Nazwa systemowa:') && dict.includes('ClientListCard'), 'UI Dictionary must include ClientListCard system name');
check(dict.includes('client-relationship-row-2line'), 'UI Dictionary must include ClientListCard variant');
check(dict.includes('Aktywna prowizja = suma prowizji z aktywnych spraw.'), 'UI Dictionary must define active commission source');
check(dict.includes('Zarobione łącznie = suma wpłaconej prowizji ze wszystkich spraw klienta.'), 'UI Dictionary must define lifetime earned source');
check(dict.includes('Nie pokazywać „Leady”'), 'UI Dictionary must ban Leady from client card');
check(dict.includes('Nie używać badge „Aktywna sprawa”'), 'UI Dictionary must ban Aktywna sprawa badge from client card');

const mojibake = new RegExp('[\\u0102\\u0139\\u00C4\\u00C5\\u00C2\\uFFFD]|\\u010f\\u017c\\uFFFD');
for (const rel of checkedFiles) {
  const content = read(rel);
  check(!mojibake.test(content), `Mojibake detected in checked file: ${rel}`);
}

if (failures.length) {
  console.error('STAGE231D0B client list card freeze guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0B client list card freeze guard: PASS');
