import assert from 'node:assert/strict';
import test from 'node:test';
import systemHandler from '../api/system.ts';

type ResponseState = { statusCode: number | null; payload: unknown };
type Fixture = {
  previousFetch: typeof fetch;
  previousEnv: NodeJS.ProcessEnv;
  calls: Array<{ url: string; method: string; body?: string }>;
};

const workspaceId = 'workspace-a';
const ticketId = 'ticket-a';

function responseRecorder() {
  const state: ResponseState = { statusCode: null, payload: null };
  return {
    state,
    status(code: number) { state.statusCode = code; return this; },
    json(payload: unknown) { state.payload = payload; return this; },
    setHeader() { return this; },
  };
}

function context(role: 'admin' | 'user' = 'user') {
  return {
    userId: 'verified-user',
    email: 'verified@example.com',
    fullName: 'Verified User',
    workspaceId,
    emailConfirmedAt: '2026-08-10T08:00:00.000Z',
    emailVerified: true,
    authProvider: 'email',
    authProviders: ['email'],
    rawUser: {
      sub: 'verified-user',
      email: 'verified@example.com',
      email_confirmed_at: '2026-08-10T08:00:00.000Z',
      app_metadata: role === 'admin' ? { role: 'admin', workspace_id: workspaceId } : { workspace_id: workspaceId },
    },
  };
}

function request(method: string, body: Record<string, unknown>, actor: 'admin' | 'user' = 'user', id = ticketId) {
  return {
    method,
    query: { kind: 'support', route: 'requests', includeAll: method === 'GET' ? '1' : undefined },
    headers: {},
    body,
    __closeflowSupabaseRequestContext: context(actor),
    __b5TicketId: id,
  } as any;
}

function ticket(overrides: Record<string, unknown> = {}) {
  return {
    id: ticketId,
    workspace_id: workspaceId,
    owner_id: 'verified-user',
    owner_email: 'verified@example.com',
    kind: 'problem',
    subject: 'Problem',
    message: 'Details',
    status: 'new',
    source: 'app',
    replies: [],
    ...overrides,
  };
}

function installFetch() : Fixture {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://b5-remediation.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b5-service-key';
  const calls: Fixture['calls'] = [];

  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    const method = String(init?.method || 'GET');
    const body = typeof init?.body === 'string' ? init.body : undefined;
    calls.push({ url, method, body });

    if (url.includes('/rest/v1/profiles?')) return { ok: true, async text() { return '[]'; } } as Response;
    if (url.includes('/rest/v1/support_requests?') && method === 'GET') {
      if (url.includes(`id=eq.${ticketId}`) && url.includes('workspace_id=eq.workspace-a')) {
        return { ok: true, async text() { return JSON.stringify([ticket()]); } } as Response;
      }
      if (url.includes('workspace_id=eq.other-workspace')) return { ok: true, async text() { return '[]'; } } as Response;
      return { ok: true, async text() { return JSON.stringify([ticket()]); } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_support_record_audit')) {
      return { ok: true, async text() { return 'null'; } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_support_create_request')) {
      const payload = JSON.parse(body || '{}');
      return { ok: true, async text() { return JSON.stringify([ticket({ owner_id: payload.p_owner_id, owner_email: payload.p_owner_email })]); } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_support_reply_request')) {
      const payload = JSON.parse(body || '{}');
      return { ok: true, async text() { return JSON.stringify([ticket({
        status: payload.p_actor_role === 'admin' ? 'answered' : 'in_progress',
        replies: [{ authorType: payload.p_actor_role, authorLabel: payload.p_actor_role === 'admin' ? 'Support' : 'Użytkownik', message: payload.p_message }],
      })]); } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_support_set_status')) {
      const payload = JSON.parse(body || '{}');
      return { ok: true, async text() { return JSON.stringify([ticket({ status: payload.p_to_status })]); } } as Response;
    }
    if (url === 'https://api.resend.com/emails' && method === 'POST') {
      return { ok: false, async text() { return 'provider-secret-error-details'; } } as Response;
    }
    throw new Error(`unexpected B5 request: ${url} ${method}`);
  }) as typeof fetch;

  return { previousFetch, previousEnv, calls };
}

function restore(fixture: Fixture) {
  globalThis.fetch = fixture.previousFetch;
  for (const key of Object.keys(process.env)) if (!(key in fixture.previousEnv)) delete process.env[key];
  Object.assign(process.env, fixture.previousEnv);
}

test('B5 member cannot elevate includeAll or close a ticket', async () => {
  const fixture = installFetch();
  try {
    const listResponse = responseRecorder();
    await systemHandler({ ...request('GET', {}, 'user'), query: { kind: 'support', route: 'requests', includeAll: '1' } }, listResponse);
    assert.equal(listResponse.state.statusCode, 403, JSON.stringify(listResponse.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('/rest/v1/support_requests?') && call.method === 'GET').length, 0);

    const statusResponse = responseRecorder();
    await systemHandler(request('PATCH', { id: ticketId, action: 'status', status: 'closed', actorType: 'admin', ownerId: 'attacker' }), statusResponse);
    assert.equal(statusResponse.state.statusCode, 403, JSON.stringify(statusResponse.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_support_set_status')).length, 0);
  } finally {
    restore(fixture);
  }
});

test('B5 unauthenticated support actions do not read, write, audit or call provider', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await systemHandler({ method: 'POST', query: { kind: 'support', route: 'forward' }, headers: {}, body: { subject: 'No auth', message: 'Blocked' } }, response);
    assert.equal(response.state.statusCode, 401, JSON.stringify(response.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('/rest/v1/') || call.url === 'https://api.resend.com/emails').length, 0);
  } finally {
    restore(fixture);
  }
});

test('B5 forged actor fields cannot turn a member reply into an admin reply', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await systemHandler(request('PATCH', { id: ticketId, action: 'reply', message: 'Member reply', actorType: 'admin', ownerId: 'attacker' }), response);
    assert.equal(response.state.statusCode, 200, JSON.stringify(response.state.payload));
    const rpcCall = fixture.calls.find((call) => call.url.includes('closeflow_support_reply_request'));
    assert.ok(rpcCall);
    const rpcPayload = JSON.parse(rpcCall.body || '{}');
    assert.equal(rpcPayload.p_actor_role, 'user');
    assert.equal(rpcPayload.p_actor_id, 'verified-user');
    assert.equal(rpcPayload.p_workspace_id, workspaceId);
    assert.equal(rpcPayload.p_message, 'Member reply');
  } finally {
    restore(fixture);
  }
});

