const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }

const clientDetail = read('src/pages/ClientDetail.tsx');
const clientOpTest = read('tests/client-detail-v1-operational-center.test.cjs');
const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');

must('ClientDetail still builds relationIds', clientDetail.includes('const relationIds = useMemo'));
must('ClientDetail task filter uses normalized lead source id', clientDetail.includes('const leadSourceIdStage232I4R14') && clientDetail.includes('relationIds.leadIds.has(leadSourceIdStage232I4R14)'));
must('ClientDetail task filter uses normalized case source id', clientDetail.includes('const caseSourceIdStage232I4R14') && clientDetail.includes('relationIds.caseIds.has(caseSourceIdStage232I4R14)'));
must('ClientDetail event filter still checks lead/case relation IDs', clientDetail.includes("relationIds.leadIds.has(String(event.leadId || ''))") && clientDetail.includes("relationIds.caseIds.has(String(event.caseId || ''))"));
must('ClientDetail activity filter still checks lead/case relation IDs', clientDetail.includes("relationIds.leadIds.has(String(activity.leadId || ''))") && clientDetail.includes("relationIds.caseIds.has(String(activity.caseId || ''))"));

must('client operational center test accepts normalized task relation source', clientOpTest.includes('leadSourceIdStage232I4R14') && clientOpTest.includes('caseSourceIdStage232I4R14'));
must('client operational center test checks event/activity current syntax', clientOpTest.includes("relationIds.leadIds.has(String(event.leadId || ''))") && clientOpTest.includes("relationIds.leadIds.has(String(activity.leadId || ''))"));
block('client operational center test no longer uses brittle task.leadId exact string', clientOpTest.includes('relationIds.leadIds.has(String(task.leadId'));

must('R16Z_R5 close guard allows client operational center test compatibility file', closeGuard.includes('tests/client-detail-v1-operational-center.test.cjs'));
must('R16Z_R5 close guard allows R5_R5 guard/test/report files', closeGuard.includes('STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST'));
must('CF runtime allowlist allows client operational center test compatibility file', cfGuard.includes('tests/client-detail-v1-operational-center.test.cjs'));
must('CF runtime allowlist allows R5_R5 files', cfGuard.includes('STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT',
  contract: 'ClientDetail operational center test follows current normalized task relation filter while preserving lead/case relation coverage and R16Z_R5 close scope.'
}, null, 2));