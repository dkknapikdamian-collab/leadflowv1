const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const stage = 'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT';
function read(path) { return fs.readFileSync(path, 'utf8'); }
test('STAGE232G R1D action policy module depends on R1A contract', () => {
  const policy = read('src/lib/calendar-operational-entry-action-policy.ts');
  assert.match(policy, new RegExp(stage));
  assert.match(policy, /getSupportedOperationalEntryActions/);
  assert.match(policy, /blocked_for_lead_shadow/);
  assert.match(policy, /isOperationalEntryActionAllowed/);
});
test('STAGE232G R1D Calendar and Today import action policy', () => {
  assert.match(read('src/pages/Calendar.tsx'), /calendar-operational-entry-action-policy/);
  assert.match(read('src/pages/TodayStable.tsx'), /calendar-operational-entry-action-policy/);
});
test('STAGE232G R1D destructive handlers are guarded by contract', () => {
  const combined = read('src/pages/Calendar.tsx') + '\n' + read('src/pages/TodayStable.tsx');
  assert.match(combined, /STAGE232G_R1D_COMPLETE_ACTION_CONTRACT_GUARD/);
  assert.match(combined, /STAGE232G_R1D_DELETE_ACTION_CONTRACT_GUARD/);
  assert.match(combined, /STAGE232G_R1D_RESTORE_ACTION_CONTRACT_GUARD/);
  assert.match(combined, /isOperationalEntryActionAllowed/);
});
test('STAGE232G R1D guard and reports are present', () => {
  assert.ok(fs.existsSync('scripts/check-stage232g-r1d-calendar-actions-respect-operational-entry-contract.cjs'));
  assert.ok(fs.existsSync('_project/runs/STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md'));
  assert.ok(fs.existsSync('_project/obsidian_updates/2026-06-23_STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md'));
});
