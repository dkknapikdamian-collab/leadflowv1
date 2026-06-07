const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

test('Stage227E5 keeps the central work center as the only work-list source of truth', () => {
  assert.ok(lead.includes('STAGE227E5_WORK_CENTER_BLOCKERS_SOURCE_OF_TRUTH'));
  assert.ok(lead.includes('data-stage227e5-work-center-blockers-source="true"'));
  assert.ok(lead.includes('data-stage228b-lead-work-action-center="true"'));
  assert.ok(lead.includes("key: 'next' as LeadActionAccordionGroup"));
  assert.ok(lead.includes("key: 'blockers' as LeadActionAccordionGroup"));
  assert.ok(lead.includes("key: 'active' as LeadActionAccordionGroup"));
});

test('Stage227E5 removes duplicated upcoming actions from the right rail', () => {
  assert.ok(lead.includes('data-stage227e5-right-rail-upcoming-actions-removed="true"'));
  assert.ok(!lead.includes('data-stage216j3d-upcoming-actions-card="true"'));
  assert.ok(!lead.includes('lead-detail-upcoming-actions-card'));
  assert.ok(!lead.includes('lead-detail-upcoming-actions-list'));
  assert.ok(!lead.includes('data-stage216j3d-upcoming-action-row="true"'));
});

test('Stage227E5 keeps row action handlers in the central work center', () => {
  for (const fragment of [
    'openLinkedTaskEditor(entry.raw)',
    'openLinkedEventEditor(entry.raw)',
    'handleRescheduleLinkedTask(entry.raw, 24 * 60 * 60 * 1000',
    'handleRescheduleLinkedEvent(entry.raw, 24 * 60 * 60 * 1000',
    'handleToggleLinkedTask(entry.raw)',
    'handleToggleLinkedEvent(entry.raw)',
    'handleDeleteLinkedTask(entry.raw)',
    'handleDeleteLinkedEvent(entry.raw)',
  ]) {
    assert.ok(lead.includes(fragment), `missing ${fragment}`);
  }
});

test('Stage227E5 keeps right rail for quick actions and finance only', () => {
  assert.ok(lead.includes('<QuickActionsBar'));
  assert.ok(lead.includes('data-lead-finance-panel="true"'));
});
