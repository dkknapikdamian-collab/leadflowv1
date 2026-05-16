const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1';
const datedDoc = 'docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_V1_2026-05-06.md';
const latestDoc = 'docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_LATEST.md';
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
function anyContains(rel, needles, label){
  if(!exists(rel)) { fail(rel + ' missing'); return false; }
  const text = read(rel);
  const hit = needles.some((needle) => text.includes(needle));
  if(hit) { pass(rel + ' contains real trigger marker: ' + label); return true; }
  fail(rel + ' missing real trigger marker: ' + label);
  return false;
}

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

contains('src/components/ContextActionDialogs.tsx', 'CONTEXT_ACTION_EVENT');
contains('src/components/ContextActionDialogs.tsx', 'openContextQuickAction');
contains('src/components/ContextActionDialogs.tsx', 'data-context-action-kind');
contains('src/components/ContextActionDialogs.tsx', 'buildContextFromExplicitClick');
contains('src/components/ContextActionDialogs.tsx', 'resolveActionKindFromClick');
contains('src/components/ContextActionDialogs.tsx', "document.addEventListener('click', capture, true)");
contains('src/components/ContextActionDialogs.tsx', '<TaskCreateDialog open={openTask}');
contains('src/components/ContextActionDialogs.tsx', '<EventCreateDialog open={openEvent}');
contains('src/components/ContextActionDialogs.tsx', '<ContextNoteDialog open={openNote}');
contains('src/lib/context-action-contract.ts', "CONTEXT_ACTION_KIND_VALUES = ['task', 'event', 'note']");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'tasks'");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'events'");
contains('src/lib/context-action-contract.ts', "persistenceTarget: 'activities'");

for (const rel of ['src/pages/LeadDetail.tsx','src/pages/ClientDetail.tsx','src/pages/CaseDetail.tsx']) {
  contains(rel, 'openContextQuickAction');
  notContains(rel, "from '../components/TaskCreateDialog'");
  notContains(rel, "from '../components/EventCreateDialog'");
}

anyContains('src/pages/LeadDetail.tsx', ["openLeadContextAction('task')", 'data-context-action-kind="task"', "kind: 'task'"], 'lead task');
anyContains('src/pages/LeadDetail.tsx', ["openLeadContextAction('event')", 'data-context-action-kind="event"', "kind: 'event'"], 'lead event');
anyContains('src/pages/LeadDetail.tsx', ["openLeadContextAction('note')", 'data-context-action-kind="note"', "kind: 'note'"], 'lead note');
anyContains('src/pages/CaseDetail.tsx', ["openCaseContextAction('task')", 'data-context-action-kind="task"', "kind: 'task'"], 'case task');
anyContains('src/pages/CaseDetail.tsx', ["openCaseContextAction('event')", 'data-context-action-kind="event"', "kind: 'event'"], 'case event');
anyContains('src/pages/CaseDetail.tsx', ["openCaseContextAction('note')", 'data-context-action-kind="note"', "kind: 'note'"], 'case note');
anyContains('src/pages/ClientDetail.tsx', ['openClientContextAction', 'data-context-action-kind=', 'openContextQuickAction({'], 'client context trigger');

notContains('src/pages/LeadDetail.tsx', 'setIsQuickTaskOpen(true)');
notContains('src/pages/LeadDetail.tsx', 'setIsQuickEventOpen(true)');
notContains('src/pages/CaseDetail.tsx', 'setIsQuickTaskOpen(true)');
notContains('src/pages/CaseDetail.tsx', 'setIsQuickEventOpen(true)');
contains('src/components/TaskCreateDialog.tsx', 'insertTaskToSupabase');
contains('src/components/EventCreateDialog.tsx', 'insertEventToSupabase');

if(exists('scripts/check-stage86-context-action-explicit-triggers.cjs')) {
  try {
    require('child_process').execFileSync(process.execPath, ['scripts/check-stage86-context-action-explicit-triggers.cjs'], { cwd: root, stdio: 'inherit' });
    pass('Stage86 explicit trigger guard passes as supporting evidence');
  } catch (error) {
    fail('Stage86 explicit trigger guard failed as supporting evidence');
  }
} else {
  pass('Stage86 explicit trigger guard not present, Stage20 local checks used');
}

if(failed) process.exit(1);

const evidence = [
  '# Stage20 \u00E2\u20AC\u201D context action real button trigger',
  '',
  `Marker: ${STAGE}`,
  '',
  '## Cel',
  '',
  'Stage20 potwierdza, ze realne przyciski/akcje w detail pages nie otwieraja juz lokalnych dialogow task/event, tylko ida przez jeden host ContextActionDialogs i jawny request `openContextQuickAction` albo explicit trigger.',
  '',
  '## Sprawdzone elementy',
  '',
  '- `ContextActionDialogs.tsx` ma event bus, explicit `data-context-action-kind`, legacy fallback i jeden host task/event/note.',
  '- `LeadDetail.tsx`, `ClientDetail.tsx`, `CaseDetail.tsx` uzywaja `openContextQuickAction`.',
  '- Detail pages nie importuja bezposrednio `TaskCreateDialog` ani `EventCreateDialog`.',
  '- Lead i Case maja realne wywolania task/event/note przez kontekstowy trigger.',
  '- Zapisy task/event nadal ida przez Supabase insert helpers.',
  '',
  '## Kryterium',
  '',
  'Klikniecia z detail pages przechodza przez jeden wspolny tor akcji kontekstowych. Nie ma bocznych lokalnych modalow task/event na kartach rekordu.',
  ''
].join('\n');
fs.mkdirSync(path.join(root, 'docs/release'), { recursive: true });
fs.writeFileSync(path.join(root, datedDoc), evidence, 'utf8');
fs.writeFileSync(path.join(root, latestDoc), evidence, 'utf8');
pass(STAGE + ' wrote ' + datedDoc);
pass(STAGE + ' wrote ' + latestDoc);
console.log('PASS ' + STAGE);
