const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stage30 lead trash view uses strict trash visibility only', () => {
  const leads = read('src/pages/Leads.tsx');
  const match = leads.match(/function isLeadInTrash\(lead: any\) \{[\s\S]*?\n\}/);
  const body = match ? match[0] : '';

  assert.ok(body, 'Missing isLeadInTrash function');
  assert.match(body, /STAGE30_LEADS_TRASH_STRICT_VISIBILITY/);
  assert.ok(body.includes("return visibility === 'trash' || status === 'archived';"), 'Lead trash should require explicit trash visibility or archived status');
  assert.doesNotMatch(body, /salesOutcome/, 'Lead trash must not classify active leads by salesOutcome alone');
  assert.match(leads, /const sourceLeads = showTrash \? trashLeads : historyView \? historyLeads : activeLeads;/);
});

test('Stage30 clients archive view uses the current FRT025 contract', () => {
  const clients = read('src/pages/Clients.tsx');

  assert.doesNotMatch(clients, /To jest kosz klient\u00F3w\./);
  assert.doesNotMatch(clients, /Rekordy s\u0105 ukryte z aktywnej listy, ale nadal mo\u017Cna je przywr\u00F3ci\u0107\./);
  assert.match(clients, /data-forteca-frt-025-runtime=\{isArchivedStage025 \? 'true' : undefined\}/);
  assert.match(clients, /data-forteca-frt-025-table="true"/);
  assert.match(clients, /Brak zarchiwizowanych klient\u00F3w/);
  assert.match(clients, /Archiwizacja nie usuwa danych/);
});

test('Stage30 contract is included in release gates', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');
  const testPath = 'tests/stage30-leads-clients-trash-contract.test.cjs';

  assert.match(quietGate, new RegExp(testPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(fullGate, new RegExp(testPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
