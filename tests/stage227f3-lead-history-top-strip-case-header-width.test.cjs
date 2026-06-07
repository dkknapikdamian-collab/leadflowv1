const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const leadCss = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const unifiedCss = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const caseCss = fs.readFileSync('src/styles/visual-stage13-case-detail-vnext.css', 'utf8');

test('Stage227F3 keeps lead history out of the center notes stack', () => {
  assert.match(lead, /id="lead-activity-history"/);
  assert.match(lead, /data-stage227f3-left-history-source="true"/);
  assert.match(lead, /data-stage227f3-center-history-removed="true"/);
  assert.doesNotMatch(lead, /className="lead-detail-section-card lead-detail-history-center lead-detail-activity-history-section"/);
  assert.match(lead, /data-stage227f3-notes-own-anchor="true"/);
});

test('Stage227F3/F4 top strip reaches actions and history without allowing duplicate center history', () => {
  assert.match(lead, /lead-detail-stage227f3-top-strip/);
  assert.match(lead, /data-stage227f3-lead-top-card="actions"/);
  assert.match(lead, /data-stage227f3-lead-top-card="blockers"/);
  assert.match(lead, /data-stage227f3-lead-top-card="history"/);
  assert.match(lead, /id="lead-actions"/);
  assert.match(lead, /data-stage227f3-lead-actions-source="true"/);

  if (lead.includes('STAGE227F4_LEAD_TOP_STRIP_CASE_VST_SCROLL_FIX')) {
    assert.doesNotMatch(lead, /href="#lead-actions"/);
    assert.doesNotMatch(lead, /href="#lead-activity-history"/);
    assert.match(lead, /document\.getElementById\(['"]lead-actions['"]\)\?\.scrollIntoView/);
    assert.match(lead, /document\.getElementById\(['"]lead-activity-history['"]\)\?\.scrollIntoView/);
  } else {
    assert.match(lead, /href="#lead-actions"/);
    assert.match(lead, /href="#lead-activity-history"/);
  }
});

test('Stage227F3/F4 preserves shell width and visual contracts', () => {
  assert.match(leadCss, /lead-detail-stage227f3-top-strip/);
  assert.match(leadCss, /lead-detail-activity-history-section/);

  assert.ok(
    unifiedCss.includes('STAGE227F2_SHARED_DETAIL_SHELL_WIDTH') ||
    unifiedCss.includes('STAGE227F2_SHARED_DETAIL_SHELL_AND_CLIENT_CASE_WIDTH_POLISH_START') ||
    unifiedCss.includes('--stage227f2-shared-detail-shell-and-lead-copy-polish') ||
    unifiedCss.includes('STAGE227E0_DETAIL_SHELL_WIDTH_AUDIT'),
    'shared detail shell marker should exist'
  );

  assert.match(unifiedCss, /case-detail-header/);

  assert.ok(
    (unifiedCss + leadCss).includes('case-detail-stage220a10-tabs-wrap'),
    'case tab wrap should be included in width or visual source contract'
  );

  assert.ok(
    [caseCss, unifiedCss, leadCss].join('\n').includes('STAGE227F2R1_CLIENT_CASE_HEADER_STRETCH_LEAD_COPY_FIX') ||
    [caseCss, unifiedCss, leadCss].join('\n').includes('case-detail-stage220a10-tabs-wrap') ||
    [caseCss, unifiedCss, leadCss].join('\n').includes('max-width: none'),
    'case detail full width contract should remain detectable'
  );
});