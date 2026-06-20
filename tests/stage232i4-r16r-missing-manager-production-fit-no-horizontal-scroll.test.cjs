const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const text = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('R16R removes top add form from manager', () => {
  assert(!text.includes('CloseFlowDialogSection'));
  assert(!text.includes('cf-missing-manager-add-form-stage232i4-r14'));
  assert(!text.includes('data-stage232i4-r14-manager-add-form'));
});

test('R16R removes horizontal scroll risk and wide grid contract', () => {
  assert(text.includes('overflow-x-hidden'));
  assert(text.includes('data-stage232i4-r16r-manager-card-layout="single-visible-row-no-horizontal-scroll"'));
  assert(!text.includes('overflow-x-auto'));
  assert(!text.includes('xl:grid-cols-[auto_minmax'));
});

test('R16R removes noisy filler copy', () => {
  assert(!text.includes('Kartoteka klienta'));
  assert(!text.includes('Nazwa braku'));
  assert(text.includes('data-stage232i4-r16r-manager-item-title="inline-only"'));
});

test('R16R keeps actions and blocker controls', () => {
  assert(text.includes('onToggleBlocker(item, event.target.checked)'));
  assert(text.includes('onResolve(item)'));
  assert(text.includes('onDelete(item)'));
  assert(text.includes('Gotowe'));
  assert(text.includes('Usuń'));
});

test('R16R stays visual only', () => {
  assert(!text.includes('create table'));
  assert(!text.includes('alter table'));
  assert(!text.includes('Owner Control'));
});
