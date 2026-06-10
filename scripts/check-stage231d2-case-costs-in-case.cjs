const fs = require('fs');
const path = require('path');
const STAGE='STAGE231D2_CASE_COSTS_IN_CASE';
const root=process.cwd();
const required=[
 'api/cases.ts',
 'src/lib/finance/case-costs-source.ts',
 'src/lib/finance/case-finance-source.ts',
 'src/lib/supabase-fallback.ts',
 'src/pages/CaseDetail.tsx',
 'sql/2026-06-10_stage231d2_case_costs.sql',
 '_project/runs/STAGE231D2_CASE_COSTS_IN_CASE_RUN.md',
 '_project/obsidian_payloads/STAGE231D2_CASE_COSTS_IN_CASE_OBSIDIAN_PAYLOAD.md',
 '_project/runs/STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_RUN.md',
 '_project/obsidian_payloads/STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_OBSIDIAN_PAYLOAD.md',
 '_project/runs/STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_RUN.md',
 '_project/obsidian_payloads/STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_OBSIDIAN_PAYLOAD.md'
];
const errors=[];
function read(file){return fs.readFileSync(path.join(root,file),'utf8')}
function has(file, token){ if(!read(file).includes(token)) errors.push(file+': missing token '+JSON.stringify(token)); }
function notHas(file, token){ if(read(file).includes(token)) errors.push(file+': forbidden token '+JSON.stringify(token)); }
console.log(STAGE+': start');
for(const file of required){ if(!fs.existsSync(path.join(root,file))) errors.push('missing required file: '+file); }
if(fs.existsSync(path.join(root,'api/case-costs.ts'))) errors.push('api/case-costs.ts must be removed; D2-R3 consolidates costs into api/cases.ts');
if(!errors.length){
 has('src/pages/CaseDetail.tsx', 'data-stage231d2-case-costs-in-case');
 has('src/pages/CaseDetail.tsx', 'Dodaj koszt sprawy');
 has('src/pages/CaseDetail.tsx', 'fetchCaseCostsFromSupabase');
 has('src/pages/CaseDetail.tsx', 'fetchCaseCostsFromSupabase({ caseId');
 has('src/pages/CaseDetail.tsx', 'costRowsRaw');
 has('src/pages/CaseDetail.tsx', 'setCaseCostsStage231D2');
 has('src/pages/CaseDetail.tsx', 'createCaseCostInSupabase');
 has('src/lib/supabase-fallback.ts', 'fetchCaseCostsFromSupabase');
 has('src/lib/supabase-fallback.ts', '/api/cases?resource=costs');
 notHas('src/lib/supabase-fallback.ts', '/api/case-costs');
 has('api/cases.ts', 'STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX');
 has('api/cases.ts', 'handleCaseCostsResourceStage231D2R3');
 has('api/cases.ts', 'caseCostsResourceStage231D2R3');
 has('api/cases.ts', 'case_costs');
 has('api/cases.ts', 'assertWorkspaceWriteAccess(workspaceId, req)');
 has('sql/2026-06-10_stage231d2_case_costs.sql', 'create table if not exists public.case_costs');
 has('sql/2026-06-10_stage231d2_case_costs.sql', 'alter table public.case_costs enable row level security');
 has('_project/runs/STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_RUN.md', 'audyt ryzyk');
 has('_project/runs/STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_RUN.md', 'następny krok');
 has('_project/obsidian_payloads/STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_OBSIDIAN_PAYLOAD.md', 'Vercel Hobby');
}
if(errors.length){ console.error(STAGE+': FAIL'); for(const e of errors) console.error('- '+e); process.exit(1);}
console.log(STAGE+': PASS');
