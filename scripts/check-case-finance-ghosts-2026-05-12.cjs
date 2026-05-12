const fs = require('fs');
const path = require('path');

const root = process.cwd();
const errors = [];
const warnings = [];

function read(rel) {
  const full = path.join(root, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const fullFinanceActionCopy = [
  'Dodaj wpłatę',
  'Dodaj płatność prowizji',
  'Edytuj prowizję',
];

const fullFinanceMetricCopy = [
  'Wartość transakcji',
  'Prowizja należna',
  'Prowizja do zapłaty',
  'Wpłacono od klienta',
  'Status prowizji',
];

const clientDetail = read('src/pages/ClientDetail.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const section = read('src/components/finance/CaseSettlementSection.tsx');
const panel = read('src/components/finance/CaseSettlementPanel.tsx');

if (!section) fail('Brak src/components/finance/CaseSettlementSection.tsx');
if (!caseDetail.includes('CaseSettlementSection')) fail('CaseDetail nie używa CaseSettlementSection. Pełny panel rozliczeń nie ma bramki loading/route.');
if (caseDetail.includes('CaseSettlementPanel')) fail('CaseDetail nadal używa CaseSettlementPanel bezpośrednio.');
if (caseDetail.includes('../components/finance/CaseSettlementPanel')) fail('CaseDetail nadal importuje bezpośredni CaseSettlementPanel.');
if (!caseDetail.includes('routeCaseId=')) warn('CaseDetail nie przekazuje routeCaseId do CaseSettlementSection. Wrapper nadal blokuje pusty rekord, ale słabiej chroni przed starym rekordem przy zmianie route.');

if (!section.includes('data-cf-case-finance-section="case-detail-only"')) fail('CaseSettlementSection nie ma znacznika case-detail-only.');
if (!section.includes('!recordId')) fail('CaseSettlementSection nie blokuje pustego record.id.');
if (!section.includes('expectedRouteId && expectedRouteId !== recordId')) fail('CaseSettlementSection nie blokuje rozjazdu routeCaseId vs record.id.');
if (!panel.includes('FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1')) fail('CaseSettlementPanel utracił FIN-5 guard.');

for (const pair of [
  ['src/pages/ClientDetail.tsx', clientDetail],
  ['src/pages/LeadDetail.tsx', leadDetail],
]) {
  const rel = pair[0];
  const content = pair[1];
  if (/CaseSettlement(?:Panel|Section)/.test(content)) {
    fail(rel + ' importuje albo renderuje pełny panel rozliczenia sprawy. Klient/lead mogą mieć tylko skrót, nie edycję płatności sprawy.');
  }
  const actionHits = fullFinanceActionCopy.filter((copy) => content.includes(copy));
  const metricHits = fullFinanceMetricCopy.filter((copy) => content.includes(copy));
  if (actionHits.length >= 2) {
    fail(rel + ' zawiera kilka pełnych akcji finansowych sprawy: ' + actionHits.join(', ') + '.');
  }
  if (metricHits.length >= 3) {
    fail(rel + ' wygląda jak pełny panel rozliczenia sprawy, bo zawiera metryki: ' + metricHits.join(', ') + '.');
  }
}

if (!clientDetail.includes('ClientFinanceRelationSummary')) {
  warn('ClientDetail nie używa ClientFinanceRelationSummary. To może być OK, ale klient powinien mieć najwyżej skrót relacji finansowych, nie pełny panel.');
}

if (warnings.length) {
  console.log('WARNINGS:');
  for (const message of warnings) console.log(' - ' + message);
}

if (errors.length) {
  console.error('CASE FINANCE GHOST CHECK FAILED');
  for (const message of errors) console.error(' - ' + message);
  process.exit(1);
}

console.log('OK: case finance section is guarded and full finance editor is not exposed in ClientDetail/LeadDetail.');
