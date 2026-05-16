const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1';
const datedDoc = 'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md';
const latestDoc = 'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_LATEST.md';
let failed = false;
function pass(message){ console.log('PASS ' + message); }
function fail(message){ console.error('FAIL ' + message); failed = true; }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function contains(rel, needle){
  if(!exists(rel)) { fail(rel + ' missing'); return false; }
  const text = read(rel);
  if(text.includes(needle)) { pass(rel + ' contains ' + needle); return true; }
  fail(rel + ' missing ' + needle); return false;
}
function notContains(rel, needle){
  if(!exists(rel)) { fail(rel + ' missing'); return false; }
  const text = read(rel);
  if(!text.includes(needle)) { pass(rel + ' does not contain ' + needle); return true; }
  fail(rel + ' still contains ' + needle); return false;
}
function line(rel, label){ return '- `' + rel + '` \u00E2\u20AC\u201D ' + label; }

for (const rel of [
  'src/lib/context-action-contract.ts',
  'src/components/ContextActionDialogs.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx'
]) {
  if(exists(rel)) pass(rel + ' exists'); else fail(rel + ' missing');
}

contains('src/lib/context-action-contract.ts', 'CONTEXT_ACTION_KIND_VALUES');
contains('src/lib/context-action-contract.ts', "['task', 'event', 'note']");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'tasks'");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'events'");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'activities'");
contains('src/lib/context-action-contract.ts', "relationKeys: ['leadId', 'caseId', 'clientId', 'workspaceId']");
contains('src/components/ContextActionDialogs.tsx', 'data-context-action-kind');
contains('src/components/ContextActionDialogs.tsx', 'buildContextFromExplicitClick');
contains('src/components/ContextActionDialogs.tsx', '<TaskCreateDialog open={openTask}');
contains('src/components/ContextActionDialogs.tsx', '<EventCreateDialog open={openEvent}');
contains('src/components/ContextActionDialogs.tsx', '<ContextNoteDialog open={openNote}');
for (const rel of ['src/pages/LeadDetail.tsx','src/pages/ClientDetail.tsx','src/pages/CaseDetail.tsx']) {
  contains(rel, 'openContextQuickAction');
  notContains(rel, "from '../components/TaskCreateDialog'");
  notContains(rel, "from '../components/EventCreateDialog'");
}
contains('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
contains('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');

if(failed) process.exit(1);

const evidence = [
  '# Stage19 \u00E2\u20AC\u201D context action route map evidence',
  '',
  `Marker: ${STAGE}`,
  '',
  '## Cel',
  '',
  'Stage19 dokumentuje map\u0119 tras i miejsc wywo\u0142ania wsp\u00F3lnego hosta akcji kontekstowych dla task/event/note.',
  '',
  '## Mapa routingu akcji',
  '',
  line('src/lib/context-action-contract.ts', 'centralny kontrakt typ\u00F3w `task`, `event`, `note`, target\u00F3w zapisu i relacji.'),
  line('src/components/ContextActionDialogs.tsx', 'jeden host dialog\u00F3w, obs\u0142uga explicit trigger i legacy fallback.'),
  line('src/pages/LeadDetail.tsx', 'routing akcji przez `openContextQuickAction`, bez bezpo\u015Brednich import\u00F3w task/event dialog\u00F3w.'),
  line('src/pages/ClientDetail.tsx', 'routing akcji przez `openContextQuickAction`, bez bezpo\u015Brednich import\u00F3w task/event dialog\u00F3w.'),
  line('src/pages/CaseDetail.tsx', 'routing akcji przez `openContextQuickAction`, bez bezpo\u015Brednich import\u00F3w task/event dialog\u00F3w.'),
  '',
  '## Dow\u00F3d runtime contract',
  '',
  '- task zapisuje przez `TaskCreateDialog` / `insertTaskToSupabase`.',
  '- event zapisuje przez `EventCreateDialog` / `insertEventToSupabase`.',
  '- note zapisuje przez `ContextNoteDialog` do `activities` z relacjami kontekstowymi.',
  '',
  '## Kryterium',
  '',
  'Nie ma osobnych fizycznych dialog\u00F3w task/event na stronach detail. Wszystkie strony id\u0105 przez jeden host i jeden kontrakt.',
  ''
].join('\n');
fs.mkdirSync(path.join(root, 'docs/release'), { recursive: true });
fs.writeFileSync(path.join(root, datedDoc), evidence, 'utf8');
fs.writeFileSync(path.join(root, latestDoc), evidence, 'utf8');
pass(STAGE + ' wrote ' + datedDoc);
pass(STAGE + ' wrote ' + latestDoc);
console.log('PASS ' + STAGE);
