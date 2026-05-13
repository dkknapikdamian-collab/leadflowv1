const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const helper = fs.readFileSync(path.join(root, 'src/lib/activity-timeline.ts'), 'utf8');

test('LeadDetail removes noisy work-center AI card but keeps draft-only follow-up', () => {
  assert.equal(leadDetail.includes('<LeadAiNextAction'), false);
  assert.equal(leadDetail.includes('<LeadAiFollowupDraft'), true);
  assert.equal(leadDetail.includes('<LeadAiNextAction'), false);
});

test('LeadDetail history delegates to shared source-of-truth formatter', () => {
  assert.ok(leadDetail.includes("from '../lib/activity-timeline'") || leadDetail.includes('from "../lib/activity-timeline"'));
  assert.ok(leadDetail.includes('getActivityTimelineTitle(activity'));
  assert.ok(leadDetail.includes('getActivityTimelineDescription(activity'));
});

test('activity timeline formatter covers concrete business history payloads', () => {
  for (const token of ['status', 'note', 'payment', 'task', 'event', 'fromStatus', 'toStatus', 'amount', 'scheduledAt', 'startAt']) {
    assert.ok(helper.includes(token), 'missing token: ' + token);
  }
});
