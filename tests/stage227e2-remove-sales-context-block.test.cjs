const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

test('Stage227E2 removes the E4/E4R2 sales context section from runtime', () => {
  assert.ok(lead.includes('STAGE227E2_REMOVE_SALES_CONTEXT_BLOCK'));
  assert.doesNotMatch(lead, /data-stage227e4-sales-signal-section="true"/);
  assert.doesNotMatch(lead, /data-stage227e4r2-sales-context-section="true"/);
  assert.doesNotMatch(lead, /lead-detail-sales-signal-section/);
  assert.doesNotMatch(lead, /lead-detail-sales-context-section/);
  assert.doesNotMatch(lead, /leadSalesSignalItemsStage227E4\.map/);
});

test('Stage227E2 keeps the operational work center and accordion groups', () => {
  assert.ok(lead.includes('data-stage228b-lead-work-action-center="true"'));
  assert.ok(lead.includes('data-stage228d-lead-action-center-accordion="true"'));
  assert.ok(lead.includes("key: 'next' as LeadActionAccordionGroup"));
  assert.ok(lead.includes("key: 'blockers' as LeadActionAccordionGroup"));
  assert.ok(lead.includes("key: 'active' as LeadActionAccordionGroup"));
});

test('Stage227E2 keeps row action handlers without relying on translated button text', () => {
  for (const fragment of [
    'openLinkedTaskEditor(entry.raw)',
    'openLinkedEventEditor(entry.raw)',
    'handleRescheduleLinkedTask(entry.raw',
    'handleRescheduleLinkedEvent(entry.raw',
    'handleToggleLinkedTask(entry.raw)',
    'handleToggleLinkedEvent(entry.raw)',
    'handleDeleteLinkedTask(entry.raw)',
    'handleDeleteLinkedEvent(entry.raw)',
  ]) {
    assert.ok(lead.includes(fragment), `missing ${fragment}`);
  }
});

test('Stage227E2 preserves Stage227E1 header phone visibility', () => {
  assert.ok(lead.includes('STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY'));
  assert.ok(lead.includes('Brak telefonu'));
  assert.ok(lead.includes("copyValue('Telefon'"));
});