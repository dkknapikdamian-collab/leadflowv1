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
function assertNotIncludes(scope, content, needle, message) {
  if (!content.includes(needle)) pass(scope, message || 'Not found: ' + needle);
  else fail(scope, (message || 'Forbidden: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}
function section(title) { console.log('\n== ' + title + ' =='); }

const files = {
  leads: 'api/leads.ts',
  releaseDoc: 'docs/release/FAZA3_ETAP32H_LEAD_LIMIT_PLACEMENT_HOTFIX_2026-05-03.md',
  technicalDoc: 'docs/technical/LEAD_LIMIT_PLACEMENT_HOTFIX_STAGE32H_2026-05-03.md',
  pkg: 'package.json',
  quiet: 'scripts/closeflow-release-check-quiet.cjs',
};

const leads = readRequired(files.leads);
const releaseDoc = readRequired(files.releaseDoc);
const technicalDoc = readRequired(files.technicalDoc);
const pkgRaw = readRequired(files.pkg);
const quiet = readRequired(files.quiet);

section('Lead limit placement');
const call = "assertWorkspaceEntityLimit(workspaceId, 'lead')";
const callOccurrences = leads.split(call).length - 1;
if (callOccurrences === 1) pass(files.leads, 'Exactly one lead limit call exists');
else fail(files.leads, 'Expected exactly one lead limit call, got ' + callOccurrences);

const awaitInsertRegex = /await\s+insertLeadWithSchemaFallback\(\s*payload\s*\)/g;
const inserts = [...leads.matchAll(awaitInsertRegex)];
if (inserts.length === 1) pass(files.leads, 'Exactly one normal insertLeadWithSchemaFallback(payload) call exists');
else fail(files.leads, 'Expected exactly one normal insertLeadWithSchemaFallback(payload) call, got ' + inserts.length);

const insertIndex = inserts[0]?.index ?? -1;
const callIndex = leads.indexOf(call);
if (insertIndex >= 0 && callIndex >= 0 && callIndex < insertIndex && insertIndex - callIndex < 2000) {
  pass(files.leads, 'Lead limit call is placed directly before normal lead insert path');
} else {
  fail(files.leads, 'Lead limit call is not near/before normal lead insert path');
}

const ensureStart = leads.indexOf('async function ensureClientForLead');
const startServiceStart = leads.indexOf('async function handleStartService');
const ensureBlock = ensureStart >= 0 && startServiceStart > ensureStart ? leads.slice(ensureStart, startServiceStart) : '';
assertNotIncludes(files.leads, ensureBlock, call, 'ensureClientForLead does not check active lead limit');

const handleStart = leads.indexOf('async function handleStartService');
const handlerStart = leads.indexOf('export default async function handler');
const handleBlock = handleStart >= 0 && handlerStart > handleStart ? leads.slice(handleStart, handlerStart) : '';
assertNotIncludes(files.leads, handleBlock, call, 'handleStartService does not check active lead limit');

section('Documentation');
for (const marker of [
  'FAZA 3 - Etap 3.2H - Lead limit placement hotfix v2',
  'ensureClientForLead',
  'insertLeadWithSchemaFallback',
  'FAZA 4 - Etap 4.1 - Data contract map',
]) {
  assertIncludes(files.releaseDoc, releaseDoc, marker, 'Release doc contains: ' + marker);
}
for (const marker of [
  'LEAD LIMIT PLACEMENT HOTFIX',
  'activeLeads',
  'insertLeadWithSchemaFallback',
  'ensureClientForLead',
]) {
  assertIncludes(files.technicalDoc, technicalDoc, marker, 'Technical doc contains: ' + marker);
}

section('Package and quiet gate');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); pass(files.pkg, 'package.json parses'); }
catch (error) { fail(files.pkg, 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error))); }
const scripts = pkg.scripts || {};
if (scripts['check:faza3-etap32h-lead-limit-placement-hotfix'] === 'node scripts/check-faza3-etap32h-lead-limit-placement-hotfix.cjs') pass(files.pkg, 'check:faza3-etap32h-lead-limit-placement-hotfix is wired');
else fail(files.pkg, 'missing check:faza3-etap32h-lead-limit-placement-hotfix');
if (scripts['test:faza3-etap32h-lead-limit-placement-hotfix'] === 'node --test tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs') pass(files.pkg, 'test:faza3-etap32h-lead-limit-placement-hotfix is wired');
else fail(files.pkg, 'missing test:faza3-etap32h-lead-limit-placement-hotfix');
assertIncludes(files.quiet, quiet, 'tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs', 'Quiet release gate includes Faza3 Etap3.2H test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL FAZA 3 - Etap 3.2H lead limit placement hotfix guard failed.');
  process.exit(1);
}
console.log('\nPASS FAZA 3 - Etap 3.2H lead limit placement hotfix guard');
