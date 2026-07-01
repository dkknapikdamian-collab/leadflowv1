const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004B'

const runtimePath = path.join(ROOT, 'src/lib/source-of-truth/runtime-adoption-readonly.ts')
const guardPath = path.join(ROOT, 'scripts/guards/verify-lf-prod-sot-004b-readonly-runtime-adoption.cjs')
const testPath = path.join(ROOT, 'tests/lf-prod-sot-004b-readonly-runtime-adoption.test.cjs')
const reportPath = path.join(ROOT, '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md')
const packagePath = path.join(ROOT, 'package.json')

const allowedChangedFiles = new Set([
  'src/lib/source-of-truth/runtime-adoption-readonly.ts',
  'scripts/guards/verify-lf-prod-sot-004b-readonly-runtime-adoption.cjs',
  'tests/lf-prod-sot-004b-readonly-runtime-adoption.test.cjs',
  '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  'package.json',
])

const requiredRuntimeTokens = [
  'runtimeAdoptionStage',
  'runtimeAdoptionMode',
  'runtimeAdoptionSourceMap',
  'safeReadOnlyAdoptionAreas',
  'blockedRuntimeAdoptionAreas',
  'runtimeAdoptionHardRules',
  'runtimeAdoptionRepositoryBoundaries',
  'runtimeAdoptionNoOutputDriftPolicy',
  'runtimeAdoptionNextStages',
  'runtimeAdoptionReport',
  'LF-PROD-SOT-004B',
  'SAFE_READ_ONLY_ADOPTION_STAGE_1',
  'runtimeBehaviorChange',
  'FORBIDDEN',
  'uiChange',
  'cssChange',
  'dataWriteChange',
  'statusRepositoryRuntimeAdoption',
  'dateTimeRepositoryRuntimeAdoption',
  'visualRepositoryRuntimeAdoption',
  'NOT_STARTED',
  'sourceOfTruthUsage',
  'GUARDS_TESTS_ADAPTERS_ONLY',
  'visibleOutputDrift',
]

const forbiddenRuntimeTokens = [
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
  'tailwind',
  'supabase',
  'google-calendar',
]

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/styles/',
  'src/App.',
  'src/main.',
  'supabase/',
  'migrations/',
]

const forbiddenMojibakeCodepoints = [0xc4, 0xc5, 0xc6, 0xc3, 0xc2, 0xfffd]
const mojibakeTokens = forbiddenMojibakeCodepoints.map((codepoint) => String.fromCharCode(codepoint))

function fail(message) {
  console.error(JSON.stringify({ ok: false, stage: STAGE, error: message }, null, 2))
  process.exit(1)
}

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${path.relative(ROOT, filePath).replaceAll(path.sep, '/')}`)
  return fs.readFileSync(filePath, 'utf8')
}

function requireToken(content, token, label) {
  if (!content.includes(token)) fail(`${label} missing token: ${token}`)
}

function forbidToken(content, token, label) {
  if (content.includes(token)) fail(`${label} contains forbidden token code: ${token.charCodeAt(0)}`)
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

  return result.stdout
    .split(/\r?\n/)
    .map(normalizeGitStatusPath)
    .filter(Boolean)
}

const runtime = readRequired(runtimePath)
const guard = readRequired(guardPath)
const test = readRequired(testPath)
const report = readRequired(reportPath)
const pkg = readRequired(packagePath)

for (const token of requiredRuntimeTokens) requireToken(runtime, token, 'runtime adoption contract')
for (const token of forbiddenRuntimeTokens) forbidToken(runtime, token, 'runtime adoption contract')
for (const token of mojibakeTokens) {
  forbidToken(runtime, token, 'runtime adoption contract')
  forbidToken(guard, token, 'guard')
  forbidToken(test, token, 'test')
  forbidToken(report, token, 'report')
}

requireToken(pkg, '"verify:lf-prod-sot-004b-readonly-runtime-adoption"', 'package.json')
requireToken(pkg, 'node scripts/guards/verify-lf-prod-sot-004b-readonly-runtime-adoption.cjs', 'package.json')

requireToken(report, '## Linki SOT / mapa wejściowa', 'run report')
requireToken(report, 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md', 'run report')
requireToken(report, '00_MAPY_I_ZALEZNOSCI_SOT.md', 'run report')
requireToken(report, '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md', 'run report')
requireToken(report, 'runtime: NOT_TOUCHED', 'run report')
requireToken(report, 'CSS: NOT_TOUCHED', 'run report')
requireToken(report, 'UI components: NOT_TOUCHED', 'run report')
requireToken(report, 'SQL: NOT_TOUCHED', 'run report')
requireToken(report, 'Google Calendar sync: NOT_TOUCHED', 'run report')
requireToken(report, 'Supabase/API: NOT_TOUCHED', 'run report')
requireToken(report, 'LF-PROD-SOT-004C: NOT_STARTED', 'run report')

for (const fileName of [
  'src/lib/source-of-truth/status-repository.ts',
  'src/lib/source-of-truth/date-time-repository.ts',
  'src/lib/source-of-truth/visual-repository.ts',
]) {
  const full = path.join(ROOT, fileName)
  if (fs.existsSync(full)) {
    const content = fs.readFileSync(full, 'utf8')
    if (content.includes('runtime-adoption-readonly')) {
      fail(`${fileName} must not import runtime-adoption-readonly`)
    }
  }
}

for (const fileName of changedFiles()) {
  if (!allowedChangedFiles.has(fileName)) fail(`Changed file outside LF-PROD-SOT-004B allowlist: ${fileName}`)
  if (forbiddenChangedPrefixes.some((prefix) => fileName.startsWith(prefix))) {
    fail(`Forbidden runtime/UI/CSS path changed: ${fileName}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  mode: 'SAFE_READ_ONLY_ADOPTION_STAGE_1',
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_ADAPTERS_ONLY',
  visibleOutputDrift: 'FORBIDDEN',
}, null, 2))
