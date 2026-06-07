const fs = require('fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

let failures = 0;

function pass(label) {
  console.log('PASS ' + label);
}

function fail(label) {
  failures += 1;
  console.error('FAIL STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX: missing: ' + label);
}

function has(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail(label + ' [' + needle + ']');
}

function lacks(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else {
    failures += 1;
    console.error('FAIL STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX: still contains: ' + label + ' [' + needle + ']');
  }
}

has(lead, 'STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX', 'runtime marker');
has(lead, 'data-stage227f4-case-vst-tabs-source="case-detail-stage220a10-tabs"', 'case tabs source marker');
has(lead, 'className="lead-detail-stage227f3-top-strip case-detail-stage220a10-tabs-wrap"', 'uses CaseDetail tabs wrap class');
has(lead, 'className="case-detail-tabs case-detail-stage220a10-tabs lead-detail-stage227f4-tabs"', 'uses CaseDetail tabs list class');
has(lead, '<button', 'top strip uses buttons');
has(lead, 'data-stage227f4-no-hash-scroll="true"', 'no hash scroll marker');
has(lead, 'data-stage227f3-lead-top-card="actions"', 'actions card marker kept');
has(lead, 'data-stage227f3-lead-top-card="blockers"', 'blockers card marker kept');
has(lead, 'data-stage227f3-lead-top-card="history"', 'history card marker kept');
lacks(lead, 'href="#lead-actions"', 'old hash link to actions removed');
lacks(lead, 'href="#lead-activity-history"', 'old hash link to history removed');
has(lead, "document.getElementById('lead-actions')?.scrollIntoView", 'actions scroll target remains');
has(lead, "document.getElementById('lead-activity-history')?.scrollIntoView", 'history scroll target remains');

has(css, 'STAGE227F4R4_CASE_VST_MARKER_CSS_GUARD_FIX', 'CSS marker');
has(css, '.lead-detail-stage227f3-top-strip.case-detail-stage220a10-tabs-wrap', 'CSS tabs wrap selector');
has(css, '.lead-detail-stage227f3-top-card.case-detail-tab-active', 'CSS tab selector');
has(css, 'scroll-margin-top: 96px', 'scroll margin target');

if (pkg.scripts && pkg.scripts['check:stage227f4-lead-top-strip-case-vst-scroll-fix']) pass('package check script');
else fail('package check script');

if (pkg.scripts && pkg.scripts['test:stage227f4-lead-top-strip-case-vst-scroll-fix']) pass('package test script');
else fail('package test script');

if (failures > 0) {
  console.error('');
  console.error('Stage227F4 guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX');
