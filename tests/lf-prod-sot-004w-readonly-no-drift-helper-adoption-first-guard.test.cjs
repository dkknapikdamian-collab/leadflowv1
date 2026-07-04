const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')
const exists = (p) => fs.existsSync(rel(p))

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
const test004wRel = 'tests/lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.test.cjs'
const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
const pkgRel = 'package.json'

function changedFiles() {
  try {
    const out = childProcess.execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' }).trim()
    return out ? out.split(/\r?\n/) : []
  } catch (_) {
    return []
  }
}

test('helper exists', () => {
  assert.equal(exists(helperRel), true)
  const helper = require(rel(helperRel))
  for (const name of ['assertRequiredTokens', 'assertForbiddenTokensAbsent', 'assertNoForbiddenChangedFiles', 'readText', 'assertFileExists']) {
    assert.equal(typeof helper[name], 'function', 'helper missing ' + name)
  }
})

test('004U guard imports helper and uses required helper functions', () => {
  assert.equal(exists(guard004uRel), true)
  const txt = read(guard004uRel)
  assert.match(txt, /const helper = require\(path\.join\(process\.cwd\(\), 'scripts\/guards\/lib\/lf-prod-sot-readonly-no-drift-contract\.cjs'\)\)/)
  for (const name of ['assertRequiredTokens', 'assertForbiddenTokensAbsent', 'assertNoForbiddenChangedFiles', 'readText', 'assertFileExists']) {
    assert.match(txt, new RegExp('\\b' + name + '\\b'), 'missing helper function usage ' + name)
  }
})

test('004W report, guard, test and package alias exist', () => {
  assert.equal(exists(report004wRel), true)
  assert.equal(exists(guard004wRel), true)
  assert.equal(exists(test004wRel), true)
  assert.match(read(pkgRel), /verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard/)
})

test('004W does not create 004X and selects 004X only as next stage', () => {
  const runsDir = rel('_project/runs')
  const names = fs.readdirSync(runsDir)
  assert.equal(names.some((name) => name.includes('LF-PROD-SOT-004X')), false)
  const report = read(report004wRel)
  assert.match(report, /NEXT_STAGE_SELECTED: LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS/)
  assert.match(report, /004X_CREATED: NO/)
})

test('004W does not claim smoke or final acceptance', () => {
  const report = read(report004wRel)
  for (const token of [
    'FINAL_MANUAL_SMOKE_GATE_PASS',
    'PRODUCTION_HOST_SMOKE_PASS',
    'TODAY_SMOKE_PASS',
    'TASKS_SMOKE_PASS',
    'CALENDAR_SMOKE_PASS',
    'LISTS_CARDS_SMOKE_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
    'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE: SATISFIED',
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
    assert.equal(report.includes(token), false, 'forbidden positive claim in report: ' + token)
  }
  assert.match(report, /PRODUCTION_HOST_SMOKE_NOT_EXECUTED/)
  assert.match(report, /MANUAL_SMOKE_STILL_NOT_PASS/)
  assert.match(report, /FINAL_ACCEPTANCE_BLOCKED/)
})

test('004W does not touch runtime or product paths in staged diff', () => {
  const allowed = new Set([
    'package.json',
    guard004uRel,
    guard004vRel,
    guard004wRel,
    test004wRel,
    report004wRel,
  ])
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

  for (const file of changedFiles()) {
    assert.equal(allowed.has(file), true, 'changed file outside 004W allowlist: ' + file)
    assert.equal(forbiddenPrefixes.some((prefix) => file.startsWith(prefix)), false, 'forbidden runtime/product path touched: ' + file)
  }
})
