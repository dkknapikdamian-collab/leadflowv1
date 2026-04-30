const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();

const files = {
  handoff: path.join(root, 'src', 'lib', 'lead-case-handoff.ts'),
  leadDetail: path.join(root, 'src', 'pages', 'LeadDetail.tsx'),
  leads: path.join(root, 'src', 'pages', 'Leads.tsx'),
  caseDetail: path.join(root, 'src', 'pages', 'CaseDetail.tsx'),
  apiLeads: path.join(root, 'api', 'leads.ts'),
  leadHealth: path.join(root, 'src', 'lib', 'lead-health.ts'),
};

function fail(message) {
  console.error('FAIL lead to case flow:', message);
  process.exit(1);
}

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${name}`);
}

const handoff = fs.readFileSync(files.handoff, 'utf8');
const leadDetail = fs.readFileSync(files.leadDetail, 'utf8');
const leads = fs.readFileSync(files.leads, 'utf8');
const caseDetail = fs.readFileSync(files.caseDetail, 'utf8');
const apiLeads = fs.readFileSync(files.apiLeads, 'utf8');
const leadHealth = fs.readFileSync(files.leadHealth, 'utf8');
const combined = `${handoff}\n${leadDetail}\n${leads}\n${caseDetail}\n${apiLeads}\n${leadHealth}`;

const requiredHandoff = [
  'LEAD_TO_CASE_FLOW_STAGE24',
  'startLeadToCaseHandoff',
  'startLeadService',
  'caseId',
  'clientId',
  "status: 'moved_to_service'",
  "leadVisibility: 'archived'",
  "salesOutcome: 'moved_to_service'",
  'linkOpenOperationalItems',
];

for (const needle of requiredHandoff) {
  if (!handoff.includes(needle)) fail(`missing handoff content: ${needle}`);
}

const requiredLeadDetail = [
  'LEAD_TO_CASE_FLOW_STAGE24_LEAD_DETAIL',
  'startLeadToCaseHandoff',
  'startLeadServiceInSupabase',
  'navigate(`/case/${result.caseId}`)',
  'Ten temat jest już w obsłudze',
  'Otwórz sprawę',
];

for (const needle of requiredLeadDetail) {
  if (!leadDetail.includes(needle)) fail(`missing LeadDetail content: ${needle}`);
}

const requiredLeads = [
  'LEAD_TO_CASE_FLOW_STAGE24_LEADS_LIST',
  'serviceHistoryLeads',
  "quickFilter === 'history' ? serviceHistoryLeads : activeLeads",
  'isLeadMovedToService',
];

for (const needle of requiredLeads) {
  if (!leads.includes(needle)) fail(`missing Leads content: ${needle}`);
}

const requiredApi = [
  "asText(body.action) === 'start_service'",
  'ensureClientForLead',
  'insertCaseWithSchemaFallback',
  'buildLeadMovedToServicePayload',
  "event_type: 'lead_moved_to_service'",
  'linked_case_id',
  'client_id',
];

for (const needle of requiredApi) {
  if (!apiLeads.includes(needle)) fail(`missing api/leads flow content: ${needle}`);
}

if (!apiLeads.includes("payload.lead_visibility = 'archived'") && !apiLeads.includes("lead_visibility: 'archived'")) {
  fail('api/leads does not archive moved lead visibility');
}

if (!apiLeads.includes("payload.sales_outcome = 'moved_to_service'") && !apiLeads.includes("sales_outcome: 'moved_to_service'")) {
  fail('api/leads does not mark moved lead sales outcome');
}

const requiredCaseDetail = [
  'LEAD_TO_CASE_FLOW_STAGE24_CASE_DETAIL',
  'fetchLeadByIdFromSupabase',
  'sourceLeadLabel',
  'Źródłowy lead',
];

for (const needle of requiredCaseDetail) {
  if (!caseDetail.includes(needle)) fail(`missing CaseDetail content: ${needle}`);
}

if (!leadHealth.includes('isActiveSalesLead') || !leadHealth.includes('!isLeadMovedToService(lead)')) {
  fail('lead health does not exclude moved leads from active sales leads');
}

for (const forbidden of ['zamknięty sprzedażowo', 'lead zamknięty sprzedażowo', 'sales closed']) {
  if (combined.toLowerCase().includes(forbidden.toLowerCase())) fail(`forbidden copy found: ${forbidden}`);
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (combined.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS lead to case flow');
