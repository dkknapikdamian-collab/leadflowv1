const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

test('R16T removes visual Klient/Blokuje badges from row layout', () => {
  assert.ok(manager.includes('data-stage232i4-r16t-manager-card-layout="checkbox-title-done-delete-fixed-columns-no-badges"'));
  assert.ok(!manager.includes('data-stage232i4-r16s-r2-manager-badges-cell'));
  assert.ok(!manager.includes('>Blokuje</span>'));
  assert.ok(!manager.includes('>Info</span>'));
});

test('R16T keeps checkbox visible as the blocker control', () => {
  assert.ok(manager.includes('data-stage232i4-r16t-manager-blocker-column="checkbox-only-visible"'));
  assert.ok(manager.includes('checked={isBlocker}'));
  assert.ok(manager.includes('onChange={(event) => void onToggleBlocker(item, event.target.checked)}'));
  assert.ok(manager.includes('bg-slate-100'));
});

test('R16T fixes client missing blocker toggle with full normalized task patch', () => {
  assert.ok(client.includes('stage232i4_r16t_client_missing_blocker_toggle_existing_fix'));
  assert.ok(client.includes('const existingTask = Array.isArray(tasks)'));
  assert.ok(client.includes("title: String(sourceTask?.title || item?.title || 'Brak')"));
  assert.ok(client.includes('payload: nextPayload'));
  assert.ok(client.includes('}, [client?.id, clientId, hasAccess, reload, tasks]);'));
});

test('R16T stays narrow and visual/handler only', () => {
  assert.ok(manager.includes('!w-[560px]'));
  assert.ok(!manager.includes('grid-cols-[90px_92px_minmax(120px,1fr)_68px_56px]'));
  assert.ok(!manager.includes('Owner Control'));
  assert.ok(!client.includes('Owner Control'));
});
