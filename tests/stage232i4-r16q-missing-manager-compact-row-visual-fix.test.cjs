const assert = require('assert');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const root = process.cwd();
const manager = fs.readFileSync(path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx'), 'utf8');
const client = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');

test('R16Q keeps shared manager stage isolated to visual layout', () => {
  assert.match(manager, /STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX/);
  assert.match(client, /STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL/);
  assert.match(client, /<MissingItemsManagerDialog/);
});

test('missing item card uses one compact horizontal row on desktop', () => {
  assert.match(manager, /data-stage232i4-r16q-manager-card-layout="single-horizontal-row"/);
  assert.match(manager, /xl:grid-cols-\[auto_minmax\(180px,1fr\)_minmax\(200px,1\.2fr\)_auto_auto\]/);
  assert.match(manager, /data-stage232i4-r11-manager-blocker-column="blocker-inline"/);
  assert.match(manager, /data-stage232i4-r11-manager-actions-column="actions-inline-right"/);
});

test('old vertical card layout is removed', () => {
  assert.doesNotMatch(manager, /title-first-controls-below/);
  assert.doesNotMatch(manager, /title-first-card-controls-below/);
});

test('add form text and input are readable on dark background', () => {
  assert.match(manager, /cf-missing-manager-add-form-stage232i4-r16q/);
  assert.match(manager, /text-slate-100/);
  assert.match(manager, /bg-slate-900 text-slate-50 placeholder:text-slate-500/);
  assert.doesNotMatch(manager, /cf-missing-manager-title-field-stage232i4-r14 block text-sm font-medium text-slate-200/);
});

test('resolve delete and blocker actions are preserved', () => {
  assert.match(manager, /data-stage232i4-r14-manager-resolve-action="true"/);
  assert.match(manager, /data-stage232i4-r14-manager-delete-action="true"/);
  assert.match(manager, /onToggleBlocker\(item, event\.target\.checked\)/);
  assert.match(manager, /onResolve\(item\)/);
  assert.match(manager, /onDelete\(item\)/);
});

test('R16Q scope does not introduce SQL or Owner Control code', () => {
  assert.doesNotMatch(manager, /create table|alter table|drop table/i);
  assert.doesNotMatch(manager, /Owner Control|owner-control/i);
});
