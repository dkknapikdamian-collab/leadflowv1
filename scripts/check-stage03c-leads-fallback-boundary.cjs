#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

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

function assertNotRegex(scope, content, regex, message) {
  if (!regex.test(content)) pass(scope, message || 'Forbidden pattern absent: ' + regex);
  else fail(scope, (message || 'Forbidden pattern found: ' + regex) + ' [regex=' + regex + ']');
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

function getFunctionBlock(content, functionName) {
  const start = content.indexOf('async function ' + functionName);
  if (start < 0) return '';
  const next = content.indexOf('\nasync function ', start + 10);
  if (next < 0) return content.slice(start);
  return content.slice(start, next);
}

const files = {
  leadsApi: readRequired('api/leads.ts'),
  doc: readRequired('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md'),
  pkg: readRequired('package.json'),
  quiet: readRequired('scripts/closeflow-release-check-quiet.cjs'),
};

section('Stage03C documentation');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'Stage03C continues the Stage03B cleanup pattern', 'Doc explains Stage03C purpose');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS', 'Doc names the table boundary');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'OPTIONAL_LEAD_COLUMNS', 'Doc keeps lead optional set source of truth');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'OPTIONAL_CASE_COLUMNS', 'Doc keeps case optional set source of truth');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'OPTIONAL_ACTIVITY_COLUMNS', 'Doc keeps activity optional set source of truth');
assertIncludes('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md', files.doc, 'Next Stage03D candidate', 'Doc gives next cleanup target');

section('api/leads.ts fallback boundary');
assertIncludes('api/leads.ts', files.leadsApi, 'LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS', 'Lead API table-aware allowlist exists');
assertRegex('api/leads.ts', files.leadsApi, /leads:\s*OPTIONAL_LEAD_COLUMNS/, 'leads maps to OPTIONAL_LEAD_COLUMNS');
assertRegex('api/leads.ts', files.leadsApi, /cases:\s*OPTIONAL_CASE_COLUMNS/, 'cases maps to OPTIONAL_CASE_COLUMNS');
assertRegex('api/leads.ts', files.leadsApi, /activities:\s*OPTIONAL_ACTIVITY_COLUMNS/, 'activities maps to OPTIONAL_ACTIVITY_COLUMNS');
assertIncludes('api/leads.ts', files.leadsApi, 'shouldDropMissingColumnForLeadFallback', 'Lead fallback predicate exists');

for (const functionName of [
  'insertLeadWithSchemaFallback',
  'updateLeadWithSchemaFallback',
  'insertCaseWithSchemaFallback',
  'insertActivityWithSchemaFallback',
]) {
  const block = getFunctionBlock(files.leadsApi, functionName);
  assertIncludes('api/leads.ts', block, 'shouldDropMissingColumnForLeadFallback', functionName + ' uses shared fallback predicate');
  assertIncludes('api/leads.ts', block, 'currentPayload = omitMissingColumn(currentPayload, missingColumn);', functionName + ' still drops only after predicate');
}

for (const forbidden of [
  /!OPTIONAL_LEAD_COLUMNS\.has\(missingColumn\)/,
  /!OPTIONAL_CASE_COLUMNS\.has\(missingColumn\)/,
  /!OPTIONAL_ACTIVITY_COLUMNS\.has\(missingColumn\)/,
]) {
  assertNotRegex('api/leads.ts', files.leadsApi, forbidden, 'Old scattered optional-column check is removed');
}

section('Package and quiet gate');
const pkg = JSON.parse(files.pkg);
if (pkg.scripts && pkg.scripts['check:stage03c-leads-fallback-boundary'] === 'node scripts/check-stage03c-leads-fallback-boundary.cjs') {
  pass('package.json', 'check:stage03c-leads-fallback-boundary is wired');
} else {
  fail('package.json', 'Missing check:stage03c-leads-fallback-boundary script');
}
if (pkg.scripts && pkg.scripts['test:stage03c-leads-fallback-boundary'] === 'node --test tests/stage03c-leads-fallback-boundary.test.cjs') {
  pass('package.json', 'test:stage03c-leads-fallback-boundary is wired');
} else {
  fail('package.json', 'Missing test:stage03c-leads-fallback-boundary script');
}
assertIncludes('scripts/closeflow-release-check-quiet.cjs', files.quiet, 'tests/stage03c-leads-fallback-boundary.test.cjs', 'Quiet release gate includes Stage03C test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL Stage03C leads fallback boundary guard failed.');
  process.exit(1);
}
console.log('\nPASS Stage03C leads fallback boundary guard');
