import assert from 'node:assert/strict';
import test from 'node:test';
import { assertDigestWorkspaceScope, isDigestCronAuthorized } from '../src/server/digest-authorization.ts';
import { RequestAuthError } from '../src/server/_supabase-auth.ts';
import dailyDigestHandler from '../src/server/daily-digest-handler.ts';
import weeklyReportHandler from '../src/server/weekly-report-handler.ts';

const workspaceA = {
  id: 'workspace-a',
  daily_digest_recipient_email: 'owner-a@example.com',
};

const workspaceB = {
  id: 'workspace-b',
  daily_digest_recipient_email: 'owner-b@example.com',
};

function expectAuthError(action: () => unknown, status: number, code: string) {
  assert.throws(action, (error: unknown) => {
    assert.ok(error instanceof RequestAuthError);
    assert.equal(error.status, status);
    assert.equal(error.code, code);
    return true;
  });
}

test('B1 rejects a workspace-B request made from authorized workspace A before provider use', () => {
  let providerCalls = 0;

  expectAuthError(
    () => {
      assertDigestWorkspaceScope({
        authorizedWorkspaceId: workspaceA.id,
        requestedWorkspaceId: workspaceB.id,
        workspaceRow: workspaceB,
        requestedRecipientEmail: 'attacker@example.com',
        requesterEmail: 'member-a@example.com',
      });
      providerCalls += 1;
    },
    403,
    'DIGEST_WORKSPACE_SCOPE_MISMATCH',
  );

  assert.equal(providerCalls, 0);
});

test('B1 rejects an attacker-selected recipient and never widens workspace policy', () => {
  expectAuthError(
    () => assertDigestWorkspaceScope({
      authorizedWorkspaceId: workspaceA.id,
      requestedWorkspaceId: workspaceA.id,
      workspaceRow: workspaceA,
      requestedRecipientEmail: 'attacker@example.com',
      requesterEmail: 'member-a@example.com',
    }),
    403,
    'DIGEST_RECIPIENT_SCOPE_MISMATCH',
  );

  const scoped = assertDigestWorkspaceScope({
    authorizedWorkspaceId: workspaceA.id,
    requestedWorkspaceId: workspaceA.id,
    workspaceRow: workspaceA,
    requestedRecipientEmail: 'OWNER-A@example.com',
    requesterEmail: 'member-a@example.com',
  });
  assert.equal(scoped.workspaceId, workspaceA.id);
  assert.equal(scoped.recipientEmail, 'owner-a@example.com');
});

test('B1 fail-closes missing workspace rows and missing cron secrets', () => {
  expectAuthError(
    () => assertDigestWorkspaceScope({
      authorizedWorkspaceId: workspaceA.id,
      requestedWorkspaceId: workspaceA.id,
      workspaceRow: null,
      requesterEmail: 'member-a@example.com',
    }),
    404,
    'DIGEST_WORKSPACE_NOT_FOUND',
  );

  const previousSecret = process.env.CRON_SECRET;
  delete process.env.CRON_SECRET;
  try {
    assert.equal(isDigestCronAuthorized({ headers: { 'x-vercel-cron': '1' } }), false);
    assert.equal(isDigestCronAuthorized({ headers: { 'x-cron-secret': 'wrong' } }), false);
  } finally {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
  }
});

test('B1 requires the configured secret even when the Vercel cron hint is present', () => {
  const previousSecret = process.env.CRON_SECRET;
  process.env.CRON_SECRET = 'b1-test-secret';
  try {
    assert.equal(isDigestCronAuthorized({ headers: { 'x-vercel-cron': '1' } }), false);
    assert.equal(isDigestCronAuthorized({ headers: { 'x-vercel-cron': '1', 'x-cron-secret': 'wrong' } }), false);
    assert.equal(isDigestCronAuthorized({ headers: { 'x-vercel-cron': '1', 'x-cron-secret': 'b1-test-secret' } }), true);
    assert.equal(isDigestCronAuthorized({ headers: { authorization: 'Bearer b1-test-secret' } }), true);
  } finally {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
  }
});

