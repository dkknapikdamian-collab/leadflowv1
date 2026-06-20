const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const text = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('R16S_R2 narrows modal to content instead of full viewport', () => {
  assert.match(text, /!w-\[720px\]/);
  assert.doesNotMatch(text, /!w-\[96vw\]/);
  assert.doesNotMatch(text, /!max-w-\[1040px\]/);
});

test('R16S_R2 aligns fixed columns in one compact row', () => {
  assert.match(text, /grid-cols-\[90px_92px_minmax\(120px,1fr\)_68px_56px\]/);
  assert.match(text, /data-stage232i4-r16s-r2-manager-card-layout="badge-checkbox-title-done-delete-fixed-columns"/);
});

test('R16S_R2 makes blocker checkbox visible and fixed', () => {
  assert.match(text, /data-stage232i4-r16s-r2-manager-blocker-column="visible-fixed-checkbox"/);
  assert.match(text, /h-4 w-4/);
  assert.match(text, /ring-1 ring-white\/20/);
});

test('R16S_R2 uses small fixed action buttons without icons', () => {
  assert.match(text, /data-stage232i4-r16s-r2-manager-resolve-column="fixed"/);
  assert.match(text, /data-stage232i4-r16s-r2-manager-delete-column="fixed"/);
  assert.doesNotMatch(text, /CheckCircle2|Trash2/);
});

test('R16S_R2 stays visual only', () => {
  assert.doesNotMatch(text, /supabase|create table|alter table|Owner Control|CaseDetail/);
});
