const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('Stage03D optional column evidence gate is wired', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const doc = read('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md');
  const guard = read('scripts/check-stage03d-optional-columns-evidence.cjs');

  assert.equal(pkg.scripts['check:stage03d-optional-columns-evidence'], 'node scripts/check-stage03d-optional-columns-evidence.cjs');
  assert.equal(pkg.scripts['test:stage03d-optional-columns-evidence'], 'node --test tests/stage03d-optional-columns-evidence.test.cjs');
  assert.match(quiet, /tests\/stage03d-optional-columns-evidence\.test\.cjs/);

  assert.match(doc, /DO NOT PROMOTE WITHOUT EVIDENCE/);
  assert.match(doc, /fallback_allowed_pending_migration_evidence/);
  assert.match(doc, /ready_to_remove_fallback/);
  assert.match(doc, /Next Stage03E candidate/);

  assert.match(guard, /PASS Stage03D optional columns evidence guard/);
  assert.match(guard, /extractSetColumns/);
  assert.match(guard, /parseEvidenceRows/);
});

test('Stage03D evidence document lists every optional fallback column from api/leads.ts', () => {
  const leadsApi = read('api/leads.ts');
  const doc = read('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md');

  const sets = [
    ['leads', 'OPTIONAL_LEAD_COLUMNS'],
    ['cases', 'OPTIONAL_CASE_COLUMNS'],
    ['activities', 'OPTIONAL_ACTIVITY_COLUMNS'],
  ];

  for (const [table, constName] of sets) {
    const match = leadsApi.match(new RegExp('const\\s+' + constName + '\\s*=\\s*new\\s+Set\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)', 'm'));
    assert.ok(match, constName + ' should be parseable');
    const columns = [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
    assert.ok(columns.length > 0, constName + ' should not be empty');

    for (const column of columns) {
      assert.match(
        doc,
        new RegExp('\\|\\s*' + table + '\\s*\\|\\s*`' + column.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`\\s*\\|'),
        table + '.' + column + ' should have evidence row',
      );
    }
  }
});
