const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function loadTs(relativePath) {
  const result = buildSync({
    entryPoints: [path.join(root, relativePath)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const mod = new Module(relativePath, module);
  mod.filename = path.join(root, relativePath);
  mod.paths = Module._nodeModulePaths(path.dirname(mod.filename));
  mod._compile(result.outputFiles[0].text, mod.filename);
  return mod.exports;
}

const { getCaseOwnerRiskBadges } = loadTs('src/lib/owner-control/owner-risk-rules.ts');
const { buildOwnerControlBaseline } = loadTs('src/lib/owner-control/owner-control-baseline.ts');
const { getCaseFinanceSummary } = loadTs('src/lib/finance/case-finance-source.ts');
const { getCaseCostsSummary } = loadTs('src/lib/finance/case-costs-source.ts');
const { resolveClientPrimaryCase } = loadTs('src/lib/client-cases.ts');

const riskContext = { settings: { highValueThresholdPln: 5000, warningDays: 7, criticalDays: 14 } };
const badgeValues = [3500, 4999, 5000, 5001].map((contractValue) => ({
  contractValue,
  highValue: getCaseOwnerRiskBadges({
    id: `case-${contractValue}`,
    status: 'active',
    contractValue,
    commissionAmount: 69000,
    amount: 69000,
  }, riskContext).some((badge) => badge.key === 'case-high-value-risk'),
}));

assert.deepEqual(badgeValues, [
  { contractValue: 3500, highValue: false },
  { contractValue: 4999, highValue: false },
  { contractValue: 5000, highValue: true },
  { contractValue: 5001, highValue: true },
]);

const baseline = buildOwnerControlBaseline({
  cases: [{ id: 'case-3500', title: 'Sprawa 3500', status: 'active', contractValue: 3500, commissionAmount: 69000, amount: 69000 }],
  now: new Date('2026-06-13T12:00:00.000Z'),
});
assert.equal(baseline.items.find((item) => item.entityId === 'case-3500')?.valuePln, 3500);

const finance = getCaseFinanceSummary({
  contractValue: 69000,
  commissionMode: 'percent',
  commissionBase: 'contract_value',
  commissionRate: 2,
}, []);
assert.equal(finance.commissionAmount, 1380);
assert.equal(finance.commissionRemainingAmount, 1380);

const costs = getCaseCostsSummary({ costs: [], commissionRemainingAmount: finance.commissionRemainingAmount, currency: 'PLN' });
assert.equal(costs.totalToCollectAmount, 1380);

const caseOrder = resolveClientPrimaryCase({
  client: { id: 'client-1', primaryCaseId: 'main-case' },
  cases: [
    { id: 'new-case', status: 'new', createdAt: '2026-06-13T12:00:00.000Z' },
    { id: 'main-case', status: 'active', createdAt: '2026-05-01T12:00:00.000Z' },
  ],
});
assert.deepEqual(caseOrder.sortedCases.map((item) => item.id), ['main-case', 'new-case']);

const clientDetail = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const createDialog = read('src/components/CreateClientCaseDialog.tsx');
const createHelper = read('src/lib/cases/create-client-case.ts');

assert.match(clientDetail, /Dodaj sprawę/);
assert.match(clientDetail, /onAddCase=\{openNewCase\}/);
assert.match(clientDetail, /hasExistingCase=\{clientRelatedCasesStage231B0R8\.length > 0\}/);
assert.match(createDialog, /primaryForClient: !hasExistingCase/);
assert.match(createDialog, /source=client-detail/);
assert.match(createHelper, /createCaseInSupabase/);
assert.match(caseDetail, /\['client-create', 'client-detail'\]/);
assert.match(caseDetail, /caseFinanceSourceStage220A26\.commissionRemainingAmount/);
assert.match(caseDetail, />\s*Cofnij\s*</);
assert.match(caseDetail, /caseData\.clientId \? `\/clients\/\$\{encodeURIComponent/);

console.log('CLOSEFLOW_CLIENT_CASE_URGENT_REGRESSIONS_OK');
