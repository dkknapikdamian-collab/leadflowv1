const fs = require('fs');

const quick = fs.readFileSync('src/components/detail/QuickActionsBar.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const caseQuick = fs.readFileSync('src/components/CaseQuickActions.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-shared-quick-actions-bar-stage227e3.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH: ${message}`);
  process.exit(1);
}

function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail(`missing: ${label}`);
  pass(`contains: ${label}`);
}

function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail(`forbidden: ${label}`);
  pass(`not contains: ${label}`);
}

mustContain(quick, 'STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH', 'QuickActionsBar E4 marker');
mustContain(quick, 'data-stage227e4-quick-actions-source-of-truth="true"', 'QuickActionsBar E4 data marker');
mustContain(quick, "recordType: 'lead' | 'case'", 'record type contract');
mustContain(quick, 'actions: QuickActionsBarAction[]', 'actions prop contract');
mustContain(quick, 'cf-shared-quick-actions-bar', 'shared quick actions root class');
mustContain(quick, 'cf-shared-quick-actions-bar__button', 'shared quick actions button class');
mustContain(quick, 'data-stage227e3-action-key={action.key}', 'stable action key marker');

mustContain(css, 'cf-shared-quick-actions-bar', 'shared css root');
mustContain(css, 'cf-shared-quick-actions-bar__grid', 'shared css grid');
mustContain(css, 'cf-shared-quick-actions-bar__button', 'shared css button');
for (const tone of ['note', 'task', 'event', 'missing', 'lost', 'service', 'payment']) {
  mustContain(css, `cf-shared-quick-actions-bar__button--${tone}`, `shared tone css: ${tone}`);
}

mustContain(caseQuick, "import QuickActionsBar from './detail/QuickActionsBar'", 'CaseQuickActions imports shared bar');
mustContain(caseQuick, '<QuickActionsBar', 'CaseQuickActions renders shared bar');
mustContain(caseQuick, 'recordType="case"', 'CaseQuickActions uses case recordType');
mustContain(caseQuick, 'dataStage="stage227e3-case-quick-actions-bar"', 'case dataStage remains');
for (const key of ["key: 'note'", "key: 'task'", "key: 'event'", "key: 'missing'", "key: 'payment'"]) {
  mustContain(caseQuick, key, `case action ${key}`);
}

mustContain(lead, "import QuickActionsBar from '../components/detail/QuickActionsBar'", 'LeadDetail imports shared bar');
mustContain(lead, "import '../styles/closeflow-shared-quick-actions-bar-stage227e3.css'", 'LeadDetail imports shared css');
mustContain(lead, '<QuickActionsBar', 'LeadDetail renders shared bar');
mustContain(lead, 'recordType="lead"', 'LeadDetail uses lead recordType');
mustContain(lead, 'dataStage="stage227e3-lead-quick-actions-bar"', 'lead dataStage remains');
for (const key of ["key: 'note'", "key: 'task'", "key: 'event'", "key: 'missing'", "key: 'lost'", "key: 'service'"]) {
  mustContain(lead, key, `lead action ${key}`);
}

mustNotContain(caseQuick, 'case-quick-actions-grid', 'case local action grid');
mustNotContain(lead, 'lead-detail-local-quick-actions-grid', 'lead local action grid');

mustContain(pkg, 'check:stage227e4-quick-actions-source-of-truth', 'package check script');
mustContain(pkg, 'test:stage227e4-quick-actions-source-of-truth', 'package test script');

console.log('PASS STAGE227E4_QUICK_ACTIONS_SOURCE_OF_TRUTH');