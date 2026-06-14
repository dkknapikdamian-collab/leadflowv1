const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const r4Guard = fs.readFileSync(path.join(root, 'scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs'), 'utf8');

test('STAGE231G_R4D removes the fragile Stage228D 250px actions column', () => {
  assert.equal(css.includes('minmax(250px, auto)'), false);
  assert.match(css, /STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT_GUARD/);
});

test('STAGE231G_R4D keeps status and actions in one desktop row', () => {
  assert.match(css, /\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\]\s*\{[\s\S]*grid-template-columns: 38px minmax\(0, 1fr\) max-content max-content !important;[\s\S]*align-items: center !important;/);
  assert.match(css, /\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__status\s*\{[\s\S]*grid-column: 3 !important;[\s\S]*white-space: nowrap !important;/);
  assert.match(css, /\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions\s*\{[\s\S]*grid-column: 4 !important;[\s\S]*flex-wrap: nowrap !important;[\s\S]*min-width: max-content !important;/);
});

test('STAGE231G_R4D keeps a safe medium-width fallback', () => {
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions[\s\S]*flex-wrap: wrap !important;/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*grid-template-columns: 38px minmax\(0, 1fr\) !important;/);
});

test('STAGE231G_R4D is included in the R4 guard so regression is blocked later', () => {
  assert.match(r4Guard, /Stage228D\/R4D work-row must not reserve fragile minmax\(250px, auto\) actions column/);
});