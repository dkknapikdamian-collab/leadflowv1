const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const assert = require('node:assert/strict')

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const exists = (p) => fs.existsSync(path.join(root, p))

const report004r = '_project/runs/LF-PROD-SOT-004R_FINAL_MANUAL_SMOKE_GATE_PRODUCTION_PROOF.md'
const guard004r = 'scripts/guards/verify-lf-prod-sot-004r-final-manual-smoke-gate-production-proof.cjs'
const report004q = '_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'

test('004R report, guard, package alias and 004Q input exist', () => {
  assert.equal(exists(report004r), true)
  assert.equal(exists(guard004r), true)
  assert.equal(exists(report004q), true)
  assert.match(read('package.json'), /verify:lf-prod-sot-004r-final-manual-smoke-gate-production-proof/)
})

test('004R does not touch runtime/UI/CSS/SQL/Supabase/GCal/CaseDetail/Finance by contract', () => {
  const r = read(report004r)
  for (const token of ['NO_RUNTIME_CHANGE','NO_OUTPUT_DRIFT','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','NO_CASEDETAIL_CHANGE','NO_FINANCE_CHANGE']) {
    assert.match(r, new RegExp(token))
  }
})

test('004R cannot claim PASS without all production smoke markers', () => {
  const r = read(report004r)
  const hasPass = r.includes('FINAL_MANUAL_SMOKE_GATE_PASS') || r.includes('PRODUCTION_HOST_SMOKE_PASS')
  if (hasPass) {
    for (const token of ['TODAY_SMOKE_PASS','TASKS_SMOKE_PASS','CALENDAR_SMOKE_PASS','LISTS_CARDS_SMOKE_PASS','PRODUCTION_HOST_SMOKE_PASS']) {
      assert.match(r, new RegExp(token))
    }
  } else {
    for (const token of ['HONEST_BLOCKED_PROOF','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE','FINAL_ACCEPTANCE_BLOCKED']) {
      assert.match(r, new RegExp(token))
    }
  }
})

test('004R does not create 004S', () => {
  const runs = fs.readdirSync(path.join(root, '_project/runs'))
  assert.equal(runs.some((name) => name.includes('LF-PROD-SOT-004S')), false)
  assert.match(read(report004r), /004S_CREATED: NO/)
})