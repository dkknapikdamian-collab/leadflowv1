const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function exists(file) { return fs.existsSync(path.join(root, file)); }
function fail(message) { console.error(message); process.exit(1); }

const caseDetail = read('src/pages/CaseDetail.tsx');
const quick = exists('src/components/CaseQuickActions.tsx') ? read('src/components/CaseQuickActions.tsx') : '';
const dialog = exists('src/components/AddCaseMissingItemDialog.tsx') ? read('src/components/AddCaseMissingItemDialog.tsx') : '';
const pkg = JSON.parse(read('package.json'));

if (!exists('src/components/CaseQuickActions.tsx')) fail('Brak src/components/CaseQuickActions.tsx');
if (!exists('src/components/AddCaseMissingItemDialog.tsx')) fail('Brak src/components/AddCaseMissingItemDialog.tsx');
if (!caseDetail.includes('CaseQuickActions')) fail('CaseDetail.tsx nie renderuje CaseQuickActions');
if (!caseDetail.includes('data-case-quick-actions-anchor="case-detail"')) fail('Brak stabilnego anchora CaseQuickActions w CaseDetail');
if (caseDetail.includes('data-case-create-actions-panel="true"')) fail('Stary data-case-create-actions-panel nadal renderuje się w CaseDetail');
if (caseDetail.includes('case-detail-create-action-card')) fail('Stara klasa case-detail-create-action-card nadal jest w CaseDetail');
for (const label of ['Dodaj notatkę', 'Dodaj zadanie', 'Dodaj wydarzenie', 'Dodaj brak', 'Dodaj wpłatę']) {
  if (!quick.includes(label)) fail(`CaseQuickActions nie zawiera etykiety: ${label}`);
}
if (!quick.includes('openContextQuickAction')) fail('CaseQuickActions nie używa wspólnego hosta akcji dla notatki/zadania/wydarzenia');
if (!dialog.includes('insertCaseItemToSupabase')) fail('AddCaseMissingItemDialog nie tworzy case item');
if (!dialog.includes('insertActivityToSupabase')) fail('AddCaseMissingItemDialog nie loguje aktywności');
if (!dialog.includes("eventType: 'item_added'")) fail('AddCaseMissingItemDialog nie zapisuje item_added dla roadmapy');
if (pkg.scripts?.['check:closeflow-case-quick-actions'] !== 'node scripts/check-closeflow-case-quick-actions.cjs') fail('package.json nie ma check:closeflow-case-quick-actions');
console.log('CLOSEFLOW_CASE_QUICK_ACTIONS_CHECK_OK');
