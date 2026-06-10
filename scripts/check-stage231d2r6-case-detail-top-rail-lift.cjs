const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const errors = [];

function has(file, token) {
  return read(file).includes(token);
}
function must(file, token, label = token) {
  if (!has(file, token)) errors.push(file + ': missing token "' + label + '"');
}

const caseDetailFile = 'src/pages/CaseDetail.tsx';
const cssFile = 'src/styles/case-detail-stage228r9-shell-rail-lift.css';
const caseDetail = read(caseDetailFile);
const css = read(cssFile);

const r6LayoutPresent = caseDetail.includes('data-stage231d2-r6-top-strip-left-card="true"');
const r7SupersedesR6 = caseDetail.includes('data-stage231d2-r7-side-meta-card="true"') && caseDetail.includes('data-stage231d2-r7-side-meta-layout="true"');

if (!r6LayoutPresent && !r7SupersedesR6) {
  errors.push('CaseDetail layout: missing R6 top-strip marker and missing R7 side-meta supersession marker');
}

if (r7SupersedesR6) {
  must(caseDetailFile, 'data-stage231d2-r7-side-meta-card="true"', 'R7 side meta card');
  must(caseDetailFile, 'data-stage231d2-r7-side-meta-layout="true"', 'R7 side meta layout');
  must(caseDetailFile, 'case-detail-meta-card-stage231d2r7', 'R7 meta card class');
  must(caseDetailFile, 'case-detail-stage231d2r7-main-split', 'R7 narrowed main split class');
  must(caseDetailFile, '<aside className="case-detail-right-rail" aria-label="Panel sprawy">', 'right rail aside still present');
  must(cssFile, 'STAGE231D2_R7_CASE_DETAIL_SIDE_META_QUICK_ACTIONS_LAYOUT', 'R7 CSS supersedes R6');
  must(cssFile, 'grid-template-columns: minmax(0, 1fr) 340px', 'R7 desktop rail width');
} else {
  must(caseDetailFile, 'data-stage231d2-r6-top-strip-left-card="true"', 'R6 top strip left card');
  must(caseDetailFile, 'data-stage231d2-r6-side-rail-top-lift="true"', 'R6 side rail top lift');
  must(cssFile, 'STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT', 'R6 CSS marker');
}

if (caseDetail.includes('caseCostsSummaryStage231D2 is not defined')) {
  errors.push('CaseDetail contains crash text instead of the render fix');
}

if (errors.length) {
  console.error('STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT_COMPAT: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT_COMPAT: PASS');
