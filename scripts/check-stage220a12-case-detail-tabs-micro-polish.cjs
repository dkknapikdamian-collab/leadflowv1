const fs = require('fs');

function fail(message) {
  console.error('STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

const caseText = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const cssText = fs.readFileSync('src/styles/closeflow-case-detail-stage220a10-tabs-layout-repair.css', 'utf8');

if (!caseText.includes('STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH')) {
  fail('Stage220A12 marker missing in CaseDetail.tsx');
}

if (!caseText.includes('data-stage220a12-history-heading-only="true"')) {
  fail('History heading-only marker missing');
}

if (caseText.includes('<p className="case-detail-eyebrow">Historia sprawy</p>')) {
  fail('History eyebrow still visible in JSX');
}

if (caseText.includes('Jedna oś: notatki')) {
  fail('History description still visible in JSX');
}

if (!cssText.includes('STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH')) {
  fail('Stage220A12 CSS marker missing');
}

if (!cssText.includes('width: 17px !important') || !cssText.includes('margin-left: 2px !important')) {
  fail('Expected icon size or tiny label spacing missing');
}

console.log('STAGE220A12_CASE_DETAIL_TABS_MICRO_POLISH_GUARD: OK');
