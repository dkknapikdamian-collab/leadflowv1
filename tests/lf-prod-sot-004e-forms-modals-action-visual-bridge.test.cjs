const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const bridgeRel = 'src/lib/source-of-truth/forms-modals-action-visual-readonly-bridge.ts'
const bridgePath = path.join(ROOT, bridgeRel)

const requiredExports = [
  'formsModalsActionVisualBridgeStage',
  'formsModalsActionVisualBridgeMode',
  'formsModalsActionVisualBridgeSourceMap',
  'formsModalsActionVisualBridgeConsumers',
  'formsModalsActionVisualBridgeRepositories',
  'formsModalsActionVisualBridgeAllowedAreas',
  'formsModalsActionVisualBridgeBlockedAreas',
  'formsModalsActionVisualBridgePrimitivePolicies',
  'formsModalsActionVisualBridgeFormPolicies',
  'formsModalsActionVisualBridgeModalPolicies',
  'formsModalsActionVisualBridgeAiDraftPolicies',
  'formsModalsActionVisualBridgeHardRules',
  'formsModalsActionVisualBridgeNoDriftPolicy',
  'formsModalsActionVisualBridgeFixturePolicy',
  'formsModalsActionVisualBridgeManualSmokePolicy',
  'formsModalsActionVisualBridgeNextStages',
  'formsModalsActionVisualBridgeReport',
]

function readBridge() {
  assert.equal(fs.existsSync(bridgePath), true, `${bridgeRel} must exist`)
  return fs.readFileSync(bridgePath, 'utf8')
}

test('LF-PROD-SOT-004E bridge file exists and exports required contract objects', () => {
  const bridge = readBridge()
  for (const exportName of requiredExports) {
    assert.match(bridge, new RegExp(`export\\s+const\\s+${exportName}\\b`), `missing export ${exportName}`)
  }
})

test('LF-PROD-SOT-004E bridge has required no-drift markers', () => {
  const bridge = readBridge()
  for (const token of [
    'LF-PROD-SOT-004E',
    'FORMS_MODALS_ACTION_VISUAL_BRIDGE',
    "visibleOutputDrift: 'FORBIDDEN'",
    "runtimeBehaviorChange: 'FORBIDDEN'",
    "uiChange: 'FORBIDDEN'",
    "cssChange: 'FORBIDDEN'",
    "redesignChange: 'FORBIDDEN'",
    "componentReplacement: 'FORBIDDEN'",
    "classNameChange: 'FORBIDDEN'",
    "inlineStyleChange: 'FORBIDDEN'",
    "newCssPatchLayer: 'FORBIDDEN'",
    "localButtonClone: 'FORBIDDEN'",
    "localActionControlClone: 'FORBIDDEN'",
    "localIconColorPatch: 'FORBIDDEN'",
    "dialogLayoutChange: 'FORBIDDEN'",
    "modalBehaviorChange: 'FORBIDDEN'",
    "formFieldBehaviorChange: 'FORBIDDEN'",
    "aiProviderChange: 'FORBIDDEN'",
    "aiModelChange: 'FORBIDDEN'",
    "aiRuntimeBehaviorChange: 'FORBIDDEN'",
    "CaseDetailRuntimeAdoption: 'FORBIDDEN_UNTIL_004F'",
    "CalendarRuntimeAdoption: 'FORBIDDEN_UNTIL_004G'",
  ]) {
    assert.ok(bridge.includes(token), `missing marker ${token}`)
  }
})

test('LF-PROD-SOT-004E bridge points to existing SOT repositories and readonly bridges', () => {
  const bridge = readBridge()
  for (const token of [
    'visualTokenSourceMap',
    'globalVisualContract',
    'buttonActionVisualContract',
    'formFieldVisualContract',
    'modalDialogVisualContract',
    'statusRepository',
    'STATUS_REPOSITORY_SOURCE_MAP',
    'controlledSelectBoundary',
    'runtimeAdoptionReadonly',
    'runtimeAdoptionHardRules',
    'todayReadonlyBridge',
    'listsCardsReadonlyBridge',
  ]) {
    assert.ok(bridge.includes(token), `missing repository reference ${token}`)
  }
})

test('LF-PROD-SOT-004E bridge does not import UI/runtime/remote data surfaces', () => {
  const bridge = readBridge()
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
    'ai-provider',
    'finance/',
    'src/lib/finance',
  ]) {
    assert.equal(bridge.includes(forbidden), false, `forbidden bridge token ${forbidden}`)
  }
})

test('LF-PROD-SOT-004E descriptive fixtures are policy-only and do not render UI', () => {
  const bridge = readBridge()
  const fixtures = [
    {
      name: 'action control candidate',
      requiredPolicies: ['do not change runtime', 'className', 'CSS', 'patch layer', 'button clone', 'action clone', 'icon color patch'],
    },
    {
      name: 'form field candidate',
      requiredPolicies: ['field behavior', 'default values', 'validation', 'controlled select source', 'className', 'CSS'],
    },
    {
      name: 'modal/dialog candidate',
      requiredPolicies: ['modal behavior', 'dialog layout', 'footer action order', 'overlay behavior', 'close/cancel behavior'],
    },
    {
      name: 'settings surface candidate',
      requiredPolicies: ['settings runtime', 'routing', 'auth', 'provider settings', 'className', 'CSS'],
    },
    {
      name: 'AI draft visual surface candidate',
      requiredPolicies: ['AI provider', 'model', 'runtime', 'send behavior', 'draft behavior', 'business status'],
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
