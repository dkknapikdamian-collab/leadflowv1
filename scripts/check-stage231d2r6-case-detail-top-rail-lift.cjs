const fs = require('fs');
const path = require('path');

const root = process.cwd();
const errors = [];
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}
function must(text, token, label) {
  if (!text.includes(token)) errors.push(label + ': missing token "' + token + '"');
}
function mustNotExist(rel) {
  if (fs.existsSync(path.join(root, rel))) errors.push('forbidden file still exists: ' + rel);
}

const stage = 'STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT';
const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/case-detail-stage228r9-shell-rail-lift.css');
const pkg = JSON.parse(read('package.json') || '{}');

must(caseDetail, stage, 'CaseDetail marker');
must(caseDetail, 'data-stage231d2-r6-top-strip-left-card="true"', 'CaseDetail header attr');
must(caseDetail, 'data-stage231d2-r6-side-rail-top-lift="true"', 'CaseDetail shell attr');
must(caseDetail, 'caseCostsSummaryStage231D2', 'D2 cost summary still present');
must(css, stage, 'CSS marker');
must(css, 'max-width: calc(100% - 342px)', 'CSS shortened top card');
must(css, 'width: calc(100% - 342px)', 'CSS top card width');
must(css, 'margin-top: -96px', 'CSS right rail top lift');
must(css, '.case-detail-right-rail', 'CSS rail selector');
must(css, '@media (max-width: 1220px)', 'CSS responsive reset');
must(JSON.stringify(pkg.scripts || {}), 'check:stage231d2r6-case-detail-top-rail-lift', 'package check script');
must(JSON.stringify(pkg.scripts || {}), 'test:stage231d2r6-case-detail-top-rail-lift', 'package test script');
mustNotExist('api/case-costs.ts');

if (errors.length) {
  console.error('STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT: PASS');
