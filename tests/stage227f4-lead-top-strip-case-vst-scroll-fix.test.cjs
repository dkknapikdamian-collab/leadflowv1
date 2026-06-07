const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage227F6 successor removes LeadDetail top strip and keeps core sections', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /STAGE227F6_LEAD_TOP_STRIP_REMOVED_CADENCE_FUNNEL_WIDTH/);
  assert.match(lead, /data-stage227f6-lead-top-strip-removed="true"/);
  assert.doesNotMatch(lead, /lead-detail-stage227f5-top-strip case-detail-stage220a10-tabs-wrap/);
  assert.match(lead, /data-stage227e2-next-step-card="true"/);
  assert.match(lead, /data-stage227e3-blocker-card="true"/);
  assert.match(lead, /id="lead-activity-history"/);
});
