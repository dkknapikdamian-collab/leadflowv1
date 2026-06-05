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

must(caseDetail.includes('data-stage220a3-header-title="true"'), 'CaseDetail missing Stage220A3 composed title marker');
must(caseDetail.includes('case-detail-header-client-name'), 'CaseDetail missing client name span');
must(caseDetail.includes('case-detail-header-separator'), 'CaseDetail missing separator span');
must(caseDetail.includes('case-detail-header-case-name'), 'CaseDetail missing case name span');

must(css.includes('STAGE220A5_CASE_HEADER_CLIENT_LIKE'), 'CSS missing Stage220A5 marker');
must(css.includes('content: "KARTOTEKA SPRAWY"'), 'CSS missing case header eyebrow');
must(css.includes('grid-template-columns: auto minmax(0, 1fr)'), 'CSS missing client-like back-button + title grid');
must(css.includes('grid-column: 1'), 'CSS missing header copy left placement');
must(css.includes('grid-column: 2'), 'CSS missing delete action right placement');
must(css.includes('min-height: 78px'), 'CSS missing compact client-like header height');
must(css.includes('max-width: 360px'), 'CSS missing wider client label');
must(css.includes('margin: 0 8px'), 'CSS missing stable separator spacing');
must(css.includes('text-overflow: ellipsis'), 'CSS missing ellipsis protection');
must(css.includes('white-space: nowrap'), 'CSS missing nowrap protection');

if (errors.length) {
  console.error('Stage220A5 guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A5 case header client-like guard passed');
