const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const errors = [];
function read(relativePath) { return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'); }
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }
const audit = read('tests/polish-mojibake-audit.test.cjs');
const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));
const entries = [
  'tests/polish-mojibake-audit.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.cjs',
  'tests/stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md'
];
must('audit marker', audit.includes('STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL'));
must('audit skips stage backup dirs', audit.includes('/^\\.stage232i4_.*_backup$/i.test(name)'));
must('audit skips 2.closeflow_bisect', audit.includes('2.closeflow_bisect'));
must('audit has max size guard', audit.includes('maxTextFileBytes') && audit.includes('stat.size > maxTextFileBytes'));
must('audit skips large files before read', audit.indexOf('stat.size > maxTextFileBytes') < audit.indexOf("fs.readFileSync(file, 'utf8')"));
must('close guard has R7 allowlist marker', closeGuard.includes('STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST'));
must('CF runtime has R7 allowlist marker', cfGuard.includes('STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST'));
for (const entry of entries) {
  must(`close guard allows ${entry}`, closeGuard.includes(`'${entry}'`));
  must(`CF runtime allows ${entry}`, cfGuard.includes(`'${entry}'`));
}
must('manager has no UTF8 BOM', !(managerBuffer[0] === 0xef && managerBuffer[1] === 0xbb && managerBuffer[2] === 0xbf));
block('audit no longer scans local stage backups by default', audit.includes("'.stage232i4_r16b_backup'"));
if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL',
  contract: 'Polish mojibake audit no longer scans local backup/bisect artifacts or huge text-like files; R16Z_R5 and CF-RUNTIME allow this guard-compatible repair.'
}, null, 2));