test('B5 admin reply uses verified admin actor and server audit contract', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await systemHandler(request('PATCH', { id: ticketId, action: 'reply', message: 'Support reply', actorType: 'user' }, 'admin'), response);
    assert.equal(response.state.statusCode, 200, JSON.stringify(response.state.payload));
    const rpcCall = fixture.calls.find((call) => call.url.includes('closeflow_support_reply_request'));
    assert.ok(rpcCall);
    const rpcPayload = JSON.parse(rpcCall.body || '{}');
    assert.equal(rpcPayload.p_actor_role, 'admin');
    assert.equal(rpcPayload.p_actor_id, 'verified-user');
    assert.equal(rpcPayload.p_workspace_id, workspaceId);
    assert.equal(rpcPayload.p_message, 'Support reply');
  } finally {
    restore(fixture);
  }
});

test('B5 create ignores spoofed owner fields and sends verified identity to atomic RPC', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await systemHandler({ ...request('POST', { kind: 'problem', subject: 'New', message: 'Request', ownerId: 'attacker', ownerEmail: 'attacker@example.com', workspaceId: 'other-workspace' }), query: { kind: 'support', route: 'requests' } }, response);
    assert.equal(response.state.statusCode, 200, JSON.stringify(response.state.payload));
    const rpcCall = fixture.calls.find((call) => call.url.includes('closeflow_support_create_request'));
    assert.ok(rpcCall);
    const rpcPayload = JSON.parse(rpcCall.body || '{}');
    assert.equal(rpcPayload.p_owner_id, 'verified-user');
    assert.equal(rpcPayload.p_owner_email, 'verified@example.com');
    assert.equal(rpcPayload.p_workspace_id, workspaceId);
    assert.equal(rpcPayload.p_actor_id, 'verified-user');
    assert.equal(rpcPayload.p_actor_role, 'user');
  } finally {
    restore(fixture);
  }
});

test('B5 cross-workspace ticket is not mutated', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await systemHandler({ ...request('PATCH', { id: ticketId, action: 'reply', message: 'No access' }), __closeflowSupabaseRequestContext: { ...context('admin'), workspaceId: 'other-workspace', rawUser: context('admin').rawUser } }, response);
    assert.equal(response.state.statusCode, 404, JSON.stringify(response.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_support_reply_request')).length, 0);
  } finally {
    restore(fixture);
  }
});

test('B5 forward stamps verified actor and hides provider details', async () => {
  const fixture = installFetch();
  const previousEnv = { ...process.env };
  process.env.RESEND_API_KEY = 'resend-key';
  process.env.SUPPORT_FORWARD_EMAIL = 'support@example.com';
  try {
    const response = responseRecorder();
    await systemHandler({
      method: 'POST',
      query: { kind: 'support', route: 'forward' },
      headers: {},
      body: { kind: 'problem', subject: 'Forward', message: 'Body', ownerId: 'attacker', ownerEmail: 'attacker@example.com' },
      __closeflowSupabaseRequestContext: context('user'),
    }, response);
    assert.equal(response.state.statusCode, 200, JSON.stringify(response.state.payload));
    assert.deepEqual(response.state.payload, { forwarded: false, reason: 'EMAIL_PROVIDER_ERROR' });
    const auditCall = fixture.calls.find((call) => call.url.includes('closeflow_support_record_audit'));
    assert.ok(auditCall);
    const auditPayload = JSON.parse(auditCall.body || '{}');
    assert.equal(auditPayload.p_actor_id, 'verified-user');
    assert.equal(auditPayload.p_actor_role, 'user');
    const providerCall = fixture.calls.find((call) => call.url === 'https://api.resend.com/emails');
    assert.ok(providerCall);
    assert.match(providerCall.body || '', /verified@example\.com/);
    assert.doesNotMatch(providerCall.body || '', /attacker@example\.com/);
    assert.doesNotMatch(JSON.stringify(response.state.payload), /provider-secret-error-details/);
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in previousEnv)) delete process.env[key];
    Object.assign(process.env, previousEnv);
    restore(fixture);
  }
});
