const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004F'

const planRel = 'src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004f-casedetail-isolated-adoption-plan.cjs'
const testRel = 'tests/lf-prod-sot-004f-casedetail-isolated-adoption-plan.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md'
const packageRel = 'package.json'
const bridge004eRel = 'src/lib/source-of-truth/forms-modals-action-visual-readonly-bridge.ts'
const report004eRel = '_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md'

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

const requiredPlanTokens = [
  'LF-PROD-SOT-004F',
  'CASEDETAIL_ISOLATED_ADOPTION_PLAN',
  'runtimeBehaviorChange',
  'uiChange',
  'cssChange',
  'layoutChange',
  'componentReplacement',
  'CaseDetailRuntimeAdoption',
  'CaseDetailRepositoryImport',
  'FORBIDDEN_IN_RUNTIME',
  'caseStatusRedefinition',
  'caseLifecycleRecalculation',
  'activityTimelineChange',
  'serviceWorkspaceChange',
  'checklistChange',
  'notesChange',
  'actionPanelChange',
  'rightRailChange',
  'financeSettlementChange',
  'paymentStatusChange',
  'commissionStatusChange',
  'amountCalculationChange',
  'datePrecedenceChange',
  'statusLabelChange',
  'badgeChange',
  'colorChange',
  'googleCalendarSyncChange',
  'dataWriteChange',
  'GUARDS_TESTS_ISOLATED_PLAN_ONLY',
  'visibleOutputDrift',
  'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  'CalendarRuntimeAdoption',
  'FinanceRuntimeAdoption',
  'FORBIDDEN_UNTIL_004G',
  'FORBIDDEN_IN_004F',
  'NOT_STARTED',
  'FORBIDDEN',
]

const requiredAnchorTokens = [
  'caseDetailHeaderAnchor',
  'caseLifecycleAnchor',
  'caseStatusAnchor',
  'serviceWorkspaceAnchor',
  'historyTimelineAnchor',
  'notesAnchor',
  'checklistAnchor',
  'actionPanelAnchor',
  'rightRailAnchor',
  'financeSettlementAnchor',
  'paymentStatusAnchor',
  'commissionStatusAnchor',
  'plannedActionsAnchor',
  'ownerControlAnchor',
  'activityTruthAnchor',
  'visualLayoutAnchor',
]

const forbiddenPlanTokens = [
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
  'owner-control/',
  'planned-actions',
  'activity-timeline',
  'case-lifecycle',
]

const allowedImports = new Set([
  './status-repository',
  './date-time-repository',
  './visual-repository',
  './runtime-adoption-readonly',
  './lists-cards-readonly-bridge',
  './forms-modals-action-visual-readonly-bridge',
])

const allowedChangedFiles = new Set([
  planRel,
  guardRel,
  testRel,
  reportRel,
  packageRel,
  bridge004eRel,
  report004eRel,
])

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'src/index.css',
  'src/lib/finance/',
  'src/lib/owner-control/',
  'src/lib/planned-actions.ts',
  'src/lib/activity-timeline.ts',
  'src/lib/case-lifecycle-v1.ts',
  'src/lib/source-of-truth/status-repository.ts',
  'src/lib/source-of-truth/date-time-repository.ts',
  'src/lib/source-of-truth/visual-repository.ts',
  'src/lib/source-of-truth/runtime-adoption-readonly.ts',
  'src/lib/source-of-truth/today-readonly-bridge.ts',
  'src/lib/source-of-truth/lists-cards-readonly-bridge.ts',
  'supabase/',
  'migrations/',
  'src/api/',
  'src/lib/api/',
  'src/lib/data-provider',
  'src/lib/routes',
  'src/lib/auth',
]

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

function normalizeGitStatusPath(line) {
  const rawLine = String(line || '')
  if (!rawLine.trim()) return null
  const payload = rawLine.length >= 3 ? rawLine.slice(3) : rawLine.trim()
  const rawPath = payload.includes(' -> ') ? payload.split(' -> ').pop() : payload
  return rawPath.replaceAll('\\', '/').replace(/^"|"$/g, '').trim()
}

function changedFiles() {
  const result = cp.spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
  if (result.status !== 0) fail(`git status failed: ${result.stderr}`)
  return result.stdout.split(/\r?\n/).map(normalizeGitStatusPath).filter(Boolean)
}

