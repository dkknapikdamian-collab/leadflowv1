const fs = require('fs');
const path = require('path');

const root = process.cwd();
const STAGE = 'STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1';
const OUT = path.join(root, 'docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_LATEST.md');

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function normalizePath(rel) { return rel.replace(/\\/g, '/'); }
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
function contains(rel, needle) {
  return exists(rel) && read(rel).includes(needle);
}

const hostRel = 'src/components/ContextActionDialogs.tsx';
const registryRel = 'src/lib/context-action-contract.ts';
const taskRel = 'src/components/TaskCreateDialog.tsx';
const eventRel = 'src/components/EventCreateDialog.tsx';
const noteRel = 'src/components/ContextNoteDialog.tsx';
const apiFiles = listApiFunctionFiles().map((file) => normalizePath(path.relative(root, file))).sort();

const host = exists(hostRel) ? read(hostRel) : '';
const registry = exists(registryRel) ? read(registryRel) : '';
const task = exists(taskRel) ? read(taskRel) : '';
const event = exists(eventRel) ? read(eventRel) : '';
const note = exists(noteRel) ? read(noteRel) : '';

const checks = [
  check('context action host exists', exists(hostRel), hostRel),
  check('contract registry exists', exists(registryRel), registryRel),
  check('registry maps task to TaskCreateDialog and tasks', registry.includes("dialogComponent: 'TaskCreateDialog'") && registry.includes("persistenceTarget: 'tasks'")),
  check('registry maps event to EventCreateDialog and events', registry.includes("dialogComponent: 'EventCreateDialog'") && registry.includes("persistenceTarget: 'events'")),
  check('registry maps note to ContextNoteDialog and activities', registry.includes("dialogComponent: 'ContextNoteDialog'") && registry.includes("persistenceTarget: 'activities'")),
  check('registry relation keys include lead/case/client/workspace', registry.includes("'leadId'") && registry.includes("'caseId'") && registry.includes("'clientId'") && registry.includes("'workspaceId'")),
  check('host supports explicit data-context-action-kind', host.includes('data-context-action-kind') && host.includes('buildContextFromExplicitClick')),
  check('host keeps text fallback for legacy buttons', host.includes('dodaj zadanie') && host.includes('dodaj wydarzenie') && host.includes('dodaj notat')),
  check('host opens one shared task dialog', host.includes('<TaskCreateDialog') && host.includes('open={openTask}')),
  check('host opens one shared event dialog', host.includes('<EventCreateDialog') && host.includes('open={openEvent}')),
  check('host opens one shared note dialog', host.includes('<ContextNoteDialog') && host.includes('open={openNote}')),
  check('openContextQuickAction uses one browser event bus', host.includes('CONTEXT_ACTION_EVENT') && host.includes('window.dispatchEvent(new CustomEvent<ContextActionRequest>')),
  check('task dialog writes through Supabase with relation ids', task.includes('insertTaskToSupabase') && task.includes('leadId: context?.leadId') && task.includes('caseId: context?.caseId') && task.includes('clientId: context?.clientId') && task.includes('workspaceId')),
  check('event dialog writes through Supabase with relation ids and scheduledAt', event.includes('insertEventToSupabase') && event.includes('scheduledAt: form.startAt') && event.includes('leadId: context?.leadId') && event.includes('caseId: context?.caseId') && event.includes('clientId: context?.clientId') && event.includes('workspaceId')),
  check('note dialog writes to activities with relation context', note.includes('insertActivityToSupabase') && note.includes('context?.leadId') && note.includes('context?.caseId') && note.includes('context?.clientId')),
  check('Vercel Hobby API count remains <= 12', apiFiles.length <= 12, String(apiFiles.length)),
  check('assistant query remains collapsed and not a physical function', !exists('api/assistant/query.ts') && contains('vercel.json', '"destination": "/api/system?kind=assistant-query"')),
];

const failed = checks.filter((entry) => !entry.ok);
const lines = [
  '# ' + STAGE,
  '',
  'GeneratedAt: `' + new Date().toISOString() + '`',
  '',
  '## Verdict',
  '',
  failed.length ? 'FAIL: context action runtime contract has issues.' : 'PASS: context actions use one registry, one host and one persistence route per action kind.',
  '',
  '## Checks',
  '',
  ...checks.map((entry) => '- ' + (entry.ok ? 'PASS' : 'FAIL') + ' — ' + entry.name + (entry.details ? ' — `' + entry.details + '`' : '')),
  '',
  '## Physical API functions',
  '',
  ...apiFiles.map((file) => '- `' + file + '`'),
  '',
];
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
for (const entry of checks) console.log((entry.ok ? 'PASS ' : 'FAIL ') + entry.name + (entry.details ? ' :: ' + entry.details : ''));
if (failed.length) process.exit(1);
console.log('PASS ' + STAGE + ' wrote ' + normalizePath(path.relative(root, OUT)));
