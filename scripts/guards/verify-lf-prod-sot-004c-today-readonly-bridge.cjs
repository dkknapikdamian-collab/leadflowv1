const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004C'

const bridgeRel = 'src/lib/source-of-truth/today-readonly-bridge.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004c-today-readonly-bridge.cjs'
const testRel = 'tests/lf-prod-sot-004c-today-readonly-bridge.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md'
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
]

const requiredExports = [
  'todayReadonlyBridgeStage',
  'todayReadonlyBridgeMode',
  'todayReadonlyBridgeSourceMap',
  'todayReadonlyBridgeConsumers',
  'todayReadonlyBridgeRepositories',
  'todayReadonlyBridgeAllowedAreas',
  'todayReadonlyBridgeBlockedAreas',
  'todayReadonlyBridgeHardRules',
  'todayReadonlyBridgeNoDriftPolicy',
  'todayReadonlyBridgeFixturePolicy',
  'todayReadonlyBridgeManualSmokePolicy',
  'todayReadonlyBridgeNextStages',
  'todayReadonlyBridgeReport',
]

const requiredBridgeTokens = [
  'LF-PROD-SOT-004C',
  'TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE',
  'runtimeBehaviorChange',
  'uiChange',
  'cssChange',
  'sortingChange',
  'filteringChange',
  'bucketChange',
  'datePrecedenceChange',
  'statusLabelChange',
  'badgeChange',
  'colorChange',
  'googleCalendarSyncChange',
  'dataWriteChange',
  'sourceOfTruthUsage',
  'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  'TodayRuntimeAdoption',
  'TodayStableRuntimeAdoption',
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
])

const forbiddenMojibakeCodepoints = [0xc4, 0xc5, 0xc6, 0xc3, 0xc2, 0xfffd]
const mojibakeTokens = forbiddenMojibakeCodepoints.map((codepoint) => String.fromCharCode(codepoint))

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

for (const token of requiredExports) requireToken(bridge, `export const ${token}`, 'today readonly bridge')
for (const token of requiredBridgeTokens) requireToken(bridge, token, 'today readonly bridge')
for (const token of forbiddenBridgeTokens) forbidToken(bridge, token, 'today readonly bridge')

const importMatches = [...bridge.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1])
for (const importPath of importMatches) {
  if (!allowedImports.has(importPath)) fail(`today readonly bridge has forbidden import: ${importPath}`)
}
for (const importPath of allowedImports) {
  if (!importMatches.includes(importPath)) fail(`today readonly bridge missing allowed required import: ${importPath}`)
}

for (const token of mojibakeTokens) {
  forbidToken(bridge, token, 'today readonly bridge')
  forbidToken(guard, token, 'guard')
  forbidToken(test, token, 'test')
  forbidToken(report, token, 'report')
}

requireToken(pkg, '"verify:lf-prod-sot-004c-today-readonly-bridge"', 'package.json')
requireToken(pkg, 'node scripts/guards/verify-lf-prod-sot-004c-today-readonly-bridge.cjs', 'package.json')

const sAcute = String.fromCharCode(0x015b)
requireToken(report, `## Linki SOT / mapa wej${sAcute}ciowa`, '004C report')
for (const token of [
  '00_MAPY_I_ZALEZNOSCI_SOT.md',
  'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  'LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  'Today runtime: NOT_TOUCHED',
  'TodayStable runtime: NOT_TOUCHED',
  'runtime behavior: NOT_TOUCHED',
  'sorting: NOT_TOUCHED',
  'filtering: NOT_TOUCHED',
  'date buckets: NOT_TOUCHED',
  'status labels: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'UI components: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Supabase/API: NOT_TOUCHED',
  'SQL: NOT_TOUCHED',
  'LF-PROD-SOT-004D: NOT_STARTED',
]) {
  requireToken(report, token, '004C report')
}

for (const fileName of changedFiles()) {
  if (!allowedChangedFiles.has(fileName)) fail(`Changed file outside LF-PROD-SOT-004C allowlist: ${fileName}`)
  if (forbiddenChangedPrefixes.some((prefix) => fileName.startsWith(prefix))) {
    fail(`Forbidden runtime/UI/source-of-truth path changed: ${fileName}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  mode: 'TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE',
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  bucketChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  visibleOutputDrift: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
}, null, 2))
