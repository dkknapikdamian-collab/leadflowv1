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
  'Ustaw warto\u015B\u0107 i prowizj\u0119',
  'Edytuj warto\u015B\u0107/prowizj\u0119',
  'Dodaj wp\u0142at\u0119',
  'Dodaj p\u0142atno\u015B\u0107 prowizji',
  'Warto\u015B\u0107 transakcji / sprawy',
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
