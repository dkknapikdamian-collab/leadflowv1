const fs = require('fs');
const path = require('path');
function fail(msg){ console.error('FAIL case-finance-commission-semantics: ' + msg); process.exit(1); }
const finance = fs.readFileSync(path.join(process.cwd(), 'src/lib/finance/case-finance-source.ts'), 'utf8');
if (!/export function getCaseFinanceSemanticValues/.test(finance)) fail('case-finance-source.ts nie eksportuje getCaseFinanceSemanticValues');
if (!/transactionValue/.test(finance)) fail('brak transactionValue');
if (!/commissionDue/.test(finance)) fail('brak commissionDue');
if (!/commissionMode/.test(finance) || !/percent/.test(finance)) fail('brak obslugi procentowej prowizji');
console.log('OK tests/case-finance-commission-semantics.test.cjs');
