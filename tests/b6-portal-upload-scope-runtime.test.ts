import assert from 'node:assert/strict';
import test from 'node:test';
import storageUploadHandler from '../api/storage-upload.ts';
import { createPortalSession } from '../src/server/_portal-token.ts';

type ResponseState = { statusCode: number | null; payload: unknown };
type Fixture = {
  previousFetch: typeof fetch;
  previousEnv: NodeJS.ProcessEnv;
  calls: Array<{ url: string; method: string; body?: string }>;
};

const workspaceId = '11111111-1111-4111-8111-111111111111';
const caseId = '22222222-2222-4222-8222-222222222222';
const itemId = '33333333-3333-4333-8333-333333333333';
const tokenId = '44444444-4444-4444-8444-444444444444';

function responseRecorder() {
  const state: ResponseState = { statusCode: null, payload: null };
  return {
    state,
    status(code: number) { state.statusCode = code; return this; },
    json(payload: unknown) { state.payload = payload; return this; },
  };
}

function session() {
  return createPortalSession({ tokenId, caseId, workspaceId }, 900);
}

function request(file: Record<string, unknown>, overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    query: {},
    headers: {},
    body: { caseId, itemId, portalSession: session(), file, ...overrides },
  } as any;
}

function installFetch(itemExists = true): Fixture {
  const previousFetch = globalThis.fetch;
  const previousEnv = { ...process.env };
  process.env.SUPABASE_URL = 'https://b6-remediation.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'b6-service-key';
  process.env.PORTAL_SESSION_SECRET = 'b6-session-secret';
  process.env.SUPABASE_PORTAL_BUCKET = 'portal-uploads';
  const calls: Fixture['calls'] = [];
  const admissions = new Map<string, Record<string, unknown>>();

  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = String(input);
    const method = String(init?.method || 'GET');
    const body = typeof init?.body === 'string' ? init.body : undefined;
    calls.push({ url, method, body });

    if (url.includes('/rest/v1/cases?')) {
      return { ok: true, async text() { return JSON.stringify([{ id: caseId, workspace_id: workspaceId }]); } } as Response;
    }
    if (url.includes('/rest/v1/client_portal_tokens?') && method === 'GET') {
      return { ok: true, async text() { return JSON.stringify([{ id: tokenId, case_id: caseId, expires_at: '2099-01-01T00:00:00.000Z', revoked_at: null }]); } } as Response;
    }
    if (url.includes('/rest/v1/client_portal_tokens?id=') && method === 'PATCH') {
      return { ok: true, async text() { return '[]'; } } as Response;
    }
    if (url.includes('/rest/v1/workspaces?')) {
      return { ok: true, async text() { return JSON.stringify([{ id: workspaceId }]); } } as Response;
    }
    if (url.includes('/rest/v1/case_items?')) {
      return { ok: true, async text() { return itemExists ? JSON.stringify([{ id: itemId, case_id: caseId, type: 'file' }]) : '[]'; } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_portal_upload_admit')) {
      const payload = JSON.parse(body || '{}');
      const existing = admissions.get(payload.p_idempotency_key);
      if (existing) return { ok: true, async text() { return JSON.stringify({ ...existing, is_existing: true }); } } as Response;
      const admission = { id: `admission-${admissions.size + 1}`, status: 'pending', object_path: payload.p_object_path, file_name: payload.p_file_name };
      admissions.set(payload.p_idempotency_key, admission);
      return { ok: true, async text() { return JSON.stringify({ ...admission, is_existing: false }); } } as Response;
    }
    if (url.includes('/rest/v1/rpc/closeflow_portal_upload_finalize')) {
      const payload = JSON.parse(body || '{}');
      const admission = [...admissions.values()].find((row) => row.id === payload.p_admission_id);
      if (admission) admission.status = payload.p_status;
      return { ok: true, async text() { return JSON.stringify(admission ? [admission] : []); } } as Response;
    }
    if (url.includes('/storage/v1/object/')) {
      return { ok: true, async text() { return '{}'; } } as Response;
    }
    throw new Error(`unexpected B6 request: ${url} ${method}`);
  }) as typeof fetch;
  return { previousFetch, previousEnv, calls };
}

function restore(fixture: Fixture) {
  globalThis.fetch = fixture.previousFetch;
  for (const key of Object.keys(process.env)) if (!(key in fixture.previousEnv)) delete process.env[key];
  Object.assign(process.env, fixture.previousEnv);
}

test('B6 missing portal session blocks before any storage/provider call', async () => {
  const fixture = installFetch();
  try {
    const response = responseRecorder();
    await storageUploadHandler({ method: 'POST', body: { caseId, itemId, file: { name: 'a.txt', type: 'text/plain', size: 1, dataBase64: 'YQ==' } } }, response);
    assert.equal(response.state.statusCode, 403, JSON.stringify(response.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('/storage/v1/object/')).length, 0);
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_portal_upload_admit')).length, 0);
  } finally {
    restore(fixture);
  }
});

test('B6 foreign/missing parent item blocks before storage admission', async () => {
  const fixture = installFetch(false);
  try {
    const response = responseRecorder();
    await storageUploadHandler(request({ name: 'a.txt', type: 'text/plain', size: 1, dataBase64: 'YQ==' }), response);
    assert.equal(response.state.statusCode, 404, JSON.stringify(response.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_portal_upload_admit')).length, 0);
    assert.equal(fixture.calls.filter((call) => call.url.includes('/storage/v1/object/')).length, 0);
  } finally {
    restore(fixture);
  }
});

test('B6 type and size rejection cause zero storage provider calls', async () => {
  const fixture = installFetch();
  try {
    const badType = responseRecorder();
    await storageUploadHandler(request({ name: 'a.exe', type: 'application/x-msdownload', size: 1, dataBase64: 'YQ==' }), badType);
    assert.equal(badType.state.statusCode, 400, JSON.stringify(badType.state.payload));
    const tooLarge = responseRecorder();
    await storageUploadHandler(request({ name: 'large.txt', type: 'text/plain', size: 30 * 1024 * 1024, dataBase64: 'YQ==' }), tooLarge);
    assert.equal(tooLarge.state.statusCode, 400, JSON.stringify(tooLarge.state.payload));
    assert.equal(fixture.calls.filter((call) => call.url.includes('/storage/v1/object/')).length, 0);
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_portal_upload_admit')).length, 0);
  } finally {
    restore(fixture);
  }
});

test('B6 deterministic replay returns the admitted object without a second provider upload', async () => {
  const fixture = installFetch();
  try {
    const file = { name: 'document.txt', type: 'text/plain', size: 1, dataBase64: 'YQ==' };
    const first = responseRecorder();
    await storageUploadHandler(request(file), first);
    assert.equal(first.state.statusCode, 200, JSON.stringify(first.state.payload));
    const second = responseRecorder();
    await storageUploadHandler(request(file), second);
    assert.equal(second.state.statusCode, 200, JSON.stringify(second.state.payload));
    assert.deepEqual(second.state.payload, first.state.payload);
    assert.equal(fixture.calls.filter((call) => call.url.includes('/storage/v1/object/')).length, 1);
    assert.equal(fixture.calls.filter((call) => call.url.includes('closeflow_portal_upload_admit')).length, 2);
  } finally {
    restore(fixture);
  }
});
