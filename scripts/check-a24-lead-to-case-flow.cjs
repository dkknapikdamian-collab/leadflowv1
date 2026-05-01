#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const apiLeads = read('api/leads.ts');
const leadService = read('src/server/_lead-service.ts');
const leadDetail = read('src/pages/LeadDetail.tsx');
const indexCss = read('src/index.css');
const migration = 'supabase/migrations/2026-05-01_stageA24_lead_to_case_service_rpc.sql';

expect(exists('docs/STAGE_A24_LEAD_TO_CASE_FLOW.md'), 'missing A24 stage doc');
expect(exists('docs/LEAD_CLIENT_CASE_FLOW.md'), 'missing lead/client/case flow doc');
expect(exists(migration), 'missing A24 Supabase RPC migration');
expect(exists('src/styles/stageA24-today-relations-label-align.css'), 'missing A24 Today relations CSS');
expect(indexCss.includes('stageA24-today-relations-label-align.css'), 'index.css must import A24 Today relations CSS');

expect(apiLeads.includes("action) === 'start_service'"), 'api/leads.ts must expose action=start_service');
expect(apiLeads.includes('buildLeadMovedToServicePayload'), 'api/leads.ts must use moved-to-service payload');
expect(apiLeads.includes('closeflow_start_lead_service'), 'api/leads.ts must attempt Supabase RPC handoff');
expect(apiLeads.includes('A24_DEFAULT_ACTIVE_LEADS_FILTER'), 'api/leads.ts must filter moved leads from default active list');
expect(apiLeads.includes('case_created'), 'api/leads.ts must write case_created activity');
expect(apiLeads.includes('lead_moved_to_service'), 'api/leads.ts must write lead_moved_to_service activity');

expect(leadService.includes("status: 'moved_to_service'"), '_lead-service must set moved_to_service');
expect(leadService.includes("lead_visibility: 'archived'"), '_lead-service must archive moved lead');
expect(leadService.includes("sales_outcome: 'moved_to_service'"), '_lead-service must set sales outcome');
expect(leadService.includes('next_action_at: null'), '_lead-service must clear next action');

expect(leadDetail.includes('startLeadToCaseHandoff'), 'LeadDetail must use lead-to-case handoff orchestrator');
expect(leadDetail.includes('isLeadMovedToService'), 'LeadDetail must detect moved lead');
expect(leadDetail.includes('startLeadServiceInSupabase'), 'LeadDetail must call backend start_service flow');
expect(
  leadDetail.includes('Rozpocznij obsługę') ||
  leadDetail.includes('Przekaż do obsługi') ||
  leadDetail.includes('startLeadToCaseHandoff'),
  'LeadDetail must expose start service action'
);
expect(
  leadDetail.includes('Ten temat jest już w obsłudze') ||
  leadDetail.includes('leadInService') ||
  leadDetail.includes('leadOperationalArchive'),
  'LeadDetail must show moved-to-service state'
);
expect(
  leadDetail.includes('Otwórz sprawę') ||
  leadDetail.includes('/case/${startServiceSuccess.caseId}') ||
  leadDetail.includes('serviceCaseId'),
  'LeadDetail must link moved lead to case'
);

if (exists(migration)) {
  const sql = read(migration);
  expect(sql.includes('create or replace function public.closeflow_start_lead_service'), 'A24 migration must define RPC function');
  expect(sql.includes('for update'), 'A24 RPC must lock lead row');
  expect(sql.includes('insert into public.clients'), 'A24 RPC must create client');
  expect(sql.includes('insert into public.cases'), 'A24 RPC must create case');
  expect(sql.includes("status = 'moved_to_service'"), 'A24 RPC must move lead to service');
  expect(sql.includes("lead_visibility = 'archived'"), 'A24 RPC must archive lead');
  expect(sql.includes("event_type") && sql.includes("lead_moved_to_service"), 'A24 RPC must write activity');
}

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a24-lead-to-case-flow'], 'package.json missing check:a24-lead-to-case-flow');

if (fail.length) {
  console.error('A24 lead -> client -> case guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A24 lead -> client -> case flow guard passed.');
