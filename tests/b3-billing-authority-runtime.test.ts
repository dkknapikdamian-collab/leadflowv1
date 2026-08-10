import assert from 'node:assert/strict';
import test from 'node:test';
import checkoutHandler from '../src/server/billing-checkout-handler.ts';
import actionsHandler from '../src/server/billing-actions-handler.ts';
import { assertWorkspaceOwnerOrAdmin } from '../src/server/_request-scope.ts';
import crypto from 'node:crypto';
import webhookHandler from '../src/server/billing-webhook-handler.ts';

function responseRecorder() {
  const state: { statusCode: number | null; payload: unknown } = { statusCode: null, payload: null };
  return {
    state,
    status(code: number) { state.statusCode = code; return this; },
    json(payload: unknown) { state.payload = payload; return this; },
  };
}

function request(role?: string, body: Record<string, unknown> = { planKey: 'pro', billingPeriod: 'monthly' }) {
  return {
    method: 'POST',
    headers: {},
    body,
    __closeflowSupabaseRequestContext: {
      userId: 'user-a',
      uid: 'user-a',
      email: 'member-a@example.com',
      fullName: null,
      workspaceId: 'workspace-a',
      emailConfirmedAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      authProvider: 'email',
      authProviders: ['email'],
      rawUser: { sub: 'user-a', email: 'member-a@example.com', app_metadata: { workspace_id: 'workspace-a', ...(role ? { role } : {}) } },
    },
  };
}

function installFetch(membershipRole = 'member') {
  const previousFetch = globalThis.fetch;
  const previousEnv = {
    supabaseUrl: process.env.SUPABASE_URL,
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecret: process.env.STRIPE_SECRET_KEY,
  };
  process.env.SUPABASE_URL = 'https://b3-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b3-service-key';
  process.env.STRIPE_SECRET_KEY = 'sk_test_b3';
  const providerCalls: string[] = [];
  const supabaseCalls: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('https://api.stripe.com/')) providerCalls.push(url);
    if (url.includes('/rest/v1/')) supabaseCalls.push(url);
    if (url.includes('/rest/v1/workspaces?select=*&id=eq.workspace-a')) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    if (url.includes('/rest/v1/workspace_members?user_id=eq.user-a&workspace_id=eq.workspace-a')) {
      return { ok: true, async text() { return JSON.stringify([{ workspace_id: 'workspace-a', role: membershipRole }]); } } as Response;
    }
    if (url.includes('/rest/v1/profiles?')) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    throw new Error(`unexpected B3 request: ${url} ${init?.method || 'GET'}`);
  }) as typeof fetch;
  return { previousFetch, previousEnv, providerCalls, supabaseCalls };
}

