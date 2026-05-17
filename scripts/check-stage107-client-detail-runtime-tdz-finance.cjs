#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const src = fs.readFileSync(file, 'utf8');
function fail(message) {
  console.error('[stage107-client-detail-runtime-tdz-finance] FAIL ' + message);
  process.exit(1);
}
function pass(message) {
  console.log('[stage107-client-detail-runtime-tdz-finance] PASS ' + message);
}
const summaryPos = src.indexOf('  const clientFinanceSummary = useMemo(() => {');
const financePos = src.indexOf('  const clientFinance = useMemo(() => {');
if (summaryPos < 0) fail('clientFinanceSummary useMemo missing');
if (financePos < 0) fail('clientFinance useMemo missing');
if (financePos < summaryPos) fail('clientFinance reads clientFinanceSummary before declaration');
if (src.includes('getClientCasesFinanceSummary(cases ?? [], payments ?? [])')) fail('legacy two-argument getClientCasesFinanceSummary call remains');
if (!src.includes('getClientCasesFinanceSummary({ client, cases: cases ?? [], payments: payments ?? [] })')) fail('object-form getClientCasesFinanceSummary call missing');
if (!src.includes('financeSummary: ClientFinanceSummaryForTopTiles;')) fail('ClientTopTiles props do not include financeSummary');
if (!src.includes('function ClientTopTiles({ clientId, leads, cases, payments, tasks, events, financeSummary, onOpenCases }: ClientTopTilesProps)')) fail('ClientTopTiles does not receive financeSummary prop');
if (src.includes('const paidPayments = payments.filter')) fail('unused paidPayments ghost remains');
if (src.includes('const declaredTotal = clientFinanceSummary.commissionDueTotal')) fail('out-of-scope declaredTotal ghost remains');
if (src.includes('const paidTotal = clientFinanceSummary.paymentsTotal')) fail('ClientTopTiles still reads outer clientFinanceSummary');
if (!src.includes('financeSummary={clientFinanceSummary}')) fail('ClientTopTiles render does not pass financeSummary');
if (!src.includes('CLOSEFLOW_STAGE107_CLIENT_DETAIL_TDZ_FINANCE_RUNTIME_FIX')) fail('Stage107 marker missing');
pass('ClientDetail finance TDZ/runtime guard');
