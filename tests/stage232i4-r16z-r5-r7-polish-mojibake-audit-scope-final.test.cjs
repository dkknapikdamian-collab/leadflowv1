const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..');
const audit = fs.readFileSync(path.join(repoRoot, 'tests/polish-mojibake-audit.test.cjs'), 'utf8');
const closeGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs'), 'utf8');
const cfGuard = fs.readFileSync(path.join(repoRoot, 'scripts/check-cf-runtime-00-source-truth.cjs'), 'utf8');

test('R16Z_R5_R7 mojibake audit skips local backup artifacts and huge files', () => {
  assert.match(audit, /STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL/);
  assert.match(audit, /2\.closeflow_bisect/);
  assert.match(audit, /stage232i4_\.\*_backup|stage232i4_\.\*_/i);
  assert.match(audit, /maxTextFileBytes/);
  assert.match(audit, /stat\.size > maxTextFileBytes/);
});

test('R16Z_R5_R7 allowlists audit repair in close and runtime guards', () => {
  assert.match(closeGuard, /STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST/);
  assert.match(cfGuard, /STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST/);
  assert.match(closeGuard, /tests\/polish-mojibake-audit\.test\.cjs/);
  assert.match(cfGuard, /tests\/polish-mojibake-audit\.test\.cjs/);
});

test('R16Z_R5_R7 manager stays without BOM', () => {
  const managerBuffer = fs.readFileSync(path.join(repoRoot, 'src/components/detail/MissingItemsManagerDialog.tsx'));
  assert.notEqual(managerBuffer[0], 0xef);
});