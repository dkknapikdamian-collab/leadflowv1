import systemHandler from './system.js';

export default async function handler(req: any, res: any) {
  req.query = { ...(req.query || {}), kind: 'workspace-subscription' };
  return systemHandler(req, res);
}
