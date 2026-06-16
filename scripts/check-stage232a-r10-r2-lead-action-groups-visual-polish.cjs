const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('src/index.css', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-r10-r2-lead-action-groups-visual-polish.css', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(index, "stage232a-r10-r2-lead-action-groups-visual-polish.css", 'global CSS import');
must(css, 'STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH', 'stage marker');
must(css, '.lead-detail-action-accordion-group::before', 'accent stripe');
must(css, '.lead-detail-action-accordion-group--next', 'next group selector');
must(css, '.lead-detail-action-accordion-group--blockers', 'blockers group selector');
must(css, '.lead-detail-action-accordion-group--active', 'active group selector');
must(css, '[data-stage232a-r10-r1-empty-tone="missing"]', 'missing empty data selector');
must(css, '[data-stage232a-r10-r1-missing-tone-row="true"]', 'missing row data selector');
must(css, '#fff3c4', 'strong amber empty background');
must(css, '#f59e0b', 'strong amber border/accent');
must(css, '.lead-detail-notes-section .lead-detail-light-empty', 'notes neutral protection');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH',
  guard: 'check-stage232a-r10-r2-lead-action-groups-visual-polish'
}, null, 2));
