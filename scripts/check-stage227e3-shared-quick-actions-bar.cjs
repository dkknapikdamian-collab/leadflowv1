const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const files = {
  lead: path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx'),
  caseQuick: path.join(repoRoot, 'src', 'components', 'CaseQuickActions.tsx'),
  quickBar: path.join(repoRoot, 'src', 'components', 'detail', 'QuickActionsBar.tsx'),
  css: path.join(repoRoot, 'src', 'styles', 'closeflow-shared-quick-actions-bar-stage227e3.css'),
};
function fail(message) {
  console.error('FAIL STAGE227E3_SHARED_QUICK_ACTIONS_BAR: ' + message);
  process.exit(1);
}
function pass(message) { console.log('PASS ' + message); }
function read(filePath) {
  if (!fs.existsSync(filePath)) fail('missing file: ' + path.relative(repoRoot, filePath));
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}
function requireContains(source, token, label) {
  if (!source.includes(token)) fail('missing: ' + label);
  pass('contains ' + label);
}

const lead = read(files.lead);
const caseQuick = read(files.caseQuick);
const quickBar = read(files.quickBar);
const css = read(files.css);

requireContains(quickBar, 'STAGE227E3_SHARED_QUICK_ACTIONS_BAR', 'QuickActionsBar stage marker');
requireContains(quickBar, 'export type QuickActionItem', 'QuickActionItem type');
requireContains(quickBar, 'actions:', 'actions prop');
requireContains(quickBar, 'cf-shared-quick-actions-bar', 'shared bar class');
requireContains(css, 'cf-shared-quick-actions-bar', 'shared css root');
requireContains(css, 'cf-shared-quick-actions-bar__grid', 'shared css grid');
requireContains(css, 'cf-shared-quick-actions-bar__button', 'shared css button');

requireContains(caseQuick, "import QuickActionsBar from './detail/QuickActionsBar';", 'CaseQuickActions QuickActionsBar import');
requireContains(caseQuick, '<QuickActionsBar', 'CaseQuickActions renders QuickActionsBar');
requireContains(caseQuick, "label: 'Notatka'", 'case Notatka action');
requireContains(caseQuick, "label: 'Zadanie'", 'case Zadanie action');
requireContains(caseQuick, "label: 'Wydarzenie'", 'case Wydarzenie action');
requireContains(caseQuick, "label: 'Brak'", 'case Brak action');
if (caseQuick.includes('case-quick-actions__grid') || caseQuick.includes('function actionButtonClassName(')) {
  fail('CaseQuickActions still contains local grid/button class builder');
}
if (/[Ă„Ă…ĂĂ‚]|[â”Ľâ”€]/.test(caseQuick)) fail('CaseQuickActions contains mojibake markers');
pass('CaseQuickActions no longer has local grid or mojibake');

requireContains(lead, "import QuickActionsBar from '../components/detail/QuickActionsBar';", 'LeadDetail QuickActionsBar import');
requireContains(lead, "import '../styles/closeflow-shared-quick-actions-bar-stage227e3.css';", 'LeadDetail shared css import');
requireContains(lead, 'STAGE227E3_SHARED_QUICK_ACTIONS_BAR_LEAD', 'LeadDetail E3 marker');
requireContains(lead, '<QuickActionsBar', 'LeadDetail renders QuickActionsBar');
requireContains(lead, "recordType=\"lead\"", 'LeadDetail lead record type');
for (const label of ['Notatka', 'Zadanie', 'Wydarzenie', 'Brak', 'Oznacz utracony']) {
  requireContains(lead, label, 'lead action label: ' + label);
}
requireContains(lead, 'Rozpocznij obs\u0142ug\u0119', 'lead action label: Rozpocznij obsĹ‚ugÄ™');

console.log('PASS STAGE227E3_SHARED_QUICK_ACTIONS_BAR');