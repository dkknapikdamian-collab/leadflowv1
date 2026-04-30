import { buildAiApplicationOperatorAnswer } from '../src/server/ai-application-operator.js';

function parseBody(body: unknown) {
  if (!body) return {} as Record<string, unknown>;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  }
  return body as Record<string, unknown>;
}

function headerValue(req: any, name: string) {
  const value = req?.headers?.[name] ?? req?.headers?.[name.toLowerCase()] ?? null;
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req.body);
    const context = body.context && typeof body.context === 'object' ? body.context as Record<string, unknown> : {};
    const rawText = String(body.rawText || body.text || body.command || '').trim();
    const workspaceId = String(body.workspaceId || headerValue(req, 'x-workspace-id') || '').trim() || null;
    const now = String(body.now || '').trim() || new Date().toISOString();

    const result = buildAiApplicationOperatorAnswer({
      rawText,
      context,
      now,
      workspaceId,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'ASSISTANT_OPERATOR_FAILED' });
  }
}
