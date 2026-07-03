const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (m) => { console.error('[004S] FAIL ' + m); process.exit(1) }
const must = (text, token, label) => { if (!text.includes(token)) fail(label + ' missing ' + token) }

const report004rRel = '_project/runs/LF-PROD-SOT-004R_FINAL_MANUAL_SMOKE_GATE_PRODUCTION_PROOF.md'
const report004sRel = '_project/runs/LF-PROD-SOT-004S_EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_DECISION.md'
const guard004sRel = 'scripts/guards/verify-lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision.cjs'
const test004sRel = 'tests/lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision.test.cjs'
const guard004rRel = 'scripts/guards/verify-lf-prod-sot-004r-final-manual-smoke-gate-production-proof.cjs'
const pkgRel = 'package.json'

for (const f of [report004rRel, report004sRel, guard004sRel, test004sRel, guard004rRel, pkgRel]) {
  if (!exists(f)) fail('missing ' + f)
}

const r = read(report004rRel)
const s = read(report004sRel)
const pkg = read(pkgRel)

for (const m of [
  'HONEST_BLOCKED_PROOF',
  'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  'MANUAL_SMOKE_STILL_NOT_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  'FINAL_ACCEPTANCE_BLOCKED',
  'NEXT_DECISION_REQUIRED',
  '004S_CREATED: NO',
]) must(r, m, report004rRel)

for (const m of [
  'EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_APPROVED',
  'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  'MANUAL_SMOKE_STILL_NOT_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  'FINAL_ACCEPTANCE_BLOCKED',
  'NEXT_STAGES_ALLOWED_ONLY_IF_READONLY_NO_DRIFT',
  'NO_RUNTIME_CHANGE',
  'NO_OUTPUT_DRIFT',
  'NO_UI_CHANGE',
  'NO_CSS_CHANGE',
  'NO_SQL_CHANGE',
  'NO_SUPABASE_API_CHANGE',
  'NO_GCAL_CHANGE',
  'NO_CASEDETAIL_CHANGE',
  'NO_FINANCE_CHANGE',
  '004T_CREATED: NO',
]) must(s, m, report004sRel)

must(pkg, 'verify:lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision', pkgRel)

for (const token of [
  'FINAL_MANUAL_SMOKE_GATE_PASS',
  'PRODUCTION_HOST_SMOKE_PASS',
  'TODAY_SMOKE_PASS',
  'TASKS_SMOKE_PASS',
  'CALENDAR_SMOKE_PASS',
  'LISTS_CARDS_SMOKE_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
  'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE: SATISFIED',
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
  if (s.includes(token)) fail('004S contains forbidden positive claim ' + token)
}

if (fs.readdirSync(rel('_project/runs')).some((n) => n.includes('LF-PROD-SOT-004T'))) fail('004T report exists')

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set([
  'package.json',
  report004sRel,
  guard004sRel,
  test004sRel,
  guard004rRel,
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
for (const f of [report004rRel, report004sRel, guard004sRel, test004sRel, guard004rRel]) if (mojibake(read(f))) fail('mojibake ' + f)

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004S',
  decision: 'EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_APPROVED',
  productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
  nextPolicy: 'NEXT_STAGES_ALLOWED_ONLY_IF_READONLY_NO_DRIFT',
  runtimeChange: 'NO_RUNTIME_CHANGE',
  outputDrift: 'NO_OUTPUT_DRIFT',
  created004T: false,
}, null, 2))
