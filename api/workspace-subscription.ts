export default async function handler(req: any, res: any) {
  if (req.method === 'PATCH' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    res.status(403).json({
      error: 'BILLING_SUBSCRIPTION_WRITE_FORBIDDEN',
      message: 'Use /api/billing-checkout, /api/billing-webhook and /api/billing-actions.',
    });
    return;
  }

  const url = new URL(req.url || '/api/workspace-subscription', 'http://localhost');
  url.searchParams.set('kind', 'workspace-subscription');
  req.query = { ...(req.query || {}), kind: 'workspace-subscription' };

  const systemModule = await import('./system.js');
  return systemModule.default(req, res);
}
