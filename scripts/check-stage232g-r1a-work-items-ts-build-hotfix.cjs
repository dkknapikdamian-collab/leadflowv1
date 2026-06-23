const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const workItems = fs.readFileSync(path.join(repo, 'api', 'work-items.ts'), 'utf8');
const required = [
  'STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_R2',
  'readBlocksProgressStage232GR1A',
  'isBlocksProgressTrueStage232GR1A',
];
const failures = [];
for (const marker of required) {
  if (!workItems.includes(marker)) failures.push('api/work-items.ts missing ' + marker);
}
if (/\bexisting\s*[?.]?\./.test(workItems)) failures.push('unscoped existing member access remains');
if (/\b[A-Za-z_$][\w$]*\??\.blocksProgress === true/.test(workItems)) failures.push('raw .blocksProgress boolean comparison remains');
if (/\b[A-Za-z_$][\w$]*\??\.blocks_progress === true/.test(workItems)) failures.push('raw .blocks_progress boolean comparison remains');
const contextPath = path.join(repo, '_project/runs/STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_REMAINING_EXISTING_CONTEXT.txt');
if (!fs.existsSync(contextPath)) failures.push('missing remaining-existing context report');
const runPath = path.join(repo, '_project/runs/STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX.md');
if (!fs.existsSync(runPath)) failures.push('missing run report');
const obsPath = path.join(repo, '_project/obsidian_updates/2026-06-23_STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX.md');
if (!fs.existsSync(obsPath)) failures.push('missing obsidian payload');
if (failures.length) {
  for (const failure of failures) console.error('STAGE232G_R1A_WORK_ITEMS_HOTFIX_R2_FAIL: ' + failure);
  process.exit(1);
}
console.log(JSON.stringify({ stage: 'STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_R2', ok: true, scope: 'api/work-items TypeScript compatibility' }, null, 2));
