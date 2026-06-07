const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Stage227C1 keeps Brak as lightweight quick action contract', () => {
  const doc = read('docs/stages/STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT.md');
  assert.match(doc, /Brak/);
  assert.match(doc, /Bez nowej tabeli/);
  assert.match(doc, /Bez migracji SQL/);
  assert.match(doc, /task\/activity/);
  assert.match(doc, /case_items/);
});

test('Stage227C1 routes case to case_items and lead/client to task/activity', () => {
  const source = read('src/lib/missing-items/stage227c1-missing-item-contract.ts');
  assert.match(source, /entityType === 'case'/);
  assert.match(source, /case_items_missing/);
  assert.match(source, /task_or_activity_missing_item/);
  assert.doesNotMatch(source.toLowerCase(), /supabase\.from\(/);
  assert.doesNotMatch(source.toLowerCase(), /create table/);
});

test('Stage227C1 validates missing item title before later runtime write', () => {
  const source = read('src/lib/missing-items/stage227c1-missing-item-contract.ts');
  assert.match(source, /title is required/);
  assert.match(source, /status: 'open'/);
});
