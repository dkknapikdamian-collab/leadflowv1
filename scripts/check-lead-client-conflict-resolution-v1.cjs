const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assert(condition, message) { if (!condition) throw new Error(message); }
const api = read('api/entity-conflicts.ts');
const dialog = read('src/components/EntityConflictDialog.tsx');
const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const lib = read('src/lib/supabase-fallback.ts');
const pkg = read('package.json');
assert(api.includes('CLOSEFLOW_ENTITY_CONFLICTS_API_V1'), 'Missing entity conflicts API marker');
assert(api.includes('matchFields') && api.includes('service_history'), 'API must detect match fields and service history');
assert(dialog.includes('CLOSEFLOW_ENTITY_CONFLICT_DIALOG_V1'), 'Missing conflict dialog marker');
assert(dialog.includes('Dodaj mimo to') && dialog.includes('Pokaż') && dialog.includes('Przywróć'), 'Dialog must expose show/restore/create-anyway actions');
assert(leads.includes('CLOSEFLOW_LEAD_CONFLICT_RESOLUTION_V1'), 'Missing lead conflict marker');
assert(leads.includes('findEntityConflictsInSupabase') && leads.includes('handleCreateLeadAnyway'), 'Lead page not wired to conflict flow');
assert(clients.includes('CLOSEFLOW_CLIENT_CONFLICT_RESOLUTION_V1'), 'Missing client conflict marker');
assert(clients.includes('findEntityConflictsInSupabase') && clients.includes('handleCreateClientAnyway'), 'Client page not wired to conflict flow');
assert(lib.includes('findEntityConflictsInSupabase'), 'Missing conflict API client');
assert(pkg.includes('check:lead-client-conflict-resolution-v1'), 'Missing package script');
console.log('CLOSEFLOW_LEAD_CLIENT_CONFLICT_RESOLUTION_V1_CHECK_OK');
