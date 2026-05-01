const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function assert(condition, message) {
  if (!condition) {
    console.error('ERROR:', message);
    process.exit(1);
  }
}

const requiredFiles = [
  'src/lib/data-contract.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/calendar-items.ts',
  'supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql',
  'docs/STAGE05_SUPABASE_DATA_CONTRACT.md',
];

for (const file of requiredFiles) assert(exists(file), `${file} is missing`);

const contract = read('src/lib/data-contract.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const calendar = read('src/lib/calendar-items.ts');
const migration = read('supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql');
const pkg = JSON.parse(read('package.json'));

assert(pkg.scripts && pkg.scripts['verify:data-contract-stage05'], 'package.json must include verify:data-contract-stage05');

const entities = [
  'Lead', 'Client', 'Case', 'Task', 'Event', 'Activity', 'Payment', 'AiDraft', 'ResponseTemplate', 'CaseItem',
];
for (const entity of entities) {
  assert(contract.includes(`Normalized${entity}Record`), `data-contract.ts must define Normalized${entity}Record`);
  assert(contract.includes(`normalize${entity}Contract`), `data-contract.ts must define normalize${entity}Contract`);
}

const listNormalizers = [
  'normalizeLeadListContract',
  'normalizeClientListContract',
  'normalizeCaseListContract',
  'normalizeTaskListContract',
  'normalizeEventListContract',
  'normalizeActivityListContract',
  'normalizePaymentListContract',
  'normalizeAiDraftListContract',
  'normalizeResponseTemplateListContract',
  'normalizeCaseItemListContract',
];
for (const fn of listNormalizers) assert(contract.includes(`export function ${fn}`), `data-contract.ts must export ${fn}`);

for (const field of [
  'workspaceId: string;',
  'scheduledAt: string | null;',
  'startAt: string | null;',
  'linkedCaseId?: string;',
  'completenessPercent: number;',
  'movedToServiceAt: string | null;',
]) {
  assert(contract.includes(field), `data-contract.ts must include canonical field ${field}`);
}

assert(fallback.includes('normalizeClientListContract'), 'supabase-fallback.ts must normalize clients through data contract');
assert(fallback.includes('normalizePaymentListContract'), 'supabase-fallback.ts must normalize payments through data contract');
assert(fallback.includes('normalizeActivityListContract'), 'supabase-fallback.ts must normalize activities through data contract');
assert(fallback.includes('normalizeCaseItemListContract'), 'supabase-fallback.ts must normalize case items through data contract');
assert(fallback.includes('normalizeAiDraftListContract'), 'supabase-fallback.ts must normalize AI drafts through data contract');

assert(calendar.includes('normalizeTaskContract'), 'calendar-items.ts must consume task contract');
assert(calendar.includes('normalizeEventContract'), 'calendar-items.ts must consume event contract');
assert(!calendar.includes('row.dueAt, row.due_at'), 'calendar-items.ts must not maintain task dueAt/scheduledAt fallback chain');
assert(!calendar.includes('row.startAt,\n    row.start_at,'), 'calendar-items.ts must not maintain event startAt fallback chain');

for (const table of ['leads', 'clients', 'cases', 'work_items', 'activities', 'payments', 'ai_drafts', 'response_templates', 'case_items']) {
  assert(migration.includes(`'${table}'`), `migration must cover ${table}`);
}
assert(migration.includes('add column if not exists'), 'migration must be additive');

console.log('OK: Stage 05 Supabase data contract guard passed.');
