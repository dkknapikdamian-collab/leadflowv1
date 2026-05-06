const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1';
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
  'check:stage17-context-action-contract-registry-v1',
  'test:stage17-context-action-contract-registry-v1',
  'verify:stage17-context-action-contract-registry'
]) {
  if (pkg.scripts && pkg.scripts[key]) pass('package.json exposes ' + key);
  else fail('package.json missing ' + key);
}
for (const rel of [
  'src/lib/context-action-contract.ts',
  'src/components/ContextActionDialogs.tsx',
  'scripts/check-stage17-context-action-contract-registry.cjs',
  'tests/stage17-context-action-contract-registry.test.cjs',
  'docs/release/STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1_2026-05-06.md'
]) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }

requireContains('src/lib/context-action-contract.ts', STAGE);
requireContains('src/lib/context-action-contract.ts', "CONTEXT_ACTION_KIND_VALUES = ['task', 'event', 'note']");
requireContains('src/lib/context-action-contract.ts', "dialogComponent: 'TaskCreateDialog'");
requireContains('src/lib/context-action-contract.ts', "dialogComponent: 'EventCreateDialog'");
requireContains('src/lib/context-action-contract.ts', "dialogComponent: 'ContextNoteDialog'");
requireContains('src/lib/context-action-contract.ts', "persistenceTarget: 'tasks'");
requireContains('src/lib/context-action-contract.ts', "persistenceTarget: 'events'");
requireContains('src/lib/context-action-contract.ts', "persistenceTarget: 'activities'");
requireContains('src/lib/context-action-contract.ts', "relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId']");
requireContains('src/lib/context-action-contract.ts', 'normalizeContextActionContractKind');
requireContains('src/lib/context-action-contract.ts', 'getContextActionContract');

requireContains('src/components/ContextActionDialogs.tsx', "../lib/context-action-contract");
requireContains('src/components/ContextActionDialogs.tsx', 'CONTEXT_ACTION_CONTRACT');
requireContains('src/components/ContextActionDialogs.tsx', 'STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1');
requireContains('src/components/ContextActionDialogs.tsx', 'data-stage17={STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY}');
requireContains('src/components/ContextActionDialogs.tsx', 'data-context-action-contract-kinds={Object.keys(CONTEXT_ACTION_CONTRACT).join');
requireContains('src/components/ContextActionDialogs.tsx', '<TaskCreateDialog open={openTask}');
requireContains('src/components/ContextActionDialogs.tsx', '<EventCreateDialog open={openEvent}');
requireContains('src/components/ContextActionDialogs.tsx', '<ContextNoteDialog open={openNote}');

for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
  requireContains(rel, 'openContextQuickAction');
  requireNotContains(rel, "from '../components/TaskCreateDialog'");
  requireNotContains(rel, "from '../components/EventCreateDialog'");
}
requireContains('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
requireContains('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');
requireContains('docs/release/STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1_2026-05-06.md', 'central registry for task, event and note actions');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
