const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');

test('STAGE232J_R1 route-scopes the runtime scroll fix to /leads', () => {
  assert.match(layout, /STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX/);
  assert.match(layout, /STAGE232J_R1_R1_LAYOUT_ANCHOR_FIX/);
  assert.match(layout, /location\.pathname !== '\/leads'/);
  assert.match(layout, /data-stage232j-r1-leads-scroll-owner/);
  assert.match(layout, /inner-content-single-owner/);
});

test('STAGE232J_R1 snaps fractional near-top internal scroll to 0', () => {
  assert.match(layout, /content\.scrollTop > 0 && content\.scrollTop < 10/);
  assert.match(layout, /content\.scrollTop = 0/);
  assert.match(layout, /window\.scrollTo\(0, 0\)/);
  assert.match(layout, /document\.documentElement\.scrollTop = 0/);
  assert.match(layout, /document\.body\.scrollTop = 0/);
});

test('STAGE232J_R1 keeps one inner content scroll owner and blocks document fallback', () => {
  assert.match(css, /#root main\[data-current-section="leads"\]\[data-shell-main="true"\]/);
  assert.match(css, /data-stage232j-r1-leads-scroll-owner="true"/);
  assert.match(css, /overflow-y: auto !important/);
  assert.match(css, /scroll-padding-top: 0 !important/);
  assert.match(css, /html\[data-stage232j-r1-document-scroll-locked="true"\]/);
});
