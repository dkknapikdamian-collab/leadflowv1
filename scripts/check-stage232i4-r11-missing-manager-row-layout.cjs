const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const componentPath = path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx');
const src = fs.readFileSync(componentPath, 'utf8');

assert.match(src, /STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT/);
assert.match(src, /data-stage232i4-r11-row-layout="checkbox-title-actions"/);
assert.match(src, /data-stage232i4-r11-manager-row="grid-checkbox-title-actions"/);
assert.match(src, /data-stage232i4-r11-manager-row-grid="checkbox-title-actions"/);
assert.match(src, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
assert.match(src, /data-stage232i4-r11-manager-blocker-column="checkbox-label-under"/);
assert.match(src, /data-stage232i4-r11-manager-title-column="true"/);
assert.match(src, /data-stage232i4-r11-manager-item-title="true"/);
assert.match(src, /data-stage232i4-r11-manager-actions-column="right-separated"/);
assert.match(src, /managerItemTitle\(item\)/);
assert.match(src, /payload\?\.missingItemTitle/);
assert.match(src, /payload\?\.missing_item_title/);
assert.match(src, /Priorytet blokujący/);
assert.match(src, /Nie blokuje/);
assert.match(src, /Uzupełnione/);
assert.match(src, /Usuń/);

const checkboxIndex = src.indexOf('data-stage232i4-r11-manager-blocker-column="checkbox-label-under"');
const titleIndex = src.indexOf('data-stage232i4-r11-manager-item-title="true"');
const actionsIndex = src.indexOf('data-stage232i4-r11-manager-actions-column="right-separated"');
assert(checkboxIndex > -1 && titleIndex > checkboxIndex && actionsIndex > titleIndex, 'R11 row order must be checkbox/status, title, actions.');

// Guard against the cramped R10 action bar under/over the title.
assert.doesNotMatch(src, /<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3"/);
assert.doesNotMatch(src, /flex items-start gap-3[\s\S]{0,800}data-stage232i4-r10-manager-row-actions/);

console.log('STAGE232I4_R11 missing manager row layout guard PASS');
