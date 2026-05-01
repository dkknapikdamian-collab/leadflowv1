import { getSupabaseAccessToken } from './supabase-auth';

export type LeadNextActionSuggestionInput = {
  lead: Record<string, unknown>;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  activities?: Record<string, unknown>[];
  now?: string;
};

export type LeadNextActionSuggestion = {
  kind: 'task' | 'message' | 'status_check';
  title: string;
  summary: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  dueAt: string;
  suggestedTask: {
    title: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    dueAt: string;
  };
  messageHint: string;
  warnings: string[];
  sourceSummary: string[];
};

export type LeadNextActionSuggestionResponse = {
  ok: boolean;
  scope: 'suggestion_only';
  provider: string;
  noAutoWrite: boolean;
  suggestion: LeadNextActionSuggestion;
};

export async function createLeadNextActionSuggestion(input: LeadNextActionSuggestionInput) {
  const accessToken = await getSupabaseAccessToken();
  const response = await fetch('/api/system?kind=ai-next-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data?.error || 'AI_NEXT_ACTION_FAILED'));
  }

  return data as LeadNextActionSuggestionResponse;
}
