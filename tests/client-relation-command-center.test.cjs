const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function assertIncludesOneOf(file, candidates, label) {
  assert.ok(candidates.some((candidate) => file.includes(candidate)), label + ': expected one of ' + candidates.join(' | '));
}

test('ClientDetail keeps API-level client filters', () => {
  const file = read('src/pages/ClientDetail.tsx');
  assert.ok(file.includes('fetchLeadsFromSupabase({ clientId })'));
  assert.ok(file.includes('fetchCasesFromSupabase({ clientId })'));
  assert.ok(file.includes('fetchPaymentsFromSupabase({ clientId })'));
});

test('ClientDetail exposes relation command center actions', () => {
  const file = read('src/pages/ClientDetail.tsx');
  assert.ok(file.includes('Klient jako centrum relacji'));
  assert.ok(file.includes('Ścieżka klienta'));
  assert.ok(file.includes('Otwórz lead'));
  assert.ok(file.includes('Otwórz sprawę'));
});

test('ClientDetail links leads and cases both ways from client screen', () => {
  const file = read('src/pages/ClientDetail.tsx');

  assertIncludesOneOf(file, [
    'navigate(`/leads/${String(lead.id)}`)',
    "navigate('/leads/' + String(lead.id))",
    "to={'/leads/' + leadId}",
  ], 'lead route');

  assertIncludesOneOf(file, [
    'navigate(`/cases/${String(caseRecord.id)}`)',
    "navigate('/cases/' + String(caseRecord.id))",
    "to={'/cases/' + caseId}",
  ], 'case route');

  assertIncludesOneOf(file, [
    'navigate(`/cases/${String(lead.linkedCaseId)}`)',
    "navigate('/cases/' + String(lead.linkedCaseId))",
  ], 'lead linked case route');

  assertIncludesOneOf(file, [
    'navigate(`/leads/${String(caseRecord.leadId)}`)',
    "navigate('/leads/' + String(caseRecord.leadId))",
  ], 'case linked lead route');

  assert.ok(!file.includes('navigate(`/case/${String(caseRecord.id)}`)'));
  assert.ok(!file.includes('navigate(`/case/${String(lead.linkedCaseId)}`)'));
});

test('Client relation command center documentation exists', () => {
  const file = read('docs/CLIENT_RELATION_COMMAND_CENTER_2026-04-24.md');
  assert.ok(file.includes('Lead -> Klient -> Sprawa -> Rozliczenia'));
  assert.ok(file.includes('Nie zmienia `/api/me`'));
});
