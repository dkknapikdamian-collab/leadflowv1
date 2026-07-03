const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const r = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(r(p))
const read = (p) => fs.readFileSync(r(p), 'utf8')

test('004O static calendar no-drift contract', () => {
  for (const file of [
    'src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts',
    '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
    '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md',
    '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
    'src/lib/calendar-items.ts',
  ]) assert.equal(exists(file), true, file)

  const adapter = read('src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts')
  const report = read('_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md')
  const report004n = read('_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md')
  const host = read('src/lib/calendar-items.ts')

  for (const marker of [
    'LF-PROD-SOT-004O',
    'CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT',
    'READONLY_METADATA_IMPORT_ONLY',
    'READONLY_RUNTIME_BOUNDARY_IMPORT',
    'NO_OUTPUT_DRIFT',
    'NO_GCAL_CHANGE',
    'SMOKE_DEFERRED_DEBT_FROM_004M',
    'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
    'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
    'FORBIDDEN',
  ]) assert.match(adapter, new RegExp(marker))

  for (const marker of [
    'CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED',
    'NO_OUTPUT_DRIFT',
    'NO_GCAL_CHANGE',
    'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
    'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
  ]) assert.match(report, new RegExp(marker))

  assert.match(report004n, /LOCAL_RERUN_PASS_AFTER_R2/)
  assert.match(host, /calendarStatusDateReadonlyRuntimeReport/)
  assert.match(host, /void calendarStatusDateReadonlyRuntimeReport/)
})

test('004O does not create 004P or forbidden adapter imports', () => {
  assert.equal(fs.readdirSync(r('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004P')), false)
  const adapter = read('src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts')
  const importLines = adapter.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
  for (const forbidden of ['react', 'react-dom', '../pages/', '../components/', './pages/', './components/', '.css', 'google-calendar', 'gcal', 'calendar-sync', 'calendar-provider', 'CaseDetail', 'case-detail', 'finance/', 'supabase', 'fetch(', 'axios']) {
    assert.equal(importLines.includes(forbidden), false, forbidden)
  }
  for (const forbiddenRuntime of ['document.', 'window.', 'localStorage.', 'sessionStorage.']) {
    assert.equal(adapter.includes(forbiddenRuntime), false, forbiddenRuntime)
  }
})