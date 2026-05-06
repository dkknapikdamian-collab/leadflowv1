// STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1
// STAGE3_AI_APPLICATION_BRAIN_V1
// POST /api/assistant/query
// Reads scoped app data through existing API endpoints and returns a structured answer or a review draft.

import { buildAssistantContextFromRequest } from "../../src/server/assistant-context";
import { runAssistantQuery } from "../../src/server/ai-assistant";

export const STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1 = true;
export const MAX_ASSISTANT_QUERY_BODY_BYTES = 1024 * 1024;
const EMPTY_PROMPT_ANSWER = "Napisz pytanie albo komendę. Nie odpowiadam z pustego prompta.";

function sendJson(res: any, status: number, body: unknown) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function apiMeta(input: { timezone?: string; now?: string | Date; noData?: boolean; emptyPrompt?: boolean }) {
  const generatedAt = new Date(input.now || Date.now()).toISOString();
  return {
    generatedAt,
    timezone: input.timezone || "Europe/Warsaw",
    source: "app_snapshot",
    safety: "read_only_or_draft_only",
    matchedItems: 0,
    dataPolicy: "app_data_only",
    noData: input.noData === true,
    emptyPrompt: input.emptyPrompt === true,
    stage: "STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1",
  };
}

function emptyPromptApiResult(input: { timezone?: string; now?: string | Date }) {
  return {
    mode: "unknown",
    intent: "unknown",
    answer: EMPTY_PROMPT_ANSWER,
    items: [],
    draft: null,
    meta: apiMeta({ ...input, emptyPrompt: true }),
  };
}

async function readBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    if (req.body.length > MAX_ASSISTANT_QUERY_BODY_BYTES) return { __assistantPayloadTooLarge: true };
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = "";
    let settled = false;
    const finish = (value: any) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    req.on?.("data", (chunk: Buffer) => {
      raw += chunk.toString("utf8");
      if (raw.length > MAX_ASSISTANT_QUERY_BODY_BYTES) {
        finish({ __assistantPayloadTooLarge: true });
        req.destroy?.();
      }
    });
    req.on?.("end", () => {
      if (settled) return;
      try {
        finish(raw ? JSON.parse(raw) : {});
      } catch {
        finish({});
      }
    });
    req.on?.("error", () => finish({}));
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return sendJson(res, 405, {
      error: "method_not_allowed",
      mode: "unknown",
      intent: "unknown",
      answer: "Endpoint /api/assistant/query przyjmuje tylko POST.",
      items: [],
      draft: null,
      meta: apiMeta({}),
    });
  }

  const body = await readBody(req);
  const timezone = typeof body.timezone === "string" ? body.timezone : "Europe/Warsaw";
  const now = typeof body.now === "string" ? body.now : undefined;

  if (body.__assistantPayloadTooLarge) {
    return sendJson(res, 413, {
      error: "payload_too_large",
      mode: "unknown",
      intent: "unknown",
      answer: "Zapytanie jest za duże. Skróć treść i spróbuj ponownie.",
      items: [],
      draft: null,
      meta: apiMeta({ timezone, now }),
    });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
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

  const result = runAssistantQuery({ query, context, now: body.now });
  return sendJson(res, 200, result);
}
