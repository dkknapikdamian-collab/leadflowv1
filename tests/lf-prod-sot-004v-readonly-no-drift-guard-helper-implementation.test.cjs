const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')
const exists = (p) => fs.existsSync(rel(p))

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const helper = require(rel(helperRel))
const report004vRel = '_project/runs/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md'
const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
const test004vRel = 'tests/lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.test.cjs'
const pkgRel = 'package.json'

test('004V helper exists and exports required functions and lists', () => {
  assert.equal(exists(helperRel), true)
  for (const fn of [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'assertFileExists',
    'readText',
  ]) assert.equal(typeof helper[fn], 'function')
  assert.equal(Array.isArray(helper.DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES), true)
  assert.equal(Array.isArray(helper.DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS), true)
})

test('004V helper functions work on positive and negative examples', () => {
  assert.doesNotThrow(() => helper.assertRequiredTokens('alpha beta', ['alpha'], 'sample'))
  assert.throws(() => helper.assertRequiredTokens('alpha beta', ['gamma'], 'sample'), /missing required token/)

  assert.doesNotThrow(() => helper.assertForbiddenTokensAbsent('alpha beta', ['gamma'], 'sample'))
  assert.throws(() => helper.assertForbiddenTokensAbsent('alpha beta', ['alpha'], 'sample'), /forbidden token/)

  assert.doesNotThrow(() => helper.assertNoForbiddenChangedFiles({
    changedFiles: ['package.json'],
    allowedChangedFiles: ['package.json'],
    forbiddenPrefixes: ['src/pages/'],
  }))
  assert.throws(() => helper.assertNoForbiddenChangedFiles({
    changedFiles: ['README.md'],
    allowedChangedFiles: ['package.json'],
    forbiddenPrefixes: ['src/pages/'],
  }), /not in allowlist/)
  assert.throws(() => helper.assertNoForbiddenChangedFiles({
    changedFiles: ['src/pages/Calendar.tsx'],
    allowedChangedFiles: ['src/pages/Calendar.tsx'],
    forbiddenPrefixes: ['src/pages/'],
  }), /forbidden changed file prefix/)

  assert.doesNotThrow(() => helper.assertNoFutureStageCreated('LF-PROD-SOT-999Z_DOES_NOT_EXIST'))
})

test('004V report, guard, test and package alias exist', () => {
  assert.equal(exists(report004vRel), true)
  assert.equal(exists(guard004vRel), true)
  assert.equal(exists(test004vRel), true)
  assert.match(read(pkgRel), /verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation/)
})

test('004V is helper implementation only and no-runtime/no-drift', () => {
  const v = read(report004vRel)
  for (const token of [
    'GUARD_HELPER_IMPLEMENTATION_ONLY',
    'PLAN_SUPPORT_ONLY',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'NO_UI_CHANGE',
    'NO_CSS_CHANGE',
    'NO_SQL_CHANGE',
    'NO_SUPABASE_API_CHANGE',
    'NO_GCAL_CHANGE',
    'NO_CASEDETAIL_CHANGE',
    'NO_FINANCE_CHANGE',
    'NO_RUNTIME_DATA_CHANGE',
    'NO_DATA_FLOWS_CHANGE',
  ]) assert.match(v, new RegExp(token))
})

test('004V creates helper, selects 004W and does not create 004W', () => {
  const v = read(report004vRel)
  assert.match(v, /GUARD_HELPER_CREATED: YES/)
  assert.match(v, /NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD/)
  assert.match(v, /004W_CREATED: NO/)
  const runNames = fs.readdirSync(rel('_project/runs'))
  assert.equal(runNames.some((name) => name.includes('LF-PROD-SOT-004W')), false)
})

test('004V does not claim smoke or final acceptance completion', () => {
  const v = read(report004vRel)
  for (const bad of helper.DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS) {
    assert.doesNotMatch(v, new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.match(v, /PRODUCTION_HOST_SMOKE_NOT_EXECUTED/)
  assert.match(v, /MANUAL_SMOKE_STILL_NOT_PASS/)
  assert.match(v, /FINAL_ACCEPTANCE_BLOCKED/)
})
