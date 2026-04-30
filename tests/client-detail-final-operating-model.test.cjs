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

test('ClientDetail leaves process work in case or active lead, not in client cockpit', () => {
  assert.ok(source.includes('CLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD'));
  assert.ok(source.includes('Praca dzieje się w sprawie'));
  assert.ok(source.includes('Otwórz sprawę'));
  assert.ok(source.includes('Otwórz lead'));
});

test('ClientDetail exposes secondary more menu without turning it into main workflow', () => {
  assert.ok(source.includes('client-detail-more-menu'));
  assert.ok(source.includes('Dodatkowe'));
  assert.ok(source.includes('Drugorzędne akcje') || source.includes('drugorzędne akcje') || source.includes('menu pomocnicze'));
});

test('ClientDetail keeps source lead as history signal', () => {
  assert.ok(source.includes('Źródłowy lead') || source.includes('sourceLead'));
  assert.ok(source.includes('Historia'));
});

test('ClientDetail final operating model test is included in quiet release gate', () => {
  assert.ok(releaseGate.includes('tests/client-detail-final-operating-model.test.cjs'));
});
