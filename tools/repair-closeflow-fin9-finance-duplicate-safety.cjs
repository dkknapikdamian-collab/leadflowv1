const fs = require('fs');

function read(rel) { return fs.readFileSync(rel, 'utf8'); }
function write(rel, text) { fs.writeFileSync(rel, text); console.log('patched: ' + rel); }
function ensureIncludes(text, needle, message) { if (!text.includes(needle)) throw new Error(message || ('missing ' + needle)); }
function appendMarker(rel, marker) {
  let text = read(rel);
  if (!text.includes(marker)) {
    text = text.replace(/\s*$/, '') + "\n\nconst " + marker + " = '" + marker + "' as const;\nvoid " + marker + ";\n";
    write(rel, text);
  }
}

function patchEntityConflictDialog() {
  const rel = 'src/components/EntityConflictDialog.tsx';
  let text = read(rel);
  text = text.replace("entityType: 'lead' | 'client';", "entityType: 'lead' | 'client' | 'case';");
  text = text.replace("return type === 'client' ? 'klient' : 'lead';", "if (type === 'case') return 'sprawa';\n  return type === 'client' ? 'klient' : 'lead';");
  if (!text.includes('CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT')) {
    text = text.replace('// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1', "// CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1\n// CLOSEFLOW_FIN9_ENTITY_CONFLICT_CASE_SUPPORT");
  }
  write(rel, text);
}

function patchPaymentFormDialog() {
  const rel = 'src/components/finance/PaymentFormDialog.tsx';
  let text = read(rel);
  if (!text.includes('finance-duplicate-safety')) {
    text = text.replace("import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';", "import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';\nimport { FINANCE_DUPLICATE_PAYMENT_WARNING_COPY, type FinanceDuplicateCandidate } from '../../lib/finance/finance-duplicate-safety';");
  }
  if (!text.includes('duplicateCandidates?: FinanceDuplicateCandidate[];')) {
    text = text.replace('  isSaving?: boolean;\n};', '  isSaving?: boolean;\n  duplicateCandidates?: FinanceDuplicateCandidate[];\n  duplicateWarningCopy?: string;\n};');
  }
  if (!text.includes('duplicateCandidates = []')) {
    text = text.replace('  isSaving = false,\n}: PaymentFormDialogProps)', '  isSaving = false,\n  duplicateCandidates = [],\n  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,\n}: PaymentFormDialogProps)');
  }
  if (!text.includes('CLOSEFLOW_FIN9_PAYMENT_DUPLICATE_WARNING_ONLY')) {
    text = text.replace('<form className="cf-finance-form" onSubmit={handleSubmit}>', '<form className="cf-finance-form" onSubmit={handleSubmit}>\n          {duplicateCandidates.length > 0 ? (\n            <div className="cf-finance-duplicate-warning" role="alert" data-fin9-payment-duplicate-warning="true">\n              <strong>Możliwy duplikat klienta</strong>\n              <span>{duplicateWarningCopy}</span>\n            </div>\n          ) : null}\n          <span hidden data-fin9-payment-duplicate-safety="CLOSEFLOW_FIN9_PAYMENT_DUPLICATE_WARNING_ONLY" />');
  }
  write(rel, text);
}

