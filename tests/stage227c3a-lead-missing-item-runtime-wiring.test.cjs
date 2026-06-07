const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage227C3A wires LeadDetail Brak quick action to shared missing item modal', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING/);
  assert.match(lead, /MissingItemQuickActionModal/);
  assert.match(lead, /onClick: openLeadMissingItemDialog/);
  assert.match(lead, /data-stage227c3a-lead-missing-action/);
});

test('Stage227C3A persists lead missing items as lightweight task plus activity, not new table', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /insertTaskToSupabase\(\{/);
  assert.match(lead, /type: 'missing_item'/);
  assert.match(lead, /status: 'missing_item'/);
  assert.match(lead, /insertActivityToSupabase\(\{/);
  assert.match(lead, /eventType: 'missing_item_created'/);
  assert.doesNotMatch(lead, /create table/i);
});

test('Stage227C3A formalizes Braki i blokady filtering without relying only on title heuristics', () => {
  const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
  assert.match(lead, /type === 'missing_item'/);
  assert.match(lead, /status === 'missing_item'/);
  assert.match(lead, /payloadType\.includes\('missing_item'\)/);
});
