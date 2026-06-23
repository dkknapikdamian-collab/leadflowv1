const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('STAGE232G R1B Today adapter exists and depends on R1A contract', () => {
  const adapter = read('src/lib/calendar-operational-entry-today-adapter.ts');
  assert.match(adapter, /STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT/);
  assert.match(adapter, /getTodayTaskMomentRaw/);
  assert.match(adapter, /getTodayEventMomentRaw/);
  assert.match(adapter, /getTodayLeadMomentRaw/);
  assert.match(adapter, /getTodayOperationalDayKey/);
  assert.match(adapter, /calendar-operational-entry-contract/);
});

test('STAGE232G R1B TodayStable imports adapter and delegates date helpers', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.match(today, /calendar-operational-entry-today-adapter/);
  assert.match(today, /getTodayTaskMomentRaw/);
  assert.match(today, /getTodayEventMomentRaw/);
  assert.match(today, /getTodayLeadMomentRaw/);
  assert.match(today, /getTodayOperationalDayKey/);
});

test('STAGE232G R1B guard and reports are present', () => {
  assert.ok(fs.existsSync(path.join(root, 'scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs')));
  assert.ok(fs.existsSync(path.join(root, '_project/runs/STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md')));
  assert.ok(fs.existsSync(path.join(root, '_project/obsidian_updates/2026-06-23_STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md')));
});
