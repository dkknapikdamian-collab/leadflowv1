const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
function read(file) { return fs.readFileSync(file, 'utf8'); }
function between(text, start, end) { const a = text.indexOf(start); const b = text.indexOf(end); return a >= 0 && b > a ? text.slice(a, b + end.length) : ''; }

test('Stage227F3 keeps lead history out of the center notes stack', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  assert.ok(lead.includes('data-stage227f3-left-history-source="true"'));
  assert.ok(lead.includes('data-stage227f3-center-history-removed="true"'));
  assert.ok(lead.includes('data-stage227f3-notes-own-anchor="true"'));
});

test('Stage227F3/F5 top strip reaches actions and blockers without scroll side effects', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const strip = between(lead, 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START', 'STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_END');
  assert.ok(strip.includes("setLeadActionOpenGroup('next')"));
  assert.ok(strip.includes("setLeadActionOpenGroup('blockers')"));
  assert.ok(strip.includes('data-stage227f5-history-static="true"'));
  assert.equal(strip.includes('scrollIntoView'), false);
});

test('Stage227F3/F5 preserves shell width and visual contracts', () => {
  const unifiedCss = read('src/styles/closeflow-unified-page-canvas-stage211c.css');
  const caseCss = read('src/styles/visual-stage13-case-detail-vnext.css');
  const leadCss = read('src/styles/visual-stage14-lead-detail-vnext.css');
  assert.ok(unifiedCss.includes('.case-detail-stage220a10-tabs-wrap'));
  assert.ok(caseCss.includes('case-detail-card-page-header') || caseCss.includes('STAGE227F2R1'));
  assert.ok(leadCss.includes('STAGE227F5_LEAD_TOP_STRIP_NO_SCROLL_CASE_ROW_START'));
});
