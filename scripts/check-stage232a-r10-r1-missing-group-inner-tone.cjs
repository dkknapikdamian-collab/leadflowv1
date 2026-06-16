const fs = require('fs');
const assert = require('assert');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const queue = fs.existsSync('_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md')
  ? fs.readFileSync('_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md', 'utf8')
  : '';

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(lead, 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE', 'LeadDetail marker');
must(lead, "data-stage232a-r10-r1-empty-tone={group.key === 'blockers' ? 'missing' : String(group.key)}", 'blockers empty tone marker');
must(lead, "data-stage232a-r10-r1-missing-tone-row={group.key === 'blockers' ? 'true' : 'false'}", 'blockers row tone marker');
must(lead, "key: 'blockers' as LeadActionAccordionGroup", 'blockers group exists');
must(lead, "tone: 'blockers'", 'blockers tone exists');
must(lead, "label: 'Braki i blokady'", 'blockers label exists');

must(css, 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE', 'CSS marker');
must(css, '.lead-detail-action-accordion-group--blockers .lead-detail-action-empty', 'empty selector');
must(css, '[data-stage232a-r10-r1-empty-tone="missing"]', 'empty data selector');
must(css, '[data-stage232a-r10-r1-missing-tone-row="true"]', 'row data selector');
must(css, '#fffaeb', 'amber main background');
must(css, '#fff7df', 'amber inner background');
must(css, '#fedf89', 'amber border');
must(css, '#92400e', 'amber text');

must(queue, 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE', 'queue placement sync mentions R10-R1');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE',
  guard: 'check-stage232a-r10-r1-missing-group-inner-tone'
}, null, 2));
