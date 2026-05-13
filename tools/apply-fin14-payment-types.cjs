const fs = require('fs');
const path = require('path');
const root = process.cwd();
const packRoot = path.resolve(__dirname, '..');
function file(p) { return path.join(root, p); }
function pack(p) { return path.join(packRoot, p); }
function read(p) { return fs.readFileSync(file(p), 'utf8'); }
function write(p, value) { fs.mkdirSync(path.dirname(file(p)), { recursive: true }); fs.writeFileSync(file(p), value); }
function copy(p) { fs.mkdirSync(path.dirname(file(p)), { recursive: true }); fs.copyFileSync(pack(p), file(p)); console.log('copied ' + p); }
function fail(msg) { throw new Error(msg); }
function replaceOrFail(source, search, replacement, label) {
  if (!source.includes(search)) fail('Nie znaleziono bloku: ' + label);
  return source.replace(search, replacement);
}
function replaceRegexOrFail(source, regex, replacement, label) {
  if (!regex.test(source)) fail('Nie znaleziono regex bloku: ' + label);
  return source.replace(regex, replacement);
}
function ensurePackageScripts() {
  const pkgPath = file('package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:fin14'] = 'node scripts/check-fin14-payment-types.cjs';
  pkg.scripts['test:fin14'] = 'node --test tests/fin14-payment-types.test.cjs';
  pkg.scripts['verify:fin14'] = 'npm.cmd run check:fin14 && npm.cmd run test:fin14';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[FIN-14] package.json: dodano check/test/verify fin14');
}
function patchCaseSettlementPanel() {
  let source = read('src/components/finance/CaseSettlementPanel.tsx');
  if (!source.includes("./CaseFinancePaymentDialog")) {
    source = source.replace("import { CaseFinanceActionButtons } from './CaseFinanceActionButtons';", "import { CaseFinanceActionButtons } from './CaseFinanceActionButtons';\nimport { CaseFinancePaymentDialog } from './CaseFinancePaymentDialog';");
  }
  if (!source.includes('FIN14_CASE_SETTLEMENT_PAYMENT_TYPES')) {
    source = source.replace(
      "export const FIN13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR = 'FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR' as const;",
      "export const FIN13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR = 'FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR' as const;\nexport const FIN14_CASE_SETTLEMENT_PAYMENT_TYPES = 'FIN-14_CASE_SETTLEMENT_PAYMENT_TYPES_DEPOSIT_PARTIAL_COMMISSION' as const;",
    );
  }
  source = replaceRegexOrFail(
    source,
    /const \[paymentOpen, setPaymentOpen\] = useState\(false\);\s*const \[commissionPaymentOpen, setCommissionPaymentOpen\] = useState\(false\);\s*const \[commissionOpen, setCommissionOpen\] = useState\(false\);/,
    "const [paymentDialogType, setPaymentDialogType] = useState<PaymentType | null>(null);\n  const [commissionOpen, setCommissionOpen] = useState(false);",
    'CaseSettlementPanel payment states',
  );
  source = replaceRegexOrFail(
    source,
    /<CaseFinanceActionButtons\s+className="cf-finance-settlement-actions"[\s\S]*?disabled=\{isSaving\}\s*\/>/,
    `<CaseFinanceActionButtons
              className="cf-finance-settlement-actions"
              onEdit={() => setCommissionOpen(true)}
              onAddDepositPayment={() => setPaymentDialogType('deposit')}
              onAddPayment={() => setPaymentDialogType('partial')}
              onAddCommissionPayment={() => setPaymentDialogType('commission')}
              showDepositPayment
              showCommissionPayment
              disabled={isSaving}
            />`,
    'CaseSettlementPanel action buttons',
  );
  const paymentDialogsReplacement = `<CaseFinancePaymentDialog
        open={Boolean(paymentDialogType)}
        onOpenChange={(open) => { if (!open) setPaymentDialogType(null); }}
        caseRecord={record}
        defaultCurrency={currency}
        defaultType={paymentDialogType || 'partial'}
        onSubmit={onAddPayment}
        isSaving={isSaving}
      />`;
  const selfClosingPaymentDialogs = /<PaymentDialog\s+open=\{paymentOpen\}[\s\S]*?duplicateWarningCopy=\{duplicateWarningCopy\}\s*\/>\s*<PaymentDialog\s+open=\{commissionPaymentOpen\}[\s\S]*?duplicateWarningCopy=\{duplicateWarningCopy\}\s*\/>/;
  const pairedPaymentDialogs = /<PaymentDialog\s+open=\{paymentOpen\}[\s\S]*?<\/PaymentDialog>\s*<PaymentDialog\s+open=\{commissionPaymentOpen\}[\s\S]*?<\/PaymentDialog>/;
  if (selfClosingPaymentDialogs.test(source)) source = source.replace(selfClosingPaymentDialogs, paymentDialogsReplacement);
  else if (pairedPaymentDialogs.test(source)) source = source.replace(pairedPaymentDialogs, paymentDialogsReplacement);
  else fail('Nie znaleziono bloków PaymentDialog w CaseSettlementPanel');
  if (source.includes('commissionPaymentOpen')) fail('CaseSettlementPanel nadal zawiera commissionPaymentOpen');
  write('src/components/finance/CaseSettlementPanel.tsx', source);
  console.log('[FIN-14] CaseSettlementPanel: jeden modal płatności + deposit/partial/commission');
}
function patchFinanceMiniSummary() {
  let source = read('src/components/finance/FinanceMiniSummary.tsx');
  if (!source.includes("./CaseFinancePaymentDialog")) {
    source = source.replace(
      "import { CaseFinanceEditorDialog, formatCaseFinanceMoney, parseCaseFinanceNumber, type CaseFinancePatch } from './CaseFinanceEditorDialog';",
      "import { CaseFinanceEditorDialog, formatCaseFinanceMoney, parseCaseFinanceNumber, type CaseFinancePatch } from './CaseFinanceEditorDialog';\nimport { CaseFinancePaymentDialog, type CaseFinancePaymentInput } from './CaseFinancePaymentDialog';",
    );
  }
  source = replaceRegexOrFail(
    source,
    /function sumRows\(rows: ClientFinanceCaseRow\[\]\) \{[\s\S]*?\n\}/,
    `function sumRows(rows: ClientFinanceCaseRow[]) {
  const total = {
    totalValue: 0,
    paidValue: 0,
    remainingValue: 0,
    commissionAmount: 0,
    commissionPaidAmount: 0,
  };
  for (const row of rows) {
    total.totalValue += row.summary.contractValue;
    total.paidValue += row.summary.clientPaidAmount;
    total.remainingValue += row.summary.remainingAmount;
    total.commissionAmount += row.summary.commissionAmount;
    total.commissionPaidAmount += row.summary.commissionPaidAmount;
  }
  return total;
}`,
    'FinanceMiniSummary sumRows reduce',
  );
  if (!source.includes("const [paymentType, setPaymentType]")) {
    source = source.replace(
      "const [paymentRow, setPaymentRow] = useState<ClientFinanceCaseRow | null>(null);",
      "const [paymentRow, setPaymentRow] = useState<ClientFinanceCaseRow | null>(null);\n  const [paymentType, setPaymentType] = useState<'deposit' | 'partial' | 'commission'>('partial');",
    );
  }
  source = replaceRegexOrFail(
    source,
    /<CaseFinanceActionButtons\s+compact[\s\S]*?disabled=\{!row\.caseId\}\s*\/>/,
    `<CaseFinanceActionButtons
              compact
              onEdit={() => setEditingRow(row)}
              onAddDepositPayment={() => { setPaymentType('deposit'); setPaymentRow(row); }}
              onAddPayment={() => { setPaymentType('partial'); setPaymentRow(row); }}
              onAddCommissionPayment={() => { setPaymentType('commission'); setPaymentRow(row); }}
              onOpenCase={() => navigate(\`/cases/\${row.caseId}\`)}
              showDepositPayment
              showCommissionPayment
              showOpenCase
              disabled={!row.caseId}
            />`,
    'FinanceMiniSummary row action buttons',
  );
  const oldDialogRegex = /<ClientPaymentDialog\s+open=\{Boolean\(paymentRow\)\}[\s\S]*?onSaved=\{reloadClientFinanceData\}\s*\/>/;
  source = replaceRegexOrFail(
    source,
    oldDialogRegex,
    `<CaseFinancePaymentDialog
        open={Boolean(paymentRow)}
        onOpenChange={(open) => { if (!open) setPaymentRow(null); }}
        caseRecord={paymentRow?.caseRecord || null}
        defaultType={paymentType}
        defaultCurrency={paymentRow?.summary.currency || 'PLN'}
        onSubmit={async (payment: CaseFinancePaymentInput) => {
          if (!payment.caseId) {
            toast.error('Nie można dodać płatności bez wskazania sprawy');
            return;
          }
          await createPaymentInSupabase({
            caseId: payment.caseId,
            clientId: payment.clientId,
            leadId: payment.leadId,
            type: payment.type,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            paidAt: payment.paidAt,
            dueAt: payment.dueAt,
            note: payment.note,
          });
          toast.success(payment.type === 'commission' ? 'Dodano płatność prowizji' : payment.type === 'deposit' ? 'Dodano zaliczkę' : 'Dodano wpłatę do sprawy');
          await reloadClientFinanceData();
          setPaymentRow(null);
        }}
      />`,
    'FinanceMiniSummary ClientPaymentDialog invocation',
  );
  if (/\.reduce\s*\(/.test(source)) fail('FinanceMiniSummary nadal zawiera .reduce(');
  write('src/components/finance/FinanceMiniSummary.tsx', source);
  console.log('[FIN-14] FinanceMiniSummary: typ płatności + brak lokalnego reduce');
}

function patchEditorDialogFin13ParserGuard() {
  const p = 'src/components/finance/CaseFinanceEditorDialog.tsx';
  let source = read(p);
  const guard = "// FIN-13 parser guard literal: replace(/\\./g, '').replace(',', '\\.')";
  if (!source.includes("replace(/\\./g, '').replace(',', '\\.')")) {
    source = source.replace(
      "export const CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG = 'CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG_V1' as const;",
      "export const CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG = 'CLOSEFLOW_FIN12_SHARED_CASE_FINANCE_EDITOR_DIALOG_V1' as const;\n" + guard,
    );
    write(p, source);
    console.log('[FIN-14] CaseFinanceEditorDialog: guard parsera FIN-13 zachowany');
  }
}

function patchServiceWorker() {
  const swPath = 'public/service-worker.js';
  let source = read(swPath);
  if (!source.includes("url.pathname.startsWith('/api/')")) {
    source = source.replace(
      "const path = url.pathname.toLowerCase();\n  const full = (url.pathname + url.search).toLowerCase();",
      "const path = url.pathname.toLowerCase();\n  const full = (url.pathname + url.search).toLowerCase();\n\n  if (url.pathname.startsWith('/api/')) return true;\n  if (url.pathname.startsWith('/supabase/')) return true;",
    );
  }
  write(swPath, source);
  console.log('[FIN-14] service-worker: jawne /api/ i /supabase/ dla PWA guard');
}
function patchStyles() {
  const p = 'src/styles/finance/closeflow-finance.css';
  let source = read(p);
  if (!source.includes('FIN-14_PAYMENT_TYPE_ACTIONS_STYLES')) {
    source += `\n\n/* FIN-14_PAYMENT_TYPE_ACTIONS_STYLES */\n.cf-case-finance-action-buttons {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.cf-case-finance-action-buttons--compact {\n  gap: 6px;\n}\n.cf-finance-payment-dialog .cf-finance-editor-dialog__subtitle {\n  margin: 0;\n  color: rgba(71, 85, 105, 0.92);\n  font-size: 13px;\n}\n`;
  }
  write(p, source);
  console.log('[FIN-14] styles: action/payment dialog styles');
}
function main() {
  copy('src/components/finance/CaseFinanceActionButtons.tsx');
  copy('src/components/finance/PaymentList.tsx');
  copy('src/components/finance/CaseFinancePaymentDialog.tsx');
  copy('scripts/check-fin14-payment-types.cjs');
  copy('tests/fin14-payment-types.test.cjs');
  copy('docs/release/CLOSEFLOW_FIN14_PAYMENT_TYPES_2026-05-13.md');
  copy('tools/apply-fin14-payment-types.cjs');
  ensurePackageScripts();
  patchCaseSettlementPanel();
  patchFinanceMiniSummary();
  patchEditorDialogFin13ParserGuard();
  patchServiceWorker();
  patchStyles();
  console.log('[FIN-14] patch zakończony');
}
main();
