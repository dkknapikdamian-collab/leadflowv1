const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const ROOT = process.cwd()
const full = (rel) => path.join(ROOT, rel)
const exists = (rel) => fs.existsSync(full(rel))
const read = (rel) => fs.readFileSync(full(rel), 'utf8')
const must = (text, token, label) => { if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`) }
const reportRel = '_project/runs/LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.md'
const previousReportRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const ownerDecisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const packageRel = 'package.json'
for (const f of [reportRel, previousReportRel, ownerDecisionRel, packageRel]) if (!exists(f)) throw new Error('Missing required file: '+f)
const report = read(reportRel), previousReport = read(previousReportRel), ownerDecision = read(ownerDecisionRel), pkg = read(packageRel)
for (const t of ['MANUAL_SMOKE_PENDING','NEXT_RUNTIME_IMPORT_BLOCKED','NO_RUNTIME_CHANGE','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_GCAL_CHANGE']) must(report,t,reportRel)
for (const t of ['TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT']) must(previousReport,t,previousReportRel)
for (const t of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','NEXT_READONLY_NO_DRIFT_STAGE_ALLOWED']) must(ownerDecision,t,ownerDecisionRel)
must(pkg,'verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision',packageRel)
if (pkg.charCodeAt(0) === 0xfeff) throw new Error('package.json has UTF-8 BOM')
let changed=[]; try { changed=childProcess.execSync('git diff --name-only HEAD',{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowedPrefixes = ['_project/runs/LF-PROD-SOT-004N_','scripts/guards/verify-lf-prod-sot-004n-','tests/lf-prod-sot-004n-','src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts','src/lib/work-items/normalize.ts','src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts','src/lib/calendar-items.ts','_project/runs/LF-PROD-SOT-004O_','scripts/guards/verify-lf-prod-sot-004o-','tests/lf-prod-sot-004o-','src/lib/source-of-truth/list-cards-status-date-readonly-runtime.ts','src/lib/clients.ts','src/lib/cases.ts','_project/runs/LF-PROD-SOT-004P_','scripts/guards/verify-lf-prod-sot-004p-','tests/lf-prod-sot-004p-','src/lib/source-of-truth/readonly-rewire-closure-gate.ts','_project/runs/LF-PROD-SOT-004Q_','scripts/guards/verify-lf-prod-sot-004q-','tests/lf-prod-sot-004q-']
const allowedExact = new Set([reportRel, ownerDecisionRel, 'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs', 'tests/lf-prod-sot-004m-today-runtime-import-smoke-and-decision.test.cjs', packageRel])
for (const f of changed) { const allowed = allowedExact.has(f) || allowedPrefixes.some((p)=>f===p||f.startsWith(p)); if (!allowed) throw new Error('Unexpected changed file in 004M: '+f) }
console.log(JSON.stringify({ok:true,stage:'LF-PROD-SOT-004M',smokeResult:'MANUAL_SMOKE_PENDING',ownerDecision:'RECORDED',nextReadOnlyNoDriftAllowed:true,runtimeTouched:'NO',packageJsonBom:false,mojibakeScope:'reports-package-owner-decision'},null,2))