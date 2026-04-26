const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('relation funnel value is based on leads, clients and cases', () => {
  const relation = fs.readFileSync('src/lib/relation-value.ts', 'utf8');
  const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');

  assert.ok(relation.includes('buildRelationValueEntries'));
  assert.ok(relation.includes('clients?: Record<string, unknown>[]'));
  assert.ok(relation.includes('cases?: Record<string, unknown>[]'));
  assert.ok(relation.includes('dealValue'));
  assert.ok(relation.includes('contractValue'));
  assert.ok(leads.includes('buildRelationValueEntries({ leads: activeLeads, clients, cases })'));
  assert.ok(leads.includes('value: relationFunnelValue'));
  assert.ok(leads.includes('Najcenniejsze relacje'));
  assert.ok(leads.includes('data-relation-value-board="true"'));
});

test('relation funnel value test is included in quiet release gate', () => {
  const gate = fs.readFileSync('scripts/closeflow-release-check-quiet.cjs', 'utf8');
  assert.ok(gate.includes('tests/relation-funnel-value.test.cjs'));
});
