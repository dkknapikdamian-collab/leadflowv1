const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function getFunctionBlock(content, functionName) {
  const start = content.indexOf('async function ' + functionName);
  assert.notEqual(start, -1, functionName + ' not found');
  const next = content.indexOf('\nasync function ', start + 10);
  return next < 0 ? content.slice(start) : content.slice(start, next);
}

test('Stage03C leads fallback boundary is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/architecture/LEADS_SCHEMA_FALLBACK_BOUNDARY_STAGE03C.md');
  const guard = read('scripts/check-stage03c-leads-fallback-boundary.cjs');

  assert.equal(pkg.scripts['check:stage03c-leads-fallback-boundary'], 'node scripts/check-stage03c-leads-fallback-boundary.cjs');
  assert.equal(pkg.scripts['test:stage03c-leads-fallback-boundary'], 'node --test tests/stage03c-leads-fallback-boundary.test.cjs');
  assert.match(quiet, /tests\/stage03c-leads-fallback-boundary\.test\.cjs/);

  assert.match(doc, /Stage03C continues the Stage03B cleanup pattern/);
  assert.match(doc, /LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS/);
  assert.match(doc, /OPTIONAL_LEAD_COLUMNS/);
  assert.match(doc, /OPTIONAL_CASE_COLUMNS/);
  assert.match(doc, /OPTIONAL_ACTIVITY_COLUMNS/);
  assert.match(doc, /Next Stage03D candidate/);

  assert.match(guard, /PASS Stage03C leads fallback boundary guard/);
});

test('api/leads.ts fallback helpers use one table-aware boundary predicate', () => {
  const leadsApi = read('api/leads.ts');

  assert.match(leadsApi, /const\s+LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS\s*:\s*Record<'leads'\s*\|\s*'cases'\s*\|\s*'activities',\s*Set<string>>/);
  assert.match(leadsApi, /leads:\s*OPTIONAL_LEAD_COLUMNS/);
  assert.match(leadsApi, /cases:\s*OPTIONAL_CASE_COLUMNS/);
  assert.match(leadsApi, /activities:\s*OPTIONAL_ACTIVITY_COLUMNS/);
  assert.match(leadsApi, /function\s+shouldDropMissingColumnForLeadFallback\s*\(/);

  for (const functionName of [
    'insertLeadWithSchemaFallback',
    'updateLeadWithSchemaFallback',
    'insertCaseWithSchemaFallback',
    'insertActivityWithSchemaFallback',
  ]) {
    const block = getFunctionBlock(leadsApi, functionName);
    assert.match(block, /shouldDropMissingColumnForLeadFallback/);
    assert.match(block, /currentPayload = omitMissingColumn\(currentPayload, missingColumn\)/);
  }

  assert.doesNotMatch(leadsApi, /!OPTIONAL_LEAD_COLUMNS\.has\(missingColumn\)/);
  assert.doesNotMatch(leadsApi, /!OPTIONAL_CASE_COLUMNS\.has\(missingColumn\)/);
  assert.doesNotMatch(leadsApi, /!OPTIONAL_ACTIVITY_COLUMNS\.has\(missingColumn\)/);
});
