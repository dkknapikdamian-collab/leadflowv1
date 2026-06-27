const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('STAGE232C clients relation tile source of truth guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-stage232c-clients-relation-tile-source-of-truth.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /PASS/);
});

test('STAGE232C filters and commission source truth are statically guarded', () => {
  const clients = read('src/pages/Clients.tsx');

  assert.match(clients, /type ClientRelationFilterStage232C/);
  assert.match(clients, /'without_case'/);
  assert.match(clients, /'needs_contact'/);
  assert.match(clients, /'active_commission'/);
  assert.match(clients, /applyClientRelationFilterStage232C\('without_case'\)/);
  assert.match(clients, /clientRelationFilterStage232C === 'without_case'[\s\S]*?cases \|\| 0\) === 0/);
  assert.match(clients, /needsContactClientIdsStage232C[\s\S]*?contactCadenceGrid\.buckets\[key\]/);
  assert.doesNotMatch(clients, /staleClients\s*=\s*useMemo\(\s*\(\) => clients\.filter\(\(client\) => !client\.archivedAt && \(countersByClientId\.get\(client\.id\)\?\.leads \|\| 0\) === 0\)/);
  assert.match(clients, /activeCommissionValueStage232C[\s\S]*?activeCommission/);
  assert.doesNotMatch(clients, /label="Prowizja"[\s\S]*?relationValue/);
  assert.match(clients, /items=\{topClientCommissionEntriesStage232C\.map/);
  assert.doesNotMatch(clients, /items=\{topClientValueEntries\.map/);
  assert.doesNotMatch(clients, /SimpleFiltersCard[\s\S]*?onClick: \(\) => setShowArchived\(false\)/);
});
