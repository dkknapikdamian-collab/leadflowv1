const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/LeadDetail.tsx'), 'utf8');

const forbidden = [
  'createPaymentInSupabase',
  'fetchPaymentsFromSupabase',
  'leadPayments',
  'setLeadPayments',
  'isLeadPaymentOpen',
  'setIsLeadPaymentOpen',
  'leadPaymentDraft',
  'setLeadPaymentDraft',
  'leadPaymentSubmitting',
  'setLeadPaymentSubmitting',
  'CLOSEFLOW_LEAD_SETTLEMENT_DYNAMIC_V29_PAYMENTS',
];

const required = [
  'const leadOperationalArchive = Boolean',
  'leadMovedToService || associatedCase || startServiceSuccess',
  'const handleCreateQuickTask',
  'const handleCreateQuickEvent',
  'const openLinkedTaskEditor',
  'Dodawaj dalsze zadania w sprawie',
  'Dodawaj dalsze wydarzenia w sprawie',
  'Ten temat jest już w obsłudze',
  'Otwórz sprawę',
  'navigate(`/case/${startServiceSuccess.caseId}`);',
];

const errors = [];

for (const token of forbidden) {
  if (source.includes(token)) errors.push(`LeadDetail nadal zawiera finansowego ducha: ${token}`);
}

for (const token of required) {
  if (!source.includes(token)) errors.push(`LeadDetail utracił wymagany kontrakt: ${token}`);
}

if (source.includes('navigate(`/cases/${startServiceSuccess.caseId}`);')) {
  errors.push('LeadDetail nie może kierować po starcie obsługi do /cases/:id.');
}

if (errors.length) {
  console.error('FIN-15 check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('FIN-15 check passed: lead nie obsługuje finansów sprawy i kieruje pracę do sprawy.');
