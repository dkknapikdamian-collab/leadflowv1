// STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1
// STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1
// Handles the public /api/assistant/query contract through /api/system?kind=assistant-query.

import { buildAssistantContextFromRequest } from './assistant-context.js';
import { runAssistantQuery } from './ai-assistant.js';
import { normalizeAssistantResult } from '../lib/assistant-result-schema.js';

export const MAX_ASSISTANT_QUERY_BODY_BYTES = 1024 * 1024;

function sendJson(res: any, status: number, body: unknown) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function assistantMeta(input: { timezone?: string; now?: string | Date; noData?: boolean; emptyPrompt?: boolean } = {}) {
  return {
    generatedAt: new Date(input.now || Date.now()).toISOString(),
    timezone: input.timezone || 'Europe/Warsaw',
    source: 'app_snapshot' as const,
    safety: 'read_only_or_draft_only' as const,
    dataPolicy: 'app_data_only' as const,
    matchedItems: 0,
    noData: Boolean(input.noData),
    emptyPrompt: Boolean(input.emptyPrompt),
  };
}

export function emptyPromptApiResult(input: { timezone?: string; now?: string | Date } = {}) {
  return {
    mode: 'read',
    intent: 'read',
    answer: 'Napisz pytanie albo komendę. Nie odpowiadam z pustego prompta.',
    items: [],
    draft: null,
    meta: assistantMeta({ ...input, emptyPrompt: true }),
  };
}

function methodNotAllowedApiResult(input: { timezone?: string; now?: string | Date } = {}) {
  return {
    mode: 'read',
    intent: 'read',
    answer: 'Endpoint /api/assistant/query przyjmuje tylko POST.',
    items: [],
    draft: null,
    meta: assistantMeta(input),
    error: 'method_not_allowed',
  };
}

function payloadTooLargeApiResult(input: { timezone?: string; now?: string | Date } = {}) {
  return {
    mode: 'read',
    intent: 'read',
    answer: 'Payload zapytania asystenta jest za duży.',
    items: [],
    draft: null,
    meta: assistantMeta(input),
    error: 'payload_too_large',
  };
}

async function readBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    let raw = '';
    let tooLarge = false;
    req.on?.('data', (chunk: any) => {
      raw += Buffer.from(chunk).toString('utf8');
      if (raw.length > MAX_ASSISTANT_QUERY_BODY_BYTES) {
        tooLarge = true;
        (req as any).__assistantPayloadTooLarge = true;
        req.destroy?.();
      }
    });
    req.on?.('end', () => {
      if (tooLarge) return resolve({});
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on?.('error', () => resolve({}));
  });
}

export default async function assistantQueryHandler(req: any, res: any) {
  const timezoneFromQuery = typeof req?.query?.timezone === 'string' ? req.query.timezone : undefined;
  const nowFromQuery = typeof req?.query?.now === 'string' ? req.query.now : undefined;

  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return sendJson(res, 405, methodNotAllowedApiResult({ timezone: timezoneFromQuery, now: nowFromQuery }));
  }

  const body = await readBody(req);
  const timezone = typeof body.timezone === 'string' ? body.timezone : timezoneFromQuery || 'Europe/Warsaw';
  const now = typeof body.now === 'string' ? body.now : nowFromQuery;

  if ((req as any).__assistantPayloadTooLarge) {
    return sendJson(res, 413, payloadTooLargeApiResult({ timezone, now }));
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query) {
    return sendJson(res, 400, emptyPromptApiResult({ timezone, now }));
  }

  const context = await buildAssistantContextFromRequest({
    query,
    timezone,
    now,
    seed: body.snapshot || body.data || undefined,
    request: {
      headers: req.headers || {},
      url: req.url,
    },
  });

  const result = normalizeAssistantResult(runAssistantQuery({ query, context, now }));
  return sendJson(res, 200, result);
}
