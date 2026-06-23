const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const repo = process.cwd();

test('R1E1 R2 work-items marker and helper exist', () => {
  const api = fs.readFileSync(path.join(repo, 'api/work-items.ts'), 'utf8');
  assert.match(api, /STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME/);
  assert.match(api, /readBlocksProgressStage232GR1A/);
});

test('R1E1 R2 removes direct simple blocksProgress reads', () => {
  const api = fs.readFileSync(path.join(repo, 'api/work-items.ts'), 'utf8').replace(/record\['blocksProgress'\]/g, '');
  assert.doesNotMatch(api, /\b[A-Za-z_$][\w$]*\.blocksProgress\b/);
});

test('R1E1 R2 does not leave unsafe bare existing references', () => {
  const api = fs.readFileSync(path.join(repo, 'api/work-items.ts'), 'utf8');
  const unsafe = api.split(/\r?\n/).filter((line) => {
    if (!/\bexisting\b/.test(line)) return false;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return false;
    if (/\b(?:const|let|var|function|type|interface)\s+existing\b/.test(line)) return false;
    if ((line.includes("'") || line.includes('"') || line.includes('`')) && !/[.?:,({[]\s*existing\b|\bexisting\s*[.?:,)}\]]/.test(line)) return false;
    return true;
  });
  assert.deepEqual(unsafe, []);
});

test('R1E1 R2 guard/report files exist', () => {
  assert.ok(fs.existsSync(path.join(repo, 'scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.cjs')));
  assert.ok(fs.existsSync(path.join(repo, '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md')));
  assert.ok(fs.existsSync(path.join(repo, '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md')));
});
