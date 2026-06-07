const fs = require('fs');

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH: ' + label); }
function has(text, needle, label) { text.includes(needle) ? pass(label) : fail(label); }
function notHas(text, needle, label) { text.includes(needle) ? fail(label) : pass(label); }

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');

has(lead, 'STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH', 'runtime marker');
has(lead, 'id="lead-activity-history"', 'left history has anchor id');
has(lead, 'data-stage227f3-left-history-source="true"', 'left history has source marker');
has(lead, 'data-stage227f3-center-history-removed="true"', 'center history removed marker');
notHas(lead, 'lead-detail-activity-history-section', 'center activity history runtime section removed');
has(lead, 'data-stage227f3-notes-own-anchor="true"', 'notes own anchor remains');
has(lead, 'id="lead-actions"', 'work center anchor remains');
has(lead, 'data-stage227f3-lead-actions-source="true"', 'work center source marker remains');
has(lead, 'data-stage227f3-lead-top-strip="true"', 'top strip exists');
has(lead, 'data-stage227f3-lead-top-card="actions"', 'top card actions marker');
has(lead, 'data-stage227f3-lead-top-card="blockers"', 'top card blockers marker');
has(lead, 'data-stage227f3-lead-top-card="history"', 'top card history marker');
has(lead, 'href="#lead-actions"', 'top strip links actions');
has(lead, 'href="#lead-activity-history"', 'top strip links history');
notHas(lead, '{!leadInService ? (\n          ) : null}', 'empty leadInService ternary removed');

has(leadCss, 'STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH_START', 'lead CSS top strip marker');
has(leadCss, '.lead-detail-stage227f3-top-strip', 'lead CSS top strip selector');
has(leadCss, 'grid-template-columns: repeat(3, minmax(0, 1fr))', 'lead CSS top strip grid');
has(leadCss, '.lead-detail-activity-history-section', 'lead CSS hides old center history class');
has(unifiedCss, 'STAGE227F3_CASE_DETAIL_HEADER_WIDTH_START', 'unified CSS case width marker');
has(unifiedCss, '[data-closeflow-route="case-detail"] .case-detail-header', 'unified CSS case header selector');
has(unifiedCss, '.case-detail-stage220a10-tabs-wrap', 'unified CSS case tabs wrap included');
has(caseCss, 'STAGE227F3_CASE_DETAIL_FULL_WIDTH_HEADER_TABS_START', 'case CSS full width marker');

if (failures) {
  console.error('Stage227F3 guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH');
