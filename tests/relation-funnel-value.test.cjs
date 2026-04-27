const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('relation funnel value is based on active leads and clients, not case duplicates', () => {
  const relation = fs.readFileSync('src/lib/relation-value.ts', 'utf8');
  const leads = fs.readFileSync('src/pages/Leads.tsx', 'utf8');
  const clientsApi = fs.readFileSync('api/clients.ts', 'utf8');

  assert.ok(relation.includes('buildRelationValueEntries'));
  assert.ok(relation.includes('buildRelationFunnelValue'));
  assert.ok(relation.includes('RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS'));
  assert.ok(relation.includes('clients?: Record<string, unknown>[]'));
  assert.ok(relation.includes('dealValue'));
  assert.ok(relation.includes('clientValue'));
  assert.ok(relation.includes('contractValue'));
  assert.ok(relation.includes('totalRevenue'));
  assert.ok(relation.includes('return buildRelationValueEntries({ leads, clients }).reduce((sum, entry) => sum + entry.value, 0)'));

  assert.ok(leads.includes('buildRelationValueEntries({ leads: activeLeads, clients, cases })'));
  assert.ok(leads.includes('buildRelationFunnelValue({ leads: activeLeads, clients })'));
  assert.ok(leads.includes('value: relationFunnelValue'));
  assert.ok(leads.includes('Lejek razem: {formatRelationValue(relationFunnelValue)}'));
  assert.ok(leads.includes('Suma lejka liczona z aktywnych leadów i klientów'));
  assert.ok(leads.includes('Najcenniejsze relacje'));
  assert.ok(leads.includes('data-relation-value-board="true"'));
  assert.ok(!leads.includes('relationValueEntries.reduce((sum, entry) => sum + entry.value, 0)'));

  assert.ok(clientsApi.includes('clientValue: row.client_value'));
  assert.ok(clientsApi.includes('contractValue: row.contract_value'));
  assert.ok(clientsApi.includes('totalRevenue: row.total_revenue'));
});

test('relation funnel value test is included in quiet release gate', () => {
  const gate = fs.readFileSync('scripts/closeflow-release-check-quiet.cjs', 'utf8');
  assert.ok(gate.includes('tests/relation-funnel-value.test.cjs'));
});
