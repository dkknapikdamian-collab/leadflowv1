const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')
const fail = (m) => { console.error('[004U] FAIL ' + m); process.exit(1) }
const must = (text, token, label) => { if (!text.includes(token)) fail(label + ' missing ' + token) }

const report004tRel = '_project/runs/LF-PROD-SOT-004T_NEXT_READONLY_NO_DRIFT_SCOPE_SELECTION_MAP.md'
const report004uRel = '_project/runs/LF-PROD-SOT-004U_READONLY_NO_DRIFT_GUARD_HARDENING_PLAN.md'
const report004vRel = '_project/runs/LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION.md'
const report004vR2Rel = '_project/runs/LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX.md'
const guard004uRel = 'scripts/guards/verify-lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.cjs'
const test004uRel = 'tests/lf-prod-sot-004u-readonly-no-drift-guard-hardening-plan.test.cjs'
const patchedGuard004tRel = 'scripts/guards/verify-lf-prod-sot-004t-next-readonly-no-drift-scope-selection-map.cjs'
const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const guard004vRel = 'scripts/guards/verify-lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.cjs'
const test004vRel = 'tests/lf-prod-sot-004v-readonly-no-drift-guard-helper-implementation.test.cjs'
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

const runNames = fs.readdirSync(rel('_project/runs'))
if (runNames.some((n) => n.includes('LF-PROD-SOT-004W'))) fail('004W report exists too early')

if (exists(report004vRel)) {
  const v = read(report004vRel)
  for (const token of [
    'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
    'GUARD_HELPER_IMPLEMENTATION_ONLY',
    'PLAN_SUPPORT_ONLY',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
    'GUARD_HELPER_CREATED: YES',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ]) must(v, token, report004vRel)
  for (const f of [helperRel, guard004vRel, test004vRel]) if (!exists(f)) fail('004V selected implementation file missing: ' + f)
} else if (exists(helperRel)) {
  fail('guard helper exists without 004V report: ' + helperRel)
}

if (exists(report004vR2Rel)) {
  const v2 = read(report004vR2Rel)
  for (const token of [
    'LF-PROD-SOT-004V-R2_PACKAGE_ALIAS_CLOSEOUT_FIX',
    'PACKAGE_ALIAS_REPAIRED',
    '004V_CLOSEOUT_REPAIRED',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'FINAL_ACCEPTANCE_BLOCKED',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-004W_READONLY_NO_DRIFT_HELPER_ADOPTION_FIRST_GUARD',
    '004W_CREATED: NO',
  ]) must(v2, token, report004vR2Rel)
}

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set([
  'package.json',
  report004uRel,
  guard004uRel,
  test004uRel,
  patchedGuard004tRel,
  report004vRel,
  report004vR2Rel,
  helperRel,
  guard004vRel,
  test004vRel,
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
  if (!allowed.has(f)) fail('changed file outside 004U/004V allowlist: ' + f)
  if (forbiddenPrefixes.some((p) => f.startsWith(p))) fail('forbidden product/runtime path changed: ' + f)
}

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004U',
  mode: exists(report004vR2Rel) ? 'SCOPE_GUARD_STILL_VALID_AFTER_SELECTED_004V_R2' : 'SCOPE_GUARD_STILL_VALID_AFTER_SELECTED_004V',
  planOnly: true,
  runtimeChange: 'NO_RUNTIME_CHANGE',
  outputDrift: 'NO_OUTPUT_DRIFT',
  productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
  selectedNextStage: 'LF-PROD-SOT-004V_READONLY_NO_DRIFT_GUARD_HELPER_IMPLEMENTATION',
  created004V: exists(report004vRel) ? 'ALLOWED_AS_SELECTED_NEXT_STAGE_HELPER_IMPLEMENTATION_ONLY' : false,
  guardHelperCreated: exists(helperRel) ? 'ALLOWED_BY_004V_ONLY' : false,
  aliasRepair: exists(report004vR2Rel) ? '004V_R2_ALLOWED_ALIAS_CLOSEOUT_FIX' : false,
}, null, 2))
