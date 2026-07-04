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

function assertPackageAliasOrder(pkg, pkgRel) {
  const aliasV = '"verify:lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation"'
  const aliasW = '"verify:lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard"'
  const posV = pkg.indexOf(aliasV)
  const posW = pkg.indexOf(aliasW)

  if (posV === -1) fail(pkgRel + ' missing 004V alias')
  if (posW === -1) fail(pkgRel + ' missing 004W alias')
  if (posW <= posV) fail(pkgRel + ' 004W alias is not after 004V alias')

  const between = pkg.slice(posV, posW)
  if (between.includes('"check:a25-nearest-planned-action"')) {
    fail(pkgRel + ' 004W alias is not directly after 004V alias')
  }
}

function main() {
  const report004vR3Rel = '_project/runs/LF-PROD-SOT-004V-R3_ACTUAL_PACKAGE_ALIAS_REPAIR.md'
  const report004wRel = '_project/runs/LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD.md'
  const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
  const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
  const guard004wRel = 'scripts/guards/verify-lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.cjs'
  const test004wRel = 'tests/lf-prod-sot-004w-readonly-no-drift-helper-adoption-first-guard.test.cjs'
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

  const report004vR3 = readText(report004vR3Rel)
  const report004w = readText(report004wRel)
  const guard004u = readText(guard004uRel)
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
    'LF-PROD-SOT-004X',
  ], guard004wRel)

  assertRequiredTokens(test004w, [
    'helper exists',
    '004U guard imports helper',
    '004W does not create 004X',
  ], test004wRel)

  assertForbiddenTokensAbsent(report004w, DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS, report004wRel)
  assertNoFutureStageCreated('LF-PROD-SOT-004X')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      'package.json',
      guard004uRel,
      guard004vRel,
      guard004wRel,
      test004wRel,
      report004wRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [report004wRel, guard004uRel, guard004vRel, guard004wRel, test004wRel]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage: 'LF-PROD-SOT-004W',
    mode: 'HELPER_ADOPTION_FIRST_GUARD_ONLY',
    guardOnly: true,
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    helperAdoptedIn: 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    nextStageSelected: 'LF-PROD-SOT-004X_READONLY_NO_DRIFT_HELPER_ADOPTION_SCOPE_GUARDS',
    created004X: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
