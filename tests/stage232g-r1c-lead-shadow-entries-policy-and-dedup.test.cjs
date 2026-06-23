const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('STAGE232G R1C lead shadow policy module exists and defines decisions', () => {
  const policy = read('src/lib/calendar-lead-shadow-entry-policy.ts');
  assert.match(policy, /STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP/);
  assert.match(policy, /applyLeadShadowEntryPolicy/);
  assert.match(policy, /duplicate_lead_shadow/);
  assert.match(policy, /covered_by_task_or_event/);
});

test('STAGE232G R1C lead shadow actions are limited', () => {
  const policy = read('src/lib/calendar-lead-shadow-entry-policy.ts');
  assert.match(policy, /LEAD_ALLOWED_ACTIONS/);
  assert.match(policy, /'edit'/);
  assert.match(policy, /'shift'/);
  assert.match(policy, /'open-related'/);
  const setWindow = policy.slice(policy.indexOf('LEAD_ALLOWED_ACTIONS'), policy.indexOf('LEAD_ALLOWED_ACTIONS') + 240);
  assert.doesNotMatch(setWindow, /complete|restore|delete/);
});

test('STAGE232G R1C scheduling delegates lead shadow dedup to policy', () => {
  const scheduling = read('src/lib/scheduling.ts');
  assert.match(scheduling, /calendar-lead-shadow-entry-policy/);
  assert.match(scheduling, /applyLeadShadowEntryPolicy/);
  assert.match(scheduling, /STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP/);
});

test('STAGE232G R1C guard and reports are present', () => {
  assert.ok(fs.existsSync(path.join(root, 'scripts/check-stage232g-r1c-lead-shadow-entries-policy-and-dedup.cjs')));
  assert.ok(fs.existsSync(path.join(root, '_project/runs/STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md')));
  assert.ok(fs.existsSync(path.join(root, '_project/obsidian_updates/2026-06-23_STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md')));
});
