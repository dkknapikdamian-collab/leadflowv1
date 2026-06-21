const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }

const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');
const clientOpTest = read('tests/client-detail-v1-operational-center.test.cjs');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));

const r5Entries = [
  'tests/client-detail-v1-operational-center.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r5-client-operational-center-test-compat.cjs',
  'tests/stage232i4-r16z-r5-r5-client-operational-center-test-compat.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md'
];
const r6Entries = [
  'scripts/check-stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.cjs',
  'tests/stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md'
];

must('close guard contains R5_R5 allowlist marker', closeGuard.includes('STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST'));
must('CF runtime contains R5_R5 allowlist marker', cfGuard.includes('STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST'));
must('close guard contains R6 allowlist marker', closeGuard.includes('STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST'));
must('CF runtime contains R6 allowlist marker', cfGuard.includes('STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST'));
for (const entry of r5Entries) {
  must(`close guard allows R5_R5 ${entry}`, closeGuard.includes(`'${entry}'`));
  must(`CF runtime allows R5_R5 ${entry}`, cfGuard.includes(`'${entry}'`));
}
for (const entry of r6Entries) {
  must(`close guard allows R6 ${entry}`, closeGuard.includes(`'${entry}'`));
  must(`CF runtime allows R6 ${entry}`, cfGuard.includes(`'${entry}'`));
}
must('client operational test uses normalized task relation source', clientOpTest.includes('leadSourceIdStage232I4R14') && clientOpTest.includes('caseSourceIdStage232I4R14'));
block('client operational test no longer uses old task.leadId exact string', clientOpTest.includes('relationIds.leadIds.has(String(task.leadId'));
must('manager has no UTF8 BOM', !(managerBuffer[0] === 0xef && managerBuffer[1] === 0xbb && managerBuffer[2] === 0xbf));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL',
  contract: 'R16Z_R5 close guard and CF-RUNTIME-00 both allow the R5_R5 client operational test compatibility repair and this final allowlist repair.'
}, null, 2));