function responseRecorder() {
  const state: { statusCode: number | null; payload: unknown } = { statusCode: null, payload: null };
  return {
    state,
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      state.payload = payload;
      return this;
    },
  };
}

test('B1 unauthenticated daily and weekly self-tests make zero backend/provider calls', async () => {
  const previousFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    throw new Error('fetch must not run before interactive auth');
  }) as typeof fetch;

  try {
    const dailyResponse = responseRecorder();
    await dailyDigestHandler({
      method: 'POST',
      headers: { 'x-user-email': 'spoofed@example.com' },
      body: { mode: 'workspace-test', workspaceId: 'workspace-b', recipientEmail: 'attacker@example.com' },
    }, dailyResponse);

    const weeklyResponse = responseRecorder();
    await weeklyReportHandler({
      method: 'POST',
      query: { manual: 'true' },
      headers: { 'x-user-email': 'spoofed@example.com' },
      body: { mode: 'workspace-test', workspaceId: 'workspace-b', recipientEmail: 'attacker@example.com' },
    }, weeklyResponse);

    assert.equal(dailyResponse.state.statusCode, 401);
    assert.equal(weeklyResponse.state.statusCode, 401);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('B1 verified workspace A cannot target workspace B and never calls the provider', async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  process.env.SUPABASE_URL = 'https://b1-test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'b1-anon-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b1-service-key';

  const requestedUrls: string[] = [];
  const providerUrls: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo) => {
    const url = String(input);
    requestedUrls.push(url);
    if (url.startsWith('https://api.resend.com/')) {
      providerUrls.push(url);
      throw new Error('provider must not be called for a cross-tenant request');
    }
    if (url.endsWith('/auth/v1/user')) {
      return {
        ok: true,
        async json() {
          return { sub: 'user-a', email: 'member-a@example.com', app_metadata: { workspace_id: 'workspace-a' } };
        },
      } as Response;
    }
    if (url.includes('/rest/v1/workspaces?select=*&id=eq.workspace-a')) {
      return {
        ok: true,
        async text() {
          return JSON.stringify([workspaceA]);
        },
      } as Response;
    }
    throw new Error(`unexpected request: ${url}`);
  }) as typeof fetch;

  try {
    const request = {
      method: 'POST',
      headers: { authorization: 'Bearer verified-user-a', 'x-workspace-id': 'workspace-a' },
      body: { mode: 'workspace-test', workspaceId: 'workspace-b', recipientEmail: 'owner-b@example.com' },
    };
    const dailyResponse = responseRecorder();
    await dailyDigestHandler(request, dailyResponse);
    const weeklyResponse = responseRecorder();
    await weeklyReportHandler(request, weeklyResponse);

    const recipientTamperRequest = {
      method: 'POST',
      headers: { authorization: 'Bearer verified-user-a', 'x-workspace-id': 'workspace-a' },
      body: { mode: 'workspace-test', workspaceId: 'workspace-a', recipientEmail: 'attacker@example.com' },
    };
    const dailyRecipientResponse = responseRecorder();
    await dailyDigestHandler(recipientTamperRequest, dailyRecipientResponse);
    const weeklyRecipientResponse = responseRecorder();
    await weeklyReportHandler(recipientTamperRequest, weeklyRecipientResponse);

    assert.equal(dailyResponse.state.statusCode, 403);
    assert.equal(weeklyResponse.state.statusCode, 403);
    assert.equal(dailyRecipientResponse.state.statusCode, 403);
    assert.equal(weeklyRecipientResponse.state.statusCode, 403);
    assert.equal(providerUrls.length, 0);
    assert.ok(requestedUrls.every((url) => !url.includes('workspace-b')));
  } finally {
    globalThis.fetch = previousFetch;
    if (previousEnv.supabaseUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousEnv.supabaseUrl;
    if (previousEnv.supabaseAnonKey === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = previousEnv.supabaseAnonKey;
    if (previousEnv.serviceRole === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousEnv.serviceRole;
  }
});
