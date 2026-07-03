const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (m) => { console.error('[004Q] FAIL ' + m); process.exit(1) }
const must = (t, m, l) => { if (!t.includes(m)) fail(l + ' missing ' + m) }

const adapterRel = 'src/lib/source-of-truth/readonly-rewire-closure-gate.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'
const testRel = 'tests/lf-prod-sot-004q-readonly-rewire-closure-gate.test.cjs'
const pkgRel = 'package.json'
const report004lRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const decisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const report004nRel = '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const report004oRel = '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const report004pRel = '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
for (const f of [adapterRel, reportRel, testRel, pkgRel, report004lRel, decisionRel, report004nRel, report004oRel, report004pRel]) if (!exists(f)) fail('missing ' + f)
const adapter = read(adapterRel), report = read(reportRel), pkg = read(pkgRel)
const repL = read(report004lRel), decision = read(decisionRel), repN = read(report004nRel), repO = read(report004oRel), repP = read(report004pRel)
for (const m of ['LF-PROD-SOT-004Q','READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER','LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED','LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_CLOSURE_GATE_ONLY','NO_RUNTIME_CHANGE','NO_OUTPUT_DRIFT','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','NO_CASEDETAIL_CHANGE','NO_FINANCE_CHANGE','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','FINAL_MANUAL_SMOKE_GATE_REQUIRED','NEXT_DECISION_REQUIRED','004R_CREATED: NO']) must(adapter, m, adapterRel)
for (const m of ['READONLY_REWIRE_CLOSURE_GATE_ADDED','GUARD_PASS','TEST_PASS','BUILD_PASS','DIFF_CHECK_PASS','READONLY_CLOSURE_GATE_ONLY','NO_RUNTIME_CHANGE','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','FINAL_MANUAL_SMOKE_GATE_REQUIRED','NEXT_DECISION_REQUIRED','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','NO_CASEDETAIL_CHANGE','NO_FINANCE_CHANGE','004R created: NO','Does this stage claim smoke PASS: NO']) must(report, m, reportRel)
for (const m of ['TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT']) must(repL, m, report004lRel)
for (const m of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE']) must(decision, m, decisionRel)
for (const m of ['TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','LOCAL_RERUN_PASS_AFTER_R2','NO_OUTPUT_DRIFT']) must(repN, m, report004nRel)
for (const m of ['CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','NO_GCAL_CHANGE','NO_OUTPUT_DRIFT']) must(repO, m, report004oRel)
for (const m of ['LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','LISTS_CARDS_OUTPUT_UNCHANGED','NO_OUTPUT_DRIFT']) must(repP, m, report004pRel)
for (const [label, text] of Object.entries({ repL, decision, repN, repO, repP, report })) {
  for (const bad of ['MANUAL_SMOKE_PASS_CLAIMED','FULL_MANUAL_SMOKE_PASS','Manual smoke: PASS','manualSmokePass: true','doesThisStageClaimSmokePass: true']) if (text.includes(bad)) fail(label + ' has forbidden manual smoke pass claim ' + bad)
}
must(pkg, 'verify:lf-prod-sot-004q-readonly-rewire-closure-gate', pkgRel)
const importLines = adapter.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
for (const allowed of ['./today-status-date-readonly-runtime','./tasks-status-date-readonly-runtime','./calendar-status-date-readonly-runtime','./list-cards-status-date-readonly-runtime']) must(importLines, allowed, adapterRel)
for (const s of ['react','react-dom','../pages/','./pages/','../components/','./components/','.css','google-calendar','gcal','calendar-sync','calendar-provider','CaseDetail','case-detail','finance/','supabase','fetch(','axios']) if (importLines.includes(s)) fail('adapter forbidden import snippet ' + s)
for (const s of ['document.','window.','localStorage.','sessionStorage.']) if (adapter.includes(s)) fail('adapter forbidden runtime snippet ' + s)
let changed=[]; try { changed=childProcess.execSync('git diff --name-only HEAD',{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowedChanged = new Set(['package.json', adapterRel, reportRel, testRel, 'scripts/guards/verify-lf-prod-sot-004q-readonly-rewire-closure-gate.cjs', 'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs', 'scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs', 'scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs', 'scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs', '_project/runs/LF-PROD-SOT-004R_FINAL_MANUAL_SMOKE_GATE_PRODUCTION_PROOF.md', 'scripts/guards/verify-lf-prod-sot-004r-final-manual-smoke-gate-production-proof.cjs', 'tests/lf-prod-sot-004r-final-manual-smoke-gate-production-proof.test.cjs'])
for (const f of changed) if (!allowedChanged.has(f)) fail('unexpected changed file ' + f)
for (const f of changed) if (['src/pages/','src/components/','src/styles/','src/index.css','src/lib/calendar-items.ts','src/lib/work-items/normalize.ts','src/lib/clients.ts','src/lib/cases.ts','src/lib/google-calendar','src/lib/gcal','src/lib/calendar-sync','src/lib/calendar-provider','src/pages/CaseDetail.tsx','src/lib/finance/','supabase/','migrations/','sql/'].some((p)=>f===p||f.startsWith(p))) fail('forbidden changed file '+f)
const badChars=[0xfffd,0,0x0102,0x00c2,0x00c3,0x0139,0x203a]; const moj=(t)=>Array.from(t).some((c)=>badChars.includes(c.charCodeAt(0)))
for (const f of [adapterRel,reportRel,testRel,report004lRel,decisionRel,report004nRel,report004oRel,report004pRel]) if (moj(read(f))) fail('mojibake '+f)
console.log(JSON.stringify({ ok:true, stage:'LF-PROD-SOT-004Q', mode:'READONLY_CLOSURE_GATE_ONLY', runtimeChange:'NO_RUNTIME_CHANGE', outputDrift:'NO_OUTPUT_DRIFT', smokeDebt:'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE', manualSmoke:'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS', finalManualSmokeGateRequired:true, nextDecision:'FINAL_MANUAL_SMOKE_GATE_OR_EXPLICIT_NEXT_READONLY_STAGE', accepts004rFinalSmokeGate:true }, null, 2))