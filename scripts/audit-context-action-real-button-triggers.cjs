const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1';
const OUT = path.join(root, 'docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_LATEST.md');

const detailFiles = [
  { rel: 'src/pages/LeadDetail.tsx', name: 'LeadDetail', expectedRecordType: "recordType: 'lead'" },
  { rel: 'src/pages/ClientDetail.tsx', name: 'ClientDetail', expectedRecordType: "recordType: 'client'" },
  { rel: 'src/pages/CaseDetail.tsx', name: 'CaseDetail', expectedRecordType: "recordType: 'case'" },
];

const actionLabels = [
  { kind: 'task', labels: ['Dodaj zadanie', 'Zaplanuj telefon', 'follow-up'] },
  { kind: 'event', labels: ['Dodaj wydarzenie', 'Zaplanuj spotkanie'] },
  { kind: 'note', labels: ['Dodaj notat', 'Dopisz notat', 'Podyktuj notat'] },
];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function pass(message) {
  console.log('PASS ' + message);
}

function fail(message) {
  console.error('FAIL ' + message);
  process.exitCode = 1;
}

function lineFor(text, needle) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => line.includes(needle));
  return index >= 0 ? index + 1 : null;
}

function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listApiFunctionFiles(full));
    else if (/\.(ts|js|mjs|cjs)$/i.test(entry.name) && !/\.d\.ts$/i.test(entry.name)) result.push(full);
  }
  return result;
}

function hasOneOf(text, list) {
  return list.some((needle) => text.includes(needle));
}

const rows = [];
function record(scope, status, message, evidence = '') {
  rows.push({ scope, status, message, evidence });
  if (status === 'PASS') pass(scope + ' :: ' + message + (evidence ? ' :: ' + evidence : ''));
  else fail(scope + ' :: ' + message + (evidence ? ' :: ' + evidence : ''));
}

for (const rel of [
  'src/components/ContextActionDialogs.tsx',
  'src/lib/context-action-contract.ts',
  'src/components/TaskCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx',
  'src/components/ContextNoteDialog.tsx',
]) {
  record('files', exists(rel) ? 'PASS' : 'FAIL', rel + ' exists');
}

const host = exists('src/components/ContextActionDialogs.tsx') ? read('src/components/ContextActionDialogs.tsx') : '';
record('shared-host', host.includes('data-context-action-kind') ? 'PASS' : 'FAIL', 'explicit data-context-action-kind supported');
record('shared-host', host.includes('buildContextFromExplicitClick') ? 'PASS' : 'FAIL', 'explicit trigger context builder exists');
record('shared-host', host.includes('resolveActionKindFromClick') ? 'PASS' : 'FAIL', 'text fallback resolver exists');
record('shared-host', host.includes('CONTEXT_ACTION_EVENT') ? 'PASS' : 'FAIL', 'single context action event bus exists');
record('shared-host', host.includes('<TaskCreateDialog open={openTask}') ? 'PASS' : 'FAIL', 'one task dialog host exists');
record('shared-host', host.includes('<EventCreateDialog open={openEvent}') ? 'PASS' : 'FAIL', 'one event dialog host exists');
record('shared-host', host.includes('<ContextNoteDialog open={openNote}') ? 'PASS' : 'FAIL', 'one note dialog host exists');

const registry = exists('src/lib/context-action-contract.ts') ? read('src/lib/context-action-contract.ts') : '';
record('registry', registry.includes('CONTEXT_ACTION_CONTRACTS') ? 'PASS' : 'FAIL', 'central context action registry exists');
record('registry', registry.includes("table: 'tasks'") ? 'PASS' : 'FAIL', 'task maps to tasks table');
record('registry', registry.includes("table: 'events'") ? 'PASS' : 'FAIL', 'event maps to events table');
record('registry', registry.includes("table: 'activities'") ? 'PASS' : 'FAIL', 'note maps to activities table');

