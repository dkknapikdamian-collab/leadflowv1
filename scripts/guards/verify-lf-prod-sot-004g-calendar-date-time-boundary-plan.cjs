const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004G'

const planRel = 'src/lib/source-of-truth/calendar-date-time-boundary-plan.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004g-calendar-date-time-boundary-plan.cjs'
const testRel = 'tests/lf-prod-sot-004g-calendar-date-time-boundary-plan.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md'
const packageRel = 'package.json'
const plan004fRel = 'src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts'
const report004fRel = '_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md'

const requiredExports = [
  'calendarDateTimeBoundaryPlanStage',
  'calendarDateTimeBoundaryPlanMode',
  'calendarDateTimeBoundaryPlanSourceMap',
  'calendarDateTimeBoundaryPlanConsumers',
  'calendarDateTimeBoundaryPlanRepositories',
  'calendarDateTimeBoundaryPlanLocalDatePolicyMap',
  'calendarDateTimeBoundaryPlanRemoteBoundaryMap',
  'calendarDateTimeBoundaryPlanBlockedAreas',
  'calendarDateTimeBoundaryPlanAllowedAreas',
  'calendarDateTimeBoundaryPlanRiskMap',
  'calendarDateTimeBoundaryPlanHardRules',
  'calendarDateTimeBoundaryPlanNoDriftPolicy',
  'calendarDateTimeBoundaryPlanFixturePolicy',
  'calendarDateTimeBoundaryPlanManualSmokePolicy',
  'calendarDateTimeBoundaryPlanNextDecision',
  'calendarDateTimeBoundaryPlanReport',
]

const requiredPlanTokens = [
  'LF-PROD-SOT-004G',
  'CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN',
  'runtimeBehaviorChange',
  'uiChange',
  'cssChange',
  'CalendarRuntimeAdoption',
  'TasksRuntimeAdoption',
  'TodayRuntimeAdoption',
  'GoogleCalendarSyncChange',
  'GoogleCalendarMapperChange',
  'RemoteCalendarBoundaryChange',
  'LocalCalendarDayCountChange',
  'TodayTaskEventCountChange',
  'TaskStatusLabelChange',
  'EventStatusLabelChange',
  'DoneCancelledPendingLabelChange',
  'datePrecedenceChange',
  'dateOnlyDefaultChange',
  'taskDateOnlyDefaultT0900Change',
  'eventDateOnlyDefaultT0900Change',
  'financeDateOnlyDefaultT235959Change',
  'timezonePolicyChange',
  'localWarsawBusinessDayBoundaryChange',
  'recurrenceExpansionChange',
  'calendarItemExpansionChange',
  'workItemsNormalizeChange',
  'schedulingChange',
  'dataWriteChange',
  'GUARDS_TESTS_BOUNDARY_PLAN_ONLY',
  'visibleOutputDrift',
  'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  'DECISION_NEEDED_AFTER_004G',
  'FORBIDDEN',
  'NOT_STARTED',
]

const requiredLocalMapTokens = [
  'taskScheduledAtPrecedence',
  'taskDueAtPrecedence',
  'taskDateTimeSplitPrecedence',
  'taskDateOnlyDefaultT0900',
  'eventStartAtPrecedence',
  'eventDateTimeSplitPrecedence',
  'eventDateOnlyDefaultT0900',
  'calendarLocalDayBucketPolicy',
  'todayTaskEventBucketPolicy',
  'localWarsawBusinessDayBoundaryPolicy',
  'financeDateOnlyDefaultT235959_REFERENCE_ONLY_NOT_ADOPTED',
]

const requiredRemoteMapTokens = [
  'googleCalendarSyncBoundary',
  'googleCalendarMapperBoundary',
  'remoteCalendarProviderBoundary',
  'localEventNotGcalBoundary',
  'noRemoteCalendarMutationIn004G',
  'noGcalMapperChangeIn004G',
]

const forbiddenPlanTokens = [
  'document.',
  'window.',
  'querySelector',
  'classList',
  'getElementById',
  'createElement',
  'appendChild',
  "from 'react'",
  'from "react"',
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  '.css',
  'supabase',
  'google-calendar',
  'remote-calendar',
  'calendar-items',
  "from './calendar-items",
  'work-items/',
  "from './scheduling",
  'finance/',
  'src/pages/CaseDetail',
]

