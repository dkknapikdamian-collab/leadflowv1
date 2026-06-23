const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const stage = 'STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE';
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }

test('R1F guard and reports exist', () => {
  assert.equal(exists('scripts/check-stage232g-r1f-calendar-today-final-parity-guard-and-smoke.cjs'), true);
  assert.equal(exists('tests/stage232g-r1f-calendar-today-final-parity-guard-and-smoke.test.cjs'), true);
  assert.equal(exists('_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md'), true);
  assert.equal(exists('_project/obsidian_updates/2026-06-23_STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md'), true);
});

test('R1F guard checks the full R1A-R1E1 series', () => {
  const guard = read('scripts/check-stage232g-r1f-calendar-today-final-parity-guard-and-smoke.cjs');
  for (const token of [
    'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT',
    'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT',
    'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP',
    'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT',
    'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE',
    'STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME',
  ]) assert.ok(guard.includes(token), `guard missing ${token}`);
});

test('R1F smoke checklist is recorded', () => {
  const run = read('_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md');
  for (const token of ['Calendar month/week', 'tooltip/kolory', 'Today task/event/lead shadow', 'brak fake done/delete', 'DevTools']) {
    assert.ok(run.includes(token), `run report missing smoke item ${token}`);
  }
});

test('R1F does not authorize another planned stage', () => {
  const run = read('_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md');
  assert.ok(run.includes('NEXT_PLANNED_STAGE: NONE'));
  assert.ok(run.includes('only bugfixes from current series'));
});
