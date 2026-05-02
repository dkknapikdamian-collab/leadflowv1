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
