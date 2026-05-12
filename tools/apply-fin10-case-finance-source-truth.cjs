const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_FIN10_CASE_FINANCE_SOURCE_TRUTH';

function file(p) { return path.join(root, p); }
function exists(p) { return fs.existsSync(file(p)); }
function read(p) { return fs.readFileSync(file(p), 'utf8'); }
function write(p, content) { fs.writeFileSync(file(p), content, 'utf8'); }
function ensureDir(p) { fs.mkdirSync(file(p), { recursive: true }); }
function fail(msg) { throw new Error(msg); }
function log(msg) { console.log(`[FIN-10] ${msg}`); }

function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) fail(`Nie znaleziono fragmentu do podmiany: ${label}`);
  return text.replace(needle, replacement);
}

function patchPackageJson() {
  const p = 'package.json';
  const pkg = JSON.parse(read(p));
  pkg.scripts ||= {};
  pkg.scripts['check:fin10'] = 'node scripts/check-fin10-case-finance-source-truth.cjs';
  pkg.scripts['test:fin10'] = 'node --test tests/case-finance-source.test.cjs';
  pkg.scripts['verify:fin10'] = 'npm.cmd run check:fin10 && npm.cmd run test:fin10';
  write(p, `${JSON.stringify(pkg, null, 2)}\n`);
  log('package.json: dodano check:fin10, test:fin10, verify:fin10');
}

function patchCaseSettlementPanel() {
  const p = 'src/components/finance/CaseSettlementPanel.tsx';
  let text = read(p);

  if (!text.includes("../../lib/finance/case-finance-source")) {
    text = text.replace(
      "import {\n  buildFinanceSummary,\n  calculateCommissionAmount,",
      "import {\n  calculateCommissionAmount,",
    );
    text = replaceOnce(
      text,
      "} from '../../lib/finance/finance-calculations';",
      "} from '../../lib/finance/finance-calculations';\nimport { getCaseFinanceSummary } from '../../lib/finance/case-finance-source';",
      'import case-finance-source',
    );
  }

  if (!text.includes('CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10')) {
    text = text.replace(
      "export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5 = 'FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1' as const;",
      "export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5 = 'FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1' as const;\nexport const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10 = 'FIN-10_CASE_FINANCE_SOURCE_TRUTH_PANEL_V1' as const;",
    );
  }

  const summaryStart = text.indexOf("  const currency = normalizeCurrency(record?.currency || payments.find((payment) => (payment as Record<string, unknown>).currency)?.currency || 'PLN');");
  const summaryEndNeedle = "  }), [commissionConfig, contractValue, currency, normalizedPayments]);";
  const summaryEnd = text.indexOf(summaryEndNeedle, summaryStart);
  if (summaryStart === -1 || summaryEnd === -1) {
    if (!text.includes('getCaseFinanceSummary(record, normalizedPayments)')) {
      fail('CaseSettlementPanel: nie znaleziono starego bloku summary i nie widać nowego FIN-10');
    }
  } else {
    const replacement = `  const normalizedPayments = useMemo(() => normalizeFinancePayments(payments as Record<string, unknown>[]), [payments]);
  const summary = useMemo(() => getCaseFinanceSummary(record, normalizedPayments), [record, normalizedPayments]);
  const currency = summary.currency;
  const contractValue = summary.contractValue;
  const financeDuplicateCandidates = useMemo(() => {
    return duplicateCandidatesProp.length ? duplicateCandidatesProp : buildFinanceDuplicateCandidatesFromRecord(record);
  }, [duplicateCandidatesProp, record]);
  const commissionConfig = useMemo(() => getCommissionConfig(record, currency), [currency, record]);`;
    text = text.slice(0, summaryStart) + replacement + text.slice(summaryEnd + summaryEndNeedle.length);
  }

  text = text.replace(
    "  const commissionAmount = explicitCommissionAmount > 0 && summary.commissionAmount <= 0 ? explicitCommissionAmount : summary.commissionAmount;\n  const commissionStatus = getInitialCommissionStatus(record, summary.commissionStatus);\n  const commissionPaid = summary.paidCommissionAmount;\n  const commissionRemaining = Math.max(0, commissionAmount - commissionPaid);",
    "  const commissionAmount = summary.commissionAmount;\n  const commissionStatus = summary.commissionStatus;\n  const commissionPaid = summary.commissionPaidAmount;\n  const commissionRemaining = summary.commissionRemainingAmount;",
  );
  text = text.replace(
    "<Metric label=\"Prowizja\" value={getCommissionLine(commissionConfig.mode, commissionConfig.percent, commissionAmount, currency)} />",
    "<Metric label=\"Prowizja\" value={getCommissionLine(summary.commissionMode, summary.commissionRate, commissionAmount, currency)} />",
  );
  text = text.replace(
    "<Metric label=\"Wpłacono od klienta\" value={formatMoney(summary.paidAmount, currency)} />",
    "<Metric label=\"Wpłacono od klienta\" value={formatMoney(summary.clientPaidAmount, currency)} />",
  );
  text = text.replace(
    'data-fin9-finance-duplicate-safety="CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY" />',
    'data-fin9-finance-duplicate-safety="CLOSEFLOW_FIN9_CASE_SETTLEMENT_DUPLICATE_WARNING_ONLY" data-case-settlement-panel="fin10" data-fin10-case-finance-source-truth="true" />',
  );

  // Usunięcie martwych zmiennych po przepięciu na centralny source. Nie ruszamy UI.
  text = text.replace(/\n  const explicitCommissionAmount = getExplicitCommissionAmount\(record\);/, '');

  if (text.includes('buildFinanceSummary(')) fail('CaseSettlementPanel nadal używa buildFinanceSummary zamiast FIN-10 source');
  write(p, text);
  log('CaseSettlementPanel: przepięty na getCaseFinanceSummary');
}

