const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004E'

const bridgeRel = 'src/lib/source-of-truth/forms-modals-action-visual-readonly-bridge.ts'
const testRel = 'tests/lf-prod-sot-004e-forms-modals-action-visual-bridge.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md'
const packageRel = 'package.json'

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

const requiredBridgeTokens = [
  'LF-PROD-SOT-004E',
  'FORMS_MODALS_ACTION_VISUAL_BRIDGE',
  'runtimeBehaviorChange',
  'uiChange',
  'cssChange',
  'redesignChange',
  'componentReplacement',
  'classNameChange',
  'inlineStyleChange',
  'newCssPatchLayer',
  'localButtonClone',
  'localActionControlClone',
  'localIconColorPatch',
  'dialogLayoutChange',
  'modalBehaviorChange',
  'formFieldBehaviorChange',
  'aiProviderChange',
  'aiModelChange',
  'aiRuntimeBehaviorChange',
  'dataWriteChange',
  'googleCalendarSyncChange',
  'financeRuntimeChange',
  'CaseDetailRuntimeAdoption',
  'CalendarRuntimeAdoption',
  'FORBIDDEN_UNTIL_004F',
  'FORBIDDEN_UNTIL_004G',
  'sourceOfTruthUsage',
  'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  'NOT_STARTED',
  'visibleOutputDrift',
  'manualSmokeRequiredByDamian',
  'REQUIRED_BEFORE_RUNTIME_IMPORT',
  'FORBIDDEN',
]

const forbiddenBridgeTokens = [
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
  'gcal',
  'finance/',
  'src/lib/finance',
]

const allowedImports = new Set([
  './status-repository',
  './visual-repository',
  './runtime-adoption-readonly',
  './today-readonly-bridge',
  './lists-cards-readonly-bridge',
])

function fail(message) {
  console.error(JSON.stringify({ ok: false, stage: STAGE, error: message }, null, 2))
  process.exit(1)
}

function readRequired(rel) {
  const filePath = path.join(ROOT, rel)
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${rel}`)
  return fs.readFileSync(filePath, 'utf8')
}

function requireToken(content, token, label) {
  if (!content.includes(token)) fail(`${label} missing token: ${token}`)
}

function forbidToken(content, token, label) {
  if (content.includes(token)) fail(`${label} contains forbidden token: ${token}`)
}

const bridge = readRequired(bridgeRel)
const guard = readRequired('scripts/guards/verify-lf-prod-sot-004e-forms-modals-action-visual-bridge.cjs')
const test = readRequired(testRel)
const report = readRequired(reportRel)
const pkg = readRequired(packageRel)

for (const token of requiredExports) requireToken(bridge, `export const ${token}`, 'forms/modals/action visual bridge')
for (const token of requiredBridgeTokens) requireToken(bridge, token, 'forms/modals/action visual bridge')
for (const token of forbiddenBridgeTokens) forbidToken(bridge, token, 'forms/modals/action visual bridge')

const importMatches = [...bridge.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1])
for (const importPath of importMatches) {
  if (!allowedImports.has(importPath)) fail(`forms/modals/action visual bridge has forbidden import: ${importPath}`)
}
for (const importPath of allowedImports) {
  if (!importMatches.includes(importPath)) fail(`forms/modals/action visual bridge missing allowed required import: ${importPath}`)
}

for (const token of [String.fromCharCode(0xc4), String.fromCharCode(0xc5), String.fromCharCode(0xc3), String.fromCharCode(0xc2), String.fromCharCode(0xfffd), String.fromCharCode(0xfeff)]) {
  forbidToken(bridge, token, 'forms/modals/action visual bridge')
  forbidToken(guard, token, 'guard')
  forbidToken(test, token, 'test')
  forbidToken(report, token, 'report')
}

requireToken(pkg, '"verify:lf-prod-sot-004e-forms-modals-action-visual-bridge"', 'package.json')
requireToken(pkg, 'node scripts/guards/verify-lf-prod-sot-004e-forms-modals-action-visual-bridge.cjs', 'package.json')

for (const token of [
  '## Linki SOT / mapa wejściowa',
  '00_MAPY_I_ZALEZNOSCI_SOT.md',
  'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  'LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  'LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  'LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  '_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  'Forms runtime: NOT_TOUCHED',
  'Modals runtime: NOT_TOUCHED',
  'Dialogs runtime: NOT_TOUCHED',
  'Action controls runtime: NOT_TOUCHED',
  'Settings runtime: NOT_TOUCHED',
  'AI drafts runtime: NOT_TOUCHED',
  'AI provider/model/runtime: NOT_TOUCHED',
  'runtime behavior: NOT_TOUCHED',
  'UI components: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'Tailwind config: NOT_TOUCHED',
  'className: NOT_TOUCHED',
  'inline styles: NOT_TOUCHED',
  'new CSS patch layer: NOT_CREATED',
  'form field behavior: NOT_TOUCHED',
  'modal behavior: NOT_TOUCHED',
  'dialog layout: NOT_TOUCHED',
  'data writes: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Finance: NOT_TOUCHED',
  'CaseDetail runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004F',
  'Calendar runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004G',
  'Supabase/API: NOT_TOUCHED',
  'SQL: NOT_TOUCHED',
  'LF-PROD-SOT-004F: NOT_STARTED',
]) {
  requireToken(report, token, '004E report')
}

console.log(JSON.stringify({ ok: true, stage: STAGE, checked: { packageAlias: true, noMojibake: true, reportLinksAndMarkers: true } }, null, 2))
