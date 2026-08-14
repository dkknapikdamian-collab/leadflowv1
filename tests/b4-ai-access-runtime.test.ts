import assert from 'node:assert/strict';
import test from 'node:test';
import systemHandler from '../api/system.ts';

type ResponseState = { statusCode: number | null; payload: unknown; ended: boolean };

function responseRecorder() {
  const state: ResponseState = { statusCode: null, payload: null, ended: false };
  return {
    state,
    status(code: number) { state.statusCode = code; return this; },
    json(payload: unknown) { state.payload = payload; return this; },
    setHeader() { return this; },
    end(payload?: string) { state.ended = true; if (payload) state.payload = JSON.parse(payload); return this; },
  };
}

function request(body: Record<string, unknown>, workspaceId = 'workspace-a') {
  return {
    method: 'POST',
    query: { kind: body.kind || 'ai-next-action' },
    headers: {},
    body,
    __closeflowSupabaseRequestContext: {
      userId: 'user-a',
      uid: 'user-a',
      email: 'user-a@example.com',
      fullName: null,
      workspaceId,
      emailConfirmedAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      authProvider: 'email',
      authProviders: ['email'],
      rawUser: {
        sub: 'user-a',
        email: 'user-a@example.com',
        email_confirmed_at: '2026-01-01T00:00:00.000Z',
        app_metadata: { workspace_id: workspaceId },
      },
    },
  };
}

function aiBody() {
  return {
    kind: 'ai-next-action',
    lead: { name: 'Marek', company: 'Acme' },
    tasks: [],
    events: [],
    activities: [],
  };
}

function installFetch(input: {
  workspace?: Record<string, unknown>;
  usage?: Record<string, unknown>;
}) {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://b4-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b4-service-key';
  process.env.AI_ENABLED = 'true';
  process.env.GEMINI_API_KEY = 'b4-gemini-key';
  process.env.GEMINI_MODEL = 'gemini-b4-test';
  process.env.AI_PRIMARY_PROVIDER = 'gemini';
  const providerCalls: string[] = [];
  const rpcCalls: unknown[] = [];
  globalThis.fetch = (async (inputUrl: URL | RequestInfo, init?: RequestInit) => {
    const url = String(inputUrl);
    if (url.includes('generativelanguage.googleapis.com')) {
      providerCalls.push(url);
      return {
        ok: true,
        async json() {
          return { candidates: [{ content: { parts: [{ text: JSON.stringify({ suggestion: { kind: 'status_check', title: 'Sprawdź status', summary: 'S', reason: 'R', priority: 'medium', dueAt: '', suggestedTask: { title: '', type: 'follow_up', priority: 'medium', dueAt: '' }, messageHint: '', warnings: [], sourceSummary: [] } }) }] } }] };
        },
      } as Response;
    }
    if (url.includes('/rest/v1/rpc/consume_ai_usage')) {
      rpcCalls.push(JSON.parse(String(init?.body || '{}')));
      return { ok: true, async text() { return JSON.stringify([input.usage || { allowed: true, reason: 'allowed' }]); } } as Response;
    }
    if (url.includes('/rest/v1/workspaces?select=*&id=eq.')) {
      return { ok: true, async text() { return JSON.stringify([input.workspace || { id: 'workspace-a', plan_id: 'ai', subscription_status: 'paid_active' }]); } } as Response;
    }
    if (url.includes('/rest/v1/workspace_members?') || url.includes('/rest/v1/profiles?')) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    throw new Error(`unexpected B4 request: ${url} ${init?.method || 'GET'}`);
  }) as typeof fetch;
  return { previousFetch, previousEnv, providerCalls, rpcCalls };
}

function restore(previousFetch: typeof fetch, previousEnv: NodeJS.ProcessEnv) {
  globalThis.fetch = previousFetch;
  for (const key of Object.keys(process.env)) {
    if (!(key in previousEnv)) delete process.env[key];
  }
  Object.assign(process.env, previousEnv);
}

test('B4 unauthenticated AI request is denied before provider execution', async () => {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  let providerCalls = 0;
  globalThis.fetch = (async (input: URL | RequestInfo) => {
    if (String(input).includes('generativelanguage.googleapis.com')) providerCalls += 1;
    throw new Error('provider must not be called');
  }) as typeof fetch;
  try {
    const response = responseRecorder();
    await systemHandler({ method: 'POST', query: { kind: 'ai-next-action' }, headers: {}, body: aiBody() }, response);
    assert.equal(response.state.statusCode, 401);
    assert.equal(providerCalls, 0);
  } finally {
    restore(previousFetch, previousEnv);
  }
});

test('B4 free workspace is denied before provider execution', async () => {
  const fixture = installFetch({ workspace: { id: 'workspace-a', plan_id: 'free', subscription_status: 'free_active' } });
  try {
    const response = responseRecorder();
    await systemHandler(request(aiBody()), response);
    assert.equal(response.state.statusCode, 402);
    assert.equal(fixture.providerCalls.length, 0);
    assert.equal(fixture.rpcCalls.length, 0);
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});

test('B4 server usage/rate denial is fail-closed before provider execution', async () => {
  const fixture = installFetch({ usage: { allowed: false, reason: 'rate_limit' } });
  try {
    const response = responseRecorder();
    await systemHandler(request(aiBody()), response);
    assert.equal(response.state.statusCode, 429);
    assert.deepEqual(response.state.payload, { error: 'AI_RATE_LIMIT_REACHED' });
    assert.equal(fixture.rpcCalls.length, 1);
    assert.equal(fixture.providerCalls.length, 0);
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});

test('B4 allowed AI request consumes server usage before provider and reaches canonical adapter', async () => {
  const fixture = installFetch({ usage: { allowed: true, reason: 'allowed' } });
  try {
    const response = responseRecorder();
    await systemHandler(request(aiBody()), response);
    assert.equal(response.state.statusCode, 200);
    assert.equal(fixture.rpcCalls.length, 1);
    assert.equal(fixture.providerCalls.length, 1);
    assert.equal((response.state.payload as Record<string, unknown>)?.provider, 'gemini');
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});

test('B4 oversized AI input is rejected before any provider or usage call', async () => {
  const fixture = installFetch({});
  try {
    const response = responseRecorder();
    await systemHandler(request({ ...aiBody(), query: 'x'.repeat(4001) }), response);
    assert.equal(response.state.statusCode, 413);
    assert.equal(fixture.rpcCalls.length, 0);
    assert.equal(fixture.providerCalls.length, 0);
  } finally {
    restore(fixture.previousFetch, fixture.previousEnv);
  }
});
