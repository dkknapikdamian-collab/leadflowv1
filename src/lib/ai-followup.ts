import { getClientAuthSnapshot } from './client-auth';

export type LeadFollowupDraftInput = {
  lead: Record<string, unknown>;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  goal?: string;
  tone?: string;
  channel?: string;
};

export type LeadFollowupDraft = {
  subject: string;
  message: string;
  channel: string;
  goal: string;
  tone: string;
  copyHint: string;
  warnings: string[];
  sourceSummary: string[];
};

export type LeadFollowupDraftResponse = {
  ok: boolean;
  scope: 'draft_only';
  provider: string;
  noAutoSend: boolean;
  draft: LeadFollowupDraft;
};

export async function createLeadFollowupDraft(input: LeadFollowupDraftInput) {
  const auth = getClientAuthSnapshot();
  const response = await fetch('/api/system?kind=ai-followup-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.uid,
      'x-user-email': auth.email,
      'x-user-name': auth.fullName,
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data?.error || 'AI_FOLLOWUP_DRAFT_FAILED'));
  }

  return data as LeadFollowupDraftResponse;
}
