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
  systemApi: readRequired('api/system.ts'),
  doc: readRequired('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md'),
  pkg: readRequired('package.json'),
  quiet: readRequired('scripts/closeflow-release-check-quiet.cjs'),
};

section('Stage03B documentation');
assertIncludes('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md', files.doc, 'Stage03B narrows the generic runtime schema fallback', 'Doc explains Stage03B purpose');
assertIncludes('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md', files.doc, 'SYSTEM_SCHEMA_FALLBACK_ALLOWED_COLUMNS', 'Doc names the allowlist');
assertIncludes('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md', files.doc, 'profiles', 'Doc mentions profiles fallback');
assertIncludes('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md', files.doc, 'workspaces', 'Doc mentions workspaces fallback');
assertIncludes('docs/architecture/SYSTEM_SCHEMA_FALLBACK_BOUNDARY_STAGE03B.md', files.doc, 'Next Stage03C candidate', 'Doc gives next cleanup target');

section('api/system.ts fallback boundary');
assertIncludes('api/system.ts', files.systemApi, 'SYSTEM_SCHEMA_FALLBACK_ALLOWED_COLUMNS', 'System fallback allowlist exists');
assertRegex('api/system.ts', files.systemApi, /profiles:\s*new Set\s*\(/, 'profiles allowlist exists');
assertRegex('api/system.ts', files.systemApi, /workspaces:\s*new Set\s*\(/, 'workspaces allowlist exists');
for (const column of [
  'firebase_uid',
  'auth_uid',
  'external_auth_uid',
  'workspace_id',
  'appearance_skin',
  'daily_digest_enabled',
  'daily_digest_hour',
  'daily_digest_timezone',
  'provider_subscription_id',
  'cancel_at_period_end',
]) {
  assertIncludes('api/system.ts', files.systemApi, "'" + column + "'", 'Allowlist includes ' + column);
}

assertIncludes('api/system.ts', files.systemApi, 'getSystemSchemaFallbackTableName', 'Fallback table parser exists');
assertIncludes('api/system.ts', files.systemApi, 'isSystemSchemaFallbackColumnAllowed', 'Fallback allowlist predicate exists');
assertIncludes('api/system.ts', files.systemApi, 'shouldDropMissingColumnForSystemFallback', 'Fallback drop predicate exists');

for (const functionName of ['safeUpdateById', 'safeUpdateWhere', 'safeInsert']) {
  const block = getFunctionBlock(files.systemApi, functionName);
  assertIncludes('api/system.ts', block, 'shouldDropMissingColumnForSystemFallback', functionName + ' checks allowlist before dropping a missing column');
  assertIncludes('api/system.ts', block, 'delete currentPayload[missingColumn as string]', functionName + ' still performs narrow compatibility drop');
}

assertNotRegex(
  'api/system.ts',
  files.systemApi,
  /if\s*\(\s*!missingColumn\s*\|\|\s*!\(\s*missingColumn\s+in\s+currentPayload\s*\)\s*\)\s*throw\s+error;\s*delete\s+currentPayload\[missingColumn\];/s,
  'Old generic missing-column fallback is removed from api/system.ts',
);

section('Package and quiet gate');
const pkg = JSON.parse(files.pkg);
if (pkg.scripts && pkg.scripts['check:stage03b-system-fallback-boundary'] === 'node scripts/check-stage03b-system-fallback-boundary.cjs') {
  pass('package.json', 'check:stage03b-system-fallback-boundary is wired');
} else {
  fail('package.json', 'Missing check:stage03b-system-fallback-boundary script');
}
if (pkg.scripts && pkg.scripts['test:stage03b-system-fallback-boundary'] === 'node --test tests/stage03b-system-fallback-boundary.test.cjs') {
  pass('package.json', 'test:stage03b-system-fallback-boundary is wired');
} else {
  fail('package.json', 'Missing test:stage03b-system-fallback-boundary script');
}
assertIncludes('scripts/closeflow-release-check-quiet.cjs', files.quiet, 'tests/stage03b-system-fallback-boundary.test.cjs', 'Quiet release gate includes Stage03B test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL Stage03B system fallback boundary guard failed.');
  process.exit(1);
}
console.log('\nPASS Stage03B system fallback boundary guard');
