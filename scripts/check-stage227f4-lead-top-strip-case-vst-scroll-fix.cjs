const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
if (lead.includes('STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH')) {
  contains(lead, 'data-stage227f6-lead-top-strip-removed="true"', 'F6 successor removes top strip');
  notContains(lead, 'lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap', 'F6 removes F4/F5 runtime strip');
  notContains(lead, 'href="#lead-actions"', 'old hash link to actions removed');
  notContains(lead, 'href="#lead-activity-history"', 'old hash link to history removed');
  if (lead.includes('lead-detail-stage227f5-top-strip') || lead.includes('data-stage227f5-button-action')) {
  notContains(lead, 'scrollIntoView', 'top strip scrollIntoView removed');
} else {
  pass('top strip scrollIntoView removed by strip removal');
}
  contains(css, 'STAGE227F6_LEAD_TOP_STRIP_REMOVED_START', 'CSS F6 removal marker');
} else {
  contains(lead, 'STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX', 'F4 legacy marker kept');
  contains(lead, 'data-stage227f4-case-vst-tabs-source="case-detail-stage220a10-tabs"', 'case tabs source marker');
  contains(lead, 'case-detail-stage220a10-tabs-wrap', 'uses CaseDetail tabs wrap class');
  contains(lead, 'case-detail-tabs', 'uses CaseDetail tabs list class');
}
contains(lead, 'data-stage227e2-next-step-card="true"', 'actions card marker kept');
contains(lead, 'data-stage227e3-blocker-card="true"', 'blockers card marker kept');
contains(lead, 'id="lead-activity-history"', 'history source remains');
contains(pkg, 'check:stage227f4-lead-top-strip-case-vst-scroll-fix', 'package check script');
contains(pkg, 'test:stage227f4-lead-top-strip-case-vst-scroll-fix', 'package test script');
if (failures) { console.error('\nStage227F4 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX');
