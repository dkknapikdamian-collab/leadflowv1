const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const bridgeRel = 'src/lib/source-of-truth/lists-cards-readonly-bridge.ts'
const bridgePath = path.join(ROOT, bridgeRel)

const requiredExports = [
  'listsCardsReadonlyBridgeStage',
  'listsCardsReadonlyBridgeMode',
  'listsCardsReadonlyBridgeSourceMap',
  'listsCardsReadonlyBridgeConsumers',
  'listsCardsReadonlyBridgeRepositories',
  'listsCardsReadonlyBridgeAllowedAreas',
  'listsCardsReadonlyBridgeBlockedAreas',
  'listsCardsReadonlyBridgeEntityPolicies',
  'listsCardsReadonlyBridgeHardRules',
  'listsCardsReadonlyBridgeNoDriftPolicy',
  'listsCardsReadonlyBridgeFixturePolicy',
  'listsCardsReadonlyBridgeManualSmokePolicy',
  'listsCardsReadonlyBridgeNextStages',
  'listsCardsReadonlyBridgeReport',
]

function readBridge() {
  assert.equal(fs.existsSync(bridgePath), true, `${bridgeRel} must exist`)
  return fs.readFileSync(bridgePath, 'utf8')
}

test('LF-PROD-SOT-004D bridge file exists and exports required contract objects', () => {
  const bridge = readBridge()
  for (const exportName of requiredExports) {
    assert.match(bridge, new RegExp(`export\\s+const\\s+${exportName}\\b`), `missing export ${exportName}`)
  }
})

test('LF-PROD-SOT-004D bridge has required no-drift markers', () => {
  const bridge = readBridge()
  for (const token of [
    'LF-PROD-SOT-004D',
    'LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE',
    "visibleOutputDrift: 'FORBIDDEN'",
    "sortingChange: 'FORBIDDEN'",
    "filteringChange: 'FORBIDDEN'",
    "listCountChange: 'FORBIDDEN'",
    "statusBucketChange: 'FORBIDDEN'",
    "statusLabelChange: 'FORBIDDEN'",
    "datePrecedenceChange: 'FORBIDDEN'",
    "silenceMarkerChange: 'FORBIDDEN'",
    "nextActionLabelChange: 'FORBIDDEN'",
    "clientHealthRecalculation: 'FORBIDDEN'",
    "clientSourcePortalMerge: 'FORBIDDEN'",
    "caseLifecycleRecalculation: 'FORBIDDEN'",
    "CaseDetailRuntimeAdoption: 'FORBIDDEN_UNTIL_004F'",
    "badgeChange: 'FORBIDDEN'",
    "colorChange: 'FORBIDDEN'",
  ]) {
    assert.ok(bridge.includes(token), `missing marker ${token}`)
  }
})

test('LF-PROD-SOT-004D bridge points to the existing repositories and previous readonly bridges', () => {
  const bridge = readBridge()
  for (const token of [
    'statusRepository',
    'STATUS_REPOSITORY_SOURCE_MAP',
    'dateTimeRepository',
    'dateTimeSourceMap',
    'visualTokenSourceMap',
    'recordListVisualContract',
    'runtimeAdoptionReadonly',
    'todayReadonlyBridge',
  ]) {
    assert.ok(bridge.includes(token), `missing repository reference ${token}`)
  }
})

test('LF-PROD-SOT-004D bridge does not import UI/runtime/remote data surfaces', () => {
  const bridge = readBridge()
  for (const forbidden of [
    "from 'react'",
    'from "react"',
    'src/pages/',
    'src/components/',
    'src/styles/',
    '.css',
    'document.',
    'window.',
    'querySelector',
    'classList',
    'supabase',
    'google-calendar',
    'gcal',
  ]) {
    assert.equal(bridge.includes(forbidden), false, `forbidden bridge token ${forbidden}`)
  }
})

test('LF-PROD-SOT-004D descriptive fixtures are policy-only and do not render UI', () => {
  const bridge = readBridge()
  const fixtures = [
    {
      name: 'lead list/card candidate',
      requiredPolicies: ['record count', 'status buckets', 'status labels', 'silence markers', 'next action labels', 'badge tone or color'],
    },
    {
      name: 'client list/card candidate',
      requiredPolicies: ['record count', 'health/source/portal separation', 'activity order', 'badge tone or color'],
    },
    {
      name: 'case list/card candidate',
      requiredPolicies: ['record count', 'case lifecycle/status separation', 'badge tone or color', 'do not touch CaseDetail'],
    },
  ]

  for (const fixture of fixtures) {
    assert.ok(bridge.includes(fixture.name), `missing fixture ${fixture.name}`)
    for (const policy of fixture.requiredPolicies) {
      assert.ok(bridge.includes(policy), `fixture ${fixture.name} missing policy ${policy}`)
    }
  }

  assert.equal(bridge.includes('jsdom'), false, 'no UI DOM test dependency')
  assert.equal(bridge.includes('render('), false, 'no React rendering in policy fixture')
})
