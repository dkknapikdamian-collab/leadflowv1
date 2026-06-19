#!/usr/bin/env node
/* STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX guard */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const clientPath = 'src/pages/ClientDetail.tsx';
const leadPath = 'src/pages/LeadDetail.tsx';
const managerPath = 'src/components/detail/MissingItemsManagerDialog.tsx';
const runPath = '_project/runs/STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX.md';
const obsidianPath = '_project/obsidian_updates/2026-06-19_STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX.md';

assert(exists(clientPath), `Missing file: ${clientPath}`);
assert(exists(leadPath), `Missing file: ${leadPath}`);
assert(exists(managerPath), `Missing file: ${managerPath}`);
assert(exists(runPath), `Missing run report: ${runPath}`);
assert(exists(obsidianPath), `Missing Obsidian payload: ${obsidianPath}`);

const client = exists(clientPath) ? read(clientPath) : '';
const lead = exists(leadPath) ? read(leadPath) : '';
const manager = exists(managerPath) ? read(managerPath) : '';

assert(client.includes('STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX'), 'ClientDetail missing STAGE232I4_R14 marker.');
assert(lead.includes('STAGE232I4_R14_LEAD_MISSING_MANAGER_DIALOG'), 'LeadDetail missing STAGE232I4_R14 lead manager marker.');
assert(manager.includes('data-stage232i4-r14-missing-manager-dialog'), 'Shared MissingItemsManagerDialog lacks R14 dialog marker.');

assert(client.includes('readStage232I4R14RelationId'), 'ClientDetail missing readStage232I4R14RelationId helper.');
for (const token of ['clientId', 'client_id', 'sourceEntityId', 'recordId', 'entityId', 'leadId', 'lead_id', 'caseId', 'case_id']) {
  assert(client.includes(token), `ClientDetail relation source missing token: ${token}`);
}
assert(client.includes('payload.clientId') || client.includes('payload?.clientId') || client.includes("(payload as any)?.clientId"), 'ClientDetail must explicitly support payload.clientId.');
assert(client.includes('payload.client_id') || client.includes('payload?.client_id') || client.includes("(payload as any)?.client_id"), 'ClientDetail must explicitly support payload.client_id.');

const listenerStart = client.indexOf('STAGE228R15_CLIENT_CONTEXT_ACTION_REFRESH_LISTENER');
const listenerEnd = listenerStart >= 0 ? client.indexOf('window.setTimeout', listenerStart) : -1;
const listenerSlice = listenerStart >= 0 && listenerEnd > listenerStart ? client.slice(listenerStart, listenerEnd) : '';
assert(listenerSlice, 'Could not isolate ClientDetail context-action-saved listener.');
assert(!listenerSlice.includes('setClientMissingListOpenStage232I6(true)'), 'ClientDetail context-action-saved listener still auto-opens all-missing window.');
assert(listenerSlice.includes('must not auto-open') || listenerSlice.includes('nie otwiera'), 'ClientDetail listener needs explicit no-auto-open marker/comment.');

const addTileStart = client.indexOf('onAddMissing={() => {');
const addTileEnd = addTileStart >= 0 ? client.indexOf('}}', addTileStart) : -1;
const addTileSlice = addTileStart >= 0 && addTileEnd > addTileStart ? client.slice(addTileStart, addTileEnd + 2) : '';
assert(addTileSlice.includes('setClientMissingModalOpen(true)'), 'Client tile Dodaj brak must open quick add modal.');
assert(!addTileSlice.includes('setClientMissingListOpenStage232I6(true)'), 'Client tile Dodaj brak still opens all-missing manager.');
assert(client.includes('data-stage232i4-r14-client-missing-lead-vst="true"'), 'Client missing tile lacks R14 lead visual source marker.');
assert(client.includes('data-stage232i4-r14-missing-manager-dialog="client"'), 'Client manager dialog lacks R14 marker.');

assert(client.includes('sourceEntityType') && client.includes('sourceEntityId') && client.includes('recordType') && client.includes('recordId'), 'Client saved/optimistic missing item lacks full source-of-truth fields.');

const leadViewAllStart = lead.indexOf('data-stage232a-r9-view-all-missing-action="true"');
const leadViewAllEnd = leadViewAllStart >= 0 ? lead.indexOf('>', lead.indexOf('</button>', leadViewAllStart)) : -1;
const leadViewAllSlice = leadViewAllStart >= 0 && leadViewAllEnd > leadViewAllStart ? lead.slice(leadViewAllStart, leadViewAllEnd) : '';
assert(lead.includes('leadMissingManagerOpen'), 'LeadDetail lacks missing manager open state.');
assert(lead.includes('setLeadMissingManagerOpen(true)'), 'LeadDetail Zobacz wszystkie braki does not open manager dialog.');
assert(!leadViewAllSlice.includes('scrollIntoView'), 'LeadDetail Zobacz wszystkie braki still scrolls as the only action.');
assert(lead.includes('<MissingItemsManagerDialog'), 'LeadDetail does not render shared MissingItemsManagerDialog.');
assert(lead.includes('handleToggleLeadMissingBlockerStage232I4R14'), 'LeadDetail missing blocker toggle handler.');

for (const token of ['data-stage232i4-r14-manager-row="true"', 'data-stage232i4-r14-manager-row-checkbox="true"', 'Uzupełnione', 'Usuń']) {
  assert(manager.includes(token), `Shared manager missing row contract token: ${token}`);
}

assert(!lead.includes('STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION'), 'R14 must not implement Owner Control I3 runtime.');
assert(!client.includes('CREATE TABLE') && !lead.includes('CREATE TABLE'), 'R14 must not contain SQL migration content.');

if (failures.length) {
  console.error('STAGE232I4_R14 guard FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE232I4_R14 guard PASS');
