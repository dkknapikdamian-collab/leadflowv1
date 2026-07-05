const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const test = require('node:test')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')

const guardRel = 'scripts/guards/verify-lf-prod-sot-005c-r1-canonical-status-api-contract-guard.cjs'
const testRel = 'tests/lf-prod-sot-005c-r1-canonical-status-api-contract-guard.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA.md'
const statusRepositoryRel = 'src/lib/source-of-truth/status-repository.ts'
const leadOptionsRel = 'src/lib/source-of-truth/lead-options.ts'
const caseOptionsRel = 'src/lib/source-of-truth/case-options.ts'
const leadFacadeRel = 'src/lib/config/lead-status.ts'
const caseFacadeRel = 'src/lib/config/case-status.ts'

function assertIncludesAll(text, tokens, label) {
  for (const token of tokens) assert.ok(text.includes(token), `${label} missing ${token}`)
}

test('005C-R1 files exist', () => {
  for (const file of [guardRel, testRel, reportRel, statusRepositoryRel, leadOptionsRel, caseOptionsRel, leadFacadeRel, caseFacadeRel]) {
    assert.ok(exists(file), `${file} missing`)
  }
})

test('005C-R1 guard defines canonical status API contract checks', () => {
  const guard = read(guardRel)
  assertIncludesAll(guard, [
    'assertCanonicalApiContract',
    'assertNoNewLocalStatusMaps',
    'STATUS_REPOSITORY_SOURCE_MAP',
    'LEAD_STATUS_META_BY_VALUE',
    'CASE_STATUS_META_BY_VALUE',
    'CASE_CLOSED_STATUSES',
    'NO_RUNTIME_REWIRE',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
  ], guardRel)
})

test('005C-R1 report records guard-only no-drift contract', () => {
  const report = read(reportRel)
  assertIncludesAll(report, [
    'CANONICAL_STATUS_API_CONTRACT_GUARD_ADDED',
    'GUARD_ONLY',
    'CONTRACT_ONLY',
    'NO_RUNTIME_REWIRE',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'SRC_TOUCHED: NO',
    'FINAL_ACCEPTANCE_BLOCKED',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-005C-R2_DOMAIN_STATUSES_FACADE_DECISION_DO_POTWIERDZENIA',
    '005C_R2_CREATED: NO',
  ], reportRel)
})

test('005C-R1 does not claim runtime rewire, smoke pass or final acceptance', () => {
  const report = read(reportRel)
  for (const forbidden of [
    'STATUS_REWIRE_DONE',
    'STATUS_DRIFT_FIXED',
    'FINAL_MANUAL_SMOKE_GATE_PASS',
    'PRODUCTION_HOST_SMOKE_PASS',
    'FINAL_ACCEPTANCE_PASS',
    'FINAL_ACCEPTANCE_UNBLOCKED',
    'PRODUCTION_VERIFIED',
    'RUNTIME_IMPORT_DONE',
    'OUTPUT_CHANGED',
    'UI_CHANGED',
    'CSS_CHANGED',
    'GCAL_CHANGED',
    'SQL_CHANGED',
  ]) {
    assert.equal(report.includes(forbidden), false, `report contains forbidden claim ${forbidden}`)
  }
})

test('005C-R1 does not touch runtime source, UI, CSS, SQL, Supabase, GCal, finance or data flows', () => {
  const forbiddenPrefixes = [
    'src/',
    'supabase/',
    'migrations/',
    'sql/',
    'runtime/data/',
    'data/flows.json',
    '.env',
    'dist/',
    '_project/tmp/',
  ]
  const changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean)
  for (const file of changed) {
    assert.equal(forbiddenPrefixes.some((prefix) => file.startsWith(prefix)), false, `forbidden changed file: ${file}`)
  }
})

test('005C-R1 guard executes successfully', () => {
  childProcess.execFileSync('node', [guardRel], { cwd: root, stdio: 'pipe' })
})
