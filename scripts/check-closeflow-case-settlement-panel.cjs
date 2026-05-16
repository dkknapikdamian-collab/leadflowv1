#!/usr/bin/env node
const fs = require('fs');
const checks = [];
function add(file, needle, label = needle) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const ok = text.includes(needle);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${file}: ${label}`);
  checks.push(ok);
}
add('src/components/finance/CaseSettlementPanel.tsx', 'Rozliczenie sprawy');
add('src/components/finance/CaseSettlementPanel.tsx', 'Warto\u015B\u0107 transakcji');
add('src/components/finance/CaseSettlementPanel.tsx', 'Prowizja nale\u017Cna');
add('src/components/finance/CaseSettlementPanel.tsx', 'Wp\u0142acono od klienta');
add('src/components/finance/CaseSettlementPanel.tsx', 'Prowizja do zap\u0142aty');
add('src/components/finance/CaseSettlementPanel.tsx', 'buildFinanceSummary');
add('src/components/finance/CaseSettlementPanel.tsx', 'type="commission"', 'commission payment marker');
add('src/components/finance/CaseSettlementPanel.tsx', 'type="partial"', 'partial payment marker');
add('src/pages/CaseDetail.tsx', 'CaseSettlementPanel');
add('src/pages/CaseDetail.tsx', 'createPaymentInSupabase');
add('src/pages/CaseDetail.tsx', 'fetchPaymentsFromSupabase');
add('src/pages/CaseDetail.tsx', 'updateCaseInSupabase');
add('src/styles/finance/closeflow-finance.css', '.cf-finance-settlement-panel');
add('docs/finance/CLOSEFLOW_CASE_SETTLEMENT_PANEL_2026-05-10.md', 'jednego \u017Ar\u00F3d\u0142a prawdy');
const pass = checks.filter(Boolean).length;
const fail = checks.length - pass;
console.log(`\nSummary: ${pass} pass, ${fail} fail.`);
if (fail) {
  console.error('FAIL CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_CASE_SETTLEMENT_PANEL_FIN5_OK');
