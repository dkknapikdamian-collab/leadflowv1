const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1';
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
if (pkg.scripts['check:stage14-context-action-route-parity-v1']) pass('package.json exposes Stage14 check script'); else fail('package.json missing Stage14 check script');
if (pkg.scripts['test:stage14-context-action-route-parity-v1']) pass('package.json exposes Stage14 test script'); else fail('package.json missing Stage14 test script');
if (pkg.scripts['verify:stage14-action-route-parity']) pass('package.json exposes Stage14 verify script'); else fail('package.json missing Stage14 verify script');

for (const rel of [
  'src/components/ContextActionDialogs.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx',
  'src/components/ContextNoteDialog.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'scripts/check-stage14-context-action-route-parity.cjs',
  'tests/stage14-context-action-route-parity.test.cjs',
  'docs/release/STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1_2026-05-06.md'
]) { if (exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing'); }

requireContains('src/components/ContextActionDialogs.tsx', "export type ContextActionKind = 'task' | 'event' | 'note';");
requireContains('src/components/ContextActionDialogs.tsx', "import TaskCreateDialog");
requireContains('src/components/ContextActionDialogs.tsx', "import EventCreateDialog");
requireContains('src/components/ContextActionDialogs.tsx', "import ContextNoteDialog");
requireContains('src/components/ContextActionDialogs.tsx', "openContextQuickAction");
requireContains('src/components/ContextActionDialogs.tsx', "resolveActionKindFromClick");
requireContains('src/components/ContextActionDialogs.tsx', "data-context-action-dialog-host=\"true\"");
requireContains('src/components/ContextActionDialogs.tsx', "<TaskCreateDialog open={openTask}");
requireContains('src/components/ContextActionDialogs.tsx', "<EventCreateDialog open={openEvent}");
requireContains('src/components/ContextActionDialogs.tsx', "<ContextNoteDialog open={openNote}");

for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
  requireContains(rel, 'openContextQuickAction');
  requireContains(rel, 'ContextActionKind');
  requireNotContains(rel, "from '../components/TaskCreateDialog'");
  requireNotContains(rel, "from '../components/EventCreateDialog'");
}
requireContains('src/pages/LeadDetail.tsx', "recordType: 'lead'");
requireContains('src/pages/ClientDetail.tsx', "recordType: 'client'");
requireContains('src/pages/CaseDetail.tsx', "recordType: 'case'");

requireContains('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
requireContains('src/components/TaskCreateDialog.tsx', 'leadId: context?.leadId');
requireContains('src/components/TaskCreateDialog.tsx', 'caseId: context?.caseId');
requireContains('src/components/TaskCreateDialog.tsx', 'clientId: context?.clientId');
requireContains('src/components/TaskCreateDialog.tsx', 'workspaceId,');
requireContains('src/components/TaskCreateDialog.tsx', 'data-task-create-dialog-stage45m="true"');

requireContains('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');
requireContains('src/components/EventCreateDialog.tsx', 'scheduledAt: form.startAt');
requireContains('src/components/EventCreateDialog.tsx', 'leadId: context?.leadId');
requireContains('src/components/EventCreateDialog.tsx', 'caseId: context?.caseId');
requireContains('src/components/EventCreateDialog.tsx', 'clientId: context?.clientId');
requireContains('src/components/EventCreateDialog.tsx', 'workspaceId,');
requireContains('src/components/EventCreateDialog.tsx', 'data-event-create-dialog-stage85="true"');

requireContains('docs/release/STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1_2026-05-06.md', STAGE);
requireContains('docs/release/STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1_2026-05-06.md', 'same action opens the same shared dialog');
if (process.exitCode) process.exit(process.exitCode);
console.log('PASS ' + STAGE);
