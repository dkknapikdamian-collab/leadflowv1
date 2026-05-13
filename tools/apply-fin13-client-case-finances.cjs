const fs = require('fs');
const path = require('path');

const root = process.cwd();
const marker = 'CLOSEFLOW_FIN13_CLIENT_CASE_FINANCES_V1';

function p(rel) { return path.join(root, rel); }
function read(rel) { return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : ''; }
function write(rel, value) { fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), value, 'utf8'); }
function fail(message) { throw new Error(message); }

function patchPackageJson() {
  const rel = 'package.json';
  const json = JSON.parse(read(rel));
  json.scripts = json.scripts || {};
  json.scripts['check:fin13'] = 'node scripts/check-fin13-client-case-finances.cjs';
  json.scripts['test:fin13'] = 'node --test tests/fin13-client-case-finances.test.cjs';
  json.scripts['verify:fin13'] = 'npm.cmd run check:fin13 && npm.cmd run test:fin13';
  write(rel, `${JSON.stringify(json, null, 2)}\n`);
  console.log('[FIN-13] package.json: dodano check/test/verify FIN-13');
}

function appendCss(rel, css) {
  const source = read(rel);
  if (source.includes('FIN-13_CLIENT_CASE_FINANCES_STYLES')) {
    console.log(`[FIN-13] ${rel}: style już istnieją`);
    return;
  }
  write(rel, `${source.trimEnd()}\n\n${css.trim()}\n`);
  console.log(`[FIN-13] ${rel}: dodano style FIN-13`);
}

function patchCaseSettlementPanel() {
  const rel = 'src/components/finance/CaseSettlementPanel.tsx';
  let source = read(rel);
  if (!source) return;
  if (!source.includes("./CaseFinanceEditorDialog")) {
    source = source.replace(
      "import { PaymentList } from './PaymentList';",
      "import { PaymentList } from './PaymentList';\nimport { CaseFinanceEditorDialog } from './CaseFinanceEditorDialog';\nimport { CaseFinanceActionButtons } from './CaseFinanceActionButtons';",
    );
  }
  source = source.replace(
    /<div className=\"cf-finance-settlement-actions\">[\s\S]*?<\/div>\s*\) : null}/,
    `<CaseFinanceActionButtons\n              className=\"cf-finance-settlement-actions\"\n              onEdit={() => setCommissionOpen(true)}\n              onAddPayment={() => setPaymentOpen(true)}\n              onAddCommissionPayment={() => setCommissionPaymentOpen(true)}\n              showCommissionPayment\n              disabled={isSaving}\n            />\n        ) : null}`,
  );
  source = source.replace(
    /<CommissionDialog\s*\n\s*open=\{commissionOpen\}[\s\S]*?isSaving=\{isSaving\}\s*\n\s*\/\>/,
    `<CaseFinanceEditorDialog\n        open={commissionOpen}\n        onOpenChange={setCommissionOpen}\n        caseRecord={record}\n        payments={normalizedPayments as unknown as Record<string, unknown>[]}\n        isSaving={isSaving}\n        onSave={async (patch) => {\n          await onEditCommission?.({\n            contractValue: Number(patch.contractValue || 0),\n            commissionMode: normalizeCommissionMode(patch.commissionMode),\n            commissionBase: normalizeCommissionBase(patch.commissionBase),\n            commissionRate: patch.commissionRate == null ? null : Number(patch.commissionRate || 0),\n            commissionAmount: patch.commissionAmount == null ? null : Number(patch.commissionAmount || 0),\n            commissionStatus: normalizeCommissionStatus(patch.commissionStatus),\n            currency: normalizeCurrency(patch.currency),\n          });\n        }}\n      />`,
  );
  if (!source.includes('FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR')) {
    source = source.replace(
      "export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10 = 'FIN-10_CASE_FINANCE_SOURCE_TRUTH_PANEL_V1' as const;",
      "export const CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN10 = 'FIN-10_CASE_FINANCE_SOURCE_TRUTH_PANEL_V1' as const;\nexport const FIN13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR = 'FIN-13_CASE_SETTLEMENT_PANEL_USES_SHARED_CASE_FINANCE_EDITOR' as const;",
    );
  }
  write(rel, source);
  console.log('[FIN-13] CaseSettlementPanel: podpięty do wspólnego modala/przycisków');
}

