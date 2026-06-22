const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

test('R10_R3 guard file has valid syntax', () => {
  const result = cp.spawnSync('node', ['--check', 'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('active CF runtime allowlist contains R10 and R10_R3 closure files', () => {
  const cf = read('scripts/check-cf-runtime-00-source-truth.cjs');
  const active = cf.match(/const\s+allowedChangePrefixes\s*=\s*\[\s*([\s\S]*?)\n\];/m);
  assert.ok(active, 'active allowedChangePrefixes exists');
  assert.ok(active[1].includes("'_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md'"));
  assert.ok(active[1].includes("'_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md'"));
  assert.ok(active[1].includes("'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs'"));
});

test('R5 close guard does not contain a dead R10 allowlist constant', () => {
  const r5 = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
  assert.equal(/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX_ALLOWLIST/.test(r5), false);
});

test('R10_R3 guard passes on repository state', () => {
  const result = cp.spawnSync('node', ['scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs'], {
    cwd: repoRoot,
    encoding: 'utf8'
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
});
