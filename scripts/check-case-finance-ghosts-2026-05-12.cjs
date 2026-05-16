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
  'Dodaj wp\u0142at\u0119',
  'Dodaj p\u0142atno\u015B\u0107 prowizji',
  'Edytuj prowizj\u0119',
];

const fullFinanceMetricCopy = [
  'Warto\u015B\u0107 transakcji',
  'Prowizja nale\u017Cna',
  'Prowizja do zap\u0142aty',
  'Wp\u0142acono od klienta',
  'Status prowizji',
];

const clientDetail = read('src/pages/ClientDetail.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const section = read('src/components/finance/CaseSettlementSection.tsx');
const panel = read('src/components/finance/CaseSettlementPanel.tsx');

if (!section) fail('Brak src/components/finance/CaseSettlementSection.tsx');
if (!caseDetail.includes('CaseSettlementSection')) fail('CaseDetail nie u\u017Cywa CaseSettlementSection. Pe\u0142ny panel rozlicze\u0144 nie ma bramki loading/route.');
if (caseDetail.includes('CaseSettlementPanel')) fail('CaseDetail nadal u\u017Cywa CaseSettlementPanel bezpo\u015Brednio.');
if (caseDetail.includes('../components/finance/CaseSettlementPanel')) fail('CaseDetail nadal importuje bezpo\u015Bredni CaseSettlementPanel.');
if (!caseDetail.includes('routeCaseId=')) warn('CaseDetail nie przekazuje routeCaseId do CaseSettlementSection. Wrapper nadal blokuje pusty rekord, ale s\u0142abiej chroni przed starym rekordem przy zmianie route.');

if (!section.includes('data-cf-case-finance-section="case-detail-only"')) fail('CaseSettlementSection nie ma znacznika case-detail-only.');
if (!section.includes('!recordId')) fail('CaseSettlementSection nie blokuje pustego record.id.');
if (!section.includes('expectedRouteId && expectedRouteId !== recordId')) fail('CaseSettlementSection nie blokuje rozjazdu routeCaseId vs record.id.');
if (!panel.includes('FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1')) fail('CaseSettlementPanel utraci\u0142 FIN-5 guard.');

for (const pair of [
  ['src/pages/ClientDetail.tsx', clientDetail],
  ['src/pages/LeadDetail.tsx', leadDetail],
]) {
  const rel = pair[0];
  const content = pair[1];
  if (/CaseSettlement(?:Panel|Section)/.test(content)) {
    fail(rel + ' importuje albo renderuje pe\u0142ny panel rozliczenia sprawy. Klient/lead mog\u0105 mie\u0107 tylko skr\u00F3t, nie edycj\u0119 p\u0142atno\u015Bci sprawy.');
  }
  const actionHits = fullFinanceActionCopy.filter((copy) => content.includes(copy));
  const metricHits = fullFinanceMetricCopy.filter((copy) => content.includes(copy));
  if (actionHits.length >= 2) {
    fail(rel + ' zawiera kilka pe\u0142nych akcji finansowych sprawy: ' + actionHits.join(', ') + '.');
  }
  if (metricHits.length >= 3) {
    fail(rel + ' wygl\u0105da jak pe\u0142ny panel rozliczenia sprawy, bo zawiera metryki: ' + metricHits.join(', ') + '.');
  }
}

if (!clientDetail.includes('ClientFinanceRelationSummary')) {
  warn('ClientDetail nie u\u017Cywa ClientFinanceRelationSummary. To mo\u017Ce by\u0107 OK, ale klient powinien mie\u0107 najwy\u017Cej skr\u00F3t relacji finansowych, nie pe\u0142ny panel.');
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
