const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (p) => fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p), 'utf8') : '';

test('Stage124A keeps API list endpoints on explicit ListDTO selects', () => {
  const leads = read('api/leads.ts');
  const clients = read('api/clients.ts');
  const cases = read('api/cases.ts');
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(leads, /LEAD_LIST_SELECT_STAGE124/);
  assert.match(clients, /CLIENT_LIST_SELECT_STAGE124/);
  assert.match(cases, /CASE_LIST_SELECT_STAGE124/);
  assert.match(leads, /LEAD_DETAIL_SELECT_STAGE124\s*=\s*'\*'/);
  assert.match(clients, /CLIENT_DETAIL_SELECT_STAGE124\s*=\s*'\*'/);
  assert.match(cases, /CASE_DETAIL_SELECT_STAGE124\s*=\s*'\*'/);
  assert.doesNotMatch(leads, /leads\?select=\*[^`'\"]*limit=300/);
  assert.doesNotMatch(clients, /clients\?select=\*[^`'\"]*limit=300/);
  assert.doesNotMatch(cases, /cases\?select=\*[^`'\"]*limit=250/);
  assert.match(fallback, /API_GET_CACHE_TTL_MS\s*=\s*30_000/);
});