const plan = readRequired(planRel)
const guard = readRequired(guardRel)
const test = readRequired(testRel)
const report = readRequired(reportRel)
const pkg = readRequired(packageRel)
const bridge004e = readRequired(bridge004eRel)
const report004e = readRequired(report004eRel)

for (const exportName of requiredExports) requireToken(plan, `export const ${exportName}`, '004F plan')
for (const token of requiredPlanTokens) requireToken(plan, token, '004F plan')
for (const token of requiredAnchorTokens) requireToken(plan, token, '004F plan anchor map')
for (const token of forbiddenPlanTokens) forbidToken(plan, token, '004F plan')

const importMatches = [...plan.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1])
for (const importPath of importMatches) {
  if (!allowedImports.has(importPath)) fail(`004F plan has forbidden import: ${importPath}`)
}
for (const importPath of allowedImports) {
  if (!importMatches.includes(importPath)) fail(`004F plan missing required import: ${importPath}`)
}

for (const token of [String.fromCharCode(0xc4), String.fromCharCode(0xc5), String.fromCharCode(0xc3), String.fromCharCode(0xc2), String.fromCharCode(0xfffd), String.fromCharCode(0xfeff)]) {
  forbidToken(plan, token, '004F plan')
  forbidToken(guard, token, '004F guard')
  forbidToken(test, token, '004F test')
  forbidToken(report, token, '004F report')
  forbidToken(bridge004e, token, '004E bridge')
  forbidToken(report004e, token, '004E report')
}

requireToken(pkg, '"verify:lf-prod-sot-004f-casedetail-isolated-adoption-plan"', 'package.json')
requireToken(pkg, 'node scripts/guards/verify-lf-prod-sot-004f-casedetail-isolated-adoption-plan.cjs', 'package.json')
requireToken(bridge004e, "status: 'FORMS_MODALS_ACTION_VISUAL_BRIDGE_ADDED'", '004E bridge')
requireToken(report004e, 'FORMS_MODALS_ACTION_VISUAL_BRIDGE_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / DIFF_CHECK_PASS / READY_FOR_004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN', '004E report main status')

for (const token of [
  '## Linki SOT / mapa wejściowa',
  '00_MAPY_I_ZALEZNOSCI_SOT.md',
  'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  'LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  'LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  '_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  '004E formal cleanup: DONE',
  'CaseDetail runtime: NOT_TOUCHED',
  'CaseDetail repository import: NOT_TOUCHED / FORBIDDEN_IN_RUNTIME',
  'runtime behavior: NOT_TOUCHED',
  'UI components: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'layout: NOT_TOUCHED',
  'case status: NOT_TOUCHED',
  'case lifecycle: NOT_TOUCHED',
  'activity timeline: NOT_TOUCHED',
  'service workspace: NOT_TOUCHED',
  'notes: NOT_TOUCHED',
  'checklist: NOT_TOUCHED',
  'action panel: NOT_TOUCHED',
  'right rail: NOT_TOUCHED',
  'finance settlement: NOT_TOUCHED',
  'payment status: NOT_TOUCHED',
  'commission status: NOT_TOUCHED',
  'amount calculation: NOT_TOUCHED',
  'date precedence: NOT_TOUCHED',
  'status labels: NOT_TOUCHED',
  'badges/colors: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Finance runtime: NOT_TOUCHED / FORBIDDEN_IN_004F',
  'Calendar runtime: NOT_TOUCHED / FORBIDDEN_UNTIL_004G',
  'Supabase/API: NOT_TOUCHED',
  'SQL: NOT_TOUCHED',
  'LF-PROD-SOT-004G: NOT_STARTED',
]) {
  requireToken(report, token, '004F report')
}

for (const fileName of changedFiles()) {
  if (!allowedChangedFiles.has(fileName)) fail(`Changed file outside LF-PROD-SOT-004F allowlist: ${fileName}`)
  if (forbiddenChangedPrefixes.some((prefix) => fileName.startsWith(prefix))) {
    fail(`Forbidden runtime/source file changed in LF-PROD-SOT-004F: ${fileName}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    requiredExports: requiredExports.length,
    requiredAnchors: requiredAnchorTokens.length,
    noMojibake: true,
    noRuntimeImports: true,
    reportLinksAndMarkers: true,
    changedFileAllowlist: true,
  },
}, null, 2))
