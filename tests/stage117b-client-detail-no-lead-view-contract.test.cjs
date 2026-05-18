const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Stage117B ClientDetail does not render a lead cockpit', () => {
  const source = read('src/pages/ClientDetail.tsx');
  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));
  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'), 'lead data may remain as acquisition/source data');
  assert.ok(source.includes('fetchCasesFromSupabase({ clientId })'), 'cases remain the primary client work surface');
  assert.ok(source.includes('data-client-cases-without-lead-view="true"'));
  assert.ok(source.includes('Historia pozyskania'));
  for (const forbidden of [
    'Otwórz lead',
    'navigate(`/leads/${',
    'openNewLeadForExistingClient',
    'data-client-acquisition-history-row',
    'client-detail-relations-list-acquisition-only',
    'Lead powiązany z klientem.',
    "kind: 'lead'",
    'leada ani sprawy',
  ]) {
    assert.equal(source.includes(forbidden), false, 'forbidden active lead UI remains: ' + forbidden);
  }
});

test('Stage117B ClientDetail keeps case-first actions', () => {
  const source = read('src/pages/ClientDetail.tsx');
  assert.ok(source.includes('Otwórz sprawę'));
  assert.ok(source.includes('Wejdź w sprawę'));
  assert.ok(source.includes('Nowa sprawa dla klienta'));
});

test('Stage117B release gate includes client no-lead-view guard', () => {
  const releaseGate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(releaseGate.includes('tests/stage117b-client-detail-no-lead-view-contract.test.cjs'));
});
