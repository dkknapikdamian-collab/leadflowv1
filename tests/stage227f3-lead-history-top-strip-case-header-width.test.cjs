const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

test('Stage227F3 keeps lead activity history out of the center notes stack', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /id="lead-activity-history"/);
  assert.match(lead, /data-stage227f3-left-history-source="true"/);
  assert.match(lead, /data-stage227f3-center-history-removed="true"/);
  assert.doesNotMatch(lead, /lead-detail-activity-history-section/);
  assert.doesNotMatch(lead, /\{!leadInService \? \(\s*\) : null\}/);
});

test('Stage227F3 exposes a three-card lead top strip linked to actions and history', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /data-stage227f3-lead-top-strip="true"/);
  assert.match(lead, /data-stage227f3-lead-top-card="actions"/);
  assert.match(lead, /data-stage227f3-lead-top-card="blockers"/);
  assert.match(lead, /data-stage227f3-lead-top-card="history"/);
  assert.match(lead, /href="#lead-actions"/);
  assert.match(lead, /href="#lead-activity-history"/);
});

test('Stage227F3 keeps CaseDetail header and tabs full width', () => {
  const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
  const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');
  assert.match(unifiedCss, /STAGE227F3_CASE_DETAIL_HEADER_WIDTH_START/);
  assert.match(unifiedCss, /\[data-closeflow-route="case-detail"\] \.case-detail-header/);
  assert.match(unifiedCss, /\.case-detail-stage220a10-tabs-wrap/);
  assert.match(caseCss, /STAGE227F3_CASE_DETAIL_FULL_WIDTH_HEADER_TABS_START/);
});
