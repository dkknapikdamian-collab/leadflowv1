const fs = require('fs');
const checks = [];
function pass(label){ checks.push({ok:true,label}); console.log(`PASS ${label}`); }
function fail(label){ checks.push({ok:false,label}); console.error(`FAIL ${label}`); }
function read(rel){ if(!fs.existsSync(rel)){ fail(`${rel}: exists`); return ''; } pass(`${rel}: exists`); return fs.readFileSync(rel,'utf8'); }
function has(rel, needle, label){ const text = read(rel); if(text.includes(needle)) pass(`${rel}: ${label}`); else fail(`${rel}: missing ${label} [needle=${needle}]`); return text; }

const summary = has('src/lib/finance/finance-client-summary.ts', 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_V1', 'contract marker');
for (const needle of ['buildClientFinanceSummary', 'contractValue', 'commissionAmount', 'paidAmount', 'remainingAmount', 'normalizeFinancePayments', 'type !== \'commission\'']) {
  if(summary.includes(needle)) pass(`finance-client-summary contains ${needle}`); else fail(`finance-client-summary missing ${needle}`);
}

const mini = has('src/components/finance/FinanceMiniSummary.tsx', 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT_V1', 'component marker');
for (const needle of ['ClientFinanceRelationSummary', 'Finanse relacji', 'Suma spraw', 'Prowizja należna', 'Wpłacono', 'Pozostało', 'fetchCasesFromSupabase', 'fetchPaymentsFromSupabase']) {
  if(mini.includes(needle)) pass(`FinanceMiniSummary contains ${needle}`); else fail(`FinanceMiniSummary missing ${needle}`);
}

const client = has('src/pages/ClientDetail.tsx', 'data-fin7-client-detail-finance-summary', 'ClientDetail mount marker');
if(client.includes("../components/finance/FinanceMiniSummary")) pass('ClientDetail imports FIN-7 finance summary'); else fail('ClientDetail imports FIN-7 finance summary');
if(client.includes('<ClientFinanceRelationSummary')) pass('ClientDetail renders FIN-7 finance summary'); else fail('ClientDetail renders FIN-7 finance summary');

const css = has('src/styles/finance/closeflow-finance.css', 'FIN-7_CLIENT_FINANCE_SUMMARY_STYLE', 'style marker');
if(css.includes('.cf-finance-client-summary')) pass('finance CSS contains client summary class'); else fail('finance CSS contains client summary class');

const pkgText = read('package.json');
try {
  const pkg = JSON.parse(pkgText.replace(/^\uFEFF/, ''));
  if(pkg.scripts && pkg.scripts['check:closeflow-fin7-client-finance-summary']) pass('package.json has FIN-7 script'); else fail('package.json has FIN-7 script');
} catch(error) { fail(`package.json parse ${error.message}`); }

const doc = has('docs/finance/CLOSEFLOW_FIN7_CLIENT_FINANCE_SUMMARY_2026-05-10.md', 'FIN-7', 'doc marker');
for (const needle of ['Finanse relacji', 'Suma spraw', 'Prowizja należna', 'Wpłacono', 'Pozostało']) {
  if(doc.includes(needle)) pass(`doc contains ${needle}`); else fail(`doc missing ${needle}`);
}

const failed = checks.filter((item) => !item.ok);
console.log(`\nSummary: ${checks.length - failed.length} pass, ${failed.length} fail.`);
if(failed.length){ console.error('FAIL CLOSEFLOW_FIN7_CLIENT_FINANCE_SUMMARY_FAILED'); process.exit(1); }
console.log('CLOSEFLOW_FIN7_CLIENT_FINANCE_SUMMARY_OK');
