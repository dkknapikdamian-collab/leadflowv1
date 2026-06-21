const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');

test('R16Z_R4 keeps blocker source truth guard', () => {
  assert.match(client, /priority === 'high'/);
});

test('R16Z_R4 modal uses viewport safe production width', () => {
  assert.match(manager, /!w-\[760px\]/);
  assert.match(manager, /sm:!max-w-\[760px\]/);
});

test('R16Z_R4 row uses flex instead of clipped grid', () => {
  assert.match(manager, /flex w-full min-w-0 items-center gap-2 overflow-visible/);
  assert.doesNotMatch(manager, /grid w-full min-w-0 grid-cols-\[92px_minmax\(120px,1fr\)_88px_66px\]/);
});

test('R16Z_R4 blocker label and delete action are visible', () => {
  assert.match(manager, /w-\[118px\] min-w-\[118px\]/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-blocker-text="readable"/);
  assert.match(manager, /font-black leading-none text-slate-950/);
  assert.match(manager, /w-\[78px\] min-w-\[78px\]/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-delete-visible="true"/);
});