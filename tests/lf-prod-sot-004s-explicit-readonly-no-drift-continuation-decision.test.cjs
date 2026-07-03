const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const exists = (p) => fs.existsSync(rel(p))

const report004rRel = '_project/runs/LF-PROD-SOT-004R_FINAL_MANUAL_SMOKE_GATE_PRODUCTION_PROOF.md'
const report004sRel = '_project/runs/LF-PROD-SOT-004S_EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_DECISION.md'
const guard004sRel = 'scripts/guards/verify-lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision.cjs'
const pkgRel = 'package.json'

test('004S report, guard, package alias and 004R input exist', () => {
  for (const f of [report004rRel, report004sRel, guard004sRel, pkgRel]) assert.equal(exists(f), true, f)
  assert.match(read(pkgRel), /verify:lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision/)
})

test('004R remains blocked proof, not PASS', () => {
  const r = read(report004rRel)
  for (const m of ['HONEST_BLOCKED_PROOF','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE','FINAL_ACCEPTANCE_BLOCKED']) assert.ok(r.includes(m), m)
  for (const bad of ['FINAL_MANUAL_SMOKE_GATE_PASS','PRODUCTION_HOST_SMOKE_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED']) assert.equal(r.includes(bad), false, bad)
})

test('004S records explicit readonly/no-drift continuation decision', () => {
  const s = read(report004sRel)
  for (const m of ['EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_APPROVED','NEXT_STAGES_ALLOWED_ONLY_IF_READONLY_NO_DRIFT','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE','FINAL_ACCEPTANCE_BLOCKED','004T_CREATED: NO']) assert.ok(s.includes(m), m)
})

test('004S does not touch runtime/UI/CSS/SQL/Supabase/GCal/CaseDetail/Finance', () => {
  const s = read(report004sRel)
  for (const m of ['NO_RUNTIME_CHANGE','NO_OUTPUT_DRIFT','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','NO_CASEDETAIL_CHANGE','NO_FINANCE_CHANGE']) assert.ok(s.includes(m), m)
})

test('004T does not exist', () => {
  const runFiles = fs.readdirSync(rel('_project/runs'))
  assert.equal(runFiles.some((n) => n.includes('LF-PROD-SOT-004T')), false)
})
