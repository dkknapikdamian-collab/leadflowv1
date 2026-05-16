const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
function fail(msg) { console.error('CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V27_FAIL: ' + msg); process.exit(1); }

const guard = read('scripts/check-closeflow-supabase-fallback-named-exports-v1.cjs');
if (!guard.includes('function collectImportDeclarations(text)')) fail('guard missing bounded import declaration parser');
if (guard.includes('const importDecl = /import')) fail('guard still uses broad import regex variable');
if (!guard.includes('stripImportComments')) fail('guard does not strip comments before parsing named imports');
if (!guard.includes('createResponseTemplateInSupabase imported by')) fail('guard missing comment pollution sentinel');

const fallback = read('src/lib/supabase-fallback.ts');
if (!fallback.includes('findEntityConflictsInSupabase')) fail('missing findEntityConflictsInSupabase');
if (!fallback.includes('deleteLeadFromSupabase')) fail('missing deleteLeadFromSupabase');
if (!fallback.includes('insertLeadToSupabase')) fail('missing insertLeadToSupabase');
if (!/insertLeadToSupabase[\s\S]{0,500}company\s*:\s*[^,}]*\|\|\s*''/.test(fallback) && !fallback.includes('sanitizeLeadCompanyForNotNull')) {
  fail('insertLeadToSupabase does not visibly keep company non-null');
}

const leadsApi = read('api/leads.ts');
if (!leadsApi.includes('CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR')) fail('api/leads.ts missing company NOT NULL repair marker');
if (!/company\s*:\s*[^,}]*\|\|\s*''/.test(leadsApi) && !leadsApi.includes('asLeadCompanyForNotNull')) {
  fail('api/leads.ts does not visibly force company non-null');
}

const dialog = read('src/components/EntityConflictDialog.tsx');
if (!dialog.includes('onDeleteCandidate')) fail('EntityConflictDialog missing onDeleteCandidate');
if (!dialog.includes('Usu\u0144')) fail('EntityConflictDialog missing Usu\u0144 button copy');

const leads = read('src/pages/Leads.tsx');
if (!leads.includes('handleDeleteConflictCandidate')) fail('Leads.tsx missing handleDeleteConflictCandidate');
if (!leads.includes('deleteLeadFromSupabase')) fail('Leads.tsx missing deleteLeadFromSupabase');
if (!leads.includes('deleteClientFromSupabase')) fail('Leads.tsx missing deleteClientFromSupabase');

console.log('CLOSEFLOW_CONFLICT_DELETE_COMPANY_NOT_NULL_V27_CHECK_OK');
