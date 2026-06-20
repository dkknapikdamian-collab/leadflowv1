
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx','utf8');
const fallback = fs.readFileSync('src/lib/supabase-fallback.ts','utf8');
const start = fallback.indexOf('export async function updateTaskInSupabase');
const end = fallback.indexOf('export async function hardDeleteTaskFromSupabase', start);
const block = fallback.slice(start, end);

test('R16V keeps compact approved missing manager layout', () => {
  assert.match(manager, /data-stage232i4-r16s-r2-manager-row="aligned-compact-fixed-columns"/);
  assert.match(manager, /data-stage232i4-r16t-manager-card-layout="checkbox-title-done-delete-fixed-columns-no-badges"/);
  assert.match(manager, /grid-cols-\[92px_minmax\(120px,1fr\)_66px_54px\]/);
  assert.doesNotMatch(manager, />Klient</);
});

test('R16V adds visible Blokuje text next to checkbox', () => {
  assert.match(manager, /data-stage232i4-r16v-manager-blocker-text="true">Blokuje<\/span>/);
  assert.match(manager, /w-\[92px\].*gap-2/s);
});

test('R16V updateTaskInSupabase uses consolidated system tasks route', () => {
  assert.match(block, /\/api\/system\?apiRoute=tasks/);
  assert.doesNotMatch(block, /'\/api\/tasks'/);
  assert.match(block, /sourceId: taskId/);
  assert.match(block, /mutationCacheCategory: 'task'/);
});

test('R16V scope does not touch SQL or CaseDetail', () => {
  assert.doesNotMatch(manager + fallback, /ALTER TABLE|CREATE POLICY|DROP POLICY|CaseDetail R16V/);
});
