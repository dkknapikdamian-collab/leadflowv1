const ASSISTANT_LEAD_DRAFT_CONTRACT_TITLE = 'Szkic leada zapisany do sprawdzenia';
import { getClientAuthSnapshot } from './client-auth';

export type TodayAiAssistantIntent = 'today_briefing' | 'lead_lookup' | 'lead_capture' | 'global_app_search' | 'blocked_out_of_scope' | 'unknown';

export type TodayAiAssistantItem = {
  label: string;
  detail?: string;
  href?: string;
  priority?: 'low' | 'medium' | 'high';
  entityType?: string;
  id?: string;
};

export type TodayAiAssistantDraft = {
  type: 'lead' | 'task' | 'event' | 'note';
  rawText: string;
  parsedDraft: Record<string, unknown>;
  status: 'draft';
  source: 'assistant_operator';
};

export type TodayAiAssistantAnswer = {
  ok: boolean;
  mode?: 'read' | 'draft';
  answer?: string;
  draft?: TodayAiAssistantDraft | null;
  operatorIntent?: string;
  snapshotMeta?: Record<string, unknown>;
  systemInstruction?: string[];
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
  costGuard?: 'local_rules' | 'external_ai' | 'client_guard';
};

export type TodayAiAssistantInput = {
  rawText: string;
  context: {
    leads?: Record<string, unknown>[];
    tasks?: Record<string, unknown>[];
    events?: Record<string, unknown>[];
    cases?: Record<string, unknown>[];
    clients?: Record<string, unknown>[];
    drafts?: Record<string, unknown>[];
    operatorSnapshot?: Record<string, unknown>;
    summary?: Record<string, unknown>;
    relations?: Record<string, unknown>;
    searchIndex?: Record<string, unknown>[];
    workspaceId?: string | null;
    now?: string;
  };
};

function getContextWorkspaceId(context: TodayAiAssistantInput['context']) {
  const direct = typeof context.workspaceId === 'string' ? context.workspaceId.trim() : '';
  const snapshot = context.operatorSnapshot && typeof context.operatorSnapshot === 'object'
    ? String((context.operatorSnapshot as any).workspaceId || (context.operatorSnapshot as any).workspace_id || '').trim()
    : '';
  return direct || snapshot || '';
}

// AI_APP_CONTEXT_OPERATOR_STAGE26_TYPES: odpowiedź zachowuje stary kontrakt UI i dodaje { mode, answer, items, draft }.
export async function askTodayAiAssistant(input: TodayAiAssistantInput) {
  const auth = getClientAuthSnapshot();
  const workspaceId = getContextWorkspaceId(input.context);
  const response = await fetch('/api/system?kind=ai-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': auth.uid,
      'x-user-email': auth.email,
      'x-user-name': auth.fullName,
      'x-workspace-id': workspaceId,
    },
    body: JSON.stringify({
      rawText: input.rawText,
      now: new Date().toISOString(),
      workspaceId,
      context: {
        ...input.context,
        workspaceId,
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

void ASSISTANT_LEAD_DRAFT_CONTRACT_TITLE;
