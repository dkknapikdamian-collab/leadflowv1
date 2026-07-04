const path = require('node:path')
const helper = require(path.join(process.cwd(), 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'))

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
  console.error('[004U] FAIL ' + message)
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

function main() {
  const report004tRel = '_project/runs/LF-PROD-SOT-004T_NEXT_READONLY_NO_DRIFT_SCOPE_SELECTION_MAP.md'
  const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
  const report004vRel = '_project/runs/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md'
  const report004vR2Rel = '_project/runs/LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX.md'
  const report004vR3Rel = '_project/runs/LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR.md'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const test004uRel = 'tests/lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.test.cjs'
  const test004vRel = 'tests/lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.test.cjs'
  const test004wRel = 'tests/lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.test.cjs'
  const patchedGuard004tRel = 'scripts/guards/verify-lf-prod-sot-004t-next-readonly-no-drift-scope-selection-map.cjs'
  const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
  const pkgRel = 'package.json'

  for (const f of [report004tRel, report004uRel, guard004uRel, test004uRel, patchedGuard004tRel, pkgRel, helperRel]) {
    assertFileExists(f)
  }

  const report004t = readText(report004tRel)
  const report004u = readText(report004uRel)
  const pkg = readText(pkgRel)

  assertRequiredTokens(report004t, [
    'SCOPE_SELECTION_MAP_ONLY',
    'PLAN_ONLY',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
    '004U_CREATED: NO',
    'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    'MANUAL_SMOKE_STILL_NOT_PASS',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004tRel)

  assertRequiredTokens(report004u, [
    'LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
    'GUARD_HARDENING_PLAN_ONLY',
    'PLAN_ONLY',
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
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    '004V_CREATED: NO',
    'GUARD_HELPER_CREATED: NO',
    'changed files allowlist per stage',
    helperRel,
  ], report004uRel)

  assertForbiddenTokensAbsent(report004u, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004uRel)
  assertRequiredTokens(pkg, [
    'verify:lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan',
  ], pkgRel)

  if (exists(report004vRel)) {
    const report004v = readText(report004vRel)
    assertRequiredTokens(report004v, [
      'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
      'GUARD_HELPER_IMPLEMENTATION_ONLY',
      'PLAN_SUPPORT_ONLY',
      'NO_RUNTIME_CHANGE',
      'NO_OUTPUT_DRIFT',
      'FINAL_ACCEPTANCE_BLOCKED',
      'GUARD_HELPER_CREATED: YES',
      'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
      '004W_CREATED: NO',
    ], report004vRel)
    for (const f of [helperRel, guard004vRel, test004vRel]) assertFileExists(f)
  } else if (exists(helperRel)) {
    fail('guard helper exists without 004V report: ' + helperRel)
  }

  if (exists(report004vR2Rel)) {
    const report004vR2 = readText(report004vR2Rel)
    assertRequiredTokens(report004vR2, [
      'LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX',
      'PACKAGE_ALIAS_REPAIRED',
      '004V_CLOSEOUT_REPAIRED',
      'NO_RUNTIME_CHANGE',
      'NO_OUTPUT_DRIFT',
      'FINAL_ACCEPTANCE_BLOCKED',
      'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
      '004W_CREATED: NO',
    ], report004vR2Rel)
    assertForbiddenTokensAbsent(report004vR2, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004vR2Rel)
  }

  if (exists(report004vR3Rel)) {
    const report004vR3 = readText(report004vR3Rel)
    assertRequiredTokens(report004vR3, [
      'LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR',
      'ACTUAL_PACKAGE_ALIAS_REPAIRED',
      'R2_FALSE_CLOSEOUT_REPAIRED',
      '004V_CLOSEOUT_REPAIRED',
      'PACKAGE_JSON_HAS_004V_ALIAS: YES',
      'NO_RUNTIME_CHANGE',
      'NO_OUTPUT_DRIFT',
      'FINAL_ACCEPTANCE_BLOCKED',
      'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
      '004W_CREATED: NO',
    ], report004vR3Rel)
    assertForbiddenTokensAbsent(report004vR3, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004vR3Rel)
  }

  if (exists(report004wRel)) {
    const report004w = readText(report004wRel)
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
    assertForbiddenTokensAbsent(report004w, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004wRel)
    for (const f of [guard004wRel, test004wRel]) assertFileExists(f)
  }

  assertNoFutureStageCreated('LF-PROD-SOT-004X')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      report004uRel,
      guard004uRel,
      test004uRel,
      patchedGuard004tRel,
      report004vRel,
      report004vR2Rel,
      report004vR3Rel,
      helperRel,
      guard004vRel,
      test004vRel,
      report004wRel,
      guard004wRel,
      test004wRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004uRel, guard004uRel, ...(exists(report004wRel) ? [report004wRel, guard004wRel, test004wRel] : [])]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: 'LF-PROD-SOT-004U',
    mode: exists(report004wRel) ? 'HELPER_ADOPTION_004W_COMPAT' : exists(report004vR3Rel) ? 'SCOPE_GUARD_STILL_VALID_AFTER_SELECTED_004V_R3' : 'SCOPE_GUARD_STILL_VALID',
    planOnly: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    selectedNextStage: exists(report004wRel) ? 'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD' : 'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    helperAdoptedIn004U: exists(report004wRel),
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
