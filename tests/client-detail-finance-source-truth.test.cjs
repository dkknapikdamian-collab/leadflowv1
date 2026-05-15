const fs = require('fs');
const path = require('path');
function fail(msg){ console.error('FAIL client-detail-finance-source-truth: ' + msg); process.exit(1); }
const finance = fs.readFileSync(path.join(process.cwd(), 'src/lib/finance/case-finance-source.ts'), 'utf8');
const client = fs.readFileSync(path.join(process.cwd(), 'src/pages/ClientDetail.tsx'), 'utf8');
if (!/export function getClientCasesFinanceSummary/.test(finance)) fail('case-finance-source.ts nie eksportuje getClientCasesFinanceSummary');
if (!/getClientCasesFinanceSummary/.test(client)) fail('ClientDetail nie uzywa getClientCasesFinanceSummary');
if (!/commissionDueTotal|commissionDue|commissionAmount/.test(finance)) fail('brak prowizji naleznej w helperze klienta');
if (!/transactionValueTotal|transactionValue|contractValue/.test(finance)) fail('brak wartosci transakcji w helperze klienta');
console.log('OK tests/client-detail-finance-source-truth.test.cjs');
