const fs = require('fs');
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW: ' + label); }
function contains(haystack, needle, label) { if (String(haystack).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(haystack, needle, label) { if (!String(haystack).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }
function between(text, start, end) { const a = text.indexOf(start); const b = text.indexOf(end); return a >= 0 && b > a ? text.slice(a, b + end.length) : ''; }
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');
const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
const cssBlock = between(css, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
contains(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW', 'runtime marker');
contains(lead, 'STAGE227F5_CLEAR_LEGACY_HASH', 'legacy hash cleanup marker');
contains(lead, "'#lead-actions'", 'clears legacy lead-actions hash');
contains(lead, "'#lead-activity-history'", 'clears legacy history hash');
contains(lead, "'#lead-notes'", 'clears legacy notes hash');
contains(lead, 'window.history.replaceState', 'cleans hash without reload');
contains(lead, "window.scrollTo({ top: 0, behavior: 'auto' })", 'resets clipped scroll state');
contains(strip, 'case-detail-stage220a10-tabs-wrap', 'uses CaseDetail tabs wrap class');
contains(strip, 'case-detail-tabs case-detail-stage220a10-tabs', 'uses CaseDetail tabs list class');
contains(strip, 'data-stage227f5-no-scroll-row="true"', 'no scroll row marker');
contains(strip, "setLeadActionOpenGroup('next')", 'actions button opens actions group');
contains(strip, "setLeadActionOpenGroup('blockers')", 'blockers button opens blockers group');
contains(strip, 'data-stage227f5-history-static="true"', 'history button is static');
contains(strip, 'data-stage227f3-lead-top-card="actions"', 'actions marker kept');
contains(strip, 'data-stage227f3-lead-top-card="blockers"', 'blockers marker kept');
contains(strip, 'data-stage227f3-lead-top-card="history"', 'history marker kept');
notContains(strip, 'scrollIntoView', 'top strip scrollIntoView');
notContains(strip, 'document.getElementById', 'top strip DOM scroll targeting');
notContains(strip, 'href="#lead-actions"', 'hash action href');
notContains(strip, 'href="#lead-activity-history"', 'hash history href');
if (lead.indexOf('STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START') < lead.indexOf('<div className="lead-detail-shell">')) pass('top strip sits before lead detail shell'); else fail('top strip is still inside shell/main column');
contains(cssBlock, '.lead-detail-stage227f5-top-strip.case-detail-stage220a10-tabs-wrap', 'F5 tabs wrap selector');
contains(cssBlock, 'display: inline-flex', 'F5 uses compact inline row');
contains(cssBlock, '.lead-detail-stage227f5-top-pill.case-detail-tab-active', 'F5 top pill selector');
notContains(cssBlock, 'grid-template-columns: repeat(3', 'F5 avoids three-card grid');
contains(pkg, 'check:stage227f5-lead-top-strip-no-scroll-case-row', 'package check script');
contains(pkg, 'test:stage227f5-lead-top-strip-no-scroll-case-row', 'package test script');
if (failures) { console.error('\nStage227F5 guard failures: ' + failures); process.exit(1); }
console.log('PASS STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW');
