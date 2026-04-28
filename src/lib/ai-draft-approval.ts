export type AiDraftApprovalType = 'lead' | 'task' | 'event' | 'note';

export type AiDraftApprovalForm = {
  recordType: AiDraftApprovalType;
  title: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  dealValue: string;
  body: string;
  scheduledAt: string;
  endAt: string;
  priority: string;
  leadId: string;
  caseId: string;
  clientId: string;
};

type AiDraftLike = {
  type?: string | null;
  rawText?: string | null;
  parsedDraft?: Record<string, unknown> | null;
  parsedData?: Record<string, unknown> | null;
};

const DEFAULT_SOURCE = 'ai_draft';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function firstText(source: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!source) return '';
  for (const key of keys) {
    const value = asText(source[key]);
    if (value) return value;
  }
  return '';
}

function normalizeForIntent(value: unknown) {
  return asText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function toDateTimeLocal(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function parsePolishDateHint(rawText: string) {
  const normalized = normalizeForIntent(rawText);
  const now = new Date();
  const base = new Date(now);

  if (/\bpojutrze\b/u.test(normalized)) {
    base.setDate(base.getDate() + 2);
  } else if (/\bjutro\b/u.test(normalized)) {
    base.setDate(base.getDate() + 1);
  }

  const isoMatch = rawText.match(/\b(20\d{2})-(\d{2})-(\d{2})(?:[ T](\d{1,2})[:.](\d{2}))?\b/u);
  if (isoMatch) {
    const date = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), Number(isoMatch[4] || 9), Number(isoMatch[5] || 0), 0, 0);
    return Number.isFinite(date.getTime()) ? toDateTimeLocal(date) : '';
  }

  const plDateMatch = rawText.match(/\b(\d{1,2})[./-](\d{1,2})(?:[./-](20\d{2}))?(?:\s*(?:o|godz\.?|godzina)?\s*(\d{1,2})[:.](\d{2}))?\b/u);
  if (plDateMatch) {
    const year = Number(plDateMatch[3] || base.getFullYear());
    const date = new Date(year, Number(plDateMatch[2]) - 1, Number(plDateMatch[1]), Number(plDateMatch[4] || 9), Number(plDateMatch[5] || 0), 0, 0);
    return Number.isFinite(date.getTime()) ? toDateTimeLocal(date) : '';
  }

  const timeMatch = rawText.match(/\b(?:o|godz\.?|godzina)?\s*(\d{1,2})[:.](\d{2})\b/u);
  if (timeMatch && (/\b(jutro|pojutrze|dzis|dziś|dzisiaj)\b/u.test(normalized))) {
    base.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
    return toDateTimeLocal(base);
  }

  if (/\b(jutro|pojutrze)\b/u.test(normalized)) {
    base.setHours(9, 0, 0, 0);
    return toDateTimeLocal(base);
  }

  return '';
}

function detectAiDraftApprovalType(draft: AiDraftLike): AiDraftApprovalType {
  const declared = asText(draft.type);
  if (declared === 'lead' || declared === 'task' || declared === 'event' || declared === 'note') return declared;

  const text = normalizeForIntent(draft.rawText);
  if (/\b(spotkanie|spotkaj|wizyta|rozmowa|call|wideorozmowa|wydarzenie|kalendarz)\b/u.test(text)) return 'event';
  if (/\b(zadanie|task|zrobic|zrobić|wyslac|wysłać|zadzwonic|zadzwonić|oddzwonic|oddzwonić|przypomnij|follow up|follow-up)\b/u.test(text)) return 'task';
  if (/\b(notatka|notatke|notatkę|zanotuj|notuj|dopisz|uwaga)\b/u.test(text)) return 'note';
  return 'lead';
}

function inferTitle(rawText: string, fallback: string) {
  const cleaned = rawText
    .replace(/\b(zapisz|dodaj|utwórz|utworz|stwórz|stworz|mam leada|nowy lead|nowego leada|zadanie|wydarzenie|notatkę|notatke|notatka)\b/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return fallback;
  return cleaned.length > 90 ? `${cleaned.slice(0, 87)}...` : cleaned;
}

export function buildAiDraftApprovalForm(draft: AiDraftLike): AiDraftApprovalForm {
  const parsed = (draft.parsedDraft || draft.parsedData || {}) as Record<string, unknown>;
  const rawText = asText(draft.rawText);
  const recordType = detectAiDraftApprovalType(draft);
  const title = firstText(parsed, ['title', 'name', 'summary']) || inferTitle(rawText, recordType === 'lead' ? 'Nowy lead ze szkicu AI' : 'Nowy rekord ze szkicu AI');
  const scheduledAt = firstText(parsed, ['scheduledAt', 'dueAt', 'date', 'startAt']) || parsePolishDateHint(rawText);
  const start = scheduledAt ? new Date(scheduledAt) : null;
  const fallbackEnd = start && Number.isFinite(start.getTime()) ? toDateTimeLocal(new Date(start.getTime() + 60 * 60_000)) : '';

  return {
    recordType,
    title,
    name: firstText(parsed, ['name', 'clientName', 'contactName']) || (recordType === 'lead' ? title : ''),
    company: firstText(parsed, ['company', 'companyName']),
    email: firstText(parsed, ['email', 'mail']),
    phone: firstText(parsed, ['phone', 'telefon', 'mobile']),
    source: firstText(parsed, ['source']) || DEFAULT_SOURCE,
    dealValue: firstText(parsed, ['dealValue', 'value', 'budget', 'amount']),
    body: firstText(parsed, ['note', 'body', 'description', 'rawText']) || rawText,
    scheduledAt,
    endAt: firstText(parsed, ['endAt']) || fallbackEnd,
    priority: firstText(parsed, ['priority']) || 'medium',
    leadId: firstText(parsed, ['leadId', 'lead_id']),
    caseId: firstText(parsed, ['caseId', 'case_id']),
    clientId: firstText(parsed, ['clientId', 'client_id']),
  };
}

export function normalizeAiDraftApprovalAmount(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = asText(value)
    .replace(/\s+/g, '')
    .replace(/zł|pln/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getAiDraftApprovalTypeLabel(type: AiDraftApprovalType) {
  if (type === 'task') return 'Zadanie';
  if (type === 'event') return 'Wydarzenie';
  if (type === 'note') return 'Notatka';
  return 'Lead';
}

export const AI_DRAFT_APPROVAL_STAGE03_MARKER = 'AI_DRAFT_APPROVAL_TO_FINAL_RECORD_STAGE03';
