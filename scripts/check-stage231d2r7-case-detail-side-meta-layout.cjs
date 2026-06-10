const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const errors = [];

function must(file, token, label = token) {
  if (!read(file).includes(token)) errors.push(file + ': missing ' + label);
}
function mustNot(file, token, label = token) {
  if (read(file).includes(token)) errors.push(file + ': forbidden ' + label);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/case-detail-stage228r9-shell-rail-lift.css');

console.log('STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT: start');

must('src/pages/CaseDetail.tsx', 'STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT');
must('src/pages/CaseDetail.tsx', 'data-stage231d2-r7-side-meta-layout="true"');
must('src/pages/CaseDetail.tsx', 'case-detail-stage231d2r7-main-split');
must('src/pages/CaseDetail.tsx', 'data-stage231d2-r7-side-meta-card="true"');
must('src/pages/CaseDetail.tsx', 'case-detail-meta-card-stage231d2r7__actions');
must('src/pages/CaseDetail.tsx', 'data-case-quick-actions-anchor="case-detail"');
mustNot('src/pages/CaseDetail.tsx', '<header className="case-detail-header client-detail-header"', 'old full-width top header');

const metaIndex = caseDetail.indexOf('data-stage231d2-r7-side-meta-card="true"');
const quickIndex = caseDetail.indexOf('data-case-quick-actions-anchor="case-detail"');
if (metaIndex === -1 || quickIndex === -1 || metaIndex > quickIndex) {
  errors.push('CaseDetail: side meta card must be before quick actions in right rail');
}

must('src/styles/case-detail-stage228r9-shell-rail-lift.css', 'STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT');
must('src/styles/case-detail-stage228r9-shell-rail-lift.css', 'grid-template-columns: minmax(0, 1fr) 340px');
must('src/styles/case-detail-stage228r9-shell-rail-lift.css', '.case-detail-meta-card-stage231d2r7');
must('src/styles/case-detail-stage228r9-shell-rail-lift.css', 'grid-template-columns: 1fr !important;');

if (errors.length) {
  console.error('STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT: PASS');
