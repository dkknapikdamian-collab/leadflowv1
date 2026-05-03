const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Stage03A API/Supabase schema contract is documented and wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md');
  const check = read('scripts/check-stage03a-api-schema-contract.cjs');

  assert.equal(pkg.scripts['check:stage03a-api-schema-contract'], 'node scripts/check-stage03a-api-schema-contract.cjs');
  assert.equal(pkg.scripts['test:stage03a-api-schema-contract'], 'node --test tests/stage03a-api-schema-contract.test.cjs');
  assert.match(quiet, /tests\/stage03a-api-schema-contract\.test\.cjs/);

  assert.match(doc, /Stage03A API\/Supabase schema contract map/);
  assert.match(doc, /Canonical JSON DTO contract/);
  assert.match(doc, /LeadDto/);
  assert.match(doc, /TaskDto/);
  assert.match(doc, /EventDto/);
  assert.match(doc, /CaseDto/);
  assert.match(doc, /ActivityDto/);
  assert.match(doc, /DO NOT after this stage/);
  assert.match(doc, /Stage03B target/);
  assert.match(check, /PASS Stage03A API\/Supabase schema contract guard/);
});

test('Stage03A keeps compatibility mapping isolated in data-contract helpers', () => {
  const dataContract = read('src/lib/data-contract.ts');
  const leadsApi = read('api/leads.ts');
  const systemApi = read('api/system.ts');

  for (const normalizer of [
    'normalizeLeadContract',
    'normalizeTaskContract',
    'normalizeEventContract',
    'normalizeCaseContract',
    'normalizeActivityContract',
  ]) {
    assert.match(dataContract, new RegExp('export\\s+function\\s+' + normalizer + '\\s*\\('));
  }

  assert.match(leadsApi, /normalizeLeadContract/);
  assert.match(leadsApi, /OPTIONAL_LEAD_COLUMNS/);
  assert.match(leadsApi, /LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED/);
  assert.match(systemApi, /async\s+function\s+safeInsert\s*\(/);
  assert.match(systemApi, /async\s+function\s+safeUpdateById\s*\(/);
  assert.match(systemApi, /async\s+function\s+safeUpdateWhere\s*\(/);
});