function restore(previousEnv: { supabaseUrl?: string; serviceRole?: string; stripeSecret?: string }) {
  if (previousEnv.supabaseUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousEnv.supabaseUrl;
  if (previousEnv.serviceRole === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = previousEnv.serviceRole;
  if (previousEnv.stripeSecret === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = previousEnv.stripeSecret;
}

test('B3 member cannot create checkout or cancel/resume and makes zero Stripe calls', async () => {
  const { previousFetch, previousEnv, providerCalls, supabaseCalls } = installFetch();
  try {
    const checkoutResponse = responseRecorder();
    await checkoutHandler(request(), checkoutResponse);
    assert.equal(checkoutResponse.state.statusCode, 403);

    const actionResponse = responseRecorder();
    await actionsHandler({ ...request(), body: { action: 'cancel' } }, actionResponse);
    assert.equal(actionResponse.state.statusCode, 403);
    assert.equal(providerCalls.length, 0);
    assert.equal(supabaseCalls.filter((url) => url.includes('workspaces?') && url.includes('update')).length, 0);
  } finally {
    globalThis.fetch = previousFetch;
    restore(previousEnv);
  }
});

test('B3 owner/admin authority is accepted while workspace metadata alone is rejected', async () => {
  const { previousFetch, previousEnv, providerCalls } = installFetch();
  try {
    const ownerRequest = request();
    ownerRequest.__closeflowSupabaseRequestContext.rawUser.app_metadata = { workspace_id: 'workspace-a' };
    const ownerPromise = assertWorkspaceOwnerOrAdmin('workspace-a', ownerRequest);
    await assert.rejects(ownerPromise, /WORKSPACE_OWNER_OR_ADMIN_REQUIRED/);

    const adminRequest = request('admin');
    await assert.doesNotReject(() => assertWorkspaceOwnerOrAdmin('workspace-a', adminRequest));
    const dryRunResponse = responseRecorder();
    await checkoutHandler(request('admin', { planKey: 'pro', billingPeriod: 'monthly', dryRun: true }), dryRunResponse);
    assert.equal(dryRunResponse.state.statusCode, 200);
    assert.equal(providerCalls.length, 0);
  } finally {
    globalThis.fetch = previousFetch;
    restore(previousEnv);
  }

  const ownerFixture = installFetch('owner');
  try {
    await assert.doesNotReject(() => assertWorkspaceOwnerOrAdmin('workspace-a', request()));
    await assert.rejects(() => assertWorkspaceOwnerOrAdmin('workspace-b', request('owner')), /WORKSPACE_OWNER_OR_ADMIN_REQUIRED/);
  } finally {
    globalThis.fetch = ownerFixture.previousFetch;
    restore(ownerFixture.previousEnv);
  }
});

test('B3 duplicate webhook stops before fallback event table or workspace mutation', async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.SUPABASE_URL = 'https://b3-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b3-service-key';
  process.env.STRIPE_WEBHOOK_SECRET = 'b3-webhook-secret';
  const writes: string[] = [];
  const body = JSON.stringify({ id: 'evt_b3_duplicate', type: 'checkout.session.completed', data: { object: { metadata: { workspace_id: 'workspace-a' }, payment_status: 'paid' } } });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest('hex');
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rest/v1/')) {
      writes.push(`${init?.method || 'GET'} ${url}`);
      if (url.includes('/billing_events') && (init?.method || 'GET') === 'POST') {
        return { ok: false, status: 409, async text() { return '{"code":"23505"}'; } } as Response;
      }
      if (url.includes('/billing_events') && (init?.method || 'GET') === 'GET') {
        return { ok: true, async text() { return JSON.stringify([{ id: 'b3-event-row', processed_at: '2026-08-10T11:00:00.000Z', processing_status: 'processed' }]); } } as Response;
      }
      if (url.includes('/billing_webhook_events')) return { ok: true, async text() { return '[]'; } } as Response;
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    throw new Error(`unexpected B3 webhook provider call: ${url}`);
  }) as typeof fetch;
  const response = responseRecorder();
  const requestBody = {
    method: 'POST',
    headers: { 'stripe-signature': `t=${timestamp},v1=${signature}` },
    async *[Symbol.asyncIterator]() { yield body; },
  };
  try {
    await webhookHandler(requestBody, response);
    assert.equal(response.state.statusCode, 200);
    assert.deepEqual(response.state.payload, { ok: true, duplicate: true, eventId: 'evt_b3_duplicate', type: 'checkout.session.completed' });
    assert.equal(writes.filter((entry) => entry.includes('/billing_webhook_events')).length, 0);
    assert.equal(writes.filter((entry) => entry.includes('/workspaces?')).length, 0);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});

test('B3 owner action rejects a foreign Stripe subscription binding before provider mutation', async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousStripe = process.env.STRIPE_SECRET_KEY;
  process.env.SUPABASE_URL = 'https://b3-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b3-service-key';
  process.env.STRIPE_SECRET_KEY = 'sk_test_b3';
  const stripeMutations: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rest/v1/workspaces?id=eq.workspace-a')) {
      return { ok: true, async text() { return JSON.stringify([{ id: 'workspace-a', billing_provider: 'stripe_blik', provider_customer_id: 'cus-a', provider_subscription_id: 'sub-a', cancel_at_period_end: false }]); } } as Response;
    }
    if (url.includes('/api.stripe.com/v1/subscriptions/sub-a')) {
      if ((init?.method || 'GET') !== 'GET') stripeMutations.push(url);
      return { ok: true, async text() { return JSON.stringify({ id: 'sub-a', customer: 'cus-b', metadata: { workspace_id: 'workspace-b' }, status: 'active' }); } } as Response;
    }
    if (url.includes('/rest/v1/workspaces?') && init?.method === 'PATCH') {
      stripeMutations.push(`supabase ${url}`);
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    throw new Error(`unexpected B3 provider-binding request: ${url} ${init?.method || 'GET'}`);
  }) as typeof fetch;
  const response = responseRecorder();
  try {
    await actionsHandler({ ...request('admin'), body: { action: 'cancel' } }, response);
    assert.equal(response.state.statusCode, 409);
    assert.equal(stripeMutations.length, 0);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousStripe === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = previousStripe;
  }
});

