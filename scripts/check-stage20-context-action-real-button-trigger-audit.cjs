const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1';
function pass(message) { console.log('PASS ' + message); }
function fail(message) { console.error('FAIL ' + message); process.exitCode = 1; }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function requireContains(rel, needle) {
  if (!exists(rel)) return fail(rel + ' missing');
  const text = read(rel);
  if (text.includes(needle)) pass(rel + ' contains ' + needle);
  else fail(rel + ' missing ' + needle);
}
function requireNoBom(rel) {
  const buffer = fs.readFileSync(path.join(root, rel));
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) fail(rel + ' has UTF-8 BOM');
  else pass(rel + ' has no UTF-8 BOM');
}
requireNoBom('package.json');
const pkg = JSON.parse(read('package.json'));
pass('package.json parses with JSON.parse');
for (const name of [
  'audit:stage20-context-action-real-button-triggers',
  'check:stage20-context-action-real-button-trigger-audit-v1',
  'test:stage20-context-action-real-button-trigger-audit-v1',
  'verify:stage20-context-action-real-button-triggers',
]) {
  if (pkg.scripts && pkg.scripts[name]) pass('package.json exposes ' + name);
  else fail('package.json missing ' + name);
}
for (const rel of [
  'scripts/audit-context-action-real-button-triggers.cjs',
  'scripts/check-stage20-context-action-real-button-trigger-audit.cjs',
  'tests/stage20-context-action-real-button-trigger-audit.test.cjs',
  'docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md',
  'src/components/ContextActionDialogs.tsx',
  'src/lib/context-action-contract.ts',
]) {
  if (exists(rel)) pass(rel + ' exists');
  else fail(rel + ' missing');
}
requireContains('scripts/audit-context-action-real-button-triggers.cjs', STAGE);
requireContains('scripts/audit-context-action-real-button-triggers.cjs', 'data-context-action-kind');
requireContains('scripts/audit-context-action-real-button-triggers.cjs', 'openContextQuickAction');
requireContains('scripts/audit-context-action-real-button-triggers.cjs', 'insertTaskToSupabase');
requireContains('scripts/audit-context-action-real-button-triggers.cjs', 'insertEventToSupabase');
requireContains('scripts/audit-context-action-real-button-triggers.cjs', 'insertActivityToSupabase');
requireContains('src/components/ContextActionDialogs.tsx', 'STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT');
requireContains('src/lib/context-action-contract.ts', 'CONTEXT_ACTION_CONTRACTS');
requireContains('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md', 'realne przyciski');
requireContains('docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md', 'bez zmian wizualnych');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
