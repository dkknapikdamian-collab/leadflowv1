const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const r4Guard = fs.readFileSync(path.join(root, 'scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs'), 'utf8');

function fail(message) {
  console.error('STAGE231G_R4D FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(!css.includes('minmax(250px, auto)'), 'work-row CSS must not contain minmax(250px, auto)');
assert(css.includes('STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT_GUARD'), 'R4D CSS marker missing');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\]\s*\{[\s\S]*grid-template-columns: 38px minmax\(0, 1fr\) max-content max-content !important;[\s\S]*align-items: center !important;/.test(css), 'desktop row must use icon/content/status/actions one-line grid');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__status\s*\{[\s\S]*grid-column: 3 !important;[\s\S]*white-space: nowrap !important;/.test(css), 'status must stay in no-wrap third column');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions\s*\{[\s\S]*grid-column: 4 !important;[\s\S]*flex-wrap: nowrap !important;[\s\S]*min-width: max-content !important;/.test(css), 'actions must stay in no-wrap fourth column on desktop');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions button,[\s\S]*white-space: nowrap !important;/.test(css), 'action buttons must not wrap inside action cell');
assert(/@media \(max-width: 1180px\)[\s\S]*\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions[\s\S]*flex-wrap: wrap !important;/.test(css), 'medium viewport fallback must allow wrapping in column 2');
assert(r4Guard.includes('Stage228D/R4D work-row must not reserve fragile minmax(250px, auto) actions column'), 'R4 guard must include R4D regression check');

console.log('STAGE231G_R4D PASS: LeadDetail work-row status/actions alignment is guarded.');