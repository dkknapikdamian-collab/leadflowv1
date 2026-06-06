const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) throw new Error('Missing file: ' + relPath);
  return fs.readFileSync(fullPath, 'utf8');
}

function fail(message) {
  throw new Error('STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME_GUARD_FAIL: ' + message);
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing token: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden token still present: ' + needle);
}

function requireRegex(text, regex, label) {
  if (!regex.test(text)) fail(label + ' missing regex: ' + regex);
}

const leadsPage = read('src/pages/Leads.tsx');
const clientsPage = read('src/pages/Clients.tsx');
const apiLeads = read('api/leads.ts');
const apiClients = read('api/clients.ts');
const dataContract = read('src/lib/data-contract.ts');
const pkg = JSON.parse(read('package.json'));

requireText(leadsPage, 'delete sanitizedPreparedLead.clientId;', 'Leads create sanitizes clientId');
requireText(leadsPage, 'delete sanitizedPreparedLead.client_id;', 'Leads create sanitizes client_id');
requireText(leadsPage, 'delete sanitizedPreparedLead.caseId;', 'Leads create sanitizes caseId');
requireText(leadsPage, 'delete sanitizedPreparedLead.case_id;', 'Leads create sanitizes case_id');
requireText(leadsPage, 'await insertLeadToSupabase', 'Leads create inserts lead');
requireText(leadsPage, 'targetType: \'lead\'', 'Lead conflict search stays lead-targeted');

const createLeadBlock = leadsPage.slice(
  leadsPage.indexOf('const createLeadFromPreparedInput'),
  leadsPage.indexOf('const restoreConflictCandidate')
);
forbidText(createLeadBlock, 'createClientInSupabase', 'Lead create path must not create client');
forbidText(createLeadBlock, 'createCaseInSupabase', 'Lead create path must not create case');

requireRegex(
  clientsPage,
  /const filtered = useMemo\(\(\) => \{[\s\S]*?return clients\s*\.filter/,
  'Clients list source must start from clients array'
);

forbidText(apiClients, '/api/leads', '/api/clients must not call /api/leads');
forbidText(apiClients, 'normalizeLeadContract', '/api/clients must not normalize leads as clients');
forbidText(apiClients, 'leads?select', '/api/clients GET must not read leads table');
requireText(apiClients, 'clients?select=', '/api/clients GET reads clients table');
requireText(apiClients, 'normalizeClientContract', '/api/clients normalizes client contract');

const freshPostStart = apiLeads.indexOf('const finalWorkspaceId = workspaceId;');
const freshPostEnd = apiLeads.indexOf('const inserted = Array.isArray(result.data)', freshPostStart);
if (freshPostStart < 0 || freshPostEnd < 0) fail('fresh lead POST block not found');
const freshPostBlock = apiLeads.slice(freshPostStart, freshPostEnd);

forbidText(freshPostBlock, 'ensureClientForLead', 'Fresh lead POST must not ensure/create client');
forbidText(freshPostBlock, 'ensuredClient', 'Fresh lead POST must not use ensured client');
forbidText(freshPostBlock, 'client_id: ensuredClientId', 'Fresh lead POST must not write ensured client_id');
requireText(freshPostBlock, 'client_id: null', 'Fresh lead POST must force client_id null');
requireText(freshPostBlock, 'linked_case_id: null', 'Fresh lead POST must force linked_case_id null');

requireText(apiLeads, 'function ensureClientForLead', 'start_service can still use explicit lead-to-client conversion helper');
requireText(apiLeads, "body.action) === 'start_service'", 'explicit start_service flow remains available');

forbidText(dataContract, 'lead as client', 'data contract must not describe lead-as-client mapping');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage226r10-lead-client-separation-runtime.cjs', 'prebuild includes Stage226R10 guard');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE226R10_LEAD_CLIENT_SEPARATION_RUNTIME_FIX',
  guard: 'check:stage226r10-lead-client-separation-runtime'
}, null, 2));
