const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }

const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));
const exclude = fs.existsSync(path.join(repoRoot, '.git/info/exclude')) ? fs.readFileSync(path.join(repoRoot, '.git/info/exclude'), 'utf8') : '';

must('R16Z_R5 close guard has R4 marker', closeGuard.includes('R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR'));
must('R16Z_R5 close guard allows CF runtime tracked diff', closeGuard.includes("'scripts/check-cf-runtime-00-source-truth.cjs'"));
must('CF runtime has R4 allowlist marker', cfGuard.includes('STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR_ALLOWLIST'));
must('CF runtime allows R4 guard', cfGuard.includes("'scripts/check-stage232i4-r16z-r5-r4-close-guard-allowlist-repair.cjs'"));
must('CF runtime allows R4 test', cfGuard.includes("'tests/stage232i4-r16z-r5-r4-close-guard-allowlist-repair.test.cjs'"));
must('CF runtime allows R4 run report', cfGuard.includes("'_project/runs/STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md'"));
must('CF runtime allows R4 obsidian payload', cfGuard.includes("'_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md'"));
must('manager has no UTF8 BOM', !(managerBuffer[0] === 0xef && managerBuffer[1] === 0xbb && managerBuffer[2] === 0xbf));
must('local old stage artifacts excluded without deletion', exclude.includes('.stage232i4_*_backup/') || exclude.includes('.stage232i4_r16*_backup/'));
must('local bisect artifact excluded without deletion', exclude.includes('2.closeflow_bisect/'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR',
  contract: 'R16Z_R5 close guard allows intentional CF-RUNTIME-00 guard update; CF-RUNTIME-00 allowlist includes R4 close files; local artifacts remain excluded without deletion.'
}, null, 2));