const path = require('node:path')

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const helper = require(path.join(process.cwd(), helperRel))

const {
  assertRequiredTokens,
  assertForbiddenTokensAbsent,
  assertNoForbiddenChangedFiles,
  assertNoFutureStageCreated,
  assertFileExists,
  readText,
  DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS,
} = helper

function fail(message) {
  console.error('[004X] FAIL ' + message)
  process.exit(1)
}

function exists(filePath) {
  try {
    assertFileExists(filePath)
    return true
  } catch (_) {
    return false
  }
}

function assertHelperContract() {
  for (const name of [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'readText',
    'assertFileExists',
  ]) {
    if (typeof helper[name] !== 'function') fail('helper missing function export: ' + name)
  }
  if (!Array.isArray(DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES)) fail('helper missing DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES')
  if (!Array.isArray(DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS)) fail('helper missing DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS')
}

function assertPackageAliasOrder(pkg, pkgRel) {
  const aliasW = '"verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard"'
  const aliasX = '"verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards"'
  const posW = pkg.indexOf(aliasW)
  const posX = pkg.indexOf(aliasX)
  if (posW === -1) fail(pkgRel + ' missing 004W alias')
  if (posX === -1) fail(pkgRel + ' missing 004X alias')
  if (posX <= posW) fail(pkgRel + ' 004X alias is not after 004W alias')
  const between = pkg.slice(posW, posX)
  if (between.includes('"check:a25-nearest-planned-action"')) {
    fail(pkgRel + ' 004X alias is not directly after 004W alias')
  }
}

function assertGuardUsesHelper(guardText, guardRel) {
  assertRequiredTokens(guardText, [
    helperRel,
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'readText',
    'assertFileExists',
    'DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES',
    'DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS',
  ], guardRel)
}

function main() {
  const pkgRel = 'package.json'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const report004xRel = '_project/runs/LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS.md'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
  const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
  const report004yRel = '_project/runs/LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE.md'
  const guard004yRel = 'scripts/guards/verify-lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.cjs'
  const test004yRel = 'tests/lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.test.cjs'

  for (const f of [helperRel, pkgRel, report004wRel, report004xRel, guard004vRel, guard004wRel, guard004xRel, test004xRel]) {
    assertFileExists(f)
  }

  assertHelperContract()

  const pkg = readText(pkgRel)
  const report004w = readText(report004wRel)
  const report004x = readText(report004xRel)
  const guard004v = readText(guard004vRel)
  const guard004w = readText(guard004wRel)
  const guard004x = readText(guard004xRel)
  const test004x = readText(test004xRel)

  assertPackageAliasOrder(pkg, pkgRel)

  assertRequiredTokens(report004w, [
    'HELPER_ADOPTION_FIRST_GUARD_ONLY',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    '004X_CREATED: NO',
  ], report004wRel)

  assertRequiredTokens(report004x, [
    'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    'HELPER_ADOPTION_SCOPE_GUARDS_ONLY',
    'GUARD_ONLY',
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
    'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    'MANUAL_SMOKE_STILL_NOT_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    'FINAL_ACCEPTANCE_BLOCKED',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs',
    'HELPER_FUNCTIONS_USED: assertRequiredTokens, assertForbiddenTokensAbsent, assertNoForbiddenChangedFiles, assertNoFutureStageCreated, readText, assertFileExists',
    '004W_R2_OBSIDIAN_CLOSEOUT_STATUS_SYNC_CONFIRMED',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
    '004Y_CREATED: NO',
  ], report004xRel)

  assertGuardUsesHelper(guard004v, guard004vRel)
  assertGuardUsesHelper(guard004w, guard004wRel)
  assertGuardUsesHelper(guard004x, guard004xRel)

  assertRequiredTokens(test004x, [
    'helper exists',
    '004V guard imports helper',
    '004W guard imports helper',
    '004X does not create 004Y',
  ], test004xRel)

  assertForbiddenTokensAbsent(report004x, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004xRel)
  if (exists(report004yRel)) {
    assertFileExists(guard004yRel)
    assertFileExists(test004yRel)
    const report004y = readText(report004yRel)
    assertRequiredTokens(report004y, [
      'LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
      'HELPER_ADOPTION_CLOSEOUT_GATE_ONLY',
      'GUARD_ONLY',
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
      'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
      'MANUAL_SMOKE_STILL_NOT_PASS',
      'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
      'FINAL_ACCEPTANCE_BLOCKED',
      'HELPER_ADOPTION_SERIES_REVIEWED: YES',
      'HELPER_ADOPTION_SERIES_APP_GUARDS_PRESENT: YES',
      'HELPER_ADOPTION_SERIES_OBSIDIAN_STATUS_PRESENT: YES',
      'NEXT_DECISION_REQUIRED: FINAL_MANUAL_SMOKE_GATE_OR_EXPLICIT_NEXT_READONLY_NO_DRIFT_STAGE',
      '004Z_CREATED: NO',
    ], report004yRel)
    assertForbiddenTokensAbsent(report004y, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004yRel)
  } else {
    assertNoFutureStageCreated('LF-PROD-SOT-004Y')
  }
  assertNoFutureStageCreated('LF-PROD-SOT-004Z')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      guard004vRel,
      guard004wRel,
      guard004xRel,
      test004xRel,
      report004xRel,
      report004yRel,
      guard004yRel,
      test004yRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004wRel, report004xRel, guard004vRel, guard004wRel, guard004xRel, test004xRel]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: 'LF-PROD-SOT-004X',
    mode: 'HELPER_ADOPTION_SCOPE_GUARDS_ONLY',
    guardOnly: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    helperAdoptedIn: [
      'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs',
      'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs',
    ],
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    nextStageSelected: 'LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
    created004Y: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