const allowedChanged = new Set([
  planRel,
  guardRel,
  testRel,
  reportRel,
  packageRel,
  report004fRel,
  plan004fRel,
])

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'src/lib/finance/',
  'src/lib/source-of-truth/status-repository.ts',
  'src/lib/source-of-truth/date-time-repository.ts',
  'src/lib/source-of-truth/visual-repository.ts',
  'src/lib/source-of-truth/runtime-adoption-readonly.ts',
  'src/lib/source-of-truth/today-readonly-bridge.ts',
  'src/lib/source-of-truth/lists-cards-readonly-bridge.ts',
  'src/lib/source-of-truth/forms-modals-action-visual-readonly-bridge.ts',
  'src/lib/scheduling.ts',
  'src/lib/calendar-items.ts',
  'src/lib/calendar-operational-entry-contract.ts',
  'src/lib/work-items/normalize.ts',
  'supabase/',
  'migrations/',
  'sql/',
]

const requiredReportTokens = [
  '## Linki SOT / mapa wejściowa',
  '00_MAPY_I_ZALEZNOSCI_SOT.md',
  'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  'LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  '_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  '004F formal cleanup: DONE',
  'Calendar runtime: NOT_TOUCHED',
  'Tasks runtime: NOT_TOUCHED',
  'Today runtime: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Google Calendar mapper: NOT_TOUCHED',
  'remote calendar provider: NOT_TOUCHED',
  'local calendar day counts: NOT_TOUCHED',
  'Today task/event counts: NOT_TOUCHED',
  'task/event status labels: NOT_TOUCHED',
  'done/cancelled/pending labels: NOT_TOUCHED',
  'date precedence: NOT_TOUCHED',
  'date-only defaults: NOT_TOUCHED',
  'timezone policy: NOT_TOUCHED',
  'recurrence expansion: NOT_TOUCHED',
  'calendar item expansion: NOT_TOUCHED',
  'work-items normalize: NOT_TOUCHED',
  'scheduling: NOT_TOUCHED',
  'runtime behavior: NOT_TOUCHED',
  'UI components: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'Finance runtime: NOT_TOUCHED / FORBIDDEN',
  'CaseDetail runtime: NOT_TOUCHED / FORBIDDEN',
  'Supabase/API: NOT_TOUCHED',
  'SQL: NOT_TOUCHED',
  'next step: FIRST_RUNTIME_IMPORT_DECISION_NEEDED',
]

const mojibakeTokens = ['�', 'Å', 'Ä', 'Ã', 'Â', 'â€', 'â€™', 'Å›', 'Å‚', 'Å¼', 'Åº', 'Ä…', 'Ä™', 'Ăł']

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}

function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

function assertNoMojibake(rel, text) {
  for (const token of mojibakeTokens) {
    if (text.includes(token)) throw new Error(`${rel} contains mojibake token ${token}`)
  }
}

function changedFiles() {
  const output = cp.execSync('git status --short', { cwd: ROOT, encoding: 'utf8' })
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => line.replace(/^..\s+/, '').replace(/^"|"$/g, ''))
}

const plan = read(planRel)
const guard = read(guardRel)
const test = read(testRel)
const report = read(reportRel)
const pkg = read(packageRel)
const report004f = read(report004fRel)
const plan004f = read(plan004fRel)

for (const exportName of requiredExports) {
  assertIncludes(plan, `export const ${exportName}`, planRel)
}
for (const token of [...requiredPlanTokens, ...requiredLocalMapTokens, ...requiredRemoteMapTokens]) {
  assertIncludes(plan, token, planRel)
}
for (const token of forbiddenPlanTokens) {
  if (plan.includes(token)) throw new Error(`${planRel} contains forbidden runtime/UI token: ${token}`)
}
for (const token of requiredReportTokens) {
  assertIncludes(report, token, reportRel)
}
assertIncludes(pkg, 'verify:lf-prod-sot-004g-calendar-date-time-boundary-plan', packageRel)

if (/status:\s*['"]CASEDETAIL_ISOLATED_ADOPTION_PLAN_REMOTE_ADDED_LOCAL_VERIFICATION_PENDING['"]/.test(plan004f)) {
  throw new Error(`${plan004fRel} still has active pending report status`)
}
if (/package\.json` alias pending local patch/.test(report004f)) {
  throw new Error(`${report004fRel} still has pending package alias text`)
}

for (const rel of [planRel, guardRel, testRel, reportRel, plan004fRel, report004fRel]) {
  assertNoMojibake(rel, read(rel))
}

for (const file of changedFiles()) {
  if (allowedChanged.has(file)) continue
  if (forbiddenChangedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
    throw new Error(`Forbidden changed file detected: ${file}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    requiredExports: requiredExports.length,
    localDatePolicyMap: requiredLocalMapTokens.length,
    remoteBoundaryMap: requiredRemoteMapTokens.length,
    noMojibake: true,
    noRuntimeImports: true,
    reportLinksAndMarkers: true,
    changedFileAllowlist: true,
    cleanup004f: true,
  },
}, null, 2))
