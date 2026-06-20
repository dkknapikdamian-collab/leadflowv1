const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('fs');

const supabase = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('R16W sanitizes invalid task status before PATCH', () => {
  assert.match(supabase, /STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH/);
  assert.match(supabase, /function normalizeWorkItemTaskStatusForDomainStage232I4R16W/);
  assert.match(supabase, /delete taskPatch\.status/);
  assert.doesNotMatch(supabase, /body:\s*JSON\.stringify\(\{\s*\.\.\.input,\s*id:\s*taskId\s*\}\)/);
});

test('R16W keeps only legal task status literals in sanitizer', () => {
  const helperMatch = supabase.match(/function normalizeWorkItemTaskStatusForDomainStage232I4R16W[\s\S]*?\n}\n/);
  assert.ok(helperMatch, 'status sanitizer helper missing');
  const helper = helperMatch[0];
  assert.match(helper, /'todo'/);
  assert.match(helper, /'in_progress'/);
  assert.match(helper, /'done'/);
  assert.doesNotMatch(helper, /missing_item/);
});

test('R16W still uses consolidated system tasks route', () => {
  assert.match(supabase, /\/api\/system\?apiRoute=tasks/);
  assert.match(supabase, /mutationCacheCategory:\s*'task'/);
});

test('R16W preserves approved compact blocker UI', () => {
  assert.match(manager, />\s*Blokuje\s*</);
  assert.doesNotMatch(manager, />Klient</);
  assert.doesNotMatch(manager, /overflow-x-auto/);
  assert.doesNotMatch(manager, /data-stage232i4-r16s-r2-source-badges/);
});
