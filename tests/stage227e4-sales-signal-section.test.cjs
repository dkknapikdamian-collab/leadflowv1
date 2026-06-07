const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-lead-detail-sales-signal-stage227e4.css', 'utf8');

test('Stage227E4R2 uses compact sales context instead of heavy sales signal wall', () => {
  assert.ok(lead.includes('STAGE227E4R2_LEAD_DETAIL_DECISION_VIEW_SIMPLIFICATION'));
  assert.ok(lead.includes('Kontekst sprzedażowy'));
  assert.ok(lead.includes('data-stage227e4r2-sales-context-section="true"'));
  assert.doesNotMatch(lead, /Sygnał sprzedażowy/);
  assert.doesNotMatch(lead, /Powód kontaktu/);
});

test('Stage227E4R2 keeps only movement-driving fields', () => {
  for (const label of ['Potrzeba / problem', 'Termin / pilność', 'Budżet / potencjał', 'Decyzja', 'Blokada']) {
    assert.ok(lead.includes(label), `missing ${label}`);
  }
});

test('Stage227E4R2 does not duplicate source/status as decision context', () => {
  assert.doesNotMatch(lead, /input\.sourceLabel/);
  assert.doesNotMatch(lead, /String\(lead\.status \|\| ''\)\.replaceAll/);
});

test('Stage227E4R2 remains before Work Action Center and has compact CSS', () => {
  const contextIndex = lead.indexOf('data-stage227e4r2-sales-context-section="true"');
  const actionIndex = lead.indexOf('data-stage228b-lead-work-action-center="true"');
  assert.ok(contextIndex >= 0);
  assert.ok(actionIndex >= 0);
  assert.ok(contextIndex < actionIndex);
  assert.ok(css.includes('lead-detail-sales-context-card'));
  assert.ok(!css.includes('min-height: 126px'));
});