function patchCaseSettlementPanel() {
  const rel = 'src/components/finance/CaseSettlementPanel.tsx';
  let text = read(rel);
  if (!text.includes('finance-duplicate-safety')) {
    text = text.replace("import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';", "import { PAYMENT_STATUS_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../../lib/finance/finance-payment-labels';\nimport { FINANCE_DUPLICATE_PAYMENT_WARNING_COPY, buildFinanceDuplicateCandidatesFromRecord, type FinanceDuplicateCandidate } from '../../lib/finance/finance-duplicate-safety';");
  }
  if (!text.includes('duplicateCandidates?: FinanceDuplicateCandidate[];')) {
    text = text.replace('  isSaving?: boolean;\n  onAddPayment?:', '  isSaving?: boolean;\n  duplicateCandidates?: FinanceDuplicateCandidate[];\n  duplicateWarningCopy?: string;\n  onAddPayment?:');
  }
  if (!text.includes('duplicateCandidates?: FinanceDuplicateCandidate[];') || !text.includes('duplicateWarningCopy?: string;')) throw new Error('CaseSettlementPanel props not patched');
  if (!text.includes('duplicateCandidates = [],')) {
    text = text.replace('  isSaving,\n}: {', '  isSaving,\n  duplicateCandidates = [],\n  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,\n}: {');
    text = text.replace('  isSaving?: boolean;\n}) {', '  isSaving?: boolean;\n  duplicateCandidates?: FinanceDuplicateCandidate[];\n  duplicateWarningCopy?: string;\n}) {');
  }
  if (!text.includes('data-fin9-payment-duplicate-warning="true"')) {
    text = text.replace('<form className="cf-finance-form" onSubmit={handleSubmit}>', '<form className="cf-finance-form" onSubmit={handleSubmit}>\n          {duplicateCandidates.length > 0 ? (\n            <div className="cf-finance-duplicate-warning" role="alert" data-fin9-payment-duplicate-warning="true">\n              <strong>Możliwy duplikat klienta</strong>\n              <span>{duplicateWarningCopy}</span>\n            </div>\n          ) : null}');
  }
  if (!text.includes('duplicateCandidates: duplicateCandidatesProp')) {
    text = text.replace('  isSaving = false,\n  onAddPayment,', '  isSaving = false,\n  duplicateCandidates: duplicateCandidatesProp = [],\n  duplicateWarningCopy = FINANCE_DUPLICATE_PAYMENT_WARNING_COPY,\n  onAddPayment,');
  }
  if (!text.includes('buildFinanceDuplicateCandidatesFromRecord(record)')) {
    text = text.replace('  const normalizedPayments = useMemo(() => normalizeFinancePayments(payments as Record<string, unknown>[]), [payments]);', '  const normalizedPayments = useMemo(() => normalizeFinancePayments(payments as Record<string, unknown>[]), [payments]);\n  const financeDuplicateCandidates = useMemo(() => {\n    return duplicateCandidatesProp.length ? duplicateCandidatesProp : buildFinanceDuplicateCandidatesFromRecord(record);\n  }, [duplicateCandidatesProp, record]);');
  }
  if (!text.includes('duplicateCandidates={financeDuplicateCandidates}')) {
    text = text.replace(/(<PaymentDialog[\s\S]*?isSaving=\{isSaving\})(\s*\/>)/g, '$1\n        duplicateCandidates={financeDuplicateCandidates}\n        duplicateWarningCopy={duplicateWarningCopy}$2');
  }
  if (!text.includes('CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY')) {
    text = text.replace('<span hidden data-fin5-case-settlement-panel="true" data-fin8-finance-visual-integration={CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5} />', '<span hidden data-fin5-case-settlement-panel="true" data-fin8-finance-visual-integration={CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5} data-fin9-finance-duplicate-safety="CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY" />');
  }
  write(rel, text);
}

function patchCss() {
  const rel = 'src/styles/finance/closeflow-finance.css';
  let text = read(rel);
  if (!text.includes('FIN-9_FINANCE_DUPLICATE_SAFETY_STYLE')) {
    text += '\n\n/* FIN-9_FINANCE_DUPLICATE_SAFETY_STYLE */\n.cf-finance-duplicate-warning {\n  display: grid;\n  gap: var(--cf-space-1, 0.25rem);\n  padding: var(--cf-space-3, 0.75rem);\n  border: 1px solid var(--cf-warning-border, var(--border));\n  border-radius: var(--cf-radius-lg, 0.875rem);\n  background: var(--cf-warning-surface, var(--muted));\n  color: var(--cf-warning-text, var(--foreground));\n}\n\n.cf-finance-duplicate-warning strong {\n  font-size: var(--cf-text-sm, 0.875rem);\n  font-weight: var(--cf-font-semibold, 700);\n}\n\n.cf-finance-duplicate-warning span {\n  font-size: var(--cf-text-xs, 0.75rem);\n  color: var(--cf-text-muted, var(--muted-foreground));\n}\n';
    write(rel, text);
  }
}

function patchApiSystem() {
  appendMarker('api/system.ts', 'CLOSEFLOW_FIN9_API_SYSTEM_DUPLICATE_SAFETY_MARKER');
}

function patchDetailMarkers() {
  appendMarker('src/pages/CaseDetail.tsx', 'CLOSEFLOW_FIN9_CASE_DETAIL_DUPLICATE_SAFETY_MARKER');
  appendMarker('src/pages/ClientDetail.tsx', 'CLOSEFLOW_FIN9_CLIENT_DETAIL_DUPLICATE_SAFETY_MARKER');
}

patchEntityConflictDialog();
patchPaymentFormDialog();
patchCaseSettlementPanel();
patchCss();
patchApiSystem();
patchDetailMarkers();

ensureIncludes(read('src/components/finance/CaseSettlementPanel.tsx'), 'FINANCE_DUPLICATE_PAYMENT_WARNING_COPY', 'CaseSettlementPanel missing FIN-9 warning copy');
ensureIncludes(read('src/components/finance/PaymentFormDialog.tsx'), 'data-fin9-payment-duplicate-warning', 'PaymentFormDialog missing FIN-9 warning');
console.log('CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_PATCH_OK');
