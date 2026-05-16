const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V25_FAIL: ' + msg); process.exit(1); }
const apiLeads = read('api/leads.ts');
if (!apiLeads.includes('CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V25')) fail('api/leads.ts missing V25 marker');
if (!apiLeads.includes('company: asLeadCompanyForNotNull(payload.company)')) fail('api/leads.ts does not sanitize insert fallback company');
if (!apiLeads.includes('let currentPayload: Record<string, unknown>')) fail('api/leads.ts currentPayload must stay Record<string, unknown>');
const fallback = read('src/lib/supabase-fallback.ts');
if (!fallback.includes('function sanitizeLeadCompanyForNotNull')) fail('supabase-fallback missing client-side company sanitizer');
if (!fallback.includes('JSON.stringify(sanitizeLeadCompanyForNotNull(input))')) fail('insertLeadToSupabase does not sanitize company');
if (!fallback.includes('export async function deleteLeadFromSupabase')) fail('deleteLeadFromSupabase export missing');
const dialog = read('src/components/EntityConflictDialog.tsx');
if (!dialog.includes('onDeleteCandidate')) fail('EntityConflictDialog missing onDeleteCandidate');
if (!dialog.includes('>Usu\u0144')) fail('EntityConflictDialog missing delete button label');
const leads = read('src/pages/Leads.tsx');
if (!leads.includes('deleteLeadFromSupabase')) fail('Leads.tsx missing deleteLeadFromSupabase');
if (!leads.includes('deleteClientFromSupabase')) fail('Leads.tsx missing deleteClientFromSupabase');
if (!leads.includes('handleDeleteConflictCandidate')) fail('Leads.tsx missing conflict delete handler');
if (!leads.includes('data-closeflow-lead-conflict-dialog-v25')) fail('Leads.tsx missing conflict dialog mount marker');
if (/from ['"]\.\.\/components\/ui\/card['"][\s\S]{0,120}(Briefcase|buildRelationValueEntries)/.test(leads)) fail('Leads.tsx import block is polluted around ui/card');
if (/from ['"]react-router-dom['"][\s\S]{0,120}(useCallback|useState|updateLeadInSupabase)/.test(leads)) fail('Leads.tsx import block is polluted around react-router-dom');
const guard = read('scripts/check-closeflow-supabase-fallback-named-exports-v1.cjs');
if (!guard.includes('collectImportDeclarations')) fail('supabase fallback guard not rewritten to declaration parser');
if (guard.includes('import[\\s\\S]*?from')) fail('supabase fallback guard still contains broad regex');
console.log('CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V25_CHECK_OK');
