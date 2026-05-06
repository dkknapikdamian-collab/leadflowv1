// AI_DRAFT_CONFIRM_BRIDGE_STAGE4
// Converts assistant write-intent output into the shared AI Drafts pipeline.
// This file is intentionally small: assistant may prepare drafts, but only the AI Drafts screen confirms final records.

import type { AiLeadDraft } from "./ai-drafts";

export type AssistantDraftLike = {
  id?: string;
  draftType?: "lead" | "task" | "event" | "note" | "reply_draft";
  title?: string;
  rawText?: string | null;
  status?: string;
  scheduledAt?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  parsedData?: Record<string, unknown> | null;
  warnings?: string[];
  createdAt?: string;
};

export type AiDraftBridgeInput = {
  rawText: string;
  parsedDraft: Record<string, unknown>;
  source: "today_assistant";
  type: "lead" | "task" | "event" | "note";
};

function normalizeType(value: unknown): AiDraftBridgeInput["type"] {
  if (value === "lead" || value === "task" || value === "event" || value === "note") return value;
  if (value === "reply_draft") return "note";
  return "task";
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function assistantDraftToAiLeadDraftInput(draft: AssistantDraftLike): AiDraftBridgeInput {
  const type = normalizeType(draft.draftType || draft.parsedData?.draftType);
  const title = text(draft.title) || text(draft.parsedData?.title) || "Szkic z asystenta AI";
  const rawText = text(draft.rawText) || title;
  const scheduledAt = text(draft.scheduledAt) || text(draft.startAt) || text(draft.parsedData?.scheduledAt) || "";
  const parsedDraft: Record<string, unknown> = {
    ...(draft.parsedData || {}),
    title,
    draftType: type,
    type,
    scheduledAt: scheduledAt || null,
    startAt: text(draft.startAt) || (type === "event" ? scheduledAt || null : null),
    endAt: text(draft.endAt) || null,
    source: "assistant_query",
    provider: "deterministic_application_brain",
    warnings: Array.isArray(draft.warnings) ? draft.warnings : [],
    safety: "draft_requires_user_confirmation",
    rawTextRemovedAfterConfirm: true,
  };

  return {
    rawText,
    parsedDraft,
    source: "today_assistant",
    type,
  };
}

export function mergeAssistantDraftIntoAiLeadDraft(draft: AiLeadDraft, assistantDraft: AssistantDraftLike): AiLeadDraft {
  const bridge = assistantDraftToAiLeadDraftInput(assistantDraft);
  return {
    ...draft,
    type: bridge.type,
    source: "today_assistant",
    parsedDraft: bridge.parsedDraft,
    parsedData: bridge.parsedDraft,
    rawText: bridge.rawText,
  };
}
