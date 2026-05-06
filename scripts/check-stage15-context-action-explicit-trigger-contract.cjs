const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT';
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
function requireNotContains(rel, needle){
  if (!exists(rel)) return fail(rel + ' missing');
  const text = read(rel);
  if (!text.includes(needle)) pass(rel + ' does not contain ' + needle);
  else fail(rel + ' must not contain ' + needle);
}
const pkgBuffer = fs.readFileSync(path.join(root, 'package.json'));
if (pkgBuffer[0] === 0xef && pkgBuffer[1] === 0xbb && pkgBuffer[2] === 0xbf) fail('package.json has UTF-8 BOM');
else pass('package.json has no UTF-8 BOM');
const pkg = JSON.parse(pkgBuffer.toString('utf8'));
pass('package.json parses with JSON.parse');
for (const key of [
  'check:stage15-context-action-explicit-trigger-contract-v1',
  'test:stage15-context-action-explicit-trigger-contract-v1',
  'verify:stage15-context-action-contract'
]) {
  if (pkg.scripts && pkg.scripts[key]) pass('package.json exposes ' + key);
  else fail('package.json missing ' + key);
}

for (const rel of [
  'src/components/ContextActionDialogs.tsx',
  'scripts/check-stage15-context-action-explicit-trigger-contract.cjs',
  'tests/stage15-context-action-explicit-trigger-contract.test.cjs',
  'docs/release/STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1_2026-05-06.md'
]) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }

requireContains('src/components/ContextActionDialogs.tsx', STAGE);
requireContains('src/components/ContextActionDialogs.tsx', "export const CONTEXT_ACTION_KIND_ATTR = 'data-context-action-kind'");
requireContains('src/components/ContextActionDialogs.tsx', "export const CONTEXT_ACTION_RECORD_TYPE_ATTR = 'data-context-record-type'");
requireContains('src/components/ContextActionDialogs.tsx', "export const CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id'");
requireContains('src/components/ContextActionDialogs.tsx', 'function normalizeContextActionKind');
requireContains('src/components/ContextActionDialogs.tsx', 'function normalizeContextRecordType');
requireContains('src/components/ContextActionDialogs.tsx', 'function buildContextFromExplicitClick');
requireContains('src/components/ContextActionDialogs.tsx', "target.closest('[data-context-action-kind], button, a, [role=\"button\"]')");
requireContains('src/components/ContextActionDialogs.tsx', 'const explicitKind = normalizeContextActionKind');
requireContains('src/components/ContextActionDialogs.tsx', 'const explicitContext = buildContextFromExplicitClick(target);');
requireContains('src/components/ContextActionDialogs.tsx', 'const context = explicitContext || buildContextFromPath(location.pathname);');
requireContains('src/components/ContextActionDialogs.tsx', 'data-stage15="STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT"');
requireContains('src/components/ContextActionDialogs.tsx', "merged.includes('dodaj zadanie')");
requireContains('src/components/ContextActionDialogs.tsx', "merged.includes('dodaj wydarzenie')");
requireContains('src/components/ContextActionDialogs.tsx', "merged.includes('dodaj notat')");

for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
  requireContains(rel, 'openContextQuickAction');
  requireNotContains(rel, "from '../components/TaskCreateDialog'");
  requireNotContains(rel, "from '../components/EventCreateDialog'");
}
requireContains('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
requireContains('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');
requireContains('docs/release/STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1_2026-05-06.md', 'explicit data-context-action-kind');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
