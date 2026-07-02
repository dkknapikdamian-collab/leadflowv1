const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004D'

const bridgeRel = 'src/lib/source-of-truth/lists-cards-readonly-bridge.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004d-lists-cards-readonly-bridge.cjs'
const testRel = 'tests/lf-prod-sot-004d-lists-cards-readonly-bridge.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md'
const packageRel = 'package.json'

const allowedChangedFiles = new Set([
  bridgeRel,
  guardRel,
  testRel,
  reportRel,
  packageRel,
])

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/styles/',
  'src/App.',
  'src/main.',
  'supabase/',
  'migrations/',
  'src/api/',
  'src/lib/api/',
  'src/lib/data-provider',
  'src/lib/source-of-truth/status-repository.ts',
  'src/lib/source-of-truth/date-time-repository.ts',
  'src/lib/source-of-truth/visual-repository.ts',
  'src/lib/source-of-truth/runtime-adoption-readonly.ts',
  'src/lib/source-of-truth/today-readonly-bridge.ts',
]

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

const requiredBridgeTokens = [
  'LF-PROD-SOT-004D',
  'LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE',
  'runtimeBehaviorChange',
  'uiChange',
  'cssChange',
  'sortingChange',
  'filteringChange',
  'listCountChange',
  'cardLabelChange',
  'statusBucketChange',
  'statusLabelChange',
  'datePrecedenceChange',
  'silenceMarkerChange',
  'nextActionLabelChange',
  'clientHealthRecalculation',
  'clientSourcePortalMerge',
  'caseLifecycleRecalculation',
  'CaseDetailRuntimeAdoption',
  'badgeChange',
  'colorChange',
  'googleCalendarSyncChange',
  'dataWriteChange',
  'sourceOfTruthUsage',
  'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  'LeadsRuntimeAdoption',
  'LeadDetailRuntimeAdoption',
  'ClientsRuntimeAdoption',
  'ClientDetailRuntimeAdoption',
  'CasesRuntimeAdoption',
  'NOT_STARTED',
  'FORBIDDEN_UNTIL_004F',
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
  'src/styles/',
  '.css',
  'supabase',
  'google-calendar',
  'gcal',
]

const allowedImports = new Set([
  './status-repository',
  './date-time-repository',
  './visual-repository',
  './runtime-adoption-readonly',
  './today-readonly-bridge',
])

const mojibakeCodepoints = [0xc4, 0xc5, 0xc3, 0xc2, 0xfffd]
const mojibakeTokens = mojibakeCodepoints.map((codepoint) => String.fromCharCode(codepoint))

function fail(message) {
  console.error(JSON.stringify({ ok: false, stage: STAGE, error: message }, null, 2))
  process.exit(1)
}

function full(rel) {
  return path.join(ROOT, rel)
}

function readRequired(rel) {
  const filePath = full(rel)
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${rel}`)
  return fs.readFileSync(filePath, 'utf8')
}

function requireToken(content, token, label) {
  if (!content.includes(token)) fail(`${label} missing token: ${token}`)
}

function forbidToken(content, token, label) {
  if (content.includes(token)) fail(`${label} contains forbidden token: ${token}`)
}

function normalizeGitStatusPath(line) {
  const rawLine = String(line || '')
  if (!rawLine.trim()) return null
  const statusPayload = rawLine.length >= 3 ? rawLine.slice(3) : rawLine.trim()
  const rawPath = statusPayload.includes(' -> ') ? statusPayload.split(' -> ').pop() : statusPayload
  return rawPath.replaceAll('\\', '/').trim()
}

function changedFiles() {
  const result = cp.spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
  if (result.status !== 0) fail(`git status failed: ${result.stderr}`)
  return result.stdout.split(/\r?\n/).map(normalizeGitStatusPath).filter(Boolean)
}

const bridge = readRequired(bridgeRel)
const guard = readRequired(guardRel)
const test = readRequired(testRel)
const report = readRequired(reportRel)
const pkg = readRequired(packageRel)

for (const token of requiredExports) requireToken(bridge, `export const ${token}`, 'lists/cards readonly bridge')
for (const token of requiredBridgeTokens) requireToken(bridge, token, 'lists/cards readonly bridge')
for (const token of forbiddenBridgeTokens) forbidToken(bridge, token, 'lists/cards readonly bridge')

const importMatches = [...bridge.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1])
for (const importPath of importMatches) {
  if (!allowedImports.has(importPath)) fail(`lists/cards readonly bridge has forbidden import: ${importPath}`)
}
for (const importPath of allowedImports) {
  if (!importMatches.includes(importPath)) fail(`lists/cards readonly bridge missing allowed required import: ${importPath}`)
}

for (const token of mojibakeTokens) {
  forbidToken(bridge, token, 'lists/cards readonly bridge')
  forbidToken(guard, token, 'guard')
  forbidToken(test, token, 'test')
  forbidToken(report, token, 'report')
}

requireToken(pkg, '"verify:lf-prod-sot-004d-lists-cards-readonly-bridge"', 'package.json')
requireToken(pkg, 'node scripts/guards/verify-lf-prod-sot-004d-lists-cards-readonly-bridge.cjs', 'package.json')

requireToken(report, '## Linki SOT / mapa wejściowa', '004D report')
for (const token of [
  '00_MAPY_I_ZALEZNOSCI_SOT.md',
  'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  'LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  'LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  '_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  'Leads runtime: NOT_TOUCHED',
  'LeadDetail runtime: NOT_TOUCHED',
  'Clients runtime: NOT_TOUCHED',
  'ClientDetail runtime: NOT_TOUCHED',
  'Cases runtime: NOT_TOUCHED',
  'CaseDetail runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004F',
  'runtime behavior: NOT_TOUCHED',
  'sorting: NOT_TOUCHED',
  'filtering: NOT_TOUCHED',
  'list counts: NOT_TOUCHED',
  'status buckets: NOT_TOUCHED',
  'status labels: NOT_TOUCHED',
  'date precedence: NOT_TOUCHED',
  'silence markers: NOT_TOUCHED',
  'next-action labels: NOT_TOUCHED',
  'client health: NOT_TOUCHED',
  'client source/portal: NOT_TOUCHED',
  'case lifecycle: NOT_TOUCHED',
  'badges/colors: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'UI components: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Supabase/API: NOT_TOUCHED',
  'SQL: NOT_TOUCHED',
  'LF-PROD-SOT-004E: NOT_STARTED',
]) {
  requireToken(report, token, '004D report')
}

for (const fileName of changedFiles()) {
  if (!allowedChangedFiles.has(fileName)) fail(`Changed file outside LF-PROD-SOT-004D allowlist: ${fileName}`)
  if (forbiddenChangedPrefixes.some((prefix) => fileName.startsWith(prefix))) {
    fail(`Forbidden runtime/UI/source-of-truth file changed in LF-PROD-SOT-004D: ${fileName}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    files: [bridgeRel, guardRel, testRel, reportRel, packageRel],
    packageAlias: true,
    requiredExports: requiredExports.length,
    requiredBridgeTokens: requiredBridgeTokens.length,
    changedFileAllowlist: true,
    noMojibake: true,
    reportLinksAndMarkers: true,
  },
}, null, 2))
