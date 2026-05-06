export type AssistantResultMode = 'read' | 'draft' | 'unknown';

export type AssistantResultShape = {
  mode: AssistantResultMode;
  answer: string;
  items: unknown[];
  draft: Record<string, unknown> | null;
  [key: string]: unknown;
};

function asObject(value: unknown) {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function normalizeAssistantResult(value: unknown): AssistantResultShape {
  const row = asObject(value);
  const modeRaw = typeof row.mode === 'string' ? row.mode : 'unknown';
  const mode: AssistantResultMode = modeRaw === 'read' || modeRaw === 'draft' || modeRaw === 'unknown' ? modeRaw : 'unknown';
  const answer = typeof row.answer === 'string' && row.answer.trim() ? row.answer.trim() : 'Nie znalazłem tego w danych aplikacji.';
  const items = Array.isArray(row.items) ? row.items : [];
  const draft = row.draft && typeof row.draft === 'object' ? (row.draft as Record<string, unknown>) : null;

  return {
    ...row,
    mode,
    answer,
    items,
    draft,
  };
}

export function ensureAssistantReadResult(answer: string) {
  return normalizeAssistantResult({ mode: 'read', answer, items: [], draft: null });
}
