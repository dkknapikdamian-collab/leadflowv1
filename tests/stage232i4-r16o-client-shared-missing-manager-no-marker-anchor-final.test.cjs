const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

test('R16O still protects ClientDetail shared manager wiring', () => {
  assert.ok(client.includes('<MissingItemsManagerDialog'));
  assert.ok(client.includes('open={clientMissingListOpenStage232I6}'));
  assert.ok(client.includes('scopeLabel="Klient"'));
  assert.ok(client.includes('onToggleBlocker={handleToggleClientMissingBlockerStage232I4R13F}'));
  assert.ok(client.includes('onResolve={handleResolveClientMissingItemStage228R13}'));
  assert.ok(client.includes('onDelete={handleDeleteClientMissingItemStage228R15}'));
  assert.ok(!client.includes('client-detail-missing-window-dialog-simple'));
});

test('R16O client manager adapter preserves title fallback sources', () => {
  assert.ok(client.includes('items={stage232i2AllActiveMissingItems.map'));
  assert.ok(client.includes('item?.title'));
  assert.ok(client.includes('item?.name'));
  assert.ok(client.includes('raw?.title'));
  assert.ok(client.includes('payload?.title'));
  assert.ok(client.includes('payload?.content'));
  assert.ok(client.includes('payload?.note'));
  assert.ok(client.includes('Brak bez nazwy'));
});

test('R16O is consolidated with final R16Z_R4 760px flex layout, not old 1100px layout', () => {
  assert.ok(manager.includes('STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP'));
  assert.ok(manager.includes('!w-[760px]'));
  assert.ok(manager.includes('sm:!max-w-[760px]'));
  assert.ok(manager.includes('flex w-full min-w-0 items-center gap-2 overflow-visible'));
  assert.ok(manager.includes('data-stage232i4-r16z-r4-manager-blocker-text="readable"'));
  assert.ok(manager.includes('data-stage232i4-r16z-r4-manager-delete-visible="true"'));
  assert.ok(!manager.includes('xl:w-[1100px]'));
  assert.ok(!manager.includes('grid w-full min-w-0 grid-cols-[92px_minmax(120px,1fr)_88px_66px]'));
});

test('quick add and manager paths stay separate in ClientDetail', () => {
  assert.ok(client.includes('setClientMissingModalOpen(true)'));
  assert.ok(client.includes('setClientMissingListOpenStage232I6(false)'));
  assert.ok(client.includes('setClientMissingListOpenStage232I6(true)'));
});

test('LeadDetail still uses the same shared missing manager', () => {
  assert.ok(lead.includes('<MissingItemsManagerDialog'));
  assert.ok(lead.includes('open={leadMissingManagerOpen}'));
  assert.ok(lead.includes('scopeLabel="Lead"'));
  assert.ok(lead.includes('items={leadMissingManagerItemsStage232I4R14}'));
});

test('R16O scope does not touch SQL or Owner Control code paths', () => {
  assert.ok(!client.includes('case_items'));
  assert.ok(!client.includes('owner-control'));
});
