const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (m) => { console.error('[004U] FAIL ' + m); process.exit(1) }
const must = (text, token, label) => { if (!text.includes(token)) fail(label + ' missing ' + token) }

const report004tRel = '_project/runs/LF-PROD-SOT-004T_NEXT_READONLY_NO_DRIFT_SCOPE_SELECTION_MAP.md'
const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
const test004uRel = 'tests/lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.test.cjs'
const patchedGuard004tRel = 'scripts/guards/verify-lf-prod-sot-004t-next-readonly-no-drift-scope-selection-map.cjs'
const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const pkgRel = 'package.json'

for (const f of [report004tRel, report004uRel, guard004uRel, test004uRel, patchedGuard004tRel, pkgRel]) {
  if (!exists(f)) fail('missing ' + f)
}

const t = read(report004tRel)
const u = read(report004uRel)
const pkg = read(pkgRel)

for (const m of [
  'SCOPE_SELECTION_MAP_ONLY',
  'PLAN_ONLY',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
  '004U_CREATED: NO',
  'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  'MANUAL_SMOKE_STILL_NOT_PASS',
  'FINAL_ACCEPTANCE_BLOCKED',
]) must(t, m, report004tRel)

for (const m of [
  'LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN',
  'GUARD_HARDENING_PLAN_ONLY',
  'PLAN_ONLY',
  'NO_RUNTIME_CHANGE',
  'NO_OUTPUT_DRIFT',
  'NO_UI_CHANGE',
  'NO_CSS_CHANGE',
  'NO_SQL_CHANGE',
  'NO_SUPABASE_API_CHANGE',
  'NO_GCAL_CHANGE',
  'NO_CASEDETAIL_CHANGE',
  'NO_FINANCE_CHANGE',
  'NO_RUNTIME_DATA_CHANGE',
  'NO_DATA_FLOWS_CHANGE',
  'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  'MANUAL_SMOKE_STILL_NOT_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  'FINAL_ACCEPTANCE_BLOCKED',
  'NEXT_STAGE_SELECTED: LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
  '004V_CREATED: NO',
  'GUARD_HELPER_CREATED: NO',
  'changed files allowlist per stage',
  helperRel,
]) must(u, m, report004uRel)

must(pkg, 'verify:lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan', pkgRel)

for (const token of [
  'FINAL_MANUAL_SMOKE_GATE_PASS',
  'PRODUCTION_HOST_SMOKE_PASS',
  'TODAY_SMOKE_PASS',
  'TASKS_SMOKE_PASS',
  'CALENDAR_SMOKE_PASS',
  'LISTS_CARDS_SMOKE_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
  'FINAL_ACCEPTANCE_PASS',
  'FINAL_ACCEPTANCE_UNBLOCKED',
  'PRODUCTION_VERIFIED',
  'RUNTIME_IMPORT_DONE',
  'OUTPUT_CHANGED',
  'UI_CHANGED',
  'CSS_CHANGED',
  'GCAL_CHANGED',
  'SQL_CHANGED',
]) {
  if (u.includes(token)) fail('004U contains forbidden positive claim ' + token)
}

if (fs.readdirSync(rel('_project/runs')).some((n) => n.includes('LF-PROD-SOT-004V'))) fail('004V report exists')
if (exists(helperRel)) fail('guard helper exists too early: ' + helperRel)

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set([
  'package.json',
  report004uRel,
  guard004uRel,
  test004uRel,
  patchedGuard004tRel,
])
const forbiddenPrefixes = [
  'src/pages/',
  'src/components/',
  'src/styles/',
  'src/index.css',
  'src/lib/calendar-items.ts',
  'src/lib/work-items/normalize.ts',
  'src/lib/clients.ts',
  'src/lib/cases.ts',
  'src/lib/google-calendar',
  'src/lib/gcal',
  'src/lib/calendar-sync',
  'src/lib/calendar-provider',
  'src/pages/CaseDetail.tsx',
  'src/lib/finance/',
  'supabase/',
  'migrations/',
  'sql/',
  'runtime/data/',
  'data/flows.json',
]
for (const f of changed) {
  if (!allowed.has(f)) fail('unexpected changed file ' + f)
  if (forbiddenPrefixes.some((p) => f === p || f.startsWith(p))) fail('forbidden changed file ' + f)
}

const badChars = [0xfffd, 0, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a]
const mojibake = (text) => Array.from(text).some((c) => badChars.includes(c.charCodeAt(0)))
for (const f of [report004tRel, report004uRel, guard004uRel, test004uRel, patchedGuard004tRel]) if (mojibake(read(f))) fail('mojibake ' + f)

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004U',
  mode: 'GUARD_HARDENING_PLAN_ONLY',
  planOnly: true,
  runtimeChange: 'NO_RUNTIME_CHANGE',
  outputDrift: 'NO_OUTPUT_DRIFT',
  productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
  selectedNextStage: 'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
  created004V: false,
  guardHelperCreated: false,
}, null, 2))
