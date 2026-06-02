const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const files = {
  caseDetail: path.join(repo, 'src/pages/CaseDetail.tsx'),
  css: path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'),
};
const caseText = fs.readFileSync(files.caseDetail, 'utf8');
const css = fs.readFileSync(files.css, 'utf8');
const errors = [];
function has(text, needle, message) { if (!text.includes(needle)) errors.push(message); }

has(caseText, 'STAGE219_R10_CASE_HEADER_COMPOSED_CARD', 'CaseDetail missing Stage219-R10 marker');
has(caseText, 'getCaseHeaderClientLabel', 'CaseDetail missing client header helper');
has(caseText, 'getCaseHeaderCaseLabel', 'CaseDetail missing case header helper');
has(caseText, 'data-stage219r10-header-title="true"', 'CaseDetail missing composed title data marker');
has(caseText, 'case-detail-header-composed-title', 'CaseDetail missing composed title class');
has(caseText, 'case-detail-header-separator', 'CaseDetail missing dash separator class');
has(css, 'STAGE219_R10_CASE_HEADER_COMPOSED_CARD', 'CSS missing Stage219-R10 marker');
has(css, '.case-detail-header-composed-title', 'CSS missing composed title styles');
has(css, '.case-detail-header-client-name', 'CSS missing client title styles');
has(css, '.case-detail-header-case-name', 'CSS missing case title styles');
has(css, 'min-height: 66px', 'CSS missing compact header height');
has(css, 'white-space: nowrap', 'CSS missing one-line header rule');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('OK Stage219-R10 case header composed card guard passed');
