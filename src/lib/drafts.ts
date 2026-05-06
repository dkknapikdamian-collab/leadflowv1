export type AppDraftType = "lead" | "task" | "event" | "note";

export type AppDraftStatus = "pending" | "confirmed" | "cancelled" | "expired" | "failed";

export type AppDraft = {
  id: string;
  workspaceId: string;
  userId: string | null;
  type: AppDraftType;
  rawText: string | null;
  parsedData: Record<string, unknown>;
  provider: string;
  status: AppDraftStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
};

function asText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function asObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, unknown>;
  return value as Record<string, unknown>;
}

function normalizeType(value: unknown): AppDraftType {
  const normalized = asText(value).toLowerCase();
  if (normalized === "task" || normalized === "event" || normalized === "note") return normalized;
  return "lead";
}

export function normalizeDraftStatus(value: unknown): AppDraftStatus {
  const normalized = asText(value).toLowerCase();
  if (normalized === "confirmed" || normalized === "converted") return "confirmed";
  if (normalized === "cancelled" || normalized === "archived") return "cancelled";
  if (normalized === "expired") return "expired";
  if (normalized === "failed") return "failed";
  return "pending";
}

export function normalizeAppDraft(input: unknown): AppDraft {
  const row = asObject(input);
  const parsedData = asObject(row.parsedData ?? row.parsed_data ?? row.parsedDraft);

  const createdAt = asText(row.createdAt ?? row.created_at) || new Date().toISOString();
  const updatedAt = asText(row.updatedAt ?? row.updated_at) || createdAt;
  const status = normalizeDraftStatus(row.status);

  return {
    id: asText(row.id) || `app_draft_${Date.now()}`,
    workspaceId: asText(row.workspaceId ?? row.workspace_id),
    userId: asText(row.userId ?? row.user_id) || null,
    type: normalizeType(row.type),
    rawText: status === "pending" ? asText(row.rawText ?? row.raw_text) || null : null,
    parsedData,
    provider: asText(row.provider) || "local",
    status,
    createdAt,
    updatedAt,
    expiresAt: asText(row.expiresAt ?? row.expires_at) || null,
    confirmedAt: asText(row.confirmedAt ?? row.confirmed_at ?? row.convertedAt ?? row.converted_at) || null,
    cancelledAt: asText(row.cancelledAt ?? row.cancelled_at) || null,
  };
}

export function toDraftApiPayload(input: {
  type: AppDraftType;
  rawText: string;
  parsedData?: Record<string, unknown>;
  provider?: string;
  status?: AppDraftStatus;
}) {
  return {
    type: input.type,
    rawText: input.rawText,
    parsedData: input.parsedData || {},
    provider: input.provider || "local",
    status: input.status || "pending",
  };
}

export async function createAppDraft(payload: {
  type: AppDraftType;
  rawText: string;
  parsedData?: Record<string, unknown>;
  provider?: string;
}) {
  const response = await fetch("/api/system?kind=drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toDraftApiPayload(payload)),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(String(data?.error || "DRAFT_CREATE_FAILED"));
  return normalizeAppDraft(data);
}

export async function updateAppDraft(id: string, patch: Partial<Pick<AppDraft, "parsedData" | "expiresAt">>) {
  const response = await fetch("/api/system?kind=drafts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, parsedData: patch.parsedData, expiresAt: patch.expiresAt }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(String(data?.error || "DRAFT_UPDATE_FAILED"));
  return normalizeAppDraft(data);
}

export async function confirmAppDraft(id: string) {
  const response = await fetch("/api/system?kind=drafts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action: "confirm" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(String(data?.error || "DRAFT_CONFIRM_FAILED"));
  return normalizeAppDraft(data?.draft || data);
}

export async function cancelAppDraft(id: string) {
  const response = await fetch("/api/system?kind=drafts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action: "cancel" }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(String(data?.error || "DRAFT_CANCEL_FAILED"));
  return normalizeAppDraft(data?.draft || data);
}
