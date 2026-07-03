const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const ROOT = process.cwd()
const reportRel = '_project/runs/LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.md'
const previousReportRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const ownerDecisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs'
const testRel = 'tests/lf-prod-sot-004m-today-runtime-import-smoke-and-decision.test.cjs'
const packageRel = 'package.json'

const allowedChanged = new Set([reportRel, ownerDecisionRel, guardRel, testRel, packageRel])
const allowedFutureStagePrefixes = [
  '_project/runs/LF-PROD-SOT-004N_',
  'scripts/guards/verify-lf-prod-sot-004n-',
  'tests/lf-prod-sot-004n-',
  'src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts',
  'src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts',
  'src/lib/work-items/normalize.ts',
  'src/lib/calendar-items.ts',
  '_project/runs/LF-PROD-SOT-004O_',
  'scripts/guards/verify-lf-prod-sot-004o-',
  'tests/lf-prod-sot-004o-',
]
const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'src/index.css',
  'supabase/',
  'migrations/',
  'sql/',
]
const forbiddenExact = new Set([
  'src/lib/source-of-truth/today-status-date-readonly-runtime.ts',
])
const mojibakePattern = /[\u0102\u201e\uFFFD\u0000\u0139\u203a]/

function full(rel) {
  return path.join(ROOT, rel)
}

function exists(rel) {
  return fs.existsSync(full(rel))
}

function read(rel) {
  if (!exists(rel)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full(rel), 'utf8')
}

function mustHave(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(abs, out)
    else out.push(path.relative(ROOT, abs).replace(/\\/g, '/'))
  }
  return out
}

const report = read(reportRel)
const previousReport = read(previousReportRel)
const test = read(testRel)
const pkg = read(packageRel)
const ownerDecisionExists = exists(ownerDecisionRel)
const ownerDecision = ownerDecisionExists ? read(ownerDecisionRel) : ''
const ownerAllowsNextReadOnlyStage = ownerDecision.includes('SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE') && ownerDecision.includes('NEXT_READONLY_NO_DRIFT_STAGE_ALLOWED')

for (const token of [
  'LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT',
  'READONLY_METADATA_IMPORT_ONLY',
  'MANUAL_SMOKE_REQUIRED_AFTER_004L',
  'MANUAL_SMOKE_PENDING',
  'NEXT_RUNTIME_IMPORT_BLOCKED',
  'NO_RUNTIME_CHANGE',
  'NO_UI_CHANGE',
  'NO_CSS_CHANGE',
  'NO_SQL_CHANGE',
  'NO_GCAL_CHANGE',
  'Nie tworzono 004N',
  'DECISION_REQUIRED_BEFORE_004N',
]) mustHave(report, token, reportRel)

for (const token of [
  'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED',
  'READONLY_METADATA_IMPORT_ONLY',
  'NO_OUTPUT_DRIFT',
  'MANUAL_SMOKE_REQUIRED_AFTER_004L',
]) mustHave(previousReport, token, previousReportRel)

if (ownerDecisionExists) {
  for (const token of [
    'OWNER_DECISION_RECORDED',
    'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  ]) mustHave(ownerDecision, token, ownerDecisionRel)
}

mustHave(pkg, 'verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision', packageRel)
mustHave(pkg, guardRel, packageRel)

if (pkg.charCodeAt(0) === 0xfeff) throw new Error('package.json has UTF-8 BOM; remove BOM before build/verify')

for (const token of ['Smoke result', 'Manual smoke checklist', 'Decision', 'Czego nie ruszano', 'Risk audit']) {
  mustHave(report, token, reportRel)
}

for (const token of [
  '004M report exists and links 004L metadata-only boundary',
  '004M report records pending smoke and blocks next runtime import',
  '004M does not create 004N',
  '004M package alias exists',
]) mustHave(test, token, testRel)

const files = walk(ROOT)
const created004N = files.filter((file) => /004N|004n/.test(file))
if (created004N.length > 0 && !ownerAllowsNextReadOnlyStage) {
  throw new Error(`004N files exist before owner deferral decision, forbidden in 004M: ${created004N.join(', ')}`)
}

for (const forbiddenRuntimeFile of forbiddenExact) {
  if (!exists(forbiddenRuntimeFile)) throw new Error(`Expected runtime boundary file is missing: ${forbiddenRuntimeFile}`)
}

let changed = []
try {
  changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean)
} catch (_) {
  changed = []
}
for (const file of changed) {
  const allowedFuture = ownerAllowsNextReadOnlyStage && allowedFutureStagePrefixes.some((prefix) => file.startsWith(prefix) || file === prefix)
  if (!allowedChanged.has(file) && !allowedFuture) throw new Error(`Unexpected changed file in 004M: ${file}`)
  if (forbiddenExact.has(file)) throw new Error(`Forbidden runtime boundary file changed in 004M: ${file}`)
  if (!allowedFuture && forbiddenChangedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) throw new Error(`Forbidden runtime/UI/CSS/SQL/API path changed in 004M: ${file}`)
}

for (const [label, text] of Object.entries({ report, previousReport, pkg, ownerDecision })) {
  if (text && mojibakePattern.test(text)) throw new Error(`Possible mojibake in ${label}`)
}

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004M',
  smokeResult: 'MANUAL_SMOKE_PENDING',
  ownerDecision: ownerDecisionExists ? 'RECORDED' : 'NOT_RECORDED',
  nextReadOnlyNoDriftAllowed: ownerAllowsNextReadOnlyStage,
  runtimeTouched: 'NO',
  created004NAllowedAfterR2: created004N.length > 0 && ownerAllowsNextReadOnlyStage,
  packageJsonBom: false,
  mojibakeScope: 'reports-package-owner-decision'
}, null, 2))
