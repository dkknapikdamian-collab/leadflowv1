const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const planRel = 'src/lib/source-of-truth/calendar-date-time-boundary-plan.ts'
const planPath = path.join(ROOT, planRel)

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

function readPlan() {
  assert.equal(fs.existsSync(planPath), true, `${planRel} must exist`)
  return fs.readFileSync(planPath, 'utf8')
}

test('LF-PROD-SOT-004G plan file exists and exports required contract objects', () => {
  const plan = readPlan()
  for (const exportName of requiredExports) {
    assert.match(plan, new RegExp(`export\\s+const\\s+${exportName}\\b`), `missing export ${exportName}`)
  }
})

test('LF-PROD-SOT-004G plan has required no-drift markers', () => {
  const plan = readPlan()
  for (const token of [
    'LF-PROD-SOT-004G',
    'CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN',
    "visibleOutputDrift: 'FORBIDDEN'",
    "runtimeBehaviorChange: 'FORBIDDEN'",
    "CalendarRuntimeAdoption: 'NOT_STARTED'",
    "TasksRuntimeAdoption: 'NOT_STARTED'",
    "TodayRuntimeAdoption: 'NOT_STARTED'",
    "GoogleCalendarSyncChange: 'FORBIDDEN'",
    "GoogleCalendarMapperChange: 'FORBIDDEN'",
    "RemoteCalendarBoundaryChange: 'FORBIDDEN'",
    "LocalCalendarDayCountChange: 'FORBIDDEN'",
    "TodayTaskEventCountChange: 'FORBIDDEN'",
    "datePrecedenceChange: 'FORBIDDEN'",
    "dateOnlyDefaultChange: 'FORBIDDEN'",
    "timezonePolicyChange: 'FORBIDDEN'",
    "recurrenceExpansionChange: 'FORBIDDEN'",
    "calendarItemExpansionChange: 'FORBIDDEN'",
    "workItemsNormalizeChange: 'FORBIDDEN'",
    "schedulingChange: 'FORBIDDEN'",
    "manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT'",
    "firstRuntimeImportDecision: 'DECISION_NEEDED_AFTER_004G'",
  ]) {
    assert.ok(plan.includes(token), `missing marker ${token}`)
  }
})

test('LF-PROD-SOT-004G plan points to existing SOT repositories and readonly bridges', () => {
  const plan = readPlan()
  for (const token of [
    'statusRepository',
    'dateTimeRepository',
    'dateTimeSourceMap',
    'visualTokenSourceMap',
    'globalVisualContract',
    'runtimeAdoptionReadonly',
    'todayReadonlyBridge',
    'formsModalsActionVisualBridge',
    'caseDetailIsolatedAdoptionPlan',
  ]) {
    assert.ok(plan.includes(token), `missing repository reference ${token}`)
  }
})

test('LF-PROD-SOT-004G plan does not import UI/runtime/remote data surfaces', () => {
  const plan = readPlan()
  for (const token of [
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
    'document.',
    'window.',
    'querySelector',
  ]) {
    assert.equal(plan.includes(token), false, `plan must not contain runtime/UI token ${token}`)
  }
})

test('LF-PROD-SOT-004G descriptive fixtures are policy-only and do not render UI', () => {
  const plan = readPlan()
  for (const token of [
    'task scheduledAt anchor',
    'task dueAt anchor',
    'task date+time split anchor',
    'event startAt anchor',
    'event date+time split anchor',
    'local calendar day bucket anchor',
    'Today task/event count anchor',
    'Google Calendar boundary anchor',
    'date-only default T09:00 anchor',
    'finance T23:59:59 reference-only anchor',
    'do not change runtime',
    'do not change calendar local day counts',
    'do not change Today task/event counts',
    'do not change Google Calendar mapper',
  ]) {
    assert.ok(plan.includes(token), `missing policy fixture token ${token}`)
  }
})
