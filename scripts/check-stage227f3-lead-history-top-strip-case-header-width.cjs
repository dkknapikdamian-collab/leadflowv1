const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

let failures = 0;

function asText(value) {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function pass(label) {
  console.log(`PASS ${label}`);
}

function fail(label) {
  failures += 1;
  console.error(`FAIL STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH: ${label}`);
}

function contains(haystack, needle, label) {
  if (asText(haystack).includes(needle)) pass(label);
  else fail(`missing: ${label} [${needle}]`);
}

function containsAny(haystack, needles, label) {
  const text = asText(haystack);
  if (needles.some((needle) => text.includes(needle))) pass(label);
  else fail(`missing any: ${label} [${needles.join(' | ')}]`);
}

function notContains(haystack, needle, label) {
  if (!asText(haystack).includes(needle)) pass(label);
  else fail(`still contains: ${label} [${needle}]`);
}

function matches(haystack, regex, label) {
  if (regex.test(asText(haystack))) pass(label);
  else fail(`missing pattern: ${label} ${regex}`);
}

contains(lead, 'STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH', 'runtime marker');
contains(lead, 'id="lead-activity-history"', 'left history has anchor id');
contains(lead, 'data-stage227f3-left-history-source="true"', 'left history has source marker');
contains(lead, 'data-stage227f3-center-history-removed="true"', 'center history removed marker');
notContains(lead, 'className="lead-detail-section-card lead-detail-history-center lead-detail-activity-history-section"', 'center activity history runtime section removed');
contains(lead, 'data-stage227f3-notes-own-anchor="true"', 'notes own anchor remains');
contains(lead, 'id="lead-actions"', 'work center anchor remains');
contains(lead, 'data-stage227f3-lead-actions-source="true"', 'work center source marker remains');
contains(lead, 'lead-detail-stage227f3-top-strip', 'top strip exists');
contains(lead, 'data-stage227f3-lead-top-card="actions"', 'top card actions marker');
contains(lead, 'data-stage227f3-lead-top-card="blockers"', 'top card blockers marker');
contains(lead, 'data-stage227f3-lead-top-card="history"', 'top card history marker');

containsAny(lead, [
  'href="#lead-actions"',
  "document.getElementById('lead-actions')?.scrollIntoView",
  'document.getElementById("lead-actions")?.scrollIntoView'
], 'top strip can reach actions');

containsAny(lead, [
  'href="#lead-activity-history"',
  "document.getElementById('lead-activity-history')?.scrollIntoView",
  'document.getElementById("lead-activity-history")?.scrollIntoView'
], 'top strip can reach history');

if (lead.includes('STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX')) {
  notContains(lead, 'href="#lead-actions"', 'F4 removes hash link to actions');
  notContains(lead, 'href="#lead-activity-history"', 'F4 removes hash link to history');
  matches(lead, /document\.getElementById\(['"]lead-actions['"]\)\?\.scrollIntoView/, 'F4 button scroll actions target');
  matches(lead, /document\.getElementById\(['"]lead-activity-history['"]\)\?\.scrollIntoView/, 'F4 button scroll history target');
}

notContains(lead, '!leadInService ? (\n\n) : null', 'empty leadInService ternary removed');

containsAny(leadCss, [
  'STAGE227F3_LEAD_HISTORY_TOP_STRIP_START',
  'STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH',
  'STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX'
], 'lead CSS top strip marker');
contains(leadCss, '.lead-detail-stage227f3-top-strip', 'lead CSS top strip selector');
containsAny(leadCss, [
  'grid-template-columns: repeat(3, minmax(0, 1fr))',
  'case-detail-stage220a10-tabs-wrap'
], 'lead CSS top strip layout');
contains(leadCss, '.lead-detail-activity-history-section', 'lead CSS hides old center history class');

containsAny(unifiedCss, [
  'STAGE227F2_SHARED_DETAIL_SHELL_WIDTH',
  'STAGE227F2_SHARED_DETAIL_SHELL_AND_CLIENT_CASE_WIDTH_POLISH_START',
  '--stage227f2-shared-detail-shell-and-lead-copy-polish',
  'STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT'
], 'unified CSS case width marker');
contains(unifiedCss, '.case-detail-header', 'unified CSS case header selector');
containsAny(unifiedCss + leadCss, [
  '.case-detail-stage220a10-tabs-wrap',
  'case-detail-stage220a10-tabs-wrap'
], 'case tabs wrap included in width/visual contract');

const caseWidthContract = [
  caseCss,
  unifiedCss,
  leadCss
].join('\n');

containsAny(caseWidthContract, [
  'STAGE227F2R1_CLIENT_CASE_HEADER_STRETCH_LEAD_COPY_FIX',
  'case-detail-stage220a10-tabs-wrap',
  '.case-detail-header',
  'max-width: none'
], 'case CSS full width contract');

contains(pkg, 'check:stage227f3-lead-history-top-strip-case-header-width', 'package check script');
contains(pkg, 'test:stage227f3-lead-history-top-strip-case-header-width', 'package test script');

if (failures > 0) {
  console.error(`Stage227F3 guard failures: ${failures}`);
  process.exit(1);
}

console.log('PASS STAGE227F3_LEAD_HISTORY_TOP_STRIP_CASE_HEADER_WIDTH');