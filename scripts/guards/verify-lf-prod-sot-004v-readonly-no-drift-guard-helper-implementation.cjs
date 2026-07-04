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
  console.error('[004V] FAIL ' + message)
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
  const aliasU = '"verify:lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan"'
  const aliasV = '"verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation"'
  const aliasW = '"verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard"'
  const aliasX = '"verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards"'
  const posU = pkg.indexOf(aliasU)
  const posV = pkg.indexOf(aliasV)
  const posW = pkg.indexOf(aliasW)
  const posX = pkg.indexOf(aliasX)

  if (posU === -1) fail(pkgRel + ' missing 004U alias')
  if (posV === -1) fail(pkgRel + ' missing 004V alias')
  if (posV <= posU) fail(pkgRel + ' 004V alias is not after 004U alias')
  if (posW !== -1 && posW <= posV) fail(pkgRel + ' 004W alias is not after 004V alias')
  if (posX !== -1 && posW !== -1 && posX <= posW) fail(pkgRel + ' 004X alias is not after 004W alias')

  const between = pkg.slice(posU, posV)
  if (between.includes('"check:a25-nearest-planned-action"')) {
    fail(pkgRel + ' 004V alias is not adjacent to LF-PROD-SOT sequence after 004U alias')
  }
}

function main() {
  const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
  const report004vRel = '_project/runs/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md'
  const report004vR2Rel = '_project/runs/LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX.md'
  const report004vR3Rel = '_project/runs/LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR.md'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const report004xRel = '_project/runs/LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS.md'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const test004vRel = 'tests/lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.test.cjs'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
  const test004wRel = 'tests/lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.test.cjs'
  const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
  const pkgRel = 'package.json'

  for (const f of [report004uRel, report004vRel, report004vR2Rel, report004vR3Rel, helperRel, guard004vRel, test004vRel, pkgRel]) assertFileExists(f)

  const requiredFunctions = [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'assertFileExists',
    'readText',
  ]
  for (const name of requiredFunctions) {
    if (typeof helper[name] !== 'function') throw new Error('helper missing function export: ' + name)
  }
  if (!Array.isArray(DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES)) throw new Error('helper missing default forbidden prefix list')
  if (!Array.isArray(DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS)) throw new Error('helper missing default forbidden positive-claim list')

  const report004u = readText(report004uRel)
  const report004v = readText(report004vRel)
  const report004vR2 = readText(report004vR2Rel)
  const report004vR3 = readText(report004vR3Rel)
  const pkg = readText(pkgRel)

  assertRequiredTokens(report004u, [
    'LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    '004V_CREATED: NO',
    'GUARD_HELPER_CREATED: NO',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004uRel)

  assertRequiredTokens(report004v, [
    'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
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
    'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    'MANUAL_SMOKE_STILL_NOT_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    'FINAL_ACCEPTANCE_BLOCKED',
    'GUARD_HELPER_CREATED: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ], report004vRel)

  assertRequiredTokens(report004vR2, [
    'LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX',
    'PACKAGE_ALIAS_REPAIRED',
    '004V_CLOSEOUT_REPAIRED',
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
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ], report004vR2Rel)

  assertRequiredTokens(report004vR3, [
    'LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR',
    'ACTUAL_PACKAGE_ALIAS_REPAIRED',
    'R2_FALSE_CLOSEOUT_REPAIRED',
    '004V_CLOSEOUT_REPAIRED',
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
    'PACKAGE_JSON_HAS_004V_ALIAS: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ], report004vR3Rel)

  assertRequiredTokens(pkg, [
    'verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation',
  ], pkgRel)
  assertPackageAliasOrder(pkg, pkgRel)

  assertForbiddenTokensAbsent(report004v, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004vRel)
  assertForbiddenTokensAbsent(report004vR2, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004vR2Rel)
  assertForbiddenTokensAbsent(report004vR3, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004vR3Rel)

  if (exists(report004wRel)) {
    const report004w = readText(report004wRel)
    assertRequiredTokens(report004w, [
      'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
      'HELPER_ADOPTION_FIRST_GUARD_ONLY',
      'GUARD_ONLY',
      'NO_RUNTIME_CHANGE',
      'NO_OUTPUT_DRIFT',
      'FINAL_ACCEPTANCE_BLOCKED',
      'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
      'NEXT_STAGE_SELECTED: LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
      '004X_CREATED: NO',
    ], report004wRel)
    assertForbiddenTokensAbsent(report004w, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004wRel)
    for (const f of [guard004wRel, test004wRel]) assertFileExists(f)
    assertRequiredTokens(pkg, ['verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard'], pkgRel)
  }

  if (exists(report004xRel)) {
    const report004x = readText(report004xRel)
    assertRequiredTokens(report004x, [
      'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
      'HELPER_ADOPTION_SCOPE_GUARDS_ONLY',
      'GUARD_ONLY',
      'NO_RUNTIME_CHANGE',
      'NO_OUTPUT_DRIFT',
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

  assertNoFutureStageCreated('LF-PROD-SOT-004Y')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      helperRel,
      report004vRel,
      report004vR2Rel,
      report004vR3Rel,
      guard004vRel,
      test004vRel,
      guard004uRel,
      report004wRel,
      guard004wRel,
      test004wRel,
      report004xRel,
      guard004xRel,
      test004xRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004vRel, report004vR2Rel, report004vR3Rel, helperRel, guard004vRel, test004vRel, ...(exists(report004wRel) ? [report004wRel, guard004wRel, test004wRel] : []), ...(exists(report004xRel) ? [report004xRel, guard004xRel, test004xRel] : [])]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) throw new Error('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: exists(report004xRel) ? 'LF-PROD-SOT-004X_COMPAT_FROM_004V' : (exists(report004wRel) ? 'LF-PROD-SOT-004W-R1_COMPAT_FROM_004V' : 'LF-PROD-SOT-004V-R3'),
    mode: exists(report004xRel) ? 'ACTUAL_004X_SELECTED_NEXT_STAGE_ALLOWED' : (exists(report004wRel) ? 'ACTUAL_004W_SELECTED_NEXT_STAGE_ALLOWED' : 'ACTUAL_PACKAGE_ALIAS_REPAIR'),
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    selectedNextStage: exists(report004xRel) ? 'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS' : 'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    created004Y: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
