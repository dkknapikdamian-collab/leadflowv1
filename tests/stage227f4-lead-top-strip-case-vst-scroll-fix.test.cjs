const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
function between(text, start, end) { const a = text.indexOf(start); const b = text.indexOf(end); return a >= 0 && b > a ? text.slice(a, b + end.length) : ''; }

test('Stage227F4/F5 uses CaseDetail visual source classes for Lead top strip', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.ok(strip.includes('case-detail-stage220a10-tabs-wrap'));
  assert.ok(strip.includes('case-detail-tabs case-detail-stage220a10-tabs'));
});

test('Stage227F4/F5 removes hash anchors and scrollIntoView side effects', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.equal(strip.includes('scrollIntoView'), false);
  assert.equal(strip.includes('href="#lead-actions"'), false);
  assert.equal(strip.includes('href="#lead-activity-history"'), false);
});

test('Stage227F4/F5 keeps F3 counters and history separation contract', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  assert.ok(lead.includes('data-stage227f3-left-history-source="true"'));
  assert.ok(lead.includes('data-stage227f3-center-history-removed="true"'));
  assert.ok(lead.includes('{leadActivityHistoryItems.length}'));
});
