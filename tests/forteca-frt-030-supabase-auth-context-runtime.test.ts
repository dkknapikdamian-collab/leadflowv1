import assert from 'node:assert/strict';
import test from 'node:test';
import { requireSupabaseRequestContext } from '../src/server/_supabase-auth.ts';

test('FRT-030 shared Supabase auth context accepts the canonical user id', async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_ANON_KEY;

  process.env.SUPABASE_URL = 'https://frt030-test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'frt030-anon-key';
  globalThis.fetch = (async (input: URL | RequestInfo) => {
    assert.equal(String(input), 'https://frt030-test.supabase.co/auth/v1/user');
    return {
      ok: true,
      async json() {
        return {
          id: '11111111-1111-4111-8111-111111111111',
          email: 'frt030@example.invalid',
          app_metadata: { workspace_id: '22222222-2222-4222-8222-222222222222' },
          user_metadata: { full_name: 'FRT-030 Test' },
        };
      },
    } as Response;
  }) as typeof fetch;

  try {
    const context = await requireSupabaseRequestContext({
      headers: { authorization: 'Bearer frt030-test-token' },
    });

    assert.equal(context.userId, '11111111-1111-4111-8111-111111111111');
    assert.equal(context.workspaceId, '22222222-2222-4222-8222-222222222222');
    assert.equal(context.fullName, 'FRT-030 Test');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = previousKey;
  }
});
