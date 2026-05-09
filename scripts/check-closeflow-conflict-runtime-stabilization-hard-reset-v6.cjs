const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('CLOSEFLOW_CONFLICT_RUNTIME_STABILIZATION_HARD_RESET_V6_FAIL: ' + msg); process.exit(1); }
const leads = read('src/pages/Leads.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const system = read('api/system.ts');
const packageJson = read('package.json');
if (!leads.includes("import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';")) fail('Leads.tsx missing EntityConflictDialog import');
if (!leads.includes('findEntityConflictsInSupabase')) fail('Leads.tsx missing findEntityConflictsInSupabase usage/import');
if (!leads.includes('updateClientInSupabase')) fail('Leads.tsx missing updateClientInSupabase import for restore');
if (!leads.includes('leadConflictOpen') || !leads.includes('setLeadConflictOpen')) fail('Leads.tsx missing lead conflict state');
if (!leads.includes('<EntityConflictDialog')) fail('Leads.tsx missing EntityConflictDialog JSX');
if (leads.includes('forceDuplicate: Boolean(options?.forceDuplicate)')) fail('Leads.tsx still writes forceDuplicate instead of allowDuplicate');
for (const marker of ['findEntityConflictsInSupabase', 'insertLeadToSupabase', 'startLeadServiceInSupabase']) {
  if (!fallback.includes('export async function ' + marker)) fail('supabase-fallback missing export ' + marker);
}
if (!fallback.includes('/api/system?kind=entity-conflicts')) fail('supabase-fallback must route conflicts through /api/system');
if (!system.includes('entityConflictsHandler')) fail('api/system.ts missing entityConflictsHandler import/route');
if (!system.includes("entity-conflicts")) fail('api/system.ts missing entity-conflicts kind route');
if (!packageJson.includes('check:closeflow-supabase-fallback-named-exports-v1')) fail('package.json missing export guard script');
console.log('CLOSEFLOW_CONFLICT_RUNTIME_STABILIZATION_HARD_RESET_V6_CHECK_OK');
