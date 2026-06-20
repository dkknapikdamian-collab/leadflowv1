const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

test('ClientDetail renders shared manager for client missing items', () => {
  assert.ok(client.includes('<MissingItemsManagerDialog'));
  assert.ok(client.includes('open={clientMissingListOpenStage232I6}'));
  assert.ok(client.includes('scopeLabel="Klient"'));
  assert.ok(!client.includes('client-detail-missing-window-dialog-simple'));
});

test('client manager adapter preserves title fallback sources', () => {
  assert.ok(client.includes('items={stage232i2AllActiveMissingItems.map'));
  assert.ok(client.includes('item?.title'));
  assert.ok(client.includes('item?.name'));
  assert.ok(client.includes('raw?.title'));
  assert.ok(client.includes('payload?.title'));
  assert.ok(client.includes('payload?.content'));
  assert.ok(client.includes('payload?.note'));
  assert.ok(client.includes('Brak bez nazwy'));
});

test('manager has wide readable R16 marker and width', () => {
  assert.ok(manager.includes('data-stage232i4-r16-manager-wide-readable="true"'));
  assert.ok(manager.includes('xl:w-[1100px]'));
  assert.ok(manager.includes('data-missing-item-title-block="true"'));
});

test('client top tile has targeted R16 visual marker', () => {
  assert.ok(client.includes('data-client-top-tile="missing-blockers"'));
  assert.ok(client.includes('data-stage232i4-r16-client-missing-lead-vst="true"'));
});

test('quick add and manager paths stay separate', () => {
  assert.ok(client.includes('setClientMissingModalOpen(true)'));
  assert.ok(client.includes('setClientMissingListOpenStage232I6(false)'));
  assert.ok(client.includes('setClientMissingListOpenStage232I6(true)'));
});

test('LeadDetail still uses shared missing manager', () => {
  assert.ok(lead.includes('<MissingItemsManagerDialog'));
  assert.ok(lead.includes('scopeLabel="Lead"'));
});

test('R16O scope does not touch SQL or Owner Control code paths', () => {
  assert.ok(!client.includes('case_items'));
  assert.ok(!client.includes('owner-control'));
});
