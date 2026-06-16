const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const card = lead.match(/<article className="lead-detail-top-card lead-detail-callout-red"[\s\S]*?<\/article>/m)?.[0] || '';

test('STAGE232A R9 blocker top card is summary-only and can always add Brak', () => {
  assert.match(card, /data-stage232a-r9-blocker-top-card-summary="true"/);
  assert.match(card, /openLeadContextAction\('blocker'\)/);
  assert.match(card, /Dodaj brak/);
  assert.doesNotMatch(card, /handleResolveLeadMissingItemStage228R13/);
  assert.doesNotMatch(card, /handleDeleteLeadMissingItemStage228R15/);
});

test('STAGE232A R9 top card opens all Braki list instead of acting on first item', () => {
  assert.match(card, /Zobacz wszystkie braki/);
  assert.match(card, /setLeadActionOpenGroup\('blockers'\)/);
  assert.match(card, /document\.getElementById\('lead-actions'\)\?\.scrollIntoView/);
  assert.doesNotMatch(card, /leadBlockerEntries\[0\]\?\.title/);
});

test('STAGE232A R9 blockers accordion keeps per-item resolve/delete actions', () => {
  assert.match(lead, /data-stage232a-r9-row-actions=\{group\.key === 'blockers' \? 'missing-only' : 'default'\}/);
  assert.match(lead, /group\.key === 'blockers' \? \(/);
  assert.match(lead, /data-stage228r13-lead-missing-resolve-action="true"/);
  assert.match(lead, /data-stage228r15-lead-missing-delete-action="true"/);
});
