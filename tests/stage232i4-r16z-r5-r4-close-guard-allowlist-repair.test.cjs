const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const closeGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs'), 'utf8');
const cfGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');
const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));

test('R16Z_R5 close guard allows intentional CF runtime guard update', () => {
  assert.match(closeGuard, /R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR/);
  assert.match(closeGuard, /scripts\/check-cf-runtime-00-source-truth\.cjs/);
});

test('CF runtime allowlist contains R4 close files', () => {
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR_ALLOWLIST/);
  assert.match(cfGuard, /scripts\/check-stage232i4-r16z-r5-r4-close-guard-allowlist-repair\.cjs/);
  assert.match(cfGuard, /tests\/stage232i4-r16z-r5-r4-close-guard-allowlist-repair\.test\.cjs/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR\.md/);
});

test('R16Z_R5_R4 keeps manager without BOM', () => {
  assert.notEqual(managerBuffer[0], 0xef);
  assert.notEqual(managerBuffer[1], 0xbb);
  assert.notEqual(managerBuffer[2], 0xbf);
});