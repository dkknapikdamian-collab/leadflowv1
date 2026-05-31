#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [];
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

const generatorPath = 'tools/stage216a-generate-lcc-functional-qa.cjs';
const probePath = 'tools/stage216a-lcc-api-probe.cjs';
const reportPath = '_project/reports/STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A leads clients cases functional QA.md';

check('Stage216-A generator exists', exists(generatorPath));
check('Stage216-A API probe exists', exists(probePath));
check('Stage216-A report exists', exists(reportPath));
check('Stage216-A Obsidian update exists', exists(obsidianPath));

const requiredRepoFiles = [
  'api/leads.ts',
  'api/clients.ts',
  'api/cases.ts',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/lib/supabase-fallback.ts',
  'src/server/_supabase.ts',
];

for (const file of requiredRepoFiles) {
  check(`source exists: ${file}`, exists(file));
}

if (exists(generatorPath)) {
  const generator = read(generatorPath);
  check('generator writes report', generator.includes('STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31.md'));
  check('generator writes Obsidian update', generator.includes('Stage216-A leads clients cases functional QA.md'));
  check('generator includes L/C/C modules', generator.includes('Leads list') && generator.includes('Clients list') && generator.includes('Cases list'));
  check('generator includes detail routes', generator.includes('/leads/:id') && generator.includes('/clients/:clientId') && generator.includes('/cases/:id'));
  check('generator includes hard refresh routes', generator.includes('hardRefreshRoutes'));
  check('generator declares no SQL/RLS/GRANT mutations', generator.includes('No SQL, RLS, GRANT'));
}

if (exists(probePath)) {
  const probe = read(probePath);
  check('probe is GET-only by default', probe.includes('Default mode is GET-only'));
  check('probe requires CLOSEFLOW_APP_URL', probe.includes('CLOSEFLOW_APP_URL'));
  check('probe checks lead/client/case list endpoints', probe.includes('/api/leads') && probe.includes('/api/clients') && probe.includes('/api/cases'));
  check('probe checks detail endpoints when ids exist', probe.includes('GET lead detail') && probe.includes('GET client detail') && probe.includes('GET case detail'));
  check('write probe disabled in Stage216-A', probe.includes('Write probe is intentionally disabled'));
  check('probe reports non-JSON responses', probe.includes('json=false') || probe.includes('json=${result.json}'));
}

if (exists('src/lib/supabase-fallback.ts')) {
  const fallback = read('src/lib/supabase-fallback.ts');
  check('supabase fallback detects INVALID_API_RESPONSE', fallback.includes('INVALID_API_RESPONSE'));
  check('supabase fallback has leads/clients/cases functions', fallback.includes('fetchLeadsFromSupabase') && fallback.includes('fetchClientsFromSupabase') && fallback.includes('fetchCasesFromSupabase'));
  check('supabase fallback has detail functions', fallback.includes('fetchClientByIdFromSupabase') && fallback.includes('fetchCaseByIdFromSupabase'));
  check('supabase fallback has mutation functions', fallback.includes('insertLeadToSupabase') && fallback.includes('createClientInSupabase') && fallback.includes('createCaseInSupabase'));
}

if (exists('api/clients.ts')) {
  const clients = read('api/clients.ts');
  check('clients API requires workspace', clients.includes('CLIENT_WORKSPACE_REQUIRED'));
  check('clients API has scoped write gate', clients.includes('assertWorkspaceWriteAccess'));
  check('clients API supports GET/POST/PATCH/DELETE', clients.includes("req.method === 'GET'") && clients.includes("req.method === 'POST'") && clients.includes("req.method === 'PATCH'") && clients.includes("req.method === 'DELETE'"));
}

if (exists('api/cases.ts')) {
  const cases = read('api/cases.ts');
  check('cases API requires workspace', cases.includes('AUTH_WORKSPACE_REQUIRED'));
  check('cases API has relation ensure client logic', cases.includes('ensureClientForCase'));
  check('cases API has lead already has case guard', cases.includes('LEAD_ALREADY_HAS_CASE'));
}

for (const p of [reportPath, obsidianPath]) {
  if (exists(p)) {
    const text = read(p);
    check(`${p} mentions Leads`, /Leads|lead/i.test(text));
    check(`${p} mentions Clients`, /Clients|client/i.test(text));
    check(`${p} mentions Cases`, /Cases|case/i.test(text));
    check(`${p} mentions INVALID_API_RESPONSE`, text.includes('INVALID_API_RESPONSE'));
    check(`${p} says no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
    check(`${p} separates facts`, /FAKTY/.test(text));
    check(`${p} separates decisions`, /DECYZJE/.test(text));
    check(`${p} separates hypotheses`, /HIPOTEZY/.test(text));
    check(`${p} has next step`, /NASTĘPNY KROK|NASTEPNY KROK|Następny krok/.test(text));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage216-A checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage216-A checks passed.`);
