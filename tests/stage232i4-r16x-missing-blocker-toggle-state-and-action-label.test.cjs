const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('R16X toggle persists blocker state through legal priority mapping', () => {
  assert.match(client, /nextPriorityStage232I4R16X\s*=\s*blocksProgress \? 'high' : 'medium'/);
  assert.match(client, /priority:\s*nextPriorityStage232I4R16X/);
});

test('R16X toggle PATCH does not send invalid missing status to work_items.status', () => {
  const toggleStart = client.indexOf('const handleToggleClientMissingBlockerStage232I4R13F');
  const toggleEnd = client.indexOf('const handleResolveClientMissingItemStage228R13', toggleStart);
  assert.ok(toggleStart > 0 && toggleEnd > toggleStart);
  const toggleBlock = client.slice(toggleStart, toggleEnd);
  const updateStart = toggleBlock.indexOf('await updateTaskInSupabase({');
  const updateEnd = toggleBlock.indexOf('} as any);', updateStart);
  assert.ok(updateStart > 0 && updateEnd > updateStart);
  const updatePayload = toggleBlock.slice(updateStart, updateEnd);
  assert.equal(/\n\s*status\s*:/.test(updatePayload), false);
});

test('R16X keeps accepted compact manager UI and visible blocker label', () => {
  assert.match(manager, /data-stage232i4-r16x-toggle-state-visual-guard="checkbox-label-delete-action"/);
  assert.match(manager, /data-stage232i4-r16v-manager-blocker-text="true">Blokuje<\/span>/);
  assert.doesNotMatch(manager, />Klient</);
  assert.doesNotMatch(manager, /overflow-x-auto/);
});

test('R16X has delete action and clearer completion label', () => {
  assert.match(manager, /data-stage232i4-r14-manager-delete-action="true"/);
  assert.match(manager, />\s*Usuń\s*<\/Button>/);
  assert.match(manager, />\s*Uzupełnij\s*<\/Button>/);
  assert.doesNotMatch(manager, />\s*Gotowe\s*<\/Button>/);
});
