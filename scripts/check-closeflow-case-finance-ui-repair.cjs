const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const taskRoute = read('src/server/task-route-stage124f.ts');
const eventRoute = read('src/server/event-route-stage124f.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const caseDetail = read('src/pages/CaseDetail.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const clients = read('src/pages/Clients.tsx');
const financeCss = read('src/styles/finance/closeflow-finance.css');
const railCss = read('src/styles/closeflow-right-rail-source-truth.css');
const financeSummary = read('src/components/finance/FinanceMiniSummary.tsx');
const migration = read('supabase/migrations/20260613143500_restore_case_items_canonical_columns.sql');

assert(fallback.includes("if (params?.caseId) query.set('caseId', params.caseId)"), 'Task/event loader must send caseId to the API.');
for (const source of [taskRoute, eventRoute]) {
  assert(source.includes("'case_id'"), 'Minimal work-item select must preserve case_id.');
  assert(source.includes("'client_id'"), 'Minimal work-item select must preserve client_id.');
  assert(source.includes("case_id=eq."), 'Work-item API must filter on canonical case_id.');
}

assert(!caseDetail.includes('fetchTasksFromSupabase().catch(() => [])'), 'Case actions errors must not be silently replaced with an empty list.');
assert(caseDetail.includes('fetchTasksFromSupabase({ caseId })'), 'Case detail must request tasks for the active case.');
assert(caseDetail.includes('fetchEventsFromSupabase({ caseId })'), 'Case detail must request events for the active case.');
assert(caseDetail.includes('data-case-actions-load-error="true"'), 'Case detail must expose action loading errors.');
assert(caseDetail.includes(".slice(0, 5)"), 'Expanded action previews must remain limited to five rows.');

assert(migration.includes('add column if not exists description text'), 'Migration must restore case_items.description.');
assert(migration.includes("notify pgrst, 'reload schema'"), 'Migration must request a PostgREST schema reload.');

for (const tone of ['transaction', 'commission', 'paid', 'remaining', 'earned', 'cost', 'reimbursed', 'total']) {
  assert(financeCss.includes(`data-cf-finance-tone="${tone}"`), `Missing shared finance tone: ${tone}.`);
}
assert(clientDetail.includes('data-cf-finance-tone="remaining"'), 'Client finance must use shared remaining tone.');
assert(clients.includes('data-cf-finance-tone="earned"'), 'Lifetime earned must use the shared earned tone.');
assert(financeSummary.includes('Pozostało do zapłaty'), 'Shared finance summary must use the approved remaining label.');

const notesStart = caseDetail.indexOf('data-stage219-case-notes-actions');
const addNote = caseDetail.indexOf('data-stage219-add-note', notesStart);
const dictate = caseDetail.indexOf('data-stage219-dictate-note', notesStart);
const allNotes = caseDetail.indexOf('data-case-all-notes-button', notesStart);
assert(notesStart >= 0 && addNote < dictate && dictate < allNotes, 'Case note actions must be ordered: add, dictate, all.');
assert(!caseDetail.slice(notesStart - 500, notesStart).includes('<p className="case-detail-eyebrow">Notatki sprawy</p>'), 'Duplicate case notes eyebrow must stay removed.');

assert(railCss.includes('grid-template-columns: minmax(0, 1fr) auto'), 'Top value row must reserve a shrinkable label column.');
assert(railCss.includes('text-overflow: ellipsis'), 'Top value labels must use ellipsis.');

console.log('OK: case actions, case_items schema, finance tones, notes and lead ellipsis contracts are protected.');
