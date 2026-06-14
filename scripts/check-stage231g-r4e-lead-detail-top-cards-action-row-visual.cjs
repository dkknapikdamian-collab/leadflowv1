const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const lead = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
const visualCss = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
const overrideCss = fs.readFileSync(path.join(root, 'src/styles/closeflow-lead-detail-sales-signal-stage227e4.css'), 'utf8');

function fail(message) {
  console.error('STAGE231G_R4E FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(lead.includes('data-stage227e2-top-cards="true"'), 'LeadDetail top card grid marker missing');
assert(lead.includes('data-stage227e2-potential-card="true"'), 'Potential top card marker missing');
assert(lead.includes('data-stage231g-potential-edit-action="true"'), 'Potential edit action marker missing');
assert(lead.includes('data-stage231g-next-step-action="true"'), 'Next step action marker missing');
assert(lead.includes('data-stage231g-risk-action="true"'), 'Risk action marker missing');
assert(lead.includes('data-stage231g-blocker-action="true"'), 'Blocker action marker missing');

assert(overrideCss.includes('STAGE231G_R4E_LEAD_DETAIL_TOP_CARDS_AND_ACTION_ROW_VISUAL_CLEANUP'), 'R4E CSS marker missing');
assert(/\[data-stage227e2-potential-card="true"\] > p\s*\{[\s\S]*display: none !important;/.test(overrideCss), 'Potential helper line must be visually removed');
assert(/\.lead-detail-top-card > \.lead-detail-pill\s*\{[\s\S]*display: none !important;/.test(overrideCss), 'Top-card micro status pills must be visually removed');
assert(/\.lead-detail-top-card > strong\s*\{[\s\S]*font-size: clamp\(15px, 1\.05vw, 18px\) !important;/.test(overrideCss), 'Top card main text must be slightly enlarged and guarded');
assert(/\.lead-detail-card-title-row h2\s*\{[\s\S]*font-size: 14px !important;/.test(overrideCss), 'Top card title text must be slightly enlarged');

assert(!visualCss.includes('minmax(250px, auto)'), 'Visual CSS must not contain fragile minmax(250px, auto) action column');
assert(visualCss.includes('STAGE231G_R4D_WORK_ROW_ONE_LINE_ALIGNMENT_GUARD'), 'R4D visual guard marker missing');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\]\s*\{[\s\S]*grid-template-columns: 38px minmax\(220px, 1fr\) max-content max-content !important;[\s\S]*align-items: center !important;/.test(overrideCss), 'R4E desktop work-row grid must keep content/status/actions in one row');
assert(/\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions\s*\{[\s\S]*flex-wrap: nowrap !important;[\s\S]*padding-top: 0 !important;/.test(overrideCss), 'R4E action buttons must not wrap or drop below on desktop');
assert(/@media \(max-width: 1180px\)[\s\S]*\.lead-detail-stage228d-action-center \.lead-detail-work-row\[data-stage231g-work-row-layout="true"\] \.lead-detail-work-row__actions[\s\S]*flex-wrap: wrap !important;/.test(overrideCss), 'R4E medium-width fallback must still allow controlled wrapping');

if (lead.includes('Zapisana wartość leada')) {
  assert(/\[data-stage227e2-potential-card="true"\] > p\s*\{[\s\S]*display: none !important;/.test(overrideCss), 'Existing Potential helper copy must be hidden until JSX cleanup removes it');
}

for (const forbiddenVisible of ['Pod kontrolą', 'Czysto', 'Do zrobienia']) {
  if (lead.includes(forbiddenVisible)) {
    assert(/\.lead-detail-top-card > \.lead-detail-pill\s*\{[\s\S]*display: none !important;/.test(overrideCss), `Top-card micro badge ${forbiddenVisible} must be hidden by R4E CSS`);
  }
}

console.log('STAGE231G_R4E PASS: LeadDetail top cards and action rows are visually cleaned and guarded.');
