const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const src = fs.readFileSync(path.join(process.cwd(), 'src/components/detail/MissingItemsManagerDialog.tsx'), 'utf8');

test('R11 uses wide row layout: blocker column, title column, actions column', () => {
  assert.match(src, /STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT/);
  assert.match(src, /data-stage232i4-r11-manager-row-grid="checkbox-title-actions"/);
  assert.match(src, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
  assert.match(src, /data-stage232i4-r11-manager-blocker-column="checkbox-label-under"/);
  assert.match(src, /data-stage232i4-r11-manager-title-column="true"/);
  assert.match(src, /data-stage232i4-r11-manager-actions-column="right-separated"/);
});

test('R11 makes the missing item name explicitly visible and robustly resolved', () => {
  assert.match(src, /function managerItemTitle\(item: MissingItemsManagerItem\)/);
  assert.match(src, /Nazwa braku/);
  assert.match(src, /data-stage232i4-r11-manager-item-title="true"/);
  assert.match(src, /payload\?\.missingTitle/);
  assert.match(src, /payload\?\.missing_item_title/);
  assert.match(src, /payload\?\.content/);
});

test('R11 keeps row actions separate from the title so buttons do not crowd text', () => {
  const titleIndex = src.indexOf('data-stage232i4-r11-manager-item-title="true"');
  const actionsIndex = src.indexOf('data-stage232i4-r11-manager-actions-column="right-separated"');
  assert.ok(titleIndex > -1, 'title marker missing');
  assert.ok(actionsIndex > titleIndex, 'actions should appear after title column');
  assert.match(src, /lg:min-w-\[220px\]/);
  assert.match(src, /xl:min-w-\[250px\]/);
  assert.doesNotMatch(src, /<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3"/);
});

test('R11 preserves R14/R10/R9 contracts', () => {
  assert.match(src, /data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"/);
  assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
  assert.match(src, /priority === 'high'/);
  assert.match(src, /data-stage232i4-r14-manager-resolve-action="true"/);
  assert.match(src, /data-stage232i4-r14-manager-delete-action="true"/);
});
