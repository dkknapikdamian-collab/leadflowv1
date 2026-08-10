import assert from 'node:assert/strict';
import test from 'node:test';
import caseItemsHandler from '../api/case-items.ts';
import recordsHandler from '../src/server/records.ts';

const workspaceA = 'workspace-a';
const foreignCase = 'case-b';
const foreignItem = 'item-b';

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

function authenticatedRequest(method: string, body?: Record<string, unknown>, query?: Record<string, string>) {
  return {
    method,
    query: query || {},
    body: body || {},
    headers: {},
    __closeflowSupabaseRequestContext: {
      userId: 'user-a',
      uid: 'user-a',
      email: 'member-a@example.com',
      fullName: null,
      workspaceId: workspaceA,
      emailConfirmedAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      authProvider: 'email',
      authProviders: ['email'],
      rawUser: { sub: 'user-a', app_metadata: { workspace_id: workspaceA } },
    },
  };
}

function installForeignCaseFetch() {
  const previousFetch = globalThis.fetch;
  const previousEnv = {
    supabaseUrl: process.env.SUPABASE_URL,
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY,
  };
  process.env.SUPABASE_URL = 'https://b2-test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b2-service-key';
  process.env.SUPABASE_ANON_KEY = 'b2-anon-key';
  const writes: string[] = [];
  const caseItemReads: string[] = [];
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    const path = url.split('/rest/v1/')[1] || '';
    if (init?.method === 'POST' || init?.method === 'PATCH' || init?.method === 'DELETE') writes.push(`${init.method} ${path}`);
    if (!init?.method || init.method === 'GET') {
      if (path.startsWith('case_items')) caseItemReads.push(path);
    }

    if (path.startsWith(`cases?select=*&id=eq.${foreignCase}`)) {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    if (path.startsWith(`case_items?select=*&id=eq.${foreignItem}`)) {
      return { ok: true, async text() { return JSON.stringify([{ id: foreignItem, case_id: foreignCase, title: 'foreign' }]); } } as Response;
    }
    if (path.startsWith(`case_items?select=case_id&id=eq.${foreignItem}`)) {
      return { ok: true, async text() { return JSON.stringify([{ id: foreignItem, case_id: foreignCase }]); } } as Response;
    }
    if (path.startsWith('case_items')) {
      return { ok: true, async text() { return JSON.stringify([{ id: foreignItem, case_id: foreignCase }]); } } as Response;
    }
    throw new Error(`unexpected Supabase request: ${url}`);
  }) as typeof fetch;
  return { previousFetch, previousEnv, writes, caseItemReads };
}

function restoreEnvironment(previousEnv: { supabaseUrl?: string; serviceRole?: string; anonKey?: string }) {
  if (previousEnv.supabaseUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousEnv.supabaseUrl;
  if (previousEnv.serviceRole === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = previousEnv.serviceRole;
  if (previousEnv.anonKey === undefined) delete process.env.SUPABASE_ANON_KEY;
  else process.env.SUPABASE_ANON_KEY = previousEnv.anonKey;
}

test('B2 POST rejects a foreign case before any case-item insert', async () => {
  const { previousFetch, previousEnv, writes } = installForeignCaseFetch();
  try {
    const response = responseRecorder();
    await caseItemsHandler(authenticatedRequest('POST', { caseId: foreignCase, title: 'forged' }), response);
    assert.equal(response.state.statusCode, 404, JSON.stringify(response.state.payload));
    assert.deepEqual(writes, []);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnvironment(previousEnv);
  }
});

test('B2 PATCH rejects a foreign item-parent pair before mutation', async () => {
  const { previousFetch, previousEnv, writes } = installForeignCaseFetch();
  try {
    const response = responseRecorder();
    await caseItemsHandler(authenticatedRequest('PATCH', { id: foreignItem, caseId: foreignCase, title: 'forged' }), response);
    assert.equal(response.state.statusCode, 404);
    assert.deepEqual(writes, []);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnvironment(previousEnv);
  }
});

test('B2 DELETE rejects a foreign item after resolving its parent scope', async () => {
  const { previousFetch, previousEnv, writes } = installForeignCaseFetch();
  try {
    const response = responseRecorder();
    await caseItemsHandler(authenticatedRequest('DELETE', undefined, { id: foreignItem }), response);
    assert.equal(response.state.statusCode, 404, JSON.stringify(response.state.payload));
    assert.deepEqual(writes, []);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnvironment(previousEnv);
  }
});

test('B2 GET rejects a foreign case before reading its case items', async () => {
  const { previousFetch, previousEnv, writes, caseItemReads } = installForeignCaseFetch();
  try {
    const response = responseRecorder();
    await caseItemsHandler(authenticatedRequest('GET', undefined, { caseId: foreignCase }), response);
    assert.equal(response.state.statusCode, 404, JSON.stringify(response.state.payload));
    assert.deepEqual(writes, []);
    assert.deepEqual(caseItemReads, []);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnvironment(previousEnv);
  }
});

test('B2 compatibility records route rejects foreign GET/POST/PATCH/DELETE operations', async () => {
  const operations = [
    { method: 'GET', query: { kind: 'case-items', caseId: foreignCase }, body: {} },
    { method: 'POST', query: {}, body: { kind: 'case-items', caseId: foreignCase, title: 'forged' } },
    { method: 'PATCH', query: {}, body: { kind: 'case-items', id: foreignItem, title: 'forged' } },
    { method: 'DELETE', query: { kind: 'case-items', id: foreignItem }, body: {} },
  ];
  for (const operation of operations) {
    const { previousFetch, previousEnv, writes, caseItemReads } = installForeignCaseFetch();
    try {
      const response = responseRecorder();
      await recordsHandler({ ...authenticatedRequest(operation.method, operation.body, operation.query) }, response);
      assert.equal(response.state.statusCode, 404, `${operation.method}: ${JSON.stringify(response.state.payload)}`);
      assert.deepEqual(writes, [], `${operation.method} must not mutate`);
      if (operation.method === 'GET') assert.deepEqual(caseItemReads, [], 'GET must not read foreign items');
    } finally {
      globalThis.fetch = previousFetch;
      restoreEnvironment(previousEnv);
    }
  }
});
