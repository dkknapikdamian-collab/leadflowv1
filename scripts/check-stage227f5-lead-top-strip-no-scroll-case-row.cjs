const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
contains(lead, 'window.history.replaceState', 'legacy hash cleanup marker');
contains(lead, '#lead-actions', 'clears legacy lead-actions hash');
contains(lead, '#lead-activity-history', 'clears legacy history hash');
contains(lead, '#lead-notes', 'clears legacy notes hash');
if (lead.includes('STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH')) {
  contains(lead, 'data-stage227f6-lead-top-strip-removed="true"', 'F6 removes top strip row');
  notContains(lead, 'lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap', 'F6 removes compact top strip runtime');
  notContains(lead, 'data-stage227f5-button-action', 'F6 removes top strip click buttons');
} else {
  contains(lead, 'data-stage227f5-no-scroll-row="true"', 'no scroll row marker');
}
if (lead.includes('lead-detail-stage227f5-top-strip') || lead.includes('data-stage227f5-button-action')) {
  notContains(lead, 'scrollIntoView', 'top strip scrollIntoView removed');
} else {
  pass('top strip scrollIntoView removed by strip removal');
}
notContains(lead, 'href="#lead-actions"', 'hash action href removed');
notContains(lead, 'href="#lead-activity-history"', 'hash history href removed');
contains(lead, 'data-stage227e2-next-step-card="true"', 'actions marker kept');
contains(lead, 'data-stage227e3-blocker-card="true"', 'blockers marker kept');
contains(lead, 'id="lead-activity-history"', 'history marker kept');
contains(css, 'STAGE227F6_LEAD_TOP_STRIP_REMOVED_START', 'CSS F6 removal marker');
contains(pkg, 'check:stage227f5-lead-top-strip-no-scroll-case-row', 'package check script');
contains(pkg, 'test:stage227f5-lead-top-strip-no-scroll-case-row', 'package test script');
if (failures) { console.error('\nStage227F5 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW');
