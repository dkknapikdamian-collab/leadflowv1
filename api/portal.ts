import portalSessionHandler from '../src/server/portal-session-handler.js';
import portalTokensHandler from '../src/server/portal-tokens-handler.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export default async function handler(req: any, res: any) {
  const route = asText(req?.query?.route).toLowerCase();

  if (route === 'session') {
    await portalSessionHandler(req, res);
    return;
  }

  if (route === 'tokens') {
    await portalTokensHandler(req, res);
    return;
  }

  res.status(400).json({ error: 'PORTAL_ROUTE_REQUIRED' });
}
