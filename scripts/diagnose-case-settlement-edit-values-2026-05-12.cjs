const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/components/finance/CaseSettlementPanel.tsx',
  'src/components/finance/CaseSettlementSection.tsx',
  'src/components/finance/FinanceMiniSummary.tsx',
  'src/components/finance/PaymentList.tsx',
];
const terms = [
  'CaseSettlementPanel',
  'CaseSettlementSection',
  'Ustaw wartość i prowizję',
  'Edytuj wartość/prowizję',
  'Dodaj wpłatę',
  'Dodaj płatność prowizji',
  'Wartość transakcji / sprawy',
  'onEditCommission',
  'onAddPayment',
  'contractValue',
  'expectedRevenue',
  'commissionRate',
  'commissionAmount',
];

const report = [];
for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    report.push({ file: rel, missing: true });
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  const hits = {};
  for (const term of terms) hits[term] = (source.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  report.push({ file: rel, hits });
}

console.log(JSON.stringify(report, null, 2));
