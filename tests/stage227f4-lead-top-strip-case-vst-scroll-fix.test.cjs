const assert = require('assert/strict');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

test('Stage227F4 uses CaseDetail visual source classes for Lead top strip', () => {
  assert.match(lead, /data-stage227f4-case-vst-tabs-source="case-detail-stage220a10-tabs"/);
  assert.match(lead, /className="lead-detail-stage227f3-top-strip case-detail-stage220a10-tabs-wrap"/);
  assert.match(lead, /className="case-detail-tabs case-detail-stage220a10-tabs lead-detail-stage227f4-tabs"/);
  assert.match(css, /\.lead-detail-stage227f3-top-strip\.case-detail-stage220a10-tabs-wrap/);
  assert.match(css, /\.lead-detail-stage227f3-top-card\.case-detail-tab-active/);
});

test('Stage227F4 removes hash anchors that were causing clipped scroll state', () => {
  assert.doesNotMatch(lead, /href="#lead-actions"/);
  assert.doesNotMatch(lead, /href="#lead-activity-history"/);
  assert.match(lead, /document\.getElementById\('lead-actions'\)\?\.scrollIntoView/);
  assert.match(lead, /document\.getElementById\('lead-activity-history'\)\?\.scrollIntoView/);
});

test('Stage227F4 keeps F3 counters and history separation contract', () => {
  assert.match(lead, /data-stage227f3-lead-top-card="actions"/);
  assert.match(lead, /data-stage227f3-lead-top-card="blockers"/);
  assert.match(lead, /data-stage227f3-lead-top-card="history"/);
  assert.match(lead, /data-stage227f3-center-history-removed="true"/);
  assert.match(lead, /data-stage227f3-left-history-source="true"/);
});
