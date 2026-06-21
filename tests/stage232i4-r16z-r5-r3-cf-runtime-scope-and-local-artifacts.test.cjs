const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const cfGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));
const exclude = fs.readFileSync(path.join(repoRoot, '.git/info/exclude'), 'utf8');

test('R16Z_R5_R3 updates CF-RUNTIME-00 scope for current close files', () => {
  assert.match(cfGuard, /CF_RUNTIME_00_STAGE232I4_R16Z_R5_SCOPE_COMPAT/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS_ALLOWLIST/);
  assert.match(cfGuard, /src\/components\/detail\/MissingItemsManagerDialog\.tsx/);
  assert.match(cfGuard, /scripts\/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation\.cjs/);
  assert.match(cfGuard, /tests\/stage232i4-r16z-r5-r2-bom-repair-continue\.test\.cjs/);
  assert.match(cfGuard, /scripts\/check-stage232i4-r16z-r5-r3-cf-runtime-scope-and-local-artifacts\.cjs/);
});

test('R16Z_R5_R3 keeps manager without BOM', () => {
  assert.notEqual(managerBuffer[0], 0xef);
  assert.notEqual(managerBuffer[1], 0xbb);
  assert.notEqual(managerBuffer[2], 0xbf);
});

test('R16Z_R5_R3 excludes local artifacts without deleting them', () => {
  assert.match(exclude, /\.stage232i4_\*_backup\//);
  assert.match(exclude, /2\.closeflow_bisect\//);
  assert.match(exclude, /STAGE232I4_R12_RUNTIME_VISUAL_AUDIT_\*\.txt/);
  assert.match(exclude, /STAGE232I4_R13G_\*\.txt/);
});