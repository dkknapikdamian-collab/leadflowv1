#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const componentPath = path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx');
const src = fs.readFileSync(componentPath, 'utf8');

assert.match(src, /STAGE232I4_R11_MISSING_MANAGER_ROW_LAYOUT/);
assert.match(src, /data-stage232i4-r11-row-layout="title-first-control-row"/);
assert.match(src, /data-stage232i4-r11-manager-row="title-first-card-controls-below"/);
assert.match(src, /data-stage232i4-r11-manager-blocker-column="blocker-row-below-title"/);
assert.match(src, /data-stage232i4-r11-manager-title-column="true"/);
assert.match(src, /data-stage232i4-r11-manager-item-title="true"/);
assert.match(src, /data-stage232i4-r11-manager-actions-column="actions-row-right"/);
assert.match(src, /managerItemTitle\(item\)/);
assert.match(src, /payload\?\.missingItemTitle/);
assert.match(src, /payload\?\.missing_item_title/);
assert.match(src, /Priorytet blokujący/);
assert.match(src, /Nie blokuje/);
assert.match(src, /Uzupełnione/);
assert.match(src, /Usuń/);

const titleIndex = src.indexOf('data-stage232i4-r11-manager-item-title="true"');
const blockerIndex = src.indexOf('data-stage232i4-r11-manager-blocker-column="blocker-row-below-title"');
const actionsIndex = src.indexOf('data-stage232i4-r11-manager-actions-column="actions-row-right"');
assert(titleIndex > -1 && blockerIndex > titleIndex && actionsIndex > blockerIndex, 'R11/R12 row order must be title, blocker/status, actions.');

assert.doesNotMatch(src, /data-stage232i4-r11-manager-row-grid="checkbox-title-actions"/);
assert.doesNotMatch(src, /lg:grid-cols-\[140px_minmax\(0,1fr\)_auto\]/);
assert.doesNotMatch(src, /data-stage232i4-r11-manager-actions-column="right-separated"/);

console.log('STAGE232I4_R11 missing manager row layout guard PASS');
