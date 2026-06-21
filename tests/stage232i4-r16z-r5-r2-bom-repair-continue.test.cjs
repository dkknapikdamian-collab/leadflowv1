const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

test('R16Z_R5_R2 removes BOM from manager source', () => {
  assert.notEqual(manager.charCodeAt(0), 0xFEFF);
});

test('R16Z_R5_R2 preserves final missing manager layout', () => {
  assert.match(manager, /STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE/);
  assert.match(manager, /!w-\[760px\]/);
  assert.match(manager, /flex w-full min-w-0 items-center gap-2 overflow-visible/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-blocker-text="readable"/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-delete-visible="true"/);
});

test('R16Z_R5_R2 preserves blocker source truth', () => {
  assert.match(client, /priority === 'high'/);
});