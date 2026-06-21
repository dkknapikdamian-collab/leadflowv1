const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }

const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));
const excludePath = path.join(repoRoot, '.git', 'info', 'exclude');
const exclude = fs.existsSync(excludePath) ? fs.readFileSync(excludePath, 'utf8') : '';

const expectedAllowlist = [
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs',
  'tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  'tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r2-bom-repair-continue.cjs',
  'tests/stage232i4-r16z-r5-r2-bom-repair-continue.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r3-cf-runtime-scope-and-local-artifacts.cjs',
  'tests/stage232i4-r16z-r5-r3-cf-runtime-scope-and-local-artifacts.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
];

must('CF runtime R16Z_R5 scope compat marker', cfGuard.includes('CF_RUNTIME_00_STAGE232I4_R16Z_R5_SCOPE_COMPAT'));
must('CF runtime R16Z_R5_R3 allowlist marker', cfGuard.includes('STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS_ALLOWLIST'));
for (const entry of expectedAllowlist) must(`CF runtime allowlist includes ${entry}`, cfGuard.includes(`'${entry}'`));
must('manager has no UTF8 BOM', !(managerBuffer[0] === 0xef && managerBuffer[1] === 0xbb && managerBuffer[2] === 0xbf));
must('local backup dirs excluded without deletion', exclude.includes('.stage232i4_*_backup/') || exclude.includes('.stage232i4_r16*_backup/'));
must('local bisect folder excluded without deletion', exclude.includes('2.closeflow_bisect/'));
must('old R12 runtime audit artifacts excluded', exclude.includes('_project/runs/STAGE232I4_R12_RUNTIME_VISUAL_AUDIT_*.txt'));
must('old R13G runtime artifacts excluded', exclude.includes('_project/runs/STAGE232I4_R13G_*.txt'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS',
  contract: 'CF-RUNTIME-00 allowlist accepts current R16Z_R5 close files, local old artifacts are excluded locally without deletion, and manager remains UTF-8 without BOM.'
}, null, 2));