for (const file of detailFiles) {
  const text = exists(file.rel) ? read(file.rel) : '';
  record(file.name, text ? 'PASS' : 'FAIL', 'file readable', file.rel);
  record(file.name, text.includes('openContextQuickAction') ? 'PASS' : 'FAIL', 'uses shared openContextQuickAction dispatcher');
  record(file.name, text.includes(file.expectedRecordType) ? 'PASS' : 'FAIL', 'uses expected recordType', file.expectedRecordType);
  record(file.name, !text.includes("from '../components/TaskCreateDialog'") ? 'PASS' : 'FAIL', 'does not import TaskCreateDialog directly');
  record(file.name, !text.includes("from '../components/EventCreateDialog'") ? 'PASS' : 'FAIL', 'does not import EventCreateDialog directly');
  record(file.name, !text.includes('data-task-create-dialog-stage45m=') ? 'PASS' : 'FAIL', 'does not render local task dialog host marker');
  record(file.name, !text.includes('data-event-create-dialog-stage85=') ? 'PASS' : 'FAIL', 'does not render local event dialog host marker');

  for (const action of actionLabels) {
    const found = action.labels.filter((label) => text.includes(label));
    if (!found.length) continue;
    const explicit = text.includes(`data-context-action-kind="${action.kind}"`) || text.includes(`data-context-action-kind={'${action.kind}'}`) || text.includes(`data-context-action-kind={\"${action.kind}\"}`);
    const dispatcherKind = text.includes(`openContextQuickAction({`) && text.includes(`kind,`) || text.includes(`openContextQuickAction({\n      kind`) || text.includes(`openContextQuickAction({\r\n      kind`);
    const helperCall = text.includes(`openLeadContextAction('${action.kind}')`) || text.includes(`openCaseContextAction('${action.kind}')`) || text.includes(`openClientContextAction('${action.kind}')`);
    const fallbackSafe = host.includes(action.labels[0].toLowerCase()) || action.labels.some((label) => host.toLowerCase().includes(label.toLowerCase()));
    const ok = explicit || helperCall || dispatcherKind || fallbackSafe;
    const evidence = found.map((label) => `${label}@L${lineFor(text, label) || '?'}`).join(', ');
    record(file.name, ok ? 'PASS' : 'FAIL', `${action.kind} visible labels route via explicit attr, dispatcher, helper or shared fallback`, evidence);
  }
}

const taskDialog = exists('src/components/TaskCreateDialog.tsx') ? read('src/components/TaskCreateDialog.tsx') : '';
const eventDialog = exists('src/components/EventCreateDialog.tsx') ? read('src/components/EventCreateDialog.tsx') : '';
const noteDialog = exists('src/components/ContextNoteDialog.tsx') ? read('src/components/ContextNoteDialog.tsx') : '';
record('TaskCreateDialog', hasOneOf(taskDialog, ['insertTaskToSupabase']) ? 'PASS' : 'FAIL', 'task save uses insertTaskToSupabase');
record('TaskCreateDialog', hasOneOf(taskDialog, ['leadId: context?.leadId']) && hasOneOf(taskDialog, ['caseId: context?.caseId']) && hasOneOf(taskDialog, ['clientId: context?.clientId']) ? 'PASS' : 'FAIL', 'task save preserves lead/case/client relation ids');
record('TaskCreateDialog', taskDialog.includes('workspaceId') ? 'PASS' : 'FAIL', 'task save preserves workspaceId');
record('EventCreateDialog', hasOneOf(eventDialog, ['insertEventToSupabase']) ? 'PASS' : 'FAIL', 'event save uses insertEventToSupabase');
record('EventCreateDialog', eventDialog.includes('scheduledAt: form.startAt') ? 'PASS' : 'FAIL', 'event save writes scheduledAt from startAt');
record('EventCreateDialog', hasOneOf(eventDialog, ['leadId: context?.leadId']) && hasOneOf(eventDialog, ['caseId: context?.caseId']) && hasOneOf(eventDialog, ['clientId: context?.clientId']) ? 'PASS' : 'FAIL', 'event save preserves lead/case/client relation ids');
record('EventCreateDialog', eventDialog.includes('workspaceId') ? 'PASS' : 'FAIL', 'event save preserves workspaceId');
record('ContextNoteDialog', noteDialog.includes('insertActivityToSupabase') ? 'PASS' : 'FAIL', 'note save uses insertActivityToSupabase');

const apiCount = listApiFunctionFiles().length;
record('vercel', apiCount <= 12 ? 'PASS' : 'FAIL', 'api function count <= 12', String(apiCount));
record('vercel', !exists('api/assistant/query.ts') ? 'PASS' : 'FAIL', 'assistant query remains collapsed under system API');

const md = [
  '# STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1',
  '',
  'GeneratedAt: `' + new Date().toISOString() + '`',
  '',
  '## Cel',
  '',
  'Sprawdzic realne przyciski i etykiety akcji w detail pages: gdzie klikam, jaki typ akcji wykrywa aplikacja, czy akcja idzie przez wspolny host dialogow i czy zapis trafia do jednego miejsca.',
  '',
  '## Wynik',
  '',
  '| Scope | Status | Check | Evidence |',
  '|---|---:|---|---|',
  ...rows.map((row) => `| ${row.scope} | ${row.status} | ${row.message.replace(/\|/g, '/')} | ${String(row.evidence || '').replace(/\|/g, '/')} |`),
  '',
  '## Konkluzja',
  '',
  process.exitCode ? 'FAIL: wykryto ryzyko bocznego toru przycisku.' : 'PASS: realne etykiety akcji sa pokryte wspolnym hostem, fallbackiem tekstowym lub jawnym kontraktem data-context-action-kind.',
  '',
];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md.join('\n'), 'utf8');
console.log((process.exitCode ? 'FAIL ' : 'PASS ') + STAGE + ' wrote ' + path.relative(root, OUT).replace(/\\/g, '/'));
if (process.exitCode) process.exit(process.exitCode);
