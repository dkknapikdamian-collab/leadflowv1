const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');

test('STAGE231G R6 LeadDetail operational wiring uses stable markers and work-row blocks', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const leads = read('src/pages/Leads.tsx');
  const css = read('src/styles/visual-stage14-lead-detail-vnext.css');
  const accordionMarker = 'data-stage228d-lead-action-visible-limit="5"';
  const accordionIndex = lead.indexOf(accordionMarker);
  const overflowSection = accordionIndex === -1 ? lead : lead.slice(0, accordionIndex);

  assert.ok(lead.includes('data-stage231g-potential-edit-action'));
  assert.ok(lead.includes('data-stage231g-finance-edit-potential'));
  assert.ok(lead.includes('handleStartPotentialEditingStage231G'));
  assert.ok(lead.includes('data-stage231g-work-row-layout'));
  assert.ok(lead.includes('lead-detail-work-row__content'));
  assert.ok(lead.includes('lead-detail-work-row__status'));
  assert.ok(lead.includes('lead-detail-work-row__actions'));
  assert.ok(lead.includes('isMissingItemTimelineEntry'));
  assert.ok(!overflowSection.includes("group.key === 'blockers' && entry.kind === 'task'"));
  assert.ok(css.includes('STAGE231G_R6_WORK_ROW_LAYOUT_FINAL'));
  assert.ok(css.includes('overflow-wrap: anywhere'));
  assert.ok(leads.includes('data-stage231g-lead-create-potential-input'));
  assert.ok(leads.includes('dealValue'));
});
