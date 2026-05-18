const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/ClientDetail.tsx'), 'utf8');
const releaseGate = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');

test('ClientDetail keeps final four-tab operating model', () => {
  assert.ok(source.includes('CLIENT_DETAIL_FINAL_OPERATING_MODEL_V83'));
  assert.ok(source.includes('Kartoteka') || source.includes('Dane klienta'));
  assert.ok(source.includes('Relacje'));
  assert.ok(source.includes('Historia'));
  assert.ok(source.includes('Dodatkowe'));
});

test('ClientDetail leaves process work in case, not in a client-side lead cockpit', () => {
  assert.ok(source.includes('CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD'));
  assert.ok(source.includes('Praca dzieje si\u0119 w sprawie'));
  assert.ok(source.includes('Otw\u00F3rz spraw\u0119') || source.includes('Otwórz sprawę'));
  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));
  assert.ok(!source.includes('Otw\u00F3rz lead'));
  assert.ok(!source.includes('Otwórz lead'));
  assert.ok(!source.includes('navigate(`/leads/${'));
});
test('ClientDetail exposes secondary more menu without turning it into main workflow', () => {
  assert.ok(source.includes('client-detail-more-menu'));
  assert.ok(source.includes('Dodatkowe'));
  assert.ok(source.includes('Drugorz\u0119dne akcje') || source.includes('drugorz\u0119dne akcje') || source.includes('menu pomocnicze'));
});

test('ClientDetail keeps acquisition history as a read-only signal', () => {
  assert.ok(source.includes('Historia pozyskania'));
  assert.ok(source.includes('data-client-source-history-readonly'));
  assert.ok(source.includes('fetchLeadsFromSupabase({ clientId })'));
  assert.ok(!source.includes('data-client-acquisition-history-row'));
});
test('ClientDetail final operating model test is included in quiet release gate', () => {
  assert.ok(releaseGate.includes('tests/client-detail-final-operating-model.test.cjs'));
});
