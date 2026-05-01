export default async function handler(req: any, res: any) {
  const url = new URL(req.url || '/api/workspace-subscription', 'http://localhost');
  url.searchParams.set('kind', 'workspace-subscription');
  req.query = { ...(req.query || {}), kind: 'workspace-subscription' };

  const systemModule = await import('./system.js');
  return systemModule.default(req, res);
}
