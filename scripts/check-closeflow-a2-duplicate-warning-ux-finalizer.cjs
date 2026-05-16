const fs = require('fs');

const checks = [];
function pass(label) { checks.push({ ok: true, label }); console.log('PASS ' + label); }
function fail(label) { checks.push({ ok: false, label }); console.error('FAIL ' + label); }
function read(rel) {
  if (!fs.existsSync(rel)) { fail(rel + ': exists'); return ''; }
  pass(rel + ': exists');
  return fs.readFileSync(rel, 'utf8');
}
function must(text, needle, label) {
  if (text.includes(needle)) pass(label);
  else fail(label + ' [needle=' + needle + ']');
}
function mustNot(text, needle, label) {
  if (!text.includes(needle)) pass(label);
  else fail(label + ' [forbidden=' + needle + ']');
}

const marker = 'CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER';

const conflictDialog = read('src/components/EntityConflictDialog.tsx');
must(conflictDialog, marker, 'EntityConflictDialog has A2 marker');
must(conflictDialog, "'lead' | 'client' | 'case'", 'EntityConflictDialog supports lead/client/case candidate types');
for (const field of ['email', 'phone', 'name', 'company']) must(conflictDialog, `field === '${field}'`, `EntityConflictDialog reason label for ${field}`);
for (const action of ['Poka\u017C', 'Przywr\u00F3\u0107', 'Dodaj mimo to', 'Anuluj']) must(conflictDialog, action, `EntityConflictDialog action/copy: ${action}`);
must(conflictDialog, 'onShow(candidate)', 'EntityConflictDialog has show action');
must(conflictDialog, 'onRestore(candidate)', 'EntityConflictDialog has restore action');
must(conflictDialog, 'onCreateAnyway', 'EntityConflictDialog has add anyway action');
must(conflictDialog, 'onCancel', 'EntityConflictDialog has cancel action');

const supabase = read('src/lib/supabase-fallback.ts');
must(supabase, marker, 'supabase-fallback has A2 marker');
must(supabase, 'findEntityConflictsInSupabase(input: EntityConflictCheckInput)', 'supabase-fallback exposes findEntityConflictsInSupabase');
must(supabase, "targetType: 'lead' | 'client'", 'find conflicts input supports lead/client target');
must(supabase, 'name?: string;', 'find conflicts input includes name');
must(supabase, 'company?: string;', 'find conflicts input includes company');
must(supabase, 'email?: string;', 'find conflicts input includes email');
must(supabase, 'phone?: string;', 'find conflicts input includes phone');
must(supabase, 'workspaceId?: string;', 'find conflicts input includes workspaceId');
must(supabase, 'matchFields?', 'client conflict candidate type accepts matchFields');
must(supabase, 'CLOSEFLOW_A2_FORCE_DUPLICATE_TO_ALLOW_DUPLICATE_API_MAP', 'supabase-fallback maps forceDuplicate to allowDuplicate explicitly');
must(supabase, 'delete next.forceDuplicate', 'supabase-fallback does not send forceDuplicate to API');
must(supabase, 'allowDuplicate', 'supabase-fallback sends allowDuplicate to API');

const leads = read('src/pages/Leads.tsx');
must(leads, marker, 'Leads has A2 marker');
must(leads, "findEntityConflictsInSupabase({ targetType: 'lead'", 'Lead create checks duplicates before write');
for (const field of ['name: preparedLead.name', 'email: preparedLead.email', 'phone: preparedLead.phone', 'company: preparedLead.company', 'workspaceId']) must(leads, field, 'Lead conflict check sends ' + field);
must(leads, 'setIsNewLeadOpen(false)', 'Lead modal closes when duplicate candidates exist');
must(leads, 'setLeadConflictOpen(true)', 'Lead conflict dialog opens when duplicate candidates exist');
must(leads, 'setLeadConflictPendingInput(preparedLead)', 'Lead pending input is saved for add anyway');
must(leads, 'handleCreateLeadAnyway', 'Lead add-anyway handler exists');
must(leads, 'allowDuplicate: Boolean(options?.forceDuplicate)', 'Lead maps local forceDuplicate to API allowDuplicate');
mustNot(leads, 'forceDuplicate: Boolean(options?.forceDuplicate), ownerId', 'Lead does not send forceDuplicate as API field');
must(leads, 'EntityConflictDialog', 'Lead renders EntityConflictDialog');

