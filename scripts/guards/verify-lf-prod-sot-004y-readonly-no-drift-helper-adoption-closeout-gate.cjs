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
  console.error('[004Y] FAIL ' + message)
  process.exit(1)
}

function assertPackageAliasOrder(pkg, pkgRel) {
  const aliasX = '"verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards"'
  const aliasY = '"verify:lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate"'
  const posX = pkg.indexOf(aliasX)
  const posY = pkg.indexOf(aliasY)
  if (posX === -1) fail(pkgRel + ' missing 004X alias')
  if (posY === -1) fail(pkgRel + ' missing 004Y alias')
  if (posY <= posX) fail(pkgRel + ' 004Y alias is not after 004X alias')
  const between = pkg.slice(posX, posY)
  if (between.includes('"check:a25-nearest-planned-action"')) {
    fail(pkgRel + ' 004Y alias is not directly after 004X alias')
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
  const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
  const report004vRel = '_project/runs/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md'
  const report004vR3Rel = '_project/runs/LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR.md'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const report004xRel = '_project/runs/LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS.md'
  const report004yRel = '_project/runs/LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE.md'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
  const guard004yRel = 'scripts/guards/verify-lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.cjs'
  const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
  const test004yRel = 'tests/lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.test.cjs'

  for (const f of [
    helperRel,
    pkgRel,
    report004uRel,
    report004vRel,
    report004vR3Rel,
    report004wRel,
    report004xRel,
    report004yRel,
    guard004uRel,
    guard004vRel,
    guard004wRel,
    guard004xRel,
    guard004yRel,
    test004xRel,
    test004yRel,
  ]) {
    assertFileExists(f)
  }

  assertHelperContract()

  const pkg = readText(pkgRel)
  const report004u = readText(report004uRel)
  const report004v = readText(report004vRel)
  const report004vR3 = readText(report004vR3Rel)
  const report004w = readText(report004wRel)
  const report004x = readText(report004xRel)
  const report004y = readText(report004yRel)

  assertPackageAliasOrder(pkg, pkgRel)

  assertRequiredTokens(report004u, [
    'LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
    'GUARD_HARDENING_PLAN_ONLY',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    '004V_CREATED: NO',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004uRel)

  assertRequiredTokens(report004v, [
    'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    'GUARD_HELPER_IMPLEMENTATION_ONLY',
    'GUARD_HELPER_CREATED: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004vRel)

  assertRequiredTokens(report004vR3, [
    'LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR',
    'ACTUAL_PACKAGE_ALIAS_REPAIRED',
    'PACKAGE_JSON_HAS_004V_ALIAS: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004vR3Rel)

  assertRequiredTokens(report004w, [
    'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    'HELPER_ADOPTION_FIRST_GUARD_ONLY',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    '004X_CREATED: NO',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004wRel)

  assertRequiredTokens(report004x, [
    'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    'HELPER_ADOPTION_SCOPE_GUARDS_ONLY',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs',
    'HELPER_ADOPTED_IN: scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
    '004Y_CREATED: NO',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
  ], report004xRel)

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

  for (const [guardRel, guardText] of [
    [guard004uRel, readText(guard004uRel)],
    [guard004vRel, readText(guard004vRel)],
    [guard004wRel, readText(guard004wRel)],
    [guard004xRel, readText(guard004xRel)],
    [guard004yRel, readText(guard004yRel)],
  ]) {
    assertGuardUsesHelper(guardText, guardRel)
  }

  assertForbiddenTokensAbsent(report004y, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004yRel)
  assertNoFutureStageCreated('LF-PROD-SOT-004Z')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      guard004xRel,
      test004xRel,
      guard004yRel,
      test004yRel,
      report004yRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004uRel, report004vRel, report004vR3Rel, report004wRel, report004xRel, report004yRel, guard004uRel, guard004vRel, guard004wRel, guard004xRel, guard004yRel, test004xRel, test004yRel]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: 'LF-PROD-SOT-004Y',
    mode: 'HELPER_ADOPTION_CLOSEOUT_GATE_ONLY',
    guardOnly: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    helperAdoptionSeriesReviewed: true,
    helperAdoptionSeriesAppGuardsPresent: true,
    helperAdoptionSeriesObsidianStatusPresent: true,
    nextDecisionRequired: 'FINAL_MANUAL_SMOKE_GATE_OR_EXPLICIT_NEXT_READONLY_NO_DRIFT_STAGE',
    created004Z: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
