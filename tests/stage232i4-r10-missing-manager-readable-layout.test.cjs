const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const src = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('dialog uses application dark modal style and remains readable', () => {
  assert.match(src, /STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT/);
  assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
  assert.match(src, /bg-slate-950/);
  assert.match(src, /text-slate-100/);
  assert.match(src, /text-slate-300/);
  assert.match(src, /border-slate-700/);
  assert.match(src, /max-w-4xl/);
  assert.match(src, /sm:max-w-4xl/);
});

test('rows are separated cards with scrollable list for many missing items', () => {
  assert.match(src, /data-stage232i4-r10-manager-list="separated-scrollable-cards"/);
  assert.match(src, /max-h-\[48vh\]/);
  assert.match(src, /overflow-y-auto/);
  assert.match(src, /space-y-3/);
  assert.match(src, /data-stage232i4-r10-manager-row="separated-card"/);
  assert.match(src, /rounded-2xl/);
  assert.match(src, /border border-slate-700/);
});

test('row actions have their own separated action bar and do not crowd title', () => {
  assert.match(src, /data-stage232i4-r10-manager-row-actions="separated-flex-wrap-gap"/);
  assert.match(src, /border-t border-slate-800/);
  assert.match(src, /flex flex-wrap items-center gap-2/);
  assert.match(src, /data-stage232i4-r14-manager-row-checkbox="true"/);
  assert.match(src, /data-stage232i4-r14-manager-resolve-action="true"/);
  assert.match(src, /data-stage232i4-r14-manager-delete-action="true"/);
  assert.match(src, /<CheckCircle2/);
  assert.match(src, /<Trash2/);
});

test('R10 preserves R14 manager contract and R9 blocker signal', () => {
  assert.match(src, /data-stage232i4-r14-missing-manager-dialog/);
  assert.match(src, /data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"/);
  assert.match(src, /priority === 'high'/);
  assert.match(src, /Blokuje sprawę/);
  assert.match(src, /Brak informacyjny/);
});
