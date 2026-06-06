const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function between(text, start, end) {
  const s = text.indexOf(start);
  assert.notEqual(s, -1, 'missing start: ' + start);
  const e = text.indexOf(end, s);
  assert.notEqual(e, -1, 'missing end: ' + end);
  return text.slice(s, e);
}
const leadsPage = read('src/pages/Leads.tsx');
const clientsPage = read('src/pages/Clients.tsx');
const apiLeads = read('api/leads.ts');
const apiClients = read('api/clients.ts');

test('lead create path strips client/case ids before insert', () => {
  ['delete sanitizedPreparedLead.clientId;', 'delete sanitizedPreparedLead.client_id;', 'delete sanitizedPreparedLead.caseId;', 'delete sanitizedPreparedLead.case_id;'].forEach((token) => assert.equal(leadsPage.includes(token), true, token));
  const block = between(leadsPage, 'const createLeadFromPreparedInput = async', 'const restoreConflictCandidate = async');
  assert.equal(block.includes('createClientInSupabase'), false);
  assert.equal(block.includes('updateClientInSupabase'), false);
});

test('clients page renders main rows from clients collection only', () => {
  const filteredBlock = between(clientsPage, 'const filtered = useMemo(() => {', 'const countersByClientId = useMemo');
  assert.equal(filteredBlock.includes('return clients'), true);
  assert.equal(filteredBlock.includes('return leads'), false);
  assert.equal(filteredBlock.includes('.map((lead'), false);
});

test('ordinary POST /api/leads does not ensure or attach client', () => {
  const prePayload = between(apiLeads, "const status = normalizeStatus(body.status || 'new');", 'const payload: Record<string, unknown> = {');
  assert.equal(prePayload.includes('ensureClientForLead'), false);
  const payloadBlock = between(apiLeads, 'const payload: Record<string, unknown> = {', "await assertWorkspaceEntityLimit(workspaceId, 'lead');");
  assert.equal(payloadBlock.includes('client_id: null,'), true);
  assert.equal(payloadBlock.includes('linked_case_id: null,'), true);
});

test('/api/clients reads clients table and does not map leads as clients', () => {
  assert.equal(apiClients.includes('clients?select='), true);
  assert.equal(apiClients.includes('/api/leads'), false);
  assert.equal(apiClients.includes('normalizeLeadContract'), false);
});

test('explicit start_service conversion can still create client', () => {
  assert.equal(apiLeads.includes('async function handleStartService'), true);
  assert.equal(apiLeads.includes('const clientRow = await ensureClientForLead(workspaceId, leadContext);'), true);
});
