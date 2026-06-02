const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
let ok = true;
function must(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) {
    console.error(label);
    ok = false;
  }
}

must('src/components/ContextActionDialogs.tsx', 'STAGE219_R7_CONTEXT_ACTION_SAVED_EVENT', 'ContextActionDialogs missing R7 marker');
must('src/components/ContextActionDialogs.tsx', "CONTEXT_ACTION_SAVED_EVENT = 'closeflow:context-action-saved'", 'ContextActionDialogs missing saved event const');
must('src/components/ContextActionDialogs.tsx', 'notifySavedStage219R7', 'ContextActionDialogs missing notify function');
must('src/components/ContextActionDialogs.tsx', "onSaved={() => notifySavedStage219R7('task')}", 'Task dialog not wired to saved event');
must('src/components/ContextActionDialogs.tsx', "onSaved={() => notifySavedStage219R7('event')}", 'Event dialog not wired to saved event');
must('src/components/ContextActionDialogs.tsx', "onSaved={() => notifySavedStage219R7('note')}", 'Note dialog not wired to saved event');

must('src/pages/CaseDetail.tsx', 'CONTEXT_ACTION_SAVED_EVENT', 'CaseDetail missing saved event import/listener');
must('src/pages/CaseDetail.tsx', 'STAGE219_R7_CASE_DETAIL_REFRESH_AFTER_SHARED_QUICK_ACTION', 'CaseDetail missing R7 refresh marker');
must('src/pages/CaseDetail.tsx', 'data-stage219-r7-recent-actions="true"', 'CaseDetail missing recent actions block');

must('src/styles/closeflow-detail-view-source-truth-stage219.css', 'STAGE219_R7_CASE_DETAIL_REAL_REFRESH_FLATTEN', 'CSS missing R7 marker');
must('src/styles/closeflow-detail-view-source-truth-stage219.css', 'white-space: nowrap !important', 'CSS missing one-line title rule');
must('src/styles/closeflow-detail-view-source-truth-stage219.css', 'min-height: 58px !important', 'CSS missing flat card height');
must('src/styles/closeflow-detail-view-source-truth-stage219.css', '.stage219-r7-case-recent-actions', 'CSS missing recent actions styles');

if (!ok) process.exit(1);
console.log('OK Stage219-R7 real refresh + flat cards guard passed');
