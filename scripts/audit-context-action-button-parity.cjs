const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1';
const OUT = path.join(root, 'docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_LATEST.md');

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function countOccurrences(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}
function status(ok) { return ok ? 'PASS' : 'FAIL'; }
function normalizePath(rel) { return rel.replace(/\\/g, '/'); }

const detailPages = [
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
];

const sharedFiles = [
  'src/components/ContextActionDialogs.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/components/EventCreateDialog.tsx',
  'src/components/ContextNoteDialog.tsx',
];

const actionLabels = [
  'Dodaj zadanie',
  'Dodaj wydarzenie',
  'Zaplanuj spotkanie',
  'Zaplanuj telefon',
  'follow-up',
  'Dodaj notat',
  'Dopisz notat',
  'Podyktuj notat',
];

const rows = [];
function addCheck(area, check, ok, evidence) {
  rows.push({ area, check, ok, evidence: String(evidence || '') });
}

for (const rel of [...detailPages, ...sharedFiles]) {
  addCheck('files', rel + ' exists', exists(rel), exists(rel) ? 'present' : 'missing');
}

const contextHost = exists('src/components/ContextActionDialogs.tsx') ? read('src/components/ContextActionDialogs.tsx') : '';
addCheck('shared-host', 'ContextActionDialogs exports explicit kind attr', contextHost.includes("CONTEXT_ACTION_KIND_ATTR = 'data-context-action-kind'"), 'data-context-action-kind');
addCheck('shared-host', 'ContextActionDialogs supports explicit click context', contextHost.includes('buildContextFromExplicitClick'), 'buildContextFromExplicitClick');
addCheck('shared-host', 'ContextActionDialogs keeps text fallback', contextHost.includes("merged.includes('dodaj zadanie')") && contextHost.includes("merged.includes('dodaj wydarzenie')"), 'text fallback still present');
addCheck('shared-host', 'ContextActionDialogs opens one task dialog', countOccurrences(contextHost, '<TaskCreateDialog ') === 1, 'TaskCreateDialog host count: ' + countOccurrences(contextHost, '<TaskCreateDialog '));
addCheck('shared-host', 'ContextActionDialogs opens one event dialog', countOccurrences(contextHost, '<EventCreateDialog ') === 1, 'EventCreateDialog host count: ' + countOccurrences(contextHost, '<EventCreateDialog '));
addCheck('shared-host', 'ContextActionDialogs opens one note dialog', countOccurrences(contextHost, '<ContextNoteDialog ') === 1, 'ContextNoteDialog host count: ' + countOccurrences(contextHost, '<ContextNoteDialog '));

for (const rel of detailPages) {
  const src = exists(rel) ? read(rel) : '';
  addCheck(rel, 'uses openContextQuickAction', src.includes('openContextQuickAction'), 'openContextQuickAction');
  addCheck(rel, 'does not import TaskCreateDialog directly', !src.includes("from '../components/TaskCreateDialog'") && !src.includes('from "../components/TaskCreateDialog"'), 'no direct task dialog import');
  addCheck(rel, 'does not import EventCreateDialog directly', !src.includes("from '../components/EventCreateDialog'") && !src.includes('from "../components/EventCreateDialog"'), 'no direct event dialog import');
  const hits = actionLabels.filter((label) => src.includes(label));
  const canRoute = src.includes('openContextQuickAction') || src.includes('data-context-action-kind');
  addCheck(rel, 'action labels route through shared context host when present', hits.length === 0 || canRoute, hits.length ? hits.join(', ') : 'no matching labels');
  addCheck(rel, 'no local create dialog host marker duplication', !src.includes('data-task-create-dialog-stage45m') && !src.includes('data-event-create-dialog-stage85'), 'detail page should not host create dialogs');
}

const taskDialog = exists('src/components/TaskCreateDialog.tsx') ? read('src/components/TaskCreateDialog.tsx') : '';
addCheck('TaskCreateDialog', 'task dialog saves through insertTaskToSupabase', taskDialog.includes('insertTaskToSupabase'), 'insertTaskToSupabase');
addCheck('TaskCreateDialog', 'task dialog preserves lead/case/client relation ids', ['leadId: context?.leadId', 'caseId: context?.caseId', 'clientId: context?.clientId'].every((needle) => taskDialog.includes(needle)), 'leadId/caseId/clientId');
addCheck('TaskCreateDialog', 'task dialog saves workspaceId', taskDialog.includes('workspaceId,'), 'workspaceId');

const eventDialog = exists('src/components/EventCreateDialog.tsx') ? read('src/components/EventCreateDialog.tsx') : '';
addCheck('EventCreateDialog', 'event dialog saves through insertEventToSupabase', eventDialog.includes('insertEventToSupabase'), 'insertEventToSupabase');
addCheck('EventCreateDialog', 'event dialog preserves lead/case/client relation ids', ['leadId: context?.leadId', 'caseId: context?.caseId', 'clientId: context?.clientId'].every((needle) => eventDialog.includes(needle)), 'leadId/caseId/clientId');
addCheck('EventCreateDialog', 'event dialog writes scheduledAt from startAt', eventDialog.includes('scheduledAt: form.startAt'), 'scheduledAt: form.startAt');
addCheck('EventCreateDialog', 'event dialog saves workspaceId', eventDialog.includes('workspaceId,'), 'workspaceId');

const failed = rows.filter((row) => !row.ok);
const lines = [
  '# ' + STAGE,
  '',
  'GeneratedAt: `' + new Date().toISOString() + '`',
  '',
  '## Cel',
  '',
  'Sprawdzic, czy przyciski kontekstowe zadanie / wydarzenie / notatka nie rozjezdzaja sie na kilka roznych sciezek zapisu ani kilka roznych dialogow.',
  '',
  '## Wynik',
  '',
  '- OVERALL: `' + (failed.length ? 'FAIL' : 'PASS') + '`',
  '- Checks: `' + rows.length + '`',
  '- Failed: `' + failed.length + '`',
  '',
  '## Tabela',
  '',
  '| Status | Area | Check | Evidence |',
  '| --- | --- | --- | --- |',
  ...rows.map((row) => '| ' + status(row.ok) + ' | `' + normalizePath(row.area) + '` | ' + row.check.replace(/\|/g, '/') + ' | `' + row.evidence.replace(/`/g, "'").replace(/\|/g, '/') + '` |'),
  '',
  '## Decyzja',
  '',
  failed.length
    ? 'FAIL: wykryto niespojnosc kontraktu akcji kontekstowych. Nie dokladac kolejnych przyciskow przed naprawa.'
    : 'PASS: akcje kontekstowe korzystaja ze wspolnego hosta i wspolnych dialogow. To nie potwierdza kazdego klikniecia runtime, ale blokuje najgrozniejsze regresje statyczne.',
  '',
];

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
for (const row of rows) console.log(status(row.ok) + ' ' + row.area + ' :: ' + row.check + ' :: ' + row.evidence);
if (failed.length) {
  console.error('FAIL ' + STAGE + ' failed checks: ' + failed.length);
  process.exit(1);
}
console.log('PASS ' + STAGE + ' wrote ' + path.relative(root, OUT).replace(/\\/g, '/'));