test('B3 failed webhook processing is marked failed and can be reclaimed on retry', async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.SUPABASE_URL = 'https://b3-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b3-service-key';
  process.env.STRIPE_WEBHOOK_SECRET = 'b3-webhook-secret';
  const eventWrites: Array<Record<string, unknown>> = [];
  const workspaceWrites: string[] = [];
  let insertAttempts = 0;
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rest/v1/billing_events')) {
      const method = init?.method || 'GET';
      if (method === 'POST') {
        insertAttempts += 1;
        if (insertAttempts === 1) return { ok: true, async text() { return JSON.stringify([{ id: 'b3-retry-event' }]); } } as Response;
        return { ok: false, status: 409, async text() { return '{"code":"23505"}'; } } as Response;
      }
      if (method === 'GET') {
        return { ok: true, async text() { return JSON.stringify([{ id: 'b3-retry-event', processed_at: null, processing_status: 'failed', processing_started_at: '2026-08-10T10:00:00.000Z' }]); } } as Response;
      }
      if (method === 'PATCH') {
        eventWrites.push(JSON.parse(String(init?.body || '{}')) as Record<string, unknown>);
        return { ok: true, async text() { return JSON.stringify([{ id: 'b3-retry-event' }]); } } as Response;
      }
    }
    if (url.includes('/rest/v1/workspaces?') && init?.method === 'PATCH') {
      workspaceWrites.push(url);
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    throw new Error(`unexpected B3 retry request: ${url} ${init?.method || 'GET'}`);
  }) as typeof fetch;

  const body = JSON.stringify({
    id: 'evt_b3_retryable_failure',
    type: 'checkout.session.completed',
    data: { object: { metadata: { workspace_id: 'workspace-a' } } },
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest('hex');
  const makeRequest = () => ({
    method: 'POST',
    headers: { 'stripe-signature': `t=${timestamp},v1=${signature}` },
    async *[Symbol.asyncIterator]() { yield body; },
  });
  try {
    const firstResponse = responseRecorder();
    await webhookHandler(makeRequest(), firstResponse);
    assert.equal(firstResponse.state.statusCode, 500);

    const secondResponse = responseRecorder();
    await webhookHandler(makeRequest(), secondResponse);
    assert.equal(secondResponse.state.statusCode, 500);
    assert.equal(insertAttempts, 2);
    assert.equal(eventWrites.filter((payload) => payload.processing_status === 'failed').length, 2);
    assert.equal(eventWrites.filter((payload) => payload.processing_status === 'processing').length, 1);
    assert.equal(workspaceWrites.length, 0);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});

test('B3 successful webhook is marked processed and stale signatures are rejected before storage', async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.SUPABASE_URL = 'https://b3-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b3-service-key';
  process.env.STRIPE_WEBHOOK_SECRET = 'b3-webhook-secret';
  const writes: Array<Record<string, unknown>> = [];
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/rest/v1/billing_events')) {
      if ((init?.method || 'GET') === 'POST') return { ok: true, async text() { return JSON.stringify([{ id: 'b3-processed-event' }]); } } as Response;
      if ((init?.method || 'GET') === 'PATCH') {
        writes.push(JSON.parse(String(init?.body || '{}')) as Record<string, unknown>);
        return { ok: true, async text() { return '[]'; } } as Response;
      }
    }
    throw new Error(`unexpected B3 processed request: ${url} ${init?.method || 'GET'}`);
  }) as typeof fetch;
  const body = JSON.stringify({ id: 'evt_b3_processed', type: 'checkout.session.async_payment_failed', data: { object: { metadata: { workspace_id: 'workspace-a' } } } });
  const now = String(Math.floor(Date.now() / 1000));
  const currentSignature = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${now}.${body}`).digest('hex');
  const response = responseRecorder();
  try {
    await webhookHandler({ method: 'POST', headers: { 'stripe-signature': `t=${now},v1=${currentSignature}` }, async *[Symbol.asyncIterator]() { yield body; } }, response);
    assert.equal(response.state.statusCode, 200);
    assert.equal(writes.some((payload) => payload.processing_status === 'processed'), true);

    const staleTimestamp = String(Math.floor(Date.now() / 1000) - 60 * 60);
    const staleSignature = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET).update(`${staleTimestamp}.${body}`).digest('hex');
    const staleResponse = responseRecorder();
    await webhookHandler({ method: 'POST', headers: { 'stripe-signature': `t=${staleTimestamp},v1=${staleSignature}` }, async *[Symbol.asyncIterator]() { yield body; } }, staleResponse);
    assert.equal(staleResponse.state.statusCode, 400);
    assert.equal(writes.some((payload) => payload.event_id === 'evt_b3_processed'), false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});
