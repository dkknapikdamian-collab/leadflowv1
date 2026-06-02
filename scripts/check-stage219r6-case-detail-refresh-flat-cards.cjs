const fs = require('fs');

function read(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

const context = read('src/components/ContextActionDialogs.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-detail-view-source-truth-stage219.css');

const checks = [
  [context.includes('STAGE219R6_CONTEXT_ACTION_SAVED_EVENT'), 'ContextActionDialogs missing Stage219-R6 saved event marker'],
  [context.includes("closeflow:context-action-saved"), 'ContextActionDialogs missing saved event name'],
  [context.includes("onSaved={() => notifySaved('event')}"), 'Event dialog does not emit saved event'],
  [context.includes("onSaved={() => notifySaved('task')}"), 'Task dialog does not emit saved event'],
  [context.includes("onSaved={() => notifySaved('note')}"), 'Note dialog does not emit saved event'],
  [caseDetail.includes('STAGE219R6_CASE_DETAIL_REFRESH_AFTER_CONTEXT_SAVE'), 'CaseDetail missing refresh after shared save marker'],
  [caseDetail.includes("window.addEventListener('closeflow:context-action-saved'"), 'CaseDetail missing saved event listener'],
  [caseDetail.includes('void refreshCaseData();'), 'CaseDetail missing refresh call in listener'],
  [css.includes('STAGE219_R6_CASE_DETAIL_REFRESH_AND_FLAT_CARDS'), 'CSS missing Stage219-R6 marker'],
  [css.includes('white-space: nowrap !important;'), 'CSS missing one-line title rule'],
  [css.includes('display: none !important;') && css.includes('content: none !important;'), 'CSS missing hidden helper copy rule'],
  [css.includes('min-height: 56px !important;'), 'CSS missing flattened card height'],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failed.length) {
  console.error(failed.join('\n'));
  process.exit(1);
}

console.log('OK Stage219-R6 case detail refresh + flat cards guard passed');
