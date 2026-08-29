const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const authSource = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'server', '_supabase-auth.ts'),
  'utf8',
);

test('FRT-030 auth context preserves canonical Supabase user id as actor id', () => {
  assert.match(
    authSource,
    /userId:\s*asText\(user\.user_id\s*\|\|\s*user\.id\s*\|\|\s*user\.sub\)/,
    'verified Supabase /auth/v1/user responses expose the canonical UUID as id',
  );
});
