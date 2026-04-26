import { getClientAuthSnapshot } from './client-auth';

export type TodayAiAssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'blocked_out_of_scope' | 'unknown';

export type TodayAiAssistantItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
};

export type TodayAiAssistantAnswer = {
  ok: boolean;
  scope: 'assistant_read_or_draft_only';
  provider: string;
  noAutoWrite: boolean;
  intent: TodayAiAssistantIntent;
  title: string;
  summary: string;
  rawText: string;
  items: TodayAiAssistantItem[];
  warnings: string[];
  suggestedCaptureText?: string;
  hardBlock?: boolean;
  allowedScope?: string[];
};

export type TodayAiAssistantInput = {
  rawText: string;
  context: {
    leads?: Record<string, unknown>[];
    tasks?: Record<string, unknown>[];
    events?: Record<string, unknown>[];
    cases?: Record<string, unknown>[];
    now?: string;
  };
};

export async function askTodayAiAssistant(input: TodayAiAssistantInput) {
  const auth = getClientAuthSnapshot();
  const response = await fetch('/api/system?kind=ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.uid,
      'x-user-email': auth.email,
      'x-user-name': auth.fullName,
    },
    body: JSON.stringify({
      ...input,
      now: new Date().toISOString(),
      context: {
        ...input.context,
        now: input.context.now || new Date().toISOString(),
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data?.error || 'AI_ASSISTANT_FAILED'));
  }

  return data as TodayAiAssistantAnswer;
}
