const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const client = () => read('src/pages/ClientDetail.tsx');
const lead = () => read('src/pages/LeadDetail.tsx');
const manager = () => read('src/components/detail/MissingItemsManagerDialog.tsx');

test('Client add missing uses source fields and optimistic active item fields', () => {
  const content = client();
  assert.match(content, /sourceEntityType:\s*'client'/);
  assert.match(content, /sourceEntityId:\s*safeClientId/);
  assert.match(content, /recordType:\s*'client'/);
  assert.match(content, /recordId:\s*safeClientId/);
  assert.match(content, /blocksProgress:\s*clientMissingBlocksProgress/);
});

test('Client add missing does not auto-open all-missing manager after save/listener', () => {
  const content = client();
  const listenerStart = content.indexOf('STAGE228R15_CLIENT_CONTEXT_ACTION_REFRESH_LISTENER');
  const listenerEnd = content.indexOf('window.setTimeout', listenerStart);
  assert.ok(listenerStart >= 0 && listenerEnd > listenerStart);
  const listenerSlice = content.slice(listenerStart, listenerEnd);
  assert.ok(!listenerSlice.includes('setClientMissingListOpenStage232I6(true)'));
  const addTileStart = content.indexOf('onAddMissing={() => {');
  const addTileEnd = content.indexOf('}}', addTileStart);
  const addTileSlice = content.slice(addTileStart, addTileEnd + 2);
  assert.match(addTileSlice, /setClientMissingModalOpen\(true\)/);
  assert.ok(!addTileSlice.includes('setClientMissingListOpenStage232I6(true)'));
});

test('Client relation filter reads direct, snake_case and payload relation ids', () => {
  const content = client();
  assert.match(content, /readStage232I4R14RelationId/);
  for (const token of ['clientId', 'client_id', 'sourceEntityId', 'recordId', 'entityId', 'leadId', 'lead_id', 'caseId', 'case_id']) {
    assert.ok(content.includes(token), token);
  }
  assert.ok(content.includes('(payload as any)?.clientId') || content.includes('payload?.clientId') || content.includes('payload.clientId'));
  assert.ok(content.includes('(payload as any)?.client_id') || content.includes('payload?.client_id') || content.includes('payload.client_id'));
});

test('Client manager remains explicit view-all action and has R14 marker', () => {
  const content = client();
  assert.match(content, /onOpenMissing=\{\(\) => \{/);
  assert.match(content, /setClientMissingListOpenStage232I6\(true\)/);
  assert.match(content, /data-stage232i4-r14-missing-manager-dialog="client"/);
  assert.match(content, /data-stage232i4-r14-client-missing-lead-vst="true"/);
});

test('Lead view-all opens manager dialog instead of legacy scroll-only behavior', () => {
  const content = lead();
  assert.match(content, /leadMissingManagerOpen/);
  assert.match(content, /setLeadMissingManagerOpen\(true\)/);
  assert.match(content, /<MissingItemsManagerDialog/);
  const start = content.indexOf('data-stage232a-r9-view-all-missing-action="true"');
  const end = content.indexOf('</button>', start);
  const slice = content.slice(start, end);
  assert.ok(!slice.includes('scrollIntoView'));
});

test('Lead manager row can toggle blocker, resolve and delete source item', () => {
  const content = lead();
  assert.match(content, /handleToggleLeadMissingBlockerStage232I4R14/);
  assert.match(content, /blocksProgress/);
  assert.match(content, /blocking_missing_item/);
  assert.match(content, /handleResolveLeadMissingItemStage228R13/);
  assert.match(content, /handleDeleteLeadMissingItemStage228R15/);
});

test('Shared manager row contract includes title, checkbox, Uzupełnione and Usuń', () => {
  const content = manager();
  assert.match(content, /data-stage232i4-r14-manager-row="true"/);
  assert.match(content, /data-stage232i4-r14-manager-row-checkbox="true"/);
  assert.match(content, /Uzupełnione/);
  assert.match(content, /Usuń/);
});

test('No SQL or Owner Control I3 runtime is introduced in R14 touched pages', () => {
  const combined = `${client()}\n${lead()}\n${manager()}`;
  assert.ok(!combined.includes('CREATE TABLE'));
  assert.ok(!combined.includes('ALTER TABLE'));
  assert.ok(!combined.includes('STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION'));
});
