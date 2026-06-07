const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
function between(text, start, end) { const a = text.indexOf(start); const b = text.indexOf(end); return a >= 0 && b > a ? text.slice(a, b + end.length) : ''; }
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
contains(lead, 'STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX', 'F4 legacy marker kept');
contains(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW', 'F5 no-scroll successor marker');
contains(strip, 'data-stage227f4-case-vst-tabs-source="case-detail-stage220a10-tabs"', 'case tabs source marker');
contains(strip, 'case-detail-stage220a10-tabs-wrap', 'uses CaseDetail tabs wrap class');
contains(strip, 'case-detail-tabs case-detail-stage220a10-tabs', 'uses CaseDetail tabs list class');
contains(strip, '<button', 'top strip uses buttons');
contains(strip, 'data-stage227f5-no-scroll-row="true"', 'no-scroll successor marker');
notContains(strip, 'scrollIntoView', 'F4/F5 top strip scrollIntoView');
notContains(strip, 'href="#lead-actions"', 'old hash link to actions');
notContains(strip, 'href="#lead-activity-history"', 'old hash link to history');
contains(strip, 'data-stage227f3-lead-top-card="actions"', 'actions card marker kept');
contains(strip, 'data-stage227f3-lead-top-card="blockers"', 'blockers card marker kept');
contains(strip, 'data-stage227f3-lead-top-card="history"', 'history card marker kept');
contains(css, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'CSS F5 marker');
contains(css, '.lead-detail-stage227f5-top-strip.case-detail-stage220a10-tabs-wrap', 'CSS F5 tabs wrap selector');
contains(css, '.lead-detail-stage227f5-top-pill.case-detail-tab-active', 'CSS F5 tab selector');
contains(pkg, 'check:stage227f4-lead-top-strip-case-vst-scroll-fix', 'package check script');
contains(pkg, 'test:stage227f4-lead-top-strip-case-vst-scroll-fix', 'package test script');
if (failures) { console.error('\nStage227F4 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX');
