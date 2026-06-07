const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');

const moduleFile = fs.readFileSync('src/lib/missing-items/stage227c2-missing-item-modal-contract.ts', 'utf8');
const componentFile = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');

test('Stage227C2 defines a small Brak modal contract', () => {
  assert.match(moduleFile, /STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL/);
  assert.match(moduleFile, /MISSING_ITEM_QUICK_ACTION_LABEL = 'Brak'/);
  assert.match(moduleFile, /Czego brakuje\?/);
  assert.match(moduleFile, /required: true/);
  assert.match(componentFile, /data-stage227c2-missing-item-modal="true"/);
  assert.match(componentFile, /role="dialog"/);
});

test('Stage227C2 keeps persistence lightweight and outside the modal', () => {
  assert.match(moduleFile, /case_items/);
  assert.match(moduleFile, /task_activity_missing_item/);
  assert.doesNotMatch(moduleFile, /create table/i);
  assert.doesNotMatch(moduleFile, /supabase\.from/);
  assert.doesNotMatch(componentFile, /supabase\.from/);
  assert.doesNotMatch(componentFile, /\.insert\(/);
});

test('Stage227C2 validates missing item title before runtime wiring', () => {
  assert.match(moduleFile, /normalizeMissingItemTitle/);
  assert.match(moduleFile, /validateMissingItemTitle/);
  assert.match(moduleFile, /Wpisz, czego brakuje\./);
});
