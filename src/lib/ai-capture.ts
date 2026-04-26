import { getClientAuthSnapshot } from './client-auth';

export type QuickAiCaptureLeadDraft = {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  dealValue: number;
};

export type QuickAiCaptureTaskDraft = {
  enabled: boolean;
  title: string;
  type: string;
  dueAt: string;
  priority: string;
};

export type QuickAiCaptureDraft = {
  ok: boolean;
  mode: 'draft_only';
  provider: string;
  rawText: string;
  confidence: number;
  lead: QuickAiCaptureLeadDraft;
  task: QuickAiCaptureTaskDraft;
  warnings: string[];
};

export async function createQuickAiCaptureDraft(text: string) {
  const auth = getClientAuthSnapshot();
  const response = await fetch('/api/system?kind=ai-capture-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.uid,
      'x-user-email': auth.email,
      'x-user-name': auth.fullName,
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data?.error || 'AI_CAPTURE_DRAFT_FAILED'));
  }

  return data as QuickAiCaptureDraft;
}
