const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const exists = (p) => fs.existsSync(rel(p))

const report004tRel = '_project/runs/LF-PROD-SOT-004T_NEXT_READONLY_NO_DRIFT_SCOPE_SELECTION_MAP.md'
const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
const test004uRel = 'tests/lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.test.cjs'
const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const pkgRel = 'package.json'

test('004U report, guard, test and package alias exist', () => {
  assert.equal(exists(report004uRel), true)
  assert.equal(exists(guard004uRel), true)
  assert.equal(exists(test004uRel), true)
  assert.match(read(pkgRel), /verify:lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan/)
})

test('004T selected 004U before this stage', () => {
  const t = read(report004tRel)
  assert.match(t, /SCOPE_SELECTION_MAP_ONLY/)
  assert.match(t, /PLAN_ONLY/)
  assert.match(t, /NEXT_STAGE_SELECTED: LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN/)
  assert.match(t, /004U_CREATED: NO/)
})

test('004U is plan-only guard-hardening plan', () => {
  const u = read(report004uRel)
  assert.match(u, /GUARD_HARDENING_PLAN_ONLY/)
  assert.match(u, /PLAN_ONLY/)
  assert.match(u, /NO_RUNTIME_CHANGE/)
  assert.match(u, /NO_OUTPUT_DRIFT/)
  assert.match(u, /PRODUCTION_HOST_SMOKE_NOT_EXECUTED/)
  assert.match(u, /MANUAL_SMOKE_STILL_NOT_PASS/)
  assert.match(u, /FINAL_ACCEPTANCE_BLOCKED/)
})

test('004U does not create helper or 004V but selects 004V', () => {
  const u = read(report004uRel)
  assert.match(u, /NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION/)
  assert.match(u, /004V_CREATED: NO/)
  assert.match(u, /GUARD_HELPER_CREATED: NO/)
  assert.equal(exists(helperRel), false)
  const runNames = fs.readdirSync(rel('_project/runs'))
  assert.equal(runNames.some((name) => name.includes('LF-PROD-SOT-004V')), false)
})

test('004U does not claim smoke PASS or final acceptance', () => {
  const u = read(report004uRel)
  for (const bad of [
    'FINAL_MANUAL_SMOKE_GATE_PASS',
    'PRODUCTION_HOST_SMOKE_PASS',
    'TODAY_SMOKE_PASS',
    'TASKS_SMOKE_PASS',
    'CALENDAR_SMOKE_PASS',
    'LISTS_CARDS_SMOKE_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
    'FINAL_ACCEPTANCE_PASS',
    'FINAL_ACCEPTANCE_UNBLOCKED',
    'PRODUCTION_VERIFIED',
    'RUNTIME_IMPORT_DONE',
  ]) assert.doesNotMatch(u, new RegExp(bad))
})

test('004U does not touch forbidden product domains', () => {
  const u = read(report004uRel)
  for (const marker of [
    'NO_UI_CHANGE',
    'NO_CSS_CHANGE',
    'NO_SQL_CHANGE',
    'NO_SUPABASE_API_CHANGE',
    'NO_GCAL_CHANGE',
    'NO_CASEDETAIL_CHANGE',
    'NO_FINANCE_CHANGE',
    'NO_RUNTIME_DATA_CHANGE',
    'NO_DATA_FLOWS_CHANGE',
  ]) assert.match(u, new RegExp(marker))
})
