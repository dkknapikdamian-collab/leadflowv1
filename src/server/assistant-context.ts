// STAGE3_AI_APPLICATION_BRAIN_V1
// One source of truth for data snapshot used by the CloseFlow AI operator.
// The assistant may read application data and prepare drafts, but it must not write final records.

export type AssistantRecordKind =
  | "lead"
  | "client"
  | "case"
  | "task"
  | "event"
  | "activity"
  | "draft"
  | "unknown";

export type AssistantContextItem = {
  id: string;
  kind: AssistantRecordKind;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  status?: string | null;
  priority?: string | null;
  type?: string | null;
  phone?: string | null;
  email?: string | null;
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  leadId?: string | null;
  clientId?: string | null;
  caseId?: string | null;
  source?: string | null;
  raw?: Record<string, unknown>;
};

export type AssistantContext = {
  generatedAt: string;
  timezone: string;
  query: string;
  items: AssistantContextItem[];
  leads: AssistantContextItem[];
  clients: AssistantContextItem[];
  cases: AssistantContextItem[];
  tasks: AssistantContextItem[];
  events: AssistantContextItem[];
  activities: AssistantContextItem[];
  drafts: AssistantContextItem[];
  stats: {
    totalItems: number;
    leads: number;
    clients: number;
    cases: number;
    tasks: number;
    events: number;
    activities: number;
    drafts: number;
  };
};

export type AssistantContextSeed = {
  leads?: unknown[];
  clients?: unknown[];
  cases?: unknown[];
  tasks?: unknown[];
  events?: unknown[];
  activities?: unknown[];
  drafts?: unknown[];
  workItems?: unknown[];
  [key: string]: unknown;
};

export type BuildAssistantContextInput = {
  query?: string;
  timezone?: string;
  now?: string | Date;
  seed?: AssistantContextSeed;
  request?: {
    headers?: Record<string, string | string[] | undefined>;
    url?: string;
  };
};

const DEFAULT_TIMEZONE = "Europe/Warsaw";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function firstString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function firstDate(source: Record<string, unknown>, keys: string[]): string | null {
  const raw = firstString(source, keys);
  if (!raw) return null;
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return raw;
}

