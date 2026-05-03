#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(relativePath, 'Missing required file: ' + relativePath);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function assertRegex(scope, content, regex, message) {
  if (regex.test(content)) pass(scope, message || 'Matched: ' + regex);
  else fail(scope, (message || 'Missing pattern: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  doc: readRequired('docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md'),
  dataContract: readRequired('src/lib/data-contract.ts'),
  leadsApi: readRequired('api/leads.ts'),
  systemApi: readRequired('api/system.ts'),
  pkg: readRequired('package.json'),
  quiet: readRequired('scripts/closeflow-release-check-quiet.cjs'),
};

section('Stage03A documentation');
for (const needle of [
  'Stage03A API/Supabase schema contract map',
  'Canonical JSON DTO contract',
  'Canonical write-side API rules',
  'Temporary fallbacks that still exist after Stage03A',
  'Stage03B target',
  'DO NOT after this stage',
  '`workspace_id` must come from request scope helpers',
]) {
  assertIncludes('docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md', files.doc, needle, 'Documentation contains: ' + needle);
}
for (const entity of ['LeadDto', 'TaskDto', 'EventDto', 'CaseDto', 'ActivityDto']) {
  assertIncludes('docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md', files.doc, entity, 'Documentation maps ' + entity);
}

section('data-contract.ts as frontend DTO source of truth');
const dtoChecks = [
  ['LeadDto', ['workspaceId', 'linkedCaseId', 'dealValue', 'nextActionAt', 'movedToServiceAt'], ['workspace_id', 'linked_case_id', 'value', 'next_action_at', 'moved_to_service_at']],
  ['TaskDto', ['workspaceId', 'scheduledAt', 'leadId', 'caseId', 'reminderAt', 'recurrenceRule'], ['workspace_id', 'scheduled_at', 'due_at', 'lead_id', 'case_id', 'reminder_at', 'recurrence_rule']],
  ['EventDto', ['workspaceId', 'startAt', 'endAt', 'leadId', 'caseId', 'reminderAt'], ['workspace_id', 'start_at', 'end_at', 'lead_id', 'case_id', 'reminder_at']],
  ['CaseDto', ['workspaceId', 'clientId', 'leadId', 'clientName', 'completenessPercent', 'portalReady'], ['workspace_id', 'client_id', 'lead_id', 'client_name', 'completeness_percent', 'portal_ready']],
  ['ActivityDto', ['workspaceId', 'caseId', 'leadId', 'clientId', 'actorType', 'eventType'], ['workspace_id', 'case_id', 'lead_id', 'client_id', 'actor_type', 'event_type']],
];

for (const [dtoName, frontendFields, backendAliases] of dtoChecks) {
  assertIncludes('src/lib/data-contract.ts', files.dataContract, 'export type ' + dtoName, dtoName + ' exists');
  for (const field of frontendFields) assertIncludes('src/lib/data-contract.ts', files.dataContract, field, dtoName + ' exposes ' + field);
  for (const alias of backendAliases) assertIncludes('src/lib/data-contract.ts', files.dataContract, alias, dtoName + ' maps backend alias ' + alias);
}
for (const normalizer of [
  'normalizeLeadContract',
  'normalizeTaskContract',
  'normalizeEventContract',
  'normalizeCaseContract',
  'normalizeActivityContract',
]) {
  assertRegex('src/lib/data-contract.ts', files.dataContract, new RegExp('export\\s+function\\s+' + normalizer + '\\s*\\('), normalizer + ' is exported');
}

section('API write/read contract guard surface');
assertIncludes('api/leads.ts', files.leadsApi, 'normalizeLeadContract', 'Leads API normalizes response through data contract');
assertIncludes('api/leads.ts', files.leadsApi, 'resolveRequestWorkspaceId', 'Leads API resolves workspace from request scope');
assertIncludes('api/leads.ts', files.leadsApi, 'requireScopedRow', 'Leads API requires scoped row before sensitive mutation');
assertIncludes('api/leads.ts', files.leadsApi, 'assertWorkspaceWriteAccess', 'Leads API uses central write access gate');
assertIncludes('api/leads.ts', files.leadsApi, 'OPTIONAL_LEAD_COLUMNS', 'Leads fallback columns are explicitly named');
assertIncludes('api/leads.ts', files.leadsApi, 'LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED', 'Lead insert fallback has named exhaustion error');
assertIncludes('api/leads.ts', files.leadsApi, 'LEAD_UPDATE_SCHEMA_FALLBACK_EXHAUSTED', 'Lead update fallback has named exhaustion error');
assertIncludes('api/leads.ts', files.leadsApi, 'CASE_INSERT_SCHEMA_FALLBACK_EXHAUSTED', 'Case insert fallback has named exhaustion error');
assertIncludes('api/leads.ts', files.leadsApi, 'ACTIVITY_INSERT_SCHEMA_FALLBACK_EXHAUSTED', 'Activity insert fallback has named exhaustion error');

section('Known Stage03B fallback debt is visible');
for (const fallbackName of ['safeInsert', 'safeUpdateById', 'safeUpdateWhere']) {
  assertRegex('api/system.ts', files.systemApi, new RegExp('async\\s+function\\s+' + fallbackName + '\\s*\\('), fallbackName + ' remains visible and tracked');
  assertIncludes('docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md', files.doc, fallbackName, fallbackName + ' is documented as Stage03B target');
}

section('Package and release wiring');
const pkg = JSON.parse(files.pkg);
if (pkg.scripts && pkg.scripts['check:stage03a-api-schema-contract'] === 'node scripts/check-stage03a-api-schema-contract.cjs') {
  pass('package.json', 'check:stage03a-api-schema-contract is wired');
} else {
  fail('package.json', 'Missing check:stage03a-api-schema-contract script');
}
if (pkg.scripts && pkg.scripts['test:stage03a-api-schema-contract'] === 'node --test tests/stage03a-api-schema-contract.test.cjs') {
  pass('package.json', 'test:stage03a-api-schema-contract is wired');
} else {
  fail('package.json', 'Missing test:stage03a-api-schema-contract script');
}
assertIncludes('scripts/closeflow-release-check-quiet.cjs', files.quiet, 'tests/stage03a-api-schema-contract.test.cjs', 'Quiet release gate includes Stage03A test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL Stage03A API/Supabase schema contract guard failed.');
  process.exit(1);
}
console.log('\nPASS Stage03A API/Supabase schema contract guard');
