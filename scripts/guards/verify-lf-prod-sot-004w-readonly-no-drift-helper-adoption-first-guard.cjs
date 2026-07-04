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
  console.error('[004W] FAIL ' + message)
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

function assertPackageAliasOrder(pkg, pkgRel) {
  const aliasV = '"verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation"'
  const aliasW = '"verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard"'
  const aliasX = '"verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards"'
  const posV = pkg.indexOf(aliasV)
  const posW = pkg.indexOf(aliasW)
  const posX = pkg.indexOf(aliasX)

  if (posV === -1) fail(pkgRel + ' missing 004V alias')
  if (posW === -1) fail(pkgRel + ' missing 004W alias')
  if (posW <= posV) fail(pkgRel + ' 004W alias is not after 004V alias')
  if (posX !== -1 && posX <= posW) fail(pkgRel + ' 004X alias is not after 004W alias')

  const betweenVW = pkg.slice(posV, posW)
  if (betweenVW.includes('"check:a25-nearest-planned-action"')) {
    fail(pkgRel + ' 004W alias is not directly after 004V alias')
  }

  if (posX !== -1) {
    const betweenWX = pkg.slice(posW, posX)
    if (betweenWX.includes('"check:a25-nearest-planned-action"')) {
      fail(pkgRel + ' 004X alias is not directly after 004W alias')
    }
  }
}

function main() {
  const report004vR3Rel = '_project/runs/LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR.md'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const report004xRel = '_project/runs/LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS.md'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
  const test004wRel = 'tests/lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.test.cjs'
  const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
  const pkgRel = 'package.json'

  for (const f of [helperRel, report004vR3Rel, report004wRel, guard004uRel, guard004vRel, guard004wRel, test004wRel, pkgRel]) {
    assertFileExists(f)
  }

  for (const name of [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'readText',
    'assertFileExists',
    'assertNoFutureStageCreated',
  ]) {
    if (typeof helper[name] !== 'function') fail('helper missing function export: ' + name)
  }
  if (!Array.isArray(DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES)) fail('helper missing DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES')
  if (!Array.isArray(DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS)) fail('helper missing DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS')

  const report004vR3 = readText(report004vR3Rel)
  const report004w = readText(report004wRel)
  const guard004u = readText(guard004uRel)
  const guard004v = readText(guard004vRel)
  const guard004w = readText(guard004wRel)
  const test004w = readText(test004wRel)
  const pkg = readText(pkgRel)

  assertRequiredTokens(report004vR3, [
    'ACTUAL_PACKAGE_ALIAS_REPAIRED',
    'PACKAGE_JSON_HAS_004V_ALIAS: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ], report004vR3Rel)

  assertRequiredTokens(pkg, [
    'verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard',
  ], pkgRel)
  assertPackageAliasOrder(pkg, pkgRel)

  assertRequiredTokens(guard004u, [
    "const path = require('node:path')",
    "const helper = require(path.join(process.cwd(), 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'))",
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'readText',
    'assertFileExists',
  ], guard004uRel)

  assertRequiredTokens(guard004v, [
    'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs',
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'readText',
    'assertFileExists',
    'DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES',
    'DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS',
  ], guard004vRel)

  assertRequiredTokens(report004w, [
    'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    'HELPER_ADOPTION_FIRST_GUARD_ONLY',
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
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
    'HELPER_FUNCTIONS_USED: assertRequiredTokens, assertForbiddenTokensAbsent, assertNoForbiddenChangedFiles, readText, assertFileExists',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    '004X_CREATED: NO',
  ], report004wRel)

  assertRequiredTokens(guard004w, [
    'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    'assertNoFutureStageCreated',
    'LF-PROD-SOT-004Y',
    'DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES',
    'DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS',
  ], guard004wRel)

  assertRequiredTokens(test004w, [
    'helper exists',
    '004U guard imports helper',
    '004W does not create 004X',
  ], test004wRel)

  if (exists(report004xRel)) {
    const report004x = readText(report004xRel)
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
      'NEXT_STAGE_SELECTED: LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
      '004Y_CREATED: NO',
    ], report004xRel)
    assertForbiddenTokensAbsent(report004x, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004xRel)
    for (const f of [guard004xRel, test004xRel]) assertFileExists(f)
    assertRequiredTokens(pkg, ['verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards'], pkgRel)
  } else {
    assertNoFutureStageCreated('LF-PROD-SOT-004X')
  }

  assertForbiddenTokensAbsent(report004w, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004wRel)
  assertNoFutureStageCreated('LF-PROD-SOT-004Y')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      guard004uRel,
      guard004vRel,
      guard004wRel,
      guard004xRel,
      test004wRel,
      test004xRel,
      report004wRel,
      report004xRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004wRel, guard004uRel, guard004vRel, guard004wRel, test004wRel, ...(exists(report004xRel) ? [report004xRel, guard004xRel, test004xRel] : [])]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: exists(report004xRel) ? 'LF-PROD-SOT-004X_COMPAT_FROM_004W' : 'LF-PROD-SOT-004W',
    mode: exists(report004xRel) ? 'ACTUAL_004X_SELECTED_NEXT_STAGE_ALLOWED' : 'HELPER_ADOPTION_FIRST_GUARD_ONLY',
    guardOnly: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    helperAdoptedIn: 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    nextStageSelected: exists(report004xRel) ? 'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS' : 'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    created004Y: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
