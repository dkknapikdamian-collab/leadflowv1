const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const test = require('node:test')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
const report004xRel = '_project/runs/LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS.md'
const pkgRel = 'package.json'

const requiredHelperTokens = [
  'assertRequiredTokens',
  'assertForbiddenTokensAbsent',
  'assertNoForbiddenChangedFiles',
  'assertNoFutureStageCreated',
  'readText',
  'assertFileExists',
  'DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES',
  'DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS',
]

function assertIncludesAll(text, tokens, label) {
  for (const token of tokens) assert.ok(text.includes(token), `${label} missing ${token}`)
}

test('helper exists', () => {
  assert.ok(exists(helperRel), 'helper file missing')
  const helper = require(rel(helperRel))
  for (const name of ['assertRequiredTokens', 'assertForbiddenTokensAbsent', 'assertNoForbiddenChangedFiles', 'assertNoFutureStageCreated', 'readText', 'assertFileExists']) {
    assert.equal(typeof helper[name], 'function', `helper export ${name} is not a function`)
  }
  assert.ok(Array.isArray(helper.DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES), 'missing forbidden prefix list')
  assert.ok(Array.isArray(helper.DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS), 'missing forbidden claim list')
})

test('004V guard imports helper and uses required helper functions', () => {
  const guard = read(guard004vRel)
  assert.ok(guard.includes(helperRel), '004V guard imports helper')
  assertIncludesAll(guard, requiredHelperTokens, guard004vRel)
})

test('004W guard imports helper and uses required helper functions', () => {
  const guard = read(guard004wRel)
  assert.ok(guard.includes(helperRel), '004W guard imports helper')
  assertIncludesAll(guard, requiredHelperTokens, guard004wRel)
})

test('004X report guard test and package alias exist', () => {
  assert.ok(exists(report004xRel), '004X report missing')
  assert.ok(exists(guard004xRel), '004X guard missing')
  assert.ok(exists(test004xRel), '004X test missing')
  assert.ok(read(pkgRel).includes('verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards'), '004X package alias missing')
})

test('004X does not create 004Y and selects 004Y only as next stage', () => {
  const runNames = fs.readdirSync(rel('_project/runs'))
  assert.equal(runNames.some((name) => name.includes('LF-PROD-SOT-004Y')), false, '004Y report exists too early')
  const report = read(report004xRel)
  assert.ok(report.includes('NEXT_STAGE_SELECTED: LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE'), '004X does not select 004Y')
  assert.ok(report.includes('004Y_CREATED: NO'), '004X does not mark 004Y as not created')
})

test('004X does not claim smoke pass or final acceptance', () => {
  const report = read(report004xRel)
  for (const token of [
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
    'OUTPUT_CHANGED',
    'UI_CHANGED',
    'CSS_CHANGED',
    'GCAL_CHANGED',
    'SQL_CHANGED',
  ]) {
    assert.equal(report.includes(token), false, `004X report contains forbidden claim ${token}`)
  }
})

test('004X does not touch runtime UI CSS SQL Supabase GCal CaseDetail Finance runtime-data or data-flows', () => {
  const forbiddenPrefixes = [
    'src/pages/',
    'src/components/',
    'src/styles/',
    'src/index.css',
    'src/lib/calendar-items.ts',
    'src/lib/work-items/normalize.ts',
    'src/lib/clients.ts',
    'src/lib/cases.ts',
    'src/lib/google-calendar',
    'src/lib/gcal',
    'src/lib/calendar-sync',
    'src/lib/calendar-provider',
    'src/pages/CaseDetail.tsx',
    'src/lib/finance/',
    'supabase/',
    'migrations/',
    'sql/',
    'runtime/data/',
    'data/flows.json',
    '.env',
    'dist/',
  ]
  const changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean)
  for (const file of changed) {
    assert.equal(forbiddenPrefixes.some((prefix) => file.startsWith(prefix)), false, `forbidden changed file: ${file}`)
  }
})