function patchCaseSettlementSection() {
  const p = 'src/components/finance/CaseSettlementSection.tsx';
  let text = read(p);
  if (!text.includes('data-case-settlement-section="fin10"')) {
    text = text.replace(
      'data-cf-case-finance-section="case-detail-only"',
      'data-cf-case-finance-section="case-detail-only"\n      data-case-settlement-section="fin10"',
    );
    write(p, text);
    log('CaseSettlementSection: dodano marker FIN-10');
  }
}

function patchFinanceMiniSummary() {
  const p = 'src/components/finance/FinanceMiniSummary.tsx';
  let text = read(p);
  if (!text.includes("type { CaseFinanceSummary } from '../../lib/finance/case-finance-source'")) {
    text = text.replace(
      "import type { CommissionMode, CommissionStatus, FinanceSummary } from '../../lib/finance/finance-types';",
      "import type { CommissionMode, CommissionStatus, FinanceSummary } from '../../lib/finance/finance-types';\nimport type { CaseFinanceSummary } from '../../lib/finance/case-finance-source';",
    );
    text = text.replace('summary: FinanceSummary;', 'summary: FinanceSummary | CaseFinanceSummary;');
  }
  if (!text.includes('data-fin10-finance-mini-summary="case-source"')) {
    text = text.replace(
      '<SurfaceCard className="cf-finance-mini-summary" aria-label={title}>',
      '<SurfaceCard className="cf-finance-mini-summary" aria-label={title} data-fin10-finance-mini-summary="case-source">',
    );
  }
  if (/\.reduce\s*\(/.test(text)) fail('FinanceMiniSummary nie może liczyć finansów przez reduce w komponencie');
  write(p, text);
  log('FinanceMiniSummary: oznaczony jako prezentacyjny pod FIN-10');
}

function patchCaseDetail() {
  const p = 'src/pages/CaseDetail.tsx';
  let text = read(p);

  if (!text.includes("../lib/finance/case-finance-source")) {
    text = text.replace(
      "import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';",
      "import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';\nimport { buildCaseFinancePatch, getCaseFinanceSummary as getCaseFinanceSourceSummary } from '../lib/finance/case-finance-source';",
    );
  }

  const startNeedle = 'function getCaseFinanceSummary(caseData: CaseRecord | null, payments: CasePaymentRecord[]) {';
  const start = text.indexOf(startNeedle);
  const end = text.indexOf('function sortCasePayments', start);
  if (start !== -1 && end !== -1) {
    const adapter = `function getCaseFinanceSummary(caseData: CaseRecord | null, payments: CasePaymentRecord[]) {
  const source = getCaseFinanceSourceSummary(caseData, payments);
  const progress = source.contractValue > 0 ? Math.min(100, Math.round((source.clientPaidAmount / source.contractValue) * 100)) : 0;
  const status =
    source.contractValue <= 0
      ? 'Ustal wartość'
      : source.clientPaidAmount <= 0
        ? 'Brak wpłaty'
        : source.remainingAmount <= 0
          ? 'Opłacone'
          : 'Częściowo opłacone';
  return {
    expected: source.contractValue,
    paid: source.clientPaidAmount,
    remaining: source.remainingAmount,
    progress,
    status,
    currency: source.currency,
  };
}
`;
    text = text.slice(0, start) + adapter + text.slice(end);
  } else if (!text.includes('getCaseFinanceSourceSummary(caseData, payments)')) {
    fail('CaseDetail: nie znaleziono lokalnego getCaseFinanceSummary do przepięcia');
  }

  // Gdy CaseDetail aktualizuje wartość/prowizję, ma przejść przez buildCaseFinancePatch,
  // żeby nie wysyłać paidAmount/remainingAmount jako edytowalnego źródła prawdy.
  text = text.replace(
    /await updateCaseInSupabase\((caseData(?:\?\.)?\.id|caseData\.id|String\(caseData\.id\)|id),\s*\{\s*contractValue:\s*value\.contractValue,\s*expectedRevenue:\s*value\.contractValue,\s*currency:\s*value\.currency,\s*commissionMode:\s*value\.commissionMode,\s*commissionBase:\s*value\.commissionBase,\s*commissionRate:\s*value\.commissionRate,\s*commissionAmount:\s*value\.commissionAmount,\s*commissionStatus:\s*value\.commissionStatus,?\s*\}\);/g,
    'await updateCaseInSupabase($1, buildCaseFinancePatch(value));',
  );

  if (text.includes('function getCaseFinanceSummary') && !text.includes('getCaseFinanceSourceSummary(caseData, payments)')) {
    fail('CaseDetail: lokalny helper nie deleguje do FIN-10 source');
  }
  write(p, text);
  log('CaseDetail: lokalny helper finansowy deleguje do FIN-10 source');
}

function assertNoOldPanelMarker() {
  const roots = ['src/pages', 'src/components'];
  const hits = [];
  function walk(dir) {
    if (!fs.existsSync(file(dir))) return;
    for (const entry of fs.readdirSync(file(dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory()) walk(rel);
      else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const content = read(rel);
        if (content.includes('data-case-finance-panel')) hits.push(rel);
      }
    }
  }
  roots.forEach(walk);
  if (hits.length) fail(`Stary marker data-case-finance-panel nadal istnieje w aktywnym UI: ${hits.join(', ')}`);
}

function main() {
  if (!exists('package.json')) fail('Uruchom z katalogu repo CloseFlow, nie z folderu paczki.');
  if (!exists('src/components/finance/CaseSettlementPanel.tsx')) fail('Nie znaleziono CaseSettlementPanel.tsx');
  ensureDir('src/lib/finance');
  ensureDir('scripts');
  ensureDir('tests');
  ensureDir('docs/release');

  patchPackageJson();
  patchCaseSettlementPanel();
  patchCaseSettlementSection();
  patchFinanceMiniSummary();
  patchCaseDetail();
  assertNoOldPanelMarker();

  log(`${marker}: patch zakończony`);
}

main();