const clients = read('src/pages/Clients.tsx');
must(clients, marker, 'Clients has A2 marker');
must(clients, "findEntityConflictsInSupabase({ targetType: 'client'", 'Client create checks duplicates before write');
for (const field of ['name: preparedClient.name', 'email: preparedClient.email', 'phone: preparedClient.phone', 'company: preparedClient.company', 'workspaceId']) must(clients, field, 'Client conflict check sends ' + field);
must(clients, 'setIsCreateOpen(false)', 'Client modal closes when duplicate candidates exist');
must(clients, 'setClientConflictOpen(true)', 'Client conflict dialog opens when duplicate candidates exist');
must(clients, 'setClientConflictPendingInput(preparedClient)', 'Client pending input is saved for add anyway');
must(clients, 'handleCreateClientAnyway', 'Client add-anyway handler exists');
must(clients, 'allowDuplicate: Boolean(options?.forceDuplicate)', 'Client maps local forceDuplicate to API allowDuplicate');
mustNot(clients, 'forceDuplicate: Boolean(options?.forceDuplicate), workspaceId', 'Client does not send forceDuplicate as API field');
must(clients, 'EntityConflictDialog', 'Client renders EntityConflictDialog');

const conflictHandler = read('src/server/entity-conflicts-handler.ts');
must(conflictHandler, marker, 'entity-conflicts handler has A2 marker');
must(conflictHandler, 'normalizeText', 'entity-conflicts normalizes text/name/company/email');
must(conflictHandler, 'normalizePhone', 'entity-conflicts normalizes phone');
must(conflictHandler, 'matchFields(input', 'entity-conflicts builds matchFields');
for (const field of ['email', 'phone', 'name', 'company']) must(conflictHandler, `matches.push('${field}')`, 'entity-conflicts matches ' + field);
must(conflictHandler, 'leadRows', 'entity-conflicts searches leads');
must(conflictHandler, 'clientRows', 'entity-conflicts searches clients');
must(conflictHandler, 'matchFields: matches', 'entity-conflicts returns matchFields');
must(conflictHandler, 'conflicts: candidates', 'entity-conflicts returns conflicts alias for compatibility');

const apiSystem = read('api/system.ts');
must(apiSystem, marker, 'api/system has A2 marker');
must(apiSystem, 'entityConflictsHandler', 'api/system delegates entity-conflicts handler');
must(apiSystem, 'entity-conflicts', 'api/system contains entity-conflicts route/import token');

const apiLeads = read('api/leads.ts');
must(apiLeads, marker, 'api/leads has A2 marker');
must(apiLeads, 'CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE', 'api/leads documents allowDuplicate override');
const apiClients = read('api/clients.ts');
must(apiClients, marker, 'api/clients has A2 marker');
must(apiClients, 'CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE', 'api/clients documents allowDuplicate override');

const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
if (pkg.scripts && pkg.scripts['check:a2-duplicate-warning-ux-finalizer'] === 'node scripts/check-closeflow-a2-duplicate-warning-ux-finalizer.cjs') pass('package.json has A2 check script');
else fail('package.json has A2 check script');

const doc = read('docs/release/CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER_2026-05-09.md');
must(doc, 'CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER', 'A2 doc marker');
must(doc, 'Nie scala\u0107', 'A2 doc says no merge');
must(doc, 'nie blokowa\u0107 zapisu', 'A2 doc says no blocking');
must(doc, 'Dodaj mimo to', 'A2 doc includes add anyway action');
must(doc, 'findEntityConflictsInSupabase', 'A2 doc documents conflict check helper');

const failed = checks.filter((item) => !item.ok);
console.log('\nSummary: ' + (checks.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('FAIL CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER_OK');
