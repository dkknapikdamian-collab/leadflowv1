const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (m) => { console.error('[004R] FAIL ' + m); process.exit(1) }
const must = (text, token, label) => { if (!text.includes(token)) fail(label + ' missing ' + token) }

const report004qRel = '_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'
const report004rRel = '_project/runs/LF-PROD-SOT-004R_FINAL_MANUAL_SMOKE_GATE_PRODUCTION_PROOF.md'
const report004sRel = '_project/runs/LF-PROD-SOT-004S_EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_DECISION.md'
const guard004rRel = 'scripts/guards/verify-lf-prod-sot-004r-final-manual-smoke-gate-production-proof.cjs'
const test004rRel = 'tests/lf-prod-sot-004r-final-manual-smoke-gate-production-proof.test.cjs'
const pkgRel = 'package.json'

for (const f of [report004qRel, report004rRel, guard004rRel, test004rRel, pkgRel]) {
  if (!exists(f)) fail('missing ' + f)
}

const q = read(report004qRel)
const r = read(report004rRel)
const pkg = read(pkgRel)

for (const m of ['NEXT_DECISION_REQUIRED', 'FINAL_MANUAL_SMOKE_GATE_REQUIRED', '004R_CREATED: NO', 'READONLY_CLOSURE_GATE_ONLY', 'NO_RUNTIME_CHANGE', 'NO_OUTPUT_DRIFT']) must(q, m, report004qRel)
must(pkg, 'verify:lf-prod-sot-004r-final-manual-smoke-gate-production-proof', pkgRel)

for (const m of ['NO_RUNTIME_CHANGE','NO_OUTPUT_DRIFT','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','NO_CASEDETAIL_CHANGE','NO_FINANCE_CHANGE','004S created: NO','004S_CREATED: NO','NEXT_DECISION_REQUIRED']) must(r, m, report004rRel)

const hasPass = r.includes('FINAL_MANUAL_SMOKE_GATE_PASS') || r.includes('PRODUCTION_HOST_SMOKE_PASS')
if (hasPass) {
  for (const m of ['TODAY_SMOKE_PASS','TASKS_SMOKE_PASS','CALENDAR_SMOKE_PASS','LISTS_CARDS_SMOKE_PASS','PRODUCTION_HOST_SMOKE_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE: SATISFIED']) must(r, m, report004rRel)
  for (const bad of ['HONEST_BLOCKED_PROOF','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','FINAL_ACCEPTANCE_BLOCKED']) {
    if (r.includes(bad)) fail('PASS report contains blocked marker ' + bad)
  }
} else {
  for (const m of ['HONEST_BLOCKED_PROOF','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE','FINAL_ACCEPTANCE_BLOCKED']) must(r, m, report004rRel)
}

if (exists(report004sRel)) {
  const s = read(report004sRel)
  for (const m of ['EXPLICIT_READONLY_NO_DRIFT_CONTINUATION_APPROVED','NEXT_STAGES_ALLOWED_ONLY_IF_READONLY_NO_DRIFT','PRODUCTION_HOST_SMOKE_NOT_EXECUTED','MANUAL_SMOKE_STILL_NOT_PASS','FINAL_ACCEPTANCE_BLOCKED','004T_CREATED: NO']) must(s, m, report004sRel)
}
if (fs.readdirSync(rel('_project/runs')).some((n) => n.includes('LF-PROD-SOT-004T'))) fail('004T report exists')

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set([
  'package.json',
  report004rRel,
  guard004rRel,
  test004rRel,
  'scripts/guards/verify-lf-prod-sot-004q-readonly-rewire-closure-gate.cjs',
  report004sRel,
  'scripts/guards/verify-lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision.cjs',
  'tests/lf-prod-sot-004s-explicit-readonly-no-drift-continuation-decision.test.cjs',
])
for (const f of changed) {
  if (!allowed.has(f)) fail('unexpected changed file ' + f)
  if ([
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
  ].some((p) => f === p || f.startsWith(p))) fail('forbidden changed file ' + f)
}

const badChars = [0xfffd, 0, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a]
const mojibake = (text) => Array.from(text).some((c) => badChars.includes(c.charCodeAt(0)))
for (const f of [report004qRel, report004rRel, guard004rRel, test004rRel].concat(exists(report004sRel) ? [report004sRel] : [])) if (mojibake(read(f))) fail('mojibake ' + f)

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004R',
  status: hasPass ? 'FINAL_MANUAL_SMOKE_GATE_PASS' : 'HONEST_BLOCKED_PROOF',
  productionHostSmoke: hasPass ? 'PRODUCTION_HOST_SMOKE_PASS' : 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  manualSmoke: hasPass ? 'PASS' : 'MANUAL_SMOKE_STILL_NOT_PASS',
  smokeDebt: hasPass ? 'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED' : 'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  finalAcceptance: hasPass ? 'UNBLOCKED_BY_SMOKE' : 'FINAL_ACCEPTANCE_BLOCKED',
  nextDecision: 'NEXT_DECISION_REQUIRED',
  accepts004sExplicitReadonlyNoDriftDecision: true,
}, null, 2))
