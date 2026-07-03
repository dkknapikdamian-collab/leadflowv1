const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const exists = (p) => fs.existsSync(rel(p))

test('004Q closure gate files and previous reports exist', () => {
  for (const f of [
    'src/lib/source-of-truth/readonly-rewire-closure-gate.ts',
    '_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md',
    '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
    '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md',
    '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
    '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
    '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md',
  ]) assert.equal(exists(f), true, f)
})

test('004Q keeps smoke debt active and does not claim manual smoke PASS', () => {
  const report = read('_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md')
  for (const marker of ['SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','FINAL_MANUAL_SMOKE_GATE_REQUIRED','Does this stage claim smoke PASS: NO']) assert.ok(report.includes(marker), marker)
  for (const forbidden of ['MANUAL_SMOKE_PASS_CLAIMED','FULL_MANUAL_SMOKE_PASS','Manual smoke: PASS']) assert.equal(report.includes(forbidden), false, forbidden)
})

test('004Q previous no-drift markers are present', () => {
  assert.ok(read('_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md').includes('LOCAL_RERUN_PASS_AFTER_R2'))
  assert.ok(read('_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md').includes('NO_GCAL_CHANGE'))
  assert.ok(read('_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md').includes('LISTS_CARDS_OUTPUT_UNCHANGED'))
})

test('004Q adapter has only allowed SOT imports and no 004R exists', () => {
  const adapter = read('src/lib/source-of-truth/readonly-rewire-closure-gate.ts')
  const importLines = adapter.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
  for (const allowed of ['./today-status-date-readonly-runtime','./tasks-status-date-readonly-runtime','./calendar-status-date-readonly-runtime','./list-cards-status-date-readonly-runtime']) assert.ok(importLines.includes(allowed), allowed)
  for (const forbidden of ['react','react-dom','../pages/','./pages/','../components/','./components/','.css','google-calendar','gcal','calendar-sync','calendar-provider','CaseDetail','case-detail','finance/','supabase','fetch(','axios']) assert.equal(importLines.includes(forbidden), false, forbidden)
  assert.equal(fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004R')), false)
})