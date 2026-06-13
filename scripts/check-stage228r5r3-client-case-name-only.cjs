const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error('STAGE228R5R3_CLIENT_CASE_NAME_ONLY_GUARD_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(`${label} missing: ${token}`);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(`${label} forbidden: ${token}`);
}

const clients = read('src/pages/Clients.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE228R5R3_CLIENT_CASE_NAME_ONLY_MODAL',
  'Utwórz sprawę od razu',
  'Nazwa sprawy',
  'W tym miejscu wpisujesz tylko nazwę sprawy.',
  'okno „Prowizja sprawy”',
  "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')",
  'contractValue: 0',
  'expectedRevenue: 0',
  'caseValue: 0',
  'remainingAmount: 0',
  "commissionMode: 'not_set'",
  'commissionAmount: 0',
].forEach((token) => requireText(clients, token, 'Clients'));

[
  'Dodaj sprawę od razu',
  '<Label>Wartość sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
  '<Label>Waluta</Label>',
  'Zapisz klienta i sprawę',
  'value={newClient.caseValue}',
  'caseValue: newClient.caseValue',
  'caseCommission',
  'commissionAmount: caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
].forEach((token) => forbidText(clients, token, 'Clients old modal flow'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'URLSearchParams(window.location.search)',
  "params.get('finance') === '1'",
  "['client-create', 'client-detail']",
  'setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments))',
  'setIsFinanceEditOpen(true)',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail'));

if (pkg.scripts['check:stage228r5r3-client-case-name-only'] !== 'node scripts/check-stage228r5r3-client-case-name-only.cjs') {
  fail('package.json missing R5R3 script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r5r3-client-case-name-only.cjs')) {
  fail('package.json prebuild missing R5R3 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R5R3_CLIENT_CASE_NAME_ONLY',
  contract: 'client modal has only case title; finance is edited in CaseDetail commission modal'
}, null, 2));
