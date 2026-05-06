const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1';
function pass(message){ console.log('PASS ' + message); }
function fail(message){ console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle){
  if (!exists(rel)) return fail(rel + ' missing');
  const text = read(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
const pkgBuffer = fs.readFileSync(path.join(root, 'package.json'));
if (pkgBuffer[0] === 0xef && pkgBuffer[1] === 0xbb && pkgBuffer[2] === 0xbf) fail('package.json has UTF-8 BOM');
else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(pkgBuffer.toString('utf8'));
pass('package.json parses with JSON.parse');
for (const key of [
  'audit:stage16-context-action-button-parity',
  'check:stage16-context-action-button-parity-audit-v1',
  'test:stage16-context-action-button-parity-audit-v1',
  'verify:stage16-context-action-button-parity'
]) {
  if (pkg.scripts && pkg.scripts[key]) pass('package.json exposes ' + key);
  else fail('package.json missing ' + key);
}
for (const rel of [
  'scripts/audit-context-action-button-parity.cjs',
  'scripts/check-stage16-context-action-button-parity-audit.cjs',
  'tests/stage16-context-action-button-parity-audit.test.cjs',
  'docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1_2026-05-06.md'
]) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }
requireContains('scripts/audit-context-action-button-parity.cjs', STAGE);
requireContains('scripts/audit-context-action-button-parity.cjs', 'data-context-action-kind');
requireContains('scripts/audit-context-action-button-parity.cjs', 'openContextQuickAction');
requireContains('scripts/audit-context-action-button-parity.cjs', 'insertTaskToSupabase');
requireContains('scripts/audit-context-action-button-parity.cjs', 'insertEventToSupabase');
requireContains('scripts/audit-context-action-button-parity.cjs', 'ContextActionDialogs opens one task dialog');
requireContains('scripts/audit-context-action-button-parity.cjs', 'ContextActionDialogs opens one event dialog');
requireContains('src/components/ContextActionDialogs.tsx', 'STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT');
requireContains('docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1_2026-05-06.md', 'jeden tor akcji');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
