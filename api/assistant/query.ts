// STAGE3_AI_APPLICATION_BRAIN_V1
// POST /api/assistant/query
// Reads scoped app data through existing API endpoints and returns a structured answer or a review draft.

import { buildAssistantContextFromRequest } from "../../src/server/assistant-context";
import { runAssistantQuery } from "../../src/server/ai-assistant";

function sendJson(res: any, status: number, body: unknown) {
  res.status(status).setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on?.("data", (chunk: Buffer) => {
      raw += chunk.toString("utf8");
      if (raw.length > 1024 * 1024) req.destroy?.();
    });
    req.on?.("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on?.("error", () => resolve({}));
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return sendJson(res, 405, { error: "method_not_allowed" });
  }

  const body = await readBody(req);
  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return sendJson(res, 400, {
      mode: "unknown",
      intent: "unknown",
      answer: "Napisz pytanie albo komendę. Nie odpowiadam z pustego prompta.",
      items: [],
      draft: null,
    });
  }

  const context = await buildAssistantContextFromRequest({
    query,
    timezone: typeof body.timezone === "string" ? body.timezone : "Europe/Warsaw",
    now: typeof body.now === "string" ? body.now : undefined,
    seed: body.snapshot || body.data || undefined,
    request: {
      headers: req.headers || {},
      url: req.url,
    },
  });

  const result = runAssistantQuery({ query, context, now: body.now });
  return sendJson(res, 200, result);
}
