const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

test('leads API supports client scoped reads', () => {
  const api = read('api/leads.ts');
  assert.ok(api.includes('requestedClientId'));
  assert.ok(api.includes('client_id=eq.'));
  assert.ok(api.includes('lead_visibility=eq.'));
});

test('cases API supports client and lead scoped reads', () => {
  const api = read('api/cases.ts');
  assert.ok(api.includes('requestedClientId'));
  assert.ok(api.includes('requestedLeadId'));
  assert.ok(api.includes('client_id=eq.'));
  assert.ok(api.includes('lead_id=eq.'));
});

test('frontend fallback exposes filtered lead and case fetchers', () => {
  const lib = read('src/lib/supabase-fallback.ts');
  assert.ok(lib.includes('fetchLeadsFromSupabase(params?:'));
  assert.ok(lib.includes("query.set('clientId'"));
  assert.ok(lib.includes('fetchCasesFromSupabase(params?:'));
  assert.ok(lib.includes("query.set('leadId'"));
});

test('ClientDetail uses API-level clientId filters instead of fetching full workspace lists', () => {
  const page = read('src/pages/ClientDetail.tsx');
  assert.ok(page.includes('fetchLeadsFromSupabase({ clientId })'));
  assert.ok(page.includes('fetchCasesFromSupabase({ clientId })'));
  assert.equal(page.includes('filter((entry) => String(entry.clientId || \'\') === clientId)'), false);
});

test('lead client path documentation exists', () => {
  const doc = read('docs/LEAD_CLIENT_CASE_PATH_2026-04-24.md');
  assert.ok(doc.includes('Lead = temat do pozyskania'));
  assert.ok(doc.includes('Klient = osoba/firma w tle'));
  assert.ok(doc.includes('Sprawa = temat prowadzony operacyjnie'));
});
