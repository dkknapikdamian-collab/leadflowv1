const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const leadCss = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

function requireSource(source, fragment, message = fragment) {
  assert.ok(source.includes(fragment), `Missing source fragment: ${message}`);
}

function getConstSource(name, nextAnchor) {
  const start = leadDetail.indexOf(`const ${name} =`);
  assert.notEqual(start, -1, `${name} must exist`);
  const end = nextAnchor ? leadDetail.indexOf(nextAnchor, start + 1) : -1;
  assert.notEqual(end, -1, `Missing end anchor for ${name}`);
  return leadDetail.slice(start, end);
}

test('Stage115E LeadDetail finance actions open dialog and save payment record', () => {
  requireSource(leadDetail, 'STAGE115E_LEAD_FINANCE_ACTIONS_DIALOG_CONTRACT');
  requireSource(leadDetail, 'fetchPaymentsFromSupabase');
  requireSource(leadDetail, 'createPaymentInSupabase');
  requireSource(leadDetail, 'const [leadPayments, setLeadPayments] = useState<any[]>([])');
  requireSource(leadDetail, "const [leadPaymentDialogType, setLeadPaymentDialogType] = useState<'deposit' | 'partial' | null>(null)");
  requireSource(leadDetail, "fetchPaymentsFromSupabase({ leadId })");
  requireSource(leadDetail, 'setLeadPayments(Array.isArray(paymentRows) ? paymentRows : [])');

  const financePanel = getConstSource('leadFinancePanel', '  const leadSourceNoteText = useMemo');
  assert.match(financePanel, /leadPayments/);
  assert.match(financePanel, /isPaidPaymentStatus/);
  assert.match(financePanel, /deriveBillingStatus/);
  assert.doesNotMatch(financePanel, /billingStatus:\s*'source_only'/);

  const openDialog = getConstSource('openLeadPaymentDialog', 'useEffect(() => {');
  assert.match(openDialog, /setLeadPaymentDialogType\(type\)/);
  assert.match(openDialog, /setLeadPaymentAmount\(''\)/);
  assert.match(openDialog, /setLeadPaymentNote\(''\)/);

  const saveDialog = getConstSource('handleSaveLeadPayment', 'useEffect(() => {');
  assert.match(saveDialog, /createPaymentInSupabase\(/);
  assert.match(saveDialog, /status:\s*'paid'/);
  assert.match(saveDialog, /type:\s*paymentType/);
  assert.match(saveDialog, /addActivity\('payment_recorded'/);
  assert.match(saveDialog, /await loadLead\(\)/);

  requireSource(leadDetail, 'data-stage115e-lead-finance-actions="true"');
  requireSource(leadDetail, 'data-stage115e-open-deposit-payment="true"');
  requireSource(leadDetail, 'data-stage115e-open-partial-payment="true"');
  requireSource(leadDetail, 'data-stage115e-lead-payment-dialog="true"');
  requireSource(leadDetail, 'Dialog open={Boolean(leadPaymentDialogType)}');
  requireSource(leadDetail, "leadPaymentDialogType === 'deposit' ? 'Dodaj zaliczkę' : 'Płatność częściowa'");
  requireSource(leadDetail, 'Zapisz płatność');
  requireSource(leadDetail, 'Źródłowe dane leada');
  assert.doesNotMatch(leadDetail, /Status płatności:\s*\{[^}]*source_only/);

  requireSource(leadCss, 'STAGE115E_LEAD_FINANCE_ACTIONS_DIALOG_CONTRACT');
  requireSource(leadCss, '.lead-detail-finance-dialog-summary');

  assert.equal(
    packageJson.scripts['check:stage115e-lead-finance-actions-open-dialog'],
    'node --test tests/stage115-lead-finance-actions-open-dialog.test.cjs',
  );
});
