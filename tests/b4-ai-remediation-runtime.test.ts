import assert from 'node:assert/strict';
import test from 'node:test';
import systemHandler from '../api/system.ts';
import assistantContextHandler from '../src/server/assistant-context.ts';

type ResponseState = { statusCode: number | null; payload: unknown };

function responseRecorder() {
  const state: ResponseState = { statusCode: null, payload: null };
  return {
    state,
    status(code: number) { state.statusCode = code; return this; },
    json(payload: unknown) { state.payload = payload; return this; },
    setHeader() { return this; },
  };
}

function context() {
  return {
    userId: 'verified-user',
    email: 'verified@example.com',
    fullName: 'Verified User',
    workspaceId: 'workspace-a',
    emailConfirmedAt: '2026-08-10T08:00:00.000Z',
    emailVerified: true,
    authProvider: 'email',
    authProviders: ['email'],
    rawUser: { sub: 'verified-user', email: 'verified@example.com', email_confirmed_at: '2026-08-10T08:00:00.000Z', app_metadata: { role: 'admin', workspace_id: 'workspace-a' } },
  };
}

function request(body: Record<string, unknown>) {
  return {
    method: 'PATCH',
    query: { kind: 'ai-drafts' },
    headers: {},
    body,
    __closeflowSupabaseRequestContext: context(),
  };
}

function installDraftFetch(row: Record<string, unknown>) {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://b4-remediation.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b4-service-key';
  const calls: Array<{ url: string; method: string; body?: string }> = [];
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    const method = String(init?.method || 'GET');
    calls.push({ url, method, body: typeof init?.body === 'string' ? init.body : undefined });
    if (url.includes('/rest/v1/ai_drafts?') && method === 'GET') {
      return { ok: true, async text() { return JSON.stringify([row]); } } as Response;
    }
    if (url.includes('/rest/v1/workspaces?')) {
      return { ok: true, async text() { return JSON.stringify([{ id: 'workspace-a', plan_id: 'ai', subscription_status: 'paid_active' }]); } } as Response;
    }
    if (url.includes('/rest/v1/leads?ai_draft_id=')) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    if (url.includes('/rest/v1/leads') && method === 'POST') {
      return { ok: true, async text() { return JSON.stringify([{ id: 'lead-created', workspace_id: 'workspace-a' }]); } } as Response;
    }
    if (url.includes('/rest/v1/ai_draft_confirmation_claims') || url.includes('/rest/v1/work_items?ai_draft_id=')) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    if (url.includes('/rest/v1/ai_drafts?') && method === 'PATCH') {
      return { ok: true, async text() { return JSON.stringify([{ ...row, status: 'confirmed', linked_record_id: 'lead-created', linked_record_type: 'lead' }]); } } as Response;
    }
    if (url.includes('/rest/v1/rpc/claim_ai_draft_confirmation')) {
      return { ok: true, async text() { return 'true'; } } as Response;
    }
    if (url.includes('/rest/v1/rpc/release_ai_draft_confirmation')) {
      return { ok: true, async text() { return 'true'; } } as Response;
    }
    throw new Error(`unexpected B4 remediation request: ${url} ${method}`);
  }) as typeof fetch;
  return { previousFetch, previousEnv, calls };
}

function restore(previousFetch: typeof fetch, previousEnv: NodeJS.ProcessEnv) {
  globalThis.fetch = previousFetch;
  for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key];
  Object.assign(process.env, previousEnv);
}

test('B4 cancelled draft is rejected before any final record insert', async () => {
  const fixture = installDraftFetch({ id: '11111111-1111-4111-8111-111111111111', status: 'cancelled', workspace_id: 'workspace-a', parsed_data: { name: 'Nope' } });
  try {
    const response = responseRecorder();
    await systemHandler(request({ id: '11111111-1111-4111-8111-111111111111', action: 'confirm' }), response);
    assert.equal(response.state.statusCode, 409, JSON.stringify(response.state.payload));
    assert.equal(fixture.calls.filter((call) => call.method === 'POST' && call.url.includes('/rest/v1/leads')).length, 0);
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});

test('B4 active draft confirmation writes one server-authoritative lead and releases claim', async () => {
  const fixture = installDraftFetch({ id: '22222222-2222-4222-8222-222222222222', status: 'draft', workspace_id: 'workspace-a', expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), parsed_data: { name: 'Anna' } });
  try {
    const response = responseRecorder();
    await systemHandler(request({ id: '22222222-2222-4222-8222-222222222222', action: 'confirm', userId: 'attacker-user' }), response);
    assert.equal(response.state.statusCode, 200, JSON.stringify(response.state.payload));
    const leadPosts = fixture.calls.filter((call) => call.method === 'POST' && call.url.includes('/rest/v1/leads'));
    assert.equal(leadPosts.length, 1);
    assert.match(leadPosts[0].body || '', /ai_draft_id/);
    assert.ok(fixture.calls.some((call) => call.url.includes('/rest/v1/rpc/release_ai_draft_confirmation')));
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});

test('B4 assistant context ignores forged snapshot and never uses forwarded host', async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.CLOSEFLOW_APP_URL = 'https://trusted.closeflow.test';
  const urls: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo) => {
    urls.push(String(input));
    return { ok: true, async json() { return []; } } as Response;
  }) as typeof fetch;
  try {
    const response = responseRecorder();
    await assistantContextHandler({
      method: 'POST',
      headers: { 'x-forwarded-host': 'evil.example', authorization: 'Bearer secret' },
      body: { snapshot: { leads: [{ id: 'cross-workspace-forged' }] } },
    }, response);
    assert.equal(response.state.statusCode, 200);
    assert.ok(urls.length > 0);
    assert.ok(urls.every((url) => url.startsWith('https://trusted.closeflow.test/')));
    const snapshot = (response.state.payload as Record<string, unknown>).snapshot as Record<string, unknown>;
    assert.deepEqual(snapshot.leads, []);
  } finally {
    restore(previousFetch, previousEnv);
  }
});
