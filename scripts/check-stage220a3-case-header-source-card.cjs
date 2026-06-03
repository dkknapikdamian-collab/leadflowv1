const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const caseDetailPath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css');

const caseDetail = fs.readFileSync(caseDetailPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const errors = [];

function must(condition, message) {
  if (!condition) errors.push(message);
}

function mustInclude(text, needle, message) {
  must(text.includes(needle), message);
}

function getHeaderBlock(text) {
  const start = text.indexOf('<header className="case-detail-header"');
  if (start === -1) return '';
  const end = text.indexOf('</header>', start);
  if (end === -1) return '';
  return text.slice(start, end);
}

const header = getHeaderBlock(caseDetail);

mustInclude(caseDetail, 'STAGE220A3_CASE_HEADER_SOURCE_CARD', 'CaseDetail missing STAGE220A3_CASE_HEADER_SOURCE_CARD marker');
mustInclude(caseDetail, 'getCaseHeaderClientLabel', 'CaseDetail missing getCaseHeaderClientLabel helper');
mustInclude(caseDetail, 'getCaseHeaderCaseLabel', 'CaseDetail missing getCaseHeaderCaseLabel helper');
mustInclude(caseDetail, 'data-stage220a3-header-title="true"', 'CaseDetail missing data-stage220a3-header-title marker');
mustInclude(caseDetail, 'case-detail-header-composed-title', 'CaseDetail missing composed title class');
mustInclude(caseDetail, 'case-detail-header-client-name', 'CaseDetail missing client name class');
mustInclude(caseDetail, 'case-detail-header-separator', 'CaseDetail missing separator class');
mustInclude(caseDetail, 'case-detail-header-case-name', 'CaseDetail missing case name class');

must(header.length > 0, 'CaseDetail header block not found');
must(!header.includes('case-detail-breadcrumb'), 'CaseDetail header still renders case-detail-breadcrumb');
must(!header.includes('case-detail-header-meta'), 'CaseDetail header still renders case-detail-header-meta');
must(!header.includes('case-detail-pill'), 'CaseDetail header still renders status pill');

mustInclude(css, 'STAGE220A3_CASE_HEADER_SOURCE_CARD', 'CSS missing STAGE220A3 marker');
mustInclude(css, 'white-space: nowrap', 'CSS missing white-space: nowrap');
mustInclude(css, 'text-overflow: ellipsis', 'CSS missing text-overflow: ellipsis');
must(/min-height\s*:\s*\d+px/.test(css), 'CSS missing min-height for compact header');

if (errors.length) {
  console.error('Stage220A3 guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A3 case header source card guard passed');
