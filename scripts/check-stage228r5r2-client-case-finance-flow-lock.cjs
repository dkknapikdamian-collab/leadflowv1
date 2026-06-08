const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error('STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(`${label} missing token: ${token}`);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(`${label} forbidden old token: ${token}`);
}

const clients = read('src/pages/Clients.tsx');
const clientCreateDialog = read('src/components/ClientCreateDialog.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const apiCases = read('api/cases.ts');
const pkg = JSON.parse(read('package.json'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK',
  "import { Link, useNavigate } from 'react-router-dom';",
  'const navigate = useNavigate();',
  'let createdCaseId =',
  'const createdCase = await createCaseInSupabase({',
  'createdCaseId = String((createdCase as any)?.id',
  "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')",
  'Utw\u00f3rz spraw\u0119 od razu',
  'Nazwa sprawy',
  'contractValue: 0',
  'expectedRevenue: 0',
  'caseValue: 0',
  'remainingAmount: 0',
  "commissionMode: 'not_set'",
  'commissionAmount: 0',
].forEach((token) => requireText(clients, token, 'Clients.tsx'));

[
  'STAGE228R5R6_ACTIVE_CLIENT_CREATE_DIALOG_FINANCE_REDIRECT',
  "import { useNavigate } from 'react-router-dom';",
  'const navigate = useNavigate();',
  'readCreatedCaseId',
  'let createdCaseId =',
  'const createdCase = await createCaseInSupabase({',
  'createdCaseId = readCreatedCaseId(createdCase)',
  "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-create')",
  'Utw\u00f3rz spraw\u0119 od razu',
  'Po zapisie otworzymy spraw\u0119 i okno',
  'Nazwa sprawy',
  'contractValue: 0',
  'expectedRevenue: 0',
  'caseValue: 0',
  'remainingAmount: 0',
  "commissionMode: 'not_set'",
  'commissionAmount: 0',
  "commissionStatus: 'not_set'",
].forEach((token) => requireText(clientCreateDialog, token, 'ClientCreateDialog.tsx'));

[
  'Dodaj spraw\u0119 od razu',
  '<Label>Warto\u015b\u0107 sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
  '<Label>Waluta</Label>',
  'Zapisz klienta i spraw\u0119',
  'caseValue: newClient.caseValue',
  'value={newClient.caseValue}',
  'onChange={(event) => setNewClient((prev) => ({ ...prev, caseValue: event.target.value }))}',
  'caseCommission',
  'commissionAmount: caseCommission',
  'contractValue: caseValue',
  'expectedRevenue: caseValue',
  'remainingAmount: caseValue',
].forEach((token) => forbidText(clients, token, 'Clients.tsx'));

[
  'Dodaj spraw\u0119 od razu',
  '<Label>Warto\u015b\u0107 sprawy</Label>',
  '<Label>Prowizja do zarobienia</Label>',
  '<Label>Waluta</Label>',
  'Zapisz klienta i spraw\u0119',
  'caseValue: string',
  'caseValue: form.caseValue',
  'caseValue: form.caseValue.trim()',
  'prepared.caseValue',
  'value={form.caseValue}',
  'onChange={(event) => updateForm({ caseValue: event.target.value })}',
  'contractValue: Number.isFinite',
].forEach((token) => forbidText(clientCreateDialog, token, 'ClientCreateDialog.tsx'));

[
  'STAGE228R5_CLIENT_CREATE_OPENS_CASE_FINANCE_MODAL',
  'didAutoOpenCaseFinanceFromClientCreateStage228R5',
  'URLSearchParams(window.location.search)',
  "params.get('finance') === '1'",
  "params.get('source') === 'client-create'",
  'setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments))',
  'setIsFinanceEditOpen(true)',
  'window.history.replaceState',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail.tsx'));

[
  'const insertedId = String((inserted as Record<string, unknown>).id ||',
  'await setClientPrimaryCaseForApi(finalWorkspaceId, normalizedClientId, insertedId, nowIso)',
  'res.status(200).json(normalizeCase(inserted as Record<string, unknown>))',
].forEach((token) => requireText(apiCases, token, 'api/cases.ts'));

if (pkg.scripts['check:stage228r5r2-client-case-finance-flow-lock'] !== 'node scripts/check-stage228r5r2-client-case-finance-flow-lock.cjs') {
  fail('package.json missing check:stage228r5r2-client-case-finance-flow-lock script');
}

if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage228r5r2-client-case-finance-flow-lock.cjs')) {
  fail('package.json prebuild missing R5R2 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R5R2_CLIENT_CASE_FINANCE_FLOW_LOCK',
  contract: 'active client modal only asks for case name; save redirects to case finance modal',
  activeDialog: 'ClientCreateDialog'
}, null, 2));
