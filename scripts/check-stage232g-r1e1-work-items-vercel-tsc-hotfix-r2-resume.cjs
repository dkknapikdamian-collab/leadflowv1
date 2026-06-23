const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const stage = 'STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME';
const api = fs.readFileSync(path.join(repo, 'api/work-items.ts'), 'utf8');
const cf = fs.readFileSync(path.join(repo, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');
const failures = [];
for (const token of [stage, 'readBlocksProgressStage232GR1A']) {
  if (!api.includes(token)) failures.push(`missing api token: ${token}`);
}
if (/\b[A-Za-z_$][\w$]*\.blocksProgress\b/.test(api.replace(/record\['blocksProgress'\]/g, ''))) failures.push('unsafe direct .blocksProgress read remains');
const unsafeExisting = [];
api.split(/\r?\n/).forEach((line, idx) => {
  if (!/\bexisting\b/.test(line)) return;
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
  if (/\b(?:const|let|var|function|type|interface)\s+existing\b/.test(line)) return;
  if ((line.includes("'") || line.includes('"') || line.includes('`')) && !/[.?:,({[]\s*existing\b|\bexisting\s*[.?:,)}\]]/.test(line)) return;
  unsafeExisting.push(`${idx + 1}: ${line}`);
});
if (unsafeExisting.length) failures.push(`unsafe bare existing remains:\n${unsafeExisting.slice(0, 6).join('\n')}`);
if (!cf.includes('STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME_ALLOWLIST') && !cf.includes('api/work-items.ts')) failures.push('CF_RUNTIME_00 allowlist missing R1E1/R2 scope');
if (!fs.existsSync(path.join(repo, '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md'))) failures.push('missing R2 run report');
if (!fs.existsSync(path.join(repo, '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md'))) failures.push('missing R2 obsidian payload');
if (failures.length) {
  console.error(`${stage}_FAIL`);
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}
console.log(JSON.stringify({ stage, ok: true, scope: 'api/work-items Vercel TypeScript blocker repair', nextRecommended: 'STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE' }, null, 2));
