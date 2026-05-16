const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1';
const OUT = path.join(root, 'docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_LATEST.md');

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function normalizePath(rel) { return rel.replace(/\\/g, '/'); }
function contains(rel, needle) { return exists(rel) && read(rel).includes(needle); }
function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listApiFunctionFiles(full));
    else if (entry.isFile() && /\.(ts|js|mjs|cjs)$/i.test(entry.name) && !/\.d\.ts$/i.test(entry.name)) result.push(full);
  }
  return result;
}
function check(name, ok, details = '') {
  return { name, ok: Boolean(ok), details };
}
function pageChecks(page, rel) {
  const text = exists(rel) ? read(rel) : '';
  return [
    check(page + ' exists', exists(rel), rel),
    check(page + ' uses openContextQuickAction', text.includes('openContextQuickAction')),
    check(page + ' imports ContextActionKind', text.includes('ContextActionKind')),
    check(page + ' does not import TaskCreateDialog directly', !/from ['\"]\.\.\/components\/TaskCreateDialog['\"]/.test(text)),
    check(page + ' does not import EventCreateDialog directly', !/from ['\"]\.\.\/components\/EventCreateDialog['\"]/.test(text)),
  ];
}

const files = {
  registry: 'src/lib/context-action-contract.ts',
  host: 'src/components/ContextActionDialogs.tsx',
  taskDialog: 'src/components/TaskCreateDialog.tsx',
  eventDialog: 'src/components/EventCreateDialog.tsx',
  noteDialog: 'src/components/ContextNoteDialog.tsx',
  lead: 'src/pages/LeadDetail.tsx',
  client: 'src/pages/ClientDetail.tsx',
  case: 'src/pages/CaseDetail.tsx',
};

const registry = exists(files.registry) ? read(files.registry) : '';
const host = exists(files.host) ? read(files.host) : '';
const taskDialog = exists(files.taskDialog) ? read(files.taskDialog) : '';
const eventDialog = exists(files.eventDialog) ? read(files.eventDialog) : '';
const noteDialog = exists(files.noteDialog) ? read(files.noteDialog) : '';
const apiFiles = listApiFunctionFiles().map((file) => normalizePath(path.relative(root, file))).sort();

const checks = [
  check('context action registry exists', exists(files.registry), files.registry),
  check('context action host exists', exists(files.host), files.host),
  check('task route map: task -> TaskCreateDialog -> tasks', registry.includes("kind: 'task'") && registry.includes("dialogComponent: 'TaskCreateDialog'") && registry.includes("persistenceTarget: 'tasks'")),
  check('event route map: event -> EventCreateDialog -> events', registry.includes("kind: 'event'") && registry.includes("dialogComponent: 'EventCreateDialog'") && registry.includes("persistenceTarget: 'events'")),
  check('note route map: note -> ContextNoteDialog -> activities', registry.includes("kind: 'note'") && registry.includes("dialogComponent: 'ContextNoteDialog'") && registry.includes("persistenceTarget: 'activities'")),
  check('registry relation keys are explicit', registry.includes("'leadId'") && registry.includes("'caseId'") && registry.includes("'clientId'") && registry.includes("'workspaceId'")),
  check('host resolves explicit trigger attributes first', host.includes('buildContextFromExplicitClick') && host.includes('data-context-action-kind')),
  check('host keeps text fallback for legacy buttons', host.includes('resolveActionKindFromClick') && host.includes('dodaj zadanie') && host.includes('dodaj wydarzenie') && host.includes('dodaj notat')),
  check('host exposes one shared event bus', host.includes('CONTEXT_ACTION_EVENT') && host.includes('window.dispatchEvent')),
  check('host renders one task dialog', (host.match(/<TaskCreateDialog/g) || []).length === 1),
  check('host renders one event dialog', (host.match(/<EventCreateDialog/g) || []).length === 1),
  check('host renders one note dialog', (host.match(/<ContextNoteDialog/g) || []).length === 1),
  check('task dialog writes task relation context', taskDialog.includes('insertTaskToSupabase') && taskDialog.includes('leadId: context?.leadId') && taskDialog.includes('caseId: context?.caseId') && taskDialog.includes('clientId: context?.clientId') && taskDialog.includes('workspaceId')),
  check('event dialog writes event relation context and scheduledAt', eventDialog.includes('insertEventToSupabase') && eventDialog.includes('scheduledAt: form.startAt') && eventDialog.includes('leadId: context?.leadId') && eventDialog.includes('caseId: context?.caseId') && eventDialog.includes('clientId: context?.clientId') && eventDialog.includes('workspaceId')),
  check('note dialog writes activity relation context', noteDialog.includes('insertActivityToSupabase') && noteDialog.includes('context?.leadId') && noteDialog.includes('context?.caseId') && noteDialog.includes('context?.clientId')),
  ...pageChecks('LeadDetail', files.lead),
  ...pageChecks('ClientDetail', files.client),
  ...pageChecks('CaseDetail', files.case),
  check('assistant query remains collapsed, not a physical API function', !exists('api/assistant/query.ts') && contains('vercel.json', '"destination": "/api/system?kind=assistant-query"')),
  check('Vercel Hobby function budget remains <= 12', apiFiles.length <= 12, String(apiFiles.length)),
];

const routes = [
  { action: 'task', click: 'data-context-action-kind="task" or legacy text Dodaj zadanie / follow-up', host: 'ContextActionDialogsHost', dialog: 'TaskCreateDialog', save: 'insertTaskToSupabase', target: 'tasks', relations: 'leadId, caseId, clientId, workspaceId' },
  { action: 'event', click: 'data-context-action-kind="event" or legacy text Dodaj wydarzenie / Zaplanuj spotkanie', host: 'ContextActionDialogsHost', dialog: 'EventCreateDialog', save: 'insertEventToSupabase', target: 'events', relations: 'leadId, caseId, clientId, workspaceId' },
  { action: 'note', click: 'data-context-action-kind="note" or legacy text Dodaj notatke / Podyktuj notatke', host: 'ContextActionDialogsHost', dialog: 'ContextNoteDialog', save: 'insertActivityToSupabase', target: 'activities', relations: 'leadId, caseId, clientId, workspaceId where available' },
];
const failed = checks.filter((entry) => !entry.ok);
const lines = [
  '# ' + STAGE,
  '',
  'GeneratedAt: `' + new Date().toISOString() + '`',
  '',
  '## Verdict',
  '',
  failed.length ? 'FAIL: action route map has drift or missing contracts.' : 'PASS: every context action has one mapped host, one dialog and one persistence target.',
  '',
  '## Route map',
  '',
  '| Action | Trigger | Host | Dialog | Save function | Target | Relations |',
  '|---|---|---|---|---|---|---|',
  ...routes.map((row) => `| ${row.action} | ${row.click} | ${row.host} | ${row.dialog} | ${row.save} | ${row.target} | ${row.relations} |`),
  '',
  '## Checks',
  '',
  ...checks.map((entry) => '- ' + (entry.ok ? 'PASS' : 'FAIL') + ' \u2014 ' + entry.name + (entry.details ? ' \u2014 `' + entry.details + '`' : '')),
  '',
  '## Physical API functions',
  '',
  ...apiFiles.map((file) => '- `' + file + '`'),
  '',
  '## Rule',
  '',
  'A new button for task, event or note must use the same registry, host and persistence route. No parallel local dialog path is allowed.',
  '',
];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
for (const entry of checks) console.log((entry.ok ? 'PASS ' : 'FAIL ') + entry.name + (entry.details ? ' :: ' + entry.details : ''));
if (failed.length) process.exit(1);
console.log('PASS ' + STAGE + ' wrote ' + normalizePath(path.relative(root, OUT)));
