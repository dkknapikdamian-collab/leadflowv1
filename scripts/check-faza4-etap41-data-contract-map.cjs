#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

function readRequired(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    results.push({ level: 'FAIL', scope: relativePath, message: 'Missing file' });
    return '';
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
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
  dataContract: 'src/lib/data-contract.ts',
  releaseDoc: 'docs/release/FAZA4_ETAP41_DATA_CONTRACT_MAP_2026-05-03.md',
  technicalDoc: 'docs/technical/DATA_CONTRACT_MAP_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const dataContract = readRequired(files.dataContract);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Runtime data contract map');
assertIncludes(files.dataContract, dataContract, 'export const DATA_CONTRACT_FIELD_MAP', 'Runtime DATA_CONTRACT_FIELD_MAP exists');
assertIncludes(files.dataContract, dataContract, 'export type DataContractEntity', 'DataContractEntity type exists');

for (const entity of ['leads', 'clients', 'cases', 'tasks', 'events', 'ai_drafts', 'activities', 'workspaces']) {
  assertRegex(files.dataContract, dataContract, new RegExp('\\b' + entity + '\\s*:\\s*\\{'), 'Map contains entity: ' + entity);
  assertIncludes(files.technicalDoc, technicalDoc, entity, 'Technical doc contains entity: ' + entity);
}

const canonicalMarkers = [
  'workspaceId',
  'clientId',
  'leadId',
  'caseId',
  'scheduledAt',
  'startAt',
  'endAt',
  'reminderAt',
  'recurrenceRule',
  'rawText',
  'parsedDraft',
  'actorType',
  'eventType',
  'planId',
  'subscriptionStatus',
  'accessStatus',
];

for (const marker of canonicalMarkers) {
  assertIncludes(files.dataContract, dataContract, marker, 'Runtime map or DTO contains canonical field: ' + marker);
}

const legacyMarkers = [
  'workspace_id',
  'client_id',
  'lead_id',
  'case_id',
  'scheduled_at',
  'due_at',
  'start_at',
  'end_at',
  'reminder_at',
  'recurrence_rule',
  'raw_text',
  'parsed_draft',
  'actor_type',
  'event_type',
  'plan_id',
  'subscription_status',
  'access_status',
];

for (const marker of legacyMarkers) {
  assertIncludes(files.dataContract, dataContract, marker, 'Runtime map contains legacy alias: ' + marker);
}

section('Workspace DTO and normalizer');
assertIncludes(files.dataContract, dataContract, 'export type WorkspaceDto', 'WorkspaceDto exists');
assertIncludes(files.dataContract, dataContract, 'export type NormalizedWorkspaceRecord = WorkspaceDto', 'NormalizedWorkspaceRecord exists');
assertIncludes(files.dataContract, dataContract, 'export function normalizeWorkspaceContract', 'normalizeWorkspaceContract exists');
assertIncludes(files.dataContract, dataContract, 'export function normalizeWorkspaceListContract', 'normalizeWorkspaceListContract exists');
assertIncludes(files.dataContract, dataContract, "ownerId: pickOptionalText(row, ['ownerId', 'owner_id', 'userId', 'user_id'])", 'Workspace owner aliases are normalized');
assertIncludes(files.dataContract, dataContract, "planId: pickText(row, ['planId', 'plan_id', 'plan'], 'free')", 'Workspace plan aliases are normalized');

section('Documentation');
for (const marker of [
  'FAZA 4 - Etap 4.1 - Data contract map',
  'DATA_CONTRACT_FIELD_MAP',
  'leads',
  'clients',
  'cases',
  'tasks',
  'events',
  'ai_drafts',
  'activities',
  'workspaces',
  'FAZA 4 - Etap 4.2 - Normalizacja task\u00F3w i event\u00F3w',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'DATA CONTRACT MAP 2026-05-03',
  'src/lib/data-contract.ts',
  'Legacy aliases are allowed only inside normalizers and this map',
  'normalizeWorkspaceContract',
  'FAZA 4 - Etap 4.2 - Normalizacja task\u00F3w i event\u00F3w',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza4-etap41-data-contract-map'] === 'node scripts/check-faza4-etap41-data-contract-map.cjs') pass(files.pkg, 'check:faza4-etap41-data-contract-map is wired');
else fail(files.pkg, 'missing check:faza4-etap41-data-contract-map');
if (scripts['test:faza4-etap41-data-contract-map'] === 'node --test tests/faza4-etap41-data-contract-map.test.cjs') pass(files.pkg, 'test:faza4-etap41-data-contract-map is wired');
else fail(files.pkg, 'missing test:faza4-etap41-data-contract-map');
assertIncludes(files.quiet, quiet, 'tests/faza4-etap41-data-contract-map.test.cjs', 'Quiet release gate includes Faza4 Etap4.1 test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 4 - Etap 4.1 data contract map guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 4 - Etap 4.1 data contract map guard');
