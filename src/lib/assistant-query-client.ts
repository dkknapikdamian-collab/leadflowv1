// STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1
// Browser-side contract client for /api/assistant/query.
// The UI must not reimplement assistant logic or bypass the backend contract.

export type AssistantQueryClientMode = 'read' | 'draft' | 'unknown';
export type AssistantQueryClientIntent = 'read' | 'draft' | 'unknown';

export type AssistantQueryClientItem = {
  id: string;
  kind: string;
  title: string;
  subtitle?: string | null;
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  phone?: string | null;
  email?: string | null;
  reason?: string | null;
};

export type AssistantQueryClientMeta = {
  generatedAt?: string;
  timezone?: string;
  source?: 'app_snapshot' | string;
  safety?: 'read_only_or_draft_only' | string;
  dataPolicy?: 'app_data_only' | string;
  matchedItems?: number;
  noData?: boolean;
  emptyPrompt?: boolean;
  bodyTooLarge?: boolean;
};

export type AssistantQueryClientResult = {
  mode: AssistantQueryClientMode;
  intent: AssistantQueryClientIntent;
  answer: string;
  items: AssistantQueryClientItem[];
  draft: any | null;
  meta: AssistantQueryClientMeta;
};

export type AssistantQueryClientInput = {
  query: string;
  timezone?: string;
  snapshot?: Record<string, unknown>;
  data?: Record<string, unknown>;
  now?: string;
};

const EMPTY_PROMPT_ANSWER = 'Napisz pytanie albo komendę. Nie odpowiadam z pustego prompta.';
const FALLBACK_ERROR_ANSWER = 'Asystent nie odpowiedział poprawnym kontraktem API.';

function isMode(value: unknown): value is AssistantQueryClientMode {
  return value === 'read' || value === 'draft' || value === 'unknown';
}

function isIntent(value: unknown): value is AssistantQueryClientIntent {
  return value === 'read' || value === 'draft' || value === 'unknown';
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeItem(value: unknown, index: number): AssistantQueryClientItem | null {
  const row = asObject(value);
  const id = asString(row.id) || `assistant_item_${index}`;
  const kind = asString(row.kind) || 'unknown';
  const title = asString(row.title);
  if (!title) return null;

  return {
    id,
    kind,
    title,
    subtitle: asString(row.subtitle),
    scheduledAt: asString(row.scheduledAt),
    startAt: asString(row.startAt),
    endAt: asString(row.endAt),
    phone: asString(row.phone),
    email: asString(row.email),
    reason: asString(row.reason),
  };
}

function normalizeMeta(value: unknown): AssistantQueryClientMeta {
  const meta = asObject(value);
  return {
    generatedAt: asString(meta.generatedAt) || undefined,
    timezone: asString(meta.timezone) || undefined,
    source: asString(meta.source) || undefined,
    safety: asString(meta.safety) || undefined,
    dataPolicy: asString(meta.dataPolicy) || undefined,
    matchedItems: typeof meta.matchedItems === 'number' ? meta.matchedItems : undefined,
    noData: meta.noData === true,
    emptyPrompt: meta.emptyPrompt === true,
    bodyTooLarge: meta.bodyTooLarge === true,
  };
}

export function normalizeAssistantQueryClientResult(payload: unknown, fallbackAnswer = FALLBACK_ERROR_ANSWER): AssistantQueryClientResult {
  const row = asObject(payload);
  const mode = isMode(row.mode) ? row.mode : 'unknown';
  const intent = isIntent(row.intent) ? row.intent : mode === 'draft' ? 'draft' : mode === 'read' ? 'read' : 'unknown';
  const answer = asString(row.answer) || fallbackAnswer;
  const items = Array.isArray(row.items)
    ? row.items.map((item, index) => normalizeItem(item, index)).filter(Boolean) as AssistantQueryClientItem[]
    : [];

  return {
    mode,
    intent,
    answer,
    items,
    draft: row.draft || null,
    meta: normalizeMeta(row.meta),
  };
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { mode: 'unknown', intent: 'unknown', answer: text, items: [], draft: null, meta: {} };
  }
}

export async function askAssistantQueryApi(input: AssistantQueryClientInput): Promise<AssistantQueryClientResult> {
  const query = String(input.query || '').trim();

  if (!query) {
    return normalizeAssistantQueryClientResult({
      mode: 'unknown',
      intent: 'unknown',
      answer: EMPTY_PROMPT_ANSWER,
      items: [],
      draft: null,
      meta: {
        source: 'app_snapshot',
        safety: 'read_only_or_draft_only',
        dataPolicy: 'app_data_only',
        matchedItems: 0,
        emptyPrompt: true,
      },
    });
  }

  const response = await fetch('/api/assistant/query', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      query,
      timezone: input.timezone || 'Europe/Warsaw',
      snapshot: input.snapshot || input.data || undefined,
      data: input.data || undefined,
      now: input.now,
    }),
  });

  const payload = await readJsonResponse(response);
  const result = normalizeAssistantQueryClientResult(payload, response.ok ? FALLBACK_ERROR_ANSWER : 'Asystent nie odpowiedział.');

  if (!response.ok) {
    const error = new Error(result.answer || `Błąd asystenta (${response.status})`) as Error & {
      status?: number;
      payload?: unknown;
      result?: AssistantQueryClientResult;
    };
    error.status = response.status;
    error.payload = payload;
    error.result = result;
    throw error;
  }

  return result;
}

export const STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1 = true;
