const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
const hasF6 = lead.includes('STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH');
contains(lead, 'id="lead-activity-history"', 'left history has anchor id');
contains(lead, 'data-stage227f3-left-history-source="true"', 'left history has source marker');
contains(lead, 'data-stage227f3-center-history-removed="true"', 'center history removed marker');
notContains(lead, 'lead-detail-activity-history-section', 'center activity history runtime section removed');
contains(lead, 'data-stage227f3-notes-own-anchor="true"', 'notes own anchor remains');
contains(lead, 'data-stage227f3-lead-actions-anchor="true"', 'work center anchor remains');
contains(lead, 'data-stage227f3-lead-actions-source="true"', 'work center source marker remains');
if (hasF6) {
  contains(lead, 'data-stage227f6-lead-top-strip-removed="true"', 'F6 successor removes top strip');
  notContains(lead, 'data-stage227f3-lead-top-strip="true"', 'F6 removes old F3 top strip runtime');
  notContains(lead, 'lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap', 'F6 removes old F5 top strip runtime');
} else {
  contains(lead, 'data-stage227f3-lead-top-strip="true"', 'top strip exists');
  contains(lead, 'data-stage227f3-lead-top-card="actions"', 'top card actions marker');
  contains(lead, 'data-stage227f3-lead-top-card="blockers"', 'top card blockers marker');
  contains(lead, 'data-stage227f3-lead-top-card="history"', 'top card history marker');
}
contains(lead, 'window.history.replaceState', 'legacy hash cleanup remains');
notContains(lead, '!leadInService ? (\n            ) : null', 'empty leadInService ternary removed');
contains(leadCss, 'STAGE227F6_LEAD_TOP_STRIP_REMOVED_START', 'lead CSS F6 removal marker');
if (unifiedCss.includes('STAGE227F2_SHARED_DETAIL_SHELL_AND_CLIENT_CASE_WIDTH_POLISH_START') || unifiedCss.includes('STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT')) pass('unified CSS shared width marker'); else fail('missing unified CSS shared width marker');
if (unifiedCss.includes('.case-detail-card-page-header') || unifiedCss.includes('.case-detail-header')) pass('unified CSS case header selector'); else fail('missing unified CSS case header selector');
contains(unifiedCss, '.case-detail-stage220a10-tabs-wrap', 'case tabs wrap included in width/visual contract');
if (caseCss.includes('STAGE227F2R1') || caseCss.includes('case-detail-card-page-header') || unifiedCss.includes('.case-detail-header')) pass('case CSS full width contract'); else fail('missing case CSS full width contract');
contains(pkg, 'check:stage227f3-lead-history-top-strip-case-header-width', 'package check script');
contains(pkg, 'test:stage227f3-lead-history-top-strip-case-header-width', 'package test script');
if (failures) { console.error('\nStage227F3 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH');
