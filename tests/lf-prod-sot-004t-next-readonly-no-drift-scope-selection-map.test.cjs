const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const exists = (p) => fs.existsSync(rel(p))

const report004sRel = '_project/runs/LF-PROD-SOT-004S_EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_DECISION.md'
const report004tRel = '_project/runs/LF-PROD-SOT-004T_NEXT_READONLY_NO_DRIFT_SCOPE_SELECTION_MAP.md'
const guard004tRel = 'scripts/guards/verify-lf-prod-sot-004t-next-readonly-no-drift-scope-selection-map.cjs'
const pkgRel = 'package.json'

test('004T report, guard and package alias exist', () => {
  assert.equal(exists(report004tRel), true)
  assert.equal(exists(guard004tRel), true)
  assert.match(read(pkgRel), /verify:lf-prod-sot-004t-next-readonly-no-drift-scope-selection-map/)
})

test('004S is explicit continuation decision and not smoke PASS', () => {
  const s = read(report004sRel)
  assert.match(s, /EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_APPROVED/)
  assert.match(s, /NEXT_STAGES_ALLOWED_ONLY_IF_READONLY_NO_DRIFT/)
  assert.match(s, /PRODUCTION_HOST_SMOKE_NOT_EXECUTED/)
  assert.match(s, /FINAL_ACCEPTANCE_BLOCKED/)
  assert.doesNotMatch(s, /PRODUCTION_HOST_SMOKE_PASS/)
  assert.doesNotMatch(s, /FINAL_MANUAL_SMOKE_GATE_PASS/)
})

test('004T is plan-only and scope-map-only', () => {
  const t = read(report004tRel)
  assert.match(t, /SCOPE_SELECTION_MAP_ONLY/)
  assert.match(t, /PLAN_ONLY/)
  assert.match(t, /NO_RUNTIME_CHANGE/)
  assert.match(t, /NO_OUTPUT_DRIFT/)
  assert.match(t, /PRODUCTION_HOST_SMOKE_NOT_EXECUTED/)
  assert.match(t, /FINAL_ACCEPTANCE_BLOCKED/)
})

test('004T selects 004U but does not create it', () => {
  const t = read(report004tRel)
  assert.match(t, /NEXT_STAGE_SELECTED: LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN/)
  assert.match(t, /004U_CREATED: NO/)
  const runNames = fs.readdirSync(rel('_project/runs'))
  assert.equal(runNames.some((name) => name.includes('LF-PROD-SOT-004U')), false)
})

test('004T does not touch forbidden product/runtime domains', () => {
  const t = read(report004tRel)
  for (const marker of [
    'NO_UI_CHANGE',
    'NO_CSS_CHANGE',
    'NO_SQL_CHANGE',
    'NO_SUPABASE_API_CHANGE',
    'NO_GCAL_CHANGE',
    'NO_CASEDETAIL_CHANGE',
    'NO_FINANCE_CHANGE',
  ]) assert.match(t, new RegExp(marker))
  for (const bad of [
    'PRODUCTION_HOST_SMOKE_PASS',
    'FINAL_MANUAL_SMOKE_GATE_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
    'FINAL_ACCEPTANCE_UNBLOCKED',
    'RUNTIME_IMPORT_DONE',
  ]) assert.doesNotMatch(t, new RegExp(bad))
})
