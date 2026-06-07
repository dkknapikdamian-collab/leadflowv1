const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
function between(text, start, end) { const a = text.indexOf(start); const b = text.indexOf(end); return a >= 0 && b > a ? text.slice(a, b + end.length) : ''; }

test('Stage227F5 moves lead top strip above shell and removes scroll anchors', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.ok(strip.includes('case-detail-stage220a10-tabs-wrap'));
  assert.ok(lead.indexOf('STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START') < lead.indexOf('<div className="lead-detail-shell">'));
  assert.equal(strip.includes('scrollIntoView'), false);
  assert.equal(strip.includes('document.getElementById'), false);
  assert.equal(strip.includes('href="#lead-actions"'), false);
  assert.equal(strip.includes('href="#lead-activity-history"'), false);
});

test('Stage227F5 preserves actions/blockers/history counters without scrolling history', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.ok(strip.includes("setLeadActionOpenGroup('next')"));
  assert.ok(strip.includes("setLeadActionOpenGroup('blockers')"));
  assert.ok(strip.includes('data-stage227f5-history-static="true"'));
  assert.ok(strip.includes('{leadActivityHistoryItems.length}'));
});

test('Stage227F5 cleans legacy URL hashes and uses compact CaseDetail row styling', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
  const cssBlock = between(css, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.ok(lead.includes('window.history.replaceState'));
  assert.ok(lead.includes("'#lead-actions'"));
  assert.ok(cssBlock.includes('display: inline-flex'));
  assert.equal(cssBlock.includes('grid-template-columns: repeat(3'), false);
});
