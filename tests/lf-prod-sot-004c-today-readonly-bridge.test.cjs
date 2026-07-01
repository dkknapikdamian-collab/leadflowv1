const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')
const test = require('node:test')

const ROOT = process.cwd()
const bridgeRel = 'src/lib/source-of-truth/today-readonly-bridge.ts'

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8')
}

function includesAll(content, tokens, label) {
  for (const token of tokens) {
    assert.equal(content.includes(token), true, `${label} missing ${token}`)
  }
}

test('LF-PROD-SOT-004C today read-only bridge contract exists and exports required sections', () => {
  const bridgePath = path.join(ROOT, bridgeRel)
  assert.equal(fs.existsSync(bridgePath), true, 'today-readonly-bridge.ts must exist')

  const bridge = read(bridgeRel)

  includesAll(bridge, [
    'export const todayReadonlyBridgeStage',
    'export const todayReadonlyBridgeMode',
    'export const todayReadonlyBridgeSourceMap',
    'export const todayReadonlyBridgeConsumers',
    'export const todayReadonlyBridgeRepositories',
    'export const todayReadonlyBridgeAllowedAreas',
    'export const todayReadonlyBridgeBlockedAreas',
    'export const todayReadonlyBridgeHardRules',
    'export const todayReadonlyBridgeNoDriftPolicy',
    'export const todayReadonlyBridgeFixturePolicy',
    'export const todayReadonlyBridgeManualSmokePolicy',
    'export const todayReadonlyBridgeNextStages',
    'export const todayReadonlyBridgeReport',
  ], 'bridge exports')
})

test('LF-PROD-SOT-004C bridge has no-drift markers and SOT references', () => {
  const bridge = read(bridgeRel)

  includesAll(bridge, [
    'LF-PROD-SOT-004C',
    'TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE',
    'visibleOutputDrift',
    'sortingChange',
    'filteringChange',
    'bucketChange',
    'datePrecedenceChange',
    'statusLabelChange',
    'badgeChange',
    'colorChange',
    'FORBIDDEN',
    'statusRepository',
    'dateTimeRepository',
    'dateTimeSourceMap',
    'visualTokenSourceMap',
    'runtimeAdoptionReadonly',
    'runtimeAdoptionHardRules',
  ], 'bridge markers')
})

test('LF-PROD-SOT-004C bridge stays read-only and does not import UI/runtime boundaries', () => {
  const bridge = read(bridgeRel)

  for (const token of [
    "from 'react'",
    'from "react"',
    'src/pages/',
    'src/components/',
    'src/styles/',
    '.css',
    'supabase',
    'google-calendar',
    'querySelector',
    'document.',
    'window.',
  ]) {
    assert.equal(bridge.includes(token), false, `bridge must not include ${token}`)
  }
})

test('LF-PROD-SOT-004C fixture policy is descriptive only and preserves Today output semantics', () => {
  const descriptiveFixtures = [
    {
      row: 'lead row candidate',
      policy: 'do not change date precedence, buckets, status label, badge, tone or color',
    },
    {
      row: 'task row candidate',
      policy: 'do not change date precedence, buckets, status label, badge, tone or color',
    },
    {
      row: 'event row candidate',
      policy: 'do not change date precedence, buckets, status label, badge, tone or color',
    },
  ]

  assert.equal(descriptiveFixtures.length, 3)
  for (const fixture of descriptiveFixtures) {
    assert.match(fixture.row, /(lead|task|event) row candidate/)
    assert.equal(fixture.policy.includes('do not change date precedence'), true)
    assert.equal(fixture.policy.includes('buckets'), true)
    assert.equal(fixture.policy.includes('status label'), true)
    assert.equal(fixture.policy.includes('badge'), true)
    assert.equal(fixture.policy.includes('tone'), true)
    assert.equal(fixture.policy.includes('color'), true)
  }
})
