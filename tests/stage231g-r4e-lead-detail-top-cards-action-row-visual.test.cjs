const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const visualCss = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const overrideCss = fs.readFileSync(path.join(root, 'src/styles/closeflow-lead-detail-sales-signal-stage227e4.css'), 'utf8');

test('STAGE231G_R4E removes visible helper line and top-card micro badges', () => {
  assert.match(overrideCss, /STAGE231G_R4E_LEAD_DETAIL_TOP_CARDS_AND_ACTION_ROW_VISUAL_CLEANUP/);
  assert.match(overrideCss, /\[data-stage227e2-potential-card="true"\] > p\s*\{[\s\S]*display: none !important;/);
  assert.match(overrideCss, /\.lead-detail-top-card > \.lead-detail-pill\s*\{[\s\S]*display: none !important;/);
  assert.match(lead, /data-stage227e2-potential-card="true"/);
  assert.match(lead, /data-stage231g-blocker-action="true"/);
});

test('STAGE231G_R4E keeps top card text readable', () => {
  assert.match(overrideCss, /\.lead-detail-card-title-row h2\s*\{[\s\S]*font-size: 14px !important;/);
  assert.match(overrideCss, /\.lead-detail-top-card > strong\s*\{[\s\S]*font-size: clamp\(15px, 1\.05vw, 18px\) !important;/);
  assert.match(overrideCss, /\.lead-detail-top-card > p\s*\{[\s\S]*font-size: 12px !important;/);
});

test('STAGE231G_R4E keeps action row aligned and blocks fragile action column', () => {
  assert.equal(visualCss.includes('minmax(250px, auto)'), false);
  assert.match(visualCss, /STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT_GUARD/);
  assert.match(overrideCss, /\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\]\s*\{[\s\S]*grid-template-columns: 38px minmax\(220px, 1fr\) max-content max-content !important;[\s\S]*align-items: center !important;/);
  assert.match(overrideCss, /\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions\s*\{[\s\S]*flex-wrap: nowrap !important;[\s\S]*padding-top: 0 !important;/);
});

test('STAGE231G_R4E keeps medium-width fallback', () => {
  assert.match(overrideCss, /@media \(max-width: 1180px\)[\s\S]*\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions[\s\S]*flex-wrap: wrap !important;/);
});
