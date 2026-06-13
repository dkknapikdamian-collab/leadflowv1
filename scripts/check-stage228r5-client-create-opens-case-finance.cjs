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
const clientCreateDialog = read('src/components/ClientCreateDialog.tsx');
const createClientCase = read('src/lib/cases/create-client-case.ts');
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
  'STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT',
  'const navigate = useNavigate();',
  'let createdCaseId =',
  'const createdCaseResult = await createStarterCaseForClient({',
  "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')",
  'Utw\u00f3rz spraw\u0119 od razu',
  'Nazwa sprawy',
].forEach((token) => requireText(clientCreateDialog, token, 'ClientCreateDialog'));

[
  'createCaseInSupabase',
  'readCreatedCaseId',
  'contractValue: 0',
  'expectedRevenue: 0',
  'caseValue: 0',
  'remainingAmount: 0',
  "commissionMode: 'not_set'",
  'commissionAmount: 0',
  "commissionStatus: 'not_set'",
].forEach((token) => requireText(createClientCase, token, 'create-client-case'));

[
  'caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
  'commissionAmount: caseCommission',
  '<Label>Warto\u015b\u0107 sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
  '<Label>Waluta</Label>',
].forEach((token) => forbidText(clients, token, 'Clients old client-form finance intake'));

[
  'Dodaj spraw\u0119 od razu',
  '<Label>Warto\u015b\u0107 sprawy</Label>',
  'Zapisz klienta i spraw\u0119',
  'caseValue: string',
  'caseValue: form.caseValue',
  'caseValue: form.caseValue.trim()',
  'prepared.caseValue',
  'value={form.caseValue}',
  'onChange={(event) => updateForm({ caseValue: event.target.value })}',
  'contractValue: Number.isFinite',
].forEach((token) => forbidText(clientCreateDialog, token, 'ClientCreateDialog old active modal flow'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'didAutoOpenCaseFinanceFromClientCreateStage228R5',
  'URLSearchParams(window.location.search)',
  "params.get('finance') === '1'",
  "['client-create', 'client-detail']",
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
  guard: 'check:stage228r5-client-create-opens-case-finance',
  activeDialog: 'ClientCreateDialog'
}, null, 2));
