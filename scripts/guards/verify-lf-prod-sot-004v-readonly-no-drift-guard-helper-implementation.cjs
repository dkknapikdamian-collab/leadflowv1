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

function assertPackageAliasOrder(pkg, pkgRel) {
  const aliasU = '"verify:lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan"'
  const aliasV = '"verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation"'
  const posU = pkg.indexOf(aliasU)
  const posV = pkg.indexOf(aliasV)

  if (posU === -1) fail(pkgRel + ' missing 004U alias')
  if (posV === -1) fail(pkgRel + ' missing 004V alias')
  if (posV <= posU) fail(pkgRel + ' 004V alias is not after 004U alias')

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
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const test004vRel = 'tests/lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.test.cjs'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
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
  assertNoFutureStageCreated('LF-PROD-SOT-004W')

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
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004vRel, report004vR2Rel, report004vR3Rel, helperRel, guard004vRel, test004vRel]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) throw new Error('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: 'LF-PROD-SOT-004V-R3',
    mode: 'ACTUAL_PACKAGE_ALIAS_REPAIR',
    actualAliasRepair: 'ACTUAL_PACKAGE_ALIAS_REPAIRED',
    r2FalseCloseoutRepair: 'R2_FALSE_CLOSEOUT_REPAIRED',
    closeoutRepair: '004V_CLOSEOUT_REPAIRED',
    packageJsonHas004vAlias: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    selectedNextStage: 'LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    created004W: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
