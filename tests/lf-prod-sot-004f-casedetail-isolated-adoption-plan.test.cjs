const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const planRel = 'src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts'
const planPath = path.join(ROOT, planRel)

const requiredExports = [
  'caseDetailIsolatedAdoptionPlanStage',
  'caseDetailIsolatedAdoptionPlanMode',
  'caseDetailIsolatedAdoptionPlanSourceMap',
  'caseDetailIsolatedAdoptionPlanConsumers',
  'caseDetailIsolatedAdoptionPlanRepositories',
  'caseDetailIsolatedAdoptionPlanAnchorMap',
  'caseDetailIsolatedAdoptionPlanBlockedAreas',
  'caseDetailIsolatedAdoptionPlanAllowedAreas',
  'caseDetailIsolatedAdoptionPlanRiskMap',
  'caseDetailIsolatedAdoptionPlanHardRules',
  'caseDetailIsolatedAdoptionPlanNoDriftPolicy',
  'caseDetailIsolatedAdoptionPlanFixturePolicy',
  'caseDetailIsolatedAdoptionPlanManualSmokePolicy',
  'caseDetailIsolatedAdoptionPlanNextStages',
  'caseDetailIsolatedAdoptionPlanReport',
]

function readPlan() {
  assert.equal(fs.existsSync(planPath), true, `${planRel} must exist`)
  return fs.readFileSync(planPath, 'utf8')
}

test('LF-PROD-SOT-004F plan file exists and exports required contract objects', () => {
  const plan = readPlan()
  for (const exportName of requiredExports) {
    assert.match(plan, new RegExp(`export\\s+const\\s+${exportName}\\b`), `missing export ${exportName}`)
  }
})

test('LF-PROD-SOT-004F plan has required no-drift markers', () => {
  const plan = readPlan()
  for (const token of [
    'LF-PROD-SOT-004F',
    'CASEDETAIL_ISOLATED_ADOPTION_PLAN',
    "visibleOutputDrift: 'FORBIDDEN'",
    "runtimeBehaviorChange: 'FORBIDDEN'",
    "uiChange: 'FORBIDDEN'",
    "cssChange: 'FORBIDDEN'",
    "layoutChange: 'FORBIDDEN'",
    "CaseDetailRuntimeAdoption: 'NOT_STARTED'",
    "CaseDetailRepositoryImport: 'FORBIDDEN_IN_RUNTIME'",
    "caseStatusRedefinition: 'FORBIDDEN'",
    "caseLifecycleRecalculation: 'FORBIDDEN'",
    "activityTimelineChange: 'FORBIDDEN'",
    "financeSettlementChange: 'FORBIDDEN'",
    "paymentStatusChange: 'FORBIDDEN'",
    "commissionStatusChange: 'FORBIDDEN'",
    "amountCalculationChange: 'FORBIDDEN'",
    "manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT'",
  ]) {
    assert.ok(plan.includes(token), `missing marker ${token}`)
  }
})

test('LF-PROD-SOT-004F plan points to existing SOT repositories and readonly bridges', () => {
  const plan = readPlan()
  for (const token of [
    'statusRepository',
    'dateTimeRepository',
    'dateTimeSourceMap',
    'visualTokenSourceMap',
    'globalVisualContract',
    'runtimeAdoptionReadonly',
    'listsCardsReadonlyBridge',
    'formsModalsActionVisualBridge',
  ]) {
    assert.ok(plan.includes(token), `missing repository reference ${token}`)
  }
})

test('LF-PROD-SOT-004F plan does not import UI/runtime/remote data surfaces', () => {
  const plan = readPlan()
  for (const forbidden of [
    "from 'react'",
    'from "react"',
    'src/pages/',
    'src/components/',
    'src/ui-system/',
    'src/styles/',
    '.css',
    'document.',
    'window.',
    'querySelector',
    'classList',
    'supabase',
    'google-calendar',
    'gcal',
    'finance/',
    'owner-control/',
    'planned-actions',
    'activity-timeline',
    'case-lifecycle',
  ]) {
    assert.equal(plan.includes(forbidden), false, `forbidden plan token ${forbidden}`)
  }
})

test('LF-PROD-SOT-004F descriptive fixtures are policy-only and do not render UI', () => {
  const plan = readPlan()
  const fixtures = [
    {
      name: 'CaseDetail header anchor',
      requiredPolicies: ['runtime', 'layout', 'CSS', 'header identity', 'top metadata', 'top action zone'],
    },
    {
      name: 'Case lifecycle/status anchor',
      requiredPolicies: ['lifecycle calculation', 'status label', 'lifecycle bucket', 'status visual tone'],
    },
    {
      name: 'service workspace anchor',
      requiredPolicies: ['service workspace tabs', 'panels', 'notes', 'checklist', 'action panel'],
    },
    {
      name: 'history timeline anchor',
      requiredPolicies: ['timeline source', 'order', 'grouping', 'date precedence', 'activity truth separation'],
    },
    {
      name: 'finance settlement anchor',
      requiredPolicies: ['finance settlement', 'payment', 'commission', 'amount calculation', 'summary labels'],
    },
    {
      name: 'payment/commission/amount anchor',
      requiredPolicies: ['payment status', 'commission status', 'amount calculation', 'settlement precedence'],
    },
  ]

  for (const fixture of fixtures) {
    assert.ok(plan.includes(fixture.name), `missing fixture ${fixture.name}`)
    for (const policy of fixture.requiredPolicies) {
      assert.ok(plan.includes(policy), `fixture ${fixture.name} missing policy ${policy}`)
    }
  }

  assert.equal(plan.includes('jsdom'), false, 'no UI DOM test dependency')
  assert.equal(plan.includes('render('), false, 'no React rendering in policy fixture')
})
