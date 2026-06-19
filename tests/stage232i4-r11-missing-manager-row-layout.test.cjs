const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const src = fs.readFileSync(path.join(process.cwd(), 'src/components/detail/MissingItemsManagerDialog.tsx'), 'utf8');

test('R11/R12 uses title-first row layout: title block, blocker row, actions row', () => {
  assert.match(src, /STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT/);
  assert.match(src, /data-stage232i4-r11-row-layout="title-first-control-row"/);
  assert.match(src, /data-stage232i4-r11-manager-blocker-column="blocker-row-below-title"/);
  assert.match(src, /data-stage232i4-r11-manager-title-column="true"/);
  assert.match(src, /data-stage232i4-r11-manager-actions-column="actions-row-right"/);
  assert.doesNotMatch(src, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
});

test('R11/R12 makes the missing item name explicitly visible and robustly resolved', () => {
  assert.match(src, /function managerItemTitle\(item: MissingItemsManagerItem\)/);
  assert.match(src, /Nazwa braku/);
  assert.match(src, /data-stage232i4-r11-manager-item-title="true"/);
  assert.match(src, /data-stage232i4-r12-manager-item-title="primary-visible-name"/);
  assert.match(src, /payload\?\.missingTitle/);
  assert.match(src, /payload\?\.missing_item_title/);
  assert.match(src, /payload\?\.content/);
});

test('R11/R12 keeps row actions separate from the title so buttons do not crowd text', () => {
  const titleIndex = src.indexOf('data-missing-item-title-block="true"');
  const blockerIndex = src.indexOf('data-missing-item-blocker-row="true"');
  const actionsIndex = src.indexOf('data-missing-item-actions-row="true"');
  assert.ok(titleIndex > -1, 'title marker missing');
  assert.ok(blockerIndex > titleIndex, 'blocker row should be below title');
  assert.ok(actionsIndex > blockerIndex, 'actions should be separated after blocker controls');
  assert.doesNotMatch(src, /data-stage232i4-r11-manager-actions-column="right-separated"/);
});

test('R11/R12 preserves R14/R10/R9 contracts', () => {
  assert.match(src, /data-stage232i4-r14-manager-row-contract="title-checkbox-resolve-delete"/);
  assert.match(src, /data-stage232i4-r10-readable-layout="true"/);
  assert.match(src, /priority === 'high'/);
  assert.match(src, /data-stage232i4-r14-manager-resolve-action="true"/);
  assert.match(src, /data-stage232i4-r14-manager-delete-action="true"/);
});
