const fs = require('fs');
const assert = require('assert');

const layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-unified-page-canvas-stage211c.css', 'utf8');
const queue = fs.readFileSync('_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(layout, 'STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX', 'Layout marker');
must(layout, 'STAGE232J_R1_R1_LAYOUT_ANCHOR_FIX', 'Layout R1 robust marker');
must(layout, "location.pathname !== '/leads'", 'route scoped to /leads');
must(layout, 'data-stage232j-r1-leads-scroll-owner', 'scroll owner marker');
must(layout, 'inner-content-single-owner', 'single owner contract marker');
must(layout, 'content.scrollTop > 0 && content.scrollTop < 10', 'near-top snap condition');
must(layout, "content.addEventListener('scroll', handleScroll", 'scroll listener');
must(layout, 'window.scrollTo(0, 0)', 'window scroll reset');
must(layout, "document.documentElement.scrollTop !== 0", 'html scroll reset');
must(layout, "document.body.scrollTop !== 0", 'body scroll reset');

must(css, 'STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX', 'CSS marker');
must(css, '#root main[data-current-section="leads"][data-shell-main="true"]', 'main leads shell selector');
must(css, 'data-stage232j-r1-leads-scroll-owner="true"', 'CSS scroll owner selector');
must(css, 'overflow-y: auto !important', 'content scroll owner overflow');
must(css, 'overflow-x: hidden !important', 'no horizontal scroll');
must(css, 'scroll-padding-top: 0 !important', 'no top cut padding');
must(css, 'overflow-anchor: none !important', 'no anchor jump');
must(css, 'html[data-stage232j-r1-document-scroll-locked="true"]', 'document lock');

must(queue, 'STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX', 'queue still points to stage J');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX',
  guard: 'check-stage232j-leads-scroll-top-cut',
  patcherCompatibility: 'R1 robust Layout marker anchor'
}, null, 2));