function patchClientDetail() {
  const rel = 'src/pages/ClientDetail.tsx';
  let source = read(rel);
  if (!source) return;
  if (!source.includes('FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE')) {
    source = source.replace(
      "const CLIENT_DETAIL_NEW_CASE_FOR_CLIENT_COPY_GUARD = '+ Nowa sprawa dla klienta';",
      "const CLIENT_DETAIL_NEW_CASE_FOR_CLIENT_COPY_GUARD = '+ Nowa sprawa dla klienta';\nconst FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE = 'FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE';",
    );
  }

  const jsxOccurrences = (source.match(/<ClientFinanceRelationSummary/g) || []).length;
  if (jsxOccurrences === 0) {
    const casesTabOpen = source.search(/<TabsContent\s+value=[\"']cases[\"'][^>]*>/);
    if (casesTabOpen >= 0) {
      const closeIndex = source.indexOf('</TabsContent>', casesTabOpen);
      if (closeIndex > casesTabOpen) {
        const insert = `\n          <ClientFinanceRelationSummary\n            client={client}\n            clientId={clientId}\n            title=\"Finanse klienta\"\n          />\n`;
        source = source.slice(0, closeIndex) + insert + source.slice(closeIndex);
        console.log('[FIN-13] ClientDetail: dodano sekcję finansów klienta do zakładki Sprawy');
      } else {
        console.warn('[FIN-13] ClientDetail: nie znaleziono zamknięcia TabsContent cases, zostawiam istniejący layout');
      }
    } else {
      console.warn('[FIN-13] ClientDetail: nie znaleziono TabsContent value=cases, zostawiam istniejący layout');
    }
  } else {
    console.log('[FIN-13] ClientDetail: ClientFinanceRelationSummary już jest renderowany');
  }

  write(rel, source);
}

function patchClientFinanceSource() {
  const rel = 'src/lib/client-finance.ts';
  let source = read(rel);
  if (!source) return;
  if (!source.includes('FIN13_CLIENT_FINANCE_IS_CASE_FINANCE')) {
    source += "\nexport const FIN13_CLIENT_FINANCE_IS_CASE_FINANCE = 'FIN13_CLIENT_FINANCE_IS_CASE_FINANCE';\n";
    write(rel, source);
  }
}

function main() {
  patchPackageJson();
  patchCaseSettlementPanel();
  patchClientDetail();
  patchClientFinanceSource();
  appendCss('src/styles/finance/closeflow-finance.css', `
/* FIN-13_CLIENT_CASE_FINANCES_STYLES */
.cf-case-finance-action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.cf-case-finance-action-buttons--compact {
  align-items: stretch;
}
.cf-case-finance-action-buttons--compact > * {
  min-height: 34px;
}
.cf-finance-editor-dialog__subtitle,
.cf-fin13-client-finance-header span {
  display: block;
  margin-top: 4px;
  color: rgba(71, 85, 105, 0.86);
  font-size: 13px;
  line-height: 1.35;
}
.cf-finance-editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.cf-finance-editor-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.82);
}
.cf-finance-editor-preview div,
.cf-fin13-client-case-finance-row__metrics div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.cf-finance-editor-preview span,
.cf-fin13-client-case-finance-row__metrics dt {
  color: rgba(71, 85, 105, 0.82);
  font-size: 12px;
  font-weight: 700;
}
.cf-finance-editor-preview strong,
.cf-fin13-client-case-finance-row__metrics dd {
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
}
.cf-fin13-client-case-finance-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}
.cf-fin13-client-case-finance-list__title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 900;
}
.cf-fin13-client-case-finance-empty {
  margin: 0;
  color: rgba(71, 85, 105, 0.82);
  font-size: 13px;
}
.cf-fin13-client-case-finance-row {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}
.cf-fin13-client-case-finance-row__head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.cf-fin13-client-case-finance-row__head p {
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 900;
}
.cf-fin13-client-case-finance-row__head span {
  color: rgba(71, 85, 105, 0.72);
  font-size: 12px;
}
.cf-fin13-client-case-finance-row__metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}
@media (max-width: 900px) {
  .cf-finance-editor-grid,
  .cf-finance-editor-preview,
  .cf-fin13-client-case-finance-row__metrics {
    grid-template-columns: 1fr;
  }
  .cf-case-finance-action-buttons,
  .cf-case-finance-action-buttons > * {
    width: 100%;
  }
}
`);
  appendCss('src/styles/visual-stage12-client-detail-vnext.css', `
/* FIN-13_CLIENT_CASE_FINANCES_STYLES */
.client-detail-page .cf-fin13-client-case-finances {
  margin-top: 14px;
}
`);
  console.log(`[FIN-13] ${marker}: patch zakończony`);
}

main();
