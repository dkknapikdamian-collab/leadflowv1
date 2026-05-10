const fs = require('fs');
const path = require('path');

const root = process.cwd();
const keyFiles = [
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/components/ui-system/screen-slots.ts',
  'docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md',
];

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) {
  console.error('CLOSEFLOW_NO_LOCAL_FINANCE_PANELS_VS9_FAIL');
  console.error(message);
  process.exit(1);
}

for (const file of keyFiles) if (!exists(file)) fail(`Missing file: ${file}`);

const slots = read('src/components/ui-system/screen-slots.ts');
if (!slots.includes('detail.financePanel')) fail('screen-slots.ts missing detail.financePanel');
if (!slots.includes('financePanel')) fail('screen-slots.ts missing financePanel marker');

const doc = read('docs/ui/CLOSEFLOW_VISUAL_SYSTEM_RELEASE_EVIDENCE_2026-05-09.md');
if (!doc.includes('detail.financePanel')) fail('release evidence missing detail.financePanel evidence');
if (!doc.includes('no local finance panels')) fail('release evidence missing no local finance panels rule');

const forbiddenNewFinanceShells = [
  'localFinancePanel',
  'LocalFinancePanel',
  'financePanelLocal',
  'cf-local-finance-panel',
  'closeflow-local-finance-panel',
];
const failures = [];
for (const file of keyFiles.filter((file) => file.endsWith('.tsx'))) {
  const text = read(file);
  for (const needle of forbiddenNewFinanceShells) {
    if (text.includes(needle) && !text.includes('@closeflow-allow-local-finance-panel')) {
      failures.push(`${file}: forbidden local finance shell marker ${needle}`);
    }
  }
}

if (failures.length) {
  console.error('CLOSEFLOW_NO_LOCAL_FINANCE_PANELS_VS9_FAIL');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('CLOSEFLOW_NO_LOCAL_FINANCE_PANELS_VS9_OK');
console.log('slot=detail.financePanel');
console.log('contract=no local finance panels');
