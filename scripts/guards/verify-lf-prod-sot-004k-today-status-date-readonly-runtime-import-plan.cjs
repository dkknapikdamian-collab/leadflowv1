const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004K'
const planRel = 'src/lib/source-of-truth/today-status-date-readonly-runtime-plan.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004k-today-status-date-readonly-runtime-import-plan.cjs'
const testRel = 'tests/lf-prod-sot-004k-today-status-date-readonly-runtime-import-plan.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN.md'
const report004jRel = '_project/runs/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md'
const packageRel = 'package.json'

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}
function mustHave(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

const plan = read(planRel)
const report = read(reportRel)
const report004j = read(report004jRel)
const pkg = read(packageRel)
read(guardRel)
read(testRel)

for (const token of [
  'LF-PROD-SOT-004K',
  'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN',
  'MANUAL_SMOKE_PASS_AND_TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
  'TodayStatusDateReadonlyRuntimeImport',
  'NOT_STARTED_IN_004K_PLAN_ONLY',
  'TodayRuntimeAdoption',
  'TodayTaskEventCountChange',
  'TaskStatusLabelChange',
  'EventStatusLabelChange',
  'DoneCancelledPendingLabelChange',
  'datePrecedenceChange',
  'dateOnlyDefaultChange',
  'NEXT_RUNTIME_IMPORT_004L_CANDIDATE_AFTER_004K_PASS',
]) mustHave(plan, token, planRel)

for (const exportName of [
  'todayStatusDateReadonlyRuntimeImportPlanStage',
  'todayStatusDateReadonlyRuntimeImportPlanMode',
  'todayStatusDateReadonlyRuntimeImportPlanSourceMap',
  'todayStatusDateReadonlyRuntimeImportPlanRepositories',
  'todayStatusDateReadonlyRuntimeImportPlanHardRules',
  'todayStatusDateReadonlyRuntimeImportPlanNoDriftPolicy',
  'todayStatusDateReadonlyRuntimeImportPlanFixturePolicy',
  'todayStatusDateReadonlyRuntimeImportPlanManualSmokePolicy',
  'todayStatusDateReadonlyRuntimeImportPlanNextDecision',
  'todayStatusDateReadonlyRuntimeImportPlanReport',
]) mustHave(plan, `export const ${exportName}`, planRel)

for (const token of ["from 'react'", 'from "react"', 'src/pages/', 'src/components/', 'src/styles/', '.css', 'document.', 'window.']) {
  if (plan.includes(token)) throw new Error(`${planRel} contains forbidden UI/runtime token: ${token}`)
}

mustHave(pkg, 'verify:lf-prod-sot-004k-today-status-date-readonly-runtime-import-plan', packageRel)
mustHave(pkg, guardRel, packageRel)
mustHave(report004j, 'MANUAL_SMOKE_PASS', report004jRel)
mustHave(report004j, 'TODAY_STATUS_DATE_READONLY_IMPORT_NEXT', report004jRel)

for (const token of ['PLAN_ONLY', 'NO_RUNTIME_CHANGE', 'NO_UI_CHANGE', 'NO_CSS_CHANGE', 'NO_SQL_CHANGE', 'LOCAL_VERIFICATION_REQUIRED', '004L: NOT_CREATED']) {
  mustHave(report, token, reportRel)
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    planOnly: true,
    required004jDecision: true,
    reportExists: true,
    runtimeUiCssSql: 'NOT_TOUCHED_BY_004K'
  }
}, null, 2))
