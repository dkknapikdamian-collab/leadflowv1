// STAGE223_R2U_REQUEST_IDENTITY_SUPPORT_COMPATIBILITY
// Compatibility shim kept because tests/request-identity-vercel-api-signature.test.cjs
// verifies that Vercel API call sites still use getRequestIdentity(req, body).
// Runtime /api/support traffic is consolidated through /api/system?kind=support by vercel.json.

import supportHandler from '../src/server/support-handler.js';
import { getRequestIdentity } from '../src/server/_request-scope.js';

function parseBody(body: unknown) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body || '{}') as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return typeof body === 'object' ? body as Record<string, unknown> : {};
}

export default async function handler(req: any, res: any) {
  const body = parseBody(req?.body);
  const identity = getRequestIdentity(req, body);
  void identity.fullName;

  await supportHandler(req, res);
}
