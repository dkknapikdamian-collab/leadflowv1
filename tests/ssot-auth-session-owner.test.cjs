const test = require('node:test');
const assert = require('node:assert/strict');
const { assertClientAuthSnapshotCacheOnly, findAuthOwnerViolations } = require('../scripts/check-ssot-auth-session-owner.cjs');

test('canonical Supabase session adapter is accepted', () => {
  assert.deepEqual(findAuthOwnerViolations('fixture.ts', 'const token = await getSupabaseAccessToken();\nreturn fetch(url, { headers: { Authorization: `Bearer ${token}` } });'), []);
});

test('legacy Firebase/session header authority is rejected', () => {
  const violations = findAuthOwnerViolations('fixture.tsx', "import { auth } from '../firebase';\nconst id = auth.currentUser?.uid;\nheaders['x-firebase-uid'] = id;");
  assert.deepEqual(violations, [
    'fixture.tsx:firebase-auth-import',
    'fixture.tsx:firebase-current-user',
    'fixture.tsx:legacy-identity-header',
  ]);
});

test('client auth snapshot rejects request-auth transport', () => {
  assert.throws(
    () => assertClientAuthSnapshotCacheOnly({
      readFile: () => "export function getClientAuthSnapshot() { return fetch('/api/me', { headers: { Authorization: 'Bearer cached' } }); }",
    }),
    /CACHE_ONLY|must not perform request authentication/,
  );
});
