const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(abs, 'utf8');
}
function assertIncludes(file, text, message) {
  const content = read(file);
  if (!content.includes(text)) throw new Error(`${message || 'Missing text'} in ${file}: ${text}`);
}
function assertNotIncludes(file, text, message) {
  const content = read(file);
  if (content.includes(text)) throw new Error(`${message || 'Unexpected text'} in ${file}: ${text}`);
}

const helper = 'src/lib/client-finance.ts';
const component = 'src/components/finance/FinanceMiniSummary.tsx';
const clientDetail = 'src/pages/ClientDetail.tsx';
const pkg = 'package.json';

assertIncludes(helper, 'export type ClientFinanceSummary', 'ClientFinanceSummary type must exist');
assertIncludes(helper, "source: 'primary_case' | 'all_active_cases' | 'all_cases';", 'source contract must exist');
assertIncludes(helper, 'calculateClientFinanceSummary', 'calculateClientFinanceSummary helper must exist');
assertIncludes(helper, "mode?: ClientFinanceSummaryMode", 'mode contract must exist');
assertIncludes(helper, "'primary_case_first'", 'primary case first mode must exist');
assertIncludes(helper, "'all_active_cases'", 'all active cases mode must exist');
assertIncludes(helper, 'PAID_PAYMENT_STATUSES', 'paid payment status set must exist');
assertIncludes(helper, "'confirmed'", 'confirmed payment status must be counted as paid');
assertIncludes(helper, "'deposit_paid'", 'deposit_paid payment status must be counted as paid');
assertIncludes(helper, 'remainingValue: Math.max(totalValue - safePaidValue, 0)', 'remaining value must be total minus paid');

assertIncludes(component, "../../lib/client-finance", 'Finance component must use client finance helper');
assertIncludes(component, 'calculateClientFinanceSummary({', 'Finance component must calculate via helper');
assertIncludes(component, 'client:', 'Finance component must pass client into helper');
assertIncludes(component, 'data-fin8-client-finance-summary', 'FIN-8 data marker must exist');
assertIncludes(component, '<dt>Wartość</dt>', 'UI label Wartość must exist');
assertIncludes(component, '<dt>Opłacone</dt>', 'UI label Opłacone must exist');
assertIncludes(component, '<dt>Do domknięcia</dt>', 'UI label Do domknięcia must exist');
assertIncludes(component, '<dt>Rozliczenia</dt>', 'UI label Rozliczenia must exist');
assertNotIncludes(component, '<dt>Suma spraw</dt>', 'Old misleading label must be removed');
assertNotIncludes(component, '<dt>Prowizja należna</dt>', 'Client tile must not show commission in FIN-8');

assertIncludes(clientDetail, 'client={client}', 'ClientDetail must pass client to finance summary');
const clientDetailSource = read(clientDetail);
if (/ClientFinanceRelationSummary[^>]*\/>\s*client=\{client\}/m.test(clientDetailSource)) {
  throw new Error('ClientDetail passes client={client} outside ClientFinanceRelationSummary tag.');
}
if (!/<ClientFinanceRelationSummary[\s\S]*?client=\{client\}[\s\S]*?\/>/m.test(clientDetailSource)) {
  throw new Error('ClientDetail must pass client={client} inside ClientFinanceRelationSummary tag.');
}
assertIncludes(pkg, 'check:closeflow-client-finance-summary', 'package script must exist');

console.log('CLOSEFLOW_CLIENT_FINANCE_SUMMARY_ETAP8_CHECK_OK');
console.log('helper=src/lib/client-finance.ts');
console.log('source_rule=primary_case_first_then_all_active_cases');
console.log('labels=Wartość|Opłacone|Do domknięcia|Rozliczenia');
