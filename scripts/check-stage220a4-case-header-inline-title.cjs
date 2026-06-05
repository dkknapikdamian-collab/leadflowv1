const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const cssPath = path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css');
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');

const css = fs.readFileSync(cssPath, 'utf8');
const caseDetail = fs.readFileSync(casePath, 'utf8');
const errors = [];

function must(condition, message) {
  if (!condition) errors.push(message);
}

must(caseDetail.includes('data-stage220a3-header-title="true"'), 'CaseDetail missing composed title marker from Stage220A3');
must(caseDetail.includes('case-detail-header-composed-title'), 'CaseDetail missing composed title class');
must(caseDetail.includes('case-detail-header-client-name'), 'CaseDetail missing client name class');
must(caseDetail.includes('case-detail-header-separator'), 'CaseDetail missing separator class');
must(caseDetail.includes('case-detail-header-case-name'), 'CaseDetail missing case name class');

must(css.includes('STAGE220A4_CASE_HEADER_INLINE_TITLE'), 'CSS missing Stage220A4 marker');
must(css.includes('grid-template-columns: auto minmax(0, 1fr)'), 'CSS missing inline two-column title layout');
must(css.includes('column-gap: 22px'), 'CSS missing stronger horizontal gap after back button');
must(css.includes('min-height: 52px'), 'CSS missing lower compact header height');
must(css.includes('font-size: 14px'), 'CSS missing compact title size');
must(css.includes('max-width: 280px'), 'CSS missing less aggressive client truncation');
must(css.includes('white-space: nowrap'), 'CSS missing nowrap rule');
must(css.includes('text-overflow: ellipsis'), 'CSS missing ellipsis rule');

if (errors.length) {
  console.error('Stage220A4 guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A4 case header inline title guard passed');