function hasMeaningfulPhone(value: string | null): boolean {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function normalizeItem(kind: AssistantRecordKind, item: unknown, index = 0): AssistantContextItem | null {
  const source = asRecord(item);
  const id = firstString(source, ["id", "uuid", "draftId", "messageId"]) || `${kind}_${index}`;
  const title =
    firstString(source, [
      "title",
      "name",
      "fullName",
      "full_name",
      "contactName",
      "contact_name",
      "clientName",
      "client_name",
      "personName",
      "person_name",
      "companyName",
      "company_name",
      "subject",
      "need",
      "label",
    ]) || `${kind} ${index + 1}`;

  const phone = firstString(source, ["phone", "phoneNumber", "phone_number", "mobile", "tel"]);

  return {
    id,
    kind,
    title,
    subtitle: firstString(source, ["company", "companyName", "company_name", "personName", "person_name", "clientName", "client_name"]),
    body: firstString(source, ["body", "description", "note", "notes", "notesSummary", "notes_summary", "summary", "rawText", "raw_text"]),
    status: firstString(source, ["status", "stage", "pipelineStage", "pipeline_stage"]),
    priority: firstString(source, ["priority", "riskLevel", "risk_level"]),
    type: firstString(source, ["type", "taskType", "task_type", "activityType", "activity_type", "eventType", "event_type", "draftType", "draft_type"]),
    phone: hasMeaningfulPhone(phone) ? phone : null,
    email: firstString(source, ["email", "mail"]),
    scheduledAt: firstDate(source, ["scheduledAt", "scheduled_at", "dueAt", "due_at", "date", "nextActionAt", "next_action_at", "reminderAt", "reminder_at"]),
    startAt: firstDate(source, ["startAt", "start_at", "startsAt", "starts_at"]),
    endAt: firstDate(source, ["endAt", "end_at", "endsAt", "ends_at"]),
    createdAt: firstDate(source, ["createdAt", "created_at"]),
    updatedAt: firstDate(source, ["updatedAt", "updated_at"]),
    leadId: firstString(source, ["leadId", "lead_id"]),
    clientId: firstString(source, ["clientId", "client_id", "linkedClientId", "linked_client_id"]),
    caseId: firstString(source, ["caseId", "case_id", "linkedCaseId", "linked_case_id"]),
    source: firstString(source, ["source", "sourceLabel", "source_label", "sourceType", "source_type"]),
    raw: source,
  };
}

function normalizeMany(kind: AssistantRecordKind, values: unknown[] | undefined): AssistantContextItem[] {
  if (!Array.isArray(values)) return [];
  return values.map((value, index) => normalizeItem(kind, value, index)).filter(Boolean) as AssistantContextItem[];
}

function extractArray(payload: unknown, fallbackKeys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;
  const record = asRecord(payload);
  for (const key of fallbackKeys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

export function buildAssistantContext(input: BuildAssistantContextInput = {}): AssistantContext {
  const seed = input.seed || {};
  const workItems = normalizeMany("unknown", seed.workItems);
  const tasks = normalizeMany("task", seed.tasks).concat(
    workItems.filter((item) => /task|zadanie|follow/i.test(`${item.kind} ${item.type || ""} ${item.title}`)).map((item) => ({ ...item, kind: "task" as const })),
  );
  const events = normalizeMany("event", seed.events).concat(
    workItems
      .filter((item) => /event|wydarzenie|meeting|spotkanie|call|telefon/i.test(`${item.kind} ${item.type || ""} ${item.title}`))
      .map((item) => ({ ...item, kind: "event" as const })),
  );

  const leads = normalizeMany("lead", seed.leads);
  const clients = normalizeMany("client", seed.clients);
  const cases = normalizeMany("case", seed.cases);
  const activities = normalizeMany("activity", seed.activities);
  const drafts = normalizeMany("draft", seed.drafts);
  const items = [...leads, ...clients, ...cases, ...tasks, ...events, ...activities, ...drafts];

  return {
    generatedAt: new Date(input.now || Date.now()).toISOString(),
    timezone: input.timezone || DEFAULT_TIMEZONE,
    query: String(input.query || "").trim(),
    items,
    leads,
    clients,
    cases,
    tasks,
    events,
    activities,
    drafts,
    stats: {
      totalItems: items.length,
      leads: leads.length,
      clients: clients.length,
      cases: cases.length,
      tasks: tasks.length,
      events: events.length,
      activities: activities.length,
      drafts: drafts.length,
    },
  };
}

function getHeader(headers: Record<string, string | string[] | undefined> | undefined, key: string): string | undefined {
  if (!headers) return undefined;
  const direct = headers[key] ?? headers[key.toLowerCase()] ?? headers[key.toUpperCase()];
  if (Array.isArray(direct)) return direct.join(", ");
  return direct;
}

function requestBaseUrl(req: { headers?: Record<string, string | string[] | undefined>; url?: string } | undefined): string | null {
  if (!req?.headers) return null;
  const proto = getHeader(req.headers, "x-forwarded-proto") || "https";
  const host = getHeader(req.headers, "x-forwarded-host") || getHeader(req.headers, "host");
  if (!host) return null;
  return `${proto}://${host}`;
}

async function fetchJsonSafe(url: string, headers: Record<string, string>): Promise<unknown> {
  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function buildAssistantContextFromRequest(input: BuildAssistantContextInput = {}): Promise<AssistantContext> {
  const explicitSeed = input.seed || {};
  const hasExplicitSeed = Object.values(explicitSeed).some((value) => Array.isArray(value) && value.length > 0);
  if (hasExplicitSeed || !input.request) {
    return buildAssistantContext(input);
  }

  const baseUrl = requestBaseUrl(input.request);
  if (!baseUrl) return buildAssistantContext(input);

  const cookie = getHeader(input.request.headers, "cookie");
  const authorization = getHeader(input.request.headers, "authorization");
  const forwardedWorkspace = getHeader(input.request.headers, "x-closeflow-workspace-id");
  const headers: Record<string, string> = { accept: "application/json" };
  if (cookie) headers.cookie = cookie;
  if (authorization) headers.authorization = authorization;
  if (forwardedWorkspace) headers["x-closeflow-workspace-id"] = forwardedWorkspace;

  const [leadsRaw, workItemsRaw, clientsRaw, casesRaw, activitiesRaw, systemRaw] = await Promise.all([
    fetchJsonSafe(`${baseUrl}/api/leads`, headers),
    fetchJsonSafe(`${baseUrl}/api/work-items`, headers),
    fetchJsonSafe(`${baseUrl}/api/clients`, headers),
    fetchJsonSafe(`${baseUrl}/api/cases`, headers),
    fetchJsonSafe(`${baseUrl}/api/activities`, headers),
    fetchJsonSafe(`${baseUrl}/api/system?kind=ai-drafts`, headers),
  ]);

  const seed: AssistantContextSeed = {
    leads: extractArray(leadsRaw, ["leads", "items", "data"]),
    workItems: extractArray(workItemsRaw, ["workItems", "items", "tasks", "events", "data"]),
    tasks: extractArray(workItemsRaw, ["tasks"]),
    events: extractArray(workItemsRaw, ["events"]),
    clients: extractArray(clientsRaw, ["clients", "items", "data"]),
    cases: extractArray(casesRaw, ["cases", "items", "data"]),
    activities: extractArray(activitiesRaw, ["activities", "items", "data"]),
    drafts: extractArray(systemRaw, ["drafts", "items", "data"]),
  };

  return buildAssistantContext({ ...input, seed });
}

export function itemSearchText(item: AssistantContextItem): string {
  return [
    item.title,
    item.subtitle,
    item.body,
    item.status,
    item.priority,
    item.type,
    item.phone,
    item.email,
    item.source,
    item.scheduledAt,
    item.startAt,
    item.endAt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getItemDate(item: AssistantContextItem): Date | null {
  const value = item.startAt || item.scheduledAt || item.endAt || item.createdAt || item.updatedAt;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body || "{}");
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function assistantContextHandler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    return;
  }

  const body = parseBody(req);
  const query = asText(req?.query?.query || body.query || "");
  const timezone = asText(req?.query?.timezone || body.timezone || "Europe/Warsaw") || "Europe/Warsaw";

  const context = await buildAssistantContextFromRequest({
    query,
    timezone,
    seed: (body.snapshot || body.seed || undefined) as AssistantContextSeed | undefined,
    request: {
      headers: req.headers || {},
      url: req.url,
    },
  });

  res.status(200).json({
    generatedAt: context.generatedAt,
    timezone: context.timezone,
    stats: context.stats,
    snapshot: {
      leads: context.leads,
      clients: context.clients,
      cases: context.cases,
      tasks: context.tasks,
      events: context.events,
      drafts: context.drafts,
      activities: context.activities,
      items: context.items,
    },
  });
}
