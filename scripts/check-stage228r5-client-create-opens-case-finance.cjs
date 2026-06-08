const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error('STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_GUARD_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token still present: ' + token);
}

const clients = read('src/pages/Clients.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'const navigate = useNavigate();',
  'let createdCaseId =',
  "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')",
  'contractValue: 0',
  'expectedRevenue: 0',
  'caseValue: 0',
  'remainingAmount: 0',
  "commissionMode: 'not_set'",
  'commissionAmount: 0',
].forEach((token) => requireText(clients, token, 'Clients'));

[
  'caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
  'commissionAmount: caseCommission',
  '<Label>Wartość sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
].forEach((token) => forbidText(clients, token, 'Clients old client-form finance intake'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'didAutoOpenCaseFinanceFromClientCreateStage228R5',
  'URLSearchParams(window.location.search)',
  "params.get('finance') === '1'",
  "params.get('source') === 'client-create'",
  'setIsFinanceEditOpen(true)',
  'buildFin11FinanceEditState(caseData, casePayments)',
  'window.history.replaceState',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail'));

if (pkg.scripts['check:stage228r5-client-create-opens-case-finance'] !== 'node scripts/check-stage228r5-client-create-opens-case-finance.cjs') {
  fail('package.json missing check:stage228r5-client-create-opens-case-finance');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r5-client-create-opens-case-finance.cjs')) {
  fail('prebuild missing Stage228R5 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE',
  guard: 'check:stage228r5-client-create-opens-case-finance'
}, null, 2));
