const fs = require('fs');
const path = require('path');
const root = process.cwd();
function fileExists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assert(condition, message) { if (!condition) throw new Error(message); }

const conflictSourcePath = fileExists('src/server/entity-conflicts-handler.ts')
  ? 'src/server/entity-conflicts-handler.ts'
  : 'api/entity-conflicts.ts';

assert(fileExists(conflictSourcePath), 'Missing entity conflicts source');
const api = read(conflictSourcePath);
const dialog = read('src/components/EntityConflictDialog.tsx');
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const lib = read('src/lib/supabase-fallback.ts');
const pkg = read('package.json');

assert(
  api.includes('CLOSEFLOW_ENTITY_CONFLICTS_API_V1') || api.includes('CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_ENTITY_CONFLICTS_V1'),
  'Missing entity conflicts source marker',
);
assert(api.includes('matchFields') && api.includes('service_history'), 'Conflict source must detect match fields and service history');
assert(dialog.includes('CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1'), 'Missing conflict dialog marker');
assert(dialog.includes('Dodaj mimo to') && dialog.includes('Pokaż') && dialog.includes('Przywróć'), 'Dialog must expose show/restore/create-anyway actions');
assert(leads.includes('CLOSEFLOW_LEAD_CONFLICT_RESOLUTION_V1'), 'Missing lead conflict marker');
assert(leads.includes('findEntityConflictsInSupabase') && leads.includes('handleCreateLeadAnyway'), 'Lead page not wired to conflict flow');
assert(clients.includes('CLOSEFLOW_CLIENT_CONFLICT_RESOLUTION_V1'), 'Missing client conflict marker');
assert(clients.includes('findEntityConflictsInSupabase') && clients.includes('handleCreateClientAnyway'), 'Client page not wired to conflict flow');
assert(lib.includes('findEntityConflictsInSupabase'), 'Missing conflict API client');
assert(pkg.includes('check:lead-client-conflict-resolution-v1'), 'Missing package script');

if (fileExists('src/server/entity-conflicts-handler.ts')) {
  const system = read('api/system.ts');
  assert(system.includes('entity-conflicts-handler'), 'api/system.ts does not import entity conflicts handler');
  assert(system.includes('CLOSEFLOW_ENTITY_CONFLICTS_SYSTEM_KIND_ROUTE_V1'), 'api/system.ts missing entity-conflicts kind route marker');
  assert(lib.includes('/api/system?kind=entity-conflicts'), 'client must call /api/system?kind=entity-conflicts after Vercel consolidation');
  assert(!lib.includes('/api/entity-conflicts'), 'client still references standalone /api/entity-conflicts');
  assert(!fileExists('api/entity-conflicts.ts'), 'standalone api/entity-conflicts.ts still exists and breaks Hobby function limit');
}

console.log('CLOSEFLOW_LEAD_CLIENT_CONFLICT_RESOLUTION_V1_CHECK_OK');
